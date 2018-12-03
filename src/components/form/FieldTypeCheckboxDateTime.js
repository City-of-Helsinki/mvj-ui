// @flow
import React, {PureComponent} from 'react';
import classNames from 'classnames';

type Props = {
  disabled: boolean,
  displayError: boolean,
  input: Object,
  isDirty: boolean,
  label: string,
}

type State = {
  defaultValue: ?string,
}

class FieldTypeCheckboxDateTime extends PureComponent<Props, State> {
  state = {
    defaultValue: this.props.input.value,
  }

  handleChange = () => {
    const {input: {onBlur, value}} = this.props;
    const {defaultValue} = this.state;

    onBlur(value
      ? null
      : (defaultValue ? defaultValue : new Date().toISOString()));

  }

  render() {
    const {
      disabled = false,
      displayError = false,
      input,
      input: {name, value},
      isDirty = false,
      label,
    } = this.props;

    return (
      <label
        className={classNames(
          'form-field__checkbox-date-time',
          {'has-error': displayError},
          {'is-dirty': isDirty})
        }
      >
        <input
          type='checkbox'
          checked={value}
          disabled={disabled}
          name={name}
          onChange={this.handleChange}
          value={value}
        />
        <span>{label}</span>
      </label>
    );
  }
}

export default FieldTypeCheckboxDateTime;
