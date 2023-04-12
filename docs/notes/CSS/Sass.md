# `Sass`

## 环境

到[rubyinstaller官网](https://rubyinstaller.org/downloads/)下载安装包`Ruby 2.6.10-1 (x64)`并安装。



## 安装

> 备注：`Start Command Prompt with Ruby`命令行工具环境底下编写都会基于`ruby`环境，`sass`是通过`ruby`脚本语言开发的。

到安装目录里打开终端面板`Start Command Prompt with Ruby`，命令安装`Sass`。设置默认源：

```
gem sources --add https://gems.ruby-china.com/ --remove https://rubygems.org/

gem install sass
```

测试`sass`是否安装成功 成功时显示`sass`版本。

```
sass -v
```

如果需要卸载`sass`可以输入命令。

```
gem uninstall sass
```



## `sass`概述

它是`css`的预编译器，能补充`css`中的一些缺点如重复的代码块，可以实现把公用的代码块规划成可复用的区块。`css`预处理器语言实际上是通过该处理器的语法来产生`css`程序。它包括了纯`css`语法里没有的变量，还有一些简单的逻辑程序，如函数，对于结构和维护更为方便。



## 使用场景

`sass`可以把公用的代码块存放至`mixin`里，不同选择器里使用`@include`关键字可以使用。

```css
@mixin ellipsis{
  overflow: hidden;
  white-shace: nowrap;
  text-overflow: ellipsis;
}

p{
  @include ellipsis;
}
```

也可以定义一个颜色变量来保存颜色值，实现复用。



## `Ruby`

它是一个面向对象的脚本语言，20世纪90年代由日本人，松本行洪开发的。



## `sass`语法

缩进换行，不需要分号，对前端代码编写体验不太友好。

```css
.box 
  color: $color
  font-size: $font-size
  background-color: red
```

`3.x`版本引入新的语法`scss`，`css`语法的拓展，是`css`的一个超集，所有`css`语法都可以在`scss`文件里正常运行。支持`sass`的特性，如变量和拓展。

```css
.box{
  color: $color;
  font-size: $font-size;
}
```



## 变量

`$`是变量的声明符号，定义在其它嵌套代码块的变量是无法访问的。

```css
/* 声明默认变量 */
$color: blue !default;
```

## map

利用map特性声明一个像`JS`对象的变量集合。`map-get()`方法可以拿到定义好的变量去动态的变更样式。

```css
/* types.scss文件中定义 */
$bg-color: (
  primary: blue,
  success: green
)
```

`vue`文件的`<style>`标签中引入。

```html
<style lang="scss" scoped>
  @import '../assets/types.scss';
  .modal {
    background-color: map-get($bg-color, primary);    
  }
</style>
```



## `Mixin`

混合宏，用来解决需要写兼容性属性，如`css3`属性。将公共样式代码提取作为一个类似模块的块，对应传入的参数作为样式属性值。

```css
@mixin box-shadow($shadow){
  -webkit-box-shadow: $shadow;
  -moz-box-shadow: $shadow;
  -o-box-shadow: $shadow;
}
```

模板替换写法

```css
@mixin set-value($direction){
  margin-#{direction}: 10px;
  padding-#{$direction}: 10px;
}

.input-box{
  @include set-value(left);
}
```

当一个变量可以赋值多个值，有专门的写法去拿到指定的值。

```css
$color: #333 #666;

div{ background-color: nth($color, 1); }
div:hover{ background-color: nth($color, 2); }
```

`mixin`是有缺点的，如果没有设定参数对指定样式属性值时。当多个选择器都`@include`该`mixin`时，代码重复且臃肿。所以需要传不同值的方式输出不同的`CSS`代码。解决代码臃肿的问题可以使用选择器继承的方式。



## 继承

`@extend`命令可以解决代码臃肿问题

```css
.box{
  width: 100px;
  height: 100px;
}

.box-1{ @extend .box; }

//编译后
.box, .box-1{
  width: 100px;
  height: 100px;
}
```

但同时也有继承错乱的问题，3.2版本的`%`解决此问题。

```css
%box{
  width: 100px;
  height: 100px;
}

.box-1{ @extend %box; }
```



## 运算

```css
.box{
  width: 10px + 30px; /* 可以运算 */
  height: 10px + 2rem; /* 单位不同不可运算 */
}
```

颜色运算

```css
div{
  color: #000000 + #112233;
}
```

变量运算

```css
$content-width: 960px;
$sidebar-width: 100px;
/* 间隔 */
$gutter: 30px;

.container{
  width: $content-width + sidebar-width + gutter;
}
```

字符串运算

```css
p::before{
  content: "Foo " + Bar; /* "Foo Bar" */
  font-family: sans + "-serif"; /* sans-serif */
}
```



## 命令

像`vue`的指令，有`@if`，`@else if`，`@else`，`@for`等命令。

```css
/* 分支 */
$textType: "large";

span{
  @if $textType == "large"{
    font-size: 40px;
  }@else if($textType == "middle"){
    font-size: 28px;
  }@else{
    font-size: 14px;
  }
}
```

```css
/* for循环 */
@for $i from 1 through 3{
  .item-#{$i}{
    width: 5px * $i;
  }
}

/* print */
.item-1{ width: 5px }
.item-2{ width: 10px }
.item-3{ width: 15px }
```

```css
/* while循环 */
@while $i > 0{
  .item-#{$i}{
    width: 5px * $i;
  }
}
```

```css
/* each 遍历 列表 映射 */
$list: dog, cat, pig;

@each $animal in $list{
  .#{$animal}-icon{
    background-image: url(/imgs/#{$animal}.png);
  }
}
```



## 函数

`quote()`给一些字符添加双引号成为字符串的函数。

```css
h1::before{
  content: quote(name); /* content: "name" */
}
```

`round()`给数值四舍五入的函数。

```css
div{
  width: round(10.9px); /* 11px */ 
}
```

`floor()`向下取整的函数。

```css
div{
  width: flood(1.1px); /* 1px */
}
```

`abs()`绝对值的函数。

```css
div{
  width: abs(-10px); /* 10px */
}
```

`min()`最小值，`random()`随机。

列表相关的函数 如`append()`插入。

```css
$list: append(10px, 20px);
```

`zip()`将多个列表的值转为一个多维的列表。

```css
zip(1px 2px, solid dashed, green blue);
/* (1px 'solid' #008008) (2px 'dashed' #0000ff) */
```

`index()`获取索引，从1开始。

判断函数`type-of(100)`

```css
type-of(100) /* number */
```

单位获取`unit()`

```css
unit(100px) /* px */
```

`comparable()`判断两个数是否可以加减。

```css
comparable(1px, 2px) /* true */
```





