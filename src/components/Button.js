//@flow
import React from 'react';
import classNames from 'classnames';

type Props = {
  className?: string,
  disabled?: boolean,
  onClick: Function,
  style?: Object,
  text: string,
  type?: string,

}

const Button = ({className, disabled, onClick, style, text, type = 'button'}: Props) => {
  return (
    <button
      className={classNames('mvj-button', className)}
      onClick={onClick}
      disabled={disabled}
      style={style}
      type={type}
    >
      {text}
    </button>
  );
};

export default Button;
