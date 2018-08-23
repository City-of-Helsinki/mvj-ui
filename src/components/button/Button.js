//@flow
import React from 'react';
import classNames from 'classnames';

type Props = {
  className?: string,
  disabled?: boolean,
  innerRef?: Function,
  label: string,
  onClick: Function,
  style?: Object,
  title?: string,
  type?: string,

}

const Button = ({className, disabled, innerRef, label, onClick, style, title, type = 'button'}: Props) => {
  return (
    <button
      ref={innerRef}
      className={classNames('mvj-button', className)}
      onClick={onClick}
      disabled={disabled}
      style={style}
      title={title}
      type={type}
    >
      {label}
    </button>
  );
};

export default Button;
