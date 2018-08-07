// @flow
import React from 'react';
import classNames from 'classnames';

type Props = {
  buttonComponent?: any,
  className?: string,
  text: any,
}

const RightSubtitle = ({buttonComponent, className, text}: Props) =>
  <div className={classNames('right-subtitle', className)}>
    {buttonComponent &&
      <div className='right-subtitle__button-component'>
        {buttonComponent}
      </div>
    }
    {text}
  </div>;

export default RightSubtitle;
