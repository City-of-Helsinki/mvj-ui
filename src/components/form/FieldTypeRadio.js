// @flow
import React from 'react';
import classNames from 'classnames';

type Props = {
  className: string,
  disabled: boolean,
  disableDirty: boolean,
  displayError: boolean,
  input: Object,
  label: string,
  labelClassName?: string,
  meta: Object,
  options?: Array<any>,
}

const FieldTypeRadio = ({
  className,
  disabled,
  disableDirty = false,
  displayError,
  input: {name, onChange, value},
  label,
  labelClassName,
  meta: {dirty},
  options,
}: Props) => {
  return (
    <div className={classNames('mvj-form-field', className)}>
      {label && <label className={classNames('mvj-form-field-label', labelClassName)}>{label}</label>}
      <fieldset
        id={name}
        className={classNames('mvj-form-field-component',
          'mvj-form-field__radio',
          {'has-error': displayError},
          {'is-dirty': (!disableDirty && dirty)})}
        disabled={disabled}
      >
        {options && options.map((option, index) => {
          const {value: optionValue, label: optionLabel} = option;
          return (
            <label key={index} className='option-label'>
              <input
                type='radio'
                checked={optionValue === value}
                name={name}
                onChange={(event) => onChange(event.target.value)}
                value={optionValue}
              />
              <span>{optionLabel}</span>
            </label>
          );
        }
        )}
      </fieldset>
    </div>
  );
};

export default FieldTypeRadio;
