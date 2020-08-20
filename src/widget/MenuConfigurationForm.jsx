import React, { useEffect, useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { Tab, Grid, Form } from 'semantic-ui-react';
import { TextWidget } from '@plone/volto/components';

const messages = defineMessages({
  root_path: {
    id: 'Root path',
    defaultMessage: 'Root path',
  },
});

const MenuConfigurationForm = ({ menu, onChange }) => {
  const intl = useIntl();
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
    </>
  );
};

export default MenuConfigurationForm;
