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
const arrowRenderer = () => {
  return (
    <i className='select-input__arrow-renderer'/>
  );
};

const FieldTypeSelect = ({label, input, displayError, disabled, options, placeholder, meta: {visited, error}}: Props) => {
  const {onChange, name} = input;

  const handleBlur = () => {
    
  };

  const handleChange = (value) => {
    onChange(value || '');
  };

  return (
    <div className='mvj-form-field'>
      <label className='title'>{label}</label>
      <div className={classNames('mvj-form-field__select', {'has-error': displayError})}>
        <Select
          arrowRenderer={arrowRenderer}
          autoBlur={true}
          clearable={true}
          disabled={disabled}
          id={name}
          options={options}
          placeholder={placeholder || 'Valitse'}
          {...input}
          onBlur={(value) => handleBlur(value)}
          onChange={({value}) => handleChange(value)}
          resetValue={''}
        />
        {visited && error && <span className={'error'}>{error}</span>}
      </div>
    </div>

  );
};

export default FieldTypeSelect;
