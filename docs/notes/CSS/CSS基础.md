# `CSS`基础

## 概念

层叠样式表(`cascading style sheet`)。



**写法：**

```
选择器{
  属性名: 属性值;
}
```

**内联样式：**

```html
<div style="width: 100px;"></div>
```

**内部样式表：**`type`可填写,告诉浏览器是文本样式。

```html
<head>
  <style type="text/css"></style>
</head>
```

**外部样式表：**外部引入`css`文件，`rel`表示引用链接与`html`文档的关系是样式表关系，`href`表示引用路径。

```html
<head>
  <link rel="stylesheet" type="text/css" href="./index.css" />
</head>
```

**优先级：**

默认情况下，内联样式(少用) > 内部样式表(测试时用) > 外部样式表(常用)。





## 加载过程

![image-20220616015754677](http://note-img-bed.dt-code.fun//image-20220616015754677.png)

**浏览器加载页面的过程：**

1. 输入网址时请求网络资源，下载`HTML`,`CSS`,`JS`,图片等资源文件。
2. 下载`HTML`时开始语法解析，形成一个树形结构的`DOM`树。
3. 在引用外部样式表的时会异步新开一个下载`CSS`文件的线程。
4. 下载`CSS`文件以后会解析`CSS`语法，形成`CSS`规则树。
5. `DOM`树和`CSS`规则树合并构建了渲染树。



## 选择器

`id`选择器：特性是唯一性。

```css
#box{...}
```

类选择器：不同标签同一个类可以定义同一种样式,样式的统一性。

```css
.box{...}
```

标签选择器：弊端是对所有标签生效，适用于初始化标签。

```css
div{...}
```

通配符选择器：适用于所有`HTML`标签。

```css
*{...} 
```

属性选择器：使用标签上的某一个属性去判断，场景是`input`表单。

```css
[type="text"]{...}
```

对应的表单类型。

```html
<input type="text" />
<input type="password" />
```

派生选择器(父子)：浏览器对父子选择器的匹配规则顺序是从右往左，从里层到外层，因为非父子关系也可以越级匹配，如果从左到右会非常影响性能。

```css
strong em{...}
.nav header h3 span{...}
```

```html
<strong><em>hello</em></strong>
<div class="nav">
  <header><h3><span></span></h3></header>
</div>
```

并列选择器：情况1是标签接类，企业不用，适用初学者。

```css
h1.title{...}
.box{...}
.box1{ color: green }
.box2{ color: orange }
```

```html
<h1 class="title">hello</h1>
<div class="box box1"></div>
<div class="box box2"></div>
```

分组选择器：

```css
h1,
p {...}
```



## 权重

增加权重写法(慎用)：

```css
div{ background-color: red !important; }
```

优先级：

`!important` > `id`选择器 > 类选择器 = 属性选择器 > 标签选择器 > 通配符选择器  



**权重值：**

| 选择器         | 权重值 |
| -------------- | ------ |
| 通配符         | 0      |
| 伪元素，标签   | 1      |
| 类，属性，伪类 | 10     |
| `id`           | 100    |
| 内联样式       | 1000   |
| `!important`   | 正无穷 |





## 边框

定义小三角形的写法：

```css
.box {
  width: 0;
  height: 0;
  border: 100px solid transparent;
  border-left-color: orange;
}
```

效果：

<img src="http://note-img-bed.dt-code.fun//image-20220616202035091.png" alt="image-20220616202035091" style="zoom:25%;" />

原理：盒子宽高为0，只设置单侧边框颜色，其余3侧的颜色为透明即可。

<img src="http://note-img-bed.dt-code.fun//image-20220616202111671.png" alt="image-20220616202111671" style="zoom:25%;" />



## 单位

`em`在默认情况下`1em = 16px`，它相当于空格一个字符。



## 文本

| 文本     | 属性名            | 属性值                                | 描述                     |
| -------- | ----------------- | ------------------------------------- | ------------------------ |
| 文本对齐 | `text-align`      | `left`/`right`/`center`               | 左右,居中                |
| 垂直对齐 | `vertical-align`  | `top`/`middle`/`bottom`               | 上中下                   |
| 文字装饰 | `text-decoration` | `overline`/`line-through`/`underline` | 上中下划线               |
| 文字缩进 | `text-indent`     | `5px`/`2em`                           | 用于指定文本第一行的缩进 |
| 行高     | `line-height`     | `22px`                                | 行之间的间距             |
| 文本阴影 | `text-shadow`     | 水平阴影（`2px`）和垂直阴影（`2px`）  | 为文本添加阴影           |
| 字体样式 | `font-style`      | `normal`/`italic`                     | 正常，斜体               |

容器内多行文本居中的办法：

1. 将容器的`display`设置为`table`。
2. 将容器内的文本的`display`设置成`table-cell`(单元格属性)。
3. 将容器内的文本`vertical-align`设置成`middle`。



## 省略

省略三件套

```css
div{
  white-space: nowrap; //不换行
  overflow: hidden; //溢出隐藏
  text-overflow: ellipsis; //隐藏部分省略号显示
}
```





## 伪类

伪类用于定义元素的特殊状态。例如，它可以用于：

- 设置鼠标悬停在元素上时的样式。
- 为已访问和未访问链接设置不同的样式。
- 设置元素获得焦点时的样式。

```css
/* 鼠标悬停链接 */
a:hover {
  color: #FF00FF;
}

//找指定元素
span:last-children{
  color: orange;
}
```



## 伪元素

CSS 伪元素用于设置元素指定部分的样式。例如，它可用于：

- 设置元素的首字母、首行的样式。
- 在元素的内容之前或之后插入内容。

```css
::selection {
  color: red; 
  background: yellow;
}
```

| 选择器     | 例子        | 例子描述                       |
| :--------- | :---------- | :----------------------------- |
| `::after`  | `p::after`  | 在每个`<p>`元素之后插入内容。  |
| `::before` | `p::before` | 在每个 `<p>`元素之前插入内容。 |



## 布局

块级元素(`block element`)，行内元素(`inline element`)，行内块元素(`inline-block element`)。

| `display`布局  | 独占一行 | 宽高设置 |
| -------------- | -------- | -------- |
| `block`        | 是       | 是       |
| `inline`       | 否       | 否       |
| `inline-block` | 否       | 是       |

> **补充：**
>
> - `display:none`不保留节点
> - `visibility:hidden`保留节点



## 盒子模型

`box model`，宽高所划分的区域，包含外边距，边框，内边距。默认情况下，内边距和边框是不占设定盒子的宽高的，如果想占盒子宽高，则需要定义`box-sizing: border-box;`，解开写法：`box-sizing: content-box;`。

> `IE6,7`兼容写法：
>
> - `-moz-box-sizing: border-box;`(火狐)，
>- `-webkit-box-sizing: border-box;`(`chrome safari`)，
> - `-ms-box-sizing: border-box;`，
>- `-o-box-sizing: border-box;`(`opera`)



## 塌陷

子元素盒子设置`margin-top`时同时导致父盒子一起塌陷下来，`margin`会存在高度塌陷问题。

**解决方案：**

1. 使其转为BFC元素解决
2. 父盒子定义透明的边框`border-top: 1px solid transparent;`

## 定位

绝对定位中的两栏设计，左侧是固定宽度，右侧则自适应。

- 左侧：固定宽度
- 右侧：绝对定位，`margin-left`



## 浮动

块级元素是无法识别浮动元素的位置，需要父级上清除浮动(只能块级元素)。

```css
.clearfix:after {
  content: '';
  display: table;
  clear: both;
}
```



## `background`

```css
background: url(xxx) no-repeat 宽 高;
/* 图片居中 */
background-position: center center; //or 50% 50% or 10px 10px 
/* 图片缩放 如浏览器拉宽也不会变形 */
/* 占满整个盒子,多余部分裁切,不影响图片比例 contain相反 */
background-size: cover; 
/* 固定背景图片,滚动条无法滚动图片 */
background-attachment: fixed; 
```





## BFC

BFC(`block formatting contexts`)块级格式化上下文的特性是`css2.1`提出来的概念.

| 布局定位方案                     | 描述                                                   |
| -------------------------------- | ------------------------------------------------------ |
| 普通流(`normal flow`)            | 至上而下，内联元素水平排列直到占满换行                 |
| 浮动流(`flow`)                   | 脱离普通流，浮动元素左右偏移                           |
| 绝对定位(`absolute positioning`) | 脱离文档流之上的层，不影响兄弟元素布局，由坐标绝对定位 |
| `BFC`                            | 独立的容器，不会对外界产生影响，普通流范畴             |

***如何让元素成为BFC元素？***

如`<body>`它本身就是一个BFC元素，定义以下样式属性会使元素具备BFC特性。

| 属性       | 属性值                      |
| ---------- | --------------------------- |
| `float`    | `left`/`right`              |
| `position` | `absolute`/`fixed`          |
| `display`  | `inline-block`/`table-cell` |
| `flex`     | `1`/`...`                   |
| `overflow` | `hidden`/`auto`/`scroll`    |

***BFC元素会导致什么作用？***

它会导致嵌套子盒子设置`margin`时存在合并的问题，解决办法将其父盒子转为BFC元素。

***BFC解决了什么问题？***

1. `margin`合并的问题
2. 浮动元素覆盖的问题
3. 浮动流造成父级元素高度塌陷的问题
4. `margin`塌陷的问题



## 规范

`CSS`的书写顺序：

```css
div {
  /* 显示属性 */
  display, position, float, clear,
  /* 自身属性 */
  width, height, margin, padding, border, background
  /* 文本属性 */
  color, font, text-align, vertical-align, whitespace
}
```



## 命名

选择器符合单词用中横线。

| 选择器       | 符号                  |
| ------------ | --------------------- |
| 复合单词     | `-`中横线             |
| `JS`钩子`ID` | `_`下划线，如`J_data` |

