---
title: Stream流最佳实践
author: yrobot
keywords: Node.js, Stream, 流, 最佳实践
createTime: 2023年03月20日
---

# 什么是 Stream 流

流不是一种数据储存形式，而是一种数据处理形式。

流可以将数据片一个个进行传递，依据设定好的 pipe 逻辑顺序 对流数据依次进行处理，最终将处理后的数据输出。

# 为什么要使用 Stream 流

设想一个场景，我们需要对一个很大的文件夹 进行 脱敏 压缩 打包。

但是我们的内存只有 1G，而这个文件夹的大小是 10G。

而且怎么处理逻辑更清晰，工程化更优秀呢。

问题总结：

1. 内存无法支持一次性处理整个文件夹
2. 怎么使用函数式编程的思想来让逻辑更加清晰

这时 流 就派上用场了。

```ts
// 数据脱敏
const desensitization = (data) => {
  // ...
};

// 数据压缩
const compression = (data) => {
  // ...
};

// 数据打包
const packing = (data) => {
  // ...
};

const readDir = (dir, fileCallback) => {
  // 读取文件夹, 并在读到文件时调用 fileCallback
};

const reader = Reader();

reader.pipe(desensitization).pipe(compression).pipe(packing);

readDir("dist", reader.push);
```

参看上方的伪代码逻辑，以文件为数据片，将数据片一个个传递给流，流会依据 pipe 逻辑顺序 对流数据依次进行 脱敏 压缩 打包。

流 很好的解决了上方的问题：

1. 每次以一个文件的大小为单位进行处理，不会因为处理内容过大而导致内存溢出
2. 通过 pipe 逻辑顺序，将处理逻辑进行了分离，各个 pipe 可以使用纯函数实现，使得项目逻辑更加清晰
