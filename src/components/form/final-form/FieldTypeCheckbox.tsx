import React from "react";
import classNames from "classnames";
type Props = {
  disabled: boolean;
  displayError: boolean;
  input: Record<string, any>;
  isDirty: boolean;
  label: string;
  options: Array<Record<string, any>>;
};

const FieldTypeCheckbox = ({
  disabled = false,
  displayError = false,
  input: { name, onBlur, value },
  isDirty = false,
  label,
  options,
}: Props): JSX.Element => {
  const hasMultipleValues = options && options.length > 1;

  const handleChange = (event: any, optionValue) => {
    if (hasMultipleValues) {
      const newValue = [...value];

      if (event.target.checked) {
        newValue.push(optionValue);
      } else {
        newValue.splice(newValue.indexOf(optionValue), 1);
      }

      return onBlur(newValue);
    }

    // noinspection RedundantConditionalExpressionJS
    return onBlur(!!value && value !== "false" ? false : true);
  };

  return (
    <fieldset
      id={name}
      className={classNames(
        "form-field__checkbox",
        {
          "has-error": displayError,
        },
        {
          "is-dirty": isDirty,
        },
      )}
      disabled={disabled}
    >
      {label && <legend>{label}</legend>}
      {options &&
        options.map((option, index) => {
          const { value: optionValue, label: optionLabel } = option;
          return (
            <label key={index} className="option-label">
              <input
                type="checkbox"
                checked={
                  hasMultipleValues
                    ? value.indexOf(optionValue) !== -1
                    : !!value && value !== "false"
                }
                name={hasMultipleValues ? `${name}[${index}]` : name}
                onChange={(event) => handleChange(event, optionValue)}
                value={optionValue}
              />
              <span>{optionLabel}</span>
            </label>
          );
        })}
      {options?.length === 0 && (
        <label className="option-label">
          <input
            type="checkbox"
            checked={!!value}
            name={name}
            onChange={(event) => handleChange(event, !value)}
            value={value}
          />
          <span>Kyllä</span>
        </label>
      )}
    </fieldset>
  );
};

export default FieldTypeCheckbox;
