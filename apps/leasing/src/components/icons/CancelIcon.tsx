import React from "react";
import classNames from "classnames";
type Props = {
  className?: string;
};

const CancelIcon = ({ className }: Props) => (
  <svg viewBox="0 0 16 16" className={classNames("icons", className)}>
    {/* CC 4.0 https://fontawesome.com/license */}
    <path d="M8,0.1C3.6,0.1,0.1,3.6,0.1,8s3.5,7.9,7.9,7.9s7.9-3.5,7.9-7.9S12.4,0.1,8,0.1z M11.9,10.1c0.1,0.1,0.1,0.4,0,0.5l-1.3,1.3	c-0.1,0.1-0.4,0.1-0.5,0L8,9.8l-2.1,2.1c-0.1,0.1-0.4,0.1-0.5,0l-1.3-1.3c-0.1-0.1-0.1-0.4,0-0.5L6.2,8L4.1,5.9C4,5.8,4,5.5,4.1,5.4	l1.3-1.3C5.5,4,5.8,4,5.9,4.1L8,6.2l2.1-2.1c0.1-0.1,0.4-0.1,0.5,0l1.3,1.3c0.1,0.1,0.1,0.4,0,0.5L9.8,8L11.9,10.1z" />
  </svg>
);

export default CancelIcon;
