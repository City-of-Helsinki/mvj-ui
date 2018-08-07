// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import {getFormValues, reduxForm} from 'redux-form';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';

import BoxContentWrapper from '$components/content/BoxContentWrapper';
import Button from '$components/button/Button';
import CloseButton from '$components/button/CloseButton';
import FormField from '$components/form/FormField';
import FormSection from '$components/form/FormSection';
import WhiteBox from '$components/content/WhiteBox';
import {FormNames} from '$src/leases/enums';
import {getAttributes as getInvoiceAttributes} from '$src/invoices/selectors';

import type {Attributes as InvoiceAttributes} from '$src/invoices/types';

type Props = {
  formValues: Object,
  invoiceAttributes: InvoiceAttributes,
  onClose: Function,
  onSave: Function,
  valid: boolean,
}

const CreditInvoiceForm = ({
  formValues,
  invoiceAttributes,
  onClose,
  onSave,
  valid,
}: Props) => {
  return (
    <form className='invoice__add-invoice_form'>
      <FormSection>
        <WhiteBox>
          <BoxContentWrapper>
            <h3>Hyvitys</h3>
            <CloseButton
              className="position-topright"
              onClick={onClose}
              title="Sulje"
            />
            <Row>
              <Column small={6} medium={4} large={2}>
                <FormField
                  fieldAttributes={{
                    type: 'decimal',
                    required: false,
                    read_only: false,
                    label: 'Hyvitettävä summa',
                    decimal_places: 2,
                    max_digits: 10,
                  }}
                  name='amount'
                  unit='€'
                />
              </Column>
              <Column small={6} medium={4} large={2}>
                <FormField
                  fieldAttributes={{
                    ...get(invoiceAttributes, 'rows.child.children.receivable_type'),
                    required: get(formValues, 'amount') ? true : false,
                  }}
                  name='receivable_type'
                  overrideValues={{
                    label: 'Saamislaji',
                  }}
                />
              </Column>
            </Row>
            <Row style={{marginBottom: '10px'}}>
              <Column>
                <Button
                  className='button-green no-margin pull-right'
                  disabled={!valid}
                  label='Tallenna'
                  onClick={() => onSave(formValues)}
                  title='Tallenna'
                />
                <Button
                  className='button-red pull-right'
                  label='Peruuta'
                  onClick={onClose}
                  title='Peruuta'
                />
              </Column>
            </Row>
          </BoxContentWrapper>
        </WhiteBox>
      </FormSection>
    </form>
  );
};

const formName = FormNames.REFUND;

export default flowRight(
  connect(
    (state) => {
      return {
        formValues: getFormValues(formName)(state),
        invoiceAttributes: getInvoiceAttributes(state),
      };
    }
  ),
  reduxForm({
    form: formName,
  }),
)(CreditInvoiceForm);
