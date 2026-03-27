import React from "react";
import classNames from "classnames";

import type { FieldComponentProps } from "@/components/form/final-form/FormField";

const FieldTypeCheckbox = ({
  disabled = false,
  displayError = false,
  input: { name, onBlur, onChange, value },
  isDirty = false,
  label,
  options,
}: FieldComponentProps): JSX.Element => {
  const hasMultipleValues = options && options.length > 1;

  const handleChange = (event: any, optionValue) => {
    let newValue: Array<boolean> | boolean;
    if (hasMultipleValues) {
      newValue = [...value];

      if (event.target.checked) {
        newValue.push(optionValue);
      } else {
        newValue.splice(newValue.indexOf(optionValue), 1);
      }
    } else {
      newValue = !!value && value !== "false" ? false : true;
    }

    onChange(newValue);
    onBlur();
  };

  return (
    <fieldset
      id={name}
      className={classNames(
        "form-field__checkbox",
        {
          "has-error": displayError,
        },
        {
          "is-dirty": isDirty,
        },
      )}
      disabled={disabled}
    >
      {label && <legend>{label}</legend>}
      {options &&
        options.map((option, index) => {
          const { value: optionValue, label: optionLabel } = option;
          return (
            <label key={index} className="option-label">
              <input
                type="checkbox"
                checked={
                  hasMultipleValues
                    ? value.indexOf(optionValue) !== -1
                    : !!value && value !== "false"
                }
                name={hasMultipleValues ? `${name}[${index}]` : name}
                onChange={(event) => handleChange(event, optionValue)}
                value={optionValue}
              />
              <span>{optionLabel}</span>
            </label>
          );
        })}
      {options?.length === 0 && (
        <label className="option-label">
          <input
            type="checkbox"
            checked={!!value}
            name={name}
            onChange={(event) => handleChange(event, !value)}
            value={value}
          />
          <span>Kyllä</span>
        </label>
      )}
    </fieldset>
  );
};

export default FieldTypeCheckbox;
