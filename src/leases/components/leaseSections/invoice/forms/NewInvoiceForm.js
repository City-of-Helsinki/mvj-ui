// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import {Field, formValueSelector, reduxForm} from 'redux-form';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';

import BoxContentWrapper from '$components/content/BoxContentWrapper';
import Button from '$components/button/Button';
import CloseButton from '$components/button/CloseButton';
import FieldTypeCheckboxSingle from '$components/form/FieldTypeCheckboxSingle';
import FieldTypeDatePicker from '$components/form/FieldTypeDatePicker';
import FieldTypeSelect from '$components/form/FieldTypeSelect';
import FieldTypeText from '$components/form/FieldTypeText';
import FormSection from '$components/form/FormSection';
import WhiteBoxEdit from '$components/content/WhiteBoxEdit';
import {dateGreaterOrEqual, decimalNumber, required} from '$components/form/validations';
// import {
//   getNewBillFormErrors,
//   getNewBillFormValues,
// } from '$src/leases/selectors';
import {billingTypeOptions} from '../../constants';

type Props = {
  bill: Object,
  errors: ?Object,
  handleSubmit: Function,
  onClose: Function,
  onSave: Function,
  startDate: string,
}

const NewInvoiceForm = ({
  bill,
  errors,
  handleSubmit,
  onClose,
  onSave,
  startDate,
}: Props) => {
  return (
    <form onSubmit={handleSubmit} className='billing__add-bill'>
      <FormSection>
        <WhiteBoxEdit>
          <BoxContentWrapper>
            <h3>Luo uusi lasku</h3>
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
            <Row style={{marginBottom: '10px'}}>
              <Column>
                <Button
                  className='button-green no-margin pull-right'
                  disabled={!isEmpty(errors)}
                  label='Tallenna'
                  onClick={() => onSave(bill)}
                  title='Tallenna'
                />
              </Column>
            </Row>
          </BoxContentWrapper>
        </WhiteBoxEdit>
      </FormSection>
    </form>
  );
};

const formName = 'billing-new-bill-form';
const selector = formValueSelector(formName);

export default flowRight(
  connect(
    (state) => {
      return {
        // bill: getNewBillFormValues(state),
        // errors: getNewBillFormErrors(state),
        startDate: selector(state, 'billing_period_start_date'),
      };
    }
  ),
  reduxForm({
    form: formName,
  }),
)(NewInvoiceForm);
