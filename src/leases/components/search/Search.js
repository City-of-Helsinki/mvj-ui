// @flow
import React, {Component} from 'react';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import {clearFields, formValueSelector, getFormValues, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import debounce from 'lodash/debounce';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';

import FormField from '$components/form/FormField';
import {fetchDistrictsByMunicipality} from '$src/district/actions';
import {FieldTypes} from '$components/enums';
import {
  FormNames,
  LeaseDecisionsFieldPaths,
  LeaseFieldPaths,
  LeaseTenantContactSetFieldPaths,
} from '$src/leases/enums';
import {getContactOptions} from '$src/contacts/helpers';
import {getDistrictOptions} from '$src/district/helpers';
import {addEmptyOption, getFieldOptions, getUrlParams} from '$util/helpers';
import {getDistrictsByMunicipality} from '$src/district/selectors';
import {getAttributes as getLeaseAttributes, getIsFetchingAttributes} from '$src/leases/selectors';
import {getLessorList} from '$src/lessor/selectors';

import type {Attributes} from '$src/types';
import type {LessorList} from '$src/lessor/types';

type Props = {
  anyTouched: boolean,
  change: Function,
  clearFields: Function,
  districts: Array<Object>,
  fetchDistrictsByMunicipality: Function,
  formValues: Object,
  initialize: Function,
  isFetchingAttributes: boolean,
  isSearchInitialized: boolean,
  leaseAttributes: Attributes,
  lessors: LessorList,
  location: Object,
  municipality: string,
  onSearch: Function,
  router: Object,
  states: Array<Object>,
}

type State = {
  decisionMakerOptions: Array<Object>,
  isBasicSearch: boolean,
  leaseAttributes: Attributes,
  lessors: LessorList,
  lessorOptions: Array<Object>,
  municipalityOptions: Array<Object>,
  tenantTypeOptions: Array<Object>,
  typeOptions: Array<Object>,
}

class Search extends Component<Props, State> {
  _isMounted: boolean;

  state = {
    decisionMakerOptions: [],
    isBasicSearch: true,
    leaseAttributes: {},
    lessors: [],
    lessorOptions: [],
    municipalityOptions: [],
    tenantTypeOptions: [],
    typeOptions: [],
  }

  componentDidMount() {
    this._isMounted = true;

    this.setState({isBasicSearch: this.isSearchBasicMode()});
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState = {};

    if(props.leaseAttributes !== state.leaseAttributes) {
      newState.leaseAttributes = props.leaseAttributes;
      newState.decisionMakerOptions = getFieldOptions(props.leaseAttributes, LeaseDecisionsFieldPaths.DECISION_MAKER);
      newState.municipalityOptions = getFieldOptions(props.leaseAttributes, LeaseFieldPaths.MUNICIPALITY);
      newState.tenantTypeOptions = getFieldOptions(props.leaseAttributes, LeaseTenantContactSetFieldPaths.TYPE, false);
      newState.typeOptions = getFieldOptions(props.leaseAttributes, LeaseFieldPaths.TYPE);
    }

    if(props.lessors !== state.lessors) {
      newState.lessors = props.lessors;
      newState.lessorOptions = addEmptyOption(getContactOptions(props.lessors));
    }

    return !isEmpty(newState) ? newState : null;
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

    if(isSearchInitialized && !isEqual(prevProps.formValues, this.props.formValues)) {
      this.onSearchChange();
    }
  }

  isSearchBasicMode = () => {
    const {location: {search}} = this.props;
    const searchQuery = getUrlParams(search);

    delete searchQuery.page;

    if(!Object.keys(searchQuery).length ||
      Object.keys(searchQuery).length === 1 && (searchQuery.identifier || searchQuery.lease_state) ||
      Object.keys(searchQuery).length === 2 && (searchQuery.identifier && searchQuery.lease_state)) {
      return true;
    }

    return false;
  }

  onSearchChange = debounce(() => {
    if(!this._isMounted) return;

    const {formValues, onSearch, states} = this.props;
    const newValues = {...formValues};

    if(states.length) {
      newValues.lease_state = states;
    }

    onSearch(newValues);
  }, 500);

  toggleSearchType = () => {
    const {formValues, initialize, onSearch, states} = this.props;
    const isBasicSearch = this.state.isBasicSearch ? true : false;

    this.setState({isBasicSearch: !isBasicSearch});

    if(!isBasicSearch) {
      const newFormValues = {};

      if(formValues.identifier) {
        newFormValues.identifier = formValues.identifier;
      }

      if(states.length) {
        newFormValues.lease_state = states;
      }

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
      decisionMakerOptions,
      isBasicSearch,
      lessorOptions,
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
                type: FieldTypes.SEARCH,
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
                    type: FieldTypes.STRING,
                    read_only: false,
                  }}
                  invisibleLabel
                  name='tenant_name'
                />
              </div>
            </div>

            <div className='lease-search__row'>
              <div className='lease-search__label-column'>
                <span className='lease-search__label'>Y-tunnus</span>
              </div>
              <div className='lease-search__input-column'>
                <FormField
                  autoBlur
                  disableDirty
                  fieldAttributes={{
                    label: 'Y-tunnus',
                    type: FieldTypes.STRING,
                    read_only: false,
                  }}
                  invisibleLabel
                  name='business_id'
                />
              </div>
            </div>

            <div className='lease-search__row'>
              <div className='lease-search__label-column'>
                <span className='lease-search__label'>Henkilötunnus</span>
              </div>
              <div className='lease-search__input-column'>
                <FormField
                  autoBlur
                  disableDirty
                  fieldAttributes={{
                    label: 'Henkilötunnus',
                    type: FieldTypes.STRING,
                    read_only: false,
                  }}
                  invisibleLabel
                  name='national_identification_number'
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
                        type: FieldTypes.MULTISELECT,
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
                        type: FieldTypes.CHECKBOX,
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
                <span className='lease-search__label'>Vuokranantaja</span>
              </div>
              <div className='lease-search__input-column'>
                <FormField
                  autoBlur
                  disableDirty
                  fieldAttributes={{
                    label: 'Vuokranantaja',
                    type: FieldTypes.CHOICE,
                    read_only: false,
                  }}
                  invisibleLabel
                  name='lessor'
                  overrideValues={{
                    options: lessorOptions,
                  }}
                />
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
                        type: FieldTypes.CHOICE,
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
                        type: FieldTypes.CHOICE,
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
                        type: FieldTypes.CHOICE,
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
                        type: FieldTypes.STRING,
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
                        type: FieldTypes.DATE,
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
                        type: FieldTypes.DATE,
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
                        type: FieldTypes.DATE,
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
                        type: FieldTypes.DATE,
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
                        type: FieldTypes.CHECKBOX,
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
                        type: FieldTypes.CHECKBOX,
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
                <span className='lease-search__label'>Kiinteistötunnus</span>
              </div>
              <div className='lease-search__input-column'>
                <FormField
                  autoBlur
                  disableDirty
                  fieldAttributes={{
                    label: 'Kiinteistötunnus',
                    type: FieldTypes.STRING,
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
                    type: FieldTypes.STRING,
                    read_only: false,
                  }}
                  invisibleLabel
                  name='address'
                />
              </div>
            </div>

            <div className='lease-search__row'>
              <div className='lease-search__label-column'>
                <span className='lease-search__label'>Sopimusnro</span>
              </div>
              <div className='lease-search__input-column'>
                <FormField
                  autoBlur
                  disableDirty
                  fieldAttributes={{
                    label: 'Sopimusnro',
                    type: FieldTypes.STRING,
                    read_only: false,
                  }}
                  invisibleLabel
                  name='contract_number'
                />
              </div>
            </div>

            <div className='lease-search__row'>
              <div className='lease-search__label-column'>
                <span className='lease-search__label'>Päätös</span>
              </div>
              <div className='lease-search__input-column'>
                <Row>
                  <Column small={6}>
                    <FormField
                      autoBlur
                      disableDirty
                      fieldAttributes={{
                        label: 'Päätöksen tekijä',
                        type: FieldTypes.CHOICE,
                        read_only: false,
                      }}
                      invisibleLabel
                      name='decision_maker'
                      overrideValues={{options: decisionMakerOptions}}
                    />
                  </Column>
                  <Column small={3}>
                    <FormField
                      disableDirty
                      fieldAttributes={{
                        label: 'Päätöspvm',
                        type: FieldTypes.DATE,
                        read_only: false,
                      }}
                      invisibleLabel
                      name='decision_date'
                    />
                  </Column>
                  <Column small={3}>
                    <FormField
                      disableDirty
                      fieldAttributes={{
                        label: 'Pykälä',
                        type: FieldTypes.STRING,
                        read_only: false,
                      }}
                      invisibleLabel
                      unit='§'
                      name='decision_section'
                    />
                  </Column>
                </Row>
              </div>
            </div>
            <div className='lease-search__row'>
              <div className='lease-search__label-column'>
                <span className='lease-search__label'>Diaarinro</span>
              </div>
              <div className='lease-search__input-column'>
                <FormField
                  autoBlur
                  disableDirty
                  fieldAttributes={{
                    label: 'Diaarinro',
                    type: FieldTypes.STRING,
                    read_only: false,
                  }}
                  invisibleLabel
                  name='reference_number'
                />
              </div>
            </div>

            <div className='lease-search__row'>
              <div className='lease-search__label-column'>
                <span className='lease-search__label'>Laskunro</span>
              </div>
              <div className='lease-search__input-column'>
                <FormField
                  autoBlur
                  disableDirty
                  fieldAttributes={{
                    label: 'Laskunro',
                    type: FieldTypes.STRING,
                    read_only: false,
                  }}
                  invisibleLabel
                  name='invoice_number'
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
  // $FlowFixMe
  withRouter,
  connect(
    state => {
      const municipality = selector(state, 'municipality');

      return {
        districts: getDistrictsByMunicipality(state, municipality),
        formValues: getFormValues(formName)(state),
        isFetchingAttributes: getIsFetchingAttributes(state),
        leaseAttributes: getLeaseAttributes(state),
        lessors: getLessorList(state),
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
)(Search);
