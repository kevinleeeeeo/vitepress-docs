# AJAX

## 前奏

混编模式历史，`php`脚本如网页开发。



## 概念

**AJAX - Asynchronous JavaScript and XML** ，异步的`JavaScript`和`XML`。



## 历史

**`AJAX`历史：**

- 1999 `IE5.0` 允许JS脚本向服务器单独发起`HTTP`请求的新功能
- 2004 `GMAIL` 推出异步邮件更新服务
- 2005 `Google Map` 异步更新地图服务
- 2005 `AJAX`被大厂公认命名
- 2006 `W3C`发布`AJAX`国际标准

所以说，`AJAX`是`JavaScript`脚本发起`HTTP`通信。



## 应用

**`AJAX`初始应用场景**是`JavaScript`异步通信，请求服务器返回`XML`文档，并从`XML`文档提取数据，再不刷新整个网页的基础上，渲染到网页响应的位置。





## 创建

**创建`XMLHttpRequest`对象**

`XMLHttpRequest` & `ActiveX`对象的作用是`JS`脚本发起`HTTP`请求时必须通过`XMLHttpRequest`对象，也是通过`AJAX`进行浏览器与服务器通信的接口，不局限于`XML`，可以发送仍和格式的数据。

实例化`XMLHttpRequest`对象。

```js
var xhr = new XMLHttpRequest();
```

兼容`IE5`/`IE6`使用`Active`对象。

```js
var xhr = new ActiveXObject('Microsoft.XMLHTTP');
```

**发送`HTTP`请求**

```js
xhr.open(method, url, async);
```

参数：

- `method`：请求方式
- `url`：请求发送地址
- `async`：是否同步，默认为异步`false`

```js
xhr.send();
```

参数：

- `POST`需要请求体



## 状态码

发送请求时的响应任务是触发的`onreadystatechange`事件：挂载到`XMLHttpRequest`对象上的事件。`readyState`仅仅是针对请求与响应的状态码，获取资源是否成功取决于`status`状态。

- `readyState`状态：通过`XMLHttpRequest`对象发送`HTTP`请求的各阶段状态码(0-4)
  - 0：请求未初始化
  - 1：服务器连接已建立
  - 2：请求已接受
  - 3：请求处理中
  - 4：请求已完成，且响应已就绪
- `status`状态：服务器响应的状态码(200, 404...)
- `statusText`：状态提示
  - 200, OK, 访问正常
  - 301，`Move Permanently`，永久移动
  - 302，`Not Modified`，暂时移动
  - 304，`Not Modified`，未修改
  - 307，`Temporary Redirect`，暂时重定向
  - 401，`Unauthorized`，未授权
  - 403，`Forbidden`，禁止访问
  - 404，`Not Found`，未发现指定网址
  - 500，`Internet Server Error`，服务器发生错误

**服务器响应**

- `responseText`：获取字符串数据
- `responseXML`：获取XML数据

原生`HTTP`请求写法：

> 注：`POST`请求写法，必须带请求头`xhr.setRequestHeader()`

```js
var xhr;

if (window.XMLHttpRequest) {
  xhr = new XMLHttpRequest();
} else {
  xhr = new ActiveXObject('Microsoft.XMLHTTP');
}

console.log(xhr.readyState); //0 请求未初始化

xhr.open('GET', 'http://localhost', true);

// POST请求写法，必须带请求头
xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
xhr.send('status=1&flag=1');

console.log(xhr.readyState); //1 服务器连接已建立

xhr.onreadystatechange = function () {
  console.log(xhr.readyState); 
  //2 请求已接受
  //3 请求处理中
  //4 请求已完成，且响应已就绪

  if (xhr.readyState === 4 && xhr.status === 200) {
    console.log(JSON.parse(xhr.responseText));
  }
}
```



## 版本

**`XMLHttpRequest`版本**

标准：

- `Level 1` 缺点：
  - 无法发送跨域请求
  - 不能非纯文本的数据
  - 无法获取传输速度
- `Level 2` 改进：
  - 可以发送跨域请求
  - 支持获取二进制数据(非纯文本数据)
  - 支持上传文件
  - `formData`对象
  - 可以获取传输进度
  - 可以设置超时时间



## 兼容性

- `IE8/9/Opera Mini`不支持`xhr`对象
- `IE10/11`不支持响应类型为`JSON`
- 部分浏览器不支持超时设置
- 部分浏览器不支持`blob`(文件对象的二进制数据)



## 五个事件

- `xhr.onloadstart`：绑定`HTTP`请求发出的监听函数。
- `xhr.onerror`：绑定请求失败的监听函数(修改封装的`AJAX`)。
- `xhr.onload`：绑定请求成功完成的监听函数。
- `xhr.onabort`：绑定请求终止(调用`abort()`方法)的监听函数。
- `xhr.onloadend`：绑定请求完成(不管成功与失败)的监听函数。

触发顺序：

1. `loadstart`
2.  `readyState === 4 `
3. `load/error/abort`
4. `loadend`



## 异步

异步与同步

- `async = true`(默认)：`Ajax`异步发送请求时，不影响页码加载，用户操作以及`Ajax`程序后的执行。
- `async = false`：`Ajax`同步发送请求时，浏览器必须等到请求完成并响应成功后，`Ajax`程序后续的程序才会执行。



## 响应数据

`dataType`返回的数据类型有`JSON`，`TEXT`，`XML`。

- `responseText`：获取字符串数据
- `responseXML`：获取XML数据



## 封装

封装`AJAX`

```js
/**
 * AJAX封装
 * 
 * 调用写法一：
 * $.ajax({
 *   url: 'xxx',
 *   type: 'POST',
 *   dataType: 'JSON',
 *   data: {
 *     status: 1
 *   },
 *   success: function (data) {
 *     console.log(data);
 *   }
 * })
 * 
 * 调用写法二：
 * $.post('http://localhost/xxx', { status: 1 }, function (data) { console.log(data); });
 * 
 * 调用写法三：
 * $.get('http://localhost/xxx?status=1', function (data) { console.log(data); });
 * 
 * 
 */

//老写法：
// var $ = {
//   ajax: function (opt) {
//     var url = opt.url;
//     console.log(url);
//   },
//   post: function () {
//     console.log('post');
//   },
//   get: function () {
//     console.log('get');
//   }
// }

// 模块化写法
var $ = (function () {
  //利用_doAjax函数传参拿到局部作用域ajax函数里的形参
  function _doAjax(opt) {
    //兼容IE5,IE6
    var o = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

    //IE4及以下
    if (!o) {
      throw new Error('您的浏览器不支持异步发起HTTP请求');
    }

    //初始化传入的配置
    var opt = opt || {},
      // console.log(opt); //{type: "POST"}
      //初始化请求类型为GET
      type = (opt.type || 'GET').toUpperCase(),
      // console.log(type); //POST
      // 同步/异步 false/true
      async = '' + opt.async === 'false' ? false : true,
        url = opt.url,
        //如果GET请求就为null
        data = opt.data || null,
        //响应数据
        dataType = opt.dataType || 'JSON',
        timeout = opt.timeout || 30000,
        error = opt.error || function () {},
        success = opt.success || function () {},
        //不管成功或失败都执行complete函数
        complete = opt.complete || function () {},

        // 初始化定时器
        t = null;

    if (!url) {
      throw new Error('您没有填写url');
    }

    /**发送HTTP请求
     * @type 请求类型
     * @url 请求地址
     * @async 异步/同步
     */
    o.open(type, url, async);

    //超时设置 写法一： 设置超时时间 30s 
    //兼容性不太好
    // o.ontimeout = 30000;

    //设置POST请求头
    //如果为真走后面
    type === 'POST' && 
      o.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    //如果是GET请求，不用传参数
    o.send(type === 'GET' ? null : formatDatas(data));

    //监听响应事件
    o.onreadystatechange = function () {
      if (o.readyState === 4) {
        //请求已完成，且响应已就绪
        if (o.status >= 200 && o.status < 300 && o.status === 304) {
          switch (dataType.toUpperCase()) {
            case 'JSON':
              // 成功时响应服务器JSON数据
              success(JSON.parse(o.responseText));
              break;
            case 'TEXT':
              // 成功时响应服务器文本数据
              success(o.responseText);
              break;
            case 'XML':
              // 成功时响应服务器XML数据
              success(o.responseXML);
              break;
            default:
              // 默认响应服务器JSON数据
              success(JSON.parse(o.responseText));
          }
        } else {
          error();
        }
        // 无论成功与否都要执行complete函数
        complete();
        clearTimeout(t);
        t = null;
        o = null;
      }
    }

    // 超时设置 写法一：
    //只要超时就会执行的函数
    //兼容性不太好
    // o.ontimeout = function () {
    //   //o对象的所有程序都会中止
    //   o.abort();
    //   //并销毁对象
    //   o = null;
    // }

    // 超时设置 写法二：
    t = setTimeout(function () {
      //o对象的所有程序都会中止
      o.abort();
      clearTimeout(t);
      t = null;
      o = null;
      //抛出错误
      throw new Error('This request has been timeout for' + url);
    }, timeout);
  }

  //希望将{status:1,flag:2}转为'status=1&flag=2'
  //格式化传入的data数据
  function formatDatas(obj) {
    var str = '';
    for (var key in obj) {
      str += key + '=' + obj[key] + '&';
    }
    //去掉最后一项的 &
    //正则规则：以&结尾 替换为空字符
    return str.replace(/&$/, '');
  }

  return {
    ajax: function (opt) {
      _doAjax(opt);
    },
    get: function (url, dataType, successCB, errorCB, completeCB) {
      _doAjax({
        type: 'GET',
        url: url,
        dataType: dataType,
        success: successCB,
        error: errorCB,
        complete: completeCB
      });
    },
    post: function (url, data, dataType, successCB, errorCB, completeCB) {
      _doAjax({
        type: 'POST',
        url: url,
        data: data,
        dataType: dataType,
        success: successCB,
        error: errorCB,
        complete: completeCB
      });
    }
  }
})();
```





## `axios`

除了登录请求都要带上`token`，服务器才可以鉴别你的身份。

```js
axios.interceptor.request.use((req) => {
  const currentUrl = req.url;
  if(currentUrl !== '/login'){
    //拦截每次请求都会带上请求头权限
    req.headers.Authorization = sessionStorage.getItem('token');
  }
  return req;
});
```



