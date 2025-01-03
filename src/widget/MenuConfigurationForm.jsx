import React, { useEffect } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { v4 as uuid } from 'uuid';
import { isEmpty } from 'lodash';
import { Form as UIForm, Grid, Button } from 'semantic-ui-react';
import Sidebar from '@plone/volto/components/manage/Sidebar/Sidebar';
import { Form } from '@plone/volto/components/manage/Form';
import {
  TextWidget,
  CheckboxWidget,
  ObjectBrowserWidget,
} from '@plone/volto/components/manage/Widgets';

import { RadioWidget } from 'volto-dropdownmenu/widget';
import { Portal } from 'react-portal';
import config from '@plone/volto/registry';

const messages = defineMessages({
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
  additionalClasses: {
    id: 'dropdownmenu-additionalClasses',
    defaultMessage: 'Additional classes',
  },
  additionalClassesDescription: {
    id: 'dropdownmenu-additionalClassesDescription',
    defaultMessage:
      'Additional classes for the item to apply specific styles, accordingly to site layout.',
  },
  blocks: {
    id: 'dropdownmenu-blocks',
    defaultMessage: 'Blocks',
  },
  blocks_description: {
    id: 'dropdownmenu-blocks-description',
    defaultMessage: 'Add some blocks to show in dropdown menu.',
  },
  deleteMenuItem: {
    id: 'dropdownmenu-deletemenuitem',
    defaultMessage: 'Delete menu item',
  },
  deleteButton: {
    id: 'dropdownmenu-deletemenuitem-button',
    defaultMessage: 'Delete menu item',
  },
  clickableNavigationRoots: {
    id: 'dropdownmenu-clickableNavigationRoots',
    defaultMessage: 'Clickable navigation roots',
  },
});

const MenuConfigurationForm = ({ id, menuItem, onChange, deleteMenuItem }) => {
  const intl = useIntl();
  const defaultBlockId = uuid();

  if (!menuItem.blocks_layout || isEmpty(menuItem.blocks_layout.items)) {
    menuItem.blocks_layout = {
      items: [defaultBlockId],
    };
  }
  if (!menuItem.blocks || isEmpty(menuItem.blocks)) {
    menuItem.blocks = {
      [defaultBlockId]: {
        '@type': config.settings.defaultBlockType,
      },
    };
  }

  const preventClick = (e) => {
    e.preventDefault();
  };

  const preventEnter = (e) => {
    if (e.code === 'Enter') {
      preventClick(e);
    }
  };

  useEffect(() => {
    document
      .querySelector('form.ui.form')
      .addEventListener('click', preventClick);

    document.querySelectorAll('form.ui.form input').forEach((item) => {
      item.addEventListener('keypress', preventEnter);
    });

    return () => {
      document
        .querySelector('form.ui.form')
        ?.removeEventListener('click', preventClick);
      document.querySelectorAll('form.ui.form input').forEach((item) => {
        item?.removeEventListener('keypress', preventEnter);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChangeFormData = (id, value) => {
    onChange({ ...menuItem, [id]: value });
  };

  const onChangeFormBlocks = (data) => {
    onChange({
      ...menuItem,
      blocks: data.blocks,
      blocks_layout: data.blocks_layout,
    });
  };

  return (
    <>
      <TextWidget
        id={`${id}-title`}
        title={intl.formatMessage(messages.title)}
        description=""
        required={true}
        value={menuItem.title}
        onChange={(id, value) => onChangeFormData('title', value)}
        className="menu-item-field-title"
      />
      <CheckboxWidget
        id={`${id}-visible`}
        title={intl.formatMessage(messages.visible)}
        description=""
        defaultValue={true}
        value={!!menuItem.visible}
        onChange={(id, value) => onChangeFormData('visible', value)}
        className="menu-item-field-visible"
      />
      <RadioWidget
        id={`${id}-mode`}
        title={intl.formatMessage(messages.mode)}
        description=""
        required={true}
        value={menuItem.mode}
        onChange={(id, value) => onChangeFormData('mode', value)}
        valueList={[
          {
            value: 'simpleLink',
            label: intl.formatMessage(messages.modeSimpleLink),
          },
          {
            value: 'dropdown',
            label: intl.formatMessage(messages.modeDropdown),
          },
        ]}
        className="menu-item-field-mode"
      />
      {menuItem.mode === 'simpleLink' && (
        <ObjectBrowserWidget
          id={`${id}-linkUrl`}
          title={intl.formatMessage(messages.linkUrl)}
          description=""
          required={true}
          mode="link"
          value={menuItem.linkUrl ?? []}
          onChange={(id, value) => onChangeFormData('linkUrl', value)}
          className="menu-item-field-linkUrl"
        />
      )}
      {menuItem.mode === 'dropdown' && (
        <React.Fragment>
          <div className="menu-item-field-navigationRoot">
            <ObjectBrowserWidget
              id={`${id}-navigationRoot`}
              title={intl.formatMessage(messages.navigationRoot)}
              description=""
              required={true}
              value={menuItem.navigationRoot ?? []}
              onChange={(id, value) =>
                onChangeFormData('navigationRoot', value)
              }
            />
          </div>

          {config.settings?.['volto-dropdownmenu']?.options
            ?.clickableNavigationRoots && (
            <div className="menu-item-field-clickableNavigationRoots">
              <CheckboxWidget
                id={`${id}-clickableNavigationRoots`}
                title={intl.formatMessage(messages.clickableNavigationRoots)}
                description=""
                defaultValue={true}
                value={!!menuItem.clickableNavigationRoots}
                onChange={(id, value) =>
                  onChangeFormData('clickableNavigationRoots', value)
                }
              />
            </div>
          )}
          <div className="menu-item-field-showMoreLink">
            <ObjectBrowserWidget
              id={`${id}-showMoreLink`}
              title={intl.formatMessage(messages.showMoreLink)}
              description=""
              mode="link"
              value={menuItem.showMoreLink ?? []}
              onChange={(id, value) => onChangeFormData('showMoreLink', value)}
            />
          </div>
          <div className="menu-item-field-showMoreText">
            <TextWidget
              id={`${id}-showMoreText`}
              title={intl.formatMessage(messages.showMoreText)}
              description=""
              value={menuItem.showMoreText}
              onChange={(id, value) => onChangeFormData('showMoreText', value)}
            />
          </div>
          <div className="menu-item-field-additionalClasses">
            <TextWidget
              id={`${id}-additionalClasses`}
              title={intl.formatMessage(messages.additionalClasses)}
              description={intl.formatMessage(
                messages.additionalClassesDescription,
              )}
              value={menuItem.additionalClasses}
              onChange={(id, value) =>
                onChangeFormData('additionalClasses', value)
              }
            />
          </div>
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
                      key={id}
                      formData={menuItem}
                      visual={true}
                      hideActions
                      onChangeFormData={onChangeFormBlocks}
                    />
                  </div>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </UIForm.Field>
        </React.Fragment>
      )}
      <UIForm.Field inline className="delete wide" id="menu-delete">
        <Grid>
          <Grid.Row stretched>
            <Grid.Column width={4}>
              <div className="wrapper"></div>
            </Grid.Column>
            <Grid.Column width={8}>
              <Button
                icon="trash"
                onClick={deleteMenuItem}
                id="delete-menuitem"
                negative
                content={intl.formatMessage(messages.deleteButton)}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </UIForm.Field>
      <Portal node={document.getElementById('sidebar')}>
        <Sidebar />
      </Portal>
    </>
  );
};

export default React.memo(MenuConfigurationForm);
