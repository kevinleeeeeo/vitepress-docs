# DOM

## 事件概述

通过某个事件而产生的效果，叫绑定事件处理程序，也叫事件处理函数。事件是节点元素天生具备的特性。绑定事件等于绑定事件的处理函数而不是绑定事件本身。事件不需要绑定的，而绑定的是一个反馈效果，该反馈效果由处理函数去做的。

事件加上事件的反馈就是前端交互，也叫交互体验是前端的核心价值。

```js
document.getElementsByTagName('div')[0].onclick = function(){
  this.style.backgroundColor = 'orange';
}
```

## 绑定方式

事件句柄的绑定事件处理函数的方式，为某一个HTML元素指定了一个JS事件句柄等于一个函数的形式。此绑定的方式的缺点某个元素的一个事件只能绑定一个处理程序，再次绑定的程序会覆盖上一次绑定的程序。

```js
elem.onclick = function(){};
```

事件源是一个对象，事件所作用在某个元素的身上，该元素就是事件源。注册事件监听器。IE9 及以下不兼容(w3c 标准)，且可以给同一事件源绑定多个事件。

```js
elem.addEventListener(事件类型，事件处理函数,false);
oBtn.addEventListener('click', function(){});
```

兼容 IE8 以及下的绑定方法。

```js
elem.attachEvent(事件类型,事件处理函数);
oBtn.attachEvent('onclick', function(){});
```

封装兼容低版本的事件绑定处理函数。

```js
/**
 * @el 元素
 * @type 事件类型
 * @fn 事件处理函数
 */
function addEvent(el, type, fn) {
  if (el.addEventListener) {
    el.addEventListener(type, fn, false);
  } else if (el.attachEvent) {
    el.attachEvent('on' + type, function () {
      fn.call(el);
    })
  } else {
    el['on' + type] = fn;
  }
}
```

清除事件的方法：

- `elem.removeEventListener(type, fn, false)`
- `elem.detachEvent()`
- `elem.onclick = null/false`

```js
function removeEvent(el, type, fn) {
  if (el.removeEventListener) {
    el.removeEventListener(type, fn, false);
  } else if (el.detachEvent) {
    el.detachEvent('on' + type, function () {
      fn.call(el);
    })
  } else {
    el['on' + type] = fn;
  }
}
```



## 事件冒泡

子级元素向父级元素进行事件冒泡现象。

## 事件捕获

顶层元素开始捕获，直至事件源结束。

```js
oBtn.addEventListener('click', function(){}, { capture: true });
```

这些事件源没有冒泡/捕获现象：

- focus
- blur
- change
- submit
- reset
- select

## 事件源对象

存放在事件处理函数的参数里，IE8 存放在 window 里。

- 鼠标对象
- 键盘对象

需要兼容性写法。

```js
appaly.addEventListener('click', function(e){
  var e = ev || window.event;
}, false)
```

## 取消冒泡

- `e.stopPropagation()`： W3C标准 继承 `Event.prototype`上的方法。
- `e.cancelBubble = true`：IE 写法。

兼容性封装取消冒泡方法。

```js
function cancelBubble(e) {
  var e = e || window.event;
  if (e.stopPropagation) {
    e.stopPropagation();
  } else {
    e.cancelBubble = true;
  }
}
```

## 取消默认事件

如场景取消默认链接跳转防止请求后端数据。

- `e.preventDefault()`：w3c 方法，IE9 不兼容
- `e.returnValue = false`：IE9 以下

```js
//右键菜单 句柄写法
document.oncontextmenu = function(){
  return false;
}
```



## 事件流

描述从页面中接收事件的顺序，和冒泡或捕获相关。

- IE 提出事件冒泡流Event Bubbling。
- 网景 Netscape 提出事件捕获流 Event Capturing。

事件冒泡流，有捕获程序也可以用冒泡的处理函数来写。句柄写法`xxx.onclick`的事件绑定默认是嵌套的元素冒泡方式。而`xxx.addEventListener`默认也是冒泡的方式，但是它可以通过第三参数来改变为捕获方式。

```html
<div class="wrapper">
  <div class="outer">
    <div class="inner"></div>
  </div>
</div>

<script>
  var wrapper = document.getElementsByClassName('wrapper')[0],
    outer = document.getElementsByClassName('outer')[0],
    inner = document.getElementsByClassName('inner')[0];

  wrapper.addEventListener('click', function () {
    console.log('wrapper');
  }, false);

  outer.addEventListener('click', function () {
    console.log('outer');
  }, false);

  inner.addEventListener('click', function () {
    console.log('inner');
  }, false);
</script>

//冒泡执行绑定的事件处理程序的顺序
当仅点击wrapper盒子区域时 打印 wrapper
当仅点击outer盒子区域时 打印 outer wrapper
当仅点击inner盒子区域时 打印 inner outer wrapper
```

事件捕获流与冒泡行为相反。如果事件源顶层父级有相同事件源 ，优先执行父级的事件处理程序，然后接着向内执行子级的事件处理程序。

```js
wrapper.addEventListener('click', function () {
  console.log('wrapper');
}, true);

outer.addEventListener('click', function () {
  console.log('outer');
}, true);

inner.addEventListener('click', function () {
  console.log('inner');
}, true);

//冒泡执行绑定的事件处理程序的顺序
当仅点击wrapper盒子区域时 打印 wrapper
当仅点击outer盒子区域时 打印 wrapper outer
当仅点击inner盒子区域时 打印 wrapper outer inner
```

当同时定义了冒泡和捕获时，事件流就分为三个阶段。

- 事件捕获阶段(默认不执行)
- 处于目标阶段(触发时候) 按照先后顺序执行事件处理函数
- 事件冒泡阶段

```js
wrapper.addEventListener('click', function () {
  console.log('wrapper冒泡');
}, false);

outer.addEventListener('click', function () {
  console.log('outer冒泡');
}, false);

inner.addEventListener('click', function () {
  console.log('inner冒泡');
}, false);

wrapper.addEventListener('click', function () {
  console.log('wrapper捕获');
}, true);

outer.addEventListener('click', function () {
  console.log('outer捕获');
}, true);

inner.addEventListener('click', function () {
  console.log('inner捕获');
}, true);

//绑定的事件处理程序的顺序
当仅点击wrapper盒子区域时 打印 wrapper捕获 wrapper冒泡
当仅点击outer盒子区域时 打印 wrapper捕获 outer捕获 outer冒泡 wrapper冒泡
当仅点击inner盒子区域时 打印 wrapper捕获 outer捕获 inner捕获 inner冒泡 outer冒泡 wrapper冒泡
```





## 事件代理

事件代理是解决了多次重复绑定事件函数的一种方案。事件代理的核心是事件对象`event`，IE对应的是`window.event`，和事件源对象`event.target`。火狐只有`event.target`，IE只有`srcElement`。

```js
oList.onclick = function (e) {
  var e = e || window.event,
    tar = e.target || e.srcElement;
  console.log(tar);
}
```

假如想给列表新增一项，并给列表底下的每一项都绑定点击事件，发现无法给新增的那一项绑定点击事件，原因是循环已经完毕后才去新增一项，所以新增的那一项是无法绑定点击事件。

```js
var oList = document.getElementsByTagName('ul')[0],
  oLis = oList.getElementsByTagName('li'),
  oBtn = document.getElementsByTagName('button')[0];

//循环ul列表底下的li列表项
for(var i = 0; i < oLis.length; i++){
  oLis[i].onclick = function(){
    console.log(this.innerText);
  }
}

oBtn.onclick = function (e) {
  var li = document.createElement('li');
  li.innerText = oLi.length + 1;
  oList.appendChisld(li);
}
```

解决方法是事件委托或事件代理，不打算给列表项绑定点击事件，而是给列表绑定事件。把点击事件委托给父级，通过事件源被点击后冒泡的特性，可以省略整个列表项绑定的过程。

**如何在事件代理的情况下获取下标？**

写法一，缺点使用了循环，不能在大量数据下使用，性能较低。

```js
var oList = document.getElementsByTagName('ul')[0],
  oLi = oList.getElementsByTagName('li'),
  oBtn = document.getElementsByTagName('button')[0],
  len = oLi.length,
  item;

oList.onclick = function (e) {
  var e = e || window.event,
    tar = e.target || e.srcElement;

 for(var i = 0; i < len; i++){
   item = oLi[i];
   //循环的当前项跟点击的事件源相等
   if(tar === item){
     consolo.log(i);
   }
  }
}
```

写法二，利用数字 `Array.prototype.indexOf`方法，利用了`tar`事件源可以拿到当前列表项，避免了循环(企业级写法，骚操作)。

```js
var oList = document.getElementsByTagName('ul')[0],
  oLis = oList.getElementsByTagName('li'),
  oBtn = document.getElementsByTagName('button')[0],
  len = oLi.length,
  item;

oList.onclick = function (e) {
  var e = e || window.event,
    tar = e.target || e.srcElement;

  //注意：oLi列表是类数组，不能使用数组方法
  //解决方法：继承Array.prototype
  //indexOf(数组元素) 这里的元素刚好跟tar事件源的值一样
  //Array.prototype.indexOf.call(DOM对象集合, 当前事件源);
  idx = Array.prototype.indexOf.call(oLis, tar);
  console.log(idx);
}
```

写法三，利用 target 事件源对象的 tagName 属性筛选冒泡对象

```js
var oList = document.getElementsByTagName('ul')[0],
  oLi = oList.getElementsByTagName('li'),
  oBtn = document.getElementsByTagName('button')[0],
  len = oLi.length,
  item;

oList.onclick = function (e) {
  var e = e || window.event,
    tar = e.target || e.srcElement,
    tagName = tar.tagName.toLowerCase();

  if(tagName === 'li'){
    console.log(tar.innerText);
  }
}
```

**面试问题：**

实现请往 `ul` 添加 50 个 `li`，并且给 `li` 添加删除功能，考虑性能。

写法一，循环每次都要`createElement`，效率不高。

```js
var box = document.getElementsByClassName('box')[0],
  oUl = document.createElement('ul'),
  oFrag = document.createDocumentFragment(),
  liNum = 50;

for (var i = 0; i < liNum; i++) {
  var oLi = document.createElement('li');
  oLi.innerHTML = '第' + (i + 1) + '项 <a href="javascript:;">删除</a>';
  oLi.className = 'list-item';
  oFrag.appendChild(oLi);
}
oUl.appendChild(oFrag);
box.appendChild(oUl);
```

写法二：

```js
var box = document.getElementsByClassName('box')[0],
  oUl = document.createElement('ul'),
  liNum = 50,
  list = '';

for (var i = 0; i < liNum; i++) {
  list += '<li>第' + i + '项 <a href="javascript:;">删除</a></li>';
}
oUl.innerHTML = list;
box.appendChild(oUl);
```

写法三：用模板的方式进行正则替换拼接。

```js
var oUl = document.createElement('ul'),
  tpl = document.getElementById('tpl').innerHTML,
  list = '';

for (var i = 0; i < 50; i++) {
  list += tpl.replace(/{{(.*?)}}/, (i + 1));
}
oUl.innerHTML = list;
```





## 鼠标坐标

- `clientX/Y` :鼠标位置相对于当前可视区域的坐标(不包括滚动条的距离)。
- `pageX/pageY`：鼠标位置相对于当前文档的坐标(包含滚动条的距离), IE9 以下不支持。
- `screenX/Y`：鼠标位置相对于屏幕边缘的坐标。
- `X/Y`: 同`clientX/Y`相当 ,fireFox 不支持。
- `layerX/Y`：同`pageX/Y`相同，IE11 以下同`clientX/Y`。
- `offsetX/Y`:鼠标位置相对于块元素(仅仅拿到块级宽高数值范围内)的坐标(包括边框)，`safari`不包括边框。

分析：

```js
document.onclick = function (e) {
  var e = e || window.event;
  console.log(e.clientY, e.pageY);
  //数字相同 但滚动条下，clientY 数值 < pageY 数值

  console.log(e.screenY, e.pageY);
  //256 100 screenY = 屏幕坐标

  console.log(e.y, e.pageY);
  //数字相同 但滚动条下，y 数值 < pageY 数值
  //跟clientY数值一样

  console.log(e.layerY, e.pageY); IE11以下
  //数字相同 滚动条下也相同
 
  console.log(e.offsetY, e.pageY);
  //offsetY 鼠标位置相对于块元素的坐标
  //注意：包含边框 ， safari不包括
}
```

尝试打印`Element.clientTop`和`Element.clientLeft`，获取文档偏移，他俩返回的是左边框和上边框的宽度。

```html
<style>
  .box {
    width: 200px;
    height: 200px;
    border-top: 15px solid lightcoral;
    border-left: 10px solid lightsalmon;
    background-color: bisque;
  }
</style>
<div class="box"></div>
<script>
  var box = document.getElementsByClassName('box')[0];
  box.addEventListener('click', function () { 
    console.log(box.clientLeft, box.clientTop); 
    //10 15
  }, false);
</script>
```

封装一个具有兼容性的获取页面坐标的函数(包含滚动条)的写法。并排除文档出现偏移的情况，如`body`的`margin`为`8px`。

```js
function pagePos(e) {
  //获取滚动条距离
  //使用获取滚动条距离函数
  var sLeft = getScrollOffset().left,
    sTop = getScrollOffset().top,
    //获取文档偏移
    //documentElement.clientLeft IE8及以下不存在(undefined)
    cLeft = document.documentElement.clientLeft || 0,
    cTop = document.documentElement.clientTop || 0;

  return {
    //可视区域坐标 + 滚动条距离 - 偏移距离
    X: e.clientX + sLeft - cLeft,
    Y: e.clientY + sTop - cTop
  }
}
```



## 拖拽

拖拽应用在拖动的模态框等。

- `mousedown`，鼠标键按下事件。
- `mouseup`，鼠标抬起事件。
- `mousemove`，鼠标移动事件。

鼠标按下并且移动时的写法是嵌套写法，按下在外层，移动在内层。抬起也会在内层。

```js
box.onmousedown = function (e) {
  box.onmousemove = function (e) {...}
  box.onmouseup = function (e) {...}
}
```

实现鼠标拖拽，尝试让一个方形盒子按下移动时，随着鼠标的滑动跟随。按下时确实方形盒子跟随了鼠标的移动，但存在两个问题，问题1是鼠标永远定位在方形盒子的左上顶底位置，问题2是鼠标移动过快脱离方形盒子区域时会导致停止不跟随，知道鼠标回去盒子区域才跟随，原因是实时获取的盒子的坐标在赋值时无法及时同步定位，导致帧率不相符合。

```html
<style>
  .box {
    position: absolute;
    width: 100px;
    height: 100px;
    background-color: bisque;
  }
</style>
<div class="box"></div>
<script>
  box.onmousedown = function (e) {
    box.onmousemove = function (e) {
      var e = e || window.event,
        page = pagePos(e);
      //将实时获取盒子的坐标数值并同步到盒子绝对定位上。
      box.style.left = page.X + 'px';
      box.style.top = page.Y + 'px';
    };
    box.onmouseup = function (e) {
      //鼠标抬起取消鼠标移动事件
      document.onmousemove = null;
    };
  };
</script>
```

问题2解决办法是改变盒子移动的事件对象为`document`就可以解决鼠标移动过快盒子跟不上的问题。

```js
document.onmousemove = function (e) {...}
```

问题1解决办法是需要如下计算，从而时盒子中间与鼠标的坐标重合。

```js
box.onmousedown = function (e) {
  var e = e || window.event;
  page = pagePos(e);

  //通过getStyles()拿到盒子x,y定位位置
  //盒子边缘到盒子内部鼠标位置 = 页面坐标 - 盒子坐标
  x = page.X - getStyles(box, 'left');
  y = page.Y - getStyles(box, 'top');

  document.onmousemove = function (e) {
    var e = e || window.event;
    page = pagePos(e);

    //盒子到页面边缘距离 = 页面坐标 - 盒子边缘到盒子内部鼠标位置
    box.style.left = page.X - x + 'px';
    box.style.top = page.Y - y + 'px';

    document.onmouseup = function (e) {
      document.onmousemove = null;
      document.onmouseup = null;
    }
  }
}
```

根据以上拖拽实现封装一个拖拽函数。

```js
function elemDrag(elem) {
  var x, y;

  addEvent(elem, 'mousedown', function (e) {
    var e = e || window.event;
    x = pagePos(e).X - getStyles(elem, 'left');
    y = pagePos(e).Y - getStyles(elem, 'top');

    addEvent(document, 'mousemove', mouseMove);
    addEvent(document, 'mouseup', mouseUp);

    cancelBubble(e);
    preventDefaultEvent(e);
  })

  function mouseMove(e) {
    var e = e || window.event;
    elem.style.left = pagePos(e).X - x + 'px';
    elem.style.top = pagePos(e).Y - y + 'px';
  }

  function mouseUp(e) {
    var e = e || window.event;
    removeEvent(document, 'mousemove', mouseMove);
    removeEvent(document, 'mouseup', mouseUp);
  }
}
```

写一个模块，鼠标拖拽功能，单双击功能。(原型)

```js
/**
 * 模块：鼠标拖拽功能带单双击事件(原型)
 * 功能一：拖拽
 * 功能二：点击可以跳转链接
 *
 * 解决现象：拖拽和点击如何分离
 * 解决方案：记录时间前后，新增一个点击事件
 *
 * 解决现象：拖拽和点击同时存在
 * 解决方案：记录原来位置
 *
 * 解决现象：边缘问题
 * 解决方案：记录边界坐标根据边缘计算
 *
 * 解决现象：右键问题
 * 解决方案：e.button 左中右(0/1/2) IE10及以下不兼容
 *
 * 解决现象：双击问题
 * 解决方案：记录双击时间
 */

var oLink = document.getElementsByTagName('a')[0],
  oMenu = document.getElementsByTagName('div')[0];

Element.prototype.dragNclick = (function (elemClick, menu) {
  //记录时间
  var bTime = 0,
    eTime = 0, //双击开始时间 
    cbTime = 0, //双击结束时间
    ceTime = 0, //双击次数
    counter = 0, //计时器
    t = null, //记录坐标
    oPos = [], 
    wWidth = getViewportSize().width, //可视窗口宽度
    wHeight = getViewportSize().height, //可视窗口高度
    eleWidth = getStyles(this, 'width'), //块元素的宽度
    eleHeight = getStyles(this, 'height'), //块元素的高度
    mWidth = getStyles(menu, 'width'), //右键盒子的宽度
    mHeight = getStyles(menu, 'height'); //右键盒子的高度

  drag.call(this);

  function drag() {
    var x, y,
      _self = this;

    addEvent(this, 'mousedown', function (e) {
      var e = e || window.event,
        //记录按键编码
        btnCode = e.button;
      //右键
      if (btnCode === 2) {
        var mLeft = pagePos(e).X,
          mTop = pagePos(e).Y;
        //打开一个菜单
        if (mLeft <= 0) {
          mLeft = 0;
        } else if (mLeft >= wWidth - mWidth) {
          mLeft = pagePos(e).X - mWidth;
        }
        if (mTop <= 0) {
          mTop = 0;
        } else if (mTop >= wHeight - mHeight) {
          mTop = pagePos(e).Y - mHeight;
        }
        menu.style.left = mLeft + 'px';
        menu.style.top = mTop + 'px';
        menu.style.display = 'block';
      } else if (btnCode === 0) {
        //左键
        //记录鼠标按下时间戳
        bTime = new Date().getTime();
        //记录原来的位置
        oPos = [getStyles(_self, 'left'), getStyles(_self, 'top')];
        menu.style.display = 'none';
        //盒子边缘到盒子内部鼠标位置 = 页面坐标 - 盒子坐标
        x = pagePos(e).X - getStyles(_self, 'left');
        y = pagePos(e).Y - getStyles(_self, 'top');
        addEvent(document, 'mousemove', mouseMove);
        addEvent(document, 'mouseup', mouseUp);
        //去掉冒泡和默认事件
        cancelBubble(e);
        preventDefaultEvent(e);
      }
    })

    //去除默认右键菜单
    addEvent(document, 'contextmenu', function (e) {
      var e = e || window.e;
      preventDefaultEvent(e);
    })

    //右键盒子以外区域点击会隐藏该盒子
    addEvent(document, 'click', function (e) {
      menu.style.display = 'none';
    })

    //取消当前盒子的冒泡行为
    addEvent(menu, 'click', function (e) {
      var e = e || window.e;
      cancelBubble(e);
    })

    function mouseMove(e) {
      var e = e || window.event,
        //记录边界坐标
        eleLeft = pagePos(e).X - x,
        eleTop = pagePos(e).Y - y;
      //到达边缘的情况
      //靠左边缘
      if (eleLeft <= 0) {
        eleLeft = 0;
      } else if (eleLeft >= wWidth - eleWidth) {
        //靠右边缘
        eleLeft = wWidth - eleWidth - 1;
      }
      //到达边缘的情况
      //靠顶边缘
      if (eleTop <= 0) {
        eleTop = 0;
      } else if (eleTop >= wHeight - eleHeight) {
        //靠下边缘
        eleTop = wHeight - eleHeight - 1;
      }
      //盒子到页面边缘距离 = 页面坐标 - 盒子边缘到盒子内部鼠标位置
      _self.style.left = eleLeft + 'px';
      _self.style.top = eleTop + 'px';

    }

    function mouseUp(e) {
      var e = e || window.event;
      //记录鼠标抬起时间戳
      eTime = new Date().getTime();
      //结束时间 - 开始时间 < 100ms 为点击事件
      if (eTime - bTime < 100) {
        //把记录好的坐标在点击时显示
        _self.style.left = oPos[0] + 'px';
        _self.style.top = oPos[1] + 'px';
        counter++;
        //第一次时 点击第一次
        if (counter === 1) {
          cbTime = new Date().getTime();
        }
        //第二次时 点击第二次
        if (counter === 2) {
          ceTime = new Date().getTime();
        }
        //证明双击了
        if (cbTime && ceTime && (ceTime - cbTime < 200)) {
          //除了拖拽操作，还能点击链接跳转
          //执行elemDrag函数传过来的第二个参数
          elemClick();
        }
        t = setTimeout(function () {
          cbTime = 0;
          ceTime = 0;
          counter = 0;
          clearTimeout(t)
        }, 500)
      }
      removeEvent(document, 'mousemove', mouseMove);
      removeEvent(document, 'mouseup', mouseUp);
    }
  }
});

//执行函数另外传一函数作为参数
oLink.dragNclick(function () {
  window.open('http://www.xxx.com');
}, oMenu);
```

## 输入框事件

`oninput`&`onpropertychange`，只要在输入框中填写或删除内容，里面显示内容。

```js
var content = document.getElementById('content');

//HTML5新增接口
//IE11支持/IE10支持/IE9支持/IE8不支持
content.oninput = function () {
  console.log(this.value); //返回输入框输入内容
}

//IE11支持/IE10支持/IE9支持/IE8支持
content.onpropertychange = function () {
  console.log(this.value);
}
```

`onchange`，获得输入框失去焦点后的文本内容，若不更改值，失去焦点不会变化。

- 失去焦点才会触发
- 聚集/失去焦点时，值没有变化不会触发

```js
content.onchange = function () {
  console.log(this.value);
}
```

`onfocus`&`onblur`

```js
//获得焦点
content.onfocus = function () {
  this.className = 'focus';
}

//失去焦点
content.onblur = function () {
  this.className = '';
}
```

`placeholder`属性在各个浏览存在不一样的情况，不推荐使用，用`onfocus`和`onblur`代替使用。

```html
<input
type="text"
id="content"
value="请输入关键字"
class="search-input"
onfocus="if(this.value==='请输入关键字'){ this.value = ''; this.className='search-input has-value';}"
onblur="if(this.value === ''){ this.value = '请输入关键字'; this.className = 'search-input';}">
```



## 滑入滑出

`mouseover`&`mouseout`鼠标滑入滑出，存在冒泡现象，影响底下所有的子元素。`mouseenter`&`mouseleave`只对被绑定元素进行事件触发(只对被绑定元素生效)，存在类似捕获现象，也影响子元素。

定义父子元素盒子，并分别对父子盒子各绑定`mouseover`和`mouseout`事件。

```html
<style>
  .outer {
    width: 200px;
    height: 200px;
    background-color: bisque;
  }
  .inner {
    width: 100px;
    height: 100px;
    background-color: lightcoral;
  }
</style>
<div class="outer">
  <div class="inner"></div>
</div>
<script>
  outer.addEventListener('mouseover', function () {
      console.log('outer mouseover');
    }, false);
  outer.addEventListener('mouseout', function () {
      console.log('outer mouseout');
    }, false);
  inner.addEventListener('mouseover', function () {
      console.log('inner mouseover');
    }, false);
  inner.addEventListener('mouseout',
    function () {
      console.log('inner mouseout');
    }, false);
</script>

//情况1:
//当鼠标单独移入子元素区域时，打印inner mouseover 和 outer mouseover
//当鼠标单独移出子元素区域时，打印inner mouseout 和 outer mouseout
//说明触发子元素时有冒泡现象，同时触发父元素事件。
//情况2:
//当鼠标单独移入父元素区域时，打印outer mouseover
//当鼠标单独移出父元素区域时，打印outer mouseout
//说明触发父元素时，仅仅会触发父元素事件。
//情况3:
//当鼠标从子元素和父元素切换移入移出时，
//打印inner mouseout outer mouseout outer mouseover
//打印outer mouseout inner mouseover outer mouseover
//说明再次触发时，仍会同时触发父子元素事件。
```

定义父子元素盒子，并分别对父子盒子各绑定`mouseenter`和`mouseleave`事件。

```html
<script>
  outer.addEventListener('mouseenter', function () {
      console.log('outer mouseenter');
    }, false);
  outer.addEventListener('mouseleave', function () {
      console.log('outer mouseleave');
    }, false);

  inner.addEventListener('mouseenter', function () {
      console.log('inner mouseenter');
    }, false);
  inner.addEventListener('mouseleave',
    function () {
      console.log('inner mouseleave');
    }, false);
</script>

//情况1: 
//当鼠标单独移入子元素区域时，打印outer mouseenter 和inner mouseenter 
//当鼠标单独移出子元素区域时，打印inner mouseleave 和 outer mouseleave
//说明触发子元素时有捕获现象，同时触发父子元素事件。
//情况2:
//当鼠标单独移入父元素区域时，打印outer mouseover
//当鼠标单独移出父元素区域时，打印outer mouseout
//说明触发父元素时，仅仅会触发父元素事件。
//情况3:
//当鼠标从子元素和父元素切换移入移出时，仅打印inner mouseenter inner mouseleave
//说明再次触发时，仅仅会触发子元素事件。
```

在复杂情况时候，使用`mouseenter`和`mouseleave`用的比较多一些，因为在dom结构复杂的情况下，事件的可控性比较强，可以单独的给某一些元素进行`mouseenter`或`mouseleave`绑定事件，为了这些元素之间互不影响。在一些dom结构简单的情况下，像列表里，鼠标滑入滑出样式的更改，此情况适合`mouseover`和`mouseout`。

此外的以下例子中的一个特殊的方法可以避免使用两个以上事件的绑定，性能上也有优势。同时完美解决事件代理的方式和鼠标滑入滑出绑定所产生的冲突。

```js
//假设oList是一个列表，并给列表下的每个列表项绑定多个事件，如移入移出。
oList.addEventListener('mouseover', function(){
  //mouseover只能在document中绑定的一个长时间触发的事件，必须依靠上层的oList元素做短时间的绑定
  document.addEventListener('mousemove', function(){...})
}, false);
oList.addEventListener('mouseout', function(){
  //移除
  document.removeEventListener('mousemove', function(){...})
}, false);
```

以上`mouseover`和`mousemove`两者结合的方式，可以在使用`mouseover`的同时又可以避免它自身的一个多次触发的机智，又可以利用`mousemove`长时间触发的状态，这样结合的方式也可以提高性能。



## 滚屏优化

在DOM4标准里，事件处理函数中`addEventListener(eventType, handler, capture)`。参数3`capture`对象中可以定义多个属性。

定义的`capture`属性具有冒泡变成捕获的作用。

```js
oDiv.addEventListener('touchstart', function(){}, { capture: true });
```

定义的`once`属性具有只调用事件处理函数一次的作用，会移除当前事件的监听器。

```js
oDiv.addEventListener('touchstart', function(){}, { once: true });
```

定义的`passive`属性具有优化的滚屏的作用。默认情况下,`passive`为`false`。当将`passive`定义为`true`并且执行`e.preventDefault()`来阻止默认行为时，会报错`Unable to preventDefault inside passive event listener invocation`，在定义`passive`为`true`时，永远不能调用阻止默认行为的方法。

在手机页面触摸屏幕时，浏览器默认设置`passive`为`true`。`touchstart`事件的默认行为是滚动。假如强制将`passive`设置为`false`会导致移动设备滚动页面时无法触发默认行为。

```js
window.addEventListener('touchstart', function(e){
  e.preventDefault(); 
  console.log(e.defaultPrevented); 
  //true 说明e.preventDefault()执行了并阻止了滚动的默认行为
}, { passive: false });
```

当`touchstart`事件触发时，执行顺序是处理器程序首先执行(大量的逻辑)，然后到默认行为的执行(如滚动)，此时会出现较大的问题是造成大量的性能浪费(等待时间过长导致卡顿)，因为导致移动设备在滚动页面时无法正常滚动，假如将`passive`属性设置为`true`，保证阻止默认行为的方法不会调用执行，开启两个线程去处理滚动问题，线程1保证处理器程序的执行，线程2执行默认行为，没有了等待的时间，使性能提升从而提高滚动屏幕的性能。



## 键盘事件

按键的3个事件分为`keydown`是按下事件，`keyup`是抬起事件。

定义三个按键事件，当随机按下一个键时，打印顺序如下。

```js
document.onkeydown = function () { console.log('keydown'); }
document.onkeyup = function () { console.log('keyup'); }
document.onkeypress = function () { console.log('keypress'); }

//print
keydown
keypress
keyup
```

`keydown`加上`keyup` 是否等于 `keypress`？结果是不成立的，`keydown`之后是`keyprress`，再之后是`keyup`。`keydown`和`keypress`具有相似性。

定义两个按键事件，当随机按住一个键不松开时，`keydown`事件会一直执行，直到松开按键才会执行`keyup`事件。在游戏开发时，用连续键时会涉及`keydown`事件比较多，比较常用。

```js
document.onkeydown = function (e) { console.log('keydown'); }
document.onkeyup = function (e) { console.log('keyup'); }
//print 
keydown keydown keydown.... keyup
```

键盘事件的构造函数为`KeyboardEvent`，`keydown`和`keypress`实例对象里保存一个`charCode`属性，属性值分别为`0`和`103`。说明`keydown`事件是没有`charCode`，`charCode`实际上是ASCII码。`keyCode`为键盘顺位码，`keypress`事件可以用两个码，`charCode`和`keyCode`的属性值是一样的。

`keypress`事件可以利用`e.charCode`去做更多的操作，如区分大小写，但是由于`keydown`没有而不能做更多的操作。

```js
//可以触发所有字符类的按键，但是不能触发方向键，shift,ctrl等功能键
document.onkeypress = function (e) {
  var str = String.fromCharCode(e.charCode);
  console.log(str); //打印按下的键的值 如g G
}
```

键盘上下左右控制小盒子移动。

```js

var box = document.getElementsByClassName('box')[0];

document.onkeydown = function (e) {
  var e = e || window.event,
    code = e.keyCode,
    boxLeft = getStyles(box, 'left'),
    boxTop = getStyles(box, 'top');

  switch (code) {
    //按左按键往左走
    case 37:
      box.style.left = boxLeft - 5 + 'px';
      break;
      //按右按键往右走
    case 39:
      box.style.left = boxLeft + 5 + 'px';
      break;
      //按上按键往上走
    case 38:
      box.style.top = boxTop - 5 + 'px';
      break;
      //按下按键往下走
    case 40:
      box.style.top = boxTop + 5 + 'px';
      break;
    default:
      break;
  }
}
```

