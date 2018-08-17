import React, {Component} from 'react';
import {connect} from 'react-redux';
import Select from 'react-select';
import fetch from 'isomorphic-fetch';
import debounce from 'lodash/debounce';
import forEach from 'lodash/forEach';

import createUrl from '$src/api/createUrl';
import {getContentLeaseIdentifier} from '$src/leases/helpers';
import {getApiToken} from '$src/auth/selectors';

const arrowRenderer = () => <i className='select-input__arrow-renderer'/>;

type Props = {
  apiToken: string,
  creatable?: boolean,
  disabled?: boolean,
  onChange: Function,
  placeholder?: string,
  relatedLeases: Array<Object>,
  value?: Object,
}

class LeaseSelectInput extends Component<Props> {
  static defaultProps = {
    creatable: false,
    disabled: false,
    value: '',
  };

  handleChange = (value: Object) => {
    const {onChange} = this.props;
    onChange(value);
  }

  getOptions = (json: Object) => {
    const {relatedLeases} = this.props;
    return json.filter((lease) => {
      let isNew = true;
      forEach(relatedLeases, (relatedLease) => {
        if(lease.id === relatedLease.lease.id) {
          isNew = false;
          return false;
        }
      });
      return isNew;
    }).map((lease) => {
      return {
        value: lease.id,
        label: getContentLeaseIdentifier(lease),
      };
    });
  }

  getLeases = debounce((input, callback) => {
    const {apiToken} = this.props;
    if (!apiToken || !input) {return Promise.resolve({options: []});}

    const request = new Request(createUrl(`lease/?succinct=true&identifier=${input ? input.toUpperCase() : ''}`));
    request.headers.set('Authorization', `Bearer ${apiToken}`);

    fetch(request)
      .then((response) => response.json())
      .then((json) => {
        callback(null, {
          options: this.getOptions(json.results),
          complete: true,
        });
      });
  }, 500);

  handleFilterOptions = (options: Array<Object>) => options;

  render() {
    const {creatable, disabled, placeholder, value} = this.props;
    const AsyncComponent = creatable
      ? Select.AsyncCreatable
      : Select.Async;

    return(
      <AsyncComponent
        arrowRenderer={arrowRenderer}
        autoload={false}
        backspaceRemoves={false}
        className='form-field__select'
        clearable={false}
        disabled={disabled}
        filterOptions={this.handleFilterOptions}
        loadingPlaceholder='Ladataan...'
        loadOptions={this.getLeases}
        multi={false}
        noResultsText={'Ei tuloksia'}
        onChange={this.handleChange}
        placeholder={placeholder || 'Valitse...'}
        searchPromptText='Hae vuokratunnuksella...'
        value={value}
      />
    );
  }
}

export default connect(
  (state) => {
    return {
      apiToken: getApiToken(state),
    };
  }
)(LeaseSelectInput);
