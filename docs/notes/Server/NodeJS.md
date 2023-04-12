# `NodeJS`

## 概述

2009.3诞生，`nodejs`之父叫`Ryan dahl`。刚开始叫`webjs`，用了`c++`开发了前端项目，解决异步`I/O`阻塞情况，用了事件驱动的方式实现非阻塞`I/O`，前期只是打算开发`web`应用项目，随着`nodejs`社区的发展，不限于`web`应用的开发如`nodejs`的一系列工具，像`npm`包管理工具，也可以实现前端开发的构建工具。

`NodeJS`是基于`Chrome V8`引擎的`JS`运行环境。使用了一个事件驱动，非阻塞式`I/O`的模型，使其轻量又高效。

**作用：**

可以让`JavaScript`能运行在服务端，并完成相应后端服务的一套`API`。前端语言的`NodeJS`在`Web`层中对前端大量数据请求的高并发和高性能的处理，并对接后端服务层的复杂的业务逻辑和持久层庞大的吞吐量。

- 前后端分离解决跨域
- 服务端渲染
- 前端工程化服务与工具

**`Node`运行环境：**

- `JavaScript`中`ES`部分
- `Node`模块
- `Node API`

**核心思想：**是事件驱动，大量利用回调机制，如事件完成通知，异步的事件驱动。

```js
function test(a, b, cb){
  const res = a + b;
  cb && cb(res);
}

test(1, 2, function(res){
  console.log(res + 3);
});
```

**主线程交替处理任务**

它是多线程同步模型的高并发能力(高性能处理线程池)，多人访问服务器请求的场景。

## 编译过程

`JavaScript`中的编译过程有：

1. 词法分析
   1. 分析识别关键字(`var`,`function`)
   2. 分析标识符(`var a = 1;`中的`a`)
   3. 分析分界符(`function test(a, b){}`如空格)，划分界限作用
   4. 分析运算符(如加减乘除)，或与运算
2. 语法分析(`parsing`, 字符转为语法抽象树)，将词法分析的基础上，分析其语法，将单词序列组合成短语。
3. 语义分析(生成代码, `AST`树转为二进制机器码)。

***`NodeJS`和`JavaScript`是同一种语言吗？***

不是，他们词法分析和语法分析一致，但`NodeJS`在语义分析时缺少运行环境可执行的代码这一步，然后再转为当前运行环境所需要的二进制机器码，再调用该运行环境的`API`。

## `I/O`操作

在服务器端的输入和输出(`Input and Output`)是一个费事的操作，读写磁盘上的内容。**阻塞问题**是`I/O`操作时，主进程里程序2等待程序1完成才能继续执行。非阻塞`I/O`，通过异步方式挂起，不用等待。

- **`I/O`密集**是频繁操作I/O，如文件操作，请求网络和数据库等操作。
- **`CPU`密集**是读写运算量非常大，如高性能逻辑运算，解压缩，数据分析等操作。

## 单线程

`JavaScript`主线程是单线程的原因是防止多个线程造成`DOM`操作与渲染任务冲突(`GUI`渲染与`JS`引擎线程运行互斥)，`NodeJS`中沿用了主线程为单线程的方式。

**多线程与单线程的优劣：**

- 多线程要频繁切换任务上下文处理多个问题
- 单线程不需要不存在任务上下文切换问题
- 多线程在处理多个问题时需要管锁机制
- 单线程不需要管锁机制

**多线程任务的运行规则：**

例如三个线程同时切换做，在写入文件时有管锁机制

- 线程1：看文档
- 线程2：写代码
- 线程3：回消息

**单线程任务的运行规则：**

事件都进入`Node`主线程运行，然后会有事件驱动通知回调函数进入任务队列，分配到线程池，线程完成时通知回调，执行回调函数

- 事件1：看文档
- 事件2：写代码
- 事件3：回消息



## 分层

前端有了`Ajax`后，后端的任务转移了一部分给前端，`.ASP`，`.JSP`，`.php`也没有使用了，前端负责的`web`层(`controllers`)负责了用户交互的部分如权限校验，`http`请求进行对象封装的数据预处理，用户提示等功能。后端存在服务层即业务逻辑层(`services`)，负责了登录操作等业务处理。后端存在数据操作层(`DAO-data access object`)，数据进入数据库之前进行的一系列数据操作。以及后端存在的持久层如数据库，解决有效管理数据格式统一和数据之间的关系。



## 模块化规范

在`ES6`之前没有明确的模块化规范，标准库也比较少，包管理工具也较少，缺少相应的标准，模块化系统也欠缺。`CommonJS`规范定义了以下标准：

- 一个文件只有一个模块拥有自己单独的一个作用域。
- 普通方式定义的变量，函数，对象都属于模块内部。
- 模块的加载方式通过`require()`去引入。
- 模块通过`exports`或者`module.exports`方式进行导出。

在`node`环境中的一个文件里打印一个函数的参数列表。首先没有报错，而是返回了一个实参列表类数组对象报错了5个索引属性。说明了一个文件是一个函数的内部的作用域。

```JS
console.log(arguments);
/*
[Arguments] {
  '0': {},
  '1': [Function: require] {
    resolve: [Function: resolve] { paths: [Function: paths] },      
    main: Module {
      id: '.',
      path: 'C:\\frontEnd\\exercise\\nodejs-exercise',
      exports: {},
      parent: null,
      filename: 'C:\\frontEnd\\exercise\\nodejs-exercise\\index.js',
      loaded: false,
      children: [],
      paths: [Array]
    },
    extensions: [Object: null prototype] {
      '.js': [Function (anonymous)],
      '.json': [Function (anonymous)],
      '.node': [Function (anonymous)]
    },
    cache: [Object: null prototype] {
      'C:\\frontEnd\\exercise\\nodejs-exercise\\index.js': [Module]
    }
  },
  '2': Module {
    id: '.',
    path: 'C:\\frontEnd\\exercise\\nodejs-exercise',
    exports: {},
    parent: null,
    filename: 'C:\\frontEnd\\exercise\\nodejs-exercise\\index.js',
    loaded: false,
    children: [],
    paths: [
      'C:\\frontEnd\\exercise\\nodejs-exercise\\node_modules',
      'C:\\frontEnd\\exercise\\node_modules'
    ]
  },
  '3': 'C:\\frontEnd\\exercise\\nodejs-exercise\\index.js',
  '4': 'C:\\frontEnd\\exercise\\nodejs-exercise'
}
*/
```

该类数组对应索引为1是一个`require`函数。该对象保存了模块文件变量的引入方式。该函数在外部文件`require('./xxx')`执行传入依赖路径实现引入另外的模块文件。

```js
console.log(typeof arguments[1]); //function
```

该类数组对应索引为2是一个`Module`对象。

```js
console.log(arguments[2]); 
/*
Module {
  id: '.',
  path: 'C:\\frontEnd\\exercise\\nodejs-exercise',
  exports: {},
  parent: null,
  filename: 'C:\\frontEnd\\exercise\\nodejs-exercise\\index.js',
  loaded: false,
  children: [],
  paths: [
    'C:\\frontEnd\\exercise\\nodejs-exercise\\node_modules',    
    'C:\\frontEnd\\exercise\\node_modules'
  ]
}
*/
```

实现一个模块文件的一个独立的作用域可以通过立即执行函数去定义。

```js
const exports = {};
const requireFn = () => {}
const ModuleObj = {};
const __filename = '';
const __dirname = '';

const moduleA = (function () {
  console.log(arguments);
})(exports, requireFn, ModuleObj, __filename, __dirname);

/*
[Arguments] {
  '0': {},
  '1': [Function: requireFn],
  '2': {},
  '3': '',
  '4': ''
}
*/
```

## 导入导出

`nodejs`提供了核心模块，用户编写的属于文件模块。

**模块导入**

如果是核心模块时，`requre()`执行的参数可以不是路径而是依赖的名称，如`require('http')`，而不是`require('./my.js')`。核心模块不需要路径的原因是核心模块在`node`编译时已经编译好成为二进制文件了，在`node`进程启动时核心模块已经全部加载到内存中。`require()`查找的方式默认以`.js`后缀，找不到找`.json`后缀，再找不到找`.node`后缀，最终找不到会报错。

假如两次引入同一个模块时，会缓存一个，只打印一次结果，说明模块被缓存了只加载一次。

```js
require('./my');
require('./my');
//只打印一次my.js里的程序
```

**模块导出**

模块导出的方式是通过模块函数作用域内的参数列表`arguments[2]`中的`module`对象，将属性和方法挂载至`module.exports`对象进行向外导出。

```JS
const name = 'ilin';
const setName = () => {};
module.exports = { name, setName }
```

`exports`和`module.exports`的区别。`exports`是`module.exports`赋值后的引用，是`module.exports`的快捷方式。

```js
(function(){
  exports = module.exports;
})(exports, requireFn, ModuleObj, __filename, __dirname);
```



## 目录结构

在`node`中包管理的符合标准`CommonJS`规范目录结构如：

- `/bin`，存放二进制目录
- `/lib`，存放`JavaScript`代码
- `/doc`，存放文档目录
- `/test`，存放单元测试用的代码



## `Buffer`

在`ES6`的类数组`TypedArray`之前`JavaScript`还没有出现用于读取和操作二进制数据流的机制。`Buffer`类作为`Node.js`的`API`，用于在`TCP`流，文件系统操作，以及其他上下文与八位字节流进行交互。当服务器作为网站后台时，接收一条非常大的数据时，需要一种机制来缓冲这条数据。

在`Node`应用中，需要处理网络协议、操作数据库、处理图片、接收上传文件等，加密解密，在网络流和文件的操作中，要处理大量二进制数据，而`Buffer`就是在内存中开辟一片区域（初次初始化为8`bit`），用来存放二进制数据。

字符集是字符都有一个编号对应相应的字符，在编码的过程中经常会使用到这个字符，通过字符能够在相应的字符集中找到相对应的字符实体。类似于`ASCII`表中一个字符对应一个十进制的数字。但是计算机在做存储的时候，它无法识别十进制的数字，只能通过二进制数字进行存储。每个数字称为一个比特（二进制位）或比特（Bit，Binary digit 的缩写）。假如有7位二进制数即有7`bit`。

```
000000 -> 十进制 -> 128(ASCII)
```

`Buffer`类是全局的，不需要引入。通过`Buffer.from`创建一个`buffer`缓冲区。

```js
const buf = Buffer.from('test');
console.log(buf);
//<Buffer 74 65 73 74>
```

以上通过十六进制的每两位比特所对应的字符。如`74`从十六进制转位十进制是`116`对应的字符是`t`。

通过`parseInt`方法可以将指定数字从十六进制转为十进制。

```js
console.log(parseInt(74, 16)); //116
```

字符集编码是同一所有国家地区语言的编码集合。如`unicode`编码，记录着不同国家不同的文字和不同的符号。网络的操作都是基于二进制数据的操作， 表达内容是网络传输的内容，不同国家的文字通过字符集编码如`utf-8`，进行统一编码为二进制数据去网络传输，等待传输完毕时进行解码，解码之后页面呈现。

`Node.js`当前支持的字符编码有：

- `ascii`，仅支持7位`ASCII`数据。处理前128位`unicode`码。
- `utf8`，多字节编码的`unicode`字符，许多网页和文档格式都使用。
- `utf16le`，2或4个字节。
- `ucs2`，`utf16le`的别名。
- `base64`，`Base64`编码。
- `hex`，将每个字节编码成两个十六进制的字符。

`Buffer`是用来操作二进制数据流，有点像数组，每一串字节代表一个字符。有时候每两串字节才代表一个中文字符。如以下三个字节`e6 82 a8`才代表一个汉子"您"，另外三个字节`e5 a5 bd`代表汉字"好"。

```js
const buf = Buffer.from('你好');
console.log(buf);
//<Buffer e6 82 a8 e5 a5 bd>
console.log(buf.length); //6 表示6个字节
```

`Buffer`收集的是多个十六进制的(`0-255`)数字的类似数组结构的实例。因为类似数组，也有像数组操作如`buf[index]`，`indexOf`，`includes`，`keys`，`buf.length`，`values`等方法。但是没有`push`方法，原因是`Buffer`数据的长度大小是固定的，数据流是实时的并且数据量较大的。`Buffer`是由`V8`堆外部的固定大小的原始内存分配，即`node`代码不是在`V8`中生成的，而是在`node`中`C++`层面实现的，`node`的`Buffer`生成不是通过`JavaScirpt`实现的，而是通过`C++`实现的。

**创建**

`Buffer.alloc()`方法利用参数1生成一个10字节长度的空间。里面有10个字节。

```js
const buf = Buffer.alloc(10);
console.log(buf);
//<Buffer 00 00 00 00 00 00 00 00 00 00>
```

`Buffer.alloc()`方法利用参数2往空间里填充`buffer`。返回十六进制的方式存储的字节。

```js
const buf = Buffer.alloc(10, 1);
console.log(buf);
//<Buffer 01 01 01 01 01 01 01 01 01 01>
```

`Buffer.alloc()`方法利用参数1生成一个5字节长度的空间。参数2往空间里填充制定字符到`buffer`。默认字符集编码为`utf8`转为相应的十六进制并存储起来。

```js
const buf = Buffer.alloc(5, 'a');
console.log(buf);
//<Buffer 61 61 61 61 61>
```

`Buffer.allocUnsafe()`创建随机10字节长度的不安全空间，涉及旧数据，对数据敏感。只接收一个长度参数。

```js
const buf = Buffer.allocUnsafe(10);
console.log(buf);
//<Buffer 20 ec d2 0f 01 00 00 00 00 00>
```

`Buffer.from()`创建一个包含数字内容的数组返回的`buffer`。将数组的每一项展开分别放入相应的内存空间中。

```js
const buf = Buffer.from([1, 2, 3]);
console.log(buf);
//<Buffer 01 02 03>
```

`Buffer.from()`它返回的`buffer`申请的是一个单独的内存空间。

```js
const buf1 = Buffer.from([1, 2, 3]);
console.log(buf1);
//<Buffer 01 02 03>

const buf2 = Buffer.from([1, 2, 3]);
console.log(buf2);
//<Buffer 01 02 03>

console.log(buf1 === buf2);
//false
```

`Buffer.from()`创建一个包含数字内容的字符串返回的`buffer`。参数1为要编码的字符串，参数2为编码格式，默认是`utf8`。

```js
const buf = Buffer.from('test');
console.log(buf);
//<Buffer 74 65 73 74>
```

`Buffer.from()`使用字符串编码时需要注意返回`buffer`的长度，以及对空格也敏感。

```js
const buf = Buffer.from('This is a test');
console.log(buf);
//<Buffer 54 68 69 73 20 69 73 20 61 20 74 65 73 74>
console.log(buf.length); //14
```

不同的编码方式，多个字节对应一个字符导致`buffer`的长度也不一样。如使用`utf-16`来创建一个`buffer`的长度要比`utf-8`的长的多。

```js
const buf1 = Buffer.from('test', 'ucs2'); //ucs2是utf16le的别名
console.log(buf1, buf1.length);
//<Buffer 74 00 65 00 73 00 74 00> 8

const buf2 = Buffer.from('test', 'utf8');
console.log(buf2, buf2.length);
//<Buffer 74 65 73 74> 4
```

`Buffer.from()`创建一个包含对象内容返回的`buffer`。参数1为要编码的类数组对象，类数组的长度决定`buffer`空间的长度，类数组下标作为填充空间的位置。参数2为字节偏移量或编码。参数3为长度。

```js
const arrayLike1 = { 0: 1, 1: 2, length: 2 };
const arrayLike2 = { 0: 1, 1: 2, length: 5 };
const arrayLike3 = { 3: 1, 4: 2, length: 5 };

const buf1 = Buffer.from(arrayLike1);
console.log(buf1, buf1.length);
//<Buffer 01 02> 2

const buf2 = Buffer.from(arrayLike2);
console.log(buf2, buf2.length);
//<Buffer 01 02 00 00 00> 5

const buf3 = Buffer.from(arrayLike3);
console.log(buf3, buf3.length);
//<Buffer 00 00 00 01 02> 5
```

**查询**

写了一个方法去对十六进制进行转换为十进制，接着通过`String.fromCharCode`方法返回对应`unicode`码对应的字符。

```js
//hexadecimalToDecimal 十六进制转十进制
function hexadecimalToDecimal(num) {
  return parseInt(num, 16);
}

const ten = hexadecimalToDecimal(61);
console.log(String.fromCharCode(ten)); //a
```

`Buffer.isEncoding()`方法可以检测字符编码是否符合`Node.js`里的字符编码，`Node.js`支持的字符编码非常有限，支持时返回`true`。

```js
console.log(Buffer.isEncoding('utf8')); //true
console.log(Buffer.isEncoding('utf32')); //false
```

**长度**

`Buffer.byteLength()`返回的字符串实际字节长度与`buffer`内存空间的`length`属性长度是一致的。参数1为`buffer`，参数2为字符编码如`utf8`。

```js
const buf1 = Buffer.from([1, 2, 3, 4]);
const buf2Len = Buffer.byteLength(buf1);
console.log(buf1.length, buf2Len); //4 4
```

**写入**

被`Buffer.alloc()`创建`buffer`空间的对象通过`buffer.write()`方法进行写入。将字符串写入到`buffer`内存空间中。参数1为要写入的字符串，参数2为写入的位置。参数3为写入的字节数量。返回值为已经写入的字节数量。参数4为字符编码，默认为`utf8`。

```js
const buf = Buffer.alloc(5);
console.log(buf); 
//<Buffer 00 00 00 00 00>
const len = buf.write('test', 1, 3);
console.log(len, buf);
//3 <Buffer 00 74 65 73 00> 
```

以上参数3的限制了3位，说明只向`buffer`内存空间写入`t`，`e`，`s`这三个字符串对应的十六进制的字符编码。

**转换**

`buffer.toString()`方法将`buffer`内存空间里的字符编码转为字符串。可选参数1为字符编码，默认`utf8`，可选参数2为转换起始位置，可选参数3为转换结束位置。返回值为转换后的字符串。

创建长度为26的`buffer`内存空间，并填充内容为`97 - 123`的十进制的`ASCII`值。通过`buf.toString`用`ascii`字符编码转换第`0 - 5`位的字符编码为字符串。

```js
const buf = Buffer.allocUnsafe(26);

for (let i = 0; i < 26; i++) {
  buf[i] = i + 97;
}

console.log(buf.toString('ascii', 0, 5)); //abcde
```

**比较**

`Buffer.compare()`方法对两个`buffer`内存空间进行比较。对字节数进行排序。

```js
const buf1 = Buffer.from('1234');
const buf2 = Buffer.from('0123');
const arr = [buf1, buf2];
console.log(arr.sort(Buffer.compare));
//[ <Buffer 30 31 32 33>, <Buffer 31 32 33 34> ]
```

**合并**

`Buffer.concat()`方法合并多个`buffer`内存空间为一个新的内存空间。参数1为`buffer`的类数组或数组列表，参数2为合并后的`buffer`总长度。

```js
const buf1 = Buffer.alloc(10);
const buf2 = Buffer.alloc(14);
const buf3 = Buffer.alloc(18);
const totalLength = buf1.length + buf2.length + buf3.length;

console.log(totalLength);
// Prints: 42

const bufA = Buffer.concat([buf1, buf2, buf3], totalLength);

console.log(bufA);
// Prints: <Buffer 00 00 00 00 ...>
console.log(bufA.length);
// Prints: 42
```

**切片**

`buffer.slice()`方法会创建一个对旧的`buffer`对应开始和结束位置的内存空间进行切片返回新的`buffer`内存空间。

```js
const buf = Buffer.from('buffer');

console.log(buf.slice(-6, -1).toString());
// Prints: buffe
// (Equivalent to buf.slice(0, 5))
```

**拷贝**

`buffer.copy()`拷贝一个目标`buffer`内存空间。参数1为目标的`buffer`内存空间，参数2为开始写入位置，参数3为开始拷贝位置，参数4为结束拷贝位置。返回值为拷贝后的字节数。

```js
const buf1 = Buffer.allocUnsafe(26);
const buf2 = Buffer.allocUnsafe(26).fill('!');

for (let i = 0; i < 26; i++) {
  // 97 是 'a' 的十进制ASCII值
  buf1[i] = i + 97;
}

// 拷贝 `buf1` 中第16至第19字节偏移量的数据到 `buf2` 第8字节偏移量起始 `buf2`
buf1.copy(buf2, 8, 16, 20);

console.log(buf2.toString('ascii', 0, 25));
// 打印: !!!!!!!!qrst!!!!!!!!!!!!!
```

**填充**

`buffer.fill()`给一个`buffer`进行内容填充。参数1是一个用来填充`buffer`的值，参数2是开始位置，参数3是结束位置，参数4是字符编码默认为`utf8`。返回值是填充后的`buffer`的引用。

```js
const b = Buffer.allocUnsafe(50).fill('h');
console.log(b.toString());
// Prints: hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh
```

**索引**

`buffer.indexOf()`查找对应`buffer`对应的索引。参数1是`buffer`中的查找一个值，参数2开始查找位置，参数3是字符编码默认为`utf8`。返回值是首次查找成功的索引，没找到返回`-1`。

```js
const buf = Buffer.from('this is a buffer');

console.log(buf.indexOf('this'));
// Prints: 0
console.log(buf.indexOf('is'));
// Prints: 2
console.log(buf.indexOf(Buffer.from('a buffer')));
// Prints: 8
console.log(buf.indexOf(97));
// Prints: 8 (97 is the decimal ASCII value for 'a')
console.log(buf.indexOf(Buffer.from('a buffer example')));
// Prints: -1
```

**遍历**

`buffer`是一个可迭代对象，支持`buffer.keys()`和`buffer.values()`等遍历`buffer`键名键值的方法。

```js
const buf = Buffer.from('buf');

for (const key of buf.keys()) {
  console.log(key);
}
// Prints:
//   0
//   1
//   2
```

```js
const buf = Buffer.from('buf');

for (const value of buf.values()) {
  console.log(value);
}
// Prints:
//   98
//   117
//   102
```

**乱码处理**

字符串解码器`StringDecoder`收集多余不完整的字节。打印不了的部分缓存至下一次进行执行。该`string_decoder`模块提供了一个 `API`，`Buffer`用于以保留编码的多字节 `UTF-8` 和`UTF-16` 字符的方式将对象解码为字符串。

```js
const { StringDecoder } = require('string_decoder');
const decoder = new StringDecoder('utf8');

const cent = Buffer.from([0xC2, 0xA2]);
console.log(cent); //<Buffer c2 a2>
console.log(decoder.write(cent)); //¢

const euro = Buffer.from([0xE2, 0x82, 0xAC]);
console.log(decoder.write(euro)); //€
```



## `Path`

提供用于处理文件和目录路径的模块。需要引入。

```js
const path = require('path');
```

`path.parse()`方法对路径进行解析并返回一个对象，以`/`目录分隔符。

```js
//mac or linux
console.log(path.parse('/home/user/dir/file.txt'));
/*
{
  root: '/',
  dir: '/home/user/dir',
  base: 'file.txt',
  ext: '.txt',
  name: 'file'
}
*/

//windows
console.log(path.parse('C:\\path\\dir\\file.txt'));
/*
{
  root: 'C:\\',
  dir: 'C:\\path\\dir',
  base: 'file.txt',
  ext: '.txt',
  name: 'file'
}
*/
```

一个完整的路径地址包含了`root`,`dir`，`base`，`name`，`ext`。

```js
//mac or linux
┌─────────────────────┬────────────┐
│          dir        │    base    │
├──────┬              ├──────┬─────┤
│ root │              │ name │ ext │
"  /    home/user/dir / file  .txt "
└──────┴──────────────┴──────┴─────┘

//windows
┌─────────────────────┬────────────┐
│          dir        │    base    │
├──────┬              ├──────┬─────┤
│ root │              │ name │ ext │
" C:\      path\dir   \ file  .txt "
└──────┴──────────────┴──────┴─────┘
```

`path.dirname()`方法返回路径目录`dir`。尾部目录分隔符会被忽略。

```js
console.log(path.dirname('/foo/bar/baz/asdf/quux'));
///foo/bar/baz/asdf
```

`path.basename()`方法返回一个路径的最后一段的路径信息，包含文件名称和后缀。参数1是检索的字符串路径地址，可选参数2是一个文件拓展名，假如传入只返回除了该文件名后缀的文件名称。

```js
console.log(path.basename('/foo/bar/baz/asdf/quux.html'));
//quux.html
console.log(path.basename('/foo/bar/baz/asdf/quux.html', '.html'));
//quux

//mac or linux
path.basename('C:\\temp\\myfile.html');
// Returns: 'C:\\temp\\myfile.html'
//windows
path.basename('C:\\temp\\myfile.html');
// Returns: 'myfile.html'
```

`path.extname()`方法返回路径最后一部分的文件后缀。

```js
path.extname('index.html');
// Returns: '.html'

path.extname('index.coffee.md');
// Returns: '.md'

path.extname('index.');
// Returns: '.'

path.extname('index');
// Returns: ''

path.extname('.index');
// Returns: ''
```

`path.sep()`方法可以将一个路径以分隔符号的方式进行分割，尝试打印不同环境的分隔符。

```js
const { sep } = require('path');
//mac or linux
// /

//windows
console.log(sep); // \
```

分割内容作为数组返回。

```js
//mac or linux
'foo/bar/baz'.split(path.sep);
// Returns: ['foo', 'bar', 'baz']

//windows
'foo\\bar\\baz'.split(path.sep);
// Returns: ['foo', 'bar', 'baz']
```

`path.delimiter()`方法对不同环境中的路径定界符进行分割，以数组内容返回。`;`用于`windows`，`:`用于`mac or linux`。

```js
//mac or linux 
console.log(process.env.PATH);
// Prints: '/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin'
process.env.PATH.split(path.delimiter);
// Returns: ['/usr/bin', '/bin', '/usr/sbin', '/sbin', '/usr/local/bin']

//windows
console.log(process.env.PATH);
// Prints: 'C:\Windows\system32;C:\Windows;C:\Program Files\node\'
process.env.PATH.split(path.delimiter);
// Returns ['C:\\Windows\\system32', 'C:\\Windows', 'C:\\Program Files\\node\\']
```

`path.normalize()`方法可以规范化一个存在多个分隔符的路径。使一个凌乱的路径变得清晰。

```js
//mac or linux 
path.normalize('/foo/bar//baz/asdf/quux/..');
// Returns: '/foo/bar/baz/asdf'

//windows
path.normalize('C:\\temp\\\\foo\\bar\\..\\');
// Returns: 'C:\\temp\\foo\\'
```

`path.join()`方法可以将多个字符串路径片段拼接在一起。拼接后经过`path.normalize()`规范化。

```js
console.log(path.join('/foo', 'bar', 'baz/asdf', 'quux'));
// /foo/bar/baz/asdf/quux
console.log(path.join('/foo', 'bar', 'baz/asdf', 'quux', '..'));
// /foo/bar/baz/asdf
```

`path.isAbsolute()`方法可以判断一个路径是否为绝对路径。

```js
//mac or linux
path.isAbsolute('/foo/bar'); // true
path.isAbsolute('/baz/..');  // true
path.isAbsolute('qux/');     // false
path.isAbsolute('.');        // false

//windows
path.isAbsolute('//server');    // true
path.isAbsolute('\\\\server');  // true
path.isAbsolute('C:/foo/..');   // true
path.isAbsolute('C:\\foo\\..'); // true
path.isAbsolute('bar\\baz');    // false
path.isAbsolute('bar/baz');     // false
path.isAbsolute('.');           // false
```

`path.resolve()`方法处理路径片段并解析为**绝对路径**。

将一个绝对路径和一个相对路径片段整合成一个绝对路径。并从右至左，先忽略右边的相对路径`./`。

```js
console.log(path.resolve('/foo/bar', './baz'));
// /foo/bar/baz
```

给参数1只传入一个空字符串时，打印的是当前环境的项目位置。

```js
console.log(path.resolve(''));
// /home/myself/node-excrcise
```

两个绝对路径，从右至左，从右边参数已经可以找到绝对路径直接返回一个绝对路径。

```js
console.log(path.resolve('/foo/bar', '/tmp/file/'));
// /tmp/file
```

参数从右至左看，相对路径有`../`相对于参数2的相对路径会向上跳一级，再与参数1的绝对路径进行拼接返回绝对路径。

```js
console.log(path.resolve('wwwroot', 'static_files/png/', '../gif/image.gif'));
//当前环境目录为/home/myself/node
// this returns '/home/myself/node/wwwroot/static_files/gif/image.gif'
```

`path.relative()`方法根据当前工作目录返回`from`到`to`的相对路径。

```js
//macos or linux
path.relative('/data/orandea/test/aaa', '/data/orandea/impl/bbb');
// Returns: '../../impl/bbb'

//windows
path.relative('C:\\orandea\\test\\aaa', 'C:\\orandea\\impl\\bbb');
// Returns: '..\\..\\impl\\bbb'
```

`path.format()`方法从对象返回一个路径字符串。如果属性`dir`，`root`，`base`同时提供时，`root`属性将被忽略。

```js
path.format({
  root: '/ignored',
  dir: '/home/user/dir',
  base: 'file.txt'
});
// Returns: '/home/user/dir/file.txt'
```

`dir`属性没用，但`root`属性用了将直接返回`base`到`root`属性的路径。

```js
path.format({
  root: '/',
  base: 'file.txt',
  ext: 'ignored'
});
// Returns: '/file.txt'
```

`name`和`ext`都定义了，但是`base`没定义，相当于给`base`定义了，并返回`base`到`root`的路径。

```js
path.format({
  root: '/',
  name: 'file',
  ext: '.txt'
});
// Returns: '/file.txt'
```



## 事件触发器

前端中事件模型采用方式是给一个元素绑定事件，`addEventListener`方法绑定一个事件处理函数，用户视图触发事件执行事件处理函数。

```js
oDiv.addEventListener('click', function(e){}, false);
```

在`Node.js`中也存在相应的事件，例如`net.Server`会在每次有新的连接时触发事件。当某一个条件达成触发。后端区别于前端的事件是触发所有事件的对象都是`EventEmitter`实例。该实例对象里有`eventEmitter.on()`方法，允许注册一个或多个事件处理函数。有`eventEmitter.emit()`方法用于触发事件。

```js
const EventEmitter = require('events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

myEmitter.on('test', (payload) => {
  console.log('an event occurred!', payload.a);
  //an event occurred! hello
});
myEmitter.emit('test', { a: 'hello' });
```

后端事件触发器继承自`EventEmitter`的实例，前端是`DOM`元素集成的事件触发机制。前端事件命名的方式是通过触发的约定事件名称来命名的，而后端注册事件名称可以自定义的。前端事件触发是基于用户视图操作触发，而后端是通过自身调用`emit()`触发的。前后端触发次数是没有限制的。

`Node.js`定义`error`事件是有约定写法的，当`eventEmitter`实例出错时会触发`error`事件。

```js
myEmitter.on('error', (payload) => {
  console.log('an event occurred!', payload.a);
});
```

使用该`eventEmitter.once()`方法，可以注册一个针对特定事件最多调用一次的侦听器。事件发出后，侦听器将被取消注册，然后被调用。

```js
myEmitter.once('test', (payload) => {
  console.log('an event occurred!', payload.a);
});
```

`eventEmitter.removeListener()`方法移除注册的事件处理函数。

```js
myEmitter.removeListener('test', fn);
```

`eventEmitter.off()`方法同样也可以移除注册的事件处理函数。

```js
myEmitter.off('test', fn);
```



## 文件系统

`fs`模块提供一个`API`，用于模仿，标准`POSIX`函数的方式，与文件系统进行交互。`POSIX`是类似`linux`系统所对应操作文件系统。 `Node.js`以异步的方式来处理模块，但同时也会提供同步处理模块的方式。异步`I/O`方法不会阻塞主线程，同步代码会阻塞主线程。异步方法主要针对多用户请求多并非的情况，同步方法在单用户的情况下是可行的。

```js
const fs = require('fs');
```

`fs.readFile()`异步方法可以读取一个文件，参数1位路径，参数2是字符编码或字符串的文件系统标志，参数3是一个回调函数，带有错误和数据参数，函数遵循错误优先原则。

参数2没有加字符编码时，返回的数据是一个`buffer`数据。

```js
fs.readFile('./index.html', (err, data) => {
  if (err) throw err;
  console.log(data);
  //<Buffer 3c 21  ... 244 more bytes>
  console.log(data.toString());
  //<html>...</html>
});
```

给参数2加了字符编码`utf8`时返回的是字符串数据。

```js
fs.readFile('./index.html', 'utf8', (err, data) => {
  if (err) throw err;
  console.log(data); //<html>...</html>
});
```

`fs.readFileSync()`同步方法可以读取一个文件，同步方法并没有回调函数，通过返回值可以获得结果。同步方法一次只能处理一个用户的一次请求。

```js
let res = fs.readFileSync('./index.html', 'utf8');
console.log(res); //<html>...</html>
```

用另外的方法读取文件返回的数据流逐一小部分返回给前端，持续读取一部分响应一部分给前端达到不阻塞的目的。

`fs.writeFile()`异步方法可以写入指定内容至指定路径。参数1为定义的文件名称及路径，参数2为写入的数据(字符串或`buffer`等)，参数3为字符编码，参数4为回调函数。

```js
fs.writeFile(
  './test.js', 
  'This is test content.', 
  'utf8', 
  (err) => {
    if (err) throw err;
    console.log('write successfully!');
  }
);
```

`fs.stat()`异步方法用于获取当前文件信息。参数1为文件路径及文件名称。参数2是回调函数接收参数作为结果，结果是一个`Stats`对象，保存了文件信息。

```js
fs.stat('./test.js', (err, data) => {
  if (err) throw err;
  console.log(data); //Stats {...}
});

/*
Stats {
  dev: 16777234,
  mode: 33188,
  nlink: 1,
  uid: 501,
  gid: 20,
  rdev: 0,
  blksize: 4096,
  ino: 9870608,
  size: 17,
  blocks: 8,
  atimeMs: 1680096907730.5056,
  mtimeMs: 1680096907136.886,
  ctimeMs: 1680096907136.886,
  birthtimeMs: 1680095975159.4707,
  atime: 2023-03-29T13:35:07.731Z,      //上次访问的时间戳
  mtime: 2023-03-29T13:35:07.137Z,      //上次修改的时间戳
  ctime: 2023-03-29T13:35:07.137Z,      //上次更改状态的时间戳
  birthtime: 2023-03-29T13:19:35.159Z   //创建的时间戳
}
*/
```

`stats`实例对象里的有许多描述文件信息的方法。如`stats.isDirectory()`检查该对象是否描述文件系统目录，如果是返回`true`。`stats.isFile()`判断是否描述常规的文件还是文件夹，如果是文件返回`true`。

```js
fs.stat('./test.js', (err, data) => {
  if (err) throw err;
  console.log(data.isDirectory()); //false
  console.log(data.isFile()); //true
});
```

`fs.rename()`异步方法可以对一个文件进行重命名。

```js
fs.rename('./test.js', './testb.js', (err) => {
  if (err) throw err;
  console.log('rename successfully!');
});
```

`fs.unlink()`异步方法可以删除指定路径下的文件。

```js
fs.unlink('./testb.js', (err) => {
  if (err) throw err;
  console.log('remove successfully!');
});
```

`fs.readdir()`异步方法可以读取目录下的所有文件。返回数组结构的文件集合。

```js
fs.readdir('./dist', (err, data) => {
  if (err) throw err;
  console.log('read successfully', data);
  //read successfully [ 'a.js', 'b.js' ]
});
```

`__dirname`返回当前项目文件的绝对路径但不包含`base`信息。`__filename`返回当前项目文件的绝对路径包含`base`信息。

```js
console.log(__dirname);
// /Users/kevinlee/nodejs-exercise
console.log(__filename);
// /Users/kevinlee/nodejs-exercise/index.js
```

`fs.mkdir()`异步方法可以在指定路径中新增目录。

```js
fs.mkdir('./new', (err) => {
  if (err) throw err;
  console.log('mkdir successfully!');
});
```

`fs.rmdir()`异步方法可以在指定路径中删除指定目录。

```js
fs.rmdir('./new', (err) => {
  if (err) throw err;
  console.log('removedir successfully!');
});
```

`fs.watch()`异步方法可以监听包括文件和文件夹在内的所有东西。`fs.watchFile()`异步方法仅仅可以监听文件。参数1为监听路径，参数2位为象配置，可以配置`recursive`是否递归循环监听嵌套子类文件。参数3为事件回调函数带有2个参数`eventType`和`filename`，而`eventType`事件只有`rename`和`change`类型。`filename`是触发事件的文件名称。

```js
fs.watch('./dist', { recursive: true }, (eventType, filename) => {
  console.log(eventType, filename);
  //change a.js
  //rename test
});

//尝试更改dist目录下a.js文件下的内容 会触发change事件
fs.writeFile('./dist/a.js', 'modified', 'utf8', (err) => {
  if (err) throw err;
});

//尝试在dist目录下新建文件夹或文件 会触发rename事件
fs.mkdir('./dist/test', (err) => {
  if (err) throw err;
});
```



## 进程

该`process`对象是一个`global`提供有关当前 `Node.js` 进程的信息和控制的对象。作为全局变量，它始终可供 `Node.js` 应用程序使用，而无需使用`require()`。

```js
console.log(process);
process {
  version: 'v14.20.1',
  versions: {
    node: '14.20.1',
    v8: '8.4.371.23-node.87',
    uv: '1.42.0',
    zlib: '1.2.11',
    brotli: '1.0.9',
    ares: '1.18.1',
    modules: '83',
    nghttp2: '1.42.0',
    napi: '8',
    llhttp: '2.1.6',
    openssl: '1.1.1q',
    unicode: '14.0'
  },
  ...
}
```

`process.argv`属性返回一个数组，包含启动`Node.js`进程时传递的命令行参数。第一个元素是`process.execPath`，它是`Node.js`安装目录里的启动文件路径。第二个元素是当前项目文件的路径。

```js
console.log(process.argv);
/*
//mac or linux
[ 
  '/usr/local/bin/node', 
  '/Users/kevinlee/nodejs-exercise/index.js' 
]

//windows
[
  'C:\\nodejs\\node.exe',
  'C:\\nodejs-exercise\\index.js'
]
*/
```

假如终端使用命令进行传参`node index.js --test a=1 b=2`，后续的第`n`个元素是传进来的参数。

```JS
console.log(process.argv);
/*
[
  'C:\\nodejs\\node.exe',
  'C:\\nodejs-exercise\\index.js',
  '--test',
  'a=1',
  'b=2'
]
*/
```

`process.execArgv`属性返回`Node.js`进程被启动时终端命令行`node --harmony index.js --version`传入的参数。该参数介于命令行的文件名称之前，可以被`process.execArgv`属性获取。

```js
console.log(process.execArgv);
//[ '--harmony' ]
```

也可以在终端命令中新增调试命令，如`node --harmony --inspect  index.js`，被`process.execArgv`属性获取的结果是一个数组。

```js
console.log(process.execArgv);
//[ '--harmony', '--inspect' ]
```

以上在命令行的文件执行之前传参的方式可以应用在主线程和子线程之间通信`new Worker()`的数据传递。

`process.execPath`属性返回启动`Node.js`进程的可执行文件的绝对路径。

终端输入命令`node index.js`，返回启动进程的绝对路径。

```js
console.log(process.execPath);
//C:\nodejs\node.exe
```

`process.env`属性可以获取`Node.js`相应`linux`或`windows`环境对象，对象里保存了一系列环境的信息。

`process.cwd()`方法返回当前执行文件所对应的目录地址。

```js
console.log(process.cwd());
//C:\exercise\nodejs-exercise
```

`process.nextTick()`在`node`环境独有的方法，是一个微任务，可以将一个回调函数添加至下一个时间节点的队列中，一旦上一轮的事件循环全部完成，就调用下一个时间点队列中的所有回调。

```js
console.log('start');
process.nextTick(() => {
  console.log('nextTick callback');
});
console.log('scheduled');
// Output:
// start
// scheduled
// nextTick callback
```

由于`process.nextTick`优先执行机制，多层嵌套时会等所有的`process.nextTick`回调执行完毕后才可以执行`promise`任务。

```js
process.nextTick(() => {
  console.log('nextTick1');
  process.nextTick(() => {
    console.log('nextTick2');
    process.nextTick(() => {
      console.log('nextTick3');
    });
  });
});

Promise.resolve().then(() => console.log('promise1'));
//nextTick1
//nextTick2
//nextTick3
//promise1
```

## `Net`模块

五层网络协议主要分：

1. 应用层是在不同计算机上进程中的通信。 `HTTP`网页传输在计算机上的浏览器进程(`80`端口), `FTP`文件传输协议(`21`端口), `SMTP`邮件发送传输协议(`25`端口), `POP3`邮件接收传输协议(`110`端口), `DNS`域名解析系统。
2. 传输层 `TCP`协议(一对一), `UDP`协议(广播)。
3. 网络层 `IP`协议，`ICMP`协议。
4. 数据链路层 `PPP`协议, `SLIP`协议。 
5. 物理层` ISO2110`规范。

**模拟浏览器访问服务端的演示**

`TCP/IP`协议是包含应用层，传输层，网络访问层。假如前端向后端发送消息是基于`TCP/IP`协议进行传输。`HTTP`协议报文格式写法如下：

``` 
GET/text ? params = 'Have you ate?' HTTP/1.1
```

`net`模块有对`TCP/IP`层的实现进行封装。`net`模块提供了一个异步网络 `API`，用于创建基于流的 `TCP` 或`IPC`服务器 ( `net.createServer()`) 和客户端 ( `net.createConnection()`)。

> 备注：查看已经启动的服务器信息在`MacOs`中的终端命令：`ps aux | grep 'node'`，可以对其服务进行关闭的命令：`kill 8000`。

引入`net`模块并创建服务器，开启服务器并监听本地地址的端口，并注册一个事件监听器监听端口，注册另一个监听器对连接进行监听，当有新的连接时触发回调，该回调信息参数是以`socket`对象形式存在的。`socket.on()`可以注册`data`事件，可以获取数据信息。

```js
const net = require('net');
const server = net.createServer();
server.listen(8000, '127.0.0.1');
server.on('listening', () => console.log('ok'));
server.on('connection', socket => {
  console.log('new connection');
  //在浏览器访问服务器地址时
  //http://localhost:8000/index.html?msg=haveyouate
  //侦听到新的连接触发回调获取socket对象
  console.log(socket);
  //获取完整的报文格式
  socket.on('data', data => {
    console.log(data);
    //<Buffer 47 45 54  ... 637 more bytes>
    console.log(data.toString());
    //完整的报文
  })
});
```

完整的报文格式如下：

```
GET /index.html?msg=haveyouate HTTP/1.1
Host: 127.0.0.1:8000
Connection: keep-alive
sec-ch-ua: "Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"
sec-ch-ua-mobile: ?0
sec-ch-ua-platform: "macOS"
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7
Sec-Fetch-Site: none
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: document
Accept-Encoding: gzip, deflate, br
Accept-Language: zh-CN,zh;q=0.9
```

前端浏览器地址访问服务器是会发送请求报文，后端`server.on`监听器监听的`connection`事件回调内部`socket.on`监听器监听的`data`事件可以获取完整的报文信息，也就是说通过`net`模块创建服务器监听的连接获取`TCP/IP`层的完整报文信息和`HTTP`请求协议报文首行字符是一致的。

使用`net`模块来获取首条信息的带参数`url`地址，原始方式是字符串处理。[参考案例](https://gitee.com/kevinleeeee/node-net-socket-demo)。

那么，假如服务器给前端浏览器发送消息`socket.write()`时，前端浏览器正常情况下是无法获取后端服务器发送过来的消息。此时需要服务端在发送的消息里同样写入响应头`Response Headers`报文信息即可让前端浏览器正常获取消息。

```JS
const net = require('net');
const server = net.createServer();
server.listen(8000, '127.0.0.1');
server.on('listening', () => console.log('ok'));
server.on('connection', (socket) => {
  console.log('new connection');
  socket.on('data', (data) => {
    console.log(data.toString());
    //获得前端连接的完整报文并发送带有响应头报文信息的消息
    //响应报文响应信息：状态码 + 文本类型 + 解析内容
    // \r\n 换行加回车 报文每段信息需要换行
    // \r\n \r\n 报文结束位置需要空2行
    //响应的内容以<html>方式进行解析
    socket.write(
      'HTTP 200OK\r\nContentType: text/html\r\n\r\n<!DOCTYPE html><body>Hello Browser</body></html>'
    );
    //结束请求避免浏览器一直请求显示转圈圈
    socket.end();
  });
});
```

此时浏览器访问地址`http://localhost:8000`即可显示页面内容，说明收到服务器响应消息。

**模拟客户端和服务端之间的`socket`的演示**

在`net`模块里，它模拟了两个角色，角色1是客户端`Client`对应`net.Socket`类，角色2是服务器端`Server`对应`net.Server`类。客户端可以通过浏览器地址访问服务器端，也可以通过`net.Socket`接口去访问，`net.Socket`模拟客户端时需要`ip`和端口号才可以访问。

套接字是一套用C语言写成的应用程序开发库，它首先是一个库。主要作用就是实现**进程间通信**和**网络编程**，因此在网络应用开发中被广泛使用。套接字（`socket`）是一个抽象层，应用程序可以通过它发送或接收数据，可对其进行像对文件一样的打开、读写和关闭等操作。套接字允许应用程序与网络中的其他应用程序进行通信。网络套接字是`IP`地址与端口的组合。

`net.Server`类监听的事件有：

- `listening`，当监听端口后触发的事件。
- `connection`，当客户端请求连接时触发的事件。
- `close`，不常用，当服务器关闭的时候触发的事件。
- `error`，不常用，当服务器异常的时候触发的事件。

`net.Socket`类监听的事件有：

- `connect`，当已经连接到服务器的时候触发。
- `data`，当接收参数数据时触发。
- `end`，当数据写入完毕时触发。
- `timeout`，当超时时触发。
- `close`，当`socket`接口关闭时触发。

**服务端**定义一个端口侦听客户端准备发起的请求。并注册一个`connect`连接事件，如果有客户端进行连接访问了则触发该事件。`server.address()`方法可以查看当前服务器的`ip`地址。`connection`事件的回调参数`socket.on()`注册`data`事件可以接受客户端发送过来的信息。同时服务端也可以通过`socket.on`事件函数内部使用`socket.write()`方法向客户端发送消息。终端1命令行执行该服务器进程`node server`来启动服务器。

```js
// server.js
const net = require('net');
const server = net.createServer();
server.listen(8000, '127.0.0.1');

server.on('listening', () => {
  console.log('Server ok.');
  //Server ok. { address: '127.0.0.1', family: 'IPv4', port: 8000 }
});

server.on('connection', (socket) => {
  console.log('client vistted.');
  socket.on('data', (data) => {
    console.log(data.toString());
    //Msg from Client: Hello!
  });
  socket.write('Msg from Server: Got you!');
  socket.on('close', () => {
    console.log('Client socket closed.');
    server.close();
  });
});

server.on('close', () => console.log('Server socket closed.'));
```

**客户端**向服务器发起请求连接，需要连接端口和`ip`。`socket.on`注册的`connect`事件当对服务器连接成功时触发该事件。`socket.write()`方法可以给服务器传递信息。终端2命令行执行该服务器进程`node client`来启动客户端。

```js
// client.js
const net = require('net');
const socket = net.connect(8000, '127.0.0.1');

socket.setTimeout(2000);

socket.on('connect', () => {
  console.log('Connected Server successfully!');
  console.log(socket.remoteAddress);
  //127.0.0.1
  console.log(socket.remotePort);
  //8000
  console.log(socket.localAddress);
  //127.0.0.1
  console.log(socket.localPort);
  //60184
});

socket.on('timeout', () => console.log('Client socket connect timeout'));

socket.write('Msg from Client: Hello!');

socket.on('data', (data) => {
  console.log(data.toString());
  //Msg from Server: Got you!
  socket.end(); //当会话结束时可以手动关闭此客户端的连接
});

socket.on('close', () => console.log('Client socket closed.'));
```

## 配置相关

在`node`项目中可以定义一个`server.conf`文件去管理服务器信息，如端口信息和访问地址信息。

```
//根目录下的server.conf文件
port=8000
path=/web
```

定义一个`conf.js`文件来处理`server.conf`文件内的信息，将其转为一个对象进行管理。

```js
//根目录下的conf.js文件
const fs = require('fs');
let globalConf = {};

// console.log(fs.readFileSync('./server.conf').toString());
//port=8000 path=/web

// console.log(fs.readFileSync('./server.conf').toString().split('\r\n'));
//[ 'port=8000', 'path=/web' ]

let confs = fs.readFileSync('./server.conf').toString().split('\r\n');

confs.forEach((c) => {
  const item = c.split('=');
  const key = item[0];
  const value = item[1];
  globalConf[key] = value;
});

// console.log(globalConf);
// { port: '8000', path: '/web' }

module.exports = globalConf;
```



## `Http`模块

`Http`模块底层是由`Net`模块封装而来的。它是`Node.js`的核心模块，需要引入。

```js
const http = require('http');
```

`http.creteServer()`方法可以创建一个服务器程序。它接受一个函数作为参数，在每次服务器监听事件收到请求时都会触发执行一次该函数。这个函数带有`req`，`res`参数，对应请求对象和响应对象。`http.createServer()`的返回一个服务器`server`实例，`server.listen()`可以开启一个进程让`node`程序不会立即结束脚本，从而持续去监听前端浏览器发起的请求。

```js
const server = http.createServer(function (req, res) {});
server.listen(8000, () => console.log('Server start'));
```

请求对象里的属性和方法：

- `req.url`属性保存了浏览器发起请求的地址。
- `req.method`属性保存了请求的方式。
- `req.headers`属性保存了请求头信息。

```js
const server = http.createServer(function (req, res) {
  //浏览器地址栏访问http://localhost:8000/index.html?msg=haveyouate
  console.log(req.url);
  // /index.html?msg=haveyouate
  console.log(req.method);
  // GET
  console.log(req.headers);
  /**
   * {
      host: 'localhost:8000',
      connection: 'keep-alive',
      'cache-control': 'max-age=0',
      'sec-ch-ua': '"Google Chrome"...',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"',
      'upgrade-insecure-requests': '1',
      'user-agent': 'Mozilla/5.0 ...',
      'sec-fetch-site': 'none',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-user': '?1',
      'sec-fetch-dest': 'document',
      'accept-encoding': 'gzip, deflate, br',
      'accept-language': 'zh-CN,zh;q=0.9'
    }
   */
});
```

请求对象里的属性和方法：

- `res.setHeader('ContentType', 'text/html')`方法可以设置响应头信息返回给前端。
- `req.write()`方法可以写入返回给前端的`<html>内容。`
- `req.end()`方法可以手动关闭服务器对浏览器的请求侦听。
- `req.on()`方法是一个监听器可以监听`data`事件或者`end`事件，当事件触发时执行该回调函数。

```js
const server = http.createServer(function (req, res) {
  res.setHeader('ContentType', 'text/html');
  res.write('<html>');
  res.write('<head><title>My Page</title></head>');
  res.write('<body><h1>Hello Node.js</h1></body>');
  res.write('</html>');
  res.end();
});
```

通过`req.url`属性可以判断地址去做路由匹配。在表单提交时跳转地址，监听该跳转地址并监听用户输入框输入的数据，并将这些数据`Buffer.concat`合并到`Buffer`流中，最后将这些数据流写入到后端文件中。

```js
const server = http.createServer(function (req, res) {
  const body = [];
  if (req.url === '/') {
    res.setHeader('ContentType', 'text/html');
    res.write('<html>');
    res.write('<head><title>My Page</title></head>');
    res.write(
      '<body>
        <form action="/messege" method="POST">
          <input type="text" name="message" />
          <button type="submit">Submit</button>
        </form>
      </body>'
    );
    res.write('</html>');
    return res.end();
  }

  if (req.url === '/messege' && req.method === 'POST') {
    req.on('data', (chunk) => {
      body.push(chunk);
    });
    req.on('end', () => {
      const parseBody = Buffer.concat(body).toString();
      // console.log(parseBody);
      //message=hello
      const messege = parseBody.split('=')[1];
      writeFileSync('msg.txt', messege);
      return res.end();
    });
  }
});
```





## 二进制

**`Blob`**是前端专门用于支持文件操作的二进制对象，同时，File是一种特殊的`Blob`对象。

```
//<a id="a1">点击下载</a>

const a1 = document.getElementById('a1');
const content = '<div>hello</div>';
const blob = new Blob([content], {
  //下载文件的类型
  type: 'text/html'
});

console.log(URL.createObjectURL(blob));
//获取资源的url
//blob: http://127.0.0.1:3000/867eas-23ds-4122-8a4d-eo4fffaac908
```

**Buffer**缓冲区是暂时存放数据输入输出的一个内存，可以使用Buffer对二进制数据进行操作。



## 前后端分离

**前后端分离解决跨域：**

```mermaid
graph LR;
	客户端请求NodeAPI获取结果-->中间层Node接收请求并请求JavaAPI;
	中间层Node接收请求并请求JavaAPI-->服务端Java接收请求响应结果;
	服务端Java接收请求响应结果-->中间层Node接收请求并请求JavaAPI;
	中间层Node接收请求并请求JavaAPI-->客户端请求NodeAPI获取结果;
```

**前端工程化服务与工具：**

- 开发代码：
  - `.js/.jsx/.vue`
  - `.css/.scss/.less`
  - `.jpg/.png/.git`
- `webpack node`打包服务
  1. 文件读取
  2. 分析源码
  3. 编译源码
  4. 混淆压缩
  5. 打包文件
- `webpack node`响应打包资源：
  - `.js`
  - `.css`
  - 压缩后的图片

**`node`在前后端分离开发中的角色：**

作为一个中间层，通过`EJS`模板引擎嵌入`Node`程序抛出的变量，替换成一个完整的`html`响应给前端。

大型项目开发中，它一般不会直接去操作数据库，而是交给纯后端`Java`去面向接口的开发，去操作数据库，返回接口给中间层`node`

`node`只需要`Java`提供的数据接口进行数据组件替换模板响应给客户端即可

`node`还有一个重要的角色是在开发阶段时向后端或第三方接口服务商请求数据时解决客户端请求跨域的问题

**跨域问题：**

客户端可以配置一个代理`proxy`，在开发环境下开启代理跨域，仅开发模式用，生产环境下这个代理配置是失效的

`node`中间层向后端请求是不受同源策略影响的



## 爬虫

`Puppeteer`是`nodejs`提供的一个库，实现爬虫页面程序，它提供一个高级`API`来通过`DevTools`协议来控制`chrome`

**它还能做：**

- 生成页面的屏幕截图和 `PDF`
- 抓取 `SPA`（单页应用程序）并生成预渲染内容（即“`SSR`”（服务器端渲染））
- 自动化表单提交、`UI` 测试、键盘输入等
- 创建最新的自动化测试环境。使用最新的 `JavaScript `和浏览器功能直接在最新版本的 `Chrome `中运行测试
- 捕获您网站的[时间线轨迹](https://developers.google.com/web/tools/chrome-devtools/evaluate-performance/reference)以帮助诊断性能问题
- 测试 `Chrome `扩展程序

**搭建**

`koa2`环境

```
//1.创建项目：koa2 + 项目名称
koa2 crawler-puppeteer-txcourse-demo

//2.安装依赖
npm install

//3.安装爬虫库 Puppeteer
npm i -S puppeteer@2.1.1
```

编写爬虫程序

```js
//4.在routes目录下的index.js里
//4.1 引入爬虫依赖
const pt = require('puppeteer');

//4.2 在请求响应路由程序里编写爬虫程序
router.get('/', async (ctx, next) => {
  //爬虫程序编写区域
  ...
});

//4.3 发起启动爬虫程序
const broswer = await pt.launch();

//4.4 配置爬取页面
const url = 'https://msiwei.ke.qq.com/',

//4.5 在浏览器里启动新的标签页
const pg = await broswer.newPage();

//4.6 等待新页面打开url地址
//第二参数为配置项
  await pg.goto(url, {
    //超时
    timeout: 30 * 1000,
    //直到完成 networkidle2官方推荐(一定时间内没有发送请求证明爬取完成)
    waitUntil: 'networkidle2'
  });

//4.7 分析页面后返回结果
const result = await pg.evaluate(() => {
  //定义数据的容器(接收爬取后的数据)
  let data = [];

  //分析爬取内容
  ...

  //把内容存到容器里

  //返回爬取的容器
  return data;
}

//5.爬取数据后关闭浏览器
await broswer.close();
```

查看爬取结果

```
//1.启动项目
npm run dev

//2.访问localhost:3000

//3.等待爬取

//4.爬取完毕，终端打印爬取后的数组数据
[{...},{...},{...}]
```

**子进程**

开启子进程开启爬虫程序，建立单独的文件管理子进程`pupeteer`目录下的`crawler.js`自己执行的脚本，存放爬虫程序

```js
//1.拆分请求路由下爬虫程序到子进程文件中

//2.路由文件引入子进程库
const cp = require('child_process');

//3.读取子进程脚本文件
router.get('/', async (ctx, next) => {
  const script = resolve(__dirname, '../puppeteer/crawler.js')

  //4.启动子进程
  const child = cp.fork(script, []);

  //5.完善成功/退出/失败时程序日志
  child.on('message', (data) => {...});
  child.on('exit', (code) => {...});
  child.on('error', (err) => {...});
});
```



