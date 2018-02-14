// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Field, formValueSelector} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import classNames from 'classnames';
import type Moment from 'moment';

import {formatDate,
  formatDecimalNumber,
  formatNumberWithThousandSeparator} from '../../../../util/helpers';
import {billingInvoiceMethodOptions,
  billingInvoiceTypeOptions,
  billingStatusOptions,
  billingTypeOptions} from '../constants';
import {getBillingAbnormalDebtModalErrors} from '../../../selectors';
import {dateGreaterOrEqual, decimalNumber, required} from '../../../../components/form/validations';
import Button from '../../../../components/Button';
import FieldTypeDatePicker from '../../../../components/form/FieldTypeDatePicker';
import FieldTypeSelect from '../../../../components/form/FieldTypeSelect';
import FieldTypeText from '../../../../components/form/FieldTypeText';
import FieldTypeTextArea from '../../../../components/form/FieldTypeTextArea';


type Props = {
  abnormalDebt: Object,
  containerHeight: ?number,
  errors: ?Object,
  onClose: Function,
  onSave: Function,
  show: boolean,
  start_date: ?Moment,
}

const AbnormalDebtModalEdit = ({
  abnormalDebt,
  containerHeight,
  errors,
  onClose,
  onSave,
  show,
  start_date}: Props) => {
  console.log(errors);
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
              <label className='mvj-form-field-label'>Laskunsaaja</label>
              {(get(abnormalDebt, 'tenant.firstname') || get(abnormalDebt, 'tenant.lastname'))
                ? <p>{`${get(abnormalDebt, 'tenant.lastname')} ${get(abnormalDebt, 'tenant.firstname')}`}</p>
                : <p>-</p>
              }
            </Column>
            <Column medium={4}>
              <label className='mvj-form-field-label'>Lähetetty SAP:iin</label>
              <p>{get(abnormalDebt, 'sent_to_SAP_date') ? formatDate(abnormalDebt.sent_to_SAP_date) : '-'}</p>
            </Column>
          </Row>
          <Row>
            <Column medium={4}>
              <label className='mvj-form-field-label'>SAP numero</label>
              <p>{get(abnormalDebt, 'SAP_number') ? abnormalDebt.SAP_number : '-'}</p>
            </Column>
            <Column medium={4}>
              <Field
                component={FieldTypeDatePicker}
                label="Laskutuspvm"
                labelClassName='required'
                name="abnormal_debt.invoicing_date"
                validate={[
                  (value) => required(value, 'Laskutuspäivämäärä on pakollinen'),
                ]}
              />
            </Column>
            <Column medium={4}>
              <Field
                component={FieldTypeSelect}
                label="Saamislaji"
                labelClassName='required'
                name="abnormal_debt.type"
                options={billingTypeOptions}
                validate={[
                  (value) => required(value, 'Saamislaji on pakollinen'),
                ]}
              />
            </Column>
          </Row>
          <Row>
            <Column medium={4}>
              <Field
                component={FieldTypeSelect}
                label="Laskun tila"
                labelClassName='required'
                name="abnormal_debt.status"
                options={billingStatusOptions}
                validate={[
                  (value) => required(value, 'Laskun tila on pakollinen'),
                ]}
              />
            </Column>
            <Column medium={4}>
              <label className='mvj-form-field-label required'>Laskutuskausi</label>
              <Row>
                <Column medium={6} style={{paddingRight: '0.25rem'}}>
                  <Field
                    component={FieldTypeDatePicker}
                    name="abnormal_debt.billing_period_start_date"
                    validate={[
                      (value) => required(value, 'Alkupäivämäärä on pakollinen'),
                    ]}
                  />
                </Column>
                <Column medium={6} style={{paddingLeft: '0.25rem'}}>
                  <Field
                    component={FieldTypeDatePicker}
                    name="abnormal_debt.billing_period_end_date"
                    validate={[
                      (value) => required(value, 'Loppupäivämäärä on pakollinen'),
                      (value) => dateGreaterOrEqual(value, start_date),
                    ]}
                  />
                </Column>
              </Row>
            </Column>
            <Column medium={4}>
              <Field
                component={FieldTypeDatePicker}
                label="Lykkäyspvm"
                name="abnormal_debt.suspension_date"
              />
            </Column>
          </Row>
          <Row>
            <Column medium={4}>
              <label className='mvj-form-field-label'>Laskun pääoma</label>
              <p>{get(abnormalDebt, 'capital_amount') ? `${formatNumberWithThousandSeparator(formatDecimalNumber(abnormalDebt.capital_amount))} €` : '-'}</p>
            </Column>
            <Column medium={4}>
              <Field
                component={FieldTypeText}
                label="Laskun osuus"
                labelClassName='required'
                name="abnormal_debt.tenant.bill_share"
                validate={[
                  (value) => required(value, 'Laskun osuus on pakollinen'),
                  (value) => decimalNumber(value, 'Laskun osuuden tulee olla numero'),
                ]}
              />
            </Column>
          </Row>
          <Row>
            <Column medium={4}>
              <Field
                component={FieldTypeText}
                label="Maksamaton määrä"
                name="abnormal_debt.unpaid_amount"
                validate={[
                  (value) => decimalNumber(value, 'Maksamattoman määrän tulee olla numero'),
                ]}
              />
            </Column>
            <Column medium={4}>
              <Field
                component={FieldTypeText}
                label="Laskutettu määrä"
                name="abnormal_debt.invoiced_amount"
                validate={[
                  (value) => decimalNumber(value, 'Laskutetun määrän tulee olla numero'),
                ]}
              />
            </Column>
          </Row>
          <Row>
            <Column medium={4}>
              <Field
                component={FieldTypeDatePicker}
                label="Maksukehotuspvm"
                name="abnormal_debt.demand_date"
              />
            </Column>
            <Column medium={4}>
              <Field
                component={FieldTypeText}
                label="Perintäkulu"
                name="abnormal_debt.recovery_cost"
                validate={[
                  (value) => decimalNumber(value, 'Perintäkulun tulee olla numero'),
                ]}
              />
            </Column>
            <Column medium={4}>
              <Field
                component={FieldTypeText}
                label="Maksukehotus luettelo"
                name="abnormal_debt.payment_demand_list"
              />
            </Column>
          </Row>
          <Row>
            <Column medium={4}>
              <Field
                component={FieldTypeSelect}
                label="E vai paperilasku"
                labelClassName='required'
                name="abnormal_debt.invoice_method"
                options={billingInvoiceMethodOptions}
                validate={[
                  (value) => required(value, 'Valinta on pakollinen'),
                ]}
              />
            </Column>
            <Column medium={4}>
              <Field
                component={FieldTypeSelect}
                label="Laskun tyyppi"
                labelClassName='required'
                name="abnormal_debt.invoice_type"
                options={billingInvoiceTypeOptions}
                validate={[
                  (value) => required(value, 'Laskun tyyppi on pakollinen'),
                ]}
              />
            </Column>
          </Row>
          <Row>
            <Column medium={12}>
              <Field
                component={FieldTypeTextArea}
                label="Tiedote"
                name="abnormal_debt.info"
                rows={2}
              />
            </Column>
          </Row>

          <Row>
            <Column medium={8}>
              <Button
                className="button-green no-margin"
                disabled={!isEmpty(errors)}
                onClick={() => onSave(abnormalDebt)}
                text='Tallenna'
              />
            </Column>
          </Row>
        </div>
      </div>
    </div>
  );
};

const formName = 'billing-edit-form';
const selector = formValueSelector(formName);

export default flowRight(
  connect(
    (state) => {
      return {
        abnormalDebt: selector(state, 'billing.abnormal_debt'),
        errors: getBillingAbnormalDebtModalErrors(state),
        start_date: selector(state, 'billing.abnormal_debt.billing_period_start_date'),
      };
    }
  ),
)(AbnormalDebtModalEdit);
