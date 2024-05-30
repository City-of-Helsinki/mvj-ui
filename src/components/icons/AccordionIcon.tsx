import React from "react";
import classNames from "classnames";
type Props = {
  className?: string;
};

const AccordionIcon = ({
  className
}: Props) => <svg className={classNames('icons', className)} focusable='false' viewBox="0 0 10 20">
    <g transform="translate(-133.000000, -502.000000)">
      <g transform="translate(86.000000, 369.000000)">
        <g transform="translate(33.000000, 117.000000)">
          <polygon points="24 26 14 36 14 16"></polygon>
        </g>
      </g>
    </g>
  </svg>;

export default AccordionIcon;