// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';

import Divider from '$components/content/Divider';
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
}

const InvoiceTemplate = ({invoice, invoiceAttributes}: Props) => {
  const receivableTypeOptions = getAttributeFieldOptions(invoiceAttributes, 'rows.child.children.receivable_type');
  const stateOptions = getAttributeFieldOptions(invoiceAttributes, 'state');
  const deliveryMethodOptions = getAttributeFieldOptions(invoiceAttributes, 'delivery_method');
  const typeOptions = getAttributeFieldOptions(invoiceAttributes, 'type');
  const rows = get(invoice, 'rows', []);
  const sum = getRowsSum(rows);

  return (
    <div>
      <Row>
        <Column medium={4}>
          <label>Laskunsaaja</label>
          <p>{getContactFullName(invoice.recipient) || '-'}</p>
        </Column>
        <Column medium={4}>
          <label>Lähetetty SAP:iin</label>
          <p>{formatDate(invoice.sent_to_sap_at) || '-'}</p>
        </Column>
        <Column medium={4}>
          <label>SAP numero</label>
          <p>{invoice.sap_id || '-'}</p>
        </Column>
      </Row>
      <Row>
        <Column medium={4}>
          <label>Eräpäivä</label>
          <p>{formatDate(invoice.due_date) || '-'}</p>
        </Column>
        <Column medium={4}>
          <label>Laskutuspvm</label>
          <p>{formatDate(invoice.invoicing_date) || '-'}</p>
        </Column>
      </Row>
      <Row>
        <Column medium={4}>
          <label>Laskun tila</label>
          <p>{getLabelOfOption(stateOptions, invoice.state) || '-'}</p>
        </Column>
        <Column medium={4}>
          <label>Laskutuskausi</label>
          <p>{formatDateRange(invoice.billing_period_start_date, invoice.billing_period_end_date)}</p>
        </Column>
        <Column medium={4}>
          <label>Lykkäyspvm</label>
          <p>{formatDate(invoice.postpone_date) || '-'}</p>
        </Column>
      </Row>
      <Row>
        <Column medium={4}>
          <label>Laskun pääoma</label>
          <p>
            {invoice.total_amount
              ? `${formatNumber(invoice.total_amount)} €`
              : '-'
            }
          </p>
        </Column>
        <Column medium={4}>
          <label>Laskun osuus</label>
          <p>
            {invoice.total_share
              ? `${formatNumber(invoice.total_share * 100)} %`
              : '-'
            }
          </p>
        </Column>
        <Column medium={4}>
          <label>Laskutettu määrä</label>
          <p>
            {invoice.billed_amount
              ? `${formatNumber(invoice.billed_amount)} €`
              : '-'
            }
          </p>
        </Column>
      </Row>
      <Row>
        <Column medium={4}>
          <label>Maksettu määrä</label>
          <p>
            {invoice.paid_amount
              ? `${formatNumber(invoice.paid_amount)} €`
              : '-'
            }
          </p>
        </Column>
        <Column medium={4}>
          <label>Maksettu pvm</label>
          <p>
            {formatDate(invoice.paid_date) || '-'}
          </p>
        </Column>
        <Column medium={4}>
          <label>Maksamaton määrä</label>
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
          <label>Maksukehotuspvm</label>
          <p>{formatDate(invoice.payment_notification_date) || '-'}</p>
        </Column>
        <Column medium={4}>
          <label>Perintäkulu</label>
          <p>
            {invoice.collection_charge
              ? `${formatNumber(invoice.collection_charge)} €`
              : '-'
            }
          </p>
        </Column>
        <Column medium={4}>
          <label>Maksukehotus luettelo</label>
          <p>{formatDate(invoice.payment_notification_catalog_date) || '-'}</p>
        </Column>
      </Row>
      <Row>
        <Column medium={4}>
          <label>E vai paperilasku</label>
          <p>{getLabelOfOption(deliveryMethodOptions, invoice.delivery_method) || '-'}</p>
        </Column>
        <Column medium={4}>
          <label>Laskun tyyppi</label>
          <p>{getLabelOfOption(typeOptions, invoice.type) || '-'}</p>
        </Column>
      </Row>
      <Row>
        <Column medium={12}>
          <label>Tiedote</label>
          <p>{invoice.notes || '-'}</p>
        </Column>
      </Row>
      <Row>
        <Column medium={12}>
          <label>Erittely</label>
          {!rows.length && <p>-</p>}
          {!!rows.length &&
            <div>
              {rows.map((row) => {
                const contact = get(getContentTenantItem(row.tenant), 'contact');
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
