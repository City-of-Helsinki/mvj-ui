// @flow
import React from 'react';

type Props = {
  children: any,
  onSubmit: Function,
}

const SearchContainer = ({children, onSubmit}: Props) => 
  <form onSubmit={onSubmit} className='search__container'>{children}</form>;

export default SearchContainer;
