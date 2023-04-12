# `Vue3.0` 基础

## 概述

`Vue2.0`的局限性：

- 当组件变得庞大复杂起来后，代码可阅读性降低
- 代码复用有明显的缺陷
- `TypeScript`支持非常有限

## 版本对比

`vue3 `基于 `vue2 `按需加载组件加快项目加载速度，原理是通过把 vue 库里的方法独立封装一个一个的函数，当组件需要使用时单独加载工具函数即可。

`vue3`内部源码完全重写实现更好的性能。对`TypeScript`的支持更为友好。新增`Component API`，有一种全新的定义组件的方式，同时也兼容`vue2`。

## createApp

调用 `createApp` 返回一个应用实例。该实例提供了一个应用上下文。应用实例挂载的整个组件树共享相同的上下文，该上下文提供了之前在 `Vue 2.x` 中“全局”的配置。

由于 `createApp` 方法返回应用实例本身，因此可以在其后链式调用其它方法

```
/**
 * {
 *   component: ƒ component(name, component),
 *   config: Object,
 *   directive: ƒ directive(name, directive),
 *   mixin: ƒ mixin(mixin),
 *   mount: (containerOrSelector) => {…},
 *   provide: ƒ provide(key, value),
 *   unmount: ƒ unmount(),
 *   use: ƒ use(plugin, ...options),
 *   version: "3.2.23",
 *   _component: {},
 *   _container: null,
 *   _context: {app: {…}, config: {…}, mixins: Array(0), components: {…},
 *   directives: {…}, …},
 *   _instance: null,
 *   _props: null,
 *   _uid: 0,
 *   get config: ƒ config(),
 *   set config: ƒ config(v)
 * }
 */
```

## component

```
//如果传入 参数，返回应用实例。
const app = createApp({});

const comp = app.component('my-component', {
  name: 'MyComponet',
  setup() {}
})

//返回的是应用实例
console.log(comp);
```

## mount

挂载应用实例的根组件

```
//返回根组件实例
const app = createApp({})
const rootIns = app.mount('#app')

console.log(rootIns);
//Proxy{...}
```

## unmont

卸载应用实例的根组件

```
const app = createApp({})
app.mount('#app')

// 挂载5秒后，应用将被卸载
setTimeout(() => app.unmount(), 5000)
```

## use

安装 `Vue.js` 插件。如果插件是一个对象，它必须暴露一个 `install` 方法。如果它本身是一个函数，它将被视为安装方法。

该安装方法将以应用实例作为第一个参数被调用。传给 `use` 的其他 `options` 参数将作为后续参数传入该安装方法。

当在同一个插件上多次调用此方法时，该插件将仅安装一次。

```
import { createApp } from 'vue'
import MyPlugin from './plugins/MyPlugin'

const app = createApp({})

app.use(MyPlugin)
app.mount('#app')
```

## config

包含应用配置的对象, 在挂载应用之前，你可以修改其 属性

**`config.errorHandler`**

```
app.config.errorHandler = (err, vm, info) => {
  // 处理错误
  // `info` 是 Vue 特定的错误信息，比如错误所在的生命周期钩子
}
```

指定一个处理函数，来处理组件渲染方法和侦听器执行期间抛出的未捕获错误。这个处理函数被调用时，可获取错误信息和应用实例。

**`globalProperties`**

添加一个可以在应用的任何组件实例中访问的全局 `property`。组件的 `property `在命名冲突具有优先权

这可以代替 `Vue 2.x`里 `Vue.prototype` 扩展：

```
// 之前(Vue 2.x)
Vue.prototype.$http = () => {}

// 之后(Vue 3.x)
const app = createApp({})
app.config.globalProperties.$http = () => {}

//使用
//注意：不建议直接获取应用组件实例，仅在开发阶段调试使用
const { ctx } = getCurrentInstance();
console.log(ctx.utils.plus(1, 2));
```

```
//getCurrentInstance()代替方案：
//定义一个全局对象文件 /shared/globalProperties.js
const globalProperties = {
  install(app){
    app.provide('global', {
      a: 1,
      b: 2,
      $http(){...}
    });
  }
}

export default globalProperties；

//main.js 注册插件
app.use(globalProperties)；

//其他组件使用
setup(){
  const { a, b, $http } = inject('global');
  console.log(a, b, $http);
}
```



## 组合式 API

`hooks `是 `vue3 `底层提供的钩子实现函数方式(不像 `vue2 options API`)，开发者只需写提供钩子里面的逻辑。

基于函数抽离的组合各种方法函数实现高内聚的情况(2.0 有横向拆分，各个组件都有如 `data，method,computed`)。

**`CompositionAPI`** 解决问题是`vue 2.0`中当组件变得庞大复杂起来后，代码可阅读性降低。

**_什么时候使用`CompositionAPI`?_**

- 希望有最理想的 `TypeScript `支持
- 当组件的内容变得庞大复杂起来的时候，并且希望通过功能来管理组件
- 可能会有一些想要在不同的组件里使用的代码(代码复用)
- 团队倾向新的`CompositionAPI`

```
//vue2.0写法：
export default {
  data() {
    return { search, sorting }
  },
  methods: { search, sorting },
  props: { search, sorting }
}
```

```
//vue3.0写法：(可选/不影响2.0使用)
export default {
  setup() {
    //Composition API语法
    search,
    sorting
  }
}
```

```
export default {
  setup() {
    //Composition functions
    return {
      ...useSearch(),
      ...useSorting()
    }
  }
}

//搜索
function useSearch() {}
//排序
function useSorting() {}
```

**`vue2.0`代码复用的三种方式:**

1. `mixin`提取公共代码到数组管理
2. `Mixin Factories`工厂
3. `Scoped Slots`作用域插槽方式

```
//方式一：mixins
//存在优点：
//1.根据不同的功能进行归类

//存在缺点：
//1.容易产生重复定义冲突
//2.复用性不高

const productSearchMixin = {
  data() { search },
  methods: { search }
}

const resultSortMixin = {
  data() { sorting },
  methods: { sorting }
}

export default {
  mixins: [productSearchMixin, resultSortMixin]
}
```

```
//方式二：Mixin Factories
//存在优点：
//1.提高可复用性

//存在缺点：
//1.命名空间需要有严格的规范
//2.暴露的属性需要进入到Mixin工厂函数的定义文件里查看
//3.Factories不能动态生成

//组件部分：
import searchMixinFactory from '@mixins/factories/search';
import sortingMixinFactory from '@mixins/factories/sorting';

export default {
  mixins: [
    searchMixinFactory({
      namespace: 'productSearch',
      xxx
    }),
    sortingMixinFactory({
      namespace: 'productSorting',
      xxx
    }),
  ]
}

//逻辑部分：
export default function sortingMixinFactory(obj) { }
```

```
//方式三：Scoped Slots
//存在优点：
//1.解决Mixins大多数问题

//存在缺点：
//1.配置需要模板完成，理想的状态模板只定义需要渲染的内容
//2.缩进降低代码的可阅读性
//3.暴露的属性只能够在模板里使用
//4.3个组件比1个组件，性能开销上升

//generic-search.vue组件部分：
<script>
  export default {
    props:['getResults']
  }
</script>

<template>
  <div>
    <slot v-bind="{query, results, run}"></slot>
  </div>
</template>

//generic-sorting.vue组件部分：
<script>
  export default {
    props:['input', 'options']
  }
</script>

<template>
  <div>
    <slot v-bind="{options, index, output}"></slot>
  </div>
</template>

//search.vue组件部分：
<template>
  <div>
    <generic-search
      :get-results="getProducts"
      :v-slot="productSearch"
    >
      <generic-sorting
        :input="productSearch.results"
        :options="resultSortingOptions"
        v-slot="resultSorting"
      ></generic-sorting>
    </generic-search>
  </div>
</template>

<script>
  export default {}
</script>
```

**_如何使用`CompositionAPI`?_**

```
//安装
npm i -S @vue/composition-api

//引用
import VueCompositionApi from '@vue/composition-api';

//注册
Vue.use(VueCompositionApi);
```

## `setup`函数

***`setup`是什么？***

它是组合式`API`的入口函数,所有组合式`API`都可以放入到`setup`内部执行。一个组件选项，在组件被创建**之前**，`props` 被解析之后执行。它是组合式 `API `的入口。`setup`返回一个对象，对象里的属性将被合并到`render`函数执行期上下文里，所以视图模板可以使用对象里的数据。



**执行时期：**

组件被创建之前(`beforeCreate`)到`props`被解析后执行，即使用组合式`API`时，没有`beforeCreate`和`created`生命周期函数，在组件创建之前自动执行。当视图模板访问对象属性时，不需要`.value`写法。

`setup`方法必须返回 `view `模板里定义的数据和方法。

```js
export default {
  setup(props, context){
    //必须返回视图模板需要的属性和方法
    return {}
  },
}
```

`setup `函数在以下之前执行：

```
Components/props/data/methods/computed/lifecycle
```

`setup `写法：

```js
import { watch } from 'vue';

export default {
  setup(props, context){
    //监听props里面的属性
    watch(()=>{ console.log(props.name); });
    //因为不能访问this,但通过context可访问：
    //context.attrs/slots/parent/root/listeners
  },
  props:{ name: String }
}
```

> **注意：** 接收的`props`已经被响应式代理了对象, 且不要解构`props`否则失去响应式。

接收的第一个参数为：被解析后的`props`, 选项`API`中`props`选项的引用。

```js
const { title, content } = props;
//此时title属性已经丢失了响应式数据
  
//解决方案: toRef()方法转成响应式引用
//注意: toRefs返回的是ref对象,需要加value才可以拿到属性
const { title } = toRefs(props);
console.log(title.value);
  
//利用toRef()可以单独将某一个属性转为响应式数据
const _content = toRef(props, 'content');
```

接收的第二个参数为：执行期上下文,装的是一些`attrs`(`this.$attrs`)，`slots`, `emits` ,`expose`暴露属性给父组件。

```js
console.log(ctx);
/**
 * {
 *   attrs: (...),
 *   emit: (...), 这里emit代替vue2 this.$emit
 *   expose: exposed => {…},
 *   slots: (...),
 *   get attrs: ƒ attrs(),
 *   get slots: ƒ slots()
 * }
 */
```

`expose`可以暴露对象给父组件，当`setup()`函数内容`return h`函数或`return JSX`给视图时，它没办法暴露更多的信息给外部，此时需要`expose`额外去暴露。

```js
//expose函数写法:
context.expose({
  //向父组件传递一个test函数
  test(){...}
});
```

参数 2 可以解构使用：

```js
setup(props, {attrs, emit, slots}){...}
```

```js
setup(props, ctx){
  //attrs内部属性是非响应式的
  const { attrs, emit, slots } = ctx;
}
```

`vue2`中的`this`是无法在`vue3`中使用，因为`setup`函数是在组件被创建之前执行的，此时组件实例还不存在`setup`执行期是无法获取`this`，组合式`API`是不需要`this`的，因为组合式`API`都是一个一个函数组成的，函数执行后的结果可以直接拿到，并不需要挂载到实例上。

默认情况下, `setup`函数因为执行时期的特殊性是无法拿到组件实例的，但是可以通过`getCurrentInstancs()`可以获取组件实例。

```js
setup(props, ctx){
  const instance = getCurrentInstance();
  console.log(instance); //组件实例
}
```

在子组件里的`setup`想要拿到`vuex.$store`属性和方法时，

```js
//getCurrentInstance：拿状态和方法通过 获取当前实例 的函数方法
//computed函数 计算和保存拿到的状态和方法
import { getCurrentInstance, computed } from 'vue';

export default {
  name: 'xxx',
  props: { index: Number },
  setup(props){
    //ctx -> store -> state/mutaions
    const { ctx } = getCurrentInstance(),
      store = ctx.$store;

    const changeCityInfo = () => {
      //提交给mutations里的方法去操作数据
      store.commit('changeCity', props.index);
    };

    //返回视图模板需要的数据和方法
    return {
      //拿到state里的数据
      curIdx: computed(() => store.state.curIdx),
      changeCityInfo
    }
  }
}
```

生命周期函数只能在`setup`函数内部同步的使用，因为这些生命周期函数都依赖内部的全局状态去定位到当前激活(当前组件`setup`调用)的组件实例。

```js
export default {
  setup(props){
    onMounted(() => {...});
    onUpdated(() => {...});
  }
}
```



## `<scritp setup>`

是单文件组件中使用组合式`API`的编译时的语法糖。`Vue`的`SFC`是单文件组件是在`Options API`的基础上扩展`Composition API`。`setup`函数作为选项中的其中一项存在的。

```html
//编译后写法
<script>
  export default{
    props，
    setup(){...}
  }
</script>
```

`Vue`对`.vue`文件中编写的`<script setup>`标签进行编译，编译后是以选项式的写法。

```html
//编译前写法
<script setup></script>
```

优点是更少的内容，更简洁的代码，不需要另外注册组件，和注册`props`，注册自定义指令，不需要配置`TS`类型定义，不需要在`methods`定义方法，不需要手动返回响应式数据给视图模版。并将`<script>`标签内的内容一次性编译为`render`函数，更好的`IDE`类型推导。

若想在视图模版中单独的写响应式数据变量，可以通过`toRefs`方法将响应式数据包装为`ref`引用数据。

```html
<h3>{{a}}</h3>
<script setup>
  const state = reactive({ a: 1 });
  const { a } = toRefs(state);
</script>
```

`defineProps()`和`defineEmits`是需要在`<script setup>`中声明的。它们只能在`<script setup>`中使用的编译宏，它们不是运行时的方法，而是通过`nodejs`后端做编译时候有专门去识别`defineProps`和`defineEmits`，最终编译成为`props`和`emits`对象合并在`vue`实例里。

```html
<script setup>
  const props = defineProps({ foo: String });
  const emit = defineEmits(['change', 'delete']);
</script>
```

在`setup`函数中的第二参数`ctx`上下文里的`ctx.slots`可以获取当前组件实例的所有插槽，`ctx.attrs`可以获取所有属性。在`<script setup>`中并没有`ctx`上下文，取而代之的是使用`useSlots`和`useAttrs`的`Composition API`代替。

```html
<script setup>
  const slots = useSlots();
  const attrs = useAttrs();
</script>
```

在`<script setup>`中定义的文件属性默认是封闭的，组件外部是无法获取的，通过`defineExpose()`方法可以暴露这些属性。场景是定义`MessageBox`组件时，动态的操作组件，方法调用是否显示，此时可以暴露组件的显示状态。

```html
<script setup>
  const a = ref(1);
  defineExpose({ a });
</script>
```







## 响应式

响应式是`vue`的核心，它继承`angular`相关的思想，响应式是数据与视图的联动关系，希望一个数据被更改时不必让开发者考虑视图如何驱动，让`vue`底层`vmmodel`去追踪数据依赖变化并及时更新视图。`vue2`是通过`Object.defineProperty`，`vue3`通过`proxy`代理响应式数据。丢失响应式的本质是不能正常的触发`getter`和`setter`，无法进行视图的更新。

定义响应式数据的两种方式是`ref`，`reactive`，`ref`主要用于简单数据，`reactive`用于复杂的数据组合，如对象数组等。

## `ref`

`reactive()` 的种种限制归根结底是因为 JavaScript 没有可以作用于所有值类型的 “引用” 机制，只能对引用值进行响应式包装，如`Object`，`Array`，`Set`，`Map`。为此，Vue 提供了一个 `ref()` 方法来允许我们创建可以使用任何值类型的定制化响应式包装，定制化的意思是必须收集依赖，必须根据值的改变而进行相应的视图更新。

接受一个内部值并返回一个响应式且可变的 `ref `对象。`ref `对象仅有一个 `.value` `property`，指向该内部值。

```js
/**
 * RefImpl{ //reference implement 引用实现
 *   dep: undefined,
 *   __v_isRef: true,
 *   _rawValue: "张三",
 *   _shallow: false,
 *   _value: "张三",
 *   value: (...)
 * }
 */
```

取值和赋值操作。

```js
const count = ref(0)
console.log(count.value) // 0
count.value = 1；
```

如果将**对象**分配为 `ref `值，则它将被 `reactive`函数处理为深层的响应式对象。`isRef()`可以判断是否为`RefImpl`对象引用，返回布尔值。

```js
const obj = ref({ a: 1, b: 2 });
isRef(obj); //true
/**
 * value会做reactive响应式处理
 * RefImpl{
 *   ...,
 *   value: Proxy{...}
 * }
 */
```



**解包**

`reactive` 将解包所有深层的`refs`同时维持 `ref `的响应性。

```js
const count = ref(1)
const obj = reactive({ count });

// ref 会被解包
console.log(obj.count === count.value) // true

// 它会更新 `obj.count`
count.value++
console.log(count.value) // 2
console.log(obj.count) // 2

// 它也会更新 `count` ref
obj.count++
console.log(obj.count) // 3
console.log(count.value) // 3
```

`ref` 在模板中的解包， `ref` 在模板中作为**顶层**属性被访问时，它们会被自动解包，所以不需要使用 `.value`。

```html
<script setup>
//顶层定义ref属性
const count = ref(0);
//非顶层定义ref属性
const obj = { count2: ref(2) };
function increment() { count.value++ }
</script>

<template>
  <button @click="increment">
    {{ count }} <!-- 无需 .value -->
  </button>
</template>
```

`ref` 在响应式对象中的解包，当一个 `ref` 被嵌套在一个响应式对象中，作为属性被访问或更改时，它会**自动解包**，因此会表现得和一般的属性一样，只有当嵌套在一个深层响应式对象内时，才会发生 ref 解包。当其作为浅层响应式对象的属性被访问时不会解包。

```js
const count = ref(0);
//嵌套的ref对象count会自动解包
//count.value 变为 count
const state = reactive({ count: count });

console.log(state.count); // 0

state.count = 1;
console.log(count.value); // 1  仍保持同步关系
```

跟响应式对象不同，当 ref 作为响应式数组或像 `Map` 这种原生集合类型的元素被访问时，不会进行解包。

```js
const books = reactive([ref('Vue 3 Guide')])
// 这里需要 .value
console.log(books[0].value)

const map = reactive(new Map([['count', ref(0)]]))
// 这里需要 .value
console.log(map.get('count').value)
```



---

`Reactive References / refs`

**响应式引用值作用：**

`ref()`选择性暴露响应式对象数据有利于后期代码维护，也能更好的追踪到模板里的属性定义的位置。

```js
import { ref } from '@vue/composition-api';

export default {
  setup(){
    //传入原始值并执行会创建ref对象
    //ref() => ref对象 => 响应式属性
    const capacity = ref(3);

    console.log(capacity);
    /**
    * RefImpl:
    * {
    *   value: 3,
    *   get value(){}
    *   set value(){}
    * }
    */

    //必须返回对象才能供模板表达式使用
    //不返回会报错：模板使用了但未定义
    return { capacity };
  }
}
```

**方法定义：**

```js
import { ref } from '@vue/composition-api';

export default {
  setup(){
    const capacity = ref(3);
    function increaseCapacity(){
      capacity.value ++;
    };
    return { capacity, increaseCapacity };
  }
}
```

**计算方法：**

```html
<p>座位容量：{{ capacity }}</p>
<p>剩余座位容量：{{spacesLeft}}/{{capcity}}</p>
<button @click="increaseCapacity()">增加容量</button>
<h2>参加人员</h2>
<ul>
  <li v-for="(name, index) in attending" :key="index">
    {{name}}
  </li>
</ul>
```

```js
//引入computed计算函数
import { ref, computed } from '@vue/composition-api';

export default {
  setup(){
    const capacity = ref(3);
    const attending = ref(['小王', '小李', '小张']);

    //定义计算函数方法
    const spacesLeft = computed(()=>{
      return capacity.value - attending.value.length;
    });

    function increaseCapacity(){
      capacity.value ++;
    };

    //导出spacesLeft计算属性方法
    return {
      capacity,
      attending,
      spacesLeft,
      increaseCapacity
    };
  }
}
```





## `unref`

如果参数是一个`ref`, 则返回内部值，否则返回参数本身。这是 `val = isRef(val) ? val.value : val` 的语法糖函数。丧失响应式包装引用，获取得到的是一个代理后的数据。

## `toRef`

`toRef()`方法可以将非`ref`的值转为`ref`引用，此操作可以简化模版写法，如`state.a`可以直接用`a`代替。

```html
//非ref引用时必须用state.a
<div>{{state.a}}</div>
//ref引用可以直接a
<div>{{a}}</div>

<script>
  export default{
    setup(){
      const state = reactive({ a: 1 });
      //toRef(引用名称，属性名)
      //此操作不仅将a属性进行ref包装，还另外保存了state的引用，使a和state.a的数据同步
      const a = toRef(state, 'a');
      return { state, a }
    }
  }
</script>
```

可以用来为源响应式对象上的某个 `property `新创建一个`ref` ，更多的针对响应式数据，然后，`ref `可以被传递，它会保持对其源 `property `的响应式连接。

```js
const state = reactive({ foo: 1, bar: 2});
const fooRef = toRef(state, 'foo');

//state.foo和fooRef.value相互关联，哪个修改都会同步修改
fooRef.value++;
console.log(state.foo) // 2

state.foo++;
console.log(fooRef.value) // 3
```

当你要将 `prop `的 `ref `传递给复合函数时，`toRef` 很有用：

```js
//可以自定义composition API
function useDoSth(name) {
  return `My name is ${name.value}.`;
}

export default {
  setup(props) {
    const state = reactive({
      name: "张三",
      age: 30,
    });

    const sentence = useDoSth(toRef(state, "name"));
    console.log(sentence);
    //My name is 张三.
  }
}
```

## `toRefs`

将响应式对象转换为普通对象，其中结果对象的每个 `property `都是指向原始对象相应 `property `的 `ref。`

```js
const state = reactive({ name: "lily", age: 30, });
const stateRefs = toRefs(state);
// console.log({ ...stateRefs });
//{name: ObjectRefImpl, age: ObjectRefImpl}

// console.log(stateRefs.name);
//ObjectRefImpl {...}

// console.log(stateRefs.name.value);
//lily
```

```js
const state = reactive({ foo: 1, bar: 2 })
const stateAsRefs = toRefs(state);

// ref 和原始 property 已经“链接”起来了
state.foo++
console.log(stateAsRefs.foo.value) // 2

stateAsRefs.foo.value++
console.log(state.foo) // 3
```

当从组合式函数返回响应式对象时，`toRefs` 非常有用，这样消费组件就可以在不丢失响应性的情况下对返回的对象进行解构或展开：

```js
 const { name, age } = { ...toRefs(state) };
 console.log(name);
 console.log(age);
```

**_`Vue3 `为什么要使用`toRefs`?_**

`reactive`函数可以将`ref`定义的属性归并在一起，在模板绑定使用时写法是。

```html
<li>姓名：{{reactive函数执行返回的变量名.属性名}}</li>
```

可以看出在模板里使用时用`xxx.属性名`的写法比较麻烦，那么如何直接用属性名的写法呢？可以通过`toRefs`函数实现, 它可以将多个`ref`定义的响应式属性/`reactive`响应式对象通过展开运算符的方式一并`return`到视图使用。

```js
setup(){
  const person = reactive({ name: 'lisi', age: 29 });
  return { ...toRefs(person); }
}

//视图写法：
<li>{{name}}</li>
```



##  `reactive`

`reactive`是基于`proxy`实现的一个`API`。

```js
const state = reactive({ count: 0 });
```

`reactive()`该函数返回的是真正的响应式对象。它是**深层次**的给引用值进行响应式处理。它的缺点是只能对`Map`，`Set`，`Object`，`Array`数据进行响应式处理，所以出现`ref()`方法对原始值进行统一的处理。

```html
//reactive()写法：
<p>座位容量：{{ event.capacity }}</p>
<p>剩余座位容量：{{event.spacesLeft}}/{{event.capcity}}</p>
<button @click="increaseCapacity()">增加容量</button>
<h2>参加人员</h2>
<ul>
  <li v-for="(name, index) in event.attending" :key="index">
    {{name}}
  </li>
</ul>

//写法二：toRefs()简写
<p>座位容量：{{ capacity }}</p>
<p>剩余座位容量：{{spacesLeft}}/{{capcity}}</p>
<button @click="increaseCapacity()">增加容量</button>
<h2>参加人员</h2>
<ul>
  <li v-for="(name, index) in attending" :key="index">
    {{name}}
  </li>
</ul>
```

引入`computed`计算函数。

```js
import { reactive, computed, toRefs } from '@vue/composition-api';

export default {
  setup(){
    //reactive()接收一个对象作为参数
    const event = reactive({
      capacity: 4,
      attending: ['小王', '小李', '小张'],
      spacesLeft: computed(()=>{
        return event.capacity - event.attending.length;
      });
    });

    function increaseCapacity(){
      return event.capacity ++;
    }

    return { event, increaseCapacity };

    //写法二：
    //toRefs()将响应式对象转换为普通对象
    //...平铺开对象
    //既可以保持属性响应式，又能进行简写响应式对象平铺
    //return { ...toRefs(event), increaseCapacity };

    //写法三：
    //因为toRefs()方法返回的是一个响应式对象
    //所以可以直接返回该对象
    //return toRefs();
  }
}
```

**`reactive`导致响应式丢失的情况有以下：**

情况1 解构对象里的属性，原因是解构后的属性并不会走`getter`，无法进行数据响应式代理，造成丢失。

```js
let { a } = state;
```

情况2 重复赋值给新的变量 因为 `Vue` 的响应式系统是通过属性访问进行追踪的，因此我们必须始终保持对该响应式对象的相同引用。这意味着我们不可以随意地“替换”一个响应式对象，因为这将导致对初始引用的响应性连接丢失：

```js
let state = reactive({ count: 0 });
// 上面的引用 ({ count: 0 }) 将不再被追踪（响应性连接已丢失！）
state = reactive({ count: 1 });
```

情况3 传参数无法追踪变量导致丢失。

```js
function setA(a){ return a++; }
setA(state.a);
```



## `nextTick`

`DOM`更新和状态的改变是非同步的(不是异步关系，是收集完所有的依赖才一次更新`DOM`，把`DOM`更新的任务缓存到一个队列当中去，等待状态全部改变完成以后一次性更新`DOM`。

```js
export default {
  setup(){
    const setTitle = async() => {
      state.title = 'This is Title.';
      
      //nextTick在状态更改完成以后立即执行，但回调函数会在DOM更新完毕后执行。
      //nextTick返回一个Promise对象
      await nextTick(() => {});
    }
  }
}
```







## `defineExpose`

暴露当前 `<script setup>` 组件里的属性或方法供外界访问，如应用实例或组件

```
<script setup>
  const setVisible = (isVisible) => { 
    state.visible = isVisible; 
  };
  
  defineExpose({ setVisible });
</script>
```



## `readonly`

接受一个对象 (响应式或纯对象) 或 [ref](https://v3.cn.vuejs.org/api/refs-api.html#ref) 并返回原始对象的只读代理。只读代理是深层的：任何被访问的嵌套 property 也是只读的。

## `Composition Functions`

提取代码，做代码复用的解决方案

解决问题：代码复用有明显的缺陷

```
//优点：
//1. 代码量减少，能够更容易地把功能从组件内部提取到一个函数里
//2. 因为使用的是函数，使用的是现有的知识
//3. 更灵活，技能感知，自动补全等编辑器里提示的功能利于编写代码

//缺点：
//1.学习low-level API知识来定义Composition Functions
//2. 3.0定义组件的方式变成了2种

//写法：
//其他组件使用：
import useEventSpace from '@/use/event-space';
export default {
  setup(props, context){
    //执行函数并返回对象
    return useEventSpace();
  }
}

//定义在组件 src/use/event-space.js
//Composition Function
<script>
  import { ref, computed } from '@vue/composition-api';
  export default function useEventSpace(){
  	const capacity = ref(3);
  	const attending = ref(['小王', '小李', '小张']);
  	spacesLeft: computed(()=>{
      return event.capacity - event.attending.length;
  	});

  	function increaseCapacity(){
      capacity.value++;
  	}

  	return {
  	  capacity,
  	  attending,
  	  spacesLeft,
  	  increaseCapacity
  	}
  }
</script>
```

## 生命周期

![image-20211207020448849](http://note-img-bed.dt-code.fun/image-20211207020448849.png)

**选项式 `API `的生命周期选项和组合式 `API `之间的映射**

- `beforeCreate` 没有了 -> 使用 `setup()`取代:
  - 在实例初始化之后、进行数据侦听和事件/侦听器的配置之前同步调用。
- `created`没有了 -> 使用 `setup()`取代:
  - 在实例创建完成后被立即同步调用。在这一步中，实例已完成对选项的处理，意味着以下内容已被配置完毕：数据侦听、计算属性、方法、事件/侦听器的回调函数。然而，挂载阶段还没开始，且 `$el` property 目前尚不可用。
- `beforeMount` -> `onBeforeMount`:
  - 在挂载开始之前被调用，相关的 `render` 函数首次被调用。
- `mounted` -> `onMounted`:
  - 在实例挂载完成后被调用，这时候传递给 [`app.mount`](https://v3.cn.vuejs.org/api/application-api.html#mount) 的元素已经被新创建的 `vm.$el` 替换了。如果根实例被挂载到了一个文档内的元素上，当 `mounted` 被调用时， `vm.$el` 也会在文档内。 注意 `mounted` **不会**保证所有的子组件也都被挂载完成。如果你希望等待整个视图都渲染完毕，可以在 `mounted` 内部使用`vm.$nextTick`。
- `beforeUpdate` -> `onBeforeUpdate`:
  - 在数据发生改变后，`DOM `被更新之前被调用。这里适合在现有 `DOM `将要被更新之前访问它，比如移除手动添加的事件监听器。
- `updated` -> `onUpdated`:
  - 在数据更改导致的虚拟 `DOM `重新渲染和更新完毕之后被调用。当这个钩子被调用时，组件 `DOM `已经更新，所以你现在可以执行依赖于 `DOM `的操作。然而在大多数情况下，你应该避免在此期间更改状态。如果要相应状态改变，通常最好使用计算属性或侦听器取而代之。注意，`updated` **不会**保证所有的子组件也都被重新渲染完毕。如果你希望等待整个视图都渲染完毕，可以在 `updated` 内部使用`vm.$nextTick`。
- `beforeUnmount` -> `onBeforeUnmount`:
  - 在卸载组件实例之前调用。在这个阶段，实例仍然是完全正常的。
- `unmounted` -> `onUnmounted`:
  - 卸载组件实例后调用。调用此钩子时，组件实例的所有指令都被解除绑定，所有事件侦听器都被移除，所有子组件实例被卸载。
- `errorCaptured` -> `onErrorCaptured`:
  - 在捕获一个来自后代组件的错误时被调用。此钩子会收到三个参数：错误对象、发生错误的组件实例以及一个包含错误来源信息的字符串。此钩子可以返回 `false` 以阻止该错误继续向上传播。
- `renderTracked` -> `onRenderTracked`:
  - 跟踪虚拟 `DOM `重新渲染时调用。钩子接收 `debugger event` 作为参数。此事件告诉你哪个操作跟踪了组件以及该操作的目标对象和键。
- `renderTriggered` -> `onRenderTriggered`:
  - 当虚拟 `DOM `重新渲染被触发时调用。和 [`renderTracked`](https://v3.cn.vuejs.org/api/options-lifecycle-hooks.html#rendertracked) 类似，接收 `debugger event` 作为参数。此事件告诉你是什么操作触发了重新渲染，以及该操作的目标对象和键。
- `activated` -> `onActivated`:
  - 被 `keep-alive` 缓存的组件激活时调用。
- `deactivated` -> `onDeactivated`:
  - 被 `keep-alive` 缓存的组件失活时调用。

为什么`vue3.0`进行改动？因为语义化挂载的反义词也有。

```
beforeDestyory -> beforeUnmount
destroyed -> unmounted
```

```js
//钩子使用
import { onBeforeMount } from '@vue/composition-api';

export default {
  setup(){
    onBeforeMount(()=>{
      console.log('Before Mount!');
    })
  }
}
```

新增生命钩子函数有：

```js
onActivated/onDeactivated/onErrorCaptured/onRenderTracked/onRenderTriggered 追踪响应式依赖
```

---

生命周期函数与`watchEffect`函数在`setup`函数里的执行顺序：

```js
//默认顺序：
setup(){
  const count = ref(0);
  console.log('setup');
  setTimeout(() => { count.value = 1; }, 1000);
  onBeforeMounted(() => {console.log('onBeforeMounted') });
  onMounted(() => { console.log('onMounted'); });
  onBeforeUpdate(() => { console.log('onBeforeMount') });
  onUpdated(() => { console.log('onUpdated'); });
  watchEffect(() => { 
    const a = count.value;
    console.log('watchEffect'); 
  });
}

//执行顺序:
1.setup
2.watchEffect
3.onBeforeMount
4.onMounted
------数据更新-------
5.watchEffect
6.onBeforeUpdate
7.onUpdated
```

通过`watchEffect`的第二参数可以将`watchEffect`的执行顺序往后顺延一位。

```js
setup(){
  const count = ref(0);
  console.log('setup');
  setTimeout(() => { count.value = 1; }, 1000);
  onBeforeMounted(() => { console.log('onBeforeMounted') });
  onMounted(() => { console.log('onMounted'); });
  onBeforeUpdate(() => { console.log('onBeforeMount') });
  onUpdated(() => { console.log('onUpdated'); });
  watchEffect(() => { 
    const a = count.value;
    console.log('watchEffect'); 
  }, { flush: 'post' });
}

//执行顺序:
1.setup
2.onBeforeMount
3.watchEffect
4.onMounted
------数据更新-------
5.onBeforeUpdate
6.watchEffect
7.onUpdated
```



## `actatived`

当组件被缓存时是无法重新挂载`onMounted`组件的，`actatived`和`deactived`生命周期可以获取下次再次激活的组件数据。

```js
export default {
  setup(props, context){
    onMounted(() => {});
    onActivated(() => {});
  }
}
```







## `watch`侦听器

侦听器主要监听的是依赖，当响应式数据变更的时候监听变化，从而给开发者提供接口去完成自定义的逻辑程序。

**侦听单个数据源**

监听响应式数据(`title.value`)，当变化时执行回调函数，并且可以拿到改变前后的值。

```js
export default{
  setup(){
    const title = ref('this is title.');
    const setTitle = (title) => {
      title.value = title;
    }
    //watch(ref引用数据源, (cur, prev) => {...})
    //cur -> newValue
    //prev -> oldValue
    return { title, setTitle }
  }
}
```

侦听器数据源可以是返回值的 `getter `函数，也可以直接是 `ref`包装的响应式数据。可以监听参数1是一个`getter`函数，当数据变更的时候，会重新执行`getter`函数，并返回结果给参数2的回调的参数。当有两个数据同时变更的时候，`watch`会收集依赖，依赖里会有函数的回调，并将多个依赖合并为一个来处理。

```js
export default{
  setup(){
    watch(
      () => { return `My name is ${name.value}`; },
      (res) => { console.log(res); }
    )
  }
}
```

如果监听一个对象，是可以深度监听的。侦听`getter`函数不是深度的，需要参数3`deep`属性为`true`，少用`deep`，因为数据量大的遍历会有性能不足。

```js
export default{
  setup(){
    watch(
      () => state.article,
      (cur, prev) => { ... },
      { deep: true }
    )
  }
}
```

默认情况下，`watch`函数内获取的`value`是组件更新之前的`DOM`的值，因为组件在更新之前就被调用。如果想拿到组件更新后`DOM`的值，得依赖属性`flush: pre | post | sync`，使回调函数在组件更新后执行。

```js
export default{
  setup(){
    const title = ref('this is title');
    const titleRef = ref(null);
    watch(
      title, 
      (cur, prev) => { console.log(titleRef.value.innerText); }，
      { flush: post } //配置组件更新后可以获取，默认为pre
    );
  }
}
```

想要在创建`watch`的时候立即执行回调函数，可以依赖`immediate`属性。

```js
export default{
  setup(){
    watch(
      title, 
      (cur, prev) => { ... }，
      { immediate: true } 
    );
  }
}
```

当依赖被追踪调用的时候，可以依赖`onTrack`和`onTrigger`方法去追踪，侦听器被创建的时候执行`onTrack`，依赖被修改的时候会触发执行`onTrigger`方法，主要调试依赖使用。

```js
export default{
  setup(){
    watch(
      title, 
      (cur, prev) => { ... }，
      {
        onTrack(e){...},
        onTrigger(e){...}
      } 
    );
  }
}
```

停止侦听是通过`watch`返回的方法执行。

```js
export default{
  setup(){
    const stop = watch(
      title, 
      (cur, prev) => { ... }
    );
    stop(); //停止侦听
  }
}
```

通过 `watch Componsition API` 实现数据监听。

```js
//当数据变化时 这里的value是前面第一个函数里return的值
export default {
  setup(){
    watch(()=>{return xxx;},(value)=>{
      //业务需求：操作state里的数据,调用mutatios里面的方法
      store.commit("setHeaderTitle", value);
    });
  }
};
```

## `watchEffect`

侦听副作用的依赖，执行回调，与定义了`immediate`属性的`watch`函数一样立即执行传入的一个函数，同时响应式追踪其依赖，并在其依赖(数据)变更时重新运行该函数。副作用有`DOM`更新，异步请求任务等。

**`watch`与`watchEffect`区别：**

`watch`是懒执行的机制，要根据依赖是否变化来决定回调是否执行，而且`watch`是有明确的数据源(`source`)，在数据源不明确时不能使用`watch`函数，并且需要手动的去收集依赖，并且`watch`方法是可以明确的拿到新值和旧值，但是`watchEffect`是无法拿到旧值，无法在回调内拿到新值的引用。

`watch`实际上较为少用。`watch`方法是有具体的新值和旧值的需求时使用，`watch`有明确的追踪某个依赖，并需要拿到该依赖改变前后的值时较为合适。

而`watchEffect`是当不明确有哪些依赖，而且依赖有可能会有很多时，使用`watchEffect`较为合适，适用于不知道有多少表单数据依赖的异步请求操作，此时不在乎某一个依赖，在依赖变更的时候重新执行回调。

```js
//watch类似于React中的useEffect中的第二参数来依赖数据源，回调会在组件加载完毕后执行。
const state = useEffect(() => {}, []);
```

`watchEffect`方法是立即执行的机制。侦听器被创建与依赖的数据变更的时候都会执行回调。`watchEffect`是自动追踪依赖，而不是单独的去指定依赖数据源。在侦听器创建的时候执行一次回调，它会有目的去自动收集依赖。

在执行回调的时候会使`title`依赖触发一个`get`方法获取`title.value`，因为有触发`getter`，所以此时会自动收集依赖。

```js
watchEffect(() => {
  console.log(title.value);
});
```

`pre`属性值是默认的，它在组件挂载或者组件更新之前执行回调，在此会缓存副作用函数，并且是异步进行执行。如果改变多个依赖，它只会执行一次副作用函数。

```js
watchEffect(() => {...}, { flush: 'prev' });
```

`post`属性值是组件挂载或者组件更新之后执行副作用回调。

```js
watchEffect(() => {...}, { flush: 'post' });
```

`sync`属性值是在组件挂载或者组件更新之前执行副作用函数回调，但是它不会自动缓存副作用回调，它是同步执行的，同时改变多个依赖的值，多次调用副作用函数回调。

```js
watchEffect(() => {...}, { flush: 'sync' });
```

**停止侦听**

当 `watchEffect` 在组件的`setup`函数或生命周期钩子被调用时，侦听器会被链接到该组件的生命周期，并在组件卸载时自动停止。

在一些情况下，也可以显式调用返回值以停止侦听：

```js
const stop = watchEffect(() => {...})

// later
stop()
```

**清除副作用**

当`watchEffect`函数执行的时候，先将缓存中的`onCleanup`函数优先执行，将副作用清楚了以后再执行`getData`数据请求操作。

在真正的业务中，请求数据有`requestData`操作和`cancelRequestData`操作，因为需要解决防抖的问题，避免在请求数据还没有成功时，再次去请求数据，`watchEffect`函数刚好解决了防抖的问题，它清除了上一次的副作用，然后再进行一次新的副作用函数执行。

```js
let t = null;
let count = 0; //计算请求数据的次数
function getData(title){
   t = setTimeout(() => {
     console.log('网络请求成功，' + count);
   }, 3000);
}
watchEffect(async(onCleanup) => {
  await getData(title.value);
  //onCleanup方法清除上一次的副作用
  onCleanup(() => {
    count++;
    console.log('onCleanup');
    clearTimeout(t);
  });
})

//打印顺序
onCleanup
网络请求成功1
onCleanup
网络请求成功0
onCleanup
```

`React`中**`useEffect`和`watchEffect`方法的区别：**

`useEffect`需要手动填入收集的依赖，否则会报错警告。

```js
useEffect(() => {}, [title]);
```

`useEffect`假如需要清除副作用时，需要返回一个函数，在函数内容写法清除的程序。

```js
useEffect(() => {
  return () => {
    count++;
    console.log('onCleanup');
    clearTimeout(t);
  }
}, [title]);
```

但清除副作用返回函数的方式会存在一个问题，就是不能使用`async...await`写法，因为`async`默认返回一个`Promise`对象，而它只能返回一个函数，导致无法`then`进行下一个方法的执行。解决写法如下：

```js
useEffect(() => {
  async getDate(){
    await ...
  }
  getData().then();
  return () => {
    ...
  }
}, [title]);
```

相对于以上`useEffect`函数，`watchEffect`的优点是参数`onCleanup`是一个`Composition Api`，它返回的内容是不受影响，可以正常的使用`async...wait`写法。

| 方法     | `watch` | `watchEffect` | `useEffect` |
| -------- | ------- | ------------- | ----------- |
| 执行时机 | 懒执行  | 立即          | 立即        |
| 依赖收集 | 手动    | 自动          | 手动        |







## `computed`

关于计算属性的一些概念：

- 计算属性来描述依赖响应式状态的复杂逻辑供模板视图使用。
- 计算属性缓存和方法机制的不同，不同之处在于**计算属性值会基于其响应式依赖被缓存**。
- 一个计算属性仅会在其响应式依赖更新时才重新计算。
- 计算属性无论多少次访问，都会立即返回先前的计算结果，而不用重复执行`getter`函数。

过程是`computed`函数执行且执行回调函数，返回一个结果，这个结果赋值给`value`属性。在模版中与`ref`包装一样，不用在视图模版中使用`.value`写法。

`computed`的执行时机是创建`computedRef`时执行回调，回调内部的依赖发生变更的时候执行回调并返回值给`value`属性。当回调的依赖没有变更的情况下，直接取`computedRef.value`的值，这也叫计算属性值缓存机制。

`computed`方法接受一个 `getter `函数，并根据 `getter `的返回值返回一个不可变的响应式 `ref`对象。`ComputedRefImpl`对象同样也包含`value`属性。

```js
const count = ref(1);
const plusOne = computed(() => count.value + 1);

console.log(plusOne); //ComputedRefImpl{...}
console.log(plusOne.value); // 2
plusOne.value++;
// 错误 Write operation failed: computed value is readonly
```

或者，接受一个具有 `get` 和 `set` 函数的对象，用来创建可写的 `ref `对象。

```js
const count = ref(1)
const plusOne = computed({
  get: () => count.value + 1,
  set: val => { count.value = val - 1 }
})

plusOne.value = 1
console.log(count.value) // 0
```

**_为什么在`setup`返回时需要`computed`重新计算？_**

```js
export default {
  ...,
  setup() {
    return {
      //注意：在vue2.x中是通过computed里 ...mapState(['xxx'])方法拿到里面的属性
      //1.所以这里不能直接访问state.headerTitle
      //2.所以需要用computed函数取出state里的属性
      headerTitle: computed(() => state.headerTitle),
    };
  },
};
```

**`watch`和`computed`的区别：**

`watch`是去监听一个依赖的变更，执行回调，拿到新旧值，交给开发者完成后续程序(**回调**)。`computed`监听回调中的依赖变化，执行回调，返回结果给`computedRef.value`，给开发者仅仅是一个**`ref`值**。说明`watch`用于完成逻辑，而`computed`是用于计算值的变化从而专注于更新视图。

不要企图使用`computed`方法去完成逻辑任务，它不能在回调内去操作`DOM`元素，也不能在回调内部发起异步数据请求，也不能去更改`computedRef.value`的值，该值是只读的。





## `effectScope`

它是`Composition API`中的一个用于给`computed`，`watch`，`watchEffect`方法定义作用域的方法。目的是为了解决组件中除了组件本身在卸载时会销毁侦听等一系列函数，但是对于一些自定义的`hooks`里定义声明的`computed`，`watch`，`watchEffect`方法仍存在全局中并没有销毁。

首先在自定义`hooks`文件中定义一个作用域。

```js
const scope = effectScope();
```

回调函数内部可以定义组件需要的`computed,watch,watchEffect`等一系列监听数据依赖的方法。

```js
scope.run(() => {
  todoCount = computed(...);
  watchEffect(...);
  watch(type, () => {...}
  });
});
```

  `stop`方法可以注销`computed,watch,watchEffect`等方法侦听，避免给`watch,watchEffect`单独定义注销侦听方法。

```js
scope.stop();
```



## `onScopeDispose`

可以释放掉`effectScope`定义的作用域。需要在`effectScope`中`run`执行的回调函数内部去定义`onScopeDispose`方法，该方法执行时一并执行回调。

```js
scope.run(() => {
  ...
  onScopeDispose(() => { console.log('clear'); });
});
```

## `getCurrentScope`

获取当前定义的`effectScope`的作用域。

```js
const curScope = getCurrentScope();
/**
   console.log(curScope);
   * EffectScope {
   *   detached: true, 
   *   _active: true, 
   *   effects: Array(0), 
   *   cleanups: Array(0), 
   *   parent: undefined,
   *   scopes: [],
   *   active: true,
   *   [[prototype]]: {
   *     off: ƒ off(),
   *     on: ƒ on(),
   *     run: ƒ run(),
   *     stop: ƒ stop()
   *   }
   * }
   */
```







## `provide/inject`

使用一对 `provide` 和 `inject`。无论组件层次结构有多深，父组件都可以作为其所有子组件的依赖提供者。这个特性有两个部分：父组件有一个 `provide` 选项来提供数据，子组件有一个 `inject` 选项来开始使用这些数据。

使用场景一般用于父组件`provide`分发自定义的`hooks`逻辑任务给子组件，子组件穿透`inject`注册后视图模版传入数据从而修改父组件的值。

> 注：适用于单一组件树全局属性方法共享。

在此处 `provide `一些组件的实例 `property`，这将是不起作用的：

```js
app.component('todo-list', {
  ...,
  provide: {
    todoLength: this.todos.length
    // 将会导致错误 `Cannot read property 'length' of undefined`
  },
})
```

要访问组件实例 property，我们需要将 `provide` 转换为返回对象的函数：

```js
app.component('todo-list', {
  ...,
  provide() {
    return { todoLength: this.todos.length }
  }
})
```

**响应式处理**

默认情况下，`provide/inject` 绑定*并不是*响应式的。我们可以通过传递一个 `ref` `property `或 `reactive` 对象给 `provide` 来改变这种行为

```js
app.component('todo-list', {
  // ...
  provide() {
    return {
      todoLength: Vue.computed(() => this.todos.length)
    }
  }
})

app.component('todo-list-statistics', {
  inject: ['todoLength'],
  created() {
    console.log(`Injected property: ${this.todoLength.value}`)
    // > 注入的 property: 5
  }
})
```

**`setup`写法**

```js
//provide
export default {
  setup() {
    provide('location', 'North Pole')
    provide('geolocation', {
      longitude: 90,
      latitude: 135
    })
  }
}
```

将`inject`获取到的响应式数据嵌套`readonly()`可以避免子组件直接修改父组件的属性，但只能包装响应式数据为只读。假如不给父组件`provide`的响应式数据只读包裹，子组件会可以自由的修改父组件的数据，造成严重的权限问题。

```js
//inject
export default {
  setup() {
    const userLocation = inject('location', 'The Universe');
    const userGeolocation = inject('geolocation');
    const userLocationReadOnly = inject(
      'location', 
      readonly(userLocation) //userLocation必须是响应式数据
    );

    return { userLocation, userGeolocation }
  }
}
```

同时，假如子组件想修改父组件的数据，可以让父组件`provide`一个方法给子组件，让子组件`inject`接收并执行该方法来达到修改父组件的数据。

```js
//父组件
export default {
  setup() {
    const updateAge = provide('update', function(num){...});
  }
}
                                 
//子组件
export default {
  setup() {
    const updateAge = inject('update');
    updateAge(44);
  }
}
```

**响应式处理**

```js
//添加响应性
export default {
  setup() {
    const location = ref('North Pole')
    const geolocation = reactive({
      longitude: 90,
      latitude: 135
    })

    provide('location', location)
    provide('geolocation', geolocation)
  }
}
```

`provide`和`inject`的最佳使用场景是将公共的属性和方法定义为一个插件并`provide`，在组件中使用时`inject`即可。

```js
//定义一个公共属性和方法的插件文件 如 /share/globalProperties.js
export default{
  install(app){
    app.provide('globalProperties', {
      a: '11',
      b: '22',
      c: function(){...}
    })
  }
}
                
//注册插件 main.js
app.use('globalProperties');
    
//根组件inject使用公共的属性和方法 App.vue
export default{
  name: 'App',
  setup(){
    const { a, b, c } = inject('globalProperties');
  }
}
```

## `vue3-hooks`封装

情景1是模版视图绑定数据和方法。明明两个方法与`count`数据相关，但是写法上功能和数据的意义分散了，并且操作数据的行为不具备语义化。这样的操作数据的写法会在`setup`函数内部显得非常臃肿。

```html
<h1>{{count}}</h1>
<button @click="plus(2)">plus</button>
<button @click="minus(1)">minus</button>
<script>
  export default{
    setup(){
      const count = ref(0);
      const plus = (num) => {count.num += num;}
      const minus = (num) => {count.num -= num;}
      return { count, plus, minus }
    }
  }
</script>
```

函数的封装需要集成的概念，当数据和修改数据的各种方法绑定在一起也是一种集成。进而优化为以下的写法，使得开发者编写视图模版时非常清楚的填写传参数。

```html
<h1>{{count}}</h1>
<button @click="setCount({ type: 'plus', payload: 2 })">plus</button>
<button @click="setCount({ type: 'minus', payload: 1 })">minus</button>
<script>
  export default{
    setup(){
      const count = ref(0);
      const setCount = ({ type, payload }) => {
        switch(type){
          case 'plus':
            count.value += payload;
            break;
          case 'minus':
            count.value -= payload;
            break;
        }
      }
      return { count, setCount }
    }
  }
</script>
```

但以上写法需要单独定义函数，也显得不足，进而进化封装一个方法里集成了数据和修改数据的方法(`React Hooks`思想，结合`useState`和`useReducer`方法像派发器模式去修改视图数据)。

```html
<h1>{{count}}</h1>
//函数式写法
<button @click="setCount(count => count.value + 1)">plus</button>
//表达式写法
<button @click="setCount(count - 1)">minus</button>
<script>
  export default{
    setup(){
      //集成了数据和修改数据的方法，开箱即用
      const [ count, setCount ] = useState(0);
      return { count, setCount }
    }
  }
</script>
```

**封装集成`useState`函数过程**

```js
const { ref } = Vue;
const states = []; //存储state的容器
const stateSetters = []; //存储修改state方法的容器
let stateIndex = 0; //索引为了让state和方法一一对应

export function useState(initialState) {
  //创建state到states容器
  states[stateIndex] = createState(initialState, stateIndex);
  //保证stateSetters容器没有值时
  if (!stateSetters[stateIndex]) {
    //容器中新增方法
    stateSetters.push(createStateSetter(stateIndex));
  }
  //每次执行本函数会索引自增
  stateIndex++;
  //返回数据和修改数据的方法
  return [states[stateIndex], stateSetters[stateIndex]];
}

function createState(initialState, stateIndex) {
  //ref包装state数据
  const state = ref(initialState);
  //有值返回states[stateIndex] 没值返回state 避免覆盖
  return states[stateIndex] !== undefined ? states[stateIndex] : state;
}

function createStateSetter(stateIndex) {
  return function (newState) {
    //写法1 <button @click="setCount(count => count.value + 1)">plus</button>
    //写法2 <button @click="setCount(count - 1)">minus</button>
    if (typeof newState === 'function') {
      //可能是一个函数
      states[stateIndex].value = newState(states[stateIndex]);
    } else {
      //可能是一个表达式
      states[stateIndex].value = newState;
    }
  };
}
```

对于一个数据的修改操作有多种形式的时候，可以使用`useReducer`方法。

```html
<h1>{{count}}</h1>
<button @click="countDispatch({ type: 'plus', payload: 2 })">plus</button>
<button @click="countDispatch({ type: 'minus', payload: 1 })">minus</button>
<script>
  export default{
    setup() {
      const [count, countDispatch] = useReducer(
        (count, setCount, { type, payload }) => {
          switch (type) {
            case 'plus':
              setCount((count.value += payload));
              break;
            case 'minus':
              setCount((count.value -= payload));
              break;
            default:
              break;
          }
        },
        100
      );
      return { count, countDispatch };
    }
  }
</script>
```

**封装集成`useReducer`函数过程**

```js
import useState from './useState';

export default function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);
  const dispatch = (action) => {
    reducer(state, setState, action);
  };
  return [state, dispatch];
}
```

情景2是通过`useReactive`方法来绑定视图，减少`setup`区域的逻辑代码。

```html
<h1>{{name}}</h1>
<h1>{{age}}</h1>
<button @click="setInfo('age', 30)">plus</button> //写法1
<button @click="setInfo('age', (age) => age = 21)">plus</button> //写法2
<button @click="setInfo({ name: 'icy', age: 18 })">minus</button> //写法3
<script>
  export default{
    setup() {
      const [info, infoRefs, setInfo] = useReactive({
        name: 'lulu',
        age: 20
      });
      return { info, ...infoRefs, setInfo };
    }
  }
</script>
```

**封装集成`useReactive`函数过程**

```js
const { reactive, toRefs } = Vue;

export default function useReactive(initialState) {
  const state = reactive(initialState); //reactive包装
  const stateRefs = toRefs(state); //解包操作
  const setState = (key, value) => {
    if ({}.toString.call(key) === '[object Object]') {
      for (let k in key) {
        if (initialState.hasOwnProperty(k)) {
          state[k] = key[k];
        }
      }
    } else {
      //非对象
      if (typeof value === 'function') {
        state[key] = value(state[key]);
      } else { state[key] = value; }
    }
  };
  return [state, stateRefs, setState];
}
```

