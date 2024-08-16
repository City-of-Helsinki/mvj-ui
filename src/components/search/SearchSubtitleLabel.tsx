import React from "react";
type Props = {
  children?: any;
  style?: Record<string, any>;
};

const SearchSubtitleLabel = ({
  children,
  style
}: Props): JSX.Element => <div className='search__subtitle-label-column' style={style}>{children}</div>;

export default SearchSubtitleLabel;