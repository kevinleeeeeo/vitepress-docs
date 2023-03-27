import createSideConfig from './sidebar';
import AutoSideBar from './AutoSideBar';

const autoSideBar = (path) => {
  const vm = new AutoSideBar({ path: path });

  const sidebar = createSideConfig(vm, path);
  vm.generateIndexMdFile();
  return sidebar;
};

export default autoSideBar;