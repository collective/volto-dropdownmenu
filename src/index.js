import loadable from '@loadable/component';
import menuSVG from '@plone/volto/icons/menu.svg';
import { dropdownMenuNavItemsReducer } from './reducers';
import {
  MenuConfigurationWidget,
  MenuConfigurationForm,
} from 'volto-dropdownmenu/widget';

import { getDropdownMenuNavitems } from './actions';
import { getItemsByPath } from './utils';

export {
  MenuConfigurationWidget,
  getDropdownMenuNavitems,
  getItemsByPath,
  MenuConfigurationForm,
};

export default (config) => {
  config.widgets.id = {
    ...config.widgets.id,
    menu_configuration: MenuConfigurationWidget,
  };

  config.registerComponent({
    name: 'MenuConfigurationForm',
    component: MenuConfigurationForm,
  });

  config.addonReducers = {
    ...config.addonReducers,
    dropdownMenuNavItems: dropdownMenuNavItemsReducer,
  };

  config.settings.asyncPropsExtenders = [
    ...(config.settings.asyncPropsExtenders ?? []),
    {
      path: '/',
      extend: (dispatchActions) => {
        if (
          dispatchActions.filter(
            (asyncAction) => asyncAction.key === 'dropdownMenuNavItems',
          ).length === 0
        ) {
          dispatchActions.push({
            key: 'dropdownMenuNavItems',
            promise: ({ location, store: { dispatch } }) =>
              __SERVER__ && dispatch(getDropdownMenuNavitems()),
          });
        }
        return dispatchActions;
      },
    },
  ];

  config.settings.controlPanelsIcons['dropdown-menu-settings'] = menuSVG;

  config.settings['volto-dropdownmenu'] = {
    options: {
      clickableNavigationRoots: false, //if true, a checkbox option in dropdown menu appears
    },
  };

  return config;
};
