import Head from "next/head";

import NotFound from "components/NotFound";
import Menu from "components/Menu";
import Layout from "components/Layout";
import { TransProvider } from "I18N";
import zh from "locales/zh-CN.js";
import en from "locales/en-US.js";

const languages = { zh, en };

export default function Index({}) {
  return (
    <TransProvider data={languages}>
      <Layout>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"
          />
          <meta
            name="keywords"
            content="yrobot,blog,博客,github,js,css,html,技术,404"
          ></meta>
          <meta
            name="description"
            content="yrobot的博客，纪录技术和生活。404页面"
          ></meta>
          <title>Yrobot's Blog</title>
        </Head>
        <Menu home />
        <div className="min-w-0 flex-auto pt-0 flex flex-col items-center justify-center h-[calc(100vh-140px)]">
          <NotFound />
        </div>
      </Layout>
    </TransProvider>
  );
}
