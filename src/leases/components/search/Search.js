// @flow
import React, {Component} from 'react';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import {change, Field, formValueSelector, getFormValues, initialize, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import debounce from 'lodash/debounce';
import flowRight from 'lodash/flowRight';
import toArray from 'lodash/toArray';

import FieldTypeCheckbox from '$components/form/FieldTypeCheckbox';
import FieldTypeSelect from '$components/form/FieldTypeSelect';
import FieldTypeText from '$components/form/FieldTypeText';
import {fetchDistrictsByMunicipality} from '$src/district/actions';
import {FormNames} from '$src/leases/enums';
import {getDistrictOptions} from '$src/leases/helpers';
import {getAttributeFieldOptions} from '$util/helpers';
import {getDistrictsByMunicipality} from '$src/district/selectors';
import {getAttributes} from '$src/leases/selectors';

import type {Attributes} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  change: Function,
  districts: Array<Object>,
  fetchDistrictsByMunicipality: Function,
  formValues: Object,
  initialize: Function,
  municipality: string,
  onSearch: Function,
  router: Object,
  search: string,
}

type State = {
  isBasicSearch: boolean,
}

class Search extends Component {
  props: Props

  state: State = {
    isBasicSearch: true,
  }

  componentDidMount = () => {
    const {router: {location: {query}}} = this.props;

    if(!!toArray(query).length && !query.search) {
      this.setState({
        isBasicSearch: false,
      });
    }
  }

  componentWillUpdate(nextProps: Object) {
    const {change, fetchDistrictsByMunicipality} = this.props;
    if (Number(this.props.municipality) !== Number(nextProps.municipality)) {
      if(nextProps.municipality) {
        fetchDistrictsByMunicipality(nextProps.municipality);
        if(this.props.municipality) {
          change('district', '');
        }
      } else {
        change('district', '');
      }
    }

    if(this.props.formValues !== nextProps.formValues) {
      this.onSearchChange();
    }
  }

  onSearchChange = debounce(() => {
    const {
      formValues,
      onSearch,
      search,
    } = this.props;
    const {isBasicSearch} = this.state;

    let filters = {};
    if(isBasicSearch) {
      if(search) {
        filters.search = search || undefined;
      }
    } else {
      filters = formValues || {};
      filters.type = filters.type ? Number(filters.type) : undefined;
      filters.municipality = filters.municipality ? Number(filters.municipality) : undefined;
      filters.district = filters.district ? Number(filters.district) : undefined;
      filters.search = undefined;
    }
    onSearch(filters);
  }, 300);

  toggleSearchType = () => {
    this.onSearchChange();
    this.setState({isBasicSearch: !this.state.isBasicSearch});
  }

  render () {
    const {
      attributes,
      districts,
    } = this.props;
    const {
      isBasicSearch,
    } = this.state;

    const tenantTypeOptions = getAttributeFieldOptions(attributes, 'tenants.child.children.tenantcontact_set.child.children.type');
    const districtOptions = getDistrictOptions(districts);
    const municipalityOptions = getAttributeFieldOptions(attributes, 'municipality');
    const typeOptions = getAttributeFieldOptions(attributes, 'type');
    const stateOptions = getAttributeFieldOptions(attributes, 'state');


    return (
      <div className='lease-search'>
        {isBasicSearch && (
          <div>
            <Row>
              <Column large={12}>
                <Field
                  component={FieldTypeText}
                  disableDirty
                  name="search"
                  placeholder='Hae hakusanalla'
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
                    <Field
                      component={FieldTypeText}
                      disableDirty
                      name="tenant"
                    />
                  </div>
                </div>
              </Column>
              <Column small={12} medium={3}>
                <Field
                  className='checkbox-inline'
                  component={FieldTypeCheckbox}
                  disableDirty
                  name="only_past_tentants"
                  options= {[
                    {value: true, label: 'Vain entiset asiakkaat'},
                  ]}
                />
              </Column>
              <Column small={12} medium={3}>
                <div className='lease-search__row-wrapper'>
                  <label className='lease-search__label'>Rooli</label>
                  <div className='lease-search__input-wrapper'>
                    <Field
                      component={FieldTypeSelect}
                      disableDirty
                      name='tenant_role'
                      options={tenantTypeOptions}
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
                        <Field
                          component={FieldTypeSelect}
                          disableDirty
                          name='type'
                          options={typeOptions}
                        />
                      </Column>
                      <Column>
                        <Field
                          component={FieldTypeSelect}
                          disableDirty
                          name='municipality'
                          options={municipalityOptions}
                        />
                      </Column>
                      <Column>
                        <Field
                          component={FieldTypeSelect}
                          disableDirty
                          name='district'
                          options={districtOptions}
                        />
                      </Column>
                      <Column>
                        <Field
                          component={FieldTypeText}
                          disableDirty
                          name="sequence"
                        />
                      </Column>
                    </Row>
                  </div>
                </div>
              </Column>
              <Column small={12} medium={3}>
                <Row>
                  <Column>
                    <Field
                      className='checkbox-inline'
                      component={FieldTypeCheckbox}
                      disableDirty
                      name="on_going"
                      options= {[
                        {value: true, label: 'Voimassa'},
                      ]}
                    />
                  </Column>
                  <Column>
                    <Field
                      className='checkbox-inline'
                      component={FieldTypeCheckbox}
                      disableDirty
                      name="expired"
                      options= {[
                        {value: true, label: 'Päättyneet'},
                      ]}
                    />
                  </Column>
                </Row>

              </Column>
              <Column small={12} medium={3}>
                <div className='lease-search__row-wrapper'>
                  <label className='lease-search__label'>Tyyppi</label>
                  <div className='lease-search__input-wrapper'>
                    <Field
                      component={FieldTypeSelect}
                      disableDirty
                      name='state'
                      options={stateOptions}
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
                    <Field
                      component={FieldTypeText}
                      disableDirty
                      name="identifier"
                    />
                  </div>
                </div>
              </Column>
              <Column small={12} medium={6}>
                <div className='lease-search__row-wrapper'>
                  <label className='lease-search__label'>Osoite</label>
                  <div className='lease-search__input-wrapper'>
                    <Field
                      component={FieldTypeText}
                      disableDirty
                      name="address"
                    />
                  </div>
                </div>
              </Column>
            </Row>
          </div>
        )}
        <Row>
          <Column large={12}>
            <a onClick={this.toggleSearchType} className='readme-link'>{isBasicSearch ? 'Tarkennettu haku' : 'Yksinkertainen haku'}</a>
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
        municipality: municipality,
        search: selector(state, 'search'),
      };
    },
    {
      change,
      fetchDistrictsByMunicipality,
      initialize,
    }
  ),
  reduxForm({
    form: formName,
  }),
  withRouter,
)(Search);
