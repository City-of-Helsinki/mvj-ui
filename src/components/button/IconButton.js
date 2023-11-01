//@flow
import React from 'react';
import classNames from 'classnames';

type Props = {
  children?: any,
  className?: string,
  disabled?: boolean,
  onClick: Function,
  style?: Object,
  title?: string,
  type?: string,
  id?: string,
}

const IconButton = (React.forwardRef<Props, any>(
  ({
    children,
    className,
    disabled,
    onClick,
    style,
    title,
    id,
    type = 'button',
  }: Props, ref) => {
    return (
      <button
        className={classNames('icon-button-component', className)}
        onClick={onClick}
        disabled={disabled}
        style={style}
        title={title}
        type={type}
        id={id}
        ref={ref}
      >
        {children}
      </button>
    );
  }): React$AbstractComponent<Props, 'button'>);

export default IconButton;
