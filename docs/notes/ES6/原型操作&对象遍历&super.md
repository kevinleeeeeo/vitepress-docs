# 原型操作&对象遍历&`super`

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







