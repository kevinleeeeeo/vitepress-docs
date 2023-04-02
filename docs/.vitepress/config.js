import { defineConfig } from 'vitepress';
// import autoSideBar from './AutoSideBar';
import generateIndexMdFile from './AutoGenrateIndexPage';

generateIndexMdFile(['/plans/', '/notes/']);

export default defineConfig({
  title: '大田',
  description: 'Vite & Vue powered static site generator.',
  author: 'kevinlee',
  base: '/', // https://gitee.com/kevinleeeee/vitepress-docs-site
  appearance: true,
  lastUpdated: true, //以git提交的时间为更新时间
  themeConfig: {
    siteTitle: '大田', //导航栏配置
    logo: '/img/dog.svg', //导航栏左侧头像,
    nav: [
      { text: 'Plans', link: '/plans/' },
      { text: 'Notes', link: '/notes/' }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/kevinlee-coder' },
      // You can also add custom icons by passing SVG as string:
      {
        icon: {
          svg: '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Gitee</title><path d="M11.984 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.016 0zm6.09 5.333c.328 0 .593.266.592.593v1.482a.594.594 0 0 1-.593.592H9.777c-.982 0-1.778.796-1.778 1.778v5.63c0 .327.266.592.593.592h5.63c.982 0 1.778-.796 1.778-1.778v-.296a.593.593 0 0 0-.592-.593h-4.15a.592.592 0 0 1-.592-.592v-1.482a.593.593 0 0 1 .593-.592h6.815c.327 0 .593.265.593.592v3.408a4 4 0 0 1-4 4H5.926a.593.593 0 0 1-.593-.593V9.778a4.444 4.444 0 0 1 4.445-4.444h8.296Z"/></svg>'
        },
        link: 'https://gitee.com/kevinleeeee'
      }
    ],
    // sidebar: autoSideBar(['/plans/', '/notes/'])
    sidebar: {
      '/notes/': [
        {
          text: 'ES6',
          collapsible: true,
          items: [
            {
              text: '1.新增特性',
              link: '/notes/ES6/1.新增特性'
            },
            {
              text: '2.Map&Set数据类型',
              link: '/notes/ES6/2.Map&Set数据类型'
            },
            {
              text: '3.面向对象',
              link: '/notes/ES6/3.面向对象'
            }
          ]
        }
      ]
    }
    // sidebar: {
    //   '/notes/': [
    //     {
    //       text: 'CSS',
    //       collapsible: true,
    //       items: [
    //         {
    //           text: 'CSS基础',
    //           link: '/notes/css/1.CSS基础'
    //         },
    //         {
    //           text: 'Flex布局',
    //           link: '/notes/css/2.Flex布局'
    //         }
    //       ]
    //     },
    //     {
    //       text: 'ES3&ES5',
    //       collapsible: true,
    //       items: [
    //         {
    //           text: '编程语言&浏览器历史',
    //           link: '/notes/es3&es5/1.编程语言&浏览器历史'
    //         },
    //         {
    //           text: '线程&脚本引入&变量&JS值&原始值&引用值&内存',
    //           link: '/notes/es3&es5/2.线程&脚本引入&变量&JS值&原始值&引用值&内存'
    //         }
    //       ]
    //     }
    //   ],
    //   '/plans/': [
    //     {
    //       text: 'Study Plans',
    //       collapsible: true,
    //       items: [
    //         { text: '2022年10月', link: '/plans/2022年10月' },
    //         { text: '2022年11月', link: '/plans/2022年11月' }
    //       ]
    //     }
    //   ]
    // }
    // lastUpdatedText: '上次更新时间', //最后更新时间文本
    // docFooter: { //上下篇文本
    //   prev: '上一篇',
    //   next: '下一篇'
    // }
  }
});
