// @flow
import React from 'react';
import classNames from 'classnames';

type Props = Object;

const TabContent = (props: Props) => {
  if(!props.children.length) {
    return null;
  }

  return (
    <div className='tabs__content'>
      {props.children.map((item, index) =>
        <div key={index} className={classNames('tabs__content_pane-container', {'active': index === Number(props.active)})}>{item}</div>
      )}
    </div>
  );
};

export default TabContent;
