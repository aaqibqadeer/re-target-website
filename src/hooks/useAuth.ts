import { useState } from 'react'

interface AuthRequest {
  email: string
  password: string
  returnSecureToken?: boolean
}

interface AuthResponse {
  idToken: string
  email: string
  refreshToken: string
  expiresIn: string
  localId: string
  registered?: boolean
}

interface AuthState {
  loading: boolean
  error: Error | string | null
}

const API_KEY = 'AIzaSyAxatIcgqwbrsFZLT2IhKgzJ2YajENAUQw'
const AUTH_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    loading: false,
    error: null,
  })

  const signIn = async (email: string, password: string) => {
    setState({ loading: true, error: null })

    try {
      const response = await fetch(AUTH_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        } as AuthRequest),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error?.message || 'Authentication failed')
      }

      return data as AuthResponse
    } catch (err) {
      setState({
        ...state,
        loading: false,
        error: err instanceof Error ? err.message : 'Authentication failed',
      })
      return null
    } finally {
      setState({ ...state, loading: false })
    }
  }

  return {
    ...state,
    signIn,
  }
}
