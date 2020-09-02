import React, { useEffect } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { v4 as uuid } from 'uuid';
import { isEmpty } from 'lodash';
import { Form as UIForm, Grid } from 'semantic-ui-react';
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

const MenuConfigurationForm = ({ menuItem, onChange }) => {
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

  const onChangeFormData = (id, value) => {
    console.log('chg menu item');
    onChange({ ...menuItem, [id]: value });
  };

  const onChangeFormBlocks = (data) => {
    console.log('chg menu item');
    onChange({
      ...menuItem,
      blocks: data.blocks,
      blocks_layout: data.blocks_layout,
    });
  };

  return (
    <>
      <TextWidget
        id="title"
        title={intl.formatMessage(messages.title)}
        description=""
        required={true}
        value={menuItem.title}
        onChange={onChangeFormData}
      />
      <CheckboxWidget
        id="visible"
        title={intl.formatMessage(messages.visible)}
        description=""
        required={false}
        defaultValue={true}
        value={!!menuItem.visible}
        onChange={onChangeFormData}
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
        onChange={onChangeFormData}
      />
      {menuItem.mode === 'simpleLink' && (
        <ObjectBrowserWidget
          id="linkUrl"
          title={intl.formatMessage(messages.linkUrl)}
          description=""
          required={true}
          mode="link"
          value={menuItem.linkUrl ?? []}
          onChange={onChangeFormData}
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
            onChange={onChangeFormData}
          />
          <ObjectBrowserWidget
            id="showMoreLink"
            title={intl.formatMessage(messages.showMoreLink)}
            description=""
            required={false}
            mode="link"
            value={menuItem.showMoreLink ?? []}
            onChange={onChangeFormData}
          />
          <TextWidget
            id="showMoreText"
            title={intl.formatMessage(messages.showMoreText)}
            description=""
            required={false}
            value={menuItem.showMoreText}
            onChange={onChangeFormData}
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

      <Portal node={document.getElementById('sidebar')}>
        <Sidebar />
      </Portal>
    </>
  );
};

export default React.memo(MenuConfigurationForm);
