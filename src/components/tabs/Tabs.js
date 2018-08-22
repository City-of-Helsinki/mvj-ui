// @flow
import React from 'react';
import classNames from 'classnames';

type Props = {
  active: ?number,
  className?: string,
  isEditMode: boolean,
  tabs: Array<any>,
  onTabClick: Function
};

const Tabs = ({active, className, isEditMode, tabs, onTabClick}: Props) => {
  const handleTabClick = (e: any, i: number) => {
    e.preventDefault();
    onTabClick(i);
  };

  return (
    <ul className={classNames('tabs', className)}>
      {tabs.map((tab, i) =>
        <li key={i}
          className={classNames({'is-active': Number(active) === i})}>
          <a aria-selected={Number(active) === i}
            aria-label={tab.label}
            href=''
            onClick={(e) => handleTabClick(e, i)}>
            <span className='tabs__label'>{tab.label}</span>
            {isEditMode && tab.hasError && <span className='tabs__error-badge' />}
            {isEditMode && tab.isDirty && !tab.hasError && <span className='tabs__dirty-badge' />}
          </a>
        </li>
      )}
    </ul>
  );
};

export default Tabs;
