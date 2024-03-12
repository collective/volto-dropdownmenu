export function getItemsByPath(items, pathname) {
  let rootPathConfig = null;
  const itemsByPath = Array.isArray(items)
    ? items?.reduce((acc, val) => {
        if (val.rootPath === '/') {
          rootPathConfig = val;
          return acc;
        }
        return { ...acc, [val.rootPath]: val };
      }, {})
    : [];

  console.log(itemsByPath, 'itemsByPath');

  const matchingPaths = Object.keys(itemsByPath)
    .filter((path) => {
      console.log(path, 'path');
      console.log(pathname, 'pathname - parametro');
      console.log(`${pathname.trim('/')}/`.startsWith(`${path}/`));
      return `${pathname.trim('/')}/`.includes(`${path}/`);
    })
    .sort((a, b) => {
      if (a.length > b.length) return -1;
      else if (a.length < b.length) return 1;
      else return 0;
    });

  // const matchingPaths = Object.keys(itemsByPath)
  //   .filter((path) => `${pathname.trim('/')}/`.includes(`${path}/`))
  //   .sort((a, b) => {
  //     if (a.length > b.length) return -1;
  //     else if (a.length < b.length) return 1;
  //     else return 0;
  //   });

  if (matchingPaths.length > 0) return itemsByPath[matchingPaths[0]].items;
  else if (rootPathConfig) return rootPathConfig.items;
  else return [];
}
