# `JSON`

## 概述

`JSON`是`JavaScript Object Notation` (`JavaScript`对象标记)，`JSON`是轻量级数据交互的格式，数据型的交换里面不包含方法。`JavaScript`对象的一种表达方式，是包含方法的。`JSON`是`JavaScript`对象的一个衍生，`JSON`选用映射的关系来形成一个轻量级的数据结构。

所有编程语言都离不开的三大数据类型是：

- `scalar`标量(字符串和数字)
- `sequence`序列(数组和列表)
- `mapping`映射(键值对)，如函数参数的映射关系，将两个不同的东西映射在一起，如键值对，`hash`表。

早期使用`XML`进行前后端的数据交互，优点是可以自定义标签，关于`XML`的缺点：

- 数据文档很大
- 不易读
- 解析难度比较大





## 写法

- 映射用冒号隔开
- 并列数据用逗号隔开
- 映射的集合用`{}`包裹
- 键名一定要用双引号
- 并列数据集合用`[]`包裹



## 转字符串

`JSON.parse()`将JSON字符串转换成`JSON`对象。`JSON.stringify()`将`JSON`数据转为字符串。前后端交互的数据只能是字符串。



## 应用

异步请求接口

```JS
var initDatas = (function () {
  function getDatas() {
    $.ajax({
      url: 'server/api.php',
      type: 'POST',
      dataType: 'JSON',
      data: { status: 1 },
      timeout: 50000,
      success: function (data) {
        console.log(data);
      },
      error: function () {
        console.log('获取数据失败');
      }
    })
  }
  return function () {
    getDatas();
  }
})();
```

第一次请求`JSON`数据后缓存在`div`盒子。

```html
<div id="J_data" style="display: none">JSONdata...</div>
```

在聊天室应用中，建立长链接通信时，使用`websocket`去通信，数据必须是字符串的`JSON`数据并传递后端，后端通过解析JSON数据并进行更改再广播出去。





## 缓存池

请求过的数据不再去请求，只要请求过一次就会缓存到前端，以便于减轻服务器的压力。



前端做数据缓存有以下方法：

- `localStroge`
- `sessionStroge`
- `cookies`
- `JS`脚本(适用于更新不太频繁的情况)





