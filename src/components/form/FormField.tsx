import { $Shape } from "utility-types";
import React, { createElement, Fragment, PureComponent } from "react";
import { Field } from "redux-form";
import classNames from "classnames";
import get from "lodash/get";
import ErrorBlock from "./ErrorBlock";
import ExternalLink from "/src/components/links/ExternalLink";
import FieldTypeAddress from "/src/components/form/FieldTypeAddress";
import FieldTypeBasic from "/src/components/form/FieldTypeBasic";
import FieldTypeBoolean from "/src/components/form/FieldTypeBoolean";
import FieldTypeCheckbox from "/src/components/form/FieldTypeCheckbox";
import FieldTypeCheckboxDateTime from "/src/components/form/FieldTypeCheckboxDateTime";
import FieldTypeContactSelect from "/src/components/form/FieldTypeContactSelect";
import FieldTypeDatePicker from "/src/components/form/FieldTypeDatePicker";
import FieldTypeDecimal from "/src/components/form/FieldTypeDecimal";
import FieldTypeIntendedUseSelect from "/src/components/form/FieldTypeIntendedUseSelect";
import FieldTypeLeaseSelect from "/src/components/form/FieldTypeLeaseSelect";
import FieldTypeLessorSelect from "/src/components/form/FieldTypeLessorSelect";
import FieldTypeMultiSelect from "/src/components/form/FieldTypeMultiSelect";
import FieldTypeRadioWithField from "/src/components/form/FieldTypeRadioWithField";
import FieldTypeSearch from "/src/components/form/FieldTypeSearch";
import FieldTypeSelect from "/src/components/form/FieldTypeSelect";
import FieldTypeTextArea from "/src/components/form/FieldTypeTextArea";
import FieldTypeUserSelect from "/src/components/form/FieldTypeUserSelect";
import FormFieldLabel from "/src/components/form/FormFieldLabel";
import FieldTypeTime from "/src/components/form/FieldTypeTime";
import FieldTypeHidden from "/src/components/form/FieldTypeHidden";
import FieldTypeFractional from "/src/components/form/FieldTypeFractional";
import FormText from "/src/components/form/FormText";
import FormTextTitle from "/src/components/form/FormTextTitle";
import { FieldTypes as FieldTypeOptions } from "enums";
import { getContactFullName } from "contacts/helpers";
import { formatDate, formatNumber, getFieldAttributeOptions, getLabelOfOption, isEmptyValue, getReferenceNumberLink } from "util/helpers";
import { getUserFullName } from "users/helpers";
import { genericNormalizer } from "/src/components/form/normalizers";
import { getRouteById, Routes } from "root/routes";
import { genericValidator } from "/src/components/form/validations";
import { getHoursAndMinutes } from "util/date";
import type { UserServiceUnit } from "usersPermissions/types";
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
  [FieldTypeOptions.INTENDED_USE]: FieldTypeIntendedUseSelect,
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
  [FieldTypeOptions.FRACTIONAL]: FieldTypeFractional,
  [FieldTypeOptions.HIDDEN]: FieldTypeHidden
};
const Types = {
  [FieldTypeOptions.DECIMAL]: 'text',
  [FieldTypeOptions.INTEGER]: 'text',
  [FieldTypeOptions.REFERENCE_NUMBER]: 'text',
  [FieldTypeOptions.STRING]: 'text',
  [FieldTypeOptions.TEXTAREA]: 'text'
};


const resolveFieldType = (type: string): Record<string, any> => Object.prototype.hasOwnProperty.call(FieldTypes, type) ? FieldTypes[type] : FieldTypeBasic;
const resolveType = (type: string): string | null | undefined => Object.prototype.hasOwnProperty.call(Types, type) ? Types[type] : null;

type InputProps = {
  allowEdit: boolean;
  allowRead: boolean;
  autoBlur: boolean;
  autoComplete?: string;
  className?: string;
  disabled: boolean;
  disableDirty: boolean;
  disableTouched: boolean;
  enableUiDataEdit?: boolean;
  ErrorComponent: ((...args: Array<any>) => any) | any;
  fieldType: string;
  filterOption?: (...args: Array<any>) => any;
  input: Record<string, any>;
  invisibleLabel: boolean;
  isLoading: boolean;
  label: string | null | undefined;
  language?: string;
  meta: Record<string, any>;
  minDate?: Date;
  maxDate?: Date;
  multiSelect?: boolean;
  optionLabel?: string;
  options: Array<Record<string, any>> | null | undefined;
  placeholder?: string;
  readOnlyValueRenderer?: any;
  relativeTo?: any;
  required: boolean;
  rows?: number;
  serviceUnit: UserServiceUnit;
  setRefForField?: (...args: Array<any>) => any;
  tooltipStyle?: Record<string, any>;
  uiDataKey: string | null | undefined;
  unit?: string;
  valueSelectedCallback?: (...args: Array<any>) => any;
};

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
  minDate,
  maxDate,
  multiSelect,
  optionLabel,
  options,
  placeholder,
  readOnlyValueRenderer,
  relativeTo,
  required,
  rows,
  serviceUnit,
  setRefForField,
  tooltipStyle,
  valueSelectedCallback,
  uiDataKey,
  unit
}: InputProps) => {
  const getText = (type: string, value: any) => {
    switch (type) {
      case FieldTypeOptions.BOOLEAN:
      case FieldTypeOptions.CHECKBOX:
        return !isEmptyValue(value) ? value ? 'Kyllä' : 'Ei' : '-';

      case FieldTypeOptions.CHOICE:
      case FieldTypeOptions.FIELD:
        return getLabelOfOption(options || [], value);

      case FieldTypeOptions.DATE:
        return formatDate(value);

      case FieldTypeOptions.TIME:
        if (value) {
          return formatDate(value) + ', ' + getHoursAndMinutes(value);
        }

        return '-';

      case FieldTypeOptions.ADDRESS:
      case FieldTypeOptions.INTEGER:
      case FieldTypeOptions.STRING:
      case FieldTypeOptions.HIDDEN:
      case FieldTypeOptions.FRACTIONAL:
      case FieldTypeOptions.INTENDED_USE:
        return value;

      case FieldTypeOptions.REFERENCE_NUMBER:
        return value ? <ExternalLink href={getReferenceNumberLink(value)} text={value} /> : null;

      case FieldTypeOptions.DECIMAL:
        return !isEmptyValue(value) ? unit ? `${formatNumber(value)} ${unit}` : formatNumber(value) : '-';

      case FieldTypeOptions.CONTACT:
        return value ? <ExternalLink className='no-margin' href={`${getRouteById(Routes.CONTACTS)}/${value.id}`} text={getContactFullName(value)} /> : '-';

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

  if (allowEdit) {
    return <div className={classNames('form-field', className)}>
        {label && fieldType === FieldTypeOptions.BOOLEAN && !invisibleLabel && <FormTextTitle enableUiDataEdit={enableUiDataEdit} relativeTo={relativeTo} required={required} tooltipStyle={tooltipStyle} uiDataKey={uiDataKey}>
            {label}
          </FormTextTitle>}
        {label && fieldType !== FieldTypeOptions.BOOLEAN && fieldType !== FieldTypeOptions.HIDDEN && <FormFieldLabel className={invisibleLabel ? 'invisible' : ''} htmlFor={input.name} enableUiDataEdit={enableUiDataEdit} relativeTo={relativeTo} required={required} tooltipStyle={tooltipStyle} uiDataKey={uiDataKey}>
            {label}
          </FormFieldLabel>}
        <div className={classNames('form-field__component', {
        'has-unit': unit
      })}>
        { // @ts-ignore: No overload matches this call
          createElement(fieldComponent, {
          autoBlur,
          autoComplete,
          displayError,
          disabled,
          filterOption,
          input,
          isDirty,
          isLoading,
          label,
          language,
          minDate,
          maxDate,
          multiSelect,
          optionLabel,
          placeholder,
          options,
          rows,
          serviceUnit,
          setRefForField,
          type,
          valueSelectedCallback
        })}
          {unit && <span className='form-field__unit'>{unit}</span>}
        </div>
        {displayError && <ErrorComponent {...meta} />}
      </div>;
  }

  if (allowRead) {
    const text = multiSelect ? input.value.map(single => getText(fieldType, single)).join(', ') : getText(fieldType, input.value);
    return <Fragment>
        {!invisibleLabel && <FormTextTitle enableUiDataEdit={enableUiDataEdit} relativeTo={relativeTo} tooltipStyle={tooltipStyle} uiDataKey={uiDataKey}>
            {label}
          </FormTextTitle>}
        {readOnlyValueRenderer ? readOnlyValueRenderer(input.value, options) : <FormText>{text || '-'}</FormText>}
      </Fragment>;
  }

  return null;
};

type Props = {
  autoBlur?: boolean;
  autoComplete?: string;
  className?: string;
  disabled?: boolean;
  disableDirty?: boolean;
  disableTouched?: boolean;
  enableUiDataEdit?: boolean;
  ErrorComponent?: any;
  fieldAttributes: Record<string, any>;
  filterOption?: (...args: Array<any>) => any;
  invisibleLabel?: boolean;
  isLoading?: boolean;
  isMulti?: boolean;
  language?: string;
  minDate?: Date;
  maxDate?: Date;
  name: string;
  onBlur?: (...args: Array<any>) => any;
  onChange?: (...args: Array<any>) => any;
  optionLabel?: string;
  overrideValues?: Record<string, any>;
  placeholder?: string;
  readOnlyValueRenderer?: (...args: Array<any>) => any;
  relativeTo?: any;
  rows?: number;
  serviceUnit: UserServiceUnit;
  setRefForField?: (...args: Array<any>) => any;
  tooltipStyle?: Record<string, any>;
  validate?: (...args: Array<any>) => any;
  valueSelectedCallback?: (...args: Array<any>) => any;
  uiDataKey?: string | null | undefined;
  unit?: string;
};
type State = {
  allowEdit: boolean;
  allowRead: boolean;
  fieldAttributes: Record<string, any> | null | undefined;
  fieldType: string | null | undefined;
  label: string | null | undefined;
  options: Array<Record<string, any>>;
  required: boolean;
  value: string | null | undefined;
};

class FormField extends PureComponent<Props, State> {
  state: State = {
    allowEdit: false,
    allowRead: true,
    fieldAttributes: null,
    fieldType: null,
    label: null,
    options: [],
    required: false,
    value: null
  };
  static defaultProps: $Shape<Props> = {
    autoBlur: false,
    disabled: false,
    disableDirty: false,
    disableTouched: false,
    enableUiDataEdit: false,
    fieldAttributes: null,
    invisibleLabel: false,
    isLoading: false,
    onChange: () => {}
  };

  static getDerivedStateFromProps(props: Props, state: State): $Shape<State> | null {
    const overrideableBoolean = fieldName => {
      return get(props.overrideValues, fieldName) !== undefined ? !!get(props.overrideValues, fieldName) : !!get(props.fieldAttributes, fieldName);
    };

    if (props.fieldAttributes !== state.fieldAttributes) {
      return {
        allowEdit: get(props.fieldAttributes, 'read_only') === false,
        allowRead: !!props.fieldAttributes,
        fieldAttributes: props.fieldAttributes,
        fieldType: get(props.fieldAttributes, 'type'),
        label: get(props.overrideValues, 'label') || get(props.fieldAttributes, 'label'),
        value: get(props.overrideValues, 'value'),
        options: getFieldAttributeOptions(props.fieldAttributes),
        required: overrideableBoolean('required')
      };
    }

    return null;
  }

  handleGenericNormalize: (arg0: any) => any = value => {
    const {
      fieldAttributes
    } = this.props;
    // eslint-disable-next-line no-unused-vars
    const {
      fieldAttributes: _,
      ...rest
    } = this.state;
    return genericNormalizer(value, { ...fieldAttributes,
      ...rest
    });
  };
  handleGenericValidate: (arg0: any) => any = value => {
    const {
      fieldAttributes
    } = this.props;
    // eslint-disable-next-line no-unused-vars
    const {
      fieldAttributes: _,
      ...rest
    } = this.state;
    return genericValidator(value, { ...fieldAttributes,
      ...rest
    });
  };
  handleValidate: (value: any) => string | null | undefined = value => {
    const {
      validate
    } = this.props;

    if (!validate) {
      return undefined;
    }

    return validate(value);
  };

  render(): React.ReactNode {
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
      minDate,
      maxDate,
      name,
      onBlur,
      onChange,
      optionLabel,
      overrideValues,
      placeholder,
      readOnlyValueRenderer,
      relativeTo,
      rows,
      serviceUnit,
      setRefForField,
      tooltipStyle,
      valueSelectedCallback,
      uiDataKey,
      unit
    } = this.props;
    const {
      allowEdit,
      allowRead,
      fieldType,
      label,
      options,
      required,
      value
    } = this.state;
    return <Field allowEdit={allowEdit} allowRead={allowRead} autoBlur={autoBlur} autoComplete={autoComplete} className={className} component={FormFieldInput} disabled={disabled} disableDirty={disableDirty} disableTouched={disableTouched} enableUiDataEdit={enableUiDataEdit} ErrorComponent={ErrorComponent} fieldType={fieldType} filterOption={filterOption} invisibleLabel={invisibleLabel} isLoading={isLoading} label={label} language={language} minDate={minDate} maxDate={maxDate} name={name} normalize={this.handleGenericNormalize} onBlur={onBlur} onChange={onChange} optionLabel={optionLabel} options={options} placeholder={placeholder} readOnlyValueRenderer={readOnlyValueRenderer} relativeTo={relativeTo} required={required} rows={rows} serviceUnit={serviceUnit} setRefForField={setRefForField} tooltipStyle={tooltipStyle} validate={allowEdit ? [this.handleGenericValidate, this.handleValidate] : []} valueSelectedCallback={valueSelectedCallback} uiDataKey={uiDataKey} unit={unit} value={value} {...overrideValues} />;
  }

}

export default FormField;