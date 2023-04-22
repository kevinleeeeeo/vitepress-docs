# `ES6`数组静态方法

## `Array()`

数组的构造函数的直接执行也可以创建一个数组。

```js
console.log(Array()); //[]
```

如果传入一个数值参数时，创建一个长度为该数值长度的数组。

```js
console.log(Array(3)); //[empty × 3]
```

希望传入指定参数2是一个数值作为数组元素，参数1是数组长度是难以定义的，返回的结果是一个包含了参数1和参数2作为数组元素的数组。

```js
console.log(Array(3, 1)); //[3, 1]
```

`Array()`方法创建数组的结果与`new Array()`方法创建数组的结果是一样的，传参方式也是一样。所以很少使用这两种方法来声明一个数组。

```js
console.log(new Array()); //[]
console.log(new Array(3)); //[empty × 3]
console.log(new Array(3, 1)); //[3, 1]
```



## `Array.of()`

该方法定义在数组原型的构造器里，`Array.of()`方法的新增是用来替代原来`new Array()`或`Array()`方法来声明一个比较符合预期的数组。

```JS
console.log(Array.of()); //[]
console.log(Array.of(3)); //[3]
console.log(Array.of(3, 1)); //[3, 1]
```



## `Array.from()`

`Array.from()`方法能够将数组或类数组等部署了`iterator`对象接口的数据进行转换，将其转为数组结构。

`Array.from()`的第一个参数必须是可迭代对象或者是标准的类数组，第二个参数是一个遍历数组的回调函数(`Array.prototype.map()`)，第三个参数是更改回调内部指向。

```js
Array.from(obj, mapFn, thisArg);
```

通过包装过的数组或类数组，或具有`length`属性和键名按数字`0`开始的对象，返回一个新的数组引用。

```js
var arr = [1, 2, 3];
var newArr = Array.from(arr);
console.log(arr); //[1, 2, 3]
console.log(newArr); //[1, 2, 3]
console.log(arr === newArr); //false
```

当参数为引用值时，内部引用不做拷贝，是一个浅拷贝数组。

```js
var arr = [{}, {}, {}];

var newArr = Array.from(arr);
console.log(newArr[1] === arr[1]); 
//true
```

如果参数是一个字符串时，竟然会处理字符串，原因是字符串是一个可迭代对象。

```js
var newArr = Array.from('123');
console.log(newArr);
//['1', '2', '3']

console.log(new String('123'));
/**
 * {
 *   0: '1',
 *   1: '2',
 *   2: '3',
 *   length: 3,
 *   [[Prototype]]: {
 *     Symbol(Symbol.iterator): ƒ [Symbol.iterator]()
 *   }
 * }
 */
```

如果参数是一个`Symbol`类型时，不做处理返回一个空数组。

```js
var sm = Symbol('123');
var newArr = Array.from(sm);
console.log(newArr); //[]
```

如果参数是一个数字类型时，不做处理返回一个空数组。

```js
var newArr = Array.from(123);
console.log(newArr); //[]
```

如果参数是一个布尔类型时，不做处理返回一个空数组。

```js
var newArr = Array.from(true);
console.log(newArr); //[]
```

如果参数是一个正则类型时，不做处理返回一个空数组。

```js
var newArr = Array.from(/123/);
console.log(newArr); //[]
```

如果参数是一个`null`或`undefined`时，抛出错误，意图表示不合适的值导致保存。

```js
var newArr1 = Array.from(null);
var newArr2 = Array.from(undefined);

console.log(newArr1);
//Uncaught TypeError: object null is not iterable (cannot read property Symbol(Symbol.iterator))
console.log(newArr2);
//Uncaught TypeError: undefined  is not iterable (cannot read property Symbol(Symbol.iterator))
```

如果不传参数时，报错和传了`undefined`是一样的。

```js
var newArr = Array.from();
console.log(newArr);
//Uncaught TypeError: undefined  is not iterable (cannot read property Symbol(Symbol.iterator))
```

如果参数是`Map`数据时，转化为一个二维数组。

```js
var m = new Map([
  ['a', 1],
  ['b', 2],
  ['c', 3]
]);

var newArr = Array.from(m);
console.log(newArr);
/**
 * [
 *   ['a', 1],
 *   ['b', 2],
 *   ['c', 3]
 * ]
 */
```

如果参数是`Set`数据时，转化为一个数组。

```js
var s = new Set([1, 2, 3, 4]);

var newArr = Array.from(s);
console.log(newArr);
//[1, 2, 3, 4]
```

`Array.from`有第二个可选参数，是一个回调函数，内部不返回内容时返回`undefined`组合的数组。回调函数只有`item`，`index`两个参数，没有第三个参数，原因是由于回调执行的时候，`Array.from`还没有执行完毕，所以不存在逻辑上的新数组，所以无法在回调里获取到新数组本身，有别于数组的其他遍历方法。

```js
var arr = [1, 2, 3, 4];

var newArr = Array.from(arr, function (item, index) {
  //每一次遍历必须返回一个值
  console.log(item);
  //1 2 3 4
});

console.log(newArr);
//[undefined, undefined, undefined, undefined]
```

假如回调函数返回指定值时会组合一个新的数组。

```js
var arr = [1, 2, 3, 4];

var newArr = Array.from(arr, function (item) {
  return 'a';
});

console.log(newArr);
//['a', 'a', 'a', 'a']
```

`Array.from`的第二个参数的执行原理。`Array.from`执行返回的数组在`map`遍历时更改后结果，跟第二个参数里更改的结果是一样的。说明相对于调用了`map`的遍历。

```js
var arr = [1, 2, 3, 4];

var newArr = Array.from(arr).map(function (item, index, array) {
  // console.log(item, index, array);
  //1 0 [1, 2, 3, 4]
  return item + 1;
});

console.log(newArr);
//[2, 3, 4, 5]
```

获取`Array.from`方法的形参长度。证明方法第第一个参数是**必填项**。

```js
console.log(Array.from.length); //1	
```

使用场景1是填充数组，序列生成器。

```js
//range(起始值，结束值，间隔)
var r = range(1, 10, 2);

//希望拿到的数组是
//[1, 3, 5, 7, 9]

function range(start, stop, step) {
  //将一个带有length的类数组转为数组
  /**
   *  假如range(1, 5) 即 [1, 2, 3, 4, 5]
   *  length = (stop - start) / step + 1
   *         =  (5 - 1) / 2 + 1 = 3
   */
  return Array.from(
    { length: (stop - start) / step + 1 },
    function (item, index) {
      return start + index * step;
    }
  );
}

console.log(r);
//[1, 3, 5, 7, 9]
```

使用场景2是数组的合并(`concat`)与去重(`Set`)。

```js
function combine() {
  //1.获取实参列表里的数组并将其合并在一起
  const arr = Array.prototype.concat.apply([], arguments);
  // console.log(arr);
  //[1, 2, 3, 4, 5, 2, 3, 4, 5, 6, 3, 4, 5, 6, 7]

  //2.利用Set去重
  return Array.from(new Set(arr));
}

const arr1 = [1, 2, 3, 4, 5];
const arr2 = [2, 3, 4, 5, 6];
const arr3 = [3, 4, 5, 6, 7];

console.log(combine(arr1, arr2, arr3));
//[1, 2, 3, 4, 5, 6, 7]
```

**`Array.from`的源码实现**

设计方案是在`Array`对象上定义一个`myFrom`方法，写了一个立即执行函数的原因是将会在该作用域里定义许多私有方法和参数处理，该立即执行函数会返回一个`from`方法。

设计的参数为3个：

- 参数1是可迭代对象或者是类数组
- 参数2是一个`map`遍历的回调函数
- 参数3是回调函数内部指向改变

设计的内部属性有：

- `maxSafeInt`属性，设定一个安全最大整数。

设计的内部方法有：

- `isCallable`方法，判断能否调用的方法，接收一个回调函数作为参数。
- `toInt`方法，把一个`value`由小数或非数字处理成为一个正整数或负整数。
- `toLength`方法，由一个整数转化成长度。

设计返回的闭包是一个函数`from`本身。参数1是必选项如`arrayLike`。参数2，参数3是可选的。

边界判断：

- 确保`myFrom`回调函数是一个函数并且是一个构造函数构造出来的，否则报错。

- 确保`myFrom`回调函数是的第一个参数不是`null`，否则报错。

- 确保`myFrom`回调函数是的第二个参数`mapFn`回调函数的类型不是`undefined`，否则报错。

- 确保`myFrom`回调函数是的第二个参数`mapFn`回调函数是可以执行的，否则报错。

  

```js
Array.myFrom = (function () {
  //最大安全整数的长度是取2的53幂 - 1
  const maxSafeInt = Math.pow(2, 53) - 1;

  //判断能否调用的方法，接收一个回调函数作为参数。
  const isCallable = function (fn) {
    return (
      typeof fn === 'function' ||
      Object.prototype.toString.call(fn) === '[object Function]'
    );
  };

  //把一个value由小数或非数字处理成为一个整数。
  const toInt = function (value) {
    const v = Number(value);
    //非数字时
    if (isNaN(v)) { return 0; }
    //是0 并且 不是无穷大的数值 时
    if (v === 0 || !isFinite(v)) { return v; }
    //大于0时为正数，小于0时为负数，先绝对值后向下取整处理
    //最终得出一个 正整数 或 负整数
    return (v > 0 ? 1 : -1) * Math.floor(Math.abs(v));
  };

  //由一个整数转化成长度。
  const toLength = function (value) {
    const len = toInt(value);
    //内层判断长度和0的大小，0大取0，len大取len，有长度。
    //外层判断长度和最大安全整数的大小，谁小取谁。
    return Math.min(Math.max(len, 0), maxSafeInt);
  };

  //返回闭包函数
  return function (arrayLike) {
    let i = 0,
      val,
      arg2; //this指向改变

    //保存调用者
    const caller = this;
    //将arrayLike包装成一个对象
    const origin = Object(arrayLike);
    //如有传实参且大于1时有两个参数，取第二参数作为函数，否则不处理
    const mapFn = arguments.length > 1 ? arguments[1] : void undefined;
    //转换len
    const len = toLength(origin.length);
    //确保调用者是一个函数并且是可调用的
    const arr = isCallable(caller) ? Object(new caller(len)) : new Array(len);

    if (arrayLike === null) {
      throw new TypeError('Method from requires an array-like-object.');
    }

    if (typeof mapFn !== 'undefined') {
      //如果该函数不可以执行时就报错
      if (!isCallable(mapFn)) {
        throw new TypeError('mapFn must be a function.');
      }
      //当传了第二参数时说明 传了改变this执行的对象
      if (arguments.length > 2) {
        arg2 = arguments[2];
      }
    }

    while (i < len) {
      val = origin[i];
      if (mapFn) {
        //正常执行并传参，参数2存在时需要改变this指向
        arr[i] =
          typeof arg2 === 'undefined'
            ? mapFn(val, i)
            : mapFn.apply(arg2, [val, i]);
      } else {
        arr[i] = val;
      }
      i++;
    }

    return arr;
  };
})();
```

