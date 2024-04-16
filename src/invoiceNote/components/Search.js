// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {getFormValues, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';

import FormField from '$components/form/FormField';
import SearchContainer from '$components/search/SearchContainer';
import {FieldTypes, FormNames} from '$src/enums';
import {fetchServiceUnits} from '$src/serviceUnits/actions';
import {getServiceUnits, getIsFetching as getIsFetchingServiceUnits} from '$src/serviceUnits/selectors';

import type {ServiceUnits} from '$src/serviceUnits/types';

type Props = {
  formValues: Object,
  fetchServiceUnits: Function,
  handleSubmit: Function,
  isFetchingServiceUnits: boolean,
  isSearchInitialized: boolean,
  onSearch: Function,
  serviceUnits: ServiceUnits,
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

  onSearchChange = () => {
    if(!this._isMounted) return;

    this.search();
  };

  search = () => {
    const {formValues, onSearch} = this.props;
    const newValues = {...formValues};

    onSearch(newValues, true);
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
          </Column>
        </Row>
      </SearchContainer>
    );
  }
}


const formName = FormNames.INVOICE_NOTE_SEARCH;

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
