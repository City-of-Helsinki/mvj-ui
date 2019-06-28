// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {getFormValues, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import debounce from 'lodash/debounce';
import flowRight from 'lodash/flowRight';
import isEqual from 'lodash/isEqual';

import FormField from '$components/form/FormField';
import SearchClearLink from '$components/search/SearchClearLink';
import SearchContainer from '$components/search/SearchContainer';
import {FieldTypes, FormNames} from '$src/enums';

type Props = {
  formValues: Object,
  handleSubmit: Function,
  initialize: Function,
  isSearchInitialized: boolean,
  onSearch: Function,
  sortKey: ?string,
  sortOrder: ?string,
}

class Search extends PureComponent<Props> {
  _isMounted: boolean;

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidUpdate(prevProps: Object) {
    const {isSearchInitialized} = this.props;

    if(isSearchInitialized && !isEqual(prevProps.formValues, this.props.formValues)) {
      this.onSearchChange();
    }
  }

  onSearchChange = debounce(() => {
    if(!this._isMounted) return;

    this.search();
  }, 1000);

  search = () => {
    const {formValues, onSearch, sortKey, sortOrder} = this.props;
    const newValues = {...formValues};

    if(sortKey) {
      newValues.sort_key = sortKey;
      newValues.sort_order = sortOrder;
    }

    onSearch(newValues, true);
  }

  handleClear = () => {
    const {onSearch, sortKey, sortOrder} = this.props;
    const query = {};

    if(sortKey || sortOrder) {
      query.sort_key = sortKey;
      query.sort_order = sortOrder;
    }

    onSearch(query, true);
  }

  render () {
    const {handleSubmit} = this.props;

    return (
      <SearchContainer onSubmit={handleSubmit(this.search)}>
        <Row>
          <Column large={12}>
            <FormField
              disableDirty
              fieldAttributes={{
                label: 'Hae hakusanalla',
                type: FieldTypes.SEARCH,
                read_only: false,
              }}
              invisibleLabel
              name='search'
            />
          </Column>
        </Row>
        <Row>
          <Column small={12} medium={6}>
            <FormField
              autoBlur
              disableDirty
              fieldAttributes={{
                label: 'Näytä poistetut',
                type: FieldTypes.CHECKBOX,
                read_only: false,
              }}
              invisibleLabel
              name='with_deleted'
              overrideValues={{
                options: [{value: true, label: 'Näytä poistetut'}],
              }}
            />
          </Column>
        </Row>
        <Row>
          <Column small={12}>
            <SearchClearLink onClick={this.handleClear}>Tyhjennä haku</SearchClearLink>
          </Column>
        </Row>
      </SearchContainer>
    );
  }
}


const formName = FormNames.LEASEHOLD_TRANSFER_SEARCH;

export default flowRight(
  connect(
    state => {
      return {
        formValues: getFormValues(formName)(state),
      };
    },
  ),
  reduxForm({
    form: formName,
  }),
)(Search);
