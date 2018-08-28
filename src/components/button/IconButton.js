//@flow
import React from 'react';
import classNames from 'classnames';

type Props = {
  children?: any,
  className?: string,
  disabled?: boolean,
  onClick: Function,
  style?: Object,
  title: string,
  type?: string,
}

const IconButton = ({children, className, disabled, onClick, style, title, type = 'button'}: Props) => {
  return (
    <button
      className={classNames('icon-button-component', className)}
      onClick={onClick}
      disabled={disabled}
      style={style}
      title={title}
      type={type}
    >
      {children}
    </button>
  );
};

export default IconButton;
