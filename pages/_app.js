import { Provider } from 'react-redux'
import '../styles/globals.css'

import store from 'redux/store';
import Script from 'next/script';
import Head from 'next/head';

function MyApp({ Component, pageProps })
{
  return (
    <>
      <Head>
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
      </Head>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>

      <Script
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
      />

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
    </>


  )
}

export default MyApp
