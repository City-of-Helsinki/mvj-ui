import React from "react";
import classNames from "classnames";
import MultiSelect from "src/components/multi-select/MultiSelect";
type Props = {
  disabled: Boolean;
  displayError: boolean;
  input: Record<string, any>;
  isDirty: boolean;
  isLoading: boolean;
  options: Array<any> | null | undefined;
};

const FieldTypeMultiSelect = ({
  disabled,
  displayError,
  input,
  input: {
    name,
    onBlur,
    onChange,
    value
  },
  isDirty,
  isLoading = false,
  options
}: Props): React.ReactNode => {
  const handleBlur = (selected: Array<string>) => onBlur(selected);

  return <div className={classNames('form-field__multiselect', {
    'has-error': displayError
  }, {
    'is-dirty': isDirty
  })}>
      <MultiSelect {...input} id={name} options={options} onBlur={handleBlur} onSelectedChanged={onChange} selected={value instanceof Array ? value : []} disabled={disabled} isLoading={isLoading} />
    </div>;
};

export default FieldTypeMultiSelect;