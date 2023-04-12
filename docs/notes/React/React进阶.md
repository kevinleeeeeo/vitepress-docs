# React 进阶

## JSX 进阶

底层实现 JSX 语法

JSX 其实是`React.createElement`函数调用的语法糖，React 会把 JSX 编译为`React.createElement`的调用形式

**React 的元素类型：**

一个类组件或者函数组件就是 React 元素，并且它是一种 React 的元素类型，组件里面用了 JSX 的形式，这个组件必须存在当前的模块的作用域中

React 会编译 JSX 变成`React.createElement`的调用形式，所以必须让 React 库存在当前的模块作用域中，如`import React from 'react';`，生产模式下`<script>`引入 cdn

**_问题：如何在 JSX 中使用点语法(对象访问语法)？_**

```
<MyUI.Button type="danger">Click</MyUI.Button>
```

**React 书写规范：**

- 小写字母开头代表 HTML 的内置组件，识别小写`<div>,<h1>`会将标签转换为`div,h1`，然后将其作为`React.createElement`的第一个参数
- 大写字母开头的自定义组件`<MyButton />`，它会编译成`React.createElement(MyButton)`

**运行时选择 React 类型：**

在运行组件的过程中，临时通过`props`去决定到底渲染哪一个组件

```
class LoginBtnGroup extends React.Component{
  render(){
    return(
      <div>
        <button>登录</button>
        <button>注册</button>
      </div>
    );
  }
}

class WelcomeInfo extends React.Component{
  render(){
    return(
      <div>
        <h1>欢迎您, { this.props.username }</h1>
      </div>
    );
  }
}

class Header extends React.Component{
  //声明一个静态属性
  //运行时选择React类型
  static components = {
    'login': LoginBtnGroup,
    'welcome': WelcomeInfo
  }

  render(){
    const HeaderUser = Header.components[this.props.type];

    return (
      <HeaderUser {...this.props } />
    );
  }
}
```

**关于 JSX 的`props`属性：**

在 JSX`{}`里面可以传入任何 JavaScript 表达式，但是不包括语句`if,for,switch,function`，如果是非表达式可以在 JSX 外面使用

**一些细节写法：**

- **字符串字面量**
- 去掉首尾空格换行
- 字符串之间的多个空格压缩为一个空格
- 字符串之间的换行压缩为一个空格

```
//字符串字面量的方式
<MyTitle title="这是一个标题" author="icy" />
```

```
//表达式的方式
<MyTitle title={ '这是一个标题' } author={ 'icy' } />
```

```
//JS表达式方式传入props,HTML实体字符会被转义为普通字符
<MyTitle title="这是一个<标题>" author="&lt;icy&lt;" />

//打印： 这是一个<标题> &lt;icy&lt;
```

```
//字符串字面量传入props的方式不会对HTML实体转义
<MyTitle title="这是一个&lt;标题&lt;" author={'<icy>'} />

//打印： 这是一个<标题>  <icy>
```

```
//props的布尔值表达
<MyTitle
  title="this is a TITLE"
  author="icy"
  //语义：字符串传入的意义是字符串的意思,但是不代表布尔真假
  //逻辑：字符串ture是逻辑真
  authorShow="true"
  //表达式写法表示传入布尔值
  autorShow={ true }
/>
```

**属性展开操作：**

```
const { title,author,authorShow } = this.props;
<MyTitle
  title={ title }
  author={ author }
  authorShow={ authorShow }
/>

//也可以用展开运算符的方式显示
<MyTitle
  { ...this.props }
/>

//排除某一个属性的写法：
//先排除不用的写在最前面，剩下的就是用的属性
const { abc, ...others } = this.props;
<MyTitle
  { ...this.others }
/>
```

**子元素：**

`null,undefined,bool`都是可以作为 JSX 的子元素，这些子元素是会被忽略不会渲染的

**当子元素是一个函数时：**

JSX 的`props.children`跟`props`本身是有一致的特性，`props.children`就可以传递任何类型的子元素

```
//定义一个Repeat组件专门来循环子项并打印出来且每次的index都不同
class Repeat extends React.Component{
  render(){
    const jsxArr = [];

    for(var i = 0; i <= this.props.num; i++){
      //this.props.children -> 父组件App里传入的值是一个函数(index) => <p>...</p>
      //并将传入的函数执行并传入参数i的结果依次存入数组
      jsxArr.push(this.props.children());
    }

    //返回一组JSX
    console.log(jsxArr);
    /*
      This is item 1.
      This is item 2.
      This is item 3.
      ...
    */
    return jsxArr;
  }
}

class App extends React.Component{
  render(){
    return(
      <div>
        <Repeat num={ 10 }>
          {
            (index) => <p key={ index }>This is item { index + 1 }.</p>
          }
        </Repeat>
      </div>
    );
  }
}
```

```
//Http > index.jsx
//专门定义一个组件来管理请求数据,loading,请求后数据视图格式
class Get extends React.Component{
  async componentDidMount(){
    const result = await axios(this.props.url);

    //当修改数据后执行定时器再修改state.component
    this.setState({
      data: result.data
    }, () => {
      setTimeout(() => {
        this.setState({
          //执行传入的函数并传入请求的后端数据返回出结果赋值到component里
          component: this.props.children(this.state.data)
        })
      }, 1000)
    });
  }

  state = {
    data: [],
    component: this.props.loading
  }

  render(){
    return <tr></tr>
  }
}

export default { Get }

//app.jsx
class App extends React.Component{
  render(){
    return(
      <div>
        <Http.Get
          url:'http//xxx.com/xxx',
          loading={
            <tr><td>正在加载中...</td></tr>
          }
        >
          //传入一个函数给子组件
          {
            (data) => {
              return data.map(item => (
                <tr key={ item.id }>
                  <td>item.id</td>
                </tr>
              ))
            }
          }
        </Http.Get>
      </div>
    );
  }
}
```

以上专门定义的组件可以节省其他逻辑专门处理数据请求等，把视图的工作交给 app 组件，把逻辑和视图需要的前期逻辑都交给定义的组件去做

**总结：**函数子元素的方式非常适合组件逻辑封装的方式实现的去做视图渲染前的逻辑

## 高阶组件

**_问题：如果两个组件中的部分功能相似，该如何处理？_**

复用相似的功能，两种方式复用：

1. `render props`模式思想
   1. 思路：将要复用的`state`和操作`state`方法封装到一个组件中，并通过其他组件传入的方法执行返回暴露给组件外部
   2. 写法一：`props`
   3. 写法二：`children`
2. 高阶组件(HOC)思想

```
//render props写法一：
<Mouse render={ x => <p>{console.log(x)}</p> } />
//组件内部：
this.props.render(this.state);

//写法二：
<Mouse>{ (x) => <p>{console.log(x)}</p> }</Mouse>
//组件内部：
this.props.children(this.state);
```

<u>**案例：选课表格列表**</u>

后端提供学生列表和教师列表两个数据

**实现功能：**

- 请求后端数据获取学生和教师列表
- 渲染学生列表
- 渲染教师列表
- 增加删除操作
- 增加喜欢操作
- 常规写法
- 高阶组件写法

**案例展示图：**

![image-20220202021236600](http://note-img-bed.dt-code.fun/image-20220202021236600.png)

**_问题：常规写法有什么弊端？_**

APP 组件把所有的数据暴露在跟 APP 组件无关的地方，APP 组件的作用只是承载视图汇总，像请求数据，子组件需要的函数方法也在 APP 组件里，这样会造成 APP 组件非常的臃肿

**_问题：高阶组件写法如何实现？_**

1. 抽离不相关的数据和方法
2. 封装一套程序方法兼容两个不同数据的请求

**_问题：HOC 是什么？_**

High Order Component - 高阶组件 高内聚低耦合

- HOC 不是 React 提供的 API，而是一种高级的设计模式
- HOC 是一个函数接收一个组件参数，返回一个新组件
- 普通组件返回的是 UI，而 HOC 返回的是一个新组件
- HOC 不能修改参数组件，只能传入组件所需要的`props`
- HOC 是一个没有副作用的纯函数
- HOC 除了必须填入被包裹的参数组件以外，其余参数根据需求增加
- HOC 不关心数据如何使用，包裹组件不关心数据从哪里来
- HOC 和包裹组件直接唯一的契合点就是`props`

**_问题：高阶组件实现了哪些功能？_**

将两个功能类似的功能和方法和数据管理抽象到一个高阶组件中，让高阶组件包装来完成请求数据，数据的保存，事件处理函数的管理

**关于横切关注点的问题：**

以前 React 更多的是用 mixins 思想，但是 mixins 具有很多的问题

**_问题：横切关注点是什么？_**

对参数组件本身的逻辑状态与视图横向切割(一般是按照组件切割)，**让 HOC 来完成逻辑和状态的管理，让参数组件来完成视图的渲染**，让 HOC 将数据与逻辑传递到参数组件中，从而完成关注点分离且有机结合的任务

**_问题：有哪些高阶组件注意事项？_**

- 不能重写参数组件原型上的生命函数方法
- 不能修改参数组件的引用
- 这样修改可能导致参数组件内部的逻辑执行失效
- 一切的功能都可以在容器组件内实现
- 高阶组件接收的参数组件可以是类组件，也可以是函数组件

**项目目录：**

```
//常规写法
├─index.html
├─package.json
├─Readme.md
├─src
|  ├─App.jsx - 管理视图/请求后端数据/缓存后端数据/定义修改子组件的方法
|  ├─index.jsx - 入口文件/挂载渲染组件
|  ├─model
|  |   └index.js - 请求后端的函数方法
|  ├─components
|  |     ├─StudentList.jsx - 表格列表视图的子组件
|  |     └TeacherList.jsx - 表格列表视图的子组件
├─server
|   ├─index.js
|   ├─package.json
|   ├─data
|   |  ├─students.json
|   |  └teachers.json
```

```
//高阶组件写法:
├─index.html
├─package.json
├─Readme.md
├─src
|  ├─App.jsx - 管理视图/给包裹组件传入props值
|  ├─index.jsx
|  ├─model
|  |   └index.js
|  ├─components
|  |     ├─listHoc.jsx - 高阶组件函数/根据props返回一个新的包裹组件
|  |     ├─StudentList.jsx
|  |     └TeacherList.jsx
```

**总结：**

HOC 其实是普通组件的一种抽象，把一些雷同的东西和一些可以统一管理的东西抽象出来，交给一个新的组件去进行管理，最终在使用到包裹组件的时候，把子组件绑定视图需要的属性和方法传给包裹组件，而包裹组件它致力于视图的渲染其他一概不管

而高阶组件是专门管理这些渲染组件的逻辑与数据以及数据请求和视图绑定

**源码地址：**

- 常规写法：https://gitee.com/kevinleeeee/react-student-teacher-table-v1-demo
- 高阶组件写法：https://gitee.com/kevinleeeee/react-student-teacher-table-v2-demo

## 组件封装

**案例：封装 HTTP 工具组件**

使用`Function as a children`封装一个`HTTP`请求组件，仿照`Provider/Consumer`组件来开发一个`HTTP.GET`或者是`HTTP.POST`组件去完成逻辑业务，此封装和集成造一个`HTTP`轮子，它可以帮助完成一些事情，复用性是比较高的

**需求：**

- 请求后端返回`students data`数据(`get`)
- 请求后端返回`grade students data`数据(`post`)
- 在组件内遍历返回的数据进行列表渲染

**关于`Functions as Children`：**

`JavaScript`表达式可以插入到`JSX`中并解析成字符串或一个`React`元素或者是一个列表，`props.children`即组件`<Example></Example>`包裹的内容可以任意类型的数据，并不一定用于去做渲染，也可以放入一个回调函数，回调执行后返回的内容就是视图，且回调是允许传入参数的

**案例展示图：**

![image-20220223230422995](http://note-img-bed.dt-code.fun/image-20220223230422995.png)

**目录：**

```
├─src
|  ├─App.jsx - App组件/绑定Student组件视图
|  ├─index.jsx - 入口文件/挂载
|  ├─utils
|  |   ├─HTTP -
|  |   |  ├─Get.jsx - HTTP.Get组件/请求数据/返回一个React元素组件集合
|  |   |  ├─index.js - HTTP组件出口文件
|  |   |  └Post.jsx - HTTP.Post组件/请求数据/返回一个React元素组件集合
|  ├─components
|  |     ├─Students
|  |     |    └index.jsx - 视图绑定/绑定HTTP组件
├─server
|   ├─index.js
|   ├─package-lock.json
|   ├─package.json
|   ├─data
|   |  └students.json
```

**总结：**

利用`react`里面的`props.children`解决方案来造一个属于自己的轮子

**源码地址：**https://gitee.com/kevinleeeee/react-http-component-demo

## `Refs`

允许开发者访问真实 DOM，允许用于强制修改子组件

**关于`React`里的数据流过程：**

通过`props`来实现父子组件的交互

**案例：管理 Input 焦点**

通过一个按钮，清空 input,value,input 聚集

```
class MyInput extends React.Component{
  constructor(props){
    super(props);

    //1.创建一个引用池 ref对象
    this.inputRef = React.createRef();
  }

  render(){
    console.log(this.inputRef);
    //{current: input}
    //此对象是创建出来的池子,池子放入属性current

    console.log(this.inputRef.current);
    //打印真实节点 <input type="text"/>

    return (
      <div>
        //2.绑定ref属性 给组件赋值ref
        <input ref={ this.inputRef } />
      </div>
    );
  }
}
```

**关于`onRef`：**

给子组件增加的属性，此操作可以让父组件访问子组件里的属性和方法

```
//子组件定义onRef
class Modal extends React.Component{
  constructor(props){
    super(props);

    this.modalRef = React.createRef();

    if(props.onRef){
      //this -> 组件Modal
      props.onRef(this);
    }
  }

  setMyModal(instance){
    this.abc = instance;
  }

}

//父组件使用onRef
class App extends React.Component{
  render(){
    return (
      <div>
        //onRef接收一个函数()=>{}
        //参数是instance实例
        //给子组件增加一个abc属性，值为父组件实例
        <Modal onRef={ instance=> this.acb = intance } />
        //调用子组件上的方法
        <button onClick={ ()=> this.abc.open() }></button>
      </dive>
    );
  }
}
```

**关于`React.createRef()`：**

通过它创建出一个`ref`对象，通过元素的`ref`属性可以附加到 React 元素上，一般通过构造器中给`this`上的属性赋值一个`ref`方便整个组件使用

`ref`只要传递 React 元素中，就可以利用`ref`的`current`属性访问到该真实 DOM 节点

`ref`在`componentDidMount`和`componentDidUpdate`触发前更新，在生命周期函数内访问属性

**`ref`有不同的使用方式：**

- 如果放在 HTML 元素上，那么`current`就是真实 DOM 节点
- 如果放在 Class 组件上，那么`current`指向组件实例
- 如果放在函数组件上，在函数组件上没有实例，那么`createRef`就附加不到组件上

**`Refs`转发机制**

**_问题：如何将子节点`ref`暴露给父组件?_**

在 16.3 版本以上可以使用`Refs`转发机制

将`ref`自动的通过组件传递给子组件

**关于`React.forwardRef()`：**

该方法实际上可以传入一个回调函数，回调函数返回一个 React 元素

```
//此方法也可以定义在跟类组件或函数组件同级区域
//通过forwardRef向input转发ref属性
//ref参数只能用forwardRef定义的组件内可接收
const MyInput = React.forwardRef((props, ref) => {return React元素})
```

**高阶组件`ref`转发机制：**

```
function InputHoc(WrapperComponent){
  class Input extends React.Component{
    render(){
      //在容器组件内部获取ref属性
      const {forwardedRef, ...props} = this.props;

      return (
        //将forwardedRef传递给参数组件
        <WrapperComponent ref={forwardedRef} {...props} />
      );
    }
  }

  return React.forwardRef((props, ref) => {
    return <Input {...props } forwardedRef= {ref} />
  })
}
```

**_问题：`ref`有什么缺点？_**

- `string Refs`依赖的是当前组件实例下面的`refs`集合里的`ref`，所以必须 React 保持追踪当前正在渲染的组件，因为组件没有加载渲染完成时，`this`是无法确定的，React 在获取`ref`时可能比较慢
- 它不能在`render`中工作
- 它不能组合，只能有一个`ref`

## Redux

是一个独立专门用于做状态管理的 JS 库(不是`react`插件库)，它可以用在`react,angular,vue`等项目中，但基本与`react`配合使用

**作用：**

集中式管理`react`应用中多个组件共享的状态

**安装：**

```
npm i -S redux
```

**使用步骤：**

1. 引入`redux`，创建一个`store`对象
2. 自定义一个`action`对象
3. 使用`store.dispacth(action)`方法把`action`对象传到`reducer`函数的参数里
4. 定义`reducer`函数，根据参数`action`的类型判断条件返回新的`state`数据
5. 使用`store.getState()`方法获取最新的`state`数据
6. 定义`store.subscribe`方法监听当`state`发生更改时重新加载组件从而更新视图

**Store 对象：**

一个容器来保存数据

**如何创建一个 Store 对象?**

```
import { createStore } from 'redux';

//Redux提供的createStore函数,接收另一个函数reducer作为参数，返回一个新生成的Store对象
const store = createStore(reducer);

/**
 * 打印store对象
 * console.log(store);
 * {
 *   //dispatch接受action对象作为参数
 *   dispatch: ƒ,
 *   //监听state状态发生更改时，调用方法渲染更新视图
 *   subscribe: ƒ,
 *   //获取当前状态state的值
 *   getState: ƒ,
 *   replaceReducer: ƒ,
 *   @@observable: ƒ
 * }
 */
```

**关于`store.dispatch()`：**

```
//发送一个action对象
const action = {type: 'INCREMENT', data: 1};

//它接收一个action对象作为参数，将它发送出去
store.dispatch(action);
```

**_问题：Action 是什么？_**

它是描述当前发生的事情，改变 state 的唯一办法，就是使用 action 他会运送数据到 Store

**如何创建一个 action 对象？**

> **注意：**`type`属性是必须的，它标识 Action 名称(事情的名称)，其他属性可以自由设置

```
//自定义一个
const action = {type: 'INCREMENT', data: 1};

//或者利用actionCreators()方法来创建一个action对象

```

**关于`reducer`函数：**

它是一个纯函数，只要同样的输入，必定得到同样的输出

`Store`收到`action`以后，必须给出一个新的`State`, 这样视图才会发生变化，这种`State`计算过程叫做`Reducer`

```
//store自动调用Reducer,并传入两个参数，当前的State和收到的action，并返回新的State
const store = createStore(counter);

//reducer函数接收dispacth发送过来的action对象
function counter(state, action){
  console.log(state);
  //undefined

  consolo.log(action);
  //没有定义action对象时打印
  //{type: '@@redux/INITe.p.e.u.7.h'}
  //当定义好action对象时打印定义好的action对象
  //{type: 'INCREMENT', data: 1}

  //判断action的类型返回对应的新的state数据
  switch (action.type) {
    case 'INCREMENT':
      return action.data;
    default:
      //否则返回原来的state数据
      return state;
  }
}
```

```
//reducer函数会返回一个新的state数据
//可以通过store对象里面的getState方法进行获取
const state = store.getState();
console.log(state);
//拿到action类型判断之后的state数据
//1
```

**关于`store.subscribe`方法：**

监听 state 状态发生更改时，调用方法渲染更新视图

```
//当参数为函数的函数执行完毕后会调用subscribe
store.subscribe(render);

function render() {
  //将store对象传入app组件这样app组件可以用store的方法
  ReactDOM.render(<App store={store} />, document.getElementById('root'));
}
```

**Redux Flow:**

```
React Component -> Action Creators -> action Object -> dispatch(action) -> Reducers -> React Component
```

**案例：点击按钮修改页面显示的数量数据**

**技术**：react

写法：常规 + redux

**功能：**

- 增值
- 减值
- 奇数时增值
- 延时增值

**案例展示图：**

![image-20220206140111007](http://note-img-bed.dt-code.fun/image-20220206140111007.png)

**项目目录：**

```
//redux写法项目名目录：
├─.gitignore
├─package.json
├─README.md
├─src
|  ├─index.js - 入口文件/创建store/监听state数据
|  ├─redux
|  |   ├─action.js - 定义多个action函数的模块(返回action对象)
|  |   └reducers.js - 管理多个reducer函数功能的模块/业务逻辑
|  ├─components
|  |     └app.jsx - 应用组件/state数据获取/视图数据和点击事件方法绑定
├─public
|   ├─index.html
```

**源码地址：**

- 基础写法：https://gitee.com/kevinleeeee/react-redux-num-button-demo
- redux 写法：https://gitee.com/kevinleeeee/react-redux-num-button-v2-demo

`Redux`将所有组件分成两大类：`UI`组件和容器组件

- `UI`组件
  - 只负责`UI`的呈现，不带有任何业务逻辑
  - 不适用`this.state`这个变量
  - 所有数据都有参数`this.props`提供
  - 不适用任何`redux`的`API`

**_问题：如果组件既有 UI 又有业务逻辑，如何处理？_**

将它拆分为外面是一个容器组件，里面包含一个 UI 组件，前者负责外部通信，将数据传给后者，有后者扶着渲染视图

**_问题：数据如何传给 UI 组件？_**

`connect`: 连接`React`组件与`redux store`

**关于`connect`方法:**

它接受两个参数：

- `mapStateToProps`是一个函数，建立一个`state`对象到`props`对象的映射关系(`redux store`里面的`state`可以通过 UI 组件的`props`获取)
- `mapDispatchToProps`，建立一个`store.dispatch`方法到`props`对象的方法(`redux`里面`action creators`创建函数是我们想要通过`props`获取 )

```
//对APP组件进行处理，由处理之后的容器组件接收外界的数据(store)
import { connect } from 'react-redux';
//给app组件定义props属性的值
export default connect(
  state => ({
    //接收返回回来的state的值
    count: state
  }, {
    //专门处理dispatch函数
    increment,
    decrement
  })
)(App);
```

## Hooks

`react`在 16.8 版本时支持在函数里写一些`use`开头的钩子，而不用使用类

## `state Hook`

```
function App(){
  const [ count, setCount ] = useState(0);

  return(
    <div>
      <p>You click { count } times.</p>
      <button onClick={ ()=> setCount(count - 1) }>click</button>
    </div>
  )
}
```

**_问题：`Hook`是什么？_**

它是一个简单的函数，函数组件再执行的时候能够给函数组件添加一些特殊的功能

**声明变量**

在函数组件中，使用`useState`来声明变量

```
import React, {useState} from 'react';

const [ count, setCount ] = useState(0);
```

**_问题：调用`useState`方法时做了什么？_**

声明一个变量并返回一个数组包括变量和改变变量的方法

**_问题：`useState`需要哪些参数?_**

参数 1 是默认值

**_问题：`useState`如何做到以下结果的现象？_**

```
function App(){
  const [ count1, setCount1 ] = useState(1);
  const [ count2, setCount2 ] = useState(2);
  const [ count3, setCount3 ] = useState(3);

  console.log('render');

  return(
    <div>
      <p>You click { count1 } times.</p>
      <p>You click { count2 } times.</p>
      <p>You click { count3 } times.</p>
      <button onClick={ ()=> setCount(count1 - 1) }>click</button>
      <button onClick={ ()=> setCount(count2 - 1) }>click</button>
      <button onClick={ ()=> setCount(count3 - 1) }>click</button>
    </div>
  )
}

打印结果说明：
1.每次点击任意按钮都会打印一次，说明每次执行setCount函数时，都会重新加载app组件
2.useState钩子函数一直被复用，但返回的都是不同的结果
3.返回的结果并不影响其他的结果，互不干扰
```

**解答：**

在每一次渲染 app 组件的时候都会有一个记忆单元格(状态数组)，

当调用`useState`函数时，会将初始值，状态，修改状态的函数存到一个单元格，然后将指针往下移动，再次调用`useState`函数时，再次保存一个单元格，指针往下移动，以此类推...

**_问题：`Hook`有什么规则？_**

- 只在最顶层使用`Hook`
- 不在循环，条件或嵌套函数中使用
- 只在`React`函数中调用`Hook`

**注意点：**

- 使用`useState`返回的数组中的第二个元素是修改状态的函数，也是唯一的函数(引用时一致的)

- 在函数组件中，当`setCount()`的参数是原始值且没有发生更改时，app 组件不会重新加载，但是参数是引用值且没有发生更改时，app 组件会重新加载，以上基于`Object.is`算法

- 在类组件中，不管时原始值还是引用值，app 组件也是会重新加载

- 函数组件更新同时保存上一次的`state`和最新的`state`的返回值

- 多次使用`setCount`函数会合并只会加载一次 app 组件

**惰性初始化`state`**

`initialState`参数只会在组件的初始渲染中起作用，后续渲染时会被忽略

```
//初始值是函数
//一般情况下,数据更改时组件内部程序是会反复执行，想要只运行一次时可以使用惰性初始化state
const [state, setState] = useState(() => {
  const initialState = someExpensiveComputation(props);
  return initialState;
});
```

## `effectHook`

```
function App(){
  useEffect(() => {
    //副作用：给全局变量赋值
    document.title = 'hello react effecthook!'
  });
}
```

**_问题：使用`effectHook`有什么作用？_**

该钩子接收一个包含命令式，且有可能有副作用代码的函数

它可以让开发者在函数组件中执行副作用操作

**_问题：什么是副作用？_**

在纯函数中，只要和外部存在交互时就不是纯函数

**_问题：哪些操作会导致不是纯函数？_**

- 引用外部变量
- 执行外部函数

**关于纯函数：**

相同的输入会引起相同的输出

**关于 React 中的副作用：**

只要不是在组件渲染时用到的变量，所有操作都为副作用

- 跟外部相关的东西
- 依赖`useState`声明的变量和函数
- 依赖外部全局`document`/`window`变量(修改全局变量,，计时器)
- 依赖外部全局的 DOM 对象(修改 DOM)
- 依赖 Ajax(全局的`new XMLHttpRequest()`返回的对象)

**_问题：在类组件中如何做副作用？_**

通过生命周期函数(`componentDidMount`/`componentDidUpdate`)中做副作用，函数组件中的`useEffect`相当于将两个生命周期相合并执行的结果一样，但是会存在执行时间不同

**生命周期图谱：**

![image-20220208110226286](http://note-img-bed.dt-code.fun/image-20220208110226286.png)

**关于`useEffect`和`componentDidMount`/`componentDidUpdate`的执行时间：**

- 在初次渲染以后执行`componentDidMount`生命周期函数程序(页面加载 DOM 之前执行)
- 在更新之后执行`componentDidUpdate`生命周期函数程序(页面加载 DOM 之前执行)
- `useEffect`是在页面加载 DOM 完毕时执行

```
function App(){
  //初次渲染时和更新组件时打印render
  console.log('render');

  useEffect(() => {
    //副作用：给全局变量赋值
    document.title = 'hello react effecthook!'
  });
}
```

**_问题：为什么`useEffect`函数可以在真实 DOM 构建以后执行？_**

因为它是一个异步程序

**_问题：`useEffect`做了什么？_**

告诉 React 组件在渲染后执行某些操作，并保存传递的函数，并且在执行 DOM 更新之后调用它

**_问题：为什么在组件内部调用`useEffect`?_**

将`useEffect`放在组件内部可以让开发者在`effect`中直接访问`state`变量或`props`，不需要其他的 API 去读取它，它已经保存在函数的作用域中

**_问题：`useEffect`都会在每次渲染后执行吗？_**

是的，默认情况下，在第一次渲染之后和每次更新之后都会执行

**_问题：什么时候需要清除`effect`?_**

将订阅的数据使用完毕时清除取消订阅(`componentWillUnmount`)

**_问题：清理函数什么时候会执行？_**

- 在每一次运行副作用函数之前执行
- 在组件销毁的时候也会执行

```
function App() {
  const [count, setCount] = useState(0);

  //执行顺序1:首次渲染执行
  //执行顺序3：更新渲染执行
  console.log('render');

  useEffect(() => {
    document.title = 'hello react effecthook!';

    //执行顺序2:首次渲染执行
    //执行顺序5:更新渲染执行
    console.log('effect');

    //存在清理函数的时候：
    //1.render
    //2.useEffect
    //3.render
    //4.清理函数
    //5.useEffect
    //清理函数在每一次运行副作用函数之前执行
    return () => {
      //执行顺序4：更新渲染先执行返回的回调
      console.log('clear Effect');
    };
  });

  return (
    <div>
      <div>{count}</div>
      <button onClick={() => setCount(count + 1)}>add</button>
    </div>
  );
}
```

每一次副作用函数是不同的唯一的函数

```
function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let timer = setInterval(() => {
      setCount(count + 1);
    }, 1000);

    return () => {
      //可以访问闭包的私有属性timer
      clearInterval(timer);
    };
  });

  return (
    ...
  );
}
```

默认情况下，`useEffect`都会在第一次渲染之后和每次更新之后都会执行

```
//这种情况就会不停的更新数据且首次渲染和更新之后都会执行
function App() {
  const [count, setCount] = useState(0);

  console.log('render');

  useEffect(() => {
    console.log('开始计时器');

    let timer = setInterval(() => {
      console.log('进入计时器');
      setCount(count + 1);
    }, 1000);

    return () => {
      console.log('清除计时器');
      clearInterval(timer);
    };
  });

  return (
    ...
  );
}
```

那么，**如何只在初次渲染时执行(`componentDidMount`)？**，而不希望在更新之后执行

不传入依赖项到数组里就不会是`useEffect`函数重复运行

```
//通过第二个useEffect参数存放的数组依赖项来实现
//第二个参数：自定义当前effect函数所需要的依赖项
//1.依赖是[],在初次渲染和卸载的时候执行
//2.有依赖项,并且依赖项不一致的时候会重新执行
function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('开始计时器');

    let timer = setInterval(() => {
      console.log('进入计时器');
      setCount(count + 1);
    }, 1000);

    return () => {
      console.log('清除计时器');
      clearInterval(timer);
    };
    //注意：
    //1.如果数组为空，说明没有写入依赖项,它会拿默认值useState(0) = 0，原理是拿闭包定义的count = 0
    //2.如果数组写入依赖性，[count]，就会拿最新的count数据
    //3.不写依赖拿到最新的count可以这样写个箭头 函数setCount(count => count + 1)
  }, []);

  return (
    ...
  );
}
```

## 自定义 hook

**_问题：自定义 hook 必须以 use 开头吗？_**

必须遵守约定写

**_问题：两个组件中使用相同的 hook 会共享`state`吗？_**

不会的，要用到数据共享时单独引入

**_问题：自定义 hook 如何获取独立`state`?_**

通过函数多次调用即可

**案例：渲染一个嵌套的列表页面**

**写法：**

- 类组件方式
- 自定义 Hook 方式
- 高阶组件方式

**项目接口：**

https://jsonplaceholder.typicode.com/users

**案例展示图：**

![image-20220209142804499](http://note-img-bed.dt-code.fun/image-20220209142804499.png)

**项目目录：**

```
├─index.html
├─package.json
├─src
|  ├─appByClass.jsx  - 类组件写法的APP组件/List组件/视图绑定
|  ├─appByHook.jsx - 组件写法的APP组件/list组件钩子/视图绑定
|  ├─index.jsx - 入口文件/类组件写法和自定义hook写法2选1/视图渲染
|  ├─service
|  |    ├─infoHOC.jsx - 高阶组件/数据请求/返回组件
|  |    └useInfo.jsx - 自定义hook模块/数据请求和返回数据
```

**源码地址：**

https://gitee.com/kevinleeeee/react-render-list-class-hook-demo

## `useReducer`

跟`redux`较为相似

**_问题：为什么会存在`redux`？_**

- 在类组件中的`state`是一个对象，所有的数据类型都要在一个`state`中完成
- 根据组件数据单向流原则，想操作`state`必须要通过对应的方法，如果是父组件中的的数据必须在父组件定义对应的方法，子组件定义自己的方法，存在数据凌乱的问题

**_问题：`redux`存在的作用？_**
统一管理所有的数据，实现所有数据状态调度的方法，用一种方式实现所有数据的更新

**_问题：如何用一种方法统一更改或调度`state`？_**
在视图中使用`dispatch(action)`方法实现所有数据的调度

```
<button onClick={() => dispatch({ type: 'increment' })}> + </button>
```

**_问题：`action`行为是什么？_**
有一个对象来描述当前的行为`{ type: 'decrement' }`

**_问题：`reducer`函数有什么用？_**

```
/**
 * 希望通过reducer函数进行统一调度(归纳/管理)
 * @param {*} state 初始状态
 * @param {*} action 动作对象
 */
function reducer(state, action) {
  //判断动作行为的类型
  switch (action.type) {
    case 'decrement':
      return { count: state.count - 1 };
    case 'increment':
      return { count: state.count + 1 };
    default:
      throw new Error();
  }
}
```

**使用方式：**

1. 视图组件发起更改`state`状态的行为
2. 定义`reducer`函数，根据`action`行为的类型编写相应业务逻辑
3. 执行`useReducer`函数，传入`reducer`函数和`state`初始值作为第一第二参数
4. `useReducer`函数返回修改后的`state`状态数据

```
//重写useReducer钩子函数
/**
 * 重写useReducer钩子函数
 * @param {*} reducer 统一调度归纳函数
 * @param {*} initialState 初始值state
 */
function useReducer(reducer, initialCount) {
  const [count, setCount] = useState(initialCount);

  /**
   * dispatch函数执行reducer函数并修改count数据
   * @param {*} action 接收action对象
   */
  const dispatch = (action) => {
    const newCount = reducer(count, action);
    setCount(newCount);
  };

  //返回最新的count
  return [count, dispatch];
}
```

## `useContext`

跟类组件中`React.createContext`的用法基本一致，接收一个`context`对象(`React.createContext`的返回值)，并返回当前值，`context`的值由上层组件中距离当前组件最近的`<MyContext.Provider />`的`value`属性决定的

```
import React, { createContext, useContext } from 'react';

const AppContext = createContext();

function List(){
  const value = useContext();
  return (
    <div>{ value }</div>
  );
}
```

## `useMemo`

在性能优化时，通过传一个特点的值，这个值不会随着组件刷新而重新计算

**_问题：什么是`memo`?_**

它跟类组件中的`PureCompoent`方法用途一样，如果视图在绑定某个方法时，组件加载时会重复的生产新的函数方法，而`memo`方便包裹使用就能避免组件绑定的方法多次执行

它是函数组件中优化组件的一种方式，不希望子组件重新运行

```
//PureComponent在类组件中的写法：
class Foo extends PureCompoent{
  //定义了PureCompoent之后就不会重复执行下面的程序，除了有属性更新的情况
  render(){
    return (...);
  }
}

//memo在函数组件中的写法：
const Foo = memo((props) => {
  //和PureCompoent的效果一样
  return (...);
});

function App(){
  render(){ ... }

  return (
    //视图绑定的方法在默认情况下，会多次执行render方法
    <Foo render={ render }></Foo>
  );
}
```

**_问题：什么是`useCallback`?_**

它固定的是一个函数，性能优化的手段

它可以将视图绑定的方法重新改变为同一个引用值，除非依赖项有更改，否则永远都不会去做渲染

```
function App(){
  const [count, setCount] = useState(0);
  //当第二个参数数组有依赖时，当依赖项有变化时才重新渲染视图
  //useCallback在首次渲染之后才执行
  const myRender = useCallback(() => {...}, [count]);

  return (
    //由于每次绑定的视图方法是不同的引用值，在渲染时会生成不同的方法
    <Foo render={ myRender }></Foo>
  );
}

function Foo(){
  return (
    <div>{props.render()}</div>
  );
}
```

**_问题：什么是`useMemo`?_**

它固定的是一个值，性能优化的手段，它跟`useCallback`实现的效果一样，防止子组件多次渲染的问题，区别在于写法不同

```
function App(){
  const [count, setCount] = useState(0);
  //当第二个参数数组有依赖时，当依赖项有变化时才重新渲染视图
  //这里useMemo在首次渲染期间执行(值：函数执行完后返回的字符串)
  const myRender = useMemo(() => {...}, [count]);

  return (
    //由于每次绑定的视图方法是不同的引用值，在渲染时会生成不同的方法
    <Foo render={ myRender }></Foo>
  );
}

function Foo(){
  return (
    //注意这里的render没有执行
    //因为上面的memo()方法传入的是一个值所以不用执行
    <div>{props.render}</div>
  );
}
```

**总结：**

`useCallback`和`useMemo`区别

```
useCallback(fn, deps) 相当于 useMemo(() => fn, deps)
```

## `useRef`

和类组件中的`ref`用法一致，写法会更简单

> **注意：**
>
> 默认情况下给函数组件写 ref 会报错
>
> `Warning: Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?`

```
import React, { useRef } from 'react';

const Foo = () => {
  return <input type="text" />;
}

class App extends React.Component {
  inputRef = createRef();

  render() {
    return (
      <div>
        //默认情况下给组件写ref会报错
        //ref没有办法去通过函数组件的方式引用函数组件
        <Foo ref={this.inputRef} />
      </div>
    );
  }
}
```

**解决方法：**

通过`forwardRef`方法给子函数组件包裹实现`ref`转发可以解决

```
const Foo = forwardRef((params) => {
  return <input type="text" />;
});
```

**_问题：`forwardRef`方法是如何解决`ref`引用问题？_**

`ref`是可以指向引用，可能是原生 DOM，也可能是子类组件，但函数组件无法指向，`forwardRef`可以实现转发`ref`

```
const Foo = forwardRef((params, inputRef) => {
  // console.log(inputRef);
  //{current: null}

  return <input type="text" ref={inputRef} />;
});

class App extends React.Component {
  inputRef = createRef();

  onClick() {
    console.log(this.inputRef.current);
    //获取子组件的视图元素<input type="text" />
  }

  render() {
    return (
      <div>
        <Foo ref={this.inputRef} />
        <button onClick={this.onClick.bind(this)}>button</button>
      </div>
    );
  }
}
```

**`useRef`写法：**

当父子组件都为函数组件时`useRef`写法更为精简

```
const App = () => {
  //createRef和useRef写法效果一样
  //区别：
  //1.类组件和函数组件都可以可以用createRef
  //2.但是类组件中不可以使用钩子useRef
  //3.在函数组件中useRef钩子比createRef性能优化更好些
  //const inputRef = createRef();
  const inputRef = useRef();

  const onClick = () => {
    console.log(inputRef.current);
    //获取子组件的视图元素<input type="text" />
  };

  return (
    <div>
      <Foo ref={inputRef} />
      <button onClick={onClick}>button</button>
    </div>
  );
};
```

## `useInperativeHandle`

如果父组件通过绑定`ref`视图去拿到子组件的真实 DOM 是存在问题的，本希望父组件能使用子组件 DOM 的某些功能(如`focus`等)，甚至当拿到真实 DOM 也可以把子组件的 DOM 删除

那么如何只能使用子组件的方法，而不能操作子组件真实 DOM 呢？

可以使用`useInperativeHandle`钩子

```
const Foo = forwardRef((params, inputRef) => {
  const fooInputRef = useRef();

  const fooMethod = () => {
    console.log('This is Foo method!');
  };

  //通过参数inputRef把子组件的方法暴露出去
  //useImperativeHandle(转发的ref, ()=>{})
  useImperativeHandle(inputRef, () => {
    //返回一个方法集合对象
    return {
      fooMethod
    };
  });

  //抛出子组件的ref引用
  return <input type="text" ref={inputRef} />;
});

//父组件inputRef.current打印的是一个对象而不是子组件真实DOM
//{fooMethod: ƒ}
```

## `useLayoutEffect`

和`useEffect`相同，区别在于触发时间不一样

- 在 DOM 加载完成之后执行`useEffect`
- 在 DOM 加载完成之前可以使用`useLayoutEffect`

## `useDebugValue`

用的不多，在开发者工具栏中显示自定义 hook 标签(提示 hook 信息)

```
useDebugValue('这是重要的信息,别改');
```

![image-20220212012126166](http://note-img-bed.dt-code.fun/image-20220212012126166.png)

## 案例

**案例：封装 UI 组件案例**

`react hook`封装一些 UI 组件，可以通过配置项来更改组件样式或内容

**封装：**

- 按钮
- 复选框
- `checkbox`单选多选全选反选框组件

**案例展示图：**

![image-20220224015811206](http://note-img-bed.dt-code.fun/image-20220224015811206.png)

**目录：**

```
├─src
|  ├─App.jsx - 视图绑定/自定义配置项
|  ├─index.jsx
|  ├─components
|  |     ├─MyCheckboxList - 列表组件/单选/全选/删除逻辑/动态视图渲染
|  |     |       ├─index.jsx
|  |     |       └index.scss
|  |     ├─MyCheckbox - 复选框组件
|  |     |     ├─index.jsx
|  |     |     └index.scss
|  |     ├─MyButton - 按钮组件
|  |     |    ├─index.jsx
|  |     |    └index.scss
├─mock
|  └students.js
```

**总结：**

- 由外向内写组件
- 明确需求再写逻辑

**源码地址：**https://gitee.com/kevinleeeee/react-uiplugin-hook-demo
