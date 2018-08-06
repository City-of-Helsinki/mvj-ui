// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';
import isNumber from 'lodash/isNumber';
import scrollToComponent from 'react-scroll-to-component';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import InvoiceModal from './InvoiceModal';
import InvoiceTable from './InvoiceTable';
import TruncatedText from '$components/content/TruncatedText';
import {getContactFullName} from '$src/contacts/helpers';
import {formatReceivableTypesString, getContentInvoices} from '$src/invoices/helpers';
import {
  formatDate,
  formatDateRange,
  formatNumber,
  getAttributeFieldOptions,
  getLabelOfOption,
  sortNumberByKeyAsc,
  sortNumberByKeyDesc,
} from '$util/helpers';
import {getAttributes as getInvoiceAttributes, getInvoices} from '$src/invoices/selectors';

import type {Attributes as InvoiceAttributes, InvoiceList} from '$src/invoices/types';

const TABLE_MAX_HEIGHT = 400;
const MODAL_WIDTH = 607.5;

type Props = {
  invoiceAttributes: InvoiceAttributes,
  invoices: InvoiceList,
  onCreditItemChange: Function,
  selectedCreditItem: ?string,
}

type State = {
  invoiceItems: InvoiceList,
  selectedInvoice: Object,
  selectedInvoiceId: number,
  showAllColumns: boolean,
  showModal: boolean,
  tableHeight?: ?number,
  tableWidth: ?number,
}

class InvoicesTable extends Component<Props, State> {
  state = {
    invoiceItems: [],
    selectedInvoice: {},
    selectedInvoiceId: -1,
    showAllColumns: true,
    showModal: false,
    tableHeight: null,
    tableWidth: null,
  }

  container: any
  modal: any
  table: any
  tableElement: any
  tableWrapper : any

  componentDidMount() {
    const {invoices} = this.props;

    this.calculateHeight();
    this.calculateTableWidth();
    this.tableWrapper.addEventListener('transitionend', this.transitionEnds);

    if(!isEmpty(invoices)) {
      this.updateInvoiceItems();
    }
  }

  componentDidUpdate(prevProps) {
    this.calculateHeight();
    this.calculateTableWidth();

    if(prevProps.invoices !== this.props.invoices) {
      this.updateInvoiceItems();
    }
  }

  updateInvoiceItems = () => {
    const {invoices} = this.props;

    this.setState({
      invoiceItems: getContentInvoices(invoices),
    });
  }

  shouldComponentUpdate(nextProps: Object, nextState: Object) {
    return (
      this.state.invoiceItems !== nextState.invoiceItems ||
      this.state.showAllColumns !== nextState.showAllColumns ||
      this.state.tableHeight !== nextState.tableHeight ||
      this.state.tableWidth !== nextState.tableWidth ||
      this.state.selectedInvoiceId !== nextState.selectedInvoiceId ||
      this.state.showModal !== nextState.showModal ||
      this.props !== nextProps
    );
  }

  componentWillUnmount() {
    this.tableWrapper.removeEventListener('transitionend', this.transitionEnds);
  }

  scrolToModal = () => {
    setTimeout(() => {
      scrollToComponent(this.modal, {
        offset: -130,
        align: 'top',
        duration: 450,
      });
    }, 50);
  }

  calculateHeight = () => {
    if(!this.table && !this.modal) {

      return;
    }

    const {showModal} = this.state;

    let {clientHeight: tableHeight} = this.table.getWrappedInstance().tableElement;
    const {clientHeight: modalHeight} = this.modal.modal;

    if(showModal) {
      tableHeight = modalHeight;
    } else {
      tableHeight += 31;
      if(tableHeight > TABLE_MAX_HEIGHT) {
        tableHeight = TABLE_MAX_HEIGHT;
      }
    }

    this.setState({
      tableHeight: tableHeight,
    });
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

  handleKeyCodeUp = () => {
    const {showModal} = this.state;
    if(showModal) {
      this.table.getWrappedInstance().selectPrevious();
    }
  }

  handleSelectPrevious = (invoice) => {
    this.setState({
      selectedInvoice: invoice.data,
      selectedInvoiceId: invoice.data.id,
    });
  }

  handleInvoiceModalOnClose = () => {
    this.setState({
      selectedInvoice: {},
      selectedInvoiceId: -1,
      showModal: false,
    });
  }

  handleKeyCodeDown = () => {
    const {showModal} = this.state;
    if(showModal) {
      this.table.getWrappedInstance().selectNext();
    }
  }

  handleSelectNext = (invoice) => {
    this.setState({
      selectedInvoice: invoice.data,
      selectedInvoiceId: invoice.data.id,
    });
  }

  handleDataUpdate = () => {
    this.calculateHeight();
  }

  handleModalHeightChange = () => {
    this.calculateHeight();
  }

  handleRowClick = (id, row) => {
    this.setState({
      showAllColumns: false,
      selectedInvoice: row.data,
      selectedInvoiceId: id,
      showModal: true,
    });
    this.scrolToModal();
  }

  handleCreditedInvoiceClick = (invoiceId: number) => {
    const {invoiceItems} = this.state;
    const selectedInvoice = invoiceItems.find((invoice) => invoice.id === invoiceId);
    if(selectedInvoice) {
      this.setState({
        selectedInvoice: selectedInvoice,
        selectedInvoiceId: invoiceId,
      });
    }
  }

  sortStringByRecipientNameAsc = (a, b) => {
    const valA = getContactFullName(get(a, 'data.recipientFull')) ? getContactFullName(get(a, 'data.recipientFull')).toLowerCase() : '',
      valB = getContactFullName(get(a, 'data.recipientFull')) ? getContactFullName(get(b, 'data.recipientFull')).toLowerCase() : '';

    if(valA > valB) return 1;
    if(valA < valB) return -1;
    return 0;
  };

  sortStringByRecipientNameDesc = (a, b) => {
    const valA = getContactFullName(get(a, 'data.recipientFull')) ? getContactFullName(get(a, 'data.recipientFull')).toLowerCase() : '',
      valB = getContactFullName(get(a, 'data.recipientFull')) ? getContactFullName(get(b, 'data.recipientFull')).toLowerCase() : '';

    if(valA > valB) return -1;
    if(valA < valB) return 1;
    return 0;
  };

  getColumns = () => {
    const {invoiceAttributes} = this.props,
      {showAllColumns} = this.state;
    const receivableTypeOptions = getAttributeFieldOptions(invoiceAttributes, 'rows.child.children.receivable_type');
    const stateOptions = getAttributeFieldOptions(invoiceAttributes, 'state');

    if(showAllColumns) {
      return [
        {key: 'invoiceset', label: 'Laskuryhmä', ascSortFunction: sortNumberByKeyAsc, descSortFunction: sortNumberByKeyDesc},
        {key: 'recipientFull', label: 'Vuokraaja', renderer: (val) => getContactFullName(val) || '-', ascSortFunction: (a, b) => this.sortStringByRecipientNameAsc(a, b), descSortFunction: (a, b) => this.sortStringByRecipientNameDesc(a, b)},
        {key: 'due_date', label: 'Eräpäivä', renderer: (val) => formatDate(val) || '-', defaultSorting: 'desc'},
        {key: 'id', label: 'Laskunro', ascSortFunction: sortNumberByKeyAsc, descSortFunction: sortNumberByKeyDesc},
        {key: 'totalShare', label: 'Osuus', renderer: (val) => `${formatNumber(val * 100)} %`, ascSortFunction: sortNumberByKeyAsc, descSortFunction: sortNumberByKeyDesc},
        {key: 'billing_period_start_date', label: 'Laskutuskausi', renderer: (val, invoice) => formatDateRange(invoice.data.billing_period_start_date, invoice.data.billing_period_end_date) || '-'},
        {key: 'receivableTypes', label: 'Saamislaji', renderer: (val) => <TruncatedText text={formatReceivableTypesString(receivableTypeOptions, val) || '-'} />, sortable: false},
        {key: 'state', label: 'Laskun tila', renderer: (val) => getLabelOfOption(stateOptions, val) || '-'},
        {key: 'billed_amount', label: 'Laskutettu', renderer: (val) => val ? `${formatNumber(val)} €` : '-', ascSortFunction: sortNumberByKeyAsc, descSortFunction: sortNumberByKeyDesc},
        {key: 'outstanding_amount', label: 'Maksamatta', renderer: (val) => val ? `${formatNumber(val)} €` : '-', ascSortFunction: sortNumberByKeyAsc, descSortFunction: sortNumberByKeyDesc},
      ];
    } else {
      return [
        {key: 'invoiceset', label: 'Laskuryhmä', ascSortFunction: sortNumberByKeyAsc, descSortFunction: sortNumberByKeyDesc},
        {key: 'recipientFull', label: 'Vuokraaja', renderer: (val) => getContactFullName(val) || '-', ascSortFunction: (a, b) => this.sortStringByRecipientNameAsc(a, b), descSortFunction: (a, b) => this.sortStringByRecipientNameDesc(a, b)},
        {key: 'due_date', label: 'Eräpäivä', renderer: (val) => formatDate(val) || '-', defaultSorting: 'desc'},
        {key: 'id', label: 'Laskunro', ascSortFunction: sortNumberByKeyAsc, descSortFunction: sortNumberByKeyDesc},
        {key: 'totalShare', label: 'Osuus', renderer: (val) => `${formatNumber(val * 100)} %`, ascSortFunction: sortNumberByKeyAsc, descSortFunction: sortNumberByKeyDesc},
      ];
    }
  }

  render () {
    const {
      invoiceItems,
      selectedInvoice,
      showModal,
      tableHeight,
      tableWidth,
    } = this.state;
    const {onCreditItemChange, selectedCreditItem} = this.props;
    const columns = this.getColumns();

    return (
      <div
        className='invoice__invoice-table'
        ref={(ref) => this.container = ref}>
        <div
          className='invoice__invoice-table_wrapper'
          ref={(ref) => this.tableWrapper = ref}
          style={{maxWidth: tableWidth}}
        >
          <InvoiceTable
            ref={(input) => this.table = input}
            columns={columns}
            data={invoiceItems}
            maxHeight={tableHeight ? tableHeight - 31 : null}
            onCreditItemChange={onCreditItemChange}
            onDataUpdate={this.handleDataUpdate}
            onRowClick={this.handleRowClick}
            onSelectNext={this.handleSelectNext}
            onSelectPrevious={this.handleSelectPrevious}
            selectedCreditItem={selectedCreditItem}
            selectedRow={selectedInvoice}
          />
        </div>
        <InvoiceModal
          ref={(ref) => this.modal = ref}
          containerHeight={isNumber(tableHeight) ? tableHeight + 31 : null}
          invoice={selectedInvoice}
          minHeight={!showModal ? tableHeight : null}
          onClose={this.handleInvoiceModalOnClose}
          onCreditedInvoiceClick={this.handleCreditedInvoiceClick}
          onKeyCodeDown={this.handleKeyCodeDown}
          onKeyCodeUp={this.handleKeyCodeUp}
          onResize={this.handleModalHeightChange}
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
    }
  )
)(InvoicesTable);
