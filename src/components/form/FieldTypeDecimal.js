// @flow
import React, {PureComponent} from 'react';
import classNames from 'classnames';
import {formatNumber} from '$util/helpers';
import {convertStrToDecimalNumber, isDecimalNumberStr} from '$util/helpers';

type Props = {
  autoBlur: boolean,
  autoComplete?: string,
  className: string,
  disabled: boolean,
  displayError: boolean,
  input: Object,
  isDirty: boolean,
  placeholder: string,
  setRefForField: Function,
}

type State = {
  innerValue: ?string,
}

class FieldTypeDecimal extends PureComponent<Props, State> {
  state = {
    innerValue: '',
  }

  formatDecimalNumber = (val: string) => {
    if(isDecimalNumberStr(val)) {
      return formatNumber(convertStrToDecimalNumber(val));
    } else {
      return val;
    }
  }

  componentDidMount() {
    const {input: {value}} = this.props;

    this.setState({innerValue: this.formatDecimalNumber(value)});
  }

  handleBlur = (e: any) => {
    const {input: {onBlur}} = this.props;
    const formatedNumber = this.formatDecimalNumber(e.target.value);
    onBlur(formatedNumber);
    this.setState({innerValue: formatedNumber});
  }

  handleChange = (e: any) => {
    const {autoBlur, input: {onChange}} = this.props;

    if(autoBlur) {
      this.handleBlur(e);
    } else {
      onChange(e.target.value);
      this.setState({innerValue: e.target.value});
    }
  };

  handleSetRefForField = (element: any) => {
    const {setRefForField} = this.props;

    if(setRefForField) {
      setRefForField(element);
    }
  };

  render() {
    const {autoComplete, disabled, displayError, input, isDirty, placeholder} = this.props;
    const {innerValue} = this.state;

    return (
      <input className={classNames('form-field__input', {'has-error': displayError}, {'is-dirty': isDirty})}
        ref={this.handleSetRefForField}
        id={input.name}
        autoComplete={autoComplete}
        disabled={disabled}
        placeholder={placeholder}
        type='text'
        {...input}
        onBlur={this.handleBlur}
        onChange={this.handleChange}
        value={innerValue}
      />
    );
  }
}

export default FieldTypeDecimal;
