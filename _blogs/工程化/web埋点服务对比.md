---
title: Web 埋点服务对比
author: yrobot
keywords: website,埋点,track,方案,服务,对比
createTime: 2022年08月14日
---

本文主要横向对比几个页面埋点服务，进而选择最适合自己的服务作为一个稳定的日常日志服务工具。

目前对于埋点服务需求主要是，利用图表对于 PV、UV、自定义埋点等数据进行展示。

对比维度主要有以下几点：

- 数据上报方式（是否有 web 端的 SDK，是否基于 cookie，添加服务端埋单成本
- 数据展示是否可以满足需求
- 告警支持
- 价格

## 腾讯云日志服务 - Cloud Log Service，CLS

> 日志服务（Cloud Log Service，CLS）提供一站式的日志数据解决方案。您无需关注扩缩容等资源问题，五分钟快速便捷接入，即可享受日志的采集、存储、加工、检索分析、消费投递、生成仪表盘、告警等全方位稳定可靠服务。全面提升问题定位、指标监控的效率，大大降低日志运维门槛。

[Cloud Log Service 官网](https://cloud.tencent.com/document/product/614/49360)

### 使用流程

1. 开通服务
2. 安装日志客户端：LogListener
3. 配置采集规则
4. 日志分析

### 数据上报方式

日志服务（Cloud Log Service，CLS）提供采集客户端， API 接入方式和 SDK 采集方式，方便用户将应用程序日志导入到日志服务。目前日志服务提供结构化上传方式，要求数据按照 key-value 的方式进行上传。

| 采集方式               | 描述                                                                                                                                                                                         |
| :--------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| API 方式采集           | 通过调用 [日志服务 API](https://cloud.tencent.com/document/product/614/12445) 上传结构化日志至日志服务，详情请参考 [上传日志接口](https://cloud.tencent.com/document/product/614/16873) 文档 |
| SDK 方式采集           | 通过使用 SDK 上传结构化日志至日志服务，详情请参考 [SDK 采集](https://cloud.tencent.com/document/product/614/67157) 文档                                                                      |
| LogListener 客户端采集 | LogListener 是日志服务提供的日志采集客户端，通过控制台简单配置可快速接入日志服务，详情请参考 [LogListener 使用流程](https://cloud.tencent.com/document/product/614/33495)                    |

#### SDK 列表

| SDK 语言   | GitHub 源码                                                                                  |
| :--------- | :------------------------------------------------------------------------------------------- |
| Java       | [tencentcloud-cls-sdk-java](https://github.com/TencentCloud/tencentcloud-cls-sdk-java)       |
| C++        | [tencentcloud-cls-sdk-c++](https://github.com/TencentCloud/tencentcloud-cls-sdk-cpp)         |
| Go         | [tencentcloud-cls-sdk-go](https://github.com/TencentCloud/tencentcloud-cls-sdk-go)           |
| JavaScript | [tencentcloud-cls-sdk-js](https://github.com/TencentCloud/tencentcloud-cls-sdk-js)           |
| Android    | [tencentcloud-cls-sdk-android](https://github.com/TencentCloud/tencentcloud-cls-sdk-android) |
| iOS        | [tencentcloud-cls-sdk-ios](https://github.com/TencentCloud/tencentcloud-cls-sdk-ios)         |

#### JS SDK 使用 Example

```ts
let client = new AsyncClient({
  endpoint: "ap-guangzhou.cls.tencentcs.com",
  secretId: "[secretId]",
  secretKey: "[secretKey]",
  sourceIp: "127.0.0.1",
  retry_times: 10,
});

let item = new LogItem();
item.pushBack(new Content("__CONTENT__", "你好，我来自深圳|hello world2"));
item.setTime(Math.floor(Date.now() / 1000));

let logGroup = new LogGroup();
logGroup.addLogs(item);
let request = new PutLogsRequest("[Topic_ID]", logGroup);
let data = await client.PutLogs(request);
console.log(data);
```

## 各服务横向对比表

|                    | 是否有 js-SDK                    | 是否基于 Cookie | 扩展服务端埋点成本 | 数据展示能力                                                                   | 告警                                         | 价格                          |
| :----------------- | :------------------------------- | --------------- | ------------------ | ------------------------------------------------------------------------------ | -------------------------------------------- | ----------------------------- |
| 腾讯云日志服务 CLS | 有，但是是面向 nodejs 的 log SDK | 否              | 成本低             | 展示类型充足，参看[文档](https://cloud.tencent.com/document/product/614/74025) | 短信、电话、邮件、微信、企业微信、自定义回调 | 标准存储，100w RPD 约 5 元/月 |
