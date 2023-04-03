import { extname, resolve } from 'path';
import { readdirSync, writeFileSync } from 'fs';

export function readDir(path) {
  return readdirSync(path);
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
  writeFileSync(indexPath, content, function (err) {
    if (err) throw err;
    console.log('The index.md file has been created.');
  });
}

export function indexTemplate(datas, path) {
  //[2022年12月](/plans/2022年12月)

  let dateList = '';
  datas.forEach(function (data) {
    dateList += `- [${data}](${path}${data})\n`;
  });

  const planIndexMdTpl = `---\ntitle: Plans\nlang: en-US\n---\n# Study Plans\n## Date\n${dateList}`;

  return planIndexMdTpl;
}

export function formatPathNameToTextName(pathName) {
  pathName = removeSep(pathName);
  return pathName.split('')[0].toUpperCase() + pathName.substring(1);
}

export function removeSep(path) {
  return path.substring(1, path.length - 1);
}

export function resolvePath(path) {
  return resolve(__dirname, path);
}

export function makesureMdfile(files) {
  return files.filter((f) => extname(f) === '.md');
}

export function sortFiles(files) {
  return files.sort((a, b) => {
    a = Number(a.split('.')[0]);
    b = Number(b.split('.')[0]);
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  });
}

export function sortDate(files) {
  return files.sort((a, b) => {
    a = Date.parse(chsToEngDate(a));
    b = Date.parse(chsToEngDate(b));
    if (a < b) return 1;
    if (a > b) return -1;
    return 0;
  });
}

function chsToEngDate(file) {
  //2022年11月 -> 2022-11
  return file.replace('.md', '').replace('年', '-').replace('月', '');
}
