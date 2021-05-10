const fs = require('fs');
const { join } = require('path');
const matter = require('gray-matter');
const { fdir } = require('fdir');

const BASE_PATH = process.cwd();
const BLOG_PATH = '_blogs';

const blogDirectory = join(BASE_PATH, BLOG_PATH);

function getAllFilePath() {
  return new fdir().withBasePath().crawl(BLOG_PATH).sync();
}

function getFileMatter(path) {
  const fullPath = join(BASE_PATH, path);
  return matter.read(fullPath);
}

function isMatterDataEmpty(matter = {}) {
  return Object.keys(matter.data || {}).length === 0;
}

function getAllPosts() {
  return getAllFilePath().map((path) => {
    const { data, content } = getFileMatter(path);
    return { path, ...data, content };
  });
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

console.log(getAllKeywords());

module.exports = {
  getAllFilePath,
  getFileMatter,
  isMatterDataEmpty,
  getAllPosts,
};
