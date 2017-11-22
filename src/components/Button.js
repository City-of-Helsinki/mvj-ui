//@flow
import React from 'react';
import classNames from 'classnames';

type Props = {
  className?: string,
  text: string,
  onClick: Function,
  disabled?: boolean,
}

const Button = ({className, text, onClick, disabled}: Props) => {
  return (
    <button
      className={classNames('mvj-button', className)}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default Button;
