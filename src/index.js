import { dropdownMenuNavItemsReducer } from './reducers';
import MenuConfigurationWidget from './widget/MenuConfigurationWidget';
import { getDropdownMenuNavitems } from './actions';

export { MenuConfigurationWidget, getDropdownMenuNavitems };

export default (config) => {
  config.widgets.id = {
    ...config.widgets.id,
    menu_configuration: MenuConfigurationWidget,
  };

  config.addonReducers = {
    ...config.addonReducers,
    dropdownMenuNavItems: dropdownMenuNavItemsReducer,
  };

  config.settings.extendableAsyncConnect = [
    ...config.settings.extendableAsyncConnect,
    {
      key: 'dropdownMenuNavItems',
      promise: ({ location, store: { dispatch } }) =>
        __SERVER__ && dispatch(getDropdownMenuNavitems()),
    },
  ];
  return config;
};
