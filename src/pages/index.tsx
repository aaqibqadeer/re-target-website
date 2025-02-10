import { GeneralMarketTable } from '@/components/GeneralMarketTable'
import { Header } from '@/components/Header'
import { Spinner } from '@/components/Spinner'
import useFetchFirebaseData from '@/hooks/useFetchFirebaseData'
import Head from 'next/head'
import { useEffect, Fragment, useRef } from 'react'

export default function Home() {
  const { fetchData, data, error, loading } = useFetchFirebaseData()
  const pageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <Fragment>
      <Head>
        <title>RE-Target Agent Direct: Available Markets</title>
      </Head>
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
          <div className='container mx-auto p-4' ref={pageRef}>
            {data.map((market, index) => {
              return (
                <GeneralMarketTable data={market} key={market.name + index} />
              )
            })}
          </div>
        )}
      </main>
    </Fragment>
  )
}
