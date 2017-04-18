// @flow
import React from 'react';
import classNames from 'classnames';

type Props = {
  active: ?string,
  className: ?string,
  items: Array<any>,
  onTabClick: Function
};

const Tabs = ({active, className, items, onTabClick}: Props) => {
  return (
    <ul className={classNames('mvj__tabs', className)}>
      {items.map((item, i) =>
        <li key={i}
            className={classNames({'is-active': active === item.id})}>
          <a aria-selected={active === item.id}
             onClick={() => onTabClick(item.id)}>
            {item.label}
          </a>
        </li>
      )}
    </ul>
  );
};

export default Tabs;
