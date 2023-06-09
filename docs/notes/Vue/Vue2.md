# `Vue`基础

## 介绍

一套用于构建用户界面的渐进式框架，被设计为可以自底向上逐层应用，核心库只关心视图层。渐进式框架(`Progressive framework`), `Vue `对自己框架和其他框架对比后，生成的一个特定名词，自底向上逐层开发。

`Vue `的核心是用模板的方式进行一系列的编译，有自己的核心库会编译模板，然后会渲染 `DOM`，`Vue `将数据于 `DOM `进行关联，并建立响应式关联，数据改变视图更新。

使用`Vue`的优点是应用范围广，生态环境友好，社区完善，易上手，代码轻量，发展迅速。

> 注意：兼容性问题，`IE8 `及以下不支持 `vue`。

**数据绑定**是数据与视图渲染之间的关系，`React`是单向数据绑定，必须通过用户事件去触发才能对状态数据进行修改，导致视图的变更。`Vue`是双向数据绑定，它本身有`v-model`的机制可以完成视图变化导致状态数据的变更和视图变更。

数据流是数据流淌的方向，在父子组件中，数据按照方向去流动。`Vue`和`React`都符合单向数据流的原则，通过父组件的`state`来传递数据给子组件`props`接收。子组件只能通过`emit`去通知父组件更改`state`状态数据。



## 区别

- `Angular `是一个综合性框架，也是一个开发平台，用于创建高效，复杂，精致的单页面应用。
  - 关注项目应用
  - 不关注视图渲染和状态管理
  - 适合开发大型应用
  - 高度集成方法
  - 自上而下的延展
- `React `是构建用户界面的 `JavaScript `库。
  - 只关注视图层
  - 关注将数据渲染视图
  - 提供管理视图和状态关系的一个方法库
  - 没有状态中央管理(需借助 `Redux`)
  - 不提供路由(`react-router`)
  - 自下而上的延展
- `Vue `是视图层的核心库。
  - 关注用户界面，关注视图层
  - 关注把数据渲染视图
  - 可以选择集成 `Vuex`
  - 可以选择集成 `Vue-router`
  - 微型库概念(`Micro libs`)
  - 自下而上的延展
  - 库和库的集合形成框架

## 安装

**方法一:**  `vite + cdn` 方式

1. 初始化项目和安装打包依赖并修改`package.json`里`scripts`的`dev`为`vite`。

```
npm init -y
npm i -D vite@2.3.8
```

2. 新建 `index.html`并写入入口标签，引入`vue3 cdn`加速地址，引入入口脚本。

```html
<div id="app"></div>
<script  src="https://unpkg.com/vue@3.1.2/dist/vue.global.js"></script>
<script type="module" src="./src/main.js"></script>
```

3. 启动项目`npm run dev`。
4. 编写入口文件，引入实例`createApp()`并挂载真实节点，页面渲染成功并显示。

```js
const { createApp } = Vue;
const App = {
  data() { return { text: 'Hello Vue!' } },
  template: `<h1>{{text}}</h1>`
}
createApp(App).mount('#app');
```



---

**方法二：**

结合`webpack`打包工具搭建项目，`Vue2.x`项目搭建：

> 注：因为 `Vue `提供了编写单文件组件的配套工具，如果想要使用单文件组件，`2.0` 得需安装`vue-template-compiler`和`vue-loader`依赖，`3.0` 则需安装`vue/compiler-sfc`依赖。

1. 项目初始化和安装`webpack`依赖，更改启动脚本命令。

```
npm init -y
npm i -D webpack@4.44.2
npm i -D webpack-cli@3.3.12
npm i -D webpack-dev-server@3.11.2
```

2. 新建 `index.html`并写入入口标签，引入`vue2 cdn`加速地址，引入入口脚本。

```html
<div id="app"></div>
<script src="https://unpkg.com/vue@2.6.14/dist/vue.js"></script>
```

3. 安装`vue2`加载器相关依赖和模板编译器。

```
npm i -D vue-loader@15.9.7
npm i -D vue-template-compiler@2.6.14
npm i -D html-webpack-plugin@4.5.0
```

4. 配置`webpack.config.js`。

```JS
const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
  mode: 'development',
  entry: './src/main.js',
  output: {
    path: resolve(__dirname, 'dist'),
    filename: 'main.js'
  },
  //配置外部文件
  externals: { 'vue': 'Vue' },
  devtool: 'source-map',
  module: {
    rules: [{
      test: /\.vue$/,
      loader: 'vue-loader'
    }]
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: resolve(__dirname, 'public/index.html')
    })
  ]
}
```

5. 启动项目`npm run dev`。

6. 编写入口文件，引入实例`createApp()`并挂载真实节点。

```JS
new Vue({ render: h => h(App) }).$mount('#app');
```

7. 编写`app.vue`根文件。浏览器成功显示渲染后的页面

```html
<template>
  <div>{{ title }}</div>
</template>

<script>
export default {
  name: "App",
  data() { return { title: "Hello Vue" }; },
};
</script>
```

`vue3.x`项目搭建，基于`2.x`的文件做以下修改：

```js
//1.修改入口文件为3.x写法
Vue.createApp(App).mount('#app');

//2.引入vue3.x的cdn
<script src="https://unpkg.com/vue@3.1.2/dist/vue.global.js"></script>

//3.安装3.x依赖
npm i -D @vue/compiler-sfc
npm i -D vue-loader@16.3.0  //vue-loader@next

//4.更改配置文件 webpack-config.js 的 vue-loader 引入
const { VueLoaderPlugin } = require('vue-loader');

//5.启动项目
npm run dev

//6.浏览器成功渲染
```

**进一步配置：**

```
npm i -D sass-loader@10.1.1
npm i -D sass@1.35.2
npm i -D autoprefixer@10.3.1
npm i -D css-loader@4.3.0
npm i -D postcss-loader@4.3.0
npm i -D postcss@8.3.6
npm i -D vue-style-loader@4.1.3
npm i -D @vue/devtools@5.3.4
```

`webpack.config.js`配置代码：

```js
const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const VueLoaderPlugin = require('vue-loader/lib/plugin');
const { VueLoaderPlugin } = require('vue-loader');
const autoprefixer = require('autoprefixer');

//node环境下commonjs规范：
module.exports = {
  mode: 'development',
  entry: './src/main.js',
  output: {
    path: resolve(__dirname, 'dist'),
    filename: 'main.js'
  },
  //配置外部文件
  externals: {'vue': 'Vue'},
  devtool: 'source-map',
  module: {
    rules: [{
      test: /\.vue$/,
      loader: 'vue-loader'
    }, {
      test: /\.scss$/,
      use: [
        'vue-style-loader',
        'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            postcssOptions: {
              plugins: [
                autoprefixer({
                  overrideBrowserslist: [
                    "> 1%",
                    "last 2 versions"
                  ]
                })
              ]
            }
          }
        },
        'sass-loader'
      ]
    }]
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: resolve(__dirname, 'public/index.html')
    })
  ]
}
```

`package.json`的配置代码：

```
{
  "name": "vue-webpack-demo",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev": "webpack-dev-server",
    "build":"webpack"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@vue/compiler-sfc": "^3.1.5",
    "html-webpack-plugin": "^4.5.0",
    "vue-loader": "^16.4.1",
    "vue-template-compiler": "^2.6.14",
    "webpack": "^4.44.2",
    "webpack-cli": "^3.3.12",
    "webpack-dev-server": "^3.11.2"
  }
}
```

## 应用实例

应用实例是通过`createApp`创建 `APP `返回一个应用实例。

```js
//Application 应用 返回一个vue实例对象
const app = Vue.createApp({});
console.log(app);
```

应用实例里面的 `component `属性主要是用来注册全局组件。

```js
app.component('MyTitle', {
  data(){
    return { title: 'I Love You!' }
  },
  template: `<h1>{{title}}</h1>`
});

app.mount('#app');
```

在 `<template></template>`标签里使用组件

```html
<div>
  <!-- 写法一 -->
  <MyTitle />
  <!-- 写法二 -->
  <my-title />
</div>
```

在实例上暴露了很多方法，如 ：

- `component `注册组件
- `directive `注册全局自定义指令
- `filter `注册过滤器
- `mixin `全局注册混入器
- `provide `注入全局跨组件层级的属性
- `use `使用插件

实例里的大多数方法都会返回 `createApp `创建出来的应用实例，目的是允许链式调用操作。

## 模板语法

`template`里面的一些 `HTML `字符串内部除开 `HTML `本身特性以外 如`Vue `的特性，如文本，表达式，属性，指令等。

`Vue `模板都是基于 `HTML `的，模板中直接写 `HTML `都是能够被 `HTML `解析器解析的。`Vue `提供一套模板编译系统，基本是开发者写的`template`，然后分析它将 `HTML `字符串变成`AST`树，把表达式/自定义属性/指令等转化为新的原生的 `HTML`，把 `JS `写法的 `HTML `模板遍历出来后形成虚拟 `DOM `树节点，最后根据虚拟 `DOM `树变成真实 `DOM `树渲染到页面上。

**_如何虚拟 `DOM `对比真实 `DOM `数据？_**

将真实 `DOM `数据转为对象结构存储，再进行对比，有差别的情况下形成新的补丁再一定的算法基础下替换。



## 插值

**插值**是数据绑定最常见的形式就是使用`Mustache`语法 (双大括号) 的文本插值。

```js
//title为字符串
<h1 id="title"></h1>

//title为变量
<h1 v-bind:id="title"></h1>

var url = "https://www.baidu.com";
//html -> 插入JS的表达式 -> v-bind:href="url";
```

标签内部插入表达式

```
{{}}
```

属性上插入表达式

```
v-bind:xx=""
```

**关于`mustache.js`：** 用更少的逻辑来渲染模版，它是一个零依赖的模板系统，`mustache `中是不支持在 `HTML `属性中插值的，`Vue `中因为用底层的模板编译系统，支持内置的属性。

```
npm i -S mustache
```

```js
import Mustache from 'mustache';

var data = { title: 'This is my TITLE for MUSTACHE' }
var html = Mustache.render(
  `<h1>{{title}}</h1>`,
  data
);

document.getElementById('app').innerHTML = html;
```



## 表达式

**关于属性：**

- `attribute`属性：给HTML做拓展用的，如 `title/src/href`。
- `property`属性：在对象内部存储数据，通常用来描述数据结构 `prop`。

**表达式**作用是数学运算/字符串拼接/判断/`JS API`/不能绑定多个表达式/绑定语句。

```html
//数学运算
<h1 :title="a + b">{{a+b}}</h1>
//字符串拼接
<h2>{{'a + b =' + (a + b)}}</h2>
//判断表达式
<h3>{{a + b > 5 ? '大于5' : '小于等于5'}}</h3>
<h3>{{title || subTitle}}</h3>
//使用JS API
<h4>{{title.replace('main', '')}}</h4>
<h4>{{subTitle.split('').reverse().join('-')}}</h4>
//绑定语句 报错
{{ var a = 1; }}
```









## 指令

指令 `(Directives)` 是带有 `v-` 前缀的特殊 `attribute`，它一般结合视图模板使用，响应式的作用于`dom`，指令是一种控制视图的集成方式。指令是模板应该按照怎样的逻辑进行渲染或绑定行为。会直接操作`DOM`。

**内置指令有：**`v-if`/`v-else`/`v-else-if`/`v-for`/`v-show`/`v-html`/`v-once`等。

`v-on`事件绑定方法，类似于`onclick/addEventListener`绑定事件处理函数。

```html
//简写@click="likeThisArticle"
<span>Like: {{like}}</span>
<button v-on:click="likeThisArticle"></button>
```

`v-if`为真就显示/为假不显示。

```html
<button v-if="isLogin" v-on:click="likeThisArticle"></button>
<button v-else disabled>Please login first!</button>
```

`v-model`视图双向绑定，`vue `完成了数据双向绑定的机制，好处是业务关注点全部可以放到业务逻辑层，而视图层交给了`v-model`帮助渲染和更新。

```html
<div class="form">
  //oninput事件会将其value交给myComment数据变量
  //v-model这个特点会更改视图
  <input type="text" placeholder="请填写评论" v-model="myComment" />
</div>
```

`v-for`遍历，列表渲染。如果`v-for`与`v-if`用于同一个元素节点，`v-if`的优先级高于`v-for`（`vue3`），有可能会冲突，`v-if`无法获取`v-for`遍历的列表，报错提示为在渲染期间，列表属性被访问了，但是没有被定义在实例上。

```html
//v-for必须搭配key表示唯一性 key 属性必须是唯一的值
<li v-for="item of commentList" :key="item.id"></li>

//遍历数组
<ul>
  <li v-for="(item, index) of list" :key="item.id">
    <span>{{item.id}}</span>
    <span>{{item.name}}</span>
  </li>
<ul>

//遍历计算属性
computed: {
  computedList(){
    return this.list.map(item => {
      item.pass = item.score >= 60;
      return item;
    })
  }
}

<ul>
  <li v-for="item of computedList" :key="item.id">
    <span>Order {{index}}</span>
  </li>
<ul>

//遍历method里的方法属性
var myArr = [[1,2,3],[4,5,6],[7,8,9,0]];

method: {
  even(numbers){
    return numbers.filter(number => number % 2 === 0);
  }
}

<ul v-for="numbers of myArr">
  <li v-for="number of even(numbers)">
    {{number}}
  </li>
<ul>

//值范围
<span v-for="star in 5" :key="star">※</span>

//组件与v-for
//item是不会自动传入组件的 :item="item"
//1.避免v-for与组件功能与数据耦合
//2.保证组件有合理的配置性
//3.达到最后的复用效果
<ul>
  <list-item
    v-for="item of list"
    :key="item.id"
    :item="item"
  >
  </list-item>
</ul>
```

`v-once`：一次插值，永不更新，不建议。

`v-html`：安全原因，插值不会解析 `HTML`，因为插值是 `JS `表达式，没有对 `DOM `的操作，`rawHTML `原始 `HTML`，不要试图用`v-html`做子模版，`vue `本身有一个底层的模板编译系统，而不是直接使用字符串来渲染的。子模版放到子组件中，让模板的重用和组合更强大。

```js
//不要把用户提供的内容作为`v-html`的插值，这种插值容易导致 XSS 攻击
const App = {
  data(){
    return { title: 'This is my Title' }
  },
  template: `<div>{{title}}</div>`
  //<div v-html="title"></div>
}
Vue.createApp(App).mount('#app');
```

`v-if`/`v-else-if`/`v-else`：分支判断是否渲染视图。

`v-show`：隐藏节点，是否显示。

**关于条件渲染`v-if`/`v-show`的区别：**

- `v-if`是对 `DOM `的移除和添加，在移除的时候用注释节点占位，对内部的子组件与事件监听都会销毁与重建。
- `v-if`只有条件是 `truthy `的时候，才会被渲染(惰性渲染)。
- `v-show`总会会被渲染，用 `display `来控制其显示与隐藏。
- `v-if`在切换的时候会提高开销，如果条件为假值，初始化渲染是不会进行的。
- `v-show`在切换的时候开销较低，但是初始化渲染时无论显示与否都要被渲染。

**`v-if`/`v-show`的使用选择：**

- 如果切换频繁就用`v-show`
- 如果切换不频繁，(加载时不需要的视图)，可以用`v-if`



## 自定义指令

**自定义指令**，开发者也可以给 `Vue `拓展指令，`v-自定义名称`，它可以提供一个直接操作`dom`的接口，在`vue`中属于底层行为，它不希望操作`DOM`。

全局注册自定义指令可以给所有的组件使用。

```JS
Vue.createApp(App).directive('myShow', myShow).mount('#app');
```

局部注册自定义指令的写法。

```JS
export default {
  name: 'App',
  //myShow是的单JS文件中自定义指令对象
  directives: { myShow }
}
```

单`JS`文件定义自定义指令相关的生命周期的函数。

- 它包含参数`el`是被绑定指令的元素，是一个`DOM`对象，非常常用。
- `bindings`参数是一个对象。
  - 该对象里的`arg`属性是视图模板中定义的指令的参数，如`v-my-show:abc`中`arg`对应的值是`abc`。
  - 该对象里的`dir`属性的值是一个对象，对象里的属性对应的是在自定义指令`JS`文件定义过的所有属性，如生命周期的函数，如`beforeMount`，`mounted`，`created`，`updated`等等。
  - 该对象里的`instance`属性的值是当前使用指令的组件实例。在做自定义指令的时候可以获取组件里的数据去完成特殊的功能。
  - 该对象里的`modifiers`属性的值是视图模板上定义自定义指令的后缀时保存的该后缀名称，即指令的修饰符对象集合，如`v-my-show:abc.test`中的`test`属性。
  - 该对象里的`oldValue`属性的值是更新前指令绑定的值。
  - 该对象里的`value`属性的值是当前指令绑定的新值。
- `vnode`参数是当前组件的虚拟节点。
- `prevNode`参数是上一个更新之前的组件虚拟节点。

在绑定元素`attr`或监听事件绑定事件处理之前创建指令。

```js
export default function created(el, bindings, vnode, prevNode){
  console.log(el, bindings, vnode, prevNode);
}
```

当指令第一次绑定到元素并且在挂载父组件之前调用的函数。

```js
export default function beforeMount(el, bindings, vnode, prevNode){
  console.log(el, bindings, vnode, prevNode);
}
```

在绑定元素的父组件被挂载之前调用的函数。

```JS
export default function mounted(el, bindings, vnode, prevNode){
  console.log(el, bindings, vnode, prevNode);
}
```

在更新包含组件的`vnode`之前调用的函数。组件更新时会被触发。

```JS
export default function beforeUpdate(el, bindings, vnode, prevNode){
  console.log(el, bindings, vnode, prevNode);
}
```

在包含组件`vnode`以及子组件`vnode`更新后调用的函数。

```JS
export default function updated(el, bindings, vnode, prevNode){
  console.log(el, bindings, vnode, prevNode);
}
```

在卸载绑定元素的父组件之前调用的函数。

```JS
export default function beforeUnmount(el, bindings, vnode, prevNode){
  console.log(el, bindings, vnode, prevNode);
}
```

当指令与元素解除绑定且父组件卸载了，只调用一次的函数。

```JS
export default function unmounted(el, bindings, vnode, prevNode){
  console.log(el, bindings, vnode, prevNode);
}
```









## 特殊`attribute`

`ref`引用，`reference`被用来给元素或子组件注册引用信息。引用信息将会注册在父组件的 `$refs` 对象上。如果在普通的 `DOM `元素上使用，引用指向的就是 `DOM `元素；如果用在子组件上，引用就指向组件实例。

`vue `里是不需要操作 `dom `的，也不需要去获取 `dom`，有些场景需要去对 `dom `节点进行获取，也可能对 `dom `节点相关的信息，万不得已的情况下对节点进行操作。

```html
//拿到组件的实例
//也可以访问实例底下的属性和方法
<my-list ref="myRef"></my-list>
```

组件的实例的实际应用是兄弟组件相互调用方法或者获取属性。

> **注意：**
>
> - `$refs`本身并不是响应式的，所以不要在模板中使用。
> - 不要在计算属性中访问，因为不具备响应式。
> - 不要尝试更改 `ref`, 它提供给获取节点或实例引用，并不是改变的。

**_为什么要获取组件实例？_**

可以通过调用组件相关的方法获取相应的属性，兄弟组件的情况下，需要获取自己兄弟上面的方法或者是属性的时候，可以用 `ref `把组件的实例拿出来，然后在实例上去使用属性和方法。

**_为什么尽量不使用 `ref`?_**

因为 `vue `是数据绑定机制，经常使用 `ref `可能导致 `vue `的解决方案的匮乏, `dom `的增删改查是 `ViewModel `实现的而不是开发者去操作的。

```html
//通过$refs(vue内部方法的引用集合)可以访问dom里面的属性
<input ref="myRef"></input>
console.log(this.$refs.myRef);
```

> 注：`$refs` 早在生命周期 `beforeCreate `时候已经存在了，只有组件装载完毕后(`mounted`)才存在 `myRef`。

**_为什么只有组件装载完毕后才存在 `myRef`?_**

如果没有挂载，节点就不会存在，那么就无法拿到指定节点的引用，说明在有些开发场景遇到 `ref `为 `null/undefined` 时要考虑组件是否加载完毕后才去获取 `dom `引用。

---

<u>**案例：移动端滚动页面加载更多**</u>

实现上下滚动页面渲染加载更多或者暂无数据。

**原理：**

通过 `ref `标签属性拿到绑定在`dom`节点里面的`clientHeight/scrollHeight/scrollTop`数据进行计算是否触底，从而每次触底时新增 5 条数据渲染到页面。

**源码地址：**

https://gitee.com/kevinleeeee/ref-dom-demo







## 生命周期

组件是有初始化过程的，在初始化过程中，`Vue `提供了很多每个阶段运行的函数，函数会在对应的初始化阶段自动运行。

**实例的生命周期过程：**

- 创建实例并挂载：`app = Vue.createApp(options); app.mount(el)`。
- 执行完后初始化事件和生命周期，实例对象身上有默认的一些生命周期函数和默认事件。
- `beforeCreate`阶段，初始化响应式，数据注入，整理好跟视图相关的响应式开发相关特性(初始化 `data/method`)。
- `created`阶段
- 判断是否有模板：编译模板，把 `data `对象里面的数据和 `Vue `语法写的模板编译成 `HTML`
  - 有：编译模板至渲染函数
  - 没：编译 `el `的 `innerHTML `至模板
- 挂载之前执行`beforeMount`阶段
- 创建`app.$el`(真实的根节点)并添加至 `el`
- `mounted`阶段
- 已挂载状态监听数据是否存在变化
  - 有变化，虚拟节点对应补丁重新渲染更新
- `beforeUpdate`阶段
- 更新完之后到`updated`阶段
- 调用`app.unmount()`方法后会销毁组件
- 销毁组件经历两个阶段：
  - `beforeUnmount`阶段
  - `unmounted`阶段

![image-20210803222528752](http://note-img-bed.dt-code.fun/image-20210803222528752.png)

## `data`属性

逻辑区域的对象里的 `data`，它的核心有：

- `data `必须是一个函数。
- `vue `在创建实例的过程中调用 `data `函数，返回数据对象。
- 通过响应式包装后存储在实例的`$data`(代理)。
- 并且实例可以直接越过`$data`可访问属性(代理)。

**_为什么要用`data`?_**

每次组件实例时先执行`data()`返回一个函数来保证数据的引用是唯一的。`$`, `_`, `__ `都是`vue`提供的内置`API`，开发者尽量避免用这些前缀命名自己的属性和方法。

```JS
//data()方法执行返回一个对象
const app = Vue.createApp({
  data(){
    return { title: 'This is my Title' }
  },
  template: ` <h1>{{title}}</h1> `
});
cosnt vm = app.mount('#app');
console.log(vm);

/**
 * console.log(vm):
 * Proxy{...}
 *   title: 'This is my Title'
 *   $: ...
 *   $el: ...
 *   $emit: ...
 *   $data: Proxy
 *     title: 'This is my Title'
 */

 console.log(vm.$data.title);
 //This is my Title

 //越过$data访问title
 console.log(vm.title);
 //This is my Title

 vm.$data.title = 'This is your Title';
 console.log(vm.title);
 //This is your Title

 vm.title = 'This is my Title';
 console.log(vm.$data.title);
 //This is my Title
 //说明vm.title 和 vm.$data.title都是同一个数据

 //$data是响应式数据对象
 vm.autor = 'kevin';
 console.log(vm.author); //kevin
 console.log(vm.$data.author); //找不到

 //这个写法会被vue警告，且需要在data里定义author变量
 vm.$data.author = 'kevin';
 console.log(vm.author); //kevin
 console.log(vm.$data.author); //kevin
```

**_`data` 为什么必须是一个函数？_**

如果 `data `是一个对象的话，那么很难防止同一引用重复使用的问题，而每次实例 `Vue `执行函数都会返回一个新的对象可以解决同一对象引用的问题。

```js
//此写法会报错，vue时刻监听data是否为一个函数
//Uncaught TypeError: dataOptions.call is not a function
const App = {
  data: { a: 1 },
  template: `<h1>{{a}}</h1>`
}
Vue.createApp(App).mount('#app');
```

## `methods`属性

逻辑区域的对象里的逻辑方法都写在 `method `的对象里，向组件实例添加方法。`Vue `创建实例时，会自动为 `methods `绑定当前实例 `this`，保证在事件监听时，回调始终指向当前组件实例，方法要避免使用箭头函数，箭头函数不能更改 `this `指向，箭头函数会阻止 `Vue `正确绑定组件实例 `this`。

```js
methods: {
  likeThisArticle(){ this.like ++; }
}
```

可以在视图模板里方法函数的执行，响应式的执行。

```html
//注意：函数名 + () 不是执行符号，是传入实参的容器
@click="changeTitle('xxx')"
//拆分写法
onclick = "() => { changeTitle('xxx')}"

//注意：模板直接调用的方法尽量避免副作用操作 如更改数据，异步操作
//
<h1>{{ yourTitle() }}</h1>
```

> 注：`methods `里的定义的方法是存放在 `vm `实例对象里，而不是 `methods `里，因为可以让实例直接调用改方法。

## `computed`属性

**计算属性的核心：**

- 主要关注点在视图模板上，主要是抽离复用**模板**中复杂的逻辑计算。
- 解决模板中复杂的逻辑运算及复用的问题。
- 计算属性只在内部逻辑依赖的数据发生变化的时候才会被再次调用。
- 计算属性会缓存(缓存在实例里)其依赖的上一次计算出的数据结果。
- 多次复用一个相同值数据，计算属性只调用一次(只要 `data `数据没有发生更改就不会调用)。

```JS
//这个情景反映一个问题：模板里含有逻辑判断
//模板逻辑样式尽可能的绝对分离
//逻辑运算结果需要被复用
const App = {
  data(){ return { studentCount: 1 } },
  template: `
    //不建议写法：
    <h1>{{studentCount > 0 ? ('学生数:' + studentCount) : '暂无学生'}}
    //建议的写法
    <h1>{{ studentCountInfo }}
  `,
  computed: {
    studentCountInfo(){
      return this.studentCount > 0
        ? ('学生数:' + this.studentCount)
        : '暂无学生';
    }
  }
}
```

`computed`对象里是一个`getter/setter`结构。

```JS
computed: {
  calData: {
    get(){...},
    set(){...}
  }
}
```

## `watch`属性

侦听器的关注点在数据更新，给数据增加侦听器，当数据更新时，侦听器函数执行。数据更新时，需要完成什么样的逻辑，如 `Ajax `数据提交。如答题系统，[参考演示案例](https://gitee.com/kevinleeeee/exam-vue-watch-demo)。

侦听`computed`里的数据，可以获取到新老值，`result`方法更新会触发侦听器。

```JS
const app = Vue.createApp({
  data(){
    return { a: 'This is my Title' }
  },
  watch: {
    //侦听data里的数据:
    a(newValue, oldValue){}
  }
});
```

但`watch`属性普通情况下仅监听浅层的数据，对于嵌套的对象属性是不会进行监听的。解决方案是对该属性进行`deep`配置实现深度监听。`immediate`属性可以立即执行属性。

```JS
const app = Vue.createApp({
  data(){
    return { 
      a: 'This is my Title',
      b: { c: 1 }
    }
  },
  watch: {
    b(newValue, oldValue){},
    c(newValue, oldValue){} //这里无法进行watch监听
    c: { deep: true, handler: function(newValue, oldValue){} }
  }
});
```



## `Class `与 `Style `绑定

操作元素的 `class `列表和内联样式是数据绑定的一个常见需求。因为它们都是 `attribute`，所以我们可以用 `v-bind` 处理它们，只需要通过表达式计算出字符串结果即可。不过，字符串拼接麻烦且易错。因此，在将 `v-bind` 用于 `class` 和 `style` 时,表达式结果的类型除了字符串之外，还可以是对象或数组。

`vue `对`v-bind:class/style`了特殊的封装，形式是比较多的，对象和数组的绑定方式。

```js
const MyAlert = {
  data() {
    return {
      title: 'This is my first Alert',
      isShow: true,
      hasError: true,
      alertClassObject: {
        show: true,
        'bg-danger': true
      }
    }
  },
  computed: {
    alertClassObjectComputed() {
      return {
        show: this.isShow,
        danger: this.isShow && this.hasError
      }
    }
  },
  template: `
    <!--<div
      class="my-alert"
      :class="{
        //加某个样式类名的真假条件
        show: isShow,
        danger: hasError
      }"
    >-->

    <div
    class="my-alert"
    :class="alertClassObjectComputed"
  >
      <header class="header">
        <h1>{{title}}</h1>
      </header>
    </div>
  `
}
```

`vue`会在运行时自动检测添加相应的前缀。

```html
:style="{display: ['-webkit-box', '-ms-flexbox', 'flex']}"
```

## 命名

6种命名方法。

```
1.camelCae 小驼峰命名 thisIsMyVariable
2.kebab-case 短横线命名法 this-is-my-variable
3.脊柱命名法 spinal-case train-case
4.蛇形命名法 snake_case this_is_my_variable
5.匈牙利命名法 变量 属性+类型 描述 以空字符为结尾的字符串的长整形指针
6.大驼峰命名法 ThisIsMyVariable
```

## 事件处理

事件处理函数的绑定，实际上是原生 `JavaScript `里绑定事件处理函数，用户行为触发，事件和处理函数进行绑定行为，事件的触发会执行其绑定的处理函数。

```html
//vue 绑定写法
v-on="eventType"
v-on:click=""
@click=""

//1.绑定JavaScript表达式(逻辑简单也不推荐)
<button @click="count += 1" ></button>

//2.绑定处理函数(逻辑较为复杂)
<button @click="addCount"></button>

//3.内联绑定处理函数(调用：这里不会执行methods里对应的方法，目的是为了传参)
<button @click="addCount(1)"></button>

//4.多事件处理函数绑定
<button @click="addCount(1), setLog('add', 2)"></button>
```

**_`vue `是如何实现事件绑定？_**

首先，在 `JavaScript `里，`@click="addCount(1)"`默认就会自己执行，但在 `vue `里不会自动执行，而是先通过模板编译，当填写`@click="addCount(1)"`时，会返回一个函数传入一个`$event`参数。

```js
function($event){ addCount($event, 2); }
```





## 修饰符

事件修饰符`@click.once`，目的在与把事件处理函数中非纯逻辑的程序分离出去，如定义的事件处理方法里把`e.preventDefault()`等非逻辑的方法分离出去，保证定义的方法是仅仅是逻辑的方法。希望视图和逻辑完全的分离。

- `.once`只调用一次事件处理，调用一次以后自动移除监听器。
- `.prevent`阻止默认事件。
- `.capture`采用捕获。
- `.stop`阻止事件冒泡。
- `.passive`拥有不调用`Event.preventDefault()`，即与`.prevent`不能一起用。
- `v-model.lazy`在`input+value`输入完成失去焦点时，表单数据才改变。
- `v-model.number`如果无法被 `parseFloat `解析，就返回原始值/在有 `number `时，就返回数值。
- `v-model.trim`过滤掉首尾的空白字符。
- `.sync`可以实现父子组件通信，调用子组件派发修改父组件数据的方法，如`this.$emit('update:title')`。避免在子组件中直接修改父组件的数据。在父组件模板使用该修饰符`<div :title.sync="title"></div>`，监听数据变化并可以简化数据绑定的同时还有事件绑定`:title="title" @update:title="title = $event"`的写法。该修饰符的另外用法是对象里的属性进行绑定的简写操作，即对多个属性进行双向绑定，如`<div v-bind.sync="person"></div>`，此时就可以监听该对象里的属性，还有对组件通信方法进行绑定。



## 列表渲染

`v-for`写法，`v-for="指令表达式"`，表达式如`(item, index) in/of list`，`index`索引是可选的，`for...in`和`for...of`都可以使用，推荐`for..in`枚举对象，`for...of`去遍历可迭代对象。

`for...in`写法。遍历对象的顺序，会按照`Object.keys()`的结果进行遍历。

```html
<li v-for="(value, key, index) in list"></li>
```

`for...of`写法。建议搭配`:key`使用，`key`属性是唯一的值。方便`vue`就地更新策略的实施。

```html
<li v-for="(item, index) of list"></li>
```

计算属性与`v-for`搭配使用写法。

```html
<ul>
  <li v-for="item of computedList"></li>
</ul>

<script>
  var App = {
    data(){ return { list: [...] } },
    computed: {
      computedList(){
        return this.list.map(item => {
          item.pass = item.score > 60;
          return item;
        })
      }
    }
  }
</script>
```

`methods`中定义的方法与`v-for`的搭配使用写法。

```html
<ul v-for="numbers of myArray">
  <li v-for="number of even(numbers)">{{number}}</li>
</ul>

<script>
  var App = {
    data(){ 
      return {
        myArray: [[1, 2, 3], [4, 5, 6], [7, 8]]
      }
    },
    methods:{
      even(numbers){
        return numbers.filter(number => number % 2 === 0);
      }
    }
  }
</script>
```

值范围与`v-for`使用写法。

```HTML
<div>
  <span v-for="s in 5">星星</span>
</div>
```

`template`与`v-for`结合使用写法。

```HTML
<ul>
  <template v-for="item of list" :key="item.id">
    <li>{{item.name}}</li>
  </template>
</ul>
```

组件与`v-for`结合使用写法。`item`是不会自动传入组件的，原因是避免`v-for`与组件功能与数据耦合，保证组件有合理的配置项，达到最好的复用效果，所以需要手动向子组件传入数据。

```HTML
<list
  v-for="item of list"
  :key="item.id"
  :item="item"
></list>
```







## 双向绑定

在`Vue`中常见的表单控件使用。假如对`<input>`输入框进行绑定数据变量写法。

```html
//v-bind:title="被绑定变量,这里绑定内容是插值表达式里的内容"
<p v-bind:title="content">{{content}}</p>

//动态的属性名参数不能出现空格和引号，HTML的合法属性名不能出现空格引号
<h1 v-bind:['data-' + attr]="tag">{{title}}</h1>
//null作为属性是无效的，可以利用null解除属性绑定
<h1 v-bind:[null]="title">{{title}}</h1>

//简写
<p :title="变量">{{content}}</p>
<p title="字符串">{{content}}</p>
```

双向绑定指的是改变数据可以改变视图上显示的内容，改变视图上显示的内容也会更改数据。表单输入的数据双向绑定，使用`v-model="数据来源"`实现的，是一个语法糖，使用了`v-model`后忽略`value`，`checked`, `selected`等属性设置，适用的表单元素控件有以下。

```html
<input type="text" />
<input type="textarea" />
<input type="select" />
<input type="checkbox" />
<input type="radio" />
```

`v-model`在`<input type="text">`对应的语法糖是`value`和`@input`。

```html
<input type="text" v-model="inputText" />
<input type="text" @input="setInputText" :value="inputText" />
```

`v-model`在`<input type="select">`对应的语法糖是`value`和`@change`。

```html
//未能匹配到value时为空项, IOS中未匹配时是无法触发change事件，那么用户无法选择第一项，需要在第一项中新增默认项并将其disabled
<select v-model="selectedValue">
  <option value="" disabled>请选择</option>
  <option value="china">China</option>
  <option value="russia">Russia</option>
  <option value="japan">Japan</option>
</select>
<select @change="setSelectedValue" :value="selectedValue">
  <option value="">请选择</option>
  <option value="china">China</option>
  <option value="russia">Russia</option>
  <option value="japan">Japan</option>
</select>
```

`v-model`在`<input type="checkbox">`对应的语法糖是`checked`和`@change`。

```html
<input type="checkbox" v-model="cbChecked" />
<input type="checkbox" :checked="cbChecked" @change="setCheckbox" />
```

`v-model`在`<input type="radio">`对应的语法糖是`checked`和`@change`。

```html
man: <input type="radio" value="male" v-model="gender" />
woman: <input type="radio" value="female" v-model="gender" />
<input type="radio" :checked="cbRadio" @change="setRadio" />
```

`v-for`动态渲染列表时。

```html
<select v-model="selectedValue">
  <option value="" disabled>请选择</option>
  <option 
    v-for="countries" 
    :key="countries.id"
    :value="countries.value"
  >{{countries.name}}
  </option>
</select>
```



## 表单

给表单做输入绑定，如给单行文本写法。

```html
<input type="text" v-model="username" />
<p>Username: {{ username }}</p>
```

如多行文本写法。

```HTML
<textarea v-model="desc"></textarea>
<p>Description: {{ desc }}</p>
```

如复选框需要填写`value`属性来添加至数组里。

```html
<p>Favor Sport is:{{ sport }}</p>
<span>
  <input
    type="checkbox"
    v-model="sport"
    value="Basketball"
  />Basketball
</span>
<span>
  <input 
    type="checkbox" 
    v-model="sport" 
    value="Football" 
  />Football
</span>
<span>
  <input 
    type="checkbox" 
    v-model="sport"
    value="Swimming" 
  />Swimming
</span>
```

如单选按钮写法。

```html
<p>Gender is: {{ gender }}</p>
<input type="radio" v-model="gender" value="male" />male
<input type="radio" v-model="gender" value="female" />female
```

如下拉选择框写法。

```html
<p>Area Selected: {{ area }}</p>
<select v-model="area">
    <option value="" disabled>Please select</option>
    <option value="Beijing">Beijing</option>
    <option value="Shanghai">Shanghai</option>
    <option value="Guangzhou">Guangzhou</option>
</select>
```



## 模板引用

`ref`是引用`DOM`节点，还可以引用组件实例，因为数据绑定机制，一般情况下是不需要去获取和操作`DOM`，所有视图的更新是由`VMModel`去驱动。

尽量少用`ref`，不要尝试去更改`ref`，它提供获取`DOM`节点或组件实例使用，应用场景是获取设备屏幕信息等只读数据，如兄弟组件中的方法调用，如表单中的输入信息获取等。

在`beforeCreate`生命周期阶段已经存在`this.$refs`，它此时和`created`还有`beforeMount`阶段一样是一个空对象。在`mounted`阶段时是一个模板定义好的`Proxy`代理对象。

```html
<p>username:<input type="text" ref="myRef" /></p>

<script>
  export default{
    name: 'App',
    beforeCreate(){ console.log(this.$refs); }, //{}
    created(){ console.log(this.$refs); }, //{}
    beforeMount(){ console.log(this.$refs); }, //{}
    mounted(){ console.log(this.$refs); }
    //Proxy{myRef: input}
  }
</script>
```

说明在组件挂载之前，是不存在组件实例和节点引用的，只有有在组件挂载之后才可以去引用节点和组件实例。

尝试在组件挂载后定义一个新的节点，并将节点赋值保存给`$refs`对象中，结果会报错，显示`$refs`里的属性只能是只读的。

```js
export default{
  name: 'App',
  mounted(){
    const oLink = document.createElement('a');
    oLink.innerText = 'Google';
    oLink.href = 'https://www.google.com';
    this.$refs.myRef = oLink;
  }
}
```

给组件标签定义`ref`会拿到该组件实例，包括拿到组件内的`data`数据和`methods`里的方法。

```html
<my-button ref="myTest"></my-button>
<script>
  export default{
    name: 'App',
    data(){ return{ count: 1 } },
    methods: { addCount(){...} },
    mounted(){ console.log(this.$refs); }
    //Proxy{ myTest: Proxy{ count: 1, addCount: f(){} } }
  }
</script>
```

`$refs`并不是响应式数据，所以不应该在模板中使用，也不要在计算属性中访问。

**`vue3`中的模板引用**，在使用组合式 `API `时，[响应式引用](https://v3.cn.vuejs.org/guide/reactivity-fundamentals.html#创建独立的响应式值作为-refs)和[模板引用](https://v3.cn.vuejs.org/guide/component-template-refs.html)的概念是统一的。为了获得对模板内元素或组件实例的引用，我们可以像往常一样声明 `ref `并从`setup`返回：

```html
//1.在dom上使用可以拿到dom元素
//2.在组件上使用可以拿到组件实例，可以访问实例里的属性和方法
<div>
  <div ref="child">张三</div>
  <button @click="changeName">改变名字</button>
</div>
```

```js
setup(props, ctx) {
  //引用模板的固定写法:
  const child = ref(null);
  const changeName = () => {
    // console.log(child.value);
    //<div>张三</div>
    //修改页面上的文本为
    child.value.innerText = "李四";
  };

  return { child, changeName, };
}
```

这里我们在渲染上下文中暴露 `root`，并通过 `ref="child"`，将其绑定到 `div `作为其 `ref`。

在虚拟 `DOM`补丁算法中，如果 `VNode `的 `ref` 键对应于渲染上下文中的 `ref`，则 `VNode `的相应元素或组件实例将被分配给该 `ref `的值。这是在虚拟 `DOM `挂载/打补丁过程中执行的，因此模板引用只会在初始渲染之后获得赋值。作为模板使用的 `ref `的行为与任何其他 `ref `一样：它们是响应式的，可以传递到 (或从中返回) 复合函数中。

`v-for`中的用法：组合式 `API `模板引用在 `v-for` 内部使用时没有特殊处理。相反，请使用函数引用执行自定义处理：

```html
<template>
  //将divs每一项赋值给el
  <li v-for="(item, i) in list" :ref="el => { if (el) divs[i] = el }">
    {{ item }}
  </li>
</template>

<script>
  import { ref, reactive, onBeforeUpdate } from 'vue'

  export default {
    setup() {
      const list = reactive([1, 2, 3])
      const divs = ref([])
      // 确保在每次更新之前重置ref
      onBeforeUpdate(() => {
        console.log(divs.value);
        //Proxy{0: li, 1: li, 2: li}
        console.log(divs.value[0]);
        //<li>...<li>
      })
      return { list, divs }
    }
  }
</script>
```



