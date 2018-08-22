// @flow
import React, {Component} from 'react';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import {clearFields, formValueSelector, getFormValues, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import debounce from 'lodash/debounce';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';
import toArray from 'lodash/toArray';

import FormField from '$components/form/FormField';
import {fetchDistrictsByMunicipality} from '$src/district/actions';
import {FormNames} from '$src/leases/enums';
import {getDistrictOptions} from '$src/district/helpers';
import {getAttributeFieldOptions} from '$util/helpers';
import {getDistrictsByMunicipality} from '$src/district/selectors';
import {getAttributes, getIsFetchingAttributes} from '$src/leases/selectors';

import type {Attributes} from '$src/leases/types';

type Props = {
  anyTouched: boolean,
  attributes: Attributes,
  change: Function,
  clearFields: Function,
  districts: Array<Object>,
  fetchDistrictsByMunicipality: Function,
  formValues: Object,
  isFetchingAttributes: boolean,
  location: Object,
  municipality: string,
  onSearch: Function,
  router: Object,
}

type State = {
  isBasicSearch: boolean,
}

class Search extends Component<Props, State> {
  _isMounted: boolean;

  state = {
    isBasicSearch: true,
  }

  componentDidMount() {
    const {router: {location: {query}}} = this.props;
    this._isMounted = true;
    const advancedSearchValues = {...query};
    delete advancedSearchValues.page;
    delete advancedSearchValues.identifier;

    if(toArray(advancedSearchValues).length) {
      this.setState({
        isBasicSearch: false,
      });
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidUpdate(prevProps: Props) {
    const {clearFields, fetchDistrictsByMunicipality} = this.props;

    if(Number(prevProps.municipality) !== Number(this.props.municipality)) {
      if(this.props.municipality) {
        fetchDistrictsByMunicipality(this.props.municipality);
      }
      if(this.props.anyTouched) {
        clearFields(false, false, 'district');
      }
    }

    if(this.props.anyTouched  && (JSON.stringify(prevProps.formValues || {}) !== JSON.stringify(this.props.formValues || {}))) {
      const {isBasicSearch} = this.state;
      const {formValues} = this.props;

      let newIsBasicSearch = isBasicSearch;
      const advancedFormValues = {...formValues};
      delete advancedFormValues.identifier;

      if(toArray(advancedFormValues).length) {
        newIsBasicSearch = false;
      } else {
        newIsBasicSearch = true;
      }

      if(newIsBasicSearch !== isBasicSearch) {
        this.setState({isBasicSearch: newIsBasicSearch});
        this.onSearchChange();
      } else {
        const {location: {query}} = this.props;

        const searchQuery = {...query};
        delete searchQuery.page;

        if(JSON.stringify(searchQuery) !== JSON.stringify(this.props.formValues)) {
          this.onSearchChange();
        }
      }
    }
  }

  onSearchChange = debounce(() => {
    if(!this._isMounted) { return;}

    const {formValues, onSearch} = this.props;
    const {isBasicSearch} = this.state;

    const filters = {};
    if(isBasicSearch) {
      if(!isEmpty(formValues)) {
        if(formValues.identifier) {
          filters.identifier = formValues.identifier;
        }
      }
    } else {
      if(!isEmpty(formValues)) {
        if(formValues.type) {
          filters.type = Number(formValues.type);
        }
        if(formValues.municipality) {
          filters.municipality = Number(formValues.municipality);
        }
        if(formValues.district) {
          filters.district = Number(formValues.district);
        }
      }
    }
    onSearch(filters);
  }, 300);

  toggleSearchType = () => {
    this.setState({isBasicSearch: !this.state.isBasicSearch});
    this.onSearchChange();
  }

  handleLinkKeyDown = (e: any) => {
    if(e.keyCode === 13){
      e.preventDefault();
      this.toggleSearchType();
    }
  }

  render () {
    const {
      attributes,
      districts,
      isFetchingAttributes,
    } = this.props;
    const {
      isBasicSearch,
    } = this.state;

    const tenantTypeOptions = getAttributeFieldOptions(attributes, 'tenants.child.children.tenantcontact_set.child.children.type', false);
    const districtOptions = getDistrictOptions(districts);
    const municipalityOptions = getAttributeFieldOptions(attributes, 'municipality');
    const typeOptions = getAttributeFieldOptions(attributes, 'type');
    const stateOptions = getAttributeFieldOptions(attributes, 'state', false);

    return (
      <div className='lease-search'>
        {isBasicSearch && (
          <div>
            <Row>
              <Column large={12}>
                <FormField
                  autoBlur
                  disableDirty
                  fieldAttributes={{}}
                  name='identifier'
                  placeholder='Hae hakusanalla'
                  overrideValues={{
                    label: '',
                  }}
                />
              </Column>
            </Row>
          </div>
        )}
        {!isBasicSearch && (
          <div>
            <Row>
              <Column small={12} medium={6}>
                <div className='lease-search__row-wrapper'>
                  <label className='lease-search__label'>Vuokralainen</label>
                  <div className='lease-search__input-wrapper'>
                    <FormField
                      autoBlur
                      disableDirty
                      fieldAttributes={{}}
                      name='tenant'
                      overrideValues={{
                        label: '',
                      }}
                    />
                  </div>
                </div>
              </Column>
              <Column small={12} medium={3}>
                <FormField
                  autoBlur
                  disableDirty
                  fieldAttributes={{}}
                  name='only_past_tentants'
                  overrideValues={{
                    label: '',
                    fieldType: 'checkbox',
                    options: [
                      {value: true, label: 'Vain entiset asiakkaat'},
                    ],
                  }}
                />
              </Column>
              <Column small={12} medium={3}>
                <div className='lease-search__row-wrapper'>
                  <label className='lease-search__label'>Rooli</label>
                  <div className='lease-search__input-wrapper'>
                    <FormField
                      autoBlur
                      disableDirty
                      fieldAttributes={{}}
                      isLoading={isFetchingAttributes}
                      name='tenant_role'
                      overrideValues={{
                        label: '',
                        fieldType: 'multiselect',
                        options: tenantTypeOptions,
                      }}
                    />
                  </div>
                </div>
              </Column>
            </Row>
            <Row>
              <Column small={12} medium={6}>
                <div className='lease-search__row-wrapper'>
                  <label className='lease-search__label'>Vuokraus</label>
                  <div className='lease-search__input-wrapper'>
                    <Row>
                      <Column>
                        <FormField
                          autoBlur
                          disableDirty
                          fieldAttributes={{}}
                          name='type'
                          overrideValues={{
                            label: '',
                            fieldType: 'choice',
                            options: typeOptions,
                          }}
                        />
                      </Column>
                      <Column>
                        <FormField
                          autoBlur
                          disableDirty
                          fieldAttributes={{}}
                          name='municipality'
                          overrideValues={{
                            label: '',
                            fieldType: 'choice',
                            options: municipalityOptions,
                          }}
                        />
                      </Column>
                      <Column>
                        <FormField
                          autoBlur
                          disableDirty
                          disableRequired
                          fieldAttributes={{}}
                          name='district'
                          overrideValues={{
                            label: '',
                            fieldType: 'choice',
                            options: districtOptions,
                          }}
                        />
                      </Column>
                      <Column>
                        <FormField
                          autoBlur
                          disableDirty
                          fieldAttributes={{}}
                          name='sequence'
                          overrideValues={{
                            label: '',
                          }}
                        />
                      </Column>
                    </Row>
                  </div>
                </div>
              </Column>
              <Column small={12} medium={3}>
                <Row>
                  <Column>
                    <FormField
                      autoBlur
                      disableDirty
                      fieldAttributes={{}}
                      name='on_going'
                      overrideValues={{
                        label: '',
                        fieldType: 'checkbox',
                        options: [
                          {value: true, label: 'Voimassa'},
                        ],
                      }}
                    />
                  </Column>
                  <Column>
                    <FormField
                      autoBlur
                      disableDirty
                      fieldAttributes={{}}
                      name='expired'
                      overrideValues={{
                        label: '',
                        fieldType: 'checkbox',
                        options: [
                          {value: true, label: 'Päättyneet'},
                        ],
                      }}
                    />
                  </Column>
                </Row>

              </Column>
              <Column small={12} medium={3}>
                <div className='lease-search__row-wrapper'>
                  <label className='lease-search__label'>Tyyppi</label>
                  <div className='lease-search__input-wrapper'>
                    <FormField
                      autoBlur
                      disableDirty
                      fieldAttributes={{}}
                      isLoading={isFetchingAttributes}
                      name='state'
                      overrideValues={{
                        label: '',
                        fieldType: 'multiselect',
                        options: stateOptions,
                      }}
                    />
                  </div>
                </div>

              </Column>
            </Row>
            <Row>
              <Column small={12} medium={6}>
                <div className='lease-search__row-wrapper'>
                  <label className='lease-search__label'>Kiinteistö</label>
                  <div className='lease-search__input-wrapper'>
                    <FormField
                      autoBlur
                      disableDirty
                      fieldAttributes={{}}
                      name='property_identifier'
                      overrideValues={{
                        label: '',
                      }}
                    />
                  </div>
                </div>
              </Column>
              <Column small={12} medium={6}>
                <div className='lease-search__row-wrapper'>
                  <label className='lease-search__label'>Osoite</label>
                  <div className='lease-search__input-wrapper'>
                    <FormField
                      autoBlur
                      disableDirty
                      fieldAttributes={{}}
                      name='address'
                      overrideValues={{
                        label: '',
                      }}
                    />
                  </div>
                </div>
              </Column>
            </Row>
          </div>
        )}
        <Row>
          <Column large={12}>
            <a tabIndex={0} onKeyDown={this.handleLinkKeyDown} onClick={this.toggleSearchType} className='readme-link'>{isBasicSearch ? 'Tarkennettu haku' : 'Yksinkertainen haku'}</a>
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
        attributes: getAttributes(state),
        districts: getDistrictsByMunicipality(state, municipality),
        formValues: getFormValues(formName)(state),
        isFetchingAttributes: getIsFetchingAttributes(state),
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
