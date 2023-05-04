# 原型操作&对象遍历&`super`&`Class`

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





## `Class`

它是`ES6`新增的关键字，它是一个类，在纯面向对象的语言中存在的类，`JavaScript`是模拟了类的一个方式，本质上是一个语法糖，语法糖是一个新的语法，仅仅把原来的写法换了另外的一种方式，本身是一个函数，通过`Class`关键字进行重新封装，除了写法上没有什么改变，提高可读性和维护性，减少代码出错率。

`Class`具有以下特点：

- 函数可以声明提升，但是`Class`声明无法提升，与`let`相同，具有暂时性死区。
- 在`Class`类内部定义的公共属性和方法是无法被枚举的。
- 类里默认是严格模式。
- 类内部有一个默认的`constructor`方法，没有定义时也不会报错。
- 类方法只能通过`new`关键字来执行。

```js
//ES5写法
function Person(name, age) {
  this.name = name;
  this.age = age;
}
Person.prototype.say = function () {
  console.log('My name is ' + this.name + ', my age is' + this.age);
}
new Person('zhangsan', '18')；
```

`ES6`新增的类仅仅是模拟了构造函数，本质上也是一个函数。`constructor()`构造器函数方法里需要配置的属性是实例化配置的属性，在`ES6`中这些属性也叫私有属性。原型方法的定义是所有实例化对象的公共祖先，所有的实例化对象都可以访问原型上的属性和方法。

```js
//ES6写法 区别：class类里面的方法是不可枚举的
class Person {
  constructor(name, age) {
    this.name = name; //私有属性
    this.age = age;
  }
  say() { console.log('i can say'); } //公有方法
}
new Person('lisi', '20');
```

尝试利用`Object.keys()`方法遍历`ES5`写法上通过`Object.assign()`定义的原型上的方法，结果是可以遍历原型上的方法。

```js
Object.assign(Person.prototype, { say: function(){} });
console.log(Object.keys(Person.prototype)); //["say"]
```

尝试利用`Object.keys()`方法遍历`Class`上的方法，结果是无法遍历原型上的方法，或某类内部的方法是不可枚举的。

```js
console.log(Object.keys(Person.prototype)); //[]
```

类里的`constructor`能否更改`this`的指向呢？手动指定`this`，返回一个新的对象会更改`this`指向。

```js
function Brand(){}
class Person {
  constructor() {
    return Object.create(null);
  }
}
console.log(new Brand() instanceof Brand); //true
console.log(new Person() instanceof Person); //false
```

奇怪的写法，函数表达式的写法，证明可以通过函数表达式的方式声明。

```js
let Person = class {
  say() { console.log('111'); }
}
new Person().say(); //111
```

更奇怪的写法(立即执行，不能用于实际开发)。

```js
//必须通过new的方式执行类
let person = new class {
  say() { console.log('111'); }
}();
person.say(); //111
```

不存在函数声明提升，跟`let`一样形成暂时性死区(`TDZ`)。

```js
console.log(new Person());
class Person{}
```

***类里面是否可以含有共有属性？*** 结果说明并没有共有属性，默认把属性在`constructor`底下定义了(私有属性)。

```js
class Person {
  a = 1; //es7写法，相当于以下写法
  constructor(name) { this.a = name; }
}
console.log(new Person('wangwu'));
```

`ES6`之前，利用`Symbol`生成独一无二的字符串定义方法名，定义外部不能访问共有方法，实现方法私有化。

```js
const eat = Symbol();
class Person {
  constructor(name) {
    this.name = name;
  }
  say() { console.log('saying'); };
  [eat]() { console.log('eating'); }
}

let person = new Person('wangwu');
person.say(); //saying
person.eat(); //报错
```

`static`关键字，静态方法，一般情况下不能用于定于属性。

```js
//静态方法一般不会被new 实例执行的，而是直接通过类名调用执行
class Person {
  static a() { console.log(1); };
}

Person.a(); //1
```

类里自动定义取值函数和存值函数`getter/setter`，对应属性的读取操作和方法的赋值操作。

```js
class Person {
  get a() { console.log(1); }
  set a(value) { console.log(2); }
}
let person = new Person();
person.a; //1
person.a = '3'; //2
```





## `Class`继承

`ES6`之前的继承方式需要修改原型链，`extends`关键字可以简化的实现继承关系。子类也叫派生类，通过`extends`关键字派生出来。

```js
class Parent{}
class Child extends Parent{}
```

子类是无法访问父类的静态属性和方法。

```js
class Parent{ static a(){} }
class Child extends Parent{}
new Child().a();
//Uncaught TypeError: (intermediate value).a is not a function
```

在派生类中定义`constructor()`方法必须要指定`super()`的执行。必须通过`super`关键字来指定`this`。

```js
class Parent{}
class Child extends Parent{
  constructor(){ console.log(this) }
}
new Child();
//Uncaught ReferenceError: Must call super constructor in derived class before accessing 'this' or returning from derived constructor
```

只需要调用`super()`会隐式的改变`this`指向。`super()`方法相当于父级的`constructor`构造器方法，接收的参数来自于`super()`传入的参数。

```js
class Parent{
  constructor(age){
    this.age = age;
    console.log(this); //Child {age: 18}
  }
}
class Child extends Parent{
  constructor(age){ super(age) }
}
new Child(18);
```

假如需要继承父类的属性和方法，必须在自类`constructor()`方法内部顶部位置执行`super()`，才可能获取父类的`this`，接着才能定义自类自身的`this`的属性。

```js
class Parent{ constructor(){} }
class Child extends Parent{
  constructor(opt){
    super(); //顶部优先执行
    this.name = opt.name;
  }
}
new Child({ name: 'lulu' });
```







