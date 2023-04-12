# 源码实现

## 数据劫持

vue3.x中使用了ES6新的语法`proxy`和`reflect`相结合进行数据劫持拦截，性能上有很大的提升，而且支持劫持数组

```js
//vue3.x写法
export default {
  setup(){
    const state = reactive({...});
  }
}
```

```
//项目目录:
├─package.json
├─Readme.md
├─webpack.config.js
├─vue3
|  ├─shared
|  |   └utils.js - 工具函数isObject/hasOwnPropery/isEqual
|  ├─reactivity
|  |     ├─index.js - 响应式出口文件
|  |     ├─mutableHandler.js - 管理handler底下的底层Object对象方法做响应式处理/新增业务逻辑编写
|  |     └reactive.js - 实例化一个Proxy对象返回一个被代理后的响应式对象
├─src
|  ├─index.html
|  └index.js
├─public
|   └index.html
```

源码地址：https://gitee.com/kevinleeeee/data-hijacked-vue3.x-demo



## 视图绑定

**案例：实现视图数据绑定**

技术：vite/数据响应式

功能缺少：

- `AST`树
- 虚拟`dom`
- 渲染函数
- 依赖收集



功能：

1. 编译视图模板里的事件绑定属性
2. 关联`methods`定义的方法和视图事件处理函数的绑定
3. 编译视图模板绑定的变量以及标签属性
4. 给`state`数据发生更改时更新页面视图

```
//项目目录:
├─src
|  └app.js
├─reactivity
|     ├─index.js 出口文件/对象响应式/视图绑定/事件/状态
|     ├─render.js 视图绑定/绑定属性/绑定事件函数/更新视图函数
|     ├─shared
|     |   └utils.js 工具函数
|     ├─reactive
|     |    ├─index.js 对象响应式/创建响应式对象
|     |    └mutableHandler.js 管理handler底下的底层Object对象方法
|     ├─compiler
|     |    ├─event.js 绑定视图的处理函数
|     |    └state.js 绑定视图的状态变量函数
```



***问题：如何实现编译带事件处理函数绑定视图的标签？***

1. 编译视图模板时匹配`onClick="xxx"`格式
2. 随机生成一个字符串保存在定义`flag`标识属性
3. 组装一个新的对象包含`flag`,`handler`,`type`属性
4. 匹配`xxx`内容后，将其内容保存到`handler`属性里
5. 将组装好的对象存入事件池数组`eventPool`里
6. 匹配`onClick="xxx"`格式最后替换为``data-dom=${_flag}`的字符串实现在视图里
7. 实现编译标签时`<div onClick="add(2)"></div>`用一个标识替换原有的绑定句柄`onClick="add(2)"`，如`data-dom="1640242607185"`



***问题：如何关联视图上绑定的事件处理函数属性和用户`methods`上定义的方法?***

1. 假如视图上绑定`onClick="add(2)"`
2. 假如用户在`methods`定义的方法为`add(){...}`
3. 拿到页面所有的节点
4. 遍历事件池里面的对象和所有节点找到符合标识属性`flag`条件的那一项
5. 给该项添加绑定事件处理函数`addEventListener`
6. 找到`methods`里定义的方法名和参数
7. 执行定义在`methods`里的对应的方法
8. 实现视图和方法的关联



***问题：如何关联视图上绑定的变量属性？***

1. 替换视图模板为用户定义标签名的标签`<myDiv></myDiv>`
2. 给标签新增自定义属性`data-dom="1640273806381"`
3. 替换视图模板里`{{}}`为用户定义的`state`数据
4. 缓存状态池

```js
//缓存状态池包含标识flag和变量名数组varArr属性
/**
 * console.log(statePool);
 * [
 *   {
 *     flag: 1640277702567,
 *     state: ['count']
 *   }
 * ]
 */
```



***问题：视图更新时，如何找到绑定变量数据更改时所在的节点？***

1. 在`setter`函数里新增`update`方法实现`state`数据发生更改时更新视图
2. 在`render`文件里定义`update`方法
3. 遍历所有的元素节点和状态池
4. 当状态池最后一项和`state`数据的`key`的变量名一样时
5. 当元素节点带有`data-dom`的标识跟状态池的的标识字符串一致时
6. 对`state`数据发生更改的那个节点的文本内容进行更新
7. 实现更新`state`数据时，页面内容实时发生更改



源码地址：https://gitee.com/kevinleeeee/compile-template-vue3-vite-demo



## `vue-loader`

手写`webpack`实现`vue-loader`驱动和`vue`轮子(非虚拟`dom`)

- 实现一个加载器，来解析`.vue`单文件组件里的模板和样式和脚本

- 实现`v-if`/`v-show`



通过一个程序将`.vue`转为`.js`，并且将`es6`转为`es5`并跑在`node`服务器上,

`node`的文件操作可以完成`js`，`css`文件的创建

最终形成一个完整的`html`引入`script`,`style`



**`webpack`的运行过程：**

1. `resolve: {extensions: ['.js', '.vue']}`处理`js,vue`后缀文件
2. 在模块规则定义的`loader`里调用相应的`vue-loader`(这里的`vue-loader`是自定义的非`vue`的)，自定义的`vue-loader`最终返回
   1. 希望处理的结果：
   2. 实现`import`引入的`style`标签内容引入到`html`里
   3. 实现`script`标签的内容作为一个组件对象导出使用
3.  处理`css`文件调用相应的`style-loader`,`css-loader`
4. 将处理好的结果放入到插件`HtmlWebpackPlugin`里
5. 打包`js`/`css`后放到目录`/dist`里



**自定义一个`vue-loader`加载器：**

当`webpack`处理`vue`后缀文件时会执行这个加载器，这个加载器会返回希望处理后的结果

```js
function vueLoader(source) {
  //source打印的是App.vue里写的代码字符串
  /**
   * console.log(source);
   * <template>
      <div>
        <div>
          <img v-if="isShowImg1" class="img" src="https://gimg2.baidu.com/image_search...=jpeg?sec=1649504657&t=2a48eec8e0e23a2192c960e60ce27b7f" />
          <img v-show="isShowImg2" class="img" src="https://gimg2.baidu.com/image_search/src...=jpeg?sec=1649504684&t=b8e0aa845d744916020406fa30d6217e" />
        </div>
        <button @click="showImg1">Show Image 1</button>
        <button @click="showImg2">Show Image 2</button>
      </div>
    </template>

    <script>
    export default {
      name: 'App',
      data () {
        return {
          isShowImg1: true,
          isShowImg2: true
        }
      },
      methods: {
        showImg1 () {
          this.isShowImg1 = !this.isShowImg1;
        },
        showImg2 () {
          this.isShowImg2 = !this.isShowImg2;
        }
      }
    }
    </script>
   */

  return '123';
}
```



**目标：希望把字符串的内容转变为`vue`单文件组件写法的结构**

1. 提取`template`标签内容
2. 提取`script`标签内容
3. 提取`style`标签内容
4. 定义一个临时存放的样式文件并写入样式代码
5. 将`import`引入的路径返回实现`html`引入`style`标签
6. 将`script`标签的字符串返回组件对象

**目标：希望编写`vue`里的`createApp`方法实现创建一个组件实例**

1. 定义`vm`对象
2. 挂载`component`对象里的`data`,`methods`,`template`属性到`vm`实例
3. 挂载`dom`节点(`template`里定义的内容)到`vm`实例

**目标：希望实现数据响应式和访问属性代理**

通过访问和修改`vm`实例的属性时，代理`Object.defineProperty`的`get/set`更改`this`访问返回的属性

**目标：希望定义两个`Map`数据类型的池子**

- 池子1(`propsPool`)：保存的节点和类型(`v-if`/`v-show`)和绑定事件方法名称
- 池子2(`eventsPool`)：保存节点和事件类型(`click`/`change`/`...`)和绑定事件的处理函数方法(`handler`)

```js
propsPool格式为：
Map(2) {
  img.img => {type: 'v-if', prop: 'isShowImg1'}, 
  img.img => {type: 'v-show', prop: 'isShowImg2'}
}

eventsPool格式为：
Map(2) {
  button => {type: 'click', handler: 'showImg1'}, 
  button => {type: 'click', handler: 'showImg2'}
}
```

**目标：希望根据`eventPool`的事件类型绑定事件处理函数**

给实例挂载访问`this.name = handler`函数

**目标：希望实现`v-if`和`v-show`的显示和隐藏效果**

- 注释节点替换的方式来实现`v-if`
- `display: none`的方式来实现`v-show`
- 在`setter`里如果数据发送更改时触发`update`函数

**项目目录：**

```
├─package.json
├─webpack.config.js
├─__temp - vue-loader驱动里对样式文件写入的临时目录存放临时样式文件
|   ├─css
|   |  └__1647282035869.css
├─src
|  ├─App.vue - vue单文件组件
|  └main.js - vue入口文件
├─public
|   └index.html
├─modules
|    ├─vue-loader - vue驱动实现一个单文件vue组件和样式的import引入
|    |     └index.js
|    ├─vue - vue轮子/实例挂载/数据响应式/事件绑定/v-if/v-show指令实现
|    |  ├─event.js - 处理绑定事件处理函数的方法
|    |  ├─index.js - 实例入口文件/创建实例/创建DOM/挂载DOM
|    |  ├─pools.js - map数据类型的池绑定节点和类型
|    |  ├─propsType.js - 标识文件
|    |  ├─reactive.js - 数据响应式getter和setter
|    |  └render.js - 渲染函数/更新函数
```

**源码地址：** https://gitee.com/kevinleeeee/vue-loader-webpack-vshow-vif-demo







## `watchEffect`

实现语法，要求是首次先执行执行回调一次，在`state.a`数据源变化的时候还要执行一次回调函数。

```js
watchEffect(() => {
  console.log('watchEffect访问state.a时输出state.a');
});
```

原理是通过数据劫持(`proxy`)的方式去`get`和`set`操作数据源。当`state.a`被访问时触发`getter`函数时外界定义一个容器去保存当前`watchEffect`的回调函数(收集)，收集完毕后清空容器等待下一个`watchEffect`回调函数。`setter`函数`notify`通知所有回调函数执行。

定义的容器格式写法如下，利用`weekmap`弱引用的数据格式去定义该容器。定义一个`Dep`公共的依赖收集类供其他`JS`文件获取，可以集成收集依赖和通知所有回调函数执行的方法和生成`WeekMap`数据格式的方法。 

```js
state {
  a: [ cb, cb ],
  b: [ cb ]
}

WeekMap {
  { a, b, c{...} }: Map{
    a: Set [ cb, cb ],
    b: Set [ cb ]
  }
}
```

当数据源`state.a`被修改时触发`setter`函数，通过`notify`函数去找到容器里所有的回调函数并全部执行。







## `watch`

实现语法，要求当`watch`方法执行时，先执行参数1的`getter`函数拿到数据依赖，当`getter`函数执行时收集参数2`watch`回调到容器中。监听新老值时`setter`函数`notify`通知所有回调函数且传入新老值并执行。

```js
watch(() => state.a, (cur, prev) => {...});
```







## `computed`

需要定义一个`ComputedRef`引用对象来保存计算后的值。先执行参数1的`getter`函数拿到数据依赖，马上执行回调函数并将得出的结果值作为`ComputedRef`的`value`默认值。`setter`函数`notify`通知所有回调函数且传入新老值并执行将获取的结果值赋值给`computedRef.value`。

```js
computed(() => state.a); //ComputedRef {_value: 3}
```

`watchEffect`和`watch`和`computed`方法实现的[源码地址](https://gitee.com/kevinleeeee/watch-watch-effect-computed-demo)。
