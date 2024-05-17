import React from "react";
import classNames from "classnames";
type Props = {
  children: any;
  className?: string;
};

const LoaderWrapper = ({
  children,
  className
}: Props) => <div className={classNames('loader__wrapper', className)}>{children}</div>;

export default LoaderWrapper;