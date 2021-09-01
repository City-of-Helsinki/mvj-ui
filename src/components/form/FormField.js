// @flow
import React, {createElement, Fragment, PureComponent} from 'react';
import {Field} from 'redux-form';
import classNames from 'classnames';
import get from 'lodash/get';

import ErrorBlock from './ErrorBlock';
import ExternalLink from '$components/links/ExternalLink';
import FieldTypeAddress from './FieldTypeAddress';
import FieldTypeBasic from './FieldTypeBasic';
import FieldTypeBoolean from './FieldTypeBoolean';
import FieldTypeCheckbox from './FieldTypeCheckbox';
import FieldTypeCheckboxDateTime from './FieldTypeCheckboxDateTime';
import FieldTypeContactSelect from './FieldTypeContactSelect';
import FieldTypeDatePicker from './FieldTypeDatePicker';
import FieldTypeDecimal from './FieldTypeDecimal';
import FieldTypeLeaseSelect from './FieldTypeLeaseSelect';
import FieldTypeLessorSelect from './FieldTypeLessorSelect';
import FieldTypeMultiSelect from './FieldTypeMultiSelect';
import FieldTypeRadioWithField from './FieldTypeRadioWithField';
import FieldTypeSearch from './FieldTypeSearch';
import FieldTypeSelect from './FieldTypeSelect';
import FieldTypeTextArea from './FieldTypeTextArea';
import FieldTypeUserSelect from './FieldTypeUserSelect';
import FormFieldLabel from './FormFieldLabel';
import FieldTypeTime from './FieldTypeTime';
import FormText from './FormText';
import FormTextTitle from './FormTextTitle';
import {FieldTypes as FieldTypeOptions} from '$src/enums';
import {getContactFullName} from '$src/contacts/helpers';
import {
  formatDate,
  formatNumber,
  getFieldAttributeOptions,
  getLabelOfOption,
  isEmptyValue,
  getReferenceNumberLink,
} from '$util/helpers';
import {getUserFullName} from '$src/users/helpers';
import {genericNormalizer} from './normalizers';
import {getRouteById, Routes} from '$src/root/routes';
import {genericValidator} from '../form/validations';

const FieldTypes = {
  [FieldTypeOptions.ADDRESS]: FieldTypeAddress,
  [FieldTypeOptions.BOOLEAN]: FieldTypeBoolean,
  [FieldTypeOptions.CHOICE]: FieldTypeSelect,
  [FieldTypeOptions.CHECKBOX]: FieldTypeCheckbox,
  [FieldTypeOptions.CHECKBOX_DATE_TIME]: FieldTypeCheckboxDateTime,
  [FieldTypeOptions.CONTACT]: FieldTypeContactSelect,
  [FieldTypeOptions.DATE]: FieldTypeDatePicker,
  [FieldTypeOptions.DECIMAL]: FieldTypeDecimal,
  [FieldTypeOptions.FIELD]: FieldTypeSelect,
  [FieldTypeOptions.INTEGER]: FieldTypeBasic,
  [FieldTypeOptions.LEASE]: FieldTypeLeaseSelect,
  [FieldTypeOptions.LESSOR]: FieldTypeLessorSelect,
  [FieldTypeOptions.MULTISELECT]: FieldTypeMultiSelect,
  [FieldTypeOptions.RADIO_WITH_FIELD]: FieldTypeRadioWithField,
  [FieldTypeOptions.REFERENCE_NUMBER]: FieldTypeBasic,
  [FieldTypeOptions.SEARCH]: FieldTypeSearch,
  [FieldTypeOptions.STRING]: FieldTypeBasic,
  [FieldTypeOptions.TEXTAREA]: FieldTypeTextArea,
  [FieldTypeOptions.USER]: FieldTypeUserSelect,
  [FieldTypeOptions.TIME]: FieldTypeTime,
};

const Types = {
  [FieldTypeOptions.DECIMAL]: 'text',
  [FieldTypeOptions.INTEGER]: 'text',
  [FieldTypeOptions.REFERENCE_NUMBER]: 'text',
  [FieldTypeOptions.STRING]: 'text',
  [FieldTypeOptions.TEXTAREA]: 'text',
};

const resolveFieldType = (type: string): Object => Object.prototype.hasOwnProperty.call(FieldTypes, type)
  ? FieldTypes[type]
  : FieldTypeBasic;
const resolveType = (type: string): ?string => Object.prototype.hasOwnProperty.call(Types, type)
  ? Types[type]
  : null;

type InputProps = {
  allowEdit: boolean,
  allowRead: boolean,
  autoBlur: boolean,
  autoComplete?: string,
  className?: string,
  disabled: boolean,
  disableDirty: boolean,
  disableTouched: boolean,
  enableUiDataEdit?: boolean,
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
  readOnlyValueRenderer?: any,
  relativeTo?: any,
  required: boolean,
  rows?: number,
  setRefForField?: Function,
  tooltipStyle?: Object,
  uiDataKey: ?string,
  unit?: string,
  valueSelectedCallback?: Function,
}

const FormFieldInput = ({
  allowEdit,
  allowRead,
  autoBlur,
  autoComplete = 'nope',
  className,
  disabled,
  disableDirty,
  disableTouched,
  enableUiDataEdit,
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
  readOnlyValueRenderer,
  relativeTo,
  required,
  rows,
  setRefForField,
  tooltipStyle,
  valueSelectedCallback,
  uiDataKey,
  unit,
}: InputProps) => {
  const getText = (type: string, value: any) => {
    switch (type) {
      case FieldTypeOptions.BOOLEAN:
        return !isEmptyValue(value) ? value ? 'Kyllä' : 'Ei' : '-';
      case FieldTypeOptions.CHOICE:
      case FieldTypeOptions.FIELD:
        return getLabelOfOption(options || [], value);
      case FieldTypeOptions.DATE:
        return formatDate(value);
      case FieldTypeOptions.ADDRESS:
      case FieldTypeOptions.INTEGER:
      case FieldTypeOptions.STRING:
        return value;
      case FieldTypeOptions.REFERENCE_NUMBER:
        return value
          ? <ExternalLink
            href={getReferenceNumberLink(value)}
            text={value}
          />
          : null;
      case FieldTypeOptions.DECIMAL:
        return !isEmptyValue(value)
          ? unit ? `${formatNumber(value)} ${unit}` : formatNumber(value)
          : '-';
      case FieldTypeOptions.CONTACT:
        return value
          ? <ExternalLink
            className='no-margin'
            href={`${getRouteById(Routes.CONTACTS)}/${value.id}`}
            text={getContactFullName(value)}
          />
          : '-';
      case FieldTypeOptions.LESSOR:
        return getContactFullName(value);
      case FieldTypeOptions.USER:
        return getUserFullName(value);
      default:
        console.error(`Field type ${type} is not implemented`);
        return 'NOT IMPLEMENTED';
    }
  };

  const displayError = meta.error && (disableTouched || meta.touched);
  const isDirty = meta.dirty && !disableDirty;
  const fieldComponent = resolveFieldType(fieldType);
  const type = resolveType(fieldType);

  if(allowEdit) {
    return (
      <div className={classNames('form-field', className)}>
        {label && fieldType === FieldTypeOptions.BOOLEAN && !invisibleLabel &&
          <FormTextTitle
            enableUiDataEdit={enableUiDataEdit}
            relativeTo={relativeTo}
            required={required}
            tooltipStyle={tooltipStyle}
            uiDataKey={uiDataKey}
          >
            {label}
          </FormTextTitle>
        }
        {label && fieldType !== FieldTypeOptions.BOOLEAN &&
          <FormFieldLabel
            className={invisibleLabel ? 'invisible' : ''}
            htmlFor={input.name}
            enableUiDataEdit={enableUiDataEdit}
            relativeTo={relativeTo}
            required={required}
            tooltipStyle={tooltipStyle}
            uiDataKey={uiDataKey}
          >
            {label}
          </FormFieldLabel>
        }
        <div className={classNames('form-field__component', {'has-unit': unit})}>
          {createElement(fieldComponent, {autoBlur, autoComplete, displayError, disabled, filterOption, input, isDirty, isLoading, label, language, optionLabel, placeholder, options, rows, setRefForField, type, valueSelectedCallback})}
          {unit && <span className='form-field__unit'>{unit}</span>}
        </div>
        {displayError && <ErrorComponent {...meta}/>}
      </div>
    );
  }

  if(allowRead){
    const text = getText(fieldType, input.value);

    return (
      <Fragment>
        {!invisibleLabel &&
          <FormTextTitle
            enableUiDataEdit={enableUiDataEdit}
            relativeTo={relativeTo}
            tooltipStyle={tooltipStyle}
            uiDataKey={uiDataKey}
          >
            {label}
          </FormTextTitle>
        }
        {readOnlyValueRenderer
          ? readOnlyValueRenderer(input.value, options)
          : <FormText>{text || '-'}</FormText>
        }
      </Fragment>
    );
  }

  return null;
};

type Props = {
  autoBlur?: boolean,
  autoComplete?: string,
  className?: string,
  disabled?: boolean,
  disableDirty?: boolean,
  disableTouched?: boolean,
  enableUiDataEdit?: boolean,
  ErrorComponent?: any,
  fieldAttributes: Object,
  filterOption?: Function,
  invisibleLabel?: boolean,
  isLoading?: boolean,
  language?: string,
  name: string,
  onChange?: Function,
  optionLabel?: string,
  overrideValues?: Object,
  placeholder?: string,
  readOnlyValueRenderer?: Function,
  relativeTo?: any,
  rows?: number,
  setRefForField?: Function,
  tooltipStyle?: Object,
  validate?: Function,
  valueSelectedCallback?: Function,
  uiDataKey?: ?string,
  unit?: string,
}

type State = {
  allowEdit: boolean,
  allowRead: boolean,
  fieldAttributes: ?Object,
  fieldType: ?string,
  label: ?string,
  options: Array<Object>,
  required: boolean,
}

class FormField extends PureComponent<Props, State> {
  state = {
    allowEdit: false,
    allowRead: true,
    fieldAttributes: null,
    fieldType: null,
    label: null,
    options: [],
    required: false,
  }
  static defaultProps = {
    autoBlur: false,
    disabled: false,
    disableDirty: false,
    disableTouched: false,
    enableUiDataEdit: false,
    fieldAttributes: null,
    invisibleLabel: false,
    isLoading: false,
    onChange: () => {},
  };

  static getDerivedStateFromProps(props: Props, state: State) {
    if (props.fieldAttributes !== state.fieldAttributes) {
      return {
        allowEdit: get(props.fieldAttributes, 'read_only') === false,
        allowRead: !!props.fieldAttributes,
        fieldAttributes: props.fieldAttributes,
        fieldType: get(props.fieldAttributes, 'type'),
        label: get(props.overrideValues, 'label') || get(props.fieldAttributes, 'label'),
        options: getFieldAttributeOptions(props.fieldAttributes),
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
      enableUiDataEdit,
      ErrorComponent = ErrorBlock,
      filterOption,
      invisibleLabel,
      isLoading,
      language,
      name,
      onChange,
      optionLabel,
      overrideValues,
      placeholder,
      readOnlyValueRenderer,
      relativeTo,
      rows,
      setRefForField,
      tooltipStyle,
      valueSelectedCallback,
      uiDataKey,
      unit,
    } = this.props;
    const {
      allowEdit,
      allowRead,
      fieldType,
      label,
      options,
      required,
    } = this.state;

    return(
      <Field
        allowEdit={allowEdit}
        allowRead={allowRead}
        autoBlur={autoBlur}
        autoComplete={autoComplete}
        className={className}
        component={FormFieldInput}
        disabled={disabled}
        disableDirty={disableDirty}
        disableTouched={disableTouched}
        enableUiDataEdit={enableUiDataEdit}
        ErrorComponent={ErrorComponent}
        fieldType={fieldType}
        filterOption={filterOption}
        invisibleLabel={invisibleLabel}
        isLoading={isLoading}
        label={label}
        language={language}
        name={name}
        normalize={this.handleGenericNormalize}
        onChange={onChange}
        optionLabel={optionLabel}
        options={options}
        placeholder={placeholder}
        readOnlyValueRenderer={readOnlyValueRenderer}
        relativeTo={relativeTo}
        required={required}
        rows={rows}
        setRefForField={setRefForField}
        tooltipStyle={tooltipStyle}
        validate={allowEdit
          ? [this.handleGenericValidate, this.handleValidate]
          : null
        }
        valueSelectedCallback={valueSelectedCallback}
        uiDataKey={uiDataKey}
        unit={unit}
        {...overrideValues}
      />
    );
  }
}

export default FormField;
