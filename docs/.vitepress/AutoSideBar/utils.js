import { resolve } from 'path';
import { readdirSync, writeFileSync } from 'fs';

export function readDir(path) {
  const dir = resolve(__dirname, `../..${path}`);
  const files = readdirSync(dir);
  return files;
}

export function removeFilesExt(files) {
  return files.map(function (file) {
    return file.substring(0, file.lastIndexOf('.'));
  });
}

export function excludeFile(files, name) {
  return files.filter(function (file) {
    return file !== name;
  });
}

export function writeFile(path, content) {
  const indexPath = resolve(__dirname, `../..${path}index.md`);
  console.log(indexPath);
  writeFileSync(indexPath, content, function (err) {
    if (err) throw err;
    console.log('The index.md file has been created.');
  });
}

export function indexTemplate(datas, path) {
  //[2022年12月](/plans/2022年12月)

  // console.log(datas, path);

  let dateList = '';
  datas.forEach(function (data) {
    dateList += `- [${data}](${path}${data})\n`;
  });

  const planIndexMdTpl = `---\ntitle: Plans\nlang: en-US\n---\n# Study Plans\n## Date\n${dateList}`;

  return planIndexMdTpl;
}

export function dateReverse(dates) {
  dates = dateFormatEnglish(dates);
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
