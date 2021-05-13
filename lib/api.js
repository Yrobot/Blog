const { join } = require('path');
const matter = require('gray-matter');
const marked = require('marked');
var dayjs = require('dayjs');
const { fdir } = require('fdir');

const BASE_PATH = process.cwd();
const BLOG_PATH = '_blogs';

const blogDirectory = join(BASE_PATH, BLOG_PATH);

var filePathTemp;
var allPosts;

function getAllFilePath() {
  if (filePathTemp !== undefined) return filePathTemp;
  filePathTemp = new fdir().withBasePath().crawl(BLOG_PATH).sync();
  return filePathTemp;
}

function getFileMatter(path) {
  const fullPath = join(BASE_PATH, path);
  return matter.read(fullPath);
}

function isMatterDataEmpty(matter = {}) {
  return Object.keys(matter.data || {}).length === 0;
}

function getAllPosts() {
  if (allPosts !== undefined) return allPosts;
  allPosts = getAllFilePath()
    .map((path) => {
      const { data, content } = getFileMatter(path);
      const url =
        '/blog' +
        path
          .slice(BLOG_PATH.length)
          .replace(' ', '-')
          .replace(/\.(md)/g, '')
          .replace('/README', '');
      var createTime = 0;
      if (data.createTime) {
        createTime = dayjs(
          data.createTime,
          ['YYYY年MM月DD日', 'YYYY年MM月D日', 'YYYY年M月DD日', 'YYYY年M月D日'],
          'es',
          true,
        ).valueOf();
      }
      return { path, url, ...data, createTime, length: content.length, content: marked(content) };
    })
    .sort((a, b) => b.createTime - a.createTime);
  return allPosts;
}

function getAllKeywords() {
  var hashMap = {};
  getAllFilePath().forEach((path) => {
    const {
      data: { keywords: keysStr },
    } = getFileMatter(path);
    keysStr.split(',').forEach((key) => {
      hashMap[key] = (hashMap[key] || 0) + 1;
    });
  });
  return Object.entries(hashMap).sort((a, b) => b[1] - a[1]);
}

function getPostByroute(route) {
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
  getAllFilePath,
  getFileMatter,
  isMatterDataEmpty,
  getAllPosts,
  getAllKeywords,
  getPostByroute,
};
