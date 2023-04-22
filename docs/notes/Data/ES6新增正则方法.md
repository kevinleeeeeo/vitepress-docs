# `ES6`正则新增方法

## 概述

在`ES6`中新增了一些特性，如声明正则的变化方式，如将字符串上的正则方法进行了调整，将原本方法放入正则表达式原型上，如新增修饰符`u`，`y`，`s`等。

## 正则声明

传统`ES5`中正则的声明方法有`new RegExp()`和字面量声明。

字面量声明一个正则。

```js
var reg = /xyz/i;
```

在`ES5`之前，以下传参数1为字符串，参数2为修饰符的方式会报错。

```js
//new RegExp('字符串', '修饰符');
var reg = new RegExp('xyz', i);
```

`ES6`改变传参方式，参数1为正则规则，参数2为修饰符。

```js
var reg = new RegExp(/xyz/i, 'm');
```



## 方法调整

将字符串上的正则方法进行了调整，将原本方法放入正则表达式原型上。

```js
String.prototype.match()
String.prototype.replace()
String.prototype.search()
String.prototype.split()

//转移后
RegExp.prototype[Symbol.match];
RegExp.prototype[Symbol.replace];
RegExp.prototype[Symbol.search];
RegExp.prototype[Symbol.split];
```



## `global`

`reg.global`是正则实例对象里的属性，判断是否有定义全局匹配修饰符。

```js
var reg = new RegExp('xyz', 'g');
console.log(reg.global); //true
```



## `ignoreCase`

`reg.global`是正则实例对象里的属性，判断是否有定义忽略大小写修饰符。

```js
var reg = new RegExp('xyz', 'i');
console.log(reg.global); //true
```

## `multiline`

`reg.multiline`是正则实例对象里的属性，判断是否有定义忽略换行修饰符。

```js
var reg = new RegExp('xyz', 'm');
console.log(reg.global); //true
```



## `sticky`

`reg.sticky`是正则实例对象里的属性，判断是否有定义搜索是否具有粘性的修饰符。

```js
var reg = new RegExp('xyz', 'y');
console.log(reg.global); //true
```



## `source`

`reg.source`是正则实例对象里的属性，返回当前正则表达式对象的模式文本的字符串，该字符串不会包含正则字面量两边的斜杠以及任何的标志字符。

```js
var reg = /\wabed/giy;
console.log(reg.source); // \wabed
```

## `flags`

`reg.flags`是正则实例对象里的属性，返回一个字符串，由当前正则表达式对象的标志组成，即定义的修饰符。

```js
var reg = /\wabed/giy;
console.log(reg.flags); // giy
```





## `y`修饰符

`y`修饰符区别于`g`修饰符，它本身也是一种全局匹配。`g`对剩余位置的字符都可以匹配，`y`不会对剩余位置的字符匹配。

```JS
var str = 'aaa_aa_a';
var reg1 = /a+/g;
var reg2 = /a+/y;

//第一次匹配结果一样
console.log(reg1.exec(str));
//['aaa', index: 0, input: 'aaa_aa_a', groups: undefined]
console.log(reg2.exec(str));
//['aaa', index: 0, input: 'aaa_aa_a', groups: undefined]

//第二次匹配存在差异
console.log(reg1.exec(str));
//['aa', index: 4, input: 'aaa_aa_a', groups: undefined]
console.log(reg2.exec(str));
//null
```



## `u`修饰符

`unicode` 是正则表达式独立实例的只读属性。使用`u`修饰符，任何 `unicode` 代码点的转义都会被解释。`unicode`分为若干个(`17`个)区域，每个区域存放`2*16`次方个字符。如`\uD842`可以表示一个字符。

```JS
//一个编码方式极限范围 U+D800到U+FFFF 
//超出则需要2个编码方式
var s = '\uD842\uDFB7';
console.log(s); //𠮷
console.log(/^.$/.test(s)); //false
console.log(/^.$/u.test(s)); //true
```

`ES6`优化码点的写法，以5位数进行优化。

```js
console.log('\u{20bb7}'); //𠮷
console.log(/a{2}/u.test('aa')); //true
```

`JavaScript`字符串是以`utf-16`的编码方式进行存储的。以两个字节表示一个字符。

```js
console.log('\u0061');
console.log('\u{20bb7}');
```



## `s`修饰符

`dotAll`，点全部。点不能覆盖的还有`\n`，`\r`，`U2028`，`U2029`。

希望让其余的都可以匹配，加`s`修饰符即可解决。

```js
console.log(/foo.bar/.test('foo\nbar')); //false
console.log(/foo.bar/s.test('foo\nbar')); //true
console.log(/foo.bar/.dotAll); //false
console.log(/foo.bar/s.dotAll); //true
```



