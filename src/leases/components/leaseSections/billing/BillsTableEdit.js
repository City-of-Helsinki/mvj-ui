// @flow
import React, {Component} from 'react';
import {change, Field} from 'redux-form';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import isNumber from 'lodash/isNumber';
import classNames from 'classnames';

import {formatDate,
  formatDateRange,
  formatDecimalNumbers,
  formatNumberWithThousandSeparator} from '../../../../util/helpers';
import FieldTypeCheckboxSingle from '../../../../components/form/FieldTypeCheckboxSingle';
import BillModal from './BillModal';

type Props = {
  bills: Array<Object>,
  dispatch: Function,
  fields: any,
  headers: Array<string>,
}

type State = {
  selectedBill: Object,
  showModal: boolean,
  tableHeight: ?number,
}

class BillsTableEdit extends Component {
  props: Props

  tableElement: any

  state: State = {
    selectedBill: {},
    showModal: false,
    tableHeight: null,
  }

  handleSelectAll = () => {
    const {dispatch, fields} = this.props;
    const allSelected = this.areAllSelected();
    fields.forEach((field) => {
      dispatch(change('billing-edit-form', `${field}.isSelected`, !allSelected));
    });
  }

  areAllSelected = () => {
    const {bills} = this.props;
    if(!bills || !bills.length) {
      return false;
    }

    let allSelected = true;
    forEach(bills, (bill) => {
      if(!bill.isSelected) {
        allSelected = false;
        return false;
      }
    });
    return allSelected;
  }

  calculateHeight = () => {
    let {clientHeight} = this.tableElement;
    const {showModal} = this.state;

    if(showModal) {clientHeight = 450;}
    if(clientHeight > 450) {clientHeight = 450;}

    this.setState({tableHeight: clientHeight});
  }

  componentDidMount() {
    this.calculateHeight();
  }

  render () {
    const {bills, fields, headers} = this.props;
    const {selectedBill, showModal, tableHeight} = this.state;
    const allSelected = this.areAllSelected();

    return (
      <div className={classNames('table-fixed-header', 'billing__bill-table', {'is-open': showModal})}>
        <div className="table-fixed-header__container" style={{maxHeight: tableHeight}}>
          <BillModal
            bill={selectedBill}
            containerHeight={isNumber(tableHeight) ? tableHeight + 30 : null}
            onClose={() => this.setState({selectedBill: {}, showModal: false})}
            show={showModal}
          />
          <div className="table-fixed-header__header-border" />
          <table ref={(ref) => this.tableElement = ref}>
            <thead>
              {headers && headers.length > 0 &&
                <tr>
                  <th><div>
                    <input
                      checked={allSelected}
                      onClick={this.handleSelectAll}
                      style={{fontSize: '1rem', margin: '0'}}
                      type="checkbox" />
                  </div></th>
                  {headers.map((header, index) => <th key={index}>{header}<div>{header}</div></th>)}
                </tr>
              }
            </thead>
            {fields && fields.length > 0 &&
              <tbody>
                {fields.map((field, index) => {
                  return (
                    <tr
                      className={classNames({'selected': bills && bills.length > index && bills[index].isSelected})}
                      key={index}>
                      <td>
                        <Field
                          component={FieldTypeCheckboxSingle}
                          name={`${field}.isSelected`}
                        />
                      </td>
                      <td>
                        {bills && bills.length > (index) &&
                          `${get(bills[index], 'tenant.lastname')} ${get(bills[index], 'tenant.firstname')}`
                        }
                      </td>
                      <td>
                        {bills && bills.length > (index) &&
                          get(bills[index], 'tenant.bill_share') ? `${get(bills[index], 'tenant.bill_share')} %` : '-'
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
                          formatDateRange(bills[index].billing_period_start_date, bills[index].billing_period_end_date)
                        }
                      </td>
                      <td>
                        {bills && bills.length > (index) &&
                          bills[index].type ? bills[index].type : '-'
                        }
                      </td>
                      <td>
                        {bills && bills.length > (index) &&
                          bills[index].status ? bills[index].status : '-'
                        }
                      </td>
                      <td>
                        {bills && bills.length > (index) &&
                          bills[index].invoiced_amount ? `${formatNumberWithThousandSeparator(formatDecimalNumbers(bills[index].invoiced_amount))} €` : '-'
                        }
                      </td>
                      <td>
                        {bills && bills.length > (index) &&
                          bills[index].unpaid_amount ? `${formatNumberWithThousandSeparator(formatDecimalNumbers(bills[index].unpaid_amount))} €` : '-'
                        }
                      </td>
                      <td>
                        {bills && bills.length > (index) &&
                          bills[index].info ? 'Kyllä' : 'Ei'
                        }
                      </td>
                      <td>
                        {bills && bills.length > (index) &&
                          bills[index].sent_to_SAP_date ? formatDate(bills[index].sent_to_SAP_date) : '-'
                        }
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            }
            {!bills || bills.length === 0 && <tbody></tbody>}
          </table>
        </div>
      </div>
    );
  }
}

export default BillsTableEdit;
