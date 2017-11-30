// @flow
import React from 'react';
import Select from 'react-select';

type Props = {
  multi?: boolean,
  onChange: Function,
  options: Array<Object>,
  placeholder?: string,
  searchable?: boolean,
  value: any,

}

const arrowRenderer = () => {
  return (
    <i className='select-input__arrow-renderer'/>
  );
};

const SelectInput = ({
  multi = false,
  onChange,
  options,
  placeholder = 'Valitse ...',
  searchable = true,
  value,
}: Props) => {
  return (
    <div className='select-input'>
      <Select
        arrowRenderer={arrowRenderer}
        backspaceRemoves={false}
        clearAllText={'Poista valinnat'}
        multi={multi}
        onChange={onChange}
        options={options}
        placeholder={placeholder}
        searchable={searchable}
        value={value}
      />
    </div>
  );
};

export default SelectInput;
