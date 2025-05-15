import React from "react";
import classNames from "classnames";

import type { FieldComponentProps } from "@/components/form/final-form/FormField";

const FieldTypeBasic = ({
  autoBlur,
  autoComplete,
  displayError = false,
  disabled = false,
  input: { onBlur, onChange, ...inputRest },
  isDirty,
  placeholder,
  setRefForField,
  type = "text",
}: FieldComponentProps): JSX.Element => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    if (autoBlur) {
      onBlur();
    }
  };

  const handleSetRefForField = (element: any) => {
    if (setRefForField) {
      setRefForField(element);
    }
  };

  return (
    <input
      className={classNames(
        "form-field__input",
        {
          "has-error": displayError,
        },
        {
          "is-dirty": isDirty,
        },
      )}
      ref={handleSetRefForField}
      id={inputRest.name}
      autoComplete={autoComplete}
      disabled={disabled}
      placeholder={placeholder}
      type={type}
      {...inputRest}
      onChange={handleChange}
    />
  );
};

export default FieldTypeBasic;
