# BOM



## 页面解析

绘制整个HTML页面的机制会分成**解析**和**加载**的部分。

## 树

**DOM树**是多组HTML标签组成的一个树形结构，它满足深度优先解析原则，**DOM树构建**是HTML元素节点的解析过程。

**CSS树**(样式结构体)，跟DOM的构建是类似的，也满足深度优先解析原则，它会忽略浏览器不能识别的样式。

**渲染树**(renderTree)是CSS树构建完毕时会形成一个渲染树，它实际上是DOM树结合CSS树的形成新的树的结果，浏览器会根据渲染树(构建完毕)去绘制页面。

- 渲染树一定是每个节点都有自己的样式，等待DOM树和CSS树构建完毕形成新的渲染树。
- 渲染树不包含隐藏节点，如`display: none;`，不需要绘制的`<head>`节点，原因是形成渲染树之前已经把不需要的节点剔除出去。
- 渲染树包含`visibility: hidden`相对应的节点，因为它会影响布局所以会重新绘制。
- 渲染树上每一个节点都会当成一个盒子，都具有内容填充，边框，边距，位置，大小等其他样式。



## 加载

如`<img src="xxx" />`标签是一个解析的过程，它不需要等待图片资源加载(异步)完成才能向下解析，解析的过程伴随着加载的开始(先有解析再有异步加载的过程)，跟解析的快慢是没有关系的，资源加载是不会影响DOM树的构建。



## 回流

当JavaScript对页面节点操作时就会产生**回流**和**重绘**，或者只产生重绘。

回流又叫重排(reflow)，回流的产生一定会引起重绘，但重绘不一定是回流的后续反应。因为节点的尺寸，布局，是否显示等改变时，渲染树中的一部分或者全部需要重新构建，这种重新构建的现象称为回流。首页页面加载也会形成至少一次回流，只要构建渲染树必定会引起回流。

**引起回流的因素有：**

- DOM节点增加与删除
- DOM节点位置发生变化
- 元素的尺寸，边距，填充，边框，宽高
- DOM节点`display`属性的是否显示
- 页面的渲染初始化(首次加载)
- 浏览器窗口尺寸变化，如`window.resize`更改
- 向浏览器请求某些样式信息时，如`offset`,`scroll`,`client`,`width`,`height`,`getComputedStyle()`,`currentStyle`

> 备注：减少DOM操作的目的就是要减少回流的发生来优化。

## 重绘

重绘(repaint)，除了会**影响回流那一部分因素时**，如更改字体颜色，它不会引起回流但会引起重绘。回流时，浏览器会重新构建时会受影响部分的渲染树，一旦渲染树被改变或重新构建就一定会引起重绘。

回流完成后，浏览器会根据新的渲染树重新绘制回流影响的部分或全部节点。这个重新绘制的过程称为重绘。

```js
<div class="box">Test</div>

var oBoxStyle = document.getElementByClassName('box')[0].style;

//第1次 回流 + 重绘 
oBoxStyle.width = '200px';
//第2次 回流 + 重绘 
oBoxStyle.height = '200px';
//第3次 回流 + 重绘 
oBoxStyle.margin = '20px';
//第4次 重绘 
oBoxStyle.backgroundColor = 'green';
//第4次 回流 + 第5次 重绘 
oBoxStyle.border = '5px solid orange';
//第6次 重绘 
oBoxStyle.color = '#fff';
//第6次 回流 + 第7次 重绘 
oBoxStyle.fontSize = '30px';
```

```js
//此操作会引起一次回流 假如插入到boby标签内的最前面会引起所有回流和重绘，影响的规模变大。
var h1 = document.createElement('h1');
h1.innerHTML = 'Test2';
document.body.appendChild(h1);
```

**总结：**

- 回流产生的性能问题比重绘的代价更高。
- 回流产生的性能问题跟渲染树的节点数量导致重新构建有关。
- 需要考虑回流次数的问题。
- 需要考虑回流涉及的节点数量问题。
- 尽可能避免在定位元素之前插入节点，会导致大量回流和重绘。



**浏览器优化策略：**

新的浏览器自带队列策略，浏览器引擎放入队列，队列里保存的是操作，等待一定数量的操作或一定时间间隔后就会进入队列批量执行处理，执行完毕后清空队列，多次产生的回流和重绘会缩减。

**浏览器有一个难解决的问题：**

涉及到计算时(`offset`,`scroll`,`client`,`width`,`height`,`getComputedStyle()`,`currentStyle`)，浏览器会给出精确的计算结果，它会清空样式操作。因为浏览器会认为开发者的操作有可能妨碍给出精确的值。

**开发者减少回流和重绘的方法：**

- 定义一个类名保存所有操作样式的属性如`active{width:200px;height:200px;...}`实现**批量处理**减少回流和重绘次数。
- 使用文档碎片，它不占DOM节点，拼接好样式属性后再插入节点。
- 利用`display: none`不在渲染树上的机制去减少回流和重绘。
- 使用动画属性时不能用`margin`,`padding`，取而用定位确保脱离文档流，否则会大量造成回流次数。
- 避免使用table表格进行布局，代价非常大，首次加载回流性能也很差，因为table具有弹性性质的单元格，而非是简单的块级元素，它自带内边距，且内边距跟普通的内边距是有区别的，并对回流影响非常大。

```js
//利用display: none不在渲染树上的机制去减少回流和重绘
var oBox = document.getElementByClassName('box')[0],
  oBoxStyle = oBox.style;
  
//此操作只会回流和重绘2次，避免多次
oBox.onmouseover = function(){
  //上方定义display，display不在渲染树中静态的修改样式
  oBoxStyle.display = 'none';
  oBoxStyle.width = '200px';
  oBoxStyle.height = '200px';
  oBoxStyle.border = '5px solid orange';
  //足够多的dom样式修改操作...
  //等改变好样式之后最后才显示
  oBoxStyle.display = 'block';
}
```



## 时间线

时间线是浏览器开始加载页面(HTML)的开始到整个页面加载结束的过程中按顺序发生的每一件事情的总流程，有了时间线概念就避免使用`window.onload`，因为文档解析完成后里面会执行`DOMContentLoaded`事件, 而`window.onload`仍要等待`<script async>`脚本加载完毕后才能触发。

1. 可以访问`document`对象，DOM生效，JS起作用。

2. 解析文档，浏览器从HTML第一行阅读到最后一行，中间会构建DOM树，文档加载页面的第1阶段为加载中`document.readyState = 'loading';`。

3. 遇到`<link>`会新开**线程**异步加载CSS外部资源，同时异步构建CSSDOM。

4. 遇到非异步加载的`<script>`时会阻塞文档解析，等待JS脚本加载并执行完毕后，继续解析文档。

5. 遇到异步加载的`<script>`时异步加载JS脚本并执行的同时解析文档，但是不能使用`document.write()`会报错。

6. 遇到`<img>`时先解析节点，有`src`属性会创建加载**线程**异步加载资源，不阻塞文档解析。

7. 文档解析完成，文档加载页面的第2阶段为解析完成可交互`document.readyState = 'interactive';`。 

8. `<script>`元素有`defer`属性时等待文档解析完成后，JS脚本会按照顺序执行。

9. 文档解析完成才会触发监控文档解析完成的`DOMContentLoaded`事件，同步的脚本执行阶段往事件驱动阶段演化。

10. `<script async>`加载并执行完毕，`<img>`等资源加载完毕，`window.onload`事件才触发，文档加载页面的第3阶段为页面加载完成`document.readyState = 'complete';`。


> 注：`defer`属性在页面完成解析时才执行异步脚本，兼容IE8及以下

```js
document.write('<h1>hello</h1>'); //这个写法会重写页面的内容,重新替换<body></body>
```

```html
//现象1：脚本标签文档写入并没有替换<body>内的内容，而是正常文档流下追加在<div>后面
//原因是<script>属性DOM树，程序跑到<script>时DOM没有构建完成，所以页面还没开始渲染
<body>
  <div></div>
  <script>
    document.write('<h1>hello</h1>');
  </script>
</body>
```

```html
//现象2：onload事件会覆盖<body>内的内容
//window.onload会等待页面渲染完毕，所以文档写入会替换页面
<body>
  <div></div>
  <script>
    window.onload = function(){
      document.write('<h1>hello</h1>');
    }
  </script>
</body>
```

 **浏览器渲染过程：**

```
HTML -> DOM 
             \
                -> Render Tree -> Layout -> Paint
             /        -> DOMContentLoaded 
CSS -> CSSOM              -> src img/iframe -> window.onload
```

***`window.onload`是什么？***

一个等待触发的事件，在HTML文档构建的过程是DOM树和CSS树构建，构建完毕后合并render渲染树，合并后开始渲染，渲染完毕后加载异步资源，如图片，`iframe`。`window.onload`是要等待以上加载完毕后才会执行的事件。等待这个事件非常浪费时间，所以慎用或少用。

***`DOMContentLoaded`是什么？***

 当初始的 HTML文档被完全加载和解析完成之后，`DOMContentLoaded` 事件被触发，而无需等待样式表、图像和子框架`iframe`的完全加载。 



**样式阻塞**指的是浏览器是否需要暂停网页的首次渲染，直到资源准备就绪。

```html
//CSS资源加载阻塞，浏览器不会渲染知道CSSOM构建完毕
//假如加载一个外网资源时, 浏览器会有非常长的白屏时间，直到资源加载成功或失败时才会渲染页面
<link rel="stylesheet" href="https://www.youtube.com/s/player/www-player-webp.css">
```

**脚本阻塞**在浏览器解析HTML文档时，如果遇到`<script>`文档标签时，便停下对HTML文档进行解析，暂停构建DOM，而优先去加载和执行脚本，等待脚本执行完毕后，浏览器才会从中断的地方恢复DOM构建。

```html
//页面刷新不会马上显示内容，而是等待了5秒空白页面后才显示内容
<script>
  let d = Date.now();
  while (Date.now() < d + 1000 * 5) {}
</script>
<div id="id">Hello</div>
```

`defer`或`async`属性可以显性声明脚本是异步的，防止阻塞DOM构建和渲染。

- `defer`异步后台加载脚本，不中止文档解析，文档解析**完毕后执行**后台加载完毕的脚本。
- `async`异步后台加载脚本，加载的过程不会中止文档解析，但是加载完毕时会**马上执行**脚本，在执行脚本期间会中止文档解析(阻塞)，直到脚本执行完毕后继续解析文档。

**`defer` 与 `DOMContentLoaded`：**

 在 DOM、CSSOM 构建完毕，`defer` 脚本执行完成之后，DOMContentLoaded 事件触发。 

**`async` 与 `DOMContentLoaded`：**

在 DOM、CSSOM 构建完毕，DOMContentLoaded 事件触发，不需要等待`async`脚本执行，资源样式表加载等。 

**场景：**

 在 jQuery 中经常使用的 `$(document).ready();` 其实监听的就是 DOMContentLoaded 事件，而 `$(document).load();` 监听的是 load 事件。 

**文档加载页面的三个重要阶段：**

- `document.readyState = 'loading';`，页面加载的第一个阶段
- `document.readyState = 'interactive';`，DOM和CSS文档**解析**完成阶段
- `document.readyState = 'complete';`，页面**加载**完成，资源加载完毕，脚本加载和执行完毕，`onload`事件触发的阶段

```js
//监听状态以上三个阶段某个阶段触发函数，JS引擎主动监听触发

//改变前为loading
console.log(document.readyState); //loading

//文档改变了才触发
document.onreadystatechange = function(){
  console.log(document.readyState); //interactive / complete
}
```



## 初次绘制

现代浏览器为了提高用户体验，它并不需要等待HTML文件解析到最后一行才开始构建，而是部分的预先构建DOM树，CSS树和渲染树。

**初次绘制**就是只要解析到HTML文档里要渲染的内容时，它会一边解析一边构建一边渲染。如果`<script>`标签往上放会延迟初次渲染的时间会引起留白的情况。

jQuery文档解析完毕执行函数的三种写法：

```js
//写法1
$(document).ready(fn);

//写法2
$(fn);

//写法3
$(document).on('ready', fn);
```

自封装一个文档解析完毕执行函数：

```js
//兼容老浏览器的首次加载事件写法
function domReady(fn){
  //新的浏览器
  if(document.addEventListener){
    document.addEventListener('DOMContentLoaded', function(){
      //释放内存 必须与上面绑定的函数一致
      document.removeEventListener('DOMContentLoaded', arguments.callee, false);
      fn();
    }, false);
  }else if(document.attachEvent){
    //旧版本
    document.attachEvent('onreadystatechange', function(){
      //页面加载完成时
      if(this.readyState === 'complete'){
        document.attachEvent('onreadstatechange', arguments.callee);
        fn();
      }
    });
  }
  
  //排除老版本(<IE6,7)的doScroll情况和frame窗口的情况
  //doScroll可以操作滚动条，大多数浏览器不存在，IE67及以下存在,他会一直报错，直到文档解析完成。
  if(document.documentElement.doScroll && typeof(window.frameElement) === 'undefined'){
    try{
      //一直try直到页面加载完毕时才会执行doScroll
      document.documentElement.doScroll('left');
    }
    catch(e){
      //否则报错 延迟20执行domReady
      return setTimeout(arguments.callee, 20);
    }
  }
}
```

文档解析完毕函数结合项目使用写法。

```html
<script src="utils.js"></script>
<script>
  function init_index_modules(){ test(); }
  var test = (function(){
    function test(){ console.log('test'); }
    return function(){ test(); }
  })();
</script>
<script>
  domReady(function(){
    init_index_modules();
  });
  //or
  $(document).ready(function(){
    init_index_modules();
  });
</script>
```

平时开发中避免以下写法，非企业级的写法。

```html
<script>
  document.addEventListener('DOMContentLoaded', function(){
    init_index_modules();
  }, false);
</script>
```





## 浏览器组成

- 用户界面，用户看到的浏览器的样子
- 浏览器引擎，让浏览器运行的程序接口集合，主要是查询和操作渲染引擎
- 渲染引擎，解析HTML,CSS，将解析的结果渲染到页面的程序
- 网络，进行网络请求的程序
- UI后端，绘制组合选择框及对话框等基本组件的程序
- JS解释器，解释执行JS代码的程序
- 数据存储，浏览器存储相关的程序 cookie/storage



## 页面渲染

**渲染**是一个特定的软件将模型(一个程序)转化为用户能看到的图像的过程。

**渲染引擎**是内部具备一套绘制图像方法集合，渲染引擎可以让特定的方法执行把HTML/CSS代码解析成图像显示在浏览器窗口中。



## 渲染模式

DTD，文档类型定义。(Document Type Definition)，分为严格版本，过渡版本，框架版本。

- 严格模式，Strict DTD，文档结构表现形式实现了更高的分离，页面的外观用CSS来控制。
- 过渡版本，Transitional DTD，包含了HTML4.0版本的全部标记，从HTML的使用过渡到XHTML。
- 框架版本，Frameset DTD，使用`<frameset>`以框架的形式将网页分为多个文档。



## 进程线程

浏览器是多进程的，具有多个窗口进程，第三方插件进程，GPU进程，浏览器渲染引擎进程(浏览器内核)。

> 注：单线程意味着同一时间只处理一件事情，计算能力非常有限，数据流巨大的时候需要大量的计算和渲染，解决方案是SSR服务端渲染后端负责计算，前端负责渲染和webworker(html5)专门用来给前端计算大量的数据。小数据处理则通过异步方案来解决。

**浏览器渲染引擎进程(浏览器内核)是多线程的：**

- JS 引擎线程(单线程的原因是避免DOM 冲突)
- GUI 线程(互斥于JS 引擎线程，不能同时进行，如果JS线程阻塞将会影响GUI绘制)，GUI用来绘制用户界面
- webAPIs：Http网络请求程序 (异步)，DOM(document)
- webAPIs：定时器触发线程(异步)，Timeout(setTimeout)
- webAPIs：浏览器事件处理线程(异步)，AJAX(XMLHttpRequest)

**JS 运行原理**是JS 引擎线程(单线程)，同时执行异步执行(事件驱动)。

> 备注：
>
> - Call Stack是执行栈
> - Callback Queue是事件队列，异步队列，回调队列
> - Event Loop是事件轮询，一直检测回调队列是否有任务，有任务时推进执行栈里

**回调队列/事件队列**

- 同步处理情况是同步代码进入执行栈，执行函数，销毁函数，离开执行栈。
- 异步处理情况：
  1. 函数执行(定时器/ajax/处理函数)进入执行栈，因为属于异步处理函数的一部分，调用相应异步线程。
  2. 在 Web APIs 里注册一个回调函数，并挂起，等待事件被触发。
  3. 执行完毕后，执行栈移除异步处理函数，但 Web APIs 等待事件被触发。
  4. 当等待的事件被触发时，把注册在 Web APIs 的函数移到回调队列中。
  5. 事件循环，把回调队列中的处理函数推入执行栈里。
  6. 执行函数，销毁函数，离开执行栈。



![图片描述](http://note-img-bed.dt-code.fun//1356773119-5ae96cb8bda72.gif)



## 异步加载

一般来说，异步加载是浏览器做的，如何自己实现一个异步加载?

```js
//企业级工具函数写法：匿名空间
//命名空间的目的为了知道方法集合来源
var utils = {
  test: function () {
    console.log("test");
  },
  demo: function () {
    console.log("demo");
  },
};

utils.test();
```

**同步加载**也叫阻塞模式是在同步模式下浏览器加载默认同步加载状态如 `<script>` 标签同步加载的同时 阻塞DOM解析。

为什么不能浏览器引擎解析时不能异步加载，因为 DOM 解析的情况不明确，会影响加载的过程，会有报错。也是 `<script>`标签放最后的原因，等上面的标签都加载完毕才执行 JS 脚本。

但也有例外的情况是，`<script>`为一个异步加载的方式去实现某些异步功能，这些功能一般不会直接操作DOM，就可以放在页面的上方如`<head>`标签里面。

> **注：**
>
> - `async`属性，不阻塞，脚本相对于页面的其余部分异步地执行（当页面继续进行解析时，脚本将被执行，W3C标准, HTML5属性，IE9及以上。
> - `defer`属性，不阻塞，也是异步加载，要等待文档**解析完毕后**才执行脚本。

**需要异步加载的场景：**

- 工具类函数
- 不直接操作DOM的库，如https相关的库
- 用户点击意见反馈才按需加载(问卷调查，数据统计等)

```js
//企业级异步加载 等待页面全部加载完毕后，进行异步加载操作
var s = document.createElement("script");
s.type = "text/javascript";
s.async = true;
s.src = "utils.js";

//执行
document.body.appendChild(s);
```



异步加载的**目的**是不阻塞DOM和CSS解析，资源的加载，正常页面的渲染，在企业级的异步方式有以下两种写法：

因为IE浏览器兼容性的问题，兼容`defer`和`async`的方式是写一个动态JS创建`<script>`脚本实现异步加载，当`script`携带`src`属性时代表JS脚本文件在下载了，当`<script>`插入到页面时会立即执行脚本文件里的代码。

```js
//希望页面全部加载完毕时才进行异步加载
(function () {
  //新定义的async_load()函数阻塞onload执行
  function async_load() {
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.async = true;
    s.src = "utils.js";
    
    //一般异步加载的脚本都要在HTML里往上放
    oScript.parentNode.insertBefore(s, oScript);

    //执行
    document.body.appendChild(s);
  }

  //防止window.onload事件阻塞的操作，把定义的异步操作标签在onload事件触发时执行，先onload执行，后异步加载函数执行
  if (window.attachEvent) {
    window.attachEvent("onload", async_load);
  } else {
    window.addEventListener("load", async_load, false);
  }
})();
```

既然异步加载又要执行某路径脚本文件里的某一个函数时的写法。先判断该路径脚本是否正常的下载完毕，等待下载完毕后才去执行。

判断是否下载完毕的方法有`onload`事件和`readyState`事件，一旦`onload`事件触发了触发自身的回调函数，并说明文件已经正常下载完毕。但是`onload`事件支持W3C浏览器，IE8及以下不兼容，`<script>`标签是没有`onload`事件。那么兼容的方式就是模拟`onload`事件，可以通过`readyState`事件来监听状态，当状态为`complete`或者`loaded`时才说明文件正常下载完毕，此时就可以执行脚本文件里定义的函数和方法。

又要异步加载，又要执行某一个函数的封装写法。

```js
 //判断是否下载完毕
// 通过readyState事件判断 -> onreadystatechange输出的值判断页面是否加载完毕 -> IE
function exec_util_with_loading_script(url, fn) {
  //只要动态的创建script，就是异步加载
  var s = document.createElement('script'),
    oScript = document.getElementsByTagName('script')[0];
  s.type = 'text/javascript';

  //如果存在，则为IE浏览器
  //readyState为标签返回的状态码
  if (s.readyState) {
    s.onreadychange = function () {
      var state = s.readyState;
      //onload会一直监听页面加载是否完毕
      if (state === 'complete' || state === 'loaded') {
        //执行utils.js里定义的某个函数
        utils[fn]();
      }
    }
  } else {
    //非IE
    s.onload = function () { utils[fn](); }
  }
  //readyState需要在资源加载完毕后才执行
  //当新增src属性时，资源就会下载 
  s.src = url; //会阻塞
  oScript.parentNode.insertBefore(s, oScript);
}

//调用
exec_util_with_loading_script('utils.js', 'test')
```

***为什么微信打开网页会非常慢？***

因为微信的SDK程序机制是需要放在页面的`<head>`标签里，这个SDK的JS文件非常大阻止了页面的正常渲染，所以每一打开时都会有一段长时间的白屏。所以做移动端，webApp，渐进式App时，千万不能把`<script>`放入`<head>`里去。

