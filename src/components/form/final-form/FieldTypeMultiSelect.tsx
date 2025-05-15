import React from "react";
import classNames from "classnames";
import MultiSelect from "@/components/multi-select/MultiSelect";
import type { Option } from "@/components/multi-select/SelectItem";
import type { FieldComponentProps } from "@/components/form/final-form/FormField";

const FieldTypeMultiSelect = <TOptions extends Option>({
  disabled,
  displayError,
  input,
  input: { name, onBlur, onChange, value },
  isDirty,
  isLoading = false,
  options,
}: FieldComponentProps<TOptions>): JSX.Element => {
  const handleBlur = (selected: Array<Option>) => {
    onChange(selected);
    onBlur();
  };

  return (
    <div
      className={classNames(
        "form-field__multiselect",
        {
          "has-error": displayError,
        },
        {
          "is-dirty": isDirty,
        },
      )}
    >
      <MultiSelect
        {...input}
        id={name}
        options={options}
        onBlur={handleBlur}
        onSelectedChanged={onChange}
        selected={value instanceof Array ? value : []}
        disabled={disabled}
        isLoading={isLoading}
      />
    </div>
  );
};

export default FieldTypeMultiSelect;
