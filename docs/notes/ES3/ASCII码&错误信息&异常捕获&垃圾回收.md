# `ASCII`码&错误信息&异常捕获&垃圾回收



## ASCII 码

`UNICODE `码涵盖 `ASCII `码。可以用`charCodeAt()`方法查询。

- 表 1 字符为一个字节对应 `0-127`
- 表 2 字符为两个字节对应 `128-255`

`index` 字符串中某个位置的数字，即字符在字符串中的下标。

```js
stringObject.charCodeAt(index);
```



## 错误信息

`JavaScript`中的错误信息类型有：

- `SyntaxError` 语法错误
  - 变量名不规范
  - 关键字赋值
  - 基本的语法错误
- `ReferenceError`引用错误
  - 变量或者函数未被声明
  - 给无法被赋值的对象赋值
  - `RangeError`范围错误
  - `TypeError `类型错误
  - `URIError URI`错误
  - `EvalError` `eval `函数执行错误
- 人为抛出的错误

```js
//变量名不规范
var 1 = 1;
//Uncaught SyntaxError: Unexpected number
var 1ab = 1;
function 1 test() {}
//Uncaught SyntaxError: Invalid or unexpected token
```

```js
//关键字赋值
new = 5;
//Uncaught SyntaxError: Unexpected token '='
function = 1;
//Uncaught SyntaxError: Unexpected token '='
```

```js
//基本的语法错误
var a = 5:
//Uncaught SyntaxError: Unexpected token ':'
```

```js
//变量或者函数未被声明
test();
//Uncaught ReferenceError: test is not defined
console.log(a);
//Uncaught ReferenceError: a is not defined
```

```js
//给无法被赋值的对象赋值
var a = 1 = 2;
console.log(a) = 1;
//Uncaught SyntaxError: Invalid left-hand side in assignment
```

```js
//RangeError范围错误
//数组长度赋值为负数
var arr = [1, 2, 3];
arr.length = -1;
console.log(arr);
//Uncaught RangeError: Invalid array length

//对象方法参数超出可行范围
var num = new Number(66.66);
console.log(num.toFixed(-1));
//Uncaught RangeError: toFixed() digits argument must be between 0 and 100
```

```js
//TypeError 类型错误
//调用不存在的方法
123();
//Uncaught TypeError: 123 is not a function

var obj = {};
obj.say();
//Uncaught TypeError: obj.say is not a function

//实例化原始值
var a = new 'string';
var a = new 123;
//Uncaught TypeError: "string" is not a constructor
```

关于 `URL`：

```js
//URIError URI错误
//URI: UNIFORM RESOURCE IDENTIFIER 统一资源标识符
//URL: UNIFORM RESOURCE LOCATOR 统一资源定位符
//URN: UNIFORM RESOURCE NAME 统一资源名称
//URL和URN属于URI

//URL: http://www.baidu.com/news#today 协议+域名+资源空间
//     ftp://www.baidu.com/ftp#developer
//URN: www.baidu.com/ftp#developer 代表资源唯一的标识 -> ID
//     href="tel:13900000000"
```

```js
//URLError URI错误
var myUrl = 'http://www.baidu.cin?name=哈哈哈';

//把中文字转化为中文编码字符
var newUrl = encodeURI(myUrl);
console.log(newUrl);
//http://www.baidu.cin?name=%E5%93%88%E5%93%88%E5%93%88

//把中文编码字符转化为中文字
var newNewUrl = decodeURI(newUrl);
console.log(newNewUrl);
//http://www.baidu.cin?name=哈哈哈

var str = decodeURI('%fsdcf%');
//Uncaught URIError: URI malformed
```

```js
//人为抛出的错误
var error = new Error();
var error2 = new SyntaxError();
var error3 = new ReferenceError();
var error4 = new TypeError();
```

## 异常捕获

`try..catch..`手动抛出错误方法来避免程序遇到错误终止执行。

```js
//try正常执行没有错误的时候不走catch
try {
  console.log('正常执行1');
  console.log(a);
  console.log(b);
  console.log('正常执行2');

  //捕获
} catch (e) {
  console.log(e); //'ReferenceError: a is not defined'
  //不管有错没错都会执行
} finally {
  console.log('正常执行3');
}
console.log('正常执行4');
//正常执行1
//'ReferenceError: a is not defined'
//正常执行3
//正常执行4
```

案例：

```js
//JSON字符串
var jsonStr = '';

try {
  console.log('我要执行了！');
  var json = JSON.parse(jsonStr);
  console.log(json);
} catch (e) {
  var errorTip = {
    name: '数据传输失败',
    errorCode: '10010'
  }
  console.log(errorTip);
  //{name: "数据传输失败", errorCode: "10010"}
}
```

`throw`

```js
//JSON字符串
var jsonStr = '';

try {
  if (jsonStr == '') { throw 'JSON字符串为空'; }
  console.log('我要执行了！');
  var json = JSON.parse(jsonStr);
  console.log(json);
} catch (e) {
  console.log(e); //JSON字符串为空
  var errorTip = {
    name: '数据传输失败',
    errorCode: '10010'
  }
  console.log(errorTip);
  //{name: "数据传输失败", errorCode: "10010"}
}

```

## 垃圾回收

**垃圾回收原理：**

1. 找出不再使用的变量
2. 释放其占用内存
3. 固定的时间间隔运行

```js
//标记清除: mark and sweep
function test() {
  var a = 0; //进入环境
}
test(); //a 标记为 离开环境

//引用计数 reference counting
//次数为0 回收

function test() {
  var a = new Object(); //a = 1;
  var b = new Object(); //b = 1;
  var c = a; //a++ = 2
  var c = b; //a-- = 1

  //循环引用
  a.prop = b; //b = 2;
  b.prop = a; //b = 2;

  a = null;
  b = null;
}

```



