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
import {genericNormalizer} from './normalizers';
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

const Types = {
  'boolean': null,
  'choice': null,
  'checkbox': null,
  'date': null,
  'decimal': 'text',
  'field': null,
  'integer': 'number',
  'multiselect': null,
  'string': 'text',
  'switch': null,
  'textarea': 'text',
};

const resolveFieldType = (type: string): Object => FieldTypes.hasOwnProperty(type) ? FieldTypes[type] : FieldTypeBasic;
const resolveType = (type: string): ?string => Types.hasOwnProperty(type) ? Types[type] : null;

type InputProps = {
  autoComplete?: string,
  className?: string,
  disabled: boolean,
  disableDirty: boolean,
  ErrorComponent: Function | Object,
  fieldType: string,
  input: Object,
  isLoading: boolean,
  label: ?string,
  meta: Object,
  optionLabel?: string,
  options: ?Array<Object>,
  placeholder?: string,
  required: boolean,
  rows?: number,
}

const FormFieldInput = ({
  autoComplete,
  className,
  disabled,
  disableDirty,
  ErrorComponent,
  fieldType,
  input,
  isLoading,
  label,
  meta,
  optionLabel,
  options,
  placeholder,
  required,
  rows,
}: InputProps) => {
  const displayError = meta.error;
  const isDirty = meta.dirty && !disableDirty;
  const fieldComponent = resolveFieldType(fieldType);
  const type = resolveType(fieldType);

  return (
    <div className={classNames('form-field', className)}>
      {label && <label className="form-field__label" htmlFor={input.name} title={label}>{label}{required &&<i className='required'> *</i>}</label>}
      <div className='form-field__component'>
        {createElement(fieldComponent, {autoComplete, displayError, disabled, input, isDirty, isLoading, optionLabel, placeholder, options, rows, type})}
      </div>
      {displayError && <ErrorComponent {...meta}/>}
    </div>
  );
};

type Props = {
  autoComplete?: string,
  className?: string,
  disabled?: boolean,
  disableDirty?: boolean,
  ErrorComponent?: any,
  fieldAttributes: Object,
  isLoading?: boolean,
  name: string,
  optionLabel?: string,
  overrideValues?: Object,
  placeholder?: string,
  rows?: number,
  validate?: Function,
}

const FormField = ({
  autoComplete,
  className,
  disabled = false,
  disableDirty = false,
  ErrorComponent = ErrorBlock,
  fieldAttributes,
  isLoading = false,
  name,
  optionLabel,
  overrideValues,
  placeholder,
  rows,
  validate,
}: Props) => {
  const label = get(fieldAttributes, 'label');
  const fieldType = get(fieldAttributes, 'type');
  const required = !!get(fieldAttributes, 'required');
  const options = getFieldOptions(fieldAttributes);

  return (
    <Field
      autoComplete={autoComplete}
      className={className}
      component={FormFieldInput}
      disabled={disabled}
      disableDirty={disableDirty}
      ErrorComponent={ErrorComponent}
      fieldType={fieldType}
      isLoading={isLoading}
      label={label}
      name={name}
      normalize={(value) => genericNormalizer(value, fieldAttributes)}
      optionLabel={optionLabel}
      options={options}
      placeholder={placeholder}
      required={required}
      rows={rows}
      validate={[
        (value) => genericValidator(value, fieldAttributes),
        (value) => validate ? validate(value) : undefined,
      ]}
      {...overrideValues}
    />
  );
};

export default FormField;
