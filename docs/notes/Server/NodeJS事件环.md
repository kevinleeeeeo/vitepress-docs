# `node`事件环

## `node`环境

除了浏览器环境的事件环，`node`也有相应的事件环。`node`的`11`及以上版本或与浏览器的结果一样。但仍有不同的地方。

浏览器的常见宏任务有`<script>`脚本，`UI`渲染，用户交互事件，`Ajax`，`setTimeout`，`setInterval`，`requestAnimation`，`messageChannel`,`setImmediate`在`IE`新版本和`EDGE`和`NodeJS`的`0.1`以上版本支持，但在新版浏览器里是没有的，`window.setImmediate`显示`undefined`，其实可以通过兼容性解决。

微任务有`promise.then`，`mutationObserver`监听`dom`变化，`NodeJS`上的`process.nextTick`，`vue.$nextTick`具有时效性，利用宏任务和微任务滞后的特性完成一个同步化的程序。

## 事件环概述

它不像浏览器的事件环是一个真正的环，它把所有的任务事件都分配到不同的阶段，在宏任务基础上进行从上到下不停的执行直至每一个阶段都没有任务了，`node`环境不存在微任务队列只有宏任务队列，而宏任务队列分为以下阶段：

1. **`Timer`定时器**: `setTimeout`,`setInterval`。
2. `Pending callbacks`待定回调，执行延迟到下一个事件环迭代的`I/O`回调(内部机制使用)。
3. `Idle`，`prepare`，系统内部机制使用。
4. **`Poll`轮询**，这个阶段是轮询时间，用于等待还未返回的 `I/O` 事件，比如服务器的回应、文件读写，数据库操作，网络请求等。这个阶段的时间会比较长。如果没有其他异步任务要处理（比如到期的定时器），会一直停留在这个阶段，等待` I/O` 请求返回结果。(排除定时器，关闭的回调函数)
5. **`Check`检测**，`setImmediate`的回调函数。
6. `Close callbacks`关闭的回调函数，(内部机制使用)，如`socket.on('close', fn)`。

```
   ┌───────────────────────────┐
┌─>│           timers          │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │
│  └─────────────┬─────────────┘      ┌───────────────┐
│  ┌─────────────┴─────────────┐      │   incoming:   │
│  │           poll            │<─────┤  connections, │
│  └─────────────┬─────────────┘      │   data, etc.  │
│  ┌─────────────┴─────────────┐      └───────────────┘
│  │           check           │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │
   └───────────────────────────┘
```

**过程**是主执行栈执行完毕后清空所有的微任务包括`then`和`nextTick`，`node`不存在微任务队列，不存在`GUI`渲染，然后到`Timer`阶段，找宏任务的`Timers`，相对于浏览器宏任务一个一个的推进执行栈，`node`环境的宏任务是需要一次性执行所有宏任务，留下的是回调函数。然后到`Poll`阶段，查看有没有`Check`，如果有`setImmediate`有存在`I/O`的回调函数里就执行，再次检查是否有`readFile`事件，如果有就注册新的事件，并执行上一轮的回调。然后到`Check`阶段，查看有没有`setImmediate`，如果有就执行。然后再回到`Poll`阶段，有可能会存在等待的情况，前提是没有`setImmediate`。在`Check`阶段如果`Times`的时间还没有到时，会先执行`setImmediate`。

`Timer`**队列**，只执行`setTimeout`和`setInterval`，但是他们的`callback`不会执行，而是推到宏任务的队列之中。

**`Poll`队列**，会先执行符合条件的微任务，比如`Promise`的异步完成，如果是`setImmediate`，则只会执行，不执行他的`callback`，然后执行定时器的`callback`，比如`timeout`。这里会适当得暂停一会，看看会不会有新任务进入队列。如果有`setImmediate`的`callback`则进入`Check `阶段，否则回到`Timer`继续新一轮循环。

`Check`**队列**，当`Poll`阶段的队列完成，则会轮到`Check`，这时会执行`setImmediate`的`callback`。如果没有需要关闭`callbacks`，那么就回到`Timer`继续新一轮的循环。

```js
const { readFile } = require('fs');

//promise1
Promise.resolve().then(() => { console.log(1); });
//nextTick1
process.nextTick(() => { console.log(2); });
console.log('start');

//readFile1
readFile('1.txt', 'utf-8', () => {
  //setTimeout2
  setTimeout(() => { console.log(3); }, 0);
  //nextTick2
  process.nextTick(() => { console.log(4); });
  //setImmediate2
  setImmediate(() => { console.log(5); });
  console.log(6);
});

console.log(7);

//setTimeou1
setTimeout(() => { console.log(8); }, 0);
//setImmediate1
setImmediate(() => { console.log(9); });
console.log('end');

//打印
start 7 end 2 1 8 9 6 4 5 3
//有可能打印
start 7 end 2 1 9 8 6 4 5 3
```

```
/**
 * 主执行栈
 * 1. 遇到微任务，执行微任务promise1
 * 2. 遇到微任务，执行微任务nextTick1
 * 3. 执行打印start
 * 4. 遇到readFile1是一个宏任务的I/O操作，放入Poll
 * 5. 执行打印7
 * 6. 遇到setTimeout1宏任务，放入Timers
 * 7. 遇到setImmediate1宏任务，放入Check
 * 8. 执行打印end
 *
 * 在宏任务阶段转换之前，微任务需要清空
 * 9. 执行nextTick1 cb，打印2(nextTick优先级更高)
 * 10. 执行promise1 cb，打印1
 * 11. 微任务清空
 *
 * 宏任务队列(node事件环阶段)
 * 12. Timers阶段，执行setTimeout1 cb，推入执行栈，打印8
 * 13. Poll阶段，检查Check里是否有setImmediate, 有setImmediate1，执行setImmediate1 cb，推入执行栈，打印9
 * 14. 回到Poll阶段，执行readFile1 cb，推入执行栈
 *      发现setTiemout2，放入Timers，
 *      发现nextTick2，放入微任务队列，
 *      发现setImmediate2，放入Checks
 * 15. 打印6
 * 16. 清空微任务，执行nextTick2 cb, 推入执行栈，打印4
 * 17. Timers阶段，执行setTimeout2
 * 18. Poll阶段，队列为空，检查Check，执行setImmediate2 cb，推入执行栈，打印5
 * 19. Timers阶段，执行setTimeout2 cb, 推入执行栈，打印3
 */
```

```JS
setTimeout(() => console.log(1));
setImmediate(() => console.log(2));
process.nextTick(() => console.log(3));
Promise.resolve().then(() => console.log(4));
(() => console.log(5))();
```

```
1.遇到setTimeout1宏任务，放入Timers
2.遇到setImmediate1宏任务，放入Check
3.遇到微任务，执行微任务nextTick1
4.遇到微任务，执行微任务promise1
5.立即执行函数打印5

6.执行nextTick1 cb，打印3(nextTick优先级更高)
7.执行promise1 cb，打印4
8.Timers阶段，执行setTimeout1 cb，推入执行栈，打印1
9.Poll阶段，检查Check里是否有setImmediate, 有setImmediate1，执行setImmediate1 cb，推入执行栈，打印2
//53412
```

```js
setTimeout(() => {
  console.log('timer1');
  Promise.resolve().then(() => {
    console.log('promise1');
  });
});

setTimeout(() => {
  console.log('timer2');
  Promise.resolve().then(() => {
    console.log('promise2');
  });
});
```

```
1.遇到setTimeout1宏任务，放入Timers
2.遇到setTimeout2宏任务，放入Timers

3.Timers阶段，执行setTimeout1 cb，推入执行栈，打印timer1
4.遇到微任务，执行微任务promise1

5.Timers阶段，执行setTimeout2 cb，推入执行栈，打印timer2
6.遇到微任务，执行微任务promise2
```



## 流程

```js
console.log(1);

setTimeout(() => {
  console.log('setTimeout');
}, 0);

console.log(2);

//print
1 2 setTimeout
```

```
/**
 * 执行栈
 * 1. 执行栈执行同步代码，打印1
 * 2. 定时器setTimeout1作为异步任务被推入到异步模块中执行
 * 3. 往下执行同步代码，打印2
 *
 * 宏任务node事件循环启动
 * 4. 检查Timers队列，此时setTimeout1仍在执行中，队列为空
 * 5. 检查Poll队列仍然为空，此时事件循环不会立即执行下一步，而是进行判断，查看Checks队列和Timers队列是否有需要执行的回调。
 *    如果有，继续循环，执行回调。
 *    如果没有，会暂停，因为队列为空，循环没有意义，所以会在Poll队列等待，直至出现新的I/O事件。
 *    因为事件循环正在等待，进入任务事件的队列会被立刻处理，设计的目的是为了更快的响应客户端的请求，优先处理I/O事件。事件循环在等待时其他队列出现事件，事件循环会恢复执行。
 * 6. 定时器到达指定时间，回调进入Timers队列，将回调推入执行栈执行。打印setTimeout
 */
```

```js
console.log(1);

setTimeout(() => {
  console.log('setTimeout');
}, 0);

readFile('a.txt', 'utf-8', () => {
  console.log(3);
});

console.log(2);

//print 1 2 setTimeout 3
```

```
/**
 * 执行栈
 * 1. 执行栈执行同步代码，打印1
 * 2. 定时器setTimeout1作为异步任务被推入到异步模块中执行
 * 3. I/O操作readFile1进入异步模块中执行
 * 4. 往下执行同步代码，打印2
 *
 * 宏任务node事件循环启动
 * 5. 检查Timers队列，此时setTimeout1仍在执行中，队列为空
 * 6. 检查Poll队列仍然为空，此时事件循环不会立即执行下一步，而是进行判断，查看Checks队列和Timers队列为空，循环暂停进行阻塞。
 * 7. 定时器到达指定时间，回调进入Timers队列，将回调推入执行栈执行。打印setTimeout
 * 
 * 事件循环继续回到Poll阶段等待
 * 8. 文件读取完毕，readFile1回调进入Poll队列，将回调推入执行栈执行打印3
 */
```

```js
console.log(1);

setTimeout(() => {
  console.log('setTimeout');
}, 0);

readFile('a.txt', 'utf-8', () => {
  console.log(3);
});

setImmediate(() => {
  console.log('setImmediate');
});

console.log(2);

//print 
1 2 setImmediate 3 setTimeout 
or 
1 2 setTimeout 3 setImmediate
```

```
/**
 * 执行栈
 * 1. 执行栈执行同步代码，打印1
 * 2. 定时器setTimeout1作为异步任务被推入到异步模块中执行
 * 3. I/O操作readFile1进入异步模块中执行
 * 4. setImmediate1进入异步模块中执行
 * 5. 往下执行同步代码，打印2
 *
 * 宏任务node事件循环启动
 * 6. setImmediate1回调直接进入Checks队列
 * 7. 检查Timers队列，此时setTimeout1仍在执行中，队列为空
 * 8. 检查Poll队列，此时Check队列有回调需要执行，所以事件循环会继续执行。
 * 9. 事件循环将Check队列里的回调推入执行栈执行，打印setImmediate
 *
 * 事件循环继续回到Poll阶段等待
 * 10. 文件读取完毕，readFile1回调进入Poll队列，将回调推入执行栈执行打印3
 * 11. 定时器到达指定时间，回调进入Timers队列，将回调推入执行栈执行。打印setTimeout
 */
```

```js
//nextTick1
process.nextTick(() => { console.log(1); });

console.log('start');

//setTimeout1
setTimeout(() => { console.log(2); }, 0);

//setTimeout2
setTimeout(() => { console.log(3); }, 0);

//setImmediate1
setImmediate(() => {
  console.log(4);

  //nextTick2
  process.nextTick(() => {
    console.log(5);

    //promise1
    Promise.resolve().then(() => { console.log(6); });
  });
});

//readFile1
readFile('1.txt', 'utf-8', () => {
  //nextTick3
  process.nextTick(() => { console.log(7); });

  //setTimeout3
  setTimeout(() => { console.log(8); }, 0);

  //setImmediate2
  setImmediate(() => { console.log(9); });
});

//readFile2
readFile('2.txt', 'utf-8', () => {
  //nextTick4
  process.nextTick(() => { console.log(10); });

  //setTimeout4
  setTimeout(() => { console.log(11); }, 0);

  //setImmediate3
  setImmediate(() => { console.log(12); });
});

console.log('end');

//print
//start end 1 2 3 4 5 6 7 10 9 12 8 11
```

```
/**
 * 主执行栈
 * 1. 遇到微任务，把nextTick1放到微任务队列
 * 2. 执行打印start
 * 3. 遇到宏任务，把setTimeout1放入Timers
 * 4. 遇到宏任务，把setTimeout2放入Timers
 * 5. 遇到setImmediate1宏任务，放入Check
 * 6. 遇到readFile1是一个宏任务的I/O操作，放入Poll
 * 7. 遇到readFile2是一个宏任务的I/O操作，放入Poll
 * 8. 执行打印end
 *
 * 在宏任务阶段转换之前，微任务需要清空
 * 9. 执行nextTick1 cb，打印1(nextTick优先级更高)
 *
 * 宏任务转换阶段(非I/O函数内部)
 * 10. Timers阶段，执行setTimeout1
 * 11. Timers阶段，执行setTimeout2
 * 12. Poll阶段等待计时器的过程中查看Check
 * 13. 等待的过程中计时器时间到了,推入执行栈执行setTimeout1 cb，打印2，清空微任务。
 * 14. 等待的过程中计时器时间到了,推入执行栈执行setTimeout2 cb，打印3，清空微任务。
 * 15. Check阶段，执行setImmediate1,推入执行栈执行setImmediate1 cb，打印4，遇到微任务，把nextTick2放到微任务队列
 *
 * 在宏任务阶段转换之前，微任务需要清空
 * 16. 执行nextTick2 cb，打印5
 * 17. 遇到微任务，把promise1.then放到微任务队列
 *
 * 宏任务转换阶段
 * 18. Timers阶段，队列为空，清空微任务，promise1.then推入执行栈执行打印6
 * 19. Poll阶段，将readFile1 cb推入执行栈执行，遇到微任务，把nextTick3放到微任务队列，遇到宏任务，把setTimeout3放入Timers, 遇到setImmediate2宏任务，放入Check
 * 20. Poll阶段，将readFile2 cb推入执行栈执行，遇到微任务，把nextTick4放到微任务队列，遇到宏任务，把setTimeout4放入Timers, 遇到setImmediate3宏任务，放入Check
 *
 * 在宏任务阶段转换之前，微任务需要清空
 * 21. 执行nextTick3 cb，打印7
 * 22. 执行nextTick4 cb，打印10
 *
 * 宏任务转换阶段
 * 23. Check阶段，清空该队列，将setImmediate2 cb推入执行栈执行，打印9
 * 24. Check阶段，清空该队列，将setImmediate3 cb推入执行栈执行，打印12
 * 25. Timers阶段，推入执行栈执行setTimeout3 cb，打印8
 * 26. Timers阶段，推入执行栈执行setTimeout4 cb，打印11
 */
```



## `nextTick`

`process.nextTick`在`node`环境中的方法与`vue`的用法是一致的。它是微任务，而且优先于`promise.then`的执行。

```js
Promise.resolve().then(() => {
  console.log('pormise');
});

setTimeout(() => {
  console.log('setTimeout');
});

process.nextTick(() => {
  console.log('nextTick');
});

//print
nextTick
pormise
setTimeout
```

在同步任务中，理论上，`timer`是优先于`check`的`setImmediate`执行的，事实是时间非常短暂，执行环境有延时时候`check`有可能优先于`timer`执行，所以避免这种竞争态情况的发生，稳妥的写法是用一个宏任务进行包裹，这样就可以确保`check`可以永远优先于`timer`执行，因为在外层`setTimeout`中一定会走`timer`,导致里面的`timer`挂起，并在当前事件环中走`check`，接着再走`timer`。

```js
console.log('timer2');
Promise.resolve().then(() => console.log('promise2'));
fs.readFile('./index.html', function (err, data) {
  console.log('read');
});
process.nextTick(() => console.log('nextTick2'));
console.log('10');
setTimeout(() => console.log('timer++'));
setImmediate(() => {
  console.log('setImmediate1');
  Promise.resolve().then(() => console.log(1));
});
setImmediate(() => {
  console.log('setImmediate2');
});
//timer2 10 nextTick2 promise2 timer++ setImmediate1 1 setImmediate2  read
```

在当前宏的最后插入任务。即在当前`setTimeout`宏里的同步任务之后，插入`nextTick`任务。

```js
setTimeout(() => {
  console.log('timer2');
  Promise.resolve().then(() => console.log('promise2'));
  fs.readFile('./index.html', function (err, data) {
    console.log('read');
  });
  process.nextTick(() => console.log('nextTick2'));
  console.log('10');
  setTimeout(() => console.log('timer++'));
  setImmediate(() => {
    console.log('setImmediate1');
    Promise.resolve().then(() => console.log(1));
  });
  setImmediate(() => {
    console.log('setImmediate2');
  });
});

//timer2 10 nextTick2  promise2 setImmediate1 1 setImmediate2 timer++ read
```



## `setImmediate`

用法有点像`setTimeout`，用来把一些需要长时间运行的操作放在一个回调函数里，在浏览器完成后面的其他语句后，就立刻执行这个回调函数。在`vue`中，使用`setImmediate`会比使用`setTimeout`会是一个更好的选择，在宏任务里，使用`setTimeout`会有一些怪异的行为。

```js
//browser
setTimeout(() => {
  console.log('over');
  console.log('over');
  console.log('over');
});

console.log('start');
console.log('operating');

//print
start
operating
over
over
over
```

```js
//nodejs
setImmediate(() => {
  console.log('over');
  console.log('over');
  console.log('over');
});

console.log('start');
console.log('operating');

//print
start
operating
over
over
over
```

它的返回值是一个`Immediate`对象，表示唯一的`id`，作为`clearImmediate()`的参数来清除。

```js
console.log(setImmediate(() => {}));

Immediate {
  _idleNext: null,
  _idlePrev: null,
  _onImmediate: [Function (anonymous)],
  _argv: undefined,
  _destroyed: false,
  [Symbol(refed)]: true,
  [Symbol(asyncId)]: 5,
  [Symbol(triggerId)]: 1
}
```

`setImmediate`与`setTimeout`执行顺序。

```js
setImmediate(() => {
  console.log('setImmediate');
});
setTimeout(() => {
  console.log('setTimeout');
}, 0);

//有时先setTimeout, 后setImmediate
```

```js
setTimeout(() => {
  console.log('setTimeout');
}, 0);

setImmediate(() => {
  console.log('setImmediate');
});

//有时先后setImmediate, setTimeout
```

在`NodeJS`中，两个都比较相似，但是根据执行的行为的不同会有所区别。`setImmediate`被设计为一旦输入输出的阶段完成会执行脚本。`setTimeout`设计为计划一个脚本用最小的毫秒数去运行。计时器的执行顺序将根据调用他们的上下文而有所不同，如果两个都是从主模块中执行，那么执行时机是受进程性能的影响，这可能受其他应用在本机运行中的影响。

如果我们在`I/O` 周期（即主模块）之外运行以下脚本，则两个计时器的执行顺序是不确定的，因为它受进程性能的约束。但是，如果您在一个 `I/O` 周期内移动这两个调用，则始终首先执行立即回调。使用`setImmediate()`的主要优点是，如果在`I/O` 周期内调度，`setImmediate`将始终在任何定时器之前执行，而与存在多少定时器无关。



