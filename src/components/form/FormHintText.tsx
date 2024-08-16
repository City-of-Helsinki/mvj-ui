import React from "react";
import classNames from "classnames";
type Props = {
  children?: any;
  className?: string;
  style?: Record<string, any>;
};

const FormHintText = (props: Props): JSX.Element => {
  const {
    children,
    className,
    style
  } = props;
  return <p {...props} className={classNames('form__hint-text', className)} style={style}>{children}</p>;
};

export default FormHintText;