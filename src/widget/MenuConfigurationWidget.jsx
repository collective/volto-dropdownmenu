import React, { useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { Tab, Grid, Form, Button } from 'semantic-ui-react';
import MenuConfigurationForm from './MenuConfigurationForm';
import './menu_configuration.css';

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
        showMoreLink: '/stuff',
        showMoreText: 'Show more',
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
    rootPath: '/it/subsite',
    items: [
      {
        title: 'Lorem ipsum dolor',
        visible: true,
        mode: 'dropdown',
        navigationRoot: '/',
        showMoreLink: '/it/subsite',
        showMoreText: 'Show more',
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

const messages = defineMessages({
  deleteMenuPath: {
    id: 'dropdownmenu-delete-menupath',
    defaultMessage: 'Delete menu path',
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
  const menuConfiguration = value
    ? JSON.parse(value)
    : defaultMenuConfiguration;
  const intl = useIntl();
  const [activeRootTab, setActiveRootTab] = useState(0);

  const handleChangeConfiguration = (value) => {
    console.dir(value);
    onChange(id, JSON.stringify(value));
  };

  const RootPane = React.memo(({ menu, index = -1 }) => (
    <Tab.Pane>
      <MenuConfigurationForm
        menu={menu}
        onChange={onChangeMenu(index)}
        defaultMenuItem={defaultMenuItem}
      />
    </Tab.Pane>
  ));

  const newRootPane = {
    menuItem: '+',
    render: () => <RootPane menu={defaultRootMenu('New')} />,
  };

  const rootPanes = [
    ...menuConfiguration.map((menu, index) => ({
      menuItem: {
        key: index,
        content: (
          <div className="dropdownmenu-menuItem">
            <span>{menu.rootPath}</span>
            <Button
              icon="trash"
              title={intl.formatMessage(messages.deleteMenuPath)}
              onClick={(e) => deleteRootTab(e, index)}
            />
          </div>
        ),
      },
      render: () => <RootPane menu={menu} index={index} />,
    })),
    newRootPane,
  ];

  const addRootTab = () => {
    const index = rootPanes.length - 1;
    const menuItem = `/tab${index + 1}`;
    let newMenuConfiguration = [
      ...menuConfiguration,
      { ...defaultRootMenu(`Tab ${index + 1}`), rootPath: menuItem },
    ];

    console.log('add tab');
    handleChangeConfiguration(newMenuConfiguration);
  };

  const deleteRootTab = (e, index) => {
    e.preventDefault();
    let newMenuConfiguration = [...menuConfiguration];
    newMenuConfiguration.splice(index, 1);

    if (activeRootTab === index) {
      setActiveRootTab(index > 0 ? index - 1 : 0);
    }
    setActiveRootTab(-1);

    console.log('del tab');
    handleChangeConfiguration(newMenuConfiguration);
  };

  const onRootTabChange = (e, data) => {
    if (data.activeIndex === data.panes.length - 1) {
      addRootTab();
    }

    setActiveRootTab(data.activeIndex);
  };

  const onChangeMenu = (index) => (menu) => {
    let newMenuConfiguration = [...menuConfiguration];
    newMenuConfiguration[index] = menu;

    console.log('menu chg');
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
                <Tab
                  menu={{
                    fluid: true,
                    vertical: true,
                    tabular: true,
                  }}
                  panes={rootPanes}
                  grid={{ paneWidth: 9, tabWidth: 3 }}
                  activeIndex={activeRootTab}
                  onTabChange={onRootTabChange}
                />

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
    </div>
  );
};

export default MenuConfigurationWidget;
