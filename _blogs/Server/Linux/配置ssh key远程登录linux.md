---
title: 配置ssh key远程登录linux
author: yrobot
keywords: server,linux,ssh key,remote,login
createTime: 2022年11月30日
---

# 本机生成 ssh key

## 命令行生成 ssh key

```bash
ssh-keygen -t rsa
```

## 查看生成的公钥

```bash
cat ~/.ssh/id_rsa.pub
```

# 将 公钥 配置到远程 linux 中

## 将公钥配置到远程 linux ssh server

```bash
ssh-copy-id $username@x.x.x.x
```

输入用户密码后，即可完成配置

## 测试 用 ssh key 登录

```bash
ssh $username@x.x.x.x
```

如果无需输入密码就登录，那说明配置成功了
