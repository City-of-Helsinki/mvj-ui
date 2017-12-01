// @flow
import React from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';

type Props = {
  input: Object,
  meta: Object,
  placeholder: string,
}

class FieldDatePicker extends React.Component {
  props: Props

  getFormatedDate = (value: any) => {
    if(moment(value, 'DD.MM.YYYY')._isValid) {
      return moment(value, 'DD.MM.YYYY');
    }
    return null;
  }

  render () {
    const {
      input, placeholder,
      meta: {touched, error},
    } = this.props;

    return (
      <div>
        <DatePicker
          {...input}
          placeholder={placeholder}
          dateFormat="DD.MM.YYYY"
          disabledKeyboardNavigation
          selected={input.value ? this.getFormatedDate(input.value) : null}
        />
        {touched && error && <span>{error}</span>}
      </div>
    );
  }
}

export default FieldDatePicker;
