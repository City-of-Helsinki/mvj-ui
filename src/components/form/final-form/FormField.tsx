import React, { createElement, useMemo } from "react";
import { Field } from "react-final-form";
import type { FieldRenderProps } from "react-final-form";
import classNames from "classnames";
import get from "lodash/get";
import ErrorBlock from "@/components/form/ErrorBlock";
import ExternalLink from "@/components/links/ExternalLink";
import FieldTypeAddress from "@/components/form/final-form/FieldTypeAddress";
import FieldTypeAreaSearchDistrictSelect from "@/components/form/final-form/FieldTypeAreaSearchDistrictSelect";
import FieldTypeBasic from "@/components/form/final-form/FieldTypeBasic";
import FieldTypeBoolean from "@/components/form/final-form/FieldTypeBoolean";
import FieldTypeCheckbox from "@/components/form/final-form/FieldTypeCheckbox";
import FieldTypeCheckboxDateTime from "@/components/form/final-form/FieldTypeCheckboxDateTime";
import FieldTypeContactSelect from "@/components/form/final-form/FieldTypeContactSelect";
import FieldTypeDatePicker from "@/components/form/final-form/FieldTypeDatePicker";
import FieldTypeDecimal from "@/components/form/final-form/FieldTypeDecimal";
import FieldTypeIntendedUseSelect from "@/components/form/final-form/FieldTypeIntendedUseSelect";
import FieldTypeLeaseSelect from "@/components/form/final-form/FieldTypeLeaseSelect";
import FieldTypeLessorSelect from "@/components/form/final-form/FieldTypeLessorSelect";
import FieldTypeMultiSelect from "@/components/form/final-form/FieldTypeMultiSelect";
import FieldTypeRadioWithField from "@/components/form/final-form/FieldTypeRadioWithField";
import FieldTypeSearch from "@/components/form/final-form/FieldTypeSearch";
import FieldTypeSelect from "@/components/form/final-form/FieldTypeSelect";
import FieldTypeTextArea from "@/components/form/final-form/FieldTypeTextArea";
import FieldTypeUserSelect from "@/components/form/final-form/FieldTypeUserSelect";
import FormFieldLabel from "@/components/form/FormFieldLabel";
import FieldTypeTime from "@/components/form/final-form/FieldTypeTime";
import FieldTypeHidden from "@/components/form/final-form/FieldTypeHidden";
import FieldTypeFractional from "@/components/form/final-form/FieldTypeFractional";
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

type InputProps<TOptions = Record<string, any>> = {
  allowEdit: boolean;
  allowRead: boolean;
  autoBlur: boolean;
  autoComplete?: string;
  className?: string;
  disabled: boolean;
  disableDirty: boolean;
  disableTouched: boolean;
  displayError?: boolean;
  enableUiDataEdit?: boolean;
  ErrorComponent: ((...args: Array<any>) => any) | any;
  fieldType: FieldTypeOptions | TypeOptions;
  filterOption?: (...args: Array<any>) => any;
  invisibleLabel: boolean;
  isDirty?: boolean;
  isLoading: boolean;
  label: string | null | undefined;
  language?: string;
  minDate?: Date;
  maxDate?: Date;
  multiSelect?: boolean;
  optionLabel?: string;
  options: Array<TOptions> | null | undefined;
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
  type?: TypeOptions | null;
  valueSelectedCallback?: (...args: Array<any>) => any;
};
export type FieldComponentProps<TOptions = Record<string, any>> =
  FieldRenderProps<any, any> & Partial<InputProps<TOptions>>;
type FieldKey = keyof typeof FieldTypeOptions;
type FieldValue = (typeof FieldTypeOptions)[FieldKey];
type FieldComponent = React.ComponentType<FieldComponentProps>;

const FieldTypes: Record<FieldValue, FieldComponent> = {
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
} as const;
const Types = {
  [FieldTypeOptions.DECIMAL]: "text",
  [FieldTypeOptions.INTEGER]: "text",
  [FieldTypeOptions.REFERENCE_NUMBER]: "text",
  [FieldTypeOptions.STRING]: "text",
  [FieldTypeOptions.TEXTAREA]: "text",
} as const;

type ObjectValues<T> = T[keyof T];
type FieldTypeComponent = ObjectValues<typeof FieldTypes>;
type FieldTypeOptions =
  (typeof FieldTypeOptions)[keyof typeof FieldTypeOptions];
type TypeOptions = (typeof Types)[keyof typeof Types];

const resolveFieldType = (
  type: FieldTypeOptions | string,
): FieldTypeComponent | typeof FieldTypeBasic =>
  type in FieldTypes ? FieldTypes[type] : FieldTypeBasic;

const resolveType = (type: TypeOptions | string): TypeOptions | null =>
  type in Types ? Types[type] : null;

const FormFieldInput = (props: FieldComponentProps) => {
  const {
    allowEdit,
    allowRead,
    autoComplete = "nope",
    className,
    disableDirty,
    disableTouched,
    enableUiDataEdit,
    ErrorComponent,
    fieldType,
    input,
    invisibleLabel,
    label,
    meta,
    multiSelect,
    options,
    readOnlyValueRenderer,
    relativeTo,
    required,
    tooltipStyle,
    uiDataKey,
    unit,
  } = props;

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
            ...props,
            displayError,
            isDirty,
            type,
            input,
            meta,
            autoComplete,
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

const FormField: React.FC<Props> = (props) => {
  const { fieldAttributes, name, overrideValues, validate, isMulti } = props;
  const errorComponent = props.ErrorComponent || ErrorBlock;

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

  const { allowEdit } = derivedValues;

  const fieldComponentProps = {
    name,
    normalize: handleGenericNormalize,
    validate: allowEdit
      ? (value: any) => {
          const customError = handleValidate(value);
          return customError || handleGenericValidate(value);
        }
      : undefined,
  };

  const specialProps = {
    multiSelect: isMulti,
    ErrorComponent: errorComponent,
  };

  const formFieldInputProps = {
    ...props,
    ...derivedValues,
    ...specialProps,
    ...overrideValues,
  };

  return (
    <Field {...fieldComponentProps} {...formFieldInputProps}>
      {(fieldRenderProps) => {
        const { input, meta, ...otherFieldProps } = fieldRenderProps;

        return (
          <FormFieldInput
            {...formFieldInputProps}
            {...otherFieldProps}
            input={input}
            meta={meta}
          />
        );
      }}
    </Field>
  );
};

export default FormField;
