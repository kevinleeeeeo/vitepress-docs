# `ES6`数值静态方法

在`ES5`中表示一个十六进制的数值的写法，在浏览器显示会是一个十进制的数值。

```js
console.log(0x1f7); //503
```

在`ES6`拓展了新的方法，除了十六进制表示方法，还新增了对二进制，八进制数值的方法。

```js
//八进制写法
console.log(0o767); //503
```

希望将`503`转为二进制，可以使用`Number.prototype.toString()`方法来转换。

```js
console.log(Number.prototype.toString.call(503, 2)); //111110111
```

希望将二进制转为十进制可以通过`parseInt()`方法来进行转换。

```js
console.log(parseInt(111110111, 2)); //503
```

使用了`0b`开头写法同样也可以表示二进制转十进制的转换。

```js
console.log(0b111110111); //503
```



## `isNaN()`

该方法可以明确判断值是否为`NaN`。修正了全局的`isNaN()`方法自动隐式转换的功能。

```js
Number.isNaN(NaN);        // true
Number.isNaN(Number.NaN); // true
Number.isNaN(0 / 0)       // true

// 下面这几个如果使用全局的 isNaN() 时，会返回 true。
Number.isNaN("NaN");      // false，字符串 "NaN" 不会被隐式转换成数字 NaN。
Number.isNaN(undefined);  // false
Number.isNaN({});         // false
Number.isNaN("blabla");   // false

// 下面的都返回 false
Number.isNaN(true);
Number.isNaN(null);
Number.isNaN(37);
Number.isNaN("37");
Number.isNaN("37.37");
Number.isNaN("");
Number.isNaN(" ");
```



## `isFinite()`

给数字进行判断是否有效，有限。给一个无穷的数值进行判断会返回`false`。修正了全局的`isFinite()`方法自动隐式转换的功能。

```js
console.log(Number.isFinite(Infinity)); //false
```



## `parseInt()`

依据指定基数，解析字符串并返回一个整数。



## `parseFloat()`

以把一个字符串解析成浮点数。



## `isInteger()`

判断给定的参数是否为整数。

```js
console.log(Number.isInteger(24)); //true
console.log(Number.isInteger(24.0)); //true
```



## `isSafeInteger()`

来判断传入的参数值是否是一个安全整数。`JavaScript`中解析引擎解析的最大值，整数处理的上限是`Number.MAX_SAFE_INTEGER = 9007199254740991;`。同样等于`Math.pow(2, 53)`，即`2`的`53`次方。

