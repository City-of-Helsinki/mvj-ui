//@flow
import React from 'react';
import classNames from 'classnames';

type Props = {
  className?: string,
  disabled?: boolean,
  innerRef?: Function,
  onClick: Function,
  style?: Object,
  text: string,
  title?: string,
  type?: string,

}

const Button = ({className, disabled, innerRef, onClick, style, text, title, type = 'button'}: Props): React$Node => {
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
      {text}
    </button>
  );
};

export default Button;
