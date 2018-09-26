// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';

import Divider from '$components/content/Divider';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import FormTitleAndText from '$components/form/FormTitleAndText';
import ListItem from '$components/content/ListItem';
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
  invoice: ?Object,
  invoiceAttributes: InvoiceAttributes,
  onCreditedInvoiceClick: Function,
}

const InvoiceTemplate = ({invoice, invoiceAttributes, onCreditedInvoiceClick}: Props) => {
  const handleCreditedInvoiceClick = () => {
    onCreditedInvoiceClick(invoice ? invoice.credited_invoice : 0);
  };

  const handleCreditedInvoiceKeyDown = (e: any) => {
    if(e.keyCode === 13) {
      handleCreditedInvoiceClick();
    }
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
          <FormTitleAndText
            title='Laskunsaaja'
            text={(invoice && getContactFullName(invoice.recipientFull)) || '-'}
          />
        </Column>
        <Column medium={4}>
          <FormTitleAndText
            title='Lähetetty SAP:iin'
            text={(invoice && formatDate(invoice.sent_to_sap_at)) || '-'}
          />
        </Column>
        <Column medium={4}>
          <FormTitleAndText
            title='SAP numero'
            text={(invoice && invoice.sap_id) || '-'}
          />
        </Column>
      </Row>
      <Row>
        <Column medium={4}>
          <FormTitleAndText
            title='Eräpäivä'
            text={(invoice && formatDate(invoice.due_date)) || '-'}
          />
        </Column>
        <Column medium={4}>
          <FormTitleAndText
            title='Laskutuspvm'
            text={(invoice && formatDate(invoice.invoicing_date)) || '-'}
          />
        </Column>
      </Row>
      <Row>
        <Column medium={4}>
          <FormTitleAndText
            title='Laskun tila'
            text={(invoice && getLabelOfOption(stateOptions, invoice.state)) || '-'}
          />
        </Column>
        <Column medium={4}>
          <FormTitleAndText
            title='Laskutuskausi'
            text={(invoice && formatDateRange(invoice.billing_period_start_date, invoice.billing_period_end_date)) || '-'}
          />
        </Column>
        <Column medium={4}>
          <FormTitleAndText
            title='Lykkäyspvm'
            text={(invoice && formatDate(invoice.postpone_date)) || '-'}
          />
        </Column>
      </Row>
      <Row>
        <Column medium={4}>
          <FormTitleAndText
            title='Laskun pääoma'
            text={invoice && invoice.total_amount
              ? `${formatNumber(invoice.total_amount)} €`
              : '-'}
          />
        </Column>
        <Column medium={4}>
          <FormTitleAndText
            title='Laskun osuus'
            text={`${formatNumber((invoice ? invoice.totalShare : 0) * 100)} %`}
          />
        </Column>
        <Column medium={4}>
          <FormTitleAndText
            title='Laskutettu määrä'
            text={invoice && invoice.billed_amount
              ? `${formatNumber(invoice.billed_amount)} €`
              : '-'}
          />
        </Column>
      </Row>
      <SubTitle>Maksut</SubTitle>
      <Row>
        <Column small={12} medium={8}>
          {!payments.length && <FormText>Ei maksuja</FormText>}
          {!!payments.length &&
            <ListItems>
              <Row>
                <Column small={6}>
                  <FormTextTitle title='Maksettu määrä' />
                </Column>
                <Column small={6}>
                  <FormTextTitle title='Maksettu pvm' />
                </Column>
              </Row>
              {payments.map((payment) => {
                return (
                  <Row key={payment.id}>
                    <Column small={6}>
                      <ListItem>{payment.paid_amount ? `${formatNumber(payment.paid_amount)} €` : '-'}</ListItem>
                    </Column>
                    <Column small={6}>
                      <ListItem>{formatDate(payment.paid_date) || '-'}</ListItem>
                    </Column>
                  </Row>
                );
              })}
            </ListItems>
          }
        </Column>
        <Column small={6} medium={4}>
          <FormTitleAndText
            title='Maksamaton määrä'
            text={invoice && invoice.outstanding_amount
              ? `${formatNumber(invoice.outstanding_amount)} €`
              : '-'}
          />
        </Column>
      </Row>
      <Row>
        <Column medium={4}>
          <FormTitleAndText
            title='Maksukehotuspvm'
            text={(invoice && formatDate(invoice.payment_notification_date)) || '-'}
          />
        </Column>
        <Column medium={4}>
          <FormTitleAndText
            title='Perintäkulu'
            text={invoice && invoice.collection_charge
              ? `${formatNumber(invoice.collection_charge)} €`
              : '-'}
          />
        </Column>
        <Column medium={4}>
          <FormTitleAndText
            title='Maksukehotus luettelo'
            text={(invoice && formatDate(invoice.payment_notification_catalog_date)) || '-'}
          />
        </Column>
      </Row>
      <Row>
        <Column medium={4}>
          <FormTitleAndText
            title='E vai paperilasku'
            text={(invoice && getLabelOfOption(deliveryMethodOptions, invoice.delivery_method)) || '-'}
          />
        </Column>
        <Column medium={4}>
          <FormTitleAndText
            title='Laskun tyyppi'
            text={(invoice && getLabelOfOption(typeOptions, invoice.type)) || '-'}
          />
        </Column>
        {invoice && invoice.type === InvoiceType.CREDIT_NOTE &&
          <Column medium={4}>
            <FormTitleAndText
              title='Hyvitetty lasku'
              text={invoice && invoice.credited_invoice
                ? <a className='no-margin' onKeyDown={handleCreditedInvoiceKeyDown} onClick={handleCreditedInvoiceClick} tabIndex={0}>{invoice.credited_invoice}</a>
                : '-'}
            />
          </Column>
        }
      </Row>
      <Row>
        <Column medium={12}>
          <FormTitleAndText
            title='Tiedote'
            text={(invoice && invoice.notes) || '-'}
          />
        </Column>
      </Row>
      <Row>
        <Column medium={12}>
          <SubTitle>Erittely</SubTitle>
          {!rows.length && <FormText>-</FormText>}
          {!!rows.length &&
            <div>
              {rows.map((row) => {
                const contact = get(getContentTenantItem(row.tenantFull), 'contact');
                return (
                  <Row key={row.id}>
                    <Column small={4}><FormText>{getContactFullName(contact) || '-'}</FormText></Column>
                    <Column small={2}><FormText>{getLabelOfOption(receivableTypeOptions, row.receivable_type) || '-'}</FormText></Column>
                    <Column small={4}><FormText>{row.description || '-'}</FormText></Column>
                    <Column small={2}><FormText className='invoice__rows_amount'>{row.amount ? `${formatNumber(row.amount)} €` : '-'}</FormText></Column>
                  </Row>
                );
              })}
              <Divider className='invoice-divider' />
              <Row>
                <Column small={10}><FormText><strong>Yhteensä</strong></FormText></Column>
                <Column small={2}><FormText className='align-right'><strong>{`${formatNumber(sum)} €`}</strong></FormText></Column>
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
