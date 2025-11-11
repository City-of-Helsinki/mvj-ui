import React from "react";
import DatePicker, {
  type DatePickerProps,
  registerLocale,
} from "react-datepicker";
import parse from "date-fns/parse";
import fi from "date-fns/locale/fi";
import classNames from "classnames";
import { isValidDate } from "@/util/date";
registerLocale("fi", fi);
type Props = {
  disabled: boolean;
  displayError: boolean;
  input: Record<string, any>;
  isDirty: boolean;
  minDate?: Date;
  maxDate?: Date;
  placeholder?: string;
  setRefForField?: (...args: Array<any>) => any;
};

const FieldTypeDatePicker = ({
  disabled = false,
  displayError = false,
  input: { name, onChange, value },
  isDirty = false,
  minDate,
  maxDate,
  placeholder,
  setRefForField,
}: Props): JSX.Element => {
  const handleSetReference = (element: any) => {
    if (setRefForField) {
      setRefForField(element);
    }
  };

  const isShortDateStr = (value: string) =>
    value.length === 8 && /^[0-9.]+$/.test(value);

  const getDateStr = (value: string) =>
    [value.substring(0, 2), value.substring(2, 4), value.substring(4, 9)].join(
      ".",
    );

  const getParsedDate = (value: string) =>
    parse(value, "dd.MM.yyyy", new Date(), {
      locale: fi,
    });

  const handleSelect = (val: any) => {
    onChange(val);
  };
  const handleChangeRaw: DatePickerProps["onChangeRaw"] = (e) => {
    const value = (e?.target as HTMLInputElement)?.value;
    if (!value) return;
    let parsedDate = getParsedDate(value);
    if (isValidDate(parsedDate)) {
      onChange(parsedDate);
    } else if (isShortDateStr(value)) {
      const dateStr = getDateStr(value);
      parsedDate = getParsedDate(dateStr);

      if (isValidDate(parsedDate)) {
        onChange(parsedDate);
      }
    }
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
        dateFormat="dd.MM.yyyy"
        showYearDropdown
        dropdownMode="select"
        onChangeRaw={handleChangeRaw}
        onSelect={handleSelect}
        placeholderText={placeholder}
        minDate={minDate}
        maxDate={maxDate}
      />
    </div>
  );
};

export default FieldTypeDatePicker;
