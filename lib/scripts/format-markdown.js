const fs = require('fs');
const { join } = require('path');
const editor = require('gray-matter-editor');
var nodejieba = require('nodejieba');
var dayjs = require('dayjs');
var customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

const { getAllFilePath, getFileMatter } = require('../api');

const BASE_PATH = process.cwd();

nodejieba.load({
  userDict: join(BASE_PATH, './lib/userdict.utf8'),
});

function formatMarkdown() {
  getAllFilePath().map((path) => {
    console.log(`updating ${path}`);
    const matterData = getFileMatter(path);
    const { data, content, empty, isEmpty } = matterData;

    var createTime;
    var title = data.title || '';
    var keywords = data.keywords || [];

    for (let line of content.slice(0, 400).split('\n')) {
      switch (true) {
        case line.startsWith('# '):
          title = line.replace('# ', '').trim();
          break;
        case line.startsWith('时间'):
          const time = dayjs(
            line.replace('时间', '').replace(/\s|\:|\：/g, ''),
            ['YYYY年MM月DD日', 'YYYY年MM月D日', 'YYYY年M月DD日', 'YYYY年M月D日'],
            'es',
            true,
          ).valueOf();
          if (time) createTime = time;
          break;
      }
    }

    keywords = nodejieba.extract(title, 6).map(({ word, weight }) => word);

    editor(path, (data) => ({
      ...data,
      title,
      author: 'yrobot',
      keywords,
      length: content.length,
    }));
  });
}
formatMarkdown();
