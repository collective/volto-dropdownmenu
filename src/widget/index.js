import loadable from '@loadable/component';

export const MenuConfigurationForm = loadable(() =>
  import(
    /* webpackChunkName: "volto-dropdownmenu-manage" */ './MenuConfigurationForm'
  ),
);

export const MenuConfigurationWidget = loadable(() =>
  import(
    /* webpackChunkName: "volto-dropdownmenu-manage" */ './MenuConfigurationWidget'
  ),
);

export const RadioWidget = loadable(() =>
  import(/* webpackChunkName: "volto-dropdownmenu-manage" */ './RadioWidget'),
);
