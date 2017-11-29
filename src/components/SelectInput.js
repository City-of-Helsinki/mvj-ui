// @flow
import React from 'react';
import Select from 'react-select';

type Props = {
  multi?: boolean,
  onChange: Function,
  options: Array<Object>,
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
  searchable = true,
  value,
}: Props) => {
  return (
    <div className='select-input'>
      <Select
        arrowRenderer={arrowRenderer}
        backspaceRemoves={false}
        multi={multi}
        onChange={onChange}
        options={options}
        searchable={searchable}
        value={value}
      />
    </div>
  );
};

export default SelectInput;
