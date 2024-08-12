import React from "react";
import classNames from "classnames";
type Props = {
  children?: any;
  className?: string;
};

const GreenBox = ({
  children,
  className
}: Props) => <div className={classNames('content__green-box', className)}>{children}</div>;

export default GreenBox;