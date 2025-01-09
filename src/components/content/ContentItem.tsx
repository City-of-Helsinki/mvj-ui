import React from "react";
type Props = {
  children?: any;
};

const ContentItem = ({ children }: Props) => (
  <div className="content-item">{children}</div>
);

export default ContentItem;
