import { $Shape } from "utility-types";
import React, { createElement, useMemo } from "react";
import { Field } from "react-final-form";
import { FieldState } from "final-form";
import classNames from "classnames";
import get from "lodash/get";
import ErrorBlock from "@/components/form/ErrorBlock";
import ExternalLink from "@/components/links/ExternalLink";
import FieldTypeAddress from "@/components/form/FieldTypeAddress";
import FieldTypeAreaSearchDistrictSelect from "@/components/form/FieldTypeAreaSearchDistrictSelect";
import FieldTypeBasic from "@/components/form/FieldTypeBasic";
import FieldTypeBoolean from "@/components/form/FieldTypeBoolean";
import FieldTypeCheckbox from "@/components/form/FieldTypeCheckbox";
import FieldTypeCheckboxDateTime from "@/components/form/FieldTypeCheckboxDateTime";
import FieldTypeContactSelect from "@/components/form/FieldTypeContactSelect";
import FieldTypeDatePicker from "@/components/form/FieldTypeDatePicker";
import FieldTypeDecimal from "@/components/form/FieldTypeDecimal";
import FieldTypeIntendedUseSelect from "@/components/form/FieldTypeIntendedUseSelect";
import FieldTypeLeaseSelect from "@/components/form/FieldTypeLeaseSelect";
import FieldTypeLessorSelect from "@/components/form/FieldTypeLessorSelect";
import FieldTypeMultiSelect from "@/components/form/FieldTypeMultiSelect";
import FieldTypeRadioWithField from "@/components/form/FieldTypeRadioWithField";
import FieldTypeSearch from "@/components/form/FieldTypeSearch";
import FieldTypeSelect from "@/components/form/FieldTypeSelect";
import FieldTypeTextArea from "@/components/form/FieldTypeTextArea";
import FieldTypeUserSelect from "@/components/form/FieldTypeUserSelect";
import FormFieldLabel from "@/components/form/FormFieldLabel";
import FieldTypeTime from "@/components/form/FieldTypeTime";
import FieldTypeHidden from "@/components/form/FieldTypeHidden";
import FieldTypeFractional from "@/components/form/FieldTypeFractional";
import FormText from "@/components/form/FormText";
import FormTextTitle from "@/components/form/FormTextTitle";
import { FieldTypes as FieldTypeOptions } from "@/enums";
import { getContactFullName } from "@/contacts/helpers";
import {
  formatDate,
  formatNumber,
  getFieldAttributeOptions,
  getLabelOfOption,
  isEmptyValue,
  getReferenceNumberLink,
} from "@/util/helpers";
import { getUserFullName } from "@/users/helpers";
import { genericNormalizer } from "@/components/form/normalizers";
import { getRouteById, Routes } from "@/root/routes";
import { genericValidator } from "@/components/form/validations";
import { getHoursAndMinutes } from "@/util/date";
import type { UserServiceUnit } from "@/usersPermissions/types";

const FieldTypes = {
  [FieldTypeOptions.ADDRESS]: FieldTypeAddress,
  [FieldTypeOptions.AREASEARCH_DISTRICT]: FieldTypeAreaSearchDistrictSelect,
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
  [FieldTypeOptions.HIDDEN]: FieldTypeHidden,
};
const Types = {
  [FieldTypeOptions.DECIMAL]: "text",
  [FieldTypeOptions.INTEGER]: "text",
  [FieldTypeOptions.REFERENCE_NUMBER]: "text",
  [FieldTypeOptions.STRING]: "text",
  [FieldTypeOptions.TEXTAREA]: "text",
};

const resolveFieldType = (type: string): React.ComponentType<any> =>
  Object.prototype.hasOwnProperty.call(FieldTypes, type)
    ? FieldTypes[type]
    : FieldTypeBasic;
const resolveType = (type: string): string | null | undefined =>
  Object.prototype.hasOwnProperty.call(Types, type) ? Types[type] : null;

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
  autoComplete = "nope",
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
  unit,
}: InputProps) => {
  const getText = (type: string, value: any) => {
    switch (type) {
      case FieldTypeOptions.BOOLEAN:
      case FieldTypeOptions.CHECKBOX:
        return !isEmptyValue(value) ? (value ? "Kyllä" : "Ei") : "-";

      case FieldTypeOptions.CHOICE:
      case FieldTypeOptions.FIELD:
        return getLabelOfOption(options || [], value);

      case FieldTypeOptions.DATE:
        return formatDate(value);

      case FieldTypeOptions.TIME:
        if (value) {
          return formatDate(value) + ", " + getHoursAndMinutes(value);
        }

        return "-";

      case FieldTypeOptions.ADDRESS:
      case FieldTypeOptions.INTEGER:
      case FieldTypeOptions.STRING:
      case FieldTypeOptions.HIDDEN:
      case FieldTypeOptions.FRACTIONAL:
      case FieldTypeOptions.TEXTAREA:
        return value;

      case FieldTypeOptions.INTENDED_USE:
        return value?.name ?? "-";

      case FieldTypeOptions.REFERENCE_NUMBER:
        return value ? (
          <ExternalLink href={getReferenceNumberLink(value)} text={value} />
        ) : null;

      case FieldTypeOptions.DECIMAL:
        return !isEmptyValue(value)
          ? unit
            ? `${formatNumber(value)} ${unit}`
            : formatNumber(value)
          : "-";

      case FieldTypeOptions.CONTACT:
        return value ? (
          <ExternalLink
            className="no-margin"
            href={`${getRouteById(Routes.CONTACTS)}/${value.id}`}
            text={getContactFullName(value)}
          />
        ) : (
          "-"
        );

      case FieldTypeOptions.LESSOR:
        return getContactFullName(value);

      case FieldTypeOptions.USER:
        return getUserFullName(value);

      default:
        console.error(`Field type ${type} is not implemented`);
        return "NOT IMPLEMENTED";
    }
  };

  const displayError = meta.error && (disableTouched || meta.touched);
  const isDirty = meta.dirty && !disableDirty;
  const fieldComponent = resolveFieldType(fieldType);
  const type = resolveType(fieldType);

  if (allowEdit) {
    return (
      <div className={classNames("form-field", className)}>
        {label && fieldType === FieldTypeOptions.BOOLEAN && !invisibleLabel && (
          <FormTextTitle
            enableUiDataEdit={enableUiDataEdit}
            relativeTo={relativeTo}
            required={required}
            tooltipStyle={tooltipStyle}
            uiDataKey={uiDataKey}
          >
            {label}
          </FormTextTitle>
        )}
        {label &&
          fieldType !== FieldTypeOptions.BOOLEAN &&
          fieldType !== FieldTypeOptions.HIDDEN && (
            <FormFieldLabel
              className={invisibleLabel ? "invisible" : ""}
              htmlFor={input.name}
              enableUiDataEdit={enableUiDataEdit}
              relativeTo={relativeTo}
              required={required}
              tooltipStyle={tooltipStyle}
              uiDataKey={uiDataKey}
            >
              {label}
            </FormFieldLabel>
          )}
        <div
          className={classNames("form-field__component", {
            "has-unit": unit,
          })}
        >
          {createElement(fieldComponent, {
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
            valueSelectedCallback,
          })}
          {unit && <span className="form-field__unit">{unit}</span>}
        </div>
        {displayError && <ErrorComponent {...meta} />}
      </div>
    );
  }

  if (allowRead) {
    const text = multiSelect
      ? input.value.map((single) => getText(fieldType, single)).join(", ")
      : getText(fieldType, input.value);
    return (
      <>
        {!invisibleLabel && (
          <FormTextTitle
            enableUiDataEdit={enableUiDataEdit}
            relativeTo={relativeTo}
            tooltipStyle={tooltipStyle}
            uiDataKey={uiDataKey}
          >
            {label}
          </FormTextTitle>
        )}
        {readOnlyValueRenderer ? (
          readOnlyValueRenderer(input.value, options)
        ) : (
          <FormText>{text || "-"}</FormText>
        )}
      </>
    );
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
  serviceUnit?: UserServiceUnit;
  setRefForField?: (...args: Array<any>) => any;
  tooltipStyle?: Record<string, any>;
  validate?: (...args: Array<any>) => any;
  valueSelectedCallback?: (...args: Array<any>) => any;
  uiDataKey?: string | null | undefined;
  unit?: string;
};

const FormField: React.FC<Props> = ({
  autoBlur = false,
  autoComplete,
  className,
  disabled = false,
  disableDirty = false,
  disableTouched = false,
  enableUiDataEdit = false,
  ErrorComponent = ErrorBlock,
  fieldAttributes,
  filterOption,
  invisibleLabel = false,
  isLoading = false,
  isMulti,
  language,
  minDate,
  maxDate,
  name,
  onBlur,
  onChange = () => {},
  optionLabel,
  overrideValues,
  placeholder,
  readOnlyValueRenderer,
  relativeTo,
  rows,
  serviceUnit,
  setRefForField,
  tooltipStyle,
  validate,
  valueSelectedCallback,
  uiDataKey,
  unit,
}) => {
  // Equivalent to getDerivedStateFromProps
  const derivedValues = useMemo(() => {
    const overrideableBoolean = (fieldName: string) => {
      return get(overrideValues, fieldName) !== undefined
        ? !!get(overrideValues, fieldName)
        : !!get(fieldAttributes, fieldName);
    };

    return {
      allowEdit: get(fieldAttributes, "read_only") === false,
      allowRead: !!fieldAttributes,
      fieldType: get(fieldAttributes, "type"),
      label: get(overrideValues, "label") || get(fieldAttributes, "label"),
      value: get(overrideValues, "value"),
      options: getFieldAttributeOptions(fieldAttributes),
      required: overrideableBoolean("required"),
    };
  }, [fieldAttributes, overrideValues]);

  // Handler functions
  const handleGenericNormalize = useMemo(() => {
    return (value: any) => {
      const fieldProps = { ...fieldAttributes, ...derivedValues };
      return genericNormalizer(value, fieldProps);
    };
  }, [fieldAttributes, derivedValues]);

  const handleGenericValidate = useMemo(() => {
    return (value: any) => {
      const fieldProps = { ...fieldAttributes, ...derivedValues };
      return genericValidator(value, fieldProps);
    };
  }, [fieldAttributes, derivedValues]);

  const handleValidate = (value: any) => {
    if (!validate) {
      return undefined;
    }
    return validate(value);
  };

  const { allowEdit, allowRead, fieldType, label, options, required, value } =
    derivedValues;

  return (
    <Field
      name={name}
      {...derivedValues}
      validate={
        allowEdit
          ? (value, allValues) => {
              const error = handleGenericValidate(value);
              return error || handleValidate(value);
            }
          : undefined
      }
      allowRead={allowRead}
      autoBlur={autoBlur}
      autoComplete={autoComplete}
      className={className}
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
      minDate={minDate}
      maxDate={maxDate}
      normalize={handleGenericNormalize}
      onBlur={onBlur}
      onChange={onChange}
      optionLabel={optionLabel}
      options={options}
      placeholder={placeholder}
      readOnlyValueRenderer={readOnlyValueRenderer}
      relativeTo={relativeTo}
      required={required}
      rows={rows}
      serviceUnit={serviceUnit}
      setRefForField={setRefForField}
      tooltipStyle={tooltipStyle}
      valueSelectedCallback={valueSelectedCallback}
      uiDataKey={uiDataKey}
      unit={unit}
      value={value}
      {...overrideValues}
    >
      {(fieldRenderProps) => (
        <FormFieldInput
          {...fieldRenderProps}
          {...derivedValues}
          allowEdit={allowEdit}
          allowRead={allowRead}
          autoBlur={autoBlur}
          autoComplete={autoComplete}
          className={className}
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
          minDate={minDate}
          maxDate={maxDate}
          multiSelect={isMulti}
          optionLabel={optionLabel}
          options={options}
          placeholder={placeholder}
          readOnlyValueRenderer={readOnlyValueRenderer}
          relativeTo={relativeTo}
          required={required}
          rows={rows}
          serviceUnit={serviceUnit}
          setRefForField={setRefForField}
          tooltipStyle={tooltipStyle}
          uiDataKey={uiDataKey}
          unit={unit}
          valueSelectedCallback={valueSelectedCallback}
        />
      )}
    </Field>
  );
};

export default FormField;
