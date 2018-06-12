// @flow
import React, {createElement, PureComponent} from 'react';
import {Field} from 'redux-form';
import classNames from 'classnames';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import ErrorBlock from './ErrorBlock';
import FieldTypeBasic from './FieldTypeBasic';
import FieldTypeBoolean from './FieldTypeBoolean';
import FieldTypeCheckbox from './FieldTypeCheckbox';
import FieldTypeContactSelect from './FieldTypeContactSelect';
import FieldTypeDatePicker from './FieldTypeDatePicker';
import FieldTypeLessorSelect from './FieldTypeLessorSelect';
import FieldTypeMultiSelect from './FieldTypeMultiSelect';
import FieldTypeSelect from './FieldTypeSelect';
import FieldTypeSwitch from './FieldTypeSwitch';
import FieldTypeTextArea from './FieldTypeTextArea';
import FieldTypeUserSelect from './FieldTypeUserSelect';
import {getFieldOptions} from '$util/helpers';
import {genericNormalizer} from './normalizers';
import {genericValidator} from '../form/validations';

const FieldTypes = {
  'boolean': FieldTypeBoolean,
  'choice': FieldTypeSelect,
  'checkbox': FieldTypeCheckbox,
  'contact': FieldTypeContactSelect,
  'date': FieldTypeDatePicker,
  'decimal': FieldTypeBasic,
  'field': FieldTypeSelect,
  'integer': FieldTypeBasic,
  'lessor': FieldTypeLessorSelect,
  'multiselect': FieldTypeMultiSelect,
  'string': FieldTypeBasic,
  'switch': FieldTypeSwitch,
  'textarea': FieldTypeTextArea,
  'user': FieldTypeUserSelect,
};

const Types = {
  'boolean': null,
  'choice': null,
  'checkbox': null,
  'date': null,
  'decimal': 'text',
  'field': null,
  'integer': 'number',
  'lessor': null,
  'multiselect': null,
  'string': 'text',
  'switch': null,
  'textarea': 'text',
  'user': null,
};

const resolveFieldType = (type: string): Object => FieldTypes.hasOwnProperty(type) ? FieldTypes[type] : FieldTypeBasic;
const resolveType = (type: string): ?string => Types.hasOwnProperty(type) ? Types[type] : null;

type InputProps = {
  autoComplete?: string,
  className?: string,
  disabled: boolean,
  disableDirty: boolean,
  disableTouched: boolean,
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
  disableTouched,
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
  const displayError = meta.error && (disableTouched || meta.touched);
  const isDirty = meta.dirty && !disableDirty;
  const fieldComponent = resolveFieldType(fieldType);
  const type = resolveType(fieldType);

  return (
    <div className={classNames('form-field', className)}>
      {label && <label className="form-field__label" htmlFor={input.name} title={label ? `${label}${required ? ' *' : ''}` : ''}>{label}{required &&<i className='required'> *</i>}</label>}
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
  disableTouched?: boolean,
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

type State = {
  fieldType: ?string,
  label: ?string,
  options: Array<Object>,
  required: boolean,
}

class FormField extends PureComponent<Props, State> {
  state = {
    fieldType: null,
    label: null,
    options: [],
    required: false,
  }
  static defualtProps = {
    disabled: false,
    disableDirty: false,
    disableTouched: false,
    isLoading: false,
  };

  componentDidMount() {
    const {fieldAttributes} = this.props;
    if(!isEmpty(fieldAttributes)) {
      this.updateSettings();
    }
  }

  componentDidUpdate(prevProps: Props) {
    if(JSON.stringify(prevProps.fieldAttributes) !== JSON.stringify(this.props.fieldAttributes)) {
      this.updateSettings();
    }
  }

  updateSettings = () => {
    const {fieldAttributes} = this.props;
    this.setState({
      label: get(fieldAttributes, 'label'),
      fieldType: get(fieldAttributes, 'type'),
      required: !!get(fieldAttributes, 'required'),
      options: getFieldOptions(fieldAttributes),
    });
  }

  handleGenericNormalize = (value: any) => {
    const {fieldAttributes} = this.props;
    return genericNormalizer(value, fieldAttributes);
  }

  handleGenericValidate = (value: any) => {
    const {fieldAttributes} = this.props;
    return genericValidator(value, fieldAttributes);
  }

  handleValidate = (value: any) => {
    const {validate} = this.props;
    if(!validate) {
      return undefined;
    }
    return validate(value);
  }

  render() {
    const {
      autoComplete,
      className,
      disabled,
      disableDirty,
      disableTouched,
      ErrorComponent = ErrorBlock,
      isLoading,
      name,
      optionLabel,
      overrideValues,
      placeholder,
      rows,
    } = this.props;
    const {
      fieldType,
      label,
      options,
      required,
    } = this.state;

    return(
      <Field
        autoComplete={autoComplete}
        className={className}
        component={FormFieldInput}
        disabled={disabled}
        disableDirty={disableDirty}
        disableTouched={disableTouched}
        ErrorComponent={ErrorComponent}
        fieldType={fieldType}
        isLoading={isLoading}
        label={label}
        name={name}
        normalize={this.handleGenericNormalize}
        optionLabel={optionLabel}
        options={options}
        placeholder={placeholder}
        required={required}
        rows={rows}
        validate={[
          this.handleGenericValidate,
          this.handleValidate,
        ]}
        {...overrideValues}
      />
    );
  }
}

export default FormField;
