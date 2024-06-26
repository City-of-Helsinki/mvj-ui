import React, { Component } from "react";
import Async from "react-select/async";
import classNames from "classnames";
import DropdownIndicator from "/src/components/inputs/DropdownIndicator";
import LoadingIndicator from "/src/components/inputs/SelectLoadingIndicator";
type Props = {
  disabled?: boolean;
  displayError: boolean;
  getOptions: (...args: Array<any>) => any;
  input: Record<string, any>;
  isLoading?: boolean;
  isDirty: boolean;
  placeholder?: string;
  setRef?: (...args: Array<any>) => any;
  initialValues?: Record<string, any>;
  cacheOptions?: any;
  multiSelect?: boolean;
  onChange?: (...args: Array<any>) => any;
  defaultOptions?: any;
};
type State = {
  inputValue: string;
  menuOpened: boolean;
};

class AsyncSelect extends Component<Props, State> {
  select: any;
  setSelectRef: (el: any) => void = el => {
    const {
      setRef
    } = this.props;
    this.select = el;

    if (setRef) {
      setRef(el);
    }
  };
  static defaultProps: {
    disabled: boolean;
    value: string;
  } = {
    disabled: false,
    value: ''
  };
  state: State = {
    inputValue: '',
    menuOpened: false
  };
  handleBlur: () => void = () => {
    const {
      input: {
        onBlur,
        value
      }
    } = this.props;

    if (onBlur) {
      onBlur(value);
    }
  };
  handleChange: (value: Record<string, any>) => void = value => {
    const {
      input: {
        onChange: inputOnChange
      },
      onChange
    } = this.props;
    inputOnChange(value);

    if (onChange) {
      onChange(value);
    }
  };
  handleInputChange: (value: string, meta: any) => void = (value, meta) => {
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
      inputValue,
      menuOpened
    } = this.state;

    if (!menuOpened) {
      this.setState({
        menuOpened: true
      }, () => {
        this.select.setState({
          isLoading: true
        });
        this.loadOptions('', options => {
          this.select.setState({
            defaultOptions: options,
            isLoading: false
          });
        });
      });
    } else {
      if (this.select.state.inputValue !== inputValue) {
        this.select.select.onInputChange(inputValue, {
          action: 'input-change'
        });
      }
    }
  };
  loadOptions: (inputValue: string, callback: (...args: Array<any>) => any) => void = (inputValue, callback) => {
    const {
      getOptions
    } = this.props;
    const {
      menuOpened
    } = this.state;

    if (menuOpened) {
      getOptions(inputValue, callback);
    } else {
      callback([]);
    }
  };

  render(): React.ReactNode {
    const {
      disabled,
      displayError,
      input: {
        name,
        value
      },
      isDirty,
      isLoading,
      placeholder,
      initialValues,
      cacheOptions = true,
      multiSelect
    } = this.props;
    return <div className={classNames('form-field__select', {
      'has-error': displayError
    }, {
      'is-dirty': isDirty
    })}>
        <Async ref={this.setSelectRef} cacheOptions={cacheOptions} className='select-input' classNamePrefix='select-input' components={{
        DropdownIndicator,
        IndicatorSeparator: null,
        LoadingIndicator
      }} defaultOptions id={name} isDisabled={disabled} isLoading={isLoading} isMulti={multiSelect} loadingMessage={() => 'Ladataan...'} loadOptions={this.loadOptions} noOptionsMessage={() => 'Ei tuloksia'} onBlur={this.handleBlur} onChange={this.handleChange} onInputChange={this.handleInputChange} onMenuOpen={this.handleMenuOpen} options={[]} placeholder={placeholder || 'Valitse...'} value={value} defaultInputValue={initialValues ? initialValues : ''} />
      </div>;
  }

}

export default AsyncSelect;