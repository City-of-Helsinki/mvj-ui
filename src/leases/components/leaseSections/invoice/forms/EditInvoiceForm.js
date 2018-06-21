// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';
import {connect} from 'react-redux';
import {FieldArray, reduxForm} from 'redux-form';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';

import FormField from '$components/form/FormField';
import FormFieldLabel from '$components/form/FormFieldLabel';
import InvoiceRowsEdit from './InvoiceRowsEdit';
import {FormNames} from '$src/leases/enums';
import {getContactFullName} from '$src/contacts/helpers';
import {getInvoiceTenantOptions} from '$src/leases/helpers';
import {
  formatDate,
  formatNumber,
  getAttributeFieldOptions,
  getLabelOfOption,
} from '$util/helpers';
import {getAttributes as getInvoiceAttributes} from '$src/invoices/selectors';
import {getCurrentLease} from '$src/leases/selectors';

import type {Attributes as InvoiceAttributes} from '$src/invoices/types';
import type {Lease} from '$src/leases/types';
type Props = {
  handleSubmit: Function,
  invoice: Object,
  invoiceAttributes: InvoiceAttributes,
  lease: Lease,
  startDate: string,
}

const EditInvoiceForm = ({
  handleSubmit,
  invoice,
  invoiceAttributes,
  lease,
}: Props) => {
  const tenantOptions = getInvoiceTenantOptions(lease);
  const stateOptions = getAttributeFieldOptions(invoiceAttributes, 'state');
  const deliveryMethodOptions = getAttributeFieldOptions(invoiceAttributes, 'delivery_method');
  const typeOptions = getAttributeFieldOptions(invoiceAttributes, 'type');

  return (
    <form onSubmit={handleSubmit}>
      <Row>
        <Column medium={4}>
          <label>Laskunsaaja</label>
          <p>{getContactFullName(invoice.recipientFull) || '-'}</p>
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
          <FormField
            fieldAttributes={get(invoiceAttributes, 'due_date')}
            name='due_date'
            overrideValues={{
              label: 'Eräpäivä',
            }}
          />
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
          <Row>
            <Column>
              <FormFieldLabel required>Laskutuskausi</FormFieldLabel>
            </Column>
          </Row>
          <Row>
            <Column medium={6}>
              <FormField
                fieldAttributes={get(invoiceAttributes, 'billing_period_start_date')}
                name='billing_period_start_date'
                overrideValues={{
                  label: '',
                }}
              />
            </Column>
            <Column medium={6}>
              <FormField
                fieldAttributes={get(invoiceAttributes, 'billing_period_end_date')}
                name='billing_period_end_date'
                overrideValues={{
                  label: '',
                }}
              />
            </Column>
          </Row>
        </Column>
        <Column medium={4}>
          <label>Lykkäyspvm</label>
          <p>{formatDate(invoice.postpone_date) || '-'}</p>
        </Column>
      </Row>
      <Row>
        <Column medium={4}>
          <FormField
            fieldAttributes={get(invoiceAttributes, 'total_amount')}
            name='total_amount'
            unit='€'
            overrideValues={{
              label: 'Laskun pääoma',
            }}
          />
        </Column>
        <Column medium={4}>
          <label>Laskun osuus</label>
          <p>{`${formatNumber(invoice.totalShare * 100)} %`}</p>
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
          <FormField
            fieldAttributes={get(invoiceAttributes, 'notes')}
            name='notes'
            overrideValues={{
              label: 'Tiedote',
              fieldType: 'textarea',
            }}
          />
        </Column>
      </Row>
      <FieldArray
        attributes={invoiceAttributes}
        component={InvoiceRowsEdit}
        name='rows'
        tenantOptions={tenantOptions}
      />
    </form>
  );
};

const formName = FormNames.INVOICE_EDIT;

export default flowRight(
  connect(
    (state) => {
      return {
        invoiceAttributes: getInvoiceAttributes(state),
        lease: getCurrentLease(state),
      };
    },
  ),
  reduxForm({
    form: formName,
  }),
)(EditInvoiceForm);
