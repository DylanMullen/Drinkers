import { Provider } from 'react-redux'
import '../styles/globals.css'

import store from 'redux/store';
import Script from 'next/script';
import Head from 'next/head';

import ModalContextProvider from 'context/ModalContext'

import { UserProvider } from 'context/UserContext'
// import Navbar from '';
import { AppProps } from 'next/app';
import { NavigationContextProvider } from 'context/NavigationContext';
// import Snowfall from 'react-snowfall';
import { Suspense, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import * as gtag from "utils/gtag"

const Navbar = dynamic(() => import("components/shared/navbar"), { ssr: true, suspense: false })

function MyApp({ Component, pageProps }: AppProps)
{

  const router = useRouter()
  useEffect(() =>
  {
    const handleRouteChange = (url: string) =>
    {
      gtag.pageview(url)
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () =>
    {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  return (
    <>
      <Head>
        <link rel="icon" type="image/png" sizes="96x96" href="/logo.ico" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gtag.GA_TRACKING_ID}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </Head>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
      />
      <UserProvider>
        <Provider store={store}>
          <NavigationContextProvider>
            <ModalContextProvider>
              <Suspense fallback="">
                <Navbar />
              </Suspense>
              <div className="wrapper">
                <Component {...pageProps} />
              </div>
            </ModalContextProvider>
          </NavigationContextProvider>
        </Provider>
      </UserProvider>

    </>


  )
}

export default MyApp
