// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {getFormValues, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import debounce from 'lodash/debounce';
import flowRight from 'lodash/flowRight';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';

import FormField from '$components/form/FormField';
import SearchClearLink from '$components/search/SearchClearLink';
import SearchContainer from '$components/search/SearchContainer';
import {FieldTypes, FormNames} from '$src/enums';
import {fetchServiceUnits} from '$src/serviceUnits/actions';
import {getServiceUnits, getIsFetching as getIsFetchingServiceUnits} from '$src/serviceUnits/selectors';

import type {ServiceUnits} from '$src/serviceUnits/types';

type Props = {
  formValues: Object,
  fetchServiceUnits: Function,
  handleSubmit: Function,
  initialize: Function,
  isFetchingServiceUnits: boolean,
  isSearchInitialized: boolean,
  onSearch: Function,
  serviceUnits: ServiceUnits,
  sortKey: ?string,
  sortOrder: ?string,
  initialValues: Array,
}

class Search extends PureComponent<Props> {
  _isMounted: boolean;

  componentDidMount() {
    const {
      fetchServiceUnits,
      isFetchingServiceUnits,
      serviceUnits,
    } = this.props;

    if (!isFetchingServiceUnits && isEmpty(serviceUnits)) {
      fetchServiceUnits();
    }

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

  getServiceUnitOptions = (): Array<Object> => {
    const options = [{
      id: '',
      value: '',
      label: '',
    }];
    this.props.serviceUnits.map((serviceUnit) => {
      options.push({
        id: serviceUnit.id,
        value: serviceUnit.id,
        label: serviceUnit.name,
      });
    });
    return options;
  };

  render () {
    const {
      handleSubmit,
      serviceUnits,
    } = this.props;

    if (!serviceUnits.length) {
      return null;
    }

    return (
      <SearchContainer onSubmit={handleSubmit(this.search)}>
        <Row>
          <Column large={12}>
            <div className='inline-search-fields'>
              <FormField
                autoBlur
                disableDirty
                fieldAttributes={{
                  label: 'Palvelukokonaisuus',
                  type: FieldTypes.CHOICE,
                  read_only: false,
                }}
                name='service_unit'
                overrideValues={{
                  options: this.getServiceUnitOptions(),
                }}
                className='contact-search-dropdown'
              />
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
            </div>
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


const formName = FormNames.CONTACT_SEARCH;

export default flowRight(
  connect(
    state => {
      return {
        formValues: getFormValues(formName)(state),
        isFetchingServiceUnits: getIsFetchingServiceUnits(state),
        serviceUnits: getServiceUnits(state),
      };
    },
    {
      fetchServiceUnits,
    }
  ),
  reduxForm({
    form: formName,
  }),
)(Search);
