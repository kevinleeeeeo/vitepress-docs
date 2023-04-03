import {
  readDir,
  planIndexTemplate,
  noteIndexTemplate,
  writeFile,
  resolvePath,
  excludeFile
} from './utils';

export default (paths) => {
  paths.forEach((path) => {
    let files = readDir(resolvePath(`../..${path}`));
    files = excludeFile(files, 'index.md');

    if (path === '/plans/') {
      /**
       * [
            '2022年10月.md', '2022年11月.md',
            '2022年12月.md', '2022年1月.md',
            '2022年2月.md',  '2022年3月.md',
            '2022年4月.md',  '2022年5月.md',
            '2022年6月.md',  '2022年7月.md',
            '2022年8月.md',  '2022年9月.md',
            '2023年1月.md',  '2023年2月.md',
            '2023年3月.md',  '2023年4月.md',
            'index.md'
          ]
       */
      generatePlansIndexFile(files, path);
    }

    if (path === '/notes/') {
      generateNotesIndexFile(files, path);
    }
  });
};

function generatePlansIndexFile(files, path) {
  const indexContent = planIndexTemplate(files, path);
  writeFile(path, indexContent);
}

function generateNotesIndexFile(files, path) {
  const indexContent = noteIndexTemplate(files, path);
  writeFile(path, indexContent);
}
