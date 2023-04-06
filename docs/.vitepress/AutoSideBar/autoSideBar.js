import {
  excludeFile,
  makesureMdfile,
  readDir,
  resolvePath,
  removeFilesExt,
  sortFiles,
  sortDate
} from '../AutoSideBar/utils';

const autoSideBar = (pathRules) => {
  const sidebar = {};
  //['/plans/', '/notes/']
  pathRules.forEach((path) => {
    sidebar[path] = createPathItems(path);
  });
  return sidebar;
};

function createPathItems(path) {
  let pathItems = [];
  switch (path) {
    case '/notes/':
      pathItems = createNotesItems(path);
      break;
    case '/plans/':
      pathItems = createPlansItems(path);
      break;
    default:
      pathItems = [];
      break;
  }

  /**
   * console.log(createNotesItems(path));
   * [
      {
        text: 'DOM&BOM',
        collapsible: true,
        items: [ [Object], [Object], [Object] ]
      },
      {
        text: 'ES3&ES5',
        collapsible: true,
        items: [
          [Object], [Object],
          [Object], [Object],
          [Object], [Object],
          [Object], [Object],
          [Object], [Object],
          [Object], [Object]
        ]
      },
      {
        text: 'ES6',
        collapsible: true,
        items: [ [Object], [Object], [Object], [Object], [Object], [Object] ]
      }
    ]
   */

  // console.log(createPlansItems(path));
  /**
   * createPlansItems(path)
   *
   */
  return pathItems;
}

function createNotesItems(path) {
  let textNames = readDir(resolvePath(`../..${path}`));
  const notesItems = [];

  //[ 'DOM&BOM', 'ES3&ES5', 'ES6', 'index.md' ]
  textNames = excludeFile(textNames, 'index.md');
  // console.log(textNames);
  //[ 'DOM&BOM', 'ES3&ES5', 'ES6' ]

  textNames.forEach((textName) => {
    notesItems.push({
      text: textName,
      collapsible: true,
      collapsed: true,
      items: createNotesTextItems(path, textName)
    });
  });
  return notesItems;
}

function createPlansItems(path) {
  // console.log(path);
  // /plans/
  const datesItems = [];
  let files = readDir(resolvePath(`../..${path}`));
  files = excludeFile(files, 'index.md');
  files = removeFilesExt(files);
  files = sortDate(files);
  // console.log(files);

  files.forEach((file) => {
    datesItems.push({
      text: file,
      link: `${path}${file}`
    });
  });

  return [
    { text: 'Date', collapsible: true, collapsed: false, items: datesItems }
  ];

  // return [
  //   {
  //     text: 'Date',
  //     collapsible: true,
  //     collapsed: false,
  //     items: [
  //       { text: 'Index', link: '/guide/' },
  //       { text: 'One', link: '/guide/one' },
  //       { text: 'Two', link: '/guide/two' }
  //     ]
  //   }
  // ];
}

function createNotesTextItems(path, textName) {
  // console.log(textName); DOM&BOM
  const notesTextItems = [];
  // console.log(resolvePath(`../..${path}/${textName}`));
  ///Users/kevinlee/front-end/docs/vitepress-docs-site/docs/notes/DOM&BOM

  let files = readDir(resolvePath(`../..${path}/${textName}`));
  // console.log(files);
  //[ '.DS_Store', 'DOM-事件.md', 'DOM概述&节点操作&尺寸.md', '浏览器对象模型(BOM).md' ]

  //保证都是.md文件
  files = makesureMdfile(files);
  files = removeFilesExt(files);
  files = sortFiles(files);
  // console.log(files);

  files.forEach((file) => {
    notesTextItems.push({
      text: file,
      link: `${path}${textName}/${file}`
    });
  });
  return notesTextItems;
}

export default autoSideBar;
