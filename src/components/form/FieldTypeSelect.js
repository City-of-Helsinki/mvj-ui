// @flow
import React from 'react';
import classNames from 'classnames';
import Select from 'react-select';

type Props = {
  className: String,
  disabled: boolean,
  disableDirty: boolean,
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
  disableDirty = false,
  disableTouched = false,
  displayError,
  input,
  input: {name, onBlur, onChange, value},
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

  const handleBlur = () => {
    onBlur(value);
  };

  const handleChange = (value: string) => {
    onChange(value || '');
  };

  return (
    <div className={classNames('mvj-form-field', className)}>
      {label && <label className={classNames('mvj-form-field-label', labelClassName)}>{label}</label>}
      <div className={classNames(
        'mvj-form-field-component',
        'mvj-form-field__select',
        {'has-error': displayError},
        {'is-dirty': (!disableDirty && dirty)})}>
        <Select
          {...input}
          arrowRenderer={arrowRenderer}
          autoBlur={true}
          clearable={true}
          disabled={disabled}
          id={name}
          options={options}
          onBlurResetsInput={false}
          onBlur={(value) => handleBlur(value)}
          onChange={({value}) => handleChange(value)}
          noResultsText={'Ei tuloksia'}
          placeholder={placeholder || 'Valitse'}
          resetValue={''}
        />
        {(touched || disableTouched) && error && <span className={'error'}>{error}</span>}
      </div>
    </div>
  );
};

export default FieldTypeSelect;
