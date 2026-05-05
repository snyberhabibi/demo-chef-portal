import { NextRequest, NextResponse } from 'next/server'

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL!

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
    // /api/chef-media/... → chef-media/...
    const pathSegments = url.pathname.split('/').filter(Boolean)
    const backendPath = pathSegments.slice(1).join('/')

    const backendUrl = `${BACKEND_API_URL}/${backendPath}${url.search}`

    const headers: HeadersInit = {}

    // Forward cookies
    const cookies = request.headers.get('cookie')
    if (cookies) {
      headers['Cookie'] = cookies
    }

    // Forward standard headers
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

    // Handle request body based on content type
    let body: BodyInit | undefined
    if (method !== 'GET' && method !== 'HEAD') {
      const contentType = request.headers.get('content-type') || ''

      if (contentType.includes('multipart/form-data')) {
        // Forward multipart form data as raw bytes (preserves boundary)
        body = await request.arrayBuffer()
        headers['Content-Type'] = contentType
      } else {
        // Forward JSON body
        headers['Content-Type'] = 'application/json'
        try {
          const requestBody = await request.json()
          body = JSON.stringify(requestBody)
        } catch {
        }
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

    return frontendResponse
  } catch (error) {
    console.error('[Chef Media Proxy] Error:', error)

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

export async function PATCH(request: NextRequest) {
  return handleRequest(request, 'PATCH')
}

export async function DELETE(request: NextRequest) {
  return handleRequest(request, 'DELETE')
}
