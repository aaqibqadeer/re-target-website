import { useState } from 'react'
import { useAuth } from './useAuth'
import { REQUEST_URL } from './useFetchFirebaseData'

export const useUpdateData = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { getAuthToken } = useAuth()

  const updateDocument = async (data: any) => {
    setLoading(true)
    setError(null)

    const firestoreData = {
      fields: {
        json: {
          stringValue: JSON.stringify(data),
        },
      },
    }

    try {
      const token = getAuthToken()
      if (!token) {
        throw new Error('Authentication required')
      }

      const response = await fetch(REQUEST_URL, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(firestoreData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update data')
      }

      setLoading(false)
      return { success: true, data: result }
    } catch (err) {
      setLoading(false)
      setError(err instanceof Error ? err.message : 'Unknown error')
      return { success: false, error: err }
    }
  }

  return { updateDocument, loading, error }
}
