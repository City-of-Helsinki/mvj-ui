import React from "react";
import classNames from "classnames";
import type { FieldComponentProps } from "@/components/form/final-form/FormField";

const FieldTypeHidden = ({
  displayError,
  disabled,
  input,
  isDirty,
  setRefForField,
}: FieldComponentProps): JSX.Element => {
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
      id={input.name}
      disabled={disabled}
      type="hidden"
      {...input}
    />
  );
};

export default FieldTypeHidden;
