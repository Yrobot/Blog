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

## 连接远程服务器

```bash
ssh $username@x.x.x.x
```

需要输入当前用户的登录密码进行连接

## 配置 本地机 公钥 到 远程服务器

### 远程服务器中新建 ~/.ssh/authorized_keys 文件

```bash
touch ~/.ssh/authorized_keys
```

### 将公钥粘贴到 ~/.ssh/authorized_keys

```bash
vi ~/.ssh/authorized_keys
```

进入编辑模式，粘贴本机的公钥，保存

## 测试 用 ssh key 登录

### 先推出连接

```bash
exit
```

### 尝试重新连接

```bash
ssh $username@x.x.x.x
```

如果无需输入密码就登录，那说明配置成功了
