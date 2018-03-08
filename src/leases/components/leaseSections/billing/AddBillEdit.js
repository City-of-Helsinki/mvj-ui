// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import {Field, formValueSelector} from 'redux-form';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';

import AddButton from '$components/form/AddButton';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import Button from '$components/button/Button';
import CloseButton from '$components/button/CloseButton';
import FieldTypeCheckboxSingle from '$components/form/FieldTypeCheckboxSingle';
import FieldTypeDatePicker from '$components/form/FieldTypeDatePicker';
import FieldTypeSelect from '$components/form/FieldTypeSelect';
import FieldTypeText from '$components/form/FieldTypeText';
import GreenBoxEdit from '$components/content/GreenBoxEdit';
import {dateGreaterOrEqual, decimalNumber, required} from '$components/form/validations';
import {getBillingAddBillErrors} from '$src/leases/selectors';
import {billingTypeOptions} from '../constants';

type Props = {
  editMode: boolean,
  errors: Object,
  onAdd: Function,
  onClose: Function,
  onSave: Function,
  start_date: any,
}

const AddBillForm = ({editMode,
errors,
onAdd,
onClose,
onSave,
start_date}: Props) => {
  if(!editMode) {
    return (
      <div className='billing__add-bill'>
        <AddButton
          label='Luo uusi lasku'
          onClick={() => onAdd()}
          title='Luo uusi lasku'
        />
      </div>
    );
  }

  return (
    <div className='billing__add-bill'>
      <Row>
        <Column>
          <h2>Luo uusi lasku</h2>
        </Column>
      </Row>
      <GreenBoxEdit>
        <BoxContentWrapper>
          <CloseButton
            className="position-topright"
            onClick={() => onClose()}
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
          <Row>
            <Column>
              <Button
                className='button-green no-margin pull-right'
                disabled={!isEmpty(errors)}
                label='Tallenna'
                onClick={() => onSave()}
                title='Tallenna'
              />
            </Column>
          </Row>
        </BoxContentWrapper>
      </GreenBoxEdit>
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
)(AddBillForm);
