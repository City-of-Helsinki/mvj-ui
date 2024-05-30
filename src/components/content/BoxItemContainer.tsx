import React from "react";
import classNames from "classnames";
type Props = {
  children?: any;
  className?: string;
};

const BoxItemContainer = ({
  children,
  className
}: Props) => <div className={classNames('box-item-container', className)}>{children}</div>;

export default BoxItemContainer;