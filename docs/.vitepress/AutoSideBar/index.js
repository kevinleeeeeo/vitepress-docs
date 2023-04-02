import createSideConfig from './sidebar';
import AutoSideBar from './AutoSideBar';

const autoSideBar = (pathRules) => {
  pathRules.forEach((path) => {
    const vm = new AutoSideBar({ path: path });
    const sidebar = createSideConfig(vm, path);
    return sidebar;
  });
};

export default autoSideBar;
