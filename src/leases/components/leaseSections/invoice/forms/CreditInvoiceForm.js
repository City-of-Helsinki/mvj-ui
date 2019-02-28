// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import {formValueSelector, getFormValues, reduxForm} from 'redux-form';
import flowRight from 'lodash/flowRight';

import Authorization from '$components/authorization/Authorization';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import Button from '$components/button/Button';
import CloseButton from '$components/button/CloseButton';
import FormField from '$components/form/FormField';
import WhiteBox from '$components/content/WhiteBox';
import {receiveIsCreditClicked} from '$src/invoices/actions';
import {CreditInvoiceOptions, CreditInvoiceSetOptions} from '$src/leases/constants';
import {ButtonColors} from '$components/enums';
import {
  InvoiceFieldPaths,
  InvoiceFieldTitles,
  InvoiceRowsFieldPaths,
  InvoiceRowsFieldTitles,
} from '$src/invoices/enums';
import {CreditInvoiceOptionsEnum, FormNames} from '$src/leases/enums';
import {getUiDataCreditInvoiceKey} from '$src/uiData/helpers';
import {
  addEmptyOption,
  getFieldAttributes,
  getFieldOptions,
  getLabelOfOption,
  isFieldAllowedToEdit,
  sortByLabelAsc,
} from '$util/helpers';
import {getAttributes as getInvoiceAttributes, getIsCreditClicked} from '$src/invoices/selectors';

import type {Attributes} from '$src/types';

type Props = {
  formValues: Object,
  invoiceAttributes: Attributes,
  invoiceToCredit: Object,
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
  invoiceToCredit,
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

    if(valid) {
      onSave(formValues);
    }
  };

  const getReceivableTypeOptions = () => {
    const receivableTypes = [];

    if(!invoiceToCredit) return receivableTypes;

    const receivableTypeOptions = getFieldOptions(invoiceAttributes, InvoiceRowsFieldPaths.RECEIVABLE_TYPE);

    const addInvoiceReceivableTypes = (invoice: Object) => {
      invoice.rows.forEach((row) => {
        if(receivableTypes.findIndex((item) => item.value === row.receivable_type) === -1) {
          receivableTypes.push({
            value: row.receivable_type,
            label: getLabelOfOption(receivableTypeOptions, row.receivable_type),
          });
        }
      });
    };

    if(isInvoiceSet) {
      invoiceToCredit.tableRows.forEach((invoice) => {
        addInvoiceReceivableTypes(invoice);
      });
    } else {
      addInvoiceReceivableTypes(invoiceToCredit);
    }

    return addEmptyOption(receivableTypes.sort(sortByLabelAsc));
  };

  const receivableTypeOptions = getReceivableTypeOptions();

  return (
    <form className='invoice__credit-invoice_form'>
      <WhiteBox>
        <BoxContentWrapper>
          <h3>Hyvitys</h3>
          <CloseButton className="position-topright" onClick={onClose} />

          <Row>
            <Column small={6} medium={4} large={2}>
              <FormField
                disableTouched={isCreditClicked}
                fieldAttributes={{
                  type: 'choice',
                  required: true,
                  label: 'Hyvityksen tyyppi',
                  read_only: false,
                }}
                name='type'
                setRefForField={setRefForFirstField}
                overrideValues={{options: isInvoiceSet ? CreditInvoiceSetOptions : CreditInvoiceOptions}}
                enableUiDataEdit
                uiDataKey={getUiDataCreditInvoiceKey('type')}
              />
            </Column>
            {(type === CreditInvoiceOptionsEnum.RECEIVABLE_TYPE || type === CreditInvoiceOptionsEnum.RECEIVABLE_TYPE_AMOUNT) &&
              <Column small={6} medium={4} large={2}>
                <Authorization allow={isFieldAllowedToEdit(invoiceAttributes, InvoiceRowsFieldPaths.RECEIVABLE_TYPE)}>
                  <FormField
                    disableTouched={isCreditClicked}
                    fieldAttributes={{
                      ...getFieldAttributes(invoiceAttributes, InvoiceRowsFieldPaths.RECEIVABLE_TYPE),
                      read_only: false,
                      required: true,
                    }}
                    name='receivable_type'
                    overrideValues={{
                      label: InvoiceRowsFieldTitles.RECEIVABLE_TYPE,
                      options: receivableTypeOptions,
                    }}
                    enableUiDataEdit
                    uiDataKey={getUiDataCreditInvoiceKey(InvoiceRowsFieldPaths.RECEIVABLE_TYPE)}
                  />
                </Authorization>
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
                    label: 'Hyvitettävä summa (alviton)',
                    decimal_places: 2,
                    max_digits: 10,
                  }}
                  name='amount'
                  unit='€'
                  enableUiDataEdit
                  tooltipStyle={{right: 12}}
                  uiDataKey={getUiDataCreditInvoiceKey('amount')}
                />
              </Column>
            }
          </Row>
          <Row>
            <Column small={12}>
              <Authorization allow={isFieldAllowedToEdit(invoiceAttributes, InvoiceFieldPaths.NOTES)}>
                <FormField
                  disableTouched={isCreditClicked}
                  fieldAttributes={getFieldAttributes(invoiceAttributes, InvoiceFieldPaths.NOTES)}
                  name='notes'
                  overrideValues={{label: InvoiceFieldTitles.NOTES}}
                  enableUiDataEdit
                  uiDataKey={getUiDataCreditInvoiceKey(InvoiceFieldPaths.NOTES)}
                />
              </Authorization>
            </Column>
          </Row>
          <Row>
            <Column>
              <div className='button-wrapper'>
                <Button
                  className={ButtonColors.SECONDARY}
                  onClick={onClose}
                  text='Peruuta'
                />
                <Button
                  className={ButtonColors.SUCCESS}
                  disabled={isCreditClicked && !valid}
                  onClick={handleSave}
                  text='Tallenna'
                />
              </div>
            </Column>
          </Row>
        </BoxContentWrapper>
      </WhiteBox>
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
