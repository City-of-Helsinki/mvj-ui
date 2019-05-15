// @flow
import React, {PureComponent} from 'react';
// $FlowFixMe
import Select from 'react-select';
import classNames from 'classnames';

import DropdownIndicator from '$components/inputs/DropdownIndicator';
import LoadingIndicator from '$components/inputs/SelectLoadingIndicator';

type Props = {
  autoBlur: boolean,
  disabled: boolean,
  displayError: boolean,
  filterOption?: Function,
  input: Object,
  isDirty: boolean,
  options: ?Array<any>,
  placeholder: String,
  setRefForField: Function,
}
type State = {
  inputValue: string,
}

class FieldTypeSelect extends PureComponent<Props, State> {
  select: any

  state = {
    inputValue: '',
  }

  handleBlur = () => {
    const {input: {onBlur, value}} = this.props;

    onBlur(value);
  };

  handleChange = (val: any) => {
    const {autoBlur, input: {onBlur, onChange}} = this.props;

    if(val) {
      const {value} = val;
      if(autoBlur) {
        onBlur(value);
      } else {
        onChange(value);
      }
    }
  };

  handleInputChange = (value: string, meta: Object) => {
    const {action} = meta;
    switch (action) {
      case 'input-change':
        this.setState({inputValue: value});
        break;
    }
  }

  handleMenuOpen = () => {
    const {inputValue} = this.state;

    if(this.select.state.inputValue !== inputValue) {
      this.select.select.onInputChange(inputValue, {action: 'input-change'});
    }
  }

  setRef = (element: any) => {
    const {setRefForField} = this.props;

    this.select = element;

    if(setRefForField && element) {
      setRefForField(element.select);
    }
  };

  render() {
    const {
      disabled,
      displayError,
      filterOption,
      input: {name, value},
      isDirty,
      options,
      placeholder,
    } = this.props;

    return (
      <div className={classNames(
        'form-field__select',
        {'has-error': displayError},
        {'is-dirty': isDirty})}
      >
        <Select
          ref={this.setRef}
          className='select-input'
          classNamePrefix='select-input'
          components={{
            DropdownIndicator,
            IndicatorSeparator: null,
            LoadingIndicator,
          }}
          isDisabled={disabled}
          filterOption={filterOption}
          id={name}
          onBlue={this.handleBlur}
          onChange={this.handleChange}
          noOptionsMessage={() => 'Ei tuloksia'}
          onInputChange={this.handleInputChange}
          onMenuOpen={this.handleMenuOpen}
          options={options}
          placeholder={placeholder || 'Valitse...'}
          value={options && options.find((option) => option.value == value)}
        />
      </div>
    );
  }
}

export default FieldTypeSelect;
