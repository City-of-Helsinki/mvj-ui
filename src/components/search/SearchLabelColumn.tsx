import React from "react";
type Props = {
  children?: any;
  style?: Record<string, any>;
};

const SearchLabelColumn = ({ children, style }: Props) => (
  <div className="search__label-column" style={style}>
    {children}
  </div>
);

export default SearchLabelColumn;
