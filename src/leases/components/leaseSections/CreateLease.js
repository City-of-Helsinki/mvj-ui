// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Field, reduxForm, formValueSelector} from 'redux-form';
import flowRight from 'lodash/flowRight';
import {Row, Column} from 'react-foundation';

import {getDistrictOptions} from '../../helpers';
import Button from '$components/button/Button';
import FieldTypeSelect from '$components/form/FieldTypeSelect';
import FieldTypeText from '$components/form/FieldTypeText';
import {required} from '$components/form/validations';
import {fetchDistricts} from '$src/leases/actions';
import {getDistricts} from '$src/leases/selectors';
import {getAttributeFieldOptions, getSearchQuery} from '$util/helpers';

import type {DistrictList} from '$src/leases/types';

type Props = {
  attributes: Object,
  change: Function,
  district: string,
  districts: DistrictList,
  fetchDistricts: Function,
  municipality: string,
  onSubmit: Function,
  type: string,
  valid: boolean,
}

class CreateLease extends Component {
  props: Props

  componentWillReceiveProps(nextProps) {
    if(this.props.municipality !== nextProps.municipality) {
      const {change, fetchDistricts} = this.props;

      if(nextProps.municipality) {
        const query = {
          limit: 1000,
          municipality: nextProps.municipality,
        };
        fetchDistricts(getSearchQuery(query));
        change('district', '');
      }
    }
  }

  render () {
    const {
      attributes,
      district,
      districts,
      municipality,
      onSubmit,
      type,
      valid,
    } = this.props;

    const districtOptions = getDistrictOptions(districts);
    const municipalityOptions = getAttributeFieldOptions(attributes, 'municipality', true, true);
    const typeOptions = getAttributeFieldOptions(attributes, 'type');

    return (
      <form className='create-lease-form'>
        <Row>
          <Column small={3}>
            <Field
              component={FieldTypeSelect}
              label='Vuokrauksen laji'
              name={'type'}
              options={typeOptions}
              validate={[
                (value) => required(value, 'Vuokrauksen laji on pakollinen'),
              ]}
            />
          </Column>
          <Column small={3}>
            <Field
              component={FieldTypeSelect}
              label='Kunta'
              name='municipality'
              options={municipalityOptions}
              validate={[
                (value) => required(value, 'Kunta on pakollinen'),
              ]}
            />
          </Column>
          <Column small={3}>
            <Field
              component={FieldTypeSelect}
              label='Kaupunginosa'
              name='district'
              options={districtOptions}
              validate={[
                (value) => required(value, 'Kaupunginosa on pakollinen'),
              ]}
            />
          </Column>
          <Column small={3}>
            <Field
              component={FieldTypeText}
              disabled={true}
              label='Juokseva numero'
              name='sequence'
              type='number'
            />
          </Column>
        </Row>
        <Row>
          <Column medium={12}>
            <Button
              className='button-green pull-right no-margin'
              disabled={!valid}
              label='Luo tunnus'
              onClick={() => onSubmit({
                district: district,
                municipality: municipality,
                type: type,
              })}
              title='Luo tunnus'
            />
          </Column>
        </Row>
      </form>
    );
  }
}

const formName = 'create-lease-form';
const selector = formValueSelector(formName);

export default flowRight(
  connect(
    state => {
      return {
        district: selector(state, 'district'),
        districts: getDistricts(state),
        municipality: selector(state, 'municipality'),
        type: selector(state, 'type'),
      };
    },
    {
      fetchDistricts,
    }
  ),
  reduxForm({
    form: formName,
  }),
)(CreateLease);
