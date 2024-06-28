import React, { PureComponent } from "react";
import Select from "react-select";
import classNames from "classnames";
import DropdownIndicator from "/src/components/inputs/DropdownIndicator";
import LoadingIndicator from "/src/components/inputs/SelectLoadingIndicator";
type Props = {
  autoBlur: boolean;
  disabled: boolean;
  displayError: boolean;
  filterOption?: (...args: Array<any>) => any;
  input: Record<string, any>;
  isDirty: boolean;
  isLoading?: boolean;
  options: Array<any> | null | undefined;
  placeholder: String;
  setRefForField: (...args: Array<any>) => any;
};
type State = {
  inputValue: string;
};

class FieldTypeSelect extends PureComponent<Props, State> {
  select: any;
  state: State = {
    inputValue: ''
  };
  handleBlur: () => void = () => {
    const {
      input: {
        onBlur,
        value
      }
    } = this.props;
    onBlur(value);
  };
  handleChange: (val?: any) => void = (val: any) => {
    const {
      autoBlur,
      input: {
        onBlur,
        onChange
      }
    } = this.props;

    if (val) {
      const {
        value
      } = val;

      if (autoBlur) {
        onBlur(value);
      } else {
        onChange(value);
      }
    }
  };
  handleInputChange: (arg0: string, arg1: Record<string, any>) => void = (value, meta) => {
    const {
      action
    } = meta;

    switch (action) {
      case 'input-change':
        this.setState({
          inputValue: value
        });
        break;
    }
  };
  handleMenuOpen: () => void = () => {
    const {
      inputValue
    } = this.state;

    if (this.select.state.inputValue !== inputValue) {
      this.select.select.onInputChange(inputValue, {
        action: 'input-change'
      });
    }
  };
  setRef: (arg0: any) => void = element => {
    const {
      setRefForField
    } = this.props;
    this.select = element;

    if (setRefForField && element) {
      setRefForField(element.select);
    }
  };

  render(): React.ReactNode {
    const {
      disabled,
      displayError,
      filterOption,
      input: {
        name,
        value
      },
      isDirty,
      isLoading,
      options,
      placeholder
    } = this.props;
    return <div className={classNames('form-field__select', {
      'has-error': displayError
    }, {
      'is-dirty': isDirty
    })}>
        <Select ref={this.setRef} className='select-input' classNamePrefix='select-input' components={{
        DropdownIndicator,
        IndicatorSeparator: null,
        LoadingIndicator
      }} isDisabled={disabled} filterOption={filterOption} id={name} isLoading={isLoading} onBlur={this.handleBlur} onChange={this.handleChange} noOptionsMessage={() => 'Ei tuloksia'} onInputChange={this.handleInputChange} onMenuOpen={this.handleMenuOpen} options={options} placeholder={placeholder || 'Valitse...'} value={options && options.find(option => option.value == value) || ''} />
      </div>;
  }

}

export default FieldTypeSelect;