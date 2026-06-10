import React, {
  ChangeEvent,
  FocusEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { TextInput } from "hds-react";
import {
  formatLandUseDecimalValue,
  parseLandUseNumericValue,
} from "../utils/number";

type NumericDecimalInputProps = {
  isEditMode: boolean;
  id: string;
  label: string;
  value: number | string | undefined | null;
  onChange?: (value: number | null) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  errorText?: string;
  invalid?: boolean;
  unit?: string;
  style?: React.CSSProperties;
};

export const NumericDecimalInput = ({
  isEditMode,
  id,
  label,
  value,
  onChange,
  onBlur,
  errorText,
  invalid,
  unit,
  style,
}: NumericDecimalInputProps) => {
  const [displayValue, setDisplayValue] = useState<string>("");

  const getFormattedValue = useCallback(
    (val: number | string | undefined | null): string => {
      const parsed = parseLandUseNumericValue(val);
      if (parsed === null) return "";
      // U+00A0 No-Break Space (NBSP) Unicode Character
      return formatLandUseDecimalValue(parsed).replace(/\u00A0/g, " ");
    },
    [],
  );

  useEffect(() => {
    const parsedExternal = parseLandUseNumericValue(value);
    const parsedInternal = parseLandUseNumericValue(displayValue);

    if (parsedInternal !== parsedExternal) {
      setDisplayValue(getFormattedValue(value));
    }
  }, [value, displayValue, getFormattedValue]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const nextDisplayValue = e.target.value;
    setDisplayValue(nextDisplayValue);

    const parsed = parseLandUseNumericValue(nextDisplayValue);
    onChange?.(parsed);
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    setDisplayValue(getFormattedValue(value));
    onBlur?.(e);
  };

  if (!isEditMode) {
    const parsedValue = parseLandUseNumericValue(value);
    const unitSuffix = unit ? ` ${unit}` : "";
    const display =
      parsedValue !== null
        ? `${formatLandUseDecimalValue(parsedValue).replace(/\u00A0/g, " ")}${unitSuffix}`
        : "-";

    return (
      <TextInput id={id} label={label} value={display} readOnly style={style} />
    );
  }

  return (
    <TextInput
      id={id}
      label={label}
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      errorText={errorText}
      invalid={invalid}
      style={style}
    />
  );
};
