import { NextRequest, NextResponse } from 'next/server'

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL!

function getRequestCookies(request: NextRequest): string {
  const cookieHeader = request.headers.get('cookie')
  return cookieHeader || ''
}

function syncResponseCookies(backendResponse: Response, frontendResponse: NextResponse): void {
  const setCookieHeaders = backendResponse.headers.get('set-cookie')

  if (setCookieHeaders) {
    const cookies = setCookieHeaders.split(/,(?=\s*\w+=)/)

    cookies.forEach((cookie) => {
      frontendResponse.headers.append('set-cookie', cookie.trim())
    })
  }
}

async function handleRequest(request: NextRequest, method: string) {
  try {
    const url = new URL(request.url)
    const pathSegments = url.pathname.split('/').filter(Boolean)
    const backendPath = pathSegments.slice(1).join('/')

    const backendUrl = `${BACKEND_API_URL}/${backendPath}${url.search}`

    const requestCookies = getRequestCookies(request)

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (requestCookies) {
      headers['Cookie'] = requestCookies
    }

    const forwardHeaders = [
      'authorization',
      'user-agent',
      'accept',
      'accept-language',
      'cache-control',
    ]

    forwardHeaders.forEach((headerName) => {
      const value = request.headers.get(headerName)
      if (value) {
        headers[headerName] = value
      }
    })

    let body: string | undefined
    if (method !== 'GET' && method !== 'HEAD') {
      try {
        const requestBody = await request.json()
        body = JSON.stringify(requestBody)
      } catch {
      }
    }

    const backendResponse = await fetch(backendUrl, {
      method,
      headers,
      body,
      credentials: 'include',
    })

    let responseData
    const contentType = backendResponse.headers.get('content-type')

    if (contentType?.includes('application/json')) {
      try {
        const parsed = await backendResponse.json()
        if (typeof parsed === 'string') {
          try {
            responseData = JSON.parse(parsed)
          } catch {
            responseData = parsed
          }
        } else {
          responseData = parsed
        }
      } catch {
        responseData = null
      }
    } else {
      responseData = await backendResponse.text()
    }

    const frontendResponse = NextResponse.json(responseData, {
      status: backendResponse.status,
      statusText: backendResponse.statusText,
    })

    syncResponseCookies(backendResponse, frontendResponse)

    const forwardResponseHeaders = [
      'content-type',
      'cache-control',
      'etag',
      'last-modified',
      'x-ratelimit-limit',
      'x-ratelimit-remaining',
      'x-ratelimit-reset',
    ]

    forwardResponseHeaders.forEach((headerName) => {
      const value = backendResponse.headers.get(headerName)
      if (value) {
        frontendResponse.headers.set(headerName, value || '')
      }
    })

    return frontendResponse
  } catch (error) {
    console.error('[API Proxy] Error:', error)

    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    )
  }
}
export async function GET(request: NextRequest) {
  return handleRequest(request, 'GET')
}

export async function POST(request: NextRequest) {
  return handleRequest(request, 'POST')
}

export async function PUT(request: NextRequest) {
  return handleRequest(request, 'PUT')
}

export async function PATCH(request: NextRequest) {
  return handleRequest(request, 'PATCH')
}

export async function DELETE(request: NextRequest) {
  return handleRequest(request, 'DELETE')
}

export async function HEAD(request: NextRequest) {
  return handleRequest(request, 'HEAD')
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  })
}
