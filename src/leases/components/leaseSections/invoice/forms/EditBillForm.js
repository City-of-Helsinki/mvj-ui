// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import {Field, formValueSelector, reduxForm} from 'redux-form';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';

import FieldTypeDatePicker from '$components/form/FieldTypeDatePicker';
import FieldTypeText from '$components/form/FieldTypeText';
import FieldTypeTextArea from '$components/form/FieldTypeTextArea';
import {dateGreaterOrEqual, decimalNumber, required} from '$components/form/validations';

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
} from '../../constants';

type Props = {
  bill: Object,
  handleSubmit: Function,
  startDate: string,
}

const EditBillForm = ({
  bill,
  handleSubmit,
  startDate,
}: Props) => {

  return (
    <form onSubmit={handleSubmit}>
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
                name="due_date"
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
                  name="billing_period_start_date"
                  validate={[
                    (value) => required(value, 'Alkupäivämäärä on pakollinen'),
                  ]}
                />
              </Column>
              <Column medium={6} style={{paddingLeft: '0.25rem'}}>
                <Field
                  component={FieldTypeDatePicker}
                  name="billing_period_end_date"
                  validate={[
                    (value) => required(value, 'Loppupäivämäärä on pakollinen'),
                    (value) => dateGreaterOrEqual(value, startDate),
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
            ) : (
              <Field
                component={FieldTypeText}
                label="Laskun pääoma"
                labelClassName='required'
                name="capital_amount"
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
                name="info"
                rows={2}
              />
            )
          }
        </Column>
      </Row>
    </form>
  );
};

const formName = 'billing-edit-bill-form';
const selector = formValueSelector(formName);

export default flowRight(
  connect(
    (state) => {
      return {
        startDate: selector(state, 'start_date'),
      };
    }
  ),
  reduxForm({
    form: formName,
  }),
)(EditBillForm);
