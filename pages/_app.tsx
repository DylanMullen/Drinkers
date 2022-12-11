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
import { lazy, Suspense, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const Snowfall = lazy(async () => await import("react-snowfall"));

const Navbar = dynamic(() => import("components/shared/navbar"), { ssr: true, suspense: false })

function MyApp({ Component, pageProps }: AppProps)
{
  const [isSnowing, setSnowing] = useState(false)
  useEffect(() =>
  {
    setSnowing(true)
  }, [])

  return (
    <>
      <Head>
        <link rel="icon" type="image/png" sizes="96x96" href="/logo.ico" />
        <Script
          strategy="lazyOnload"
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
        />

        <Script
          id="google-ads"
          async
          crossOrigin='anonymous'
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2974631546161756" />

        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-63461F15RT', {
              page_path: window.location.pathname,
            });
                `}
        </Script>
      </Head>
      <UserProvider>
        <Provider store={store}>
          <NavigationContextProvider>
            <ModalContextProvider>
              {
                isSnowing &&
                <Snowfall
                  speed={[0.5, 1]}
                  wind={[-.5, 0.5]}
                />
              }
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
