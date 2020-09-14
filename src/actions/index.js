/**
 * Dropdown menu items actions.
 * @module actions/getDropdownMenuNavitems
 */
export const GET_DROPDOWNMENU_NAVITEMS = 'GET_DROPDOWNMENU_NAVITEMS';

/**
 * Get dropdown menu items.
 * @function getDropdownMenuNavitems
 * @returns {Object} Get dropdown menu items action.
 * Es: http://localhost:8080/Plone/@search?path.query=/Plone/news&path.query=/Plone/events &path.depth=1&sort_on=getObjPositionInParent
 */
export function getDropdownMenuNavitems(
  paths,
  depth = 1,
  sortOn = 'getObjPositionInParent',
) {
  return {
    type: GET_DROPDOWNMENU_NAVITEMS,
    request: {
      op: 'get',
      path: `/@search?${
        paths.length ? 'path.query=' + paths.join('&path.query=') : ''
      }&path.depth=${depth}&sort_on=${sortOn}`,
    },
  };
}
