---
title: DOM操作
author: yrobot
keywords: DOM,操作
createTime: 2018年09月27日
---

<a id='top'></a>

**本页目录：**  
[NodeList 和 HTMLCollection](#nh)  
[获取 DOM 节点的方法](#get)  
[生成节点的方法](#create)  
[DOM 操作方法](#action)  
[关系节点获取](#near)  
[元素属性设置](#props)  
[元素样式修改](#style)  
[获取元素宽高、位置](#position)

<a id='nh'></a>

## NodeList 和 HTMLCollection

#### 共同点：

1. 都是类数组对象，都有 length 属性
2. 都有共同的方法：item，可以通过 item(index)或者 item(id)来访问返回结果中的元素
3. 都是实时变动的（live），document 上的更改会反映到相关对象上（例外：document.querySelectorAll 返回的 NodeList 不是实时的）

#### 不同点：

1. NodeList 可以包含任何节点类型（包括换行、元素间的文字），HTMLCollection 只包含元素节点（elementNode），elementNode 就是 HTML 中的标签
2. HTMLCollection 比 NodeList 多一项方法：namedItem，可以通过传递 id 或 name 属性来获取节点信息

<a id='get'></a>

## 获取 DOM 节点的方法

1. `document.getElementById` ：根据 ID 查找元素，大小写敏感，如果有多个结果，只返回第一个；只能 document 调用

2. `DOM.getElementsByClassName` ：根据类名查找元素，多个类名用空格分隔，返回一个 HTMLCollection 。
3. `DOM.getElementsByTagName` ：根据标签查找元素， \* 表示查询所有标签，返回一个 HTMLCollection 。
4. `document.getElementsByName` ：根据元素的 name 属性查找，返回一个 NodeList 。只能 document 调用
5. `DOM.querySelector` ：返回单个 Node，如果匹配到多个结果，只返回第一个。
6. `DOM.querySelectorAll` ：返回一个 NodeList。不是实时的。
7. `document.forms` ：获取当前页面所有 form，返回一个 HTMLCollection ；
8. `document.documentElement`：获取 html 节点
9. `document.body`：获取 body 节点

<a id='create'></a>

## 生成节点的方法

1. `document.createElement("p")`：生成 HTML 节点元素，参数为节点类型

2. `document.createTextNode("text")`:文本内容（无标签包裹），节点间的文本、节点内的文本
3. `DOM.cloneNode()`：方法创建节点的拷贝，并返回该副本。

<a id='action'></a>

## DOM 操作方法

### 添加元素：

1. `DOM.appendChild(元素)`：在 DOM 节点末尾添加元素
2. `parentNode.insertBefore(newNode, refNode)`：在 redNode 前添加新元素 newNode
3. `DOM.insertAdjacentElement(position,ele)`：在 DOM 指定位置添加元素
4. `DOM.insertAdjacentHTML(position, text)`：同上  
   **position**  
   A DOMString representing the position relative to the element; must be one of the following strings: 相对于 p 节点  
   取值：`'beforebegin'`、`'afterbegin'`、`'beforeend'`、`'afterend'`
   ```html
   <!-- beforebegin -->
   <p>
     <!-- afterbegin -->
     foo
     <!-- beforeend -->
   </p>
   <!-- afterend -->
   ```
   **text**  
   text is the string to be parsed as HTML or XML and inserted into the tree.例如`'<div id="two">two</div>'`  
   **element**  
   要插入到树中的元素.

### 删除元素：

1. `parentNode.removeChild(node)`：删除 parentNode 下的 node 节点，注意是实时更新的，删除时 index 会时时改变
   ```js
   function removeNode(node) {
     if (!node) return;
     if (node.parentNode) node.parentNode.removeChild(node);
   }
   ```
2. `parentNode.replaceChild(newChild, oldChild)`：将 oldChild 替换为 newChild

<a id='near'></a>

## 关系节点获取

1. `parentNode` ：返回元素的父节点。Element 的父节点可能是 Element，Document 或 DocumentFragment；

2. `parentElement` ：返回元素的父元素节点，与 parentNode 的区别在于，其父节点必须是一个 Element 元素，如果不是，则返回 null；
3. `children` ：返回一个实时的 HTMLCollection ，子节点都是 Element，IE9 以下浏览器不支持；
4. `childNodes` ：返回一个实时的 NodeList ，表示元素的子节点列表，注意子节点可能包含文本节点、注释节点等；
5. `firstChild` ：返回第一个子节点，不存在返回 null，与之相对应的还有一个 firstElementChild ；
6. `lastChild` ：返回最后一个子节点，不存在返回 null，与之相对应的还有一个 lastElementChild ；
7. `previousSibling` ：返回节点的前一个节点，如果不存在则返回 null。注意有可能拿到的节点是文本节点或注释节点。
8. `nextSibling` ：返回节点的后一个节点，如果不存在则返回 null。注意有可能拿到的节点是文本节点或注释节点。
9. `previousElementSibling` ：返回前一个 element 元素节点，前一个节点必须是 Element，注意 IE9 以下浏览器不支持。
10. `nextElementSibling` ：返回后一个 element 元素节点，后一个节点必须是 Element，注意 IE9 以下浏览器不支持。

<a id='props'></a>

## 元素属性设置

1. `DOM.setAttribute(name, value)`: name 是特性名，value 是特性值，如 DOM.setAttribute('name', 'ele');

2. `DOM.getAttribute(name)`: 返回指定的特性名相应的特性值，如果不存在，则返回 nul
3. `DOM.hasAttribute(name)`: 判断 DOM 是否存在 name 的属性
4. `DOM.dataset`: 获取 html data-开头的属性

   ```js
   <div id='user' data-id='1234567890' data-user='johndoe' data-date-of-birth>
     John Doe
   </div>;

   let el = document.querySelector('#user');
   // el.id == 'user'
   // el.dataset.id === '1234567890'
   // el.dataset.user === 'johndoe'
   // el.dataset.dateOfBirth === ''

   el.dataset.dateOfBirth = '1960-10-03'; // set the DOB.
   // 'someDataAttr' in el.dataset === false

   el.dataset.someDataAttr = 'mydata';
   // 'someDataAttr' in el.dataset === true
   ```

<a id='style'></a>

## 元素样式修改

1. 直接修改元素 style 样式： _`element.sytle.xxx`只能获取到内联样式_

   ```js
   elem.style.color = 'red';
   elem.style.setProperty('font-size', '16px');
   elem.style.removeProperty('color');
   ```

2. 动态添加样式规则：
   ```js
   var style = document.createElement('style');
   style.innerHTML = 'body{color:red} #top:hover{background-color: red;color: white;}';
   document.head.appendChild(style);
   ```
3. classList 获取样式 class  
   **`DOM.classList.xxx()`:**
   - add( String [, String] )  
     添加指定的类值。如果这些类已经存在于元素的属性中，那么它们将被忽略。
   - remove( String [,String] )  
     删除指定的类值。
   - item ( Number )  
     按集合中的索引返回类值。
   - toggle ( String [, force] )  
     当只有一个参数时：切换 class value; 即如果类存在，则删除它并返回 false，如果不存在，则添加它并返回 true。  
     当存在第二个参数时：如果第二个参数的计算结果为 true，则添加指定的类值，如果计算结果为 false，则删除它
   - contains( String )  
     检查元素的类属性中是否存在指定的类值。
   - replace( String, String )  
     用一个新类替换已有类。
4. 使用`window.getComputedStyle`： _借助`window.getComputedStyle`可以获取应用到元素上的所有样式_  
   `let style = window.getComputedStyle(element, [pseudoElt]);`

   - element  
     用于获取计算样式的 Element。
   - pseudoElt [可选]  
     指定一个要匹配的伪元素的字符串。必须对普通元素省略（或 null）。

   返回的 style 是一个实时的 [CSSStyleDeclaration](https://developer.mozilla.org/zh-CN/docs/Web/API/CSSStyleDeclaration) 对象，当元素的样式更改时，它会自动更新本身。

   ```js
   let elem = document.getElementById('elem-container');
   window.getComputedStyle(elem, null).height = '100px';
   ```

<a id='position'></a>

## 获取元素宽高、位置

1. `getBoundingClientRect()`:  
   `DOM.getBoundingClientRect()`的属性：
   | Attribute | Type | Description |
   | --------- | ----- | ------------------------------------------------------------- |
   | bottom | float | Y 轴，相对于视口原点（viewport origin）矩形盒子的底部。只读。 |
   | height | float | 矩形盒子的高度（等同于 bottom 减 top）。只读。 |
   | left | float | X 轴，相对于视口原点（viewport origin）矩形盒子的左侧。只读。 |
   | right | float | X 轴，相对于视口原点（viewport origin）矩形盒子的右侧。只读。 |
   | top | float | Y 轴，相对于视口原点（viewport origin）矩形盒子的顶部。只读。 |
   | width | float | 矩形盒子的宽度（等同于 right 减 left）。只读。 |
   | x | float | X 轴，相对于视口原点（viewport origin）矩形盒子的左侧。只读。 |
   | y | float | Y 轴，相对于视口原点（viewport origin）矩形盒子的顶部。只读。 |
   clientRect 是一个 DOMRect 对象，包含 width、height、left、top、right、bottom，它是相对于窗口顶部而不是文档顶部，**滚动页面时它们的值是会发生变化的**。

1. `DOM.clientWidth`：表示元素的内部宽度，以像素计。盒模型的 content+padding
1. `DOM.offsetLeft`：返回当前元素左上角相对于 HTMLElement.offsetParent (距离元素的最近的父级定位元素) 节点的左边界偏移的像素值。
1. `DOM.scrollLeft` 属性可以读取或设置元素滚动条到元素左边的距离。
