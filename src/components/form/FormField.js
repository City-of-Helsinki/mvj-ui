// @flow
import React, {createElement} from 'react';
import {Field} from 'redux-form';
import classNames from 'classnames';
import get from 'lodash/get';

import ErrorBlock from './ErrorBlock';
import FieldTypeBasic from './FieldTypeBasic';
import FieldTypeBoolean from './FieldTypeBoolean';
import FieldTypeCheckbox from './FieldTypeCheckbox';
import FieldTypeDatePicker from './FieldTypeDatePicker';
import FieldTypeMultiSelect from './FieldTypeMultiSelect';
import FieldTypeSelect from './FieldTypeSelect';
import FieldTypeSwitch from './FieldTypeSwitch';
import FieldTypeTextArea from './FieldTypeTextArea';
import {getFieldOptions} from '$util/helpers';
import {genericValidator} from '../form/validations';

const FieldTypes = {
  'boolean': FieldTypeBoolean,
  'choice': FieldTypeSelect,
  'checkbox': FieldTypeCheckbox,
  'date': FieldTypeDatePicker,
  'decimal': FieldTypeBasic,
  'field': FieldTypeSelect,
  'integer': FieldTypeBasic,
  'multiselect': FieldTypeMultiSelect,
  'string': FieldTypeBasic,
  'switch': FieldTypeSwitch,
  'textarea': FieldTypeTextArea,
};

const resolveFieldType = (type: string): Object => FieldTypes.hasOwnProperty(type) ? FieldTypes[type] : FieldTypeBasic;

type InputProps = {
  className?: string,
  disabled: boolean,
  disableDirty: boolean,
  ErrorComponent: Function | Object,
  input: Object,
  isLoading: boolean,
  label: ?string,
  meta: Object,
  optionLabel?: string,
  options: ?Array<Object>,
  placeholder?: string,
  required: boolean,
  rows?: number,
  type: string,
}

const FormFieldInput = ({
  className,
  disabled,
  disableDirty,
  ErrorComponent,
  input,
  isLoading,
  label,
  meta,
  optionLabel,
  options,
  placeholder,
  required,
  rows,
  type,
}: InputProps) => {
  const displayError = meta.error && meta.touched;
  const isDirty = meta.dirty && !disableDirty;
  const fieldComponent = resolveFieldType(type);

  return (
    <div className={classNames('form-field', className)}>
      {label && <label className="form-field__label" htmlFor={input.name}>{label}{required &&<i className='required'> *</i>}</label>}
      <div className='form-field__component'>
        {createElement(fieldComponent, {displayError, disabled, input, isDirty, isLoading, optionLabel, placeholder, options, rows, type})}
      </div>
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
  isLoading?: boolean,
  name: string,
  optionLabel?: string,
  placeholder?: string,
  overrideValues?: Object,
  rows?: number,
}

const FormField = ({
  className,
  disabled = false,
  disableDirty = false,
  ErrorComponent = ErrorBlock,
  fieldAttributes,
  isLoading = false,
  name,
  optionLabel,
  placeholder,
  overrideValues,
  rows,
}: Props) => {
  const label = get(fieldAttributes, 'label');
  const type = get(fieldAttributes, 'type');
  const required = !!get(fieldAttributes, 'required');
  const options = getFieldOptions(fieldAttributes);

  return (
    <Field
      component={FormFieldInput}
      className={className}
      disabled={disabled}
      disableDirty={disableDirty}
      isLoading={isLoading}
      label={label}
      name={name}
      options={options}
      placeholder={placeholder}
      required={required}
      type={type}
      ErrorComponent={ErrorComponent}
      optionLabel={optionLabel}
      rows={rows}
      validate={[
        (value) => genericValidator(value, fieldAttributes),
      ]}
      {...overrideValues}
    />
  );
};

export default FormField;
