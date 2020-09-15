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

import { getControlpanel } from '@plone/volto/actions';

import DropdownMenu from '../../../../components/DropdownMenu';

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

  const initMenu = (menu) => {
    const menuItems =
      JSON.parse(menu)
        .filter((menu) =>
          (pathname?.length ? pathname : '/').match(new RegExp(menu.rootPath)),
        )
        .pop()?.items ?? [];

    return menuItems.reduce((acc, val) => {
      return val.mode === 'simpleLink'
        ? [
            ...acc,
            {
              ...val,
              linkUrl: {
                ...(val.linkUrl[0] ?? {}),
                ['@id']:
                  val.linkUrl[0]?.['@id']?.length > 0
                    ? val.linkUrl[0]?.['@id']
                    : '/',
              },
            },
          ]
        : [...acc, val];
    }, []);
  };

  const menu = useSelector((state) =>
    initMenu(
      state.controlpanels?.controlpanel?.data?.menu_configuration ?? '[]',
    ),
  );

  useEffect(() => {
    dispatch(getControlpanel('dropdown-menu-settings'));
  }, [dispatch]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const toggleDropdownMenu = (index) => {
    console.log(openDropdownIndex, index);
    if (openDropdownIndex === index) setOpenDropodownIndex(-1);
    else setOpenDropodownIndex(index);
  };

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
                    to={item.linkUrl['@id']}
                    key={item.linkUrl['@id'] + index}
                    className="item"
                    activeClassName="active"
                    exact={
                      settings.isMultilingual
                        ? item.linkUrl['@id'] === `/${lang}`
                        : item.linkUrl['@id'] === ''
                    }
                  >
                    {item.title}
                  </NavLink>
                ) : (
                  <OutsideClickHandler
                    onOutsideClick={() => setOpenDropodownIndex(-1)}
                    key={item.title + index}
                  >
                    <Button
                      className={`item dropdownmenu-item${
                        openDropdownIndex === index ? ' active' : ''
                      }`}
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
                    {openDropdownIndex === index && (
                      <DropdownMenu menu={item} />
                    )}
                  </OutsideClickHandler>
                ),
              )
          : null}
      </Menu>
    </nav>
  );
};

export default Navigation;
