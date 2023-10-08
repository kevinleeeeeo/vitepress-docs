# 类型注释与`any`类型

## 类型注释
类型的注释有显式类型定义，类型推断，隐式`any`。
- 显式类型定义是手动指定变量类型
- 类型的推断是通过赋值让`TS`对变量进行类型推断
- 隐式`any`是`TS`无法推断出变量类型时，没有定义类型时，非严格模式下，`TS`会自动将变量设置为`any`类型

显式定义类型的写法。
```ts
let a: number = 1;
a = 'abc'; // 报错 类型'string'不匹配类型'number'
```

通过赋值可以推断出类型。
```ts
let a = 1;
//此时鼠标移动到变量会显示为`number`类型
```

在`TypeScript`中的隐式`any`注释，静态类型检查的`TypeScript`原则上不允许使用`any`类型，但为了兼容`JavaScript`，`any`类型是允许使用的。假如在配置文件`tsconfig.json`中配置了`strict`，那么`any`类型就是不允许使用的。当配置`noImplicitAny`时，默认关闭`any`类型就是隐式的，建议不打开。
```ts
//参数 a 隐式具有 any 类型
function plus(a, b){
  return a + b;
}
plus(1, 2);
```

## `any`类型
一个叫任意的类型，一种可以使`TypeScript`代码回退到`JavaScript`代码编写的方案，不存在任何静态类型检查。`any`类型是不得已而为之的情况下使。

`any`类型的数据可以赋值给任何类型的变量。
```ts
let a: number;
let b = { a: 1 }
a = b; // 不能将 '{ a: 1 }' 分配给类型 'number'
```
```ts
let a: number;
let b: any = { a: 1 }
a = b; // 通过
```

`any`类型可以任意访问对象属性。
```ts
let obj = {
  a: 1
}
console.log(obj.b); //报错 不存在该属性
```

```ts
let obj: any = {
  a: 1
}
console.log(obj.b); //通过 
```

`any`类型可以给对象进行属性的追加。
```ts
let obj = {
  a: 1
}
obj.b = 2; //报错 不存在该属性
```

```ts
let obj: any = {
  a: 1
}
obj.b = 2; //通过
```

`any`类型的变量可以被任何类型的变量赋值。
```ts
let a; //不初始化的变量默认为 any 类型
let b = 1;
a = b; //通过
```

在严格模式下，隐式的`any`类型是不被允许的。
```ts
function plus(a, b){ //此处参数a, b报错
  return a + b;
}
plus(1, 2);
```

以上可以显式定义`any`类型。
```ts
function plus(a: any, b: any){ //通过
  return a + b;
}
plus(1, 2);
plus('1', '2');
```