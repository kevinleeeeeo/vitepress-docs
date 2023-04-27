# `Proxy`&`Reflect`





## `Proxy`

它是设计模式之中其中的代理模式，`ES6`新增，它是代理模式的一种实现。在目标之间设置拦截层，在外界想要访问这个对象的时候，就必须通过该拦截。

基本的拦截方式是`getter`，`setter`，对应了读取和赋值操作，`has()`方法拦截的是对象中`in`操作符，判断属性是否在当前的对象里，存在特殊情况是在`for`循环内部无法进行`in`操作符的拦截操作。

希望有一个代理函数，对多个处理数据的方法进行管理，如链式调用执行多个方法后最后到`get()`方法才一次计算最后的结果。

```js
window.double = n => n * 2;
window.pow = n => n * n;
window.reverseInt = n => 
  n.toString()
   .split('')
   .reverse()
   .join('');
console.log(pipe(3).double.pow.reverseInt.get);
```

该代理函数在每次`.xxx`访问属性名称时进行拦截，并将这些属性名称`push`进一个数组数据进行管理，直到遇到`get`属性名称才统一计算。

```js
const pipe = (number) => {
  const arr = [];
  const proxy = new Proxy({}, {
    get(target, props, receiver){
      console.log(target); //{}
      console.log(props); //'double'
      console.log(receiver); //Proxy(Object) {}
      if(props === 'get'){
        console.log(arr);
        //console.log(arr); //[ƒ, ƒ, ƒ]
        //求值计算
        return arr.reduce((prev, item) => {
          return item(prev);
        }, number);
      }
      arr.push(window[props]); //传入函数
      return receiver;
    }
  });
  console.log(proxy); //Proxy(Object) {}
  return proxy;
}
```

`handler.set()`方法用于拦截对象赋值时的操作，参数1`target`对将要被代理的源对象，参数2`propery`是`.xxx`访问时的属性名称，参数3`value`是`.xxx=10`赋值的值，参数4`receiver`是被代理后的`proxy`对象。

```js
let person = new Proxy({}, {
  set(target, property, value, receiver){}
});
person.age = 10;
```

`handler.apply()`方法用于拦截函数调用时的操作。

```js
const sum = (a, b) => a + b;
const handler = {
  apply(target, thisArg, arguments) {
    console.log(target, thisArg, arguments);
    //(a, b) => a + b 
    //undefined
    //[1, 2]
    return target(arguments[0], arguments[1] * 10);
  }
};

const proxy = new Proxy(sum, handler);
console.log(sum(1, 2)); //3
console.log(proxy(1, 2)); //21
```

`Proxy`代理与`Object.defineProperty()`定义属性方法像完成同一个功能，但原理完全不一样，有了`vue`存在，`proxy`与`Object.defineProperty()`有了交集。

`Object.defineProperty()`给对象增加属性，修改数组的长度，用索引设置元素的值，数组的`push`, `pop`, 等一系列方法是无法触发`Object.defineProperty()`里的`setter`方法，所以`vue2.x`版本里对数组的所有的操作都是`vue`再封装，并不是原生的`push`,`pop`等方法，导致`vue`代码非常的重，但`Proxy`可以正常使用原生的数组方法，比较轻便，不影响`set`方法使用，在数据拦截编写操作时更加合理，功能更加强大。

`Object.defineProperty()`是对数据进行劫持，给对象进行拓展，属性进行设置。而`Proxy`并不是数据劫持，通过处理一个对象，返回一个代理对象，操作代理对象对数据进行操作。`Proxy`可以自定义对象属性的获取，赋值，枚举，函数调用的等功能。

`Proxy`不仅可以操作对象，还可以操作数组和函数。

```js
var arr = [];
var fn = function(){...}
let proxy1 = new Proxy(arr, {
  get(arr, prop){ return arr[prop]; }
});

let proxy2 = new Proxy(fn, {
  get(fn, prop){ return fn[prop]; }
});
```

`Proxy`重写：

```js
function MyProxy(target, handler) {
  //传入的target需要处理，并且是一个新的target克隆对象
  let _target = deepClone(target);

  function deepClone(org, t ar) {
    var tar = tar || {},
      toStr = Object.prototype.toString,
      arrType = '[object Array]';

    //遍历原来传入的对象
    for (var key in org) {
      //判断是否含有自身属性
      if (org.hasOwnProperty(key)) {
        //判断自身的属性值是否是对象并且不能为null
        if (typeof (org[key]) === 'object' && org[key] !== null) {
          //判断对象里属性值是否为数组
          if (toStr.call(org[key]) === arrType) {
            //是数组 将新的对象的属性值创建为一个新的空数组
            tar[key] = [];
          } else {
            //不是数组 将新的对象的属性值创建为一个新的空对象
            tar[key] = {};
          }
          //递归底层的属性值 深克隆
          deepClone(org[key], tar[key]);
        } else {
          //不是对象的情况就让其变为对象
          tar[key] = org[key];
        }
      }
    }
    return tar;
  }

  //拷贝完后，遍历键名和键值
  //Object.keys()遍历出自身的可枚举的键名(不含继承属性)
  Object.keys(_target).forEach(function (key) {
    //Proxy实现用defineProperty定义属性
    Object.defineProperty(_target, key, {
      //handler里面有get/set函数
      //get有target, prop参数
      //set有target, prop, value参数
      //get函数里必须有返回值return
      get() {
        //有get函数时执行它并传入对象和属性
        return handler.get && handler.get(target, key);
      },
      set(newValue) {
        handler.set && handler.set(target, key, newValue);
      }
    });
  });

  //最终返回处理好的对象
  return _target;
}
```

`Proxy`的内部方法如`has`/`set`/`get`/`deletePropert`等转发给`target`对象，调用`Proxy`的方法相当于调用`target`相应的方法, `handler`方法可以复写任意代理内部的方法，可以通过`handler`重写`Proxy`上面的内部的方法，外界每次通过`Proxy`访问`target`对象属性的时候会经过`handler`里面每一个方法，因此可以通过重写`handler`对象中的一些方法来做一些拦截。



## `Reflect`

是一个对象, 是`JavaScript`内置对象方法集合的容器。`Reflect`的出现解决了`ES5`对对象原型方法和其余方法的一些混淆，造成对象原型庞大以及定义的模糊不清。

```js
console.log(Reflect);
```

整合了`ES5`对象原型上原有的方法的`ES6`(静态方法)。

- `apply()`
- `defineProperty()`
- `deleteProperty()`
- `get()`
- `getOwnPropertyDescriptor()`
- `getPrototypeof()`
- `has()`
- `isExtensible()`
- `ownKeys()`
- `preventExtensions()`
- `set()`
- `setPrototypeOf()`

通过`Reflect`访问对象。它与`Proxy`的方法是一一对应的。

```js
console.log(obj.a);
console.log(Reflect.get(obj, 'a'));
```

利用函数式的写法重新定义`Proxy`构造函数，代替了`ES5`使用操作符的方式去操作对象，用函数方法去取值或赋值使得更为合理。

```js
let proxy = new Proxy(target, {
  get(target, prop){
    //写法1 直接访问返回
    //return 'This is property value' + target[prop];
    //写法2 通过函数式返回
    return Reflect.get(target, prop);
  },
  set(target, prop, value){
    //写法1 target[prop] = value;
    //写法2
    Reflect.set(target, prop, value);
  }
});
```



