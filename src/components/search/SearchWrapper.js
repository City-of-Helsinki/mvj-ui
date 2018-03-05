// @flow
import React from 'react';

type Props = {
  buttonComponent: any,
  searchComponent: any,
}
const SearchWrapper = ({buttonComponent, searchComponent}: Props) =>
  <div className='search__wrapper'>
    <div className='search-container'>
      {searchComponent}
    </div>
    <div className='button-container'>
      {buttonComponent}
    </div>
  </div>;

export default SearchWrapper;
