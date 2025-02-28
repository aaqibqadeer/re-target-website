import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth: boolean
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireAuth,
}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken')
      const refreshToken = localStorage.getItem('refreshToken')
      const isAuth = !!(token && refreshToken)
      setIsAuthenticated(isAuth)

      if (requireAuth && !isAuth) {
        // Redirect to login if authentication is required but user is not authenticated
        router.push('/admin')
      } else if (!requireAuth && isAuth && router.pathname === '/admin') {
        // Redirect to editor if already authenticated and on login page
        router.push('/editor')
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [requireAuth, router])

  if (isLoading) {
    // Show loading state
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
      </div>
    )
  }

  // If authentication requirement is met, render children
  if ((requireAuth && isAuthenticated) || !requireAuth) {
    return <>{children}</>
  }

  // This shouldn't be visible as router.push should redirect,
  // but including as fallback
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <p>Redirecting...</p>
    </div>
  )
}
