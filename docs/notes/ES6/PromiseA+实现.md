# Promise A+

## 概念

不仅是一种异步解决的方案，也是一种规范。了解`promise`流程，并自己实现一个`promise`。

**文档地址：**

https://promisesaplus.com/

## 语法

`Promise`是一个构造函数，需要实例化，参数是一个执行器。当`new`的时候会自动的执行器。

```JS
let promise = new Promise(excutor);
```

执行器函数有`resolve`函数参数和`reject`函数参数。

```js
let promise = new Promise((resolve, reject) => {});
```

`promise.then`方法有两个可选的参数，`onFulfilled`和`onRejected`，均为函数。

```js
promise.then((val) => {}, (err) => {});
```



## 特点

- `promise`是一个对象或一个函数，带有遵守规范的`then`方法。

- `thenable`是一个可往下执行的对象或函数并定义一个`then`方法。

- `value` 值是一个合法的`JavaScript`的值包括`undefined`或`thenable`或新的`promise`对象。

- `exception`是一个值，会抛出一个异常。

- `reason`一个值，指示为什么造成失败或拒绝的值。

  

## 状态

`Promise`有三个状态，等待态`pending`, 满足态`fulfilled`, 拒绝态`reject`。

- `pending`等待态，可变成功状态或失败状态。
- `fulfilled`成功态，只要转了成功态就不能转换为其他状态，必须有值且不能更改。
- `reject`失败态，只要转了失败态就不能转换为其他状态，必须有值且不能更改。

> 注意：`resolve`或`reject`抛出的值浅层是不可改变的，深层可以改变的。如`resolve({ a: 1, b: { c: 3 } })`。

## `then()`

一个`promise`必须提供一个`then()`方法去访问`promise`抛出来的当前值或最终值或原因，`then()`方法接收两个可选的函数`onFullfilled`或`onRejected`作为参数。

这两个参数都必须作为函数去调用(不可用`this`代替)，不能去实例化，除了函数以外的数据都会被忽略掉，如对象会被忽略掉，必须为异步不阻塞程序向下执行。

在成功态或失败态状态时才能执行且只能执行一次。等`resolve()`或`reject()`执行了，转为成功态或失败态之前，`onFullfilled`或`onRejected`函数是不可以调用的。

 `resolve(123)`该传值是` promise.then(res => console.log(res))`里`then()`的第一个参数里函数里的形参。



## 实现一

实现过程一，初始化状态，初始化`resolve`函数，`reject`函数，定义可链式调用的原型上的`then()`方法，实现异常抛出错误的捕获。

```js
//指定状态
const PENDING = 'PENDING';
const FULLFILLED = 'FULLFILLED';
const REJECTED = 'REJECTED';

class MyPromise {
  constructor(executor) {
    //初始化状态
    this.status = PENDING;
    //PENDING状态下，value和reason是不确定的，只有转了成功态或失败态才能确定
    this.value = undefined;
    this.reason = undefined;
    //初始化resolve和reject函数
    const resolve = (value) => {
      //状态转变之前必须是PENDING状态，并且转变之后就固化状态
      if (this.status === PENDING) {
        this.status = FULLFILLED;
        this.value = value;
      }
    };
    const reject = (reason) => {
      if (this.status === PENDING) {
        this.status = REJECTED;
        this.reason = reason;
      }
    };

    try {
      //假如在executor()执行后尝试捕获 在函数内部定义throw new Error()的错误
      executor(resolve, reject);
    } catch (e) {
      //将捕获的异常交给reject()方法去进行捕获
      reject(e);
    }
  }

  //定义可链式调用的then方法
  then(onFullfilled, onRejected) {
    //当成功态时才能执行onFullfilled()方法
    if (this.status === FULLFILLED) {
      onFullfilled(this.value);
    }
    if (this.status === REJECTED) {
      onRejected(this.reason);
    }
  }
}

module.exports = MyPromise;
```

## `thenable`

`then()`方法可以被多次调用，链式调用，调用时里面的函数参数是依次顺序调用。

当`promise`是成功态或失败态的时候，所有各自的`onFulfilled`或者`onRejected`的回调函数`callback`必须按原有的调用顺序来执行，即`then(callback1).then(callback2)`。

## 实现二

在以上简单写法和实现链式调用写法之前，假如在`executor`执行器函数里定义一个异步时，`then`执行时无法获取`value`或者`reason`的值。即当用户在`executor()`函数内部定义异步方法时，异步方法内部的`resolve()`或`rejected()`方法是无法正常使用的。原因是当前状态为`PENDING`，导致后续的`then()`里的回调函数无法正常执行。

```js
let promise = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('setTimeout');
  }, 2000);
}).then(
  (value) => { console.log(value); },
  (reason) => { console.log(reason); }
);

//没有打印结果！
```

为什么遇到异步程序时不打印结果的原因是，`exector`同步执行完毕，状态没有改变(`PENDING`)，导致`then`无法判断走哪个程序所以不打印任何数据。

解决办法是在定义`then`方法时需要在方法内部进行判断，对`PENDING`状态的进行处理，如果程序走到`then`里是`PENDING`状态时，通过发布订阅模式，定义两个容器，分别收集所有的`onFulfilled`或`onRejected`的回调函数(订阅操作)。定义自己的`resolve`函数时，当`resolve()`执行时遍历容器内所有的`onFulfilled`或`onRejected`方法并依次执行(发布操作)，实现异步程序等待时间执行使得`then`获取值。

实现遇到异步程序时会等待执行。

```js
class MyPromise {
  constructor(executor) {
    //初始化收集所有的onFulfilled/onRejected的回调函数的容器
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];
    
    const resolve = (value) => {
      if (this.status === PENDING) {
        this.status = FULFILLED;
        this.value = value;
        //发布
        this.onFulfilledCallbacks.forEach((fn) => fn());
      }
    };
    
    const reject = (reason) => {
      if (this.status === PENDING) {
        this.status = REJECTED;
        this.reason = reason;
        //发布
        this.onRejectedCallbacks.forEach((fn) => fn());
      }
    };
  }

  then(onFulfilled, onRejected) {
    //订阅
    if (this.status === PENDING) {
      //订阅模式：收集所有的onFulfilled/onRejected的回调函数到容器里
      this.onFulfilledCallbacks.push(() => {
        //因为需要传参this.value 所以用函数嵌套的方式写
        onFulfilled(this.value);
      });
      this.onRejectedCallbacks.push(() => {
        onRejected(this.reason);
      });
    }  
  }
}
```

## 返回值

`then()`必须返回一个`new Promise `。

- `onFulfilled`或`onRejected`函数执行完毕返回一个`x`,  即`let x = onFulfilled(value);`。
- `x`有可能是一个需要`resolve()`抛出普通值, 也有可能是一个需要`resolve()`抛出`promise`。
- 无论是成功还是失败的回调遇到抛出异常时，`promise2`里必须执行`reject()`并返回原因。

`resolvePromise`函数是专门处理`onFulfilled`或`onRejected`函数返回值：

- 如果`promise`和`x`指向同一个引用，必须返回一个带有`reject`原因的。`promise`，并报错`TypeError: Chaining cycle detected for pormise`死循环。
- 当`x`是一个对象或函数时：将`then`赋值为`x.then`，执行`then`改变指向为`x `即实例化对象，且带有两个回调函数。
- 当`x`是不是一个对象或函数时：返回普通值。
- `resolve/reject` 只能2选1执行。

## 链式特点

原生`Promise`链式调用的具有几个特点，先预设第一个`promise`会`resolve`一个值。以下特点会按照这次第一个`promise`里`resolve`的值。

```js
let promise = new Promise((resolve, reject) => {
  resolve('first resolve');
});
```

特点1，链式调用`then`时，`resolve`参数在多次`then()`执行的传递中，是通过`return`来传递结果。

```js
promise
  .then((res) => { return res; })
  .then((res) => { console.log(res);  //first resolve });
```

特点2，当传递普通值时，通过新的`promise`包装并去`resolve`传递的普通值。下一次`then`会拿到上一次`resolve`过来的值。

```js
promise
  .then((res) => { return res; })
  .then((res) => {
    return new Promise((resolve, reject) => {
      resolve(res);
    });
  })
  .then((res) => { console.log(res);  }); //first resolve
```

当传递普通值时，通过新的`promise`里的异步程序去`resolve`传递的普通值。会等待异步程序时间到达后拿到上一次`resolve`过来的值。

```js
promise
  .then((res) => { return res; })
  .then((res) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(res);
      }, 2000);
    });
  })
  .then((res) => { console.log(res); //等待2秒, first resolve });
```

特点3，当传递普通值时，通过新的`promise`去`reject`原因。下一次`then`的`onRejected`函数内会拿到上一次`reject`过来的值。

```js
promise
  .then((res) => { return res; })
  .then((res) => {
    return new Promise((resolve, reject) => {
      reject('This is a error');
    });
  })
  .then((reason) => {
    console.log(reason); 
    //报错 UnhandledPromiseRejectionWarning: This is a error
  });
```

特点4，即使上次走了`reject`并返回原因，但是继续`then`时，虽然`onRejected`函数内可以拿到上次的`reject`原因，但此时如果`return`的值会被下一次`then`的`reFulfilled`函数拿到，默认返回`undefined`。

```js
promise
  .then((res) => { return res; })
  .then((res) => {
    return new Promise((resolve, reject) => {
      reject('This is a error');
    });
  })
  .then(
    (res) => { console.log('111', res) //没有打印 },
    (reason) => {
      console.log('222', reason); //222 This is a error
      return '这次的结果会被下一次then的resolve拿到';
      //默认return undefined
    })
  .then(
    (res) => {
      console.log('333', res); 
      //333 这次的结果会被下一次then的resolve拿到
    },
    (reason) => { console.log('444', reason);  } //没有打印
  );
```

特点5，在`resolve`里试图抛出异常，结果是在下一个`then`的`onRejected`函数里报错并打印错误原因。

```js
promise
  .then((res) => { return res; })
  .then((res) => { throw new Error('Throw error'); })
  .then(
    (res) => { console.log('111', res); //没有打印 },
    (reason) => {
      console.log('222', reason);
      //报错 222 Error: Throw error
    }
  );
```

特点6，用`catch`可以捕获异常。

```js
promise
  .then((res) => { return res; })
  .then((res) => { throw new Error('Throw error'); })
  .catch((reason) => { 
    console.log(reason); //Error: Throw error
  });
```

特点7，`onRejected`和`catch`同时存在时，仅在上一次`then`里`onRejected`里打印错误信息。找最近失败的回调函数。

```js
promise
  .then((res) => { return res; })
  .then((res) => { throw new Error('Throw error'); })
  .then(
    (res) => {},
    (reason) => {
      console.log('111', reason);
      //报错打印 111 Error: Throw error
    })
  .catch((reason) => { console.log('222', reason); //没有打印 });
```

特点8，`catch`后面的`then`还是可以继续执行`onFulfill`函数并获取`catch`返回的值。

```js
promise
  .then((res) => { return res; })
  .then((res) => { throw new Error('Throw error'); })
  .catch((reason) => {
    console.log(reason); //Error: Throw error
    return '这里的返回的内容会被then的onFulfill打印';
  })
  .then((res) => {
    console.log(res);
    //打印 '这里的返回的内容会被then的onFulfill打印'
  });
```

以下两种写法是有区别的，赋值方式的不同导致写法1是有两次返回结果，而写法2只有一次返回结果。

```js
//写法1
let promise2 = promises.then((value) => {
  //返回第一次的结果
}).then((value) => {
  //返回第二次的结果
});

//写法2
let promise2 = promises.then((value) => {});
promise2.then((value) => {});
```

**特性总结：**

1. `catch`在`Promise`的源码层面上就是一个`then`， `catch`也是遵循`then`的运行原则。
2. 成功的条件是`then`里`return `一个普通的`JavaScript`值。`then`里`return `一个新的`promise`成功态的结果。
3. 失败的条件是`then`里`return`一个新的`promise`失败态的原因。`then`里`throw`抛出了异常 。
4. `promise`链式调用的原理是返回了一个新的`new Promise` ，`then`不具备`this`。



## 实现三

以下两种写法得到的结果一样，每次`then`调用都会返回一个`new Promise`。也可以通过构造函数上的`resolve`方法抛出值给下一个`then`的`onFulfill`获取。

```js
let promise1 = new Promise((resolve, reject) => {
  resolve('promise1');
});

//写法1
let promise2 = promise1
  .then((value) => { return value; })
  .then((value) => {  console.log(value); //打印promise1 });

//写法2
let promise2 = promise1
  .then((value) => { return Promise.resolve(value); })
  .then((value) => { console.log(value); //打印promise1 });
```

解决`Promise`链式调用的实现。`then`方法内部必须返回一个`new Promise`，且`onFulfill`和`onReject`函数也必须返回一个`x`的值，该值有可能是普通值，也有可能是一个`promise`实例。保存`x`的值的原因是得对这两种情况进行不同的处理。情况1，普通值时直接`return`，情况2，`promise`实例时通过`resolve`函数抛出。

假如`then`内部抛出异常`new Error`，如何实现在下一个`then`中捕获。

```js
then(onFulfilled, onRejected) {
  let promise2 = new MyPromise((resolve, reject) => {
    if (this.status === FULFILLED) {
      try { let x = onFulfilled(this.value); } 
      catch (e) { reject(e); }
    }
  }
}
```

一个函数`resolvePromise`专门来处理`x`，`PromiseA+`规范中，声明了`onFullfilled()`必须是一个异步的函数，避免阻塞后续程序，并且`promise2`确保有返回值(`onRejected`同理)。定义一个`setTimeout()`宏任务方法可以实现函数异步化，还能让`setTimeout()`的回调函数往后再执行，此时可以拿到外部的`promise2`对象。

关于参数`promise2`，是一个被抛出的`promise2`的成功失败败是未知的。参数`x`，返回的值有可能是普通值或`promise`。参数`resolve`和`reject`，因为外部无法访问内部所以需传入。

```js
then(onFulfilled, onRejected) {
  let promise2 = new MyPromise((resolve, reject) => {
    if (this.status === FULFILLED) {
      setTimeout(() => {
        try {
          let x = onFulfilled(this.value);
          resolvePromise(promise2, x, resolve, reject); 
        } 
        catch (e) { reject(e); }
      }, 0);
    }
  }
}
```



## 实现四

主要通过`resolvePromise()`方法实现规范中对`promise`的一系列[处理流程](https://promisesaplus.com/#the-promise-resolution-procedure)。在规范里，假如以下写法会导致错误，并报错`TypeError: Chaining cycle detected for pormise`。

```js
let promise2 = promise1.then(() => {
  return promise2; //这里返回promise2理应报错死循环
}, (reason) => { return reason; });
```

需要实现同样的报错的写法是对`x`参数进行判断处理，如果`promise`和`x`指向同一个引用，必须返回一个带有`reject`原因的`promise`。

```js
//实现报错：
function resolvePromise(promise2, x, resolve, reject) {
  if (x === promise2) {
    return reject(
      new TypeError('Chaining cycle detected for pormise')
    );
  }
}
```

实现写法是`then`里`onFulfilled`函数内部返回值为一个错误异常时。

```js
let promise2 = promise1.then(
  (value) => {
    return new Error('测试then里onFulfilled异常抛出');
  },
  (reason) => { return reason; }
);
```

实现写法是`then`里`onFulfilled`函数内部返回值为一个`promise`时。

```js
let promise2 = promise1.then(
  (value) => { return '这是普通值'; },
  (reason) => { return reason; }
);
```

实现写法是`then`里`onFulfilled`函数内部返回值为一个普通值时。

```js
let promise2 = promise1.then(
  (value) => {
    return Promise.resolve('这是resolve包装过的promise');
  },
  (reason) => { return reason; }
);
```

实现写法是`then`里`onFulfilled`函数内部返回值为一个`new Promise`时，抛出`resolve`结果。

```js
let promise2 = promise1.then(
  (value) => {
    return new MyPromise((resolve, reject) => {
      resolve('new Promise resolve');
    });
  },
  (reason) => { return reason; }
);
```

实现写法是`then`里`onFulfilled`函数内部的异步程序里返回值为一个`new Promise`时，抛出`resolve`结果。

```js
let promise2 = promise1.then(
  (value) => {
    setTimeout(() => {
      return new MyPromise((resolve, reject) => {
        resolve('new Promise resolve');
      });
    }, 0);
  },
  (reason) => { return reason; }
);
```

实现写法是`then`里`onFulfilled`函数内部的异步程序里返回值为一个`new Promise`时，抛出`resolve`结果，但结果是一个`new Promise`多层嵌套时。

```js
let promise2 = promise1.then(
  (value) => {
    setTimeout(() => {
      return new MyPromise((resolve, reject) => {
        resolve(new MyPromise((resolve, reject) => {
          resolve('sub new Promise resolve');
        }));
      });
    }, 0);
  },
  (reason) => { return reason; }
);
```

假如`x`是一个对象或者是函数时，需要让其成为一个`promise`或是一个对象(规范)。判断`then`的类型是一个函数时可以认定它为一个`Promise`并执行`then`传入`onFulfilled`和`onRejected`函数，不是时则为一个普通值并`resolve(x)`抛出。

```js
//返回普通值或promise
function resolvePromise(promise2, x, resolve, reject) {
  let called = false; //resolve/reject 只能2选1执行
  //当x是对象或函数时
  if (typeof x === 'object' && x !== null || typeof x === 'function') {
    try { //排除异常
      let then = x.then;
      if (typeof then === 'function') {
        then.call(x, (y) => { //更改this指向当前实例
          if (called) return; //如果调用过了，中止
          called = true; 
          //多层嵌套时需要递归
          resolvePromise(promise2, y, resolve, reject);
        }, (r) => {
          if (called) return;
          called = true;
          reject(r); 
        });
      } else { resolve(x); }
    } catch (e) {
      if (called) return;
      called = true;
      reject(e);
    }
  } else { resolve(x); }
}
```

实现`then().then().then()... `链式调用时传入默认值`onFulfilled`，`onRejected`没有参数可以穿透执行得到结果。根据是否为函数来设定一个默认值。`onFulfilled`是函数则赋值为`value`，`onRejected`是函数时赋值为`reason`，否则抛出错误。

```js
then(onFulfilled, onRejected) {
  onFulfilled = typeof onFulfilled === 'function' 
    ? onFulfilled : value => value;
  onRejected = typeof onRejected === 'function' 
    ? onRejected : reason => {
    throw reason
  };
  ...
}
```

实现` catch()`语法时也能拿到错误原因。跟`then`几乎一样，但第一个参数是`null`不用填，说明`catch`只是`then`的一个语法糖。

```js
catch (errorCallback) {
  return this.then(null, errorCallback);
}
```

## `BUG`

解决`then`获取结果是一个`pending`状态的实例的问题，原因是实例里的`resolve`方法执行时在`pending`的状态就开始进行发布操作，该操作会使`onResolveCallbacks`队列容器里的所有方法马上执行，导致状态并没有从`pending`更改为`fulfilled`。

```js
const p = new MyPromise((resolve, reject) => {
  resolve(
    new MyPromise((resolve, reject) => {
      setTimeout(() => {
        resolve('The answer has been come out.');
      }, 2000);
    })
  );
});

p.then((res) => { console.log(res); });
//返回的是一个MyPromise实例
```

解决方案是等待状态状态才拿`value`，在`resolve`方法里，如果`value`是`MyPromise`构造出来，证明是一个`promise`，可以执行`then`方法获取修改状态后的`value`，并递归再次`resolve`抛出。

```js
class MyPromise {
  constructor(excutor) {
    ...
    const resolve = (value) => {
      if (value instanceof MyPromise) {
        value.then((res) => { resolve(res); }, reject);
        return;
      }
      ...
    };
  }
}
```



## `Promise.resolve()`

实现`resolve`和`reject`的静态方法。

```js
//实现
class MyPromise {
  ...
  static resolve(value) {
    return new MyPromise((resolve, reject) => {
      resolve(value);
    });
  }

  static reject(error) {
    return new MyPromise((resolve, reject) => {
      reject(error);
    });
  }
}
```





## `Promise.all()`

是一个静态方法，通过`readFile API` 读取多个文件，会存在嵌套的问题，且代码不内聚。

```js
readFile('./data1.json').then((res) => {
  dataArr.push(res);
  
  readFile('./data2.json').then((res) => {
    dataArr.push(res);
    ...
  });
});
```



`Promise.all()`方法可以解决上述问题。

```js
Promise.all(
  [
    1, //普通值直接处理
    readFile('./data1.json'), //promise走promise程序
    readFile('./data2.json'),
  ]
).then((res) => {
  console.log(res);
});
```

原理是遇到普通值直接处理 ，遇到`promise `走`promise`程序 `resolve/reject`， 弊端是单一遇到错误，不会返回结果，只有数组中的每一个`promise`必须全部成功才能返回结果。



重写`Promise.all()`静态方法

```js
class MyPromise {
  ...
  static all(promiseArr) {
    let resArr = [],
      idx = 0;

    return new MyPromise((resolve, reject) => {
      promiseArr.map((promise, index) => {
        if (isPromise(promise)) {
          promise.then((res) => {
            formatResArr(res, index, resolve);
          }, reject);
        } else { formatResArr(res, index, resolve); }
      });
    });

    function formatResArr(value, index, resolve) {
      resArr[index] = value;

      //这里idx自增 是为了防止有异步promise返回时间不确定，也有可能出现并发的情况
      if (++idx === promiseArr.length) {
        resolve(resArr);
      }
    }

    function isPromise(x) {
      if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
        let then = x.then;
        return typeof then === 'function';
      }
      return false;
    }
  }
}
```



## `Promise.allSettled()`

类似`Promise.all()`方法，返回的是多个`promise`集合的数组结果，但区别于的是，它可以返回错误和成功的结果。

```js
Promise.allSettled([p1,p2].then((res) => {
  console.log(res);
}))

//打印
[
  { status: 'fulfilled', value: 'success' },
  { status: 'rejected', value: 'error' }
]
```



重写`Promise.allSettled()`静态方法

```js
class MyPromise {
  ...
    static allSettled(promiseArr) {
    let resArr = [],
      idx = 0;

    //判断promiseArr是否是可迭代对象
    if (!isIterable(promiseArr)) {
      throw new TypeError('MyError: ' + promiseArr + '  is not iterable (cannot read property Symbol(Symbol.iterator))');
    }

    return new Promise((resolve, reject) => {
      //如果第一个参数为空的情况
      if (promiseArr.length === 0) { resolve([]); }

      promiseArr.map((promise, index) => {
        if (isPromise(promise)) {
          promise.then((value) => {
            formatResArr('fulfilled', value, index, resolve);
          }, (reason) => {
            formatResArr('rejected', reason, index, resolve);
          })
        } else {
          formatResArr('fulfilled', promise, index, resolve);
        }
      });
    });

    function formatResArr(status, value, index, resolve) {
      //status -> 成功/失败
      switch (status) {
        case 'fulfilled':
          resArr[index] = { status, value }
          break;
        case 'rejected':
          resArr[index] = { status, reason: value }
          break;
        default:
          break;
      }

      if (++idx === promiseArr.length) { resolve(resArr); }
    }
    
    function isIterable(value) {
      return value !== null 
        && value !== undefined 
        && typeof value[Symbol.iterator] === 'function';
    }
  }
}
```



## `Promise.race()`

谁先有结果，得到先到的结果。

```js
let p1 = new Promise((resolve, reject) => {
  resolve('success');
});
let p2 = new Promise((resolve, reject) => {
  reject('error');
});

//Promise.race(可迭代的对象或数组)
Promise.race([p1, p2, 'other']).then((res) => {
  console.log(res);
});
```

实现

```js
My Promise{
  ...
  static race(promiseArr){
    return new MyPromise((resolev, reject) => {
      promiseArr.map((promise) => {
        if(isPromise(promise)){
          //直接then 拿到resolve/reject结果
          promise.then(resolve, reject);
        }else{
          //普通值直接抛出
          resolve(promise);
        }
      });
    });
  }
}
```







## `Promise.finally()`

`finally()`方法可以优于`then()`或`catch()`方法执行，并且回调参数是没有意义的，不依赖参数向后传递给`then()`或`catch()`方法。

```JS
Promise.resolve('promise success')
  .finally((res) => console.log('finally', res)) //此处参数无意义
  .then(
    (res) => console.log('success:' + res), 
    (err) => console.log('error:' + err)
  );
//print 
//finally undefined
//success:promise success
```

```js
Promise.reject('promise error')
  .finally((res) => console.log('finally', res)) //此处参数无意义
  .then(
    (res) => console.log('success:' + res), 
    (err) => console.log('error:' + err)
  );
//print 
//finally undefined
//error:promise error
```

```js
Promise.reject('promise error')
  .finally((res) => console.log('finally', res)) //此处参数无意义
  .then((res) => console.log('success:' + res))
  .catch((err) => console.log('error:' + err));
//print 
//finally undefined
//error:promise error
```

`finally()`内部定义`new Promise()`，并打印外部`resolve()`方法的参数，而不是内部`resolve()`方法的参数。

```js
Promise.resolve('outter promise success')
  .finally((res) => {
    console.log('finally');
    return new Promise((resolve, reject) => {
     resolve('new Promise success'); //没打印
    });
  })
  .then(
    (res) => console.log('success:' + res), 
    (err) => console.log('error:' + err)
  );
//print 
//finally
//success:outter promise success
```

`finally()`内部定义`new Promise()`，且在一个延时器后`resolve()`，并打印外部`resolve()`方法的参数，而不是内部`resolve()`方法的参数。

````js
Promise.resolve('outter promise success')
  .finally((res) => {
    console.log('finally');
    return new Promise((resolve, reject) => {
     setTimeout(() => resolve('new Promise success'), 2000);
    });
  })
  .then(
    (res) => console.log('success:' + res), 
    (err) => console.log('error:' + err)
  );
//print 
//finally
//2秒后 success:outter promise success
````

`finally()`内部定义`new Promise()`，并打印内部`reject()`方法的参数，而不是外部`reject()`方法的参数。

```js
Promise.reject('outter promise error')
  .finally((res) => {
    console.log('finally');
    return new Promise((resolve, reject) => {
     setTimeout(() => reject('new Promise error'), 2000);
    });
  })
  .then(
    (res) => console.log('success:' + res), 
    (err) => console.log('error:' + err)
  );
//print 
//finally
//2秒后 error:new Promise error
```

`finally()`内部定义`new Promise()`，并打印内部`reject()`方法的参数，而不是外部`resolve()`方法的参数。

```js
Promise.resolve('outter promise success')
  .finally((res) => {
    console.log('finally');
    return new Promise((resolve, reject) => {
     setTimeout(() => reject('new Promise error'), 2000);
    });
  })
  .then(
    (res) => console.log('success:' + res), 
    (err) => console.log('error:' + err)
  );
//print 
//finally
//2秒后 error:new Promise error
```

实现`MyFinally`

```js
MyPromise{
  MyFinally(finallyCallback){
    return this.then((value) => {
      return MyPromise.resolve(finallyCallback()).then(() => value);
    }, (reason) => {
      return MyPromise.resolve(finallyCallback()).then(() => {
        throw reason;
      });
    });
  }
}
```



## `promisify`

`node`开发环境中会经常使用到`promisify`，因为`node Api` 属于回调式的，希望把代码转为`promisify`格式作为内置调用的一种形式。

```js
//模拟fs
const fs = require('fs');
fs.readFile('./data/user.json', 'utf8', (err, data) => {});
```

```js
//node内置API promises属性
const fs = require('fs').promises;
fs.readFile('./data/user.json', 'utf8').then((res) => {},(err) => {});
```

```js
//bluebird库 异步处理方法 promisify()
const readFile = bluebird.promisify(fs.readFile);
readFile('./data/user.json', 'utf8').then((res) => {},(err) => {});
```

```js
//node工具库 util util.promisify()
const util = require('util');
const readFile = util.promisify(fs.readFile);
readFile('./data/user.json', 'utf8').then((res) => {},(err) => {});
```

模拟实现`util`里面的`promisify()`方法 实现异步处理。

```js
module.exports = {
  //接收函数方法 如fs.readFile
  promisify(fn){
    //返回一个函数 如readFile(promise).then()
    //...args形参 => './data/user.json', 'utf8'
    return function(...args){
      return new Promise((resolve, reject) => {
        //fs.readFile
        //fn()执行后才能then()
        //参数2：原生带有一个自定义的回调函数
        fn(...args, (error, data) => {
          if(error){ return reject(error); }
          resolve(data);
        });
      })
    }
  }
}
```





`promisifyAll`

把一个对象里的所有方法全部`promisify`一遍。

```js
module.exports = {
  promisify(fn){...},
  promisifyAll(fns){
    //遍历每一个方法且加上async
    // Object.keys()遍历出自身的可枚举的键名(不含继承属性)
    Object.keys(fns).map((fnName) => {
      //有可能不是方法而是属性，需排除
      if(typeof fns[fnName] === 'function'){
        //1.更改名称

        fns[fnName + 'Async'] = this.promisify(fns[fnName]);
      }
    });
    
    //返回包装后的fns
    return fns;
  }
}
```





## 检查

源码规范检测的包是`promises-aplus-tests@2.1.2`。在`MyPromise.js`文件底下新增脚本代码。

```js
MyPromise.defer = MyPromise.deferred = function(){
  let deferred = {};
  deferred.promise = new MyPromise((resolve, reject) => {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });
  return deferred;
}
```

并终端命令行输入。

```
promises-aplus-tests MyPromise.js
```



## 源码

`PromiseA+`案例所有[源码](https://gitee.com/kevinleeeee/promise-source)。

