import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'

interface AuthRequest {
  email: string
  password: string
}

interface RefreshRequest {
  refresh_token: string
}

interface AuthResponse {
  idToken: string
  email: string
  refreshToken: string
  expiresIn: string
  localId: string
  registered?: boolean
}

interface RefreshResponse {
  access_token: string
  expires_in: string
  token_type: string
  refresh_token: string
  id_token: string
  user_id: string
  project_id: string
}

interface AuthState {
  loading: boolean
  error: Error | string | null
  isAuthenticated: boolean
}

// Token will be refreshed 5 minutes before expiration
const REFRESH_TIME_MARGIN = 5 * 60 * 1000

// Use our secure serverless API endpoints
const AUTH_URL = '/api/auth/login'
const REFRESH_URL = '/api/auth/refresh'

export const useAuth = () => {
  const router = useRouter()
  const [state, setState] = useState<AuthState>({
    loading: false,
    error: null,
    isAuthenticated: false,
  })

  const [refreshTimerId, setRefreshTimerId] = useState<NodeJS.Timeout | null>(
    null,
  )

  // Check if user is already authenticated on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken')
    const refreshToken = localStorage.getItem('refreshToken')
    const expiration = localStorage.getItem('tokenExpiration')

    if (token && refreshToken) {
      setState((prev) => ({ ...prev, isAuthenticated: true }))

      // If expiration exists, setup refresh timer
      if (expiration) {
        const expiresAt = parseInt(expiration)
        const now = Date.now()

        if (expiresAt > now) {
          // Schedule refresh before token expires
          setupRefreshTimer(refreshToken, expiresAt)
        } else {
          // Token already expired, refresh immediately
          refreshAuthToken(refreshToken)
        }
      }
    }
  }, [])

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (refreshTimerId) {
        clearTimeout(refreshTimerId)
      }
    }
  }, [refreshTimerId])

  const setupRefreshTimer = useCallback(
    (refreshToken: string, expiresAt: number) => {
      // Clear any existing timer
      if (refreshTimerId) {
        clearTimeout(refreshTimerId)
      }

      const now = Date.now()
      const timeUntilRefresh = expiresAt - now - REFRESH_TIME_MARGIN

      // Refresh 5 minutes before expiration or immediately if less than 5 minutes left
      const timerId = setTimeout(() => {
        refreshAuthToken(refreshToken)
      }, Math.max(0, timeUntilRefresh))

      setRefreshTimerId(timerId)
    },
    [refreshTimerId],
  )

  const refreshAuthToken = async (refreshToken: string) => {
    try {
      const response = await fetch(REFRESH_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh_token: refreshToken,
        } as RefreshRequest),
      })

      const data = (await response.json()) as RefreshResponse

      if (!response.ok) {
        throw new Error((data as any).error?.message || 'Token refresh failed')
      }

      // Update stored tokens
      localStorage.setItem('authToken', data.id_token)
      localStorage.setItem('refreshToken', data.refresh_token)

      // Calculate and store new expiration time
      const expiresIn = parseInt(data.expires_in) * 1000 // Convert to milliseconds
      const expiresAt = Date.now() + expiresIn
      localStorage.setItem('tokenExpiration', expiresAt.toString())

      // Setup next refresh
      setupRefreshTimer(data.refresh_token, expiresAt)

      return data.id_token
    } catch (err) {
      console.error('Error refreshing token:', err)
      // If refresh fails, force logout
      logout()
      return null
    }
  }

  const signIn = async (email: string, password: string) => {
    setState({ ...state, loading: true, error: null })

    try {
      const response = await fetch(AUTH_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        } as AuthRequest),
      })

      const data = (await response.json()) as AuthResponse

      if (!response.ok) {
        throw new Error(data.error?.message || 'Authentication failed')
      }

      // Store tokens and expiration
      localStorage.setItem('authToken', data.idToken)
      localStorage.setItem('refreshToken', data.refreshToken)

      // Calculate expiration time (Firebase returns expiresIn in seconds)
      const expiresIn = parseInt(data.expiresIn) * 1000 // Convert to milliseconds
      const expiresAt = Date.now() + expiresIn
      localStorage.setItem('tokenExpiration', expiresAt.toString())

      // Set up refresh timer
      setupRefreshTimer(data.refreshToken, expiresAt)

      // Update authenticated state
      setState((prev) => ({ ...prev, isAuthenticated: true }))

      return data
    } catch (err) {
      setState({
        ...state,
        loading: false,
        error: err instanceof Error ? err.message : 'Authentication failed',
        isAuthenticated: false,
      })
      return null
    } finally {
      setState((prev) => ({ ...prev, loading: false }))
    }
  }

  const logout = () => {
    // Clear stored auth data
    localStorage.removeItem('authToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('tokenExpiration')

    // Clear any refresh timer
    if (refreshTimerId) {
      clearTimeout(refreshTimerId)
      setRefreshTimerId(null)
    }

    // Update authentication state
    setState({
      loading: false,
      error: null,
      isAuthenticated: false,
    })

    // Redirect to login
    router.push('/admin')
  }

  // Function to get the current auth token (useful for API calls)
  const getAuthToken = () => {
    return localStorage.getItem('authToken')
  }

  return {
    ...state,
    signIn,
    logout,
    getAuthToken,
  }
}
