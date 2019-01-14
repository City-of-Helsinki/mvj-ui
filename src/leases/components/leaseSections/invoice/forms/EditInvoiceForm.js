// @flow
import React, {Fragment} from 'react';
import {Row, Column} from 'react-foundation';
import {connect} from 'react-redux';
import {FieldArray, reduxForm} from 'redux-form';
import flowRight from 'lodash/flowRight';
import type {Element} from 'react';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import AddButtonThird from '$components/form/AddButtonThird';
import AmountWithVat from '$components/vat/AmountWithVat';
import Authorization from '$components/authorization/Authorization';
import FieldAndRemoveButtonWrapper from '$components/form/FieldAndRemoveButtonWrapper';
import FormField from '$components/form/FormField';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import InvoiceRowsEdit from './InvoiceRowsEdit';
import RemoveButton from '$components/form/RemoveButton';
import SubTitle from '$components/content/SubTitle';
import {ButtonColors} from '$components/enums';
import {
  InvoiceCreditInvoicesFieldPaths,
  InvoiceCreditInvoicesFieldTitles,
  InvoiceFieldPaths,
  InvoiceFieldTitles,
  InvoicePaymentsFieldPaths,
  InvoicePaymentsFieldTitles,
  InvoiceRowsFieldPaths,
} from '$src/invoices/enums';
import {DeleteModalLabels, DeleteModalTitles, FormNames} from '$src/leases/enums';
import {validateInvoiceForm} from '$src/leases/formValidators';
import {getContactFullName} from '$src/contacts/helpers';
import {getInvoiceTenantOptions} from '$src/leases/helpers';
import {
  formatDate,
  formatNumber,
  getFieldAttributes,
  getFieldOptions,
  getLabelOfOption,
  isEmptyValue,
  isFieldAllowedToEdit,
  isFieldAllowedToRead,
  isFieldRequired,
} from '$util/helpers';
import {getAttributes as getInvoiceAttributes, getIsEditClicked} from '$src/invoices/selectors';
import {getCurrentLease} from '$src/leases/selectors';

import type {Attributes} from '$src/types';
import type {Lease} from '$src/leases/types';

type PaymentsProps = {
  attributes: Attributes,
  fields: any,
  isEditClicked: boolean,
}

const renderPayments = ({attributes, fields, isEditClicked}: PaymentsProps): Element<*> => {
  const handleAdd = () => fields.push({});

  return (
    <AppConsumer>
      {({dispatch}) => {
        return(
          <Fragment>
            {!fields || !fields.length && <FormText>Ei maksuja</FormText>}

            {fields && !!fields.length &&
              <Row>
                <Column small={6}>
                  <FormTextTitle required={isFieldRequired(attributes, InvoicePaymentsFieldPaths.PAID_AMOUNT)}>
                    {InvoicePaymentsFieldTitles.PAID_AMOUNT}
                  </FormTextTitle>
                </Column>
                <Column small={6}>
                  <FormTextTitle required={isFieldRequired(attributes, InvoicePaymentsFieldPaths.PAID_DATE)}>
                    {InvoicePaymentsFieldTitles.PAID_DATE}
                  </FormTextTitle>
                </Column>
              </Row>
            }
            {fields && !!fields.length && fields.map((payment, index) => {
              const handleRemove = () => {
                dispatch({
                  type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                  confirmationFunction: () => {
                    fields.remove(index);
                  },
                  confirmationModalButtonClassName: ButtonColors.ALERT,
                  confirmationModalButtonText: 'Poista',
                  confirmationModalLabel: DeleteModalLabels.INVOICE_PAYMENT,
                  confirmationModalTitle: DeleteModalTitles.INVOICE_PAYMENT,
                });
              };

              return (
                <Row key={index}>
                  <Column small={6}>
                    <Authorization allow={isFieldAllowedToRead(attributes, InvoicePaymentsFieldPaths.PAID_AMOUNT)}>
                      <FormField
                        disableTouched={isEditClicked}
                        fieldAttributes={getFieldAttributes(attributes, InvoicePaymentsFieldPaths.PAID_AMOUNT)}
                        invisibleLabel
                        name={`${payment}.paid_amount`}
                        unit='€'
                        overrideValues={{label: InvoicePaymentsFieldTitles.PAID_AMOUNT}}
                      />
                    </Authorization>
                  </Column>
                  <Column small={6}>
                    <FieldAndRemoveButtonWrapper
                      field={
                        <Authorization allow={isFieldAllowedToRead(attributes, InvoicePaymentsFieldPaths.PAID_DATE)}>
                          <FormField
                            disableTouched={isEditClicked}
                            fieldAttributes={getFieldAttributes(attributes, InvoicePaymentsFieldPaths.PAID_DATE)}
                            invisibleLabel
                            name={`${payment}.paid_date`}
                            overrideValues={{label: InvoicePaymentsFieldTitles.PAID_DATE}}
                          />
                        </Authorization>
                      }
                      removeButton={
                        <Authorization allow={isFieldAllowedToEdit(attributes, InvoicePaymentsFieldPaths.PAYMENTS)}>
                          <RemoveButton
                            className='third-level'
                            onClick={handleRemove}
                            title="Poista maksu"
                          />
                        </Authorization>
                      }
                    />
                  </Column>
                </Row>
              );
            })}

            <Authorization allow={isFieldAllowedToEdit(attributes, InvoicePaymentsFieldPaths.PAYMENTS)}>
              <Row>
                <Column>
                  <AddButtonThird
                    label='Lisää maksu'
                    onClick={handleAdd}
                  />
                </Column>
              </Row>
            </Authorization>
          </Fragment>
        );
      }}
    </AppConsumer>
  );
};

type Props = {
  creditedInvoice: ?Object,
  handleSubmit: Function,
  invoice: ?Object,
  invoiceAttributes: Attributes,
  isEditClicked: boolean,
  lease: Lease,
  onCreditedInvoiceClick: Function,
}

const EditInvoiceForm = ({
  creditedInvoice,
  handleSubmit,
  invoice,
  invoiceAttributes,
  isEditClicked,
  lease,
  onCreditedInvoiceClick,
}: Props) => {
  const handleCreditedInvoiceClick = () => {
    if(invoice) {
      onCreditedInvoiceClick(invoice.credited_invoice);
    }
  };

  const handleCreditedInvoiceKeyDown = (e: any) => {
    if(e.keyCode === 13) {
      handleCreditedInvoiceClick();
    }
  };

  const stateOptions = getFieldOptions(invoiceAttributes, InvoiceFieldPaths.STATE);
  const tenantOptions = getInvoiceTenantOptions(lease);
  const deliveryMethodOptions = getFieldOptions(invoiceAttributes, InvoiceFieldPaths.DELIVERY_METHOD);
  const typeOptions = getFieldOptions(invoiceAttributes, InvoiceFieldPaths.TYPE);
  const creditInvoices = invoice ? invoice.credit_invoices : [];

  return (
    <form onSubmit={handleSubmit}>
      <Row>
        <Column small={12}>
          <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.RECIPIENT)}>
            <FormTextTitle>{InvoiceFieldTitles.RECIPIENT}</FormTextTitle>
            <FormText>{invoice ? getContactFullName(invoice.recipientFull) : '-'}</FormText>
          </Authorization>
        </Column>
      </Row>
      <Row>
        <Column small={4}>
          <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.NUMBER)}>
            <FormTextTitle>{InvoiceFieldTitles.NUMBER}</FormTextTitle>
            <FormText>{(invoice && invoice.number) || '-'}</FormText>
          </Authorization>
        </Column>
        <Column small={4}>
          <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.SENT_TO_SAP_AT)}>
            <FormTextTitle>{InvoiceFieldTitles.SENT_TO_SAP_AT}</FormTextTitle>
            <FormText>{(invoice && formatDate(invoice.sent_to_sap_at)) || '-'}</FormText>
          </Authorization>
        </Column>
        <Column small={4}>
          <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.SAP_ID)}>
            <FormTextTitle>{InvoiceFieldTitles.SAP_ID}</FormTextTitle>
            <FormText>{(invoice && invoice.sap_id) || '-'}</FormText>
          </Authorization>
        </Column>
      </Row>
      <Row>
        <Column small={4}>
          <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.DUE_DATE)}>
            <FormField
              disableTouched={isEditClicked}
              fieldAttributes={getFieldAttributes(invoiceAttributes, InvoiceFieldPaths.DUE_DATE)}
              name='due_date'
              overrideValues={{label: InvoiceFieldTitles.DUE_DATE}}
            />
          </Authorization>
        </Column>
        <Column small={4}>
          <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.ADJUSTED_DUE_DATE)}>
            <FormTextTitle>{InvoiceFieldTitles.ADJUSTED_DUE_DATE}</FormTextTitle>
            <FormText>{(invoice && formatDate(invoice.adjusted_due_date)) || '-'}</FormText>
          </Authorization>
        </Column>
        <Column small={4}>
          <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.INVOICING_DATE)}>
            <FormTextTitle>{InvoiceFieldTitles.INVOICING_DATE}</FormTextTitle>
            <FormText>{(invoice && formatDate(invoice.invoicing_date)) || '-'}</FormText>
          </Authorization>
        </Column>
      </Row>
      <Row>
        <Column small={4}>
          <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.STATE)}>
            <FormTextTitle>{InvoiceFieldTitles.STATE}</FormTextTitle>
            <FormText>{(invoice && getLabelOfOption(stateOptions, invoice.state)) || '-'}</FormText>
          </Authorization>
        </Column>
        <Column small={4}>
          <Row>
            <Column>
              <FormTextTitle required={isFieldRequired(invoiceAttributes, InvoiceFieldPaths.BILLING_PERIOD_END_DATE) || isFieldRequired(invoiceAttributes, InvoiceFieldPaths.BILLING_PERIOD_END_DATE)}>
                {InvoiceFieldTitles.BILLING_PERIOD}
              </FormTextTitle>
            </Column>
          </Row>
          <Row>
            <Column small={6}>
              <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.BILLING_PERIOD_START_DATE)}>
                <FormField
                  disableTouched={isEditClicked}
                  fieldAttributes={getFieldAttributes(invoiceAttributes, InvoiceFieldPaths.BILLING_PERIOD_START_DATE)}
                  invisibleLabel
                  name='billing_period_start_date'
                  overrideValues={{label: InvoiceFieldTitles.BILLING_PERIOD_START_DATE}}
                />
              </Authorization>
            </Column>
            <Column small={6}>
              <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.BILLING_PERIOD_END_DATE)}>
                <FormField
                  disableTouched={isEditClicked}
                  fieldAttributes={getFieldAttributes(invoiceAttributes, InvoiceFieldPaths.BILLING_PERIOD_END_DATE)}
                  invisibleLabel
                  name='billing_period_end_date'
                  overrideValues={{label: InvoiceFieldTitles.BILLING_PERIOD_END_DATE}}
                />
              </Authorization>
            </Column>
          </Row>
        </Column>
        <Column small={4}>
          <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.POSTPONE_DATE)}>
            <FormTextTitle>{InvoiceFieldTitles.POSTPONE_DATE}</FormTextTitle>
            <FormText>{(invoice && formatDate(invoice.postpone_date)) || '-'}</FormText>
          </Authorization>
        </Column>
      </Row>
      <Row>
        <Column small={4}>
          <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.TOTAL_AMOUNT)}>
            <FormTextTitle>{InvoiceFieldTitles.TOTAL_AMOUNT}</FormTextTitle>
            <FormText>{invoice && !isEmptyValue(invoice.total_amount)
              ? <AmountWithVat amount={invoice.total_amount} date={invoice.due_date} />
              : '-'}</FormText>
          </Authorization>
        </Column>
        <Column small={4}>
          <FormTextTitle>{InvoiceFieldTitles.SHARE}</FormTextTitle>
          <FormText>{invoice && !isEmptyValue(invoice.totalShare) ? `${formatNumber(invoice.totalShare * 100)} %` : '-'}</FormText>
        </Column>
        <Column small={4}>
          <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.BILLED_AMOUNT)}>
            <FormTextTitle>{InvoiceFieldTitles.BILLED_AMOUNT}</FormTextTitle>
            <FormText>{invoice && !isEmptyValue(invoice.billed_amount)
              ? <AmountWithVat amount={invoice.billed_amount} date={invoice.due_date} />
              : '-'}
            </FormText>
          </Authorization>
        </Column>
      </Row>

      <SubTitle>{InvoicePaymentsFieldTitles.PAYMENTS}</SubTitle>
      <Row>
        <Column small={12} medium={8}>
          <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoicePaymentsFieldPaths.PAYMENTS)}>
            <FieldArray
              attributes={invoiceAttributes}
              component={renderPayments}
              isEditClicked={isEditClicked}
              name='payments'
            />
          </Authorization>
        </Column>
        <Column small={6} medium={4}>
          <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.OUTSTANDING_AMOUNT)}>
            <FormTextTitle>{InvoiceFieldTitles.OUTSTANDING_AMOUNT}</FormTextTitle>
            <FormText>{invoice && !isEmptyValue(invoice.outstanding_amount)
              ? <AmountWithVat amount={invoice.outstanding_amount} date={invoice.due_date} />
              : '-'}
            </FormText>
          </Authorization>
        </Column>
      </Row>
      <Row>
        <Column small={4}>
          <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.PAYMENT_NOTIFICATION_DATE)}>
            <FormTextTitle>{InvoiceFieldTitles.PAYMENT_NOTIFICATION_DATE}</FormTextTitle>
            <FormText>{(invoice && formatDate(invoice.payment_notification_date)) || '-'}</FormText>
          </Authorization>
        </Column>
        <Column small={4}>
          <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.COLLECTION_CHARGE)}>
            <FormTextTitle>{InvoiceFieldTitles.COLLECTION_CHARGE}</FormTextTitle>
            <FormText>{invoice && !isEmptyValue(invoice.collection_charge) ? `${formatNumber(invoice.collection_charge)} €` : '-'}</FormText>
          </Authorization>
        </Column>
        <Column small={4}>
          <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.PAYMENT_NOTIFICATION_CATALOG_DATE)}>
            <FormTextTitle>{InvoiceFieldTitles.PAYMENT_NOTIFICATION_CATALOG_DATE}</FormTextTitle>
            <FormText>{(invoice && formatDate(invoice.payment_notification_catalog_date)) || '-'}</FormText>
          </Authorization>
        </Column>
      </Row>
      <Row>
        <Column small={4}>
          <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.DELIVERY_METHOD)}>
            <FormTextTitle>{InvoiceFieldTitles.DELIVERY_METHOD}</FormTextTitle>
            <FormText>{(invoice && getLabelOfOption(deliveryMethodOptions, invoice.delivery_method)) || '-'}</FormText>
          </Authorization>
        </Column>
        <Column small={4}>
          <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.TYPE)}>
            <FormTextTitle>{InvoiceFieldTitles.TYPE}</FormTextTitle>
            <FormText>{(invoice && getLabelOfOption(typeOptions, invoice.type)) || '-'}</FormText>
          </Authorization>
        </Column>
        {(creditedInvoice && !!creditedInvoice.number) &&
          <Column small={4}>
            <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.CREDITED_INVOICE)}>
              <FormTextTitle>{InvoiceFieldTitles.CREDITED_INVOICE}</FormTextTitle>
              <FormText>{<a className='no-margin' onKeyDown={handleCreditedInvoiceKeyDown} onClick={handleCreditedInvoiceClick} tabIndex={0}>{creditedInvoice.number}</a>}</FormText>
            </Authorization>
          </Column>
        }
      </Row>
      <Row>
        <Column small={12}>
          <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.NOTES)}>
            <FormField
              disableTouched={isEditClicked}
              fieldAttributes={getFieldAttributes(invoiceAttributes, InvoiceFieldPaths.NOTES)}
              name='notes'
              overrideValues={{
                label: InvoiceFieldTitles.NOTES,
                fieldType: 'textarea',
              }}
            />
          </Authorization>
        </Column>
      </Row>

      <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceCreditInvoicesFieldPaths.CREDIT_INVOICES)}>
        {!!creditInvoices.length &&
          <Fragment>
            <SubTitle>{InvoiceCreditInvoicesFieldTitles.CREDIT_INVOICES}</SubTitle>

            {!!creditInvoices.length &&
              <Fragment>
                <Row>
                  <Column small={4}>
                    <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceCreditInvoicesFieldPaths.NUMBER)}>
                      <FormTextTitle>{InvoiceCreditInvoicesFieldTitles.NUMBER}</FormTextTitle>
                    </Authorization>
                  </Column>
                  <Column small={4}>
                    <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceCreditInvoicesFieldPaths.TOTAL_AMOUNT)}>
                      <FormTextTitle>{InvoiceCreditInvoicesFieldTitles.TOTAL_AMOUNT}</FormTextTitle>
                    </Authorization>
                  </Column>
                  <Column small={4}>
                    <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceCreditInvoicesFieldPaths.DUE_DATE)}>
                      <FormTextTitle>{InvoiceCreditInvoicesFieldTitles.DUE_DATE}</FormTextTitle>
                    </Authorization>
                  </Column>
                </Row>

                {creditInvoices.map((item) => {
                  const handleCreditInvoiceClick = () => {
                    onCreditedInvoiceClick(item.id);
                  };

                  const handleCreditInvoiceKeyDown = (e: any) => {
                    if(e.keyCode === 13) {
                      handleCreditInvoiceClick();
                    }
                  };

                  return (
                    <Row key={item.id}>
                      <Column small={4}>
                        <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceCreditInvoicesFieldPaths.NUMBER)}>
                          <FormText>
                            {item.number
                              ? <a className='no-margin' onKeyDown={handleCreditInvoiceKeyDown} onClick={handleCreditInvoiceClick} tabIndex={0}>{item.number}</a>
                              : '-'
                            }
                          </FormText>
                        </Authorization>
                      </Column>
                      <Column small={4}>
                        <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceCreditInvoicesFieldPaths.TOTAL_AMOUNT)}>
                          <FormText><AmountWithVat amount={item.total_amount} date={item.due_date} /></FormText>
                        </Authorization>
                      </Column>
                      <Column small={4}>
                        <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceCreditInvoicesFieldPaths.DUE_DATE)}>
                          <FormText>{formatDate(item.due_date)}</FormText>
                        </Authorization>
                      </Column>
                    </Row>
                  );
                })}
              </Fragment>
            }
          </Fragment>
        }
      </Authorization>

      <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceRowsFieldPaths.ROWS)}>
        <FieldArray
          component={InvoiceRowsEdit}
          name='rows'
          isEditClicked={isEditClicked}
          tenantOptions={tenantOptions}
        />
      </Authorization>
    </form>
  );
};

const formName = FormNames.INVOICE_EDIT;

export default flowRight(
  connect(
    (state) => {
      return {
        invoiceAttributes: getInvoiceAttributes(state),
        isEditClicked: getIsEditClicked(state),
        lease: getCurrentLease(state),
      };
    },
  ),
  reduxForm({
    form: formName,
    validate: validateInvoiceForm,
  }),
)(EditInvoiceForm);
