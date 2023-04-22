# `ES6`字符串方法

## `codePointAt()`

`String.prototype.codePointAt()`方法返回 一个`Unicode`编码点值的非负整数，参数是字符串索引。

尝试给一个字符串获取它的`unicode`编码，获取的编码是一个十进制编码。

```js
var s = '𠮷a';
console.log(s.codePointAt(0)); //134071
```

尝试给该十进制编码转为十六进制的`unicode`编码。

```js
console.log(Number.prototype.toString.call(134071, 16)); //20bb7
```

尝试通过该`unicode`编码找到字符串。

```js
console.log('\u{20bb7}'); //𠮷
```





## `fromCodePoint()`

`String.fromCodePoint()`方法与`ES5`中的`String.fromCharCode()`方法类似，传入`unicode`码点返回一个对应的字符。

尝试传入十六进制的码点，它返回的是一个乱码，`String.fromCharCode()`方法无法正确返回期望的字符串。

```js
console.log(String.fromCharCode('0x20bb7')); //ஷ
```

当字符码点大于`FFFF`时，它会舍弃最高位，即`2`。

```js
console.log(String.fromCharCode('0x20bb7') === String.fromCharCode('0x0bb7')); //true
```

`fromCodePoint()`方法可以弥补字符码点超出极限时对应的字符。字符串也存在遍历接口`Symbol.iterator`，可以`For/of`遍历每一个字符。

```js
let str = String.fromCodePoint(0x20bb7);
console.log(str); //𠮷
for(let i of str){ console.log(i); } //𠮷
```



## `includes()`

`String.prototype.includes()`方法在另一个字符串中找到一个字符串，并根据情况返回 `true` 或 `false`。

```js
let s = 'Hello world!';
console.log(s.includes('o')); //true
```



## `startsWith()`

`String.prototype.startsWith()`方法判断当前字符串是否是以另外一个给定的子字符串“开始”的，根据判断结果返回 `true` 或 `false`。

```js
let s = 'Hello world!';
console.log(s.startsWith('H')); //true
```



## `endsWith()`

`String.prototype.endsWith()`方法判断当前字符串是否是以另外一个给定的子字符串“结尾”的，根据判断结果返回 `true` 或 `false`。

```js
let s = 'Hello world!';
console.log(s.endsWith('!')); //true
```



## `repeat()`

`String.prototype.repeat()`方法返回一个新字符串，该字符串包含被连接在一起的指定数量的字符串的副本。

```js
console.log('x'.repeat(3)); //xxx
```

如果不是一个整数时，舍弃小数。

```JS
console.log('x'.repeat(2.9)); //xx
```

如果是`NaN`时，非数字，没有结果，空字符串。

```js
console.log('x'.repeat(NaN)); //
```



## `padStart()`

`String.prototype.padStart()`方法，用另一个字符串填充当前字符串。在日期补齐，时间补齐。

填充`ab`字符和`x`字符串，`x`在第5位。

```js
console.log('x'.padStart(5, 'ab')); //ababx
console.log('x'.padStart(4, 'ab')); //abax
```



## `padEnd()`

`String.prototype.padEnd()`方法，用另一个字符串填充当前字符串。

填充`ab`字符和`x`字符串，`x`在第1位。

```js
console.log('x'.padEnd(5, 'ab')); //xabab
console.log('x'.padEnd(4, 'ab')); //xaba
```

