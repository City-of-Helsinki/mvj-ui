import React from "react";
import classNames from "classnames";
type Props = {
  children?: any;
  className?: string;
  disabled?: boolean;
  onClick: (...args: Array<any>) => any;
  style?: Record<string, any>;
  title?: string;
  type?: any;
  id?: string;
};
const IconButton = React.forwardRef<Props, any>(
  (
    {
      children,
      className,
      disabled,
      onClick,
      style,
      title,
      id,
      type = "button",
    }: Props,
    ref: any,
  ) => {
    return (
      <button
        className={classNames("icon-button-component", className)}
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
  },
);
export default IconButton;
