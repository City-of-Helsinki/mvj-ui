import React from "react";
type Props = {
  children?: any;
};

const ContentContainer = ({
  children
}: Props) => <div className="content-container">{children}</div>;

export default ContentContainer;