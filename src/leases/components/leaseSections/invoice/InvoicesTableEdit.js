// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {destroy, initialize} from 'redux-form';
import flowRight from 'lodash/flowRight';
import classNames from 'classnames';
import scrollToComponent from 'react-scroll-to-component';
import isEmpty from 'lodash/isEmpty';

import InvoiceModalEdit from './InvoiceModalEdit';
import Table from '$components/table/Table';
import TruncatedText from '$components/content/TruncatedText';
import {patchInvoice} from '$src/invoices/actions';
import {FormNames} from '$src/leases/enums';
import {getContactFullName} from '$src/contacts/helpers';
import {formatReceivableTypesString, getContentInvoices, getEditedInvoiceForDb} from '$src/invoices/helpers';
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

const TABLE_MAX_HEIGHT = 400;
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
  invoiceItems: InvoiceList,
  selectedInvoice: Object,
  selectedInvoiceId: number,
  showAllColumns: boolean,
  showModal: boolean,
  tableHeight?: ?number,
  tableWidth: ?number,
}

class InvoicesTableEdit extends Component<Props, State> {
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
    let {clientHeight: tableHeight} = this.table.tableElement;

    const {clientHeight: modalHeight} = this.modal.wrappedInstance.modal;

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
      this.table.selectPrevious();
    }
  }

  handleSelectPrevious = (invoice) => {
    this.setState({
      selectedInvoice: invoice,
      selectedInvoiceId: invoice.id,
    });
    this.initilizeEditInvoiceForm(invoice);
  }

  handleKeyCodeDown = () => {
    const {showModal} = this.state;
    if(showModal) {
      this.table.selectNext();
    }
  }

  handleSelectNext = (invoice) => {
    this.setState({
      selectedInvoice: invoice,
      selectedInvoiceId: invoice.id,
    });
    this.initilizeEditInvoiceForm(invoice);
  }

  initilizeEditInvoiceForm = (invoice: Object) => {
    const {destroy, initialize} = this.props;

    destroy(FormNames.INVOICE_EDIT);
    initialize(FormNames.INVOICE_EDIT, invoice);
  }

  handleDataUpdate = () => {
    this.calculateHeight();
  }

  getDataKeys = () => {
    const {invoiceAttributes} = this.props;
    const {showAllColumns} = this.state;
    const receivableTypeOptions = getAttributeFieldOptions(invoiceAttributes, 'rows.child.children.receivable_type');
    const stateOptions = getAttributeFieldOptions(invoiceAttributes, 'state');

    if(showAllColumns) {
      return [
        {key: 'recipientFull', label: 'Vuokraaja', renderer: (val) => getContactFullName(val) || '-', ascSortFunction: (a, b) => sortStringByKeyAsc(getContactFullName(a), getContactFullName(b)), descSortFunction: (a, b) => sortStringByKeyDesc(getContactFullName(a), getContactFullName(b))},
        {key: 'due_date', label: 'Eräpäivä', renderer: (val) => formatDate(val) || '-', defaultSorting: 'desc'},
        {key: 'id', label: 'Laskun numero', ascSortFunction: sortNumberByKeyAsc, descSortFunction: sortNumberByKeyDesc},
        {key: 'totalShare', label: 'Osuus', renderer: (val) => `${formatNumber(val * 100)} %`, ascSortFunction: sortNumberByKeyAsc, descSortFunction: sortNumberByKeyDesc},
        {key: 'billing_period_start_date', label: 'Laskutuskausi', renderer: (val, invoice) => formatDateRange(invoice.billing_period_start_date, invoice.billing_period_end_date) || '-'},
        {key: 'receivableTypes', label: 'Saamislaji', renderer: (val) => <TruncatedText text={formatReceivableTypesString(receivableTypeOptions, val) || '-'} />, sortable: false},
        {key: 'state', label: 'Laskun tila', renderer: (val) => getLabelOfOption(stateOptions, val) || '-'},
        {key: 'billed_amount', label: 'Laskutettu', renderer: (val) => val ? `${formatNumber(val)} €` : '-', ascSortFunction: sortNumberByKeyAsc, descSortFunction: sortNumberByKeyDesc},
        {key: 'outstanding_amount', label: 'Maksamatta', renderer: (val) => val ? `${formatNumber(val)} €` : '-', ascSortFunction: sortNumberByKeyAsc, descSortFunction: sortNumberByKeyDesc},
        {key: 'notes', label: 'Tiedote', renderer: (val) => val ? 'Kyllä' : 'Ei' || '-'},
        {key: 'sent_to_sap_at', label: 'Läh. SAP:iin', renderer: (val) => formatDate(val) || '-'},
      ];
    } else {
      return [
        {key: 'recipientFull', label: 'Vuokraaja', renderer: (val) => getContactFullName(val) || '-', ascSortFunction: (a, b) => sortStringByKeyAsc(getContactFullName(a), getContactFullName(b)), descSortFunction: (a, b) => sortStringByKeyDesc(getContactFullName(a), getContactFullName(b))},
        {key: 'due_date', label: 'Eräpäivä', renderer: (val) => formatDate(val) || '-', defaultSorting: 'desc'},
        {key: 'id', label: 'Laskun numero', ascSortFunction: sortNumberByKeyAsc, descSortFunction: sortNumberByKeyDesc},
        {key: 'totalShare', label: 'Osuus', renderer: (val) => `${formatNumber(val * 100)} %`, ascSortFunction: sortNumberByKeyAsc, descSortFunction: sortNumberByKeyDesc},
      ];
    }
  }

  handleModalHeightChange = () => {
    this.calculateHeight();
  }

  handleRowClick = (id, invoice) => {
    this.setState({
      showAllColumns: false,
      selectedInvoice: invoice,
      selectedInvoiceId: id,
      showModal: true,
    });
    this.initilizeEditInvoiceForm(invoice);
    this.scrolToModal();
  }

  refundSingle = (invoice: Object) => {
    console.log(invoice);
    alert('TODO: Refund invoice');
  }

  editInvoice = (invoice: Object) => {
    const {patchInvoice} = this.props;
    patchInvoice(getEditedInvoiceForDb(invoice));
  }

  render () {
    const {
      invoiceItems,
      selectedInvoice,
      showModal,
      tableHeight,
      tableWidth,
    } = this.state;
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
            data={invoiceItems}
            dataKeys={dataKeys}
            fixedHeader
            fixedHeaderClassName={classNames('invoice-fixed-table', {'is-open': showModal})}
            maxHeight={tableHeight ? tableHeight - 31 : null}
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
        <InvoiceModalEdit
          ref={(ref) => this.modal = ref}
          invoice={selectedInvoice}
          minHeight={!showModal ? tableHeight : null}
          onClose={() => this.setState({
            selectedInvoice: {},
            showModal: false,
          })}
          onKeyCodeDown={() => this.handleKeyCodeDown()}
          onKeyCodeUp={() => this.handleKeyCodeUp()}
          onRefund={(invoice) => this.refundSingle(invoice)}
          onResize={this.handleModalHeightChange}
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
