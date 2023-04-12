# `TailwindCSS`

## 安装

安装依赖

```
npm install -D tailwindcss
npx tailwindcss init
```

配置路径

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./build/*.html'],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

在样式文件中引入指令。

```css
/* /src/input.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

启动 `Tailwind CLI` 构建过程。

```
npx tailwindcss -i ./src/input.css -o ./build/css/style.css --watch
```

在 `HTML` 中使用 `Tailwind`。

```html
<!doctype html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="/dist/output.css" rel="stylesheet">
</head>
<body>
  <h1 class="text-3xl font-bold underline">
    Hello world!
  </h1>
</body>
</html>
```

终端显示启动成功，`Live Server`启动查看页面。

## 插件

`vscode`高亮显示`tailwindcss`代码插件，`Tailwind CSS ItelliSense`，会在编写`html`页面时显示高亮`class`属性对应的值。

## 文档

在文档搜索查找`min-height`会显示相应的类名，如`min-h-screen`对应特性是`min-height: 100vh;`。

## 生态

关于`Tailwind CSS` 生态的[框架或组件库](https://github.com/icopy-site/awesome-cn/blob/master/docs/awesome/awesome-tailwindcss.md)。如[Flowrift](https://flowrift.com/w/)，一个封装好的`UI`组件库。如[Meraki UI](https://merakiui.com/)， 支持 `RTL` 语言的精美` Tailwind CSS` 组件。

## 在线

[TailwindCSS Play](https://play.tailwindcss.com/)，这是在线的编译器，实现显示测试代码。
