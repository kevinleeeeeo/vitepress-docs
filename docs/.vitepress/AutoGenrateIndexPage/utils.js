import { resolve, extname } from 'path';
import { readdirSync, unlinkSync, writeFileSync } from 'fs';

export function readDir(path) {
  return readdirSync(path);
}

export function planIndexTemplate(files, path) {
  files = dateReverse(files);
  //[2022年12月](/plans/2022年12月)
  let dateList = '';
  files.forEach(function (file) {
    dateList += `- [${file}](${path}${file})\n`;
  });
  return `---\ntitle: Plans\nlang: en-US\n---\n# Study Plans\n## Date\n${dateList}`;
}

export function noteIndexTemplate(titles, path) {
  // console.log(titles, path);
  //[ 'DOM&BOM', 'ES3&ES5', 'ES6' ] /notes/
  const titleObj = createTitleObj(titles, path);
  const content = createContentTemplate(titleObj, path);
  return `---\ntitle: Notes\nlang: en-US\n---\n# Study Notes\n\n${content}`;
}

export function dateReverse(dates) {
  dates = dateFormatEnglish(dates);
  dates = removeFilesExt(dates);
  dates = dates.sort((a, b) => {
    return Date.parse(b) - Date.parse(a);
  });
  dates = dateFormatChinese(dates);
  return dates;
}

export function dateFormatEnglish(dates) {
  return dates.map((date) => {
    date = date.replace('年', '-');
    date = date.replace('月', '');
    return date;
  });
}

export function dateFormatChinese(dates) {
  return dates.map((date) => {
    date = date.replace('-', '年');
    // date = date.replace('月', '');
    date = date.slice(0, date.length) + '月';
    return date;
  });
}

export function removeSep(path) {
  return path.substring(1, path.length - 1);
}

export function excludeFile(files, name) {
  return files.filter(function (file) {
    return file !== name;
  });
}

export function removeIndexPage(path) {
  unlinkSync(resolve(__dirname, '../../') + `${path}index.md`);
}

export function removeFilesExt(files) {
  return files.map(function (file) {
    return file.substring(0, file.lastIndexOf('.'));
  });
}

export function removeFileExt(file, ext) {
  return file.replace(ext, '');
}

export function writeFile(path, content) {
  const indexPath = resolve(__dirname, `../..${path}index.md`);
  writeFileSync(indexPath, content);
}

export function hasIndexMD(files, name) {
  // let bool = false;
  // files.forEach((file) => {
  //   if (file === name) {
  //     bool = true;
  //   } else {
  //     bool = false;
  //   }
  // });
  // return bool;
  return files.some((file) => file === name);
}

export function addExt(files, ext) {
  return files.map((file) => {
    return file + ext;
  });
}

export function resolvePath(path) {
  return resolve(__dirname, path);
}

function createTitle(title) {
  return `## ${title}\n`;
}

function createTitleObj(titles, path) {
  const titleObj = {};
  titles.forEach((title) => {
    // console.log(resolve(__dirname, `../..${path}/${title}`));
    ///Users/kevinlee/front-end/docs/vitepress-docs-site/docs/notes/DOM&BOM

    let files = readDir(resolve(__dirname, `../..${path}/${title}`));
    // console.log(files);
    //[ '.DS_Store', 'DOM-事件.md', 'DOM概述&节点操作&尺寸.md', '浏览器对象模型(BOM).md' ]

    //保证都是.md文件
    files = files.filter((f) => extname(f) === '.md');

    //排序文件
    files = sortFiles(files);

    titleObj[title] = {
      template: createTitle(title),
      files
    };
  });

  /**
   * console.log(titleObj);
   * {
   *   'DOM&BOM': {...},
   *   'ES3&ES5': {...},
   *   'ES6': {
          template: '## ES6\n',
          files: [
            '1.新增特性.md',
            '2.Map&Set数据类型.md',
            '3.面向对象.md',
            '4.异步.md',
            '5.遍历器.md',
            '6.模块化&新增对象方法.md'
          ]
        }
   * }
   */
  // console.log(titleObj);
  return titleObj;
}

function createContentTemplate(titleObj, path) {
  const dirnames = Object.keys(titleObj);
  let h2TitleTpl = '';
  dirnames.forEach((dirname) => {
    h2TitleTpl += titleObj[dirname].template;
    // console.log(h2TitleTpl);
    //## DOM&BOM \n

    const files = titleObj[dirname].files;
    // console.log(files);
    //[ 'DOM-事件.md', 'DOM概述&节点操作&尺寸.md', '浏览器对象模型(BOM).md' ]

    h2TitleTpl += createLinkTemplate(path, dirname, files);
  });
  return h2TitleTpl;
}

function createLinkTemplate(path, dirname, files) {
  // console.log(dirname, files);
  //DOM&BOM [ 'DOM-事件.md', 'DOM概述&节点操作&尺寸.md', '浏览器对象模型(BOM).md' ]
  let linkTpl = '';
  files.forEach((f) => {
    f = f.replace('.md', '');
    linkTpl += `- [${f}](${path}${dirname}/${f})\n`;
  });
  return linkTpl;
}

function sortFiles(files) {
  return files.sort((a, b) => {
    a = Number(a.split('.')[0]);
    b = Number(b.split('.')[0]);
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  });
}
