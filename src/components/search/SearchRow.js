// @flow
import React from 'react';

type Props = {
  children: any,
  style?: Object,
}

const SearchRow = ({children, style}: Props) => <div className='search__row' style={style}>{children}</div>;

export default SearchRow;
