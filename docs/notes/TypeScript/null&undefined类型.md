## `null`和`undefined`

## `null`
`null`是空指针 ，代表引用类型的空值，`typeof`返回类型`object`。
```ts
let obj = null; 
obj = {};  
```

## `undefined`
`undefined`是未定义类型，代表原始值的类型，类型为`undefined`。
```ts
var a = undefined; //不推荐写法
var a; //推荐写法
```

`x`默认是`any`类型。因为`undefined`是`JS`系统默认中的空值占位符。如果类型推断为`undefined`类型时，会使后续赋值造成类型不匹配。
```ts
let x = undefined; //x 被推断为 any 类型
let x = void 0; //推荐写法

//一旦将x赋值为其他值，如1会报错
//Type '1' is not assignable to type 'undefined'.
x = 1;
```

不能将`undefined`的值进行显式类型定义，定义为`undefined`。
```ts
let x: undefined = undefined;
x = 1; //报错
```

不能将`null`的值进行显式类型定义，定义为`null`。
```ts
let x: null = null;
x = {}; //报错
```

`TS`系统是不能将`undefined`或`null`的值推断为`undefined`或`null`类型的，后续无法赋值一个其他类型的值，所以只能推断为`any`类型。
```ts
let str: string;
str = 'abc'; //报错

let obj = null;
obj = {}; //报错
```

## 文字类型
常量`const`声明不能重复赋值。
```ts
const title = 'Hello';
title = 'World'; //报错
```

使用`let`声明就可以赋值。
```ts
let title = 'Hello';
title = 'World'; //通过
```

但是定义了文字类型后，后续赋值不能改变文字类型。
```ts 
let title: 'Hello' = 'Hello';
title = 'World'; //报错
//Type 'World' is not assignable to type '"Hello"'.
```

可以同时定义多种文字类型，即联合类型定义，赋值时只能从其中进行赋值，类似于枚举。  
```ts
let buttonColor: 'blue' | 'red' | 'orange' | 'green';
buttonColor = 'blue'; //通过
buttonColor = 'pink'; //不通过
```
以上的联合类型定义也可以这样定义。
```ts
type TypeButtonColor = 'blue' | 'red' | 'orange' | 'green';
let buttonColor: TypeButtonColor;
```

联合类型定义的应用如定义了一个`compare()`方法，规定其返回值只能是`-1`，`0`，`1`时，就可以定义一个返回值的类型。
```ts
type TypeCompareReturn = -1 | 0 | 1;
function compare(a: number, b: number): TypeCompareReturn {
  return a === b ? 0 : a > b ? 1 : -1; 
}
```

经典文字类型定义的应用如定义一个请求函数。
```ts
type TypeHttpMethods = 'GET' | 'POST';
function httpRequest(url: string, method: TypeHttpMethods): void {
  //...
}
httpRequest(
  'https://xxx.com/api/v2/news/get_list',
  'POST'
)
```

