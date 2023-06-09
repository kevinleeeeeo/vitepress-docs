# `this`&绑定指向

## `this`

`this`是`JavaScript`的关键字，是当前环境执行期上下文的一个属性，在不同的环境中`node/window`下表现是不同的。



**全局对象**

- 全局作用域下的`this`是全局对象`this === window`
- `web`的全局对象有：`window`,`self`,`frames`
- `node`的全局对象有：`global`
- `worker`的全局对象有：`self`
- `globalThis`可以拿到不同环境下的全局对象

**严格模式**下函数内部的`this`指向`undefined`。

**指向**

- 函数内部还没实例化的`this`指向`window`。
- 全局范围的`this`指向`window`。
- 预编译函数`this`指向`window`。
- `apply/call`改变`this`指向。
- 构造函数的`this`指向实例化对象。

普通函数内部的`this`。

```js
//函数内部的this
//函数内部还没实例化的this指向window
function test(b) {
  this.d = 3; //window.d = 3
  var a = 1;

  function c() {}
}
test(123);
console.log(d); //3
console.log(this.d); //3
console.log(window.d); //3

/**
 * A0 = {
 *   arguments: [123],
 *   this: window,
 *   b: undefined -> 123,
 *   a: undefined,
 *   c: function c(){}
 * }
 */
```

构造函数的`this`。

```js
//this指向实例化对象
function Test() {
  //var this = {
  //  __proto__: Test.prototype
  //}
  this.name = '123';
}
var test = new Test();

//关于构造函数的AO/GO
/**
 * new之前：
 * AO = {
 *   this: window
 * }
 * 
 * GO = {
 *   Test: function Test(){...}
 * }
 /

 /**
 * new之后：
 * AO = {
 *   this: {
 *     name: '123',
 *     __proto__: Test.prototype
 *   }
 * 
 * }
 * 
 * GO = {
 *   Test: function Test(){...},
 *   test: {
 *     name: '123',
 *     __proto__: Test.prototype
 *   }
 * }
  */
```

`call()`/`apply()`的`this`。

```js
//call / apply
function Person() {
  this.name = 'zhangsan';
  this.age = 18;
}

function Programmer() {
  //this -> Person
  Person.apply(this);
  //引申： 如果Person函数有形参，需要传参数
  // Person.apply(this, [name, age]);
  this.work = 'Programming';
}

var p = new Programmer();
console.log(p);
```



## `this`进阶

**预编译:** 

函数执行 -> `AO`-> 产生`this`-> `this`的指向与执行方式有关

1. 默认绑定规则
2. 隐式绑定规则: 对象调用(谁调用指向谁)
   1. 隐式丢失
   2. 参数赋值
3. 显示绑定: `call/apply/bind`
4. `new`绑定 

**优先级问题：** `new`显式 > 隐式 > 默认

```js
//1.默认绑定规则

//全局this指向window
console.log(this === window); //true

//函数的独立调用: 函数内部this指向window
function test() {
  console.log(this === window); //true
}
test();
//2.隐式绑定规则: 对象调用(谁调用指向谁)
//隐式丢失，参数赋值的情况，导致隐式绑定失败
var a = 0;
var obj = {
  a: 2,
  foo: function () {
    console.log(this); //{a: 2, foo: ƒ} //被抛出闭包后,这里this改变为window
    function test1() {
      console.log(this); //window
    }
    //函数独立调用指向window
    test1();

    //函数立即执行也算是函数独立调用
    (function () {
      console.log(this); //window
    })();

    //闭包: 当函数执行时导致函数被定义并抛出
    function test2() {
      console.log(this); //window
    }
    return test2;
  }
}
obj.foo();
//调用闭包函数
obj.foo()();
//对象调用(谁调用指向谁)的例外
//隐式丢失
var a = 0;

function foo1() {
  console.log(this);
}

var obj1 = {
  a: 2,
  foo1: foo1
}

obj1.foo1(); //this -> obj1

//当前全局变量bar持有foo1的引用
var bar = obj1.foo1;
bar(); //this -> window

//解读:
//观察this在哪里执行
//obj里执行指向obj
//bar()独立调用执行window
//当方法被重写/函数赋值时会存在隐式丢失 -> 函数独立调用

//var bar = obj1.foo1; -> var bar = foo1; -> 函数独立调用foo1();
//关于调用方式
//独立调用的方式
obj.foo();
//以下三个不同的调用方式
bar.call();
bar.apply();
bar.bind();
//函数的参数赋值的情况
//参数赋值也会存在丢失使内部调用函数变为独立调用执行
var a = 0;

function foo() {
  console.log(this); //只要独立调用 this -> window
}

//父函数是有能力决定子函数的this指向的
function bar(fn) {
  //1.bar()执行内部产生this指向
  //2.fn形参在预编译时有赋值的过程 fn: obj.foo
  console.log(this);
  //3.foo() -> fn()独立调用执行
  // fn();
  //4.强行改变this指向
  // fn.call(obj); //this -> obj
  //5.还可以new 来改变this指向
  // new fn(); //this -> foo
  //6.还可以这样强行改变this指向
  // fn.bind(obj)(); //this -> obj
}

var obj = {
  a: 2,
  foo: foo
}

//obj.foo理解为持有foo引用地址的变量
bar(obj.foo);
//高阶函数里面参数的this
//api接口中指明的
var arr = [1, 2, 3];
arr.forEach(function (item, idx, arr) {
  //这里的this由谁来决定?
  console.log(this); //window
});

arr.sort(function (a, b) {
  console.log(this);
  return a - b;
});

var t = setInterval(function () {
  console.log(this);
})
clearInterval(t);
//3.显示绑定: call/apply/bind
var obj = {};

//call/apply/bind使用和传参
//关于call/apply第一个参数默认绑定为window对象
//如果绑定原始值会返回包装类
obj.foo(1, 2, 3);
bar.call(obj, 1, 2, 3);
bar.apply(obj, [1, 2, 3]);
bar.bind(obj)(1, 2, 3);
//4.new绑定 
function Person() {
  // var this = {};
  // this.a = 1;
  // //这里的this实际上是函数实例化之后返回的结果
  // return this;
  return 1;
}
//this -> person
var person = new Person();
```

练习题：

```js
var name = '222';
var a = {
  name: '111',
  say: function () {
    console.log(this.name);
  }
}
var fun = a.say;
fun(); //222
a.say(); //111
```

关于优先级：

```js
//显示绑定vs隐式绑定,谁优先级更高?
function foo() {
  console.log(this.a);
}

var obj1 = { a: 2, foo: foo }
var obj2 = { a: 3, foo: foo }

obj1.foo(); //2
obj2.foo(); //3

//call能更改this的指向,说明显示比隐式绑定优先级更高
obj1.foo.call(obj2); //3
obj2.foo.call(obj1); //2
//new绑定vs显示绑定,谁优先级更高?
//new更高
function foo(b) {
  this.a = b;
}
var obj1 = {};
var bar = foo.bind(obj1);
bar(2);
console.log(obj1.a); //2
var baz = new bar(3);
console.log(obj1.a); //2
console.log(baz.a); //3
//关于箭头函数
function foo() {
  console.log(this); //obj -> obj.foo()

  //子函数默认独立调用指向window
  function test() {
    console.log(this); //this
  }
  test();

  //此时可以利用箭头函数让this指向obj
  var test2 = () => {
    //箭头函数内部默认没有this,而是直接拿父函数的this(外层函数的作用域的this)
    console.log(this); //obj
  }
  test2();
}
var obj = { a: 1, foo: foo }

obj.foo();
```

全部绑定规则对箭头函数更改`this`的方法不适用，箭头函数中的`this`取决于父函数中`this`的指向。

```js
//尝试更改箭头函数的this指向
function foo() {
  console.log(this);
  var test = () => {
    console.log(this);
  }
  return test;
}
var obj1 = { a: 1, foo: foo }
var obj2 = { a: 2, foo: foo }
var obj3 = { a: 2, foo: () => { console.log(this); }
}
//默认绑定规则(独立调用 对箭头函数无效)
obj1.foo()(); //this -> obj

//隐式绑定规则(对象调用 对箭头函数无效)
obj3.foo(); //this -> window

//显示绑定规则(对箭头函数无效)
//foo()执行完返回test, test.call(obj2)
//如果call生效指向obj2
var bar = foo().call(obj2); //this -> window

//new绑定规则(对箭头函数无效) 不能实例箭头函数
var foo = () => {
  console.log(this);
}
new foo(); //报错 没有constructor
```

**应用场景：**

```js
var name = 'window';
var obj1 = {
  name: '1',
  fn1: function () {
    console.log(this.name);
  },
  fn2: () => console.log(this.name),
  fn3: function () {
    return function () {
      console.log(this.name);
    }
  },
  fn4: function () {
    return () => console.log(this.name);
  }
}
var obj2 = { name: '2' };

//对象调用 谁调用指向谁
obj1.fn1(); //this -> obj1
//改变调用对象
obj1.fn1.call(obj2); //this -> obj2

//对象的箭头函数内部不存在this找父作用域的this
obj1.fn2(); //this -> window
//箭头函数不适用显示调用规则 无效 this原本是什么就是什么
obj1.fn2.call(obj2); //this -> window

//独立调用 指向window
obj1.fn3()(); //this -> window
//显形规则生效 改变指向
obj1.fn3().call(obj2); //this -> obj2
//外层改变指向,但是内层自己独立调用 所以指向window
obj1.fn3.call(obj2)(); //this -> window

//箭头函数内部不存在this找父作用域fn4,而fn4是通过对象obj1调用
obj1.fn4()(); //this -> obj1
//箭头函数内部不存在this找父作用域fn4,而fn4是通过对象obj1调用
//这里call改变的是箭头函数指向但不生效
obj1.fn4().call(obj2); //this -> obj1
//箭头函数内部不存在this找父作用域fn4,而fn4是通过对象obj1调用但fn4被改变指向为obj2
//这里call改变的是fn4指向生效
obj1.fn4.call(obj2)(); //this -> obj2
```









## bind/call/apply

```js
function test() {
  console.log('a');
}
//系统隐式调用call()
test.call(); //a
```

`call()`和`apply()`的作用改变`this`的指向。

被借用方法的函数名`.call/apply`(目标函数内部/`this`, 参数)写法：

```js
function Car(brand, color) {
  this.brand = brand;
  this.color = color;
  this.run = function () {
    console.log('running');
  }
}

var newCar = { displacement: '2.5' };
var newCar2 = {};
//实现newCar有Car里所有的属性跟方法
//Car.call(对象, 参数1, 参数2, ...)
Car.call(newCar, 'benz', 'red');

//Car.apply(对象, []) //arguments
Car.apply(newCar2, ['benz', 'red']);

console.log(newCar);
//{displacement: "2.5", brand: "benz", color: "red", run: ƒ}
console.log(newCar2);
//{brand: "benz", color: "red"}

//call()/apply()还不会影响已有属性和方法
var car = new Car('mazda', 'grey');
console.log(car);
//Car {brand: "mazda", color: "grey"}
```

**案例：计算器(借用方法)**

多人协作

```js
function Compute() {
  this.plus = function (a, b) { console.log(a + b); }
  this.minus = function (a, b) { console.log(a - b); }
}

function FullCompute() {
  Compute.apply(this);
  this.mul = function (a, b) {
    console.log(a * b);
  }
  this.div = function (a, b) {
    console.log(a / b);
  }
}

//借用Compute里面的方法
var compute = new FullCompute();
compute.plus(1, 2); //3
compute.minus(1, 2); //-1
compute.mul(1, 2); //2
compute.div(1, 2); //0.5
```



**`bind`和`call`区别：**

- `bind`改变`this`指向后返回一个新的函数不执行。
- `call/apply`改变`this`指向并立即执行。

```js
p1.play.call(p2,'男',20);
p1.play.apply(p2,['男',20]);
p1.play.bind(p2,'男',20)();
//类似写法
var fn = p1.play.bind(p2,'男',20);
fn();
```



## 重写

`bind`重写：

```js
//bind特性：
//1.不执行
//2.实例化时失效
var p = { age: 18 }

function Person() {
  console.log(this);
  console.log(this.age);
}

//函数内部this默认指向window
// Person(); window undefined

//改变this指向为p对象
// Person.call(p); {age: 18} 18
// Person.apply(p); {age: 18} 18
// Person.bind(p)(); {age: 18} 18

//p对象并不是构造函数所以报错
// var person = Person.call(p);
// new person(); Uncaught TypeError: person is not a constructor

//因为bind返回的是一个未执行的函数
//所以实例化后bind失效了(new会生成自己的this)所以是undefined
// var person = Person.bind(p);
// new person();
//重写bind
var p = { age: 18 }

function Person(name1, name2) {
  console.log(this);
  console.log(this.age);
  console.log(name1, name2);
}

//更改this指向原理：其实是更改执行期上下文 context
Function.prototype.myBind = function (context) {
  //2.但是函数内部this指向window,所以_self保存内部this指向
  var _self = this,
    //arguments -> context 
    //从第1位(忽略第0位arguments)开始复制参数
    //返回一个数组 -> ['andy','lucy']
    args = Array.prototype.slice.call(arguments, 1),
    //利用圣杯模式解决同一引用被修改时影响结果
    temFn = function () {};

  /**
   console.log(_self);
   * ƒ Person() {
   *   console.log(this);
   *   console.log(this.age);
   * }
   */

  //3.传参问题：
  //如何实现两种写法？
  //写法一：
  //绑定时一起传参
  //Person.bind(p, 'andy');

  //写法二：
  //执行时才传参
  //var p = Person.bind(p, 'andy');
  //p('andy');

  //1.因为不执行，所以返回一个新的函数出去
  return function () {
    //找到该函数里所有的实参数组列表
    //newArgs 是空的数组
    var newArgs = Array.prototype.slice.call(arguments);

    // console.log(args, newArgs);
    // ['andy','lucy'] []

    // console.log(this, _self);
    //this -> 实例化的对象
    //_self -> 构造函数Person函数本身

    //参数1：执行期上下文传入
    //参数2：把新旧参数拼接一起,追加新传入的数组元素

    //如何实现实例化后bind失效的问题？
    //实现方法：为了使实例化对象this是构造函数构造出来的
    //原理：将实例化后的原型引用直接赋值给fn函数原型，并判断即可
    var fn = function () {
      //判断：实例化对象this是否构造函数构造出来的
      //那么：是的话实例化对象就为实例化对象,不是就为context上下文
      _self.apply(this instanceof _self ? this : context, args.concat(newArgs));

    }

    temFn.prototype = this.prototype;
    fn.prototype = new temFn();
    return fn;
  }
}

// Person.myBind()(); window undefined
// Person.myBind(p)(); {age: 18} 18
// var p = Person.bind(p, 'andy', 'lucy')(); andy lucy
```



## 链式调用

实现链式调用。

```js
var sched = {
  wakeup: function () {
    console.log('Running');
    //this -> sched
    return this;
  },
  morning: function () {
    console.log('Going shopping');
    return this;
  },
  noon: function () {
    console.log('Having a rest');
    return this;
  },
  afternoon: function () {
    console.log('Studying');
    return this;
  },
  evening: function () {
    console.log('walking');
    return this;
  },
  night: function () {
    console.log('Sleeping');
    return this;
  }
}

sched.wakeup().morning().noon().afternoon().evening().night()
```