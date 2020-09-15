import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import { defineMessages, useIntl } from 'react-intl';
import { Segment, Container, Icon, Grid } from 'semantic-ui-react';
import { map } from 'lodash';
import { ConditionalLink } from '@plone/volto/components';
import {
  flattenToAppURL,
  flattenHTMLToAppURL,
  getBlocksFieldname,
  getBlocksLayoutFieldname,
  hasBlocksData,
  getBaseUrl,
} from '@plone/volto/helpers';
import { settings, blocks } from '~/config';

import { getDropdownMenuNavitems } from '../actions';
import './dropdownmenu.css';

const messages = defineMessages({
  unknownBlock: {
    id: 'Unknown Block',
    defaultMessage: 'Unknown Block {block}',
  },
});

const DropdownMenu = ({ menu }) => {
  const intl = useIntl();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const dropdownMenuNavItems = useSelector(
    (state) => state.dropdownMenuNavItems?.result?.items,
  );
  const blocksFieldname = getBlocksFieldname(menu);
  const blocksLayoutFieldname = getBlocksLayoutFieldname(menu);

  //   useEffect(() => {
  //     if (menu?.navigationRoot?.length > 0) {
  //       dispatch(
  //         getDropdownMenuNavitems(
  //           menu?.navigationRoot?.map((root) => root['@id']),
  //           2,
  //         ),
  //       );
  //     }
  //   }, [menu.navigationRoot]);

  useEffect(() => {
    setTimeout(() => {
      setOpen(true);
    }, 0);

    return () => setOpen(false);
  }, []);

  return (
    <Segment className={`dropdown-menu${open ? ' open' : ''}`}>
      <div className="dropdown-menu-inner">
        <Grid container>
          {/* {item.navigationRoot?.map((navRoot) => (
      <Dropdown.Item key={navRoot['@id']}>
        <ConditionalLink
          to={navRoot['@id']}
          condition={item.navigationRoot.length > 1}
        >
          <header>{navRoot.Title}</header>
        </ConditionalLink>
        {dropdownMenuNavItems?.length > 0 && (
          <ul>
            {dropdownMenuNavItems.map((navItem) => (
              <li>{navItem.title}</li>
            ))}
          </ul>
        )}
      </Dropdown.Item>
    ))}
    {dropdownMenuNavItems?.map((navItem) => (
      <Dropdown.Item key={navItem['@id']}>
        <NavLink to={navItem['@id']}>{navItem.title}</NavLink>
      </Dropdown.Item>
    ))} */}
          <Grid.Column width={3}>
            <h2>
              <ConditionalLink condition={true} to="/">
                News
              </ConditionalLink>
            </h2>
            <ul>
              <li>
                <NavLink to="/">News 2018</NavLink>
              </li>
              <li>
                <NavLink to="/">News 2019</NavLink>
              </li>
              <li>
                <NavLink to="/">News 2020</NavLink>
              </li>
            </ul>
          </Grid.Column>
          <Grid.Column width={3}>
            <h2>
              <ConditionalLink condition={true} to="/">
                Events
              </ConditionalLink>
            </h2>
            <ul>
              <li>
                <NavLink to="/">Events 2018</NavLink>
              </li>
              <li>
                <NavLink to="/">Events 2019</NavLink>
              </li>
              <li>
                <NavLink to="/">Events 2020</NavLink>
              </li>
            </ul>
          </Grid.Column>
          {hasBlocksData(menu) && (
            <Grid.Column width={6}>
              {map(menu[blocksLayoutFieldname].items, (block) => {
                const blockType = menu[blocksFieldname]?.[block]?.['@type'];
                if (['title', 'pageDescription'].indexOf(blockType) > -1)
                  return null;

                const Block = blocks.blocksConfig[blockType]?.['view'] ?? null;
                return Block !== null ? (
                  <Block
                    key={block}
                    id={block}
                    properties={menu}
                    data={menu[blocksFieldname][block]}
                    path={getBaseUrl(location?.pathname || '')}
                  />
                ) : (
                  <div key={block}>
                    {intl.formatMessage(messages.unknownBlock, {
                      block: menu[blocksFieldname]?.[block]?.['@type'],
                    })}
                  </div>
                );
              })}
            </Grid.Column>
          )}
        </Grid>
        {menu.showMoreLink.length > 0 && menu.showMoreText.length > 0 && (
          <Container className="dropdownmenu-footer">
            <NavLink to={menu.showMoreLink[0]['@id'] ?? '#'}>
              {menu.showMoreText}
              <Icon name="arrow right" />
            </NavLink>
          </Container>
        )}
      </div>
    </Segment>
  );
};

export default DropdownMenu;
