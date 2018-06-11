// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import Select from 'react-select';
import fetch from 'isomorphic-fetch';
import classNames from 'classnames';

import createUrl from '$src/api/createUrl';
import {getContentContact} from '$src/leases/helpers';
import {sortByLabelAsc} from '$util/helpers';
import {getApiToken} from '$src/auth/selectors';

const arrowRenderer = () => {
  return (
    <i className='select-input__arrow-renderer'/>
  );
};

type Props = {
  apiToken: string,
  creatable?: boolean,
  disabled?: boolean,
  displayError: boolean,
  input: Object,
  isDirty: boolean,
  onChange: Function,
  placeholder?: string,
  relatedLeases: Array<Object>,
}

class FieldTypeContactSelect extends Component<Props> {
  static defaultProps = {
    creatable: false,
    disabled: false,
    value: '',
  };

  handleBlur = () => {
    const {input: {onBlur, value}} = this.props;
    onBlur(value);
  };

  handleChange = (value: Object) => {
    const {input: {onChange}} = this.props;
    onChange(value);
  }

  getOptions = (json: Object) => {
    return json.map((contact) => {
      return getContentContact(contact);
    }).sort(sortByLabelAsc);
  }

  getLeases = (input) => {
    const {apiToken} = this.props;
    if (!apiToken) {
      return Promise.resolve({options: []});
    }

    const request = new Request(createUrl(`contact/?search=${input}`));
    request.headers.set('Authorization', `Bearer ${apiToken}`);

    return fetch(request)
      .then((response) => response.json())
      .then((json) => {
        return {
          options: this.getOptions(json.results),
          complete: true,
        };
      });
  };

  handleFilterOptions = (options: Array<Object>) => options;

  render() {
    const {
      creatable,
      disabled,
      displayError,
      input,
      input: {value},
      isDirty,
      placeholder,
    } = this.props;

    const AsyncComponent = creatable
      ? Select.AsyncCreatable
      : Select.Async;

    return(
      <AsyncComponent
        {...input}
        arrowRenderer={arrowRenderer}
        autoload={false}
        backspaceRemoves={false}
        className={classNames(
          'form-field__select',
          {'has-error': displayError},
          {'is-dirty': isDirty})
        }
        clearable={false}
        disabled={disabled}
        filterOptions={this.handleFilterOptions}
        loadingPlaceholder='Ladataan...'
        loadOptions={this.getLeases}
        multi={false}
        noResultsText={'Ei tuloksia'}
        onBlur={this.handleBlur}
        onChange={this.handleChange}
        placeholder={placeholder || 'Valitse...'}
        searchPromptText='Hae nimellä...'
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
)(FieldTypeContactSelect);
