# volto-dropdownmenu

Volto addon for a customizable dropdown menu.
Intended to be used with [collective.volto.dropdownmenu](https://github.com/collective/collective.volto.dropdownmenu)

To be used with ``mrs-developer``, see [Volto docs](https://6.docs.plone.org/volto/development/add-ons/install-an-add-on-dev-18.html#configure-mrs-developer) for further usage information. The following is an example configuration:

```json
  "volto-dropdownmenu": {
    "output": "./packages/",
    "package": "volto-dropdownmenu",
    "url": "git@github.com:collective/volto-dropdownmenu.git",
    "https": "https://github.com/collective/volto-dropdownmenu.git",
    "branch": "master"
  }
```

Created with [voltocli](https://github.com/nzambello/voltocli).

## Installation

Afer installation, please add following lines into package.json to enable it.

```json

 "addons": [
    "volto-dropdownmenu"
  ],

```

## Usage

> If you are using Volto < 16, then use [v2.4.3](https://github.com/collective/volto-dropdownmenu/tree/v2.4.3)
>
> If you are using Volto < 12, then use [v1.3.0](https://github.com/collective/volto-dropdownmenu/tree/v1.3.0)

Simply load the addon in your project, then edit the configuration in `/controlpanel/dropdown-menu-settings`.
Example configuration to be saved in Plone [here](./menuConfigurationExample.json).

To use the default template for the dropdown menu, add `src/addons/volto-dropdownmenu/src/customizations` in your `package.json` in `customizationPaths`.

```json
  "customizationPaths": [
    "src/customizations",
    "src/addons/volto-dropdownmenu/src/customizations"
  ]
```

To customize the `MenuConfigurationForm` component, you can now create your own component in your site and replace it using the Volto component registry in your site config file:

```javascript
import MyMenuConfigurationForm from './src/MyMenuConfigurationForm';

config.registerComponent({
  name: 'MenuConfigurationForm',
  component: MyMenuConfigurationForm,
});
```

### Navigation roots

By default, navigation roots are clickable, but there's the possibility to make them not clickable.
Enabling the field 'clickableNavigationRoots' in ``volto-dropdownmenu`` config, a field appears in configuration form and let editor to decide if make navigation roots clickable or not.

```json
  config.settings["volto-dropdownmenu"] = {
    "options": {
      "clickableNavigationRoots": true, //if true, a checkbox option in dropdown menu appears
    },
  };
```

## Screenshots and demo

### Dropdown Menu Settings

![Dropdown Menu Settings](https://raw.githubusercontent.com/collective/volto-dropdownmenu/refs/heads/master/docs/images/dropdown-menu-settings.png "Dropdown Menu Settings")

### Control panel

![Add-on control panel](https://raw.githubusercontent.com/collective/volto-dropdownmenu/refs/heads/master/docs/images/controlpanel.png "Add-on control panel")

### Dropdown menu

![Dropdown menu](https://raw.githubusercontent.com/collective/volto-dropdownmenu/refs/heads/master/docs/images/dropdown-menu.png "Dropdown menu")

### Demo

You can watch a demonstration video on [YouTube](https://youtu.be/p2xBpTou26M)
