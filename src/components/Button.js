//@flow
import React from 'react';
import classNames from 'classnames';

type Props = {
  className?: string,
  text: string,
  onClick: Function,
  type?: string,
  disabled?: boolean,
}

const Button = ({className, text, onClick, type = 'button', disabled}: Props) => {
  return (
    <button
      className={classNames('mvj-button', className)}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {text}
    </button>
  );
};

export default Button;
