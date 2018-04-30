// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {destroy, initialize} from 'redux-form';
import classNames from 'classnames';
import scrollToComponent from 'react-scroll-to-component';
import findIndex from 'lodash/findIndex';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import isNumber from 'lodash/isNumber';

import InvoiceModalEdit from './InvoiceModalEdit';
import {patchInvoice} from '$src/invoices/actions';
import {FormNames} from '$src/leases/enums';
import {getContactFullName} from '$src/contacts/helpers';
import {getEditedInvoiceForDb, getInvoiceSharePercentage} from '$src/invoices/helpers';
import {
  formatDate,
  formatDateRange,
  formatNumber,
  getAttributeFieldOptions,
  getLabelOfOption,
} from '$util/helpers';
import {getAttributes as getInvoiceAttributes, getInvoices} from '$src/invoices/selectors';

import type {Attributes as InvoiceAttributes, InvoiceList} from '$src/invoices/types';

const MODAL_HEIGHT = 480;
const MODAL_WIDTH = 700;

type Props = {
  destroy: Function,
  initialize: Function,
  invoiceAttributes: InvoiceAttributes,
  invoices: InvoiceList,
  patchInvoice: Function,
  refundBill: Function,
}

type State = {
  selectedInvoice: ?Object,
  showAllColumns: boolean,
  showModal: boolean,
  tableHeight: ?number,
  tableWidth: ?number,
}

class InvoicesTableEdit extends Component {
  props: Props

  container: any
  modal: any
  tableElement: any
  tableWrapper: any

  state: State = {
    selectedInvoice: null,
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
      this.state.selectedInvoice !== nextState.selectedInvoice ||
      this.state.showModal !== nextState.showModal ||
      this.props !== nextProps
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
      if(clientWidth - MODAL_WIDTH <= 0) {clientWidth = 0;}
      else {clientWidth = clientWidth - MODAL_WIDTH;}
    }
    this.setState({tableWidth: clientWidth});
  }

  transitionEnds = () => {
    const {clientWidth} = this.container;
    const {clientWidth: tableWidth} = this.tableWrapper;
    if(clientWidth === tableWidth) {
      this.setState({showAllColumns: true});
    }
  }

  handleKeyCodeDown = () => {
    const {invoices} = this.props;
    const {selectedInvoice} = this.state;

    const index = findIndex(invoices, (x) => x.id === get(selectedInvoice, 'id'));

    if(index < invoices.length - 1) {
      const newIndex = index + 1;
      this.setState({
        selectedInvoice: invoices[newIndex],
        showModal: true,
      });
      this.initilizeEditInvoiceForm(invoices[newIndex]);
    }
  }

  handleKeyCodeUp = () => {
    const {invoices} = this.props;
    const {selectedInvoice} = this.state;

    const index = findIndex(invoices, (x) => x.id === get(selectedInvoice, 'id'));
    if(index > 0) {
      const newIndex = index - 1;
      this.setState({
        selectedInvoice: invoices[newIndex],
        showModal: true,
      });
      this.initilizeEditInvoiceForm(invoices[newIndex]);
    }
  }

  initilizeEditInvoiceForm = (invoice: Object) => {
    const {destroy, initialize} = this.props;

    destroy(FormNames.INVOICE_EDIT);
    initialize(FormNames.INVOICE_EDIT, invoice);
  }

  showInvoiceModal = (index: number) => {
    const {invoices} = this.props;

    if(invoices && !!invoices.length) {
      this.setState({
        selectedInvoice: invoices[index],
        showAllColumns: false,
        showModal: true,
      });
      this.initilizeEditInvoiceForm(invoices[index]);

      setTimeout(() => {
        scrollToComponent(this.modal, {
          offset: -130,
          align: 'top',
          duration: 450,
        });
      }, 50);
    }
  }

  refundSingle = (invoice: Object) => {
    // const {refundBill} = this.props;
    // const newBill:Object = formatBillingBillDb(bill);
    //
    // newBill.arrayIndex = index;
    // refundBill(newBill);
    //
    // this.setState({
    //   selectedInvoice: null,
    //   showModal: false,
    // });
    console.log(invoice);
    alert('TODO: Refund invoice');
  }

  editInvoice = (invoice: Object) => {
    // this.setState({
    //   selectedInvoice: null,
    //   showModal: false,
    // });
    const {patchInvoice} = this.props;

    patchInvoice(getEditedInvoiceForDb(invoice));
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
    const {
      invoiceAttributes,
      invoices,
    } = this.props;
    const {
      selectedInvoice,
      showAllColumns,
      showModal,
      tableHeight,
      tableWidth,
    } = this.state;
    const headers = this.getTableHeaders();
    const receivableTypeOptions = getAttributeFieldOptions(invoiceAttributes, 'receivable_type');
    const stateOptions = getAttributeFieldOptions(invoiceAttributes, 'state');

    return (
      <div className='invoice__invoice-table' ref={(ref) => this.container = ref}>
        <div
          className='table-wrapper'
          ref={(ref) => this.tableWrapper = ref}
          style={{maxWidth: tableWidth}}>
          <div className={classNames('table-fixed-header', 'invoice-fixed-table', {'is-open': showModal})}>
            <div className="table-fixed-header__container" style={{maxHeight: tableHeight}}>
              <div className="table-fixed-header__header-border" />
              <table
                ref={(ref) => this.tableElement = ref}>
                <thead>
                  {headers && !!headers.length &&
                    <tr>
                      {headers.map((header, index) => <th key={index}>{header}<div>{header}</div></th>)}
                    </tr>
                  }
                </thead>
                {invoices && !!invoices.length &&
                  <tbody>
                    {invoices.map((invoice, index) => {
                      return (
                        <tr
                          className={classNames({'selected': invoice.id === get(selectedInvoice, 'id')})}
                          key={index}
                          onClick={() => {this.showInvoiceModal(index);}}
                          >
                            <td>{getContactFullName(invoice.recipient) || '-'}</td>
                            <td>{formatDate(invoice.due_date) || '-'}</td>
                            <td>{invoice.id || '-'}</td>
                            <td>{getInvoiceSharePercentage(invoice) ? `${getInvoiceSharePercentage(invoice)} %` : '-'}</td>
                            {showAllColumns &&
                              <td>{formatDateRange(invoice.billing_period_start_date, invoice.billing_period_end_date)}</td>
                            }
                            {showAllColumns &&
                              <td>{getLabelOfOption(receivableTypeOptions, invoice.receivable_type) || '-'}</td>
                            }
                            {showAllColumns &&
                              <td>{getLabelOfOption(stateOptions, invoice.state) || '-'}</td>
                            }
                            {showAllColumns &&
                              <td>{formatNumber(invoice.billed_amount) || '-'}</td>
                            }
                            {showAllColumns &&
                              <td>{formatNumber(invoice.outstanding_amount) || '-'}</td>
                            }
                            {showAllColumns &&
                              <td>{invoice.notes ? 'Kyllä' : 'Ei'}</td>
                            }
                            {showAllColumns &&
                              <td>{formatDate(invoice.sent_to_sap_at) || '-'}</td>
                            }
                        </tr>
                      );
                    })}
                  </tbody>
                }
                {!invoices || !invoices.length && <tbody><tr className='no-data'><td colSpan={showAllColumns ? 11 : 4}>Ei laskuja</td></tr></tbody>}
              </table>
            </div>
          </div>
        </div>
        <InvoiceModalEdit
          ref={(ref) => this.modal = ref}
          containerHeight={isNumber(tableHeight) ? tableHeight + 31 : null}
          invoice={selectedInvoice}
          onClose={() => this.setState({
            selectedInvoice: null,
            showModal: false,
          })}
          onKeyCodeDown={() => this.handleKeyCodeDown()}
          onKeyCodeUp={() => this.handleKeyCodeUp()}
          onRefund={(invoice) => this.refundSingle(invoice)}
          onSave={(invoice) => this.editInvoice(invoice)}
          show={showModal}
        />
      </div>
    );
  }
}

export default flowRight(
  connect(
    (state) => {
      return {
        invoiceAttributes: getInvoiceAttributes(state),
        invoices: getInvoices(state),
      };
    },
    {
      destroy,
      initialize,
      patchInvoice,
    }
  ),
)(InvoicesTableEdit);
