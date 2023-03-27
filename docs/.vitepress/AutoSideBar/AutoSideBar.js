import {
  readDir,
  removeFilesExt,
  excludeFile,
  writeFile,
  indexTemplate,
  dateReverse
} from './utils';

export default class AutoSideBar {
  constructor({ path }) {
    this.path = path;
    this.sideBarItems = [];
    this.files = [];
    this.indexContent = '';
  }

  createSideBarItems() {
    let files = readDir(this.path);
    // files = files.reverse();
    files = excludeFile(files, 'index.md');
    files = removeFilesExt(files);
    files = dateReverse(files);
    this.files = files;

    files.forEach((file) => {
      this.sideBarItems.push({
        text: file,
        link: `${this.path}${file}`
      });
    });

    return this.sideBarItems;
  }

  generateIndexMdFile() {
    this.indexContent = indexTemplate(this.files, this.path);
    writeFile(this.path, this.indexContent);
  }
}
