import { Html, Head, Main, NextScript } from 'next/document'
import * as gtag from "utils/gtag"

export default function Document()
{
    return (
        <Html lang='en'>
            <Head>
                <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6856245529744753"
                    crossOrigin="anonymous"></script>
                <meta name="monetag" content="26da22f7f7edc01b12e4feb789dbfff2"></meta>
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}
