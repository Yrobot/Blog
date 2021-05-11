import dayjs from 'dayjs';
import Head from 'next/head';

import Menu from 'components/Menu';
import Comment from 'components/Comment';
import Layout from 'components/Layout';
import BlogProgress from 'components/BlogProgress';
import { TransProvider } from 'I18N';
import { getAllPosts } from 'lib/api';
import zh from 'locales/zh-CN.js';
import en from 'locales/en-US.js';

const languages = { zh, en };

export default function Index({ allPosts = [] }) {
  return (
    <TransProvider data={languages}>
      <Layout>
        <Head>
          <meta
            name='viewport'
            content='width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no'
          />
          <title>Yrobot's Blog</title>
        </Head>
        <Menu home />
        <div className='flex-auto 2xl:flex flex-row items-start justify-between'>
          <div className='2xl:flex-auto 2xl:mr-50px'>
            <BlogProgress compeled={allPosts.length} progress={1} />
          </div>
          <div className='card h-600px 2xl:flex-none 2xl:w-580px'></div>
        </div>
      </Layout>
    </TransProvider>
  );
}

export async function getStaticProps() {
  const allPosts = getAllPosts();

  return {
    props: { allPosts },
  };
}
