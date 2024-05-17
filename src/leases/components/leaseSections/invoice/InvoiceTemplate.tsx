import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Row, Column } from "react-foundation";
import flowRight from "lodash/flowRight";
import AmountWithVat from "src/components/vat/AmountWithVat";
import Authorization from "src/components/authorization/Authorization";
import FormText from "src/components/form/FormText";
import FormTextTitle from "src/components/form/FormTextTitle";
import InvoiceRows from "./forms/InvoiceRows";
import ListItem from "src/components/content/ListItem";
import ListItems from "src/components/content/ListItems";
import SubTitle from "src/components/content/SubTitle";
import { InvoiceCreditInvoicesFieldPaths, InvoiceCreditInvoicesFieldTitles, InvoiceFieldPaths, InvoiceFieldTitles, InvoiceInterestInvoicesFieldPaths, InvoiceInterestInvoicesFieldTitles, InvoicePaymentsFieldPaths, InvoicePaymentsFieldTitles, InvoiceRowsFieldPaths, InvoiceType } from "src/invoices/enums";
import { getUiDataInvoiceKey } from "src/uiData/helpers";
import { formatDate, formatDateRange, formatNumber, getFieldOptions, getLabelOfOption, isEmptyValue, isFieldAllowedToRead } from "src/util/helpers";
import { getContactFullName } from "src/contacts/helpers";
import { getAttributes as getInvoiceAttributes } from "src/invoices/selectors";
import type { Attributes } from "src/types";
type Props = {
  creditedInvoice: Record<string, any> | null | undefined;
  interestInvoiceFor: Record<string, any> | null | undefined;
  invoice: Record<string, any> | null | undefined;
  invoiceAttributes: Attributes;
  onInvoiceLinkClick: (...args: Array<any>) => any;
  relativeTo?: any;
};

const InvoiceTemplate = ({
  creditedInvoice,
  interestInvoiceFor,
  invoice,
  invoiceAttributes,
  onInvoiceLinkClick,
  relativeTo
}: Props) => {
  const handleCreditedInvoiceClick = () => {
    onInvoiceLinkClick(invoice ? invoice.credited_invoice : 0);
  };

  const handleCreditedInvoiceKeyDown = (e: any) => {
    if (e.keyCode === 13) {
      handleCreditedInvoiceClick();
    }
  };

  const handleInterestInvoiceForClick = () => {
    onInvoiceLinkClick(invoice ? invoice.interest_invoice_for : 0);
  };

  const handleInterestInvoiceForKeyDown = (e: any) => {
    if (e.keyCode === 13) {
      handleInterestInvoiceForClick();
    }
  };

  const shouldShowOldInvoiceInfo = () => {
    return Boolean(invoice && (invoice.payment_notification_date || invoice.collection_charge || invoice.payment_notification_catalog_date || invoice.delivery_method));
  };

  const receivableTypeOptions = getFieldOptions(invoiceAttributes, InvoiceRowsFieldPaths.RECEIVABLE_TYPE);
  const stateOptions = getFieldOptions(invoiceAttributes, InvoiceFieldPaths.STATE);
  const deliveryMethodOptions = getFieldOptions(invoiceAttributes, InvoiceFieldPaths.DELIVERY_METHOD);
  const typeOptions = getFieldOptions(invoiceAttributes, InvoiceFieldPaths.TYPE);
  const payments = invoice ? invoice.payments : [];
  const creditInvoices = invoice ? invoice.credit_invoices : [];
  const interestInvoices = invoice ? invoice.interest_invoices : [];
  const rows = invoice ? invoice.rows : [];
  const showOldInvoiceInfo = shouldShowOldInvoiceInfo();
  return <Fragment>
      <Row>
        <Column small={8}>
          <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.RECIPIENT)}>
            <FormTextTitle enableUiDataEdit relativeTo={relativeTo} uiDataKey={getUiDataInvoiceKey(InvoiceFieldPaths.RECIPIENT)}>
              {InvoiceFieldTitles.RECIPIENT}
            </FormTextTitle>
            <FormText>{invoice ? getContactFullName(invoice.recipientFull) : '-'}</FormText>
          </Authorization>
        </Column>
        <Column small={4}>
          <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.NUMBER)}>
            <FormTextTitle enableUiDataEdit relativeTo={relativeTo} uiDataKey={getUiDataInvoiceKey(InvoiceFieldPaths.NUMBER)}>
              {InvoiceFieldTitles.NUMBER}
            </FormTextTitle>
            <FormText>{invoice && invoice.number || '-'}</FormText>
          </Authorization>
        </Column>
      </Row>
      <Row>
        <Column small={4}>
          <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.SENT_TO_SAP_AT)}>
            <FormTextTitle enableUiDataEdit relativeTo={relativeTo} uiDataKey={getUiDataInvoiceKey(InvoiceFieldPaths.SENT_TO_SAP_AT)}>
              {InvoiceFieldTitles.SENT_TO_SAP_AT}
            </FormTextTitle>
            <FormText>{invoice && formatDate(invoice.sent_to_sap_at) || '-'}</FormText>
          </Authorization>
        </Column>
      </Row>
      <Row>
        <Column small={4}>
          <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.DUE_DATE)}>
            <FormTextTitle enableUiDataEdit relativeTo={relativeTo} uiDataKey={getUiDataInvoiceKey(InvoiceFieldPaths.DUE_DATE)}>
              {InvoiceFieldTitles.DUE_DATE}
            </FormTextTitle>
            <FormText>{invoice && formatDate(invoice.due_date) || '-'}</FormText>
          </Authorization>
        </Column>
        <Column small={4}>
          <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.ADJUSTED_DUE_DATE)}>
            <FormTextTitle enableUiDataEdit relativeTo={relativeTo} uiDataKey={getUiDataInvoiceKey(InvoiceFieldPaths.ADJUSTED_DUE_DATE)}>
              {InvoiceFieldTitles.ADJUSTED_DUE_DATE}
            </FormTextTitle>
            <FormText>{invoice && formatDate(invoice.adjusted_due_date) || '-'}</FormText>
          </Authorization>
        </Column>
        <Column small={4}>
          <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.INVOICING_DATE)}>
            <FormTextTitle enableUiDataEdit relativeTo={relativeTo} uiDataKey={getUiDataInvoiceKey(InvoiceFieldPaths.INVOICING_DATE)}>
              {InvoiceFieldTitles.INVOICING_DATE}
            </FormTextTitle>
            <FormText>{invoice && formatDate(invoice.invoicing_date) || '-'}</FormText>
          </Authorization>
        </Column>
      </Row>
      <Row>
        <Column small={4}>
          <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.STATE)}>
            <FormTextTitle enableUiDataEdit relativeTo={relativeTo} uiDataKey={getUiDataInvoiceKey(InvoiceFieldPaths.STATE)}>
              {InvoiceFieldTitles.STATE}
            </FormTextTitle>
            <FormText>{invoice && getLabelOfOption(stateOptions, invoice.state) || '-'}</FormText>
          </Authorization>
        </Column>
        <Column small={4}>
          <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.BILLING_PERIOD_END_DATE) || isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.BILLING_PERIOD_START_DATE)}>
            <FormTextTitle enableUiDataEdit relativeTo={relativeTo} uiDataKey={getUiDataInvoiceKey(InvoiceFieldPaths.BILLING_PERIOD)}>
              {InvoiceFieldTitles.BILLING_PERIOD}
            </FormTextTitle>
            <FormText>{invoice && formatDateRange(invoice.billing_period_start_date, invoice.billing_period_end_date) || '-'}</FormText>
          </Authorization>
        </Column>
        <Column small={4}>
          <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.POSTPONE_DATE)}>
            <FormTextTitle enableUiDataEdit relativeTo={relativeTo} uiDataKey={getUiDataInvoiceKey(InvoiceFieldPaths.POSTPONE_DATE)}>
              {InvoiceFieldTitles.POSTPONE_DATE}
            </FormTextTitle>
            <FormText>{invoice && formatDate(invoice.postpone_date) || '-'}</FormText>
          </Authorization>
        </Column>
      </Row>
      <Row>
        <Column small={4}>
          <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.TOTAL_AMOUNT)}>
            <FormTextTitle enableUiDataEdit relativeTo={relativeTo} uiDataKey={getUiDataInvoiceKey(InvoiceFieldPaths.TOTAL_AMOUNT)}>
              {InvoiceFieldTitles.TOTAL_AMOUNT}
            </FormTextTitle>
            <FormText>{invoice && !isEmptyValue(invoice.total_amount) ? <AmountWithVat amount={invoice.total_amount} date={invoice.due_date} /> : '-'}</FormText>
          </Authorization>
        </Column>
        <Column small={4}>
          <FormTextTitle enableUiDataEdit relativeTo={relativeTo} uiDataKey={getUiDataInvoiceKey(InvoiceFieldPaths.SHARE)}>
            {InvoiceFieldTitles.SHARE}
          </FormTextTitle>
          <FormText>{invoice && !isEmptyValue(invoice.totalShare) ? `${formatNumber(invoice.totalShare * 100)} %` : '-'}</FormText>
        </Column>
        <Column small={4}>
          <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.BILLED_AMOUNT)}>
            <FormTextTitle enableUiDataEdit relativeTo={relativeTo} uiDataKey={getUiDataInvoiceKey(InvoiceFieldPaths.BILLED_AMOUNT)}>
              {InvoiceFieldTitles.BILLED_AMOUNT}
            </FormTextTitle>
            <FormText>{invoice && !isEmptyValue(invoice.billed_amount) ? <AmountWithVat amount={invoice.billed_amount} date={invoice.due_date} /> : '-'}
            </FormText>
          </Authorization>
        </Column>
      </Row>

      {invoice && invoice.type !== InvoiceType.CREDIT_NOTE && <Fragment>
          <SubTitle enableUiDataEdit relativeTo={relativeTo} uiDataKey={getUiDataInvoiceKey(InvoicePaymentsFieldPaths.PAYMENTS)}>
            {InvoicePaymentsFieldTitles.PAYMENTS}
          </SubTitle>
          <Row>
            <Column small={12} medium={8}>
              <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoicePaymentsFieldPaths.PAYMENTS)}>

                {!payments.length && <FormText>Ei maksuja</FormText>}
                {!!payments.length && <ListItems>
                    <Row>
                      <Column small={6}>
                        <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoicePaymentsFieldPaths.PAID_AMOUNT)}>
                          <FormTextTitle enableUiDataEdit relativeTo={relativeTo} uiDataKey={getUiDataInvoiceKey(InvoicePaymentsFieldPaths.PAID_AMOUNT)}>
                            {InvoicePaymentsFieldTitles.PAID_AMOUNT}
                          </FormTextTitle>
                        </Authorization>
                      </Column>
                      <Column small={6}>
                        <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoicePaymentsFieldPaths.PAID_DATE)}>
                          <FormTextTitle enableUiDataEdit relativeTo={relativeTo} uiDataKey={getUiDataInvoiceKey(InvoicePaymentsFieldPaths.PAID_DATE)}>
                            {InvoicePaymentsFieldTitles.PAID_DATE}
                          </FormTextTitle>
                        </Authorization>
                      </Column>
                    </Row>
                    {payments.map(payment => {
                return <Row key={payment.id}>
                          <Column small={6}>
                            <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoicePaymentsFieldPaths.PAID_AMOUNT)}>
                              <ListItem>{payment.paid_amount ? <AmountWithVat amount={payment.paid_amount} date={invoice ? invoice.due_date : null} /> : '-'}
                              </ListItem>
                            </Authorization>
                          </Column>
                          <Column small={6}>
                            <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoicePaymentsFieldPaths.PAID_DATE)}>
                              <ListItem>{formatDate(payment.paid_date) || '-'}</ListItem>
                            </Authorization>
                          </Column>
                        </Row>;
              })}
                  </ListItems>}
              </Authorization>
            </Column>
            <Column small={6} medium={4}>
              <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.OUTSTANDING_AMOUNT)}>
                <FormTextTitle enableUiDataEdit relativeTo={relativeTo} uiDataKey={getUiDataInvoiceKey(InvoiceFieldPaths.OUTSTANDING_AMOUNT)}>
                  {InvoiceFieldTitles.OUTSTANDING_AMOUNT}
                </FormTextTitle>
                <FormText>{invoice && !isEmptyValue(invoice.outstanding_amount) ? <AmountWithVat amount={invoice.outstanding_amount} date={invoice.due_date} /> : '-'}
                </FormText>
              </Authorization>
            </Column>
          </Row>
        </Fragment>}
      {showOldInvoiceInfo && <Row>
          <Column small={4}>
            <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.PAYMENT_NOTIFICATION_DATE)}>
              <FormTextTitle enableUiDataEdit relativeTo={relativeTo} uiDataKey={getUiDataInvoiceKey(InvoiceFieldPaths.PAYMENT_NOTIFICATION_DATE)}>
                {InvoiceFieldTitles.PAYMENT_NOTIFICATION_DATE}
              </FormTextTitle>
              <FormText>{invoice && formatDate(invoice.payment_notification_date) || '-'}</FormText>
            </Authorization>
          </Column>
          <Column small={4}>
            <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.COLLECTION_CHARGE)}>
              <FormTextTitle enableUiDataEdit relativeTo={relativeTo} uiDataKey={getUiDataInvoiceKey(InvoiceFieldPaths.COLLECTION_CHARGE)}>
                {InvoiceFieldTitles.COLLECTION_CHARGE}
              </FormTextTitle>
              <FormText>{invoice && !isEmptyValue(invoice.collection_charge) ? `${formatNumber(invoice.collection_charge)} €` : '-'}</FormText>
            </Authorization>
          </Column>
          <Column small={4}>
            <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.PAYMENT_NOTIFICATION_CATALOG_DATE)}>
              <FormTextTitle enableUiDataEdit relativeTo={relativeTo} uiDataKey={getUiDataInvoiceKey(InvoiceFieldPaths.PAYMENT_NOTIFICATION_CATALOG_DATE)}>
                {InvoiceFieldTitles.PAYMENT_NOTIFICATION_CATALOG_DATE}
              </FormTextTitle>
              <FormText>{invoice && formatDate(invoice.payment_notification_catalog_date) || '-'}</FormText>
            </Authorization>
          </Column>
        </Row>}

      <Row>
        <Column small={4}>
          {showOldInvoiceInfo && <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.DELIVERY_METHOD)}>
              <FormTextTitle enableUiDataEdit relativeTo={relativeTo} uiDataKey={getUiDataInvoiceKey(InvoiceFieldPaths.DELIVERY_METHOD)}>
                {InvoiceFieldTitles.DELIVERY_METHOD}
              </FormTextTitle>
              <FormText>{invoice && getLabelOfOption(deliveryMethodOptions, invoice.delivery_method) || '-'}</FormText>
            </Authorization>}
        </Column>
        <Column small={4}>
          <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.TYPE)}>
            <FormTextTitle enableUiDataEdit relativeTo={relativeTo} uiDataKey={getUiDataInvoiceKey(InvoiceFieldPaths.TYPE)}>
              {InvoiceFieldTitles.TYPE}
            </FormTextTitle>
            <FormText>{invoice && getLabelOfOption(typeOptions, invoice.type) || '-'}</FormText>
          </Authorization>
        </Column>
        <Column small={4}>
          {creditedInvoice && <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.CREDITED_INVOICE)}>
              <FormTextTitle enableUiDataEdit relativeTo={relativeTo} uiDataKey={getUiDataInvoiceKey(InvoiceFieldPaths.CREDITED_INVOICE)}>
                {InvoiceFieldTitles.CREDITED_INVOICE}
              </FormTextTitle>
              <FormText>{<a className='no-margin' onKeyDown={handleCreditedInvoiceKeyDown} onClick={handleCreditedInvoiceClick} tabIndex={0}>{creditedInvoice.number ? creditedInvoice.number : 'Numeroimaton'}</a>}</FormText>
            </Authorization>}
        </Column>
        <Column small={4}>
          {interestInvoiceFor && <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.INTEREST_INVOICE_FOR)}>
              <FormTextTitle relativeTo={relativeTo} uiDataKey={getUiDataInvoiceKey(InvoiceFieldPaths.INTEREST_INVOICE_FOR)}>
                {InvoiceFieldTitles.INTEREST_INVOICE_FOR}
              </FormTextTitle>
              <FormText>{<a className='no-margin' onKeyDown={handleInterestInvoiceForKeyDown} onClick={handleInterestInvoiceForClick} tabIndex={0}>{interestInvoiceFor.number ? interestInvoiceFor.number : 'Numeroimaton'}</a>}
              </FormText>
            </Authorization>}
        </Column>
      </Row>
      <Row>
        <Column small={12}>
          <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.NOTES)}>
            <FormTextTitle enableUiDataEdit relativeTo={relativeTo} uiDataKey={getUiDataInvoiceKey(InvoiceFieldPaths.NOTES)}>
              {InvoiceFieldTitles.NOTES}
            </FormTextTitle>
            <FormText>{invoice && invoice.notes || '-'}</FormText>
          </Authorization>
        </Column>
      </Row>

      <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.CREDITED_INVOICE)}>
        {!!creditInvoices.length && <Fragment>
            <SubTitle enableUiDataEdit relativeTo={relativeTo} uiDataKey={getUiDataInvoiceKey(InvoiceCreditInvoicesFieldPaths.CREDIT_INVOICES)}>
              {InvoiceCreditInvoicesFieldTitles.CREDIT_INVOICES}
            </SubTitle>

            {!!creditInvoices.length && <Fragment>
                <Row>
                  <Column small={4}>
                    <FormTextTitle enableUiDataEdit relativeTo={relativeTo} uiDataKey={getUiDataInvoiceKey(InvoiceCreditInvoicesFieldPaths.NUMBER)}>
                      {InvoiceCreditInvoicesFieldTitles.NUMBER}
                    </FormTextTitle>
                  </Column>
                  <Column small={4}>
                    <FormTextTitle enableUiDataEdit relativeTo={relativeTo} uiDataKey={getUiDataInvoiceKey(InvoiceCreditInvoicesFieldPaths.TOTAL_AMOUNT)}>
                      {InvoiceCreditInvoicesFieldTitles.TOTAL_AMOUNT}
                    </FormTextTitle>
                  </Column>
                  <Column small={4}>
                    <FormTextTitle enableUiDataEdit relativeTo={relativeTo} uiDataKey={getUiDataInvoiceKey(InvoiceCreditInvoicesFieldPaths.DUE_DATE)}>
                      {InvoiceCreditInvoicesFieldTitles.DUE_DATE}
                    </FormTextTitle>
                  </Column>
                </Row>

                {creditInvoices.map(item => {
            const handleCreditInvoiceClick = () => {
              onInvoiceLinkClick(item.id);
            };

            const handleCreditInvoiceKeyDown = (e: any) => {
              if (e.keyCode === 13) {
                handleCreditInvoiceClick();
              }
            };

            return <Row key={item.id}>
                      <Column small={4}>
                        <FormText>
                          <a className='no-margin' onKeyDown={handleCreditInvoiceKeyDown} onClick={handleCreditInvoiceClick} tabIndex={0}>{item.number ? item.number : 'Numeroimaton'}</a>
                        </FormText>
                      </Column>
                      <Column small={4}>
                        <FormText><AmountWithVat amount={item.total_amount} date={item.due_date} /></FormText>
                      </Column>
                      <Column small={4}>
                        <FormText>{formatDate(item.due_date)}</FormText>
                      </Column>
                    </Row>;
          })}
              </Fragment>}
          </Fragment>}
      </Authorization>

      <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.INTEREST_INVOICE_FOR)}>
        {!!interestInvoices.length && <Fragment>
            <SubTitle relativeTo={relativeTo} uiDataKey={getUiDataInvoiceKey(InvoiceInterestInvoicesFieldPaths.INTEREST_INVOICES)}>
              {InvoiceInterestInvoicesFieldTitles.INTEREST_INVOICES}
            </SubTitle>

            {!!interestInvoices.length && <Fragment>
                <Row>
                  <Column small={4}>
                    <FormTextTitle relativeTo={relativeTo} uiDataKey={getUiDataInvoiceKey(InvoiceInterestInvoicesFieldPaths.NUMBER)}>
                      {InvoiceInterestInvoicesFieldTitles.NUMBER}
                    </FormTextTitle>
                  </Column>
                  <Column small={4}>
                    <FormTextTitle relativeTo={relativeTo} uiDataKey={getUiDataInvoiceKey(InvoiceInterestInvoicesFieldPaths.TOTAL_AMOUNT)}>
                      {InvoiceInterestInvoicesFieldTitles.TOTAL_AMOUNT}
                    </FormTextTitle>
                  </Column>
                  <Column small={4}>
                    <FormTextTitle relativeTo={relativeTo} uiDataKey={getUiDataInvoiceKey(InvoiceInterestInvoicesFieldPaths.DUE_DATE)}>
                      {InvoiceInterestInvoicesFieldTitles.DUE_DATE}
                    </FormTextTitle>
                  </Column>
                </Row>

                {interestInvoices.map(item => {
            const handleInterestInvoiceClick = () => {
              onInvoiceLinkClick(item.id);
            };

            const handleInterestInvoiceKeyDown = (e: any) => {
              if (e.keyCode === 13) {
                handleInterestInvoiceClick();
              }
            };

            return <Row key={item.id}>
                      <Column small={4}>
                        <FormText>
                          <a className='no-margin' onKeyDown={handleInterestInvoiceKeyDown} onClick={handleInterestInvoiceClick} tabIndex={0}>{item.number ? item.number : 'Numeroimaton'}</a>
                        </FormText>
                      </Column>
                      <Column small={4}>
                        <FormText><AmountWithVat amount={item.total_amount} date={item.due_date} /></FormText>
                      </Column>
                      <Column small={4}>
                        <FormText>{formatDate(item.due_date)}</FormText>
                      </Column>
                    </Row>;
          })}
              </Fragment>}
          </Fragment>}
      </Authorization>

      <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceRowsFieldPaths.ROWS)}>
        <InvoiceRows invoiceAttributes={invoiceAttributes} invoiceDate={invoice ? invoice.date : null} invoiceDueDate={invoice ? invoice.due_date : null} receivableTypeOptions={receivableTypeOptions} relativeTo={relativeTo} rows={rows} />
      </Authorization>
    </Fragment>;
};

export default flowRight(connect(state => {
  return {
    invoiceAttributes: getInvoiceAttributes(state)
  };
}))(InvoiceTemplate);