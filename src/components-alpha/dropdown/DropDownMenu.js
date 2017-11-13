import React from 'react';
import classNames from 'classnames';

type Props = {
  items: Array,
  onItemClick: Function,
  active: String,
  open: Boolean,
};

const defaultOnItemClick = (item) => {
  console.log('DropDownMenu - onItemClick', item);
};

const DropdownMenu = ({items, open = false, active, onItemClick = defaultOnItemClick}: Props) =>
  <div className={classNames('mvj-dropdown-menu', {
    'mvj-dropdown-menu--open': open,
  })}>
    <ul>
      {items.map((item, i) => <li key={i}>
        <a className={classNames('mvj-dropdown-menu__link', {
          'mvj-dropdown-menu__link--active': active === item.id,
        })} onClick={(e) => {
          e.preventDefault();
          return onItemClick(item);
        }}>{item.label}</a>
      </li>)}
    </ul>
  </div>;

export default DropdownMenu;
