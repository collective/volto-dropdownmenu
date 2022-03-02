# volto-dropdownmenu

Volto addon for a customizable dropdown menu.  
Intended to be used with [collective.volto.dropdownmenu](https://github.com/collective/collective.volto.dropdownmenu)

To be used with mrs-developer, see [Volto docs](https://docs.voltocms.com/customizing/add-ons/) for further usage informations.

Created with [voltocli](https://github.com/nzambello/voltocli).

## Installation 

Afer installation, please add following lines into package.json to enable it. 

```json 

 "addons": [
    "volto-dropdownmenu"
  ],

```

## Usage

> If you're using Volto < 12, then use [v1.3.0](https://github.com/collective/volto-dropdownmenu/tree/v1.3.0)

Simply load the addon in your project, then edit the configuration in `/controlpanel/dropdown-menu-settings`.
Example configuration to be saved in Plone [here](./menuConfigurationExample.json).

To use the default template for the dropdown menu, add `src/addons/volto-dropdownmenu/src/customizations` in your `package.json` in `customizationPaths`.

```json
  "customizationPaths": [
    "src/customizations",
    "src/addons/volto-dropdownmenu/src/customizations"
  ]
```

## Screenshots and demo

### Controlpanel

![Addon controlpanel](./docs/controlpanel.png)

### Dropdown menu

![Dropdown menu](./docs/dropdown-menu.png)

### Demo

You can watch a demonstration video on [YouTube](https://youtu.be/p2xBpTou26M)
