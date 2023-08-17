---
title: 在Slack上开发一个App
author: yrobot
keywords: 前端,ts,slack,app,开发,bot,IM,chat,robot
createTime: 2023年08月11日
draft: true
---

# 在 Slack 上开发一个 App

> 本文主要的目的是记录一下在 Slack 上开发一个 App（bot 被@后展示一个表单，用户填写后提交内容到后端） 的过程，以及遇到的一些问题和解决方案。

## Slack App 是什么，能做什么

> Slack App 是在 Slack 平台上运行的应用程序,可以和 Slack 进行集成,实现更多强大的功能

从单一能力的维度来看,Slack App 主要具有以下几方面的能力:

1.  消息收发能力
    - 发送及获取各种格式的消息,包括文本、图片、文件等。
    - 支持发送到不同的地方,比如频道、群组、私聊等。
    - 可以定制名称、缩略图等消息详情。
2.  用户和频道管理能力
    - 获取用户和频道列表信息。
    - 添加好友、创建私频道、邀请用户加入。
    - 管理用户组,分配应用访问权限。
3.  事件订阅和回调能力
    - 可以订阅消息发送、按钮点击等不同事件。
    - 接收事件数据,进行相应处理。
4.  数据存储能力
    - 在 Slack 平台存储自定义数据。
    - 支持读写不同格式的数据。
5.  UI 扩展能力
    - 可以在 Slack 中嵌入新的按钮、菜单、模态框等。
    - 提升 Slack 客户端的交互能力。
6.  第三方服务调用能力
    - 可以调用外部服务的 API 完成更多功能。
    - 实现不同系统的集成。

开发者可以将这些能力进行拼接，从而实现期望的业务需求。

## Slack App 主要开发流程

![FZdXzl-17-41-53](https://images.yrobot.top/2023-08-11/FZdXzl-17-41-53.png)

1. 在 Slack 上建立一个 App
2. 往 App 中添加功能
3. 安装 App
4. 管理 分发

### 添加功能

#### Incoming Webhooks

Slack 的 Incoming Webhooks 可以让你从外部向 Slack 发送消息

可以利用 [message attachments](https://api.slack.com/messaging/composing/layouts#attachments) 来发送富文本消息

message attachments 有很多的限制，并不是直接使用 html。文件大小有限制，预览有限制，消息长度有限制，搜索限制 等

可以用这个 [工具](https://app.slack.com/block-kit-builder/T01ANQ4RA8H#%7B%22blocks%22:%5B%7B%22type%22:%22section%22,%22text%22:%7B%22type%22:%22mrkdwn%22,%22text%22:%22New%20Paid%20Time%20Off%20request%20from%20%3Cexample.com%7CFred%20Enriquez%3E%5Cn%5Cn%3Chttps://example.com%7CView%20request%3E%22%7D%7D%5D%7D) 调试 message attachments

主要作用和使用方法如下:

1. 在创建 Slack App 时启用 Incoming Webhooks 功能,会获得一个 Webhook URL。
1. 通过 POST 请求发送 JSON 数据到这个 URL 即可发送消息。
   - 消息支持文本、附件、代码块等格式。可以定制用户名、频道等。
   - 可以用来自动发送重要事件、警报通知、外部交互的响应等。
   - Webhooks 不需要任何身份验证就可以推送消息。
   - 可以设置 Webhooks 消息的自定义样式,如颜色、图标等。
   - 支持发送到公共频道或私聊用户。

####
