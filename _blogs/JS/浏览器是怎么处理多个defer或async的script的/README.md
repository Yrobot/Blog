---
title: 浏览器是怎么处理多个defer或async的script的
author: yrobot
keywords: async,script,defer,浏览器,多个,处理
createTime: 2019年10月15日
---




1. 浏览器下载资源可以并行，但是有上限，不同浏览器的上限不同，但都是在8以内。具体参考：http://www.stevesouders.com/blog/2008/03/20/roundup-on-parallel-connections/

2. 浏览器对于同一服务器下的资源可以利用HTTP/1.1的Keep alive，保持tcp层的连接，下个请求就无需再经过tcp连接，减少通信耗时，提高了同一服务器下资源的下载效率。

3. 对于不同地址的资源浏览器还是得通过并行资源请求，而因为并行下载线程数量被控制在个位数，所以多个不同地的script势必会造成script下载的拥塞。

