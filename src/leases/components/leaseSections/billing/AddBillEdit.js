// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import {Field, formValueSelector} from 'redux-form';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';

import FieldTypeCheckboxSingle from '../../../../components/form/FieldTypeCheckboxSingle';
import FieldTypeDatePicker from '../../../../components/form/FieldTypeDatePicker';
import FieldTypeText from '../../../../components/form/FieldTypeText';
import {dateGreaterOrEqual, required} from '../../../../components/form/validations';
import {getBillingAddBillErrors} from '../../../selectors';

type Props = {
  errors: Object,
  onSave: Function,
  start_date: any,
}

const AddBillEdit = ({errors, onSave, start_date}: Props) => {
  console.log(errors);
  return (
    <div>
      <div className='green-box'>
        <h2>Laskun tiedot</h2>
        <Row>
          <Column medium={3}>
            <label className='mvj-form-field-label required'>Laskutuskausi</label>
            <Row>
              <Column small={6} style={{paddingRight: '0.25rem'}}>
                <Field
                  component={FieldTypeDatePicker}
                  name='billing_period_start_date'
                  validate={[
                    (value) => required(value, 'Päivämäärä on pakollinen'),
                  ]}
                />
              </Column>
              <Column small={6} style={{paddingLeft: '0.25rem'}}>
                <Field
                  component={FieldTypeDatePicker}
                  name='billing_period_end_date'
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
              name='is_utter'
              optionLabel='Kertakaikkinen'
            />
          </Column>
          <Column medium={5}>
            <Row>
              <Column medium={4}>
                <Field
                  component={FieldTypeText}
                  label='Laskun pääoma'
                  labelClassName='required'
                  name='capital_amount'
                  validate={[
                    (value) => required(value, 'Laskun pääoma on pakollinen'),
                  ]}
                />
              </Column>
              <Column medium={4}>
                <Field
                  component={FieldTypeDatePicker}
                  label='Eräpäivä'
                  labelClassName='required'
                  name='due_date'
                  validate={[
                    (value) => required(value, 'Laskun eräpäivä on pakollinen'),
                  ]}
                />
              </Column>
              <Column medium={4}>
                <Field
                  component={FieldTypeText}
                  label='Saamislaji'
                  labelClassName='required'
                  name='type'
                  validate={[
                    (value) => required(value, 'Saamislaji on pakollinen'),
                  ]}
                />
              </Column>
            </Row>
          </Column>

          <Column medium={2}>
            <Field
              className='no-label'
              component={FieldTypeCheckboxSingle}
              name='is_abnormal_debt'
              optionLabel='Poikkeava perintä'
            />
          </Column>
        </Row>
        <Row>
          <Column>
            <Field
              component={FieldTypeText}
              label='Tiedote'
              name='info'
            />
          </Column>
        </Row>
      </div>
      <Row style={{marginTop: '1rem'}}>
        <Column>
          <button
            className='add-button'
            disabled={!isEmpty(errors)}
            onClick={() => onSave()}
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
        errors: getBillingAddBillErrors(state),
        start_date: selector(state, 'billing.new_bill.billing_period_start_date'),
      };
    }
  ),
)(AddBillEdit);