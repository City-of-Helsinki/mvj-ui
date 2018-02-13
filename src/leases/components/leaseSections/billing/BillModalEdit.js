// @flow
import React from 'react';
import {Field} from 'redux-form';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';
import classNames from 'classnames';

import {formatDate,
  formatDecimalNumbers,
  formatNumberWithThousandSeparator} from '../../../../util/helpers';
import Button from '../../../../components/Button';
import FieldTypeDatePicker from '../../../../components/form/FieldTypeDatePicker';
import FieldTypeSelect from '../../../../components/form/FieldTypeSelect';
import FieldTypeText from '../../../../components/form/FieldTypeText';
import FieldTypeTextArea from '../../../../components/form/FieldTypeTextArea';
import {billingTypeOptions} from '../constants';

type Props = {
  bill: Object,
  containerHeight: ?number,
  onClose: Function,
  show: boolean,
}

const BillModalEdit = ({
  bill,
  containerHeight,
  onClose,
  show}: Props) => {
  return (
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
            <Column medium={8}>
              <label className='mvj-form-field-label'>Laskunsaaja</label>
              {(get(bill, 'tenant.firstname') || get(bill, 'tenant.lastname'))
                ? <p>{`${get(bill, 'tenant.lastname')} ${get(bill, 'tenant.firstname')}`}</p>
                : <p>-</p>
              }
            </Column>
            <Column medium={4}>
              <label className='mvj-form-field-label'>Lähetetty SAP:iin</label>
              <p>{get(bill, 'sent_to_SAP_date') ? formatDate(bill.sent_to_SAP_date) : '-'}</p>
            </Column>
          </Row>
          <Row>
            <Column medium={4}>
              <label className='mvj-form-field-label'>SAP numero</label>
              <p>{get(bill, 'SAP_number') ? bill.SAP_number : '-'}</p>
            </Column>
            <Column medium={4}>
              <Field
                component={FieldTypeDatePicker}
                label="Laskutuspvm"
                name="bill.invoicing_date"
              />
            </Column>
            <Column medium={4}>
              <Field
                component={FieldTypeSelect}
                label="Saamislaji"
                name="bill.type"
                options={billingTypeOptions}
              />
            </Column>
          </Row>
          <Row>
            <Column medium={4}>
              <Field
                component={FieldTypeText}
                label="Laskun tila"
                name="bill.status"
              />
            </Column>
            <Column medium={4}>
              <label className='mvj-form-field-label'>Laskutuskausi</label>
              <Row>
                <Column medium={6} style={{paddingRight: '0.25rem'}}>
                  <Field
                    component={FieldTypeDatePicker}
                    name="bill.billing_period_start_date"
                  />
                </Column>
                <Column medium={6} style={{paddingLeft: '0.25rem'}}>
                  <Field
                    component={FieldTypeDatePicker}
                    name="bill.billing_period_end_date"
                  />
                </Column>
              </Row>
            </Column>
            <Column medium={4}>
              <Field
                component={FieldTypeDatePicker}
                label="Lykkäyspvm"
                name="bill.suspension_date"
              />
            </Column>
          </Row>
          <Row>
            <Column medium={4}>
              <label className='mvj-form-field-label'>Laskun pääoma</label>
              <p>{get(bill, 'capital_amount') ? `${formatNumberWithThousandSeparator(formatDecimalNumbers(bill.capital_amount))} €` : '-'}</p>
            </Column>
            <Column medium={4}>
              <Field
                component={FieldTypeText}
                label="Laskun osuus"
                name="bill.tenant.bill_share_amount"
              />
            </Column>
          </Row>
          <Row>
            <Column medium={4}>
              <Field
                component={FieldTypeText}
                label="Maksamaton määrä"
                name="bill.unpaid_amount"
              />
            </Column>
            <Column medium={4}>
              <Field
                component={FieldTypeText}
                label="Laskutettu määrä"
                name="bill.invoiced_amount"
              />
            </Column>
          </Row>
          <Row>
            <Column medium={4}>
              <Field
                component={FieldTypeDatePicker}
                label="Maksukehotuspvm"
                name="bill.demand_date"
              />
            </Column>
            <Column medium={4}>
              <Field
                component={FieldTypeText}
                label="Perintäkulu"
                name="bill.recovery_cost"
              />
            </Column>
            <Column medium={4}>
              <Field
                component={FieldTypeText}
                label="Maksukehotus luettelo"
                name="bill.payment_demand_list"
              />
            </Column>
          </Row>
          <Row>
            <Column medium={4}>
              <Field
                component={FieldTypeText}
                label="E vai paperilasku"
                name="bill.invoice_method"
              />
            </Column>
            <Column medium={4}>
              <Field
                component={FieldTypeText}
                label="Laskun tyyppi"
                name="bill.invoice_type"
              />
            </Column>
          </Row>
          <Row>
            <Column medium={12}>
              <Field
                component={FieldTypeTextArea}
                label="Tiedote"
                name="bill.info"
                rows={2}
              />
            </Column>
          </Row>

          <Row>
            <Column medium={8}>
              <Button
                className="button-green no-margin"
                onClick={() => alert('Tallenna lasku')}
                text='Tallenna'
              />
            </Column>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default BillModalEdit;
