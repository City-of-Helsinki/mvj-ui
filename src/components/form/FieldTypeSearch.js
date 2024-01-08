// @flow
import React from 'react';
import classNames from 'classnames';

type Props = {
  autoBlur: boolean,
  autoComplete?: string,
  disabled: boolean,
  displayError: boolean,
  input: Object,
  isDirty: boolean,
  placeholder: string,
  type?: string,
}

const FieldTypeSearch = ({
  autoBlur,
  autoComplete,
  displayError,
  disabled,
  input,
  input: {onBlur, onChange},
  isDirty,
  placeholder,
  type = 'text',
}: Props): React$Node => {
  const handleChange = (e: any) => {
    if(autoBlur) {
      onBlur(e.target.value);
    } else {
      onChange(e.target.value);
    }
  };

  return (
    <div className={classNames('form-field__search', {'has-error': displayError}, {'is-dirty': isDirty})}>
      <input
        id={input.name}
        autoComplete={autoComplete}
        disabled={disabled}
        placeholder={placeholder}
        type={type}
        {...input}
        onChange={handleChange}
      />
      <span className='form-field__search_icon'></span>
    </div>

  );
};

export default FieldTypeSearch;
