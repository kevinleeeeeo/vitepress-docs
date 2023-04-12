# `CSS3`

## 历史

`CSS`的官方定义是，指定文档该如何呈现给用户的一门**语言**，不是编程语言，只是层叠样式表。

**关于`CSS3`：**

它是`CSS2.1`的升级版本，在原有基础上增加了很多功能，相应的语法，模块，且所有主流浏览器对它的兼容性更加友好, `IE10`完美支持，所有手机端的浏览器都在用响应式布局，全面支持`CSS3`。

**关于`HTML`:**

`1990`年，第一图灵奖获得者`Tim Berners-Lee`发明了超文本标记语言，作为结构化标记语言，描述文档的各个部分。

`1993`年，马克·安德森开发了互联网历史上第一个获普遍使用和能够显示图片的网页浏览器，大量的社会资源涌入并对标记语言元素有更细致的要求，刚开始时，没有相应的规范，可以大量使用标签定义字体大小，颜色，层层嵌套，导致页面代码过多时，结构性非常差，代码冗余大，对搜索引擎不友好。

为了让网页更简单，代码更清晰，解构更合理，又可以展示更优质的网页效果，`CSS`的出现解决了当时的这些需求。

**制定组织：**

- `Adobe System`
- `Apple`
- `Google`
- `IBM`
- `Mozilla`
- `Microsoft`
- `Sun`

**兼容性：**

浏览器厂商以前就一直在实施`CSS3`，虽然它还未成为真正的标准，但却提供了针对浏览器的前缀：

| 浏览器厂商            | 写法       |
| --------------------- | ---------- |
| Chrome（谷歌浏览器）  | `-webkit-` |
| Safari（苹果浏览器）  | `-webkit-` |
| Firefox（火狐浏览器） | `-moz-`    |
| lE（IE浏览器）        | `-ms-`     |
| Opera（欧朋浏览器）   | `-O-`      |



## 概念

**文档：**一个信息集合，非仅仅是一个文件。

**用户代理(`UA`)：**文档呈现给用户的程序，如浏览器。



## 版本

- 1996年12月：`CSS 1.0`, 不用标签而改用样式去定义文字。
- 1998年5月：`CSS 2.0`, 实现层叠样式。
- 2004年2月：`CSS 2.1`，基于`2.0`, 废弃不兼容的属性如文本阴影。
- 2010年：`CSS 3.0`，向后兼容，被拆分为各个小模块，对新功能进行模块新增。



## 新增模块

每一个模块都有于`CSS2`中额外增加的功能，以及向后兼容。

- 选择器
- 盒模型
- 背景和边框
- 文字特性
- 2D/3D转换
- 动画
- 多列布局
- 用户界面



## 选择器

**属性选择器**

CSS **属性选择器**通过已经存在的属性名或属性值匹配元素。

```html
<ul>
  <li><a href="#internal">Internal link</a></li>
  <li><a href="http://example.com">Example link</a></li>
  <li><a href="#InSensitive">Insensitive internal link</a></li>
  <li><a href="http://example.org">Example org link</a></li>
</ul>
```

```css
/* 以 "#" 字符串开头的页面本地链接 */
a[href^="#"] {
  background-color: gold;
}

/* 包含 "example" 字符串的链接 */
a[href*="example"] {
  background-color: silver;
}

/* 包含 "insensitive" 的链接，不区分大小写 */
a[href*="insensitive" i] {
  color: cyan;
}

/* 以 ".org" 字符串结尾的链接 */
a[href$=".org"] {
  color: red;
}

/* 存在 class 属性并且属性值包含以空格分隔的"active"的<a>元素 */
li[class~="active"] a {
  color: orange;
}
```

**伪类选择器**

```css
/* 权重比html{}更高 */
:root{ background-color: orange; }

/* 匹配不符合一组选择器的元素 */
:not(p){ background-color: orange; }

/* 匹配没有子元素的元素 子元素只可以是元素节点或文本（包括空格） */
div:empty { background: lime; }

/* 代表一个唯一的页面元素 (目标元素)，其id 与当前 URL 片段匹配 */
/* http://www.example.com/index.html#section2 */
:target { border: 2px solid black; }
```

**UI元素伪类选择器**

```css
/* 划过之后的状态 */
:hover{}

/* 聚集之后的状态 */
:focus{}

/* 元素激活 鼠标按需没松开 */
:active{}

/* 任何被启用的（enabled）元素 */
input:enable{}

/* 表示任何被禁用的元素 */
input:disable{}

/* 表示元素不可被用户编辑的状态（如锁定的文本输入框）*/
input:read-only{}

/* 表示一组相关元素中的默认表单元素 */
input:default{}

/* 表示任何处于选中状态的radio(<input type="radio">), checkbox */
input:checked{}

/* 表示状态不确定的表单元素 */
input:indeterminate{}
```

**伪元素选择器**

会选中某 `block-level element`（块级元素）第一行的第一个字母，并且文字所处的行之前没有其他内容。

```css
p::first-letter { font-size: 130%; }
```

选中在某 `block-level element` （块级元素）的第一行应用样式。第一行的长度取决于很多因素，包括元素宽度，文档宽度和文本的文字大小。

```css
::first-line{ background-color: cyan; }
```

被用户高亮的部分（比如使用鼠标或其他选择设备选中的部分。

```css
::selection { background-color: cyan; }
```



**关系选择器**

后代选择器 通常用单个空格`()`字符表示组合了两个选择器。

```css
ul.my-things li { margin: 2em; }
```

子选择器 当使用  `>` 选择符分隔两个元素时，它只会匹配那些作为第一个元素的直接后代 (子元素) 的第二元素。

```css
div > span { background-color: DodgerBlue; }
```

相邻兄弟选择器 介于两个选择器之间，当第二个元素紧跟在第一个元素之后，并且两个元素都是属于同一个父元素的子元素，则第二个元素将被选中。

```css
img + p { font-weight: bold; }
```

兄弟选择器 弟选择符，位置无须紧邻，只须同层级，`A~B` 选择`A`元素之后所有同层级`B`元素。

```css
p ~ span { color: red; }
```





## 背景

`background-attachment`背景图像的位置是在视口内固定，或者随着包含它的区块滚动。

```css
/* 固定背景图片 相对于当前视口 */
background-attachment: scroll; /* 不包含border */
background-attachment: fixed; /* 包含border */

/* 图片随滚动条滚动时一起滚动 相对于文本 */
background-attachment: local;
```

` background-origin` 规定了指定背景图片`background-image` 属性的原点位置的背景相对区域。当使用 `background-attachment `为 `fixed `时，该属性将被忽略不起作用。

```css
/* 背景图片的摆放以 border 区域为参考 */
background-origin: border-box;

/* 背景图片的摆放以 padding 区域为参考 */
background-origin: padding-box;

/* 背景图片的摆放以 content 区域为参考 */
background-origin: content-box;
```

`background-clip` 裁剪背景图 是否延伸到边框、内边距盒子、内容盒子下面。

![background-clip](http://note-img-bed.dt-code.fun//background-clip.gif)

```css
/* 背景延伸至边框外沿（但是在边框下层） */
background-clip: border-box;

/* 背景延伸至内边距（padding）外沿。不会绘制到边框处 */
background-clip: padding-box;

/* 背景被裁剪至内容区（content box）外沿 */
background-clip: content-box;

/* 背景被裁剪成文字的前景色 */
background-clip: text;
```



## 边框

`border-image` 允许在元素的边框上绘制图像。

```css
/* 引用资源 */
border-image-source: url(...);

/* 切割比例(1-100) */
border-image-slice: 100%;
```

**切割原理：**

![image-20220622141056376](http://note-img-bed.dt-code.fun//image-20220622141056376.png)





## 文本

`overflow-wrap`用来说明当一个不能被分开的字符串太长而不能填充其包裹盒时，为防止其溢出，浏览器是否允许这样的单词中断换行。

![overflow-wrap](http://note-img-bed.dt-code.fun//overflow-wrap.gif)

**文本多列布局**，`columns`属性用来设置元素的列宽和列数。

![colunmns](http://note-img-bed.dt-code.fun//colunmns.gif)



**渐变图像**

`CSS` 函数 `repeating-linear-gradient()` 创建一个由重复线性渐变组成的`<image>`。

```css
/* 一个倾斜 45 度的重复线性渐变，
   从蓝色开始渐变到红色 */
repeating-linear-gradient(45deg, blue, red);

/* 一个从右下角到左上角的重复线性渐变，
   从蓝色开始渐变到红色 */
repeating-linear-gradient(to left top, blue, red);

/* 一个由下至上的重复线性渐变，
   从蓝色开始，40% 后变绿，
   最后渐变到红色 */
repeating-linear-gradient(0deg, blue, green 40%, red);
```

 `radial-gradient()`  函数创建了一个图像，该图像是由从原点发出的两种或者多种颜色之间的逐步过渡组成。它的形状可以是圆形（`circle`）或椭圆形（`ellipse`）。



##  兼容

可以快速查询`CSS`属性是否存在兼容性问题的[网址](https://caniuse.com/?search=box-sizing)。





## HSL

***什么是HSL？***

人们设计出了 `HSL` 色彩空间，来更加直观的表达颜色。`HSL`是色相（`Hue`）、饱和度（`Saturation`）和亮度（`Lightness`）这三个颜色属性的简称。

- 色相（`Hue`）是色彩的基本属性，就是人们平常所说的颜色名称，如紫色、青色、品红等等。我们可以在一个圆环上表示出所有的色相。 
- 色环上的 0°、120°、240° 位置，分别对应了 `RGB` 模型的红、绿、蓝三原色。原色两两混合形成了二次色。比如黄色（60°）就是由红色和绿色混合而成；蓝色和绿色则相加形成青色（180°）；品红（300°）则由红蓝两色组成。
- 原色和二次色之间，还有各种丰富的色相过渡，比如 270° 的紫色介于品红和蓝色之间。30° 的橙色则是由红色黄色混合而成。
- 饱和度（`Saturation`）是指色彩的纯度，饱和度越高色彩越纯越浓，饱和度越低则色彩变灰变淡。
- 亮度（`Lightness`）指的是色彩的明暗程度，亮度值越高，色彩越白，亮度越低，色彩越黑。 

 我们把色相（`Hue`）、饱和度（`Saturation`）和亮度（`Lightness`）三个属性整合到一个圆柱中，就形成了 `HSL` 色彩空间模型。 



在`CSS3`属性中的写法：

```css
/* 0度/360度 -> 红色(赤色) */
/* 60度 -> 橙黄 */
/* 120度 -> 绿色 */
/* 180度 -> 青色 */
/* 240度 -> 蓝色 */
/* 300度 -> 紫色 */
background-color: hsl(60角度, 50%饱和度, 50%透明度);
```

> 补充：背景图渐变色拾取色[网址](https://projects.verou.me/css3patterns/)，可以拾取好看的颜色和花样。



## 盒子模型

`box-sizing`属性定义如何计算一个元素的总宽度和总高度。



**盒子模型中有:**

- `W3C`盒子模型(标准盒模型)
- `IE`盒子模型(怪异盒模型)

根据 `W3C` 的规范，元素内容占据的空间是由 `width` 属性设置的，而内容周围的 `padding` 和 `border` 值是另外计算的；

而在`IE`盒子模型的模式下，浏览器的`width`属性不是内容的宽度，而是内容，内边距，边框宽度的总和;

 `overflow-x`属性，当一个块级元素的内容在水平方向发生溢出时，`CSS`属性 `overflow-x` 决定应该截断溢出内容，或者显示滚动条，或者直接显示溢出内容。 

`resize`属性重新定义元素尺寸，如调整`<textarea>`标签元素的尺寸大小。

```css
/* 默认 */
resize: scroll;

/* 元素不能被用户缩放 */
resize: none;

/* 允许用户在水平和垂直方向上调整元素的大小 */
resize: both;

/* 允许用户在水平方向上调整元素的大小 */
resize: horizontal;

/* 允许用户在垂直方向上调整元素的大小 */
resize: vertical;
```



## 布局

传统布局存在的缺陷是用户访问浏览器时，如浏览器可视区域宽度变小时，内容不会完整的展示，而仅展示内容的一部分，造成用户体验不佳。弹性布局(`Flex Box`)的方案解决以上弊端，多个浏览器良好支持，它是一个一维布局，只能够一次处理一个维度上的元素布局。



## 响应式

`css3`的媒体查询

`@media`属性可用于基于一个或多个媒体查询的结果来应用样式表的一部分。必须置于代码的顶层，媒体查询设备的某种条件是否成立。

```css
/* and 同时成立 */
/* only 其中之一成立 */ 
/* not 取反 */
/* all 所有设备  */
/* print 打印设备 */
/* screen 平板设备 */
@media screen and (max-width: 1200px) and (min-width: 900px) {
  article {
    padding: 1rem 3rem;
  }
}
```

```css
/* 设备竖屏或横屏时 */
@media screen and (orientation: landscape) {
  article {
    padding: 1rem 3rem;
  }
}
```

`link`标签引入媒体查询。

```html
<link media="(max-width: 1200px) and (min-width: 900px)"></link>
```

`import`关键字引入媒体查询。

```html
<style>
  @import url(css/index.css);
</style>
```

`<link>`引入是异步加载的，通过预加载的方式(已经下载了该资源)是不会阻塞渲染，并且并不会影响`window.onload`事件的触发，当媒体查询的语句成立时才采用样式，`@import`时先下载外联文件再`import`加载。





