# Express

## 概述

`Express` 是一个保持最小规模的灵活的 `Node.js Web` 应用程序开发框架，为 `Web` 和移动应用程序提供一组强大的功能。是一个后端框架，帮助完成编写服务端代码。

## 安装

安装`express`运行依赖。

```
$ npm install express --save
```

安装`nodemon`监听`app.js`文件。

```
npm i -D nodemon@1.19.1
```

修改脚本。

```json
{
  "scripts": {
    "start": "nodemon app.js"
  }
}
```

## 应用

简单创建Web 应用程序。

```js
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

//解析post请求的配置 定义处理非标准请求
//因为req.body直接访问会undefined需要解析器
app.use(bodyParser.urlencoded({ extented: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
```



## 路由

**路由**是指确定应用程序如何响应客户端对特定端点的请求，该端点是 URI（或路径）和特定的 HTTP 请求方法（GET、POST 等）。每个路由可以有一个或多个处理函数，当路由匹配时执行。

```js
app.get('/', function (req, res) {
  res.send('Hello World!')
});

app.post('/', function (req, res) {
  res.send('Got a POST request')
});
```

**新路由对象**创建，可以像应用程序一样添加中间件和 HTTP 方法路由（例如`get`、`put`、`post`等），解耦`app`对象并单独抽离新路由对象去管理路由请求

```js
//创建新的路由对象并抽离路由请求的代码
var router = express.Router([options]);

router.get('/', function (req, res) {
  res.send('Hello World!')
});

//app注册使用
app.use(router);
```

路由逻辑抽离写法。

```js
//新建routes目录
//新建admin.js和shop.js来管理路由相关的代码
//引入express
const express = require('express');
//引入express里Router()方法
const router = express.Router();

//注册路由
router.get('/add-product', (req, res, next) => {
  res.send(
    `<form action="/product" method="POST">
      <input type="text" name="title" />
      <button type="submit" >添加产品</button>
    </form>`
  );
});

router.post('/product', (req, res, next) => {
  console.log('产品页面...');
  //重定向到根路径
  res.redirect('/');
  //获取请求体里携带的信息
  console.log(req.body);
  res.send('<h1>Hello,Express!</h1>');
});

//导出router对象
module.exports = router;

//在入口文件app.js引入router
const adminRoutes = require('./routes/admin');

//使用导入路由函数
app.use(adminRoutes);
```

二级路由写法。

```js
//在入口文件app.js注册路由时加入公共地址/admin
//类似访问/admin/add-product
app.use('/admin', adminRoutes);

//浏览器访问http://localhost:3000/add-product失效
//浏览器访问http://localhost:3000/admin/add-product成功
```



## 404

如果访问没有定义的路由地址，应该报404。

```js
//定义所有请求地址的中间件
//定义在所有中间件底下
app.use((req, res, next) => {
  res.status(404).send('<h1>页面走丢了!</h1>');
});
```

定义404页面。

```js
//views目录下新建404.html文件
//app.js设置
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});
```





## 请求对象

表示 HTTP 请求，并具有请求查询字符串、参数、正文、HTTP 标头等的属性。

| 属性            | 描述                                                         |
| --------------- | ------------------------------------------------------------ |
| `req.baseUrl`   | 获取请求url路径                                              |
| `req.body`      | 一个对象，包含 POST 请求参数(`body-parser`解析)。这样命名是因为 POST 请求参数在 REQUEST 正文中传递，而不像查询字符串在 URL 中传递。 |
| `req.cookies`   | 一个对象，包含从客户端传递过来的 cookies 值                  |
| `req.hostname`  | 获取请求主机名                                               |
| `req.ip`        | 获取请求ip                                                   |
| `req.params.xx` | 一个数组，包含命名过的路由参数                               |
| `req.path`      | 请求路径(不包含协议、主机、端口或查询字符串)                 |
| `req.route`     | 关于当前匹配路由的信息。主要用于路由调试。                   |
| `req.headers`   | 从客户端接收到的请求报头                                     |

`app.use()`处理静态请求`post`。

```js
app.use('/test', (req, res, next) => {
  console.log('中间件中...');
  res.send(
    `<form action="/product" method="POST">
      <input type="text" name="title" />
      <button type="submit" >添加产品</button>
    </form>`
  );
});

app.use('/product', (req, res, next) => {
  console.log('产品页面...');
  //重定向到根路径
  res.redirect('/');
  //获取请求体里携带的信息
  console.log(req.body);
  res.send('<h1>Hello,Express!</h1>');
});

//浏览器/test页面输入test提交 终端显示拿到对象{title:'test'}
```









## 响应对象

表示 Express 应用程序在收到 HTTP 请求时发送的 HTTP 响应。

| 方法                              | 描述            |
| --------------------------------- | --------------- |
| `res.send()`                      | 响应HTTP正文    |
| `res.append('Set-Cookie', 'xxx')` | 添加响应头信息  |
| `res.cookie('maxAge', xxx)`       | 设置cookies信息 |
| `res.end()`                       | 结束响应进程    |
| `res.json()`                      | 响应`json`数据  |
| `res.get('Content-Type')`         | 获取请求头信息  |
| `res.redirect('/users')`          | 响应重定向      |
| `res.render(view, 'xxx.ejs')`     | 响应渲染模板    |
| `res.sendFile()`                  | 上传文件        |
| `res.status(304)`                 | 响应状态码      |



## 响应`html`

给用户响应`html`文件。根目录创建文件夹`/views`，使用`MVC`模式定义用户看到的`html`文件，`/views`目录新建`shop.html`文件和`add-product.html`文件。

```html
//add-product.html
<header>
  <nav>
    <ul>
      <li><a href="/">商店</a></li>
      <li><a href="/admin/add-product">添加产品</a></li>
    </ul>
  </nav>
</header>
<main>
  <form action="/admin/product" method="POST">
    <input type="text" name="title">
    <button type="submit">添加产品</button>
  </form>
</main>
```

```html
//shop.html
<header>
  <nav>
    <ul>
      <li><a href="/">商店</a></li>
      <li><a href="/admin/add-product">添加产品</a></li>
    </ul>
  </nav>
</header>
<main>
  <h1>我的产品</h1>
  <p>这是产品列表...</p>
</main>
```

回到路由文件。

```js
//routes > shop.js
//引入path模块
const path = require('path');

//响应指定目录文件
router.get('/', (req, res, next) => {
  //path.join(访问全局变量, 字符串分割的目录)
  //sendFile()该方法会自动设置Content-Type
  res.sendFile(path.join(__dirname, '../', 'views', 'shop.html'));
});

//浏览器访问http://localhost:3000/ 显示shop.html文件
```





## 中间件

`Express` 是一个路由和中间件 `Web` 框架，其自身功能最少：`Express` 应用程序本质上是一系列中间件函数调用。

**中间件**函数是可以访问请求对象( `req`)、响应对象( `res`) 以及应用程序请求-响应周期中的下一个中间件函数的函数。下一个中间件通常由一个变量为`next`的函数。

中间件函数可以执行以下任务：

- 执行任何代码
- 更改请求和响应对象
- 结束请求-响应周期
- 调用堆栈中的下一个中间件函数

> 注：如果当前中间件函数没有结束请求-响应循环，它必须调用`next()`以将控制权传递给下一个中间件函数。否则，请求将被挂起。

添加中间价操作。

```js
app.use((req, res, next) => {
  console.log('中间件中...');
});
```

在上一个中间件内部执行`next()`会继续执行后面的中间件。

```js
app.use((req, res, next) => {
  console.log('中间件中...');
  next();
});
```

通过在根路径上面定义其他请求地址的中间件实现不同请求地址响应不同页面的功能。

```js
//app.use(请求地址，请求该地址的回调函数);
app.use('/test', (req, res, next) => {
  console.log('中间件中...');
  res.send('<h1>Hello,Test!</h1>');
});

app.use('/', (req, res, next) => {
  console.log('中间件中...');
  res.send('<h1>Hello,Express!</h1>');
});
```





## 静态文件

为了提供诸如图像、`CSS` 文件和 `JavaScript` 文件之类的静态文件，请使用 `Express` 中的 `express.static` 内置中间件函数。

```js
//将 public 目录下的图片、CSS 文件、JavaScript 文件对外开放访问
app.use(express.static(path.join(__dirname, 'public')));

//并在各个html里link引入css
<link rel="stylesheet" href="/css/index.css">
```



## MVC

`MVC` 模式代表 `Model-View-Controller`（模型-视图-控制器） 设计模式。

- `M：Model`数据模型(模型层)，操作数据库(增删改查)
- `V：View`视图层，显示视图或视图模板
- `C：Controller`控制器层(逻辑层)，数据和视图关联挂载和基本的逻辑操作





## 模板处理

**模板引擎**使您能够在应用程序中使用静态模板文件，数据分析，数据渲染。在运行时，模板引擎将模板文件中的变量替换为实际值，并将模板转换为发送给客户端的 `HTML` 文件。这种方法使设计 `HTML` 页面变得更加容易。

安装`ejs/pug/handlebars`依赖。

```
npm i -S ejs@2.6.2
npm i -S pug@2.0.4
npm i -S express-handlebars@3.1.0
```

设置好视图引擎。

```js
app.set('view engine', 'pug');
//设置视图文件目录路径
app.set('views', 'views');
```

创建模板文件 `index.pug`。

```
html
  head
    title= title
  body
    h1= message
```

`pug html`写法。

```
doctype html
html(lang="en")
  head
    meta(charset="UTF-8")
    meta(http-equiv="X-UA-Compatible", content="IE=edge")
    meta(name="viewport", content="width=device-width, initial-scale=1.0")
    title 商店
    link(rel="stylesheet", href="/css/index.css")
  body 
    header.shop-header
      nav.shop-nav
        ul.shop-list 
          li.shop-list-item 
            a.active(href="/") 商店
          li.shop-list-item 
            a(href="/admin/add-product") 添加产品
```

动态内容输出，将数据注入模板。

```js
//render(模板名称, 数据)方法
router.get('/', (req, res) => {
  //渲染指定pug模板文件
  const products = adminData.products;
  //注入数据
  res.render('shop.pug', { prod: products });
})
```

创建一个渲染`index.pug`文件的路由。渲染指定`pug`模板文件。

```js
app.get('/', function (req, res) {
  //向模板文件传递数据
  res.render('index', {
    title: 'Hey', 
    message: 'Hello there!' 
  });
});
```

**`handlebars`模板**

```js
//入口文件引入
const expressHbs = require('express-handlebars');
//注册
app.engine('handlebars', expressHbs());
//设置模板引擎
app.set('view engine', 'handlebars');
```

入口文件注册时名称改为`hbs`。

```js
//views目录创建404.handlebars文件
//注意：后缀.handlebars可以设置缩写
//操作如下：
app.engine('hbs', expressHbs({
  layoutsDir: 'views/layouts',
  defaultLayout: 'main-layout',
  extname: 'hbs'
});
//设置模板引擎
app.set('view engine', 'hbs');
//这样模板文件的格式就为xxx.hbs
```

`handlebars`文件写法如正常的`handlebars`格式，动态内容用双大括号占位替换，条件判断写法如下：

```
{{if}}
{{else}}
{{/if}}
```

关于公共模板`main-layout.hbs`，动态内容需要双大括号显示，除了公共模板的其他模板可以把公共模板的标签删除保留自身的标签。

**ejs模板**

```js
//设置模板引擎
app.set('view engine', 'ejs');
```

```
//语法
<%= %>

//条件判断
<%= if(prods.length > 0) { %>
<%= } else { %>
<%= } %>
```





