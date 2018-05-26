// @flow
import React from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import classNames from 'classnames';

type Props = {
  disabled: boolean,
  displayError: boolean,
  input: Object,
  isDirty: boolean,
  placeholder?: string,
}

const FieldTypeDatePicker = ({
  disabled = false,
  displayError = false,
  input: {onBlur, onChange, value},
  isDirty = false,
  placeholder,
}: Props) => {
  let datePicker;

  const handleBlur = (e: any) => {
    if(e && e.target.value) {
      const date = moment(e.target.value, ['DDMMYYYY', 'DD.MM.YYYY']);
      if(date.toISOString()) {
        return onBlur(date.toISOString());
      }
      if(datePicker) {
        datePicker.setSelected(value);
      }
      return onChange(value && moment(value).toISOString() || null);
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
        locale='fi'
        placeholder={placeholder}
        onBlur={handleBlur}
        onChange={handleChange}
        onSelect={handleSelect}
        selected={value ? moment(value) : null}
        dateFormat='DD.MM.YYYY'
        allowSameDay={false}
        disabledKeyboardNavigation
        ref={(ref) => datePicker = ref}
      />
    </div>
  );
};

export default FieldTypeDatePicker;
