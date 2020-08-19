import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { Tab, Grid, Form } from 'semantic-ui-react';

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

const exampleMenuConfiguration = {
  '/': [
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
  '/it/sottosito': [
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
};

const MenuConfigurationWidget = ({
  value,
  id,
  onChange,
  required,
  title,
  description,
}) => {
  const intl = useIntl();
  const menuConfiguration = value
    ? JSON.parse(value)
    : exampleMenuConfiguration;
  const handleChangeConfiguration = (value) => {
    console.dir(value);
    onChange(id, JSON.stringify(value));
  };

  return (
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
                onChange={(e) =>
                  handleChangeConfiguration(JSON.parse(e.target.value))
                }
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
  );
};

export default MenuConfigurationWidget;
