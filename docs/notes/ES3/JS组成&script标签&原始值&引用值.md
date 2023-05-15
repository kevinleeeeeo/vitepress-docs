# 组成&`<script>`&原始值&引用值



## 组成

`JavaScript`技术基本由四部分组成：

- `ECMAScript`语言标准规范
- 文档对象模型 (`DOM`) - `document object model`(`W3C`规范)
- 浏览器对象模型(`BOM`) - `browser object model`(没有规范)
- `NodeJS`服务器开发模型

`ECMAScript`包含语法，变量，关键字，保留字，值，原始类型，引用类型，运算，对象，继承，函数。



## `<script>`

`HTML`中的 `<script>` 标签用于嵌入或引用可执行脚本。它可以引入外部文件或者内部脚本代码块。当内外脚本都定义时，只解析执行外部脚本。脚本与脚本之间是按照定义顺序同步执行的，原因是`<script>`脚本在解析执行期间是阻塞的，只有脚本执行完毕才会去进行`GUI`渲染，避免冲突问题。

外部脚本需要加载和解析执行程序，有服务器下载的过程。

```html
<!-- 外部文件 -->
<script type="text/javascript" src="js/index.js"></script>
```

内部脚本是解析执行程序。

```html
<!-- 内部脚本 -->
<script type="text/javascript">
  document.write('I am a inner JS');
</script>
```

多个脚本之间存在作用域，引用错误是互不影响的，隔离的。`JavaScript`的运行三个步骤的第一步是语法检查，第二步是在执行脚本之前进行预编译预解析，在代码执行之前要对代码的变量，函数，函数参数进行顺序上的调整以便于以后更好的去调用执行，第三步是执行代码。

`<script>`标签里可以定义不同的属性，如`type`，`async`，`src`，`defer`，`crossorigin`等。

- `src`这个属性定义引用外部脚本的 `URI`，这可以用来代替直接在文档中嵌入脚本。指定了 `src` 属性的 `<script>` 元素标签内不应该再有嵌入的脚本。
- `type`属性定义`src`引用的脚本语言，如`text/javascript`，`application/json`，`text/tpl`定义错误的目的是可以使其标签脚本不执行，仅用来做模板文件使用。
- `type="module"`属性定义使用的原因是`ES6`之前没有模块化，脚本程序可以是符合`ES6 Module`规范，可以使用`import`关键字并对其他模块导入的支持，并需要开启服务器对`HTML`进行访问，因为模块化的导入是需要发起`HTTP`请求。
- `type="nomodule"`属性定义对于不支持`ES6 Module`的脚本的浏览器。
- `async`属性可以使脚本文件异步执行，且同时解析文档加载。
- `defer`属性通知浏览器该脚本将在文档完成解析后，触发 `DOMContentLoaded ()` 事件前执行。 有 `defer` 属性的脚本会阻止 `DOMContentLoaded` 事件，直到脚本被加载并且解析完成。
- `crossorigin`属性可以使用本属性来使那些将静态资源放在另外一个域名的站点打印错误信息。

使用`<script>`标签必须遵守的规则：

- 必须有闭合标签

- `type`属性多样性，默认值是`text/javascript`当成脚本程序解析

  

## 原始值

基本变量类型有`Number`，`String`，`Boolean`，`undefined`，`null`。

**`Number`**

```js
var a = 1;
var a = 3.14;
```

**`String`**

```js
var str = 'i love programing';
```

**`Boolean`**，布尔值(布尔发明)，计算机里，非真即假，非假即真。

```js
var a = true;
console.log(a);
//true
```

**`undefined`**

1. 系统会给一个未赋值的变量自动赋值为`undefined`，类型也是`undefined`。
2. 函数没有传入实参时，参数为`undefined`。
3. 函数没有返回值时，默认返回`undefined`。

```js
var a = undefined;
console.log(a);
//undefined
```

```js
var a;
console.log(a);
//undefined
```

- `undefined`既是一个原始数据类型，也是一个原始值数据。
- `undefined`是全局对象上的一个属性`window.undefined`。
- `undefined`不可写`writable: false`。
- `undefined`不可配置`configurable: false`。
- `undefined`不可枚举`enumerable: false`。
- `undefined`不可重新定义`defineProperty`。
- 全局下，`undefined`无法作为一个变量使用。
- 局部作用域下，`undefined`可以作为一个变量使用，说明`undefined`不是 JS 的保留字和关键字。

> **注**：`void(0) === undefined`



**`null`**

空值，它的作用在于初始化组件和销毁函数。

## 引用值

引用值有`object`，`array`，`function`，`date`，`RegExp`等。

