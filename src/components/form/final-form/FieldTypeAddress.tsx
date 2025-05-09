import React from "react";
import classNames from "classnames";
import AddressSearchInput from "@/components/address-search/AddressSearchInput";

import type { FieldComponentProps } from "@/components/form/final-form/FormField";

const FieldTypeAddress = ({
  autoComplete,
  disabled,
  displayError,
  input,
  input: { name, onBlur, onChange, value },
  isDirty,
  valueSelectedCallback,
}: FieldComponentProps): JSX.Element => {
  return (
    <div
      className={classNames(
        "form-field__address",
        {
          "has-error": displayError,
        },
        {
          "is-dirty": isDirty,
        },
      )}
    >
      <AddressSearchInput
        {...input}
        addressDetailsCallBack={valueSelectedCallback}
        autoComplete={autoComplete}
        id={name}
        name={name}
        onBlur={onBlur}
        onChange={onChange}
        selected={value}
        disabled={disabled}
      />
    </div>
  );
};

export default FieldTypeAddress;
