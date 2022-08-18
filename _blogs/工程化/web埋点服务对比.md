---
title: Web 埋点服务对比
author: yrobot
keywords: website,埋点,web tracking,方案,服务,对比
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

#### 数据展示

| 图表类型 | 使用场景                                                                                                                                            | 详细信息                                                       |
| :------- | :-------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------- |
| 表格     | 表格是最常见的数据展示类型，通过对数据结构化的整理，实现数据的对比与统计。大多数场景均适用。                                                        | [表格](https://cloud.tencent.com/document/product/614/74026)   |
| 时序图   | 时序图需要统计数据具备时序字段，依据时间顺序组织与聚合指标。可直观反映指标随时间的变化趋势。统计近一周，每天 404 错误出现的次数等趋势分析场景适用。 | [时序图](https://cloud.tencent.com/document/product/614/74027) |
| 柱状图   | 柱状图描述的是分类数据，直观表现每一个分类项的大小对比关系。统计近一天各错误码类型出现的次数等分类统计场景适用。                                    | [柱状图](https://cloud.tencent.com/document/product/614/74028) |
| 饼图     | 饼图描述的是不同分类的占比情况，通过扇区大小来衡量各分类项的占比情况。错误码占比情况分析等占比统计场景适用。                                        | [饼图](https://cloud.tencent.com/document/product/614/74029)   |
| 单值图   | 单值图描述的是单个指标，一般选择具备有业务价值的关键性指标。统计天、周、月 PV、UV 等单指标场景适用。                                                | [单值图](https://cloud.tencent.com/document/product/614/74030) |
| 计量仪   | 计量仪描述的是单个指标，与单值图不同的是，计量仪一般搭配阈值使用，用来衡量该指标的状态。系统健康度监控等有分级标准的场景适用。                      | [计量仪](https://cloud.tencent.com/document/product/614/74031) |
| 地图     | 地图通过图形的位置来表现数据的地理位置，通常来展示数据在不同地理区域上的分布情况。攻击 IP 地理分布等地理位置统计场景适用。                          | [地图](https://cloud.tencent.com/document/product/614/74032)   |
| 桑基图   | 桑基图是一种特定类型的流图，用于描述一组值到另一组值的流向。防火墙目的与源 IP 流量统计等场景适用。                                                  | [桑基图](https://cloud.tencent.com/document/product/614/74033) |
| 词云图   | 词云是文本数据的视觉表示，用于展示文本数据的出现频率。在高频操作人员统计等审计场景适用。                                                            | [词云图](https://cloud.tencent.com/document/product/614/74034) |

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

## 阿里云日志服务 SLS

> 日志服务 SLS 是云原生观测与分析平台，为 Log、Metric、Trace 等数据提供大规模、低成本、实时的平台化服务。日志服务一站式提供数据采集、加工、查询与分析、可视化、告警、消费与投递等功能，全面提升您在研发、运维、运营、安全等场景的数字化能力。

[SLS 官网](https://help.aliyun.com/product/28958.html)

### 使用流程

1. 开通日志服务
2. 创建 Project 和 Logstore
3. 开启 WebTracking
4. 上报日志
5. 查询与分析日志

### 数据上报方式

日志服务支持采集服务器与应用、开源软件、物联网、移动端、标准协议、阿里云产品等多种来源的数据。包括 HTTP 请求和 SDK 上报等方式。

| 类别   | 来源           | 接入方式                                    | 更多                |     |
| ------ | -------------- | ------------------------------------------- | ------------------- | --- |
| 语言   | Java           | Log Service Java SDK Java Producer Library  | 无                  |     |
|        | C              | Log Service C SDK                           | 无                  |     |
|        | Python         | Log Service Python SDK                      | 无                  |     |
|        | Python Logging | Python Logging Handler                      | 无                  |     |
|        | PHP            | Log Service PHP SDK                         | 无                  |     |
|        | .Net           | Log Service csharp SDK                      | 无                  |     |
|        | C++            | Log Service C++ SDK                         | 无                  |     |
|        | Go             | Log Service Go SDK Golang Producer Library  | 无                  |     |
|        | NodeJS         | NodeJs                                      | 无                  |     |
|        | JS             | JS/Web Tracking                             | 无                  |     |
| OS     | Linux          | Logtail                                     | 无                  |     |
|        | Windows        | Logtail                                     | 无                  |     |
|        | Mac/Unix       | Native C                                    | 无                  |     |
|        | Docker 文件    | Logtail 文件采集                            | 无                  |     |
|        | Docker 输出    | Logtail 容器输出                            | 无                  |     |
| 移动端 | iOS、Android   | Log Service Android SDK Log Service iOS SDK | 无                  |     |
|        | 网页           | JS/Web Tracking                             | 无                  |     |
|        | 智能 IoT       | C Producer Library                          | 采集-IoT/嵌入式日志 |     |

[阿里云日志服务 - 数据采集概述](https://help.aliyun.com/document_detail/28981.html)  
[阿里云日志服务 - 使用 Web Tracking 采集日志](https://help.aliyun.com/document_detail/31752.htm?spm=a2c4g.11186623.0.0.60246e8bvfNJe8#t13028.html)

#### SDK 列表

| SDK 语言       | 参考文档                                                                                                                                                                               | GitHub 源码                                                                                                                                                     |
| :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Java           | [Java SDK 概述](/document_detail/29068.htm#reference-cxs-zdm-12b "日志服务Java SDK封装了日志服务的所有API接口。您可以通过日志服务Java SDK方便地调用日志服务的所有API接口。")           | [Log Service Java SDK](https://github.com/aliyun/aliyun-log-java-sdk)、[Log Service SDK for Java 0.6.0 API](http://log-java-docs.oss-cn-hangzhou.aliyuncs.com/) |
| .NET Core      | [.NET Core SDK 概述](/document_detail/84882.htm#task-fxd-m2r-32b "日志服务.NET Core SDK封装了日志服务的所有API接口。您可以通过日志服务.NET Core SDK方便地调用日志服务的所有API接口。") | [Log Service .NET Core SDK](https://github.com/aliyun/aliyun-log-dotnetcore-sdk)                                                                                |
| .NET           | [.NET SDK 概述](/document_detail/29071.htm#reference-cd1-2wq-12b "日志服务.NET SDK封装了日志服务的所有API接口。您可以通过日志服务.NET SDK方便地调用日志服务的所有API接口。")           | [Log Service .NET SDK](https://github.com/aliyun/aliyun-log-chsarp-sdk)                                                                                         |
| PHP            | [PHP SDK](/document_detail/29074.htm#task-2334635 "本文介绍安装日志服务PHP SDK及使用PHP SDK完成常见操作的相关步骤。")                                                                  | [Log Service PHP SDK](https://github.com/aliyun/aliyun-log-php-sdk)                                                                                             |
| Python         | [Python SDK 概述](/document_detail/29077.htm#task-2323893 "日志服务Python SDK封装了日志服务的所有API接口。您可以通过日志服务Python SDK方便地调用日志服务的所有API接口。")              | [Log Service Python SDK](https://github.com/aliyun/aliyun-log-python-sdk)、[User Guide](http://aliyun-log-python-sdk.readthedocs.io/README_CN.html)             |
| Node.js        | [Node.js SDK](/document_detail/141789.htm#task-2325110 "本文介绍安装日志服务Node.js SDK及使用Node.js SDK完成常见操作的相关步骤。")                                                     | [Log Service Node.js SDK](https://github.com/aliyun-UED/aliyun-sdk-js/tree/master/samples/sls)                                                                  |
| C              | [C SDK](/document_detail/34913.htm#reference-klg-gwq-12b "本文介绍使用C SDK的基本操作。")                                                                                              | [Log Service C SDK](https://github.com/aliyun/aliyun-log-c-sdk)                                                                                                 |
| GO             | [Go SDK 概述](/document_detail/53906.htm#reference-kjq-gwq-12b "日志服务Go SDK封装了日志服务的所有API接口。您可以通过日志服务Go SDK方便地调用日志服务的所有API接口。")                 | [Log Service Go SDK](https://github.com/aliyun/aliyun-log-go-sdk)                                                                                               |
| iOS            | [iOS SDK](/document_detail/43145.htm#reference-qyv-vh4-12b "本文介绍安装日志服务iOS SDK的示例代码。")                                                                                  | [Log Service iOS SDK](https://github.com/aliyun/aliyun-log-ios-sdk)、[Objective-C SDK](https://github.com/lujiajing1126/AliyunLogObjc)                          |
| Android        | [Android SDK 概述](/document_detail/43200.htm#reference-lnl-wh4-12b "日志服务Android SDK封装了日志服务的日志采集相关API接口。您可以通过日志服务Android SDK方便地采集Android日志。")    | [Log Service Android SDK](https://github.com/aliyun/aliyun-log-android-sdk)                                                                                     |
| C++            | [C++ SDK](/document_detail/108042.htm#concept-vtl-hmv-vgb "阿里云日志服务C++ SDK帮助您在C++ 程序中调用日志服务的API接口，仅用于Linux平台。")                                           | [Log Service C++ SDK](https://github.com/aliyun/aliyun-log-cpp-sdk)                                                                                             |
| JavaScript SDK | [JavaScript SDK](/document_detail/31752.htm#section-ktl-vm5-vdb)                                                                                                                       | 无                                                                                                                                                              |

#### 数据展示

| 项目             | 说明                                                                                                                                                  |
| :--------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| 仪表盘           | 仪表盘是日志服务提供的实时 分析大盘。您可以在仪表盘查看多个基于查询与分析结果的统计图表。当您打开或刷新仪表盘时，统计图表自动执行一次查询与分析操作。 |
| 统计图表         | 统计图表是日志服务根据查询与分析语句渲染出的结果。日志服务提供表格、线图、柱状图等多种图表类型。目前，统计图表包括 Pro 版本和普通版本。               |
| 第三方可视化工具 | 您可以将日志服务与 DataV、Grafana、Tableau 等第三方可视化工具对接，进行大屏数据展示。                                                                 |

统计图表：

- [表格](/document_detail/69314.htm#concept-e3d-bnq-zdb)
- [线图](/document_detail/69468.htm#concept-ehy-cnq-zdb)
- [柱状图](/document_detail/69491.htm#concept-vrr-dnq-zdb)
- [条形图](/document_detail/69521.htm#concept-dt3-2nq-zdb)
- [饼图](/document_detail/69541.htm#concept-yyr-fnq-zdb)
- [面积图](/document_detail/69567.htm#concept-ndk-hnq-zdb)
- [单值图](/document_detail/69562.htm#concept-sqg-gnq-zdb)
- [进度条](/document_detail/114025.htm#concept-ptq-2j5-jhb)
- [时间轴](/document_detail/171223.htm#task-2445065)
- [地图](/document_detail/69570.htm#concept-wdv-gnq-zdb)
- [流图](/document_detail/69571.htm#concept-tmy-hnq-zdb)
- [桑基图](/document_detail/69572.htm#concept-tdq-3nq-zdb)
- [词云](/document_detail/69581.htm#concept-o1f-jnq-zdb)
- [矩形树图](/document_detail/87927.htm#concept-ztv-sz1-v2b)
- [漏斗图](/document_detail/171222.htm#task-2445067)
- [轨迹图](/document_detail/159727.htm#task-2455885)
- [中国行政区地图](/document_detail/159725.htm#task-2456340)
- [气泡图](/document_detail/170844.htm#task-2526640)
- [变更图](/document_detail/170845.htm#task-2530184)

#### JS SDK 使用 Example

[浏览器 JavaScript SDK](https://help.aliyun.com/document_detail/427748.htm?spm=a2c4g.11186623.0.0.3e767c6fE3A5ZH#task-2211485)

```ts
import SlsTracker from "@aliyun-sls/web-track-browser";
const opts = {
  host: "${host}", // 所在地域的服务入口。例如cn-hangzhou.log.aliyuncs.com
  project: "${project}", // Project名称。
  logstore: "${logstore}", // Logstore名称。
  time: 10, // 发送日志的时间间隔，默认是10秒。
  count: 10, // 发送日志的数量大小，默认是10条。
  topic: "topic", // 自定义日志主题。
  source: "source",
  tags: {
    tags: "tags",
  },
};
const tracker = new SlsTracker(opts);

// send data
tracker.send({
  customer: "zhangsan",
  product: "iphone 12",
  price: 7998,
});
```

可以看到 阿里云的 SDK 支持延迟上报，自动汇总一段时间内的 logs，然后一次性上报。可以有效减少网络请求的数量，并降低 日志服务的写入次数。

## Mixpanel

> Powerful, self-serve product analytics to help you convert, engage, and retain more users.

> Mixpanel 是一个强大的自助产品分析工具，可帮助您转换、吸引和留住更多用户。

[Mixpanel 官网](https://mixpanel.com/)

### 使用流程

1. 在 Mixpanel 新建项目，获取上报 token
2. 安装 Mixpanel SDK，并上报数据
3. 在 Mixpanel 上查看数据

### 数据上报方式

客户端通过 SDK 或者 API 发送数据到 Mixpanel

#### SDK 列表

- [JS](https://developer.mixpanel.com/docs/javascript-quickstart)
- [Node.js](https://developer.mixpanel.com/docs/nodejs)
- [Objective-C](https://developer.mixpanel.com/docs/ios-objective-c-quickstart)
- [Swift](https://developer.mixpanel.com/docs/ios-swift-quickstart)
- [Android](https://developer.mixpanel.com/docs/android-quickstart)
- [Python](https://developer.mixpanel.com/docs/python)
- [Java](https://developer.mixpanel.com/docs/java)
- [PHP](https://developer.mixpanel.com/docs/php)
- [Ruby](https://developer.mixpanel.com/docs/ruby)
- [React Native](https://developer.mixpanel.com/docs/react-native-quickstart)
- [Flutter](https://developer.mixpanel.com/docs/flutter-quickstart)
- [Unity](https://developer.mixpanel.com/docs/unity-quickstart)

#### 数据展示

- Bar
- Stacked Bar
- Line
- Stacked Line
- Metric
- Pie
- Table

#### JS SDK 使用 Example

[JS SDK 文档](https://developer.mixpanel.com/docs/javascript-quickstart)

```ts
var mixpanel = require("mixpanel-browser");

mixpanel.init("YOUR_TOKEN", {
  // the whole config visit here: https://github.com/mixpanel/mixpanel-js/blob/8b2e1f7b/src/mixpanel-core.js#L87-L110
  autotrack: true,
  cross_subdomain_cookie: true,
  persistence: "cookie",
  persistence_name: "",
  upgrade: false,
  disable_persistence: false,
  disable_cookie: false,
  secure_cookie: false,
  ip: true,
  property_blacklist: [],
});

mixpanel.track("event-name", {
  age: 28,
  gender: "male",
});
```

<!-- ## DEMO

>

[官网]()

### 使用流程

1.

### 数据上报方式

#### SDK 列表

#### 数据展示

#### JS SDK 使用 Example -->

## 价格对比

这是[腾讯云价格计算器](https://buy.cloud.tencent.com/price/cls/calculator)给出的一天 1G 埋点数据的价格：

- 100%索引：

  | 计费项       | 预估用量（仅供参考） | 每天费用   | 每月费用    |
  | ------------ | -------------------- | ---------- | ----------- |
  | 写流量       | 170.667 MB           | 0.03 元/天 | 21.40 元/月 |
  | 标准索引流量 | 1 G                  | 0.35 元/天 |             |
  | 标准日志存储 | 5 GB                 | 0.06 元/天 |             |
  | 标准索引存储 | 30 GB                | 0.35 元/天 |             |

- 50%索引：

  | 计费项       | 预估用量（仅供参考） | 每天费用   | 每月费用    |
  | ------------ | -------------------- | ---------- | ----------- |
  | 写流量       | 170.667 MB           | 0.03 元/天 | 13.20 元/月 |
  | 标准索引流量 | 512 MB               | 0.18 元/天 |             |
  | 标准日志存储 | 5 GB                 | 0.06 元/天 |             |
  | 标准索引存储 | 15 GB                | 0.17 元/天 |             |

可以看到主导价格的主要要素是： 标准索引流量 和 标准索引存储，而且需要尽量降低索引比例。

## 各服务横向对比表

|                    | 是否有 js-SDK                       | 是否基于 Cookie                      | 扩展服务端埋点成本       | 数据展示能力                                                                   | 告警                                                        | 价格                                                        | 优势                                                                                                              | 不足                                                             |
| :----------------- | :---------------------------------- | ------------------------------------ | ------------------------ | ------------------------------------------------------------------------------ | ----------------------------------------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| 腾讯云日志服务 CLS | 有，但是是面向 nodejs 的 log SDK    | 否                                   | 成本低                   | 展示类型充足，参看[文档](https://cloud.tencent.com/document/product/614/74025) | 短信、电话、邮件、微信、企业微信、自定义回调                | 标准索引流量 0.35 元/GB/日； 标准索引存储 0.0115 元/GB/日； | 价格透明，展示能力强，告警能力强                                                                                  | 文档和 SDK 优点拉胯，特别是 SDK，js-SDK 都没分 browser 和 nodejs |
| 阿里云日志服务 SLS | 有，而且分为 nodejs 版和 browser 版 | 否                                   | 成本低，且横向扩展能力强 | 类型充足                                                                       | 短信、语音、邮件、钉钉、企业微信、飞书、Slack、通用 Webhook | 标准索引流量 0.35 元/GB/日； 标准索引存储 0.0115 元/GB/日； | 展示能力强，SDK 做的很好，告警能力强，文档写的很好                                                                |
| Mixpanel           | 有，专业的 web tracking 工具        | 默认 cookie，可以切换成 localStorage | 支持                     | 一些基础的图表都有                                                             | 告警比较简单，支持邮箱通知                                  | 免费量：100K users，付费 25$/月                             | SDK 做的很好，文档很好，产品好看，支持 GDPR，支持配置化使用 localStorage，有用户体系 可以对单一用户的行为进行分析 | 告警比较简单                                                     |
