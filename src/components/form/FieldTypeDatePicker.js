// @flow
import React from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import classnames from 'classnames';

import 'react-datepicker/dist/react-datepicker.css';

type Props = {
  className?: string,
  disableTouched: boolean,
  input: Object,
  label: string,
  meta: Object,
  placeholder: string,
}

const getFormatedDate = (value: any) => {
  if(moment(value, 'DD.MM.YYYY')._isValid) {
    return moment(value, 'DD.MM.YYYY');
  }
  return null;
};

const FieldTypeDatePicker = ({
  className,
  disableTouched = false,
  input,
  label,
  meta: {dirty, error, touched},
  placeholder,
}: Props) => (
  <div className='mvj-form-field'>
    {label && <label className='mvj-form-field-label'>{label}</label>}
    <div className={classnames('mvj-form-field__datepicker', className, {'is-dirty': dirty})}>
      <DatePicker
        {...input}
        placeholder={placeholder}
        dateFormat="DD.MM.YYYY"
        disabledKeyboardNavigation
        selected={input.value ? getFormatedDate(input.value) : null}
      />
      {(touched || disableTouched) && error && <span className={'error'}>{error}</span>}
    </div>
  </div>
);

export default FieldTypeDatePicker;
