# `WeakMap`&`WeakSet`

## 概述

`WeakMap`和`WeakSet`它的键名始终是引用值，是一个弱引用值。当垃圾回收机制计数不对其进行引用值进行计数时，这种引用模式叫弱引用。

`WeakMap`和`WeakSet`与`Map`和`Set`基本是一致的，唯一不一样的地方像是一个阉割的版本，不存在遍历的方法。他们都属于弱引用，回收机制中不会考虑`WeakMap`和`WeakSet`的引用，如果没有被其他对象进行引用`WeakMap`或`WeakSet`时，会自动回收当前对象所占用的内存。

在低级编程语言中像`C`需要手动分配内存，而高级编译语言像`JavaScript`可以自动分配内存。对数据进行读写就是使用内存的过程，低级语言需要手动释放内存，高级语言则通过垃圾回收机制进行释放内存。

垃圾回收机制回收的时机是无法预测的，并且引用对强引用的解除是与`WeakMap`或`WeakSet`没有任何关系的情况下，它里面的成员是不稳定的，`size`属性也会不准确的，造成一系列遍历方法会不准确的。

```
const obj = { a: {b: {c: 1 }}};
console.log(typeof(new obj.constructor))
```



## 增删查

尝试查看`WeakMap`结构的原型，里面有非常少的方法，仅有增删查方法，没有遍历的方法。

```JS
const wMap = new WeakMap();
console.log(Object.getPrototypeOf(wMap));
/**
 * WeakMap {
 *   constructor: ƒ, 
 *   delete: ƒ, 
 *   get: ƒ, 
 *   set: ƒ, 
 *   has: ƒ,
 *   Symbol(Symbol.toStringTag): "WeakMap"
 * }
 */
```

尝试查看`WeakSet`结构的原型，里面有非常少的方法，仅有增删查方法，没有遍历的方法。

```js
const wSet = new WeakSet();
console.log(Object.getPrototypeOf(wSet));
/**
 * WeakSet {
 *   constructor: ƒ, 
 *   delete: ƒ, 
 *   add: ƒ, 
 *   has: ƒ,
 *   Symbol(Symbol.toStringTag): "WeakSet"
 * }
 */
```

假如希望`WeekMap`或`WeakSet`数据进行存储时，仅支持对象数据作为成员。

```js
const wMap = new WeakMap();
wMap.set({}, 1);
console.log(wMap); //WeakMap {{…} => 1}
wMap.set(1, 1);
console.log(wMap);
//Uncaught TypeError: Invalid value used as weak map key
```

```js
const wSet = new WeakSet();
wSet.add({});
console.log(wSet); //WeakSet {{…}}
wSet.add(1);
console.log(wSet);
//Uncaught TypeError: Invalid value used in weak set
```



## 应用

利用`WeakMap`数据，在对象进行深度克隆时，对里面的引用进行记录，假如已经递归过一次的引用进行保存，达到解决避免多次递归的问题的目的。

```js
function deepClone(data, hash = new WeakMap()){
  if(!data || typeof data !== 'object') return data;
  if(hash.get(data)) return hash.get(data);
  const obj = {};
  hash.set(data, obj);
  for(let k in data){
    if(data.hasOwnProperty(k)){
      obj[k] = deepClone(data[k], hash);
    }
  }
  return obj;
}
```

