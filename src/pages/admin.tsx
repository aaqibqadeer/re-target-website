import { useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '@/hooks/useAuth'
import { AuthGuard } from '@/auth/auth'

export default function Admin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { signIn, loading, error: authError } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const result = await signIn(email, password)
    if (result) {
      router.push('/editor')
    }
  }

  return (
    <AuthGuard requireAuth={false}>
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md'>
          <div>
            <h2 className='text-center text-3xl font-extrabold text-gray-900'>
              Admin Login
            </h2>
          </div>
          <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
            <div className='rounded-md shadow-sm space-y-4'>
              <div>
                <label htmlFor='email' className='sr-only'>
                  Email address
                </label>
                <input
                  id='email'
                  name='email'
                  type='email'
                  required
                  className='appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10'
                  placeholder='Email address'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor='password' className='sr-only'>
                  Password
                </label>
                <input
                  id='password'
                  name='password'
                  type='password'
                  required
                  className='appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10'
                  placeholder='Password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {authError && (
              <div className='text-red-500 text-sm text-center'>
                {authError.toString()}
              </div>
            )}

            <div>
              <button
                type='submit'
                disabled={loading}
                className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400'
              >
                {loading ? 'Signing in...' : 'Login'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AuthGuard>
  )
}
