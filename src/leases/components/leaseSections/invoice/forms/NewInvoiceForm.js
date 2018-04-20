// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import {Field, reduxForm} from 'redux-form';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import BoxContentWrapper from '$components/content/BoxContentWrapper';
import Button from '$components/button/Button';
import CloseButton from '$components/button/CloseButton';
import FieldTypeDatePicker from '$components/form/FieldTypeDatePicker';
import FieldTypeSelect from '$components/form/FieldTypeSelect';
import FieldTypeText from '$components/form/FieldTypeText';
import FormSection from '$components/form/FormSection';
import WhiteBoxEdit from '$components/content/WhiteBoxEdit';
import {getCurrentLease, getNewInvoiceFormErrors, getNewInvoiceFormValues} from '$src/leases/selectors';
import {getAttributes as getInvoiceAttributes} from '$src/invoices/selectors';
import {getAttributeFieldOptions} from '$util/helpers';
import {genericValidator} from '$components/form/validations';

import type {Lease} from '$src/leases/types';
import type {Attributes as InvoiceAttributes} from '$src/invoices/types';

type Props = {
  errors: ?Object,
  formValues: Object,
  handleSubmit: Function,
  invoiceAttributes: InvoiceAttributes,
  lease: Lease,
  onClose: Function,
  onSave: Function,
  recipientOptions: Array<Object>,
}

const NewInvoiceForm = ({
  errors,
  formValues,
  handleSubmit,
  invoiceAttributes,
  onClose,
  onSave,
  recipientOptions,
}: Props) => {
  const receivableTypeOptions = getAttributeFieldOptions(invoiceAttributes, 'receivable_type');

  return (
    <form onSubmit={handleSubmit} className='invoice__add-bill'>
      <FormSection>
        <WhiteBoxEdit>
          <BoxContentWrapper>
            <h3>Luo uusi lasku</h3>
            <CloseButton
              className="position-topright"
              onClick={() => onClose()}
              title="Poista lasku"
            />
            <Row>
              <Column small={6} medium={4} large={2}>
                <Field
                  component={FieldTypeSelect}
                  label='Vuokralainen'
                  name='recipient'
                  options={recipientOptions}
                  validate={[
                    (value) => genericValidator(value, get(invoiceAttributes, 'recipient')),
                  ]}
                />
              </Column>
              <Column small={6} medium={4} large={2}>
                <Field
                  component={FieldTypeSelect}
                  label='Saamislaji'
                  name='receivable_type'
                  options={receivableTypeOptions}
                  validate={[
                    (value) => genericValidator(value, get(invoiceAttributes, 'receivable_type')),
                  ]}
                />
              </Column>
              <Column small={6} medium={4} large={2}>
                <Field
                  component={FieldTypeText}
                  label='Laskun pääoma'
                  name='total_amount'
                  validate={[
                    (value) => genericValidator(value, get(invoiceAttributes, 'total_amount')),
                  ]}
                />
              </Column>
              <Column small={6} medium={4} large={2}>
                <Field
                  component={FieldTypeDatePicker}
                  label='Eräpäivä'
                  name='due_date'
                  validate={[
                    (value) => genericValidator(value, get(invoiceAttributes, 'due_date')),
                  ]}
                />
              </Column>
              <Column small={6} medium={4} large={2}>
                <label className='mvj-form-field-label'>Laskutuskausi</label>
                <Row>
                  <Column small={6}>
                    <Field
                      component={FieldTypeDatePicker}
                      name='billing_period_start_date'
                      validate={[
                        (value) => genericValidator(value, get(invoiceAttributes, 'billing_period_start_date')),
                      ]}
                    />
                  </Column>
                  <Column small={6}>
                    <Field
                      component={FieldTypeDatePicker}
                      name='billing_period_end_date'
                      validate={[
                        (value) => genericValidator(value, get(invoiceAttributes, 'billing_period_end_date')),
                      ]}
                    />
                  </Column>
                </Row>
              </Column>
            </Row>
            <Row>
              <Column>
                <Field
                  component={FieldTypeText}
                  label='Tiedote'
                  name='notes'
                  validate={[
                    (value) => genericValidator(value, get(invoiceAttributes, 'notes')),
                  ]}
                />
              </Column>
            </Row>
            <Row style={{marginBottom: '10px'}}>
              <Column>
                <Button
                  className='button-green no-margin pull-right'
                  disabled={!isEmpty(errors)}
                  label='Tallenna'
                  onClick={() => onSave(formValues)}
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

const formName = 'new-invoice-form';

export default flowRight(
  connect(
    (state) => {
      return {
        errors: getNewInvoiceFormErrors(state),
        formValues: getNewInvoiceFormValues(state),
        invoiceAttributes: getInvoiceAttributes(state),
        lease: getCurrentLease(state),
      };
    }
  ),
  reduxForm({
    form: formName,
  }),
)(NewInvoiceForm);
