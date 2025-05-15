import React from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import fi from "date-fns/locale/fi";
import classNames from "classnames";
import type { FieldComponentProps } from "@/components/form/final-form/FormField";

registerLocale("fi", fi);

const FieldTypeTime = ({
  disabled = false,
  displayError = false,
  input: { name, onChange, value },
  isDirty = false,
  placeholder,
  setRefForField,
}: FieldComponentProps): JSX.Element => {
  const handleSetReference = (element: any) => {
    if (setRefForField) {
      setRefForField(element);
    }
  };

  const handleSelect = (val: any) => {
    onChange(val);
  };

  const handleChange = (val: any) => {
    onChange(val);
  };

  return (
    <div
      className={classNames(
        "form-field__datepicker",
        {
          "has-error": displayError,
        },
        {
          "is-dirty": isDirty,
        },
      )}
    >
      <DatePicker
        ref={handleSetReference}
        disabled={disabled}
        id={name}
        locale="fi"
        selected={value ? new Date(value) : null}
        dateFormat="dd.MM.yyyy HH:mm"
        showYearDropdown
        dropdownMode="select"
        onChange={handleChange}
        onSelect={handleSelect}
        placeholderText={placeholder}
        showTimeInput
      />
    </div>
  );
};

export default FieldTypeTime;
