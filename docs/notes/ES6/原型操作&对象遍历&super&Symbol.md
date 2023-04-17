# 原型操作&对象遍历&`super`&`Symbol`

## 原型操作

`Object.create()`方法可以创建一个原型对象。以下修改方式在`JavaScript`中非常耗费性能，且访问效率低，继承自该原型的对象都会有影响。

```js
function Person(){}
const person = new Person();
person.__prototype = {};
```

`Object.setPrototypeOf()`方法可以对对象的原型进行修改操作。避免了实例对象调用`__proto__`并直接赋值对象的方式进行原型修改。参数1为当前对象，参数2为指定原型对象。

```js
const proto = { y: 20, z: 40 };
const obj = { x: 10 };
const returnObj = Object.setPrototypeOf(obj, proto);
console.log(returnObj === obj); //true
/**
 * console.log(obj);
 * {
 *   x: 10,
 *   [[Prototype]]: { y: 20, z: 40 }
 * }
 */
```

当`Object.setPrototypeOf()`方法的参数1为原始值时，返回的对象的原型是一个包装类对象，指定对象的对象原型则失效。`Object.getPrototypeOf()`方法可以对对象原型进行读取操作。

```js
console.log(Object.setPrototypeOf(1, { x: 10 })); //1
//此时返回值无法看出原型是否被成功设置 可以通过Object.getPrototypeOf()方法查看
console.log(
  Object.getPrototypeOf(
    Object.setPrototypeOf(1, { x: 10 })
  )
);
//Number {0, constructor: ƒ, toExponential: ƒ, toFixed: ƒ, toPrecision: ƒ, …}

console.log(
  Object.getPrototypeOf(
    Object.setPrototypeOf(false, { x: 10 })
  )
);
//Boolean {false, constructor: ƒ, toString: ƒ, valueOf: ƒ}

console.log(
  Object.getPrototypeOf(
    Object.setPrototypeOf('text', { x: 10 })
  )
);
//String {'', constructor: ƒ, anchor: ƒ, at: ƒ, big: ƒ, …}
```

当`Object.setPrototypeOf()`方法的参数1为`undefined`或`null`时，返回的对象的原型是一个包装类对象，但是`undefined`或`null`无法被包装类包装导致报错，指定对象的对象原型则失效。

```js
console.log(
  Object.getPrototypeOf(
    Object.setPrototypeOf(undefined, { x: 10 })
  )
);
//Uncaught TypeError: Object.setPrototypeOf called on null or undefined
```



## 对象遍历

`Object.keys()`方法可以对一个对象自身下可枚举属性进行遍历操作，返回该对象下所有键名数组集合。

```js
const userInfo = { username: 'bob', age: 28 };
console.log(Object.keys(userInfo)); //[ 'username', 'age' ]
```

尝试让遍地对象原型对象的键值，结果是无法遍历出原型上的属性，只能对对象自身的属性遍历。

```js
const userInfo = { username: 'bob', age: 28 };
Object.setPrototypeOf(userInfo, { job: 'driver' });
console.log(Object.keys(userInfo)); //[ 'username', 'age' ]
```

尝试给原始值进行遍历，被变量的原始值先进行包装类包装成一个对象后才被遍历，如果没有索引属性则失效返回空集合数组。

```js
console.log(Object.keys('test')); //[ '0', '1', '2', '3' ]
console.log(Object.keys(500)); //[]
console.log(Object.keys(false)); //[]
```

尝试给`undefined`或`null`进行遍历，被变量的原始值先进行包装类包装成一个对象后才被遍历，但是`undefined`或`null`无法进行包装类包装导致报错。

```js
console.log(Object.keys(undefined));
console.log(Object.keys(null));
//TypeError: Cannot convert undefined or null to object
```

`Object.values()`方法可以对一个对象自身下可枚举属性进行遍历操作，返回该对象下所有键值数组集合。

```js
const userInfo = { username: 'bob', age: 28 };
console.log(Object.values(userInfo)); //[ 'bob', 28 ]
```

`Object.entries()`方法可以对一个对象自身下可枚举属性进行遍历操作，返回该对象下所有键名和键值数组集合。

```js
const userInfo = { username: 'bob', age: 28 };
console.log(Object.entries(userInfo)); //[ [ 'username', 'bob' ], [ 'age', 28 ] ]
```





## `super`

`ES6` 的 `class` 属于一种“语法糖”，所以只是写法更加优雅，更加像面对对象的编程，其思想和 `ES5` 是一致的。与`super`对应的是`this`指向，`this`的初衷是当前函数的对象(指向调用者对象本身)。`super`关键字指向是对象的父类即原型对象。

声明一个原型对象，尝试通过在子类使用`super`关键字获取父类的属性，但是以下3种写法都会报错：

```js
const proto = { z: 30 };
//写法1
const obj = { x: 10, y: 20, foo: super.z };
//写法2
const obj = { x: 10, y: 20, foo: function () { console.log(super.z) } };
//写法3
const obj = { x: 10, y: 20, foo: () => { console.log(super.z) } };
Object.setPrototypeOf(obj, proto);
//Uncaught SyntaxError: 'super' keyword unexpected here
```

除了对象简写的写法才不会报错，说明`super`关键字使用上是有限制的，只能是**对象下简写方法**(属性不行)内部才可以使用生效。

```js
const proto = { z: 30 };
const obj = {
  x: 10,
  y: 20,
  foo() { return super.z }
};
Object.setPrototypeOf(obj, proto);
console.log(obj.foo()); //30
```

不仅可以通过`super`获取父类的属性，还可以执行父类上的方法。

```js
const proto = {
  z: 30,
  bar() { console.log(this.z) } //30
};
const obj = {
  x: 10,
  y: 20,
  foo() { super.bar() }
};
Object.setPrototypeOf(obj, proto);
obj.foo();
```





## `Symbol`

`ES6`引入`Symbol`的原因是`ES5`对象属性经常出现重名的情况，解决对象属性名重名的问题。

- 原始值类型的值：`number/boolean/null/undefined/symbol`
- 引用值类型的值：`Object/Array/Function`

`Symbol`不是构造函数，尝试`new Symbol()`会报错。

```js
new Symbol();
//Uncaught TypeError: Symbol is not a constructor
```

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

`Symbol()`可以将引用值对象转为`symbol`原始值字符串的过程。说明对象自己调用了`Object.prototype.toString()`方法将自己变成字符串，也说明symbol的值永远是字符串。

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



`Symbol`定义唯一方法实现一个`iterator`接口，对象是不连续的且无序的数据结构，一般来说不能用`for of`，但是可以通过部署迭代器接口的方式来使用`for of` 遍历。

```js
//手动的编写一个iterator接口可以针对指定的数据类型进行迭代遍历
//对象上写一个iterator接口
let obj = {
  start: [1, 3, 2, 4],
  end: [5, 7, 6],
  //中括号包裹字符串的方式
  [Symbol.iterator]() {
    //定义指针
    let index = 0,
      //组合新数组
      arr = [...this.start, ...this.end],
      //新数组长度
      len = arr.length;
    //将新数组进行迭代
    return {
      next() {
        if (index < len) {
          ////累加的结果
          return { value: arr[index++], done: false }
        } else {
          return { value: undefined, done: true }
        }
      }
    }
  }
}

for (let i of obj) {
  console.log(i); //1 3 2 4 5 6 7
}
```

