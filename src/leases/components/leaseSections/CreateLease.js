// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Field, reduxForm, formValueSelector} from 'redux-form';
import flowRight from 'lodash/flowRight';
import {Row, Column} from 'react-foundation';

import * as contentHelpers from '../../helpers';
import Button from '../../../components/button/Button';
import FieldTypeSelect from '../../../components/form/FieldTypeSelect';
import FieldTypeText from '../../../components/form/FieldTypeText';
import {integer, min, max, required} from '../../../components/form/validations';

import {createLeaseStatusOptions} from '../../constants';

type Props = {
  attributes: Object,
  district: string,
  municipality: string,
  onSubmit: Function,
  sequence: number,
  status: string,
  type: string,
  valid: boolean,
}

class CreateLease extends Component {
  props: Props

  render () {
    const {
      attributes,
      district,
      municipality,
      onSubmit,
      sequence,
      status,
      type,
      valid,
    } = this.props;

    const districtOptions = contentHelpers.getDistrictOptions(attributes);
    const municipalityOptions = contentHelpers.getMunicipalityOptions(attributes);
    const typeOptions = contentHelpers.getTypeOptions(attributes);

    return (
      <form className='create-lease-form'>
        <Row>
          <Column style={{paddingLeft: 0, paddingRight: 0}}>
            <Field
              component={FieldTypeSelect}
              label='Vuokrauksen olotila'
              name={'status'}
              options={createLeaseStatusOptions}
              validate={[
                (value) => required(value, 'Vuokrauksen laji on pakollinen'),
              ]}
            />
          </Column>
          <Column style={{paddingRight: 0}}>
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
          <Column style={{paddingRight: 0}}>
            <Field
              component={FieldTypeSelect}
              label='Kunta'
              name={'municipality'}
              options={municipalityOptions}
              validate={[
                (value) => required(value, 'Kunta on pakollinen'),
              ]}
            />
          </Column>
          <Column style={{paddingRight: 0}}>
            <Field
              component={FieldTypeSelect}
              label='Kaupunginosa'
              name={'district'}
              options={districtOptions}
              validate={[
                (value) => required(value, 'Kaupunginosa on pakollinen'),
              ]}
            />
          </Column>
          <Column style={{paddingRight: 0}}>
            <Field
              component={FieldTypeText}
              label='Juokseva numero'
              name={'sequence'}
              type='number'
              validate={[
                (value) => integer(value, 'Juoksevan numeron tulee olla kokonaisluku'),
                (value) => min(value, 1, 'Juoksevan numeron tulee olla vähintään 1'),
                (value) => max(value, 9999, 'Juoksevan numeron tulee olla enintään 9999'),
                (value) => required(value, 'Juokseva numero on pakollinen'),
              ]}
            />
          </Column>
        </Row>
        <Row>
          <Column medium={12} style={{paddingLeft: 0, paddingRight: 0}}>
            <Button
              className={'button-green button-xs no-margin full-width'}
              disabled={!valid}
              text={'Luo tunnus'}
              onClick={() => onSubmit({
                district: district,
                end_date: null,
                municipality: municipality,
                sequence: Number(sequence),
                start_date: null,
                status: status,
                type: type,
              })}
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
        municipality: selector(state, 'municipality'),
        sequence: selector(state, 'sequence'),
        status: selector(state, 'status'),
        type: selector(state, 'type'),
      };
    },
  ),
  reduxForm({
    form: formName,
  }),
)(CreateLease);
