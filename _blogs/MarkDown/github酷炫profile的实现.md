---
title: github酷炫profile实现
author: yrobot
keywords: github,markdown,profile,cool,html2image,best,practice
createTime: 2021年06月12日
draft: true
---

## 目的

在 github 个人主页实现酷炫的 profile 介绍

## 首先 github 的 profile 怎么实现

参看 github 文档 [《管理个人资料自述文件
》](https://docs.github.com/cn/github/setting-up-and-managing-your-github-profile/customizing-your-profile/managing-your-profile-readme)

主要的步骤：

1. 您使用与您的 GitHub 用户名匹配的名称创建仓库；如，`yrobot/yrobot`。
2. 该仓库为公共仓库。
3. 仓库的根目录中包含名为 `README.md` 的文件。
4. `README.md` 文件包含任何内容。

可以参看[我的 profile 仓库](https://github.com/yrobot/yrobot)

## 瓶颈：github-markdown 语法单一

但是 github README 的 markdonw 语法支持的格式单一

这是 [GitHub-Markdown 的语法文档](https://docs.github.com/cn/github/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax)

查看 [github-markdown 所有的效果](https://guides.github.com/features/mastering-markdown/)

可以看到主要的语法是面向文档类型的文本输出，并且对于 style 的支持几乎没有。

于是想要实现一个和网页一样酷炫的 profile 遇到了瓶颈。

## 曲线救国思路 - 用 image 展示

其实图片作为页面主要载体，有几个通病：

1. 由于图片体积不如直接使用 markdown，所以页面init时间会比较长
2. 很难对页面中具体的某个节点做跳转配置

### 直接设计然后切图

图片的话，最快的肯定就是直接用设计切图。

但是这个方案有个比较麻烦的问题，就是图片即使压缩了，文件还是很大。

### 使用 svg.foreignObject 包裹 html 和 style

[方案的代码仓库地址](https://github.com/sindresorhus/css-in-readme-like-wat)

svg 效果：  
<img src='https://images.yrobot.top/2021-06-14/header-10-48-04.svg' align='center'/>

svg 代码：

```svg
<svg fill="none" viewBox="0 0 800 400" width="800" height="400"
  xmlns="http://www.w3.org/2000/svg">
  <foreignObject width="100%" height="100%">
    <div xmlns="http://www.w3.org/1999/xhtml">
      <style>
        @keyframes rotate {
          0% { transform: rotate(3deg);}
          100% { transform: rotate(-3deg);}
        }
        @keyframes gradientBackground {
          0% { background-position: 0% 50%;}
          50% { background-position: 100% 50%;}
          100% { background-position: 0% 50%;}
        }
        @keyframes fadeIn {
          0% { opacity: 0;}
          66% { opacity: 0;}
          100% { opacity: 1;}
        }
        .container {
          font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji',
            'Segoe UI Emoji';
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin: 0;
          width: 100%;
          height: 400px;
          background: linear-gradient(-45deg, #fc5c7d, #6a82fb, #05dfd7);
          background-size: 600% 400%;
          animation: gradientBackground 10s ease infinite;
          border-radius: 10px;
          color: white;
          text-align: center;
        }
        h1 {
          font-size: 50px;
          line-height: 1.3;
          letter-spacing: 5px;
          text-transform: uppercase;
          text-shadow: 0 1px 0 #efefef, 0 2px 0 #efefef, 0 3px 0 #efefef, 0 4px 0 #efefef, 0 12px 5px rgba(0, 0, 0, 0.1);
          animation: rotate ease-in-out 1s infinite alternate;
        }
        p {
          font-size: 20px;
          text-shadow: 0 1px 0 #efefef;
          animation: 5s ease 0s normal forwards 1 fadeIn;
        }
      </style>
      <div class="container">
        <h1>Made with HTML &amp; CSS<br/>not an animated GIF</h1>
        <p>Click to see the source</p>
      </div>
    </div>
  </foreignObject>
</svg>
```

svg实现的问题：
1. svg内部不能加载图片资源
