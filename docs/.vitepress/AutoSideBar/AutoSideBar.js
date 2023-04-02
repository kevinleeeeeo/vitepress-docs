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
    if (this.path === '/plans/') {
      let files = readDir(this.path);
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
    if (this.path === '/notes/') {
      let files = readDir(this.path);
      files.forEach((file) => {
        this.sideBarItems.push({
          text: file,
          link: `${this.path}${file}`
        });
      });

      return this.sideBarItems;
    }
  }
}
