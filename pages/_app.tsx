import { Provider } from 'react-redux'
import '../styles/globals.css'

import store from 'redux/store';
import Script from 'next/script';
import Head from 'next/head';

import ModalContextProvider from 'context/ModalContext'

import { UserProvider } from 'context/UserContext'
import Navbar from 'components/shared/navbar';
import { AppProps } from 'next/app';

function MyApp({ Component, pageProps }:AppProps)
{
  // useEffect(() =>
  // {
  //   var ads = document.getElementsByClassName("adsbygoogle").length;
  //   for (var i = 0; i < ads; i++)
  //   {
  //     try
  //     {
  //       (adsbygoogle = window.adsbygoogle || []).push({});
  //     } catch (e) { }
  //   }
  // }, []);
  return (
    <>
      <Head>
        <link rel="icon" type="image/png" sizes="96x96" href="/logo.ico" />
      </Head>
      <UserProvider>
        <Provider store={store}>
          <ModalContextProvider>
            <Navbar />
            <Component {...pageProps} />
          </ModalContextProvider>
        </Provider>
      </UserProvider>

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
      {/* <Script>
        (adsbygoogle = window.adsbygoogle || []).push({ });
      </Script> */}
    </>


  )
}

export default MyApp
