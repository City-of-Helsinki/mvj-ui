// @flow
import React, {Component} from 'react';
// $FlowFixMe
import Async from 'react-select/async';
import classNames from 'classnames';

import DropdownIndicator from '$components/inputs/DropdownIndicator';
import LoadingIndicator from '$components/inputs/SelectLoadingIndicator';

type Props = {
  disabled?: boolean,
  displayError: boolean,
  getOptions: Function,
  input: Object,
  isDirty: boolean,
  placeholder?: string,
  setRef?: Function,
}

type State = {
  inputValue: string,
  menuOpened: boolean,
}

class AsyncSelect extends Component<Props, State> {
  select: any

  setSelectRef = (el: any) => {
    const {setRef} = this.props;

    this.select = el;
    if(setRef) {
      setRef(el);
    }
  }

  static defaultProps = {
    disabled: false,
    value: '',
  };

  state = {
    inputValue: '',
    menuOpened: false,
  }

  handleBlur = () => {
    const {input: {onBlur, value}} = this.props;

    if(onBlur) {
      onBlur(value);
    }
  };

  handleChange = (value: Object) => {
    const {input: {onChange}} = this.props;

    onChange(value);
  }

  handleInputChange = (value: string, meta: Object) => {
    const {action} = meta;
    switch (action) {
      case 'input-change':
        this.setState({inputValue: value});
        break;
    }
  }

  handleMenuOpen = () => {
    const {inputValue, menuOpened} = this.state;

    if(!menuOpened) {
      this.setState({menuOpened: true}, () => {
        this.select.setState({isLoading: true});

        this.loadOptions('', (options) => {
          this.select.setState({
            defaultOptions: options,
            isLoading: false,
          });
        });
      });
    } else {
      if(this.select.state.inputValue !== inputValue) {
        this.select.select.onInputChange(inputValue, {action: 'input-change'});
      }
    }
  }

  loadOptions = (inputValue: string, callback: Function) => {
    const {getOptions} = this.props;
    const {menuOpened} = this.state;

    if(menuOpened) {
      getOptions(inputValue, callback);
    } else {
      callback([]);
    }
  };

  render() {
    const {
      disabled,
      displayError,
      input: {name, value},
      isDirty,
      placeholder,
    } = this.props;

    return(
      <div className={classNames(
        'form-field__select',
        {'has-error': displayError},
        {'is-dirty': isDirty})}
      >
        <Async
          ref={this.setSelectRef}
          cacheOptions
          className='select-input'
          classNamePrefix='select-input'
          components={{
            DropdownIndicator,
            IndicatorSeparator: null,
            LoadingIndicator,
          }}
          defaultOptions
          isDisabled={disabled}
          id={name}
          loadingMessage={() => 'Ladataan...'}
          loadOptions={this.loadOptions}
          noOptionsMessage={() => 'Ei tuloksia'}
          onBlur={this.handleBlur}
          onChange={this.handleChange}
          onInputChange={this.handleInputChange}
          onMenuOpen={this.handleMenuOpen}
          options={[]}
          placeholder={placeholder || 'Valitse...'}
          value={value}
        />
      </div>
    );
  }
}

export default AsyncSelect;
