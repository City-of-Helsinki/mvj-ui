// @flow
import React, {Fragment, PureComponent} from 'react';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import {clearFields, formValueSelector, getFormValues, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import debounce from 'lodash/debounce';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';

import FormField from '$components/form/FormField';
import SearchChangeTypeLink from '$components/search/SearchChangeTypeLink';
import SearchClearLink from '$components/search/SearchClearLink';
import SearchContainer from '$components/search/SearchContainer';
import SearchInputColumn from '$components/search/SearchInputColumn';
import SearchLabel from '$components/search/SearchLabel';
import SearchLabelColumn from '$components/search/SearchLabelColumn';
import SearchRow from '$components/search/SearchRow';
import {fetchDistrictsByMunicipality} from '$src/district/actions';
import {FieldTypes} from '$components/enums';
import {FormNames} from '$src/enums';
import {
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
  onClear: Function,
  onSearch: Function,
  router: Object,
  sortKey: ?string,
  sortOrder: ?string,
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

class Search extends PureComponent<Props, State> {
  _isMounted: boolean;

  state = {
    decisionMakerOptions: [],
    isBasicSearch: true,
    leaseAttributes: null,
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
    delete searchQuery.sort_key;
    delete searchQuery.sort_order;

    if(!Object.keys(searchQuery).length ||
      Object.keys(searchQuery).length === 1 && (searchQuery.identifier || searchQuery.lease_state) ||
      Object.keys(searchQuery).length === 2 && (searchQuery.identifier && searchQuery.lease_state)) {
      return true;
    }

    return false;
  }

  onSearchChange = debounce(() => {
    if(!this._isMounted) return;

    const {formValues, onSearch, sortKey, sortOrder, states} = this.props;
    const newValues = {...formValues};

    if(sortKey || sortOrder) {
      newValues.sort_key = sortKey;
      newValues.sort_order = sortOrder;
    }

    if(states.length) {
      newValues.lease_state = states;
    }

    onSearch(newValues, true);
  }, 500);

  toggleSearchType = () => {
    this.setState({isBasicSearch: !this.state.isBasicSearch});
  }

  handleClear = () => {
    const {onSearch, sortKey, sortOrder} = this.props;
    const query = {};

    if(sortKey || sortOrder) {
      query.sort_key = sortKey;
      query.sort_order = sortOrder;
    }

    onSearch(query, true, true);
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
      <SearchContainer>
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
        {!isBasicSearch &&
          <Fragment>
            <SearchRow>
              <SearchLabelColumn>
                <SearchLabel>Vuokralainen</SearchLabel>
              </SearchLabelColumn>
              <SearchInputColumn>
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
              </SearchInputColumn>
            </SearchRow>

            <SearchRow>
              <SearchLabelColumn>
                <SearchLabel>Y-tunnus</SearchLabel>
              </SearchLabelColumn>
              <SearchInputColumn>
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
              </SearchInputColumn>
            </SearchRow>

            <SearchRow>
              <SearchLabelColumn>
                <SearchLabel>Henkilötunnus</SearchLabel>
              </SearchLabelColumn>
              <SearchInputColumn>
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
              </SearchInputColumn>
            </SearchRow>

            <SearchRow>
              <SearchLabelColumn>
                <SearchLabel>Rooli</SearchLabel>
              </SearchLabelColumn>
              <SearchInputColumn>
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
              </SearchInputColumn>
            </SearchRow>

            <SearchRow>
              <SearchLabelColumn>
                <SearchLabel>Vuokranantaja</SearchLabel>
              </SearchLabelColumn>
              <SearchInputColumn>
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
              </SearchInputColumn>
            </SearchRow>

            <SearchRow>
              <SearchLabelColumn>
                <SearchLabel>Vuokratunnus</SearchLabel>
              </SearchLabelColumn>
              <SearchInputColumn>
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
              </SearchInputColumn>
            </SearchRow>

            <SearchRow>
              <SearchLabelColumn>
                <SearchLabel>Alkupvm</SearchLabel>
              </SearchLabelColumn>
              <SearchInputColumn>
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
              </SearchInputColumn>
            </SearchRow>

            <SearchRow>
              <SearchLabelColumn>
                <SearchLabel>Loppupvm</SearchLabel>
              </SearchLabelColumn>
              <SearchInputColumn>
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
              </SearchInputColumn>
            </SearchRow>

            <SearchRow>
              <SearchLabelColumn></SearchLabelColumn>
              <SearchInputColumn>
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
              </SearchInputColumn>
            </SearchRow>

            <SearchRow>
              <SearchLabelColumn>
                <SearchLabel>Kiinteistötunnus</SearchLabel>
              </SearchLabelColumn>
              <SearchInputColumn>
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
              </SearchInputColumn>
            </SearchRow>

            <SearchRow>
              <SearchLabelColumn>
                <SearchLabel>Vuokrakohteen osoite</SearchLabel>
              </SearchLabelColumn>
              <SearchInputColumn>
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
              </SearchInputColumn>
            </SearchRow>

            <SearchRow>
              <SearchLabelColumn>
                <SearchLabel>Sopimusnro</SearchLabel>
              </SearchLabelColumn>
              <SearchInputColumn>
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
              </SearchInputColumn>
            </SearchRow>

            <SearchRow>
              <SearchLabelColumn>
                <SearchLabel>Päätös</SearchLabel>
              </SearchLabelColumn>
              <SearchInputColumn>
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
              </SearchInputColumn>
            </SearchRow>

            <SearchRow>
              <SearchLabelColumn>
                <SearchLabel>Diaarinro</SearchLabel>
              </SearchLabelColumn>
              <SearchInputColumn>
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
              </SearchInputColumn>
            </SearchRow>

            <SearchRow>
              <SearchLabelColumn>
                <SearchLabel>Laskunro</SearchLabel>
              </SearchLabelColumn>
              <SearchInputColumn>
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
              </SearchInputColumn>
            </SearchRow>
          </Fragment>
        }

        <Row>
          <Column small={6}>
            <SearchChangeTypeLink onClick={this.toggleSearchType}>{isBasicSearch ? 'Tarkennettu haku' : 'Yksinkertainen haku'}</SearchChangeTypeLink>
          </Column>
          <Column small={6}>
            <SearchClearLink onClick={this.handleClear}>Tyhjennä haku</SearchClearLink>
          </Column>
        </Row>
      </SearchContainer>
    );
  }
}

const formName = FormNames.LEASE_SEARCH;
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
