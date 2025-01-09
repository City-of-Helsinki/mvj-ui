import React from "react";
type Props = {
  children: any;
  style?: Record<string, any>;
};

const SearchRow = ({ children, style }: Props) => (
  <div className="search__row" style={style}>
    {children}
  </div>
);

export default SearchRow;
