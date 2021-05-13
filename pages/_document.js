import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel='icon' href='/favicon.ico' />
          <link
            rel='preload'
            href='//at.alicdn.com/t/font_2533274_yhzuq4j0hfr.woff2'
            as='font'
            type='font/woff2'
            crossOrigin='anonymous'
          />
          <link rel='stylesheet' href='//at.alicdn.com/t/font_2533274_yhzuq4j0hfr.css' />
          <script async src='https://www.googletagmanager.com/gtag/js?id=G-1DXREC8Y53'></script>
          <script
            dangerouslySetInnerHTML={{
              __html: `
              window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments)}
              gtag('js', new Date()); gtag('config', 'G-1DXREC8Y53');
            `,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
