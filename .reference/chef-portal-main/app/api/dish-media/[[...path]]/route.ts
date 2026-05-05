import { NextRequest, NextResponse } from 'next/server'

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL!

function getRequestCookies(request: NextRequest): string {
  return request.headers.get('cookie') || ''
}

function syncResponseCookies(backendResponse: Response, frontendResponse: NextResponse): void {
  const setCookieHeaders = backendResponse.headers.get('set-cookie')
  if (setCookieHeaders) {
    setCookieHeaders.split(/,(?=\s*\w+=)/).forEach((cookie) => {
      frontendResponse.headers.append('set-cookie', cookie.trim())
    })
  }
}

async function handleRequest(request: NextRequest, method: string) {
  try {
    const url = new URL(request.url)
    // Strip leading 'api' segment: /api/dish-media/... -> dish-media/...
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

    const forwardHeaders = ['authorization', 'user-agent', 'accept', 'accept-language', 'cache-control']
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
        // No body
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
        responseData = typeof parsed === 'string' ? JSON.parse(parsed) : parsed
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

    return frontendResponse
  } catch (error) {
    console.error('[API Proxy dish-media] Error:', error)
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

export async function DELETE(request: NextRequest) {
  return handleRequest(request, 'DELETE')
}
