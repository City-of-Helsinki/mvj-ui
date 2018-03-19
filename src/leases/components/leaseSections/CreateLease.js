// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Field, reduxForm, formValueSelector} from 'redux-form';
import flowRight from 'lodash/flowRight';
import {Row, Column} from 'react-foundation';

import * as contentHelpers from '../../helpers';
import Button from '$components/button/Button';
import FieldTypeSelect from '$components/form/FieldTypeSelect';
import FieldTypeText from '$components/form/FieldTypeText';
import {required} from '$components/form/validations';
import {getAttributeFieldOptions, getLessorsOptions} from '$src/util/helpers';

type Props = {
  attributes: Object,
  district: string,
  lessor: string,
  lessors: Array<Object>,
  municipality: string,
  notice_period: string,
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
      lessor,
      lessors,
      municipality,
      notice_period,
      onSubmit,
      status,
      type,
      valid,
    } = this.props;

    const districtOptions = contentHelpers.getDistrictOptions(attributes);
    const municipalityOptions = contentHelpers.getMunicipalityOptions(attributes);
    const typeOptions = contentHelpers.getTypeOptions(attributes);
    const lessorOptions = getLessorsOptions(lessors);
    const noticePeriodOptions = getAttributeFieldOptions(attributes, 'notice_period');

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
          <Column small={3}>
            <Field
              component={FieldTypeSelect}
              label='Vuokranantaja'
              name='lessor'
              options={lessorOptions}
              validate={[
                (value) => required(value, 'Vuokranantaja on pakollinen'),
              ]}
            />
          </Column>
          <Column small={3}>
            <Field
              component={FieldTypeSelect}
              label='Irtisanomisaika'
              name='notice_period'
              options={noticePeriodOptions}
              validate={[
                (value) => required(value, 'Irtisanomisaika on pakollinen'),
              ]}
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
                end_date: null,
                lessor: lessor,
                municipality: municipality,
                notice_period: notice_period,
                start_date: null,
                status: status,
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
        lessor: selector(state, 'lessor'),
        municipality: selector(state, 'municipality'),
        notice_period: selector(state, 'notice_period'),
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
