// @flow
import React from 'react';
import classNames from 'classnames';
import Select from 'react-select';

type Props = {
  className: String,
  disabled: Boolean,
  displayError: Boolean,
  input: Object,
  label: string,
  meta: Object,
  options: ?Array<any>,
  placeholder: String,
}

const FieldTypeSelect = ({
  className,
  disabled,
  displayError,
  input,
  input: {name, onBlur, onChange},
  label,
  meta: {dirty, error, touched},
  options,
  placeholder,
}: Props) => {
  const arrowRenderer = () => {
    return (
      <i className='select-input__arrow-renderer'/>
    );
  };

  const handleBlur = (value: string) => {
    onBlur(value || '');
  };

  const handleChange = (value: string) => {
    onChange(value || '');
  };

  return (
    <div className='mvj-form-field'>
      <label className='title'>{label}</label>
      <div className={classNames('mvj-form-field__select', className, {'has-error': displayError}, {'is-dirty': dirty})}>
        <Select
          {...input}
          arrowRenderer={arrowRenderer}
          autoBlur={true}
          clearable={true}
          disabled={disabled}
          id={name}
          options={options}
          onBlur={(value) => handleBlur(value)}
          onBlurResetsInput={false}
          onChange={({value}) => handleChange(value)}
          placeholder={placeholder || 'Valitse'}
          resetValue={''}
        />
        {touched && error && <span className={'error'}>{error}</span>}
      </div>
    </div>
  );
};

export default FieldTypeSelect;
