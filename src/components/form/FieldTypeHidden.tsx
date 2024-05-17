import React from "react";
import classNames from "classnames";
type Props = {
  disabled: boolean;
  displayError: boolean;
  input: Record<string, any>;
  isDirty: boolean;
  setRefForField: (...args: Array<any>) => any;
  value: string;
};

const FieldTypeHidden = ({
  displayError,
  disabled,
  input,
  isDirty,
  setRefForField
}: Props): React.ReactNode => {
  const handleSetRefForField = (element: any) => {
    if (setRefForField) {
      setRefForField(element);
    }
  };

  return <input className={classNames('form-field__input', {
    'has-error': displayError
  }, {
    'is-dirty': isDirty
  })} ref={handleSetRefForField} id={input.name} disabled={disabled} type='hidden' {...input} />;
};

export default FieldTypeHidden;