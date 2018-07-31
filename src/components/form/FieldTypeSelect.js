// @flow
import React from 'react';
import Select from 'react-select';
import classNames from 'classnames';

type Props = {
  autoBlur: boolean,
  disabled: boolean,
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
  autoBlur,
  disabled,
  displayError,
  input,
  input: {name, onBlur, onChange, value},
  isDirty,
  options,
  placeholder,
}: Props) => {

  const handleBlur = () => {
    onBlur(value);
  };

  const handleChange = (val: any) => {
    if(val) {
      const {value} = val;
      if(autoBlur) {
        onBlur(value);
      } else {
        onChange(value);
      }

    }
  };

  return (
    <Select
      {...input}
      className={classNames('form-field__select', {'has-error': displayError}, {'is-dirty': isDirty})}
      arrowRenderer={arrowRenderer}
      autosize={false}
      clearable={false}
      disabled={disabled}
      id={name}
      noResultsText={'Ei tuloksia'}
      options={options}
      placeholder={placeholder || 'Valitse...'}
      onBlur={handleBlur}
      onChange={handleChange}
    />
  );
};

export default FieldTypeSelect;
