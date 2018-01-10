// @flow
import React from 'react';

type Props = {
  disabled?: boolean,
  onChange: Function,
  onKeyUp: Function,
  onSubmit: Function,
  placeholder?: string,
  type?: string,
  value: string,
}

const SearchInput = ({disabled, onChange, onKeyUp, onSubmit, placeholder = 'Hae hakusanalla', type = 'text', value = ''}: Props) => {
  return (
    <div className="search-input__component">
      <input
        className='search-input'
        disabled={disabled}
        onChange={onChange}
        onKeyUp={onKeyUp}
        placeholder={placeholder}
        type={type}
        value={value}
      />
      <span className="search-icon" onClick={onSubmit}></span>
    </div>
  );
};

export default SearchInput;
