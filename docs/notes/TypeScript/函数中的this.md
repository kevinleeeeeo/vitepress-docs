## 函数中的`this`

在`TS`的类型检查中，对`this`也是有支持的。

## 指向问题
```ts
const obj = {
  name: 'obj',
  getName() {
    //this 指向对象obj
    return this.name;
  }
}
```
严格模式下，`this`的指向是`undefined`的。
```ts
const obj = {
  name: 'obj',
  getName: () => {
    //报错 类型 globalThis 没有 index 签名
    //这里的this具有globalThis的类型 
    return this.name;
  }
}
```

## 类的问题
在`TS`中，类中的函数表达式是不进行`this`的类型注解的。
```ts
//ES6 写法
class Test {
  a = 1;
  getA1(){ console.log(this) };
  //报错
  //TS在函数表达式中不会对this进行注解
  getA2 = function(){ console.log(this) }; 
  getA3 = () => { console.log(this) };
}

//编译后的ES5写法
class Test {
  //instance
  constructor() {
    this.a = 1;
    this.getA2 = function(){ console.log(this) }
    this.getA3 = () => { console.log(this) }
  }

  //prototype
  getA1(){ console.log(this) };
}
```

## 执行环境
当一个引用赋值给一个全局变量时，`this`指向会有变化的，上下文执行期会决定`this`的指向的。
```ts
const obj = {
  a: 1,
  getA(){ console.log(this) }
}

const fn = obj.getA;
fn(); //可以执行但this的指向是不稳定的 会有报错
```
如何让以上写法具有类型检查？
```ts
interface IObj {
  a: number;
  //可以给函数指定this 并指向IObj
  getA(this: IObj): void;
}

const obj: IObj = {
  a: 1,
  getA(){ console.log(this) }
}

const fn = obj.getA; 
//此时fn会报错
//The 'this' context of type 'void' is not assignable to method'getA'
//getA的this和fn的this是不一样的
fn();
```

## `ES5`构造函数的问题
在`TS`中是不支持`ES5`构造函数的定义的。
```ts
function Test(a: number){
  //此时this报错 
  //'this' implicitly has type 'any' because it does not have a type annotation.
  //原因是没有给this进行注解，没有签名
  this.a = a;
}

//包括此时实例化构造器函数时也会出现报错
//'new' expression, whose target lacks a construct signature, implicitly has an 'any' type.
//不认为Test为一个构造器
new Test(1);
```

必须手动的定义一个构造器函数签名。
```ts
//定义实例的接口
interface ITest {
  a: number;
  getA(): void;
}

//定义构造器接口
interface ITestConstructor {
  new(a: number): ITest;
  prototype: ITest;
}

//定义ES5写法的构造器必须指定构造器接口
//此时直接指定接口会出现报错
//类型"(this: ITest, a: number) => void" 到类型 "ITestConstructor" 的转换可能是错误的，因为两种类型并不能充分重叠。
// const Test = function(this: ITest, a: number){} as ITestConstructor;

//解决写法是让类型"(this: ITest, a: number) => void" 转为 unknown 类型 再转为 ITestConstructor 类型
const Test = (function(this: ITest, a: number){
  this.a = a;
} as unknown) as ITestConstructor;

Test.prototype.getA = function(){ console.log(this.a) }

const test = new Test(1);
test.getA() //通过
```