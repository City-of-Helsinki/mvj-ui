// @flow
import React, {Component} from 'react';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import {clearFields, formValueSelector, getFormValues, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import debounce from 'lodash/debounce';
import flowRight from 'lodash/flowRight';

import FormField from '$components/form/FormField';
import {fetchDistrictsByMunicipality} from '$src/district/actions';
import {FormNames, LeaseFieldPaths, LeaseTenantContactSetFieldPaths} from '$src/leases/enums';
import {getDistrictOptions} from '$src/district/helpers';
import {getFieldOptions} from '$util/helpers';
import {getDistrictsByMunicipality} from '$src/district/selectors';
import {getAttributes as getLeaseAttributes, getIsFetchingAttributes} from '$src/leases/selectors';

import type {Attributes} from '$src/types';

type Props = {
  anyTouched: boolean,
  basicSearchByDefault: boolean,
  change: Function,
  clearFields: Function,
  districts: Array<Object>,
  fetchDistrictsByMunicipality: Function,
  formValues: Object,
  initialize: Function,
  isFetchingAttributes: boolean,
  isSearchInitialized: boolean,
  leaseAttributes: Attributes,
  location: Object,
  municipality: string,
  onSearch: Function,
  router: Object,
  states: Array<Object>,
}

type State = {
  isBasicSearch: boolean,
  leaseAttributes: Attributes,
  municipalityOptions: Array<Object>,
  tenantTypeOptions: Array<Object>,
  typeOptions: Array<Object>,
}

class Search extends Component<Props, State> {
  _isMounted: boolean;

  state = {
    isBasicSearch: true,
    leaseAttributes: {},
    municipalityOptions: [],
    tenantTypeOptions: [],
    typeOptions: [],
  }

  componentDidMount() {
    const {basicSearchByDefault} = this.props;
    this._isMounted = true;

    this.setState({isBasicSearch: basicSearchByDefault});
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState = {};

    if(props.leaseAttributes !== state.leaseAttributes) {
      newState.leaseAttributes = props.leaseAttributes;
      newState.municipalityOptions = getFieldOptions(props.leaseAttributes, LeaseFieldPaths.MUNICIPALITY);
      newState.tenantTypeOptions = getFieldOptions(props.leaseAttributes, LeaseTenantContactSetFieldPaths.TYPE, false);
      newState.typeOptions = getFieldOptions(props.leaseAttributes, LeaseFieldPaths.TYPE);
    }

    return newState;
  }

  componentDidUpdate(prevProps: Props) {
    const {clearFields, fetchDistrictsByMunicipality, isSearchInitialized} = this.props;

    if(Number(prevProps.municipality) !== Number(this.props.municipality)) {
      if(this.props.municipality) {
        fetchDistrictsByMunicipality(this.props.municipality);
      }
      if(this.props.anyTouched) {
        clearFields(false, false, 'search_district');
      }
    }

    if(isSearchInitialized && JSON.stringify(prevProps.formValues) !== JSON.stringify(this.props.formValues)) {
      this.onSearchChange();
    }
  }

  onSearchChange = debounce(() => {
    if(!this._isMounted) return;

    const {formValues, onSearch, states} = this.props;
    const newValues = {...formValues, lease_state: states.length ? states : undefined};

    onSearch(newValues);
  }, 500);

  toggleSearchType = () => {
    const {formValues, initialize, onSearch, states} = this.props;
    const isBasicSearch = this.state.isBasicSearch ? true : false;

    this.setState({isBasicSearch: !isBasicSearch});

    if(!isBasicSearch) {
      const newFormValues = {
        identifier: formValues.identifier ? formValues.identifier : undefined,
        lease_state: states.length ? states : undefined,
      };

      onSearch(newFormValues);
      initialize(newFormValues);
    }
  }

  handleLinkKeyDown = (e: any) => {
    if(e.keyCode === 13){
      e.preventDefault();
      this.toggleSearchType();
    }
  }

  handleClear = () => {
    const {onSearch} = this.props;

    onSearch({});
  }

  handleClearKeyDown = (e: any) => {
    if(e.keyCode === 13){
      e.preventDefault();
      this.handleClear();
    }
  }

  render () {
    const {
      districts,
      isFetchingAttributes,
    } = this.props;
    const {
      isBasicSearch,
      municipalityOptions,
      tenantTypeOptions,
      typeOptions,
    } = this.state;
    const districtOptions = getDistrictOptions(districts);


    return (
      <div className='lease-search'>
        <Row>
          <Column large={12}>
            <FormField
              autoBlur
              disableDirty
              fieldAttributes={{
                label: 'Hae hakusanalla',
                type: 'search',
                read_only: false,
              }}
              invisibleLabel
              name='identifier'
            />
          </Column>
        </Row>
        {!isBasicSearch && (
          <div>
            <div className='lease-search__row'>
              <div className='lease-search__label-column'>
                <span className='lease-search__label'>Vuokralainen</span>
              </div>
              <div className='lease-search__input-column'>
                <FormField
                  autoBlur
                  disableDirty
                  fieldAttributes={{
                    label: 'Vuokralainen',
                    type: 'string',
                    read_only: false,
                  }}
                  invisibleLabel
                  name='tenant_name'
                />
              </div>
            </div>

            <div className='lease-search__row'>
              <div className='lease-search__label-column'>
                <span className='lease-search__label'>Rooli</span>
              </div>
              <div className='lease-search__input-column'>
                <Row>
                  <Column small={12} medium={6}>
                    <FormField
                      autoBlur
                      disableDirty
                      fieldAttributes={{
                        label: '',
                        type: 'multiselect',
                        read_only: false,
                      }}
                      invisibleLabel
                      isLoading={isFetchingAttributes}
                      name='tenantcontact_type'
                      overrideValues={{
                        options: tenantTypeOptions,
                      }}
                    />
                  </Column>
                  <Column small={12} medium={6}>
                    <FormField
                      autoBlur
                      disableDirty
                      fieldAttributes={{
                        label: 'Vain entiset asiakkaat',
                        type: 'checkbox',
                        read_only: false,
                      }}
                      invisibleLabel
                      name='only_past_tenants'
                      overrideValues={{
                        options: [{value: true, label: 'Vain entiset asiakkaat'}],
                      }}
                    />
                  </Column>
                </Row>
              </div>
            </div>

            <div className='lease-search__row'>
              <div className='lease-search__label-column'>
                <span className='lease-search__label'>Vuokratunnus</span>
              </div>
              <div className='lease-search__input-column'>
                <Row>
                  <Column small={3}>
                    <FormField
                      autoBlur
                      disableDirty
                      fieldAttributes={{
                        label: 'Tyyppi',
                        type: 'choice',
                        read_only: false,
                      }}
                      invisibleLabel
                      name='lease_type'
                      overrideValues={{options: typeOptions}}
                    />
                  </Column>
                  <Column small={3}>
                    <FormField
                      autoBlur
                      disableDirty
                      fieldAttributes={{
                        label: 'Kunta',
                        type: 'choice',
                        read_only: false,
                      }}
                      invisibleLabel
                      name='municipality'
                      overrideValues={{options: municipalityOptions}}
                    />
                  </Column>
                  <Column small={3}>
                    <FormField
                      autoBlur
                      disableDirty
                      fieldAttributes={{
                        label: 'Kaupunginosa',
                        type: 'choice',
                        read_only: false,
                      }}
                      invisibleLabel
                      name='district'
                      overrideValues={{options: districtOptions}}
                    />
                  </Column>
                  <Column small={3}>
                    <FormField
                      autoBlur
                      disableDirty
                      fieldAttributes={{
                        label: 'Juokseva numero',
                        type: 'string',
                        read_only: false,
                      }}
                      invisibleLabel
                      name='sequence'
                    />
                  </Column>
                </Row>
              </div>
            </div>

            <div className='lease-search__row'>
              <div className='lease-search__label-column'>
                <span className='lease-search__label'>Alkupvm</span>
              </div>
              <div className='lease-search__input-column'>
                <Row>
                  <Column small={6}>
                    <FormField
                      disableDirty
                      fieldAttributes={{
                        label: 'Vuokrauksen alkupvm alkaen',
                        type: 'date',
                        read_only: false,
                      }}
                      invisibleLabel
                      name='lease_start_date_start'
                    />
                  </Column>
                  <Column small={6}>
                    <FormField
                      className='with-dash'
                      disableDirty
                      fieldAttributes={{
                        label: 'Vuokrauksen alkupvm loppuen',
                        type: 'date',
                        read_only: false,
                      }}
                      invisibleLabel
                      name='lease_start_date_end'
                    />
                  </Column>
                </Row>
              </div>
            </div>

            <div className='lease-search__row'>
              <div className='lease-search__label-column'>
                <span className='lease-search__label'>Loppupvm</span>
              </div>
              <div className='lease-search__input-column'>
                <Row>
                  <Column small={6}>
                    <FormField
                      disableDirty
                      fieldAttributes={{
                        label: 'Vuokrauksen loppupvm alkaen',
                        type: 'date',
                        read_only: false,
                      }}
                      invisibleLabel
                      name='lease_end_date_start'
                    />
                  </Column>
                  <Column small={6}>
                    <FormField
                      className='with-dash'
                      disableDirty
                      fieldAttributes={{
                        label: 'Vuokrauksen loppupvm loppuen',
                        type: 'date',
                        read_only: false,
                      }}
                      invisibleLabel
                      name='lease_end_date_end'
                    />
                  </Column>
                </Row>
              </div>
            </div>

            <div className='lease-search__row'>
              <div className='lease-search__label-column'>
                <span className='lease-search__label'></span>
              </div>
              <div className='lease-search__input-column'>
                <Row>
                  <Column small={6}>
                    <FormField
                      autoBlur
                      disableDirty
                      fieldAttributes={{
                        label: 'Voimassa',
                        type: 'checkbox',
                        read_only: false,
                      }}
                      invisibleLabel
                      name='only_active_leases'
                      overrideValues={{
                        options: [{value: true, label: 'Voimassa'}],
                      }}
                    />
                  </Column>
                  <Column small={6}>
                    <FormField
                      autoBlur
                      disableDirty
                      fieldAttributes={{
                        label: 'Päättyneet',
                        type: 'checkbox',
                        read_only: false,
                      }}
                      invisibleLabel
                      name='only_expired_leases'
                      overrideValues={{
                        options: [{value: true, label: 'Päättyneet'}],
                      }}
                    />
                  </Column>
                </Row>
              </div>
            </div>

            <div className='lease-search__row'>
              <div className='lease-search__label-column'>
                <span className='lease-search__label'>Kohteen tunnus</span>
              </div>
              <div className='lease-search__input-column'>
                <FormField
                  autoBlur
                  disableDirty
                  fieldAttributes={{
                    label: 'Kohteen tunnus',
                    type: 'string',
                    read_only: false,
                  }}
                  invisibleLabel
                  name='property_identifier'
                />
              </div>
            </div>

            <div className='lease-search__row'>
              <div className='lease-search__label-column'>
                <span className='lease-search__label'>Vuokrakohteen osoite</span>
              </div>
              <div className='lease-search__input-column'>
                <FormField
                  autoBlur
                  disableDirty
                  fieldAttributes={{
                    label: 'Vuokrakohteen osoite',
                    type: 'string',
                    read_only: false,
                  }}
                  invisibleLabel
                  name='address'
                />
              </div>
            </div>
          </div>
        )}
        <Row>
          <Column small={6}>
            <a
              tabIndex={0}
              onKeyDown={this.handleLinkKeyDown}
              onClick={this.toggleSearchType}
              className='lease-search__search-type-link'
            >{isBasicSearch ? 'Tarkennettu haku' : 'Yksinkertainen haku'}</a>
          </Column>
          <Column small={6}>
            <a
              tabIndex={0}
              onKeyDown={this.handleClearKeyDown}
              onClick={this.handleClear}
              className='lease-search__clear-link'
            >Tyhjennä haku</a>
          </Column>
        </Row>
      </div>
    );
  }
}

const formName = FormNames.SEARCH;
const selector = formValueSelector(formName);

export default flowRight(
  connect(
    state => {
      const municipality = selector(state, 'municipality');

      return {
        districts: getDistrictsByMunicipality(state, municipality),
        formValues: getFormValues(formName)(state),
        isFetchingAttributes: getIsFetchingAttributes(state),
        leaseAttributes: getLeaseAttributes(state),
        municipality: municipality,
      };
    },
    {
      clearFields,
      fetchDistrictsByMunicipality,
    }
  ),
  reduxForm({
    form: formName,
  }),
  withRouter,
)(Search);
