// @flow
import React, {Component} from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import classnames from 'classnames';

import 'react-datepicker/dist/react-datepicker.css';

type Props = {
  className?: string,
  disableTouched: boolean,
  input: Object,
  label: string,
  labelClassName?: string,
  meta: Object,
  placeholder: string,
}

class FieldTypeDatePicker extends Component {
  props: Props

  handleChange = (e: any) => {
    const {input: {onBlur}} = this.props;
    const {target: {value}} = e;
    if(value) {
      onBlur(moment(value, ['YYYY-MM-DD', 'DD.MM.YYYY', 'DDMMYYYY']).format('YYYY-MM-DD'));
    }
  }

  render(){
    const {
      className,
      disableTouched = false,
      input,
      input: {value},
      label,
      labelClassName,
      meta: {dirty, error, touched},
      placeholder} = this.props;

    return (
      <div className='mvj-form-field'>
        {label && <label className={classnames('mvj-form-field-label', labelClassName)}>{label}</label>}
        <div className={classnames('mvj-form-field__datepicker', className, {'is-dirty': dirty})}>
          <DatePicker
            {...input}
            placeholder={placeholder}
            // dateFormat="YYYY-MM-DD"
            disabledKeyboardNavigation
            locale='fi'
            selected={value ? moment(value, ['YYYY-MM-DD', 'DD.MM.YYYY', 'DDMMYYYY']) : null}
            onBlur={this.handleChange}
          />
          {(touched || disableTouched) && error && <span className={'error'}>{error}</span>}
        </div>
      </div>
    );
  }
}

export default FieldTypeDatePicker;
