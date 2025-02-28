import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { ToastProvider } from '@/context/ToastContext'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ToastProvider>
      <Head>
        <title>RE-Target Agent Direct: Available Markets</title>
        <meta
          name='description'
          content='Advertise to REALTORS, Advertise to Real Estate Agents, Market to REALTOS, Market to real estate agents'
        />
        <meta
          name='keywords'
          content='Advertise, REALTORS, Advertise to Real Estate Agents, Market to REALTOS, Market to real estate agents'
        />
      </Head>
      <Component {...pageProps} />
    </ToastProvider>
  )
}
