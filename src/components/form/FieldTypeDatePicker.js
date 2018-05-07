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
  placeholder: String,
}

const FieldTypeDatePicker = ({
  disabled = false,
  displayError = false,
  input,
  input: {onBlur, onChange, value},
  isDirty = false,
  placeholder,
}: Props) => {
  const handleBlur = (e: any) => {
    if(e && e.target.value) {
      const date = moment(e.target.value, ['YYYY-MM-DD', 'DD.MM.YYYY', 'DDMMYYYY']);
      onBlur(date.isValid() ? date.format('YYYY-MM-DD') : null);
    } else {
      onBlur(null);
    }
  };

  const handleSelect = (val: any, e: any) => {
    if((e && e.target.value)) {
      const date = moment(e.target.value, ['YYYY-MM-DD', 'DD.MM.YYYY', 'DDMMYYYY']);
      onChange(date.isValid() ? date.format('YYYY-MM-DD') : null);
    } else if (val) {
      const date = moment(val, ['YYYY-MM-DD', 'DD.MM.YYYY', 'DDMMYYYY']);
      onChange(date.isValid() ? date.format('YYYY-MM-DD') : null);
    } else {
      onChange(null);
    }
  };

  return (
    <div className={classNames('form-field__datepicker', {'has-error': displayError}, {'is-dirty': isDirty})}>
      <DatePicker
        {...input}
        disabled={disabled}
        disabledKeyboardNavigation
        locale='fi'
        onBlur={handleBlur}
        onSelect={handleSelect}
        placeholder={placeholder}
        selected={value ? moment(value, ['YYYY-MM-DD', 'DD.MM.YYYY', 'DDMMYYYY']) : null}
      />
    </div>
  );
};

export default FieldTypeDatePicker;
