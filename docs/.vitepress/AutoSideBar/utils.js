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
