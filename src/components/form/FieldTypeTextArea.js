// @flow
import React from 'react';
import classNames from 'classnames';

type Props = {
  className: string,
  disabled: boolean,
  displayError: boolean,
  input: Object,
  isDirty: boolean,
  placeholder: string,
  rows?: number,
}

const FieldTypeTextArea = ({
  displayError,
  disabled,
  input,
  isDirty,
  placeholder,
  rows = 3,
}: Props) =>
  <textarea
    className={classNames('form-field__input', {'has-error': displayError}, {'is-dirty': isDirty})}
    disabled={disabled}
    id={input.name}
    placeholder={placeholder}
    rows={rows}
    {...input}
  />;

export default FieldTypeTextArea;
