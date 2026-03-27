import React, { useState, useEffect, useCallback } from "react";
import classNames from "classnames";
import { formatNumber } from "@/util/helpers";
import { convertStrToDecimalNumber, isDecimalNumberStr } from "@/util/helpers";

import type { FieldComponentProps } from "@/components/form/final-form/FormField";

const formatDecimalNumber = (val: string) => {
  if (isDecimalNumberStr(val)) {
    return formatNumber(convertStrToDecimalNumber(val));
  } else {
    return val || "";
  }
};

const FieldTypeDecimal = ({
  autoBlur = false,
  autoComplete,
  disabled = false,
  displayError = false,
  input,
  input: { name, onBlur, onChange, value },
  isDirty = false,
  placeholder = "",
  setRefForField,
}: FieldComponentProps): JSX.Element => {
  const [innerValue, setInnerValue] = useState<string | null | undefined>(
    formatDecimalNumber(value),
  );

  useEffect(() => {
    if (value !== innerValue) {
      setInnerValue(formatDecimalNumber(value));
    }
  }, [value, innerValue]);

  const handleBlur = (e: React.SyntheticEvent<HTMLInputElement>) => {
    onBlur();
  };

  const handleChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    onChange(e.currentTarget.value);
    setInnerValue(e.currentTarget.value);
    if (autoBlur) {
      handleBlur(e);
    }
  };

  const handleSetRefForField = useCallback(
    (element: any) => {
      if (setRefForField) {
        setRefForField(element);
      }
    },
    [setRefForField],
  );

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
      id={name}
      autoComplete={autoComplete}
      disabled={disabled}
      placeholder={placeholder}
      type="text"
      {...input}
      onBlur={handleBlur}
      onChange={handleChange}
      value={innerValue}
    />
  );
};

export default FieldTypeDecimal;
