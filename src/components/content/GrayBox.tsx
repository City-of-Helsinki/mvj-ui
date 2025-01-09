import React from "react";
import classNames from "classnames";
type Props = {
  children?: any;
  className?: string;
};

const GrayBox = ({ children, className }: Props) => (
  <div className={classNames("content__gray-box", className)}>{children}</div>
);

export default GrayBox;
