# `Map`&`Set`

## 引用类型

一个变量在系统中是一个标识，对应了一个空间或一个地址。

一个变量的值可以有基本类型的值，如`number`，`string`，`undefined`，`null`，`boolean`，`NaN`，`Symbol`，开发层面上基本类型的值是不可变的。在计算机层面，一个值不可变化的原因是从内存的角度上去理解的。修改内存比开辟新的内存空间的消耗更大。一个变量的值也可以有引用类型值，如`Object`，`Array`，`Function`，`Map`，`Set`。它们像是一个容器，目的是让容器内部装入更多的值，容器内部装载的值是可以变化的。

栈内存存储的是基本类型值，同样也可以存储指向引用值的地址标识，而堆内存存储的引用类型值。区分的原因是程序运行的时候栈内存只能开辟空间，垃圾回收机制负责回收空间，且栈内存无法对简单类型的值进行更改，想要改变值只能在引用值里去更改。

一个标识引用了一个空间时，如`var obj = {}`，叫做强引用。当`obj = null`时，指针断了，标识无法对空间进行访问，同时标识的值变成了`null`，当被访问时只能拿到`null`。在`ES6`之前是没有区分引用的强弱，均为强引用。

引用是可以被多次引用的。当引用次数变为`0`的时候，`JavaScript`垃圾回收机制会试图在某一个不可预测的时刻进行回收。引用次数的都算是强引用。

```JS
var obj = {}; //1次引用
var obj2 = obj; //2次引用
obj = null;
```

当定义的闭包数量过多时，造成内存不释放溢出的问题。可以手动将变量赋值为`null`，等待垃圾回收机制在某个时刻进行回收引用并将其释放。在低级编程语言中没有手动去释放内存，会造成内存溢出。垃圾回收机制是不对弱引用进行计数的，可以直接回收。



## 对象和数组

在`JavaScript`中本身没有数组的概念，数组是一种有序的数据结构并具有长度，也可以`push`，`splice`操作，数组也是一个对象的顶层模拟实现，对象的属性是数组的索引，即字符串的数字。

在`JavaScript`中对象是无序结构，键值一一对应的关系有点类似`Map`结构的映射关系。

在`ES2015`规范中建议浏览器厂商按照开发者定义的属性顺序来进行解析。`ES2020`规范中建议浏览器厂商对待继承属性按照开发者定义的属性顺序来进行解析。



## `Set`概述

`Set`是`ES6`新增的一种数据类型，它是一个构造函数。类似于数组的数据结构，但它的成员是唯一的。

```js
console.log(Set);
//ƒ Set() { [native code] }
```

通过实例化的方式获取一个`set`实例数据。

```js
const set = new Set();
//console.log(set); Set(0) {size: 0}
```

查看`set`实例数据原型上的属性和方法，具有迭代器接口。

```js
console.log(Object.getPrototypeOf(set));
/**
 * Set {
 *   constructor: ƒ, 
 *   has: ƒ, 
 *   add: ƒ, 
 *   delete: ƒ, 
 *   clear: ƒ,
 *   entries: ƒ,
 *   forEach: ƒ,
 *   keys: ƒ,
 *   values: ƒ,
 *   Symbol(Symbol.iterator): ƒ,
 *   Symbol(Symbol.toStringTag): ƒ,
 *   get size: ƒ,
 *   size: 0,
 * }
 */
```

尝试个`set`数据通过传入参数(具备迭代器接口)的方式去新增成员。

```js
const set = new Set();
set.add('a');
set.add('b');
console.log(set); //Set(2) {'a', 'b'}
```

`set`实例数据里的成员是唯一的。初始化`set`数据时先定义初始成员，当新增的成员与初始成员一样时会无法新增。

```js
const set = new Set(['a', 'b']);
set.add('a');
set.add('b');
set.add('c');
console.log(set); //Set(3) {'a', 'b', 'c'}
```

当传入相同的成员时，`set`数据只保留一位成员。

```js
const set = new Set(['undefined', 'undefined', null, null, true, true, NaN, NaN, {}, {}]);
console.log(set); //Set(4) {'undefined', null, true, NaN, {}, {}}
```

## `Set`增删查

尝试通过`add()`方法新增对象成员。该方法返回当前`set`实例，说明可以链式调用`add()`方法去新增成员。

```js
let x = { id: 1 };
let y = { id: 2 };
const set = new Set();
set.add(x);
set.add(y);
console.log(set);
/**
 * Set(2) {
 *   [[Entries]]: {
 *     0: { value: {id: 1} },
 *     1: { value: {id: 2} },
 *   },
 *   size: 2
 * }
 */
console.log(set.add(x));
//Set(2) {{…}, {…}}
console.log(set.add(x).add({ id: 3 }));
//Set(3) {{…}, {…}, {…}}
```

尝试打印当前`set`数据的长度。

```js
const set = new Set(['a', 'b']);
console.log(set.size); //2
```

尝试通过`delete()`方法删除当前`set`数据的某个成员数据，该方d当删除某个成员数据成功时返回布尔值`true`，当删除一个不存在的成员时返回布尔值`false`。

```js
const set = new Set(['a', 'b']);
console.log(set.delete('a')); //true
console.log(set); //Set(1) {'b'}
set.delete('a'); //false
```

尝试通过`clear()`方法清空当前`set`数据的所有成员数据，该方法返回值为`undefined`。

```js
const set = new Set(['a', 'b']);
console.log(set.clear()); //undefined
console.log(set); //Set(0) {size: 0}
```

`has()`方法可以判断当前`set`实例数据中是否有某个成员数据。

```js
const set = new Set(['a', 'b']);
console.log(set.has('a')); //true
console.log(set.has('c')); //false
```

## `Set`遍历

尝试使用`entries()`方法来给`set`实例数据进行遍历，它的返回值是一个迭代器对象。通过`for..of`遍历可以获取键值组成的数组，由于没有键名只有键值，所以键值组成的数组的两个数组元素是一样的。

```js
const set = new Set(['a', 'b']);
console.log(set.entries());
/**
 * SetIterator {
 *   [[Entries]]: {
 *     0: {"a" => "a"},
 *     1: {"b" => "b"}
 *   }
 * }
 */
for(let i of set.entries()){ console.log(i) };
//['a', 'a']
//['b', 'b']
```

尝试使用`keys()`方法来给`set`实例数据进行遍历，它的返回值是一个迭代器对象。由于`set`数据没有键名，只有键值，所以返回键值的集合。

```js
const set = new Set(['a', 'b']);
console.log(set.keys());
//SetIterator {'a', 'b'}
/**
 * SetIterator {
 *   [[Entries]]: {
 *     0: "a",
 *     1: "b"
 *   }
 * }
 */
for(let i of set.keys()){ console.log(i) };
//a b
```

尝试使用`values()`方法来给`set`实例数据进行遍历，它的返回值是一个迭代器对象，遍历的内容与`keys()`方法遍历出的内容一样。

```js
const set = new Set(['a', 'b']);
console.log(set.values());
//SetIterator {'a', 'b'}
/**
 * SetIterator {
 *   [[Entries]]: {
 *     0: "a",
 *     1: "b"
 *   }
 * }
 */
for(let i of set.keys()){ console.log(i) };
//a b
```

由于`set`实例数据本身具有迭代器接口`Symbol.iterator`，可以直接通过`for..of`进行遍历。

```js
const set = new Set(['a', 'b']);
for(let i of set){ console.log(i) }; //a b
```

实际上，`set`原型上迭代器接口方法与`values()`方法和`keys()`是同一个方法引用。

```js
console.log(Set.prototype[Symbol.iterator] === Set.prototype.values); //true
console.log(Set.prototype[Symbol.iterator] === Set.prototype.keys); //true
```

尝试使用`forEach()`方法来给`set`实例数据进行遍历。

```js
const set = new Set(['a', 'b']);
set.forEach((value, key, arr) => {
  console.log(value); //a b
  console.log(key); //a b
  console.log(arr); //Set(2) {'a', 'b'}
});
```

## `Set`应用

利用拓展运算符可以对一个具备迭代器接口的数据进行展开操作。

```js
const set = new Set(['a', 'b']);
console.log(...set); //a b
```

利用拓展运算符对`set`数据进行展开，再通过一个数组进行收集，变成了一个数组，并通过`map()`方法进行映射从而修改对应成员的数据，最后通过`new Set()`给映射后的数组数据进行包装后获取包含`set`数据的映射成员。

```js
const set = new Set(['1', '2']);
const mapArr = [...set].map(value => value * 2);
console.log(mapArr); //[2, 4]
const newSet = new Set(mapArr);
console.log(newSet); //Set(2) {2, 4}
```

利用`Array.from()`方法的参数2`mapFn`，同样可以进行映射从而修改对应成员的数据。

```js
const set = new Set(['1', '2']);
const mapArr = Array.from(set, value => value * 2);
console.log(mapArr); //[2, 4]
const newSet = new Set(mapArr); 
console.log(newSet); //Set(2) {2, 4}
```

对`set`数据进行交集`INTERSECT`并集`UNION`差集`EXCEPT`操作，在`SQL`中常见的操作，数据库中表示记录的集合，对表，视图，查询的执行结果都是记录的集合。

- 交集时，不包含`A`，不包含`B`，包含`A&B`公共部分。
- 并集时，包含`A`，包含`B`，包含`A&B`公共部分。
- 差集时，包含`A`，不包含`B`，不包含`A&B`公共部分。(`B`同理)

实现并集，利用展开运算符平铺`A`部分的`set`数据，平铺`B`部分的`set`数据，再用一个数组将两个`set`数据进行收集后再创建一个新的`set`数据，创建的同时由于`set`成员唯一性的特性并对其进行去重操作，拿到新的并集数据。

```js
let a = new Set([1, 2, 3]);
let b = new Set([4, 3, 2]);
let union = new Set([...a, ...b]); 
console.log(union); //Set(4) {1, 2, 3, 4}
```

实现交集，首先利用展开运算符平铺`A`部分的`set`数据，再用一个数组将`A`部分的`set`数据进行收集后再对其进行过滤操作，利用`has()`方法判断`B`部分的`set`数据是否存在与数组相同的成员，返回相同的成员作为数组元素的一个数组，最后将这个数组再进行`Set`包装返回一个`set`数据，拿到交集部分的成员。

```js
let a = new Set([1, 2, 3]);
let b = new Set([4, 3, 2]);
let intersect = new Set([...a].filter(x => b.has(x)));
console.log(intersect); //Set(2) {2, 3}
```

实现差集，原理和交集差不多，只是过滤的时候取反返回不符合的成员。

```js
let a = new Set([1, 2, 3]);
let b = new Set([4, 3, 2]);
let diff = new Set([...a].filter(x => !b.has(x)));
console.log(diff); //Set(1) {1}
```



## `Map`概述

`Map`是一个复杂的`Object`，具有有序性，键名可以是任意的值，键名是唯一不重复的。

***明明对象也可以定义的键名和键值描述的结果可以类似于`Map`数据的结果，为什么仍要去使用`Map`数据去描述？***

在面向对象开发时，大量对数据操作的类，类与类之间实例化后的对象可以通过`Map`数据进行关联存放，方便查找对象里的属性和方法，减少代码量，实际应用场景是`vue`中对依赖监听时对某个依赖数据和修改数据的方法进行关联，也可以做自定义指令时，`dom`节点与相应逻辑方法关联。

`Map`是`ES6`新增的一种数据类型，它是一个构造函数。类似对象的存在，键值是完全一一对应的，键名不限于是字符串数据。

```js
console.log(Map);
//ƒ Map() { [native code] }
```

通过实例化的方式获取一个`map`实例数据。

```js
const map = new Map();
```

查看`map`实例数据原型上的属性和方法，具有迭代器接口。

```js
console.log(Object.getPrototypeOf(map));
/**
 * Map {
 *   constructor: ƒ, 
 *   has: ƒ, 
 *   delete: ƒ, 
 *   clear: ƒ,
 *   entries: ƒ,
 *   forEach: ƒ,
 *   keys: ƒ,
 *   values: ƒ,
 *   Symbol(Symbol.iterator): ƒ,
 *   Symbol(Symbol.toStringTag): ƒ,
 *   get: ƒ,
 *   set: ƒ,
 *   get size: ƒ,
 *   size: 0,
 * }
 */
```

当尝试给一个对象的属性名赋值为一个对象时，会调用`toString()`方法将属性名进行字符串转换，返回`[object Object]`作为属性名。当再次给一个对象的属性名赋值一个对象时，同样调用`toString()`方法返回同样的属性名，此时会存在属性名一样而属性值覆盖的问题。

```js
const m = {};
let x = { id: 1 };
let y = { id: 2 };
m[x] = 'foo';
m[y] = 'bar';
console.log(m); //{[object Object]: 'bar'}
console.log(m[x]); //bar
console.log(m[y]); //bar
```

由于以上无法进行属性名赋值一个唯一的对象作为键值，`ES6`提供的新的数据结构`Map()`来解决。

定义一个`map`实例的数据，尝试通过`set()`方法给让一个对象作为键名，让一个字符串作为键值。通过`get()`方法可以获取相应的键值。

```js
const m = new Map();
let x = { id: 1 };
let y = { id: 2 };

m.set(x, 'foo');
m.set(y, 'bar');
console.log(m); //Map(2) {{…} => 'foo', {…} => 'bar'}
console.log(m.get(x)); //foo
```

在实例化`new Map()`的过程传入参数可以作为默认值。`Map`也是具备迭代器接口的数据结构，并且传入参数必须是一个二维数组结构，内层数组第一项是键名，第二项是键值。

```js
const m = new Map([
  //[键名, 键值]
  ['name', 'zhangsan'],
  ['id', '1']
]);
console.log(m); 
//Map(2) {'name' => 'zhangsan', 'id' => '1'}
```

## `Map`增删查

同样也可以通过`set()`方法给一个`map`实例数据进行定义多个键名键值。

```js
const m = new Map();
m.set('name', 'zhangsan');
m.set('id', '1');
console.log(m); 
//Map(2) {'name' => 'zhangsan', 'id' => '1'}
```

模拟将键名和键值遍历到`map`数据里。

````js
const items = [
  ['name', 'wangwu'],
  ['id', '1']
];
const m = new Map();
items.forEach(([key, value]) => {
  //console.log(key, value); //name wangwu
  m.set(key, value);
});
console.log(m);
//Map(2) {'name' => 'wangwu', 'id' => '1'}
````

当同样在`map`实例中定义了相同引用为键名时，键值会存在覆盖问题。

```js
const map = new Map();
map.set(1, 'foo');
map.set(1, 'bar');
console.log(map.get(1)); //bar
```

当给`map`实例数据定义一个`-0`原始值作为键名时，通过`+0`也可以获取值。

```js
const map = new Map();
map.set(-0, 123);
console.log(map.get(+0)); //123
console.log(+0 === -0); //true
console.log(Object.is(+0, -0)); //false
```

当给`map`实例数据定义一个`NaN`原始值作为键名时，通过`NaN`也可以获取值。

```js
const map = new Map();
map.set(NaN, 123);
console.log(map.get(NaN)); //123
console.log(NaN === NaN); //false
console.log(Object.is(NaN, NaN)); //true
```

当给`map`实例数据定义一个`true`原始值作为键名时，通过`true`也可以获取值。

```js
const map = new Map();
map.set(true, 123);
console.log(map.get(true)); //123
```

当给`map`实例数据定义一个`undefined`或`null`原始值作为键名时，通过`undefined`或`null`也可以获取值。

```js
const map = new Map();
map.set(undefined, 123);
map.set(null, 456);
console.log(map.get(undefined)); //123
console.log(map.get(null)); //456
```

以上都能说明键名和键值都成了一一对应的关系。

尝试通过`delete()`方法给`map`实例数据的某一项进行删除操作。该方法删除成功时返回`true`。

```js
const m = new Map();
let x = { id: 1 };
let y = { id: 2 };
m.set(x, 'foo');
m.set(y, 'bar');
console.log(m.delete(x)); //true
console.log(m); //Map(1) {{…} => 'bar'}
```

尝试通过`clear()`方法给`map`实例数据的进行成员清空操作。该方法没有返回值。

```js
const m = new Map();
let x = { id: 1 };
let y = { id: 2 };
m.set(x, 'foo');
m.set(y, 'bar');
console.log(m.clear()); //undefined
console.log(m); //Map(0) {size: 0}
```

`has()`方法可以对`map`实例数据里的成员进行判断是否存在。

```js
const m = new Map();
let x = { id: 1 };
let y = { id: 2 };
m.set(x, 'foo');
m.set(y, 'bar');
console.log(m.has(x)); //true
console.log(m.has({ id: 3 })); //false
```

## `Map`遍历

`map`实例的遍历方法与`set`实例的遍历方法完全一致。

```js
const m = new Map();
let x = { id: 1 };
let y = { id: 2 };
m.set(x, 'foo');
m.set(y, 'bar');
console.log(m.entries());
//MapIterator {{…} => 'foo', {…} => 'bar'}
for(let keys of m.keys()){ console.log(keys) }; 
//{id: 1} {id: 2}
for(let values of m.values()){ console.log(values) }; 
//foo bar
for(let entries of m.entries()){ console.log(entries) };
//[{…}, 'foo'] [{…}, 'bar']
```

## `Map`转换

`map`实例数据常用于对数组或对象进行相互的转化。可以利用拓展运算符将`map`实例数据平铺在使用数组收集从而转化为二维数组结构。

```js
const m = new Map();
m.set(true, 7).set({foo: 3}, ['abc']);
console.log([...m]);
//[[true, 7], [{foo: 3}, ['abc']]]
```

可以利用`Object.create()`方法创建一个对象并指定原型，通过`map`实例的`entries()`方法遍历出成员的键名和键值，再将键名和键值组装到新创建的对象里，从而转化为对象结构。

```js
const m = new Map();
m.set(true, 7).set('a', ['abc']);

function strMapToObj(strMap) {
  let obj = Object.create(null);
  //迭代键名键值
  for (let [key, val] of strMap.entries()) {
    obj[key] = val;
  }
  return obj;
}

console.log(strMapToObj(m));
//{true: 7, a: ['abc']}
```

相反，对一个对象对`map`数据的转化，可以通过`for..in`对对象进行遍历，获取对象的键名键值，分别对键名和键值通过`set()`方法给`map`数据进行定义，最后拿到`map`数据。

```js
function objToStrMap(obj) {
  let strMap = new Map();
  for (let key in obj) {
    strMap.set(key, obj[key])
  }
  return strMap;
}

console.log(objToStrMap({ true: 7, 'no': false }));
//Map(2) {"true" => 7, "no" => false}
```

## 序列号

`Map`数据并不能对序列号进行支持。可以手写一个解决方案，利用`JSON.stringify()`方法去处理`m`数据，参数2去具体定义返回的内容，这些对容是一个对象字符串数据，包含了`type`属性和`value`属性和对应的属性值。

```js
const m = new Map([['a', 1], ['b', 2]]);
console.log(m); //Map(2) {'a' => 1, 'b' => 2}
const res = JSON.stringify(m, (k, v) => {
  console.log(v);
  //Map(2) {'a' => 1, 'b' => 2}
  console.log(v.entries());
  //MapIterator {'a' => 1, 'b' => 2}
  if(v instanceof Map){ //是map数据时
    return {
      type: 'Map',
      value: [ ...v.entries() ]
    }
  }else{ //是对象数据时
    return v; 
  }
});
console.log(res); //{"type":"Map","value":[["a",1],["b",2]]}
```

将`JSON.stringify()`方法拿到的对象字符串通过`JSON.parse()`方法进行解析，参数2去具体定义返回的内容，这些对容是一个`map`数据。

```js
const m = JSON.parse('{"type":"Map","value":[["a",1],["b",2]]}', (k, v) => {
  console.log(v); //解析后的散乱内容 map a 1 b 2
  if(typeof v === 'object' && v !== null){
    if(v.type === 'Map'){
      return new Map(v.value);
    }
  }
  return v;
});
console.log(m); //Map(2) {'a' => 1, 'b' => 2}
```





## 对比数组

`map`数据与数组数据的新增操作进行对比。

```js
const m = new Map();
const arr = new Array();
m.set('t', 1);
arr.push({ 't': 1 });
console.log(m); //Map(1) {"t" => 1}
console.log(arr); //[{t: 1}]
```

`map`数据与数组数据的查找操作进行对比。

```js
const m = new Map();
const arr = [{t: 1}];
console.log(m.has('t')); //false
console.log(arr.find(val => val['t'])); //{t: 1}
```

`map`数据与数组数据的修改操作进行对比。

```js
const m = new Map();
const arr = [{t: 1}];
m.set('t', 2);
console.log(m); //Map(1) {'t' => 2}
arr.forEach(item => item.t ? item.t = 2 : '');
console.log(arr); //[{t: 2}]
```

`map`数据与数组数据的删除操作进行对比。

```js
const m = new Map();
const arr = [{t: 1}];
m.set('t', 2);
m.delete('t');
console.log(m); //Map(0) {}
let index = arr.findIndex(item => item.t);
arr.splice(index, 1);
console.log(arr); //[]
```

两种结构增删查写法的对比下，`map`结构的写法更为简便一些。

`set`数据与数组数据的新增操作进行对比。

```js
const s = new Set();
const arr = [];
s.add({t: 1});
arr.push({t: 2});
console.log(s); //Set(1) {{t: 1}}
console.log(arr); //[{t: 1}]
```

`set`数据与数组数据的查找操作进行对比。

```js
const s = new Set();
const obj = {t: 1};
const arr = [{t: 2}];
s.add(obj);
console.log(s.has(obj)); //true
console.log(arr.find(val => val['t'])); //{t: 2}
```

`set`数据与数组数据的修改操作进行对比。

```js
const s = new Set();
s.add({t: 1});
const arr = [{t: 2}];
s.forEach(item => item.t ? item.t = 3: '');
console.log(s); //Set(1) {{t: 3}}
arr.forEach(item => item.t ? item.t = 4 : '');
console.log(arr); //[{t: 4}]
```

`set`数据与数组数据的删除操作进行对比。

```js
const s = new Set();
s.add({t: 1});
const arr = [{t: 2}];
s.forEach(item => item.t ? s.delete(item) : '');
console.log(s); //Set(0) {size: 0}
let index = arr.findIndex(item => item.t);
arr.splice(index, 1);
console.log(arr); //[]
```

两种结构增删查写法的对比下，`set`结构的写法更为简便一些。





## 对比对象

`map`数据或`set`数据与对象数据的新增操作进行对比。

```js
const item = { t: 1 };
const m = new Map();
const s = new Set();
const obj = {};
m.set('t', '2');
s.add(item);
obj['t'] = 3;
console.log(m); //Map(1) {'t' => '2'}
console.log(s); //Set(1) {{t: 1}}
console.log(obj); //{t: 3}
```

`map`数据或`set`数据与对象数据的查找操作进行对比。

```js
const item = { t: 1 };
const m = new Map();
const s = new Set();
const obj = {};
console.log(m.has('t')); //false
console.log(s.has(item)); //false
console.log(obj.hasOwnProperty('t')); //false
```

`map`数据或`set`数据与对象数据的修改操作进行对比。

```js
const item = { t: 1 };
const m = new Map();
const s = new Set([item]);
const obj = {};
m.set('t', '2');
s.forEach(item => item.t ? item.t = 3 : '');
obj['t'] = 4;
console.log(m); //Map(1) {'t' => '2'}
console.log(s); //Set(1) {{t: 3}}
console.log(obj); //{t: 4}
```

`map`数据或`set`数据与对象数据的删除操作进行对比。

```js
const item = { t: 1 };
const m = new Map([['t', 2]]);
const s = new Set([item]);
const obj = { t: 3 };
m.delete('t');
s.delete(item);
delete obj['t'];
console.log(m); //Map(0) {size: 0}
console.log(s); //Set(0) {size: 0}
console.log(obj); //{}
```

`map`数据或`set`数据在对对象进行增删查操作，比数组进行增删查操作的写法更为简单，更为优雅。涉及到数据结构的考量上，能尽量使用`map`数据就尽量少用数组。假如对数据结构的唯一性有要求时就使用`set`数据。



