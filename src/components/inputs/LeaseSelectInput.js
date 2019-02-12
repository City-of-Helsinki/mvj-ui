// @flow
import React, {Component} from 'react';
// $FlowFixMe
import {Async} from 'react-select';
import debounce from 'lodash/debounce';

import DropdownIndicator from '$components/inputs/DropdownIndicator';
import LoadingIndicator from '$components/inputs/SelectLoadingIndicator';
import {getContentLeaseIdentifier} from '$src/leases/helpers';
import {fetchLeases} from '$src/leases/requestsAsync';

type Props = {
  disabled?: boolean,
  name: string,
  onChange: Function,
  placeholder?: string,
  relatedLeases: Array<Object>,
  value?: Object,
}

type State = {
  inputValue: string,
}

class LeaseSelectInput extends Component<Props, State> {
  select: any

  static defaultProps = {
    disabled: false,
    value: '',
  };

  state = {
    inputValue: '',
  }

  handleChange = (value: Object) => {
    const {onChange} = this.props;

    onChange(value);
  }

  handleInputChange = (value: string, meta: Object) => {
    const {action} = meta;

    switch (action) {
      case 'set-value':
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

  getOptions = (leases: Array<Object>): Array<Object> => {
    const {relatedLeases} = this.props;

    return leases
      .filter((lease) => relatedLeases.find((relatedLease) => lease.id === relatedLease.lease.id) ? false : true)
      .map((lease) => {
        return {
          value: lease.id,
          label: getContentLeaseIdentifier(lease),
        };
      });
  }

  getLeases = debounce(async(inputValue: string, callback: Function) => {
    const leases = await fetchLeases({
      succinct: true,
      identifier: inputValue,
    });

    callback(this.getOptions(leases));
  }, 500);

  loadOptions = (inputValue: string, callback: Function) => {
    this.getLeases(inputValue, callback);
  };

  render() {
    const {
      disabled,
      name,
      placeholder,
      value,
    } = this.props;

    return(
      <Async
        ref={(ref) => this.select = ref}
        className='select-input'
        classNamePrefix='select-input'
        components={{
          DropdownIndicator,
          IndicatorSeparator: null,
          LoadingIndicator,
        }}
        disabled={disabled}
        id={name}
        loadingMessage={() => 'Ladataan...'}
        loadOptions={this.loadOptions}
        noOptionsMessage={() => 'Ei tuloksia'}
        onChange={this.handleChange}
        onInputChange={this.handleInputChange}
        onMenuOpen={this.handleMenuOpen}
        options={[]}
        placeholder={placeholder || 'Valitse...'}
        value={value}
      />
    );
  }
}

export default LeaseSelectInput;
