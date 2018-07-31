// @flow
import React from 'react';
import MultiSelect from '../multi-select/MultiSelect';
import classNames from 'classnames';

type Props = {
  disabled: Boolean,
  displayError: boolean,
  input: Object,
  isDirty: boolean,
  isLoading: boolean,
  options: ?Array<any>,
}

const FieldTypeSelect = ({
  disabled,
  displayError,
  input,
  input: {name, onChange, value},
  isDirty,
  isLoading = false,
  options,
}: Props) => {
  return (
    <div className={classNames('form-field__multiselect', {'has-error': displayError}, {'is-dirty': isDirty})}>
      <MultiSelect
        {...input}
        id={name}
        options={options}
        onSelectedChanged={onChange}
        selected={value}
        disabled={disabled}
        isLoading={isLoading}
      />
    </div>
  );
};

export default FieldTypeSelect;
