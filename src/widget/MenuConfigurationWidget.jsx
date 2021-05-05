import React, { useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import {
  Icon,
  Grid,
  Menu,
  Form,
  Button,
  Segment,
  Header,
} from 'semantic-ui-react';
import { TextWidget } from '@plone/volto/components';
import { flattenToAppURL } from '@plone/volto/helpers/Url/Url';

import MenuConfigurationForm from './MenuConfigurationForm';
import './menu_configuration.css';

const messages = defineMessages({
  menuItemsHeader: {
    id: 'dropdownmenu-menuitems-header',
    defaultMessage: 'Menu items',
  },
  addMenuPath: {
    id: 'dropdownmenu-add-rootpath',
    defaultMessage: 'Add menu path',
  },
  deleteMenuPath: {
    id: 'dropdownmenu-delete-menupath',
    defaultMessage: 'Delete menu path',
  },
  deleteButton: {
    id: 'dropdownmenu-delete-button',
    defaultMessage: 'Delete',
  },
  root_path: {
    id: 'dropdownmenu-rootpath',
    defaultMessage: 'Root path',
  },
  addMenuItem: {
    id: 'dropdownmenu-addmenuitem',
    defaultMessage: 'Add menu item',
  },
  moveMenuItemUp: {
    id: 'dropdownmenu-move-menuitem-up',
    defaultMessage: 'Move menu item up',
  },
  moveMenuItemDown: {
    id: 'dropdownmenu-move-menuitem-down',
    defaultMessage: 'Move menu item down',
  },
  emptyActiveMenuPath: {
    id: 'dropdownmenu-emptyActiveMenuPath',
    defaultMessage: 'Select a menu path',
  },
  emptyActiveMenuItem: {
    id: 'dropdownmenu-emptyActiveMenuItem',
    defaultMessage: 'Select a menu item',
  },
});

const defaultMenuItem = title => ({
  title,
  visible: true,
  mode: 'simpleLink',
  linkUrl: [],
});

const defaultRootMenu = title => ({
  rootPath: '/',
  items: [defaultMenuItem(title)],
});

const defaultMenuConfiguration = [defaultRootMenu(`Tab 0`)];

const MenuConfigurationWidget = ({
  value,
  id,
  onChange,
  required,
  title,
  description,
}) => {
  const intl = useIntl();
  const [menuConfiguration, setMenuConfiguration] = useState(
    value ? JSON.parse(value) : defaultMenuConfiguration,
  );
  const [activeMenu, setActiveMenu] = useState(0);
  const [activeMenuItem, setActiveMenuItem] = useState(0);

  const handleChangeConfiguration = value => {
    setMenuConfiguration(value);
    onChange(id, JSON.stringify(value));
  };

  const addMenuPath = e => {
    e.preventDefault();
    const menuItemsNumber = menuConfiguration.length;
    const menuItem = `/tab${menuItemsNumber}`;
    let newMenuConfiguration = [
      ...menuConfiguration,
      {
        ...defaultRootMenu(`Tab ${menuItemsNumber}`),
        rootPath: menuItem,
      },
    ];

    handleChangeConfiguration(newMenuConfiguration);
    setActiveMenu(newMenuConfiguration.length - 1);
  };

  const deleteMenuPath = (e, index) => {
    e.preventDefault();
    let newMenuConfiguration = [...menuConfiguration];
    newMenuConfiguration.splice(index, 1);

    if (activeMenu === index) {
      setTimeout(() => setActiveMenu(index > 0 ? index - 1 : 0), 0);
    }

    handleChangeConfiguration(newMenuConfiguration);
  };

  const deleteMenuItem = (e, pathIndex, index) => {
    e.preventDefault();
    let newMenuConfiguration = [...menuConfiguration];
    newMenuConfiguration[pathIndex].items.splice(index, 1);

    if (activeMenuItem === index) {
      setTimeout(() => setActiveMenuItem(index > 0 ? index - 1 : 0), 0);
    }

    handleChangeConfiguration(newMenuConfiguration);
  };

  const addMenuItem = (e, pathIndex) => {
    e.preventDefault();
    let newMenuConfiguration = [...menuConfiguration];
    newMenuConfiguration[pathIndex].items = [
      ...newMenuConfiguration[pathIndex].items,
      defaultMenuItem(`New ${newMenuConfiguration[pathIndex].items.length}`),
    ];

    setActiveMenuItem(newMenuConfiguration[pathIndex].items.length - 1);
    handleChangeConfiguration(newMenuConfiguration);
  };

  const onChangeMenuPath = (index, menu) => {
    let newMenuConfiguration = [...menuConfiguration];
    newMenuConfiguration[index] = menu;

    handleChangeConfiguration(newMenuConfiguration);
  };

  const onChangeMenuItem = (pathIndex, menuItemIndex, menuItem) => {
    let newMenuConfiguration = [...menuConfiguration];
    newMenuConfiguration[pathIndex].items[menuItemIndex] = menuItem;

    handleChangeConfiguration(newMenuConfiguration);
  };

  const moveMenuItem = (e, pathIndex, menuItemIndex, direction) => {
    e.preventDefault();
    const up = direction === 'up';
    let newMenuConfiguration = [...menuConfiguration];

    let menuItem = newMenuConfiguration[pathIndex].items[menuItemIndex];
    newMenuConfiguration[pathIndex].items.splice(menuItemIndex, 1);
    newMenuConfiguration[pathIndex].items.splice(
      menuItemIndex + (up ? -1 : 1),
      0,
      menuItem,
    );

    handleChangeConfiguration(newMenuConfiguration);
  };

  return (
    <div className="menu-configuration-widget">
      <Form.Field inline id={id}>
        <Grid>
          <Grid.Row>
            <Grid.Column width="12">
              <div className="wrapper">
                <label htmlFor="menu-configuration">{title}</label>
              </div>
            </Grid.Column>
            <Grid.Column width="12" className="menu-configuration-widget">
              <div id="menu-configuration">
                <Menu pointing secondary className="menu-path-menu">
                  {menuConfiguration.map((menu, idx) => (
                    <Menu.Item
                      key={`menu-path-${idx}`}
                      name={menu.rootPath}
                      active={activeMenu === idx}
                      onClick={() => {
                        setActiveMenu(idx);
                        setActiveMenuItem(0);
                      }}
                    >
                      <span>{flattenToAppURL(menu.rootPath)}</span>
                    </Menu.Item>
                  ))}
                  <Menu.Item
                    active={false}
                    name={intl.formatMessage(messages.addMenuPath)}
                    onClick={addMenuPath}
                  >
                    <Icon name="plus" />
                  </Menu.Item>
                </Menu>
                <Segment>
                  {activeMenu > -1 && activeMenu < menuConfiguration.length ? (
                    <Grid>
                      <Grid.Column
                        width={12}
                        className="dropdownmenu-rootpath-segment"
                      >
                        <TextWidget
                          id="rootPath"
                          title={intl.formatMessage(messages.root_path)}
                          description=""
                          required={true}
                          value={flattenToAppURL(
                            menuConfiguration[activeMenu].rootPath,
                          )}
                          onChange={(id, value) => {
                            onChangeMenuPath(activeMenu, {
                              ...menuConfiguration[activeMenu],
                              rootPath: value?.length ? value : '/',
                            });
                          }}
                        />
                        <Form.Field
                          inline
                          className="delete wide"
                          id="menupath-delete"
                        >
                          <Grid>
                            <Grid.Row stretched>
                              <Grid.Column width={4}>
                                <div className="wrapper"></div>
                              </Grid.Column>
                              <Grid.Column width={8}>
                                <Button
                                  icon="trash"
                                  negative
                                  onClick={e => deleteMenuPath(e, activeMenu)}
                                  id="delete-menupath"
                                  content={intl.formatMessage(messages.deleteButton)}
                                />
                              </Grid.Column>
                            </Grid.Row>
                          </Grid>
                        </Form.Field>
                      </Grid.Column>
                      <Grid.Column width={4}>
                        <Header as="h2" className="dropdownmenu-items-header">
                          {intl.formatMessage(messages.menuItemsHeader)}
                        </Header>
                        <Menu
                          fluid
                          vertical
                          tabular
                          className="menu-items-menu"
                        >
                          {menuConfiguration[activeMenu].items?.map(
                            (menuItem, idx) => (
                              <Menu.Item
                                key={`menu-item-${idx}`}
                                name={menuItem.title}
                                active={activeMenuItem === idx}
                                onClick={() => setActiveMenuItem(idx)}
                              >
                                <Button.Group vertical className="move-buttons">
                                  <Button
                                    disabled={idx === 0}
                                    size="tiny"
                                    icon={<Icon name="arrow left" />}
                                    title={intl.formatMessage(
                                      messages.moveMenuItemUp,
                                    )}
                                    onClick={e =>
                                      moveMenuItem(e, activeMenu, idx, 'up')
                                    }
                                  />
                                  <Button
                                    disabled={
                                      idx ===
                                      menuConfiguration[activeMenu].items
                                        .length -
                                        1
                                    }
                                    size="tiny"
                                    icon={<Icon name="arrow right" />}
                                    title={intl.formatMessage(
                                      messages.moveMenuItemDown,
                                    )}
                                    onClick={e =>
                                      moveMenuItem(e, activeMenu, idx, 'down')
                                    }
                                  />
                                </Button.Group>
                                <span>{menuItem.title}</span>
                              </Menu.Item>
                            ),
                          )}
                          <Menu.Item
                            name={intl.formatMessage(messages.addMenuItem)}
                            onClick={e => addMenuItem(e, activeMenu)}
                          >
                            <Icon name="plus" />
                          </Menu.Item>
                        </Menu>
                      </Grid.Column>
                      <Grid.Column stretched width={8}>
                        {activeMenuItem > -1 &&
                        activeMenuItem <
                          menuConfiguration[activeMenu].items?.length ? (
                          <MenuConfigurationForm
                            id={`${activeMenu}-${activeMenuItem}`}
                            menuItem={
                              menuConfiguration[activeMenu].items[
                                activeMenuItem
                              ]
                            }
                            onChange={menu =>
                              onChangeMenuItem(activeMenu, activeMenuItem, menu)
                            }
                            deleteMenuItem={e =>
                              deleteMenuItem(e, activeMenu, activeMenuItem)
                            }
                          />
                        ) : (
                          <span>
                            {intl.formatMessage(messages.emptyActiveMenuItem)}
                          </span>
                        )}
                      </Grid.Column>
                    </Grid>
                  ) : (
                    <span>
                      {intl.formatMessage(messages.emptyActiveMenuPath)}
                    </span>
                  )}
                </Segment>
              </div>
            </Grid.Column>
          </Grid.Row>
          {description && (
            <Grid.Row stretched>
              <Grid.Column stretched width="12">
                <p className="help">{description}</p>
              </Grid.Column>
            </Grid.Row>
          )}
        </Grid>
      </Form.Field>
    </div>
  );
};

export default MenuConfigurationWidget;
