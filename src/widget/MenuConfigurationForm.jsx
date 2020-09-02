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
  SelectWidget,
  ObjectBrowserWidget,
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
  deleteMenuItem: {
    id: 'dropdownmenu-deletemenuitem',
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
  mode: {
    id: 'dropdownmenu-mode',
    defaultMessage: 'Mode',
  },
  modeSimpleLink: {
    id: 'dropdownmenu-mode-simpleLink',
    defaultMessage: 'Simple link',
  },
  modeDropdown: {
    id: 'dropdownmenu-mode-dropdown',
    defaultMessage: 'Dropdown',
  },
  linkUrl: {
    id: 'dropdownmenu-linkUrl',
    defaultMessage: 'Link',
  },
  navigationRoot: {
    id: 'dropdownmenu-navigationRoot',
    defaultMessage: 'Navigation root',
  },
  showMoreLink: {
    id: 'dropdownmenu-showMoreLink',
    defaultMessage: '"Show more" link',
  },
  showMoreText: {
    id: 'dropdownmenu-showMoreText',
    defaultMessage: '"Show more" link text',
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

  (menu.items ?? []).forEach((item) => {
    if (!item.blocks_layout || isEmpty(item.blocks_layout.items)) {
      item.blocks_layout = {
        items: [defaultBlockId],
      };
    }
    if (!item.blocks || isEmpty(item.blocks)) {
      item.blocks = {
        [defaultBlockId]: {
          '@type': settings.defaultBlockType,
        },
      };
    }
  });

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

    console.log('chg menu item');
    onChange({ ...menu, items: menuItems });
  };

  const onChangeFormBlocks = (idx) => (data) => {
    let menuItems = [...menu.items];
    menuItems[idx].blocks = data.blocks;
    menuItems[idx].blocks_layout = data.blocks_layout;

    console.log('chg menu item');
    onChange({ ...menu, items: menuItems });
  };

  const handleAccordionTitleClick = (e, titleProps) => {
    const { index } = titleProps;
    const newIndex = activeMenuItem === index ? -1 : index;

    setActiveMenuItem(newIndex);
  };

  const addMenuItem = (e) => {
    e.preventDefault();
    console.log('add menu item');
    onChange({
      ...menu,
      items: [...menu.items, defaultMenuItem(`New ${menu.items.length}`)],
    });
  };

  const deleteMenuItem = (e, index) => {
    e.preventDefault();
    console.log('remove menu item');

    let newMenuItems = [...menu.items];
    newMenuItems.splice(index, 1);
    onChange({
      ...menu,
      items: newMenuItems,
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
      <div>
        {menu.items?.map((menuItem, idx) => (
          <React.Fragment key={idx}>
            <div
              active={activeMenuItem === idx}
              index={idx}
              onClick={handleAccordionTitleClick}
            >
              <Icon name="dropdown" />
              {menuItem.title}
              <Button
                icon="trash"
                title={intl.formatMessage(messages.deleteMenuItem)}
                onClick={(e) => deleteMenuItem(e, idx)}
              />
            </div>
            <div active={activeMenuItem === idx}>
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
                <SelectWidget
                  id="mode"
                  title={intl.formatMessage(messages.mode)}
                  description=""
                  required={true}
                  value={menuItem.mode ? menuItem.mode : 'simpleLink'}
                  choices={[
                    ['simpleLink', intl.formatMessage(messages.modeSimpleLink)],
                    ['dropdown', intl.formatMessage(messages.modeDropdown)],
                  ]}
                  onChange={onChangeFormData(idx)}
                />
                {menuItem.mode === 'simpleLink' && (
                  <ObjectBrowserWidget
                    id="linkUrl"
                    title={intl.formatMessage(messages.linkUrl)}
                    description=""
                    required={true}
                    mode="link"
                    value={menuItem.linkUrl ?? []}
                    onChange={onChangeFormData(idx)}
                  />
                )}
                {menuItem.mode === 'dropdown' && (
                  <React.Fragment>
                    <ObjectBrowserWidget
                      id="navigationRoot"
                      title={intl.formatMessage(messages.navigationRoot)}
                      description=""
                      required={true}
                      value={menuItem.navigationRoot ?? []}
                      onChange={onChangeFormData(idx)}
                    />
                    <ObjectBrowserWidget
                      id="showMoreLink"
                      title={intl.formatMessage(messages.showMoreLink)}
                      description=""
                      required={false}
                      mode="link"
                      value={menuItem.showMoreLink ?? []}
                      onChange={onChangeFormData(idx)}
                    />
                    <TextWidget
                      id="showMoreText"
                      title={intl.formatMessage(messages.showMoreText)}
                      description=""
                      required={false}
                      value={menuItem.showMoreText}
                      onChange={onChangeFormData(idx)}
                    />
                    <UIForm.Field inline className="help wide" id="menu-blocks">
                      <Grid>
                        <Grid.Row stretched>
                          <Grid.Column width={12}>
                            <div className="wrapper">
                              <p className="help">
                                {intl.formatMessage(
                                  messages.blocks_description,
                                )}
                              </p>
                            </div>
                          </Grid.Column>
                        </Grid.Row>
                        <Grid.Row stretched>
                          <Grid.Column width={12}>
                            <div className="menu-blocks-container">
                              <Form
                                formData={menuItem}
                                visual={true}
                                hideActions
                                onChangeFormData={onChangeFormBlocks(idx)}
                              />
                            </div>

                            <Portal node={document.getElementById('sidebar')}>
                              <Sidebar />
                            </Portal>
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                    </UIForm.Field>
                  </React.Fragment>
                )}
              </>
            </div>
          </React.Fragment>
        ))}
      </div>
      <Button
        icon="plus"
        title={intl.formatMessage(messages.addMenuItem)}
        onClick={addMenuItem}
      />
    </>
  );
};

export default React.memo(MenuConfigurationForm);
