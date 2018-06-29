// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';

import Divider from '$components/content/Divider';
import FormFieldLabel from '$components/form/FormFieldLabel';
import ListItems from '$components/content/ListItems';
import SubTitle from '$components/content/SubTitle';
import {InvoiceType} from '$src/invoices/enums';
import {
  formatDate,
  formatDateRange,
  formatNumber,
  getAttributeFieldOptions,
  getLabelOfOption,
} from '$util/helpers';
import {getContactFullName} from '$src/contacts/helpers';
import {getContentTenantItem} from '$src/leases/helpers';
import {getAttributes as getInvoiceAttributes} from '$src/invoices/selectors';

import type {Attributes as InvoiceAttributes} from '$src/invoices/types';

const getRowsSum = (rows: Array<Object>) => {
  let sum = 0;
  rows.forEach((row) => {
    sum += Number(row.amount);
  });
  return sum;
};

type Props = {
  invoice: Object,
  invoiceAttributes: InvoiceAttributes,
  onCreditedInvoiceClick: Function,
}

const InvoiceTemplate = ({invoice, invoiceAttributes, onCreditedInvoiceClick}: Props) => {
  const handleCreditedInvoiceClick = () => {
    onCreditedInvoiceClick(invoice.credited_invoice);
  };

  const receivableTypeOptions = getAttributeFieldOptions(invoiceAttributes, 'rows.child.children.receivable_type');
  const stateOptions = getAttributeFieldOptions(invoiceAttributes, 'state');
  const deliveryMethodOptions = getAttributeFieldOptions(invoiceAttributes, 'delivery_method');
  const typeOptions = getAttributeFieldOptions(invoiceAttributes, 'type');
  const payments = get(invoice, 'payments', []);
  const rows = get(invoice, 'rows', []);
  const sum = getRowsSum(rows);

  return (
    <div>
      <Row>
        <Column medium={4}>
          <FormFieldLabel>Laskunsaaja</FormFieldLabel>
          <p>{getContactFullName(invoice.recipientFull) || '-'}</p>
        </Column>
        <Column medium={4}>
          <FormFieldLabel>Lähetetty SAP:iin</FormFieldLabel>
          <p>{formatDate(invoice.sent_to_sap_at) || '-'}</p>
        </Column>
        <Column medium={4}>
          <FormFieldLabel>SAP numero</FormFieldLabel>
          <p>{invoice.sap_id || '-'}</p>
        </Column>
      </Row>
      <Row>
        <Column medium={4}>
          <FormFieldLabel>Eräpäivä</FormFieldLabel>
          <p>{formatDate(invoice.due_date) || '-'}</p>
        </Column>
        <Column medium={4}>
          <FormFieldLabel>Laskutuspvm</FormFieldLabel>
          <p>{formatDate(invoice.invoicing_date) || '-'}</p>
        </Column>
      </Row>
      <Row>
        <Column medium={4}>
          <FormFieldLabel>Laskun tila</FormFieldLabel>
          <p>{getLabelOfOption(stateOptions, invoice.state) || '-'}</p>
        </Column>
        <Column medium={4}>
          <FormFieldLabel>Laskutuskausi</FormFieldLabel>
          <p>{formatDateRange(invoice.billing_period_start_date, invoice.billing_period_end_date)}</p>
        </Column>
        <Column medium={4}>
          <FormFieldLabel>Lykkäyspvm</FormFieldLabel>
          <p>{formatDate(invoice.postpone_date) || '-'}</p>
        </Column>
      </Row>
      <Row>
        <Column medium={4}>
          <FormFieldLabel>Laskun pääoma</FormFieldLabel>
          <p>
            {invoice.total_amount
              ? `${formatNumber(invoice.total_amount)} €`
              : '-'
            }
          </p>
        </Column>
        <Column medium={4}>
          <FormFieldLabel>Laskun osuus</FormFieldLabel>
          <p>{`${formatNumber(invoice.totalShare * 100)} %`}</p>
        </Column>
        <Column medium={4}>
          <FormFieldLabel>Laskutettu määrä</FormFieldLabel>
          <p>
            {invoice.billed_amount
              ? `${formatNumber(invoice.billed_amount)} €`
              : '-'
            }
          </p>
        </Column>
      </Row>
      <SubTitle>Maksut</SubTitle>
      <Row>
        <Column small={12} medium={8}>
          {!payments.length && <p>Ei maksuja</p>}
          {!!payments.length &&
            <ListItems>
              <Row>
                <Column small={6}>
                  <FormFieldLabel>Maksettu määrä</FormFieldLabel>
                </Column>
                <Column small={6}>
                  <FormFieldLabel>Maksettu pvm</FormFieldLabel>
                </Column>
              </Row>
              {payments.map((payment) => {
                return (
                  <Row key={payment.id}>
                    <Column small={6}>
                      <p className='no-margin'>{payment.paid_amount ? `${formatNumber(payment.paid_amount)} €` : '-'}</p>
                    </Column>
                    <Column small={6}>
                      <p className='no-margin'>{formatDate(payment.paid_date) || '-'}</p>
                    </Column>
                  </Row>
                );
              })}
            </ListItems>
          }
        </Column>
        <Column small={6} medium={4}>
          <FormFieldLabel>Maksamaton määrä</FormFieldLabel>
          <p>
            {invoice.outstanding_amount
              ? `${formatNumber(invoice.outstanding_amount)} €`
              : '-'
            }
          </p>
        </Column>
      </Row>
      <Row>
        <Column medium={4}>
          <FormFieldLabel>Maksukehotuspvm</FormFieldLabel>
          <p>{formatDate(invoice.payment_notification_date) || '-'}</p>
        </Column>
        <Column medium={4}>
          <FormFieldLabel>Perintäkulu</FormFieldLabel>
          <p>
            {invoice.collection_charge
              ? `${formatNumber(invoice.collection_charge)} €`
              : '-'
            }
          </p>
        </Column>
        <Column medium={4}>
          <FormFieldLabel>Maksukehotus luettelo</FormFieldLabel>
          <p>{formatDate(invoice.payment_notification_catalog_date) || '-'}</p>
        </Column>
      </Row>
      <Row>
        <Column medium={4}>
          <FormFieldLabel>E vai paperilasku</FormFieldLabel>
          <p>{getLabelOfOption(deliveryMethodOptions, invoice.delivery_method) || '-'}</p>
        </Column>
        <Column medium={4}>
          <FormFieldLabel>Laskun tyyppi</FormFieldLabel>
          <p>{getLabelOfOption(typeOptions, invoice.type) || '-'}</p>
        </Column>
        {invoice && invoice.type === InvoiceType.CREDIT_NOTE &&
          <Column medium={4}>
            <FormFieldLabel>Hyvitetty lasku</FormFieldLabel>
            <p>{invoice.credited_invoice
              ? <a onClick={handleCreditedInvoiceClick}>{invoice.credited_invoice}</a>
              : '-'
            }</p>
          </Column>
        }
      </Row>
      <Row>
        <Column medium={12}>
          <FormFieldLabel>Tiedote</FormFieldLabel>
          <p>{invoice.notes || '-'}</p>
        </Column>
      </Row>
      <Row>
        <Column medium={12}>
          <FormFieldLabel>Erittely</FormFieldLabel>
          {!rows.length && <p>-</p>}
          {!!rows.length &&
            <div>
              {rows.map((row) => {
                const contact = get(getContentTenantItem(row.tenantFull), 'contact');
                return (
                  <Row key={row.id}>
                    <Column small={4}><p>{getContactFullName(contact) || '-'}</p></Column>
                    <Column small={2}><p>{getLabelOfOption(receivableTypeOptions, row.receivable_type) || '-'}</p></Column>
                    <Column small={4}><p>{row.description || '-'}</p></Column>
                    <Column small={2}><p className='invoice__rows_amount'>{row.amount ? `${formatNumber(row.amount)} €` : '-'}</p></Column>
                  </Row>
                );
              })}
              <Divider className='invoice-divider' />
              <Row>
                <Column small={10}><p><strong>Yhteensä</strong></p></Column>
                <Column small={2}><p className='invoice__rows_amount'><strong>{`${formatNumber(sum)} €`}</strong></p></Column>
              </Row>
            </div>
          }
        </Column>
      </Row>
    </div>
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
