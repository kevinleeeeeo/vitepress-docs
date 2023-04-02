import { formatPathNameToTextName } from './utils';

const createSideConfig = (vm, path) => {
  const items = vm.createSideBarItems();
  console.log(items);
  const text = formatPathNameToTextName(path);

  const sidebar = {
    [path]: [
      {
        text: `Study ${text}`,
        collapsible: true,
        items: items
      }
    ]
  };

  return sidebar;
};

export default createSideConfig;
