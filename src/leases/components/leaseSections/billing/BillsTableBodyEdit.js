// @flow
import React from 'react';
import classNames from 'classnames';
import get from 'lodash/get';

import {formatDate,
  formatDateRange,
  formatDecimalNumber,
  getLabelOfOption,
  formatNumberWithThousandSeparator} from '$util/helpers';
import {billingStatusOptions, billingTypeOptions} from '../constants';


type Props = {
  bills: Array<Object>,
  fields: any,
  onRowClick: Function,
  selectedBillIndex: Object,
  showAllColumns: boolean,
}

const BillsTableBodyEdit = ({
  bills,
  fields,
  onRowClick,
  selectedBillIndex,
  showAllColumns,
}: Props) => {
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
            key={index}
            onClick={() => onRowClick(index)}>
            <td>
              {bills && bills.length > (index) &&
                `${get(bills[index], 'tenant.lastname')} ${get(bills[index], 'tenant.firstname')}`
              }
            </td>
            <td>
              {bills && bills.length > (index) &&
                bills[index].due_date ? formatDate(bills[index].due_date) : '-'
              }
            </td>
            <td>
              {bills && bills.length > (index) &&
                bills[index].bill_number ? bills[index].bill_number : '-'
              }
            </td>
            <td>
              {bills && bills.length > (index) &&
                get(bills[index], 'tenant.bill_share') ? `${get(bills[index], 'tenant.bill_share')} %` : '-'
              }
            </td>
            {showAllColumns &&
              <td>
                {bills && bills.length > (index) &&
                  formatDateRange(bills[index].billing_period_start_date, bills[index].billing_period_end_date)
                }
              </td>
            }
            {showAllColumns &&
              <td>
                {bills && bills.length > (index) &&
                  bills[index].type ? getLabelOfOption(billingTypeOptions, bills[index].type) : '-'
                }
              </td>
            }
            {showAllColumns &&
              <td>
                {bills && bills.length > (index) &&
                  bills[index].status ? getLabelOfOption(billingStatusOptions, bills[index].status) : '-'
                }
              </td>
            }
            {showAllColumns &&
              <td>
                {bills && bills.length > (index) &&
                  bills[index].invoiced_amount ? `${formatNumberWithThousandSeparator(formatDecimalNumber(bills[index].invoiced_amount))} €` : '-'
                }
              </td>
            }
            {showAllColumns &&
              <td>
                {bills && bills.length > (index) &&
                  bills[index].unpaid_amount ? `${formatNumberWithThousandSeparator(formatDecimalNumber(bills[index].unpaid_amount))} €` : '-'
                }
              </td>
            }
            {showAllColumns &&
              <td>
                {bills && bills.length > (index) &&
                  bills[index].info ? 'Kyllä' : 'Ei'
                }
              </td>
            }
            {showAllColumns &&
              <td>
                {bills && bills.length > (index) &&
                  bills[index].sent_to_SAP_date ? formatDate(bills[index].sent_to_SAP_date) : '-'
                }
              </td>
            }
          </tr>
        );
      })}
    </tbody>
  );
};

export default BillsTableBodyEdit;
