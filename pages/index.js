import Head from 'next/head';

import Menu from 'components/Menu';
import Comment from 'components/Comment';
import Layout from 'components/Layout';
import BlogProgress from 'components/BlogProgress';
import BlogList from 'components/BlogList';
import WelcomeCard from 'components/WelcomeCard';
import GithubList from 'components/GithubList';
import { TransProvider } from 'I18N';
import zh from 'locales/zh-CN.js';
import en from 'locales/en-US.js';

const languages = { zh, en };

export default function Index({ typePosts = [], compeled }) {
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
          <div className='2xl:flex-auto 2xl:mr-50px 2xl:pt-30px'>
            <BlogProgress compeled={compeled} progress={1} />
            <BlogList typePosts={typePosts} />
          </div>
          <div className='2xl:flex-none 2xl:w-580px'>
            <WelcomeCard />
            <GithubList />
            <Comment placeholder='Leave a comment!' />
          </div>
        </div>
      </Layout>
    </TransProvider>
  );
}

export async function getStaticProps() {
  const allPosts = require('lib/api').getAllPosts();

  const compeled = allPosts.length;

  const keywords = require('lib/api')
    .getAllKeywords()
    .filter(([_, num]) => num > 2)
    .map(([key]) => key);

  const hashMap = {};

  allPosts.map((post) => {
    keywords.forEach((key) => {
      if (post.keywords.split(',').includes(key)) {
        hashMap[key] = [...(hashMap[key] || []), post];
      }
    });
  });

  const typePosts = keywords.map((title) => ({
    title,
    list: hashMap[title],
  }));

  typePosts.unshift({
    title: 'All',
    list: allPosts,
  });

  return {
    props: { typePosts, compeled },
  };
}
