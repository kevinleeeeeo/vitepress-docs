# `ES6`数组原型方法



## `copyWithin`

`copyWithin(target, start, end)`，`ES6`新增，浅复制数组的一部分到同一数组中的另一个位置，并返回它，**不会改变原数组的长度**，返回的原数组引用。场景是移动数组元素时使用的方法。

复制指定区间内容至指定位置。如`end > len - 1`，取至末尾。

```js
const arr = [1, 2, 3, 4, 5];
const newArr = arr.copyWithin(0, 3, 4);
//[4, 2, 3, 4, 5]
```

在原数组不存在的位置覆盖内容时是无法覆盖的。即`target > len - 1`。

```js
const arr = [1, 2, 3, 4, 5];
const newArr = arr.copyWithin(5, 1, 2);
//[1, 2, 3, 4, 5]
```

正常覆盖替换情况，即`target > start`。

```js
const arr = [1, 2, 3, 4, 5];
const newArr = arr.copyWithin(3, 1, 3);
//[1, 2, 3, 2, 3]
```

如果是负数，则倒数`-1`开始算起，截取区间。即`start + len`

```js
const arr = [1, 2, 3, 4, 5];
const newArr = arr.copyWithin(0, -3, -1);
//[3, 4, 3, 4, 5]
```

只有一个参数时，区间选取默认从第0位到最后一项去对其索引进行覆盖替换。

```js
const arr = [1, 2, 3, 4, 5];
const newArr = arr.copyWithin(0);
//[1, 2, 3, 4, 5]

const newArr = arr.copyWithin(3);
//[1, 2, 3, 1, 2]
```

只有两个参数时，区间选取默认从参数2索引到最后一项去对其索引进行覆盖替换。

```js
const arr = [1, 2, 3, 4, 5];
const newArr = arr.copyWithin(1，3);
//[1, 4, 5, 4, 5]
```

返回值是原引用数组。

```js
console.log(newArr === arr); //true
```

当数组元素是引用值时。

```js
var arr = [
  { id: 1, name: 'lulu' },
  { id: 2, name: 'bob' },
  { id: 3, name: 'kobe' }
];

var newArr = arr.copyWithin(0, 1, 2);
console.log(newArr);
[
  { id: 2, name: 'bob' },
  { id: 2, name: 'bob' },
  { id: 3, name: 'kobe' }
]
```

浅拷贝

```js
var arr = [
  { id: 1, name: 'lulu' },
  { id: 2, name: 'bob' },
  { id: 3, name: 'kobe' }
];

var tar1 = arr[0];
var newArr = arr.copyWithin(0, 1, 2);
var tar2 = arr[0];

console.log(tar1 === tar2); false
console.log(arr[1] === tar2); true
```

当对象希望使用数组的方法时改变指向，选取区间复制内容。

```js
var obj = {
  0: 'a',
  1: 'b',
  2: 'c',
  length: 3
};

const newObj = [].copyWithin.call(obj, 0, 1, 2);
console.log(newObj);
//{0: 'b', 1: 'b', 2: 'c', length: 3}
```



## `entries`

`Array.prototype.entries`方法返回一个新的 Array Iterator 数组迭代器对象，该对象包含数组中每个索引的键/值对。

```JS
var arr = ['a', 'b', 'c'];
console.log(arr.entries());
//Array Iterator {}
```

迭代器对象一般都会有`next`方法，执行方法会返回一个`{value: xxx, done: false}`对象。

```js
var arr = ['a', 'b', 'c'];

var it = arr.entries();
console.log(it.next());
//{value: [0, 'a'], done: false}
```

可以使用`for of`循环遍历该迭代器对象。

```js
var arr = ['a', 'b', 'c'];
var it = arr.entries();

for (var [index, item] of it) {
  console.log(index, item);
  //0 'a' / 1 'b' / 2 'c'
}
```

通过`entries`方法可以给二维数组进行排序。

```js
//写法1
var newArr = [
  [56, 23],
  [56, 34, 100, 1],
  [123, 234, 12]
];

function sortArr(arr) {
  var _arr = [];
  var it = arr.entries();
  for (var [k, v] of it) {
    _arr.push(v.sort((a, b) => a-b));
  }

  return _arr;
}
```

```js
//写法2
function sortArr(arr) {
  var it = arr.entries(),
    isNext = true;

  //为真时 一直循环
  while (isNext) {
    var _r = it.next();

    //{value: xxx, done: false}
    //done为false时一直循环直到不是false
    if (!_r.done) {
      //做排序
      _r.value[1].sort((a, b) => a - b);
    } else {
      //done: true时最后也要把isNext = false中止循环
      isNext = false;
    }
  }
  return arr;
}
```



## `fill`

`Array.prototype.fill(target, start, end)`，指定的值填充至数组中，`ES6`新增，用一个固定值填充一个数组中从起始索引到终止索引内的全部元素。不包括终止索引。所有参数均可选。

```js
var arr = ['a', 'b', 'c', 'd'];
arr.fill('e', 2, 4);
console.log(arr);
//['a', 'b', 'e', 'e']
```

覆盖后返回的数组和原数组是同一引用。

```js
var arr = ['a', 'b', 'c', 'd'];
var newArr = arr.fill('e', 2, 4);
console.log(newArr === arr); //true
```

只有两个参数时，填充范围是当前索引至最后一项。

```js
var arr = ['a', 'b', 'c', 'd'];
var newArr = arr.fill('e', 1);
console.log(newArr);
//['a', 'e', 'e', 'e']
```

只有一个参数时，填充范围是第0项到最后一项。

```js
var arr = ['a', 'b', 'c', 'd'];
var newArr = arr.fill('e');
console.log(newArr);
//['e', 'e', 'e', 'e']
```

当第二第三参数为负数时，填充范围是负数加数组长度的区间。

```js
var arr = ['a', 'b', 'c', 'd'];
var newArr = arr.fill('e', -3, -1);
console.log(newArr);
//['a', 'e', 'e', 'd']
```

当没有参数时，默认给第一参数传`undefined`，同时说明参数一是**可选**的。

```js
var arr = ['a', 'b', 'c', 'd'];
var newArr = arr.fill();
console.log(newArr);
//[undefined, undefined, undefined, undefined]

var newArr2 = arr.fill(undefined);
console.log(newArr2);
//[undefined, undefined, undefined, undefined]
```

当第二第三参数一样时，没有覆盖范围，不做填充处理。

```js
var arr = ['a', 'b', 'c', 'd'];
var newArr = arr.fill('e', 1, 1);
console.log(newArr);
//['a', 'b', 'c', 'd']
```

当所有参数都为非数字时，没有覆盖范围，不做填充处理。

```js
var arr = ['a', 'b', 'c', 'd'];
var newArr = arr.fill('e', 'f', 'g');
console.log(newArr);
//['a', 'b', 'c', 'd']
```

当第二参数为数字其余参数为非数字时，没有覆盖范围，不做填充处理。

```js
var arr = ['a', 'b', 'c', 'd'];
var newArr = arr.fill('e', 1, 'g');
console.log(newArr);
//['a', 'b', 'c', 'd']
```

当第三参数为数字其余参数为非数字时，第二参数被填写为0，按照范围来进行填充。

```js
var arr = ['a', 'b', 'c', 'd'];
var newArr = arr.fill('e', 'f', 2);
console.log(newArr);
//['e', 'e', 'c', 'd']
```

当第二第三参数为`NaN`时，非数字就全部是字符，没有覆盖范围，不做填充处理。

```js
var arr = ['a', 'b', 'c', 'd'];
var newArr = arr.fill('e', NaN, NaN);
console.log(newArr);
//['a', 'b', 'c', 'd']
```

当第二第三参数为`null`时，没有覆盖范围，不做填充处理。

```js
var arr = ['a', 'b', 'c', 'd'];
var newArr = arr.fill('e', null, null);
console.log(newArr);
//['a', 'b', 'c', 'd']
```

当第二第三参数为`undefined`时，相当于只有一个参数时，填充范围是第0项到最后一项。

```js
var arr = ['a', 'b', 'c', 'd'];
var newArr = arr.fill('e', undefined, undefined);
console.log(newArr);
//['e', 'e', 'e', 'e']
```

当第二为数字第三参数为`undefined`时，填充范围是当前索引至最后一项。

```js
var arr = ['a', 'b', 'c', 'd'];
var newArr = arr.fill('e', 1, undefined);
console.log(newArr);
//['a', 'e', 'e', 'e']
```

当第三参数为数字第二参数为非数字时，第二参数被填写为0，按照范围来进行填充。

```js
var arr = ['a', 'b', 'c', 'd'];
var newArr = arr.fill('e', undefined, 2);
console.log(newArr);
//['e', 'e', 'c', 'd']
```

非数组的情况下的填充。只要定义了对象的长度，就会填充内容。`fill`方法设计之初就为一个通用的方法，不总是要求数组去执行该方法，强制改变指向后同样也可以让一个对象去使用该方法。

```js
var newArr = Array.prototype.fill.call({ length: 4 }, 'e');
console.log(newArr);
//{0: 'e', 1: 'e', 2: 'e', 3: 'e', length: 4}
```

可以通过`fill`方法**创建一个类数组方法**。将数组转为一个类数组。

```js
function makeArrayLike(arr) {
  var _arrayLike = {
    length: arr.length,
    push: Array.prototype.push,
    splice: Array.prototype.splice
  };
  
  // console.log(_arrayLike);
  //Object(3) [empty × 3, push: ƒ, splice: ƒ]

  arr.forEach(function (item, index) {
    Array.prototype.fill.call(_arrayLike, item, index, index + 1);
  });

  return _arrayLike;
}

console.log(makeArrayLike(['a', 'b', 'c']));
//Object(3) ['a', 'b', 'c', push: ƒ, splice: ƒ]
```

以上的遍历过程如下：

```js
[empty, empty, empty, push: ƒ, splice: ƒ] 
//a 0 1
[a, empty, empty, push: ƒ, splice: ƒ] 
//b 1 2
[a, b, empty, push: ƒ, splice: ƒ] 
//c 2 3
[a, b, c, push: ƒ, splice: ƒ] 
```

## `find`

`ES6`新增，返回数组中满足提供的测试函数的第一个元素的值。否则返回 `undefined`。

```js
var arr = [1, 2, 3, 4, 5];
var item = arr.find((item) => item > 3);
console.log(item); //4
```

分析一下，`find`方法参数函数内部的返回值是一个布尔值，`find`遍历每一次判断的结果布尔值，直到结果是`true`才会返回第一个符合条件为`true`结果的那一项索引的数组元素。

```js
var arr = [1, 2, 3, 4, 5];
var item = arr.find(function (item) {
  var bool = item > 3;
  // console.log(bool); false false false true
  return bool;
});
```

当`find`方法参数函数内部的判断条件不符合时(没有一个元素满足条件)返回`undefined`。

```js
var arr = [1, 2, 3, 4, 5];
var item = arr.find((item) => item > 5);
console.log(item); //undefined
```

如果数组元素是引用值时，返回满足条件的数组元素，并且说明当前符合条件的返回的数组元素，与原数组中相应数组索引的数组元素是**同一引用**。

```js
var arr = [
  { id: 1, name: 'lulu' },
  { id: 2, name: 'icy' },
  { id: 3, name: 'bob' }
];
var item = arr.find((item) => item.id === 1);
console.log(item);
//{id: 1, name: 'lulu'}

console.log(item === arr[0]); //true
```

`find`方法的第一参数是回调函数，它有三个参数。第二个参数是`this`指向改变。非严格模式环境下默认指向`window`。

```js
var arr = [1, 2, 3, 4, 5];
var item = arr.find(function(item, index, array){
  console.log(item, index, array);
}, {a: 1});
```

遇到稀疏数组时，且设定不符合条件的返回值让其一直遍历，测试稀疏数组时遇到空的数组元素时**仍然会**判断是否符合条件。当遍历到空隙时会显示`undefined`。说明`find`会遍历稀疏数组的空隙，遇到`empty`时会被`undefined`占位。

> **注意**： `ES5`的遍历方法如`forEach`，`map`，`filter`，`reduce`，`some`，`every`等都不会遍历稀疏数组的空隙，只会遍历有值的索引。侧向说明`find`的遍历效率是低于`ES5`数组拓展遍历方法。

```js
var arr = [1, , 3, , 5];
var item = arr.find((item) => {
  // console.log('go'); 执行了5次
  // console.log('item'); undefined
  return false; //条件为不符合让其一直遍历下去
});
```

假如在参数回调函数内部对数组元素进行更改是**不能**更改的。

```js
var arr = [1, 2, 3, 4, 5];
var item = arr.find((item) => {
  item = item + 1;
});
console.log(arr);
```

假如在参数回调函数内部对数组进行数组元素新增，数组里元素的新增成功，但是`find`会在第一次执行回调函数的时候，拿到这个数组最初的索引范围。

```js
var arr = [1, 2, 3];
var item = arr.find((item) => {
  arr.push(4);
  console.log(item); //无法访问新增的数组元素
});
console.log(arr);
//[1, 2, 3, 4, 4, 4]
```

假如在参数回调函数内部对数组进行数组元素删除，每次遍历都会删除指定位置的数组元素，直到没有时`undefined`占位，直到没有找到指定位置的数组元素才会中止遍历。

```js
var arr = [1, 2, 3, 4, 5];
var item = arr.find((item) => {
  arr.splice(1, 1);
  console.log(item, arr); 
  //第一轮 1 [1, 3, 4, 5]
  //第二轮 3 [1, 4, 5]
  //第三轮 5 [1, 5]
  //第四轮 undefined [1]
  //第五轮 undefined [1]
});
```

`splice`删除了对应项，该项位置不保留，在数据最后补上`undefined`。但是使用`delete`关键字删除对应项，会保留该项位置，补上`undefined`。

```js
var arr1 = [1, , 3, , , , 7, 8, 9];
var arr2 = [1, 2, 3, , , , 7, 8, 9];
arr.find((item, index) => {
  if (index === 0) {
    //arr.splice(1, 1);
    delete arr2[2];
  }
  console.log(item);
  //1 3 undefinedx3 7 8 9 undefined
  //1 2 3 undefinedx4 7 8 9 
});
```



## `findIndex`

`ES6`新增，返回数组中满足提供的测试函数的第一个元素的索引。若没有找到对应元素则返回`-1`。

```js
var arr = ['a', 'b', 'c'];

var idx = arr.findIndex((item) => item === 'b');
console.log(idx); //1
```

数组长度为空时，找不到对于元素返回`-1`。

```js
var arr = [];

var idx = arr.findIndex((item) => item > 2);
console.log(idx); //-1
```

遍历稀疏数组时，对空缺项是`undefined`占位遍历，直到遍历找到符合条件的第一项后中止遍历，忽略后面还没有遍历的元素。

```js
var arr = [, 2, ,];

var idx = arr.findIndex(function (item) {
  // console.log(item); undefined 2 
  return item === 2;
});
console.log(idx); //1
```

由于在第一次调用回调函数的时候已经确认数组的范围(`length`)，即使回调函数内部`splice`删除了数组中的某一项元素(并不会用`undefined`占位该项)，最终还是根据长度去遍历相应次数，最后一次遍历没有元素时是`undefined`。

```js
var arr = [1, 2, 3, 4, 5];

var idx = arr.findIndex(function (item, index) {
  if (index === 0) {
    arr.splice(1, 1);
  }
  console.log(item); //1 3 4 5 undefined
});
console.log(arr);
//[1, 3, 4, 5]
```

`delete`关键字删除数组某些时会`undefined`占位。实际数组中，对应下标会变成空隙。

```js
var arr = [1, 2, 3, 4, 5];

var idx = arr.findIndex(function (item, index) {
  if (index === 0) {
    delete arr[1];
  }
  console.log(item); //1 undefined 3 4 5
});
console.log(arr);
//[1, empty, 3, 4, 5]
```

`pop`删除元素下标对应的值，补`undefined`，实际数组删除了最后一项。

```js
var arr = [1, 2, 3, 4, 5];

var idx = arr.findIndex(function (item, index) {
  debugger;
  if (index === 0) {
    arr.pop(); //删除最后一项
  }
  console.log(item); //1 2 3 4 undefined
});
console.log(arr);
//[1, 2, 3, 4]
```

## `flat`

扁平化，二维数组转为一维数组，不能多层扁平化，`ES2019`新增，兼容性不太好，会按照一个可指定的深度递归遍历数组，并将所有元素与遍历到的子数组中的元素合并为一个新数组返回。`flat`方法的返回值和原数组并**不是**同一引用。

```js
var arr = [0, 1, [2, 3, [4, 5]], 6];
var newArr = arr.flat();
console.log(newArr);
//[0, 1, 2, 3, Array(2), 6]

console.log(newArr === arr);  //false
```

`flat`方法不传参数或者只传参数为`1`时至扁平化一层。但参数为正无穷时`Infinity`，深度无穷大的扁平化。

```js
var arr = [0, 1, [2, 3, [4, 5]], 6];
var newArr1 = arr.flat();
var newArr2 = arr.flat(1);
var newArr3 = arr.flat(2);
console.log(newArr1);
console.log(newArr2);
console.log(newArr3);
//[0, 1, 2, 3, Array(2), 6]
//[0, 1, 2, 3, Array(2), 6]
//[0, 1, 2, 3, 4, 5, 6]
```

当参数传入字符串时不能扁平处理，传入数字字符串可以先`Number()`处理再传入数字进行扁平处理。

```js
var arr = [0, 1, [2, 3, [4, 5]], 6];
var string1 = arr.flat('a');
console.log(string1);
//[0, 1, Array(3), 6]

var string2 = arr.flat('3');
console.log(string2);
//[0, 1, 2, 3, 4, 5, 6]
```

当参数传入数字`0`时，不能做扁平处理。只能接收`1-Infinity`的数字。

```js
var arr = [0, 1, [2, 3, [4, 5]], 6];
var number = arr.flat(0);
console.log(number);
//[0, 1, Array(3), 6]
```

当参数传入`false`时先`Number()`处理再传入数字，不做处理。`true`时只能扁平一层。

```js
var arr = [0, 1, [2, 3, [4, 5]], 6];
var bool1 = arr.flat(false);
console.log(bool1);
//[0, 1, Array(3), 6]
var bool2 = arr.flat(true);
console.log(bool2);
//[0, 1, 2, 3, Array(2), 6]
```

遇到稀疏数组时，忽略空隙。

```js
var arr = [0, , , 1, [2, , , 3, , , [4, , , 5]], , , 6];
var narr = arr.flat(Infinity);
console.log(narr);
//[0, 1, 2, 3, 4, 5, 6]
```

浅扁平化

```js
//写法1： 利用concat拼接值和数组
function shallowFlat(arr) {
  return arr.reduce(function (prev, item) {
    return prev.concat(item);
  }, []);
}

console.log(shallowFlat([0, 1, [2, 3, [4, 5]], 6]));
//[0, 1, 2, 3, [4, 5], 6]
```

```js
//写法2 利用es6展开运算符平铺数组
function shallowFlat(arr) {
  return [].concat(...arr);
}

console.log(shallowFlat([0, 1, [2, 3, [4, 5]], 6]));
```

深度扁平化

```js
//写法 栈的思想
Array.prototype.deepFlat = function () {
  var arr = this,
    stack = [...arr],
    res = [];

  //只要数组长度不为0 说明栈里有内容时会一直循环
  while (stack.length) {
    //删除并返回最后一项
    var popItem = stack.pop();

    //当最后一项是数组时
    if (Array.isArray(popItem)) {
      //平铺数组并逐一放入栈里
      stack.push(...popItem);
    } else {
      res.push(popItem);
    }
  }

  /**
   * 分析过程
   * 1.只要栈里有内容时进行循环
   * 2.删除栈的最后一位
   * 3.将被删的最后一位进行判断是否数组
   *   a.是数组时
   *     平铺数组并push进栈里
   *   b.不是数组时
   *     把非数组项push进res里
   *
   * 假如：
   * stack = [0, 1, [2, 3, [4, 5]], 6]
   * 第一轮
   * 1.pop拿到 6，stack = [0, 1, [2, 3, [4, 5]]]
   * 2.不是数组，放入res容器 res = [6]
   * 第二轮
   * 1.pop拿到 [2, 3, [4, 5]]，stack = [0, 1]
   * 2.是数组，将其平铺 再放入 stack 里 stack = [0, 1, 2, 3, [4, 5]]
   * 3.res 依然是 res = [6]
   * 第三轮
   * 1.pop拿到 [4, 5], stack = [0, 1, 2, 3]
   * 2.是数组，将其平铺 再放入 stack 里 stack = [0, 1, 2, 3, 4, 5]
   * 3.res 依然是 res = [6]
   * 第四轮
   * 1.pop拿到 5 ，stack = [0, 1, 2, 3, 4]
   * 2.不是数组，放入res容器 res = [6, 5]
   * 第五轮
   * 1.pop拿到 4 ，stack = [0, 1, 2, 3]
   * 2.不是数组，放入res容器 res = [6, 5, 4]
   * 第六轮
   * 1.pop拿到 3 ，stack = [0, 1, 2]
   * 2.不是数组，放入res容器 res = [6, 5, 4, 3]
   * 第七轮
   * 1.pop拿到 2 ，stack = [0, 1]
   * 2.不是数组，放入res容器 res = [6, 5, 4，3，2]
   * 第八轮
   * 1.pop拿到 1 ，stack = [0]
   * 2.不是数组，放入res容器 res = [6, 5, 4，3，2, 1]
   * 第九轮
   * stack.length = 0 中止while
   * 给res数组进行翻转拿到最终扁平化的数据
   */
  return res.reverse();
};

console.log([0, 1, [2, 3, [4, 5]], 6].deepFlat());
//[0, 1, 2, 3, 4, 5, 6]
```

## `flatMap`

`ES2020`，兼容性较差，首先使用映射函数映射每个元素，然后将结果压缩成一个新数组。它与 `map `连着深度值为 1 的 `flat `几乎相同，但 `flatMap `通常在合并成一种方法的效率稍微高一些。

模拟`flatMap`实现的过程：

```js
var arr = ['123', '456', '789'];

//1.先映射每一项再分割
var newArr = arr.map((item) => {
  // console.log(item.split(''));
  /**
   * ['1', '2', '3']
   * ['4', '5', '6']
   * ['7', '8', '9']
   */
  return item.split('');
});

//2.获取返回映射分割后的数组集合
// console.log(newArr);
//[Array(3), Array(3), Array(3)]

//2.将数组集合进行一维扁平
console.log(newArr.flat());
//['1', '2', '3', '4', '5', '6', '7', '8', '9']
```

尝试查看`flatMap`遍历的每一项。当分割处理每一项后返回时发现不用`flat`，该方法已经遍历和扁平化操作了，所以**效率更高**一点。返回值**不是**同一引用，是一个新的数组。

```js
var arr = ['123', '456', '789'];

var newArr = arr.flatMap((item) => {
  // console.log(item);
  //123 456 789

  // console.log(item.split(''));
  /**
   * ['1', '2', '3']
   * ['4', '5', '6']
   * ['7', '8', '9']
   */
  return item.split('');
});

console.log(newArr);
//['1', '2', '3', '4', '5', '6', '7', '8', '9']

console.log(newArr === arr); //false
```

应用场景是处理字符串。假设接收了后端的字符串数组处理后仍需要扁平化。

```js
var arr = ['My name is kevin', "I'm 30", 'years old.'];

var newArr = arr.flatMap(function (item) {
  return item.split(' ');
});

console.log(newArr);
//['My', 'name', 'is', 'bob', "I'm", '30', 'years', 'old.']
```

`flatMap`的另外一个作用是遍历每一项时，新增项或修改项或删除项的额外操作。假设该项遇到负数时会和前一项相加，还要打印相加的字符串。`flatMap`适合既然运算又要新增项，还要扁平化。

```js
var arr = [1, -2, -3, 5, 8, -9, 6, 7, 0];

var newArr = arr.flatMap(function (item, index) {
  //该项小于0为负数 并且 该项索引要大于0表示不能为第一项 时
  if (item < 0 && index > 0) {
    //打印这一项与上一项相加的字符
    return [item, `${item} + ${arr[index - 1]} = ${item + arr[index - 1]}`];
  }
  return item;
});

console.log(newArr);
//[1, -2, '-2 + 1 = -1', -3, '-3 + -2 = -5', 5, 8, -9, '-9 + 8 = -1', 6, 7, 0]
```

实现一个`myFlatMap`方法。

```js
var arr = [1, -2, -3, 5, 8, -9, 6, 7, 0];

Array.prototype.myFlatMap = function () {
  var arr = this,
    cb = arguments[0],
    res = [],
    item;

  for (var i = 0; i < arr.length; i++) {
    //获取用户返回的结果
    item = cb.apply(cb, [arr[i], i, arr]);
    //将所有结果放入数组
    item && res.push(item);
  }

  //将带有结果的数组进行扁平化处理
  return res.flat();
};
```



## `includes`

`ES2016`即`ES7`新增，用来判断一个数组是否包含一个指定的值，根据情况，如果包含则返回 `true`，否则返回 `false`。`includes`方法的不传参时直接返回`false`。

```js
var arr = [1, 2, 3, 4, 5];
console.log(arr.includes(3)); //true
```

区分字符串数字与数字。

```js
var arr = ['1', 'a', 3, 4, 5];
console.log(arr.includes(1)); //false
console.log(arr.includes('A')); //false
```

字符串原型上的`includes`方法也是区分大小写的。

```js
var str = 'abcde';
console.log(str.includes('c')); //true
console.log(str.includes('C')); //true
```

`includes`方法的第二个参数是开始查找的索引。可选的，默认值为0。

```js
var arr = [1, 2, 3, 4, 5];
console.log(arr.includes(5, 3)); //true
console.log(arr.includes(3, 3)); //false
```

`includes`方法的第二个参数的默认长度是1，如果传入负值时是长度加上负值。当第二参数的开始索引大于数组长度时，直接返回`false`，不会进行搜索。当开始索引小于`0`时，整个数组都会搜索。

```js
console.log(arr.includes(3, -3));
```

零值相等时，`SAME-VALUE-ZERO`.。

```js
var arr = [1, 2, 3, 4, 5];
console.log(arr.includes(0)); //true
console.log(arr.includes(-0)); //true
console.log(arr.includes(+0)); //true
```

当其他类型调用`includes`方法时。

```js
console.log(Array.prototype.includes.call(1, 'a')); //false 1 包装成对象 不含有 a
console.log([].includes.call(true, 'a')); //false
console.log([].includes.call({ 0: 'a' }, 'a')); //false
console.log([].includes.call({ 0: 'a', length: 1 }, 'a')); //true
```



## `sort`

`ES3`，对数组的元素进行排序，并返回数组。它返回原数组的引用，不进行数组引用赋值。使用了原地算法。在浏览器`V8`引擎里，如果`arr.length <= 10`时使用插入排序，如果`arr.length > 10`时使用快速排序，性能上的区别。在`Mozilla`里使用了归并排序，`Webkit`使用了`C++`的库`QSort`方法实现快速排序。

```js
var arr = [5, 3, 1, 2, 6, 4];
var newArr = arr.sort();
console.log(newArr);
//[1, 2, 3, 4, 5, 6]
console.log(newArr === arr);
//true
```

`sort`方法并不会按照数字大小进行排序。

```js
var arr = [5, 3, 100, 1, 6];
console.log(arr.sort());
//[1, 100, 3, 5, 6]
```

`sort`方法也支持对字符串的排序。经过`toString`方法的过程，将数组元素转为字符串，根据`DOMStrring`是`UTF-16`字符串的实现，会映射到`String`构造函数上去构建字符串。每个字符串都是`UTF-16`字符串，通过`String`或`DOMString`实例化出来的。按照`UTF-16`的编码顺序来进行排序的。

转成字符串的原因是数字如果仅限于一种类型的排序时，`sort`的功能性就不高，希望有一种规则让所有的类型都可以进行排序，所有通过字符串和字符串编码集结合一起排序形成规则，这样可排序的范围就会变大。

```js
var arr = ['n', 's', 'e', 't', 'z', 'a'];
console.log(arr.sort());
//['a', 'e', 'n', 's', 't', 'z']
```

`sort`方法也支持对布尔值类型的排序。

```js
var arr = [true, false];
console.log(arr.sort());
//[false, true]
```

根据字符串的逐个字符进行编码位的排序。

```js
var arr = ['abc', 'aba'];
console.log(arr.sort());
//['aba', 'abc']
```

`sort`方法的参数1是可选的，是一个对比方法。该参数方法里有两个参数分别是`fElement`和`sElement`。当`sort`方法传入对比方法时，除非对比方法里定义了排序规则，否则默认不排序，区别于`sort`方法不传参时，会进行排序。

```js
var arr1 = [5, 2, 3, 1, 4];
var arr2 = [5, 2, 3, 1, 4];

console.log(arr1.sort());
//[1, 2, 3, 4, 5]
console.log(arr2.sort(function (fElement, sElement) { }));
//[5, 2, 3, 1, 4]
```

参数函数是自己写一个规则，假如返回是负数时，`a`就会排在`b`的前面；返回的是正数时，`b`就会排在`a`的前面；返回是`0`时，`a`和`b`不进行排序操作。

```js
var arr = ['rose', 'jack', 'bob', 'lulu'];

console.log(
  arr.sort(function (a, b) {
    // console.log(a, b);
    //第一轮 jack rose
    //第二轮 bob jack
    //第三轮 lulu bob
    
    if(a < b) { return -1; }
    if(a > b) { return 1; }
    if(a === b) { return 0; }
  })
);
```

当直接返回`-1`时，`a < b`。

```js
var arr = [5, 7, 3, 2, 8, 1];

console.log(
  arr.sort(function (a, b) { return -1; })
);
//[1, 8, 2, 3, 7, 5]
```

当直接返回`1`时，`a > b`。

```js
var arr = [5, 7, 3, 2, 8, 1];

console.log(
  arr.sort(function (a, b) { return 1; })
);

//[5, 7, 3, 2, 8, 1]
```

当直接返回`0`时，`a === b`。

```js
var arr = [5, 7, 3, 2, 8, 1];

console.log(
  arr.sort(function (a, b) { return 0; })
);

//[5, 7, 3, 2, 8, 1]
```

非`ASCII`字符串排序时，只能使用字符串原型上的`localeCompare`的方式去比较排序。

```js
var arr = ['rose', 'jack', 'bob', 'lulu', 'andy'];
// var arr = [5, 7, 3, 2, 8, 1];

console.log(
  arr.sort(function (a, b) {
    return a.localeCompare(b);
  })
);

//['andy', 'bob', 'jack', 'lulu', 'rose']
```

给大小写区分的字符串进行排序。

```js
var arr = ['driver', 'car', 'Tomato', 'Baby'];
console.log(
  arr.sort(function (a, b) {
    //首先全部转小写
    var _a = a.toLowerCase(),
      _b = b.toLowerCase();
    if (_a < _b) { return -1; }
    if (_a > _b) { return 1; }

    //其它情况
    return 0;
  })
);
//['Baby', 'car', 'driver', 'Tomato']
```

