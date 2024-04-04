import loadable from '@loadable/component';

export const MenuConfigurationForm = loadable(() =>
  import(
    /* webpackChunkName: "volto-dropdownmenu-manage" */ './widget/MenuConfigurationForm'
  ),
);

export const MenuConfigurationWidget = loadable(() =>
  import(
    /* webpackChunkName: "volto-dropdownmenu-manage" */ './widget/MenuConfigurationWidget'
  ),
);

export const RadioWidget = loadable(() =>
  import(
    /* webpackChunkName: "volto-dropdownmenu-manage" */ './widget/RadioWidget'
  ),
);
