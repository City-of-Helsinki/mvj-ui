// @flow
import React, {Component} from 'react';
import {Row, Column} from 'react-foundation';
import {connect} from 'react-redux';
import {change, Field, FieldArray, formValueSelector, initialize} from 'redux-form';
import flowRight from 'lodash/flowRight';
import forEach from 'lodash/forEach';
import isNumber from 'lodash/isNumber';
import classNames from 'classnames';

import {displayUIMessage} from '$util/helpers';
import {formatBillingBillDb} from '$src/leases/helpers';
import BillModalEdit from './BillModalEdit';
import BillsTableBodyEdit from './BillsTableBodyEdit';
// import Button from '$components/button/Button';

type Props = {
  billing: Object,
  bills: Array<Object>,
  dispatch: Function,
  fields: any,
  headers: Array<string>,
}

type State = {
  selectedBill: ?Object,
  selectedBillIndex: number,
  showModal: boolean,
  tableHeight: ?number,
}

class BillsTableEdit extends Component {
  props: Props

  tableElement: any

  state: State = {
    selectedBill: null,
    selectedBillIndex: -1,
    showModal: false,
    tableHeight: null,
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
      this.props !== nextProps
    );
  }

  calculateHeight = () => {
    let {clientHeight} = this.tableElement;
    const {showModal} = this.state;

    if(showModal) {clientHeight = 580;}
    if(clientHeight > 580) {clientHeight = 580;}

    this.setState({tableHeight: clientHeight});
  }

  handleKeyCodeDown = () => {
    const {bills} = this.props;
    const {selectedBillIndex} = this.state;
    if(selectedBillIndex < bills.length - 1) {
      const newIndex = selectedBillIndex + 1;
      this.setState({selectedBill: bills[newIndex], selectedBillIndex: newIndex, showModal: true});
      this.initilizeBillEditForm(bills[newIndex]);
    }
  }

  handleKeyCodeUp = () => {
    const {bills} = this.props;
    const {selectedBillIndex} = this.state;
    if(selectedBillIndex > 0) {
      const newIndex = selectedBillIndex - 1;
      this.setState({selectedBill: bills[newIndex], selectedBillIndex: newIndex, showModal: true});
      this.initilizeBillEditForm(bills[newIndex]);
    }
  }

  initilizeBillEditForm = (bill: Object) => {
    const {billing, dispatch} = this.props;
    billing.bill = bill;

    // dispatch(destroy('billing-edit-form'));
    dispatch(initialize('billing-edit-form', {billing: billing}, true, {}));
  }

  showBillModal = (index: number) => {
    const {bills} = this.props;

    if(bills && bills.length) {
      this.setState({
        selectedBill: bills[index],
        selectedBillIndex: index,
        showModal: true,
      });
      this.initilizeBillEditForm(bills[index]);
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

  isAnySelected = () => {
    const {bills} = this.props;
    if(!bills || !bills.length) {return false;}

    let anySelected = false;
    forEach(bills, (bill) => {
      if(bill.isSelected) {
        anySelected = true;
        return false;
      }
    });
    return anySelected;
  }

  handleSelectAll = () => {
    const {dispatch, bills} = this.props;
    if(!bills || !bills.length) {return null;}

    const allSelected = this.areAllSelected();
    for(let i = 0; i < bills.length; i++) {
      dispatch(change('billing-edit-form', `billing.bills[${i}].isSelected`, !allSelected));
    }
  }

  refund = () => {
    const {bills, dispatch} = this.props;
    const newBills = bills.map((bill) => {
      if(bill.isSelected) {
        bill.isSelected = false;
        bill.invoice_type = '1';
        bill.status = '2';
        bill.unpaid_amount = 0;
      }
      return bill;
    });
    dispatch(change('billing-edit-form', `billing.bills`, newBills));
    displayUIMessage({title: 'Laskut hyvitetty', body: 'Valitut laskut on hyvitetty onnistuneesti'});
  }

  refundSingle = (index: ?number) => {
    const {bills, dispatch} = this.props;
    if(index !== null && index !== undefined) {
      bills[index].invoice_type = '1';
      bills[index].status = '2';
      bills[index].unpaid_amount = 0;
    }
    dispatch(change('billing-edit-form', `billing.bills`, bills));
    this.setState({selectedBill: null, selectedBillIndex: -1, showModal: false});
    displayUIMessage({title: 'Lasku hyvitetty', body: 'Lasku on hyvitetty onnistuneesti'});
  }

  saveBill = (bill: Object, index: ?number) => {
    const {bills, dispatch} = this.props;
    if(index !== undefined && index !== null && bills && bills.length > index) {
      bills[index] = formatBillingBillDb(bill);

      dispatch(change('billing-edit-form', `billing.bills`, bills));
      displayUIMessage({title: 'Lasku tallennettu', body: 'Lasku on tallennettu onnistuneesti'});
      this.setState({selectedBill: null, selectedBillIndex: -1, showModal: false});
    }
  }

  render () {
    const {bills, headers} = this.props;
    const {selectedBill, selectedBillIndex, showModal, tableHeight} = this.state;
    // const allSelected = this.areAllSelected();
    // const anySelected = this.isAnySelected();

    return (
      <div>
        <Row>
          <Column medium={9}>
            <h2>Laskut</h2>
          </Column>
          <Column medium={3}>
            {/* <Button
              className="no-margin button-green button-xs"
              disabled={!anySelected}
              onClick={() => this.refund()}
              style={{float: 'right', marginTop: '15px'}}
              text='Hyvitä laskut'
            /> */}
          </Column>
        </Row>
        <div className={classNames('table-fixed-header', 'billing__bill-table', {'is-open': showModal})}>
          <div className="table-fixed-header__container" style={{maxHeight: tableHeight}}>
            <Field
              bill={selectedBill}
              component={BillModalEdit}
              containerHeight={isNumber(tableHeight) ? tableHeight + 31 : null}
              name='selected_bill'
              onClose={() => this.setState({selectedBill: null, selectedBillIndex: -1, showModal: false})}
              onKeyCodeDown={() => this.handleKeyCodeDown()}
              onKeyCodeUp={() => this.handleKeyCodeUp()}
              onRefund={() => this.refundSingle(selectedBillIndex)}
              onSave={(bill) => this.saveBill(bill, selectedBillIndex)}
              show={showModal}
            />
            <div className="table-fixed-header__header-border" />
            <table ref={(ref) => this.tableElement = ref}>
              <thead>
                {headers && headers.length > 0 &&
                  <tr>
                    {/* <th><div>
                      <input
                        checked={allSelected}
                        onClick={this.handleSelectAll}
                        style={{fontSize: '1rem', margin: '0'}}
                        type="checkbox" />
                    </div></th> */}
                    {headers.map((header, index) => <th key={index}>{header}<div>{header}</div></th>)}
                  </tr>
                }
              </thead>
              <FieldArray
                bills={bills}
                component={BillsTableBodyEdit}
                name="bills"
                onRowClick={(index) => this.showBillModal(index)}
                selectedBillIndex={selectedBillIndex}
              />
            </table>
          </div>
        </div>
      </div>
    );
  }
}

const formName = 'billing-edit-form';
const selector = formValueSelector(formName);

export default flowRight(
  connect((state) => {
    return {
      billing: selector(state, 'billing'),
      bills: selector(state, 'billing.bills'),
    };
  }),
)(BillsTableEdit);
