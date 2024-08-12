import React from "react";
import classNames from "classnames";
type Props = {
  className?: string;
};

const Divider = ({
  className
}: Props) => <div className={classNames('content__divider', className)}></div>;

export default Divider;