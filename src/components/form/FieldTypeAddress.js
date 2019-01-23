// @flow
import React from 'react';
import AddressSearchInput from '$components/address-search/AddressSearchInput';
import classNames from 'classnames';

type Props = {
  autoComplete: string,
  disabled: Boolean,
  displayError: boolean,
  input: Object,
  isDirty: boolean,
  valueSelectedCallback?: Function,
}

const FieldTypeAddress = ({
  autoComplete,
  disabled,
  displayError,
  input,
  input: {name, onBlur, onChange, value},
  isDirty,
  valueSelectedCallback,
}: Props) => {
  return (
    <div className={classNames('form-field__address', {'has-error': displayError}, {'is-dirty': isDirty})}>
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
