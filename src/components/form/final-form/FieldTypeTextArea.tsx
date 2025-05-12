import React from "react";
import classNames from "classnames";
import type { FieldComponentProps } from "@/components/form/final-form/FormField";
import { Field } from "redux-form";

const FieldTypeTextArea = ({
  autoBlur,
  autoComplete,
  displayError,
  disabled,
  input,
  input: { onBlur, onChange },
  isDirty,
  placeholder,
  rows = 3,
  setRefForField,
  type = "text",
}: FieldComponentProps): JSX.Element => {
  const handleChange = (e: any) => {
    if (autoBlur) {
      onBlur(e.target.value);
    } else {
      onChange(e.target.value);
    }
  };

  const handleSetRefForField = (element: any) => {
    if (setRefForField) {
      setRefForField(element);
    }
  };

  return (
    <textarea
      className={classNames(
        "form-field__textarea",
        {
          "has-error": displayError,
        },
        {
          "is-dirty": isDirty,
        },
      )}
      ref={handleSetRefForField}
      id={input.name}
      autoComplete={autoComplete}
      disabled={disabled}
      placeholder={placeholder}
      rows={rows}
      {...input}
      onChange={handleChange}
    />
  );
};

export default FieldTypeTextArea;
