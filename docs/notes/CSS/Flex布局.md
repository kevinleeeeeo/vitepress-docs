# `Flex` 布局

## 学习目标

- 能够说出布局原理
- 能够使用常用属性
  - 父项
  - 子项

## 概念

2009 年，`W3C`提出了一种新的方案—-`Flex`布局，可以简便、完整、响应式地实现各种页面布局。目前，它已经得到了所有浏览器的支持，这意味着，现在就能很安全地使用这项功能。`Flex`布局将成为未来布局的首选方案。

**传统布局与`flex`布局的区别：**

- 传统布局
  - 兼容性好
  - 布局繁琐
  - 局限性，不能在移动端有很好的布局
- `flex`弹性布局
  - 操作方便，布局极为简单，移动端应用广泛
  - PC 端浏览器支持较差
  - `IE11`或更低版本，不支持或仅部分支持



## 常用属性

```html
<div>
  <span></span>
  <span></span>
  <span></span>
</div>
```

`display: flex`

父元素定义时可以使子元素行内元素如`span`拥有大小并按照浮动的形式排列，此操作节省浮动清除。

![image-20220214205114739](http://note-img-bed.dt-code.fun/image-20220214205114739.png)

**等分**

利用子元素里设置`flex: 1`可以设置一等分、二等分，三等分等。

`justify-content`

```css
/* 对齐方式 */
justify-content: center;     /* 居中排列 */
justify-content: start;      /* 从行首开始排列 */
justify-content: end;        /* 从行尾开始排列 */
justify-content: flex-start; /* 从行首起始位置开始排列 */
justify-content: flex-end;   /* 从行尾位置开始排列 */
justify-content: left;       /* 一个挨一个在对齐容器得左边缘 */
justify-content: right;      /* 元素以容器右边缘为基准，一个挨着一个对齐, */

/* 基线对齐 */
justify-content: baseline;
justify-content: first baseline;
justify-content: last baseline;
```

**展示效果：**

![image-20220214211341297](http://note-img-bed.dt-code.fun/image-20220214211341297.png)

## 布局原理

`flex box `即 弹性布局，用来为盒装模型提供最大的灵活性，任何一个容器都可以指定为`flex`布局。

- 当为父盒子设为`flex`布局后，子元素的`float`, `clear`, `vertical-align`属性将失效。
- 伸缩布局 = 弹性布局 = 伸缩盒布局 = 弹性盒布局 = `flex`布局

采用`flex`布局的元素，称为`flex`容器，它所有子元素自动称为容器的成员，称为`flex`项目。

- 如`div`就是`flex`父容器
- 如`span`就是子容器`flex`项目
- 子容器可以横向排列也可以纵向排列

**总结：** 通过给父盒子添加`flex`属性，来控制子盒子的位置和排列方式。

## 父项属性

以下由 6 个属性对父元素设置的：

- `flex-direction`：设置主轴方向
  - `flex-direction: row;`：默认从左到右
  - `flex-direction: row-reverse;`：从右到左
  - `flex-direction: column;`：从上到下
  - `flex-direction: column-reverse;`：从下到上
- `justify-content`：设置主轴上的子元素排列方式
  - `justify-content: flex-start;` ：默认值从头部开始，如果主轴`x`轴，则从左到右
  - `justify-content: flex-end;` ：从尾部部开始排列
  - `justify-content: center;` ：从主轴剧中对齐(如果主轴是`x`轴则水平居中)
  - `justify-content: space-around;` ：平分剩余空间
  - `justify-content: space-between;` ：先两边贴边再平分剩余空间
- `flex-wrap`：设置子元素是否换行
  - `flex-wrap: nowrap;`：默认情况不换行，缩小子元素宽度硬塞
  - `flex-wrap: wrap;`：换行
- `align-content`：设置侧轴上的子元素的排列方式(多行)
- `align-items`：设置侧轴上的子元素排列方式(单行)
  - `align-items: flex-start;`：侧轴默认从上到下
  - `align-items: flex-end;`：侧轴从下到上
  - `align-items: center;`：侧轴居中(垂直居中)
  - `align-items: stretch;`：侧轴拉伸
- `flex-flow`：复合属性，相当于同时设置了`flex-direction`和`flex-wrap`
  - `flex-direction: column; flex-wrap: wrap;`相当于`flex-flow: column wrap;`

**关于主轴和侧轴：**

在`flex`布局中，分为主轴和侧轴两个方向，行列或`x`轴,`y`轴。

- 默认主轴方向就是`x`轴方向，水平向右
- 默认侧轴方向就是`y`轴方向，水平向下

<img src="http://note-img-bed.dt-code.fun/image-20220214213357664.png" alt="image-20220214213357664" style="zoom:50%;" />

**关于主轴侧轴更改时水平和垂直居中(单行)：**

![image-20220214222145609](http://note-img-bed.dt-code.fun/image-20220214222145609.png)

**关于主轴更改多行子元素排列(单行无效)：**

![image-20220214223756173](http://note-img-bed.dt-code.fun/image-20220214223756173.png)

## 子项属性

子元素的`flex`属性定义子项目分配剩余空间，用`flex`来表示占多少份数。

- `flex`子项目占的份数
- `align-self`控制子项自己在侧轴的排列方式
- `order`属性定义子项的排列顺序(前后顺序)

**圣杯布局：**

左中右 3 个盒子，左右固定宽高，父元素设置`display: flex;`子元素中间设置`flex: 1;`即可(原理：剩余的空间 2 号盒子独占一份)。

![image-20220214225816807](http://note-img-bed.dt-code.fun/image-20220214225816807.png)

**三等份：**

三个`span`标签设置`flex: 1;`各占一份，将整个盒子分成三等份。
