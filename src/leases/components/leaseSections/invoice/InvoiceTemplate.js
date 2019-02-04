// @flow
import React, {Fragment} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';

import AmountWithVat from '$components/vat/AmountWithVat';
import Authorization from '$components/authorization/Authorization';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import InvoiceRows from './forms/InvoiceRows';
import ListItem from '$components/content/ListItem';
import ListItems from '$components/content/ListItems';
import SubTitle from '$components/content/SubTitle';
import {
  InvoiceCreditInvoicesFieldTitles,
  InvoiceFieldPaths,
  InvoiceFieldTitles,
  InvoicePaymentsFieldPaths,
  InvoicePaymentsFieldTitles,
  InvoiceRowsFieldPaths,
  InvoiceType,
} from '$src/invoices/enums';
import {
  formatDate,
  formatDateRange,
  formatNumber,
  getFieldOptions,
  getLabelOfOption,
  isEmptyValue,
  isFieldAllowedToRead,
} from '$util/helpers';
import {getContactFullName} from '$src/contacts/helpers';
import {getAttributes as getInvoiceAttributes} from '$src/invoices/selectors';

import type {Attributes} from '$src/types';

type Props = {
  creditedInvoice: ?Object,
  invoice: ?Object,
  invoiceAttributes: Attributes,
  onCreditedInvoiceClick: Function,
}

const InvoiceTemplate = ({creditedInvoice, invoice, invoiceAttributes, onCreditedInvoiceClick}: Props) => {
  const handleCreditedInvoiceClick = () => {
    onCreditedInvoiceClick(invoice ? invoice.credited_invoice : 0);
  };

  const handleCreditedInvoiceKeyDown = (e: any) => {
    if(e.keyCode === 13) {
      handleCreditedInvoiceClick();
    }
  };

  const shouldShowOldInvoiceInfo = () => {
    return Boolean(invoice &&
      (invoice.payment_notification_date ||
        invoice.collection_charge ||
        invoice.payment_notification_catalog_date ||
        invoice.delivery_method
      ));
  };

  const receivableTypeOptions = getFieldOptions(invoiceAttributes, InvoiceRowsFieldPaths.RECEIVABLE_TYPE);
  const stateOptions = getFieldOptions(invoiceAttributes, InvoiceFieldPaths.STATE);
  const deliveryMethodOptions = getFieldOptions(invoiceAttributes, InvoiceFieldPaths.DELIVERY_METHOD);
  const typeOptions = getFieldOptions(invoiceAttributes, InvoiceFieldPaths.TYPE);
  const payments = invoice ? invoice.payments : [];
  const creditInvoices = invoice ? invoice.credit_invoices : [];
  const rows = invoice ? invoice.rows : [];
  const showOldInvoiceInfo = shouldShowOldInvoiceInfo();

  return (
    <Fragment>
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
            <FormTextTitle>{InvoiceFieldTitles.DUE_DATE}</FormTextTitle>
            <FormText>{(invoice && formatDate(invoice.due_date)) || '-'}</FormText>
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
          <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.BILLING_PERIOD_END_DATE) || isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.BILLING_PERIOD_START_DATE)}>
            <FormTextTitle>{InvoiceFieldTitles.BILLING_PERIOD}</FormTextTitle>
            <FormText>{(invoice && formatDateRange(invoice.billing_period_start_date, invoice.billing_period_end_date)) || '-'}</FormText>
          </Authorization>
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

      {invoice && invoice.type !== InvoiceType.CREDIT_NOTE &&
        <Fragment>
          <SubTitle>{InvoicePaymentsFieldTitles.PAYMENTS}</SubTitle>
          <Row>
            <Column small={12} medium={8}>
              <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoicePaymentsFieldPaths.PAYMENTS)}>

                {!payments.length && <FormText>Ei maksuja</FormText>}
                {!!payments.length &&
                  <ListItems>
                    <Row>
                      <Column small={6}>
                        <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoicePaymentsFieldPaths.PAID_AMOUNT)}>
                          <FormTextTitle>{InvoicePaymentsFieldTitles.PAID_AMOUNT}</FormTextTitle>
                        </Authorization>
                      </Column>
                      <Column small={6}>
                        <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoicePaymentsFieldPaths.PAID_DATE)}>
                          <FormTextTitle>{InvoicePaymentsFieldTitles.PAID_DATE}</FormTextTitle>
                        </Authorization>
                      </Column>
                    </Row>
                    {payments.map((payment) => {
                      return (
                        <Row key={payment.id}>
                          <Column small={6}>
                            <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoicePaymentsFieldPaths.PAID_AMOUNT)}>
                              <ListItem>{payment.paid_amount
                                ? <AmountWithVat amount={payment.paid_amount} date={invoice ? invoice.due_date : null} />
                                : '-'}
                              </ListItem>
                            </Authorization>
                          </Column>
                          <Column small={6}>
                            <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoicePaymentsFieldPaths.PAID_DATE)}>
                              <ListItem>{formatDate(payment.paid_date) || '-'}</ListItem>
                            </Authorization>
                          </Column>
                        </Row>
                      );
                    })}
                  </ListItems>
                }
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
        </Fragment>
      }
      {showOldInvoiceInfo &&
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
      }

      <Row>
        <Column small={4}>
          {showOldInvoiceInfo &&
            <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.DELIVERY_METHOD)}>
              <FormTextTitle>{InvoiceFieldTitles.DELIVERY_METHOD}</FormTextTitle>
              <FormText>{(invoice && getLabelOfOption(deliveryMethodOptions, invoice.delivery_method)) || '-'}</FormText>
            </Authorization>
          }
        </Column>
        <Column small={4}>
          <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.TYPE)}>
            <FormTextTitle>{InvoiceFieldTitles.TYPE}</FormTextTitle>
            <FormText>{(invoice && getLabelOfOption(typeOptions, invoice.type)) || '-'}</FormText>
          </Authorization>
        </Column>
        {creditedInvoice &&
          <Column small={4}>
            <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.CREDITED_INVOICE)}>
              <FormTextTitle>{InvoiceFieldTitles.CREDITED_INVOICE}</FormTextTitle>
              <FormText>{<a
                className='no-margin'
                onKeyDown={handleCreditedInvoiceKeyDown}
                onClick={handleCreditedInvoiceClick}
                tabIndex={0}>{creditedInvoice.number ? creditedInvoice.number : 'Numeroimaton'}</a>}</FormText>
            </Authorization>
          </Column>
        }
      </Row>
      <Row>
        <Column small={12}>
          <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.NOTES)}>
            <FormTextTitle>{InvoiceFieldTitles.NOTES}</FormTextTitle>
            <FormText>{(invoice && invoice.notes) || '-'}</FormText>
          </Authorization>
        </Column>
      </Row>

      <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.CREDITED_INVOICE)}>
        {!!creditInvoices.length &&
          <Fragment>
            <SubTitle>{InvoiceCreditInvoicesFieldTitles.CREDIT_INVOICES}</SubTitle>

            {!!creditInvoices.length &&
              <Fragment>
                <Row>
                  <Column small={4}>
                    <FormTextTitle>{InvoiceCreditInvoicesFieldTitles.NUMBER}</FormTextTitle>
                  </Column>
                  <Column small={4}>
                    <FormTextTitle>{InvoiceCreditInvoicesFieldTitles.TOTAL_AMOUNT}</FormTextTitle>
                  </Column>
                  <Column small={4}>
                    <FormTextTitle>{InvoiceCreditInvoicesFieldTitles.DUE_DATE}</FormTextTitle>
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
                        <FormText>
                          <a
                            className='no-margin'
                            onKeyDown={handleCreditInvoiceKeyDown}
                            onClick={handleCreditInvoiceClick}
                            tabIndex={0}>{item.number ? item.number : 'Numeroimaton'}</a>
                        </FormText>
                      </Column>
                      <Column small={4}>
                        <FormText><AmountWithVat amount={item.total_amount} date={item.due_date} /></FormText>
                      </Column>
                      <Column small={4}>
                        <FormText>{formatDate(item.due_date)}</FormText>
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
        <InvoiceRows
          invoiceAttributes={invoiceAttributes}
          invoiceDate={invoice ? invoice.date : null}
          invoiceDueDate={invoice ? invoice.due_date : null}
          receivableTypeOptions={receivableTypeOptions}
          rows={rows}
        />
      </Authorization>
    </Fragment>
  );
};

export default flowRight(
  connect(
    (state) => {
      return {
        invoiceAttributes: getInvoiceAttributes(state),
      };
    },
  )
)(InvoiceTemplate);
