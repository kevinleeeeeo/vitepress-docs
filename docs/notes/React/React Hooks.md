# React Hooks

## 为什么要学习React Hooks?
理解在`React Hooks`源码的实现层面，设计方面，以及设计的原因等等。

## 环境搭建
初始化项目[`learn-react-hooks-demo`](https://gitee.com/kevinleeeee/learn-react-hooks-demo)。
```
npm init -y
```

新建`index.html`文件，并基于`vite`进行项目启动，并引入`react`和`react-dom`的`cdn`。
```html
<!-- ./index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <div id="app"></div>
    <script src="https://unpkg.com/react@18.2.0/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18.2.0/umd/react-dom.development.js"></script>
    <script type="module" src="./src/App.jsx"></script>
  </body>
</html>

```

`src`目录新增一个`App.jsx`文件并且定义`App`函数，并通过全局的`ReactDOM`引入`createRoot`函数来对`App`根组件进行首次渲染。
```jsx
// ./src/App.jsx
const { createRoot } = ReactDOM;
const root = createRoot(document.getElementById('app'));

function App(){
  return (
    <div>Hello React Hooks</div>
  )
}

root.render(<App />);
```

安装`vite`并启动服务。
```
npm i vite@4.4.11 -D
```

```
npm run dev
```

启动成功。
```
VITE v4.4.11  ready in 301 ms

➜  Local:   http://127.0.0.1:5173/
➜  Network: use --host to expose
➜  press h to show help
```

## React 中的状态
对于数据`data`在`raect`中表示的是状态，`React`其实是`view`视图库，并仅仅关注视图，视图的`update`更新与视图上具体的状态是有关系的，即`state`与`view`是单向数据流的，相互关联的，一旦状态发生变更，视图也会随之变更。

视图上的某一个状态发生了变化，所以视图要进行相应的更新。

## React Hooks 哲学理念
`React`大部分时间都是运行时，`Vue`有时会有编译时的行为，如`const count = $ref(0)`获取值时是会编译为`count.value`。`React`的运行时想法目的都想简化和朴素的，而避免除了视图逻辑以外的代码或编译。

在`JavaScript`的设计哲学中，函数是一等公民，通过函数的方式去进行数据更改而不是直接赋值的操作，`React`也同样如此，从设计之初，希望所有的内容都成为函数化，如果太多的赋值语句，或者一些散落在外的逻辑片段，最终都会导致增加维护性的难度，从而很难通过赋值语句对逻辑代码的分析。

`React`提供了`react-hooks`的思想，对数据进行函数化的更改，并允许开发者自定义`hooks`去实现更多的数据更改的可能，从而代替赋值语句，代替一些分支的判断，代替一些散落在外的逻辑片段。

## useState
至于使用的`useState()`来创建`state`的原因是视图需要`state`状态。`useState()`一般会返回`state`和`setState`方法的数组集合。

`useState`的作用是帮助创建一个状态与设置状态的方法。
```js
const { useState } = React;
const [ count, setCount ] = useState(0);
```

## useReducer
当希望在视图上的一个函数对其标识不同的`type`即可以执行类似但又不同的逻辑时，可以利用抽离的思想，但同时`react-hooks`也提供了一个集成功能的`useReducer`方法，优点是集成性很高，而且方便于更改逻辑。

```jsx
function App(){
  return (
    <button onClick={() => setCount(count + 2)}>+</button>
    <button onClick={() => setCount(count - 1)}>-</button>
  )
}
```

`useReducer`方法会更多的去收集所有操作某一个数据的方案。`useReducer`接收参数1为`reducer`函数，参数2为某个数据的初始值。返回值是一个数组集合，返回值`[0]`为状态数据，返回值`[1]`为`dispatch`视图使用的派发器函数，该派发器函数会根据用户传入不同操作类型`type`来调用不同的逻辑。
```js
const [ count, dispatch ] = useReducer(countReducer, 0);
```

定义一个`reducer`函数，参数1为状态数据，参数2为`action`对象，包括`type`和`payload`属性。`reducer`是非常适合解决一个对状态进行修改的方案的集成的方法。 
```js
function countReducer(count, { type, payload }){
  //通过type来分析
  switch (type) {
    case 'PLUS':
      return count + payload;
    case 'MINUS':
      return count - payload;
    case 'MUL':
      return count * payload;
    case 'DIV':
      return count / payload;
    default:
      break;
  }
}
```

在视图组件中执行`dispatch`方法，接收`action`对象参数，就会调用`reducer`函数，根据不同`type`去走不同的逻辑分支。好处是所有的逻辑并不会出现在视图上。
```jsx
function App(){
  return (
    <button onClick={
      () => dispatch({ type: 'PLUS', payload: 2 })
    }>+</button>
    <button onClick={
      () => setCount({ type: 'MINUS', payload: 1 })
    }>-</button>
  )
}
```

## useEffect
副作用与视图状态并不相关的逻辑 ，如数据请求，打印日志，修改`dom`，操作`dom`，计时器等一系列副作用。在`react`中，所有的副作用都必须在`useEffect`函数中执行。在`useEffect`函数以外的地方去执行副作用操作会违反了`react`的哲学。

使用`useEffect`代替了组件从加载到卸载等一系列生命周期的过程。在不同的生命周期里执行不同的副作用操作，使用`useEffect`函数的目标是简化原本类里定义的多个生命周期函数的使用，并减少使用对没有必要的生命周期函数的使用。

`useEffect`的本质是开发者手动收集依赖，来决定回调执行的时机。与`vue`中的`watchEffect`方法极其相似，区别在于`watchEffect`没有参数2，`watchEffect`可以自动的对依赖进行收集。

所以在设计上`useEffect`和`watchEffect`的理念就有所不同，`useEffect`希望更多的代替类中的生命周期函数，根据依赖传入的状态来决定生命周期的时机。而`watchEffect`实际上是观察副作用，而`vue`本身是有自己的生命周期函数的。

`useEffect`函数的执行接收一个参数1为回调函数，参数2为依赖数组集合`dependencies array`。依赖决定了生命周期函数回调执行的时机。
```js
useEffect(() => {}, []);
```

假如没有给`useEffect`函数传入参数2的依赖集合，组件的首次渲染和视图每次的更新都会执行参数1回调函数。即任何状态的改变都会进行重新执行回调。
```js
useEffect(() => {
  console.log('useEffect');
});
```

假如给`useEffect`函数传入参数2为一个对象时会报错。接收一个参数2必须为数组。
```js
//Warning: useEffect received a final argument that is not an array.
useEffect(() => {}, {});
```

假如给`useEffect`函数传入参数2为一个空数组时，那么回调只会在函数组件执行时调用一次。相当于`componentDidMounted`生命周期函数。
```js
useEffect(() => {}, []);
```

所以注意的是`useEffect`的参数2的依赖数组不能在根组件`App`中进行维护，因为`App`组件执行时会重新声明一次依赖数组。该依赖数组必须在`App`外部进行维护，`App`组件每次执行时都会对比外部保存的依赖是否存在变化。
```js
function App(){
  useEffect(() => {}, []);
}
```

假如给`useEffect`函数传入参数2为一个有状态元素的数组时(必须是状态)，一旦状态发生变更时，回调函数则重新执行一次。 相当于`componentDidUpdate`生命周期函数。
```js
const [ count, setCount ] = useState(0);
useEffect(() => {}, [count]);
```

当然，`useEffect`函数也是可以有返回值的，这个返回值是一个回调函数。作用是组件卸载时的操作，如路由在页面切换时，当前页面组件是会被卸载的，涉及到清除副作用。相当于`componentWillUnmount`生命周期函数。
```js
let t = null;

useEffect(() => {
  t = setInterval(() => {}, 1000);

  return () => {
    //对组件切换时 对定义在window全局的计时器进行清理
    clearInterval(t);
    t = null; 
  }
}, []);
```

由于`useEffect`函数的参数1回调函数返回的是一个普通的清理函数，所有不能使用异步的`async`关键字对其进行异步化，因为`async`必须接收一个`Promise`。
```js
//Warining: useEffect must not return anything besides a function, which is used for clean-up.
useEffect(async() => {
  return () => {}
}, []);
```

可以在参数1回调函数的内部进行`async`函数定义。
```js
useEffect(() => {
  ;(async() => {
    const data = await fetch('/xxx');
  })();
  return () => {}
}, []);
```

## memo
`memo`用法上有点像`vue`中的`computed`计算函数。在`react`中的`memo`有特殊的含义。

定义`hooks`主要解决了性能的问题，函数组件最大的弱点是渲染执行，当一个组件的状态发生了改变的时候，相关视图是必然要更新的。函数组件在视图更新需求来临的时候，函数是必然要执行的，组件函数执行返回一个模版字符串，再次执行也会返回一个模版字符串，此时会存在多个节点的问题，此时`react`就会经过一系列的算法对新老节点进行对比，对比后才会对视图进行更新。

当函数组件嵌套了子组件的情况下，父函数组件的执行也会导致子组件的一并执行。在以下定义的父组件`count1`状态更新的时候同时也会导致了子组件状态`count2`的更新，显然是不合理的。

```jsx
import { root, useState } from './MyReact';

function Child(props){
  //此时当父组件执行时子组件也同时被执行
  console.log('child'); 

  return (
    <div>
      <h1>count2: { props.count2 }</h1>
    </div>
  )
}

function App(){
  const [ count1, setCount1 ] = useState(0);
  const [ count2, setCount2 ] = useState(0);

  return (
    <>
      <div>Hello React Hooks</div>
      <h1>count1: { count1 }</h1>
      <button onClick={
        () => setCount1(count1 + 1)
      }>Add Count1</button>
      <Child count2 = {count2} />
      <button onClick={
        () => setCount2(count2 + 1)
      }>Add Count2</button>
    </>
  )
}

root.render(<App />);

export default App;
```

由于函数组件在`react`中必须执行的特性，是无法控制的。解决的办法通过`memo`方法，目的是创建一个我们组件的备忘。允许您在组件的`props`未更改时跳过重新渲染组件，通过给子组件进行`memo`包裹，创建一个备忘的子组件，帮助开发者通过子组件状态的是否更新来判断决定是否执行子组件函数。

此时父组件`count1`状态的更新不会交叉影响到子组件的执行，只有子组件的`props`状态发生变更时才会执行`memo`包裹的函数回调。
```jsx
const Child = memo(function Child(props){
  return (
    <div>
      <h1>count2: { props.count2 }</h1>
    </div>
  )
});
```

但是`memo`仍然有不能解决的场景。以下给子组件传入的`props`为`childData`对象时，`memo`则失效了，当更改父组件状态`count1`的时候，子组件也会被一并的执行。
```jsx
import { root, useState } from './MyReact';
const { memo } = React;

const Child = memo(function Child(props){
  console.log('child');
  return (
    <div>
      <h1>count2: { props.childData.count2 }</h1>
    </div>
  )
});

function App(){
  const [ count1, setCount1 ] = useState(0);
  const [ count2, setCount2 ] = useState(0);
  const childData = { count2: count2 }

  return (
    <>
      <div>Hello React Hooks</div>
      <h1>count1: { count1 }</h1>
      <button onClick={
        () => setCount1(count1 + 1)
      }>Add Count1</button>
      <Child childData = {childData} />
      <button onClick={
        () => setCount2(count2 + 1)
      }>Add Count2</button>
    </>
  )
}

root.render(<App />);
export default App;
```

`memo`失效的原因是它的核心会对引用进行比较，这种比较是浅层比较，所以无法深度的对比引用是否更新，导致`memo`无法判断是否需要执行子组件。`childData`如果更新了一个新的引用，那么`Child`就会被执行，如果引用没有变化，那么`Child`就不会执行。

当父组件状态`count1`更新时，`App`组件必然要执行，所以`App`组件定义的`childData`必要重新赋值一个新的引用。`memo`只能判断`childData`是一个新的引用，所以更新了子组件。

所以仅仅通过`memo`是无法完全解决让子组件在一定条件下执行的需求。

## useMemo
`useMemo`完美的避免了每次更新父组件导致子组件的一并更新。`useMemo`主要是为了根据依赖项来决定返回一个新的引用。

`useMemo`的参数1接收一个函数，该函数会返回一个新的值，参数2为依赖参数。`useMemo`返回新的引用与否取决于依赖数组项是否有被修改更新。假如依赖项更新了就会返回一个新的引用，否则沿用原来的引用。
```jsx
const childData = useMemo(() => ({ count2 }), [count]);
```

`useMemo`除了对子组件状态的缓存之外，防止父组件函数组件的意外执行。同时，`useMemo`也可以做到`vue`中`computed`属性的作用，能够帮助集成计算的特性。
```jsx
const [ count, setCount ] = useState(0);
const doubleCount = useMemo(() => count * 2, [count]);
// 类似vue computed
const doubleCount2 = computed(() => count * 2);
```

## useCallback
`memo`有`useCallback`的原因是无法对某个函数组件进行包裹。假如父组件定义一个函数并通过`props`传递给子组件，当父函数组件执行的时候，由于对`cbSetCount2`函数重新定义赋值，导致传递的`props`是一个新的引用，导致子组件一并更新。
```jsx
function App(){
  const cbSetCount = () => {
    setCount(count + 1);
  }

  return (
    <div>
      <Child setCount={cbSetCount}/>
    </div>
  );
}
```

想要保证`cbSetCount`函数是一个唯一的引用，可以通过`useCallback`方法进行缓存。参数为被缓存的函数，参数2为数组依赖，但是意义不大，因为函数是静态的。
```jsx
const cbSetCount = useCallback(() => {
  setCount(count + 1);
}, []);
```


## 为什么要实现源码？
实现的目的是为了学习框架中的源码，学习设计的思想，设计的目的，实现的技巧等。

## useState实现
在视图组件运行机制中，`App`函数执行相当于`createReactElement`函数创建而来的`jsx`虚拟节点，然后通过`root.render()`来进行真实节点挂载，从而进行首次渲染。

当组件更新时，重新执行`App`组件函数，当前`App`组件中定义的所有方法也会被重新执行，假如`App`组件里面`useState`定义的状态，在组件更新时有可能会重新定义，会导致状态丢失。

如何保持记录而不是被刷新？在于`useState`定义的状态确保不在`App`组件中定义和维护。
```jsx
function App(){
  const [count, setCount ] = useState(0);
}
```

当然也会有一个对比机制，在组件`App`执行时`useState`方法将也被调用一次，`useState`内部会查看外部`state`状态有没有被更改，当状态没有变化时就沿用初始值，当状态发生变化时使用变化后的状态。所以状态和修改状态的方法也必须在外部进行维护。
```jsx
const [ count, setCount ] = useState(0);
```

`useState`原理一，定义两个容器分别是`states`和`stateSetters`数组，作为`useState`方法的返回值数组元素`[0]`来装状态，`[1]`来装修改状态的方法。
```jsx
// /src/MyReact.jsx
const states = [];
const stateSetters = [];
```

并且在`useState`执行时需要索引去控制每次执行后的状态。
```jsx
// /src/MyReact.jsx
let stateIndex = 0;
```

定义一个`useState`函数。将每次执行`useState`后创建的状态单独的存入`states`容器里。和修改状态的方法存入`stateSetters`容器里。最后并把这两个容器进行返回。
```jsx
// /src/MyReact.jsx
export function useState(initialState){
  states[stateIndex] = createState(initialState, stateIndex);

  if(!stateSetters[stateIndex]){
    stateSetters.push(createStateSetter(stateIndex));
  }

  const _state = states[stateIndex];
  const _setState = stateSetters[stateIndex];

  stateIndex++;

  return [
    _state,
    _setState
  ]
}
```

定义`createState`方法。假如某一个状态被修改了，则使用修改后的状态，如果没有发生修改则使用初始值状态。
```jsx
// /src/MyReact.jsx
function createState(initialState, stateIndex){
  return states[stateIndex] ? states[stateIndex] : initialState;
}
```


定义`createStateSetter`方法。返回一个函数，该函数可以接受一个状态的值，也可以接受一个修改状态值的语句函数作为参数。
```jsx
// /src/MyReact.jsx
// setCount(count);
// setCount( count => count + 1 );
function createStateSetter(stateIndex){
  return (newState) => {
    if(typeof newState === 'function'){
      //如果是函数语句则让这函数执行拿到新的状态结果
      states[stateIndex] = newState(states[stateIndex]);
    }else{
      //否则 拿当前的状态
      states[stateIndex] = newState;
    }
    //更新视图
    render();
  }
}

```

定义一个`render`渲染视图函数。懒加载的方式对视图组件进行导入。
```jsx
// /src/MyReact.jsx
async function render(){
  const App = (await import('./App')).default;
  stateIndex = 0;
  root.render(<App />);
}
```

## useReducer实现
派发器思想在许多项目中可以使用，包括虚拟滚动等，或者有一个功能需要很多方案对其问题解决，或者需要多个方式对一个数据进行处理的情况。派发器就可以对此进行封装，在维护的时候仅仅是在内部进行维护即可。

在视图组件中使用`useReducer`时，`useReducer`函数的执行接受参数1为一个函数，参数2为一个初始值，返回值`[0]`为状态数据，返回值`[1]`为`dispatch`函数供视图使用。在视图上使用的`dispatch`函数的写法：
```jsx
function App(){
  const [ count, dispatch ] = useReducer(countReducer, 0);

  return (
    <>
      <div>Hello React Hooks</div>
      <h1>{ count }</h1>
      <button onClick={
        () => dispatch({ type: 'PLUS', payload: 2 })
      }>+</button>
      <button onClick={
        () => dispatch({ type: 'MINUS', payload: 1 })
      }>-</button>
    </>
  )
}
```

并且在视图组件定义的`countReducer`函数，接受参数1为一个`state`状态数据，参数2为一个操作状态的`action`对象，并且该对象是由`dispatch`函数进行提供的。
```jsx
function countReducer(count, { type, payload }){
  switch(type){
    case 'PLUS':
      return count + payload;
    case 'MINUS':
      return count - payload;
    case 'MUL':
      return count * payload;
    case 'DIV':
      return count / payload;
    default:
      return count;
  }
}
```

所以在实现上需要定义一个`useReducer`函数。其实在该函数内部也需要创建一个`state`状态数据。由于需要视图`dispatch`函数提供的`actions`对象，在函数内部也需要定义`dispatch`方法。

在`dispatch`方法通过参数可以拿到视图提供的`actions`，函数内部可以拿到用户在视图定义的逻辑函数`reducer`，并执行后就可以获取新的`state`状态并通过`setState`方法对其进行状态更新。

最后`useReducer`返回更新后的状态和视图使用的`dispatch`函数。此时`useReducer`就实现完毕了。 
```jsx
// /src/MyReact.jsx
export function useReducer(reducer, initialState){
  const [ state, setState ] = useState(initialState);

  function dispatch(actions){
    const newState = reducer(state, actions);
    setState(newState);
  }

  return [ state, dispatch ]
}

```

## useEffect实现
首先定义一个`useEffect`函数并导出外部使用。函数参数1接收一个`cb`函数，参数2接收一个`depArr`依赖数组。参数1必须为一个回调函数，否则报错。而且需要实现以下特性：

- 特性1，依赖数组有可能为空，或者不是数组时是`undefined`时，则抛出错误。
- 特性2，没有传入参数2时则执行`useEffect`函数一次。
- 特性3，依赖数组`effectDepArrs`通过外部进行维护，并需要索引`effectIndex`来记录每个`useEffect`定义的回调。
- 特性4，依赖数组的比对，假如外部有定义依赖数组，并且与内部定义的`effectDepArrs`数组的数组元素存在时，则需要执行`useEffect`，否则不执行。如果检查到内部的`effectDepArrs`数组为空时，代表`useEffect`首次执行。

```jsx
// /src/MyReact.jsx
const effectDepArrs = [];
let effectIndex = 0;

export function useEffect(cb, depArr){
  if(typeof cb !== 'function'){
    throw new TypeError('Parameter 1 must be a callback function.');
  }

  if(
    !Array.isArray(depArr) && 
    depArr === undefined
  ){
    throw new TypeError('Parameter 2 must be a dependencies array.');
  }

  /**
   * depArr.some() 检查只要有一个满足就会返回true，如果全部都不满足则返回false
   * effectDepArrs[effectIndex] 该数组元素不存在时则返回true，代表useEffect首次执行
   */
  const isChanged = effectDepArrs[effectIndex]
    ? depArr.some(
      (dep, index) => dep !== effectDepArrs[effectIndex][index]
    )
    : true;

  if(isChanged || depArr === undefined){
    isChanged && cb();
  }

  effectDepArrs[effectIndex] = depArr; 
  effectIndex++; 
}
```

注意，在组件渲染函数时需要重置`effectIndex`索引。
```jsx
async function render(){
  const App = (await import('./App')).default;
  stateIndex = 0;
  effectIndex = 0;
  root.render(<App />);
}
```

## `memo`实现
函数组件的核心仍然是一个类组件，如果自定义`shouldComponentUpdate(nextProps, nextState)`生命周期，用于`shouldComponentUpdate()`让`React`知道组件的输出是否不受当前状态或属性变化的影响。默认行为是在每次状态更改时重新渲染，并且在绝大多数情况下您应该依赖默认行为。此时需要自己去写一个`PureComponent`组件。

在组件中，需要模拟`memo`函数去比对当前和下一个引用是否是一致的，只有两个引用不一致时才去执行`shouldComponentUpdate`函数。
```jsx
// ./src/PureComponent.jsx
const { Component } = React;

export default class PureComponent extends Component {
  //memo对比当前和下一个引用是否是一致的
  //shouldComponentUpdate默认返回布尔值
  shouldComponentUpdate(nextProps, nextState){
    return !shallowEqual(this.props, nextProps) || 
      !shallowEqual(this.state, nextState);
  }
}
```

并同时定义一个比对函数`shallowEqual`，浅层对比两个引用对象：
- 如果两引用一致则不能去调用`render`函数。
- 如果两引用不是对象或者为空的情况则为假。
- 如果两引用里面的键名长度一致时则为假。
- 如果两引用的键名不一致或键值不一致时则为假。
```jsx
// ./src/PureComponent.jsx
function shallowEqual(o1, o2){
  if(o1 === o2){
    return true;
  }

  if(
    typeof o1 !== 'object' || 
    o1 === null || 
    typeof o2 !== 'object' || 
    o2 === null
  ){
    return false;
  }

  const k1 = Object.keys(o1);
  const k2 = Object.keys(o2);

  if(k1.length !== k2.length){
    return false;
  }

  for(let k of k1){
    if(!o2.hasOwnProperty(k) || o1[k] !== o2[k]){
      return false;
    }
  }

  //除了以上情况，两引用是全等的。
  return true;
}

```

此时可以定义一个`memo`函数。参数1接收一个`React`的`Fc`组件。返回一个高阶组件的类组件，并使用`PureComponent`里定义的`shouldComponentUpdate`生命周期函数，根据它返回的布尔值来决定是否渲染更新视图，在组件渲染函数里返回一个组件函数并向下传入`props`属性。
```jsx
// /src/MyReact.jsx
import PureComponent from './PureComponent';

export function memo(Fc){
  return class extends PureComponent{
    render(){
      return Fc(this.props);
    }
  }
}
```

## useMemo实现
定义一个`memoArr`容器和索引`memoIndex`来维护多个`useMemo`函数参数。并且渲染函数每次执行时都需要重置索引。定义一个`useMemo`函数供外部使用。

`useMemo`函数接收参数1为`cb`回调函数，参数2`depArr`为依赖数组。
- 如果缓存的`memoArr`已经存在了回调函数时，说明回调并没有变化，解构容器单独取出`cb`函数和`depArr`依赖项数组。通过对比依赖数组项来决定，如果依赖项没有变化则返回`false`，有变化则返回`true`。
- 如果是首次时，回调函数需要执行并返回一个新的对象引用，同时缓存至`memoArr`容器。

同时，需要定义一个`setNewMemo`方法来拿到`cb`回调函数执行后的新引用，并将其引用保存到`memoArr`容器里，并最终返回这个新的引用对象。
```jsx
// /src/MyReact.jsx
const memoArr = [];
let memoIndex = 0;

export function useMemo(cb, depArr){
  if(memoArr[memoIndex]){
    const [ _memo, _depArr ] = memoArr[memoIndex];
    const isFullySame = depArr.every((dep, index) => _depArr[index]);
    //有缓存cb但没有更新时执行cb并返回之前的引用对象
    if(isFullySame){
      memoIndex++;
      return _memo;
    }else{
      //有缓存cb但有更新时则执行拿到新的引用并返回出去
      return setNewMemo(cb, depArr);
    }
  }else{
    return setNewMemo(cb, depArr);
  }

  function setNewMemo(cb, depArr){
    //对应 useMemo(() => ({state})) 
    //回调执行就可以拿到返回的新引用
    const memo = cb();
    memoArr[memoIndex] = [ memo, depArr ];
    memoIndex++;
    return memo;
  }
}
```


## useCallback实现
定义一个`callbackArr`容器和索引`callbackIndex`来维护多个`useMemo`函数参数。并且渲染函数每次执行时都需要重置索引。定义一个`useCallback`函数供外部使用。

`useCallback`函数接收参数1为`cb`回调函数，参数2`depArr`为依赖数组。
- 如果缓存的`callbackArr`已经存在了回调函数时，说明回调并没有变化，解构容器单独取出`cb`函数和`depArr`依赖项数组。通过对比依赖数组项来决定，如果依赖项没有变化则返回`false`，有变化则返回`true`。
- 如果是首次时，回调函数需要返回，同时缓存至`callbackArr`容器。

同时，需要定义一个`setNewCallback`方法来将`cb`回调函数保存到`callbackArr`容器里，并返回当前的回调函数。
```jsx
const callbackArr = [];
let callbackIndex = 0;

export function useCallback(cb, depArr){
  if(callbackArr[callbackIndex]){
    const [ _cb, _depArr ] = callbackArr[callbackIndex];
    const isFullySame = depArr.every(
      (dep, index) => dep === _depArr[index]
    );
    //有缓存cb但没有更新时返回之前的cb
    if(isFullySame){
      callbackIndex ++;
      return _cb;
    }else{
      //有缓存cb但有更新时则返回当前新的回调函数并缓存到`callbackArr`
      return setNewCallback(cb, depArr);
    }
  }else{
    return setNewCallback(cb, depArr);
  }

  function setNewCallback(cb, depArr){
    callbackArr[callbackIndex] = [ cb, depArr ];
    callbackIndex ++;
    return cb;
  }
}
```
