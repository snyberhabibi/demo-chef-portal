import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server-client'
import { authService } from '@/services/auth.service'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const token = requestUrl.searchParams.get('token')
  const type = requestUrl.searchParams.get('type')
  const errorParam = requestUrl.searchParams.get('error')
  const redirectTo = requestUrl.searchParams.get('redirect_to')

  const supabase = await createServerClient()

  if (errorParam) {
    const errorUrl = redirectTo 
      ? new URL(redirectTo, requestUrl.origin)
      : new URL('/auth/login', requestUrl.origin)
    errorUrl.searchParams.set('error', errorParam)
    return NextResponse.redirect(errorUrl.toString())
  }

  if (token && type) {
    try {
      const verifyParams: { token_hash: string; type: string } = {
        token_hash: token,
        type: type,
      }

      const { data, error } = await supabase.auth.verifyOtp(
        verifyParams as Parameters<typeof supabase.auth.verifyOtp>[0]
      )

      if (error) {
        const errorUrl = redirectTo 
          ? new URL(redirectTo, requestUrl.origin)
          : new URL('/auth/login', requestUrl.origin)
        errorUrl.searchParams.set('error', error.message || 'Magic link verification failed')
        return NextResponse.redirect(errorUrl.toString())
      }

      if (!data.user) {
        const errorUrl = redirectTo 
          ? new URL(redirectTo, requestUrl.origin)
          : new URL('/auth/login', requestUrl.origin)
        errorUrl.searchParams.set('error', 'No user found after token verification')
        return NextResponse.redirect(errorUrl.toString())
      }

      // Fetch and validate Payload user data
      const payloadUser = await authService.getPayloadUser(request)
      const validation = authService.validateChefUser(payloadUser)

      if (!validation.valid) {
        await supabase.auth.signOut()
        const errorUrl = new URL('/auth/login', requestUrl.origin)
        errorUrl.searchParams.set('error', validation.error || 'Authentication failed')
        return NextResponse.redirect(errorUrl.toString())
      }

      const finalRedirect = redirectTo 
        ? new URL(redirectTo, requestUrl.origin).toString()
        : '/dashboard'
      
      return NextResponse.redirect(finalRedirect)
    } catch (error) {
      const errorUrl = redirectTo 
        ? new URL(redirectTo, requestUrl.origin)
        : new URL('/auth/login', requestUrl.origin)
      errorUrl.searchParams.set('error', error instanceof Error ? error.message : 'Magic link verification failed')
      return NextResponse.redirect(errorUrl.toString())
    }
  }

  if (!code) {
    const errorUrl = redirectTo 
      ? new URL(redirectTo, requestUrl.origin)
      : new URL('/auth/login', requestUrl.origin)
    errorUrl.searchParams.set('error', 'No authorization code or token provided')
    return NextResponse.redirect(errorUrl.toString())
  }

  try {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      const errorUrl = redirectTo 
        ? new URL(redirectTo, requestUrl.origin)
        : new URL('/auth/login', requestUrl.origin)
      errorUrl.searchParams.set('error', error.message)
      return NextResponse.redirect(errorUrl.toString())
    }

    if (!data.session?.user) {
      const errorUrl = redirectTo 
        ? new URL(redirectTo, requestUrl.origin)
        : new URL('/auth/login', requestUrl.origin)
      errorUrl.searchParams.set('error', 'No session established')
      return NextResponse.redirect(errorUrl.toString())
    }

    // Fetch and validate Payload user data
    const payloadUser = await authService.getPayloadUser(request)
    const validation = authService.validateChefUser(payloadUser)

    if (!validation.valid) {
      await supabase.auth.signOut()
      const errorUrl = new URL('/auth/login', requestUrl.origin)
      errorUrl.searchParams.set('error', validation.error || 'Authentication failed')
      return NextResponse.redirect(errorUrl.toString())
    }

    const finalRedirect = redirectTo 
      ? new URL(redirectTo, requestUrl.origin).toString()
      : '/dashboard'
    
    return NextResponse.redirect(finalRedirect)
  } catch (error) {
    const errorMessage = error instanceof Error
      ? error.message
      : 'Authentication failed. Please try again.'
    
    const errorUrl = redirectTo 
      ? new URL(redirectTo, requestUrl.origin)
      : new URL('/auth/login', requestUrl.origin)
    errorUrl.searchParams.set('error', errorMessage)
    return NextResponse.redirect(errorUrl.toString())
  }
}
