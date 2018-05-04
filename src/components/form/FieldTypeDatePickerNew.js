// @flow
import React, {Component} from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import classNames from 'classnames';

type Props = {
  disabled: Boolean,
  displayError: boolean,
  input: Object,
  isDirty: boolean,
  placeholder: String,
}

class FieldTypeDatePicker extends Component {
  props: Props

  handleBlur = (e: any) => {
    const {input: {onBlur}} = this.props;

    if(e && e.target.value) {
      const date = moment(e.target.value, ['YYYY-MM-DD', 'DD.MM.YYYY', 'DDMMYYYY']);
      onBlur(date.isValid() ? date.format('YYYY-MM-DD') : null);
    } else {
      onBlur(null);
    }
  }

  handleSelect = (val: any, e: any) => {
    const {input: {onChange}} = this.props;

    if((e && e.target.value)) {
      const date = moment(e.target.value, ['YYYY-MM-DD', 'DD.MM.YYYY', 'DDMMYYYY']);
      onChange(date.isValid() ? date.format('YYYY-MM-DD') : null);
    } else if (val) {
      const date = moment(val, ['YYYY-MM-DD', 'DD.MM.YYYY', 'DDMMYYYY']);
      onChange(date.isValid() ? date.format('YYYY-MM-DD') : null);
    } else {
      onChange(null);
    }
  }

  render(){
    const {
      disabled = false,
      displayError = false,
      input,
      input: {value},
      isDirty = false,
      placeholder,
    } = this.props;

    return (
      <div className={classNames('form-field__datepicker', {'has-error': displayError}, {'is-dirty': isDirty})}>
        <DatePicker
          {...input}
          disabled={disabled}
          disabledKeyboardNavigation
          locale='fi'
          onBlur={this.handleBlur}
          onSelect={this.handleSelect}
          placeholder={placeholder}
          selected={value ? moment(value, ['YYYY-MM-DD', 'DD.MM.YYYY', 'DDMMYYYY']) : null}
        />
      </div>
    );
  }
}

export default FieldTypeDatePicker;
