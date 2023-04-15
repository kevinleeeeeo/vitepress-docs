# 历史&`let`&`const`



## 历史

**浏览器经历阶段：**

- `1991- 1997`: `HTML1`/`HTML2`/`HTML3`/`IETF(The Internet Engineering Task Force)`国际互联网工程任务组。
- `1997`: `HTML3.2 W3C`



**`ECMA-262 Ecmascript` 脚本语言规范：**

- `1995`发布的 `LiveScript JavaScript`
- `1996`发布的`JavaScript 1.0/1.1`
- `1997` 发布的`Jscript`
- `1997.6`发布的 `ECMAScript 1.0` 
- `1998.6`发布的 `ECMAScript 2.0 `
- `1999.12`发布的 `ECMAScript 3.0 `
- `2000`发布的`ECMAScript 4.0`草案(未通过) `TC39(technical committe 39)`成员反对
- `2007`发布的`ECMAScript 4.0`准备发布 但没发布
- `2008.7`发布的`ECMAScript 3.1`过渡到`5.0` , 大会项目代号(`hamony`) `JavaScript.next` / `JavaScript.next.next`
- `2009.12`发布的 
  - `ECMAScript 5.0` 正式发布
  - `JavaScript.next`(放入草案) `ES6`
  - `JavaScript.next.next`(放入草案) `ES7`
- `2011.6`发布的`ECMAScript 5.1`
- `2013.3`发布的 `JavaScript.next`(草案冻结)
- `2013.6`发布的 `JavaScript.next`(草案发布)
- `2015.6`发布的 `ECMAScript 6.0`正式发布, 从此每年6月出一个新的小版本
- `ECMAScript2016`
- `ECMAScript2017`
- `ECMAScript2018`
- `ECMAScript2019`
- `ECMAScript2020`



## `let` 

`let`本质是为了`JS`增加一个块级作用域。`ES6`新增的`let`语法是声明变量生成单独块级作用域。

函数作用域是无法正常访问的一个隐式的对象，在函数执行前一刻产生的对象。 `[[scope]]` 存储在预编译时期产生的 `GO`全局执行期上下文，和`AO`函数执行期上下文。

在预编译过程中有`var`关键字声明提升的过程，会存在同一环境下的二次覆盖的变量污染问题，在`ES5`解决办法是通过立即执行函数来封闭函数作用域的方式来避免变量污染，但是函数内部仍然存在变量污染的问题，因此会采用一个`kiss`原则(`keep it simple and stupid`)来保证函数功能的单一性，函数提纯等一系列方法来解决变量污染问题。

块级作用域等于匿名函数的立即调用吗？ 不等于，使用立即执行函数可以模拟块级作用域，但立即执行函数是有返回值的，而块级作用域内部是没有返回值给外部访问的。

**常见的块级作用域的形式：**

条件语句中，大括号包裹的区域是一个块级作用域。

```
if(1){}
```

循环语句中，大括号包裹的区域也是一个块级作用域。

```
for(){}
```

单独的一个大括号包裹的区域也是一个块级作用域。

```
{ }
```

**`let`具有以下特点：**

- `let`不允许在同一作用域下重复声明
- `let`不会声明提升，会产生一个暂时性死区(`Temporal Dead Zone`)
- `let`只能再当前的块级作用域下生效

**不允许在同一作用域下重复声明。**

```js
let a = 1;
let a = 2;
//SyntaxError: Identifier 'a' has already been declared
```

包括不允许在函数作用域下重复声明。

```js
function test(){
  let a = 1;
  var a = 1;
}
test();
//报错: SyntaxError: Identifier 'a' has already been declared
```

预编译的情况下函数的形参已经被声明定义了，也不允许重复声明。

```js
function test(a){
  let a = 10;
  console.log(a);
}
test();
//报错: SyntaxError: Identifier 'a' has already been declared
```

大括号可以生成一个块级作用域。外部是无法访问块级作用域里的变量。

```js
function test(a){
  { let a = 10; }
  console.log(a);
}
test(); //undefined
```

```js
function test(a){
  {
    let a = 10;
    console.log(a);
  } 
}
test(); //10
```

`let`不会声明提升，会产生一个暂时性死区。在全局作用域下，被定义的变量之前锁定的区域为暂时性死区。

```js
console.log(a);
let a = 10;
//ReferenceError: a is not defined
```

在函数作用域下，被定义的变量之前锁定的区域也同样为暂时性死区。

```js
function test(){
  console.log(a);
  let a = 10;
}
test();
//ReferenceError: a is not defined
```

`var`关键字声明的未被赋值的变量会是`undefined`，将一个未定义的变量赋值给`let`声明的变量是会导致暂时性死区导致报错的。

```js
var a = a;
console.log(a);
//undefined

let b = b;
console.log(b);
//ReferenceError: b is not defined
```

在`ES6`语法下，给函数参数进行一个默认值的赋值操作，但是赋值一个未被定义的变量会造成暂时性死区导致报错。

```js
function test(x = y, y = 2){
  console.log(x, y); 
}
test();
//ReferenceError: Cannot access 'y' before initialization
```

***如何更改才能执行？*** 先赋值再引用值。

```js
function test(x = 2, y = x){
  console.log(x, y); //2  2
}
test();
```

`let`引起的暂时性死区使`typeof`结果也更改了。

```js
console.log(typeof a); //undefined
```

会导致`typeof`进行判断类型时出错。

```js
console.log(typeof a);
let a;
//ReferenceError: Cannot access 'a' before initialization
```

`let`只能再当前的块级作用域下生效。 不在同一作用域下的情况不生效。

```js
{ let a = 2; }
console.log(a);
//ReferenceError: a is not defined
```

```js
function test(){ let a = 2; }
console.log(a);
test();
//ReferenceError: a is not defined
```

```js
if(1){ let a = 2; }
console.log(a);
//ReferenceError: a is not defined
```

永远死循环，永远不执行代码，但不报错。

```js
for(;1;){ let a = 1; }
console.log(a);
```

死循环结束，执行代码，报错。

```js
for(;1;){
  let a = 1;
  break;
}
console.log(a);
//ReferenceError: a is not defined
```

关于`for`循环的坑，`i`无法提升，外部无法访问。`for`语句中`()`中的条件区域也属于块级作用域范围。

```js
for(let i = 0; i < 10; i++){}
console.log(i);
//ReferenceError: i is not defined
```

***为什么打印0-9 而不是 10个10？***

```js
var arr = [];
for (var i = 0; i < 10; i++) {
  arr[i] = function () {
    console.log(i); //未执行不打印 i = 10
  };
}

//这里var重复声明了i
for (var i = 0; i < 10; i++) {
  //但这里又开始循环重复赋值i 所以又开始0-9的执行
  arr[i]();
}
```

***`for`循环里面的两个块级作用域会不会存在冲突？***

```js
//这里存在两个块级作用域
for(var i = 0; i < 10; i++){
  i = 'a';
  console.log(i);
}
//a

//分析：
var i = 0
for(; i < 10; ){
  i = 'a';
  console.log(i);
  i++
}
//1. i = 0
//2. 进入循环 被赋值为a i++
//3. 'a' + 1 = 'a1' 变为 NaN
//4. NaN < 10 ? false 不进循环 所以只打印一次 a
```

```js
//这里i仍处于同一作用域下
for(let i = 0; i < 10; i++){
  console.log(i); //0
  i = 'a';
  console.log(i); //a
}
```

说明`let`和`var`不在同一作用域下。

```js
for(let i = 0; i < 10; i++){
  var i = 'a';
  console.log(i);
}
//SyntaxError: Identifier 'a' has already been declared
```

不在同一作用域下的不影响`let`的声明。

```js
//这里是两个块级作用域
for(let i = 0; i < 10; i++){
  let i = 'a';
  console.log(i); //10 个 a
}
```

以上例子说明`for`循环里面是父级作用域，像以下情况。

```js
if(1){
  let a = 1;
  { console.log(a); } //1
}
```

不同作用域下`let`不影响。

```js
if(1){
  let a = 1;
  {
    let a = 10;
    console.log(a); //1
  }
}
```

不限嵌套次数的块级作用域。

```js
{{{{{}}}}}
```

在`ES5`中`{}`嵌套的函数是不合法但可以解析的，在`ES6`中就允许了。

```js
{ function test(){} }
```

```js
if(i){ function test(){} }
```

```js
try{
  function test(){}
}catch(e){
  function test1(){}
}
```

上述写法并不推荐在块级作用域中使用函数声明的方式，但可以用函数表达式替代声明。

```js
try{
  var test = function(){}
}catch(e){
  var test2 = function(){}
}
```

块级作用域是没有返回值的，因为外部无法访问。

```js
{ return }
```





## `const`

定义常量，不可变的量，不期望变量被更改。在模块引入时，不希望模块被更改，只是使用模块里的属性和方法。

```js
const test = require('http');
```

**`const`特点：**

- 定义的常量必要要赋值
- 一旦定义必须赋值，值不能被更改
- 有块级作用域，存在暂时性死区
- 常量不能重复声明

定义的常量必要要赋值。

```js
const a;
console.log(a);
//Uncaught SyntaxError: Missing initializer in const declaration
```

存在暂时性死区。

```js
{ const a = 12; }
console.log(a);
//Uncaught ReferenceError: a is not defined
```

存在暂时性死区，且不能变量提升。

```js
{
  console.log(a);
  const a = 12;
}

//Uncaught ReferenceError: a is not defined
```

`const`不能重复声明。

```js
{
  const a = 12;
  let a = 10;
}
console.log(a);
//Uncaught SyntaxError: Identifier 'a' has already been declared
```

`const `的值是引用值情况，栈能保证不变，堆不能保证。说明`const`只保证指针地址没错，但不保证地址里数据内容不被更改。

```js
const obj = {};
obj.name = 'zhangsan';
console.log(obj);
//{name: "zhangsan"}
```

可以通过`Object.freeze()`方法冻结`const`声明的引用值，使之不能更改引用值数据

```js
const obj = {};
Object.freeze(obj);
obj.name = 'zhangsan';
console.log(obj);
//{name: "zhangsan"} freeze()之后 => {}
```

进一步封装冻结函数。

```js
function myFreeze(obj) {
  Object.freeze(obj);
  //深度递归对象里面的对象
  for (var key in obj) {
    //该对象的值为object且不能是null
    if (typeof (obj[key] === 'object') && obj[key] !== null) {
      Object.freeze(obj[key]);
    }
  }
}

var person = {
  son: { lisi: '18', zhangsan: '19' },
  car: ['benz', 'mazda', 'bmw']
};

myFreeze(person);
person.son.wangwu = '20';
person.car[3] = 'toyota';
console.log(person);
/**
 * 没有冻结时打印：
 * {son: {…}, car: Array(4)}
 *   car: (4) ["benz", "mazda", "bmw", "toyota"]
 *   son: {lisi: "18", zhangsan: "19", wangwu: "20"}
 *   __proto__: Object
 * 
 * 冻结后打印：
 * {son: {…}, car: Array(3)}
 *   car: (3) ["benz", "mazda", "bmw"]
 *   son: {lisi: "18", zhangsan: "19"}
 *   __proto__: Object
 */
```

不用`Object.freeze()`冻结的情况是这里`require`返回的是实例化对象被常量`const`接收，这种引入库的写法从源头上已经不能更改该对象的内容(因为是实例化对象)。

```js
const http = require('http');
```

顶层对象指`window`，顶层对象的属性。

```js
//早期的JavaScript写法存在问题但也能解析
//存在不容易发现错误
a = 1;
console.log(a); //undefined window
```

`ES6`为了改变，保持兼容性允许`var` 不允许`let const`。

```js
//所以建议用let或const写
let a = 1;
console.log(a); 
```





