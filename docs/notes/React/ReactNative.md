# React Native

## 环境搭建

选择开发平台是`Windows`，目标平台是`Andriod`



**依赖：**

`Node`(`v14.8.0`)、`JDK `(`jdk-11.0.14_windows-x64_bin.exe`)和 `Android Studio`(`android-studio-2021.1.1.23-windows.exe`)



**搭建顺序：**

1. 安装`Andriod Studio`
2. 安装`Android SDK`(`Show Package Details`)
   1. `SDK Platforms`：`Android SDK Platform 30`, `Intel x86 Atom_64 System Image`
   2. `SDK Tools`：`Android SDK Build-Tools 30.0.2`,`NDK (Side by side)`：`20.1.5948944`
3. 配置`ANDRIOD_SDK_ROOT`环境变量
   1. `ANDROID_SDK_ROOT`：`C:\Users\kevin lee\AppData\Local\Android\Sdk`
   2. `ANDROID_HOME` ：`C:\Users\kevin lee\AppData\Local\Android\Sdk`
4. 添加工作目录到环境变量`Path`
   1. `%ANDROID_SDK_ROOT%\platform-tools`
   2. `%ANDROID_SDK_ROOT%\emulator`
   3. `%ANDROID_SDK_ROOT%\tools`
   4. `%ANDROID_SDK_ROOT%\tools\bin`
5. 开启模拟器(`AVD`)

文档：https://www.react-native.cn/docs/environment-setup





## 项目创建

**顺序：**

1. 创建项目
2. 启动模拟器
3. 编译并运行`React Native`应用

命令行：

```
npx react-native init txclass --version 0.61
```

启动项目：

```
npx react-native run-android
```



## 项目依赖

项目需要另外下载安装路由相关的依赖

```
@react-native-community/masked-view@0.1.6  #遮罩层
@react-navigation/bottom-tabs@5.0.2        #底部tab按钮
@react-navigation/native@5.0.2             #路由本地主程序
@react-navigation/stack@5.0.2              #点击跳转页面的栈
react-native-gesture-handler@1.5.6        #路由跳转综合管理工具

- 以上依赖的相关依赖 -
react-native-reanimated@1.7.0             #动画 
react-native-safe-area-context@0.7.2      #安全区域上下文
react-native-screens@2.0.0-beta.2         #屏幕相关 

react-native-swiper@1.5.14                #轮播图
react-native-vector-icons@6.6.0           #图标

- 连接原生库 -
npx react-native link
```



**`package.json`**

```
//测试成功 默认
{
  "name": "txclass",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "android": "react-native run-android",
    "ios": "react-native run-ios",
    "start": "react-native start",
    "test": "jest",
    "lint": "eslint ."
  },
  "dependencies": {
    "@react-native-community/masked-view": "^0.1.6",
    "@react-native-community/toolbar-android": "^0.2.1",
    "@react-navigation/bottom-tabs": "^5.0.2",
    "@react-navigation/native": "^5.0.2",
    "@react-navigation/stack": "^5.0.2",
    "react": "17.0.2",
    "react-native": "0.68.0",
    "react-native-gesture-handler": "^1.5.6",
    "react-native-gradle-plugin": "0.0.6",
    "react-native-reanimated": "^2.7.0",
    "react-native-safe-area-context": "^0.7.2",
    "react-native-screens": "^2.0.0-beta.2",
    "react-native-swiper": "^1.5.14",
    "react-native-vector-icons": "^6.7.0",
    "react-native-webview": "^11.18.1"
  },
  "devDependencies": {
    "@babel/core": "^7.12.9",
    "@babel/runtime": "^7.12.5",
    "@react-native-community/eslint-config": "^2.0.0",
    "babel-jest": "^26.6.3",
    "eslint": "^7.32.0",
    "jest": "^26.6.3",
    "metro-react-native-babel-preset": "^0.67.0",
    "react-test-renderer": "17.0.2"
  },
  "jest": {
    "preset": "react-native"
  }
}
```



## 核心组件

> **文档：**  https://www.react-native.cn/docs/components-and-apis

通过 `React Native`，您可以使用 `JavaScript `来访问移动平台的 `API`，以及使用 `React `组件来描述 `UI `的外观和行为：一系列可重用、可嵌套的代码。

`React Native` 还包括一组基本的，随时可用的原生组件，您可以使用它们来构建您的应用程序。这些是 `React Native` 的**核心组件**。



**视图（`Views`）**

在 `Android `和 `iOS `开发中，一个**视图**是 `UI `的基本组成部分：

- 屏幕上的一个小矩形元素、可用于显示文本、图像或响应用户输入。
- 甚至应用程序最小的视觉元素（例如一行文本或一个按钮）也都是各种视图。
- 某些类型的视图可以包含其他视图。全部都是视图。



`React Native` 具有许多核心组件，从表单控件到活动指示器，应有尽有。主要使用以下核心组件：

| REACT NATIVE UI COMPONENT | ANDROID VIEW   | IOS VIEW         | WEB ANALOG               | 说明                                                         |
| :------------------------ | :------------- | :--------------- | :----------------------- | :----------------------------------------------------------- |
| `<View>`                  | `<ViewGroup>`  | `<UIView>`       | A non-scrollling `<div>` | A container that supports layout with flexbox, style, some touch handling, and accessibility controls |
| `<Text>`                  | `<TextView>`   | `<UITextView>`   | `<p>`                    | Displays, styles, and nests strings of text and even handles touch events |
| `<Image>`                 | `<ImageView>`  | `<UIImageView>`  | `<img>`                  | Displays different types of images                           |
| `<ScrollView>`            | `<ScrollView>` | `<UIScrollView>` | `<div>`                  | A generic scrolling container that can contain multiple components and views |
| `<TextInput>`             | `<EditText>`   | `<UITextField>`  | `<input type="text">`    | Allows the user to enter text                                |



## 原生组件

在 `Android `开发中是使用 `Kotlin `或 `Java `来编写视图；在 `iOS `开发中是使用 `Swift` 或 `Objective-C` 来编写视图。

在 `React Native` 中，则使用 `React `组件通过 `JavaScript `来调用这些视图。在运行时，`React Native` 为这些组件创建相应的 `Android `和 `iOS `视图。

由于 `React Native` 组件就是对原生视图的封装，因此使用 `React Native` 编写的应用外观、感觉和性能与其他任何原生应用一样。我们将这些平台支持的组件称为**原生组件**。



### 点击跳转

`TouchableNativeFeedback`

在 Android 设备上，这个组件利用原生状态来渲染触摸的反馈。目前它只支持一个单独的 View 实例作为子节点。



`TouchableWithoutFeedback`

除非你有一个很好的理由，否则不要用这个组件。所有能够响应触屏操作的元素在触屏后都应该有一个视觉上的反馈（然而本组件没有任何视觉反馈），这也是为什么一个"web"应用总是显得不够"原生"的主要原因之一。

注意`TouchableWithoutFeedback`只支持一个子节点（不能没有子节点也不能多于一个）。如果你希望包含多个子组件，可以用一个 `View `来包装它们。

**触摸屏点击事件定义：**

```
import { StyleSheet, TouchableWithoutFeedback, Text, View } from "react-native";

const TouchableWithoutFeedbackExample = () => {
  const [count, setCount] = useState(0);

  const onPress = () => {
    setCount(count + 1);
  };

  return (
    <View>
      <View>
        <Text>Count: {count}</Text>
      </View>
      //嵌套组件 绑定onPress事件
      <TouchableWithoutFeedback onPress={onPress}>
        <View>
          <Text>Touch Here</Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}
```



### 刷新控制

在`ScrollView`组件`refreshControl`属性里定义，函数返回的是一个刷新组件`RefreshControl`

```
import {
  ScrollView,
  RefreshControl,
} from 'react-native';

const App = () => {
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
  }, []);

  return (
      <ScrollView
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
          />
        }
      >
        <Text>Pull down to see RefreshControl indicator</Text>
      </ScrollView>
  );
}
```

### 网页访问

`WebView`

创建一个原生的 `WebView`，可以用于访问一个网页。还可以直接嵌入 `html `代码.

```
//安装
npm i -S react-native-webview

//关联
npx react-native link react-native-webview

//安装安卓依赖android/gradle.properties and adding 2 lines:
android.useAndroidX=true
android.enableJetifier=true

//引入
import WebView from 'react-native-webview';

//使用
class MyWeb extends Component {
  render() {
    return (
      <WebView
        source={{uri: 'https://ke.qq.com/course/'+ courseId}}
        startInLoadingState={true}
      />
    );
  }
}
```



## `APIs`

### 样式抽象

`StyleSheet`

`StyleSheet `提供了一种类似 CSS 样式表的抽象。

```
//写法
import { StyleSheet, Text, View } from "react-native";

const App = () => (
  <View style={styles.container}>
    <Text style={styles.title}>React Native</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...
  },
  title: {
    marginTop: 16,
    ...
  }
```

从代码质量角度：

- 从渲染函数中移除具体的样式内容，可以使代码更清晰易读。
- 给样式命名也可以对渲染函数中的组件增加语义化的描述。



**实例方法：**

`create()`：给对象创建 `StyleSheet `样式引用。

```
static create(obj: object): object
```

`compose()`：合并两种样式

```
static compose(style1: object, style2: object): object | array<object>
```

```
//示例
const App = () => (
  <View style={container}>
    <Text style={text}>React Native</Text>
  </View>
);

const page = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 30,
    color: '#000'
  },
});

const lists = StyleSheet.create({
  listContainer: {
    flex: 1,
    backgroundColor: '#61dafb',
  },
  listItem: {
    fontStyle: 'italic',
    fontWeight: 'bold'
  },
});

const container = StyleSheet.compose(page.container, lists.listContainer);
const text = StyleSheet.compose(page.text, lists.listItem);
```



### 屏幕宽高

`Dimensions`

本模块用于获取设备屏幕的宽高。

```
import { Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
```



### 动画

`Animated`

`Animated`库旨在使动画变得流畅，强大并易于构建和维护.

`Animated`侧重于输入和输出之间的声明性关系，以及两者之间的可配置变换，此外还提供了简单的 `start/stop`方法来控制基于时间的动画执行。

创建动画最基本的工作流程是先创建一个 `Animated.Value` ，将它连接到动画组件的一个或多个样式属性，然后使用`Animated.timing()`通过动画效果展示数据的变化

下面的例子演示了一个根据动画值`fadeAnim`来淡入淡出的视图：

```
import { Animated } from "react-native";

class AniImage extends Component{
  render() {
    const { styles, uri } = this.props;

    this.animatedValue = new Animated.Value(0);

    const imgAnimation = this.animatedValue.interpolate({
      //输入范围(0-100)
      inputRange: [0, 100],
      //输出范围(0-1)
      outputRange: [0, 1]
    });

    return (
      <AniImage.Image
        onLoadEnd={() => {
          Animated.timing(this.animatedValue, {
            //最终希望的值是100 对应的是opacity
            toValue: 100,
            //需要500毫秒完成动画
            duration: 500,
            //启用一个驱动程序兼容
            useNativeDriver: true
          }).start();
        }}
      />
    );
  }
}

//外部使用该组件时写法
import AniImage from '../AniImage';
<AniImage styles={styles.imgView} uri={data.course_img}></AniImage>
```



## 访问网络

很多移动应用都需要从远程地址中获取数据或资源。你可能需要给某个 `REST AP`I 发起 `POST `请求以提交用户数据，又或者可能仅仅需要从某个服务器上获取一些静态内容。



**使用`Fetch`**

```
fetch('https://mywebsite.com/endpoint/', {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    //or
    //'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: JSON.stringify({
    firstParam: 'yourValue',
    secondParam: 'yourOtherValue'
  })
});
```



> **注意：**
>
> `fetch`在默认情况下，`iOS `和`Andriod`会阻止所有 `http `的请求，以督促开发者使用 `https`。
>
> 暂时解决办法：将`localhost`改为主机`ip`地址



## 库

### 导航

> **文档：** https://reactnavigation.org/docs/5.x/getting-started

`React Navigation` 提供了简单易用的跨平台导航方案，在 `iOS` 和 `Android `上都可以进行翻页式、`tab `选项卡式和抽屉式的导航布局。

在 `Web `浏览器中，您可以使用锚 ( `<a>`) 标签链接到不同的页面。当用户点击一个链接时，该 `URL `被推送到浏览器历史堆栈。当用户按下后退按钮时，浏览器会从历史堆栈顶部弹出该项目，因此活动页面现在是之前访问过的页面。`React Native` 没有像 `Web `浏览器那样内置的全局历史堆栈概念——这就是 `React Navigation` 进入故事的地方。

**安装**

```
npm install @react-navigation/native
npm install react-native-screens react-native-safe-area-context
```

`react-native-screens`包需要一个额外的配置步骤才能在 Android 设备上正常工作。编辑`MainActivity.java`位于`android/app/src/main/java/<your package name>/MainActivity.java`.

将以下代码添加到`MainActivity`类的主体中：

```
@Override
protected void onCreate(Bundle savedInstanceState) {
  super.onCreate(null);
}
```

复制并确保在此文件顶部添加导入语句：

```
import android.os.Bundle;
```

复制需要进行此更改以避免与 `View `状态相关的崩溃在 `Activity `重新启动时不一致。

需要将整个应用程序包装在`NavigationContainer`. 通常你会在你的入口文件中这样做，例如`index.js`or `App.js`：

```js
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  return (
    <NavigationContainer>{/* Rest of your app code */}</NavigationContainer>
  );
}
```

**安装本机堆栈导航器**

```
npm install @react-navigation/native-stack
```

**创建本机堆栈导航器**

`createStackNavigator`是一个函数，它返回一个包含 2 个属性的对象：`Screen`和`Navigator`. 它们都是用于配置导航器的 React 组件。`Navigator`应该包含元素作为其子元素，`Screen`以定义路由的配置。

`NavigationContainer`是一个管理我们的导航树并包含[导航状态](https://reactnavigation.org/docs/navigation-state)的组件。该组件必须包装所有导航器结构。通常，我们会在应用程序的根目录中渲染这个组件，该组件通常是从`App.js`.

```
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

**页面跳转**

`navigate()`

```
<Button
  title="Go to Details"
  onPress={() => navigation.navigate('Details')}
/>
```

**底部标签导航**

屏幕底部有一个简单的标签栏，可让您在不同的路线之间切换。路由是延迟初始化的——它们的屏幕组件在它们第一次获得焦点之前不会被挂载。

```
//安装
npm install @react-navigation/bottom-tabs
```

```
//使用
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
```

`Tab.Navigator`的属性：

`screenOptions`：用于导航器中屏幕的默认选项。是一个函数

```
<Tab.Navigator
  screenOptions={({ route }) => {
    tabBarIcon: () => {}
  }}
>
  <Tab.Screen name="Home" component={HomeScreen} />
  <Tab.Screen name="Settings" component={SettingsScreen} />
</Tab.Navigator>
```



### 图标

> **文档：**  https://github.com/oblador/react-native-vector-icons

使用`react-native-vector-icons`图标库来集成项目中使用，合适于按钮，`logo`，`tabBar`

```
//安装
npm install -S react-native-vector-icons@6.6.0
```

**安卓配置：**

使用 `Gradle`（推荐）
这种方法的优点是在构建时从这个模块中复制字体，以便字体和 JS 始终保持同步，从而使升级变得轻松。

```
//编辑 android/app/build.gradle ( NOT android/build.gradle ) 并添加以下内容：
apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"

//要自定义要复制的文件，请添加以下内容：
project.ext.vectoricons = [
    iconFontNames: [ 'MaterialIcons.ttf', 'EvilIcons.ttf' ] // Name of the font files you want to copy
]

apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"
```

```
//手动设置：
//将 Fonts 文件夹中的内容复制到 android/app/src/main/assets/fonts （注意小写字体文件夹）。
```

**使用**

```
//导入图标库
import Ionicons from 'react-native-vector-icons/Ionicons';

//定义底部Tab组件
function BottomTab() {
  //呈现一个标签栏，让用户在多个屏幕之间切换
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case '首 页':
              iconName = 'ios-home';
              break;
            case '列 表':
              iconName = 'ios-list';
              break;
          }

          return (
            <Ionicons
              name={iconName}
              size={size}
              color={color}
            />
          );
        }
      })}
      tabBarOptions={{
        activeTintColor: '#23b8ff',
        inactiveTintColor: '#999'
      }}
    >
      <Tab.Screen name="首 页" component={HomePage}></Tab.Screen>
      <Tab.Screen name="列 表" component={ListPage}></Tab.Screen>
    </Tab.Navigator>

  );
}
```

### 轮播图

`react-native-swiper`是一个能用于做轮播效果的三方组件

> **文档：**https://www.npmjs.com/package/react-native-swiper

```
//安装
npm i react-native-swiper@1.5.14 --save

//使用
import Swiper from 'react-native-swiper'

const styles = StyleSheet.create({
  wrapper: {},
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB'
  },
  slide2: {
    ...
  },
  slide3: {
    ...
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold'
  }
})
 
export default class SwiperComponent extends Component {
  render() {
    return (
      <Swiper style={styles.wrapper} showsButtons={true}>
        <View style={styles.slide1}>
          <Text style={styles.text}>Hello Swiper</Text>
        </View>
        <View style={styles.slide2}>
          <Text style={styles.text}>Beautiful</Text>
        </View>
        <View style={styles.slide3}>
          <Text style={styles.text}>And simple</Text>
        </View>
      </Swiper>
    )
  }
}
```





## 案例

**<u>案例：腾讯课堂</u>**

基于`ReactNative`开发的腾讯课堂移动端手机`App`应用

**技术：**

- `React Native`
- `Android Studio`

**环境搭建：**

- `Node`(`v14.8.0`)
- `JDK `(`jdk-11.0.14_windows-x64_bin.exe`)
-  `Android Studio`(`android-studio-2021.1.1.23-windows.exe`) 

**后端接口：**

模拟了一个后端数据，目录在`server`里，进入目录终端命令`npm run dev`启动

- 请求课堂(轮播图，推荐，分类，课程)(参数`field`)数据：`/getCourseDatas`
- 请求课程分类数据：`/getCourseFields`
- 请求课程列表数据：`/getCourses`

  

**搭建顺序：**

1. 安装`Andriod Studio`
2. 安装`Android SDK`(`Show Package Details`)
   1. `SDK Platforms`：`Android SDK Platform 30`, `Intel x86 Atom_64 System Image`
   2. `SDK Tools`：`Android SDK Build-Tools 30.0.2`,`NDK (Side by side)`：`20.1.5948944`
3. 配置`ANDRIOD_SDK_ROOT`环境变量
   1. `ANDROID_SDK_ROOT`：`C:\Users\kevin lee\AppData\Local\Android\Sdk`
   2. `ANDROID_HOME` ：`C:\Users\kevin lee\AppData\Local\Android\Sdk`
4. 添加工作目录到环境变量`Path`
   1. `%ANDROID_SDK_ROOT%\platform-tools`
   2. `%ANDROID_SDK_ROOT%\emulator`
   3. `%ANDROID_SDK_ROOT%\tools`
   4. `%ANDROID_SDK_ROOT%\tools\bin`
5. 开启模拟器(`AVD`)
6. 终端输入命令启动项目



**项目启动：**

```
npx react-native run-android
```

**项目目录：**

```
├─App.js - app入口文件/导入react/导入安卓Txclass组件
├─package.json
├─ios
├─android
├─andriod_app
|      ├─Txclass.js - 主APP程序/引入RN依赖/底部TAB栏组件/屏幕页面跳转
|      ├─utils 
|      |   ├─config.js - 配置文件/API
|      |   ├─extension.js - 扩展函数方法集合/数据过滤/导航器跳转封装/url地址格式化
|      |   ├─http.js - 封装请求fetch
|      |   └tools.js - 工具/获取设备屏幕宽高的对象
|      ├─styles
|      |   └commonStyles.js - 公共样式文件
|      ├─server - 后端API服务器
|      |   ├─index.js
|      |   ├─package.json
|      |   ├─data
|      |   |  ├─courseDatas.json
|      |   |  ├─courseField.json
|      |   |  ├─recomCourse.json
|      |   |  └swiper.json
|      ├─pages - 屏幕页面/数据请求/视图绑定
|      |   ├─Detail.js - 详情页
|      |   ├─Home.js - 首页
|      |   └List.js - 列表页
|      ├─models - 前端请求模型/请求函数封装
|      |   ├─Index.js - 首页
|      |   └List.js - 列表页
|      ├─components - 组件集合
|      |     ├─RecomCourseList - 推荐列表
|      |     |        ├─CourseItem.js
|      |     |        ├─index.js
|      |     |        └styles.js
|      |     ├─PageLoading - 页面切换加载图标
|      |     |      ├─index.js
|      |     |      └styles.js
|      |     ├─MyRefreshControl - 自封装的RefreshControl
|      |     |        └index.js
|      |     ├─MainTitle - 标题
|      |     |     ├─index.js
|      |     |     └styles.js
|      |     ├─Logo 
|      |     |  ├─index.js
|      |     |  └styles.js
|      |     ├─ListTab - tablist
|      |     |    ├─index.js
|      |     |    ├─styles.js
|      |     |    └TabItem.js
|      |     ├─IndexSwiper - 首页轮播图
|      |     |      ├─index.js
|      |     |      ├─styles.js
|      |     |      └SwiperItem.js
|      |     ├─CourseList - 课程列表
|      |     |     ├─CourseItem.js
|      |     |     ├─index.js
|      |     |     └styles.js
|      |     ├─Content - 文本内容
|      |     |    ├─index.js
|      |     |    └styles.js
|      |     ├─AniImage - 渐入渐出的自封装动画
|      |     |    └index.js
|      ├─assets - 静态资源文件
|      |   ├─img
|      |   |  ├─loading.gif
|      |   |  └logo.png
```



**源码地址：** https://gitee.com/kevinleeeee/rn-txclass-android-demo

