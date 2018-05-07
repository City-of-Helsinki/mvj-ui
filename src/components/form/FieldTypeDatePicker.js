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
      onBlur(moment(e.target.value, ['YYYY-MM-DD', 'DD.MM.YYYY', 'DDMMYYYY']));
    } else {
      onBlur(null);
    }
  };

  const handleSelect = (val: any, e: any) => {
    if((e && e.target.value)) {
      console.log('tr', e.target.value);
      onChange(moment(e.target.value, ['YYYY-MM-DD', 'DD.MM.YYYY', 'DDMMYYYY']));
    } else if (val) {
      console.log('va', val);
      onChange(moment(val, ['YYYY-MM-DD', 'DD.MM.YYYY', 'DDMMYYYY']));
    } else {
      onChange(null);
    }
  };

  return (
    <div className={classNames('form-field__datepicker', {'has-error': displayError}, {'is-dirty': isDirty})}>
      <DatePicker
        {...input}
        disabled={disabled}
        locale='fi'
        onBlur={handleBlur}
        onChange={(e) => console.log(e)}
        onKeyUp={(e) => console.log(e)}
        onSelect={handleSelect}
        placeholder={placeholder}
        selected={value && moment(value, ['YYYY-MM-DD', 'DD.MM.YYYY', 'DDMMYYYY']) || null}
        dateFormat='DD.MM.YYYY'
        disabledKeyboardNavigation
      />
    </div>
  );
};

export default FieldTypeDatePicker;
