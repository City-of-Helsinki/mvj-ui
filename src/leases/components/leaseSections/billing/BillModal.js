// @flow
import React, {Component} from 'react';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';
import classNames from 'classnames';

import {formatDate,
  formatDateRange,
  formatDecimalNumber,
  formatNumberWithThousandSeparator,
  getLabelOfOption} from '../../../../util/helpers';
import {billingInvoiceMethodOptions,
  billingInvoiceTypeOptions,
  billingStatusOptions,
  billingTypeOptions} from '../constants';

const ARROW_UP_KEY = 38;
const ARROW_DOWN_KEY = 40;


type Props = {
  bill: Object,
  containerHeight: ?number,
  onClose: Function,
  onKeyCodeDown: Function,
  onKeyCodeUp: Function,
  show: boolean,
}

class BillModal extends Component {
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
    const {bill, containerHeight, onClose, show} = this.props;

    return(
      <div className={classNames('bill-modal', {'is-open': show})} style={{height: containerHeight}}>
        <div className="bill-modal__container">
          <div className='bill-modal__title-row'>
            <div className='title'>
              <h1>Laskun tiedot</h1>
            </div>
            <div className='close-button-container'>
              <a onClick={onClose}></a>
            </div>
          </div>
          <div className="section-item">
            <Row>
              <Column medium={4}>
                <label>Laskunsaaja</label>
                {(get(bill, 'tenant.firstname') || get(bill, 'tenant.lastname'))
                  ? <p>{`${get(bill, 'tenant.lastname')} ${get(bill, 'tenant.firstname')}`}</p>
                  : <p>-</p>
                }
              </Column>
              <Column medium={4}>
                <label>Lähetetty SAP:iin</label>
                <p>{bill.sent_to_SAP_date ? formatDate(bill.sent_to_SAP_date) : '-'}</p>
              </Column>
              <Column medium={4}>
                <label>SAP numero</label>
                <p>{bill.SAP_number ? bill.SAP_number : '-'}</p>
              </Column>
            </Row>
            <Row>
              <Column medium={4}>
                <label>Eräpäivä</label>
                <p>{bill.due_date ? formatDate(bill.due_date) : '-'}</p>
              </Column>
              <Column medium={4}>
                <label>Laskutuspvm</label>
                <p>{bill.invoicing_date ? formatDate(bill.invoicing_date) : '-'}</p>
              </Column>
              <Column medium={4}>
                <label>Saamislaji</label>
                <p>{bill.type ? getLabelOfOption(billingTypeOptions, bill.type) : '-'}</p>
              </Column>
            </Row>
            <Row>
              <Column medium={4}>
                <label>Laskun tila</label>
                <p>{bill.status ? getLabelOfOption(billingStatusOptions, bill.status) : '-'}</p>
              </Column>
              <Column medium={4}>
                <label>Laskutuskausi</label>
                <p>{formatDateRange(bill.billing_period_start_date, bill.billing_period_end_date)}</p>
              </Column>
              <Column medium={4}>
                <label>Lykkäyspvm</label>
                <p>{bill.suspension_date ? formatDate(bill.suspension_date) : '-'}</p>
              </Column>
            </Row>
            <Row>
              <Column medium={4}>
                <label>Laskun pääoma</label>
                <p>{bill.capital_amount ? `${formatNumberWithThousandSeparator(formatDecimalNumber(bill.capital_amount))} €` : '-'}</p>
              </Column>
              <Column medium={4}>
                <label>Laskun osuus</label>
                <p>{get(bill, 'tenant.bill_share') ? `${bill.tenant.bill_share} %` : '-'}</p>
              </Column>
            </Row>
            <Row>
              <Column medium={4}>
                <label>Laskutettu määrä</label>
                <p>{bill.invoiced_amount ? `${formatNumberWithThousandSeparator(formatDecimalNumber(bill.invoiced_amount))} €` : '-'}</p>
              </Column>
              <Column medium={4}>
                <label>Maksamaton määrä</label>
                <p>{bill.unpaid_amount ? `${formatNumberWithThousandSeparator(formatDecimalNumber(bill.unpaid_amount))} €` : '-'}</p>
              </Column>
            </Row>
            <Row>
              <Column medium={4}>
                <label>Maksukehotuspvm</label>
                <p>{bill.demand_date ? formatDate(bill.demand_date) : '-'}</p>
              </Column>
              <Column medium={4}>
                <label>Perintäkulu</label>
                <p>{bill.recovery_cost ? `${formatNumberWithThousandSeparator(formatDecimalNumber(bill.recovery_cost))} €` : '-'}</p>
              </Column>
              <Column medium={4}>
                <label>Maksukehotus luettelo</label>
                <p>{bill.payment_demand_list ? bill.payment_demand_list : '-'}</p>
              </Column>
            </Row>
            <Row>
              <Column medium={4}>
                <label>E vai paperilasku</label>
                <p>{bill.invoice_method ? getLabelOfOption(billingInvoiceMethodOptions, bill.invoice_method) : '-'}</p>
              </Column>
              <Column medium={4}>
                <label>Laskun tyyppi</label>
                <p>{bill.invoice_type ? getLabelOfOption(billingInvoiceTypeOptions, bill.invoice_type) : '-'}</p>
              </Column>
            </Row>
            <Row>
              <Column medium={12}>
                <label>Tiedote</label>
                <p>{bill.info ? bill.info : '-'}</p>
              </Column>
            </Row>
          </div>
        </div>
      </div>
    );
  }
}

export default BillModal;
