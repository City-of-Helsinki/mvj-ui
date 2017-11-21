import React, {createElement} from 'react';
import classNames from 'classnames';

import FieldTypeBasic from './FieldTypeBasic';
import FieldTypeTextarea from './FieldTypeTextarea';
import FieldTypeSelect from './FieldTypeSelect';
import FieldTypeCheckbox from './FieldTypeCheckbox';
import FieldTypeRadio from './FieldTypeRadio';
import ErrorBlock from './ErrorBlock';

const FieldTypes = {
  'text': FieldTypeBasic,
  'number': FieldTypeBasic,
  'email': FieldTypeBasic,
  'textarea': FieldTypeTextarea,
  'select': FieldTypeSelect,
  'checkbox': FieldTypeCheckbox,
  'radio': FieldTypeRadio,
};

type Props = {
  className: String,
  disabled: Boolean,
  ErrorComponent: Function | Object,
  hint: String,
  input: Object,
  label: String,
  meta: Object,
  options: ?Array,
  placeholder: String,
  required: Boolean,
  type: String,
}

const resolveFieldType = (type: String): Object => FieldTypes.hasOwnProperty(type) ? FieldTypes[type] : FieldTypeBasic;

const FormField = ({
  className,
  disabled,
  ErrorComponent,
  hint,
  input,
  label,
  meta,
  placeholder,
  required,
  type,
  options,
}: Props) => {

  const displayError = meta.error && meta.touched;
  const fieldComponent = resolveFieldType(type);

  return (
    <div className={classNames('form-field', className)}>
      {label && <label className="form-field__label" htmlFor={input.name}>{label}{required && ' *'}</label>}
      {hint && <span className="form-field__hint">{hint}</span>}
      {createElement(fieldComponent, {input, type, displayError, disabled, placeholder, options})}
      {displayError && <ErrorComponent {...meta}/>}
    </div>
  );
};

FormField.defaultProps = {
  disabled: false,
  ErrorComponent: ErrorBlock,
  required: true,
};

export default FormField;
