import { useCallback, useState } from 'react'
import axios from 'axios'
import { MarketCategory } from '@/lib/data'

const BASE_URL = 'https://firestore.googleapis.com/v1beta1'
const PROJECT_ID = 're-target-marketing'
const DOCUMENT_ID = 'NTjopMDfi1wKhBWzJnof'
const PATH = `/projects/${PROJECT_ID}/databases/(default)/documents/market-list/${DOCUMENT_ID}`
export const REQUEST_URL = `${BASE_URL}${PATH}`

const useFetchFirebaseData = () => {
  const [data, setData] = useState<MarketCategory[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(REQUEST_URL)
      const responseObject = JSON.parse(
        response?.data?.fields?.json?.stringValue,
      )
      setData(responseObject)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  return { fetchData, data, loading, error }
}

export default useFetchFirebaseData
