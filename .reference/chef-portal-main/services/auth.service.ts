import { NextRequest } from 'next/server'
import { type ApiResponse, http } from "@/lib/http-client";
import { endpoints } from '@/config/endpoints'
import { logoutAction } from "@/actions/auth";
import type {
  MeResponse,
  User,
} from '@/types/auth.types'

class AuthService {
  async getCurrentUser(request?: NextRequest): Promise<ApiResponse<MeResponse>> {
    if (request) {
      const meEndpoint = endpoints.auth.me
      
      try {
        const meResponse = await fetch(meEndpoint, {
          method: 'GET',
          headers: {
            'Cookie': request.headers.get('cookie') || '',
          },
          credentials: 'include',
        })

        if (!meResponse.ok) {
          return {
            data: {
              success: false,
              user: null,
            },
            status: meResponse.status,
          }
        }

        const meData: MeResponse = await meResponse.json()
        return {
          data: meData,
          status: 200,
        }
      } catch (error) {
        console.error('Failed to fetch Payload user:', error)
        return {
          data: {
            success: false,
            user: null,
          },
          status: 500,
        }
      }
    }

    return http.get<MeResponse>(endpoints.auth.me);
  }

  async getPayloadUser(request: NextRequest): Promise<User | null> {
    const response = await this.getCurrentUser(request);
    
    if (!response.data.success || !response.data.user) {
      return null;
    }

    return response.data.user;
  }

  async logout(): Promise<void> {
    const { error } = await logoutAction()
    if (error) {
      console.error('Logout failed:', error.message)
    }
  }

  validateChefUser(user: User | null): { valid: boolean; error?: string } {
    if (!user) {
      return { valid: false, error: 'Failed to get user information' }
    }

    if (user.role !== 'chef') {
      return { valid: false, error: 'Unauthorized. Only chefs can access this portal.' }
    }

    if (user.status && user.status !== 'active') {
      return { valid: false, error: 'Account is not active, please contact support' }
    }

    return { valid: true }
  }
}

export const authService = new AuthService()
