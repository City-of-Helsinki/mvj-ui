// @flow
import React from 'react';
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

type Props = {
  containerHeight: ?number,
  debt: Object,
  onClose: Function,
  show: boolean,
}

const AbnormalDebtModal = ({debt, containerHeight, onClose, show}: Props) => {
  return (
    <div className={classNames('bill-modal', {'is-open': show})} style={{height: containerHeight}}>
      <div className="bill-modal__container">
        <div className='bill-modal__title-row'>
          <div className='title'>
            <h1>Poikkeavan perinnän tiedot</h1>
          </div>
          <div className='close-button-container'>
            <a onClick={onClose}></a>
          </div>
        </div>
        <div className="section-item">
          <Row>
            <Column medium={8}>
              <label>Laskunsaaja</label>
              {(get(debt, 'tenant.firstname') || get(debt, 'tenant.lastname'))
                ? <p>{`${get(debt, 'tenant.lastname')} ${get(debt, 'tenant.firstname')}`}</p>
                : <p>-</p>
              }
            </Column>
            <Column medium={4}>
              <label>Lähetetty SAP:iin</label>
              <p>{debt.sent_to_SAP_date ? formatDate(debt.sent_to_SAP_date) : '-'}</p>
            </Column>
          </Row>
          <Row>
            <Column medium={4}>
              <label>SAP numero</label>
              <p>{debt.SAP_number ? debt.SAP_number : '-'}</p>
            </Column>
            <Column medium={4}>
              <label>Laskutuspvm</label>
              <p>{debt.invoicing_date ? formatDate(debt.invoicing_date) : '-'}</p>
            </Column>
            <Column medium={4}>
              <label>Saamislaji</label>
              <p>{debt.type ? getLabelOfOption(billingTypeOptions, debt.type) : '-'}</p>
            </Column>
          </Row>
          <Row>
            <Column medium={4}>
              <label>Laskun tila</label>
              <p>{debt.status ? getLabelOfOption(billingStatusOptions, debt.status) : '-'}</p>
            </Column>
            <Column medium={4}>
              <label>Laskutuskausi</label>
              <p>{formatDateRange(debt.billing_period_start_date, debt.billing_period_end_date)}</p>
            </Column>
            <Column medium={4}>
              <label>Lykkäyspvm</label>
              <p>{debt.suspension_date ? formatDate(debt.suspension_date) : '-'}</p>
            </Column>
          </Row>
          <Row>
            <Column medium={4}>
              <label>Laskun pääoma</label>
              <p>{debt.capital_amount ? `${formatNumberWithThousandSeparator(formatDecimalNumber(debt.capital_amount))} €` : '-'}</p>
            </Column>
            <Column medium={4}>
              <label>Laskun osuus</label>
              <p>{get(debt, 'tenant.bill_share') ? `${debt.tenant.bill_share} %` : '-'}</p>
            </Column>
          </Row>
          <Row>
            <Column medium={4}>
              <label>Maksamaton määrä</label>
              <p>{debt.unpaid_amount ? `${formatNumberWithThousandSeparator(formatDecimalNumber(debt.unpaid_amount))} €` : '-'}</p>
            </Column>
            <Column medium={4}>
              <label>Laskutettu määrä</label>
              <p>{debt.invoiced_amount ? `${formatNumberWithThousandSeparator(formatDecimalNumber(debt.invoiced_amount))} €` : '-'}</p>
            </Column>
          </Row>
          <Row>
            <Column medium={4}>
              <label>Maksukehotuspvm</label>
              <p>{debt.demand_date ? formatDate(debt.demand_date) : '-'}</p>
            </Column>
            <Column medium={4}>
              <label>Perintäkulu</label>
              <p>{debt.recovery_cost ? `${formatNumberWithThousandSeparator(formatDecimalNumber(debt.recovery_cost))} €` : '-'}</p>
            </Column>
            <Column medium={4}>
              <label>Maksukehotus luettelo</label>
              <p>{debt.payment_demand_list ? debt.payment_demand_list : '-'}</p>
            </Column>
          </Row>
          <Row>
            <Column medium={4}>
              <label>E vai paperilasku</label>
              <p>{debt.invoice_method ? getLabelOfOption(billingInvoiceMethodOptions, debt.invoice_method) : '-'}</p>
            </Column>
            <Column medium={4}>
              <label>Laskun tyyppi</label>
              <p>{debt.invoice_type ? getLabelOfOption(billingInvoiceTypeOptions, debt.invoice_type) : '-'}</p>
            </Column>
          </Row>
          <Row>
            <Column medium={12}>
              <label>Tiedote</label>
              <p>{debt.info ? debt.info : '-'}</p>
            </Column>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default AbnormalDebtModal;
