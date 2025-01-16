import { CaliforniaAssociationsTable } from '@/components/CaliforniaAssociationsTable'
import { GeneralMarketTable } from '@/components/GeneralMarketTable'
import { Header } from '@/components/Header'
import { Spinner } from '@/components/Spinner'
import useFetchFirebaseData from '@/hooks/useFetchFirebaseData'
import { useEffect, Fragment } from 'react'

export default function Home() {
  const { fetchData, data, error, loading } = useFetchFirebaseData()

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <Fragment>
      <Header />
      <main>
        {loading && <Spinner />}
        {error && (
          <div className='container mx-auto p-4 text-4xl'>
            {' '}
            No Data Available
          </div>
        )}
        {!error && !loading && data?.length > 0 && (
          <div className='container mx-auto p-4'>
            <GeneralMarketTable data={data[0]} />
            <div className='my-16' />
            <CaliforniaAssociationsTable data={data[1]} />
          </div>
        )}
      </main>
    </Fragment>
  )
}
