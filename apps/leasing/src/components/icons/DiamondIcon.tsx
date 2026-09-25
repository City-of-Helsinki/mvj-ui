import React from "react";
import classNames from "classnames";
type Props = {
  className?: string;
};

const DiamondIcon = ({ className }: Props) => (
  <svg
    className={classNames("icons", className)}
    focusable="false"
    viewBox="0 0 10 10"
  >
    <polygon points="5 0 10 5 5 10 0 5"></polygon>
  </svg>
);

export default DiamondIcon;
