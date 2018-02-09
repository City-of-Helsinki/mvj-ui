// @flow
import React, {Component} from 'react';
import {change, Field, FieldArray} from 'redux-form';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import isNumber from 'lodash/isNumber';
import classNames from 'classnames';

import {formatDate,
  formatDateRange,
  formatDecimalNumbers,
  formatNumberWithThousandSeparator} from '../../../../util/helpers';
import FieldTypeCheckboxSingle from '../../../../components/form/FieldTypeCheckboxSingle';
import BillModalEdit from './BillModalEdit';

type BillsTableRowsProps = {
  bills: Array<Object>,
  fields: any,
  onRowClick: Function,
  selectedBillIndex: Object,
}

const BillsTableRowsEdit = ({bills, fields, onRowClick, selectedBillIndex}: BillsTableRowsProps) => {
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
            <td>
              <Field
                component={FieldTypeCheckboxSingle}
                name={`${field}.isSelected`}
              />
            </td>
            <td onClick={() => onRowClick(index)}>
              {bills && bills.length > (index) &&
                `${get(bills[index], 'tenant.lastname')} ${get(bills[index], 'tenant.firstname')}`
              }
            </td>
            <td onClick={() => onRowClick(index)}>
              {bills && bills.length > (index) &&
                get(bills[index], 'tenant.bill_share') ? `${get(bills[index], 'tenant.bill_share')} %` : '-'
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
                formatDateRange(bills[index].billing_period_start_date, bills[index].billing_period_end_date)
              }
            </td>
            <td onClick={() => onRowClick(index)}>
              {bills && bills.length > (index) &&
                bills[index].type ? bills[index].type : '-'
              }
            </td>
            <td onClick={() => onRowClick(index)}>
              {bills && bills.length > (index) &&
                bills[index].status ? bills[index].status : '-'
              }
            </td>
            <td onClick={() => onRowClick(index)}>
              {bills && bills.length > (index) &&
                bills[index].invoiced_amount ? `${formatNumberWithThousandSeparator(formatDecimalNumbers(bills[index].invoiced_amount))} €` : '-'
              }
            </td>
            <td onClick={() => onRowClick(index)}>
              {bills && bills.length > (index) &&
                bills[index].unpaid_amount ? `${formatNumberWithThousandSeparator(formatDecimalNumbers(bills[index].unpaid_amount))} €` : '-'
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

type Props = {
  bills: Array<Object>,
  dispatch: Function,
  fields: any,
  headers: Array<string>,
}

type State = {
  selectedBill: ?Object,
  selectedBillIndex: ?number,
  showModal: boolean,
  tableHeight: ?number,
}

class BillsTableEdit extends Component {
  props: Props

  tableElement: any

  state: State = {
    selectedBill: null,
    selectedBillIndex: null,
    showModal: false,
    tableHeight: null,
  }

  calculateHeight = () => {
    let {clientHeight} = this.tableElement;
    const {showModal} = this.state;

    if(showModal) {clientHeight = 560;}
    if(clientHeight > 560) {clientHeight = 560;}

    this.setState({tableHeight: clientHeight});
  }

  componentDidMount() {
    this.calculateHeight();
  }

  componentDidUpdate() {
    this.calculateHeight();
  }

  shouldComponentUpdate(nextProps: Object, nextState: Object) {
    return (
      this.state.tableHeight !== nextState.tableHeight ||
      this.state.selectedBill !== nextState.selectedBill ||
      this.state.showModal !== nextState.showModal ||
      this.props.bills !== nextProps.bills
    );
  }

  showBillModal = (index: number) => {
    const {bills, dispatch} = this.props;

    if(bills && bills.length) {
      this.setState({
        selectedBill: bills[index],
        selectedBillIndex: index,
        showModal: true,
      });
      dispatch(change('billing-edit-form', `billing.bill`, bills[index]));
    }
  }

  handleSelectAll = () => {
    const {dispatch, bills} = this.props;
    if(!bills || !bills.length) {return null;}

    const allSelected = this.areAllSelected();
    for(let i = 0; i < bills.length; i++) {
      dispatch(change('billing-edit-form', `billing.bills[${i}].isSelected`, !allSelected));
    }
  }

  areAllSelected = () => {
    const {bills} = this.props;
    if(!bills || !bills.length) {return false;}

    let allSelected = true;
    forEach(bills, (bill) => {
      if(!bill.isSelected) {
        allSelected = false;
        return false;
      }
    });
    return allSelected;
  }

  render () {
    const {bills, headers} = this.props;
    const {selectedBill, selectedBillIndex, showModal, tableHeight} = this.state;
    const allSelected = this.areAllSelected();

    return (
      <div className={classNames('table-fixed-header', 'billing__bill-table', {'is-open': showModal})}>
        <div className="table-fixed-header__container" style={{maxHeight: tableHeight}}>
          <Field
            bill={selectedBill}
            component={BillModalEdit}
            containerHeight={isNumber(tableHeight) ? tableHeight + 31 : null}
            name='selected_bill'
            onClose={() => this.setState({selectedBill: null, selectedBillIndex: null, showModal: false})}
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
            <FieldArray
              bills={bills}
              component={BillsTableRowsEdit}
              name="bills"
              onRowClick={(index) => this.showBillModal(index)}
              selectedBillIndex={selectedBillIndex}
            />
          </table>
        </div>
      </div>
    );
  }
}

export default BillsTableEdit;
