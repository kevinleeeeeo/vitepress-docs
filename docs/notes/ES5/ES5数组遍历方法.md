# `ES5`数组方法

## 前言

数组扩展方法非常重要，在`ES5`才开始支持，对`JavaScript`某些不完整的方法上的修正。不像`ES6`那么大的变革，`ES5`对`ES3`来说仅仅是小的增删补的更新。增加的方法有数组的遍历，筛选等方法。



## `forEach`

遍历是循环的一种高级的说法，遍历针对数据而循环针对于算术。它是数组原型上的方法。`forEach`参数1是一个函数，数据每一次遍历元素都会执行一次该函数。参数2是更改参数1函数内部指向。

```js
[].forEach(function(elem, index, array){}, {a: 1});
```

> 备注：`this`指向只能指向一个对象，不可以是原始值，只能是引用值和原始值包装类。

兼容`ES3`方式重写`forEach`：

```js
Array.prototype.myForEach = function (cb) {
  var arg2 = arguments[1] || window,
    _arr = this,
    len = _arr.length,
    elem;

  for (var i = 0; i < len; i++) {
    elem = _arr[i];
    cb.call(arg2, elem, i, _arr);
  }
};
```



## `filter`

筛选或过滤某一些不必要的数据。应用场景很多，如选项卡。它返回一个新的数组(不影响原有数组数据)，将过滤后的数据存入新数组中。当参数1函数内部返回`true`时新数组会有所有的数据，内部返回`false`时新数组没有数据。说明`filter`通过一个布尔值来判断哪一次遍历出来的数据要放入新数组里。参数2是更改参数1函数内部指向。

```js
var newArr = [].filter(function(elem, index, array){
  if(elem.xxx === 'x') return true; 
}, {a: 1});
```

兼容`ES3`方式重写`filter`：

```js
Array.prototype.myFilter = function (cb) {
  var arg2 = arguments[1] || window,
    _arr = this,
    len = _arr.length,
    elem,
    bool,
    _newArr = [];
  for (var i = 0; i < len; i++) {
    bool = cb.call(arg2, _arr[i], i, _arr);
    if (bool) {
      elem = _arr[i];
      _newArr.push(elem);
    }
  }
  return _newArr;
};
```

但是以上重写会有缺点，就是当修改新数组的某一项引用时会导致同时修改了原有数组里的某一项引用数据，解决办法是遍历时对每一项引用进行深拷贝避免修改原有引用。

```js
Array.prototype.myFilter = function (cb) {
  var arg2 = arguments[1] || window,
    _arr = this,
    len = _arr.length,
    elem,
    bool,
    _newArr = [];
  for (var i = 0; i < len; i++) {
    bool = cb.call(arg2, _arr[i], i, _arr);
    if (bool) {
      //对每一项进行深拷贝
      elem = deepClone(_arr[i]);
      _newArr.push(elem);
    }
  }
  return _newArr;
};
```

## `map`

映射关系，返回一个新的数组。比`filter`的功能还要宽泛一些，只要参数函数返回当前遍历出的某一项数组元素就可以存入新数组中，此时可以对当前数组元素进行加工后再放入新数组中。参数函数可以返回所有类型的值，它会把遍历出的所有所有类型的值存入新数组中。

```js
var newArr = [].map(function(elem, index, array){
  //可以返回任意类型的值,如原始值或引用值,并不会修改原数组数据。
  return elem; 
}, {a: 1});
```

`BUG`: 当修改某项数组元素的引用值时放入新数组里会导致同时修改原数组的值，原因是引用值一旦修改了都会影响原数组。

```js
var newArr = data.map(
  function (elem, index, array) {
    elem.course = this.prefix + elem.course;
    return elem;
  },
  { prefix: '[HOT]' }
);

//解决办法是可以通过ES6的展开运算符展开返回对象的所有属性，并新定义一个新的引用值来保存修改的值
var newArr = data.map(
  function (elem, index, array) {
    //定义一个新的引用值来存入新修改的内容
    return {
      ...elem,
      course: this.prefix + elem.course,
    };
  },
  { prefix: '[HOT]' }
);
```

兼容`ES3`方式重写`map`并修复修改引用值`BUG`问题：

```js
Array.prototype.myMap = function (cb) {
  var arg2 = arguments[1] || window,
    _arr = this,
    len = _arr.length,
    elem,
    _cbRes,
    _newArr = [];
  for (var i = 0; i < len; i++) {
    //对每一项进行深拷贝
    elem = deepClone(_arr[i]);
    _cbRes = cb.call(arg2, elem, i, _arr);
    _newArr.push(_cbRes);
  }
  return _newArr;
};
```



## `every`

`every`每次遍历都会执行参数里的回调函数，如果有一个不满足条件就会停止遍历(`break`)，条件就是`return`后面的表达式，只要有一个数组元素不满足就会返回一个`false`。

```js
var res = [].every(function(elem, index, array){
  return elem.is_free == '0';
}, {a: 1});

console.log(res); //false
```

兼容`ES3`方式重写`every`：

```js
Array.prototype.myEvery = function (cb) {
  var arg2 = arguments[1] || window,
    _arr = this,
    len = _arr.length,
    ret = true;
  for (var i = 0; i < len; i++) {
    if (!cb.apply(arg2, [_arr[i], i, _arr])) {
      ret = false;
      break;
    }
  }
  return ret;
};
```



## `some`

`some`每次遍历都会执行参数里的回调函数，如果有一个满足条件就会停止遍历，条件就是`return`后面的表达式，只要有一个数组元素满足就会返回一个`true`。

```js
var res = [].some(function(elem, index, array){
  return elem.is_free == '0';
}, {a: 1});

console.log(res); //true
```

兼容`ES3`方式重写`some`：

```js
Array.prototype.mySome = function (cb) {
  var arg2 = arguments[1] || window,
    _arr = this,
    len = _arr.length,
    ret = false;
  for (var i = 0; i < len; i++) {
    if (cb.apply(arg2, [_arr[i], i, _arr])) {
      ret = true;
      break;
    }
  }
  return ret;
};
```



## `reduce`

归纳函数，场景是`react`状态管理，底层的数据筛选和归纳的功能几乎都是`reduce`来实现的。数据的规划和划分都能用到`reduce`，避免使用`for`循环，存在的目的是完成数据归纳的工作。优点是更好的维护和更新。

`reduce`在本质上和遍历没有什么区别，参数1是回调函数且多次执行，执行的次数是调用数据的长度，回调函数参数`prev`是数组，返回`prev`，参数2`initialValue`为初始数组是必填的。

首次回调函数执行时，参数`prev`和参数`initialValue`指向同一引用，往后多次执行的结果是`undefined`，证明每次遍历数据时回调函数里必须返回`prev`后`prev`才会有值且让程序执行往下进行，每次返回`prev`之前都可以操作`prev`数据。

`reduce`函数返回一个新的数组。归纳函数在条件范围之内，往一个新数组容器里放入符合的数组元素。

> 备注：`initialValue`可以定义为数组也可以是对象。

```js
var newArr = [].reduce(function(prev, elem, index, array){
  console.log(prev === initialValue); //true undefined undefined ...
  //数据归纳
  prev.push(elem.course);
  if (elem.is_free === '0') { prev.push(elem); }
  return prev;
}, initialValue);
```

兼容`ES3`方式重写`reduce`：

```js
Array.prototype.myReduce = function (cb, initialValue) {
  var arg3 = arguments[2] || window,
    _arr = this,
    _len = _arr.length,
    _elem;
  for (var i = 0; i < _len; i++) {
    _elem = deepClone(_arr[i]);
    initialValue = cb.apply(arg3, [initialValue, _elem, i, _arr]);
  }
  return initialValue;
};
```

兼容`ES3`方式重写`reduceRight`：

```js
Array.prototype.myReduceRight = function (cb, initialValue) {
  var arg3 = arguments[2] || window,
    _arr = this,
    _len = _arr.length,
    _elem;
  for (var i = _len - 1; i >= 0; i--) {
    _elem = deepClone(_arr[i]);
    initialValue = cb.apply(arg3, [initialValue, _elem, i, _arr]);
  }
  return initialValue;
};
```







































