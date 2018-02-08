// @flow
import React from 'react';

type Props = {
  input: Object,
}

const FieldTypeCheckboxSingle = ({
  input: {name, onChange, value},
}: Props) => {
  const handleChange = () => {
    onChange(value ? false : true);
  };

  return (
    <div className='mvj-form-field'>
      <div className={'mvj-form-field__checkbox-single'}>
        <input
          checked={value}
          name={name}
          onChange={handleChange}
          type='checkbox'
          value={value}
        />
      </div>
    </div>
  );
};

export default FieldTypeCheckboxSingle;
