import React from "react";
import classNames from "classnames";
type Props = {
  className?: string;
  isLoading: boolean;
};

const Loader = ({ className, isLoading }: Props) => {
  if (!isLoading) {
    return null;
  }

  return <div className={classNames("loader", className)} />;
};

export default Loader;
