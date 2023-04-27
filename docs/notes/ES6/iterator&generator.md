# `iterator`&`generator`

## `iterator`

迭代器基于数据抽取，有序和连续的消耗数据的模式。迭代器接口一般会返回一个迭代器对象。迭代器对象里面有一个`next()`方法。根据遍历的索引长度去决定返回的对象内容，如`{ value: xxx, done: false }`。

```js
function makeIterator(arr){
  var nextIndex = 0;
  return {
    next(){
      if(nextIndex < arr.length){
        return { value: arr[nextIndex++], done: false }
      }
      return { value: undefined, done: true }
    }
  }
}
var it =makeIterator(['a', 'b']);
console.log(it.next()); //{value: 'a', done: false}
console.log(it.next()); //{value: 'a', done: false}
console.log(it.next()); //{value: undefined, done: true}
```

在后端中的内部迭代器指的是一个系统内部定义好的规则函数。外部迭代器指的是像上面的写法是手动定义部署的迭代器接口。

因为对象不具备迭代器接口，部署迭代器方式生成一个外部迭代器便于`for of`遍历。

```js
let obj = {
  start: [1, 2, 3],
  end: [7, 8, 9],
  [Symbol.iterator]() {
    var nextIndex = 0,
      arr = [...this.start, ...this.end],
      len = arr.length;
    return {
      next() {
        if (nextIndex < len) {
          return {
            value: arr[nextIndex++],
            done: false
          }
        } else {
          return { value: undefined, done: true }
        }
      }
    }
  }
}

for (let i of obj) { console.log(i); }
```

对象身上不具备迭代器接口的原因是因为对象上键值对成员是无序的。

```js
let map = new Map([
  ['a', 1],
  ['b', 2]
]);
for (let i of map) { console.log(i); }
//["a", 1] ["b", 2]
```

有时候后端传的数据具备迭代器接口可以进行`for..of`遍历，但是万一数据里有对象就不能进行`for..of`遍历，利用`map`特性部署迭代器接口让对象也像`Map`数据结构一样具有迭代器接口。可以实现对象也可以进行`for..of`遍历。

```js
let obj = {
  a: 1,
  b: 2,
  c: 3,
  [Symbol.iterator]() {
    let nextIndex = 0;
    let map = new Map();
    for (let [key, value] of Object.entries(this)) {
      // console.log(key, value); //a 1  b 2  c 3
      map.set(key, value); //重组map
    }
    // console.log(map);
    //{"a" => 1, "b" => 2, "c" => 3}

    //将map转换为key和value组成的数组以便于拿到length属性
    //把具有迭代器对象的map展开并存入数组
    let mapEntries = [...map.entries()];
    // console.log(mapEntries);
    //[['a', 1], ['b', 2], ['c', 3]]

    //部署iterator接口
    return {
      next() {
        if (nextIndex < mapEntries.length) {
          return {
            value: mapEntries[nextIndex++],
            done: false
          };
        } else {
          return { value: undefined, done: true };
        }
      }
    }
  }
}

for (let i of obj) { console.log(i); }
//["a", 1] ["b", 2] ["c", 3]
```

**默认调用`iterator`接口的场合：**

- `...`拓展运算符
- `for of`
- `Array.from()`
- `map`
- `set`
- `Promiss.all()`
- `yeild`



## `generator`

生成器`generator`函数语法。作用是访问迭代器对象，返回值是迭代器对象。

```js
function* test(){}
```

只要执行生成器函数就会生成一个迭代器对象。

```js
function* test() {}
console.log(test());

/**
 * 生成跟迭代器对象里具有next()方法的对象
 * test {<suspended>}
 *   __proto__: Generator
 *     __proto__: Generator
 *     constructor: GeneratorFunction {...}
 *     next: ƒ next(),
 *     return: ƒ return(),
 *     throw: ƒ throw()
 */
```

生成器函数一定要和`yeild`结合使用，可以自定义产出内容和返回值，用法和迭代器有点像`yeild`：产出的意思，产出的同时暂停程序向下执行。

```js
function* test() {
  yield 'a';
  yield 'b';
  yield 'c';
  return 'd';
}

let iter = test();
console.log(iter.next()); //{value: "a", done: false}
console.log(iter.next()); //{value: "b", done: false}
console.log(iter.next()); //{value: "c", done: false}
console.log(iter.next()); //{value: "d", done: true}
```

迭代器接口迭代`yeild`所产出的值。

```js
function* test() {
  console.log(0); //0
  yield 'a'; 
  console.log(1);  //1
  yield 'b'; 
  console.log(2); //2
  yield 'c'; 
  console.log(3); //3
  return 'd'; 
}

let iter = test();
console.log(iter.next()); //{value: "a", done: false}
console.log(iter.next()); //{value: "b", done: false}
console.log(iter.next()); //{value: "c", done: false}
console.log(iter.next()); //{value: "d", done: true}

//执行顺序 
//0 
//{value: "a", done: false} 
//1 
//{value: "b", done: false}
//2
//{value: "c", done: false}
//3
//{value: "d", done: true}
```

`yeild`和`return`本质的区别：

- `yeild`暂停，找上一次暂停的位置，有记忆功能。
- `return`结束程序执行。

`yeild`具有暂停功能，暂停时不会往下执行带，且`yeild`本身并不产出值。

```js
function* test() {
  //第一次next()执行，产出{value: "a", done: false}, 并暂停不往下执行
  let a = yield 'a'; 
  //第二次next()执行，产出{value: "undefined", done: true} 由于next()没传参数，a为undefined
  console.log(a); //undefined
}
let iter = test();
console.log(iter.next());
console.log(iter.next());
//执行顺序
//{value: "a", done: false}
//undefined
//{value: "undefined", done: true}
```

如果想要`yeild`产出值，可以在`next()`执行时传参。

```js
console.log(iter.next(10)); 
//10 {value: "b", done: false}
```

`next()`传值问题蛇形传值方式。`next()`方法执行的返回值是`yeild`产出的值，`yeild`的返回值是`next()`方法传入的参数。

```js
function* foo() {
  let value1 = yield 'first';
  console.log(value1); //第2次传参
  let value2 = yield 'second';
  console.log(value2); //第3次传参
}

let iter = foo();
console.log(iter.next('第1次传参')); //第1次传参并不会打印
//{value: 'first', done: false}
console.log(iter.next('第2次传参')); 
//{value: 'third', done: false}
console.log(iter.next('第3次传参')); 
//{value: 'third', done: false}

//执行顺序
//{value: 'first', done: false}
//第2次传参
//{value: 'second', done: false}
//第3次传参
//{value: undefined, done: true}
```

优化对象迭代器的函数。

```js
let obj = {
  start: [1, 2, 3],
  end: [7, 8, 9],
  [Symbol.iterator]: function* () {
    var nextIndex = 0,
      arr = [...this.start, ...this.end],
      len = arr.length;

    while (nextIndex < len) {
      yield arr[nextIndex++]; //产出值
    }
  }
}

for (let i of obj) {
  console.log(i); //1 2 3 7 8 9
}
```

利用生成器函数优化代码。有一个`read`方法直接读取异步操作。

```js
function promisify(fn) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      fn(...args, (err, data) => {
        if (err) { reject(err); } else {
          resolve(data);
        }
      });
    });
  };
}

let readFile = promisify(fs.readFile);

function* read() {
  let value1 = yield readFile("./name.txt", "utf-8");
  let value2 = yield readFile(value1, "utf-8");
  let value3 = yield readFile(value2, "utf-8");
}

let iter = read();
//格式：let {value: xx, done: false} = iter.next();
// let { value: value, done: done } = iter.next();
let { value, done } = iter.next();
//进一步调用next(val)拿到第一次的值
value.then((val1) => {
  let { value: done } = iter.next(val1); //next()继续传值
  value.then((val2) => {
    let { value, done } = iter.next(val2);
    value.then((val3) => {
      console.log(val3);
    });
  });
});
```

以上写法过于繁琐，优化提纯一个新的函数，解决链式调用的问题和回调地狱的问题，让其转为单线程的操作。通过生成器的方式实现回调地狱的优化。

```js
function Co(iter) {
  return new Promise((resolve, reject) => {
    let next = (data) => {
      let { value, done } = iter.next(data);
      if (done) { resolve(value); } else {
        value.then((val) => { next(val); });
      }
    };
    next(); //首次执行没有next()参数
  });
}

let promise = Co(read());
promise.then((val) => console.log(val));
```

生成器对象上的`return()`/`throw()`方法。终结迭代的方式，终结遍历这个函数，后面`next`获取的值都为`undefined`。和在生成器函数内部直接`return`的结果一样。调用`return()`之后返回`true`。

```js
function* get() {
  yield 1;
  yield 2;
  yield 3;
}

let h = get();
console.log(h.next()); 
//{value: 1, done: false}
console.log(h.return());
//{value: undefined, done: true}
console.log(h.next()); 
//{value: undefined, done: true}
console.log(h.next()); 
//{value: undefined, done: true}
```

`throw()`必须在`next()`之后执行才能捕获异常，`throw()`也相当于`next()`继续执行迭代`a`，`try...catch`对异步代码不管用。

```js
var g = function* () {
  try { yield; } catch (e) {
    console.log("生成器内部异常：" + e);
  }
};
var i = g();
console.log(i.throw("a")); //无法捕获错误
console.log(i.next());
console.log(i.throw("a")); //捕获成功
```





## `async`/`await`

适用于异步函数的`ES6`语法，本质上也是一个语法糖，来源于生成器函数。具有内置的执行器(`co`函数)，更好的语义，更广的实用性。`async`的返回值是一个`Promise`对象，也有三种状态，每种状态对应每种回调。

尝试异步读取3个没有依赖关系的文件，可以单独进行读取并对其进行异常捕获。假如某个文件读取成功就存入`Set`数据里，没有成功就不存。

```js
async function readAll(){
  let val1, val2, val3;
  let res = new Set();
  try{
    val1 = await readFile('./1.txt');
  }catch(e){}
  try{
    val2 = await readFile('./2.txt');
  }catch(e){}
  try{
    val3 = await readFile('./3.txt');
  }catch(e){}
  res.add(val1);
  res.add(val2);
  res.add(val3);
  return res;
}
readAll().then();
```

以上写法并不太好，使用`Promise.all()`方法较为合适。

```js
let f = Promise.all([
  readFile('./1.txt');
  readFile('./2.txt');
  readFile('./3.txt');
]);
f.then();
```



## 应用

迭代器和生成器的应用，如装饰器，在项目中非常常用的写法。

假如有许多函数如100个并让其顺序执行。先定义一个数组集合，来存放这些函数，然后`for`循环容器，并逐一执行。需求是从某个函数开始暂停不让其执行，如何实现？

可以在每个函数中返回布尔值，如果是`true`，就可以继续执行，否则不能往下执行。

```js
function test1(){ return true; }
function test2(){ return true; }
function test3(){ return false; }

for(let fn of functions){
  if(!fn()){ break; } //跳出循环不执行
}
```

在`koa`服务端中的洋葱模型里的中间件集合，如`[test1, test2, test3, ...]`，在每个`API`执行时需要经过许多的中间件函数。遍历执行这些中间件，但在遍历执行的过程中某个中间件失败时无法正常执行，会阻断后续的中间件的正常执行。此时需要有一种机制去截断，不能让中间件集合继续往下执行。在中间集合的每个函数里都会有一个`next()`的前置条件，只有`next`执行的前提下才能允许下一个中间件的运行。

```js
var functions = [
  function fn1(next){ next(); },
  function fn2(next){ next(); },
  function fn3(next){ next(); }
]
```

在前端也可以实现中间件截断功能。处理一个函数集合，利用生成器和递归来实现只有在中间件函数里定义`next`执行才会继续递归使得`API`正常使用每个中间件程序。

```js
(function (functions) {
  //根据函数集合产出每一个函数
  function* generator(arr) {
    for (var i = 0; i < arr.length; i++) { yield arr[i]; }
  }
  //该递归方法让函数集合中的所有函数都执行
  function nextDo(n) {
    //当前函数test1的执行，并传参，参数为下一个函数test2
    n.value(function () {
      //产出下一个对象如{done: false, value: ƒ test2}
      var n = iterator.next();
      //done为false，还没迭代完毕时继续递归执行 否则中止程序
      if (!n.done) { nextDo(n) } else { return }
    });
  }

  var iterator = generator(functions);
  var init = () => {
    //传入产出的每一个对象如{done: false, value: ƒ test1}
    nextDo(iterator.next());
  };
  init();
})([
  function test1(next) {
    /**
     console.log(next);
     * function () {
         var n = iterator.next();
        if (!n.done) { nextDo(n); } else { return; }
      }
     */
    next();
  },
  function test2(next) { next(); },
  function test3(next) { next(); }
]);
```

利用迭代器的记忆功能实现一个日志打印工具。