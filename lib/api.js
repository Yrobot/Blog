const { join } = require('path');
const matter = require('gray-matter');
const { fdir } = require('fdir');

const BASE_PATH = process.cwd();
const BLOG_PATH = '_blogs';

const blogDirectory = join(BASE_PATH, BLOG_PATH);

var FilePathTemp;

function getAllFilePath() {
  if (FilePathTemp !== undefined) return FilePathTemp;
  FilePathTemp = new fdir().withBasePath().crawl(BLOG_PATH).sync();
  return FilePathTemp;
}

function getFileMatter(path) {
  const fullPath = join(BASE_PATH, path);
  return matter.read(fullPath);
}

function isMatterDataEmpty(matter = {}) {
  return Object.keys(matter.data || {}).length === 0;
}

function getAllPosts() {
  return getAllFilePath()
    .map((path) => {
      const { data, content } = getFileMatter(path);
      return { path, ...data, content };
    })
    .sort((a, b) => b.createTime - a.createTime);
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

module.exports = {
  getAllFilePath,
  getFileMatter,
  isMatterDataEmpty,
  getAllPosts,
  getAllKeywords,
};
