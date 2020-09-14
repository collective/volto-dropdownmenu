import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { defineMessages, useIntl } from 'react-intl';
import { Segment, Dropdown, Grid } from 'semantic-ui-react';
import { ConditionalLink } from '@plone/volto/components';

import { getDropdownMenuNavitems } from '../actions';

import './dropdownmenu.css';

const DropdownMenu = ({ item }) => {
  const dispatch = useDispatch();
  const dropdownMenuNavItems = useSelector(
    (state) => state.dropdownMenuNavItems?.result?.items,
  );

  useEffect(() => {
    if (item?.navigationRoot?.length > 0) {
      dispatch(
        getDropdownMenuNavitems(
          item?.navigationRoot?.map((root) => root['@id']),
          2,
        ),
      );
    }
  }, [item, dispatch]);

  return (
    <Segment className="dropdown-menu">
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
        <Grid.Column>
          <Dropdown.Header>
            <ConditionalLink condition={true} to="/">
              Notizie
            </ConditionalLink>
          </Dropdown.Header>
          <Dropdown.Item>
            <NavLink to="/">Notizie 2018</NavLink>
          </Dropdown.Item>
          <Dropdown.Item>
            <NavLink to="/">Notizie 2019</NavLink>
          </Dropdown.Item>
          <Dropdown.Item>
            <NavLink to="/">Notizie 2020</NavLink>
          </Dropdown.Item>
        </Grid.Column>
        <Grid.Column>
          <Dropdown.Header>
            <ConditionalLink condition={true} to="/">
              Eventi
            </ConditionalLink>
          </Dropdown.Header>
          <Dropdown.Item>
            <NavLink to="/">Eventi 2018</NavLink>
          </Dropdown.Item>
          <Dropdown.Item>
            <NavLink to="/">Eventi 2019</NavLink>
          </Dropdown.Item>
          <Dropdown.Item>
            <NavLink to="/">Eventi 2020</NavLink>
          </Dropdown.Item>
        </Grid.Column>
      </Grid>
    </Segment>
  );
};

export default DropdownMenu;
