import { join, dirname } from "path";
import { fileURLToPath } from 'url';
import fs from "fs";
import fetch from "node-fetch";

const __dirname = dirname(fileURLToPath(import.meta.url));

const BASE_PATH = join(__dirname, "../../");
const OUT_PATH = "_urls.txt";

const URLS_PATH = join(BASE_PATH, OUT_PATH);

const urls = fs.readFileSync(URLS_PATH, {
  encoding: "utf-8",
});

var count = 1;

for (let i = 0; i < urls.length; i++) {
  if (urls[i] === "\n") count++;
}

fetch(
  "http://data.zz.baidu.com/urls?site=https://blog.yrobot.top&token=2fm1gx5sAJ4tS8Cf",
  {
    method: "POST",
    body: urls,
  }
)
  .then((res) => res.json())
  .then(
    ({
      success,
      remain,
      not_same_site = [],
      not_valid = [],
      error,
      message,
    }) => {
      if (error) {
        console.error(`${error}:${message}`);
      } else {
        console.log(`${count}条推送, ${success}成功`);
        if (not_same_site.length) {
          console.log(
            `由于不是本站url而未处理的url列表(${
              not_same_site.length
            })：\n${not_same_site.join("\n")}`
          );
        }
        if (not_valid.length) {
          console.log(
            `不合法的url列表(${not_valid.length})：\n${not_valid.join("\n")}`
          );
        }
        console.log(`当天剩余的可推送url条数：${remain}`);
      }
    }
  );
