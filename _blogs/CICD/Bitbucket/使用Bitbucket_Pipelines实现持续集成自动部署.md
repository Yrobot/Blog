---
title: 使用 Bitbucket Pipelines 实现持续集成自动部署
author: yrobot
keywords: CI,CD,Bitbucket,Pipelines,持续集成,自动部署
createTime: 2021年05月28日
---

**本页目录：**  
[什么是 Bitbucket](#bitbucket)  
[什么是 CI/CD，好处又是什么？](#cicd)  
[Bitbucket 的 CICD 工具 - Bitbucket Pipelines](#pipelines)  
[配置 pipelines](#config)  
[pipe 能力列表](#pipelist)  
[在 CI/CD 过程中使用变量](#variables)  
[在 bitbucket 查看 CI/CD 流程](#view)  
[本管理和回滚](#rollback)

<a id='bitbucket'></a>

## 什么是 Bitbucket

根据[维基百科](https://zh.wikipedia.org/wiki/Bitbucket)的介绍，Bitbucket 是 Atlassian 公司提供的一个基于 web 的版本库托管服务。  
![](https://gitee.com/yrobot/images/raw/master/2021-05-28/hTyxaV-16-14-43.png)

简单来说，Bitbucket 就是一个类似于 github 和 gitee 一样的 基于 git 的线上版本管理工具，也就是代码仓库的一种。

<a id='cicd'></a>

## 什么是 CI/CD，好处又是什么？

请参看[《什么是 CICD》](../什么是CICD)

<a id='pipelines'></a>

## Bitbucket 的 CICD 工具 - Bitbucket Pipelines

[Pipelines 官网](https://bitbucket.org/product/zh/features/pipelines)

简单来说就是集成在 Bitbucket 中的 CICD 工具，只需要简单配置，就可以完成 CICD 流程。  
Bitbucket 会根据代码包中的配置文件，在每次符合条件的 push 中运行对应的逻辑，包括指定运行环境，利用环境执行代码  
除了语言环境的能力，pipelines 还支持使用 `pipe` 实现复杂的 CICD 能力，指定 `pipe` 后，可以进行测试、安全控制、消息推送、代码部署、等等

<a id='config'></a>

## 配置 pipelines

在仓库根目录建立一个名为 `bitbucket-pipelines.yml` 的文件，语法为 yaml（一种 json 的超集）  
bitbucket 在 CICD 触发时会自动读取此文件总的配置

配置纬度可以包含且不仅仅包含一下几点：

1. 运行环境：当前的语言环境
2. 分支：指定触发分支
3. 步骤：bitbucket 会根据指定的步骤按顺序执行，在这里可以使用 pipe 库

具体配置参看 [bitbucket-pipelines 的配置文档](https://support.atlassian.com/bitbucket-cloud/docs/configure-bitbucket-pipelinesyml/)

**example:**

```yml
image: node:14.15.1

pipelines:
  branches:
    master:
      - step:
          name: Build
          script:
            - npm install
            - npm run build
      - step:
          name: Deploy
          script:
            - pipe: atlassian/scp-deploy
              variables:
                LOCAL_PATH: 'build/*'
```

<a id='pipelist'></a>

## pipe 能力列表

![](https://gitee.com/yrobot/images/raw/master/2021-05-28/lHUyJN-17-30-34.png)
[查看所有 pipe](https://bitbucket.org/product/zh/features/pipelines/integrations)

<a id='variables'></a>

## 在 CI/CD 过程中使用变量

在使用 pipelines 的过程中，还可以使用 变量 来实现一些动态大包的操作。

下面列举几个场景：

1. 项目打包为 docker-image 时，可以利用`$BITBUCKET_BUILD_NUMBER`作为 image 的 tag，便于版本管理。
2. 使用 pipe 部署项目时，可以利用`$USER`、`$SERVER`等作为 pipe 配置项

变量使用示例：
使用`$BITBUCKET_BUILD_NUMBER`动态部署静态网站

```yml
pipelines:
  - step:
      name: Deploy
      script:
        - pipe: atlassian/scp-deploy
          variables:
            REMOTE_PATH: '/web/v_$BITBUCKET_BUILD_NUMBER$'
```

<a id='view'></a>

## 在 bitbucket 查看 CI/CD 流程

自动化进程列表：
![](https://gitee.com/yrobot/images/raw/master/2021-05-28/ua3wLp-20-11-55.jpg)

查看 CICD 状态和 log：
![](https://gitee.com/yrobot/images/raw/master/2021-05-28/53OddV-17-37-44.jpg)

<a id='rollback'></a>

## 版本管理和回滚

Bitbucket 的 Piplines 把每次的 CICD 都记录下来了，我可以直接作为版本管理。也可以查看 Deployments，查看部署。  
当我们需要回滚某一个版本时，只需要进入那次的 pipeline，点击 Rerun 就可以对那次的记录进行重新编译部署，从而实现回滚操作。
![](https://gitee.com/yrobot/images/raw/master/2021-05-28/syxPYz-17-41-08.jpg)
