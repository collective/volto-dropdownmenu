import React, { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { defineMessages, useIntl } from 'react-intl';
import { Segment, Container, Icon, Grid, Button } from 'semantic-ui-react';
import { map } from 'lodash';
import cx from 'classnames';
import { ConditionalLink } from '@plone/volto/components';
import {
  flattenToAppURL,
  getBlocksFieldname,
  getBlocksLayoutFieldname,
  hasBlocksData,
  getBaseUrl,
} from '@plone/volto/helpers';
import config from '@plone/volto/registry';

import './dropdownmenu.css';

const messages = defineMessages({
  unknownBlock: {
    id: 'Unknown Block',
    defaultMessage: 'Unknown Block {block}',
  },
  closeMenu: {
    id: 'dropdownmenu-close-menu-button',
    defaultMessage: 'Close menu',
  },
});

const DropdownMenu = ({ menu, open = false, closeMenu }) => {
  const intl = useIntl();
  const location = useLocation();
  const blocksFieldname = getBlocksFieldname(menu);
  const blocksLayoutFieldname = getBlocksLayoutFieldname(menu);
  const { clickableNavigationRoots = true } = menu;
  const navItemWidth = menu.navigationRoot?.length > 1 ? 3 : 4;
  const blocksWidth =
    menu.navigationRoot?.length === 1
      ? 8
      : menu.navigationRoot?.length > 2 || menu.navigationRoot?.length === 0
      ? 12
      : 6;
  let hasBlocks = hasBlocksData(menu);
  if (menu?.blocks && Object.keys(menu.blocks).length === 1) {
    let b = menu.blocks[Object.keys(menu.blocks)[0]];
    if (b['@type'] === 'text' && (!b.text || b.text?.length === 0)) {
      hasBlocks = false;
    }
  }

  const lastLinkEventListener = (e) => {
    if (e.code === 'Tab') {
      document
        .querySelector(
          '.dropdown-menu-wrapper.open button.dropdown-close-button',
        )
        .focus();
    }
  };

  useEffect(() => {
    const links = document.querySelectorAll('.dropdown-menu-wrapper.open a');
    const lastLink = links[links.length - 1];
    if (lastLink) {
      lastLink.addEventListener('keydown', lastLinkEventListener);
    }
  });

  return (
    <div
      className={cx('dropdown-menu-wrapper', {
        open,
        'multi-navigation-root': menu.navigationRoot?.length > 1,
      })}
      aria-hidden={!open}
      tabIndex={-1}
      role="menu"
    >
      <div className="dropdown-menu-inner">
        <Segment>
          <div className="dropdownmenu-close-button-wrapper">
            <Button
              className="dropdown-close-button"
              onClick={closeMenu}
              title={intl.formatMessage(messages.closeMenu)}
              icon="times"
              basic
              size="mini"
            />
          </div>
          <Grid container>
            {menu.navigationRoot?.map((navRoot) => (
              <Grid.Column width={navItemWidth} key={navRoot['@id']}>
                <h2>
                  <ConditionalLink
                    to={flattenToAppURL(navRoot['@id'])}
                    condition={
                      menu.navigationRoot?.length > 1 &&
                      clickableNavigationRoots
                    }
                  >
                    <span>{navRoot.title}</span>
                  </ConditionalLink>
                </h2>
                {navRoot.items?.length > 0 && (
                  <ul>
                    {navRoot.items?.map((navItem, idx) => (
                      <li key={navRoot['@id'] + idx}>
                        <NavLink to={flattenToAppURL(navItem['@id'])}>
                          <span>{navItem.title}</span>
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </Grid.Column>
            ))}
            {hasBlocks && (
              <Grid.Column
                width={blocksWidth}
                className="dropdownmenu-blocks-column"
              >
                {map(menu[blocksLayoutFieldname].items, (block) => {
                  const blockType = menu[blocksFieldname]?.[block]?.['@type'];
                  if (['title', 'pageDescription'].indexOf(blockType) > -1)
                    return null;

                  const Block =
                    config.blocks.blocksConfig[blockType]?.['view'] ?? null;
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
          {menu.showMoreLink?.length > 0 && menu.showMoreText?.length > 0 && (
            <Container className="dropdownmenu-footer">
              <NavLink
                to={flattenToAppURL(menu.showMoreLink[0]['@id']) ?? '#'}
                onClick={closeMenu}
              >
                <span>{menu.showMoreText}</span>
                <Icon name="arrow right" />
              </NavLink>
            </Container>
          )}
        </Segment>
      </div>
    </div>
  );
};

export default DropdownMenu;
