// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import {formValueSelector, getFormValues, reduxForm} from 'redux-form';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';

import BoxContentWrapper from '$components/content/BoxContentWrapper';
import Button from '$components/button/Button';
import CloseButton from '$components/button/CloseButton';
import FormField from '$components/form/FormField';
import FormSection from '$components/form/FormSection';
import WhiteBox from '$components/content/WhiteBox';
import {receiveIsCreditClicked} from '$src/invoices/actions';
import {CreditInvoiceOptions, CreditInvoiceSetOptions} from '$src/leases/constants';
import {CreditInvoiceOptionsEnum, FormNames} from '$src/leases/enums';
import {getAttributes as getInvoiceAttributes, getIsCreditClicked} from '$src/invoices/selectors';

import type {Attributes as InvoiceAttributes} from '$src/invoices/types';

type Props = {
  formValues: Object,
  invoiceAttributes: InvoiceAttributes,
  isCreditClicked: boolean,
  isInvoiceSet: boolean,
  onClose: Function,
  onSave: Function,
  receiveIsCreditClicked: Function,
  setRefForFirstField?: Function,
  type: string,
  valid: boolean,
}

const CreditInvoiceForm = ({
  formValues,
  invoiceAttributes,
  isCreditClicked,
  isInvoiceSet,
  onClose,
  onSave,
  receiveIsCreditClicked,
  setRefForFirstField,
  type,
  valid,
}: Props) => {
  const handleSave = () => {
    receiveIsCreditClicked(true);

    if(valid) {onSave(formValues);}
  };

  return (
    <form className='invoice__credit-invoice_form'>
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
                  disableTouched={isCreditClicked}
                  fieldAttributes={{
                    type: 'choice',
                    required: true,
                    label: 'Hyvityksen tyyppi',
                  }}
                  name='type'
                  setRefForField={setRefForFirstField}
                  overrideValues={{
                    options: isInvoiceSet ? CreditInvoiceSetOptions : CreditInvoiceOptions,
                  }}
                />
              </Column>
              {(type === CreditInvoiceOptionsEnum.RECEIVABLE_TYPE || type === CreditInvoiceOptionsEnum.RECEIVABLE_TYPE_AMOUNT) &&
                <Column small={6} medium={4} large={2}>
                  <FormField
                    disableTouched={isCreditClicked}
                    fieldAttributes={{
                      ...get(invoiceAttributes, 'rows.child.children.receivable_type'),
                      required: true,
                    }}
                    name='receivable_type'
                    overrideValues={{
                      label: 'Saamislaji',
                    }}
                  />
                </Column>
              }
              {type === CreditInvoiceOptionsEnum.RECEIVABLE_TYPE_AMOUNT &&
                <Column small={6} medium={4} large={2}>
                  <FormField
                    disableTouched={isCreditClicked}
                    fieldAttributes={{
                      type: 'decimal',
                      required: true,
                      read_only: false,
                      label: 'Hyvitettävä summa',
                      decimal_places: 2,
                      max_digits: 10,
                    }}
                    name='amount'
                    unit='€'
                  />
                </Column>
              }
            </Row>
            <Row>
              <Column small={12}>
                <FormField
                  disableTouched={isCreditClicked}
                  fieldAttributes={get(invoiceAttributes, 'notes')}
                  name='notes'
                  overrideValues={{
                    label: 'Tiedote',
                  }}
                />
              </Column>
            </Row>
            <Row>
              <Column>
                <div className='button-wrapper'>
                  <Button
                    className='button-red'
                    label='Peruuta'
                    onClick={onClose}
                    title='Peruuta'
                  />
                  <Button
                    className='button-green'
                    disabled={isCreditClicked && !valid}
                    label='Tallenna'
                    onClick={handleSave}
                    title='Tallenna'
                  />
                </div>
              </Column>
            </Row>
          </BoxContentWrapper>
        </WhiteBox>
      </FormSection>
    </form>
  );
};

const formName = FormNames.REFUND;
const selector = formValueSelector(formName);

export default flowRight(
  connect(
    (state) => {
      return {
        formValues: getFormValues(formName)(state),
        invoiceAttributes: getInvoiceAttributes(state),
        isCreditClicked: getIsCreditClicked(state),
        type: selector(state, 'type'),
      };
    },
    {
      receiveIsCreditClicked,
    }
  ),
  reduxForm({
    form: formName,
    initialValues: {
      type: CreditInvoiceOptionsEnum.FULL,
    },
  }),
)(CreditInvoiceForm);
