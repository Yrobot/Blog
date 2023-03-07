---
title: WebContainers最佳实践
author: yrobot
keywords: WebContainers,最佳实践,vite,Stackblitz
createTime: 2023年03月03日
draft: true
---

## WebContainers 是什么

https://webcontainers.io/guides/introduction

> WebContainers are a browser-based runtime for executing Node.js applications and operating system commands, entirely inside your browser tab. Apps that previously required cloud VMs to execute user code, in WebContainers can run entirely client-side with a number of benefits over the legacy cloud VM.

WebContainers 是一个基于浏览器的运行时，可以在浏览器中执行 Node.js 应用程序和操作系统命令。与传统的云虚拟机相比，WebContainers 可以在浏览器中完全运行，具有更多的优势。

### 相比云虚拟机的优势

- 在浏览器中本地化的运行 Node.js 工具链（例如 Webpack、Vite 等）
- 安全性：一切都运行在在浏览器中
- 快速：毫秒级启动开发环境
- 开源免费

## 限制

### 1. 需要为网站文件配置 COOP/COEP 头

https://webcontainers.io/guides/configuring-headers

需要给网站文件配置 Header

```yaml
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Opener-Policy: same-origin
```
