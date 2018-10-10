// @flow
import React, {createElement, PureComponent} from 'react';
import {Field} from 'redux-form';
import classNames from 'classnames';
import get from 'lodash/get';

import ErrorBlock from './ErrorBlock';
import FieldTypeAddress from './FieldTypeAddress';
import FieldTypeBasic from './FieldTypeBasic';
import FieldTypeBoolean from './FieldTypeBoolean';
import FieldTypeCheckbox from './FieldTypeCheckbox';
import FieldTypeContactSelect from './FieldTypeContactSelect';
import FieldTypeDatePicker from './FieldTypeDatePicker';
import FieldTypeLeaseSelect from './FieldTypeLeaseSelect';
import FieldTypeLessorSelect from './FieldTypeLessorSelect';
import FieldTypeMultiSelect from './FieldTypeMultiSelect';
import FieldTypeSearch from './FieldTypeSearch';
import FieldTypeSelect from './FieldTypeSelect';
import FieldTypeTextArea from './FieldTypeTextArea';
import FieldTypeUserSelect from './FieldTypeUserSelect';
import FormFieldLabel from './FormFieldLabel';
import FormTextTitle from './FormTextTitle';
import {getFieldOptions} from '$util/helpers';
import {genericNormalizer} from './normalizers';
import {genericValidator} from '../form/validations';

const FieldTypes = {
  'address': FieldTypeAddress,
  'boolean': FieldTypeBoolean,
  'choice': FieldTypeSelect,
  'checkbox': FieldTypeCheckbox,
  'contact': FieldTypeContactSelect,
  'date': FieldTypeDatePicker,
  'decimal': FieldTypeBasic,
  'field': FieldTypeSelect,
  'integer': FieldTypeBasic,
  'lease': FieldTypeLeaseSelect,
  'lessor': FieldTypeLessorSelect,
  'multiselect': FieldTypeMultiSelect,
  'search': FieldTypeSearch,
  'string': FieldTypeBasic,
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
  'integer': 'text',
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
  autoBlur: boolean,
  autoComplete?: string,
  className?: string,
  disabled: boolean,
  disableDirty: boolean,
  disableTouched: boolean,
  ErrorComponent: Function | Object,
  fieldType: string,
  filterOption?: Function,
  input: Object,
  invisibleLabel: boolean,
  isLoading: boolean,
  label: ?string,
  language?: string,
  meta: Object,
  optionLabel?: string,
  options: ?Array<Object>,
  placeholder?: string,
  required: boolean,
  rows?: number,
  setRefForField?: Function,
  valueSelectedCallback?: Function,
  unit?: string,
}

const FormFieldInput = ({
  autoBlur,
  autoComplete = 'nope',
  className,
  disabled,
  disableDirty,
  disableTouched,
  ErrorComponent,
  fieldType,
  filterOption,
  input,
  invisibleLabel,
  isLoading,
  label,
  language,
  meta,
  optionLabel,
  options,
  placeholder,
  required,
  rows,
  setRefForField,
  valueSelectedCallback,
  unit,
}: InputProps) => {
  const displayError = meta.error && (disableTouched || meta.touched);
  const isDirty = meta.dirty && !disableDirty;
  const fieldComponent = resolveFieldType(fieldType);
  const type = resolveType(fieldType);

  return (
    <div className={classNames('form-field', className)}>
      {label && fieldType === 'boolean' && <FormTextTitle required={required} title={label} />}
      {label && fieldType !== 'boolean' && <FormFieldLabel className={invisibleLabel ? 'invisible' : ''} htmlFor={input.name} required={required}>{label}</FormFieldLabel>}
      <div className={classNames('form-field__component', {'has-unit': unit})}>
        {createElement(fieldComponent, {autoBlur, autoComplete, displayError, disabled, filterOption, input, isDirty, isLoading, label, language, optionLabel, placeholder, options, rows, setRefForField, type, valueSelectedCallback})}
        {unit && <span className='form-field__unit'>{unit}</span>}
      </div>
      {displayError && <ErrorComponent {...meta}/>}
    </div>
  );
};

type Props = {
  autoBlur?: boolean,
  autoComplete?: string,
  className?: string,
  disabled?: boolean,
  disableDirty?: boolean,
  disableTouched?: boolean,
  ErrorComponent?: any,
  fieldAttributes: Object,
  filterOption?: Function,
  invisibleLabel?: boolean,
  isLoading?: boolean,
  language?: string,
  name: string,
  optionLabel?: string,
  overrideValues?: Object,
  placeholder?: string,
  rows?: number,
  setRefForField?: Function,
  validate?: Function,
  valueSelectedCallback?: Function,
  unit?: string,
}

type State = {
  fieldAttributes: ?Object,
  fieldType: ?string,
  label: ?string,
  options: Array<Object>,
  required: boolean,
}

class FormField extends PureComponent<Props, State> {
  state = {
    fieldAttributes: null,
    fieldType: null,
    label: null,
    options: [],
    required: false,
  }
  static defualtProps = {
    autoBlur: false,
    disabled: false,
    disableDirty: false,
    disableTouched: false,
    fieldAttributes: null,
    invisibleLabel: false,
    isLoading: false,
  };

  static getDerivedStateFromProps(props: Props, state: State) {
    if (props.fieldAttributes !== state.fieldAttributes) {
      return {
        fieldAttributes: props.fieldAttributes,
        fieldType: get(props.fieldAttributes, 'type'),
        label: get(props.fieldAttributes, 'label'),
        options: getFieldOptions(props.fieldAttributes),
        required: !!get(props.fieldAttributes, 'required'),
      };
    }
    return null;
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
    if(!validate) {return undefined;}
    return validate(value);
  }

  render() {
    const {
      autoBlur,
      autoComplete,
      className,
      disabled,
      disableDirty,
      disableTouched,
      ErrorComponent = ErrorBlock,
      filterOption,
      invisibleLabel,
      isLoading,
      language,
      name,
      optionLabel,
      overrideValues,
      placeholder,
      rows,
      setRefForField,
      valueSelectedCallback,
      unit,
    } = this.props;
    const {
      fieldType,
      label,
      options,
      required,
    } = this.state;

    return(
      <Field
        autoBlur={autoBlur}
        autoComplete={autoComplete}
        className={className}
        component={FormFieldInput}
        disabled={disabled}
        disableDirty={disableDirty}
        disableTouched={disableTouched}
        ErrorComponent={ErrorComponent}
        fieldType={fieldType}
        filterOption={filterOption}
        invisibleLabel={invisibleLabel}
        isLoading={isLoading}
        label={label}
        language={language}
        name={name}
        normalize={this.handleGenericNormalize}
        optionLabel={optionLabel}
        options={options}
        placeholder={placeholder}
        required={required}
        rows={rows}
        setRefForField={setRefForField}
        validate={[
          this.handleGenericValidate,
          this.handleValidate,
        ]}
        valueSelectedCallback={valueSelectedCallback}
        unit={unit}
        {...overrideValues}
      />
    );
  }
}

export default FormField;
