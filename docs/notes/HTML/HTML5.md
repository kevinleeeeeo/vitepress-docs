# HTML5

## 概述

`HTML5`在从前`HTML4.01`的基础上进行了一定的改进，目的为了更简单的创建`web`程序

为了更好地处理今天的互联网应用，`HTML5`添加了很多新元素及功能，比如： 图形的绘制，多媒体内容，更好的页面结构，更好的形式处理，和几个`api`拖放元素，定位，包括网页 应用程序缓存，存储，网络工作者等。





## 新特性

`HTML5 `的一些最有趣的新特性：

- 新的语义元素，比如 `<header>`, `<footer>`, `<article>`, `<section>`。
- 新的表单控件，比如数字、日期、时间、日历和滑块。
- 强大的图像支持（借由 `<canvas>` 和 `<svg>`）
- 强大的多媒体支持（借由` <video>` 和 `<audio>`）
- 强大的新 `API`，比如用本地存储取代 `cookie`



## 新增属性

| 属性              | 描述                                                   |
| ----------------- | ------------------------------------------------------ |
| `contenteditable` | 是否可以编辑内容                                       |
| `hidden`          | 类似`display`将元素隐藏                                |
| `data-*`          | 自定义属性                                             |
| `draggable`       | 被定义盒子是否可以拖拽，对应事件`ondragstart`,`ondrag` |



## 新增标签

`HTML5`提供了新的元素来创建更好的页面结构：

| 标签         | 描述                                                         |
| ------------ | ------------------------------------------------------------ |
| `<article>`  | 定义页面独立的内容区域。专注于内容，如论坛文章。             |
| `<aside>`    | 定义页面的侧边栏内容。                                       |
| `<details>`  | 用于描述文档或文档某个部分的细节                             |
| `<dialog>`   | 定义对话框，比如提示框                                       |
| `<summary>`  | 标签包含 details 元素的标题                                  |
| `<figure>`   | 规定独立的流内容（图像、图表、照片、代码等等）。             |
| `<footer>`   | 定义 `section`或 `document`的页脚。                          |
| `<header>`   | 定义了文档的头部区域                                         |
| `<mark>`     | 定义带有记号的文本。                                         |
| `<meter>`    | 定义度量衡。仅用于已知最大和最小值的度量。                   |
| `<nav>`      | 定义导航链接的部分。                                         |
| `<progress>` | 定义任何类型的任务的进度。                                   |
| `<section>`  | 定义文档中的节（`section`、区段）。更专注于功能聚合，如地图。 |
| `<time>`     | 定义日期或时间。                                             |



## 存储相关

网络中存储相关有localStorage，sessionStorage，Cookies三种。

| 种类           | 容量 | 浏览器       | 适用于   | 过期时间   | 存储位置       | 提交请求 |
| -------------- | ---- | ------------ | -------- | ---------- | -------------- | -------- |
| Cookies        | 4kb  | HTML4、HTML5 | 全部窗口 | 手动       | 浏览器和服务器 | 是       |
| LocalStorage   | 10mb | HTML5        | 全部窗口 | 永不       | 仅浏览器       | 否       |
| SessionStorage | 5mb  | HTML5        | 标签页   | 标签页关闭 | 仅浏览器       | 否       |









## Cookie

服务器发送到用户浏览器并保存在本地的一小块数据，它会在浏览器下次向同一服务器再发起请求时被携带并发送到服务器上。

`Cookie `主要用于以下三个方面：

- 会话状态管理（如用户登录状态、购物车、游戏分数或其它需要记录的信息）
- 个性化设置（如用户自定义设置、主题等）
- 浏览器行为跟踪（如跟踪分析用户行为等）

读取Cookies。返回页面上所包含cookie 的数据内容。

```js
document.cookie
```

新增一项数据到Cookies中。

```js
document.cookie = 'name = tom';
```







## Set-Cookie

响应首部`Set-Cookie` 被用来由服务器端向客户端发送 `cookie`。

```js
//一个名称/值对
Set-Cookie: <cookie-name>=<cookie-value>

//最长有效时间
Set-Cookie: <cookie-name>=<cookie-value>; Expires=<date>

//在 cookie 失效之前需要经过的秒数
Set-Cookie: <cookie-name>=<cookie-value>; Max-Age=<non-zero-digit>

//指定 cookie 可以送达的主机名
Set-Cookie: <cookie-name>=<cookie-value>; Domain=<domain-value>

//指定一个 URL 路径，这个路径必须出现在要请求的资源的路径中才可以发送 Cookie 首部
Set-Cookie: <cookie-name>=<cookie-value>; Path=<path-value>

//一个带有安全属性的 cookie 只有在请求使用 SSL 和 HTTPS 协议的时候才会被发送到服务器
Set-Cookie: <cookie-name>=<cookie-value>; Secure

//设置了 HttpOnly 属性的 cookie 不能使用 JavaScript 经由  Document.cookie 属性、XMLHttpRequest 和  Request APIs 进行访问，以防范跨站脚本攻击（XSS (en-US)）
Set-Cookie: <cookie-name>=<cookie-value>; HttpOnly

//允许服务器设定一则 cookie 不随着跨域请求一起发送，这样可以在一定程度上防范跨站请求伪造攻击（CSRF）
Set-Cookie: <cookie-name>=<cookie-value>; SameSite=Strict
Set-Cookie: <cookie-name>=<cookie-value>; SameSite=Lax
```





## History

`history`接口(历史栈)，它保存用户在当前浏览器窗口访问过的一些历史记录，在`history`对象下有一些方法，如模拟前进和后退。

`history.length`返回历史记录的数量，包括当前加载的页是一个整数。

```js
//允许 Web 应用程序在历史导航上显式地设置默认滚动恢复行为
window.history.scrollRestoration

//返回一个历史堆栈顶部的状态的值
window.history.state

//在浏览器历史记录里前往上一页，用户可点击浏览器左上角的返回
window.history.back()

//在浏览器历史记录里前往下一页，用户可点击浏览器左上角的前进
window.history.forward()

//通过当前页面的相对位置从浏览器历史记录 ( 会话记录 ) 加载页面。比如：参数为-1 的时候为上一页，参数为 1 的时候为下一页
window.history.go(-1)
```

在HTML5中可以操作`history`栈的方法有`pushState`和`replaceState`。 

`pushState`按指定的名称和 URL（如果提供该参数）将数据 push 进会话历史栈。

```JS
//可以通过history.state查询新定义的值
//参数1 一个状态对象的名称，用来下次访问时访问该名称 可以通过history.state访问
//参数2 设置标题 多数浏览器不支持 参数3 url地址
//浏览器不会重新加载pushState.html,也不会检查该页面是否真实存在
window.history.pushState('pushState test', null, 'pushState.html');
window.history.pushState({id}, null, `selected=${id}`);
```

`replaceState`按指定的数据，名称和 URL(如果提供该参数)，更新历史栈上最新的入口。

```JS
//第三个参数实际上改变了url地址, 如xxx.com/test, 但url地址虽然改变了，但页面没有重新加载，也不会去检测test是否存在
window.history.replaceState('this is a test', null, 'test')
```

`popState`事件可以监听浏览器窗口上的前进和后退按钮。该事件的`PopStateEvent`对象下的`state`属性保存了`pushState`新增定义的对象(等同于参数1对象)。

```js
window.addEventListener('popState', (e) => {
  console.log(e); //PopStateEvent{...}
}, false);
```

`hashchange`事件的事件对象。

```js
window.addEventListener('hashchange', (e) => {
  console.log(e); //HashChangeEvent{...}
  //可以拿到url中的哈希值 并剔除#号
  console.log(window.location.hash.substring(1));
}, false);
```





## Web Workers

`Web Worker` 为 `Web` 应用在后台线程中运行脚本提供了一种简单的方法。线程可以执行任务而不干扰用户界面。此外，他们可以使用`XMLHttpRequest`执行` I/O`  ,一旦创建， 一个 `worker `可以将消息发送到创建它的 `JavaScript `代码，通过将消息发布到该代码指定的事件处理程序（反之亦然）。

通过`postMessage`可以使页面和`worker`进行通信。

```js
//通过postMessage() 方法和onmessage事件处理函数触发 workers 的方法
var myWorker = new Worker('worker.js');

var msg = { addThis: { num1: 1, num2: 2 } }

//传递信息
myWorker.postMessage(message);

//如果你需要从主线程中立刻终止一个运行中的 worker，可以调用 worker 的terminate 方法
myWorker.terminate();
```

获取传递过来的信息。

```js
//worker.js文件循序worker机制无法访问window并且有自身的this
this.onmessage = function(e){
  console.log(e); //MesssageEvent{...}
  console.log(e.data); //addThis: { num1: 1, num2: 2 }
}
```



## 文件

假如从选择文件输入框中想获取文件列表信息，写法如下。

```html
<input type="file" id="fileInput" />

<script>
  var input = document.getElementById('fileInput');
  input.addEventListener('change', function (e) {
      /*
        console.log(input.files);
        FileList {
          0: File{
            lastModified:  1670224815494,
            lastModifiedDate: Mon Dec 05 2022...,
            name: "mag_pic.jpeg",
            size: 284755,
            type: "image/jpeg",
            webkitRelativePath: ""
          }, 
        length: 1
    }*/
  }
</script>
```

**`FileReader`** 对象允许 Web 应用程序异步读取存储在用户计算机上的文件内容，`readAsText`可以读取文件内容作为字符串内容，如读取txt文件。

```js
var reader = new FileReader();

//readAsText 可以读取文件 如txt文件
reader.readAsText(input.files[0]);

//当文件读取后
reader.onload = function () {
  console.log(reader.result); //Hello, This is test.
};
```

`readAsDataURL`可以读取文件作为一个转换后的base64格式的图片地址。

```js
reader.readAsDataURL(input.files[0]);
console.log(reader.result);
//data:image/jpeg;base64,/9j/4AA.......
```

文件分割，如果遇到大文件进行上传，一次性的将整个文件将它读取到内存中是不合适的，为了提高上传速度，可以按照一定划分容量的字节数为单位，进行服务器文件的读取和发送，再按照正确顺序把文件进行一个重建的过程。`file.slice`接口方法可以实现文件分割。

```js
//参数是起始和结束字节的位置
var blob = file.slice(start, end);
```

`onprogress`事件可以监听文件读取，会多次执行直到读取完毕。

```js
reader.onprogress = function (e) {
  // console.log(e); //ProgressEvent{...}
  if (e.lengthComputable) {
    var perNum = (e.loaded / e.total) * 100,
        percentLoaded = Math.round(perNum);
    if (percentLoaded < 100) {
      oPercent.style.width = percentLoaded + '%';
      oPercent.textContent = percentLoaded + '%';
    }
  }
}
```





## WebSocket

WebSocket protocol是HTML5的一种新的协议。它实现了浏览器与服务器全双工通信(full-duplex)。全双工又称为双向同时通信，即通信的双方可以同时发送和接收信息的信息交互方式。

WebSocket是应用层协议，Socket是传输层协议。像一些应用APP像聊天，游戏等需要HTTP轮询服务器来拿到更新信息，这样做存在弊端：

- 请求和响应的连接每次都是不一样的
- 就算没有数据，HTTP请求头的字节数是必不可少的
- 每次处理数据客户端要分清楚哪次响应对于哪次请求

WebSocket和HTTP的相同点是：

- 基于TCP的可靠性传输协议
- 都是应用层协议

WebSocket和HTTP的不同点是：

- WebSocket是双向通信协议，模拟Socket协议，可以双向发送或接收信息。而HTTP是单向的
- 首次都需要握手进行连接，而HTTP是每次连接都需要握手，WebSocket建立连接后就无需握手也没有请求头。





`WebSocket `对象提供了用于创建和管理 `WebSocket `连接，以及可以通过该连接发送和接收数据的 `API`

```js
//用于指定连接关闭后的回调函数
WebSocket.onclose

//用于指定连接失败后的回调函数
WebSocket.onerror

//用于指定当从服务器接受到信息时的回调函数
WebSocket.onmessage

//用于指定连接成功后的回调函数
WebSocket.onopen

//服务器选择的下属协议
WebSocket.protocol 

//当前的链接状态
WebSocket.readyState

//WebSocket 的绝对路径
WebSocket.url 
```



## 地理位置

`Navigator.geolocation`只读属性返回一个 `Geolocation `对象，通过这个对象可以访问到设备的位置信息。使网站或应用可以根据用户的位置提供个性化结果。

```js
function success(){...}
function failure(){...}

window.navigator.geolocation.getCurrentPosition(success, failure);
```





## Canvas

`Canvas API `提供了一个通过`JavaScript `和 `HTML`的`<canvas>`元素来绘制图形的方式(`IE9+`兼容)。它可以用于动画、游戏画面、数据可视化、图片编辑以及实时视频处理等方面。

`Canvas API `主要聚焦于 `2D `图形。而同样使用`<canvas>`元素的 `WebGL API `则用于绘制硬件加速的 `2D `和 `3D `图形。

```
<canvas id="canvas" width="300" height="150"></canvas>
```

**渲染上下文`context`**

`<canvas>` 元素创造了一个固定大小的画布，它公开了一个或多个渲染上下文，其可以用来绘制和处理要展示的内容。

```
var canvas = document.getElementById('tutorial');
var ctx = canvas.getContext('2d');
```

**绘制图形**

```
//画笔
ctx.fillStyle = "rgb(200,0,0)";
//填充满的矩形
ctx.fillRect (50, 50, 100, 100);
//清除指定的矩形区域并完全透明
ctx.clearRect (75, 75, 50, 50);

//绘制矩形 使用当前的绘画样式，描绘一个起点在 (x, y) 、宽度为 w 、高度为 h 的矩形的方法
ctx.strokeRect(x, y, width, height);
```

通过清空子路径列表开始一个新路径的方法。 当你想创建一个新的路径时，调用此方法

```
// First path
ctx.beginPath();
ctx.strokeStyle = 'blue';
ctx.moveTo(20,20);
ctx.lineTo(200,20);
ctx.stroke();

// Second path
ctx.beginPath();
ctx.strokeStyle = 'green';
ctx.moveTo(20,20);
ctx.lineTo(120,120);
ctx.stroke();
```

**画圆**

绘制圆弧路径的方法。

```
//圆弧路径的圆心在 (x, y) 位置，半径为 r ，根据anticlockwise （默认为顺时针）指定的方向从 startAngle 开始绘制，到 endAngle 结束。
//x 圆弧中心（圆心）的 x 轴坐标。
//y 圆弧中心（圆心）的 y 轴坐标。
//radius 圆弧的半径。
//startAngle 圆弧的起始点，x 轴方向开始计算，单位以弧度表示。
//endAngle 圆弧的终点， 单位以弧度表示。
//anticlockwise 可选的Boolean值 ，如果为 true，逆时针绘制圆弧，反之，顺时针绘制
void ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);
```

根据控制点和半径绘制圆弧路径，使用当前的描点 (前一个 `moveTo `或 `lineTo `等函数的止点)。

```
//根据当前描点与给定的控制点 1 连接的直线，和控制点 1 与控制点 2 连接的直线，作为使用指定半径的圆的切线，画出两条切线之间的弧线路径。
//x1 第一个控制点的 x 轴坐标。
//y1 第一个控制点的 y 轴坐标。
//x2 第二个控制点的 x 轴坐标。
//y2 第二个控制点的 y 轴坐标。
//radius 圆弧的半径。
void ctx.arcTo(x1, y1, x2, y2, radius);
```

**贝塞尔曲线**

新增二次贝塞尔曲线路径的方法。

```
//它需要 2 个点。第一个点是控制点，第二个点是终点。起始点是当前路径最新的点，当创建二次贝赛尔曲线之前，可以使用 moveTo() 方法进行改变。
//cpx 控制点的 x 轴坐标。
//cpy 控制点的 y 轴坐标。
//x 终点的 x 轴坐标。
//y 终点的 y 轴坐标。
void ctx.quadraticCurveTo(cpx, cpy, x, y);
```

**变形**

使用单位矩阵重新设置（覆盖）当前的变换并调用变换的方法

```
//a 水平缩放。
//b 垂直倾斜。
//c 水平倾斜。
//d 垂直缩放。
//e 水平移动。
//f 垂直移动。
void ctx.setTransform(a, b, c, d, e, f);
```

**填充图案**

```
var img = new Image();
img.src='http://xxx.com/xxx.jpg';
img.onload = function(){
  var pattern = ctx.createPattern(img, 'no-repeat');
  ctx.fillStyle = pattern;
  ctx.fillRect(0, 0, 300, 150);
}
```

**渐变**

创建一个沿参数坐标指定的直线的渐变。

```
//x0 起点的 x 轴坐标。
//y0 起点的 y 轴坐标。
//x1 终点的 x 轴坐标。
//y1 终点的 y 轴坐标。
ctx.createLinearGradient(x0, y0, x1, y1);
```

**阴影**

```
//描述阴影水平偏移距离的属性
ctx.shadowOffsetX = offset;
//描述阴影垂直偏移距离的属性
ctx.shadowOffsetY = offset;
```

**文本**

```
// 在 (x, y)位置填充文本的方法
ctx.fillText(text, x, y, [maxWidth]);
```

**线段末端**

指定如何绘制每一条线段末端的属性。

```
//线段末端以方形结束
ctx.lineCap = "butt";
//线段末端以圆形结束
ctx.lineCap = "round";
//线段末端以方形结束，但是增加了一个宽度和线段相同，高度是线段厚度一半的矩形区域
ctx.lineCap = "square";
```

**线段连接**

设置 2 个长度不为 0 的相连部分（线段，圆弧，曲线）连接在一起

```
ctx.lineJoin = "bevel";
ctx.lineJoin = "round";
ctx.lineJoin = "miter";
```



**绘制**

提供了多种方式在 `Canvas `上绘制图像。

```
//image 绘制到上下文的元素。允许任何的 canvas 图像源 
//sx可选 需要绘制到目标上下文中的，image的矩形（裁剪）选择框的左上角 X 轴坐标。
//sy可选 需要绘制到目标上下文中的，image的矩形（裁剪）选择框的左上角 Y 轴坐标。
//sWidth可选 需要绘制到目标上下文中的，image的矩形（裁剪）选择框的宽度。如果不说明，整个矩形（裁剪）从坐标的sx和sy开始，到image的右下角结束。
//sHeight可选 需要绘制到目标上下文中的，image的矩形（裁剪）选择框的高度。
//dx image的左上角在目标 canvas 上 X 轴坐标。
//dy image的左上角在目标 canvas 上 Y 轴坐标。
//dWidth可选 image在目标 canvas 上绘制的宽度。允许对绘制的image进行缩放。如果不说明，在绘制时image宽度不会缩放。
//dHeight可选 image在目标 canvas 上绘制的高度。 允许对绘制的image进行缩放。如果不说明，在绘制时image高度不会缩放。

ctx.drawImage(image, dx, dy);
ctx.drawImage(image, dx, dy, dWidth, dHeight);
ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
```



## SVG

可缩放矢量图形(scalable vector graphics)它用来解决图像缩放时产生失真的情况。

**画布**

```
//画布大小 
<svg width="500" height="500"> </svg>
```

**矩形**

```
//6个参数决定矩形的位置和形状
//x,y 为左上角坐标位置 rx,ry为圆角
<rect x="10" y="10" width="150" height="150" rx="10" ry="10"></rect>
```

**圆形**

```
//cx,cy 圆心的x,y坐标
//r 半径
<circle cx="50" cy="50" r="50"></circle>
```

**椭圆**

```
//rx, ry 椭圆的长轴 短轴
<ellipse cx="150" cy="150" rx="150" ry="100"></ellipse>
```

**直线**

两点确定一条直线，直线不是一个闭合图形，需定义`stroke`属性

```
//x1, y1, x2, y2 起点终点位置
//stroke 画笔
//stroke-width 画笔宽度
//stroke-opacity 透明度
//stroke-linecap 端点形状
//stroke-dasharray 有间隙缺口的线
//stroke-dashoffset 间隙缺口偏移
<line x1="50" y1="150" x2="350" y2="150" stroke="orange"></line>
```

**折线**

多个点确定多条线

```
<polyline points="60 110, 65 120, 70 115" stroke="orange"></polyline>
```

**自定义路径**

可以通过路径创建复杂的图形

```
//d属性包含命令和参数的序列
//M指的是M命令类似moveto属性
//L命令类似lineTo属性
//H命令 水平直线
//V命令 垂直直线
//V命令 闭合路径
//T命令 延迟曲线
//Q命令 坐标1控制点坐标 坐标2 终点坐标
//A命令 弧形
<path d="M 10 10 H 100" />
```

**线性渐变**

```
<defs>
  <linearGradient id="Gradient1">
    <stop class="stop1" offset="0%"></stop>
    <stop class="stop2" offset="50%"></stop>
    <stop class="stop3" offset="100%"></stop>
  </linearGradient>
</defs>
```

**径向渐变**

某一点发散出来，多个属性来描述位置和方向

```
<defs>
  <linearGradient id="Gradient2" cx="0.25" cy="0.25" r="0.25" fx="0.15" fy="0.15">
    <stop class="stop1" offset="0%"></stop>
    <stop class="stop2" offset="50%"></stop>
    <stop class="stop3" offset="100%"></stop>
  </linearGradient>
</defs>
```

**文本**

```
<text x="50" y="50"></text>
```

**高斯滤镜**

```
//stdDeviation 模糊度
<filter id="blur">
  <feGaussianBlur in="SourceGraphic" stdDeviation="5"/>
</filter>
```

**视口**

`viewport`是可视区域大小，`viewBox`控制`viewport`可视区域里显示的东西

```
//前两位数值决定起始坐标(平移)
//后两位数值决定缩放大小
<svg viewBox="100 100 300 300"></svg>
```

**变形**

```
<rect transform="translate(300, 0)"></rect>
```

**裁剪路径**

```
<clipPath id="xxx">
  <rect></rect>
</clipPath>
```

