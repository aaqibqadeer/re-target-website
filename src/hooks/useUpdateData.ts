import { useState } from 'react'
import { REQUEST_URL } from './useFetchFirebaseData'

interface FirestoreState {
  loading: boolean
  error: Error | null
}

interface useUpdateDataReturn {
  updateDocument: (data: any) => Promise<void>
  loading: boolean
  error: Error | null
}

export const useUpdateData = (): useUpdateDataReturn => {
  const [state, setState] = useState<FirestoreState>({
    loading: false,
    error: null,
  })

  const updateDocument = async (data: any) => {
    setState({ loading: true, error: null })

    const firestoreData = {
      fields: {
        json: {
          stringValue: JSON.stringify(data),
        },
      },
    }

    try {
      const idToken = localStorage.getItem('authToken')
      if (!idToken) throw new Error('No auth token found')

      const response = await fetch(REQUEST_URL, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(firestoreData),
      })

      if (!response.ok) {
        throw new Error(`Firestore update failed: ${response.statusText}`)
      }

      setState({ loading: false, error: null })
    } catch (error) {
      setState({
        loading: false,
        error:
          error instanceof Error ? error : new Error('Unknown error occurred'),
      })
    }
  }

  return {
    updateDocument,
    loading: state.loading,
    error: state.error,
  }
}
