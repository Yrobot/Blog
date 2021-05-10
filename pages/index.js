import dayjs from 'dayjs';
import Head from 'next/head';

import Comment from 'components/Comment';
import Container from 'components/container';
import MoreStories from 'components/more-stories';
import HeroPost from 'components/hero-post';
import Intro from 'components/intro';
import Layout from 'components/layout';
import { getAllPosts } from 'lib/api';
import { CMS_NAME } from '../lib/constants';

export default function Index({ allPosts = [] }) {
  const [heroPost, ...morePosts] = allPosts;
  return (
    <>
      <Layout>
        <Head>
          <title>Next.js Blog Example with {CMS_NAME}</title>
        </Head>
        <Container>
          <img
            src='https://github-readme-stats.vercel.app/api?username=Yrobot&count_private=true&show_icons=true&title_color=000000&icon_color=000000&text_color=000000&border_color=F5F5F7&bg_color=F5F5F7'
            alt=''
            style={{
              width: 600,
            }}
          />
          <img
            src='https://github-readme-stats.vercel.app/api?username=Yrobot&count_private=true&show_icons=true&title_color=000000&icon_color=000000&text_color=000000&border_color=F5F5F7&bg_color=F5F5F7&card_width=580'
            alt=''
            // style={{
            //   width: 500,
            // }}
          />
          <img
            src='https://github-readme-stats.vercel.app/api/pin/?username=Yrobot&repo=mina-touch&title_color=000000&icon_color=000000&text_color=000000&border_color=F5F5F7&bg_color=F4F4F5'
            alt=''
            style={{
              width: 600,
            }}
          />
          <img
            src='https://github-readme-stats.vercel.app/api/pin/?username=Yrobot&repo=react-mobile-table&title_color=000000&icon_color=000000&text_color=000000&border_color=F5F5F7&bg_color=F4F4F5'
            alt=''
            // style={{
            //   width: 500,
            // }}
          />
          <img
            src='https://github-readme-stats.vercel.app/api/top-langs/?username=yrobot&card_width=500&title_color=000000&icon_color=000000&text_color=000000&border_color=F4F4F5&bg_color=F4F4F5&layout=compact'
            alt=''
            // style={{
            //   width: 500,
            // }}
          />
          <img
            src='https://github-readme-stats.vercel.app/api/wakatime?username=willianrod&title_color=000000&icon_color=000000&text_color=000000&border_color=F4F4F5&bg_color=F4F4F5&layout=compact'
            alt=''
            // style={{
            //   width: 500,
            // }}
          />
          <Intro />
          {heroPost && (
            <HeroPost
              title={heroPost.title}
              coverImage={heroPost.coverImage}
              date={heroPost.date}
              author={heroPost.author}
              slug={heroPost.slug}
              excerpt={heroPost.excerpt}
            />
          )}
          {morePosts.length > 0 && <MoreStories posts={morePosts} />}
          <Comment />
        </Container>
      </Layout>
    </>
  );
}

export async function getStaticProps() {
  const allPosts = getAllPosts().map(({ createTime, path, content, author, ...res }) => ({
    ...res,
    author: {
      name: author,
      picture: '/assets/author.jpeg',
    },
    slug: path,
    date: dayjs(createTime).format(),
    excerpt: content.slice(0, 60),
    coverImage: '/assets/cover.jpg',
  }));

  console.log(allPosts[0].date);

  return {
    props: { allPosts },
  };
}
