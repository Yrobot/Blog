import Head from "next/head";

import Menu from "components/Menu";
import Comment from "components/Comment";
import Layout from "components/Layout";
import BlogBottomLink from "components/BlogBottomLink";
import BlogContent from "components/BlogContent";
import BlogCatalog from "components/BlogCatalog";
import WelcomeCard from "components/WelcomeCard";
import GithubList from "components/GithubList";
import { TransProvider } from "I18N";
import zh from "locales/zh-CN.js";
import en from "locales/en-US.js";

import "highlight.js/styles/night-owl.css";
// import 'highlight.js/styles/hybrid.css';
// import 'highlight.js/styles/androidstudio.css';
// import 'highlight.js/styles/rainbow.css';

const languages = { zh, en };

export default function Index({ pre, blog, next }) {
  return (
    <TransProvider data={languages}>
      <Layout className="xl:space-x-space">
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"
          />
          <meta
            name="keywords"
            content={`yrobot,blog,博客,${blog.keywords}`}
          ></meta>
          <meta name="description" content={blog.title}></meta>
          <title>{blog.title}</title>
        </Head>
        <Menu home />
        <div className="min-w-0 flex-row items-stretch justify-between xl:flex xl:space-x-space">
          <div className="min-w-0">
            <a href="" id="TOP" />
            <BlogContent blog={blog} />
            <BlogBottomLink pre={pre} next={next} />
            <Comment placeholder="Leave a comment!" />
          </div>
          <div className="flex-none space-y-space xl:w-[350px]">
            {/* <WelcomeCard /> */}
            <GithubList />
            <div className="card sticky top-space hidden max-h-[calc(100vh-var(--space)*2)] overflow-y-auto p-4 xl:block">
              <BlogCatalog catalog={blog.catalog} />
            </div>
          </div>
        </div>
      </Layout>
    </TransProvider>
  );
}

export async function getStaticProps({ params }) {
  const { path = [] } = params || {};

  const route = path.join("/");
  const {
    pre = null,
    now: blog = null,
    next = null,
  } = require("lib/api").getPostByRoute(route);

  return {
    props: { pre, blog, next },
  };
}

export async function getStaticPaths() {
  const paths = require("lib/api")
    .getAllPosts()
    .map(({ url }) => url);
  return {
    paths,
    fallback: false,
  };
}
