// @flow
import React from 'react';
import classNames from 'classnames';
// import {Field} from 'redux-form';
import get from 'lodash/get';

import {formatDate,
  formatDateRange,
  formatDecimalNumber,
  getLabelOfOption,
  formatNumberWithThousandSeparator} from '../../../../util/helpers';
import {billingStatusOptions, billingTypeOptions} from '../constants';
// import FieldTypeCheckboxSingle from '../../../../components/form/FieldTypeCheckboxSingle';

type Props = {
  bills: Array<Object>,
  fields: any,
  onRowClick: Function,
  selectedBillIndex: Object,
}

const BillsTableBodyEdit = ({bills, fields, onRowClick, selectedBillIndex}: Props) => {
  if(!bills || bills.length === 0) {
    return <tbody></tbody>;
  }

  return (
    <tbody>
      {fields.map((field, index) => {
        return (
          <tr
            className={classNames(
              {'selected': (bills && bills.length > index) && bills[index].isSelected},
              {'active': (index === selectedBillIndex)},
            )}
            key={index}>
            {/* <td>
              <Field
                className='no-margin'
                component={FieldTypeCheckboxSingle}
                name={`${field}.isSelected`}
              />
            </td> */}
            <td onClick={() => onRowClick(index)}>
              {bills && bills.length > (index) &&
                `${get(bills[index], 'tenant.lastname')} ${get(bills[index], 'tenant.firstname')}`
              }
            </td>
            <td onClick={() => onRowClick(index)}>
              {bills && bills.length > (index) &&
                bills[index].due_date ? formatDate(bills[index].due_date) : '-'
              }
            </td>
            <td onClick={() => onRowClick(index)}>
              {bills && bills.length > (index) &&
                bills[index].bill_number ? bills[index].bill_number : '-'
              }
            </td>
            <td onClick={() => onRowClick(index)}>
              {bills && bills.length > (index) &&
                get(bills[index], 'tenant.bill_share') ? `${get(bills[index], 'tenant.bill_share')} %` : '-'
              }
            </td>
            <td onClick={() => onRowClick(index)}>
              {bills && bills.length > (index) &&
                formatDateRange(bills[index].billing_period_start_date, bills[index].billing_period_end_date)
              }
            </td>
            <td onClick={() => onRowClick(index)}>
              {bills && bills.length > (index) &&
                bills[index].type ? getLabelOfOption(billingTypeOptions, bills[index].type) : '-'
              }
            </td>
            <td onClick={() => onRowClick(index)}>
              {bills && bills.length > (index) &&
                bills[index].status ? getLabelOfOption(billingStatusOptions, bills[index].status) : '-'
              }
            </td>
            <td onClick={() => onRowClick(index)}>
              {bills && bills.length > (index) &&
                bills[index].invoiced_amount ? `${formatNumberWithThousandSeparator(formatDecimalNumber(bills[index].invoiced_amount))} €` : '-'
              }
            </td>
            <td onClick={() => onRowClick(index)}>
              {bills && bills.length > (index) &&
                bills[index].unpaid_amount ? `${formatNumberWithThousandSeparator(formatDecimalNumber(bills[index].unpaid_amount))} €` : '-'
              }
            </td>
            <td onClick={() => onRowClick(index)}>
              {bills && bills.length > (index) &&
                bills[index].info ? 'Kyllä' : 'Ei'
              }
            </td>
            <td onClick={() => onRowClick(index)}>
              {bills && bills.length > (index) &&
                bills[index].sent_to_SAP_date ? formatDate(bills[index].sent_to_SAP_date) : '-'
              }
            </td>
          </tr>
        );
      })}
    </tbody>
  );
};

export default BillsTableBodyEdit;
