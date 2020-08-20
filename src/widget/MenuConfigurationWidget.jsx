import React, { useEffect, useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { Tab, Grid, Form } from 'semantic-ui-react';
import { TextWidget } from '@plone/volto/components';
import MenuConfigurationForm from './MenuConfigurationForm';

/* Types definition

interface IMenuItemConfiguration {
  title: string;
  visible: boolean;
  mode: 'simpleLink' | 'dropdown';
  linkUrl?: string | null;
  navigationRoot?: string | null;
  showMoreText?: string | null;
  blocks?: object | null;
  blocksLayout?: object | null;
}

interface IMenuConfiguration {
  [id: string]: Array<IMenuItemConfiguration>;
}

*/
const exampleMenuConfiguration = [
  {
    rootPath: '/',
    items: [
      {
        title: 'Lorem ipsum',
        visible: true,
        mode: 'dropdown',
        navigationRoot: '/',
        showMoreText: 'Vedi tutto',
        blocks: {},
        blocksLayout: { items: [] },
      },
      {
        title: 'Dolor sit amet',
        visible: true,
        mode: 'simpleLink',
        linkUrl: '/it/dolor-sit-amet',
      },
    ],
  },
  {
    rootPath: '/it/sottosito',
    items: [
      {
        title: 'Lorem ipsum dolor',
        visible: true,
        mode: 'dropdown',
        navigationRoot: '/',
        showMoreText: 'Vedi tutto',
        blocks: {},
        blocksLayout: { items: [] },
      },
      {
        title: 'Dolor sit',
        visible: true,
        mode: 'simpleLink',
        linkUrl: '/it/dolor-sit-amet',
      },
    ],
  },
];

const messages = defineMessages({});

const defaultMenuItem = {
  title: '',
  visible: true,
  mode: 'simpleLink',
  linkUrl: '#',
};

const defaultRootMenu = {
  rootPath: '/',
  items: [defaultMenuItem],
};

const defaultMenuConfiguration = [defaultRootMenu];

const MenuConfigurationWidget = ({
  value,
  id,
  onChange,
  required,
  title,
  description,
}) => {
  const menuConfiguration = value
    ? JSON.parse(value)
    : defaultMenuConfiguration;
  const intl = useIntl();

  const newRootPane = {
    menuItem: '+',
    render: () => renderRootPane(defaultRootMenu),
  };

  const handleChangeConfiguration = (value) => {
    console.dir(value);
    onChange(id, JSON.stringify(value));
  };

  const initRootPanes = () => {
    let panes = [];

    menuConfiguration.map((menu, index) => {
      let pane = {
        menuItem: { key: index, content: menu.rootPath },
        render: () => renderRootPane(menu, index),
      };
      panes.push(pane);
    });
    panes.push(newRootPane);

    return panes;
  };
  const rootPanes = initRootPanes();

  const addRootTab = () => {
    const index = rootPanes.length - 1;
    const menuItem = `/new${index + 1}`;
    let newMenuConfiguration = [
      ...menuConfiguration,
      { ...defaultRootMenu, rootPath: menuItem },
    ];

    handleChangeConfiguration(newMenuConfiguration);
  };

  const onRootTabChange = (event, data) => {
    if (data.activeIndex == data.panes.length - 1) {
      addRootTab();
    }
  };

  const onChangeMenu = (index) => (menu) => {
    let newMenuConfiguration = [...menuConfiguration];
    newMenuConfiguration[index] = menu;

    handleChangeConfiguration(newMenuConfiguration);
  };

  const renderRootPane = (menu, index) => {
    //TODO: Mettere in un componente wrappato da React.memo
    return (
      <Tab.Pane>
        <MenuConfigurationForm menu={menu} onChange={onChangeMenu(index)} />
      </Tab.Pane>
    );
  };

  return (
    <>
      <Tab
        menu={{ fluid: true, vertical: true, tabular: true }}
        panes={rootPanes}
        grid={{ paneWidth: 9, tabWidth: 3 }}
        onTabChange={onRootTabChange}
      />

      <Form.Field inline required={required} id={id}>
        <Grid>
          <Grid.Row>
            <Grid.Column width="4">
              <div className="wrapper">
                <label htmlFor="menu-configuration">{title}</label>
              </div>
            </Grid.Column>
            <Grid.Column width="8" className="menu-configuration-widget">
              <div id="menu-configuration">
                <textarea
                  value={JSON.stringify(menuConfiguration)}
                  onChange={(e) => {
                    handleChangeConfiguration(JSON.parse(e.target.value));
                  }}
                />
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
    </>
  );
};

export default MenuConfigurationWidget;
