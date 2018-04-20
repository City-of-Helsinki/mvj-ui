// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';

import {
  formatDate,
  formatDateRange,
  formatDecimalNumber,
  formatNumberWithThousandSeparator,
  getAttributeFieldOptions,
  getLabelOfOption,
} from '$util/helpers';
import {getContactFullName} from '$src/contacts/helpers';
import {getInvoiceSharePercentage} from '$src/invoices/helpers';
import {getAttributes as getInvoiceAttributes} from '$src/invoices/selectors';

import type {Attributes as InvoiceAttributes} from '$src/invoices/types';

type Props = {
  invoice: Object,
  invoiceAttributes: InvoiceAttributes,
}
const InvoiceTemplate = ({invoice, invoiceAttributes}: Props) => {
  const receivableTypeOptions = getAttributeFieldOptions(invoiceAttributes, 'receivable_type');
  const stateOptions = getAttributeFieldOptions(invoiceAttributes, 'state');
  const deliveryMethodOptions = getAttributeFieldOptions(invoiceAttributes, 'delivery_method');
  const typeOptions = getAttributeFieldOptions(invoiceAttributes, 'type');
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
        <Column medium={4}>
          <label>Saamislaji</label>
          <p>{getLabelOfOption(receivableTypeOptions, invoice.receivable_type) || '-'}</p>
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
              ? `${formatNumberWithThousandSeparator(formatDecimalNumber(invoice.total_amount))} €`
              : '-'
            }
          </p>
        </Column>
        <Column medium={4}>
          <label>Laskun osuus</label>
          <p>
            {getInvoiceSharePercentage(invoice)
              ? `${getInvoiceSharePercentage(invoice)} %`
              : '-'
            }
          </p>
        </Column>
      </Row>
      <Row>
        <Column medium={4}>
          <label>Laskutettu määrä</label>
          <p>
            {invoice.billed_amount
              ? `${formatNumberWithThousandSeparator(formatDecimalNumber(invoice.billed_amount))} €`
              : '-'
            }
          </p>
        </Column>
        <Column medium={4}>
          <label>Maksamaton määrä</label>
          <p>
            {invoice.outstanding_amount
              ? `${formatNumberWithThousandSeparator(formatDecimalNumber(invoice.outstanding_amount))} €`
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
              ? `${formatNumberWithThousandSeparator(formatDecimalNumber(invoice.collection_charge))} €`
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
