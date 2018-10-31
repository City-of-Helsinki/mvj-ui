// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';

import AmountWithVat from '$components/vat/AmountWithVat';
import Divider from '$components/content/Divider';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import FormTitleAndText from '$components/form/FormTitleAndText';
import ListItem from '$components/content/ListItem';
import ListItems from '$components/content/ListItems';
import SubTitle from '$components/content/SubTitle';
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
  creditedInvoice: ?Object,
  invoice: ?Object,
  invoiceAttributes: InvoiceAttributes,
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

  const receivableTypeOptions = getAttributeFieldOptions(invoiceAttributes, 'rows.child.children.receivable_type');
  const stateOptions = getAttributeFieldOptions(invoiceAttributes, 'state');
  const deliveryMethodOptions = getAttributeFieldOptions(invoiceAttributes, 'delivery_method');
  const typeOptions = getAttributeFieldOptions(invoiceAttributes, 'type');
  const payments = get(invoice, 'payments', []);
  const creditInvoices = get(invoice, 'credit_invoices', []);
  const rows = get(invoice, 'rows', []);
  const sum = getRowsSum(rows);

  return (
    <div>
      <Row>
        <Column small={12}>
          <FormTitleAndText
            title='Laskunsaaja'
            text={(invoice && getContactFullName(invoice.recipientFull)) || '-'}
          />
        </Column>
      </Row>
      <Row>
        <Column small={4}>
          <FormTitleAndText
            title='Laskunumero'
            text={(invoice && invoice.number) || '-'}
          />
        </Column>
        <Column small={4}>
          <FormTitleAndText
            title='Lähetetty SAP:iin'
            text={(invoice && formatDate(invoice.sent_to_sap_at)) || '-'}
          />
        </Column>
        <Column small={4}>
          <FormTitleAndText
            title='SAP numero'
            text={(invoice && invoice.sap_id) || '-'}
          />
        </Column>
      </Row>
      <Row>
        <Column small={4}>
          <FormTitleAndText
            title='Eräpäivä'
            text={(invoice && formatDate(invoice.due_date)) || '-'}
          />
        </Column>
        <Column small={4}>
          <FormTitleAndText
            title='Laskutuspvm'
            text={(invoice && formatDate(invoice.invoicing_date)) || '-'}
          />
        </Column>
      </Row>
      <Row>
        <Column small={4}>
          <FormTitleAndText
            title='Laskun tila'
            text={(invoice && getLabelOfOption(stateOptions, invoice.state)) || '-'}
          />
        </Column>
        <Column small={4}>
          <FormTitleAndText
            title='Laskutuskausi'
            text={(invoice && formatDateRange(invoice.billing_period_start_date, invoice.billing_period_end_date)) || '-'}
          />
        </Column>
        <Column small={4}>
          <FormTitleAndText
            title='Lykkäyspvm'
            text={(invoice && formatDate(invoice.postpone_date)) || '-'}
          />
        </Column>
      </Row>
      <Row>
        <Column small={4}>
          <FormTitleAndText
            title='Laskun pääoma'
            text={invoice && invoice.total_amount
              ? <AmountWithVat amount={invoice.total_amount} date={invoice.due_date} />
              : '-'}
          />
        </Column>
        <Column small={4}>
          <FormTitleAndText
            title='Laskun osuus'
            text={invoice && invoice.totalShare !== null
              ? `${formatNumber((invoice ? invoice.totalShare : 0) * 100)} %`
              : '-'
            }
          />
        </Column>
        <Column small={4}>
          <FormTitleAndText
            title='Laskutettu määrä'
            text={invoice && invoice.billed_amount
              ? <AmountWithVat amount={invoice.billed_amount} date={invoice.due_date} />
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
                      <ListItem>{payment.paid_amount
                        ? <AmountWithVat amount={payment.paid_amount} date={get(invoice, 'due_date')} />
                        : '-'
                      }</ListItem>
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
              ? <AmountWithVat amount={invoice.outstanding_amount} date={invoice.due_date} />
              : '-'}
          />
        </Column>
      </Row>
      <Row>
        <Column small={4}>
          <FormTitleAndText
            title='Maksukehotuspvm'
            text={(invoice && formatDate(invoice.payment_notification_date)) || '-'}
          />
        </Column>
        <Column small={4}>
          <FormTitleAndText
            title='Perintäkulu'
            text={invoice && invoice.collection_charge
              ? `${formatNumber(invoice.collection_charge)} €`
              : '-'}
          />
        </Column>
        <Column small={4}>
          <FormTitleAndText
            title='Maksukehotus luettelo'
            text={(invoice && formatDate(invoice.payment_notification_catalog_date)) || '-'}
          />
        </Column>
      </Row>
      <Row>
        <Column small={4}>
          <FormTitleAndText
            title='E vai paperilasku'
            text={(invoice && getLabelOfOption(deliveryMethodOptions, invoice.delivery_method)) || '-'}
          />
        </Column>
        <Column small={4}>
          <FormTitleAndText
            title='Laskun tyyppi'
            text={(invoice && getLabelOfOption(typeOptions, invoice.type)) || '-'}
          />
        </Column>
        {(creditedInvoice && !!creditedInvoice.number) &&
          <Column small={4}>
            <FormTitleAndText
              title='Hyvitetty lasku'
              text={<a className='no-margin' onKeyDown={handleCreditedInvoiceKeyDown} onClick={handleCreditedInvoiceClick} tabIndex={0}>{creditedInvoice.number}</a>}
            />
          </Column>
        }
      </Row>
      <Row>
        <Column small={12}>
          <FormTitleAndText
            title='Tiedote'
            text={(invoice && invoice.notes) || '-'}
          />
        </Column>
      </Row>
      {!!creditInvoices.length &&
        <Row>
          <Column small={12}>
            <SubTitle>Hyvityslaskut</SubTitle>
            {!!creditInvoices.length &&
              <div>
                <Row>
                  <Column small={4}><FormTextTitle title='Laskunumero' /></Column>
                  <Column small={4}><FormTextTitle title='Summa' /></Column>
                  <Column small={4}><FormTextTitle title='Eräpäivä' /></Column>
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
                          {item.number
                            ? <a className='no-margin' onKeyDown={handleCreditInvoiceKeyDown} onClick={handleCreditInvoiceClick} tabIndex={0}>{item.number}</a>
                            : '-'
                          }
                        </FormText>
                      </Column>
                      <Column small={4}><FormText><AmountWithVat amount={item.total_amount} date={item.due_date} /></FormText></Column>
                      <Column small={4}><FormText>{formatDate(item.due_date)}</FormText></Column>
                    </Row>
                  );
                })}
              </div>
            }
          </Column>
        </Row>
      }
      <Row>
        <Column small={12}>
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
                    <Column small={6}><FormText className='align-right'>{row.amount
                      ? <AmountWithVat amount={row.amount} date={get(invoice, 'due_date')} />
                      : '-'
                    }</FormText></Column>
                  </Row>
                );
              })}
              <Divider className='invoice-divider' />
              <Row>
                <Column small={4}><FormText><strong>Yhteensä</strong></FormText></Column>
                <Column small={8}>
                  <FormText className='align-right'>
                    <strong><AmountWithVat amount={sum} date={get(invoice, 'due_date')} /></strong>
                  </FormText>
                </Column>
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
