import { useRouter } from 'next/router'
import { useEffect, Fragment } from 'react'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
}

export const AuthGuard = ({ children, requireAuth = true }: AuthGuardProps) => {
  const router = useRouter()

  useEffect(() => {
    const authToken = localStorage.getItem('authToken')
    const isAuthenticated = !!authToken

    if (requireAuth && !isAuthenticated) {
      router.push('/admin')
    } else if (!requireAuth && isAuthenticated) {
      router.push('/editor')
    }
  }, [router, requireAuth])

  return <>{children}</>
}
