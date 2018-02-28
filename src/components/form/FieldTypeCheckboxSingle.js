// @flow
import React from 'react';
import classNames from 'classnames';

type Props = {
  className: ?string,
  input: Object,
  optionLabel: ?string,
}

const FieldTypeCheckboxSingle = ({
  className,
  input: {name, onChange, value},
  optionLabel,
}: Props) => {
  const handleChange = () => {
    onChange(value ? false : true);
  };

  return (
    <div className={classNames('mvj-form-field', className)}>
      <div className={classNames('mvj-form-field__checkbox-single')}>
        <input
          checked={value}
          name={name}
          onChange={handleChange}
          type='checkbox'
          value={value}
        />
        {optionLabel && <label>{optionLabel}</label>}
      </div>
    </div>
  );
};

export default FieldTypeCheckboxSingle;
