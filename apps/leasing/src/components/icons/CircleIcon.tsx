import React from "react";
import classNames from "classnames";

type Props = {
  className?: string;
};

const CircleIcon = ({ className }: Props) => (
  <svg
    className={classNames("icons", className)}
    focusable="false"
    viewBox="0 0 10 10"
  >
    <circle cx="5" cy="5" r="5"></circle>
  </svg>
);

export default CircleIcon;
