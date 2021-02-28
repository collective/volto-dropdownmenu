/**
 * Dropdown menu items actions.
 * @module actions/getDropdownMenuNavitems
 */
export const GET_DROPDOWNMENU_NAVITEMS = 'GET_DROPDOWNMENU_NAVITEMS';

/**
 * Get dropdown menu items.
 * @function getDropdownMenuNavitems
 * @returns {Object} Get dropdown menu items action.
 * Es: http://localhost:8080/Plone/@dropdown-menu
 */
export function getDropdownMenuNavitems() {
  return {
    type: GET_DROPDOWNMENU_NAVITEMS,
    request: {
      op: 'get',
      path: `/@dropdown-menu`,
    },
  };
}
