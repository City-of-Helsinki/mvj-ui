// @flow
import React, {createElement} from 'react';
import {Field} from 'redux-form';
import classNames from 'classnames';
import get from 'lodash/get';

import ErrorBlock from './ErrorBlock';
import FieldTypeBasic from './FieldTypeBasic';
import FieldTypeDatePicker from './FieldTypeDatePickerNew';
import FieldTypeSelect from './FieldTypeSelectNew';
import {getFieldOptions} from '$util/helpers';
import {genericValidator} from '../form/validations';

const FieldTypes = {
  'choice': FieldTypeSelect,
  'date': FieldTypeDatePicker,
  'field': FieldTypeSelect,
  'string': FieldTypeBasic,
};

const resolveFieldType = (type: string): Object => FieldTypes.hasOwnProperty(type) ? FieldTypes[type] : FieldTypeBasic;

type InputProps = {
  className?: string,
  disabled: boolean,
  disableDirty: boolean,
  ErrorComponent: Function | Object,
  input: Object,
  label: ?string,
  meta: Object,
  options: ?Array<Object>,
  placeholder?: string,
  required: boolean,
  type: string,
}

const FormFieldInput = ({
  className,
  disabled,
  disableDirty,
  ErrorComponent,
  input,
  label,
  meta,
  options,
  placeholder,
  required,
  type,
}: InputProps) => {
  const displayError = meta.error && meta.touched;
  const isDirty = meta.dirty && !disableDirty;
  const fieldComponent = resolveFieldType(type);
  console.log(input);
  console.log(type);
  return (
    <div className={classNames('form-field', className)}>
      {label && <label className="form-field__label" htmlFor={input.name}>{label}{required &&<i className='required'> *</i>}</label>}
      {createElement(fieldComponent, {displayError, disabled, input, isDirty, placeholder, options, type})}
      {displayError && <ErrorComponent {...meta}/>}
    </div>
  );
};

type Props = {
  className?: string,
  disabled?: boolean,
  disableDirty?: boolean,
  ErrorComponent?: any,
  fieldAttributes: Object,
  name: string,
  placeholder?: string,
  overrideValues?: Object,
}

const FormField = ({
  className,
  disabled = false,
  disableDirty = false,
  ErrorComponent = ErrorBlock,
  fieldAttributes,
  name,
  placeholder,
  overrideValues,
}: Props) => {
  const label = get(fieldAttributes, 'label');
  const type = get(fieldAttributes, 'type');
  const required = get(fieldAttributes, 'required');
  const options = getFieldOptions(fieldAttributes);

  return (
    <Field
      component={FormFieldInput}
      className={className}
      disabled={disabled}
      disableDirty={disableDirty}
      label={label}
      name={name}
      options={options}
      placeholder={placeholder}
      required={required}
      type={type}
      ErrorComponent={ErrorComponent}
      validate={[
        (value) => genericValidator(value, fieldAttributes),
      ]}
      {...overrideValues}
    />
  );
};

export default FormField;
