// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import {Field, formValueSelector, reduxForm} from 'redux-form';
import flowRight from 'lodash/flowRight';

import FieldTypeCheckboxSingle from '$components/form/FieldTypeCheckboxSingle';
import FieldTypeDatePicker from '$components/form/FieldTypeDatePicker';
import FieldTypeSelect from '$components/form/FieldTypeSelect';
import FieldTypeText from '$components/form/FieldTypeText';
import {dateGreaterOrEqual, decimalNumber, required} from '$components/form/validations';

import {
  billingTypeOptions,
} from '../../constants';

type Props = {
  bill: Object,
  dispatch: Function,
  handleSubmit: Function,
  startDate: string,
}

const EditAbnormalDebtForm = ({
  handleSubmit,
  startDate,
}: Props) => {

  return (
    <form onSubmit={handleSubmit}>
      <Row>
        <Column medium={5}>
          <Row>
            <Column medium={4}>
              <Field
                component={FieldTypeSelect}
                label='Saamislaji'
                labelClassName='required'
                name='type'
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
                name='capital_amount'
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
                name='due_date'
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
                  (value) => dateGreaterOrEqual(value, startDate),
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
    </form>
  );
};

const formName = 'billing-edit-abnormal-debt-form';
const selector = formValueSelector(formName);

export default flowRight(
  connect(
    (state) => {
      return {
        startDate: selector(state, 'start_date'),
      };
    }
  ),
  reduxForm({
    form: formName,
  }),
)(EditAbnormalDebtForm);
