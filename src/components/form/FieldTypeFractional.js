// @flow
import React from 'react';
import classNames from 'classnames';

type Props = {
  disabled: boolean,
  displayError: boolean,
  input: Object,
  isDirty: boolean,
  placeholder?: string,
  setRefForField?: Function,
}

const NUMERATOR = 0;
const DENOMINATOR = 1;
const SPLITTER = ' / ';
const FieldTypeFractional = ({
  disabled = false,
  displayError = false,
  input: {name, onChange, value},
  isDirty = false,
  setRefForField,
}: Props): React$Node => {

  const handleSetReference = (element: any) => {
    if(setRefForField) {
      setRefForField(element);
    }
  };

  const changeHandler = (newValue: string, fieldType: number): void => {
    const values = value.split(SPLITTER);
    values[fieldType] = newValue;
    onChange(`${values[NUMERATOR] || ''}${SPLITTER}${values[DENOMINATOR] || ''}`);
  };

  const parseValue = (fieldType: number): string => {
    if (!value) {
      return '';
    }
    const values = value.split(SPLITTER);
    return values[fieldType];
  };

  return (
    <div className={classNames('form-field__fractional', {'has-error': displayError}, {'is-dirty': isDirty})}>
      {/* numerator / fin: osoittaja */}
      <input
        ref={handleSetReference}
        className="form-field__fractional-input"
        id={`${name}-numerator`}
        value={parseValue(NUMERATOR)}
        onChange={(e) => changeHandler(e.target.value, NUMERATOR)}
        disabled={disabled}
        type="number"
      />
      <span className="form-field__fractional-divider"> / </span>
      {/* denominator / fin: nimittäjä */}
      <input
        className="ApplicationFractionField__field"
        id={`${name}-denominator`}
        value={parseValue(DENOMINATOR)}
        onChange={(e) => changeHandler(e.target.value, DENOMINATOR)}
        disabled={disabled}
        type="number"
      />
    </div>
  );
};

export default FieldTypeFractional;
