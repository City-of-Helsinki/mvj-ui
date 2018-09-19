// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {change, formValueSelector, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';

import Button from '$components/button/Button';
import FormField from '$components/form/FormField';
import {fetchDistrictsByMunicipality} from '$src/district/actions';
import {Classification, FormNames} from '$src/leases/enums';
import {getDistrictOptions} from '$src/district/helpers';
import {getDistrictsByMunicipality} from '$src/district/selectors';
import {getAttributes} from '$src/leases/selectors';

import type {DistrictList} from '$src/district/types';

import type {Attributes} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  change: Function,
  district: string,
  districts: DistrictList,
  fetchDistrictsByMunicipality: Function,
  handleSubmit: Function,
  municipality: string,
  note: string,
  onClose: Function,
  onSubmit: Function,
  reference_number: string,
  setRefForFirstField?: Function,
  state: string,
  type: string,
  valid: boolean,
}

class CreateLeaseForm extends Component<Props> {
  firstField: any

  componentWillReceiveProps(nextProps) {
    if(this.props.municipality !== nextProps.municipality) {
      const {change, fetchDistrictsByMunicipality} = this.props;

      if(nextProps.municipality) {
        fetchDistrictsByMunicipality(nextProps.municipality);
        change('district', '');
      } else {
        change('district', '');
      }
    }
  }

  setRefForFirstField = (element: any) => {
    this.firstField = element;
  }

  setFocus = () => {
    if(this.firstField) {
      this.firstField.focus();
    }
  }

  handleCreate = () => {
    const {
      state,
      type,
      municipality,
      district,
      reference_number,
      note,
      onSubmit,
    } = this.props;

    onSubmit({
      state: state,
      type: type,
      municipality: municipality,
      district: district,
      reference_number: reference_number,
      note: note,
      classification: Classification.PUBLIC,
    });
  };

  render() {
    const {
      attributes,
      districts,
      handleSubmit,
      onClose,
      valid,
    } = this.props;

    const districtOptions = getDistrictOptions(districts);

    return (
      <form onSubmit={handleSubmit}>
        <Row>
          <Column small={4} medium={3}>
            <FormField
              fieldAttributes={get(attributes, 'state')}
              name='state'
              setRefForField={this.setRefForFirstField}
              overrideValues={{
                label: 'Tyyppi',
              }}
            />
          </Column>
        </Row>
        <Row>
          <Column small={4} medium={3}>
            <FormField
              fieldAttributes={get(attributes, 'type')}
              name={'type'}
              overrideValues={{
                label: 'Vuokrauksen laji',
              }}
            />
          </Column>
          <Column small={4} medium={3}>
            <FormField
              fieldAttributes={get(attributes, 'municipality')}
              name='municipality'
              overrideValues={{
                label: 'Kunta',
              }}
            />
          </Column>
          <Column small={4} medium={3}>
            <FormField
              fieldAttributes={get(attributes, 'district')}
              name='district'
              overrideValues={{
                label: 'Kaupunginosa',
                options: districtOptions,
              }}
            />
          </Column>
        </Row>
        <Row>
          <Column small={4} medium={3}>
            <FormField
              fieldAttributes={get(attributes, 'reference_number')}
              name='reference_number'
              overrideValues={{
                label: 'Diaarinumero',
              }}
            />
          </Column>
          <Column small={8} medium={6}>
            <FormField
              fieldAttributes={get(attributes, 'note')}
              name='note'
              overrideValues={{
                label: 'Huomautus',
              }}
            />
          </Column>
        </Row>
        <Row style={{marginTop: 5}}>
          <Column>
            <Button
              className='button-green pull-right no-margin'
              disabled={!valid}
              onClick={this.handleCreate}
              text='Luo tunnus'
            />
            <Button
              className='button-red pull-right'
              onClick={onClose}
              text='Peruuta'
            />
          </Column>
        </Row>
      </form>
    );
  }
}

const formName = FormNames.CREATE_LEASE;
const selector = formValueSelector(formName);

export default flowRight(
  connect(
    (state) => {
      const municipality = selector(state, 'municipality');
      return {
        attributes: getAttributes(state),
        district: selector(state, 'district'),
        districts: getDistrictsByMunicipality(state, municipality),
        municipality: municipality,
        note: selector(state, 'note'),
        reference_number: selector(state, 'reference_number'),
        state: selector(state, 'state'),
        type: selector(state, 'type'),
      };
    },
    {
      change,
      fetchDistrictsByMunicipality,
    },
    null,
    {withRef: true}
  ),
  reduxForm({
    form: formName,
  }),
)(CreateLeaseForm);
