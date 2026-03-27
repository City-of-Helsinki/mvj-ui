import React from "react";
type Props = {
  children?: any;
};

const BoxContentWrapper = ({ children }: Props) => (
  <div className="box-content-wrapper">{children}</div>
);

export default BoxContentWrapper;
