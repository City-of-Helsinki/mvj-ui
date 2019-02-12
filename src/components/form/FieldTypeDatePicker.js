// @flow
import React from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'moment/locale/fi';
import classNames from 'classnames';

type Props = {
  disabled: boolean,
  displayError: boolean,
  input: Object,
  isDirty: boolean,
  placeholder?: string,
  setRefForField?: Function,
}

const FieldTypeDatePicker = ({
  disabled = false,
  displayError = false,
  input: {name, onBlur, onChange, value},
  isDirty = false,
  placeholder,
  setRefForField,
}: Props) => {
  let datePicker;

  const handleSetReference = (element: any) => {
    datePicker = element;
    if(setRefForField) {
      setRefForField(element);
    }
  };

  const handleBlur = (e: any) => {
    if(e && e.target.value) {
      const date = moment(e.target.value, ['DDMMYYYY', 'DD.MM.YYYY']);

      if(datePicker) {
        datePicker.setSelected(date.toISOString() || value);
      }
      if(date.toISOString()) {
        return onBlur(date.toISOString());
      }
      return onBlur(value);
    } else {
      onBlur(null);
    }
  };

  const handleSelect = (val: any, e: any) => {
    if(e && e.target.value) {
      const date = moment(e.target.value, ['DDMMYYYY', 'DD.MM.YYYY']);
      if(date.toISOString()) {
        return onChange(date.toISOString());
      }
      return onChange(value && moment(value).toISOString() || null);
    }
  };

  const handleChange = (e: any) => {
    onChange(e);
  };

  return (
    <div className={classNames('form-field__datepicker', {'has-error': displayError}, {'is-dirty': isDirty})}>
      <DatePicker
        disabled={disabled}
        id={name}
        locale='fi'
        placeholderText={placeholder}
        onBlur={handleBlur}
        onChange={handleChange}
        onSelect={handleSelect}
        // $FlowFixMe
        selected={value ? moment(value) : undefined}
        dateFormat='DD.MM.YYYY'
        showYearDropdown
        dropdownMode="select"
        ref={handleSetReference}
      />
    </div>
  );
};

export default FieldTypeDatePicker;
