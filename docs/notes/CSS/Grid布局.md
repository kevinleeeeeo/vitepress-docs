

# `Grid`布局

可以将网页分为一个个网格，利用这些网格组合可以做出各种各样的布局。

## 容器和项目

采用网格布局的区域称为容器，容器内部采用网格定位的子元素称为项目。

```html
<div class="wrapper">
  <div class="item"></div>
  <div class="item"></div>
</div>
```



## 容器属性

**布局**

`display`：`grid | inline-grid`。两者区别在于块级占位和行内占位。

## 定义行和列

该属性的值可以是具体数值，百分比，`fr`关键字，`auto`。

- `grid-template-columns`，用来指定列的宽度。
- `grid-template-rows`，用来指定行的高度。

**数值和百分比**，情况1，假如定义了一个三行三列的网络布局，每行每列各占`200px`的宽度。情况2，假如定义了一个三行三列的网络布局，每行各占`200px`的宽度，每列各占`33.33%`的宽度。

```css
.wrapper {
  width: 600px;
  height: 600px;
  border: 1px solid #333;
  margin-top: 100px auto;
  display: grid;
  grid-template-columns: 200px 200px 200px;
  grid-template-rows: 200px 200px 200px;
}
```

情况1，情况2的效果一样，如图显示。

<img src="http://note-img-bed.dt-code.fun//image-20221020142810408.png" alt="image-20221020142810408" style="zoom:50%;" />

**`fr`关键字**，假如定义每行各占`200px`的宽度，设为3列，第一列1个单位，第二列2个单位，第三列3个单位。

```css
.wrapper {
  width: 600px;
  height: 600px;
  border: 1px solid #333;
  margin-top: 100px auto;
  display: grid;
  grid-template-rows: 200px 200px 200px;
  grid-template-columns: 1fr 2fr 1fr;
}
```

如图显示

<img src="http://note-img-bed.dt-code.fun//image-20221020144212525.png" alt="image-20221020144212525" style="zoom:50%;" />

**`auto`属性**，假如定义每行各占`200px`的宽度，设为3列，第一列`100px`，第二列`auto`，第三列`100px`。

```css
.wrapper {
  width: 600px;
  height: 600px;
  border: 1px solid #333;
  margin-top: 100px auto;
  display: grid;
  grid-template-rows: 200px 200px 200px;
  grid-template-columns: 100px auto 100px;
}
```

如图显示

<img src="http://note-img-bed.dt-code.fun//image-20221020144706636.png" alt="image-20221020144706636" style="zoom:50%;" />



**`repeat()`函数**

可以重复指定宽度。

```css
grid-template-columns: repeat(次数, 每次宽度);
```

假如定义每列宽度为`200px`，重复定义3次。

如图显示

<img src="http://note-img-bed.dt-code.fun//image-20221020145318297.png" alt="image-20221020145318297" style="zoom:50%;" />

也可以重复某种排列模式。

```css
grid-template-columns: repeat(次数, 某排列方式);
grid-template-columns: repeat(2, 20px 100px);
```

如图显示

<img src="http://note-img-bed.dt-code.fun//image-20221020145852179.png" alt="image-20221020145852179" style="zoom:50%;" />

## 定义行列间距

- `grid-row-gap`，设置行与行的间距
- `grid-column-gap`，设置列与列的间距

假如设定列于列的间距为`30px`。

```css
.wrapper {
  width: 600px;
  height: 600px;
  border: 1px solid #333;
  margin-top: 100px auto;
  display: grid;
  grid-template-rows: 200px 200px 200px;
  grid-template-columns: 100px 100px;
  grid-column-gap: 30px;
}
```

如图显示

<img src="http://note-img-bed.dt-code.fun//image-20221020150510421.png" alt="image-20221020150510421" style="zoom:50%;" />



## 两栏布局

定义一个场景的两栏布局。设定2列，左列固定，右列响应式宽度。

```css
body { margin: 0; }

.wrapper {
  width: 100vw;
  height: 400px;
  margin-top: 100px auto;
  display: grid;
  grid-template-rows: 400px;
  grid-template-columns: 100px 1fr;
}
```

<img src="http://note-img-bed.dt-code.fun//image-20221020151013537.png" alt="image-20221020151013537" style="zoom:50%;" />

## 内容对齐

**单元格内容对齐方式**

- `justify-items`：控制单元格内容在水平方向上的对齐方式，属性值有`start | center | end | stretch`。
- `align-items`：控制单元格内容在垂直方向上的对齐方式。
  - `start`：对齐单元格的起始边缘。
  - `end`：对齐单元格的结束边缘。
  - `center`：单元格内部居中。
  - `stretch`：拉伸，占满单元格的整个宽度(默认值)。
- `place-items`：复合属性，水平垂直居中，如(`place-items: center center;`)。

初始化定义一个三行三列宽度为`200px`的九宫格，定义9个每一项的宽高为`50px`盒子。

```css
.wrapper {
  width: 600px;
  height: 600px;
  margin-top: 100px auto;
  border: 1px solid #333;
  display: grid;
  grid-template-rows: 1fr 1fr 1fr;
  grid-template-columns: 1fr 1fr 1fr;
}

.item {
  width: 50px;
  height: 50px;
  text-align: center;
  line-height: 50px;
  background-color: lightcoral;
}
```

```html
<div class="wrapper">
  <div class="item">1</div>
  <div class="item">2</div>
  <div class="item">3</div>
  <div class="item">4</div>
  <div class="item">5</div>
  <div class="item">6</div>
  <div class="item">7</div>
  <div class="item">8</div>
  <div class="item">9</div>
</div>
```



初始化效果如图显示(类似效果`justify-items: start;`)

<img src="http://note-img-bed.dt-code.fun//image-20221020154534133.png" alt="image-20221020154534133" style="zoom:50%;" />

假设将上述效果的单元格控制在水平对齐。需要给容器设置。

```css
justify-items: center;
```

显示效果

<img src="http://note-img-bed.dt-code.fun//image-20221020154816629.png" alt="image-20221020154816629" style="zoom:50%;" />

假设将上述效果的单元格控制在居右对齐。需要给容器设置。

```css
justify-items: end;
```

显示效果

<img src="http://note-img-bed.dt-code.fun//image-20221020155004346.png" alt="image-20221020155004346" style="zoom:50%;" />

假设将上述效果的单元格控制在垂直对齐。需要给容器设置。

```css
align-items: center;
```

显示效果

<img src="http://note-img-bed.dt-code.fun//image-20221020155245489.png" alt="image-20221020155245489" style="zoom:50%;" />





**整个内容区域在容器中的对齐方式**

- `justify-content`：控制整个内容区域在容器中的水平对齐方式。
- `align-content`：控制整个内容区域在垂直方向上的对齐方式。
- `place-content`：复合写法。

以上对齐方式的属性值有：

```css
start | end | center | space - around | space - between | space-evenly | stretch;
```

初始化定义一个三行三列宽度为`100px`的九宫格。

```css
.wrapper {
  width: 600px;
  height: 600px;
  margin-top: 100px auto;
  border: 1px solid #333;
  display: grid;
  grid-template-rows: 100px 100px 100px;
  grid-template-columns: 100px 100px 100px;
}
```

初始化效果图

<img src="http://note-img-bed.dt-code.fun//image-20221020160809972.png" alt="image-20221020160809972" style="zoom:50%;" />

假设将上述效果的整个内容区域控制在水平对齐。需要给容器设置。

```css
justify-content: center;
```

显示效果

<img src="http://note-img-bed.dt-code.fun//image-20221020161021349.png" alt="image-20221020161021349" style="zoom:50%;" />

假设将上述效果的整个内容区域控制在水平环绕，即每列左右距离相等。需要给容器设置。

```css
justify-content: space-around;
```

显示效果

<img src="http://note-img-bed.dt-code.fun//image-20221020161240494.png" alt="image-20221020161240494" style="zoom:50%;" />

假设将上述效果的整个内容区域控制在水平两端贴齐，列距离相等。需要给容器设置。

```css
justify-content: space-between;
```

显示效果

<img src="http://note-img-bed.dt-code.fun//image-20221020161426976.png" alt="image-20221020161426976" style="zoom:50%;" />



## 区域指定

`grid-template-areas`，给网格布局指定区域，一个区域由单个或多个单元格组成。该属性用来定义区域。

```css
.wrapper {
  width: 600px;
  height: 600px;
  margin-top: 100px auto;
  border: 1px solid #333;
  display: grid;
  grid-template-rows: 100px 100px 100px;
  grid-template-columns: 100px 100px 100px;
  grid-template-areas: 'a b c''d e f''g h i'; 
}
```

划分了9个单元格，将其`a`到`i`分别对应9个单元格，效果如下

<img src="http://note-img-bed.dt-code.fun//image-20221020221631987.png" alt="image-20221020221631987" style="zoom:50%;" />

也可以多个单元格合并成几个区域。

```css
grid-template-areas: 'a a a''b b b''c c c';
```

如果某些区域不需要利用，则使用`.`表示。

```css
grid-template-areas: 'a . c''d . f''g . i';
```





## 项目属性

自由设置项目的具体位置，可以通过边框线来决定。

- `template-row-start`
- `template-row-end`
- `template-column-start`
- `template-column-end`

**数字线的方式设置盒子位置**

`row`线和`column`线的参考线如下图，还分别标注了每条线的起始索引(1开始)至4(假如是九宫格图是4行4列即`4 x 4`)。

<img src="http://note-img-bed.dt-code.fun//image-20221021023610281.png" alt="image-20221021023610281" style="zoom:50%;" />

根据代码初始化九宫格效果如下。

```css
.wrapper {
  width: 600px;
  height: 600px;
  margin-top: 100px auto;
  border: 1px solid #333;
  display: grid;
  grid-template-rows: repeat(3, 200px);
  grid-template-columns: repeat(3, 200px);
  justify-items: center;
  align-items: center;
}
```

```html
<div class="wrapper">
  <div class="item">A</div>
  <div class="item">B</div>
  <div class="item">C</div>
  <div class="item">D</div>
  <div class="item">E</div>
  <div class="item">F</div>
  <div class="item">G</div>
  <div class="item">H</div>
  <div class="item">I</div>
</div>
```

尝试修改项目属性，假如将`A`盒子移动至`I`盒子的位置时。给项目`item`类名定义这些属性，意思是从`row`线3开始，4结束，`colomu`线3开始，4结束的位置即`I`盒子的位置。

```css
grid-row-start: 3;
grid-row-end: 4;
grid-column-start: 3;
grid-column-end: 4;
```

修改位置后如图

<img src="http://note-img-bed.dt-code.fun//image-20221021023752464.png" alt="image-20221021023752464" style="zoom:50%;" />



**根据布局区域设置盒子位置**

容器属性`grid-template-areas`定义字母给所有位置进行命名占位，项目属性`grid-area: i;`定义占位的字母即可改变位置。以下写法跟上图显示效果一样。

```css
.wrapper {
  width: 600px;
  height: 600px;
  margin-top: 100px auto;
  border: 1px solid #333;
  display: grid;
  grid-template-rows: repeat(3, 200px);
  grid-template-columns: repeat(3, 200px);
  justify-items: center;
  align-items: center;
  grid-template-areas: 
    "a b c"
    "d e f"
    "g h i";
}

.item:nth-child(1) {
  width: 100%;
  height: 100%;
  text-align: center;
  line-height: 200px;
  border: 1px dashed #333;
  background-color: lightslategray;
  grid-area: i;
}
```

