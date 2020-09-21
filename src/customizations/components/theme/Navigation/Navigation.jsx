/**
 * Navigation components.
 * @module components/theme/Navigation/Navigation
 */

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { defineMessages, useIntl } from 'react-intl';
import { Menu, Button, Icon } from 'semantic-ui-react';
import cx from 'classnames';
import OutsideClickHandler from 'react-outside-click-handler';
import { settings } from '~/config';

import { flattenToAppURL } from '@plone/volto/helpers';

import DropdownMenu from '../../../../components/DropdownMenu';
import { getDropdownMenuNavitems } from '../../../../actions';

const messages = defineMessages({
  closeMobileMenu: {
    id: 'Close menu',
    defaultMessage: 'Close menu',
  },
  openMobileMenu: {
    id: 'Open menu',
    defaultMessage: 'Open menu',
  },
});

const Navigation = ({ pathname, type }) => {
  const intl = useIntl();
  const { lang } = intl.locale;
  const dispatch = useDispatch();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdownIndex, setOpenDropodownIndex] = useState(-1);

  const dropdownMenuNavItems = useSelector(
    (state) => state.dropdownMenuNavItems?.result,
  );

  useEffect(() => {
    dispatch(getDropdownMenuNavitems());
  }, [dispatch]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const toggleDropdownMenu = (index) => {
    if (openDropdownIndex === index) setOpenDropodownIndex(-1);
    else setOpenDropodownIndex(index);
  };

  const isMenuActive = (item) => {
    const paths = [...item.navigationRoot];
    if (item.showMoreLink?.length > 0) {
      paths.push(item.showMoreLink[0]);
    }

    return paths.reduce(
      (acc, path) =>
        acc ||
        flattenToAppURL(pathname).indexOf(flattenToAppURL(path['@id'])) > -1,
      false,
    );
  };

  const menu =
    dropdownMenuNavItems
      .filter((menu) =>
        (pathname?.length ? pathname : '/').match(new RegExp(menu.rootPath)),
      )
      .pop()?.items ?? [];

  return (
    <nav className="navigation navigation-dropdownmenu">
      <div className="hamburger-wrapper mobile tablet only">
        <button
          className={cx('hamburger hamburger--collapse', {
            'is-active': isMobileMenuOpen,
          })}
          aria-label={
            isMobileMenuOpen
              ? intl.formatMessage(messages.closeMobileMenu, {
                  type,
                })
              : intl.formatMessage(messages.openMobileMenu, {
                  type,
                })
          }
          title={
            isMobileMenuOpen
              ? intl.formatMessage(messages.closeMobileMenu, {
                  type,
                })
              : intl.formatMessage(messages.openMobileMenu, {
                  type,
                })
          }
          type="button"
          onClick={toggleMobileMenu}
        >
          <span className="hamburger-box">
            <span className="hamburger-inner" />
          </span>
        </button>
      </div>
      <OutsideClickHandler onOutsideClick={() => setOpenDropodownIndex(-1)}>
        <Menu
          stackable
          pointing
          secondary
          className={
            isMobileMenuOpen ? 'open' : 'computer large screen widescreen only'
          }
          onClick={closeMobileMenu}
        >
          {menu?.length > 0
            ? menu
                ?.filter((item) => item.visible)
                ?.map((item, index) =>
                  item.mode === 'simpleLink' ? (
                    <NavLink
                      to={flattenToAppURL(item.linkUrl?.[0]?.['@id'])}
                      key={item.linkUrl?.[0]?.['@id'] + index}
                      className="item"
                      activeClassName="active"
                      exact={
                        settings.isMultilingual
                          ? item.linkUrl?.[0]?.['@id'] === `/${lang}`
                          : item.linkUrl?.[0]?.['@id'] === ''
                      }
                    >
                      {item.title}
                    </NavLink>
                  ) : (
                    <React.Fragment key={item.linkUrl?.[0]?.['@id'] + index}>
                      <Button
                        className={cx('item', 'dropdownmenu-item', {
                          'active open': openDropdownIndex === index,
                          active: isMenuActive(item),
                        })}
                        onClick={() => toggleDropdownMenu(index)}
                      >
                        {item.title}
                        <Icon
                          name="dropdown"
                          size="large"
                          flipped={
                            openDropdownIndex === index ? 'vertically' : null
                          }
                        />
                      </Button>
                      <DropdownMenu
                        menu={item}
                        open={openDropdownIndex === index}
                      />
                    </React.Fragment>
                  ),
                )
            : null}
        </Menu>
      </OutsideClickHandler>
    </nav>
  );
};

export default Navigation;
