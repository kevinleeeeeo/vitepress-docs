# `Symbol`&迭代器&`For/of`

## `Symbol`概述

`ES6`引入`Symbol`的原因是`ES5`对象属性经常出现重名的情况，解决对象属性名重名的问题。

- 原始值类型的值：`number/boolean/null/undefined/symbol`
- 引用值类型的值：`Object/Array/Function`

`Symbol`不是构造函数，尝试`new Symbol()`会报错。

```js
new Symbol();
//Uncaught TypeError: Symbol is not a constructor
```



## `symbol`值

`Symbol()`返回的唯一的值，属于原始值类型的值。

```js
const s1 = Symbol();
const s2 = Symbol();
console.log(s1, s2); //Symbol() Symbol()
console.log(s1 === s2); //false
```

尝试查看`Symbol()`返回的值的类型，是`symbol`类型。

```js
console.log(typeof Symbol()); //symbol
```

尝试给`Symbol()`返回的值挂上属性，结果无法挂入，返回`undefined`。

```js
let s1 = Symbol();
console.log(s1.a); //undefined
```

为了区别唯一的`symbol`值，可以通过传入不同的参数进行区分，作为标识符存在的。

```js
let s1 = Symbol('foo');
console.log(s1); //Symbol(foo)
```

`Symbol()`可以将引用值对象转为`symbol`原始值字符串的过程。说明对象自己调用了`Object.prototype.toString()`方法将自己变成字符串，也说明`symbol`的值永远是字符串。

```js
var obj = { a: 1 };
let s1 = Symbol(obj);
console.log(s1);
//Symbol([object Object])
```

当给`Symbol()`传入`undefined`或`null`参数时，不会报错，返回`symbol`值，说明都会接收一个字符串作为参数。

```js
console.log(Symbol(undefined)); //Symbol()
console.log(Symbol(null)); //Symbol(null)
```

`symbol`值是不能参与运算的，会报错，即不能通过`Number()`进行包装。

```js
console.log(Symbol() + 1); 
//Uncaught TypeError: Cannot convert a Symbol value to a number
```

尝试对`symbol`值进行`String()`包装，是可以转化为字符串的。

```js
console.log(String(Symbol())); //Symbol()
```

尝试对`symbol`值进行`Boolean()`包装，是可以转化为布尔值的。

```js
console.log(Boolean(Symbol())); //true
```

尝试查看`Symbol()`返回的值的原型，是`Symbol`包装类对象。

```js
console.log(Object.getPrototypeOf(Symbol()));
/**
 * Symbol {
 *   constructor: ƒ Symbol(),
 *   description: (...),
 *   toString: ƒ toString(),
 *   valueOf: ƒ valueOf(),
 *   Symbol(Symbol.toPrimitive): ƒ [Symbol.toPrimitive](),
 *   Symbol(Symbol.toStringTag): "Symbol",
 *   get description: ƒ description(),
 *   [[Prototype]]: Object
 * }
 */
```

尝试通过`symbol`值使用它继承原型上的`toString()`方法，该方法返回一个字符串。(显式)

```js
const s1 = Symbol(null);
console.log(s1.toString()); //Symbol(null)
```

尝试给`symbol`值进行隐式的字符串类型转换，发现会报错不支持转换。

```js
console.log(Symbol() + '');
//Uncaught TypeError: Cannot convert a Symbol value to a string
```

尝试给`symbol`值进行隐式的布尔值类型转换，发现不会报错且支持转换。

```js
console.log(!Symbol()); //false
```

## `Symbol`应用

`Symbol()`的用法一般是返回的`symbol`值作为独一无二的属性键名来使用。使用`.`语法来定义对象的属性名并不是一个唯一的属性名称，应该使用`[变量]`语法来定义对象的属性名称。当想访问该对象下的属性时也需要使用`[变量]`的方式进行获取。因为`.`语法操作符是隐性`toString`转换字符串导致无法正常获取属性名。

```js
let username = Symbol();
let userInfo = {};
//赋值
userInfo.username = 'bob';
console.log(userInfo); //{username: 'bob'}
userInfo[username] = 'jacky';
console.log(userInfo); //{Symbol(): 'jacky'}
//读取
console.log(userInfo[username]); //jacky
```

挂载`symbol`值到变量属性名里来定义对象的属性和方法。

```js
let name = Symbol();
let eat = Symbol();
let person = {
  [name]: 'zhangsan',
  [eat]: function(){}
  [drink](){ console.log(this[name]) }
}
```

## `Symbol`遍历

`Symbol.for()`方法可以拿到不是唯一的值，底层(运行时的`symbol`注册表中找到对应的`symbol`)通过`key`值拿到指定的`symbol`值。

```js
//一般来说，Symbol的值都是不同的
let s1 = Symbol('foo');
let s2 = Symbol('foo');
console.log(s1 === s2); //false

//也有特殊的情况，可以值是相同的
let s3 = Symbol.for('foo');
let s4 = Symbol.for('foo');
console.log(s3 === s4); //true
```

`Symbol.keyFor()`方法可以在全局中拿到当前的`key`值。

```js
let s1 = Symbol.for('foo');
let s2 = Symbol.for('foo');
//拥有同样的标识符
console.log(Symbol.keyFor(s1)); //foo
console.log(Symbol.keyFor(s2)); //foo
console.log(Symbol.keyFor(s1) === Symbol.keyFor(s2)); //true
```

`for in`不能遍历`symbol`属性的对象。

```js
const obj = {}
let a = Symbol('a');
let b = Symbol('b');
obj[a] = 'hello';
obj[b] = 'world';
// console.log(obj);
//{Symbol(a): "hello", Symbol(b): "world"}

//遍历
for (let i in obj) {
  console.log(i); //无打印结果
}
```

`for of`不能遍历`symbol`属性的数组，对象不是可迭代对象也无法进行遍历，此问题可以通过以下`iterator`对象接口封装来解决无法遍历。

```js
const obj = {};
let a = Symbol('a');
let b = Symbol('b');
obj[a] = 'hello';
obj[b] = 'world';

//遍历
for (let i of obj) {
  console.log(i); //Uncaught TypeError: obj is not iterable
}
```

利用对象合并`Object.assign()`方法对对象里的`symbol`属性进行拷贝，拷贝时会遍历对象下的所有属性，结果是可以进行合并的，但无法获取遍历后的键名`symbol`属性数组集合。

```js
const obj = {};
let a = Symbol('a');
let b = Symbol('b');
obj[a] = 'hello';
obj[b] = 'world';

console.log(Object.assign({}, obj)); 
//{Symbol(a): 'hello', Symbol(b): 'world'}
```

`Object.getOwnPropertySymbols()`方法是新的`API`专门遍历`symbol`类型的值，也是唯一的遍历`symbol`值的方法。

```js
const obj = {}
let a = Symbol('a');
let b = Symbol('b');
obj[a] = 'hello';
obj[b] = 'world';

console.log(Object.getOwnPropertySymbols(obj));
//[Symbol(a), Symbol(b)]
```

`Object.getOwnPropertySymbols()`方法会遍历自身的`Symbol`类型的值，即使定义了`enumerable: false`不可枚举属性也可以拿到键名数组集合。

```js
const a = Symbol('a');
const b = Symbol('b');
const c = Symbol('c');
const obj = { [a]: 'a', [b]: 'b' };

Object.defineProperties(obj, {
  [c]: { value: 'c', enumerable: false }
});
console.log(obj);
//{Symbol(a): 'a', Symbol(b): 'b', Symbol(c): 'c'}
console.log(Object.getOwnPropertySymbols(obj));
//[Symbol(a), Symbol(b), Symbol(c)]
```

`Object.getOwnPropertySymbols()`方法仅仅会遍历自身的`Symbol`类型的值，定义在原型上的`Symbol`类型的值无法进行遍历。

```js
const a = Symbol('a');
const b = Symbol('b');
const c = Symbol('c');
const obj = { [a]: 'a', [b]: 'b' };
const proto = { [c]:'c' };

Object.setPrototypeOf(obj,proto);
console.log(obj);
//{Symbol(a): 'a', Symbol(b): 'b', [[prototype]]: { Symbol(c): 'c' }}

console.log(Object.getOwnPropertySymbols(obj));
//[Symbol(a), Symbol(b)]
```



| 对象遍历方法                     | 范围       | 仅支持可枚举 | 支持`Symbol`值 |
| -------------------------------- | ---------- | ------------ | -------------- |
| `for in`                         | 自身和继承 | 是           | 否             |
| `Object.keys()`                  | 自身       | 是           | 否             |
| `Object.assign()`                | 自身       | 是           | 是             |
| `JSON.stringify()`               | 自身       | 是           | 否             |
| `Object.getOwnPropertySymbols()` | 自身       | 否           | 是             |



## `Symbol`静态方法

`Symbol.hasInstance()`是`Symbol`构造器上的静态方法，用来判断某个对象实例是否是某构造器实例出来的。当其他对象调用`instanceof`时会调用`Symbol.hasInstance()`方法。开发底层库或者框架时会用到该方法，判断用户行为是否有使用了`instanceof`关键字从而隐式的去执行这个`Symbol.hasInstance()`方法。

```js
console.log(Symbol.hasInstance); //Symbol(Symbol.hasInstance)
foo instanceof Foo
```

`Symbol.isConcatSpreadable()`方法用来判断当前对象使用`concat()`方法在拼接的时候查看数组能否被展开。在数组`[].concat()`执行调用时同时执行`Symbol.isConcatSpreadable()`方法。

`Symbol.replace()`方法用来判断字符串方法`String.prototype.replace()`执行时同时执行`Symbol.replace()`方法。

`Symbol.match()`方法匹配了正则表达式在字符串方法`String.prototype.match()`执行时同时执行`Symbol.match()`方法。





## `iterator`接口

`Symbol.iterator()`方法为每一个对象都定义了默认的迭代器。可以被`for..of`遍历。例如数组的原型上有一个`Symbol`迭代器接口。

```js
/**
 * console.log(Object.getPrototypeof([]));
 * {
 *   ...,
 *   Symbol(Symbol.iterator): ƒ values()
 * }
 */
```

尝试访问迭代器接口的方法，改方法执行会返回一个迭代器对象，该迭代器对象原型上有个`next()`方法。

```js
let arr = ['a', 'b'];
console.log(arr[Symbol.iterator]);
//ƒ values() { [native code] }

let iter = arr[Symbol.iterator]();
console.log(iter);
//Array Iterator { [[Prototype]]: Array Iterator:{ next:  ƒ next() } }
```

尝试执行实例对象`iter`的`next()`方法，返回一个具有`value`和`done`属性的对象。这仅仅是第一次执行`next()`方法返回的结果。

```js
iter.next(); //{value: 'a', done: false}
```

再次执行`next()`方法同样也返回一个具有`value`和`done`属性的对象，但此时`value`的值对应`arr[1]`的值。

```js
iter.next(); //{value: 'b', done: false}
```

再次执行`next()`方法同样也返回一个具有`value`和`done`属性的对象，但此时`value`的值对应是`undefined`和`done`的值对应是`true`。说明迭代完成，返回`true`。

```js
iter.next(); //{value: undefined, done: true}
```



## 迭代器

在 `JavaScript `中，迭代器是一个对象，它定义一个序列，并在终止时可能返回一个返回值。更具体地说，迭代器是通过使用 `next()` 方法返回具有两个属性的对象。

迭代器迭代过程是一部分数据被抽取的过程，抽取当前有序且连续的数据结构，迭代器接口是对数据结构读取的一种方式，抽取过的数据就不会被抽取了，相当于数据已经被消耗掉了，说明该数据就无法被访问了。

类数组有`arguments`，`NodeLists`节点列表，除了类数组有后端专门处理二进制数据类似数组结构的`TypeArray`数据结构，还有`Map`，`Set`，`WeakMap`，`WeakSet`都是有序可迭代的数据结构。

迭代器的意义是让所有的数据类型都用一种统一的方法进行迭代。



## 部署迭代器

`ES6`部署迭代器的方式通过一个隐式的标准化接口`Symbol.iterator`进行访问接口，每次调用当前的`next()`方法，返回一个当前成员信息的`iterator`对象，包含了`value`和`done`两个属性。

使用代码简单实现一个迭代器。

```js
function makeIterator(array){
  var nextIndex = 0;
  return {
    next: function(){
      return nextIndex < array.length ? 
        { value: array[nextIndex++], done: false } :
        { value: 'undefined', done: true }
    }
  }
}
```



## `For/of`

以上迭代器获取数据的方式有点过于麻烦，`ES6`借鉴了`C++`，`JAVA`，`C#`，`Python`语言中的`for...of`循环，也属于迭代的过程，为遍历可迭代数据结构提供一个统一简单的遍历语法接口，它实际上也同样调用了`Symbol.iterator`接口进行访问。

数组结构已经部署好了`Symbol.iterator`接口，尝试使用`for...of`直接访问。

```js
let arr = [1, 2, 3];
for(let i of arr){
  console.log(i);  //1 2 3
}
```

对象结构并不具备`Symbol.iterator`接口，所以无法通过`for...of`的方式进行访问迭代，但是也可以部署接口的方式让对象结构也可以通过`for...of`方式进行迭代。只有给对象定义一个属性，属性名为访问的接口(需要`[xxx]`方式访问)，属性值为迭代函数即可。

```js
let obj = {
  [Symbol.iterator]: () => {
    let index = 0; //部署指针
    return {
      next: () => {
        return nextIndex < array.length ? 
          { value: array[nextIndex++], done: false } :
          { value: 'undefined', done: true }
      }
    }
  }
}
```



