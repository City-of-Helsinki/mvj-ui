// @flow
import React, {Component} from 'react';
import {Row, Column} from 'react-foundation';
import classNames from 'classnames';

import CloseButton from '$components/button/CloseButton';

import {
  formatDate,
  formatDateRange,
  formatDecimalNumber,
  formatNumberWithThousandSeparator,
  getAttributeFieldOptions,
  getLabelOfOption,
} from '$util/helpers';
import {getInvoiceSharePercentage} from '$src/leases/helpers';
import {getContactFullName} from '$src/contacts/helpers';

import type {Attributes as InvoiceAttributes} from '$src/invoices/types';

const ARROW_UP_KEY = 38;
const ARROW_DOWN_KEY = 40;


type Props = {
  containerHeight: ?number,
  invoice: Object,
  invoiceAttributes: InvoiceAttributes,
  onClose: Function,
  onKeyCodeDown: Function,
  onKeyCodeUp: Function,
  show: boolean,
}

class InvoiceModal extends Component {
  props: Props

  componentWillMount(){
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount(){
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown = (e: any) => {
    const {onKeyCodeDown, onKeyCodeUp} = this.props;

    switch(e.keyCode) {
      case ARROW_DOWN_KEY:
        onKeyCodeDown();
        e.preventDefault();
        break;
      case ARROW_UP_KEY:
        onKeyCodeUp();
        e.preventDefault();
        break;
      default:
        break;
    }
  }

  render() {
    const {containerHeight, invoice, invoiceAttributes, onClose, show} = this.props;

    const receivableTypeOptions = getAttributeFieldOptions(invoiceAttributes, 'receivable_type');
    const stateOptions = getAttributeFieldOptions(invoiceAttributes, 'state');
    const deliveryMethodOptions = getAttributeFieldOptions(invoiceAttributes, 'delivery_method');
    const typeOptions = getAttributeFieldOptions(invoiceAttributes, 'type');

    return(
      <div className={classNames('invoice-modal', {'is-open': show})} style={{height: containerHeight}}>
        <div className="invoice-modal__container">
          <div className='invoice-modal__header'>
            <h1>Laskun tiedot</h1>
            <CloseButton
              className='position-topright'
              onClick={onClose}
              title='Sulje'
            />
          </div>

          <div className="invoice-modal__body">
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
        </div>
      </div>
    );
  }
}

export default InvoiceModal;
