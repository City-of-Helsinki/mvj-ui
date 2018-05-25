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

  const handleBlur = (e: any) => {
    if(e && e.target.value) {
      const date = moment(e.target.value, ['DDMMYYYY', 'DD.MM.YYYY']);
      if(date.isValid()) {
        return onBlur(date.toISOString());
      }
      return onBlur(null);
    } else {
      onBlur(null);
    }
  };

  const handleSelect = (val: any, e: any) => {
    if(e && e.target.value) {
      onChange(moment(e.target.value, ['DDMMYYYY', 'DD.MM.YYYY']).toISOString());
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
        disabledKeyboardNavigation
      />
    </div>
  );
};

export default FieldTypeDatePicker;
