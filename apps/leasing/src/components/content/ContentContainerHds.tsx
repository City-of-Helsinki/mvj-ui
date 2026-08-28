import React from "react";
type Props = {
  children?: any;
};

const ContentContainerHds = ({ children }: Props) => (
  <div className="content-container-hds">{children}</div>
);

export default ContentContainerHds;
