import MenuConfigurationWidget from './widget/MenuConfigurationWidget';

export { MenuConfigurationWidget };

export default config => {
  config.widgets.id = {
    ...config.widgets.id,
    menu_configuration: MenuConfigurationWidget,
  };

  return config;
};
