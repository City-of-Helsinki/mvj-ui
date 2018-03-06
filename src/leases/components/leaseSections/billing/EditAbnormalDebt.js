// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Field, formValueSelector} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';
import type Moment from 'moment';

import {billingTypeOptions} from '../constants';
import {getBillingAbnormalDebtModalErrors} from '$src/leases/selectors';
import {dateGreaterOrEqual, decimalNumber, required} from '$components/form/validations';
import CloseButton from '$components/button/CloseButton';
import FieldTypeCheckboxSingle from '$components/form/FieldTypeCheckboxSingle';
import FieldTypeDatePicker from '$components/form/FieldTypeDatePicker';
import FieldTypeSelect from '$components/form/FieldTypeSelect';
import FieldTypeText from '$components/form/FieldTypeText';

type Props = {
  abnormalDebt: Object,
  errors: ?Object,
  onCancel: Function,
  onSave: Function,
  show: boolean,
  start_date: ?Moment,
}

const EditAbnormalDebt = ({
  abnormalDebt,
  errors,
  onCancel,
  onSave,
  show,
  start_date}: Props) => {

  if(!show) {
    return null;
  }

  return (
    <div>
      <h2>Muokkaa poikkeavaa perintää</h2>
      <div className='green-box'>
        <div className='item no-margin no-padding'>
          <CloseButton
            className="position-topright"
            onClick={() => onCancel()}
            title="Poista ehto"
          />
          <Row>
            <Column medium={5}>
              <Row>
                <Column medium={4}>
                  <Field
                    component={FieldTypeSelect}
                    label='Saamislaji'
                    labelClassName='required'
                    name='abnormal_debt.type'
                    options={billingTypeOptions}
                    validate={[
                      (value) => required(value, 'Saamislaji on pakollinen'),
                    ]}
                  />
                </Column>
                <Column medium={4}>
                  <Field
                    component={FieldTypeText}
                    label='Laskun pääoma'
                    labelClassName='required'
                    name='abnormal_debt.capital_amount'
                    validate={[
                      (value) => decimalNumber(value, 'Laskun pääoma tulee olla numero'),
                      (value) => required(value, 'Laskun pääoma on pakollinen'),
                    ]}
                  />
                </Column>
                <Column medium={4}>
                  <Field
                    component={FieldTypeDatePicker}
                    label='Eräpäivä'
                    labelClassName='required'
                    name='abnormal_debt.due_date'
                    validate={[
                      (value) => required(value, 'Laskun eräpäivä on pakollinen'),
                    ]}
                  />
                </Column>
              </Row>
            </Column>
            <Column medium={3}>
              <label className='mvj-form-field-label required'>Laskutuskausi</label>
              <Row>
                <Column small={6} style={{paddingRight: '0.25rem'}}>
                  <Field
                    component={FieldTypeDatePicker}
                    name='abnormal_debt.billing_period_start_date'
                    validate={[
                      (value) => required(value, 'Päivämäärä on pakollinen'),
                    ]}
                  />
                </Column>
                <Column small={6} style={{paddingLeft: '0.25rem'}}>
                  <Field
                    component={FieldTypeDatePicker}
                    name='abnormal_debt.billing_period_end_date'
                    validate={[
                      (value) => required(value, 'Päivämäärä on pakollinen'),
                      (value) => dateGreaterOrEqual(value, start_date),
                    ]}
                  />
                </Column>
              </Row>
            </Column>
            <Column medium={2}>
              <Field
                className='no-label'
                component={FieldTypeCheckboxSingle}
                name='abnormal_debt.is_utter'
                optionLabel='Kertakaikkinen'
              />
            </Column>
          </Row>
          <Row>
            <Column>
              <Field
                className='no-margin'
                component={FieldTypeText}
                label='Tiedote'
                name='info'
              />
            </Column>
          </Row>
        </div>
      </div>
      <Row>
        <Column>
          <button
            className='add-button'
            disabled={!isEmpty(errors)}
            onClick={() => onSave(abnormalDebt)}
            type='button'>Tallenna</button>
        </Column>
      </Row>
    </div>
  );
};

const formName = 'billing-edit-form';
const selector = formValueSelector(formName);

export default flowRight(
  connect(
    (state) => {
      return {
        abnormalDebt: selector(state, 'billing.abnormal_debt'),
        errors: getBillingAbnormalDebtModalErrors(state),
        start_date: selector(state, 'billing.abnormal_debt.billing_period_start_date'),
      };
    }
  ),
)(EditAbnormalDebt);
