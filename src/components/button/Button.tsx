import React from "react";
import classNames from "classnames";
type Props = {
  className?: string;
  disabled?: boolean;
  innerRef?: (...args: Array<any>) => any;
  onClick: (...args: Array<any>) => any;
  style?: Record<string, any>;
  text: string;
  title?: string;
  type?: any;
};

const Button = ({
  className,
  disabled,
  innerRef,
  onClick,
  style,
  text,
  title,
  type = 'button'
}: Props): React.ReactNode => {
  return <button ref={innerRef} className={classNames('mvj-button', className)} onClick={onClick} disabled={disabled} style={style} title={title} type={type}>
      {text}
    </button>;
};

export default Button;