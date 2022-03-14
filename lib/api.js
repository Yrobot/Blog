const { join } = require("path");
const matter = require("gray-matter");
const marked = require("marked");
var dayjs = require("dayjs");
var customParseFormat = require("dayjs/plugin/customParseFormat");
const { fdir } = require("fdir");
dayjs.extend(customParseFormat);

marked.setOptions({
  highlight: function (code) {
    return require("highlight.js").highlightAuto(code).value;
  },
});
let catalog = [];
// Override function
const renderer = {
  heading(text, level) {
    const anchor = text.toLowerCase().replace(/ /g, "-");
    catalog.push({
      text,
      level,
      anchor,
    });
    return `<h${level} class="group flex justify-start items-center">${text}<a name="${anchor}" aria-label="Anchor" id="${anchor}" class="inline-flex justify-center items-center w-6 h-6 ml-4 text-base rounded-sm bg-gray/100 decoration-transparent invisible group-hover:visible" href="#${anchor}">#</a></h${level}>`;
  },
};

marked.use({ renderer });

const parseMarkDown = (fileContent) => {
  catalog = [];
  const content = marked.parse(fileContent);
  return {
    catalog: [...catalog],
    content,
  };
};

const BASE_PATH = process.cwd();
const BLOG_PATH = "_blogs";

const blogDirectory = join(BASE_PATH, BLOG_PATH);

var blogPathTemp;
var allPosts;
var allDrafts;

function getAllBlogPath() {
  if (blogPathTemp !== undefined) return blogPathTemp;
  blogPathTemp = new fdir()
    .withBasePath()
    .crawl(BLOG_PATH)
    .sync()
    .filter((path) => path.endsWith(".md"));
  return blogPathTemp;
}

function getFileMatter(path) {
  const fullPath = join(BASE_PATH, path);
  return matter.read(fullPath);
}

function isMatterDataEmpty(matter = {}) {
  return Object.keys(matter.data || {}).length === 0;
}

const getDateValue = (date) =>
  dayjs(
    date,
    ["YYYY年MM月DD日", "YYYY年MM月D日", "YYYY年M月DD日", "YYYY年M月D日"],
    "es",
    true
  ).valueOf();

function transPostData(path) {
  const { data, content: fileContent } = getFileMatter(path);
  const url =
    "/blog" +
    path
      .slice(BLOG_PATH.length)
      .replace(" ", "-")
      .replace(/\.(md)/g, "")
      .replace("/README", "");
  const time = data.updateTime || data.createTime;
  const { content, catalog } = parseMarkDown(fileContent);
  return {
    path,
    url,
    ...data,
    date: time ? getDateValue(time) : 0,
    updateTime: time ? getDateValue(data.updateTime) : 0,
    createTime: time ? getDateValue(data.createTime) : 0,
    length: content.length,
    content,
    catalog,
  };
}

/**
 * @description 获取pages下所有的post，排除Matter中draft有值的post，按时间倒叙排列post
 * @author Yrobot
 * @date 2021-05-26
 * @returns
 */
function getAllPosts() {
  if (allPosts !== undefined) return allPosts;
  allPosts = getAllBlogPath()
    .map(transPostData)
    .filter(({ draft }) => !draft)
    .sort((a, b) => b.date - a.date);
  return allPosts;
}

function getAllDrafts() {
  if (allDrafts !== undefined) return allDrafts;
  allDrafts = getAllBlogPath()
    .map(transPostData)
    .filter(({ draft }) => !!draft);
  return allDrafts;
}

function getAllKeywords() {
  var hashMap = {};
  getAllBlogPath().forEach((path) => {
    const {
      data: { keywords: keysStr },
    } = getFileMatter(path);
    keysStr.split(",").forEach((key) => {
      hashMap[key] = (hashMap[key] || 0) + 1;
    });
  });
  return Object.entries(hashMap).sort((a, b) => b[1] - a[1]);
}

function getPostByRoute(route) {
  const posts = getAllPosts();
  for (let i = 0; i < posts.length; i++) {
    const now = posts[i];
    if (now.url.includes(route))
      return {
        pre: posts[i - 1],
        now,
        next: posts[i + 1],
      };
  }
  return {};
}

module.exports = {
  getAllBlogPath,
  getFileMatter,
  isMatterDataEmpty,
  getAllPosts,
  getAllDrafts,
  getAllKeywords,
  getPostByRoute,
};
