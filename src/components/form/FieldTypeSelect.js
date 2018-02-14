// @flow
import React from 'react';
import classNames from 'classnames';
import Select from 'react-select';

type Props = {
  className: String,
  disabled: boolean,
  disableTouched: boolean,
  displayError: boolean,
  input: Object,
  label: string,
  labelClassName?: string,
  meta: Object,
  options: ?Array<any>,
  placeholder: String,
}

const FieldTypeSelect = ({
  className,
  disabled,
  disableTouched = false,
  displayError,
  input,
  input: {name, onBlur, onChange},
  label,
  labelClassName,
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
      {label && <label className={classNames('mvj-form-field-label', labelClassName)}>{label}</label>}
      <div className={classNames('mvj-form-field__select', className, {'has-error': displayError}, {'is-dirty': dirty})}>
        <Select
          {...input}
          arrowRenderer={arrowRenderer}
          autoBlur={true}
          clearable={false}
          disabled={disabled}
          id={name}
          options={options}
          onBlur={(value) => handleBlur(value)}
          onBlurResetsInput={false}
          onChange={({value}) => handleChange(value)}
          placeholder={placeholder || 'Valitse'}
          resetValue={''}
        />
        {(touched || disableTouched) && error && <span className={'error'}>{error}</span>}
      </div>
    </div>
  );
};

export default FieldTypeSelect;
