// @flow
import React from 'react';
import AddressSearchInput from '$components/address-search/AddressSearchInput';
import classNames from 'classnames';

type Props = {
  disabled: Boolean,
  displayError: boolean,
  input: Object,
  isDirty: boolean,
  language?: string,
  valueSelectedCallback?: Function,
}

const FieldTypeAddress = ({
  disabled,
  displayError,
  input,
  input: {name, onBlur, onChange, value},
  isDirty,
  language,
  valueSelectedCallback,
}: Props) => {
  return (
    <div className={classNames('form-field__address', {'has-error': displayError}, {'is-dirty': isDirty})}>
      <AddressSearchInput
        {...input}
        addressDetailsCallBack={valueSelectedCallback}
        id={name}
        name={name}
        language={language}
        onBlur={onBlur}
        onChange={onChange}
        selected={value}
        disabled={disabled}
      />
    </div>
  );
};

export default FieldTypeAddress;
