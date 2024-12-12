const { Feed } = require("@yrobot/feed");
const { writeFileSync } = require("node:fs");
const { join } = require("node:path");
const { getAllPosts, catalogToStr } = require("../api");
const config = require("../config");

const BASE_URL = config.baseUrl;

const PROJECT_PATH = join(__dirname, "../../");

const author = {
  name: "Yrobot",
  email: "yrobot@yrobot.top",
  link: BASE_URL,
};

function generateRSS() {
  try {
    console.log("generating blog feed...");
    const feed = new Feed({
      title: "Yrobot's Blog",
      description: "Yrobot's blog. technology and life",
      id: BASE_URL,
      link: BASE_URL,
      // language: "en",
      image: `${BASE_URL}/favicon.png`,
      favicon: `${BASE_URL}/favicon.ico`,
      generator: `Feed for ${BASE_URL}`,
      copyright: `All rights reserved ${new Date().getFullYear()}, ${
        author.name
      }`,
      feedLinks: {
        rss: `${BASE_URL}${config.rss.feed}`,
        // json: `${BASE_URL}${config.rss.json}`,
        // atom: `${BASE_URL}${config.rss.atom}`,
      },
      author,
    });

    const posts = getAllPosts();

    // don't add posts to rss feed: preview posts, posts that starts with _folder
    posts.forEach((post) => {
      try {
        const postURL = `${BASE_URL}${post.url}`;

        // const description = catalogToStr(post.catalog);

        // const category = post.url?.split("/")?.[2];
        // if (category) feed.addCategory(category);

        feed.addItem({
          title: post.title,
          id: postURL,
          link: postURL,
          // description: description,
          content: post.content,
          author: [author],
          date: new Date(post.date),
          image: `${BASE_URL}/favicon.svg`,
        });
      } catch (e) {
        console.error("Error: ", e);
      }
    });

    const authTag = `
    <follow_challenge>
        <feedId>89219616418146304</feedId>
        <userId>83159693539991552</userId>
    </follow_challenge>
    `;

    writeFileSync(
      `${PROJECT_PATH}/public${config.rss.feed}`,
      feed.rss2().replace("</channel>", `${authTag}</channel>`)
    );
    // writeFileSync(`${PROJECT_PATH}/public${config.rss.atom}`, feed.atom1());
    // writeFileSync(`${PROJECT_PATH}/public${config.rss.json}`, feed.json1());
    console.log("feed generated");
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

generateRSS();
