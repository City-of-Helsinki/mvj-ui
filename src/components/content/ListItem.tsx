import React from "react";
import classNames from "classnames";
type Props = {
  children?: any;
  className?: string;
};

const ListItem = ({
  children,
  className
}: Props) => <p className={classNames('content__list-item', className)}>{children}</p>;

export default ListItem;