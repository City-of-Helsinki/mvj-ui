// @flow
import React from 'react';
import classNames from 'classnames';

type Props = {
  active: ?number,
  className: ?string,
  tabs: Array<any>,
  onTabClick: Function
};

const Tabs = ({active, className, tabs, onTabClick}: Props) => {

  return (
    <ul className={classNames('mvj__tabs', className)}>
      {tabs.map((tab, i) =>
        <li key={i}
          className={classNames({'is-active': Number(active) === i})}>
          <a aria-selected={Number(active) === i}
            onClick={() => onTabClick(i)}>
            {tab}
          </a>
        </li>
      )}
    </ul>
  );
};

export default Tabs;
