// @flow
import React from 'react';
import Select from 'react-select';
import classNames from 'classnames';

type Props = {
  disabled: Boolean,
  displayError: boolean,
  input: Object,
  isDirty: boolean,
  options: ?Array<any>,
  placeholder: String,
}

const arrowRenderer = () => {
  return (
    <i className='select-input__arrow-renderer'/>
  );
};

const FieldTypeSelect = ({
  disabled,
  displayError,
  input,
  input: {name, onBlur, onChange, value},
  isDirty,
  options,
  placeholder,
}: Props) => {

  const handleBlur = (value: any) => {
    onBlur(value);
  };

  return (
    <Select
      {...input}
      className={classNames('form-field__select', {'has-error': displayError}, {'is-dirty': isDirty})}
      arrowRenderer={arrowRenderer}
      clearable={false}
      disabled={disabled}
      id={name}
      noResultsText={'Ei tuloksia'}
      options={options}
      placeholder={placeholder || 'Valitse...'}
      onBlur={() => handleBlur(value)}
      onChange={({value}) => onChange(value)}
    />
  );
};

export default FieldTypeSelect;
