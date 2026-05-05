'use server'

import { createServerClient } from '@/lib/supabase/server-client'

export async function loginAction(email: string, password: string) {
  const supabase = await createServerClient()
  const result = await supabase.auth.signInWithPassword({ email, password })

  // Convert Supabase response to plain serializable object
  // The raw AuthError doesn't serialize well across server-client boundary
  if (result.error) {
    return {
      data: { user: null, session: null },
      error: {
        message: result.error.message || "Login failed",
        status: result.error.status,
      },
    }
  }

  return {
    data: result.data,
    error: null,
  }
}

export async function logoutAction() {
  const supabase = await createServerClient()
  return supabase.auth.signOut()
}

export async function updatePasswordAction(password: string) {
  const supabase = await createServerClient()
  return supabase.auth.updateUser({ password })
}

export async function changePasswordAction(
  _oldPassword: string,
  newPassword: string
) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email) {
    return { error: { message: 'User session not found' } }
  }

  // Update to the new password using the existing session
  const { data, error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (updateError) {
    return { error: { message: updateError.message } }
  }

  // Check for weak password warning
  const weakPassword = (data as { weakPassword?: { message?: string; reasons?: string[] } })
    ?.weakPassword
  if (weakPassword?.reasons && weakPassword.reasons.length > 0) {
    return { error: { message: weakPassword.message || 'Password is too weak' } }
  }

  return { error: null }
}

export async function getSessionAction() {
  const supabase = await createServerClient()
  return supabase.auth.getSession()
}

export async function updatePhoneAction(phone: string) {
  const supabase = await createServerClient()
  const { error } = await supabase.auth.updateUser({ phone })
  if (error) return { error: { message: error.message } }
  return { error: null }
}

export async function verifyPhoneOtpAction(phone: string, token: string) {
  const supabase = await createServerClient()
  const { error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: 'phone_change',
  })
  if (error) return { error: { message: error.message } }
  return { error: null }
}

export async function refreshSessionAction() {
  const supabase = await createServerClient()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) {
    return { success: false }
  }
  return { success: true }
}
