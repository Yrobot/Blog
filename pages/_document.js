import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel='icon' href='favicon.ico' />
          <link
            rel='preload'
            href='//at.alicdn.com/t/font_2533274_yhzuq4j0hfr.woff2'
            as='font'
            type='font/woff2'
            crossorigin='anonymous'
          />
          <link rel='stylesheet' href='//at.alicdn.com/t/font_2533274_yhzuq4j0hfr.css' />
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
