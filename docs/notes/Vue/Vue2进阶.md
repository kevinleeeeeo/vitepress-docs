# `Vue` 进阶

## MVC

**关于后端 `MVC`：**

- `M：Model `数据模型(模型层)，操作数据库(增删改查)
- `V：View`视图层，显示视图或视图模板
- `C：Controller `控制器层(逻辑层)，数据和视图关联挂载和基本的逻辑操作

**服务端渲染：**

视图 `View `需要数据去找 `Controller `对应的方法，调用 `Model `的方法，获取数据，返回给 `Contronller `对应的方法，渲染 `render `到视图 `View `中。

**前端渲染：**

`API `层，前端请求的 `API `对应的是控制器中的方法，前端异步请求 `URL `对应控制器中的方法，调用 `Model `层的方法，操作数据库，然后获取数据返回给控制器方法，控制器方法响应回前端。

**关于前端 `MVC`：**

- `Model`：需要管理视图所需要的数据，数据与视图的关联
- `View`：管理 HTML 模板和视图渲染
- `Controller`：管理事件逻辑



**MVC 实现**，用前端 `MVC`思想做一个计算器。

```js
//MVC.js
(function () {
  function init() {
    //组织数据/数据监听操作/数据代理
    model.init();
    //组织HTML模板/渲染html模板
    view.render();
    //事件处理函数定义与绑定
    controller.init();
  }

  //管理视图所需要的数据，数据与视图的关联
  var model = {
    data: { ... },
    //做一个代理，劫持数据并监听数据
    init: function () {...}
  }

  //管理HTML模板和视图渲染
  var view = {
    el: '#app',
    template: `<p>...</p>`,
    //解析template，替换{{}}里面的内容 页面挂载 更新
    render: function (mutedData) {...}
  }

  //数据和视图关联挂载和基本的逻辑操作
  var controller = {
    //获取节点和事件绑定
    init: function () {...},
    //输入框文本更改事件处理函数
    handleInput: function (e) {...},
    //点击加减乘除按钮事件处理函数
    handleBtnClick: function (e) {...}
  }

  init();
})()
```

**总结：**

代码看出 `MVC `是 `MVVM `的雏形，`MVVM `解决了驱动不集中，不内聚的方式，更加解决了视图与模型之间完全隔离开来的一种关系。从而演变成 `MVVM `的形式，将 `ViewModel `隔离出来，剩下 `M data` 和 V view`供开发者使用，更加说明`vue `是只关注于视图渲染。`ViewModel 里有收集依赖，模板编译，数据劫持等重要方法。

## MVVM

MVC的缺点是驱动被MVC分离成三部分，跟M V 逻辑混合在一起了。MVVM的优点是自身的驱动ViewModel让Model数据保存和处理的层的数据更改驱动View视图，而视图的更新也需要ViewModel。

![mvvm](http://note-img-bed.dt-code.fun/mvvm.png)

**MVVM 实现**

**目录结构：**

```
├─index.html
├─src
|  └App.js
├─MVVM
|  ├─index.js - ViewModel入口文件
|  ├─render.js - 负责渲染与更新
|  ├─shared
|  |   └utils.js - 工具函数集合
|  ├─reactive - 负责负责响应式数据
|  |    ├─index.js - 创建响应式数据
|  |    └mutableHandler.js - 负责代理/劫持响应式数据
|  ├─compiler - 负责编译模板
|  |    ├─event.js - 负责编译事件字符串并且绑定事件处理函数
|  |    └state.js - 负责视图变量的替换，打上标识补丁，变成一个有标识的节点结构
```

**源码地址：**

https://gitee.com/kevinleeeee/vue-mvvm-demo

---

**<u>案例：源码实现 `MVVM`</u>**

`Mini Vue` 的组成部分：

- `observe `监听器：数据劫持
- `reactive `实现响应式：属性代理
- `Dep `依赖管理器：负责将视图中所有依赖收集管理，包括依赖添加和通知更新
- `watcher `监听器：具体更新的执行者，将模板编译和数据劫持联系起来
- `Compile `编译器：扫描模板中所有依赖(指令，插值，绑定，事件等)，创建更新函数和监听器(`watcher`)

**功能：**

模板编译/数据劫持/观察者 `watcher `关联数据和视图/发布订阅模式

**实现步骤：**

1. 模板编译 `Compile`
2. 数据劫持 `Observer`
3. 监听器 `Watcher`
4. 发布订阅` Observer > Dep`

**源码地址：**

https://gitee.com/kevinleeeee/vue2.x-mvvm-demo







## attributes

`vue `文档定义是非 `props `的 `attribute`。

```html
//id和class均为div标签里的属性
<div id="app" class="xxx"></div>
```

**_如何利用在组件上传到 `attributes `让子组件能够获取并使用他们?_**

_解决方案 1：_

利用事件传递机制(较为复杂)。

```html
//子组件
<select @change="changeOption">
  <option value="1">选项1</option>
  <option value="2">选项2</option>
  <option value="3">选项3</option>
</select>

export default {
  name:'MySelector'
  data(){
    return { selectorValue: this.value }
  },
  methods:{
    changeOption(){
      this.$emit('changeOption', this.selectorValue);
    }
  }
}
```

```html
//父组件
<my-selector @change-option="changeOption"></my-selector>

export default {
  name: 'App',
  data(){
    return { selectorValue: '3' }
  },
  methods:{
    //通过子组件事件传到过来的value参数
    changeOption(value){
      //console.log(value);
    }
  }
}
```

_解决方案 2：_

非 `props `的 `attribute`

```html
//子组件
<select>
  <option value="1">选项1</option>
  <option value="2">选项2</option>
  <option value="3">选项3</option>
</select>

export default {
  name:'MySelector'
  create(){
    console.log(this.$attrs);
    //Proxy{ model: '123' }
  }
}
```

```html
//父组件
//在组件上进行传递属性
//单个的根元素，使用组件时传递的所有属性，都会增加到根元素上
<my-selector model="123"></my-selector>

export default {
  name: 'App',
  data(){
    return {
      selectorValue: '3'
    }
  },
}
```

继承是可以被禁用的。

```js
export default {
  name:'MySelector',
  inheritAttrs: false,
  create(){
    console.log(this.$attrs);
    //Proxy{ model: '123' }
  }
}
```







## mixin

***`mixin`是什么？***

它是`option API`时期的产物，如果组件有同样的`data`或`method`，则可以将`data`单独拿出来放到`mixin`再混入到组件里，使代码减少重复性。

混入，跟普通的组件区别并不大，相当于一个公共的组件，在组件化中引入到组件内部就可以访问组件里面的属性和方法和视图，其实是一个组件类高度复用的工具。



***为什么`vue3.x`不推荐使用？***

- 用于多个组件的时候，可能会多出很多不必要的选项或属性
- 很可能会无限拆分`mixin`
- 不好管理也不好取名字，有可能导致命名冲突
- 导出的`mixin`对象它不是函数，没办法动态传参调整`mixin`的`option`的混入情况，极大的干扰了`mixin`合理性复用

`vue3.x`更好的解决方案是`Composition API`，它所有复用性的集成性的功能全部封装成函数，在`vue3.x`中它可以使用内置提供的`Composition API`更灵活的使用。

**注册使用：**

```js
//自定义mixins文件夹
//假设需要data里的数据时, mixins文件夹里定义文件types.js
export default{
  data(){ return { ... } }
}

//MyButton组件
import typesMixin from '../mixins/types.js';
export default{
  name: 'MyButton',
  mixins: [typesMixin]
}
```

**总结：**

1. 当`mixin`和组件的定义的属性冲突时，组件自身的内容优先
2. 生命周期钩子函数混入时，优先执行`mixin`后执行组件
3. 对象`options`像`methods`,`components`,`directives`等，会合并对象，存在同名时组件优先

## vuex

![image-20211207151020765](http://note-img-bed.dt-code.fun/image-20211207151020765.png)

**`Vuex `工作流：**

- 组件 -> `dispatch `-> `action`
  - `dispatch `-> `type(actionType)` -> 某一个 `action`
- `action `-> `comit `-> `mutation`
- `mutation `-> `change `-> `state`
- `render `方案： `state `-> 数据流 -> 视图

文件目录：

- `actionTypes`: `action `类型
- `actions`: 调用 `mutation `的方法
- `mutations`: 更改 `state `的方法
- `state`: 中央数据管理池
- `store `出口：`actions,mutation,state` 统一到仓库里进行管理

**配置：**

```
//"vuex": "^4.0.0-alpha.1"
//入口文件
import store from './store'
```

```
//store > index.js
import Vuex from 'vuex';
import state from './states';
import mutations from './mutations';

export default Vuex.createStore({
  state,
  mutations
});
```

**使用：**

```
//获取仓库
import {useStore} from 'vuex';

export default {
  setup(){
    const store = useStore(),
      state = store.state;

    //注意：在vue2.x中是通过computed里 ...mapState(['xxx'])方法拿到里面的属性
    //1.所以这里不能直接访问state.xxx
    //2.所以需要用computed函数取出state里的属性
    //实际上返回的是state里面的对象
    return computed(() => state).value;
  }
};
```

---

<u>**案例：TodoList**</u>

**技术：**

`typescript`/`vue3.x`/`vuex`/自定义 `hooks`

**功能和组件：**

```
//组件划分：
- TodoList
  - TodoInput -> 输入的组件
  - TodoList -> 列表组件
    - TodoItem -> 列表项
      功能1：checkbox - 完成或未完成的选择
      功能2：button - 删除该项的功能
      功能3：button - 正在做的确认按钮
```

```
//项目目录
├─package.json
├─README.md
├─tsconfig.json
├─src
|  ├─App.vue - 页面挂载时加载列表
|  ├─main.ts
|  ├─typings
|  |    └index.ts - 管理类型接口的出口文件 interface
|  ├─store
|  |   ├─actions.ts - commit调用mutation的方法
|  |   ├─actionTypes.ts - 管理定义store里方法名称的变量
|  |   ├─index.ts - 出口文件
|  |   ├─mutations.ts - 管理操作state数组逻辑
|  |   └state.ts - 中央数据管理池
|  ├─hooks - 自定义hook 带有两个钩子/钩子底下各有些dispatch方法
|  |   └index.ts
|  ├─components
|  |     ├─TodoList
|  |     |    ├─index.vue
|  |     |    └Item.vue
|  |     ├─TodoInput
|  |     |     └index.vue
```

**项目流程**：

1. 列表展现页面：
   1. 输入框组件通过键盘事件拿到输入的文本内容
   2. 当有输出内容时执行自定义 `hooks `底下的钩子里`setTodo`方法
   3. `setTodo`方法`dispatch`传入组装好的带有输入框内容的对象
   4. 在`actionType`模块里定义大写字符串方法名称为大写变量
   5. 变量定义的`actions`名字的方法触发`commit`变量名称的事件,并传入组装后的对象
   6. `mutations`底下定义变量名称的方法里实现操作并保存对象到`state.list`数组里
   7. 在自定义 hooks 里的钩子定义`setLocalList`方法实现将`state.list`数组存入`localStorage`里
   8. `watch`监听每当`state.list`数据有变化就调用 `hooks `里的钩子定义`setLocalList`方法并传入从`getLocalList`方法获取到的`localStorage`数组
   9. 在自定义 hooks 里的钩子定义`setTodoList`方法实现将`localStorage`里的数组新增合并至`state.list`数组里
   10. 在根组件`onMounted`页面挂载时执行`setTodoList`方法拿到`state.list`的数据
   11. 列表组件根据数据遍历并绑定视图实现页面展示列表
2. 点击列表内容修改页面展示：
   1. item 子组件绑定点击事件`emit`传递并带有`id`参数
   2. list 组件点击事件关联钩子里定义的`distpatch`方法
   3. 通过`mutations`里定义的逻辑实现修改`state.list`里的属性
   4. 子组件绑定视图根据`state.list`里实时更改的数据展示变化

**_问题：在 `typescript `中，枚举的作用是什么？_**

在项目里，枚举非常常用，一个变量含有几个固定的几个值时，需要枚举出来，并枚举访问，枚举可以当类型也可取值

**_问题：在 `typescript `中，类型`type`和接口`interface`有什么区别？_**

都可以针对对象定义，`type`相对少用，因为`interface`是可以通过`extends`继承另外的接口，扩展性比较好，一般对对象的定义都是用`interface`

> **注意：**
>
> - 所有接口命名都是以 'I' 开头
> - 声明枚举一般大写

```
//定义接口
interface ITodo{
  id: number,
  content: string,
  status: TODO_STATUS
}
```

```
//声明枚举
enum TODO_STATUS{
  WILLDO = 'willdo',
  DOING = 'doing',
  FINISHED = 'finished'
}
```

**_问题：为什么在 `actionTypes `里不用字符串而是用变量？_**

1. 为了不用维护字符串
2. 变量能够很好的管理字符串，在调用方法的时候直接用变量去调用

```
//actionTypes.ts
//把字符串转为变量
export const SET_TODO: string = 'SET_TODO';
```

**_问题：在 `typescript `里如何保存数据到 `state `里？_**

1. 定义`actionType`把字符串转为变量

2. `mutations`定义修改`state`的方法

3. 自定义 `hooks `里的方法执行

4. hooks 里定义的方法`dispatch`派发并传入数据到`actions`

5. 通过`actions`调用`commit`派发到`mutations`

6. `mutations`更改`state`

**设计观：**

`TodoList `是一个方法集合，增加/删除/展示列表/更改状态，实际上都在操作列表，应该自定义一个 `hook API`，来管理这些方法的解决方案，让 `TodoList `形成一个方案集合，导出一些方法，让其在各个组件都可以单独导入某些方法去执行相应的程序

```
//src > hooks > index.ts

function useTodo() {

  function setTodo() {}
  function setTodoList(){}
  function removeTodo(){}
  function setStatus(){}
  function setDoing(){}

  //返回导出解决方案
  return {
    //方案1：修改Todo,设置到列表里
    setTodo,
    //方案2：刷新页面列表读取loacalStorage里的todoList显示在页面的列表项里
    setTodoList,
    //方案3：删除
    removeTodo,
    //方案4：更改待办/未做的状态
    setStatus,
    //方案5：更改正在做的状态
    setDoing
  }
}
```

**_问题：如何刷新页面(`app `组件挂载)拿到数据？_**

通过把 `state `里的数据存入`localStorage`，将从`localStorage`里读取的数组数据修改为`state.list`的数据，在根组件挂载时`onMounted`时执行读取`state.list`数据

> **补充：** `vue `子组件`props`属性的类型注解可以使用`PropType`API 来断言，作为 typescript 的泛型

```
props: {
  todoList: Array as PropType<ITodo[]>,
},
```

**源码地址：**

https://gitee.com/kevinleeeee/vue3-typescript-todolist-vuex-demo

---

<u>**案例：tab 栏切换**</u>

**技术：**

- `vuex `负责：兄弟组件之间的数据通讯
- `mixin `负责：构建公共的 `UI `组件库
- `filter `负责：给视图中数据绑定时再做文字加工
- `directives `负责：给所有的项清除类/给点选的 `nav `项添加类

**自定义指令：**

大量的指令方便代码阅读，易于维护

`mixins`: 利用公共代码全局注册可以用公共 `UI `组件

```
//项目结构
├─src
|  ├─App.vue
|  ├─main.js
|  ├─store
|  |   ├─index.js
|  |   ├─mutation.js
|  |   └state.js
|  ├─router
|  |   └index.js
|  ├─pages
|  |   └Index.vue
|  ├─libs
|  |  ├─myUI
|  |  |  ├─index.js
|  |  |  ├─NavBar
|  |  |  |   ├─index.vue
|  |  |  |   └Item.vue
|  |  |  ├─directives
|  |  |  |     └tabCurrent.js
|  ├─filters
|  |    ├─index.js
|  |    └replaceNumToChs.js
|  ├─directives
|  |     ├─index.js
|  |     └tabCurrent.js
|  ├─data
|  |  ├─content.js
|  |  └nav.js
|  ├─components
|  |     ├─Tab
|  |     |  ├─index.vue
|  |     |  ├─Nav
|  |     |  ├─Content
|  |     |  |    └index.vue
├─public
|   └index.html
```

**源码地址：**

https://gitee.com/kevinleeeee/vuex-filter-mixin-tab-demo

---

**`vuex `机制:**

只有 `mutation `里的方法操作 `state `里面的属性

```
//state是一个对象
{
  bool: false
}
```

```
//mutation装载以下方法
{
  setBool(state, bool){
    state.bool = bool;
  }
}
```

```
//注册使用
Vue.use(Vuex);

//实例化Vuex里的Store实例
export default new Vuex.Store({
  state: {
    bool: false
  },
  mutations: {
    setBool(state, bool){
      state.bool = bool;
    }
  }
});
```

`getter`可以去 `state `里的属性的时候可以加工一下

```
export default new Vuex.Store({
  ...,
  getters: {
    getMyInfo(state){
      return `我的名字是${state.name}, 今年${state.age}岁`;
    }
  }
});

//执行调用
this.myInfo = this.$store.getter.getMyInfo;
```

**`vuex `中央状态管理器**

- `state `仓库 放数据

- `action `行为 事件

- `mutation `处理方法
- `getter `加工数据
- `modules `处理大型项目

![image-20211127005629674](http://note-img-bed.dt-code.fun/image-20211127005629674.png)

**流程闭环**：

```
component(dispatch form backend API)
-> actions(commit)
-> mutation(mutate)
-> state
-> render component(dispatch)
-> actions...
```

`actions`如果更改数据的时候涉及到异步时，必须使用`actions`

```
//Vuecomponent(dispatch) -> actions
export default new Vuex.Store({
  ...,
  actions: {
    getData(ctx, payload){
      const { key, testType, model, subject } = payload;

      axios(...).then(res => console.log(res));
    }
  }
});

//组件里执行调用
//this.$store.dispatch(调用的函数, 函数参数集合);
this.$store.dispatch('getData', {...});
```

```
//actions(commit) -> mutations
//缓存dispatch后的数据
export default new Vuex.Store({
  ...,
  state: {
    data: []
  },
  mutations: {
   setData(state, data){
     state.data = data;
   }
  },
  actions: {
    getData(ctx, payload){
      const { key, testType, model, subject } = payload;

      //执行ctx底下的commit,传入mutation执行的方法和后端拿到的数据
      axios(...).then(res => {
        //将后端数据存入data里
        console.log(ctx.commit('setData', res.data.result));
      });
    }
  }
});
```

`modules`

```
//模块1 store > count1 > index.js
export default {
  //开启命名空间
  namespaced: true，
  state,
  mutations
}

//模块2 store > count2 > index.js
export default {
  //开启命名空间
  namespaced: true，
  state,
  mutations
}
```

```
//store > index.js
export default new Vuex.Store({
  ...,
  //大型项目分模块
  //模拟两个状态
  modules: {
    count1,
    count2
  }
});
```

---

<u>**案例：小米购物车移动端**</u>

**技术：**

`vue2.x`/`vuex`/请求数据函数封装

**功能：**

- 同步`localStorage`数据到`state`数据里
- 手机列表渲染
- 设置购物车总价和总数量
- 设置购物车列表数据，增减商品的数量和价格同步关联`localStorage`
- 根据`localStorage`数据渲染购物车列表
- 购物车加减计算器组件

```
//项目目录：
├─vue.config.js - 配置代理解决跨域
├─src
|  ├─App.vue - 根组件挂载路由占位
|  ├─main.js - 入口文件
|  ├─views
|  |   ├─Cart.vue - 购物车页面
|  |   └Home.vue - 首页页面
|  ├─utils
|  |   ├─config.js - 配置请求地址API
|  |   ├─https.js - 封装axiosGet函数
|  |   └tools.js - 工具：数据格式化/同步localStorage函数
|  ├─store
|  |   ├─actions.js - 管理commit方法和payload
|  |   ├─index.js
|  |   ├─mutations.js - 管理逻辑方法操作state数据对其增删改
|  |   └state.js - 中央状态池
|  ├─services
|  |    ├─index.js - 将getData函数请求回来的数据进行再加工
|  |    └request.js - 封装getData函数可以自定义参数修改url
|  ├─router
|  |   └index.js
|  ├─components
|  |     ├─TotalPanel - 购物车页面底下的总价组件
|  |     |     └index.vue - 绑定视图/组件更新时同步localStorage
|  |     ├─PhoneList - 手机列表组件
|  |     |     ├─index.vue - 遍历子项/拿到state数据并传子组件
|  |     |     └Item.vue - 绑定视图/点击事件/派发任务到mutations
|  |     ├─Header 公共的头部组件
|  |     |   ├─BackIcon.vue - 后退组件
|  |     |   ├─CartIcon.vue - 购物车(0) 组件/组件更新时同步localStorage
|  |     |   └index.vue
|  |     ├─CartList 购物车列表组件
|  |     |    ├─index.vue - 遍历子项/拿到state数据并传子组件
|  |     |    ├─Item.vue - 绑定视图/导入加减计算器组件
|  |     |    ├─Calculator - 加减计算器组件
|  |     |    |     └index.vue - 绑定视图/点击事件/派发任务到mutations
```

**_问题：为什么要设置购物车总价和总数量？_**

子组件的单击加入购物车按钮会`dispacth`到`mutations`里操作`state.totalPrice`实现价格和数量的累加或累减

**_问题：如何实现点击加入购物车时购物车页面显示相关的商品信息？_**

子组件的单击加入购物车按钮会将相应的商品信息加入到`state.cartData`数组里实现根据数组属性渲染列表

**_问题：当重复商品增加数量或减少数量时如何同步总数量和总价格数据？_**

找到点击当前商品索引`index`，给当前重复添加的商品`state.cartData[idx]`累加数量和价格

**_问题：为什么在 header 组件或购物车页面底部总价组件更新时同步`localStorage`?_**

因为点击按钮时会触发修改`state`数据，而 header 组件和总价组件刚好是根据`state`绑定了视图, 所以视图会随着`state`数据修改而实时渲染更新，通过`updated`生命钩子函数可以同步`localStorage`数据

**源码地址：**

https://gitee.com/kevinleeeee/vue-xiaomi-shoppingcart-mobile



## `Vue.extend`

在` Vue 2.x` 中，`Vue.extend` 曾经被用于创建一个基于 `Vue `构造函数的“子类”，其参数应为一个包含组件选项的对象。在 `Vue 3.x `中，我们已经没有组件构造器的概念了。应该始终使用 `createApp` 这个全局 `API `来挂载组件：

```
// 之前 - Vue 2

// 创建构造器
const Profile = Vue.extend({
  template: '<p>{{firstName}} {{lastName}} aka {{alias}}</p>',
  data() {
    return {
      firstName: 'Walter',
      lastName: 'White',
      alias: 'Heisenberg'
    }
  }
})
// 创建一个 Profile 的实例，并将它挂载到一个元素上
new Profile().$mount('#mount-point')
```

```
// 之后 - Vue 3
const Profile = {
  template: '<p>{{firstName}} {{lastName}} aka {{alias}}</p>',
  data() {
    return {
      firstName: 'Walter',
      lastName: 'White',
      alias: 'Heisenberg'
    }
  }
}
Vue.createApp(Profile).mount('#mount-point')
```

***问题：为什么使用`Vue.extend`?***

- 脱离根节点
- 脱离应用实例`app`
- 希望通过插件的方式能够不在模板上调用，而是用方法操作组件的状态，需要`Vue.extend`创建一个新的应用的构造函数，可以多次实例化不同的应用



## `Vue.filter`

注册或获取全局过滤器。`Vue.js `允许你自定义过滤器，可被用于一些常见的文本格式化。对视图上的数据绑定的时候的再加工

过滤器可以用在两个地方：**双花括号插值和 `v-bind` 表达式**

```
// 注册
Vue.filter('my-filter', function (value) {
  // 返回处理后的值
})

// getter，返回已注册的过滤器
var myFilter = Vue.filter('my-filter')
```







## 渲染机制

Vue 是如何将一份模板转换为真实的 DOM 节点的，又是如何高效地更新这些节点的呢？

Vue 的渲染系统是基于虚拟 DOM概念构建的。一个运行时渲染器将会遍历整个虚拟 DOM 树，并据此构建真实的 DOM 树。这个过程被称为**挂载** (mount)。

如果我们有两份虚拟 DOM 树，渲染器将会有比较地遍历它们，找出它们之间的区别，并应用这其中的变化到真实的 DOM 上。这个过程被称为**更新** (patch)。

虚拟 DOM 带来的主要收益是它让开发者能够灵活、声明式地创建、检查和组合所需 UI 的结构，同时只需把具体的 DOM 操作留给渲染器去处理。



渲染底层的过程，如Vue 组件挂载后发生了如下这几件事：

1. **编译**：Vue 模板被编译为了**渲染函数**：即用来返回虚拟 DOM 树的函数。这一步骤可以通过构建步骤提前完成，也可以通过使用运行时编译器即时完成。
2. **挂载**：运行时渲染器调用渲染函数，遍历返回的虚拟 DOM 树，并基于它创建实际的 DOM 节点。这一步会作为**响应式副作用**执行，因此它会追踪其中所用到的所有响应式依赖。
3. **更新**：当一个依赖发生变化后，副作用会重新运行，这时候会创建一个更新后的虚拟 DOM 树。运行时渲染器遍历这棵新树，将它与旧树进行比较，然后将必要的更新应用到真实 DOM 上去。

![image-20220925155018425](http://note-img-bed.dt-code.fun//image-20220925155018425.png)



**模板和渲染函数的区别：**

Vue 模板会被预编译成虚拟 DOM 渲染函数。Vue 也提供了 API 使我们可以不使用模板编译，直接手写渲染函数。在处理高度动态的逻辑时，渲染函数相比于模板更加灵活，因为你可以完全地使用 JavaScript 来构造你想要的 vnode。



**推荐使用模板的原因：**

1. 模板更贴近实际的 HTML。这使得我们能够更方便地重用一些已有的 HTML 代码片段，能够带来更好的可访问性体验、能更方便地使用 CSS 应用样式，并且更容易使设计师理解和修改。
2. 由于其确定的语法，更容易对模板做静态分析。这使得 Vue 的模板编译器能够应用许多编译时优化来提升虚拟 DOM 的性能表现。
3. 在实践中，模板对大多数的应用场景都是够用且高效的。渲染函数一般只会在需要处理高度动态渲染逻辑的可重用组件中使用。





## 渲染函数

在绝大多数情况下，`Vue `推荐使用模板语法来创建应用。然而在某些使用场景下，我们真的需要用到 JavaScript 完全的编程能力。这时**渲染函数**就派上用场了。

`render`函数目的是把虚拟`dom`转为真实`dom`的渲染行为，在`vue`组件中会提取模板`template`(字符串)去编译模板。

在浏览器中它无法识别`vue`的指令，此时需要优化，首先将模板转为`AST`语法树，再优化`AST`树，将浏览器不能识别的指令转为逻辑，将优化后的`AST`结构树转为虚拟`dom`，通过渲染函数转为真实`dom`。

***为什么需要虚拟`dom`?***

某些视图里的内容不需要经常更新，对比对结构描述的对象，当内容不一样时才做改变。

**关于`h`函数：**

也叫`createNodeDescription`创建节点描述，`h`函数创建返回的是`VNode`虚拟节点，多个虚拟节点就会组成虚拟`dom`树，对真实`dom`的描述。

**`h`函数的参数：**

可以是`component`组件，也可以是对节点的描述。

```js
//2.x
new Vue({
  render(h){ return h(App); }
}).$mount('#app');

//3.x
const { createApp, h } = Vue;
const app = Vue.createApp({
  render(){ return h(App); }
});
```

使用`h`函数来描述节点，参数1是标签元素，参数2没有`props`属性时默认为`children`，如果没有`props`可以用`{}`或`null`占用。

```js
<div class="app">
  <div class="article-box">{{title}}</div>
</div>

const app = Vue.createApp({
  render(){
    return h(
      'div',
      { class: 'app' },
      h(
        'div',
        { class: 'article-box' },
        this.title
      )
    );
     //插槽写法:
     h(
       'h1',
       { class: 'title' },
       //this.$slot.default()
       //具名插槽
       this.$slot.author()
     );
  }
});

//描述后会返回虚拟节点
```

多个`child`不适用一个`h`返回的虚拟节点写法。

```JS
const app = Vue.createApp({
  render(){
    return h(
      'ul', 
      null, 
      Array.from({length: 6}).map((item, index) => {
        return (
          'li', 
          null, 
          h('h' + (index + 1), null, `This is h${index + 1}`)
        );
     }));
  }
});
```



## `JSX / TSX`

`JSX `是 `ECMAScript `的类似 `XML `的语法扩展，没有任何定义的语义。它不打算由引擎或浏览器实现。**这不是将 `JSX `纳入 `ECMAScript `规范本身的提议。**它旨在供各种预处理器（转译器）使用，以将这些标记转换为标准的 `ECMAScript`。

`JSX`目的是为定义具有属性的树结构定义一种简洁且熟悉的语法。通用但定义良好的语法使独立的解析器和语法高亮器社区能够符合单一规范。

`JSX `是 `JavaScript `的一个类似 `XML `的扩展，有了它，我们可以用以下的方式来书写代码：

```js
const vnode = `<div>hello</div>`;
```

在 `JSX` 表达式中，使用大括号来嵌入动态值：

```js
const vnode = `<div id={dynamicId}>hello, {userName}</div>`;
```



## `Dom Diff`算法

***什么是`Dom Diff`？***

比对(`diff`)渲染更新前后产生两个虚拟`dom`对象的差异，并产出差异补丁对象，再将差异补丁对象应用到真实`dom`节点上。

***为什么要用`Dom Diff`?***

在浏览器中，操作`dom`需要耗费性能的，尽可能的减少操作`dom`可以保证性能。

**`Dom Diff`算法的特点：**

- 平级对比，如`ul`对`ul`，不跨级对比
- 里层元素只是位置顺序不一样，但是内容一样时不会重新渲染
- 深度优先，从外到内嵌套比对





## 应用配置

关于`Vue`应用配置`Application Config`, 每个 `Vue `应用都会暴露一个包含其配置项的 `config` 对象：

```js
const app = createApp({});
console.log(app.config);
```

在挂载应用之前，你可以修改下列 `property`

- `globalProperties`：添加一个可以在应用的任何组件实例中访问的全局 `property`。组件的 `property `在命名冲突时具有优先权。











## 路由

**前端权限控制**

**_问题：为什么前端也要进行权限控制？_**

web 交互方式也跟数据密不可分的，而数据库最紧密接触的是后端程序，在前后端分离开发时，越来越多的项目也需要在前端进行权限控制

关于后端的权限设计有：

用户/角色/权限

**_问题：前端的权限控制有什么好处？_**

- 降低非法操作的可能性
- 减少不必要的请求，减轻服务器压力
- 提高用户体验

**_问题：前端的权限控制有哪些？_**

视图层的展示和前端所发送的请求

**_问题：前端的权限控制解决方案有哪些？_**

1. 菜单的控制：如侧边栏，根据请求到的数据展示对应的菜单，点击菜单查看相关的界面
2. 界面的控制：
   1. 如用户没有登录，手动输入地址栏时自动跳回登录页面
   2. 如用户以及登录，输入非权限的地址则跳转到 404 页面
3. 按钮的控制：根据用户的权限，是否显示或隐藏该按钮以及对按钮功能的限制
4. 请求和响应的控制：对没有权限的用户在进行一些非法操作时不提交数据请求减轻服务器的压力

**_问题：如何动态添加路由规则？_**

1. 后端返回用户对应路由权限列表
2. 将路由权限列表转为路由规则的树形化格式
3. 插入路由规则到路由配置里

**_问题：给路由规则添加自定义的原数据有什么作用？_**

对路由规则的属性进行拓展属性名称和属性值实现对用户权限底下具体可以实现哪些操作

**_问题：如何给当前组件的路由规则添加自定义的属性数据？_**

```
//给路由规则新增原数据
const userRule = { path: '/users', component: Users, 自定义属性: xxx }

//当前组件的路由规则
//console.log(router.currentRoute);
{
  name: undefined,
  path: '/users',
  hash: '',
  query: {},
  params: {},
  fullPath: '/users',
  matched: [...],
  自定义的属性: 'xxx'
}
```

1. 通过自定义指令`v-mydir="{action:'add'}"`
2. 通过`binding.value`拿到自己定义在视图上的值`{action: 'add'}`
3. 在动态添加路由规则的同时给路由规则新增一个原数据属性
4. 判断用户是否具备`action`的权限
   1. 拿到当前组件路由的新增属性`router.currentRoute.xxx`
   2. 判断`router.currentRoute.xxx.indexOf(action) == -1`底下是否含有跟自定义指令定义的`action`
   3. 如果找不到就修改`el`如删除节点不显示点击添加按钮

---

<u>**案例：后台路由权限管理**</u>

**技术：**

`koa2`/`vue`/前后端

**案例图片：**

![image-20211217145233430](http://note-img-bed.dt-code.fun/image-20211217145233430.png)

**原理：**

1. 用户 `uid ` -> 后端 `API ` -> 路由权限 `API`
2. 后端 -> 用户对应路由权限列表 -> 前端 -> `JSON`
3. `JSON` -> 树型结构化
4. 树型结构化的数据 -> `vue `路由结构
5. 路由结构动态 -> 静态路由
6. 根据树型结构化的数据 -> 菜单组件

```
//JSON
[
  {
    id: 2,
    //parent id
    pid: 3,
    path:
    name:
    link:
    title:
  }
]
```

**_问题：如何做后端跨域？_**

```
npm i koa2-cors -S
```

```
//app.js
const cors = require('koa2-cors');

app.use(cors({
  origin: function (ctx) {
    return 'http://localhost:8080'
  }
}));
```

**前端项目顺序：**

1. 编写后台界面
2. 请求后端接口
3. 封装请求函数
4. 将请求到的数据存入 `vuex`
5. `actions`里异步获取后端数据
6. 将数据进行树型结构化格式化
7. `mutations`里定义方法存储`state`
8. 前端动态生成路由
9. 将数据生成树状结构路由配置对象
10. 配置路由守卫`beforeEach`
    1. 没有权限时：
       1. 请求后端数据
       2. 格式化后的树形结构的路由规则对象数组
       3. `addroute`新增到路由列表实现动态添加路由
       4. 编写各个地址的组件文件
       5. 给`next`回调分支处理实现访问不同地址显示不同的页面
    2. 有权限时：
       1. 直接访问不做守卫拦截
11. 编写 `SideBar `组件视图根据路由渲染路由列表
12. 实现点击路由导航名称跳转到路由页面显示路由组件

```
//注册一个全局前置守卫
const router = new VueRouter({ ... })

router.beforeEach((to, from, next) => {
  // 注意：确保 next 函数在任何给定的导航守卫中都被严格调用一次。它可以出现多于一次，但是只能在所有的逻辑路径都不重叠的情况下，否则钩子永远都不会被解析或报错。
})
```

**后端项目顺序：**

1. 编写用户表(包含权限的数组容器)
2. 编写路由数据表
3. 遍历用户表和路由数据表
4. 将某个用户符合条件的权限路由对象放入容器返回给前端

```
//前端项目目录：
├─package.json
├─src
|  ├─App.vue - 根组件/管理布局组件
|  ├─main.js - 入口文件/请求路由数据/动态生成路由列表/拼接路由列表/路由守卫
|  ├─views - 各路由视图组件
|  |   ├─Course.vue
|  |   ├─CourseAdd.vue
|  |   ├─CourseInfoData.vue
|  |   ├─CourseOperate.vue
|  |   ├─Home.vue
|  |   ├─NotFound.vue
|  |   ├─Student.vue
|  |   ├─StudentAdd.vue
|  |   └StudentOperate.vue
|  ├─store
|  |   ├─actions.js - 定义请求路由列表数据函数/权限函数
|  |   ├─index.js
|  |   ├─mutations.js - 定义操作state的方法
|  |   └state.js - 中央状态管理池/hasAuth/userRouters数组
|  ├─services
|  |    └index.js - axios函数封装
|  ├─router
|  |   └index.js - 路由入口文件
|  ├─libs
|  |  └utils.js - 格式化路由列表为树形结构化/生成树状结构路由配置对象
|  ├─components - 页面布局组件
|  |     ├─Header.vue
|  |     ├─MenuItem.vue
|  |     ├─PageBoard.vue
|  |     └SideBar.vue
|  ├─assets
|  |   ├─css
|  |   |  └common.css
```

**前端源码地址：**

https://gitee.com/kevinleeeee/vue-router-admin-frondend-demo

**后端源码地址：**

https://gitee.com/kevinleeeee/vue-router-admin-backend-demo

---

**`vue3`路由用法：**

设置

```
//入口文件
import router from './router'

createApp(App)
  .use(router)
  .use(store)
  .mount('#app')
```

```
//"vue-router": "^4.0.0-alpha.6",
import {
  createRouter,
  createWebHistory
} from 'vue-router';

const routes = [{
    path: '/',
    name: 'day',
    component: DayPage
  },
  {
    path: '/month',
    name: 'month',
    //动态导入页面组件
    component: () => import(
      '../views/Month.vue'
    )
  },
  ...
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router;
```

访问路由里面的属性和方法可以用`useRouter`

```
import { useRouter } from 'vue-router';

const router = useRouter();
router.push('/');
```

## 性能优化

**方法一**

`v-for key`通过设置 key 值，更快定位数据与 `diff`

流程：

1. 用户操作数据
2. 派发通知
3. 打补丁(`vnode`)

**方法二**

模块化组件化

- 封装具有高度复用性的模块
- 拆分高度复用性的组件
- 组件可配置性强

**方法三**

路由懒加载

- 首屏加快渲染

**方法四**

`productionSourceMap`

- `false`
- 生成 `map `文件，定位源码

**方法五**

`productionGzip`

- `true`
- 启用 `gzip `压缩功能，打包体积更小

**方法六**

`keep-alive`

缓存组件

**方法七**

插件用 `cdn `加载

**方法八**

图片 `cdn`，图片懒加载，使用 `css `图标

- 图片使用远程 `CDN `地址
- 图标使用 `CSS `图标

**方法九**

组件按需导入
