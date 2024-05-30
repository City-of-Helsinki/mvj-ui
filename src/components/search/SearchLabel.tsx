import React from "react";
type Props = {
  children?: any;
};

const SearchLabel = ({
  children
}: Props) => <span className='search__label'>{children}</span>;

export default SearchLabel;