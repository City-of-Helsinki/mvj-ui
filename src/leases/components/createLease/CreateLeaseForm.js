// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {change, Field, formValueSelector, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';

import Button from '$components/button/Button';
import FieldTypeSelect from '$components/form/FieldTypeSelect';
import FieldTypeText from '$components/form/FieldTypeText';
import {fetchDistrictsByMunicipality} from '$src/district/actions';
import {fetchDistricts, receiveDistricts} from '$src/leases/actions';
import {Classification, FormNames} from '$src/leases/enums';
import {getDistrictOptions} from '$src/leases/helpers';
import {getAttributeFieldOptions} from '$util/helpers';
import {getDistrictsByMunicipality} from '$src/district/selectors';
import {getAttributes} from '$src/leases/selectors';
import {genericValidator} from '$components/form/validations';

import type {DistrictList} from '$src/district/types';

import type {Attributes} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  change: Function,
  district: string,
  districts: DistrictList,
  fetchDistricts: Function,
  fetchDistrictsByMunicipality: Function,
  handleSubmit: Function,
  municipality: string,
  note: string,
  onSubmit: Function,
  receiveDistricts: Function,
  reference_number: string,
  state: string,
  type: string,
  valid: boolean,
}

class CreateLeaseForm extends Component {
  props: Props

  componentWillReceiveProps(nextProps) {
    if(!nextProps.municipality) {
      const {change} = this.props;
      change('district', '');
    } else if(this.props.municipality !== nextProps.municipality) {
      const {change, fetchDistrictsByMunicipality} = this.props;

      fetchDistrictsByMunicipality(nextProps.municipality);
      change('district', '');
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
      valid,
    } = this.props;

    const stateOptions = getAttributeFieldOptions(attributes, 'state');
    const districtOptions = getDistrictOptions(districts);
    const municipalityOptions = getAttributeFieldOptions(attributes, 'municipality', true, true);
    const typeOptions = getAttributeFieldOptions(attributes, 'type');

    return (
      <form onSubmit={handleSubmit}>
        <Row>
          <Column small={4} medium={3}>
            <Field
              component={FieldTypeSelect}
              label='Tyyppi'
              name={'state'}
              options={stateOptions}
              validate={[
                (value) => genericValidator(value, get(attributes, 'state')),
              ]}
            />
          </Column>
        </Row>
        <Row>
          <Column small={4} medium={3}>
            <Field
              component={FieldTypeSelect}
              label='Vuokrauksen laji'
              name={'type'}
              options={typeOptions}
              validate={[
                (value) => genericValidator(value, get(attributes, 'type')),
              ]}
            />
          </Column>
          <Column small={4} medium={3}>
            <Field
              component={FieldTypeSelect}
              label='Kunta'
              name='municipality'
              options={municipalityOptions}
              validate={[
                (value) => genericValidator(value, get(attributes, 'municipality')),
              ]}
            />
          </Column>
          <Column small={4} medium={3}>
            <Field
              component={FieldTypeSelect}
              label='Kaupunginosa'
              name='district'
              options={districtOptions}
              validate={[
                (value) => genericValidator(value, get(attributes, 'district')),
              ]}
            />
          </Column>
        </Row>
        <Row>
          <Column small={4} medium={3}>
            <Field
              component={FieldTypeText}
              label='Diaarinumero'
              name='reference_number'
              validate={[
                (value) => genericValidator(value, get(attributes, 'reference_number')),
              ]}
            />
          </Column>
          <Column small={8} medium={6}>
            <Field
              component={FieldTypeText}
              label='Kommentti'
              name='note'
              validate={[
                (value) => genericValidator(value, get(attributes, 'note')),
              ]}
            />
          </Column>
        </Row>
        <Row style={{marginTop: 5}}>
          <Column>
            <Button
              className='button-green pull-right no-margin'
              disabled={!valid}
              label='Luo tunnus'
              onClick={this.handleCreate}
              title='Luo tunnus'
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
      fetchDistricts,
      fetchDistrictsByMunicipality,
      receiveDistricts,
    }
  ),
  reduxForm({
    form: formName,
  }),
)(CreateLeaseForm);
