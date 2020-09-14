/**
 * Dropdown menu items reducer.
 * @module reducers/dropdownMenuNavItemsReducer
 */

import { GET_DROPDOWNMENU_NAVITEMS } from '../actions';

const initialState = {
  error: null,
  hasErrror: false,
  result: [],
  loadingResults: false,
};

export const dropdownMenuNavItemsReducer = (
  state = initialState,
  action = {},
) => {
  switch (action.type) {
    case `${GET_DROPDOWNMENU_NAVITEMS}_PENDING`:
      return {
        ...state,
        loadingResults: true,
      };
    case `${GET_DROPDOWNMENU_NAVITEMS}_SUCCESS`:
      return {
        ...state,
        result: action.result,
        loadingResults: false,
      };
    case `${GET_DROPDOWNMENU_NAVITEMS}_FAIL`:
      return {
        ...state,
        error: action.error,
        hasError: true,
        loadingResults: false,
      };
    default:
      return state;
  }
};
