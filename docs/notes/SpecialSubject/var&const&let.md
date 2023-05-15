# `var`&`const`&`let`

## 概述

变量的声明有`var`，`const`，`let`关键字，都与预编译，作用域以及提升有关系。`var`来源于`variable`单词，数学中是变量的意思。`let`和`const`是`ES6`新增语法，`let`来源于拉丁语`latter`，放手放开的意思，把某种事物顺其自然变化。`const`来源于`constant`，常态，计算机的常量是`read-only`一个只读变量不一定有初始化的过程。

声明式是把值绑定给标识符号的过程，语句是执行任务行为。`var`后来没有归类到声明式的原因是存在了特殊的情况，会产生作用域的副作用，即无法避免地去创建全局作用域属性的，这种副作用交叉性太强会导致非常多的问题，所以后来`ES6`规范中对其声明式的作用进行移除，使用`const`或`let`来代替。

在`ES6`声明式`declaration`的关键字有这些`let`，`const`，`async`，`function`，`class`，`export`，`import`，`const`函数表达式。其他则为语句`statement`，如`var`函数表达式。

块是`ES6`提出的，是一个大括号。外部无法访问大括号内部定义的变量。目的是封装独立的作用域。块级作用域生效的条件是在严格模式下，或者是模块内部。





## `var`

`var`在`ES3`使用的原因是`JavaScript`借助了数学对变量的表述，`const`和`let`并非在`ES6`的时候才提出，而在`ES3`草案时提出。`ES3`在设计语言方面存在极大的问题，在早期浏览器无法承载太多的脚本代码，没有单独的`JS`引擎，早期与渲染引擎一起来做语法分析，超过十几行代码就会崩溃，所以对变量声明上并不会做出区分，`const`和`let`在`JavaScript`中需要有复杂的语言分析的机制，如果列入到代码里会使内存溢出，对`CPU`造成很大的性能损耗，而且渲染本身也需要耗费很大的性能，导致早期的`JavaScript`设计必须要简单。

在浏览器性能方面，`var`关键字是比较贴切于`JavaScript`作为一门动态脚本语言，宿主是浏览器环境，浏览器不可能作为一个编译器去编译强类型语言再转为弱类型再去转机器码。针对宿主为浏览器的脚本必须设计的简单化，动态化，这样才可以让浏览器作为解释器有效的去解释和执行脚本代码，并节省开支。所以在`ES3.1`版本时也也没有通过新增`let`，`const`的草案。

在语言本身复杂度方面，对于浏览器对新语法的支持上以及浏览器厂商对规范的支持等问题只能选择`var`声明，并不希望把脚本语言的规范做的更加的复杂，而且早期的业务场景需求较为单一，仅是对`DOM`的操作的动态操作。到如今，`ES6`对`const`和`let`的新增是对日益硬件技术的提升的发展需求的补充。

`var`在底层上叫定义，在开发层面叫声明。`var`只能定义全局变量`global-scoped variables`和局部变量`function-scoped variables`，初始化是可以选的，当`var a`声明时，存在一个预编译的过程，在全局预编译时找到变量`a`，并且初始化为`undefined`。当`var b = 1`声明并赋值时，不存在初始化的过程，而是主动将`1`赋值给变量`a`的过程。



## `let`

`let`声明块级作用域的局部变量，`ES6`模块化中的模块也是一个块级作用域，默认严格模式，`window`对象访问是`undefined`。在`ES6`中的块级作用域与`ES3`的立即执行函数创建的作用域性质是一样的，为了保证变量没有全局污染的一个解决方案。

标识符被重复声明的报错。在`ES6`中，对`ES3`的`var`的重复赋值是不合理的，所以才新增了`let`声明来让变量可以被重复赋值。

```JS
let a = 1;
let a = 2;
//Uncaught SyntaxError: Identifier 'a' has already been declared
```

在预编译过程`var`声明的变量会提升，会存在短暂的暂时性死区。而`JS`系统中，`undefined`是唯一自动化生成的默认值。预编译阶段拿到声明，但不进行初始化`undefined`或者是其他的值，而初始化的过程放到执行期阶段为了解决声明后可访问变量的问题。

```js
console.log(a); //undefined
var a = 2;
```

未捕获的引用错误，在初始化变量之前，无法访问未被初始化的变量。`ES6`做到了将变量的声明和初始化两个过程分开，初始化的过程其实是变量赋值的过程。

```js
console.log(a); //Uncaught ReferenceError: Cannot access 'a' before initialization.
let a = 1;
```

`let`声明不能出现在单独的语句中，词法声明是不能在单行语句中，`var`可以即`var`没有在`ES6`中变为声明式的原因是需要向前兼容。

```js
if(true) var a = 1; //正常解析 此写法虽然能通过但不是正常的写法
if(true) let a = 1; //Uncaught SyntaxError: Lexical declaration cannot appear in a single-statement context. 
```



## `const`

声明常量的关键字，`const`声明的变量并不能重新被赋值。指向引用值，内部属性可删除或更改。如果是常量性质，命名时要大写。如果是变量性质，命名时用小驼峰写法。



## `for`

`for`循环中`3`个部分，有初始块`initialization block`，有条件块`condition block`，有操作块`operation block`。

```js
var i = 0;
for( ; ; ){
  if(i >= 5){ break; }
  console.log(i);
  i++;
}
```

`for`循环内部`var`声明和外部`var`声明是没有区别的。都会去外部拿到变量。

```js
var i = 0;
for(var i = 0; i < 5; i++){}
```

当执行每一个函数的时候，`for`循环同步程序，执行完成之后遍历`arr`且执行每一个函数，此时`i = 5`。

```js
var arr = [];
for(var i = 0; i < 5; i++){
  arr[i] = function(){ console.log(i) }
}
arr.forEach(cb => cb());
```

`ES3`解决方法是创建立即执行函数来通过参数来作为临时局部变量。

```js
for(var i = 0; i < 5; i++){
  (function(j){
    arr[j] = function(){ console.log(j) }
  })(i);
}
```

`ES6`解决方法是`for`循环中初始块用了`let`触发并创建特殊的一种作用域机制，在每次迭代的时候，系统会为`for`的`loop`本体创建一个词法作用域，在词法作用域中新`let`声明一个`i`，将上一次迭代或初始化的值赋值给新的`i`变量，对新词法作用域内的`i`进行操作，如`i++`，这就是形成块作用域的原因。

```js
let arr = [];
for(let i = 0; i < 5; i++){
  //此区域创建新的词法作用域
  arr[i] = function(){ console.log(i) }
}
arr.forEach(cb => cb());
```

内部写法可以这样理解：

```js
const arr = [];
let memo; //缓存上一次的i
{
  let i;
  i = 0;
  arr[i] = function(){ console.log(i) }
  memo = i + 1;
}
{
  let i;
  i = memo;
  arr[i] = function(){ console.log(i) }
  memo = i + 1;
}
{ ... }
```

