// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';
import {connect} from 'react-redux';
import {Field, reduxForm} from 'redux-form';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';

import FieldTypeDatePicker from '$components/form/FieldTypeDatePicker';
import FieldTypeText from '$components/form/FieldTypeText';
import FieldTypeTextArea from '$components/form/FieldTypeTextArea';
import {
  formatDate,
  formatDecimalNumber,
  formatNumberWithThousandSeparator,
  getAttributeFieldOptions,
  getLabelOfOption,
} from '$util/helpers';
import {getContactFullName} from '$src/contacts/helpers';
import {getInvoiceSharePercentage} from '$src/invoices/helpers';
import {genericValidator} from '$components/form/validations';
import {getAttributes as getInvoiceAttributes} from '$src/invoices/selectors';

import type {Attributes as InvoiceAttributes} from '$src/invoices/types';

type Props = {
  bill: Object,
  handleSubmit: Function,
  invoice: Object,
  invoiceAttributes: InvoiceAttributes,
  startDate: string,
}

const EditBillForm = ({
  handleSubmit,
  invoice,
  invoiceAttributes,
}: Props) => {
  const receivableTypeOptions = getAttributeFieldOptions(invoiceAttributes, 'receivable_type');
  const stateOptions = getAttributeFieldOptions(invoiceAttributes, 'state');
  const deliveryMethodOptions = getAttributeFieldOptions(invoiceAttributes, 'delivery_method');
  const typeOptions = getAttributeFieldOptions(invoiceAttributes, 'type');

  return (
    <form onSubmit={handleSubmit}>
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
          <Field
            component={FieldTypeDatePicker}
            label="Eräpäivä"
            name="due_date"
            validate={[
              (value) => genericValidator(value, get(invoiceAttributes, 'due_date')),
            ]}
          />
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
          <Row>
            <Column medium={6}>
              <Field
                component={FieldTypeDatePicker}
                name="billing_period_start_date"
                validate={[
                  (value) => genericValidator(value, get(invoiceAttributes, 'billing_period_start_date')),
                ]}
              />
            </Column>
            <Column medium={6}>
              <Field
                component={FieldTypeDatePicker}
                name="billing_period_end_date"
                validate={[
                  (value) => genericValidator(value, get(invoiceAttributes, 'billing_period_end_date')),
                ]}
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
          <Field
            component={FieldTypeText}
            label="Laskun pääoma"
            name="total_amount"
            validate={[
              (value) => genericValidator(value, get(invoiceAttributes, 'total_amount')),
            ]}
          />
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
          <Field
            component={FieldTypeTextArea}
            label="Tiedote"
            name="notes"
            rows={2}
            validate={[
              (value) => genericValidator(value, get(invoiceAttributes, 'notes')),
            ]}
          />
        </Column>
      </Row>
    </form>
  );
};

const formName = 'edit-invoice-form';

export default flowRight(
  connect(
    (state) => {
      return {
        invoiceAttributes: getInvoiceAttributes(state),
      };
    },
  ),
  reduxForm({
    form: formName,
  }),
)(EditBillForm);
