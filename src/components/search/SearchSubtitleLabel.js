// @flow
import React from 'react';

type Props = {
  children?: any,
  style?: Object,
}

const SearchSubtitleLabel = ({children, style}: Props): React$Node =>
  <div className='search__subtitle-label-column' style={style}>{children}</div>;

export default SearchSubtitleLabel;
