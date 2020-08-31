import React, { useEffect, useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { v4 as uuid } from 'uuid';
import { isEmpty } from 'lodash';
import {
  Form as UIForm,
  Grid,
  Accordion,
  Icon,
  Button,
} from 'semantic-ui-react';
import {
  Form,
  TextWidget,
  CheckboxWidget,
  Sidebar,
} from '@plone/volto/components';
import { Portal } from 'react-portal';
import { settings } from '~/config';

const messages = defineMessages({
  root_path: {
    id: 'dropdownmenu-rootpath',
    defaultMessage: 'Root path',
  },
  addMenuItem: {
    id: 'dropdownmenu-addmenuitem',
    defaultMessage: 'Add menu item',
  },
  title: {
    id: 'dropdownmenu-title',
    defaultMessage: 'Title',
  },
  visible: {
    id: 'dropdownmenu-visible',
    defaultMessage: 'Visible',
  },
  blocks: {
    id: 'dropdownmenu-blocks',
    defaultMessage: 'Blocks',
  },
  blocks_description: {
    id: 'dropdownmenu-blocks-description',
    defaultMessage: 'Add some blocks to show in dropdown menu.',
  },
});

const MenuConfigurationForm = ({ menu, onChange, defaultMenuItem }) => {
  const intl = useIntl();
  const [activeMenuItem, setActiveMenuItem] = useState(-1);
  const defaultBlockId = uuid();

  if (!menu.blocks_layout || isEmpty(menu.blocks_layout.items)) {
    menu.blocks_layout = {
      items: [defaultBlockId],
    };
  }
  if (!menu.blocks || isEmpty(menu.blocks)) {
    menu.blocks = {
      [defaultBlockId]: {
        '@type': settings.defaultBlockType,
      },
    };
  }

  const preventClick = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    document
      .querySelector('form.ui.form')
      .addEventListener('click', preventClick);

    return () => {
      document
        .querySelector('form.ui.form')
        .removeEventListener('click', preventClick);
    };
  }, []);

  const onChangeFormData = (idx) => (id, value) => {
    let menuItems = [...menu.items];
    menuItems[idx][id] = value;

    console.log('chg menu items');
    onChange({ ...menu, items: menuItems });
  };

  const handleAccordionTitleClick = (e, titleProps) => {
    const { index } = titleProps;
    const newIndex = activeMenuItem === index ? -1 : index;

    setActiveMenuItem(newIndex);
  };

  const addMenuItem = (e) => {
    e.preventDefault();
    console.log('add menu items');
    onChange({
      ...menu,
      items: [...menu.items, defaultMenuItem(`New ${menu.items.length}`)],
    });
  };

  return (
    <>
      <TextWidget
        id="rootPath"
        title={intl.formatMessage(messages.root_path)}
        description=""
        required={true}
        value={menu.rootPath}
        onChange={(id, value) => {
          onChange({
            ...menu,
            rootPath: value?.length ? value : '/',
          });
        }}
      />
      <Accordion>
        {menu.items?.map((menuItem, idx) => (
          <React.Fragment key={idx}>
            <Accordion.Title
              active={activeMenuItem === idx}
              index={idx}
              onClick={handleAccordionTitleClick}
            >
              <Icon name="dropdown" />
              {menuItem.title}
            </Accordion.Title>
            <Accordion.Content active={activeMenuItem === idx}>
              <>
                <TextWidget
                  id="title"
                  title={intl.formatMessage(messages.title)}
                  description=""
                  required={true}
                  value={menuItem.title}
                  onChange={onChangeFormData(idx)}
                />
                <CheckboxWidget
                  id="visible"
                  title={intl.formatMessage(messages.visible)}
                  description=""
                  required={true}
                  defaultValue={true}
                  value={!!menuItem.visible}
                  onChange={onChangeFormData(idx)}
                />
              </>
            </Accordion.Content>
          </React.Fragment>
        ))}
      </Accordion>
      <Button
        icon="plus"
        title={intl.formatMessage(messages.addMenuItem)}
        onClick={addMenuItem}
      />
      <UIForm.Field inline className="help wide" id="menu-blocks">
        <Grid>
          <Grid.Row stretched>
            <Grid.Column width={12}>
              <div className="wrapper">
                <p className="help">
                  {intl.formatMessage(messages.blocks_description)}
                </p>
              </div>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row stretched>
            <Grid.Column width={12}>
              <div className="menu-blocks-container">
                <Form
                  formData={menu}
                  visual={true}
                  hideActions
                  onChangeFormData={onChange}
                />
              </div>

              <Portal node={document.getElementById('sidebar')}>
                <Sidebar />
              </Portal>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </UIForm.Field>
    </>
  );
};

export default React.memo(MenuConfigurationForm);
