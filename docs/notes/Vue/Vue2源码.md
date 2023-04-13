# 源码实现

## `ViewModel`

`vue2.x` 中 `Options API` 中的`data`函数返回一个对象实现了数据的响应式处理。

```JS
//vue2.x写法在源码里是一个Vue构造函数实例化传入一个options参数
let vm = new Vue({
  el: '#app',
  data(){ return {} }
});
```

数据劫持其实在初始化的时候已经完成了。

```JS
Vue.prototype._init = function(){ initState(vm); }
```

***什么叫初始化状态`initState`？***

`state`是 保存的数据被定义为状态，状态的更改使视图发生更改，在 `vue2` 里，如`computed`，`data`, `watch`等配置项也归纳为`state`状态的一部分。

**_为什么要缓存另外的一个`_data`?_**

不希望操作它将用户编写的`vm.$options.data`，所以要区分开来。

```js
var data = vm.$options.data;
data = vm._data = typeof data === 'function'
  //如果用户编写的data是函数就执行该函数
  ? data.call(vm)
  //如果不是就放入用户些的data对象或者是空对象
  : data || {};
```

**_为什么要用代理？_**

如果用户想要访问`data`下的属性，需要`vm.$options.data.title`/`vm.$options.data().title`而不是`vm.title`访问，不便于开发编写，所以需要通过`defineProperty`代理。

```js
for (var key in data) {
  // title/classNum/total/teacher/students
  defineProperty(data, key, {
    //访问该属性的时候进行拦截并返回想要的数据
    get(){
      return vm['_data'][key];
    },
    set(newValue){
      vm[_data][key] = newValue;
    }
  });
}
```

**_为什么要观察`data`?_**

通过观察者模式不仅对`data`进行观察，对内部的属性也要观察，如果内部的属性是对象就要做相关的拦截，如果是数组要对数组方法的拦截。

**_为什么观察者对象/数组是一个类或构造函数`Observer`来处理?_**

因为修改的对象或数组里的属性是不确定的，有时候也会有新增内容，所以需要实例化一个`Observe`构造函数来写较为合适。

**_`Observer`构造函数内部如何实现数据观察？_**

通过`Object.keys()`遍历拿到`data`里所有的`key`和`value`，并将其通过`defineProperty`做下一步的响应式数据处理。

**_为什么不能对数组进行`defineProperty`?_**

因为数组本身`defineProperty`是不处理数组的，当然可以用一些方法去处理，但是比较麻烦，目的仅仅是为了拦截数组，那么就对数组中的方法进行重写。

**_为什么在 `vue2 `里需要重写数组里的原生方法?_**

- 需要保留原有的数组方法操作数据
- 希望在`push/unshift/splice`新增数组元素时新增更多业务逻辑

因为有些数组的数据变更并不能被 `vue` 检测到，操作数组的一些动作，如通过索引值修改值，或者修改长度，或者是调用一些`Array.prototype`上的方法并不能触发这个属性的`setter`, `splice`方法也可以触发状态更新，在 `vue2.x` 版本将数组的 7 个方法`push,pop,shift,unshift,splice,sort,reverse`重写,调用包装后的数组方法就可以被 `vue `检测到。

**_数据劫持的目的是什么？_**

不希望原生对对象和数组的操作是一个纯操作，而是赋值或操作数组的过程时仍可以新增新的业务逻辑进去，像绑定视图数据，希望数据变化的过程中，视图也跟随着变化，那么就必须拦截 `getter/setter` 行为，在拦截的过程中，保留原来数据的操作的同时可以更改视图。

**_为什么`observe`函数内部要`new Observer`构造函数？_**

不能直接让程序走到观察者构造函数而是需要提前判断`data`是否符合是一个对象的条件，观察者构造函数的任务仅仅是观察一个对象。

**_如何将`data`进行数据劫持？_**

通过`Object.definePropery`劫持子属性里的对象/数组包括深度劫持。

**实现流程：**

1. 初始化状态`initState`
2. 初始化数据`initData`
   1. 缓存`_data`并拿到里面的数据对象
   2. 代理属性访问方式
   3. 观察`data`内部
3. `observe`:
   1. 观察`data`是不是对象，如果不是对象不进行观察
   2. 对`data`对象进行观察`new Observer`
4. `Observer`:

   1. 对数组的处理：

      1. 定义`observeArr(data)`：

         1. 给`data`的原型`__proto__`新增重写好的 7 个数组方法
         2. 遍历数组里的每一项
         3. 对每一项数组元素进行观察`observe`

      2. 定义 7 个数组方法名称的数组

      3. 定义`array.js`:

         1. 创建保留原有数组操作方法的一个新的对象

         2. 遍历 7 个数组方法名称，对新的对象里的属性方法进行修改(重写数组方法)

            1. 保存形参的参数类数组列表
            2. 通过`slice`将类数组转为新的数组
            3. 执行原数组的所有方法并传入新的形参参数列表数组
            4. 给`push/unshift/splice`方法的参数改为保存的形参列表
            5. 给新增的数组参数数据劫持拦截`observeArr`
            6. 新增数组元素时更多业务逻辑

   2. 对对象的处理：

      1. `Observer.prototype.walk`:对`data`对象进行`definePropery`
      2. 遍历拿到所有的属性`key`和属性值`value`
      3. `defineReactiveData`:
         1. `defineProperty`对属性进行 `getter/setter `拦截
         2. `setter`内部设置值的时候，`newValue`不知道是否对象，如果是也要进行数据劫持拦截
         3. `observe`:递归深度拦截
         4. 此时 getter/setter 内部可以新增新的业务代码如视图更新等

**源码地址：**

https://gitee.com/kevinleeeee/data-hijacked-vue2.x-demo

---

<u>**案例：源码实现 `vue2.x`**</u>

- 功能 1：`observe `监听器/数据劫持/数据响应式/代理
- 功能 2：页面渲染
- 功能 3：编译文本/元素
- 功能 4：依赖收集实现读写数据时重新更新组件和渲染页面
- 功能 5：批量异步更新策略
- 功能 6：数组依赖收集
- 功能 7：`watch `实现
- 功能 8：计算属性 `computed `实现

```
//项目目录
├─package.json
├─Readme.md
├─webpack.config.js
├─src
|  └index.js
├─source
|   ├─vue
|   |  ├─index.js - Vue构造函数/初始化状态
|   |  ├─utils.js - 编译文本/元素/去空格/拿到data对象key属性的值
|   |  ├─observe
|   |  |    ├─array.js - 观察数组函数/原数组方法保留
|   |  |    ├─dep.js - 收集watcher/订阅/发布/定义管理stack里watcher静态方法
|   |  |    ├─index.js - 观察data/访问属性代理
|   |  |    ├─observer.js - 观察类/观察数组和对象/定义响应式
|   |  |    └watcher.js - 收集deps/depsId/管理stack里的watcher/更新组件和渲染/添加依赖方法
├─public
|   └index.html
```

![Reactivity Cycle](https://vuejs.org/images/data.png)

**功能 1 实现步骤：**

1. 编写 `Vue `构造函数，挂载 `option `到实例，且初始化数据状态
2. 挂载 `data `到实例并改写 `data `副本，代理并修改访问属性，对 `data `数据进行观察
3. 定义观察类函数，处理对象劫持和数组劫持
4. 定义响应式方法并对对象和数组数据进行新增 `getter/setter`
5. 定义观察数组函数在数组原型上保留原数组的操作方法并新增业务逻辑接口
6. 对嵌套的对象和数组进行观察和响应式处理

**_问题：如何渲染页面？_**

通过 `watcher `实例化后执行更新组件函数，组件函数内部执行实例原型上的更新函数，根据 `dom `节点渲染组件实现页面渲染

**功能 2 实现步骤：**

1. 定义 `Watcher `类实现页面渲染，初始化 `watcher`
2. 页面挂载时实例化 `watcher`,传入实例和更新组件函数
3. 定义更新函数，根据用户数据渲染组件
4. 将用户定义模板 `dom `节点保存到文档碎片里
5. 将文档碎片插入到 `el `里实现页面渲染

**功能 3 实现步骤：**

1. 在文档碎片插入 `el `之前定义一个编译函数
2. 处理文本节点，拿到 `key `值替换 `html `文本节点内容
3. 处理元素节点

**_问题：如何将 `data `定义的属性数据替换 `html `里定义的标签属性？_**

通过正则替换文本节点内容(`node.textContext`), 拿到 `key `以后再去获取 `data `数据里 `key `的值并作为被替换的文本的内容

**_问题：如何将`vm['person.name']`写法改为`vm['person']['name']`写法实现嵌套属性访问?_**

通过 `reduce `整理

```
//获取data数据里对应key属性的值
export function getValue(exp, vm) {
  //console.log(exp);
  //person.name

  //问题：明显vm['person.name']这样的写法是无法访问属性值
  //实际访问写法应该是vm['person']['name']

  //解决：通过reduce方法完成
  //1.以 . 作为分隔符分割字符串
  let keys = exp.split('.');
  //console.log(keys);
  //['person', 'name']

  //2.整理写法
  return keys.reduce((prev, next) => {
    prev = prev[next];
    return prev;
  }, vm);
}
```

**功能 4 实现步骤：**

1. 创建 `Dep `类(`data `里每个属性对应一个实例化的 `dep`,每个 `dep `对应一个唯一的 `id`)
2. 利用发布订阅模式收集订阅者，定义订阅方法和发布方法
3. 定义一个保存当前 `watcher `的函数
4. 定义一个删除栈里当前的 `watcher `的函数
5. 在 `watcher `类的 `get()`里使用入栈和出栈的 `dep `函数
6. 在定义响应式函数里的 `getter `新增执行订阅动作的逻辑(读取时会更新组件和渲染页面)
7. 在定义响应式函数里的 `setter `新增执行发布动作的逻辑(改写数据时会再次更新组件和渲染页面)
8. 在 `dep `类定义 `depend `方法
9. 在 `watcher `类里定义 `addDep `方法，定义一个 `deps `容器，`depsId `容器

关于 `Dep `类(依赖)：

- 有 `id `属性
- 有收集订阅者的数组容器(存放 `watcher`)
- 有发布 `notify `方法(遍历每一个 `watcher `并执行底下的 `update `方法)
- 有订阅 `addSub `方法(将每一个 `watcher `加入到容器里)
- 有 `depend `方法(将 `watcher `存入 `dep `中，然后把 `dep `也存入 `watcher `中 多对多)

关于 `Dep `静态属性和方法：

- 有 `stack `栈数组容器(存放 `watcher`)
- 有 `target `属性
- 有 `pushTarget `方法(将 `watcher `赋值给 `target`，并加入 `stack `栈里)
- 有 `popTarget `方法(删除 `stack `里的 `watcher`，`target `指向 `stack `里的前一位 `watcher`)

关于 `Wachcer `类：

- 有 `id `属性
- 有收集依赖的数组容器(存放 `dep`)
- 有 `depsId `的 `set `容器(存放 `depId`)
- 有 `addDep `方法(存放 `depId`, 将 `dep `加入到依赖容器, 执行 `dep.addSub` 方法)
- 有 `update `方法(执行 `get `方法)
- 有 `get `方法(执行 `pushTarget `方法，执行更新组件函数, 执行 `popTarget `方法)

![image-20211120011426679](http://note-img-bed.dt-code.fun/image-20211120011426679.png)

执行顺序：

1. `defineReactive `方法执行(`from observer`)
2. 实例化 `dep `依赖
3. `defineProperty `拦截
4. 当用户读取 `data `对象属性时执行 `get `方法
5. 当 `watcher `存在时执行 `dep.depend` 方法
6. 执行该项 `watcher `里的 `addDep `方法
7. 存放 `depId`, 将 `dep `加入到依赖容器, 执行 `dep.addSub` 方法
8. 将每一个 `watcher `加入到容器里
9. 当用户修改 `data `对象属性时执行 `set `方法
10. 执行 `dep.notify` 方法
11. 遍历每一个 `watcher` 并执行底下的 `update `方法
12. 执行 `pushTarget `方法，
13. 将 `watcher `赋值给 `target`，并加入 `stack `栈里
14. 执行更新组件函数
15. 执行 `popTarget `方法
16. 删除 `stack `里的 `watcher`，`target `指向 `stack `里的前一位 `watcher`

**功能 5 实现步骤：**

1. `watcher `里定义队列管理函数，将 `watcher `添加到队列里，执行 `nextTick `函数延迟清空队列
2. 执行 `nextTick `函数时传入 `flushQueue `清空队列函数(遍历队列所有 `watcher `并依次执行组件更新)
3. `nextTick `函数里将用户写的回调函数存入回调函数队列，将包裹着 `flushCallBacks `的回调函数 作为参数 传入 4 种异步的方法里

```
setTimeout(()=>{
  vm.message = 'Hi!';
  vm.message = 'Hey!';
  vm.message = 'Bye!';
},3000);
```

**_问题：如何只渲染一次拿到最后赋值的结果？_**

通过批量更新页面，避免重复渲染

```
//让flushCallBacks异步执行的几种方法
//看浏览器是否兼容异步方法

//方法一：Promise
if (Promise) {
  return Promise.resolve().then(timerFunction);
}

//方法二：html5 API
if (MutationObserver) {
  let observe = new MutationObserver(timerFunction);
  //假如有文本节点
  let textNode = document.createTextNode(10);
  //监听textNode变化
  //characterData变化证明文本节点发生变化
  observe.observe(textNode, {
    characterData: true
  });
  textNode.textContent = 20;
  return;
}

//方法三：类似setTimeout 性能优于setTimeout 老版本浏览器不兼容
if (setImmediate) {
  return setImmediate(timerFunction);
}

//方法四：
setTimeout(timerFunction, 0);
```

**功能 6 实现步骤：**

1. 给 `Observer `类 `new `了一个 `dep `实例
2. 给 `Observer `类里的 `data `数据多定义一个属性`__ob__`,`get `时返回实例，实现数组访问时可以拿到 `Observer `实例
3. 在 `defineReactive `函数里保存一个执行`observe(value)`时返回的实例，在 `get `访问时通过访问实例下 `dep `底下的依赖收集方法进行数组的依赖收集
4. 这样数组相关的 `watcher `放入 `dep `里面，一旦数组发生变化，通知 `watcher `进行重新的渲染
5. 定义 `dependArray `函数实现嵌套数组的依赖收集

**_问题：没有做数组依赖的会发生什么情况？_**

当 data 对象里面的数组被修改时，虽然修改成功，但是组件没有更新，页面也没有重新渲染

**功能 7 实现步骤：**

1. 在 `initState `函数里有定义 `options.watch` 配置项，且里面有 `initWatch `函数
2. 定义 `initWatch `函数: 打印`vm.$options.watch`可以拿到包含 `message `的对象`{message: ƒ}`
3. 循环对象里的每一项键值对，将该项属性的值(事件处理函数)保存为变量 `handler`
4. 定义 `createWatcher `方法，接收参数 `vm,key,handler`
5. `createWatcher `方法返回挂载在 `vm `实例 `$watch `方法的结果
6. 在原型上的`$watch `方法内部实例化`new Watcher(vm,expr,handler,{配置项});`
7. 定义`this.getter = function(){return getValue(watch属性名,实例)}`,该函数返回的结果是 `watch `里的属性的属性值是一个事件处理函数执行后的结果
8. 将 `Watcher `类里 `get `方法内部 `getter `方法执行的 `value `返回出去赋值给实例的`this.value`,此操作在每次实例化 `Watcher `时拿到旧的值
9. 当数据被修改时触发的发布的 `watcher `执行
10. `watcher.update` 方法执行，触发 `get `方法拿到新的值
11. 然后当新老值不一样的时候执行用户传入的回调函数
12. 返回用户想要的新老数据

**_问题：`watch `定义方式是怎么样的？_**

```
watch: {
  //如何监听message的变化？
  message: function(newValue, oldValue){
    console.log(newValue, oldValue);
  }
}
```

**功能 7 实现步骤：**

1. 定义 `initComputed `方法时创建 `watcher `实例
2. 定义 `watchers `,`let watchers = vm._watcherComputed = Object.create(null);`
3. 实例传入参数`vm, userDef, () => {}, {lazy: true}`
4. `lazy:true`配置为了首次实例化 `watcher `时不去取值
5. 将实例的结果赋值给带有用户定义属性名的对象里`watchers[key]`
6. `defineProperty `劫持属性，`get `时定义函数 `createComputedGetter `执行
7. `createComputedGetter `执行时返回`watcher.value`
8. 此时 `computed `实现了

**_问题：当更新属性发生变化时如何处理?_**

**源码地址：**

https://gitee.com/kevinleeeee/vue2.x-source-demo



## 数组变更

数组变更监测是`vue`的核心内容，在数据响应式中，对数组的赋值是可以触发`getter/setter`的。

```js
var vm = {
  data(){ return { list: [...] } }
}
    
vm.list = [2, 3, 4];
```

数组元素新增或删除时，可以触发`getter`, 但是无法触发`setter`。数据绑定时，数组等操作方法可以使得数据变化了，但是视图因为没有触发`setter`里的`update`方法导致无法更新。所以新增数组元素可以更改数组，但无法触发视图更新。

```js
vm.list.push(6);
vm.list.pop();
vm.list.shift();
vm.list.unshift();
vm.list.splice(2, 1);
vm.list.sort((a, b) => b - a);
vm.list.reverse();
```

以上说明`Object.defineProperty`方法是无法监听数组中修改原数组引用的操作方法。所以在`vue3`中的`Proxy`代理解决了对数组无法检测的问题。所以`vue2`对以上的原生数组方法进行包裹封装，能够在操作原数组方法的同时对视图进行更新操作。

```js
function push(){
  vm.list.push(6);
  update();  //视图更新
}
```

`vue2`实际上是对数组方法进行2次封装，并在`Array.prototype`原型中定义新的数组操作方法。

```js
var ArrayPrototype = Array.prototype;
var ARR_METHODS = ['pop', 'push', 'shift', 'unshift', 'sort', 'splice', 'reverse'];

ARR_METHODS.forEach(method => {
  method = function(...arg){
    ArrayPrototype[method].call(this, arg);
    //视图更新
    update();
  }
});
```

有些数组方法会返回新的数组引用用来替换原有数组引用，就不用对数组方法进行2次封装。

```JS
vm.list = vm.list.concat(7);
vm.lsit = vm.list.slice(1);
```

在`vue`中操作数组方法不一定会重新渲染整个`DOM`列表，造成性能耗费。`vue`在对`DOM`操作时进行了大量的新旧节点信息的对比算法，会将`DOM`重新渲染的程度最小化，做到已有的`DOM`节点最大化复用。





## 数据劫持

**数据劫持实现：**

基于 `vue2.x` 版本的数据劫持实现

**技术：**

`JavaScript ES5/webpack`/数据响应式/模板编译

希望在数据变化时增加额外的视图变化的代码

利用数据劫持给对象和数组属性新增 `getter/setter` 方法

**源码地址：**

https://gitee.com/kevinleeeee/data-hijacked-vue2.x-demo



## `data`属性

底层实现对 `data `里变量的读取/修改

```
//实现通过实例对象vm访问data里面的变量，可以访问和修改
var vm = new Vue({
  data() {
    return {
      a: 1,
      b: 2
    }
  }
});

function Vue(options) {
  //vue在创建实例的过程中调用data函数，返回数据对象
  this.$data = options.data();

  var _this = this;

  //希望访问的方式：this.a => this.$data.a
  for (var key in this.$data) {
    //独立作用域
    //k是当前作用域的临时局部变量
    (function (k) {

      //写法一：到IE8存在不兼容
      //代理方式修改访问/修改的方式
      //_this访问当前k
      Object.defineProperty(_this, k, {
        get: function () {
          return _this.$data[k];
        },
        set: function (newValue) {
          _this.$data[k] = newValue;
        }
      })

      //写法二：兼容性好,Mozilla的API
      //实例继承过来的方法
      //__defineGetter__(访问属性,回调函数)
      _this.__defineGetter__(k, function () {
        return _this.$data[k];
      });

      //__defineSetter__(访问属性,回调函数)
      _this.__defineSetter__(k, function (newValue) {
        _this.$data[k] = newValue;
      });

    })(key);
  }
}

console.log(vm);
/**
 * Vue {...}
 *   $data: {a: 1, b: 2}
 *   a: 1
 *   b: 2
 *   get a: ƒ ()
 *   set a: ƒ (newValue)
 */
```

## `methods`属性

实例方法挂载的实现

```js
//实例方法挂载的实现
var Vue = (function () {
  function Vue(options) {
    //每次实例化Vue执行data返回一个唯一的data对象防止指向同一个引用值
    this.$data = options.data();
    //挂载到实例上
    this._methods = options.methods;

    //传入实例本身
    this._init(this);
  }

  /**
   * 初始化实例对象里面的属性和方法
   * @param {*} vm 该组件实例
   */
  Vue.prototype._init = function (vm) {
    initData(vm);
    initMethods(vm);
  }

  //直接越过$data访问属性
  function initData(vm) {
    for (var key in vm.$data) {
      //代理每一个属性
      (function (k) {
        Object.defineProperty(vm, k, {
          get: function () {
            return vm.$data[key];
          },
          set: function (newValue) {
            vm.$data[key] = newValue;
          }
        });
      })(key);
    }
  }

  function initMethods(vm) {
    //把自定义的方法挂载到vm实例对象里
    for (var key in vm._methods) {
      vm[key] = vm._methods[key];
    }
  }
  return Vue;
})();

var vm = new Vue({
  data() {
    return { a: 1, b: 2 }
  },
  methods: {
    increaseA(num) { this.a += num; },
    increaseB(num) { this.b += num; },
    getTotal() { console.log(this.a + this.b); }
  }
});

vm.increaseA(1);
vm.increaseA(1);
vm.increaseA(1);
vm.increaseA(1);

vm.increaseB(2);
vm.increaseB(2);
vm.increaseB(2);
vm.increaseB(2);

vm.getTotal();
console.log(vm);
```

## `computed`属性

实现一个 `computed`

```js
var Vue = (function () {

  //匹配{{}}
  var reg_var = /\{\{(.+?)\}\}/g;

  /**
   * 私有数据computedData
   * 容器保存computed对象里方法集合的函数本体和依赖
   * 该对象结构为：
   * dep: 依赖(就是实例里data里的属性) 数组存放的是data数据里的key
   *
   * computedData:
   * {total: {value: 3, dep: ["a", "b"], get: ƒ}}
   *
   * total = {
   *   value: computed里get函数执行返回的结果
   *   get: get函数本体
   *   dep: ['a', 'b']
   * }
   */
  var computedData = {};

  /**
   *
   * 每一个属性都有对应的dom节点，属性改变时节点也会更新
   */
  var dataPool = {};

  var Vue = function (options) {
    this.$el = document.querySelector(options.el);
    this.$data = options.data();
    this._init(this, options.computed, options.template);
  }

  /**
   * 初始化实例
   * @param {object} vm 实例对象
   * @param {object} computed 计算方法集合对象
   * @param {string} template 字符串模板
   */
  Vue.prototype._init = function (vm, computed, template) {
    dataReactive(vm);
    computedReactive(vm, computed);
    render(vm, template);
  }

  /**
   * 将data数据应式处理
   * @param {object} vm 实例对象
   */
  function dataReactive(vm) {
    var _data = vm.$data;

    //枚举data数据属性
    for (var key in _data) {
      (function (k) {
        //劫持数据达到直接访问/修改作用
        Object.defineProperty(vm, k, {
          //vm访问k时得到
          get: function () {
            return _data[k];
          },
          //vm访问k时设置
          set: function (newValue) {
            _data[k] = newValue;
            //更新数据
            updata(vm, k);
            //更新计算数据
            _updateComputedData(vm, k, function (k) {
              updata(vm, k);
            });
          }
        });
      })(key);
    }
  }

  /**
   * 将computedData数据响应式处理
   * 数据劫持访问到value属性里的数据
   * @param {object} vm 实例对象
   * @param {object} computed 计算方法集合对象
   */
  function computedReactive(vm, computed) {
    _initComputedData(vm, computed);

    //使用computedData
    //computedData: {total: {value: 3, dep: ["a", "b"], get: ƒ}}
    for (var key in computedData) {
      (function (k) {
        Object.defineProperty(vm, k, {
          //vm访问k时得到
          get: function () {
            //value保存的是该方法执行后的结果
            return computedData[k].value;
          },
          //vm访问k时设置
          set: function (newValue) {
            //将开发者用户修改后的新的数据重新赋值更新
            computedData[k].value = newValue;
          }
        });
      })(key);
    }
  }

  /**
   * 渲染页面
   * @param {object} vm 实例对象
   * @param {string} template 字符串模板
   */
  function render(vm, template) {
    var container = document.createElement('div');
    var _el = vm.$el;
    container.innerHTML = template;

    var domTree = _compileTemplate(vm, container);
    _el.appendChild(domTree);
  }

  /**
   * 编译模板
   * @param {object} vm 实例对象
   * @param {HTMLDivElement} container 带有模板的div元素包装器
   * @return {HTMLDivElement} container 替换好模板内容的div元素
   */
  function _compileTemplate(vm, container) {
    //找到所有节点
    var allNodes = container.getElementsByTagName('*');
    var nodeItem = null;
    // console.log(allNodes);
    //HTMLCollection(5) [span, span, span, span, span]

    //枚举每个节点
    for (var i = 0; i < allNodes.length; i++) {
      nodeItem = allNodes[i];

      //匹配{{}}
      var matched = nodeItem.textContent.match(reg_var);
      // console.log(matched);
      //["{{a}}"]/null/["{{b}}"]/null/["{{total}}"]
      if (matched) {
        nodeItem.textContent = nodeItem.textContent.replace(reg_var, function (node, key) {
          //console.log(node); {{a}}/{{b}}/{{total}}
          //console.log(key); a/b/total
          //每一个属性都有对应的dom节点，属性改变时节点也会更新
          dataPool[key.trim()] = nodeItem;
          // console.log(dataPool);
          //{a: span, b: span, total: span}
          // console.log(vm[key.trim()]); 1/2/3
          //返回替换实例键名对应的值
          return vm[key.trim()];
        });
      }
    }
    // console.log(container);
    //被data数据替换{{变量}}好的模板
    return container;
  }

  /**
   * 初始化ComputedData容器的内部函数
   * @param {object} vm 实例对象
   * @param {object} computed 计算方法集合
   */
  function _initComputedData(vm, computed) {
    //枚举computed计算方法集合里的所有方法名
    for (var key in computed) {
      //试着打印描述符
      // console.log(Object.getOwnPropertyDescriptor(computed, key));
      //注意：value保存的是当前方法函数本身，可以拿到执行
      //{writable: true, enumerable: true, configurable: true, value: ƒ}
      var descriptor = Object.getOwnPropertyDescriptor(computed, key);
      //如果有get 拿get 没有则拿value
      var descriptorFn = descriptor.value.get ? descriptor.value.get : descriptor.value;

      // console.log(key); total
      //初始化totol = {}
      computedData[key] = {};
      //descriptorFn()执行后的结果存入computedData对象里的computedData.value属性里
      //改变指向是因为total函数内部有用this
      computedData[key].value = descriptorFn.call(vm);
      // console.log(computedData); 函数执行后的结果 {total: 3}
      //将第二个属性get保存到total对象里
      computedData[key].get = descriptorFn.bind(vm);
      //将第三个属性dep依赖保存到total对象里
      computedData[key].dep = _collectDep(descriptorFn);
      // console.log(computedData);
      //computedData: {total: {value: 3, dep: ["a", "b"], get: ƒ}}
    }
  }

  /**
   * 专门收集依赖函数
   * 匹配函数内部有哪些依赖
   * 匹配规则：this.字段任意字符出现1次或多次非贪婪
   * @param {function} fn computed方法集合里方法的函数本身
   * @return {array} 返回一个存放函数本身里实例对象data的变量集合的数组
   */
  function _collectDep(fn) {
    //转为字符串再正则匹配
    var _collection = fn.toString().match(/this.(.+?)/g);
    // console.log(_collection);
    //["this.a", "this.b"]
    if (_collection.length > 0) {
      for (var i = 0; i < _collection.length; i++) {
        //去掉前面的this
        _collection[i] = _collection[i].split('.')[1];
      }
      // console.log(_collection);
      //["a", "b"]
      return _collection;
    }
  }

  /**
   * 更新修改数据信息
   * @param {object} vm 实例对象
   * @param {*} key 枚举data数据属性的key
   */
  function updata(vm, key) {
    dataPool[key].textContent = vm[key];
  }

  /**
   * 更新计算数据
   * @param {object} vm 实例对象
   * @param {*} key 枚举data数据属性的key
   * @param {function} updata 回调函数
   */
  function _updateComputedData(vm, key, updata) {
    //初始化第一批的依赖数据
    var _dep = null;
    //computedData: {total: {value: 3, dep: ["a", "b"], get: ƒ}}
    for (var _key in computedData) {
      // console.log(_key); total
      _dep = computedData[_key].dep;
      // console.log(_dep); ["a", "b"]
      for (var i = 0; i < _dep.length; i++) {
        //如果键名一致证明是修改该数据
        if (_dep[i] === key) {
          //重新执行第一批依赖的get方法
          //vm[_key] => vm.total
          vm[_key] = computedData[_key].get();
          //更新变量
          updata(_key);
        }
      }
    }
  }
  return Vue;
})();
```

`computed`使用。

```js
var vm = new Vue({
  el: '#app',
  template: `
  <span>{{a}}</span>
  <span>+</span>
  <span>{{b}}</span>
  <span> = </span>
  <span>{{total}}</span>
  `,
  data() {
    return { a: 1, b: 2 }
  },
  computed: {
    total() {
      console.log('computed total');
      return this.a + this.b;
    }
  }
});

console.log(vm);

console.log(vm.total);
console.log(vm.total);
console.log(vm.total);

vm.a = 100;
vm.b = 200;

console.log(vm.total);
console.log(vm.total);
console.log(vm.total);
```



## `watch`属性

<u>**案例：驱动实现**</u>

**技术：**

`webpack + vue + es6` 类

**实现功能：**

- `computed `实现
- `watch `实现
- 实现响应式与暴露回调接口
- `data/computed/watch` 驱动

**源码地址：**

https://gitee.com/kevinleeeee/vue-drivers-demo

## `v-if/v-show`

简单实现一个`vue2.x`版本的`v-if/v-show/@click`

**原理：**

通过找到注释节点占位`<!-- v-if -->`，找到父节点`appendChild()`进去或替换。合理利用数据保存视图相关的信息， 通过数据与视图绑定在一起，`update`的时候可以很好的操作数据，对事件处理函数循环绑定，处理v-if删除节点/恢复节点(注释节点占位)。

```
/**
 * 把template模板转变为dom节点，将dom里的数据和dom绑定在一起，当数据更新的时候，更新节点
 * 用Map{ dom: {}}来实现 dom键名为对象
 * showPool数据结构
 * showPool = [
 *   [
 *     dom,
 *     {
 *       type: if/show,
 *       prop: data
 *     }
 *   ]
 * ]
 *
 * eventPool数据结构
 * eventPool = [
 *   [
 *     dom,
 *     handler
 *   ]
 * ]
 */
```

**_如何实现`v-if/v-show`?_**

1. 数据代理实现访问`data`数据
2. 数据劫持
3. 初始化 dom 数据使`v-if/v-show/@click`和 dom 绑定在一起
4. 初始化视图，根据`data`数据先初始化时候显示视图组件
5. 根据事件池去做时间处理函数的循环绑定
6. 改变数据的同时改变 dom 视图

**_为什么初始化 dom 时绑定`v-if/v-show/@click`?_**

在执行`methods`对象里的方法时才能找到视图相应的节点去更改它的视图。

**_`vue`在初始化 dom 时做了什么操作？_**

1. 转化为 AST 树
2. 转化为虚拟节点
3. 转化为真实节点
4. 将数据和真实节点保存在一起

**_此轮子中，如何将`v-if/v-show/@click`和视图绑定在一起？_**

定义池子保存当前的节点和`v-if/v-show/@click`属性。

```
/**
 * showPool: [
 *   [
 *     dom,
 *     {
 *       //如果是if则需要增删节点
 *       type: if / show,
 *       //如果是show则需要显示或隐藏
 *       show: true / false,
 *       data: 绑定的数据
 *     }
 *   ]
 * ]
 */

 /**
 * console.log(this.showPool);
 * Map(4) {
 *   div.box.box1 => {
 *     key: div.box.box1,
 *     value: {type: 'if', show: false, data: 'boxShow1'}
 *   },
 *   div.box.box2 => {…},
 *   div.box.box3 => {…},
 *   div.box.box4 => {…}
 * }
 */
```

```
/**
 * eventPool: [
 *   [
 *     dom,
 *     handler
 *   ]
 * ]
 */

 /**
 * console.log(this.eventPool);
 * Map(4) {
 *   {
 *     key: button,
 *     value: ƒ showBox1()
 *   },
 *   button => ƒ,
 *   button => ƒ,
 *   button => ƒ
 * }
 */
```

**_当遇到`v-if`节点时，如何删除了之后恢复时保证位置不变？_**

通过新增一个注释节点替换被删除的节点从而实现占位。

源码地址：https://gitee.com/kevinleeeee/vue2-vif-vshow-resource-demo

## 样式绑定

实现 `style/class` 样式绑定

**解决：**

标签属性的解析，并关联 `data `数据里的属性

**技术：**

`es6 `类

**源码地址：**

https://gitee.com/kevinleeeee/vue-class-style-demo

## 模板编译

实现模板编译的过程。`rollup`是专注与打包JS的工程打包工具。

技术：`rollup`/`es5`/`AST `树/数据响应式

```
├─index.html
├─package-lock.json
├─package.json
├─rollup.config.js - 配置rollup
├─src
|  ├─index.js
|  ├─init.js - 初始化响应式数据/挂载vm/挂载组件/挂载render函数
|  ├─lifecycle.js - 管理组件挂载/所有的生命周期函数/进行补丁替换
|  ├─state.js - 初始化响应式数据/获取所有数据并代理数据
|  ├─vdom
|  |  ├─index.js - 管理Vue原型上的所有render函数和内部代码的Vue原型上的方法(_c/_v/_s)
|  |  ├─patch.js - 负责创建元素和文本节点的虚拟节点
|  |  └vnode.js - 根据虚拟节点再创建真实的dom节点(包括属性更新)/新旧补丁的替换方法
|  ├─observer
|  |    ├─array.js 对数组进行原型上的数组操作功能补全
|  |    ├─index.js - 观察数据
|  |    └Observer.js - 对观察的数据进行处理/定义响应式数据
|  ├─compiler
|  |    ├─astParser.js - 专门正则规则解析html到和组装AST结构树
|  |    ├─generate.js - 生成新的AST树结构并进行render函数内部代码的格式组装
|  |    └index.js - html模板转化AST树/将AST树返回的code代码创建新的render函数
├─dist
|  ├─umd
|  |  ├─vue.js
|  |  └vue.js.map
```

`vue2.x` 基于` options API` 的写法

```JS
let options = {...};
let vm = new Vue(options);
```

***如何拿到模板template?***

```HTML
//优先级(没有找到模板的情况)：render函数 > template > el(html)
<body>
  <!--查找顺序： 3.html -->
  <div id="app" style="color: red; font-size: 20px;">
    hello {{name}}
    <h1>{{name}}</h1>
    <ul>
      <li style="color: green;">{{age}}</li>
      <li>{{info.job}}</li>
    </ul>
  </div>

  <script>
    //模拟用户填写的 optionsAPI
    let vm = new Vue({
      el: '#app',
      //查找顺序: 2.template模板
      template: ``,
      //查找顺序: 1.render函数
      //createElement 函数方法
      render(createElement) {...},
      data() { return {...} }
    });
  </script>
</body>
```

将从`template`模板转化为`AST`树的**目的**是因为模板里有可能有`v-for`，或一些`v-*`指令等写法(虚拟`DOM`中不能有)，并将Vue语法糖的属性将其解析成为对应的功能。从而让浏览器识别简化后的`dom`树。

**模板编译过程：**

1. 拿到 `template`模板
2. 将 `template`转换到 `AST`树(正则匹配模板内容重组`AST`树)
3. `AST `形成了以后转化为 `render `函数(一系列的字符串方法解析)
4. 通过`render `函数写完后转换为虚拟 `DOM `节点
5. 设置 `PATCH `补丁，对比新旧节点打补丁
6. 形成真实 `DOM`



> 关于 `AST`(Abstract syntax tree):  抽象语法树，是源代码的抽象语法结构的树状描述。
>

虚拟 `DOM`(描述 `DOM `节点)和 `AST `树的**区别**：

- 当虚拟 `DOM `变成真实 `DOM `的时候，当把补丁打到真实 `DOM `的时候，可以自定义一些内容。
- `AST `树是对源代码层面上的一种树结构的数据结构化。

希望的`AST`树写法，模拟`html`的真实节点`dom`树型结构。

```js
//注意：v-for v-model等不能存在于虚拟dom节点里，不便于浏览器识别
//解决方法：将AST树形成以后，对AST进行优化，把多余的vue内置的语法糖属性(v-开头)全部解析成功能
{
  tag: 'div',
  type: 1, //元素节点为1
  attrs: [
    { name: 'id', value: 'app' },
    { name: 'style', value: { color: 'red', font-size: '20px' } 
  ],
  children: [ { type: 3, text: 'hello' } ]
}
```

**源码实现过程：**

1. 从` index.html` 拿到 `html `模板
2. 执行初始化文件(初始化响应式数据)，获取 `el `元素`<div id="app"</div>`
3. 将 `el `作为模板传入编译和生产 `render `函数(`compileToRenderFunction(el)`)
4. 编译函数先进行 `html `转化为 `AST `树结构的对象
5. 编译函数然后将 `AST `树结构的对象组装成生产 `render `的函数的内部代码(`code`)
6. 将拼装好的 `render `函数挂载到`vm.$options`里
7. 在 `Vue `原型上完善 render 函数内部的方法(`_v()/_s()/_c()`)
8. 执行 `render `函数后生产出虚拟节点 `vnode`
9. 通过打补丁的方式将虚拟节点创建成真实节点 `DOM `，真实节点通过`insertBefore`方法来替换原来`<body>`里的节点
10. 并对真实节点 `DOM `的属性进行更新
11. 最终新的虚拟节点替换老的真实节点
12. 实现视图的内容更新



***如何通过正则匹配模板中的内容？***

```js
/**
 * 正则规则来源于vue/src/compiler/parser/html-parser.js
 */

//匹配格式：id="app"/id='app'/id=app
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
//匹配格式：标签名 div/span.../ <my-header>
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;
//匹配格式：特殊的 标签格式 <my:header>
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
//匹配格式：<div
const startTagOpen = new RegExp(`^<${qnameCapture}`);
//匹配格式：> 或者是 />
const startTagClose = /^\s*(\/?)>/;
//匹配格式：</div>
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);
```

将模板通过正则匹配过程。

```html
<div id="app" style="color: red; font-size: 20px;">
  hello {{name}}
  <h1>{{name}}</h1>
  <ul>
    <li style="color: green;">{{age}}</li>
    <li>{{info.job}}</li>
  </ul>
</div>

如何匹配？
1.先匹配 <div
2.删除 <div
3.匹配 id="app"/id='app'/id=app
4.删除 id="app"
5.匹配 style="color: red; font-size: 20px;"
6.将属性解析成对象存储
  -> attrs: [{name:'style', value: {color: 'red', font-size: '20px'}}]
7.删除 style="color: red; font-size: 20px;"
8.继续匹配直到匹配到直到模板删除清空 > 说明结束
9.删除 >
```

组装`AST`树的方法。

```js
function createASTElement(tagName, attrs) {
  return {
    tag: tagName, //div
    type: 1,
    children: [],
    attrs, //id="app"
    parent //根据父节点才能拿出结构
  }
}
```



***如何 `AST `树转成 `render `函数？***

`render`函数的写法。

```js
Vue.component('anchored-heading', {
  render: function (createElement) {
    return createElement(
      'h' + this.level,   // 标签名称
      this.$slots.default // 子节点数组
    )
  }
});
```

利用`generate`生成函数，根据`AST`树数据生成字符串代码。通过以下3个函数进行字符串拼接成需要的字符串代码，`_c()`是负责创建元素节点的函数，`_v()`是负责创建文本节点的函数，`_s()`是负责将`{{name}}`转化为真实数据`_s(name)`。

类似`JSX`中的`createElement`方法去创建虚拟节点。

```js
/**
  <div id="app" style="color: red;">
    hello {{name}}
    <span class="text" style="color:green">{{age}}</span>
  </div>
 */

function vrender() {
  return `
    _c(
      "div",
      { id: "app", style: { "color": "red" } },
      _v("hello" +_s(name)),
      _c(
        "span",
        { "class": "text", "style": { "color": "green" } },
        _v(_s(age))
      )
    )
  `
}
```

根据`AST`树数据生成像上面格式的字符串代码。

```js
function generate(el) {
  /**
   * console.log(el);
   * {
   *   tag: "div",
   *   type: 1,
   *   attrs: (2) [{…}, {…}],
   *   children: (2) [{…}, {…}],
   *   parent: Window
   * }
   */

  //处理children里面的属性对象
  let children = getChildren(el);

  //formatProps方法处理属性为属性对象
  //如{id:"app",style:{"color":" red"," font-size":" 20px"}
  let code = `
    _c(
      '${el.tag}',
      ${el.attrs.length > 0 ? `${formatProps(el.attrs)}` : 'undefined' }
      ${children ? `,${children}` : ''}
    )
  `;

  return code;
}
```

`AST `树形成了以后转化为 `render` 函数。`parseHtmlToAST`方法是将模板中的`html`节点转为`AST`树。

```js
 const ast = parseHtmlToAST(html),
    //根据AST树数据生成 字符串代码
    code = generate(ast),
    //生成render函数
    //with(obj)相当于将obj写法 省略this写法
    //var obj ={a: 1, b: 2}
    //with(obj){ console.log(a, b, a + b); } 1 2 3
    //将新实例的函数内部的作用域this抛出
    //这样，可以实现外部访问code里面的属性时不用写this.name/this.age..
    render = new Function(`with(this){ return ${code} }`);

  /**
   * console.log(render);
   * ƒ anonymous() {
   *   with(this){ return
   *     _c('div',{id:"app",style:{"color":" red"," font-size":" 20px"}},_v("hello "+_s(name)+" 欢迎光临"),
   *     _c('span',{class:"text",style:{"color":"green"}},_v(_s(age))
   *     …
   * }
   */
}
```

***`render `函数如何转化为虚拟节点？***

```js
//管理所有的render函数
//传入Vue实例的目的是将所有render函数在该构造函数原型上进行扩展
function renderMixin(Vue) {
  //针对vnode的render函数
  Vue.prototype._render = function () {
    const vm = this,
      //拿到AST形成后转出的render函数(字符串代码)
      render = vm.$options.render,
      //执行后变成vnode节点
      vnode = render.call(vm);

    //此时出来了虚拟节点
     /**
     * console.log(vnode);
     * {
     *   tag: "div",
     *   props: {id: 'app', style: {…}},
     *   children: (3) [{…}, {…}, {…}],
     *   text: undefined
     * }
     */
     return vnode;
  }

  //负责处理创建元素节点
  Vue.prototype._c = function () {
    return createElement(...arguments);
  }

  //负责处理{{}}里面的变量字符
  Vue.prototype._s = function (value) {
    if (value === null) return;
    return typeof value === 'object' ? JSON.stringify(value) : value;
  }

  //负责处理创建文本节点
  Vue.prototype._v = function (text) {
    return createTextVnode(text);
  }
}
```

***如何设置补丁并打入真实的 DOM 里面？***

```js
/**
 * 打补丁函数patch(oldNode, vNode)
 * @param {*} oldNode 指视图html已经写好的模板节点
 * @param {*} vNode AST生成的虚拟节点
 */
function patch(oldNode, vNode) {
  /**
   * console.log(vNode);
   * {
   *   el: div#app,
   *   tag: "div",
   *   text: undefined,
   *   children: (3) [{…}, {…}, {…}],
   *   props: {id: 'app', style: {…}}
   * }
   */

  let el = createElement(vNode),
    parentElement = oldNode.parentNode;

  //把el放到oldNode的后边
  //放到<script>的上方
  parentElement.insertBefore(el, oldNode.nextSibling);

  //移除旧的节点
  parentElement.removeChild(oldNode);
}
```

**配置相关：**

```js
//rollup脚本
//-c -> config
//-w -> watch
"scripts": { "dev": "rollup -c -w" }
```

```js
//配置文件rollup.config.js
//关于rollup-plugin-commonjs实现引入文件省略.js后缀
import babel from 'rollup-plugin-babel';
import serve from 'rollup-plugin-serve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  input: './src/index.js',
  output: {
    format: 'umd',
    name: 'Vue',
    file: 'dist/umd/vue.js',
    sourcemap: true
  },
  plugins: [
    babel({ exclude: 'node_modules/**' }),
    serve({
      open: true,
      port: 8080,
      contentBase: '',
      openPage: '/index.html'
    }),
    commonjs
  ]
}
```

**源码地址：**

https://gitee.com/kevinleeeee/compile-template-driver-vue2.x-demo

## 

## tpl-loader

诟病`vue2.x`的问题是单文件组件中编写后的视图会显示长篇大论，不易于阅读和维护。

**<u>案例：手写 `tpl-loader` 分离模板组件</u>**

`xxx.vue` 是单文件应用组件，把`<template>`的视图文件/`<style>`样式文件提取分离成单个文件管理，剩下逻辑`<script>`代码在 `xxx.vue `文件里单独管理，实现代码精简，易于阅读，方便调试。

```
//目录
├─package-lock.json
├─package.json
├─webpack.config.js
├─src
|  ├─main.js - app入口文件
|  ├─components
|  |     ├─MyTitle
|  |     |    ├─index.js - 组件入口文件
|  |     |    ├─MyTitle.scss - 组件样式
|  |     |    └MyTitle.tpl - 组件模板
├─public
|   └index.html
├─loaders
|    ├─tpl-loader
|    |     └index.js - 自己手写的加载器代码
```

`webpack.config.js`配置。

```js
module.exports = {
  ...,
  resolveLoader: {
    //通过这个配置找到tpl-loader依赖目录
    //合并node_modules和自己定义的tpl-loade目录
    modules: [
      'node_modules',
      resolve(__dirname, './loaders')
    ]
  },
  module: {
    rules: [
      //所有tpl文件都会使用自己写的tpl-loader加载器去解析
      {
        test: /\.tpl$/,
        loader:'tpl-loader'
      },
    ]
}
```

`tpl-loader`其实是一个函数。其实组件里入口文件导出的是一个方法，且方法里传入一个组件，所以这里会返回的也是一个方法 `(组件)=>{}`。

```js
//commonJS规范
function tplLoader(source) {
  // console.log(source);
  // 拿到的是组件入口文件里引入的tpl模板文件字符串代码
  //<h1 @click="handleTitleClick($event)">{{title}}</h1>
  //<h2 @click="handleTitleClick($event)">{{subTitle}}</h2>

  //内部也会返回一个组件
  //这里会将template属性和内容新增至组件对象里
  return `
    export default (component) => {
      component.template = \`${source}\`;
      return component;
    };
  `;
}

module.exports = tplLoader;
```

组件中执行`tplLoader`方法返回的方法。

```js
import TitleView from './Title.tpl';

export default TitleView({
  data(){...},
  methods: {...}
});
```

打印组件发现自己写的tpl-loade加载器把`template`属性和内容都添加进组件对象里。

```js
//在APP入口文件引入组件MyTitle
import MyTitle from "./components/MyTitle";

/**
 * console.log(MyTitle);
 * {
 *   data: ƒ data(),
 *   methods: {handleTitleClick: ƒ},
 *   template: "<h1 @click=\"handleTitleClick($event)\">{{title}}</h1>\n<h2 @click=..."
 * }
 */
```

**源码地址：**

https://gitee.com/kevinleeeee/vue-tpl-loader-demo
