import React from "react";
import classNames from "classnames";
type Props = {
  children?: any;
  className?: string;
  style?: Record<string, any>;
};

const FormText = (props: Props): React.ReactNode => {
  const {
    children,
    className,
    style
  } = props;
  return <p {...props} className={classNames('form__text', className)} style={style}>{children}</p>;
};

export default FormText;