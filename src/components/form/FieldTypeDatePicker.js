// @flow
import React, {Component} from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import classNames from 'classnames';

type Props = {
  className?: string,
  disableDirty: boolean,
  disableTouched: boolean,
  input: Object,
  label: string,
  labelClassName?: string,
  meta: Object,
  placeholder: string,
}

class FieldTypeDatePicker extends Component {
  props: Props

  handleBlur = (e: any) => {
    const {input: {onBlur}} = this.props;

    if(e) {
      onBlur(moment(e.target.value, ['YYYY-MM-DD', 'DD.MM.YYYY', 'DDMMYYYY']).format('YYYY-MM-DD'));
    } else {
      onBlur(null);
    }
  }

  handleSelect = (val: any, e: any) => {
    const {input: {onChange}} = this.props;

    if(e) {
      onChange(moment(e.target.value, ['YYYY-MM-DD', 'DD.MM.YYYY', 'DDMMYYYY']).format('YYYY-MM-DD'));
    } else {
      onChange(null);
    }
  }

  render(){
    const {
      className,
      disableDirty = false,
      disableTouched = false,
      input,
      input: {value},
      label,
      labelClassName,
      meta: {dirty, error, touched},
      placeholder,
    } = this.props;

    return (
      <div className={classNames('mvj-form-field', className)}>
        {label &&
          <label className={classNames('mvj-form-field-label', labelClassName)}>{label}</label>
        }
        <div className={classNames(
          'mvj-form-field-component',
          'mvj-form-field__datepicker',
          {'is-dirty': (!disableDirty && dirty)})}>
          <DatePicker
            {...input}
            disabledKeyboardNavigation
            locale='fi'
            onBlur={this.handleBlur}
            onSelect={this.handleSelect}
            placeholder={placeholder}
            selected={value ? moment(value, ['YYYY-MM-DD', 'DD.MM.YYYY', 'DDMMYYYY']) : null}
          />
          {(touched || disableTouched) && error && <span className={'error'}>{error}</span>}
        </div>
      </div>
    );
  }
}

export default FieldTypeDatePicker;
