import React from "react";
import classNames from "classnames";
import BackIcon from "@/components/icons/BackIcon";
import IconButton from "./IconButton";
type Props = {
  className?: string;
  onClick: (...args: Array<any>) => any;
  title?: string;
  type?: string;
};

const BackButton = ({
  className,
  onClick,
  title,
  type = 'button'
}: Props) => <IconButton className={classNames('icon-button-component', className)} onClick={onClick} title={title} type={type}>
    <BackIcon />
  </IconButton>;

export default BackButton;