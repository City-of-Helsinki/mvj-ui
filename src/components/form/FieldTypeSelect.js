// @flow
import React from 'react';
import classNames from 'classnames';
import Select from 'react-select';

type Props = {
  label: string,
  className: String,
  disabled: Boolean,
  displayError: Boolean,
  input: Object,
  options: ?Array<any>,
  placeholder: String,
  meta: Object,
}

const FieldTypeSelect = ({label, input, displayError, disabled, options, placeholder, meta: {touched, error}}: Props) => {
  const {onChange, name} = input;

  return (
    <div className='mvj-form-field'>
      <label className='title'>{label}</label>
      <div className={classNames('mvj-form-field__select', {'has-error': displayError})}>
        <Select
          autoBlur={true}
          clearable={false}
          disabled={disabled}
          id={name}
          options={options}
          placeholder={placeholder || 'Valitse'}
          {...input}
          onChange={({value}) => onChange(value)}
        />
        {touched && error && <span>{error}</span>}
      </div>
    </div>

  );
};

export default FieldTypeSelect;
