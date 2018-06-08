// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';
import isNumber from 'lodash/isNumber';
import classNames from 'classnames';
import scrollToComponent from 'react-scroll-to-component';

import InvoiceModal from './InvoiceModal';
import Table from '$components/table/Table';
import {getContactFullName} from '$src/contacts/helpers';
import {getInvoiceSharePercentage} from '$src/invoices/helpers';
import {
  formatDate,
  formatDateRange,
  formatNumber,
  getAttributeFieldOptions,
  getLabelOfOption,
  sortNumberByKeyAsc,
  sortNumberByKeyDesc,
  sortStringByKeyAsc,
  sortStringByKeyDesc,
} from '$util/helpers';
import {getAttributes as getInvoiceAttributes, getInvoices} from '$src/invoices/selectors';

import type {Attributes as InvoiceAttributes, InvoiceList} from '$src/invoices/types';

const MODAL_HEIGHT = 550;
const MODAL_WIDTH = 700;

type Props = {
  invoiceAttributes: InvoiceAttributes,
  invoices: InvoiceList,
}

type State = {
  selectedInvoice: Object,
  selectedInvoiceId: number,
  showAllColumns: boolean,
  showModal: boolean,
  tableHeight?: ?number,
  tableWidth: ?number,
}

class InvoicesTable extends Component<Props, State> {
  state = {
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
    if(!this.table) {
      return;
    }

    let {clientHeight} = this.table.tableElement;
    const {showModal} = this.state;

    if(showModal) {clientHeight = MODAL_HEIGHT;}
    if(clientHeight > MODAL_HEIGHT) {clientHeight = MODAL_HEIGHT;}

    this.setState({
      tableHeight: clientHeight,
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
    this.table.selectPrevious();
  }

  handleSelectPrevious = (invoice) => {
    this.setState({
      selectedInvoice: invoice,
      selectedInvoiceId: invoice.id,
    });
  }

  handleKeyCodeDown = () => {
    this.table.selectNext();
  }

  handleSelectNext = (invoice) => {
    this.setState({
      selectedInvoice: invoice,
      selectedInvoiceId: invoice.id,
    });
  }

  handleDataUpdate = () => {
    this.calculateHeight();
  }

  getDataKeys = () => {
    const {invoiceAttributes} = this.props;
    const {showAllColumns} = this.state;
    const receivableTypeOptions = getAttributeFieldOptions(invoiceAttributes, 'receivable_type');
    const stateOptions = getAttributeFieldOptions(invoiceAttributes, 'state');

    if(showAllColumns) {
      return [
        {key: 'recipient', label: 'Vuokraaja', renderer: (val) => getContactFullName(val) || '-', ascSortFunction: (a, b) => sortStringByKeyAsc(getContactFullName(a), getContactFullName(b)), descSortFunction: (a, b) => sortStringByKeyDesc(getContactFullName(a), getContactFullName(b))},
        {key: 'due_date', label: 'Eräpäivä', renderer: (val) => formatDate(val) || '-'},
        {key: 'id', label: 'Laskun numero', ascSortFunction: sortNumberByKeyAsc, descSortFunction: sortNumberByKeyDesc},
        {key: 'share', label: 'Osuus', renderer: (val, invoice) => getInvoiceSharePercentage(invoice) || '-'},
        {key: 'billing_period_start_date', label: 'Laskutuskausi', renderer: (val, invoice) => formatDateRange(invoice.billing_period_start_date, invoice.billing_period_end_date) || '-'},
        {key: 'receivable_type', label: 'Saamislaji', renderer: (val) => getLabelOfOption(receivableTypeOptions, val) || '-'},
        {key: 'state', label: 'Laskun tila', renderer: (val) => getLabelOfOption(stateOptions, val) || '-'},
        {key: 'billed_amount', label: 'Laskutettu', renderer: (val) => formatNumber(val) || '-', ascSortFunction: sortNumberByKeyAsc, descSortFunction: sortNumberByKeyDesc},
        {key: 'outstanding_amount', label: 'Maksamatta', renderer: (val) => formatNumber(val) || '-', ascSortFunction: sortNumberByKeyAsc, descSortFunction: sortNumberByKeyDesc},
        {key: 'notes', label: 'Tiedote', renderer: (val) => val ? 'Kyllä' : 'Ei' || '-'},
        {key: 'sent_to_sap_at', label: 'Läh. SAP:iin', renderer: (val) => formatDate(val) || '-'},
      ];
    } else {
      return [
        {key: 'recipient', label: 'Vuokraaja', renderer: (val) => getContactFullName(val) || '-', ascSortFunction: (a, b) => sortStringByKeyAsc(getContactFullName(a), getContactFullName(b)), descSortFunction: (a, b) => sortStringByKeyDesc(getContactFullName(a), getContactFullName(b))},
        {key: 'due_date', label: 'Eräpäivä', renderer: (val) => formatDate(val) || '-'},
        {key: 'id', label: 'Laskun numero', ascSortFunction: sortNumberByKeyAsc, descSortFunction: sortNumberByKeyDesc},
        {key: 'share', label: 'Osuus', renderer: (val, invoice) => getInvoiceSharePercentage(invoice) || '-'},
      ];
    }
  }

  handleRowClick = (id, invoice) => {
    this.setState({
      showAllColumns: false,
      selectedInvoice: invoice,
      selectedInvoiceId: id,
      showModal: true,
    });
    this.scrolToModal();
  }

  render () {
    const {
      selectedInvoice,
      showModal,
      tableHeight,
      tableWidth,
    } = this.state;
    const {invoices} = this.props;
    const dataKeys = this.getDataKeys();

    return (
      <div
        className='invoice__invoice-table'
        ref={(ref) => this.container = ref}>
        <div
          className='invoice__invoice-table_wrapper'
          ref={(ref) => this.tableWrapper = ref}
          style={{maxWidth: tableWidth}}>
          <Table
            ref={(input) => this.table = input}
            data={invoices}
            dataKeys={dataKeys}
            fixedHeader
            fixedHeaderClassName={classNames('invoice-fixed-table', {'is-open': showModal})}
            maxHeight={tableHeight}
            noDataText='Ei laskuja'
            onDataUpdate={this.handleDataUpdate}
            onRowClick={this.handleRowClick}
            onSelectNext={this.handleSelectNext}
            onSelectPrevious={this.handleSelectPrevious}
            secondaryTable
            selectedRow={selectedInvoice}
            sortable
            tableFixedLayout
          />
        </div>
        <InvoiceModal
          ref={(ref) => this.modal = ref}
          containerHeight={isNumber(tableHeight) ? tableHeight + 31 : null}
          invoice={selectedInvoice}
          onClose={() => this.setState({
            selectedInvoice: {},
            selectedInvoiceId: -1,
            showModal: false,
          })}
          onKeyCodeDown={() => this.handleKeyCodeDown()}
          onKeyCodeUp={() => this.handleKeyCodeUp()}
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
