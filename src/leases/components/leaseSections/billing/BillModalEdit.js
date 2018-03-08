// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Field, formValueSelector} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import classNames from 'classnames';

import CloseButton from '$components/button/CloseButton';

import {
  formatDate,
  formatDateRange,
  formatDecimalNumber,
  formatNumberWithThousandSeparator,
  getLabelOfOption,
} from '$util/helpers';
import {
  billingInvoiceMethodOptions,
  billingInvoiceTypeOptions,
  billingStatusOptions,
  billingTypeOptions,
} from '../constants';
import {getBillingBillModalErrors} from '$src/leases/selectors';
import {dateGreaterOrEqual, decimalNumber, required} from '$components/form/validations';
import Button from '$components/button/Button';
import FieldTypeDatePicker from '$components/form/FieldTypeDatePicker';
import FieldTypeText from '$components/form/FieldTypeText';
import FieldTypeTextArea from '$components/form/FieldTypeTextArea';

const ARROW_UP_KEY = 38;
const ARROW_DOWN_KEY = 40;

type Props = {
  bill: Object,
  containerHeight: ?number,
  errors: ?Object,
  onClose: Function,
  onKeyCodeDown: Function,
  onKeyCodeUp: Function,
  onRefund: Function,
  onSave: Function,
  show: boolean,
  start_date: ?string,
}

class BillModalEdit extends Component {
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
    const {
      bill,
      containerHeight,
      errors,
      onClose,
      onRefund,
      onSave,
      show,
      start_date,
    } = this.props;

    return (
      <div className={classNames('bill-modal', {'is-open': show})} style={{height: containerHeight}}>
        <div className="bill-modal__container">
          <div className='bill-modal__header'>
            <h1>Laskun tiedot</h1>
            <CloseButton
              className='position-topright'
              onClick={onClose}
              title='Sulje'
            />
          </div>

          <div className="bill-modal__body with-footer">
            <Row>
              <Column medium={4}>
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
              <Column medium={4}>
                <label className='mvj-form-field-label'>SAP numero</label>
                <p>{get(bill, 'SAP_number') ? bill.SAP_number : '-'}</p>
              </Column>
            </Row>
            <Row>
              <Column medium={4}>
                {get(bill, 'SAP_number')
                  ? (<div>
                      <label className='mvj-form-field-label'>Eräpäivä</label>
                      <p>{get(bill, 'due_date') ? formatDate(bill.due_date) : '-'}</p>
                    </div>
                  ) : (<Field
                      component={FieldTypeDatePicker}
                      label="Eräpäivä"
                      name="bill.due_date"
                      validate={[
                        (value) => required(value, 'Eräpäivä on pakollinen'),
                      ]}
                    />
                  )
                }
              </Column>
              <Column medium={4}>
                <label className='mvj-form-field-label'>Laskutuspvm</label>
                <p>{get(bill, 'invoicing_date') ? formatDate(bill.invoicing_date) : '-'}</p>
              </Column>
              <Column medium={4}>
                <label className='mvj-form-field-label'>Saamislaji</label>
                <p>{get(bill, 'type') ? getLabelOfOption(billingTypeOptions, bill.type) : '-'}</p>
              </Column>
            </Row>
            <Row>
              <Column medium={4}>
                <label className='mvj-form-field-label'>Laskun tila</label>
                <p>{get(bill, 'status') ? getLabelOfOption(billingStatusOptions, bill.status) : '-'}</p>
              </Column>
              <Column medium={4}>
                <label className='mvj-form-field-label required'>Laskutuskausi</label>
                {!!get(bill, 'SAP_number') &&
                  <p>{formatDateRange(bill.billing_period_start_date, bill.billing_period_end_date)}</p>
                }
                {!get(bill, 'SAP_number') &&
                  <Row>
                    <Column medium={6} style={{paddingRight: '0.25rem'}}>
                      <Field
                        component={FieldTypeDatePicker}
                        name="bill.billing_period_start_date"
                        validate={[
                          (value) => required(value, 'Alkupäivämäärä on pakollinen'),
                        ]}
                      />
                    </Column>
                    <Column medium={6} style={{paddingLeft: '0.25rem'}}>
                      <Field
                        component={FieldTypeDatePicker}
                        name="bill.billing_period_end_date"
                        validate={[
                          (value) => required(value, 'Loppupäivämäärä on pakollinen'),
                          (value) => dateGreaterOrEqual(value, start_date),
                        ]}
                      />
                    </Column>
                  </Row>
                }
              </Column>
              <Column medium={4}>
                <label className='mvj-form-field-label'>Lykkäyspvm</label>
                <p>{get(bill, 'suspension_date') ? formatDate(bill.suspension_date) : '-'}</p>
              </Column>
            </Row>
            <Row>
              <Column medium={4}>
                {get(bill, 'SAP_number')
                  ? (<div>
                      <label className='mvj-form-field-label'>Laskun pääoma</label>
                      <p>{get(bill, 'capital_amount') ? `${formatNumberWithThousandSeparator(formatDecimalNumber(bill.capital_amount))} €` : '-'}</p>
                    </div>
                  ) : (<Field
                      component={FieldTypeText}
                      label="Laskun pääoma"
                      labelClassName='required'
                      name="bill.capital_amount"
                      validate={[
                        (value) => required(value, 'Laskun pääoma on pakollinen'),
                        (value) => decimalNumber(value, 'Laskun pääoman tulee olla numero'),
                      ]}
                    />
                  )
                }
              </Column>
              <Column medium={4}>
                <label className='mvj-form-field-label'>Laskun osuus</label>
                <p>{get(bill, 'tenant.bill_share') ? `${bill.tenant.bill_share} %` : '-'}</p>
              </Column>
            </Row>
            <Row>
              <Column medium={4}>
                <label className='mvj-form-field-label'>Laskutettu määrä</label>
                <p>{get(bill, 'invoiced_amount') ? `${formatNumberWithThousandSeparator(formatDecimalNumber(bill.invoiced_amount))} €` : '-'}</p>
              </Column>
              <Column medium={4}>
                <label className='mvj-form-field-label'>Maksamaton määrä</label>
                <p>{get(bill, 'unpaid_amount') ? `${formatNumberWithThousandSeparator(formatDecimalNumber(bill.unpaid_amount))} €` : '-'}</p>
              </Column>
            </Row>
            <Row>
              <Column medium={4}>
                <label className='mvj-form-field-label'>Maksukehotuspvm</label>
                <p>{get(bill, 'demand_date') ? formatDate(bill.demand_date) : '-'}</p>
              </Column>
              <Column medium={4}>
                <label className='mvj-form-field-label'>Perintäkulu</label>
                <p>{get(bill, 'recovery_cost') ? `${formatNumberWithThousandSeparator(formatDecimalNumber(bill.recovery_cost))} €` : '-'}</p>
              </Column>
              <Column medium={4}>
                <label className='mvj-form-field-label'>Maksukehotus luettelo</label>
                <p>{get(bill, 'payment_demand_list') ? bill.payment_demand_list : '-'}</p>
              </Column>
            </Row>
            <Row>
              <Column medium={4}>
                <label className='mvj-form-field-label'>E vai paperilasku</label>
                <p>{get(bill, 'invoice_method') ? getLabelOfOption(billingInvoiceMethodOptions, bill.invoice_method) : '-'}</p>
              </Column>
              <Column medium={4}>
                <label className='mvj-form-field-label'>Laskun tyyppi</label>
                <p>{get(bill, 'invoice_type') ? getLabelOfOption(billingInvoiceTypeOptions, bill.invoice_type) : '-'}</p>
              </Column>
            </Row>
            <Row>
              <Column medium={12}>
                {get(bill, 'SAP_number')
                  ? (<div>
                      <label className='mvj-form-field-label'>Tiedote</label>
                      <p>{get(bill, 'info') ? bill.info : '-'}</p>
                    </div>
                  ) : (<Field
                      component={FieldTypeTextArea}
                      label="Tiedote"
                      name="bill.info"
                      rows={2}
                    />
                  )
                }
              </Column>
            </Row>
          </div>
          <div className='bill-modal__footer'>
            <Button
              className="button-green no-margin"
              label='Hyvitä'
              onClick={() => onRefund(bill)}
              title='Hyvitä'
            />
            {!get(bill, 'SAP_number') &&
              <Button
                className="button-green no-margin pull-right"
                disabled={!isEmpty(errors)}
                label='Tallenna'
                onClick={() => onSave(bill)}
                title='Tallenna'
              />
            }
          </div>
        </div>
      </div>
    );
  }
}

const formName = 'billing-edit-form';
const selector = formValueSelector(formName);

export default flowRight(
  connect(
    (state) => {
      return {
        bill: selector(state, 'billing.bill'),
        errors: getBillingBillModalErrors(state),
        start_date: selector(state, 'billing.bill.billing_period_start_date'),
      };
    }
  ),
)(BillModalEdit);
