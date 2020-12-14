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

  const getAnchorTarget = (nodeElement) => {
    if (nodeElement.nodeName === 'A') {
      return nodeElement;
    } else if (nodeElement.parentElement?.nodeName === 'A') {
      return nodeElement.parentElement;
    } else {
      return null;
    }
  };

  useEffect(() => {
    const clickListener = (e) => {
      const targetItem = getAnchorTarget(e.target);
      const dropdownmenuLinks = [
        ...document.querySelectorAll(
          '.navigation-dropdownmenu .dropdown-menu-wrapper ul li a, .navigation-dropdownmenu .dropdownmenu-blocks-column a, .dropdownmenu-footer a, .navigation-dropdownmenu .menu > a',
        ),
      ];

      if (
        dropdownmenuLinks?.length > 0 &&
        dropdownmenuLinks?.indexOf(targetItem) >= 0
      ) {
        setOpenDropodownIndex(-1);
        setMobileMenuOpen(false); //close mobile menu
      }
    };

    document.body.addEventListener('click', clickListener);

    return () => document.body.removeEventListener('click', clickListener);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleDropdownMenu = (index) => {
    if (openDropdownIndex === index) setOpenDropodownIndex(-1);
    else setOpenDropodownIndex(index);
  };

  const isMenuActive = (item) => {
    const paths = [...(item.navigationRoot ?? [])];
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
        (pathname?.length ? pathname : '/').match(
          new RegExp(flattenToAppURL(menu.rootPath)),
        ),
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
      <OutsideClickHandler
        onOutsideClick={() => {
          setOpenDropodownIndex(-1);
          if (isMobileMenuOpen) {
            setMobileMenuOpen(false);
          }
        }}
      >
        <Menu
          stackable
          pointing
          secondary
          className={
            isMobileMenuOpen ? 'open' : 'computer large screen widescreen only'
          }
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
                      <span>{item.title}</span>
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
                        <span>{item.title}</span>
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
                        closeMenu={() => setOpenDropodownIndex(-1)}
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
