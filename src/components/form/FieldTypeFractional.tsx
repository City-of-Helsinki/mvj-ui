import React, { useRef } from "react";
import classNames from "classnames";
type Props = {
  disabled: boolean;
  displayError: boolean;
  input: Record<string, any>;
  isDirty: boolean;
  placeholder?: string;
  setRefForField?: (...args: Array<any>) => any;
};
const NUMERATOR = 0;
const DENOMINATOR = 1;
const SPLITTER = ' / ';

const FieldTypeFractional = ({
  disabled = false,
  displayError = false,
  input: {
    name,
    onChange,
    onBlur,
    value
  },
  isDirty = false,
  setRefForField,
  input
}: Props): JSX.Element => {
  const firstFieldRef = useRef<null | HTMLInputElement>(null);
  const secondFieldRef = useRef<null | HTMLInputElement>(null);

  const handleSetReference = (element: any) => {
    if (setRefForField) {
      setRefForField(element);
    }

    firstFieldRef.current = element;
  };

  const changeHandler = (newValue: string, fieldType: number): void => {
    const values = value.split(SPLITTER);
    values[fieldType] = newValue;
    onChange(`${values[NUMERATOR] || ''}${SPLITTER}${values[DENOMINATOR] || ''}`);
  };

  const handleBlur = (e: any) => {
    // Mark the redux-form field as touched by manually exiting it with onBlur() when focus moves from either
    // HTML element to outside this field component. This allows the possible error state to show up properly
    // only when the user has finished editing the field and not immediately after they have entered the first number.
    if (e.relatedTarget !== firstFieldRef.current && e.relatedTarget !== secondFieldRef.current) {
      onBlur();
    }
  };

  const parseValue = (fieldType: number): string => {
    if (!value) {
      return '';
    }

    const values = value.split(SPLITTER);
    return values[fieldType];
  };

  return <div className="form-field__fractional">
      {
      /* numerator / fin: osoittaja */
    }
      <input ref={handleSetReference} className={classNames('form-field__input', 'form-field__fractional-input', {
      'has-error': displayError
    }, {
      'is-dirty': isDirty
    })} id={`${name}-numerator`} value={parseValue(NUMERATOR)} onChange={e => changeHandler(e.target.value, NUMERATOR)} onBlur={handleBlur} disabled={disabled} type="number" min="1" />
      <span className="form-field__fractional-divider"> / </span>
      {
      /* denominator / fin: nimittäjä */
    }
      <input className={classNames('form-field__input', 'form-field__fractional-input', {
      'has-error': displayError
    }, {
      'is-dirty': isDirty
    })} id={`${name}-denominator`} value={parseValue(DENOMINATOR)} onChange={e => changeHandler(e.target.value, DENOMINATOR)} onBlur={handleBlur} disabled={disabled} type="number" min="1" ref={secondFieldRef} />
    </div>;
};

export default FieldTypeFractional;