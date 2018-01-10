// @flow
import React from 'react';

type Props = {
  disabled?: boolean,
  onChange: Function,
  onKeyUp: Function,
  placeholder?: string,
  type?: string,
  value: string,
}

const SearchInput = ({disabled, onChange, onKeyUp, placeholder = 'Hae hakusanalle', type = 'text', value = ''}: Props) => {
  return (
    <input
      className='search-input'
      disabled={disabled}
      onChange={onChange}
      onKeyUp={onKeyUp}
      placeholder={placeholder}
      type={type}
      value={value}
    />
  );
};

export default SearchInput;
