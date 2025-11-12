import React, { useState, useRef } from "react";
import Select from "react-select";
import classNames from "classnames";
import DropdownIndicator from "@/components/inputs/DropdownIndicator";
import LoadingIndicator from "@/components/inputs/SelectLoadingIndicator";

import type { FieldComponentProps } from "@/components/form/final-form/FormField";

type SelectOption = {
  value: string | number | boolean;
  label: string;
  [key: string]: any;
};

const FieldTypeSelect = (props: FieldComponentProps): JSX.Element => {
  const {
    autoBlur,
    disabled,
    displayError,
    filterOption,
    input,
    input: { name, onBlur, onChange, value },
    isDirty,
    isLoading,
    options,
    placeholder,
    setRefForField,
  } = props;

  const [inputSearchValue, setInputSearchValue] = useState("");
  const selectRef = useRef<any>(null);

  const handleBlur = () => {
    onBlur(value);
  };

  const handleChange = (selectedOption: SelectOption | null) => {
    if (selectedOption) {
      const selectedValue = selectedOption.value;
      onChange(selectedValue);
      if (autoBlur) {
        onBlur();
      }
    }
  };

  const handleInputChange = (value: string, meta: Record<string, any>) => {
    const { action } = meta;
    switch (action) {
      case "input-change":
        setInputSearchValue(value);
        break;
    }
  };

  const handleMenuOpen = () => {
    if (
      selectRef.current &&
      selectRef.current.state.inputValue !== inputSearchValue
    ) {
      selectRef.current.onInputChange(inputSearchValue, {
        action: "input-change",
      });
    }
  };

  const setRef = (element: any) => {
    selectRef.current = element;

    if (setRefForField && element) {
      setRefForField(element.select);
    }
  };

  const selectedOption =
    (options && options.find((option) => option.value == value)) || "";

  return (
    <div
      className={classNames(
        "form-field__select",
        {
          "has-error": displayError,
        },
        {
          "is-dirty": isDirty,
        },
      )}
    >
      <Select
        ref={setRef}
        className="select-input"
        classNamePrefix="select-input"
        components={{
          DropdownIndicator,
          IndicatorSeparator: null,
          LoadingIndicator,
        }}
        isDisabled={disabled}
        filterOption={filterOption}
        id={name}
        isLoading={isLoading}
        onBlur={handleBlur}
        onChange={handleChange}
        noOptionsMessage={() => "Ei tuloksia"}
        onInputChange={handleInputChange}
        onMenuOpen={handleMenuOpen}
        options={options}
        placeholder={placeholder || "Valitse..."}
        value={selectedOption}
      />
    </div>
  );
};

export default FieldTypeSelect;
