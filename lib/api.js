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

function getAppFileSlug() {
  return getAllFilePath().map((path) => {
    return { path };
  });
}

function getFileMatter(path) {
  const fullPath = join(BASE_PATH, path);
  return matter.read(fullPath);
}

// ---

function getPostBySlug(slug, fields = []) {
  const realSlug = slug.replace(/\.md$/, '');
  const fullPath = join(blogDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  const items = {};

  // Ensure only the minimal needed data is exposed
  fields.forEach((field) => {
    if (field === 'slug') {
      items[field] = realSlug;
    }
    if (field === 'content') {
      items[field] = content;
    }

    if (data[field]) {
      items[field] = data[field];
    }
  });

  return items;
}

function getAllPosts(fields = []) {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug, fields))
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts;
}

function isMatterDataEmpty(matter = {}) {
  return Object.keys(matter.data || {}).length === 0;
}

module.exports = {
  getAllFilePath,
  getFileMatter,
  isMatterDataEmpty,
};
