# HTML



## 概念

超文本标记语言(`HyperText Markup Language`)，不是编程语言(没有逻辑的语言)。

使用` word `文档来编写文章，本质上是文本类型。超文本指的是超越了文本的特性，用一种标记来说明文档所代表的意义。



**网页设计概念**：

- 物理性标签
- 语义性标签：每个标签是一个单词的缩写 (`<em>`即 `emphasize`), 迎合搜素引擎爬虫程序

**语义化标签**

| 标签名                | 描述       |
| --------------------- | ---------- |
| `<strong></strong>`   | 强调       |
| `<em></em>`           | 加强语气   |
| `<del></del>`         | 删除标签   |
| `<ins></ins>`         | 下划线     |
| `<address></address>` | 斜体的地址 |

**物理性标签**

| 标签名    | 描述                        |
| --------- | --------------------------- |
| `<b></b>` | 加粗                        |
| `<i></i>` | 斜体标签 开发时用于添加图标 |



## 元素分类

元素指的是标签加上内部的内容。元素有内联元素，块级元素，内联块级元素。

| 类型                                 | 标签                                                         | 特性                     |
| ------------------------------------ | ------------------------------------------------------------ | ------------------------ |
| 内联元素(`inline element`)           | `strong`/ `em`/ `del`/ `ins`/  `sub`/  `sup`/ `span`/`label`/`a` | 不独占一行, 无法定义宽高 |
| 块级元素(`block element`)            | `p`/ `h1`/ `div`/ `address`/ `ul`/ `ol`/ `li`/`dd`/`dt`/`dl`/`table`/`form`/`fieldset`/`legend` | 独占一行, 可以定义宽高   |
| 内联块级元素(`inline-block element`) | `input`/`img`/`select`/`textarea`/`iframe`，以上皆可         | 不独占一行，可以定义宽高 |





## 标签

单双标签有`<h1></h1>` ，或 `<br/>`。标签属性是对当前标签的一种设置，如设置图片地址 `src=""`。

## 根标签

`<head>`标签向浏览器传递基本的信息和配置。`<body>`标签区域是页面呈现区域。`<head>`标签里的三大件有`<title>`标签，`<meta name="description">`标签，`<meta name="keywords">`标签。搜素引擎认知的优先级：`title > description > keywords`。

```html
<!DOCTYPE html>
<html>
  <head></head>
  <body></body>
</html>
```

## 标签结构

兼容性模式`docment.compatMode`：

- 有`<!DOCTYPE html>`: `CSS1Compat`(`W3C `标准模式)
- 没有`<!DOCTYPE html>`: `BackCompat`(怪异模式)

```html
//html5声明哪一个版本进行编写供浏览器识别
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    //主页：网站名称 + 主要关键字/关键词的描述
    //详情页：详情名称 + 网站名称 + 简介
    //列表页：分类名称 + 关键字 + 网站名称
    <title></title>
    //meta标签设置 charset字符集编码
    //关于GB2312 中国信息处理国家标准码 -> 简体中文编码
    //关于GBK 汉族扩展规范 -> 扩大汉族收录，增加了繁体中文，增加了藏蒙维吾尔文字等小数名族的文字
    //关于UTF-8 unicode 万国码
    <meta charset="UTF-8" />
    //keyword 100字符 网站名称 + 分类信息 + 网站名称
    <meta name="keyword" content="关键词信息" />
    //description 描述信息 80-120汉字
    //综合title + keywords的简单描述
    <meta name="description" content="描述信息" />
  </head>
  <body></body>
</html>
```



## 标题标签

`<h1></h1>`, `<h2></h2>`, `<h3></h3>`, `<h4></h4>`, `<h5></h5>`, `<h6></h6>`

**特性：**

- 独占一行
- 粗体
- `h1 = 2em`
- `h2 = 1.5em`
- `h3 = 1.17em`
- `h4 = 0em`
- `h5 = 0.83em`
- `h6 = 0.67em`

浏览器默认文字大小为 `16px -> 2em -> 16px * 2 = 32px`

## 段落标签

`<p></p>`

**特性：**

- 独占一行
- `margin = 16px`

> 注：行间内联样式缩进 2 字符 `style="text-indent: 2em"`



## 盒子标签

`<div></div>`，容器标签，具有宽高，独占一行，`division `标签，布局用具有宽高的块状元素标签。`<br>`和`<hr>`分割换行在大型项目中不推荐使用，可以用实体字符`&nbsp;`代替。



## 图片标签	

```html
//src指的是source资源
//alt图片加载失败时显示信息
<img src="xxx" alt="xxx" />
```





## 锚点标签

锚点标签是超链接标签，`anchor`，`<a href="#"></a>` ,`href`的缩写是超文本引用`hypertext reference` 。

**`<a> `标签的作用：**

- 超链接标签
- 打电话
- 发邮件
- 锚点定位
- 协议限定符

```html
<a href="https://www.baidu.com"></a>
<a href="tel:13700000000">联系我</a>
<a href="mailto:abc@abc.com">邮件我</a>
<a href="javascript:alert('我是a标签')">邮件我</a>
```

## 范围标签

`<span></span>`

**特性：**

- 低调不显摆
- 默认没有样式

**作用：**

1. 在一个文本之内区分与其他文本的样式差别，给一段文本的中间某一段文字或某一个文字或某一个区的文字加上不同的样式来区分于其他文本的区别。
2. 文本中无法单独获取的东西，利用 `span `标签就可以获取。

```html
<p>我是一个非常非常<span style="color: red;" id="niu">牛</span><span style="color: blue;">X</span>的前端工程师</p>
```

```js
var niu = document.getElementById('niu');
console.log(niu.innerText); // 牛
```



## 序列标签

`ol`有序列表标签 ， `ul`无需列表标签 ， `dl`定义列表。

**关于有序列表 `order list`:**

- 当字母超过 26 位，会 `aa `显示，依次类推
- 除了数字，其他不能中途开始
- `reversed="reversed"`属性为倒序，如果倒序的数字小于实际数字，会以负数显示

```html
//阿拉伯数字
<ol type="1">
  <li>HTML</li>
  <li>CSS</li>
  <li>JavaScript</li>
  <li>PHP</li>
  <li>GO</li>
</ol>

//print
1.HTML
2.CSS
3.JavaScript
4.PHP
5.GO
```

```html
//大写字母
<ol type="A">
  <li>HTML</li>
  <li>CSS</li>
  <li>JavaScript</li>
  <li>PHP</li>
  <li>GO</li>
</ol>

//print
A.HTML
B.CSS
C.JavaScript
D.PHP
E.GO
```

```html
//小写字母
<ol type="a">
  <li>HTML</li>
  <li>CSS</li>
  <li>JavaScript</li>
  <li>PHP</li>
  <li>GO</li>
</ol>

//print
a.HTML
b.CSS
c.JavaScript
d.PHP
e.GO
```

```html
//罗马数字
<ol type="i">
  <li>HTML</li>
  <li>CSS</li>
  <li>JavaScript</li>
  <li>PHP</li>
  <li>GO</li>
</ol>

//print
i.HTML
ii.CSS
iii.JavaScript
iv.PHP
v.GO
```

```html
//除了数字，其他不能中途开始
<ol type="1" start="10">
  <li>HTML</li>
  <li>CSS</li>
  <li>JavaScript</li>
  <li>PHP</li>
  <li>GO</li>
</ol>

//print
10.HTML
11.CSS
12.JavaScript
13.PHP
14.GO
```

```html
//如果倒序的数字小于实际数字，会以负数显示
<ol type="1" start="5" reversed="reversed">
  <li>HTML</li>
  <li>CSS</li>
  <li>JavaScript</li>
  <li>PHP</li>
  <li>GO</li>
  <li>GO</li>
  <li>GO</li>
  <li>GO</li>
</ol>

//print
5.HTML
4.CSS
3.JavaScript
2.PHP
1.GO
0.GO
-1.GO
-2.GO
```

**关于无序列表 `unorder list`:**

- 横排或竖排排列的块级布局

```html
//disc默认为圆点
//square 为小方块
//circle 为空心圆
<ul type="disc">
  <li>HTML</li>
  <li>CSS</li>
  <li>JavaScript</li>
  <li>PHP</li>
  <li>GO</li>
</ul>
```

**关于定义列表 `definition list`:**

```html
//dl definition list
//dt definition term
//definition description
<dl type="disc">
  <dt></dt>
  <dd>我要成为WEB开发工程师</dd>
  <dd>我正在学习前端开发</dd>
</dl>
```

## 下拉菜单标签

适用于手机端，网页端最好自己去封装一个。

```html
<select name="" id="">
  <option value="">111</option>
  <option value="">222</option>
  <option value="">333</option>
</select>
```

## 表格标签

标题标签 `caption`，作用是用来布局的。

```html
<!-- 标题标签caption -->
<!-- tr table row 表格行标签 包裹-->
<!-- th table header cell 表头标签  -->
<!-- td table deta cell 单元格标签 -->
<!-- border 边距 -->
<!-- cellpadding 单元格内边距 -->
<!-- cellspacing 单元格间距 -->
<!-- colspan 列合并 -->
<!-- rowspan 行合并 向下合并 -->
<!-- align="left|center|right" 居左居中居右 -->
<table border="1" cellpadding="10" cellspacing="10">
  <caption>VIP班级学生联络表</caption>
  <!-- 页眉 -->
  <tr>
    <th>ID</th>
    <th>姓名</th>
    <th>电话</th>
    <th>备注</th>
  </tr>
  <tr>
    <td align="center">1</td>
    <td align="center">东东</td>
    <td align="center">13922222222</td>
    <td align="center">班长</td>
  </tr>
  <tr>
    <td>信息</td>
    <td>3班</td>
    <td colspan="2">13位学生</td>
  </tr>
  <tr>
    <td>2</td>
    <td>张三</td>
    <td>13922222333</td>
    <td rowspan="2">小队长</td>
  </tr>
  <tr>
    <td>3</td>
    <td>李四</td>
    <td>13922222444</td>
  </tr>
  <!-- 页尾 -->
  <tr>
    <td colspan="4" align="right">
      *学生都要成为WEB开发工程师
    </td>
  </tr>
</table>
```

```html
<!-- thead tbody tfoot 必须同时出现 -->
<!-- 如果存在大量数据情况，先加载页眉页尾部分，再加载主体 -->
<!-- thead 表格页眉标签 -->
<!-- tbody 表格主体标签 -->
<!-- tfoot 表格页尾标签 -->
<table border="1" cellpadding="10" cellspacing="10">
  <caption>VIP班级学生联络表</caption>
  <!-- 页眉 -->
  <thead>
    <tr>
      <th>ID</th>
      <th>姓名</th>
      <th>电话</th>
      <th>备注</th>
    </tr>
  </thead>
  <!-- 主体 -->
  <tbody>
    <tr>
      <td align="center">1</td>
      <td align="center">东东</td>
      <td align="center">13922222222</td>
      <td align="center">班长</td>
    </tr>
    <tr>
      <td>信息</td>
      <td>3班</td>
      <td colspan="2">13位学生</td>
    </tr>
    <tr>
      <td>2</td>
      <td>张三</td>
      <td>13922222333</td>
      <td rowspan="2">小队长</td>
    </tr>
    <tr>
      <td>3</td>
      <td>李四</td>
      <td>13922222444</td>
    </tr>
  </tbody>
  <!-- 页尾 -->
  <tfoot>
    <tr>
      <td colspan="4" align="right">
        *学生都要成为WEB开发工程师
      </td>
    </tr>
  </tfoot>
</table>
```





## 框架标签

迅速在页面中搭建一个框架。`<frameset>`标签不能嵌套在`<body>`标签内部。

定义行的占比，上半部分10%，下半部分90%。定义列的占比，左半部分20%，右半部分80%。前期布局方案，目前比较少用。`<frameset>`的延申是`<iframe>`标签，是一个内联元素，区别在于它仅仅占有页面的一部分而不像`<frameset>`占用页面的全部，如分栏布局。`<iframe>`的缺点是显示两个窗口，两个滚动条，不便于爬虫，没有源代码，SEO搜索不到。

```html
<framset row="10%, 90%">
  <frame src="top.html"/>
  <framset cols="20%, 80%">
    <frame src="left.html"/>
    <frame src="right.html"/>
  </framset>
</framset>
```







## 字符实体

| 显示结果 | 描述   | 实体名称 | 实体编号 |
| :------- | :----- | :------- | :------- |
| ` `      | 空格   | `&nbsp`  | `&#160`  |
| `<`      | 小于号 | `&lt`    | `&#60`   |
| `>`      | 大于号 | `&gt`    | `&#62`   |
| `&`      | 和号   | `&amp`   | `&#38`   |



## 上下标标签

`sup`上标(superscripted), `sub`下标(subscripted)。

`<sup></sup>` & `<sub></sub>`

```
前端<sup><a href="#">[1]</a></sup>
10<sup>5</sup>
Na<sup>+</sup>
H<sub>2</sub>SO<sub>4</sub>
```

**显示效果为：**

前端<sup><a href="#">[1]</a></sup>

10<sup>5</sup>

Na<sup>+</sup>

H<sub>2</sub>SO<sub>4</sub>





## 标签属性

| 属性名   | 作用                   |
| -------- | ---------------------- |
| `href`   | 跳转链接               |
| `src`    | 图片地址               |
| `target` | `_blank`目标新开空页签 |

## 书写标准

- 标签只能小写
- 属性名也只能小写
- 属性值用双引号包裹

## 标签嵌套

```html
<strong>
  <em></em>
</strong>
```

```html
<div>
  <p></p>
</div>
```

**判断标签能否嵌套:**

- 内联元素可以嵌套内联元素
- 块级元素可以嵌套任何元素
- `p`标签不可以嵌套 `div `标签
- `a `标签不可以嵌套`a` 标签





## meta 标签

移动端开发需要 `meta `标签设置，视口设置，移动端内核`webkit `(首选)

```html
//renderer渲染模式/渲染器
//渲染器为webkit
<meta name="renderer" content="webkit"/>
```

```html
//ie内核有两种模式：兼容模式/标准模式
//兼容模式
<meta name="renderer" content="ie-comp"/>

//标准模式
<meta name="renderer" content="ie-stand"/>
```

```html
//IE8特性：用最高的渲染模式向后渲染
<meta http-equiv="X-UA-Compatible" content="IE-edge"/>
```

```html
//某一手机菜单栏设置
<meta name="apple-mobile-web-app-status-bar-style" content="black"/>
```

```html
//视口
//设备宽度
//缩放比例 1倍
//maximun-scale=1,minimun-scale=1或user-scable=no 2选1
<meta
  name="viewport"
  content="width=device-width"
  initial-scale=1
  maximun-scale=1
  minimun-scale=1
  user-scable=no
/>
```



## 表单标签

表单是用户提交数据的时候使用的，第一要素是数据的名称，第二要素是数据的值。表单信息一般前后端都需要通过MD5摘要加密算法(不可逆加密算法)校验，且加密方式是不需要密钥的。

- `<form>`标签是一个表单的总标签，一个块级元素，没有任何样式。`method`属性定义提交的方式。
- `action`属性是提交后端数据的地址。
- `<input>`是一个内联块级元素，具有宽高。
- 若想通过提交按钮提交的`url`地址能接收表单信息，需要在`<input>`标签里定义`name`属性来定义提交的信息。
- `maxlength`属性可以限制最大的提交信息的字符长度。
- `<textarea>`标签里的`cols`和`rows`属性来定义可见宽度，以平均字符数为准，如默认字体为`16px`时，计算后约为宽度为`8px * cols + 17px`宽度。

```html
<form>
  <p>username: <input type="text" name="username"/></p>
  <p>password: <input type="password" name="password" /></p>
  <p><input type="submit" value="login"/></p>
  <select name="lang">
    <option value="">Please choose</option>    
    <option value="js">JavaScript</option>    
    <option value="java">Java</option>    
    <option value="python">Python</option>    
  </select>
  <textarea cols="30" rows="20"></textarea>
</form>
```

`<label>`标签是一个内联元素，用处是自定义单项或者多选。

- `for`属性可以关联`<input>`标签里的`id`属性可以点击聚焦该`<input>`标签。
- `readonly`属性一旦定义了就无法改变`<input>`标签里的`value`的值 
- `disable`属性定义了会无法对输入框进行修改，并导致数据无法提交。

```html
<form>
  <label for="username">username</label>
  <input type="text" id="username" name="username" value="xxx" readonly>
</form>
```

使用`<label>`标签来做单选框。

- `checked`属性来定义默认选中项。
- `id`属性来关联当前`<input>`标签和`<label>`标签。
- `value`属性来定义后端区别的选中值。
- `name`属性来定义`url`地址的参数。

```html
<form>
  <input type="radio" id="male" name="sex" value="male"/>
  <label for="male">men</label>
  <input type="radio" id="female" name="sex" value="female"/>
  <label for="female">women</label>
</form>
```

使用`<label>`标签来做多选框。

```html
<form>
  <h3>Please choose your coding language</h3>  
  <p>
    <input type="checkbox" id="code-js" value="js" name="favorLang" />
    <label for="code-js">JavaScript</label>
  </p>
  <p>
    <input type="checkbox" id="code-php" id="code-php" value="php" name="favorLang"/>
    <label for="code-php">Php</label>
  </p>
  <p>
    <input type="checkbox" id="code-java" id="code-java" value="java" name="favorLang"/>
    <label for="code-java">Java</label>
  </p>
</form>
```



使用`<fieldset>`标签可以对部分表单内容进行打包分组。

```html
<form>
  <fieldset>
    <legend>login form</legend>
    <p>
      <label for="username">username</label>
      <input type="text" id="username"/>
    </p>
    <p>
      <label for="password">password</label>
      <input type="text" id="password"/>
    </p>
    <p>
      <input type="submit" />
    </p>
  </fieldset>
</form>
```







## link/import

**`link `和 `import `的区别：**

1. 从属关系不同：`link `是 `html `标签，`import `是 `css `关键字
2. `link: rel `属性是关联属性设置
3. 加载顺序不同：`link `引入 `css `是同时异步加载，`import `页面加载完毕后才加载
4. 兼容性：`link`不存在兼容性，`import `是 `css2.1 IE5 `以上才兼容
5. `dom: link` 可以被 `dom`操作，`import` 不行
6. `link `引入的样式权重大于 `import `引入的样式
