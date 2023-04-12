# React 基础

**学习要求：**

- 深度学习原则
- 站在 React 立场上去理解 React 的设计理念
- 理解 API 设计的初衷
- 阅读官方文档

## 概念

**_问题：React 是什么？_**

构建用户界面的 JavaScript 库

**_问题：React 的主观意愿是什么？_**

1. React 仅仅是负责 View 层渲染
2. React 是一个视图渲染的工具库，不做框架的事情，不做自定义指令，不做数据类型强处理

**_问题：为什么要这么设计 React?_**

对比与`vue option`横向拆分(`data,methods写法区域较为固定`)组件的方式只适用中小型应用(简单页面数据展示)，一旦数据庞大时组件间事件传递数据传递，不管是否用`vuex`都会是一个繁琐的操作

对比`react`只是关注视图，逻辑的写法偏向纵向，可以容易拆分，也可以结合各种设计思想进行模块之间的设计与编写，开发者思想清晰时可以对组件更加好的拆分，代码非常的干净，方法可以单独封装后进行组件内部使用，事件传递和数据传递也简单，也更加好的管理和维护，场景上更适合更加复杂的应用场景，后台系统，开发社区也较为成熟

## 使用

简单使用 React

**如何负责视图渲染？**

```
//1.添加根容器
<div id="app"></div>

//2.引入cdn脚本
//注意：开发环境
//注意：script标签新增属性crossorigin src="..."以保持请求时允许跨域
<script crossorigin src="https://unpkg.com/react@17/umd/react.development.js" ></script>
<script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.development.js" ></script>

//3.创建React组件
class MyButton extends React.Component {
  constructor(props) {
    super(props);

    //创建state 相当于 vue data
    this.stata = {
      openStatus: false
    }

  }

  //渲染视图必须放入render函数里
  render() {
    //并且要返回视图模板
    return `Hello React!`;
  }
}
```

**知识点：**

- React 提供了 ReactAPI 专门处理视图的 API 集合
- ReactDOM: 从 render 函数到虚拟 DOM 节点到真实 DOM 节点需要用的库

`React.createElement`方法可以手动创建一个 React 元素

```
//React提供了React API专门处理视图的API集合
//ReactDOM: 从render函数到虚拟DOM节点到真实DOM节点需要用的库

/**
 * ReactDOM.render(){}
 * @param react元素
 * @param 挂载的容器节点
 */
ReactDOM.render(
  //创建react元素变成虚拟节点然后再变成真实节点

  /**
   * React.createElement(){}
   * @param 标签名称
   * @param 新增属性
   * @param 标签文本内容/子节点标签
   */
  React.createElement('div', {
    'data-tag': 'div'
  }, 'This is my first React experience'),
  document.getElementById('app')
);

/**
 * 页面element：
 * <div id="app">
 *   <div data-tag="div">This is my first React experience</div>
 * </div>
 */
```

```
//手动新增子节点的写法：
//注意：
//1.新增子节点必须带有key属性
//2.class写法是className
//3.子节点插入到[]
var span = React.creatElement('span', {
  className: 'text',
  key: 1
}, 'This is a span');

ReactDOM.render(
  React.createElement('div', {
    'data-tag': 'div'
  }, [span]),
  document.getElementById('app')
);

/**
 * 页面element：
 * <div id="app">
 *   <div data-tag="div">
 *     <span class="text">This is a span</span>
 *   </div>
 * </div>
 */
```

`React.createElement`方法也可以接受**React 类组件**作为参数去创建一个真实节点

```
ReactDOM.render(
  React.createElement(MyButton),
  document.getElementById('app')
);

//页面element：<div id="app">Hello React!</div>
```

**关于 React 组件：**

1. 继承`React.Component`
2. `render`函数返回视图

## 搭建

**如何创建 React?**

工程化创建一个 React

```
//创建一个脚手架
//脚手架内部的工程化实现：babel/webpack
//npx命令: npm5.2+ 版本新增命令
npx create-react-app my-react-app

//运行项目
npm run dev
```

## JSX

通常来说，浏览器无法处理 JSX 语法，可以通过包编译，也可以在 vite 的项目中运行`.jsx`文件

**_问题：JSX 是什么？_**

- 是一种标签语法，在 JavaScript 基础上的语法扩展，既有 HTML XML 的形态，又有 JavaScript 的逻辑
- 不是字符串，不是 HTML 标签
- 是描述 UI 呈现与交互直观的表现形式
- 生成 React 元素

```
//通过JSX创建react元素
const rEl = <h1>This is my first JSX experience.</h1>
```

`createElement`与 JSX 对比：

```
//createElement
const rEl = React.createElement('h1', null, 'This is h1');

//JSX
const rEl = <h1>This is my first JSX experience.</h1>

ReactDOM.render(rEl, document.getElementById('app'));
```

**命名：**

JSX 遵循 JS 命名规范，一般使用 camelCase 小驼峰命名

- `class -> className`
- `tabindex -> tabIndex`

**_问题：为什么 React 不区分开视图和逻辑？_**

1. 渲染和 UI 标记是有逻辑耦合的
2. 即使是这样的耦合，也能实现关注点分离

```
//渲染和UI标记是有逻辑耦合的
render(){
  return (
    <button onClick={ statusChange() }></button>
  );
}
```

**_问题：JSX 插值表达式是什么？_**

一切有效的(符合 JS 编程逻辑的)表达式都写在`{}`里面，JSX 有编译过程，被编译以后转化成 React 元素，实际上是一个普通的对象

```
const rEl = <h1 className="title">This is a title part.</h1>

/**
 * 打印react对象
 * console.log(rEl);
 * {
 *   $$typeof: Symbol(react.element),
 *   key: null,
 *   props: {className: 'title', children: 'This is a title part.'},
 *   ref: null,
 *   type: "h1",
 *   _owner: null,
 *   _store: {validated: false},
 *   _self: null,
 *   _source: null
 * }
 */
```

## 渲染

`ReactDOM`

根节点内的所有的内容都是由`ReactDOM`进行管理的

`ReactDOM.render`函数

将 react 元素渲染到根节点中

```
//接收函数组件/类组件
function Title(){
  return (<h1>This is h1</h1>);
}

ReactDOM.render(
  <Title/>,
  document.getElementById('app')
);
```

总结：如果是组件渲染，`ReactDOM.render`的第一个参数一定要是一个 React 元素

1. 组件使用 JSX 语法
2. 使用`React.createElement`将组件转为 React 元素

**_问题：React 基本的更新逻辑有哪些？_**

- React 元素是不可变的对象
  - 不能添加属性
  - 不能修改属性
  - 不能删除属性
  - 不能枚举

**重点：**

渲染更新的规律，观察 element 中节点的更新状况，发现`ReactDOM.render`会深度对比新旧标签元素的状态，只会做必要的真实 DOM 更新，像虚拟节点对比算法

- 渲染之前每个 React 元素组成一个虚拟 DOM 的对象结构然后去渲染
- 更新之前形成新的虚拟 DOM 的对象结构，对比新旧的虚拟 DOM 节点，分析出不同的地方，形成一个 DOM 更新的补丁，打补丁到真实 DOM 去更新

## 组件与`Props`

**_问题：组件是什么？_**

在前端，组件是视图的片段，组件包含视图标记，事件，数据，逻辑，外部的配置

**_问题：`props`的作用是什么？_**

组件是封闭的，要接收外部数据勇敢通过`props`来实现，`props`接收传递给组件的数据

**_问题：数据是什么？_**

组件一般是内部管理数据集合(状态)，外部传入配置集合(`props`)

```
//类组件
class Test extends React.Component{
  //接收外部传入的属性配置在props里保存
  constructor(props){
    super(props);

    //内部私有属性
    this.state = {...};
  }

  //逻辑

  render(){
    //视图标记
    return (...);
  }
}

//外部绑定属性传入配置xxx
ReactDOM.render(
  <Title title="xxx"/>,
  document.getElementById('app')
);
```

```
//函数组件
//利用hooks来做
function Test(props){
  const [ title, setTitle ] = React.useState(props.title);

  //视图
  return (
    <div>
      <h1>{ title }</h1>
      <button onClick={ ()=>setTitle('This is title') }></button>
    </div>
  );
}

ReactDOM.render(
  <Title title="xxx"/>,
  document.getElementById('app')
);
```

**组件渲染的过程：**

1. React 主动调用组件
2. 将属性集合转换成对象
3. 将对象作为`props`传入组件
4. 替换`JSX`中的`props`或者`state`中的变量
5. `ReactDOM`将最终 React 元素通过一系列的操作转化成真实 DOM 进行渲染

> **注意：**
>
> 使用类组件时，如写了构造函数，应该将`props`传递给`super()`，否则无法在构造函数中获取`props`

**组件调用规范：**

- 视图标记时 HTML 标签
- 大驼峰写法作为一个 React 元素
- 组件转换 React 元素

**组合组件：**

几个子组件放入到父组件里(返回的视图中组合)

**_问题：组件`props`可以传递什么类型的数据？_**

```
<List
  //字符串
  name="rose"
  //数值
  age={19}
  //数组
  colors={['red', 'green', 'blue']}
  //返回结果的函数
  fn={() => consolo.log('this is a fn')}
  //React元素
  tag={<p>this is a p.</p>}
/>
```

**属性`props`和数据状态`state`的区别：**

1. `state`叫数据池对象，组件内容的管理数据的容器，可写读
2. `props`叫配置池对象，外部使用(调用)组件时`ReactDOM.render`第二参数传入的属性集合，组件内部只读

**_问题：为什么属性`props`对象不可写(会报错)？_**

组件内部是不应该有权限修改的组件外部的数据

**关于`props`校验：**

允许在创建组件的时候，就指定`props`的类型，格式等

```
//安装包
npm i -S props-types

//引入
import PropTypes from 'prop-types';

//添加校验规则
App.propTypes = {
  a: PropTypes.number,
  fn: PropTypes.func.isRequired,
  tag: PropTypes.element,
  filter: PropTypes.shape({
    area: PropTypes.string,
    price: PropTypes.number
  })
}
```

**约束规则：**

常见类型：`array`,`bool`,`function`,`number`,`object`,`string`

```
//常见类型
optionFunc: PropTypes.func

//必选
requiredFunc: PorpTypes.func.isRequired

//特定结构的对象
optionalObjectWithShape: PropTypes.shape({
  color: PropTypes.string,
  fontSize: PropTypes.number
})
```

**关于`props`的默认值：**

使用场景在分页组件中的每页显示条数

```
//App.defaultProps = {
  pageSize: 10
}

return(<div>{props.pageSize}</div>)
```

## `state`

`stata`是 React 的核心，是一个组件私有的状态数据池

**使用：**

```
class List extends React.Component{
  contructor(){
    super();

    this.state = { count: 0 }
  }
}
```

**总结：**

1. 如果想使用组件的时候，传入数据`props`组件配置
2. 如果是组件使用的数据，使用私有数据状态`state`

**注意事项：**

1. 必须使用`setState`方法来更改`state`
2. 多个`setState`是会合并调用
3. `props`和`state`更新数据要谨慎，避免直接依赖他们，他们俩很有可能是在异步程序中更新的
4. `setState`操作合并的原理是浅合并

**单向数据流(One-Way Data Flow)**

从父组件到子组件由上而下的传递流动的数据状态，叫单向数据流

**关于组件中的`state`：**

- `state`是组件内部特有的数据封装
- 其他组件时无法读写修改该组件的`state`
- 组件可以通过其他组件调用的时候传入属性来传递`state`的值
- `props`虽然是响应式的，但在组件内部是只读的，所以仍然无法修改其他组件的`state`
- 安全影响范围：`state`只能传递给自己的子组件，说明`state`只能影响当前组件的 UI 的内部的 UI
- 组件可以没有状态，有没有状态，组件间都不受嵌套影响，有无状态是可以切换的

## `setState`

`setState()`是异步更新数据的，可以多次调用，但只会触发一次渲染

**关于`setState()`方法：**

状态是可变的，它的作用在于

1. 修改`state`状态
2. 更新 UI

**关于`setState`方法的推荐调用语法：**

此写法也是异步更新的

```
//state：最新的state
//props：最新的props
setState((state, props) => {
  return {
    //要更改的状态
    count: state.count + 1;
  }
});
```

**关于`setState`方法的第二个参数：**

在状态更新后(页面完成重新渲染)立即执行某个操作

```
this.setState(
  (state, props) => {},
  () => { console.log('这个回调函数会在状态更新后立即执行') }
);
```

## 事件

事件处理函数绑定与事件对象

React 元素也是采用了类似于 DOM0 标准中的事件属性定义的方法

```
//JSX写法：
//onClick小驼峰
<button onClick={ this.doSth }>点击</button>
```

```
//直接创建React元素方法的写法：
React.createElement(
  'button',
  {
    onClick: { this.doSth }
  },
  'click'
);
```

**React 的事件对象：**

```
console.log(e);
//SyntheticBaseEvent{...}
//合成基础事件对象是React重新定义的
//这个对象遵守W3C事件对象的规范，不存在任何的浏览器兼容性问题
```

**_问题：为什么 React 要将事件处理直接在 React 元素上绑定？_**

React 一直认为事件处理跟视图是有程序上的直接关系的，事件处理和视图写在一起可以更加直观的表述视图与逻辑的关系，更加好维护

**关于`this`指向：**

- 默认处理函数的`this`为`undefined`
- `ES6 `class 模块默认是不对事件处理函数进行`this`的再绑定

**解决办法：**

1. 可以在构造器中`bind(this)`
2. 可以在视图中`bind(this)`
3. 利用回调加箭头函数`onClick= { ()=> this.doSth() }`

回调加箭头函数改变指向的缺点：

每次`render`函数执行时会创建新的回调，给子组件的属性进行传递函数的时候，每次都要新创建一个回调，子组件每次都会接收一个新的函数，就会有可能触发子组件的`render`渲染

**事件对象传参：**

事件对象都是在最后一个参数

```
//回调
<button onClick={ (e)=> this.doSth(1, 2, 3) }>点击</button>

//显示传入事件对象
doSth(p1, p2, p3, e){...}
```

```
//bind
<button onClick={ this.doSth.bind(this, 1, 2, 3) }>点击</button>

//隐式传入事件对象
doSth(p1, p2, p3, e){...}
```

## 列表渲染

**关于 key 值：**

- 列表中的每个子元素都必须一个唯一的 key 属性值
- key 是 React 查看元素是否改变的一个唯一标识
- key 必须在兄弟节点中唯一，确定的(兄弟结构是在同一列表中的兄弟元素)
- 不建议使用 index 作为 key 值
- 建立在列表顺序改变，元素增删的情况下
- 列表项增删或顺序改变，index 的对应项就会改变
- key 对应的项还是之前列表情况的对应元素的值
- 导致状态混乱，查找元素性能会变差

**解决做法：**

- 如果列表是静态不可操作的，可以选择 index 作为 key，也不推荐
- 有可能这个列表在以后维护的时候有可能变更为可操作的列表
- 避免使用 index
- 可以用数据的 ID
- 使用动态生成一个静态 ID 如通过包`nanoid`

**注意：**

- key 是不会作为属性传递给子组件的，必须显示传递 key
- 防止开发者在逻辑中对 key 值进行操作

## 状态组件

函数组件叫无状态组件，类组件又叫有状态组件

**_问题：状态是什么？_**

状态`state`即数据

- 函数组件没有自己的状态，只负责数据展示(静态)
- 类组件有自己的状态，负责更新 UI，页面交互

## 受控组件

在`react`有两种表单处理方式：

- 受控组件
- 非受控组件

**关于`html`和`react`中状态的冲突：**

- `html`中的表单元素是可输入的，有自己的可变状态
- `react`中可变状态一般保存在`state`中

而`react`希望所有的可变状态都由`state`去管理，所有存在冲突

**_问题：`react`如何解决以上冲突？_**

将`state`与表单中的`value`绑定在一起，由`state`值来控制表单元素的值

**_问题：什么是受控组件？_**

控制表单输入行为取值的方式的组件，跟`input`表单相关的渲染数据必须保存在自己的`state`数据里

```
<input type="text" value={this.state.txt} />
```

**受控使用步骤：**

1. 在`state`中添加一个状态，作为表单元素的`value`值(控制表单元素值的来源)
2. 给表单元素绑定`change`事件，将表单元素的值设置为`state`的值(控制表单元素值的变化)

**常见的表单元素：**

- 文本框：操作
- 富文本框：操作
- 下拉框：操作
- 复选框：操作

**表单操作：**

通过修改页面的内容从而更改`state`数据

事件绑定`e.target.value/e.target.checked`

![image-20220215221033622](http://note-img-bed.dt-code.fun/image-20220215221033622.png)

```
//事件绑定后 更改视图里输入框内容时，会看到调试栏Components里的state里面的txt 被改为输入的内容
class ExerciseComponent extends React.Component {
  constructor() {
    super();

    this.state = {
      txt: 'Please write something in inputarea',
      content: 'Please write something in textarea',
      city: 'beijing',
      isCheck: true
    };
  }

  //文本框
  handleTxtChange = (e) => {
    this.setState({ txt: e.target.value });
  };
  //富文本框
  handleContentChange = (e) => {
    this.setState({ content: e.target.value });
  };
  //下拉菜单
  handleCityChange = (e) => {
    this.setState({ city: e.target.value });
  };
  //复选框
  handleIsCheckChange = (e) => {
    this.setState({ isCheck: e.target.checked });
  };

  render() {
    return (
      <div>
        <h1>This is form demo</h1>
        <hr />
        {/* 文本框 */}
        <h4>文本框:</h4>
        <input
          type="text"
          value={this.state.txt}
          onChange={this.handleTxtChange}
        />
        <hr />
        {/* 富文本框 */}
        <h4>富文本框:</h4>
        <textarea
          value={this.state.content}
          onChange={this.handleContentChange}
        ></textarea>
        <hr />
        {/* 下拉菜单 */}
        <h4>下拉菜单：</h4>
        <select value={this.state.city} onChange={this.handleCityChange}>
          <option value="shanghai">上海</option>
          <option value="beijing">北京</option>
          <option value="shenzhen">深圳</option>
        </select>
        <hr />
        {/* 复选框 */}
        <h4>复选框：</h4>
        爱好：
        <input
          type="checkbox"
          checked={this.state.isCheck}
          onChange={this.handleIsCheckChasnge}
        />
        篮球
        <hr />
      </div>
    );
  }
}
```

以上受控组件多表单元素优化写法：

- 使用一个事件处理程序同时处理多个表单元素

```
//1.给表单元素添加name属性，名称与state相同
{/* 文本框 */}
<h4>文本框:</h4>
<input
  name="txt"
  type="text"
  value={this.state.txt}
  onChange={this.handleTxtChange}
/>

//2.根据表单元素类型获取对应值
this.handleChange = (e) => {
  const target = e.target;
  const name = target.name;
  const value = target.type === 'checkbox'
    ? target.checked
    : target.value;

  //3.根据name设置对应state
  this.setState({
    [name]: value
  });
};
```

**受控组件和非受控组件的区别：**

- 受控组件(推荐使用)：
  - 视图表单数据受控于`state`状态数据组件
  - 控制表单操作并且同步`state`
- 非受控组件：视图表单数据是只读的

<u>**案例：用户信息提交表单**</u>

受控组件方式实现一个表单带有：

- 用户
- 密码
- 文本区域
- 选择菜单
- 单选按钮/多选按钮

**源码地址：**

https://gitee.com/kevinleeeee/react-form-submit-demo

**<u>案例：评论列表</u>**

填写评论人名称和评论内容点击发布评论展示评论列表

**案例展示图：**

<img src="http://note-img-bed.dt-code.fun/image-20220216013525932.png" alt="image-20220216013525932" style="zoom:67%;" />

**功能：**

- 暂无评论(条件渲染)
- 评论列表渲染(列表渲染)
- 获取评论信息，评论人，内容(受控组件)
- 发布评论，更新评论列表(`setState()`)

**写法：**

- 类组件写法
- 受控组件方式写法

**源码地址：**

https://gitee.com/kevinleeeee/react-comment-form-list-demo

## 非受控组件

**_问题：什么是非受控组件？_**

不受控于`state`, 使用 React 中的`ref`从 `DOM `节点中获取表单数据得到组件

**_问题：如何不通过`state`数据状态去保存表单标签里面的值？_**

通过`ref`可以保存 ,在标签里定义`ref="xxxRef"`， 通过`this.refs.xxx.value`访问到保存的值

也可以创建引用挂载到视图上`React.createRef()`

**默认值：**

在 `React `渲染生命周期时，表单元素上的 `value` 将会覆盖 `DOM `节点中的值。在非受控组件中，你经常希望 `React `能赋予组件一个初始值，但是不去控制后续的更新。 在这种情况下, 你可以指定一个 `defaultValue` 属性，而不是 `value`。在一个组件已经挂载之后去更新 `defaultValue` 属性的值，不会造成 `DOM `上值的任何更新

`form field`默认值在组件挂载完毕后进行更新，不会导致 `DOM `的任何更新

- `select`标签通过`defaultValue`属性拿到默认值
- `radio`单选框/`checkbox`复选框标签通过`defaultCheck`属性拿到默认值

**使用步骤：**

```
//1.调用React.createRef()方法创建一个ref对象
constructor(){
  super();
  this.txtRef = React.createRef();
}

//2.将创建好的ref对象添加到文本框中
<input type="text" ref={this.txtRef} />

//3.通过ref对象获取文本框的值
console.log(this.txtRef.current.value);
```

**文档：受控组件和非受控组件的使用**

地址：https://zh-hans.reactjs.org/docs/uncontrolled-components.html

**_问题：如何选择？_**

非受控`input`表单很像传统 `HTML `表单`input`，它会记录用户输入内容，用户可以通过`ref`属性来获取相应的值，只要你需要的时候可以直接从`input`里拉取想要的值，当点击按钮提交时可以拿到值

```
class Form extends Component{
  handleSubmitClick = () => {
    const name = this._name.value;
  }

  render(){
    return (
      <div>
        <input ref={ input => this._name = input } />
        <button onClick={ this.handleSubmitClick }>Sign up</button>
      /div>
    );
  }
}
```

## 组件通信

**父传子：**

提供要传递的`state`数据，在子组件绑定属性即可

**子传父：**

利用回调函数，父组件提供回调，子组件调用，将要传递的数据作为回调函数的参数

1. 父组件提供一个回调函数(用于接收数据)
2. 将该函数作为属性的值，传递给子组件
3. 子组件通过`props`调用回调函数

```
class Father extends React.Component{
  //1.定义父组件的回调函数方法
  getChildMsg = (msg) => {
    console.log('接收到子组件的数据', msg);
  }

  render(){
    return(
      //2.将整个回调函数传递给子组件
      <Child getChildMsg={this.getChildMsg} />
    );
  }
}

class Son extends React.Component{
  state = { childMsg: '子组件私有数据' }

  handleClick = () => {
    //通过`props`调用回调函数
    return this.props.getChildMsg(this.state.childMsg);
  }

  render(){
    return(
      //3.执行自己的方法
      <button onClick="this.handleClick">点击</button>
    );
  }
}
```

**兄弟传：**

将共享状态数据提升到最近的公共父组件中，由公共父组件管理这个状态(状态提升思想)

- 公共父组件负责：
  1. 提供共享状态
  2. 提供操作共享状态的方法
- 要通信的子组件只需要通过`props`接收状态或操作状态的方法

```
class Counter extends React.Componet{
  //提供共享状态
  state = { count: 0 }

  //提供修改状态的方法
  onIncrement = () => { ... }

  render(){
    return (
      <div>
        <Child1 count=(this.state.count) />
        <Child2  onIncrememnt={this.onIncrement} />
      </div>
    );
  }
}

const Child1 = props => { return <h1>计算器:{props.count}}</h1> };
const Child2 = props => { return <button onClick = () => props.onIncrememnt()>+1</button> };
```

## 状态提升

父组组件数据关系与状态提升

无父子关系的两个组件同享一个数据并且同步数据变化

**单向数据流**

数据的流动都是从父到子通过`props`向下传递

关键点：`props`是只读属性，不能去操作，它对应的数据操作交给父组件完成，数据由父组件来管理

状态提升：本应该是子组件的数据的状态交给父组件来保存操作，然后通过`props`传递给子组件

**_问题：如何解决两个组件需要共享同一状态并且状态同步的情况？_**

```
//类组件调用(实例化)的时候，组件内部的状态是独立且唯一的
//组件一,
class Info extentds React.Component { //业务逻辑1 }

//组件二
class UserNameInput extentds React.Component {
  //业务逻辑2

  //使用了组件1
  render(){
    return (
      <Info />
    );
  }
}

//父组件
class App extends React.Component {
  //使用了两次组件2
  render(){
    return (
      //向各自的子组件传值
      //这样传值结果是：两个组件的state状态数据是不同步的，相互独立的
      <UserNameInput inputNum={ 1 }/>
      <UserNameInput inputNum={ 1 }/>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
```

解决办法：用函数写法可以实现不同步

```
//组件嵌套与调用，和类组件还是函数组件没有关系
function Info(props){ ... }

//类组件与函数组件相互是可以调用的
```

将子组件定义的状态提升到父组件去传值使用，实现两个组件同一状态同步

## 组合继承

**包含组合**

关于`children`属性：

表示组件标签的子节点，当组件标签有子节点时，`props`就会有`props.children`属性

```
<App>我是子节点</App>
```

```
//1.如果Container内部有内容, React会在props内部增加children属性
//2.如果Container内部有非元素内容, children: 非元素内容
//3.如果Container内部有单个元素内容, children:React元素对象
//4.如果Container内部有多个元素内容, children: [...(React元素对象)]
class Container extends React.Component {
  render(){
    console.log(this.props);
  }

  return (
    //包含组合
    <div className="container">
      { this.props.children }
    </div>
  );
}

class App extends React.Component {
  render(){
    return (
     //<Container>123</Container>
     <Container>
       <h1>Title</h1>
     </Container>
   );
  }
}
```

```
class Container extends React.Component {
  render(){
    console.log(this.props);
  }

  return (
    <div className="container">
      <div className="header">
        { this.props.header }
      </div>
        <div className="sidebar">
        { this.props.sidebar }
      </div>
        <div className="main">
        { this.props.main }
      </div>
    </div>
  );
}

class Header extends React.Conponent {...}
class SideBar extends React.Conponent {...}
class Main extends React.Conponent {...}

class App extends React.Component {
  render(){
    return (
     <Container>
       header = { <Header/> }
       sidebar = { <SideBar/> }
       main = { <Main/> }
     </Container>
   );
  }
}
```

**_问题：为什么 JSX 还可以通过`props`传递视图 React 元素？_**

JSX 本质上都会转成 React 元素(Object 对象)，视图通过`props`传递的机制比较像 vue 的插槽，但是 React 没有插槽的概念的定义，React 本身就允许`props`传递任何类型的数据到子组件

**多层组合**

```
//给Header组件底下的Select组件组合属性和方法
//仅仅传给Header组件就能实现多层嵌套组件传值
render(){
  return (
    <div>
      <Header
        text={this.state.headerTitle}
        citySelector={
          //组合
          <Selector
            cityData={this.state.cityData}
            changeCity={this.changeCity.bind(this)}
          ></Selector>
        }
      ></Header>
    </div>
  );
}
```

**_问题：组件如何做继承关系？_**

React 目前还没有发现有需要组件继承的需求，因为通过`children`或者传递视图 React 元素的方式完全可以解决组件组合的问题，`props`可以传递任何类型的数据，所以组合的方式完全可以替代继承方案

**_问题：如何处理逻辑部分需要继承性或者公用性？_**

这个需要开发者自己去写逻辑抽离的模块，函数，类，单独进行模块导入使用

## 组件更新机制

组件通过`setState()`方法执行更新渲染

父组件重新渲染时，也会重新渲染子组件，但只会渲染当前组件子树(当前组件及其所有子组件)

<img src="http://note-img-bed.dt-code.fun/image-20220216221041642.png" alt="image-20220216221041642" style="zoom:67%;" />

## 性能优化

**_问题：组件性能如何优化？_**

- 减轻`state`，只存储跟组件渲染相关的数据(如：`count`/列表数据/`loading`等)
- 避免不必要的重新渲染，如避免不必要的子组件渲染(解决：`shouldComponentUpdate()`钩子函数，通过它返回值决定是否`true`,`false`重新渲染)

> **注意：**不用做渲染的数据不要放在`state`中，比如定时器`id`等，可以放在构造器定义的`this`中

```
//关于shouldComponentUpdate
//触发时机：更新阶段的钩子函数，组件重新渲染render前执行
class AComponent extends Component{
  //newxProps -> 最新的props
  //nextState -> 最新状态
  //this.state -> 当前状态(更新前)
  shouldComponentUpdate(nextProps, nextState){
    //根据条件，决定是否重新渲染
    if(xxx){
      return true;
    }else{
      return false;
    }

    //写法1：通过nextState判断
    //nextState.number !== this.state.number -> true
    return nextState.number !== this.state.number;
  }
}

//写法2：通过nextProps判断
//给子组件传值
<Child number={this.state.number}>
//在子组件中的shouldComponentUpdate进行判断
```

## CSS Module

CSS 模块化：将 css 当成模块传递到组件内部用 JS 逻辑去调用样式

如何调用？

```
//index.module.css -> vite

//引入模块
import styles from './index.module.css';

//在index.module.css文件中定义样式
.container{ ...; }

//组件使用
<div className={ style.container }>
```

## 代码分割

做生产的时候，需要做到代码分割

打包的时候会整体打包成一个 bundle 的一个 JS 文件，会存在一些代码或模块加载的时候不需要，增加 bundle 体积的问题，将代码或模块进行分割出来，形成单独的文件块 chunk

**_问题：代码分割有什么好处？_**

- 模块可以懒加载
- 减少应用的体积
- 减少加载时的体积

**关于导入模块`import`:**

`import`是一个 ES6 的模块化关键字，不是一个函数

它分为静态的导入(static import)`import xxx from 'xxx'`和动态的导入(dynamic import)`import('xxx')`

`import`是可以被调用的，但是它和普通的函数是不一样的，`import`不是一个对象，它是一个关键字`import xxx/ import(xxx)`类似`typeof(xxx)/ typeof xxx`

**区别：**

- `static import`是模块的静态导入，特点是导入并加载时，导入的模块会立即被编译，然后不是按需编译的
- `dynamic import`模块的动态导入，根据条件或事件触发按需的模块导入

**_问题：为什么不能滥用动态加载？_**

因为静态导入是有利于初始化依赖的，静态的程序分析或`tree shaking`动态导入是难以工作的

**应用场景：**

- 动态：
  - 模块太大了，使用可能性很低的模块，模块不需要马上加载的
  - 模块的导入占用大量的系统内存
  - 模块需要异步获取
  - 导入模块时需要动态的构建路径(说明符)
  - 动态说明符：`import('./' + a + b + '.js')'`
  - 静态说明符：`static import`只支持静态说明符
  - 模块中的代码需要程序触发了某些条件才运行的

使用`import`的要求：

- 如果使用`create react app`的方式创建工程是直接可以使用动态导入`import()`，
- 如果手动做`webpack`的配置时，查看`webpack`代码分割的指南
- 如果使用`babel`解析`import()`时，安装依赖`@babel/plugin-syntax-dynamic-import`

## 懒加载

代码分割的两个方法有`lazy`方法`Suspense`是 React 内置的组件，挂载到 React

**_问题：`lazy`是什么？_**

是 React 提供给开发者的懒(动态)加载组件的方法`React.lazy(参数：函数必须接收一个支持Promise的动态导入组件)`，好处是减少打包体积，对初次渲染不适用的组件延迟加载，它依赖一个内置组件`Suspense`，给`lazy`加上 loading 提示器组件的一个容器组件

```
//loading.jsx
class Loading extends React.Component {
  render(){
    return <div>Loading...</div>
  }
}

export default Loading;
```

```
//main.jsx
class Main extends React.Component {
  render(){
    return <div>Main</div>
  }
}

export default Main;
```

```
import Loading from './loading.jsx';

//lazy接收一个动态导入组件的函数
//该函数返回一个Promise
//Promise会resolve一个默认导出的React组件如export default xxx;
//Suspense目前只和lazy配合实现组件等待加载指示器的功能
//服务端渲染不支持,改用loadable Components
const MainComponent = React.lazy(() => import('./main.jsx'));

class App extends React.Component {
  render(){
    return (
      <React.Supense fallback={ <Loading /> }>
        <div>
          <MainComponent />
        </div>
      </React.Supense>
    );
  }
}
```

**路由懒加载**

```
//入口文件
//安装
npm i react-router -S
npm i react-router-dom -S

//导入浏览器路由
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
```

```
//App.js
import { Switch,Route } from 'react-router';

render(){
  return (
    <Suspense fallback = { <Loading /> }>
      <div className="app">
        <Switch>
          <Route path="/page1" component={ lazy(() => import('./views/Page1')) } />
          <Route path="/page2" component={ lazy(() => import('./views/Page2')) } />
          <Route path="/page2" component={ lazy(() => import('./views/Page3')) } />
        </Switch>
      </div>
    </Suspense>
  );
}
```

## 错误边界

React 在 16 版本时新增的，防止某个组件的 UI 渲染错误导致整个应用崩溃，子组件发生 JS 错误，有备用的渲染 UI，错误边界其实是一个组件，只能用 class 类组件来写

```
class ErrorBoundary extends React.Component{
  state = {
    hasError: false
  }

  //是一个生命周期函数
  //参数：子组件抛出的错误
  //返回值：新的state
  //获取捕获错误状态，修改错误状态
  //作用：渲染备用的UI
  //渲染阶段调用，不允许出现操作DOM，异步操作等副作用
  static getDerivedStateFromError(error){
    //返回一个新的状态
    return { hasError: true }
  }

  //是组件原型上的方法
  //作用：边界组件错误捕获异常并进行后续处理
  //在组件抛出错误后调用
  //参数：
  //  error:抛出的错误
  //  info:组件引发错误相关的信息 组件栈
  //componentDidCatch(error, info){
    //副作用
  //}

  render(){
    if(this.state.hasError){
      return (
        //返回新的备用的UI方案
        <h1>This is something wrong.</h1>
      );
    }else{
      //显示ErrorBoundary组件里包含的state状态
      return this.props.children;
    }
  }
}
```

**有一些无法捕获的场景如：**

- 事件处理函数
- 异步代码`setTimeout`,`ajax`
- 服务端渲染
- 错误边界组件内部有错误

**错误边界组件捕获错误的时机有哪些：**

- 渲染时
- 生命周期函数中
- 组件树的构造函数中

如果多个嵌套错误边界组件，那么从最里层错误出发向上冒泡触发捕获

## 上下文

`context`时一个容器，里面可以装载很多数据，这些数据可以给程序的多个地方传递，它是一个程序在执行的时候可以访问的容器

**_问题：`context`有什么作用？_**

给整个组件树共享全局的数据

**`context`最适合的场景是：**

- 杂乱无章的组件都需要同一些数据的时候
- 不合适在单纯的为了不层层传递属性
- 它会弱化及污染组件的纯度导致组件复用性降低

```
//子组件
class Select extends React.Component {
  //将上下文的类型指定为CityContext
  //this.context -> 访问到cityInfo
  //会向上找最近的CityContext的Provide,并取值为cityInfo
  static contextType = CityContext;

  render() {
    return (
      <select
        value={ this.context.name }
      ></select>
    );
  }
}
```

```
//管理标题主题的上下文
//创建上下文 默认为黑色标题
const ThemeContext = React.createContext('black');

//ThemeContext带有Provider供应方和Consumer使用方
//父组件使用上下文的提供Provide
class App extends React.Component {
  state = {
    theme: 'black'
  };

  render() {
    return (
      //给子组件提供value
      <ThemeContext.Provider value={this.state.theme}>
        <Main></Main>
      </ThemeContext.Provider>
    );
  }
}

//子组件使用
class Header extends React.Component {
  render() {
    return (
      <ThemeContext.Consumer>
        //拿到父组件传递的value
        {(theme) => {
          console.log(theme);
          //black
        }}
      </ThemeContext.Consumer>
    );
  }
}
```

**案例：移动端底部导航栏切换**

**技术：**vite + context + react

**实现：**

- 点击导航栏按钮切换显示页面
- 点击按钮显示不同标题颜色背景(一键切换皮肤)
- 点击按钮显示不同底部导航栏子项颜色(一键切换皮肤)

![image-20220130235611955](http://note-img-bed.dt-code.fun/image-20220130235611955.png)

```
//项目目录:
├─index.html
├─package.json
├─src
|  ├─App.jsx - App类/父组件管理state里的theme/上下文包裹Main组件
|  ├─context.js - 管理标题主题的上下文
|  ├─index.jsx - 入口文件/渲染APP组件到页面
|  ├─Main.jsx - 页面组件/管理标题主体底部导航栏/私有导航栏数据
|  ├─components
|  |     ├─Header - 标题组件
|  |     |   ├─index.jsx
|  |     |   └index.scss
|  |     ├─BottomNav - 底部导航栏组件
|  |     |     ├─index.jsx
|  |     |     ├─index.scss
|  |     |     └Item.jsx - 子项/遍历
```

源码地址：https://gitee.com/kevinleeeee/react-context-bottomnav-demo

## `Context API`

设置上下文组件名称方便于调试

**_问题：`Context`的作用是什么？_**

当你不想再组件树中通过逐层传递`props`或者`state`方式来传递数据时，可以使用`Context`来实现跨层级的组件数据传递

**_问题：如何使用`Context`?_**

需要用到两种组件:

- 生产者`Provider`，通常时一个父节点
- 消费者`Consumer`，通常是一个或多个子节点
- 还需要声明静态属性`ContextType`提供给子组件的`Context`对象的属性

```
//方式一：常规定义
import PropTypes from 'prop-types';

class App extends React.Component {
  //定义的是类型而不是值
  static childContextTypes = {
    color: PropTypes.string,
    num: PropTypes.number
  }

  //必须使用这个方法来创建一个对象
  getChildContext() {
    return {
      color: 'red',
      num: 1
    }
  }

  render() {
    return (
      <div>
        <h1>React Context</h1>
     </div>
    );
  }
}

class Main extends React.Component{
  //子组件必须声明类型才能拿到父组件传递过来的值
  static contextType = {
    color: PropTypes.string
  }

  render() {
    return (
      <div>
        <p>Title的页面---{ this.context.color}</p>
      </div>
    )
  }
}
```

```
//方式二: createContext API
const AContext = React.createContext('默认值');
AContext.displayName = 'MyAContext';

//使用
class App extends React.Component{
  render(){
    return (
      <AContext.Provider>
        <div>123</div>
      </AContext.Provider>
    );
  }
}

//在浏览器React dev tool里显示
MyAContent.Provider
//没有使用时默认显示
Context.Provider
```

**关于`React.createContext`：**

- 创建一个指定的`Context`对象
- 组件会找离自己最近的`Provider`获取其`value`(在`state`里定义的)

```
class Test extends React.Component{
  render(){
    return (
      //注意：
      //1.没有写value属性会显示undefined
      //2.一般会写value为state里的数据
      //3.当value写undefined/null会显示undefined/null
      //4.当没有嵌套<AContext.Consumer>标签会找默认值
      <AContext.Consumer value={ this.state.a }>
        {
          (value) => (
            <div>{ value }</div>
          )
        }
      </AContext.Consumer>
    );
  }
}
```

**_问题：什么时候默认值生效？_**

如果没有匹配到`Provider`就使用默认值( 在`React.createContext('默认值')`中定义的)，其他情况均不使用默认参数

**关于`Context.Provider`:**

- 它是通过`React.createContext`创建的上下文对象里的一个组件
- `Provider`组件可以插入其他组件的目的是可以订阅这个`Context`
- 通过`Provider`的`value`属性来将数据传递给其他`Consumer`组件

> 注意：当`value`发生变化时，插入`Provider`的组件会重新渲染

**关于`Context.Consumer`:**

- 它使用的是`Provider`提供的`value`
- 最大的作用是订阅`context`变更
- `Consumer`内部使用函数作为子元素(专题：`function as a child`)
- 有一种组件的内部是使用函数作为子元素
- 特点是函数接收`context`最近的`Provider`提供的`value`
- 如果没有写`Provider`会找默认值

**关于`contextType`:**

- 是`class`类内部的一个静态属性(相当于 ES3 中给构造函数新增属性`Selector.contextType`)
- 它必须指向一个由`React.createContext`执行后返回的`Context`对象
- 给当前环境下的`context`重新指定引用
- 指定后父组件上下文会有数据，不指定会显示空对象(`context: {}`)
- 在生命周期函数和`render`函数中都可以访问

```
class Test extends React.Component{
  //在组件内部里内置声明一个conetextType
  //目的：可以获取一个上下文state里定义的数据
  static contextType = React.createContext('默认值');

  render(){
    //可以获取一个组件上下文state里定义的数据
    console.log(this.context);
    //{name: 'hangzhou', text:'杭州'}

    return ( ... );
  }
}
```

**_问题：在组件数据共享下，`Provide/Consumer`和`contextType`上如何选择？_**

- 推荐使用`Provide/Consumer`，因为更具有语义化
- 在代码阅读上`contextType`较为难以理解

**动态`context`嵌套**

**案例：`context`跨级共享应用**

三个显示区域有按钮带有各自的样式，可以选择不同的样式同时更改按钮颜色，深入了解跨级应用

**案例展示图：**

![image-20220201152424809](http://note-img-bed.dt-code.fun/image-20220201152424809.png)

**实现：**

- 改变按钮颜色

- 登录与未登录显示

```
//项目目录:
├─index.html
├─package.json
├─Readme.md
├─src
|  ├─App.jsx - 定义应用需要的属性和方法/嵌套的方式提供共享数据
|  ├─index.jsx
|  ├─views
|  |   └Home.jsx - 管理Home页面的布局
|  ├─context
|  |    └index.js - 实现全局文件数据共享/初始化默认值
|  ├─config
|  |   └index.js - 配置按钮样式
|  ├─components
|  |     ├─Main - 使用Consumer使用提供的数据
|  |     |  └index.jsx
|  |     ├─Header - 使用Consumer使用提供的数据
|  |     |   └index.jsx
|  |     ├─Footer - 使用Consumer使用提供的数据
|  |     |   └index.jsx
|  |     ├─Button - 使用Consumer使用提供的数据
|  |     |   └index.jsx
```

**总结：**

父组件统一管理状态，嵌套的方式把不同的数据传入共享给相应的子组件，子组件将这些需要的数据渲染即可

源码地址：https://gitee.com/kevinleeeee/react-context-button-demo

## Fragment

它是在 React 下的一个组件，文档碎片不会占用真实的节点，原则上 React 每个组件都需要根节点

**关于`React.Fragment`：**

这个组件创建了一个文档碎片

**简写：**

使用短语法`<>...</>`声明一个`React.Fragment`碎片

> 注意：短语法不支持`key`

```
//现阶段，Fragment除了key属性，不支持其他任何属性
<React.Fragment key={ id }>
  <dt>{id}:{name}</dt>
  <dd>{desc}</dd>
</React.Fragment>
```

**应用场景：**

一般在表格上使用解决没有根节点的问题

```
class App extends React.Component{
  state = {
    headers: [
      'Name',
      'ID',
      'Age'
    ]
  }

  render(){
    return(
      <table border="1">
        //<caption> 标签定义表格的标题
        <caption>Private Infomation</caption>
        <thead>
          <tr>
            <TableHeaders headers={this.state.headers}/>
          </tr>
        </thead>
        <tbody>
          <tr></tr>
        </tbody>
      </table>
    );
  }
}
```

```
//使用fragment碎片避免每次新增th时都会套用div，达到不用div也可以包裹里面的元素内容
//同时也会报错: th不能作为div的子元素
class TableHeaders extends React.Component{
  render(){
    return (
      <React.Fragment>
        {
          this.props.headers.map((item, index) => (
            <th key={ index }>{ item }</th>
          ))
        }
      </React.Fragment>
    );
  }
}
```

## 生命周期

**_问题：为什么需要知道组件的生命周期？_**

有助于理解组件的运行方式，完成更复杂的组件功能，分析组件错误等原因，组件在被创建到挂载到页面中运行，再到组件不用时卸载的过程

**_问题：什么是钩子函数？_**

生命周期的每个阶段总是伴随着一些方法调用，这些方法就是生命周期的钩子函数

**_问题：钩子函数有什么作用？_**

它为开发者在不同阶段操作组件提供了时机

> **注意：**只有类组件才有生命周期

**生命周期的三个阶段：**

1. 创建时(挂载阶段)
   1. 执行时机：组件创建时(页面加载时)
   2. 执行顺序：
      1. `constructor()`
      2. `render()`
      3. `componentDidMount`
2. 更新时(更新阶段)
   1. 执行时机：
      1. `setState()`
      2. `forceUpdate()`
      3. 组件接收到新的`props`
   2. 以上三种任意一种变化，组件就会重新渲染
   3. 执行顺序：
      1. `render()`
      2. `componentDidUpdate()`
3. 卸载时(卸载阶段)
   1. 执行时机：组件从页面消失
      1. `componentWillUnmount`

> **注意：**不要在`render`中调用`setState()`方法

| 钩子函数            | 触发时机                  | 作用                                         |
| ------------------- | ------------------------- | -------------------------------------------- |
| `constructor`       | 创建组件时，最先执行      | 1. 初始化`state` 2. 为事件处理程序绑定`this` |
| `render`            | 每次组件渲染都会触发      | 渲染 UI                                      |
| `componentDidMount` | 组件挂载(完成 DOM 渲染)后 | 1. 发送网络请求 2.DOM 操作                   |

**三种导致组件更新的方式：**

- 子组件接收新的`props`属性渲染`render`
- 执行`setState()`方法渲染`render`
- 执行`forceUpdate()`方法渲染`render`

> **注意：**
>
> 在`componentDidUpdate`生命周期里的`if`条件执行`setState()`方法，否则导致递归更新，栈溢出的报错

| 钩子函数             | 触发时机                  | 作用                                |
| -------------------- | ------------------------- | ----------------------------------- |
| `render`             | 每次组件渲染都会触发      | 渲染 UI(与挂载阶段是同一个`render`) |
| `componentDidUpdate` | 组件更新后(完成 DOM 渲染) | 1. 发送网络请求 2. DOM 操作         |

```
//在componentDidUpdate里执行setState()的正确写法：
//做法：比较更新前后的props是否相同，来决定是否重新渲染组件
componentDidUpdate(prevProps){
  if(prevProps.count !== this.props.count){
    this.setState();
  }
}
```

| 钩子函数               | 触发时机             | 作用                       |
| ---------------------- | -------------------- | -------------------------- |
| `componentWillUnmount` | 组件卸载(从页面消失) | 执行清理工作(清除定时器等) |

## Portals

它提供一种将子节点渲染到存在于父节点以外`DOM`节点的方案

```
ReactDOM.createPortal(React子元素, 真实DOM);
```

**_问题：`react`和`vue`插槽的区别？_**

类似

**_问题：`react`事件冒泡的方式是什么？_**

嵌套组件向上传递

**应用场景：**

需要子组件能够在视觉上跳出其容器

- 对话框
- 模态框
- 悬浮卡
- 提示框

**_问题：`react portals`的用法是什么？_**

**使用：**

在渲染返回的父级容器里放入定义的子组件，子组件就会按照事件冒泡的方式逐级向上传递

```
//1.定义不相干的兄弟节点
<div id="modal-root"></div>

//2.获取该节点
const modalRoot = document.getElementById('modal-root');

//3.定义Modal组件
class Modal extends Component{
  //创建新节点
  el = document.createElment('div');

  //挂载时插入到modalRoot节点
  componentDidMount(){
    modalRoot.appendChild(this.el);
  }

  //卸载时移除节点
  componentWillUnmount(){
    modalRoot.removeChild(this.el);
  }

  //渲染时返回新增的Portal
  render(){
    return ReactDOM.createPortal(
      this.props.children,
      this.el
    );
  }
}

//4.Modal组件包裹子组件Sub
<Modal><Sub /></Modal>
```

## 异步加载

利用懒加载的方式实现异步加载

```
import React, { lazy, Suspense } from 'react';

const Sub = lazy(() => import('./Sub'));

//Suspense方式包装一下，否则页面无法正常加载组件
//fallback指定一个UI
<Suspense fallback={<div>loading</div>}>
  <Sub />
</Suspense>
```

## 路由

**路由介绍**

现代前端应用大多数都是`SPA`(单页应用程序)，只有一个`HTML`页面应用程序，因为它的用户体验更好，对服务器压力更小

为了有效使用单个页面来管理多页面功能，前端路由应运而生

- 路由功能：从一个视图页面导航到另一个视图页面
- 映射规则：在`React`中，是`URL`路径与组件的对应关系

**基本使用**

```
//1.安装
npm i react-router-dom -S

//2.引入路由三个核心组件
//BrowserRouter or HashRouter
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

//3.使用Router组件包裹整个应用
<Router>
  <div className="app">...</div>
</Router>

//4.使用Link组件作为导航菜单(路由入口)
<Link to="/first">页面1</Link>

//5.使用Route组件配置路由规则和要展示的组件(路由出口)
<Route path="/first" component={First}></Route>
```

```
//旧版本写法1：
<Router>
  <Switch>
    //必须如下顺序
    <Route component={LoginPage} path="/login"></Route>
    <Route component={IndexPage} path="/"></Route>
  </Swithch>
</Router>
```

```
//旧版本写法2(嵌套子路由组件)：
<Router>
  <h1>Hello React</h1>
  <hr />
  <Switch>
    <Route component={LoginPage} path="/login"></Route>
    <Route
      path="/"
      render={(props) => (
        <IndexPage>
          <Switch>
            <Route component={ListPage} path="/sub/list"></Route>
            <Route component={DetailPage} path="/sub/detail"></Route>
          </Switch>
        </IndexPage>
      )}
    ></Route>
  </Switch>
</Router>

//IndexPage组件需写入Link组件
export default class IndexPage extends Component {
  render() {
    const { children } = this.props;
    return (
      <div>
        <ul>
          <li>
            <Link to="/sub/list">列表页</Link>
          </li>
          <li>
            <Link to="/sub/detail">详情页</Link>
          </li>
        </ul>
        {children}
      </div>
    );
  }
}
```

**常用组件说明：**

- `Router`组件：包裹整个应用，一个`React`应用只需要使用一次
- 两个常用`Router`：`HashRouter`和`BrowserRouter`
- `HashRouter`：使用`URL`的哈希值实现(`http://localhost:3000/#/first`)
- `BrowserRouter`(推荐)：使用 H5 的`history API`实现
- `Link`组件：用于指定导航链接(`<a></a>`标签)
- `Route`组件：展示路由展示组件相关信息
- `Switch`组件：旧版本，对路由进行分支

**路由执行过程：**

1. 点击`Link`组件(`<a></a>`标签)，修改浏览器地址栏中的`url`
2. `React`路由监听到地址栏`url`变化
3. `React`路由内部遍历所有的`Route`组件，使用路由规则`path`与`pathname`进行匹配
4. 当路由规则`path`能够匹配地址栏中的`pathname`时，就展示该`Route`组件的内容

**编程式导航**

通过`JavaScript`代码实现路由跳转

- `history`是`React`路由提供的，用于获取浏览器历史记录的相关信息
- `push(path)`：跳转到某个页面，参数`path`表示要跳转的路径
- `go(n)`：前进或后退到某个页面，参数`n`表示前进或后退页面数量

```
class Login extends Component{
  handleLogin = () => {
    this.props.history.push('/home');
  }
}
```

**默认路由**

表示进入页面时就会匹配的路由

- 默认路由`path`：`/`

```
<Route path="/" component={Home}></Route>
```

**匹配模式**

默认情况下，`React`路由是模糊匹配模式

- 模糊匹配规则：只要`pathname`以`path`开头就会匹配成功

**精确匹配**

避免默认路由展示，给`Route`组件添加`exact`属性，就变为精确匹配模式

```
<Route exact path="/" component={Home}></Route>
```

**路由重定向**

```
{/* 默认路由配置 跳转到 /home 实现重定向到首页 / */}
<Route path="/" exact render={() => <Redirect to="/home" />}></Route>
```

**嵌套路由**

**_问题：什么是嵌套路由？_**

路由内部又包含路由

```
//使用步骤：
//1.创建子路由组件
//2.在父组件Home中添加一个Route作为子路由(嵌套的路由)的出口
//3.设置嵌套路由的path,格式以父路由path开头(父组件展示,子组件才会展示)
const Home = () => (
  <div>
    <Route path="/home/news" component={News} />
  </div>
);
```

**`BrowserRouter`实现原理：**

```
//变更当前url
window.location = 'foo';

//跳转到localhost:3000/foo 地址
//注意：window.location会刷新页面
```

**_问题：如何跳转地址避免页面重载？_**

利用`HTML5`的`history`对象可以取代无刷新，

**关于`history.pushState(state, title, url)`：**

- `state`：`javascript`对象，描述当前`url`状态
- `title`：暂无使用
- `url`：指定跳转的地址

```
history.pushState({name: 'newPath'}, null, '/foo');

//跳转到localhost:3000/foo 地址 且没有刷新页面
```

**<u>案例：todolist</u>**

使用`react-router v6`实现一个路由页面的 todolist

**实现：**

- 基本路由跳转页面
- 路由嵌套共享 UI 页面(`Outlet`)
- 无路由匹配
- `url`传参
- 索引路由
  - 父路由的默认路由
  - 子路由的路径都不匹配时
- 搜索参数
- 输入框输入内容
- 自定义`NavLink`
- 自定义导航

**案例展示图：**

![image-20220225021512436](http://note-img-bed.dt-code.fun/image-20220225021512436.png)

**_问题：如何获取`url`参数？_**

通过`react-router`里面的`useParams()`方法获取

```
import { useParams } from 'react-router-dom';
let params = useParams();
// console.log(params);
//输入地址栏http://localhost:3000/invoices/2333
//{ invoiceId: '2333' }
```

**_问题：如何获取路由参数？_**

通过搜索参数函数`useSearchParams()`

```
import { useParams, useSearchParams } from 'react-router-dom';

//返回一个设置的数组里，数组保存着一个对象，和对象的方法
// let [searchParams, setSearchParams] = useSearchParams();
//http://localhost:3000/invoice/1995?filter=3&name=zhangsan&age=18
// console.log(searchParams);
/**
* URLSearchParams{
*   append: fn,
*   delete: fn,
*   ...
* }
*/
```

**_问题：在`react-router-dom`中如何获取`history`对象？_**

通过`useLocation()`方法

```
import { useLocation } from 'react-router-dom';

//获取history对象
let location = useLocation();
console.log(location);
//{pathname: '/invoices/2001', search: '', hash: '', state: null, key: '33shav6y'}
```

**_问题：如何实现自定义导航，即路由跳转？_**

通过`useNavigate()`方法

```
import { useNavigate } from 'react-router-dom';

//返回一个方法
let navigate = useNavigate();

//实现跳转
navigate('/invoices');
```

**源码地址：** https://gitee.com/kevinleeeee/react-router-v6-todolist-demo

## 案例

<u>**案例：todolist**</u>

**实现：**

- 增删某一项
- 刷新页面读取`localStorage`数据(数据持久化)

**写法：**

- 类组件写法
- hook 写法

**源码地址：**

https://gitee.com/kevinleeeee/react-todolist-class-hook-demo

**<u>案例：`JS++`后台管理系统</u>**

这是腾讯课堂数据的后台管理系统

**接口参照项目：** https://gitee.com/kevinleeeee/crawler-puppeteer-txcourse-demo

**技术：**

- `react`
- `react-router`
- `react-router-dom`
- `axios`的`withCredentials`属性携带`cookies`

**案例展示图：**

![image-20220309053437736](http://note-img-bed.dt-code.fun/image-20220309053437736.png)

![image-20220309052852103](http://note-img-bed.dt-code.fun/image-20220309052852103.png)

![image-20220309053052342](http://note-img-bed.dt-code.fun/image-20220309053052342.png)

![image-20220309053215167](http://note-img-bed.dt-code.fun/image-20220309053215167.png)

![image-20220309053311672](http://note-img-bed.dt-code.fun/image-20220309053311672.png)

**实现功能：**

- 登录页面(账户登录)
- 后台首页侧边路由导航栏
- 点击左侧边栏实现地址跳转显示右边内容卡片区域
- 课堂管理内容(表格)展示
  - 课堂分类操作
  - 上下架操作
- 推荐课程内容(表格)展示
  - 上下架操作
- 轮播图管理内容(表格)展示
  - 上下架操作
- 课堂集合管理内容(表格)展示
  - 上下架操作
- 老师管理内容(表格)展示
  - 明星老师操作
  - 上下线操作
- 学生管理内容(表格)展示
  - 上下线操作
- 数据爬取内容(表格)展示
  - 各种数据爬取操作

**项目启动：**

1. 启动后端：
   1. `npm run dev`
   2. 开启服务`phpStudy`里的`MySQL`和`Apache`
   3. 访问数据库网页(删除所有表)
   4. 同步所有数据表(重置新增表)
   5. 访问七牛空间(清空图片存储)
2. 启动前端后台项目(重新爬取数据)
   1. `npm start`
3. 启动前端前台项目

**路由组件结构：**

- `IndexPage`首页页面`<Route>`
  - `Header`标题组件
    - `Logo`组件
    - `Title`组件
    - `Logout`组件
  - `SideBar`侧边导航组件
    - `NavItem`组件
  - `Container`组件
    - `Board`组件
      - `CollectionPage`组件`<Route>`
        - `TableBody`组件(非公共)
      - `CoursePage`组件`<Route>`
      - `CrawlerPage`组件`<Route>`
      - `RecomCoursePage`组件`<Route>`
        - `TableBody`组件(非公共)
      - `SliderPage`组件`<Route>`
        - `TableBody`组件(非公共)
      - `StudentPage`组件`<Route>`
        - `TableBody`组件(非公共)
      - `TeacherPage`组件`<Route>`
        - `TableBody`组件(非公共)
      - `ErrorPage`组件`<Route>`
- `LoginPage`登录页面`<Route>`
  - `Login`登录组件
    - `Logo`组件
    - `Form`表单组件
- `common`公共组件：
  - `ListItem`组件
  - `TableHead`组件
  - `TableBody`组件

**请求接口：**

- `base_url: http://localhost:3000`
- `get`请求：
  - 根路径：`/`
  - 创建管理员：`/admin/create_admin`
  - 登录验证状态接口(默认组件加载完时发送请求, 只携带`cookies`信息)：`/admin/login_check`
  - 登出接口：`/admin/logout_action`
  - 请求课堂列表和选项卡数据：`/get_course_data`
  - 请求课堂推荐列表数据：`/get_recom_course_data`
- `post`请求：
  - 登录接口：`/admin/login_action`
  - 更改课程分类：`/admin/change_course_field`
  - 更改状态：`/admin/change_status`

**项目目录：**

```
├─src
|  ├─App.jsx - 应用组件/路由页面组件结构
|  ├─index.js - 入口文件/挂载应用
|  ├─utils - 工具函数
|  |   ├─http.js - 封装axios get/post方法
|  |   └tools.js - 去空格/抽离代码/确认信息
|  ├─services - 请求接口服务
|  |    ├─Collection.js
|  |    ├─Common.js
|  |    ├─Course.js
|  |    ├─Crawler.js
|  |    ├─Login.js
|  |    ├─RecomCourse.js
|  |    ├─Slider.js
|  |    ├─Student.js
|  |    └Teacher.js
|  ├─pages - 页面组件
|  |   ├─Index.jsx - 首页
|  |   ├─Login.jsx - 登录页
|  |   ├─sub - 子路由组件 /子组件名称
|  |   |  ├─Teacher
|  |   |  |    ├─index.jsx
|  |   |  |    ├─index.scss
|  |   |  |    ├─TableBody
|  |   |  |    |     ├─index.jsx
|  |   |  |    |     └index.scss
|  |   |  ├─Student
|  |   |  |    ├─index.jsx
|  |   |  |    ├─index.scss
|  |   |  |    ├─TableBody
|  |   |  |    |     ├─index.jsx
|  |   |  |    |     └index.scss
|  |   |  ├─Slider
|  |   |  |   ├─index.jsx
|  |   |  |   ├─index.scss
|  |   |  |   ├─TableBody
|  |   |  |   |     ├─index.jsx
|  |   |  |   |     └index.scss
|  |   |  ├─RecomCourse
|  |   |  |      ├─index.jsx
|  |   |  |      ├─index.scss
|  |   |  |      ├─TableBody
|  |   |  |      |     ├─index.jsx
|  |   |  |      |     └index.scss
|  |   |  ├─Error
|  |   |  |   ├─index.jsx
|  |   |  |   └index.scss
|  |   |  ├─Crawler
|  |   |  |    ├─index.jsx
|  |   |  |    ├─index.scss
|  |   |  |    ├─TableBody
|  |   |  |    |     ├─index.jsx
|  |   |  |    |     └index.scss
|  |   |  ├─Course
|  |   |  |   ├─index.jsx
|  |   |  |   └index.scss
|  |   |  ├─Collection
|  |   |  |     ├─index.jsx
|  |   |  |     ├─index.scss
|  |   |  |     ├─TableBody
|  |   |  |     |     ├─index.jsx
|  |   |  |     |     └index.scss
|  ├─config
|  |   ├─config.js - API路径/左侧导航栏配置
|  |   ├─crawler_config.js - 爬虫管理配置信息
|  |   └table_config.js - 表格th头部配置信息
|  ├─components
|  |     ├─Login
|  |     |   ├─index.jsx
|  |     |   ├─index.scss
|  |     |   ├─Logo
|  |     |   |  ├─index.jsx
|  |     |   |  └index.scss
|  |     |   ├─Form
|  |     |   |  ├─index.jsx
|  |     |   |  ├─index.scss
|  |     |   |  ├─Title
|  |     |   |  |   ├─index.jsx
|  |     |   |  |   └index.scss
|  |     |   |  ├─LoginForm
|  |     |   |  |     ├─index.jsx
|  |     |   |  |     └index.scss
|  |     ├─Index
|  |     |   ├─SideBar
|  |     |   |    ├─index.jsx
|  |     |   |    ├─index.scss
|  |     |   |    ├─NavItem
|  |     |   |    |    ├─index.jsx
|  |     |   |    |    └index.scss
|  |     |   ├─Header
|  |     |   |   ├─index.jsx
|  |     |   |   ├─index.scss
|  |     |   |   ├─Title
|  |     |   |   |   ├─index.jsx
|  |     |   |   |   └index.scss
|  |     |   |   ├─Logout
|  |     |   |   |   ├─index.jsx
|  |     |   |   |   └index.scss
|  |     |   |   ├─Logo
|  |     |   |   |  ├─index.jsx
|  |     |   |   |  └index.scss
|  |     |   ├─Container
|  |     |   |     ├─index.jsx
|  |     |   |     ├─index.scss
|  |     |   |     ├─Board
|  |     |   |     |   ├─index.jsx
|  |     |   |     |   └index.scss
|  |     ├─common
|  |     |   ├─TableSelect
|  |     |   |      ├─index.jsx
|  |     |   |      └index.scss
|  |     |   ├─TableHead
|  |     |   |     ├─index.jsx
|  |     |   |     └index.scss
|  |     |   ├─TableBody
|  |     |   |     ├─index.jsx
|  |     |   |     └index.scss
|  |     |   ├─ListTitle
|  |     |   |     ├─index.jsx
|  |     |   |     └index.scss
|  ├─assets
|  |   ├─scss
|  |   |  ├─button.scss
|  |   |  ├─common.scss
|  |   |  └iconfont.css
|  |   ├─img
|  |   |  └logo.png
|  |   ├─fonts
```

**项目源码：**

- 后端： https://gitee.com/kevinleeeee/crawler-puppeteer-txcourse-demo
- 前端后台管理：https://gitee.com/kevinleeeee/crawler-react-txcourse-manager-demo
- 前端前台网页：https://gitee.com/kevinleeeee/crawler-txcourse-website-demo

**<u>案例：事件待办</u>**

**写法：**

- 组件`hooks`写法
- 事件传递(父组件绑定事件`useCallback包裹`传递给子组件)
- 属性传递

**功能：**

- 事件代办列表渲染
- 点击加号显示输入框
- 输入内容新增待办事件项(`useCallback`)
- 将列表数据缓存到`localStorage`(`useEffect`)
- 点击待办事件项复选框同步事件中横线显示(`useCallback`)
- 点击查看按钮显示查看内容模态框(`useCallback`)
- 点击编辑按钮修改模态框显示的内容(`useCallback`)
- 点击删除按钮删除列表某一项待办事件(`useCallback`)

**知识点：**

- 插槽的运用
- 原生`react`组件数据传递
- 认识常用的`hooks`钩子
- 项目设计
- `useEffect`使用

**案例展示图：**

![image-20220214150050749](http://note-img-bed.dt-code.fun/image-20220214150050749.png)

**组件划分：**

- Header 标题组件
- 输入框组件
- 列表某一项组件
- 模态框组件(利用插槽插入内容复用)
- 查看内容组件
- 编辑内容组件

**项目目录：**

```
├─src
|  ├─App.css
|  ├─App.js - useState声明数据/定义本组件方法和useCallback子组件使用的方法/useEffect对localStorage进行读写/组件视图绑定/子组件属性和方法传递
|  ├─index.jsx - 入口文件/引入默认样式/渲染APP组件挂载页面
|  ├─libs
|  |  └utils.js - 工具函数/格式化时间
|  ├─components
|  |     ├─TodoItem - 列表某一项的组件
|  |     |    ├─index.jsx - 接收父组件属性和方法/绑定视图/事件传递到父组件
|  |     |    └index.scss
|  |     ├─NoDataTip - 无数据页面组件
|  |     |     ├─index.jsx
|  |     |     └index.scss
|  |     ├─Modal - 通用模态框模板组件
|  |     |   ├─index.jsx - 接收子组件(CheckModal/EditModal)属性和方法作为插槽填入/绑定视图
|  |     |   ├─index.scss
|  |     |   ├─EditModal
|  |     |   |     ├─index.jsx - 返回Modal模板/传入属性和子HTML元素/绑定ref/定义提交编辑表单方法/绑定视图
|  |     |   |     └index.scss
|  |     |   ├─CheckModal
|  |     |   |     ├─index.jsx - 返回Modal模板/传入属性和子HTML元素/绑定视图
|  |     |   |     └index.scss
|  |     ├─Header - 标题组件
|  |     |   ├─index.jsx - 绑定视图/触发组件点击事件
|  |     |   └index.scss
|  |     ├─AddInput - 输入框组件
|  |     |    ├─index.jsx - 绑定视图/绑定ref/触发组件点击事件
|  |     |    └index.scss
|  ├─assets
|  |   ├─js
|  |   | ├─common.js
|  |   | └fastclick.js
|  |   ├─css
|  |   |  ├─border.css
|  |   |  ├─resets.css
|  |   |  └ui.css
├─public
|   ├─favicon.ico
|   ├─index.html
```

**总结：**

- 此项目使用的是非`redux`数据管理的方式通信比较麻烦
- 理解`useState`的使用场景
- 合理使用`useEffect`对`localStorage`进行读写
- 合理使用`useCallback`避免子组件多次更新渲染
- 合理使用`useRef`获取 DOM 节点属性

**源码地址：**

https://gitee.com/kevinleeeee/react-todolistpro-hook-mobile-demo

## 项目

**<u>项目：好客租房</u>**

移动端的租房 APP 应用程序，实现类似链家等项目功能，解决用户租房需求

**核心业务：**

- 在线找房(地图，条件搜索)
- 用户登录
- 房源发布

**功能：**

- 首页
  - tabbar 底栏路由
  - 首页轮播图
  - 首页搜索
  - 首页地图找房图标
  - 租房小组：根据地理位置展示不同小组信息
  - 底部 tab 栏图标进行条件找房
  - 收藏房源
  - 百度地图定位
  - 个人中心
  - 发布房源，房源管理
  - 城市选择(`react-virtualized`)：切换城市，查看城市下的房源信息
  - 在百度地图中展示当前定位城市
- 找房
  - 顶部搜索栏组件(复用)
  - 条件筛选栏
    - 吸顶效果
    - 区域/方式/租金
    - 筛选
  - 展示房屋列表
- 登录访问控制
  - 表单验证

**技术：**

- `React`核心库：`react`,`react-dom`,`react-router-dom`

- `antd-mobile`：一个基于`React`的 UI 组件库

- `react-virtualized`：长列表的性能优化

  - `AutoSizer`：高阶组件，`list` 组件将会自适应屏幕宽度，虽然这个组件也能提供自适应高度，但是`list`组件如果需要滚动，也不能使用`AutoSizer`组件提供的高度，虽然可以自适应屏幕高度，但这样`list`组件的高度将被固定
  - `WindowScroller`：高阶组件，使用后虽然可以基本实现`list`组件的滚动、宽度高度都自适应屏幕，但是这样并不是动态的在可视区域渲染数据，我们需用利用最后一个高阶组件(`InfiniteLoader`)来进行最后的包装
  - `InfiniteLoader`：高阶组件，实现`list`组件的无限滚动

- `formik+yup`：`React`中专门用来进行登录表单处理和校验的库

- `react-spring`：动画库，增加动画效果，增强用户体验

- 百度地图`API

**项目搭建：**

1. 本地接口部署
   1. 创建和导入数据库：数据库名称 hkzf
   2. 启动接口：API 目录(`./server`)下运行`npm start`
   3. 测试接口： `http://localhost:8080/`
2. 脚手架初始化项目：`npx create-react-app react-hkzf-mobile-project`
3. `antd-mobile`
4. 路由设置
5. 整体布局：分析两种页面布局，使用嵌套路由实现带`TabBar`页面布局
6. 首页模块：租房小组结构布局，数据获取，`H5`底栏位置和百度地图定位等
7. 城市模块：数据结构处理，长列表性能优化，`react-virtualized`,索引列表等

**组件布局：**

- `Home`：主页面
  - `TopBar`：顶部导航(城市选择，搜索，地图找房)的路由跳转
  - `Carousel`：轮播图
  - `NavMenu`：导航菜单
  - `GroupCard`：租房小组卡片
  - `InfoCard`：最新资讯卡片
- `HouseList`找房页面
- `News`：资讯页面
- `Profile`：我的页面
- `tabbar`页面：首页，找房，资讯，我的
- 非`tabbar`页面：选择城市
- `CityList`页面：城市切换进入列表城市

**知识点：**

- 通过判断是否路由切换实现逻辑业务(`componentDidUpdate`钩子里判断)
- 路由模糊匹配路径
- 路由重定向
- `HTML5`地理位置`API`：通过`navigator.geolocation.getCurrentPosition(position => {})`获取
- 百度地图实现地理定位和地图找房
- 请求数据函数封装
- 路由嵌套传值时使用`render`属性`render={(props)=><App {...props}></App>}`
- 长列表的性能优化(`react-virtualized`)，应用于展示大型列表和表格数据如城市列表，通信录，微博等，会导致页面卡顿，滚动不流畅等性能问题，原因是大量`DOM`节点的重绘和重排，优化方案是 懒渲染 或 可视区域渲染
- (`react-virtualized`)只渲染页面可视区域的列表项
- `AutoSizer`：高阶组件，可以让`List`组件占满屏幕，自动适应屏幕中的高度和宽度
- `withRouter`高阶组件来获取路由信息(`history`)，避免只有路由`Route`直接渲染的组件才能够获取路由信息
- `css in js`：使用`JavaScript`编写`CSS`的统称，用来解决`CSS`样式冲突(组件间样式)覆盖等问题，实现：`CSS Module`(推荐，`react`脚手架集成),`styled-components`等

**数据获取：**

- 基础路径：`http://localhost:8080`

- 轮播图：`/home/swiper`

- 租房小组：`/home/groups?area=AREA%7C88cff55c-aaa4-e2e0`

- 最新资讯：`/home/news?area=AREA%7C88cff55c-aaa4-e2e0`

- 城市信息：`/area/info?name=%E5%B9%BF%E5%B7%9E`

- 城市列表：`/area/city?level=1`

- 热门城市：`/area/hot`

- 区域房源：`/area/map?id=AREA%7C88cff55c-aaa4-e2e0`

- 条件查询房屋：`/area/houses?cityId=AREA%7C88cff55c-aaa4-e2e0`

- 房屋查询条件：`/houses/condition?id=AREA%7C88cff55c-aaa4-e2e0`

- 根据条件查询房屋所需要的各种数据：`/houses?cityId=xx&area=xx0&price=null&rentType=xx&more=xx&roomType=xx&oriented=xx&floor=xx&start=1&end=20`

- 根据`id`查询房屋详情：`/houses/id`

- 用户登录：`/user/login`

- 获取用户信息：`/user`

**源码地址：** https://gitee.com/kevinleeeee/react-hkzf-mobile-project
