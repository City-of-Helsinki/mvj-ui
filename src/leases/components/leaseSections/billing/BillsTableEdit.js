// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {change, Field, FieldArray, formValueSelector, initialize} from 'redux-form';
import flowRight from 'lodash/flowRight';
import isNumber from 'lodash/isNumber';
import classNames from 'classnames';

import {displayUIMessage} from '$util/helpers';
import {formatBillingBillDb} from '$src/leases/helpers';
import BillModalEdit from './BillModalEdit';
import BillsTableBodyEdit from './BillsTableBodyEdit';

const MODAL_HEIGHT = 610;
const MODAL_WIDTH = 700;

type Props = {
  billing: Object,
  bills: Array<Object>,
  dispatch: Function,
  fields: any,
}

type State = {
  selectedBill: ?Object,
  selectedBillIndex: number,
  showAllColumns: boolean,
  showModal: boolean,
  tableHeight: ?number,
  tableWidth: ?number,
}

class BillsTableEdit extends Component {
  props: Props

  container: any

  tableElement: any

  tableWrapper: any

  state: State = {
    selectedBill: null,
    selectedBillIndex: -1,
    showAllColumns: true,
    showModal: false,
    tableHeight: null,
    tableWidth: null,
  }

  componentDidMount() {
    this.calculateHeight();
    this.calculateTableWidth();
    this.tableWrapper.addEventListener('transitionend', this.transitionEnds);
  }

  componentDidUpdate() {
    this.calculateHeight();
    this.calculateTableWidth();
  }

  shouldComponentUpdate(nextProps: Object, nextState: Object) {
    return (
      this.state.containerWidth !== nextState.containerWidth ||
      this.state.showAllColumns !== nextState.showAllColumns ||
      this.state.tableHeight !== nextState.tableHeight ||
      this.state.selectedBill !== nextState.selectedBill ||
      this.state.showModal !== nextState.showModal
    );
  }

  componentWillUnmount() {
    this.tableWrapper.removeEventListener('transitionend', this.transitionEnds);
  }

  calculateHeight = () => {
    let {clientHeight} = this.tableElement;
    const {showModal} = this.state;

    if(showModal) {clientHeight = MODAL_HEIGHT;}
    if(clientHeight > MODAL_HEIGHT) {clientHeight = MODAL_HEIGHT;}

    this.setState({tableHeight: clientHeight});
  }

  calculateTableWidth = () => {
    let {clientWidth} = this.container;
    const {showModal} = this.state;

    if(showModal) {
      if(clientWidth - MODAL_WIDTH - 10 <= 0) {
        clientWidth = 0;
      } else {
        clientWidth = clientWidth - MODAL_WIDTH - 10;
      }
    }
    this.setState({tableWidth: clientWidth});
  }

  transitionEnds = () => {
    console.log('transitionend');
    const {clientWidth} = this.container;
    const {clientWidth: tableWidth} = this.tableWrapper;
    if(clientWidth === tableWidth) {
      this.setState({showAllColumns: true});
    }
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

    dispatch(initialize('billing-edit-form', {billing: billing}, true, {}));
  }

  showBillModal = (index: number) => {
    const {bills} = this.props;

    if(bills && bills.length) {
      this.setState({
        selectedBill: bills[index],
        selectedBillIndex: index,
        showAllColumns: false,
        showModal: true,
      });
      this.initilizeBillEditForm(bills[index]);
    }
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

  getTableHeaders = () => {
    const {showAllColumns} = this.state;
    if(showAllColumns) {
      return [
        'Vuokraaja',
        'Eräpäivä',
        'Laskun numero',
        'Osuus',
        'Laskutuskausi',
        'Saamislaji',
        'Laskun tila',
        'Laskutettu',
        'Maksamatta',
        'Tiedote',
        'Läh. SAP:iin',
      ];
    } else {
      return [
        'Vuokraaja',
        'Eräpäivä',
        'Laskun numero',
        'Osuus',
      ];
    }
  }

  render () {
    const {bills} = this.props;
    const {selectedBill, selectedBillIndex, showAllColumns, showModal, tableHeight, tableWidth} = this.state;
    const headers = this.getTableHeaders();

    return (
      <div className='billing__bill-table' ref={(ref) => this.container = ref}>
        <div
          className='table-wrapper'
          ref={(ref) => this.tableWrapper = ref}
          style={{maxWidth: tableWidth}}>
          <div className={classNames('table-fixed-header', 'billing-fixed-table', {'is-open': showModal})}>
            <div className="table-fixed-header__container" style={{maxHeight: tableHeight}}>
              <div className="table-fixed-header__header-border" />
              <table
                ref={(ref) => this.tableElement = ref}>
                <thead>
                  {headers && headers.length > 0 &&
                    <tr>
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
                  showAllColumns={showAllColumns}
                />
              </table>
            </div>
          </div>
        </div>
        <Field
          bill={selectedBill}
          component={BillModalEdit}
          containerHeight={isNumber(tableHeight) ? tableHeight + 33 : null}
          name='selected_bill'
          onClose={() => this.setState({selectedBill: null, selectedBillIndex: -1, showModal: false})}
          onKeyCodeDown={() => this.handleKeyCodeDown()}
          onKeyCodeUp={() => this.handleKeyCodeUp()}
          onRefund={() => this.refundSingle(selectedBillIndex)}
          onSave={(bill) => this.saveBill(bill, selectedBillIndex)}
          show={showModal}
        />
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
