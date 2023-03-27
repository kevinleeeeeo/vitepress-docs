const createSideConfig = (vm, path) => {
  const items = vm.createSideBarItems();

  const sidebar = {
    [path]: [
      {
        text: 'Study Plans',
        collapsible: true,
        items: items
      }
    ]
  };

  return sidebar;
};

export default createSideConfig;
