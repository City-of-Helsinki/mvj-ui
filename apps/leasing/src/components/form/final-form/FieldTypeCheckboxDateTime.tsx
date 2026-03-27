import React, { useRef } from "react";
import classNames from "classnames";

import type { FieldComponentProps } from "@/components/form/final-form/FormField";

const FieldTypeCheckboxDateTime = ({
  disabled = false,
  displayError = false,
  input: { name, onChange, onBlur, value },
  isDirty = false,
  label,
}: FieldComponentProps): JSX.Element => {
  const initialValueRef = useRef<string | null>(value);

  const getValue = () => {
    // This logic handles the checkbox so that when it is toggled,
    // it doesn't lose the initial value (if it had one).
    // The component is keeping track of a datetime of when this was first checked.
    const isChecked = !!value;
    const hasInitialValue = !!initialValueRef.current;
    if (!isChecked) return null;
    if (hasInitialValue) return initialValueRef.current;
    return new Date().toISOString();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = getValue();

    onChange(newValue);
    onBlur();
  };

  return (
    <label
      className={classNames(
        "form-field__checkbox-date-time",
        {
          "has-error": displayError,
        },
        {
          "is-dirty": isDirty,
        },
      )}
    >
      <input
        type="checkbox"
        checked={!!value}
        disabled={disabled}
        name={name}
        onChange={handleChange}
        value={value as any}
      />
      <span>{label}</span>
    </label>
  );
};

export default FieldTypeCheckboxDateTime;
