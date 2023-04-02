# DOM

## 概念

Document Object Model 文档对象模型，它本身是一个对象，又叫宿主对象，浏览器本身封装文档对象模型并提供一系列的相关接口和方法集合并从中找到相应的方法去处理一些问题。DOM存在的目的通过浏览器提供的这一套方法(JavaScript语法)可以去操作HTML和XML文档，DOM无法操作CSS，它能改变样式是通过操作DOM元素里的`style`属性，给属性增加了内联样式，内联样式的优先级高于外部样式表并将其覆盖。

**JavaScript有三种对象**，本地对象和内置对象都是ECMAScript内部对象。

- ECMAScript提供的本地对象(Native Object)
  - `Object`, `Function`, `Array`, `String`, `Number`, `Boolean`, `Error`, `EvalError`, `SyntaxError`, `RangeError`, `ReferenceError`, `TypeError`, `URIError`，`Date`，`RegExp`
- 内置对象(Built-in Object)
  - Global在ECMA中不存在, Math
  - Global全局下的方法有`isNaN`, `parseInt`, `Number`, `decodeURI`, `encodeURI`
  - Global全局下的属性有`Infinity`，`NaN`，`undefined`
- 执行JavaScript脚本环境提供的对象叫宿主对象(Host Object)，又称浏览器对象，会存在兼容性问题

浏览器对象有window的所有方法都在BOM对象里，document所有的方法都在DOM对象里，实际上BOM包含DOM，拆分出来的原因是DOM有W3C规范，而BOM没有的原因是浏览器之间的运行方式和方法实现是不同的，所以不同浏览器之间会存在不同的BOM对象从而无法实现统一的标准和规范，导致开发者需要在不同浏览器做相应不同的兼容性。



## document 对象

document对象代表了整个HTML文档，JavaScript中document相当于HTML文档的最上层，document的下一级是HTMLDocument。



## 获取元素

- `document.getElementById()`，定义并仅存在`Document.prototype`上。
- `document.getElementsByName()`，定义并仅存在`Document.prototype`上。
- `document.getElementsByTagName()`
- `document.getElementsByClassName()`
- `document.querySelector()`(html5 正式引入)
- `document.querySelectorAll()`(html5 正式引入)

关于`querySelector`：

- 最多只能选择一个元素

关于`querySelector`& `querySelectorAll`

- 性能低
- 不实时(临时缓存)

不实时测试：

```js
var divs = document.getElementsByTagName('div');
divs[0].remove(); //[div, div, div]
console.log(divs); //[div, div]

var divs2 = document.querySelectorAll('div');
divs2[0].remove(); //[div, div, div]
console.log(divs2); //[div, div, div]
```

在业务场景中少用慎用`querySelectorAll`。

使用`document.documentElement`属性可以获取`html`元素。

```js
const html = document.documentElement;
console.log(html);
//<html>...</html>
```





## 遍历节点

遍历节点树即为元素节点树，节点不是元素，节点包含元素。

- `Node.parentNode`：父节点，`document.parendNode`为`null`
- `Node.childNodes`：找子节点集合
- `Node.firstChild`：第一个节点
- `Node.lastChild`：最后一个节点
- `Node.nextSibling`：下一个兄弟节点
- `Node.previousSibling`：上一个兄弟节点

查找子节点集合，它包括文本节点，元素节点，还有注释节点。

```html
<div id="app">
  <!-- This is ul  -->
  <ul class="slider-list">
    <li class="slider-item">
      <a href="lk">网址一</a>
    </li>
  </ul>
</div>

<script>
  console.log(document.getElementById('app').childNodes);
  //NodeList(5) [text, comment, text, ul.slider-list, text]
  console.log(document.getElementById('app').childNodes.length);
  //5
</script>
```

查看节点号的属性是`Node.nodeType`。

```js
console.log(document.getElementById('app').nodeType);  //1
```

- 元素节点(相当于 DOM 元素)：节点号 1
- 属性节点：节点号 2
- 文本节点(text)： 节点号 3
- 注释节点(comment)： 节点号 8
- document 节点： 节点号 9
- document fragment 节点： 节点号 11

`Node.firstChild`寻找第一个节点和`Node.lastChild`寻找最后一个节点。

```js
console.log(document.getElementById('app').firstChild);  
//text
console.log(document.getElementById('app').lastChild);  
//text
```

`Node.nextSibling`寻找同一父节点下的紧跟其后的节点。

```js
console.log(document.getElementById('app').firstChild.nextSibling); 
//comment
```

`Node.previousSibling`寻找同一父节点下的紧跟的上一个节点。

```js
console.log(document.getElementById('app').firstChild.nextSibling.previousSibling);  
//text
```



## 遍历节点元素

- `Node.parentElement`：父元素，IE9 及以下不支持
- `Element.children`：子元素，IE7 及以下不支持
- `Element.childrenElemntCount = Element.children.length`，IE9 及以下不支持
- `Element.firstElementChild`：第一个子元素，IE9 及以下不支持
- `Element.lastElementChild`：最后一个子元素，IE9 及以下不支持
- `Element.nextElemntSibling`：下一个兄弟元素，IE9 及以下不支持
- `Element.previousElemntSibling`：上一个兄弟元素，IE9 及以下不支持

`Node.parentElement`寻找当前节点的父元素节点。

```html
<div id="box">
  我是文本节点
  <!-- 我是注释君 -->
  <h1>我是标题标签</h1>
  <a href="">我是超链接</a>
  <p>我是段落标签</p>
</div>

<script>
  const oP = document.getElementsByTagName('p')[0];
  console.log(oP.parentElement);
  //div#box.box
</script>
```

`Element.children`从一个节点里寻找子元素。

```js
console.log(document.getElementById('box').children);
//HTMLCollection(3) [h1, a, p]
```

`Element.childElementCount`和`Element.children.length`返回的长度结果是一样的。

```js
console.log(document.getElementById('box').children.length); //3
console.log(document.getElementById('box').childElementCount); //3
```

`Element.firstElementChild`返回元素的第一个子元素，没有则返回`null`。

```js
console.log(document.getElementById('box').firstElementChild); //h1
```

`Element.lastElementChild`返回元素的最后一个子元素，没有则返回`null`。

```js
console.log(document.getElementById('box').lastElementChild); //p
```

`Element.nextElementChild`返回同一父节点下的紧接的下一个元素。

```js
const oA = document.getElementsByTagName('a')[0];
console.log(oA.nextElementSibling); //p
```

`Element.previousElementChild`返回同一父节点下的紧接的上一个元素。

```js
const oA = document.getElementsByTagName('a')[0];
console.log(oA.previousElementSibling); //h1
```



## 节点属性

`Node.nodeName`查看节点名称。

```html
<div id="box">
  我是文本节点
  <!-- 我是注释君 -->
  <h1>我是标题标签</h1>
  <a href="">我是超链接</a>
  <p>我是段落标签</p>
</div>

<script>
  var div = document.getElementsByTagName('div')[0];
  console.log(document.nodeName); //#document
  console.log(div.nodeName); //DIV
  console.log(div.nodeName.toLowerCase()); //div
</script>
```

尝试更改节点名称，发现无法更改，只读。

```js
var div = document.getElementsByTagName('div')[0];
console.log(div.nodeName); //DIV
div.nodeName = 'P';
console.log(div.nodeName); //DIV
```

`Node.nodeValue`返回当前节点的值，值只能是字符串的文本或注释内容。

```js
console.log(div.firstChild.nodeValue); //我是文本节点
console.log(div.childNodes[1].nodeValue); //我是注释君
```

如果当前节点除了节点的值，还有元素节点，访问元素节点的值时为`null`。

```js
console.log(div.childNodes[3]); //<h1>我是标题标签</h1>
console.log(div.childNodes[3].nodeValue); //null

console.log(div.childNodes[5]); //<a href="">我是超链接</a>
console.log(div.childNodes[5].nodeValue); //null
```

`Node.nodeValue`也可以获取属性的值，跟`value`的结果一致。

```js
//属性节点
const div = document.getElementById('box');
console.log(div.getAttributeNode('id').nodeValue); //box
console.log(div.getAttributeNode('id').value); //box
```

尝试修改`Node.nodeValue`的值，发现节点的值是可以更改的。

```js
console.log(div.firstChild.nodeValue = '我是假的文本节点'); 
//我是假的文本节点
console.log(div.childNodes[1].nodeValue = '我是假的注释君'); 
//我是假的注释君
console.log(div.getAttributeNode('id').nodeValue = 'box1'); 
//box1
```

`Node.nodeType`可以查看节点类型。

```js
//元素节点   -> 1
//属性节点   -> 2
//文本节点   -> 3
//注释节点   -> 8
//document  -> 9
//DocumentFragment  -> 11
```

```js
console.log(div.nodeType); //1 元素节点
console.log(div.firstChild.nodeType); //3文本节点
console.log(div.childNodes[1].nodeType); //8注释节点
console.log(div.getAttributeNode('id').nodeType); //2属性节点
```

封装一个通过返回类型来判断找出找出子节点元素的方法。

```js
function elemChildren(node) {
  var arr = [],
    childItem;
  children = node.childNodes;

  for (var i = 0; i < children.length; i++) {
    childItem = children[i];
    if (childItem.nodeType === 1) {
      arr.push(childItem);
    }
  }
  return arr;
}

console.log(elemChildren(div));
//[h1, a, p]
```

封装遍历子元素的方法，把子节点元素写入到类数组中。

```js
function elemChildren(node) {
  var childItem,
    children = node.childNodes,
    len = children.length,
    temp = {
      length: 0,
      push: Array.prototype.push,
      splice: Array.prototype.splice
    };

  for (var i = 0; i < len; i++) {
    childItem = children[i];
    if (childItem.nodeType === 1) {
      temp.push(childItem);
    }
  }
  return temp;
}

console.log(elemChildren(div));
//Object(3) [h1, a, p, push: ƒ, splice: ƒ]
```

`Element.attributes`返回一个元素属性的结合。

```js
console.log(div.attributes);
//NamedNodeMap {0: class, 1: id, class: class, id: id, length: 2}
```

`Element.getAttributeNode`返回指定元素的指定属性节点。可以通过索引访问，也可以通过属性名去访问，访问属性的值时需要`Node.nodeValue`或者`value`拿到。

```js
console.log(div.attributes[1]); //id="box"
console.log(div.getAttributeNode('id')); //id="box"

console.log(div.getAttributeNode('id').nodeValue); //box
console.log(div.getAttributeNode('id').value); //box
console.log(div.attributes[1].nodeValue); //box
console.log(div.attributes[1].value); //box
```

`Element.getAttributeNode`返回的属性节点是可以更改值的。

```js
console.log(div.attributes[1].nodeValue = 'box2'); //box2
```

`Node.hasChildNodes`方法可以判断有没有子节点(文本节点也算)，返回值为布尔值。

```js
console.log(div.hasChildNodes()); //true
```





## DOM 结构树

Node原型为EventTarget原型为Object原型为 null。

- Attr
- Document
  - HTMLDocument
  - XMLDocument
- CharacterData(字符数据)
  - Text
  - Comment
- Element
  - XMLElement
  - HTMLElement
    - HTMLHeadElement
    - HTMLBodyElement
    - HTMLTitleElement
    - HTMLParagraphElement
    - HTMLInputElement
    - HTMLTableElement
    - 其他

document的原型是HTMLDocument，HTMLDocument的原型是Document，Document的原型是Node，Node的原型是EventTarget，EventTarget的原型是Object。Object的原型是Object.prototype。

```js
console.log(Object.getPrototypeOf(document));
//HTMLDocument {...}

console.log(Object.getPrototypeOf(Object.getPrototypeOf(document)));
//Document {…}

console.log(
  Object.getPrototypeOf(
    Object.getPrototypeOf(Object.getPrototypeOf(document))
  )
);
//Node {…}

console.log(
  Object.getPrototypeOf(
    Object.getPrototypeOf(
      Object.getPrototypeOf(Object.getPrototypeOf(document))
    )
  )
);
//EventTarget {...}

console.log(
  Object.getPrototypeOf(
    Object.getPrototypeOf(
      Object.getPrototypeOf(
        Object.getPrototypeOf(Object.getPrototypeOf(document))
      )
    )
  )
);
//Object
```

尝试寻找文本节点的原型。

```js
const div = document.getElementById('box');
const text = div.childNodes[0];
console.log(Object.getPrototypeOf(text));
//Text {...}
```

尝试寻找注释节点的原型。

```js
const div = document.getElementById('box');
const comment = div.childNodes[1];
console.log(Object.getPrototypeOf(comment));
//Comment {...}
```

尝试寻找文本节点和注释节点原型的原型。

```js
console.log(Object.getPrototypeOf(Object.getPrototypeOf(text)));
//CharacterData {...}
console.log(Object.getPrototypeOf(Object.getPrototypeOf(comment)));
//CharacterData {...}
```

尝试寻找文本节点和注释节点原型原型的原型。

```js
const div = document.getElementById('box');
const text = div.childNodes[0];
console.log(
  Object.getPrototypeOf(
    Object.getPrototypeOf(Object.getPrototypeOf(text))
  )
);
//Node {…}
```

尝试寻找各个元素节点的原型。

```js
const head = document.getElementsByTagName('head')[0];
console.log(Object.getPrototypeOf(head));
//HTMLHeadElement {…}

const body = document.getElementsByTagName('body')[0];
console.log(Object.getPrototypeOf(body));
//HTMLBodyElement {…}

const title = document.getElementsByTagName('title')[0];
console.log(Object.getPrototypeOf(title));
//HTMLTitleElement {…}

const p = document.getElementsByTagName('p')[0];
console.log(Object.getPrototypeOf(p));
//HTMLParagraphElement {…}

const input = document.getElementsByTagName('input')[0];
console.log(Object.getPrototypeOf(input));
//HTMLInputElement {…}

const table = document.getElementsByTagName('table')[0];
console.log(Object.getPrototypeOf(table));
//HTMLTableElement {…}

const a = document.getElementsByTagName('a')[0];
console.log(Object.getPrototypeOf(a));
//HTMLAnchorElement {…}

const h1 = document.getElementsByTagName('h1')[0];
console.log(Object.getPrototypeOf(h1));
//HTMLHeadingElement {…}

const my = document.getElementsByTagName('my')[0];
console.log(Object.getPrototypeOf(my));
//HTMLUnknownElement {…}
```

尝试寻找各个元素节点原型的原型。

```js
const head = document.getElementsByTagName('head')[0];
console.log(Object.getPrototypeOf(Object.getPrototypeOf(head)));
//HTMLElement {…}

const body = document.getElementsByTagName('body')[0];
console.log(Object.getPrototypeOf(Object.getPrototypeOf(body)));
//HTMLElement {…}

const title = document.getElementsByTagName('title')[0];
console.log(Object.getPrototypeOf(Object.getPrototypeOf(title)));
//HTMLElement {…}

const p = document.getElementsByTagName('p')[0];
console.log(Object.getPrototypeOf(Object.getPrototypeOf(p)));
//HTMLElement {…}

const input = document.getElementsByTagName('input')[0];
console.log(Object.getPrototypeOf(Object.getPrototypeOf(input)));
//HTMLElement {…}

const table = document.getElementsByTagName('table')[0];
console.log(Object.getPrototypeOf(Object.getPrototypeOf(table)));
//HTMLElement {…}

const a = document.getElementsByTagName('a')[0];
console.log(Object.getPrototypeOf(Object.getPrototypeOf(a)));
//HTMLElement {…}

const h1 = document.getElementsByTagName('h1')[0];
console.log(Object.getPrototypeOf(Object.getPrototypeOf(h1)));
//HTMLElement {…}

const my = document.getElementsByTagName('my')[0];
console.log(Object.getPrototypeOf(Object.getPrototypeOf(my)));
//HTMLElement {…}
```

尝试寻找某个元素节点原型原型的原型。

```js
const head = document.getElementsByTagName('head')[0];
console.log(
  Object.getPrototypeOf(
    Object.getPrototypeOf(Object.getPrototypeOf(head))
  )
);
//Element {…}
```

尝试寻找某个元素节点原型原型原型的原型。

```js
const head = document.getElementsByTagName('head')[0];
console.log(
  Object.getPrototypeOf(
    Object.getPrototypeOf(
      Object.getPrototypeOf(Object.getPrototypeOf(head))
    )
  )
);
//Node {…}
```

尝试寻找节点元素里的属性的原型。

```js
const div = document.getElementById('box');
const attr = div.attributes[0];
console.dir(Object.getPrototypeOf(attr));
//Attr {…}
```

尝试寻找节点元素里的属性原型的原型。

```js
console.dir(Object.getPrototypeOf(Object.getPrototypeOf(attr)));
//Node {…}
```



## 节点创建

节点的创建方法仅存在`Document`，不存在`Elemnet`和`HTMLElement`的原型上。`document`创建的节点引用临时存放在内存里，还没有挂载到DOM树上。

- `document.createElement()`：创建元素节点
- `document.createTextNode()`：创建文本节点
- `document.createComment()`：创建注释节点

创建元素节点。

```js
var div = document.createElement('div');
div.innerHTML = 123;
console.log(div)
```

创建文本节点。

```js
var text = document.createTextNode('woaini');
document.body.appendChild(text);
```

创建注释节点。

```js
var comment = document.createComment('woshizhushijun');
document.body.appendChild(comment);
```



## 节点增加

- `Node.appendChild(node)`：增加子节点，只有在`Node`原型上的方法。
- `Node.insertBefore(new, tar)`：指定位置插入子节点，只有在`Node`原型上的方法。

`Node.appendChild`总是在父级元素的子节点列表的最后面。

```js
var p = document.createElement('p');
document.body.appendChild(p);
```

`Node.appendChild`不仅有增加节点，还有剪切节点的功能。剪切功能能动态的改变dom结构，有着非常重要的作用。

```html
//此写法就可以将原来dom里的a标签剪切到div标签里
var a = document.getElementsByTagName('a')[0];
var div = document.createElement('div');
div.innerHTML = '<p>This is P</p>';
document.body.appendChild(div);

//之前的结构
<body>
  <a href="#">website</a>
  <div><p>This is P</p></div>
</body>

//剪切节点
div.appendChild(a);

//剪切后的结构
<body>
  <div>
    <p>This is P</p>
    <a href="#">website</a>
  </div>
</body>
```

`Node.insertBefore`，在父级`c`节点下的子节点`b`之前插入`a`节点。

```html
//插入之前
<div>
  <p></p>
</div>

<script>
  var div = document.getElementsByTagName('div')[0];
  var p = document.getElementsByTagName('p')[0];
  var a = document.createElement('a');
  a.href = '#';
  //首次插入
  div.insertBefore(a, p);
  
  //再次插入
  var h1 = document.createElement('h1');
  h1.innerHTML = 'This is h1.';
  div.insertBefore(h1, a);
</script>

//首次插入
<div>
  <a href="#"></a>
  <p></p>
</div>

//再次插入
<div>
  <h1>This is h1.</h1>
  <a href="#"></a>
  <p></p>
</div>
```

写一个`Node.insertAfter`方法，原理是找到下一个兄弟节点并插入在其前面，需要先排除父节点列表里的非元素节点，如果没有下一个兄弟节点时，可以直接`Node.appenedChild`进去。

```js
Node.prototype.insertAfter = function (tar, newElem) {
  var childrens = this.childNodes,
    childItem;

  for (var i = 0; i < childrens.length; i++) {
    childItem = childrens[i];
    if (childItem.nodeType !== 1) {
      this.removeChild(childItem);
    }
  }

  //有下一个兄弟节点时
  if (tar.nextSibling !== null) {
    this.insertBefore(newElem, tar.nextSibling);
  } else {
    //没有下一个兄弟节点时
    this.appendChild(newElem);
  }
};
```



## 节点删除

- `Node.removeChild()`：移除子节点
- `Node.remove()`：销毁节点，释放内存

`Node.removeChild`的移除子节点的写法是父节点调用执行，子节点作为参数传入。实际上从dom树上移除节点，但是没有真正的在内存中进行回收销毁，被移除的节点仍然保存在内存中。

```html
//删除之前
<div>
  <p></p>
</div>

<script>
  var div = document.getElementsByTagName('div')[0];
  var p = document.getElementsByTagName('p')[0];
  
  //removeChild有返回值，返回的是被dom移除的节点
  console.log(div.removeChild(p));
  //<p></p>
</script>

//删除之后
<div></div>
```

`Node.remove`销毁的写法是需要销毁的节点调用执行，不用传入参数，节点删除并销毁不会存入内存中。

```html
//删除之前
<div>
  <p></p>
</div>

<script>
  var div = document.getElementsByTagName('div')[0];
  var p = document.getElementsByTagName('p')[0];
  console.log(p.remove()); //undefined
</script>

//删除之后
<div></div>
```



## 节点文本

设置和获取元素的`HTML`。

- `Element.innerHTML` ，设置和获取元素的 HTML，`Element`和`HTMLElement`原型上的方法。
- `HTMLElement.innerText`，`HTMLElement`原型上的方法。

尝试打印节点的`innerHTML`，返回字符串内容。

```html
<div>
  <p></p>
</div>

<script>
  var div = document.getElementsByTagName('div')[0];
  var p = document.getElementsByTagName('p')[0];
  console.log(div.innerHTML); //<p></p>
</script>
```

尝试设置`innerHTML`内的值，会覆盖原来的字符串内容。使用`+=`语法可以追加内容，同样可以解析内容为html的内容。

```html
<div>
  <p></p>
</div>

<script>
  var div = document.getElementsByTagName('div')[0];
  var p = document.getElementsByTagName('p')[0];
  div.innerHTML = 'this is context.';
  div.innerHTML += ' <a href="#">this is after context.</a>';
</script>

//更改之后
<div>
  this is context.
  <a href="#">this is after context.</a>
</div>
```

尝试打印父节点内的`innerText`内容，它会过滤所有标签，仅仅打印文本内容。同样`+=`语句可以追加内容，但是追加html内容时只打印字符串而不会去解析html标签，原因是它将`<`或`>`解析为字符实体`&lt;`或`&gt;`。

```html
<div>
  <p>This is p</p>
  <h1>This is h1</h1>
</div>

<script>
  var div = document.getElementsByTagName('div')[0];
  console.log(div.innerText);
  //This is p This is h1
</script>
```



**注意点：**

- 父节点 HTML 不要写错
- 在`innerHTML`里 HTML 字符串不要写，旧版浏览器报错。
- document 写法 1：`document.body.innerHTML`
- document 写法 2：`document.documentElement.innerHTML`
- `innerHTML`元素内部的所有内容都会被删除掉
- `outterHTML`元素外部的所有内容都会删除替换

***设置`innerHTML`到底发生了什么?***

1. `innerHTML= '<h1>123</h1>'`
2. `<h1>123</h1>`解析为 HTML 文档结构
3. 用 DocumentFragment 将这个 HTML 文档结构变成 DOM 节点
4. 原本父结点上的所有内容都会被替换成这个 DOM 节点

以上侧面反映了`innerHTML`的性能并不高效，普通文本尽量避免使用`innerHTML`。

**安全问题：**

HTML5 和现代的新的浏览器都会阻止这种通过`innerHTML`嵌入 `script` 脚本的程序执行。插入纯文本的时候就不用`innerHTML`，应该使用`Node.textConent`，它创建了一个文本节点，不会去解析HTML，只会将文本插入到元素内部去。

`Node.textContent`可以赋值更改，但不能解析HTML，不能成为一个DOM节点，仅仅是一个文本节点。

```js
oBox.textContent = '10'; //浏览器显示10
oBox.textContent = '<h1>123</h1>'; //浏览器不解析显示<h1>123</h1>
```



关于`HTMLElement.innerText`，给元素渲染文本节点，专门服务于`HTML`，低于 IE11。与`textContent`的区别是

- `textContent`：获取所有元素的内容，如`<script>`和`<style>`，把非标签的内容全部剔除，显示非标签内容。
- `innerText`：只会获取给人看的内容，忽略`<br>`，`<style>`标签。会受到 CSS 的影响，导致回流，重新计算样式。

**总结：**

- `innerHTML`存在性能问题。
- `textContent`没有`innerHTML`功能那么好，`innerHTML`可以放 html 字符串，但有更好的性能不会解析 html 文档。

**关于使用：**

- 非 html 尽量用`textContent`, 能避免用`innerText`
- 避免使用`innerHTML`可以用`createElement`



## 节点替换

`Node.replaceChild`写法是父节点执行，参数1为新节点，参数2为被替换的节点。

```js
var div = document.getElementsByTagName('div')[0];
var h1 = document.getElementsByTagName('h1')[0];

var h2 = document.createElement('h2');
div.replaceChild(h2, h1);
```

## 属性新增

`Element.setAttribute`方法给节点元素新增属性名和属性值。

```js
var div = document.getElementsByTagName('div')[0];
div.setAttribute('id', 'box');

//<div id="box"></div>
```





## 属性取值

`Element.getAttribute`方法可以拿到节点元素定义的属性名的属性值。

```html
<div class="box"></div>

<script>
  var div = document.getElementsByTagName('div')[0];
  console.log(div.getAttribute('class')); //box
</script>
```

HTML5中获取元素自定义属性如`data-xxx`。可以通过`HTMLElement.dataset`属性去拿到(网页兼容性不及移动端，IE9及以下不支持)，也可以通过`ELement.getAttribute`方法去拿到。

```html
<div class="box" data-id="1001"></div>

<script>
  var div = document.getElementsByTagName('div')[0];
  console.log(div.getAttribute('data-id')); //1001
  console.log(div.dataset.id); //1001
</script>
```

## 子节点翻转

写一个程序可以实现父节点下的所有子节点进行逆序排列。

```html
<div id="box">
  <a href="#">333</a>
  <p>111</p>
  <h2>222</h2>
</div>

<script>
  var div = document.getElementById('box');
  Element.prototype.reverseElem = function () {
    var childNodes = this.childNodes,
      len = childNodes.length;

    console.log(childNodes, len);
    //NodeList(7) [text, a, text, p, text, h2, text] 7

    while (len--) {
      div.appendChild(childNodes[len]);
    }
  };

  div.reverseElem();
</script>

//最终结构如下
<div id="box">
  <h2>222</h2>
  <p>111</p>
  <a href="#">333</a>
</div>
```





## 文档碎片

`Document.createDocumentFragment`方法创建一个空白的文档片段。每次循环都新增插入节点元素，给浏览器渲染进程增加了负担，大量消耗性能，最好只进行一次回流操作。把循环计算好的的节点插入到文档片段，再将文档片段最终插入文档中。

``` js
var oUl = document.getElementById('list');
var oFrag = document.createDocumentFragment('div'),
  list = '';

for (var i = 0; i < 1000; i++) {
  list += `<li>${i}</li>`;
}
oFrag.innerHTML = list;
oUl.appendChild(oFrag);
```



## 日期对象

实例化日期对象。直接打印实例化的对象和直接执行`Date`都会打印时间。`Data`的原型的原型是`Object`。集成了`OBject.toString`方法。

```js
var date = new Date();
console.log(date);
//Sun Nov 27 2022 15:57:23 GMT+0800 (中国标准时间)

console.log(Date());
//与实例对象不一样的是Data() 会打印字符串形式
//Sun Nov 27 2022 15:57:23 GMT+0800 (中国标准时间)
 
console.log(date.toString());
//Sun Nov 27 2022 15:57:23 GMT+0800 (中国标准时间)
//与date.toString一样打印字符串形式
```

`Date.prototype.getTime()`返回一个时间的格林威治时间数值 (时间戳)。表示从 1970 年 1 月 1 日 0 时 0 分 0 秒（UTC，即协调世界时）距离该日期对象所代表时间的毫秒数。可以利用两个时间差来做很多事情。

```js
console.log(date.getTime());
// 1669537031974
```

当`new Date`实例化传入时间戳参数时就会返回该时间戳对应的时间的格林威治时间数值。它与`Date.prototype.setTime()`设置实例对象的时间的结果一致。

```js
var date = new Date(1669537031974);
console.log(date);
//Sun Nov 27 2022 16:17:11 GMT+0800 (中国标准时间)
date.setTime(1669537031974)
console.log(date);
//Sun Nov 27 2022 16:17:11 GMT+0800 (中国标准时间)
```

当`new Date`实例化传入以下参数时就会返回对应的时间的格林威治时间数值。也可以通过`setxxx`方法来设置同样的时间数值。也可以传入参数格式为`xxxx-xx-xx xx:xx:xx`的写法来设置时间数值。

```js
var date = new Date(2019, 3, 5, 20, 35, 6);
console.log(date);
//Fri Apr 05 2019 20:35:06 GMT+0800 (中国标准时间)

var date = new Date();
date.setFullYear(2019);
date.setMonth(3);
date.setDate(5);
date.setHours(20);
date.setMinutes(35);
date.setSeconds(6);
console.log(date);
//Fri Apr 05 2019 20:35:06 GMT+0800 (中国标准时间)

var date = new Date('2019-4-5 20:35:6');
console.log(date);
//Fri Apr 05 2019 20:35:06 GMT+0800 (中国标准时间)
```

`Date.prototype.getDate()`返回一个月中的哪一日（1-31）。

```js
console.log(date.getDate());
//27
```

`Date.prototype.getDay()`返回一周的第几天，0 表示星期天。(0-6)

```js
console.log(date.getDay());
//0
```

`Date.prototype.getMonth()`返回返回一个指定的日期对象的月份。月份是实际月份-1。 (1-12)

```js
console.log(date.getMonth());
//10 
```

`Date.prototype.getFullYear()`根据本地时间返回指定的年份。

```js
console.log(date.getFullYear());
//2021
```

`Date.prototype.getMinutes()`返回本地时间的分钟数。(1-59)

```js
console.log(date.getMinutes());
//52
```

`Date.prototype.getMilliseconds()`返回本地时间的毫秒数。(0-999)

```js
console.log(date.getMilliseconds());
//692
```









## 滚动距离/高度

返回文档在窗口左上角水平和垂直方向滚动的像素。如点击按钮将文档窗口在水平和垂直方向各滚动 100px 。

给浏览器页面定义大数值宽高直至上下出现滚动条。当没有移动滚动条时，控制台打印`pageXOffset`和`pageYOffset`的数值为0，当随意移动时数值的大小为滚动条移动的长度。

```html
<div id="box" style="width: 5000px; border: 1px solid #000">
  <a href="#">333</a>
  <p>111</p>
  <h2>222</h2>
  <h2>222</h2>
  <h2>222</h2>
  <h2>222</h2>
  <h2>222</h2>
  ...
</div>
```

当滚动条往下拉时，页面往上滚动，滚动距离是可视窗口的顶部到页面最顶端的距离。

<img src="http://note-img-bed.dt-code.fun//image-20221128125718758.png" alt="image-20221128125718758"  />

常规滚动条的距离有`Window.pageXOffset`和`Window.pageYOffset`属性相等于`scrollX`和`scrollY`属性(不常见)，IE9/IE8 及以下不支持，支持的属性对应是`document.body.scrollLeft`和`document.body.scrollTop`。对应`document.documentElement.scrollLeft`和`document.documentElement.scrollTop`属性也同样支持。

| Browsers                              | IE6789b(怪异模式) | IE678/0/FFs(标准模式) | IE9s      | C/Sbs   | O/FFb   | O/FFs   |
| ------------------------------------- | ----------------- | --------------------- | --------- | ------- | ------- | ------- |
| `document.documentElement.scrollLeft` | value:0           | Yes                   | Yes       | value:0 | value:0 | Yes     |
| `document.body.scrollLeft`            | Yes               | value:0               | value:0   | Yes     | Yes     | value:0 |
| `window.pageXOffset`                  | undefined         | undefined             | Yes       | Yes     | Yes     | Yes     |
| `window.scrollX`                      | undefined         | undefined             | undefined | Yes     | Yes     | Yes     |

表格中发现对各个IE版本都存在严重的兼容性问题。

> **注：**
>
> - IE6789b：怪异模式
> - IE678/0/FFs：IE678/Opera/FireFox standart 标准模式
> - IE9s： IE9 standart 标准模式
> - C/Sbs：Chrome/Safari standard 怪异/标准模式
> - O/FFb：Opera/FireFox 怪异模式
> - O/FFs：Opera/FireFox 标准模式

封装兼容性写法。做兼容性时利用`document.documentElement`和`document.body`的`scrollTop`或`scrollLeft`合体。

```js
/**
 * 封装兼容IE8&IE9以下的滚动条距离函数
 * getScrollOffset()
 */
function getScrollOffset() {
  if (window.pageXOffset) {
    return {
      left: window.pageXOffset,
      top: window.pageYOffset
    }
  } else {
    return {
      left: document.body.scrollLeft + document.documentElement.scrollLeft,
      top: document.body.scrollTop + document.documentElement.scrollTop
    }
  }
}
getScrollOffset().top
```



## 怪异&标准

浏览器有自己各自的兼容模式如怪异模式和标准模式，浏览器本身具有向后兼容的机制。怪异模式是厂商自己定义的标准，标准模式是w3c的标准。

```
document.compatMode -> BackCompat 怪异模式
document.compatMode -> CSS1Compat 标准模式
```

在文档上方声明时可以说明是怪异或者标准模式。

```html
//标准模式
<!DOCTYPE html>

//怪异模式
<!DOCTYPE html>去掉时
```



## 可视区域

获取浏览器可视区域的尺寸(窗口的尺寸宽高)。`clientWidth`不包含滚动条，`innerWidth`包含滚动条。

| Browsers                               | IE6789b(怪异模式) | IE678/0/FFs(标准模式) | IE9s | C/Sbs | O/FFb | O/FFs |
| -------------------------------------- | ----------------- | --------------------- | ---- | ----- | ----- | ----- |
| `document.body.clientWidth`            | Yes               | No                    | No   | No    | No    | No    |
| `document.documentElement.clientWidth` | No                | Yes                   | No   | No    | No    | No    |
| `window.innerWidth`                    | No                | No                    | Yes  | Yes   | Yes   | Yes   |

兼容性封装一个获取可视区域尺寸的函数。

```js
/**
 * 封装兼容IE8&IE9以下的可视区域宽高尺寸的函数
 * 原理：判断模式是否为怪异
 */
function getViewportSize() {
  if (window.innerWidth) {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    }
  } else {
    if (document.compatMode === 'BackCompat') {
      return {
        width: document.body.clientWidth,
        height: document.body.clientHeight
      }
    } else {
      return {
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight
      }
    }
  }
}

getViewportSize().width
```



## 页面宽高

`document.body.scrollWidth`获取页面的宽度和高度，也可以获取一个盒子的宽度和高度`div.scrollWidth`。假如页面宽高的数值比可视窗口还大时，会显示滚动条，实际上溢出看不见的部分也是页面的内容。可以理解为滚动条滚动距离加上可视窗口大小就等于页面(或一个大盒子)的宽高。

![image-20221128143516481](http://note-img-bed.dt-code.fun//image-20221128143516481.png)

| Browsers                               | IE6789b(怪异模式) | IE678/0/FFs(标准模式) | IE9s | C/Sbs | O/FFb | O/FFs |
| -------------------------------------- | ----------------- | --------------------- | ---- | ----- | ----- | ----- |
| `document.body.scrollWidth`            | No                | Yes                   | No   | No    | No    | No    |
| `document.documentElement.scrollWidth` | Yes               | No                    | No   | No    | No    | No    |

假如给body标签定义高度和边框，在控制台打印`document.body.scrollHeight`时显示结果`1000`，说明`scrollHeight`不包含边框。

```html
<body style="height: 1000px; border: 1px solid #000"></body>
```

假如给body标签定义高度和`margin`，在控制台打印`document.body.scrollHeight`时显示结果`1000`，说明`scrollHeight`不包含外边距。

```html
<body style="height: 1000px; margin: 1px 0"></body>
```

假如给body标签定义高度和`padding`，在控制台打印`document.body.scrollHeight`时显示结果`1002`，说明`scrollHeight`包含内边距。

```html
<body style="height: 1000px; padding: 1px 0"></body>
```

兼容性封装一个获取页面宽高(盒子宽高)尺寸的函数。：

```js
function getScrollSize() {
  if (document.body.scrollWidth) {
    return {
      width: document.body.scrollWidth,
      height: document.body.scrollHeight
    }
  } else {
    return {
      width: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight
    }
  }
}

getScrollSize().width
```

## 盒子信息

![image-20221128154046238](http://note-img-bed.dt-code.fun//image-20221128154046238.png)

`Element.getBoundingClientRect`方法返回一个`DOMRect`对象，该对象包含盒子的大小和相对于视口的位置信息。

```html
<style>
  #box {
    top: 200px;
    left: 200px;
    width: 200px;
    height: 200px;
    background-color: azure;
  }
</style>
<div id="box"></div>
```

当控制打印时`div.getBoundingClientRect`返回一个对象，包括以下属性。

```js
/**
 * DOMRect {
 *   x: 8,
 *   y: 8,
 *   width: 200,
 *   height: 200,
 *   top: 8,
 *   left: 8,
 *   right: 208,
 *   bottom: 208
 * }
 */
```

当给盒子设置外边距`margin: 10px;`时，会影响位置和但不影响盒子大小。

```js
/**
 * DOMRect {
 *   x: 18,
 *   y: 10,
 *   width: 200,
 *   height: 200,
 *   top: 10,
 *   left: 18,
 *   right: 218,
 *   bottom: 210
 * }
 */
```

当给盒子设置内边距`padding: 10px`时，会不影响位置和但影响盒子大小。

```js
/**
 * DOMRect {
 *   x: 8,
 *   y: 8,
 *   width: 220,
 *   height: 220,
 *   top: 8,
 *   left: 8,
 *   right: 228,
 *   bottom: 228
 * }
 */
```

兼容性问题，在IE浏览器里，`DOMRect`对象并没有`width`和`height`属性。但是还是可以通过计算来获取宽高的值，如盒子宽度`width = right - x`。

`Element.getBoundingClientRect`方法还存在一个不实时的问题，所以少用。

```js
var info = box.getBoundingClientRect();
box.style.width = '400px';

console.log(info);
//打印的宽度仍然是200px
//DOMRect {x: 8, y: 8, width: 220, height: 220, …}
```





## 偏移距离

`HTMLElement.offsetTop`或`HTMLElement.offsetLeft`返回相对于父元素节点顶部内边距(左或上)的距离。

![image-20221128230709545](http://note-img-bed.dt-code.fun//image-20221128230709545.png)

使用定位布局时，说明父级元素有定位时，`offsetTop`或`offsetLeft`会找当前父级元素相对的偏移距离，如100。

```html
<style>
  .parent {
    position: relative;
    top: 100px;
    left: 100px;
    width: 300px;
    height: 300px;
    background-color: #999;
  }
  .son {
    position: absolute;
    top: 100px;
    left: 100px;
    width: 100px;
    height: 100px;
    background-color: azure;
  }
</style>
<div class="parent">
  <div class="son"></div>
</div>
<script>
  var son = document.getElementsByClassName('son')[0];
	console.log(son.offsetLeft); //100
</script>
```

使用非定位的排布方式时。父级元素没有定位时，会一直往上查找，直到找到可视区域的边框相对的偏移距离，如200。

```html
<style>
  body{ margin: 0; }
  .parent {
    margin: 100px;
    width: 300px;
    height: 300px;
    background-color: #999;
    /* BFC一下，防止margin合并 */
    overflow: hidden;
  }

  .son {
    width: 100px;
    height: 100px;
    margin: 100px;
    background-color: azure;
  }
</style>
<div class="parent">
  <div class="son"></div>
</div>
<script>
  var son = document.getElementsByClassName('son')[0];
	console.log(son.offsetLeft); //200
</script>
```



## 定位父级

`HTMLElement.offsetParent`返回一个有定位的父级元素。假如给子元素和父元素都定义了定位，当查找子元素的`offsetParent`时，返回父元素节点。

```html
<style>
  .parent {
    position: relative;
    top: 100px;
    left: 100px;
    width: 300px;
    height: 300px;
    background-color: #999;
  }
  .son {
    position: absolute;
    top: 100px;
    left: 100px;
    width: 100px;
    height: 100px;
    background-color: azure;
  }
</style>
<div class="parent">
  <div class="son"></div>
</div>
<script>
	var son = document.getElementsByClassName('son')[0];
  console.log(son.offsetParent);
  //<div class="parent"></div>
</script>
```

如果父元素没有定位的情况时则打印 body 元素。

```js
console.log(parent.offsetParent);
//<body>...</body>
```

封装一个不管父级元素是否有定位的，查看有定义定位的父子盒子到页面边缘的距离方法。有定义定位时，返回的结果数值会包含父子元素定位偏移的距离。没有定义时，则不包含。

![image-20221128231144325](http://note-img-bed.dt-code.fun//image-20221128231144325.png)

```js
function getElemDocPosition(el) {
  //找到有定位的父级盒子
  var parent = el.offsetParent,
    //找到当前盒子左侧/上侧到页面左侧/上侧的距离
    offsetLeft = el.offsetLeft,
    offsetTop = el.offsetTop;

  // 如果parent存在
  while (parent) {
    // 循环出来的parent是定位元素
    offsetLeft += parent.offsetLeft;
    offsetTop += parent.offsetTop;
    //重新赋值parent，找到外层盒子继续加
    parent = parent.offsetParent;
  }

  return {
    left: offsetLeft,
    top: offsetTop
  }
}

getElemDocPosition(son);
//数值包含父元素的top,left数值和子元素的top,left相加的结果
//{left: 230, top: 230}
```



## 滚动条

操作滚动条的方法有`window.scroll`和`window.scrollTo`，滚动到多少跳至目标位置，返回值默认是`undefined`。

- `window.scroll(x, y)`
- `window.scrollTo(x, y)`

还有方法`window.scrollBy`，每次滚动多少(累加)，正数往上，负数往下，应用如小说阅读器自动滚动功能。

- `window.scrollBy(x, y)`



## 样式操作

DOM 间接操作(操作内联样式)CSS。

```js
oDiv.style.width = '200px';
```

如果行间样式/内联样式没有填写属性的情况访问不了。

```js
console.log(oDiv.style.width); //''
```

除了`Element.style`，`Window.getComputedStyle`方法可以获取样式元素的值。但是存在兼容性问题，IE8及以下不支持。返回的`style`是一个实时的 [`CSSStyleDeclaration`](https://developer.mozilla.org/zh-CN/docs/Web/API/CSSStyleDeclaration) 对象，当元素的样式更改时，它会自动更新本身。

```js
var box = document.getElementById('box');
console.log(box.style);
//CSSStyleDeclaration {accentColor: '', additiveSymbols: '', …}
console.log(window.getComputedStyle(box, null));
//CSSStyleDeclaration {0: 'accent-color',  …}
```

`elem.currentStyle`可以解决低版本兼容性。

```js
//没设置的样式默认值并被getComputedStyle函数查询到
//此方法获取属性值比较准确
window.getComputedStyle(elem, null)[prop];
```

企业级兼容性封装，获取内联样式属性的方法。

```js
/**
 * 获取元素属性
 * 避免使用offsetWidth&offsetHeight
 * @elem 元素
 * @prop 属性
 */
function getStyles(elem, prop) {
  //检测getComputedStyle是否存在
  if (window.getComputedStyle) {
    //存在，打印具体属性值
    if (prop) {
      return window.getComputedStyle(elem, null)[prop];
    }
    //不存在，打印集合
    return window.getComputedStyle(elem, null);
  } else {
    if (prop) {
      return elem.currentStyle[prop];
    } else {
      return elem.currentStyle;
    }
  }
}

getStyles(div, 'height');
```

在JS运行相关时，定义一个点击事件，每次点击实时获取宽度，并设置增加宽度。假如用`offsetWidth`来获取实时的宽度，会存在精度问题，它会包含`margin`的值，企业级解决方法是用封装的`getStyles`方法去获取实时的宽高的值，避免使用`offsetWidth`来获取。

```js
var box = document.getElementsByClassName('box')[0];
box.onclick = function () {
  // var width = this.offsetWidth;
  //返回带单位的字符串 如 '100px' 在用parseInt()截取一下
  var width = parseInt(getStyles(this, 'width'));
  this.style.width = width + 10 + 'px';
}
```

`Window.getComputedStyle`方法的第二个参数的名称可以获取伪元素的属性。

```html
<style>
  #box {
    width: 100px;
    height: 100px;
    background-color: lightslategray;
  }
  #box::after {
    content: '';
    display: block;
    width: 50px;
    height: 50px;
    background-color: lightpink;
  }
</style>
<div id="box"></div>
<script>
  var box = document.getElementById('box');
	console.log(window.getComputedStyle(box, 'after').width); //50px
</script>
```





