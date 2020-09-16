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
  root_path: {
    id: 'dropdownmenu-rootpath',
    defaultMessage: 'Root path',
  },
  addMenuItem: {
    id: 'dropdownmenu-addmenuitem',
    defaultMessage: 'Add menu item',
  },
  deleteMenuItem: {
    id: 'dropdownmenu-deletemenuitem',
    defaultMessage: 'Add menu item',
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

const defaultMenuItem = (title) => ({
  title,
  visible: true,
  mode: 'simpleLink',
  linkUrl: [],
});

const defaultRootMenu = (title) => ({
  rootPath: '/',
  items: [defaultMenuItem(title)],
});

const defaultMenuConfiguration = [defaultRootMenu];

const MenuConfigurationWidget = ({
  value,
  id,
  onChange,
  required,
  title,
  description,
}) => {
  const intl = useIntl();
  const [menuConfiguration] = useState(
    value ? JSON.parse(value) : defaultMenuConfiguration,
  );
  const [activeMenu, setActiveMenu] = useState(0);
  const [activeMenuItem, setActiveMenuItem] = useState(0);

  const handleChangeConfiguration = (value) => {
    console.dir(value);
    onChange(id, JSON.stringify(value));
  };

  const addMenuPath = (e) => {
    e.preventDefault();
    const menuItemsNumber = menuConfiguration.length;
    const menuItem = `/tab${menuItemsNumber}`;
    let newMenuConfiguration = [
      ...menuConfiguration,
      { ...defaultRootMenu(`Tab ${menuItemsNumber}`), rootPath: menuItem },
    ];

    console.log('add tab');
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

    console.log('del tab');
    handleChangeConfiguration(newMenuConfiguration);
  };

  const deleteMenuItem = (e, pathIndex, index) => {
    e.preventDefault();
    let newMenuConfiguration = [...menuConfiguration];
    newMenuConfiguration[pathIndex].items.splice(index, 1);

    if (activeMenuItem === index) {
      setTimeout(() => setActiveMenuItem(index > 0 ? index - 1 : 0), 0);
    }

    console.log('del menu item', pathIndex, index);
    handleChangeConfiguration(newMenuConfiguration);
  };

  const addMenuItem = (e, pathIndex) => {
    e.preventDefault();
    let newMenuConfiguration = [...menuConfiguration];
    newMenuConfiguration[pathIndex].items = [
      ...newMenuConfiguration[pathIndex].items,
      defaultMenuItem(`New ${newMenuConfiguration[pathIndex].items.length}`),
    ];

    console.log('add menu item', pathIndex);
    setActiveMenuItem(newMenuConfiguration[pathIndex].items.length - 1);
    handleChangeConfiguration(newMenuConfiguration);
  };

  const onChangeMenuPath = (index, menu) => {
    let newMenuConfiguration = [...menuConfiguration];
    newMenuConfiguration[index] = menu;

    console.log('menu chg', index);
    handleChangeConfiguration(newMenuConfiguration);
  };

  const onChangeMenuItem = (pathIndex, menuItemIndex, menuItem) => {
    let newMenuConfiguration = [...menuConfiguration];
    newMenuConfiguration[pathIndex].items[menuItemIndex] = menuItem;

    console.log('menu item chg', pathIndex, menuItemIndex);
    handleChangeConfiguration(newMenuConfiguration);
  };

  return (
    <div className="menu-configuration-widget">
      <Form.Field inline required={required} id={id}>
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
                      <span
                        style={{
                          display: 'inline-block',
                          minWidth: '3em',
                          paddingRight: '0.5em',
                        }}
                      >
                        {menu.rootPath}
                      </span>
                      <Button
                        icon="trash"
                        size="mini"
                        title={intl.formatMessage(messages.deleteMenuPath)}
                        onClick={(e) => deleteMenuPath(e, idx)}
                      />
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
                      <Grid.Column width={12}>
                        <TextWidget
                          id="rootPath"
                          title={intl.formatMessage(messages.root_path)}
                          description=""
                          required={true}
                          value={menuConfiguration[activeMenu].rootPath}
                          onChange={(id, value) => {
                            onChangeMenuPath(activeMenu, {
                              ...menuConfiguration[activeMenu],
                              rootPath: value?.length ? value : '/',
                            });
                          }}
                        />
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
                                <span>{menuItem.title}</span>
                                <Button
                                  icon="trash"
                                  size="mini"
                                  title={intl.formatMessage(
                                    messages.deleteMenuItem,
                                  )}
                                  onClick={(e) =>
                                    deleteMenuItem(e, activeMenu, idx)
                                  }
                                />
                              </Menu.Item>
                            ),
                          )}
                          <Menu.Item
                            name={intl.formatMessage(messages.addMenuItem)}
                            onClick={(e) => addMenuItem(e, activeMenu)}
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
                            onChange={(menu) =>
                              onChangeMenuItem(activeMenu, activeMenuItem, menu)
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

export default React.memo(MenuConfigurationWidget);
