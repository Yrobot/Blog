---
title: 个人开发者的Scrum
author: yrobot
keywords: 流程,scrum,agile,开发者,开发,工程化
createTime: 2022年08月10日
---

## Scrum

> 敏捷开发是一个用于开发和维持复杂产品的框架 ，是一个增量的、迭代的开发过程。

> 在敏捷开发中，软件项目的构建被切分成多个子项目，各个子项目的成果都经过测试，具备集成和可运行的特征。换言之，就是把一个大项目分为多个相互联系，但也可独立运行的小项目，并分别完成，在此过程中软件一直处于可使用状态。

## 优点

1. 对于过程中的需求变更有更好的适应能力
2. 减少项目的失败的成本和风险
3. 更好的过程体验，spring 迭代就可获得真实的使用反馈

## 我为什么选 Scrum

- 我需要一个项目管理流程来督促自己不断的优化当前项目，不然很容易让自己迷失在技术调研里
- scrum 相比 瀑布流，更加适合我，我需要不断的反馈来让我更好的投入下一个阶段的开发，而且我的产品能力是短板，没法一下子设计出一个完美的产品

## 传统的 Scrum 是怎么做的

### 成员

- Product Owner
- Scrum Master
- Develop Team

### 流程

![scrum_process_atlassian-16-14-24](https://images.yrobot.top/2022-08-10/scrum_process_atlassian-16-14-24.svg)

> The product backlog is a list that compiles all the tasks and user stories that must be done to complete the whole project.

> The sprint backlog is a subset of the product backlog. The sprint backlog comes from the product backlog, but it contains only the product backlog items that can be completed during each agile sprint.

![0wR1vU-17-09-57](https://images.yrobot.top/2022-08-10/0wR1vU-17-09-57.jpg)

1. PO 列举 User Stories，组成 Product Backlog （后续新需求也会加入 Product Backlog）
2. PO、Scrum Master、Develop Team 开 Sprint Planing 会议，讨论哪些 Stories 放入这个 Sprint，并对 Stories 进行才分成可执行 Task，对 Task 进行开发时间评估，最后 Tasks 组成 Sprint Backlog
3. 接下来这个 Sprint，Develop Team 对 Sprint Backlog 进行开发
4. 开发阶段中进行 StandUp，解决需要沟通的问题。
5. 一个开发阶段结束了，进行 Sprint Review 会议进行成果 demo，PO 评判成果是否符合 User Story 的要求
6. Sprint Review 之后是 Sprint Retro，只是对这个 Sprint 过程中的任何问题进行暴露和讨论，以指导下一次 Sprint 更好的进行
7. 每个 Sprint 结束后，PO 评估是否进行 Version Release

## Scrum 与 独立开发者 更好的结合

由于 Scrum 中一些流程是为了规避团队内部由于沟通理解引起的问题，但是这些问题对一个人开发者来说是不必要的，所以我们可以精简一部分的 Scrum 流程。

### 一些对于独立开发者来说没有必要的流程

- Daily StandUp Meeting
- Sprint Review
- Sprint Retro：可选，个人开发者只需要考虑规划层面对于 Sprint 的影响

### 精简后的流程

1. 列举 User Stories，组成 Product Backlog （后续新需求也会加入 Product Backlog）
2. Sprint Planing，决定哪些 Stories 放入这个 Sprint，并对 Stories 进行才分成可执行 Task，对 Task 进行开发时间评估，最后 Tasks 组成 Sprint Backlog
3. 接下来这个 Sprint，对 Sprint Backlog 进行开发
4. 每个 Sprint 结束后，评估是否进行 Version Release

## 独立开发者的 Scrum 流程图解

![PBt9TK-18-20-55](https://images.yrobot.top/2022-08-10/PBt9TK-18-20-55.png)
