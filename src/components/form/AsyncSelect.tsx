import React, { Component } from "react";
import Async from "react-select/async";
import classNames from "classnames";
import DropdownIndicator from "@/components/inputs/DropdownIndicator";
import LoadingIndicator from "@/components/inputs/SelectLoadingIndicator";
type Props = {
  disabled?: boolean;
  displayError: boolean;
  getOptions: (...args: Array<any>) => any;
  input: Record<string, any>;
  isLoading?: boolean;
  isDirty: boolean;
  placeholder?: string;
  setRef?: (...args: Array<any>) => any;
  cacheOptions?: any;
  multiSelect?: boolean;
  onChange?: (...args: Array<any>) => any;
  defaultOptions?: any;
};
type State = {
  inputValue: string;
  isLoading: boolean;
  options: Array<Record<string, any>>;
  menuOpened: boolean;
};

class AsyncSelect extends Component<Props, State> {
  select: any;
  setSelectRef: (el: any) => void = (el) => {
    const { setRef } = this.props;
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
    value: "",
  };
  state: State = {
    inputValue: "",
    menuOpened: false,
    isLoading: false,
    options: [],
  };
  handleBlur: () => void = () => {
    const {
      input: { onBlur, value },
    } = this.props;

    if (onBlur) {
      onBlur(value);
    }
  };
  handleChange: (value: Record<string, any>) => void = (value) => {
    const {
      input: { onChange: inputOnChange },
      onChange,
    } = this.props;
    inputOnChange(value);

    if (onChange) {
      onChange(value);
    }
  };
  handleInputChange: (value: string, meta: any) => void = (value, meta) => {
    const { action } = meta;

    switch (action) {
      case "input-change":
        this.setState({
          inputValue: value,
        });
        break;
    }
  };
  handleMenuOpen: () => void = () => {
    const { inputValue, menuOpened } = this.state;
    if (!menuOpened) {
      this.setState(
        {
          menuOpened: true,
          isLoading: true,
        },
        () => {
          this.loadOptions("", (options) => {
            this.setState({
              options: options,
              isLoading: false,
            });
          });
        },
      );
    } else {
      if (this.select.state.inputValue !== inputValue) {
        this.handleInputChange(inputValue, { action: "input-change" });
      }
    }
  };
  loadOptions: (
    inputValue: string,
    callback: (...args: Array<any>) => any,
  ) => void = (inputValue, callback) => {
    const { getOptions } = this.props;
    const { menuOpened } = this.state;

    if (menuOpened) {
      getOptions(inputValue, callback);
    } else {
      callback([]);
    }
  };

  render(): JSX.Element {
    const {
      disabled,
      displayError,
      input: { name, value },
      isDirty,
      placeholder,
      cacheOptions = true,
      multiSelect,
    } = this.props;
    const { isLoading, options } = this.state;
    return (
      <div
        className={classNames(
          "form-field__select",
          {
            "has-error": displayError,
          },
          {
            "is-dirty": isDirty,
          },
        )}
      >
        <Async
          ref={this.setSelectRef}
          cacheOptions={cacheOptions}
          className="select-input"
          classNamePrefix="select-input"
          components={{
            DropdownIndicator,
            IndicatorSeparator: null,
            LoadingIndicator,
          }}
          defaultOptions={options}
          id={name}
          isDisabled={disabled}
          isLoading={isLoading}
          isMulti={multiSelect === undefined ? false : multiSelect}
          loadingMessage={() => "Ladataan..."}
          loadOptions={this.loadOptions}
          noOptionsMessage={() => "Ei tuloksia"}
          onBlur={this.handleBlur}
          onChange={this.handleChange}
          onInputChange={this.handleInputChange}
          onMenuOpen={this.handleMenuOpen}
          placeholder={placeholder || "Valitse..."}
          defaultValue={value}
        />
      </div>
    );
  }
}

export default AsyncSelect;
