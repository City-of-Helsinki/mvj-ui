import React, { PureComponent } from "react";
import classNames from "classnames";
type Props = {
  disabled: boolean;
  displayError: boolean;
  input: Record<string, any>;
  isDirty: boolean;
  label: string;
};
type State = {
  defaultValue: string | null | undefined;
};

class FieldTypeCheckboxDateTime extends PureComponent<Props, State> {
  state: State = {
    defaultValue: this.props.input.value
  };
  handleChange: () => void = () => {
    const {
      input: {
        onBlur,
        value
      }
    } = this.props;
    const {
      defaultValue
    } = this.state;
    onBlur(value ? null : defaultValue ? defaultValue : new Date().toISOString());
  };

  render(): React.ReactNode {
    const {
      disabled = false,
      displayError = false,
      input: {
        name,
        value
      },
      isDirty = false,
      label
    } = this.props;
    return <label className={classNames('form-field__checkbox-date-time', {
      'has-error': displayError
    }, {
      'is-dirty': isDirty
    })}>
        <input type='checkbox' checked={value} disabled={disabled} name={name} onChange={this.handleChange} value={value} />
        <span>{label}</span>
      </label>;
  }

}

export default FieldTypeCheckboxDateTime;