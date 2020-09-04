/**
 * Navigation components.
 * @module components/theme/Navigation/Navigation
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { NavLink } from 'react-router-dom';
import { defineMessages, injectIntl } from 'react-intl';
import { Menu, Dropdown } from 'semantic-ui-react';
import cx from 'classnames';
import { getBaseUrl } from '@plone/volto/helpers';
import { settings } from '~/config';

import { getControlpanel } from '@plone/volto/actions';

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

/**
 * Navigation container class.
 * @class Navigation
 * @extends Component
 */
class Navigation extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    getControlpanel: PropTypes.func.isRequired,
    pathname: PropTypes.string.isRequired,
    menuConfiguration: PropTypes.arrayOf(PropTypes.object).isRequired,
    lang: PropTypes.string.isRequired,
  };

  /**
   * Constructor
   * @method constructor
   * @param {Object} props Component properties
   * @constructs Navigation
   */
  constructor(props) {
    super(props);
    this.toggleMobileMenu = this.toggleMobileMenu.bind(this);
    this.closeMobileMenu = this.closeMobileMenu.bind(this);
    this.state = {
      isMobileMenuOpen: false,
    };
  }

  /**
   * Component will mount
   * @method componentWillMount
   * @returns {undefined}
   */
  UNSAFE_componentWillMount() {
    // this.props.getNavigation(
    //   getBaseUrl(this.props.pathname),
    //   settings.navDepth,
    // );
    this.props.getControlpanel('dropdown-menu-settings');
  }

  /**
   * Component will receive props
   * @method componentWillReceiveProps
   * @param {Object} nextProps Next properties
   * @returns {undefined}
   */
  // UNSAFE_componentWillReceiveProps(nextProps) {
  //   if (nextProps.pathname !== this.props.pathname) {
  //     this.props.getNavigation(
  //       getBaseUrl(nextProps.pathname),
  //       settings.navDepth,
  //     );
  //   }
  // }

  /**
   * Toggle mobile menu's open state
   * @method toggleMobileMenu
   * @returns {undefined}
   */
  toggleMobileMenu() {
    this.setState({ isMobileMenuOpen: !this.state.isMobileMenuOpen });
  }

  /**
   * Close mobile menu
   * @method closeMobileMenu
   * @returns {undefined}
   */
  closeMobileMenu() {
    if (!this.state.isMobileMenuOpen) {
      return;
    }
    this.setState({ isMobileMenuOpen: false });
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    const { lang, menuConfiguration, pathname } = this.props;
    const menu =
      menuConfiguration
        ?.filter((menu) =>
          (pathname?.length ? pathname : '/').match(new RegExp(menu.rootPath)),
        )
        .pop()?.items ?? [];

    return (
      <nav className="navigation">
        <div className="hamburger-wrapper mobile tablet only">
          <button
            className={cx('hamburger hamburger--collapse', {
              'is-active': this.state.isMobileMenuOpen,
            })}
            aria-label={
              this.state.isMobileMenuOpen
                ? this.props.intl.formatMessage(messages.closeMobileMenu, {
                    type: this.props.type,
                  })
                : this.props.intl.formatMessage(messages.openMobileMenu, {
                    type: this.props.type,
                  })
            }
            title={
              this.state.isMobileMenuOpen
                ? this.props.intl.formatMessage(messages.closeMobileMenu, {
                    type: this.props.type,
                  })
                : this.props.intl.formatMessage(messages.openMobileMenu, {
                    type: this.props.type,
                  })
            }
            type="button"
            onClick={this.toggleMobileMenu}
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
            this.state.isMobileMenuOpen
              ? 'open'
              : 'computer large screen widescreen only'
          }
          onClick={this.closeMobileMenu}
        >
          {menu
            ?.filter((item) => item.visible)
            ?.map((item, index) =>
              item.mode === 'simpleLink' ? (
                <NavLink
                  to={
                    item.linkUrl[0]['@id'] === '' ? '/' : item.linkUrl[0]['@id']
                  }
                  key={item.linkUrl[0]['@id'] + index}
                  className="item"
                  activeClassName="active"
                  exact={
                    settings.isMultilingual
                      ? item.linkUrl[0]['@id'] === `/${lang}`
                      : item.linkUrl[0]['@id'] === ''
                  }
                >
                  {item.title}
                </NavLink>
              ) : (
                <Dropdown
                  item
                  text={item.title}
                  key={item.title + index}
                  icon="dropdown"
                >
                  <Dropdown.Menu>
                    {item.navigationRoot?.map((navRoot) => (
                      <Dropdown.Item key={navRoot['@id']}>
                        {navRoot.Title}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              ),
            )}
        </Menu>
      </nav>
    );
  }
}

export default compose(
  injectIntl,
  connect(
    (state) => ({
      menuConfiguration: JSON.parse(
        state.controlpanels?.controlpanel?.data?.menu_configuration ?? '[]',
      ),
      lang: state.intl.locale,
    }),
    { getControlpanel },
  ),
)(Navigation);
