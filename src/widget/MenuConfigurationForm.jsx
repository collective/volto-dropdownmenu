import React, { useEffect, useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { v4 as uuid } from 'uuid';
import { isEmpty } from 'lodash';
import { Form as UIForm, Grid } from 'semantic-ui-react';
import { Form, TextWidget, FormFieldWrapper } from '@plone/volto/components';

import { settings } from '~/config';
import './menu_configuration.css';

const messages = defineMessages({
  root_path: {
    id: 'Root path',
    defaultMessage: 'Root path',
  },
  blocks: {
    id: 'Menu Blocks',
    defaultMessage: 'Menu blocks',
  },
  blocks_description: {
    id: 'Menu Blocks description',
    defaultMessage: 'Add some blocks to show in dropdown menu.',
  },
});

const MenuConfigurationForm = ({ menu, onChange }) => {
  const intl = useIntl();

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

  let formBlocks = React.createRef();

  useEffect(() => {
    console.log('formBlocks', formBlocks);
  }, [formBlocks]);

  const onChangeFormData = (data) => {
    onChange(data);
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
          onChange({ ...menu, rootPath: value?.length ? value : '/' });
        }}
      />
      <UIForm.Field inline className="help" id="menu-blocks">
        <Grid>
          <Grid.Row stretched>
            <Grid.Column width={12}>
              <div className="wrapper">
                <p className="help" style={{ width: '100%' }}>
                  {intl.formatMessage(messages.blocks_description)}
                </p>
              </div>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row stretched>
            <Grid.Column
              width={12}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {' '}
              <Form
                formData={menu}
                visual={true}
                hideActions
                ref={formBlocks}
                onChangeFormData={onChangeFormData}
                onSubit={() => {}}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </UIForm.Field>
    </>
  );
};

export default MenuConfigurationForm;
