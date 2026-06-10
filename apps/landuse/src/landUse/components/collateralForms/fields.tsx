import React from "react";
import {
  DateInput,
  RadioButton,
  Select,
  SelectionGroup,
  TextArea,
  TextInput,
} from "hds-react";
import { Field } from "react-final-form";
import {
  getFieldTextValue,
  normalizeSelectValue,
  readOnlyTextValue,
} from "../../utils/fieldUtils";
import { NumericDecimalInput } from "@/landUse/components/NumericDecimalInput";

interface CommonProps {
  namePrefix: string;
  fieldName: string;
  label: string;
  idSuffix: string;
  isEditMode: boolean;
}

const buildId = (namePrefix: string, idSuffix: string) =>
  `${namePrefix.replace(/\./g, "-")}-${idSuffix}`;

export const CollateralTextField: React.FC<CommonProps> = ({
  namePrefix,
  fieldName,
  label,
  idSuffix,
  isEditMode,
}) => {
  const id = buildId(namePrefix, idSuffix);
  return (
    <Field name={`${namePrefix}.${fieldName}`}>
      {({ input }) => (
        <TextInput
          id={id}
          label={label}
          value={getFieldTextValue(isEditMode, input.value)}
          onChange={input.onChange}
          readOnly={!isEditMode}
        />
      )}
    </Field>
  );
};

export const CollateralTextArea: React.FC<CommonProps> = ({
  namePrefix,
  fieldName,
  label,
  idSuffix,
  isEditMode,
}) => {
  const id = buildId(namePrefix, idSuffix);
  return (
    <Field name={`${namePrefix}.${fieldName}`}>
      {({ input }) =>
        isEditMode ? (
          <TextArea
            id={id}
            label={label}
            value={input.value ?? ""}
            onChange={input.onChange}
          />
        ) : (
          <TextInput
            id={id}
            label={label}
            value={readOnlyTextValue(input.value)}
            readOnly
          />
        )
      }
    </Field>
  );
};

export const CollateralDateField: React.FC<CommonProps> = ({
  namePrefix,
  fieldName,
  label,
  idSuffix,
  isEditMode,
}) => {
  const id = buildId(namePrefix, idSuffix);
  return (
    <Field name={`${namePrefix}.${fieldName}`}>
      {({ input }) =>
        isEditMode ? (
          <DateInput
            id={id}
            label={label}
            value={input.value}
            onChange={input.onChange}
            placeholder="DD.MM.YYYY"
            language="fi"
          />
        ) : (
          <TextInput
            id={id}
            label={label}
            value={readOnlyTextValue(input.value)}
            readOnly
          />
        )
      }
    </Field>
  );
};

export const CollateralEuroField: React.FC<CommonProps> = ({
  namePrefix,
  fieldName,
  label,
  idSuffix,
  isEditMode,
}) => {
  const id = buildId(namePrefix, idSuffix);
  return (
    <Field name={`${namePrefix}.${fieldName}`}>
      {({ input, meta }) => {
        return (
          <NumericDecimalInput
            id={id}
            label={label}
            value={input.value}
            onChange={input.onChange}
            onBlur={input.onBlur}
            isEditMode={isEditMode}
            unit="€"
            errorText={meta.error}
            invalid={Boolean(meta.error)}
          />
        );
      }}
    </Field>
  );
};

interface SelectProps extends CommonProps {
  options: { label: string; value: string }[];
}

export const CollateralSelectField: React.FC<SelectProps> = ({
  namePrefix,
  fieldName,
  label,
  idSuffix,
  isEditMode,
  options,
}) => {
  const id = buildId(namePrefix, idSuffix);
  return (
    <Field name={`${namePrefix}.${fieldName}`}>
      {({ input }) =>
        isEditMode ? (
          <Select
            id={id}
            texts={{ label, placeholder: "Valitse" }}
            options={options}
            value={normalizeSelectValue(input.value)}
            onChange={(selected) => {
              if (selected.length > 0) {
                input.onChange(selected[0].value);
              } else {
                input.onChange(undefined);
              }
            }}
          />
        ) : (
          <TextInput
            id={id}
            label={label}
            value={readOnlyTextValue(input.value)}
            readOnly
          />
        )
      }
    </Field>
  );
};

interface RadioProps extends CommonProps {
  options: { label: string; value: string }[];
}

export const CollateralRadioField: React.FC<RadioProps> = ({
  namePrefix,
  fieldName,
  label,
  idSuffix,
  isEditMode,
  options,
}) => {
  const id = buildId(namePrefix, idSuffix);
  return (
    <Field name={`${namePrefix}.${fieldName}`}>
      {({ input }) =>
        isEditMode ? (
          <SelectionGroup label={label}>
            {options.map((option) => (
              <RadioButton
                key={option.value}
                id={`${id}-${option.value}`}
                label={option.label}
                checked={input.value === option.value}
                onChange={() => input.onChange(option.value)}
              />
            ))}
          </SelectionGroup>
        ) : (
          <TextInput
            id={id}
            label={label}
            value={readOnlyTextValue(input.value)}
            readOnly
          />
        )
      }
    </Field>
  );
};
