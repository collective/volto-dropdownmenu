import { dropdownMenuNavItemsReducer } from './reducers';
import MenuConfigurationWidget from './widget/MenuConfigurationWidget';

export { MenuConfigurationWidget };

export default (config) => {
  config.widgets.id = {
    ...config.widgets.id,
    menu_configuration: MenuConfigurationWidget,
  };

  config.addonReducers = {
    ...config.addonReducers,
    dropdownMenuNavItems: dropdownMenuNavItemsReducer,
  };

  return config;
};
