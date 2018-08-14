// @flow
import React, {Component} from 'react';
import {findDOMNode} from 'react-dom';
import {connect} from 'react-redux';
import {destroy, initialize} from 'redux-form';
import flowRight from 'lodash/flowRight';
import scrollToComponent from 'react-scroll-to-component';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import InvoiceModalEdit from './InvoiceModalEdit';
import InvoiceTable from './InvoiceTable';
import TruncatedText from '$components/content/TruncatedText';
import {clearPatchedInvoice, patchInvoice} from '$src/invoices/actions';
import {FormNames} from '$src/leases/enums';
import {getContactFullName} from '$src/contacts/helpers';
import {formatEditedInvoiceForDb, formatReceivableTypesString, getContentIncoiveItem, getContentInvoices} from '$src/invoices/helpers';
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
import {getAttributes as getInvoiceAttributes, getInvoicesByLease, getIsFetching, getPatchedInvoice} from '$src/invoices/selectors';
import {getCurrentLease} from '$src/leases/selectors';

import type {Attributes as InvoiceAttributes, Invoice, InvoiceList} from '$src/invoices/types';
import type {Lease} from '$src/leases/types';

const TABLE_MAX_HEIGHT = 521;
const MODAL_WIDTH = 607.5;

type Props = {
  clearPatchedInvoice: Function,
  currentLease: Lease,
  destroy: Function,
  initialize: Function,
  invoiceAttributes: InvoiceAttributes,
  invoices: InvoiceList,
  invoiceToCredit: ?string,
  isFetching: boolean,
  onInvoiceToCreditChange: Function,
  patchInvoice: Function,
  patchedInvoice: ?Invoice,
  refundBill: Function,
}

type State = {
  columns: Array<Object>,
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
    columns: [],
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
    const {clearPatchedInvoice, invoices} = this.props;

    this.calculateHeight();
    this.calculateTableWidth();
    this.tableWrapper.addEventListener('transitionend', this.transitionEnds);

    if(!isEmpty(invoices)) {
      this.updateInvoiceItems();
    }
    clearPatchedInvoice();
    this.updateColumns();
  }

  componentDidUpdate(prevProps, prevState) {
    this.calculateHeight();
    this.calculateTableWidth();

    if(prevProps.invoices !== this.props.invoices) {
      this.updateInvoiceItems();
    }

    if(prevState.showAllColumns !== this.state.showAllColumns) {
      this.updateColumns();
    }

    if(this.props.patchedInvoice) {
      const {clearPatchedInvoice, patchedInvoice} = this.props;
      this.initilizeEditInvoiceForm(getContentIncoiveItem(patchedInvoice));
      clearPatchedInvoice();
    }

    if(prevState.selectedInvoice !== this.state.selectedInvoice) {
      this.scrollToSelectedRow();
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
      this.state.columns !== nextState.columns ||
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

  scrollToSelectedRow = () => {
    if(this.table && this.table.getWrappedInstance().tableElement.getElementsByClassName('selected').length) {
      var domNode: any = findDOMNode(this.table.getWrappedInstance().tableElement.getElementsByClassName('selected')[0]);
      domNode.scrollIntoViewIfNeeded();
    }
  }

  calculateHeight = () => {
    if(!this.table && !this.modal) {
      return;
    }
    const {showModal} = this.state;
    let {clientHeight: tableHeight} = this.table.getWrappedInstance().tableElement;

    const {clientHeight: modalHeight} = this.modal.wrappedInstance.modal;

    if(showModal) {
      tableHeight = modalHeight > TABLE_MAX_HEIGHT ? modalHeight : TABLE_MAX_HEIGHT;
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
    this.initilizeEditInvoiceForm(invoice.data);
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
    this.initilizeEditInvoiceForm(invoice.data);
  }

  initilizeEditInvoiceForm = (invoice: Object) => {
    const {destroy, initialize} = this.props;

    destroy(FormNames.INVOICE_EDIT);
    initialize(FormNames.INVOICE_EDIT, invoice);
  }

  handleDataUpdate = () => {
    this.calculateHeight();
    this.scrollToSelectedRow();
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
    this.initilizeEditInvoiceForm(row.data);
    this.scrolToModal();
  }

  editInvoice = (invoice: Object) => {
    const {patchInvoice} = this.props;
    patchInvoice(formatEditedInvoiceForDb(invoice));
  }

  handleInvoiceModalClose = () => {
    this.setState({
      selectedInvoice: {},
      showModal: false,
    });
  }

  handleCreditedInvoiceClick = (invoiceId: number) => {
    const {invoiceItems} = this.state,
      selectedInvoice = invoiceItems.find((invoice) => invoice.id === invoiceId);

    if(selectedInvoice) {
      this.setState({
        selectedInvoice: selectedInvoice,
        selectedInvoiceId: invoiceId,
      });
    }
  }

  updateColumns = () => {
    this.setState({columns: this.getColumns()});
  }

  sortByReceivableTypesAsc = (a, b) => {
    const {invoiceAttributes} = this.props,
      receivableTypeOptions = getAttributeFieldOptions(invoiceAttributes, 'rows.child.children.receivable_type'),
      valA = formatReceivableTypesString(receivableTypeOptions, get(a, 'data.receivableTypes')) || '',
      valB = formatReceivableTypesString(receivableTypeOptions, get(b, 'data.receivableTypes')) || '';

    return sortStringByKeyAsc(valA, valB);
  };

  sortByReceivableTypesDesc = (a, b) => {
    const {invoiceAttributes} = this.props,
      receivableTypeOptions = getAttributeFieldOptions(invoiceAttributes, 'rows.child.children.receivable_type'),
      valA = formatReceivableTypesString(receivableTypeOptions, get(a, 'data.receivableTypes')) || '',
      valB = formatReceivableTypesString(receivableTypeOptions, get(b, 'data.receivableTypes')) || '';

    return sortStringByKeyDesc(valA, valB);
  };

  sortByTypeAsc = (a, b) => {
    const {invoiceAttributes} = this.props,
      typeOptions = getAttributeFieldOptions(invoiceAttributes, 'type'),
      valA = getLabelOfOption(typeOptions, get(a, 'data.type')) || '',
      valB = getLabelOfOption(typeOptions, get(b, 'data.type')) || '';

    return sortStringByKeyAsc(valA, valB);
  };

  sortByTypeDesc = (a, b) => {
    const {invoiceAttributes} = this.props,
      typeOptions = getAttributeFieldOptions(invoiceAttributes, 'type'),
      valA = getLabelOfOption(typeOptions, get(a, 'data.type')) || '',
      valB = getLabelOfOption(typeOptions, get(b, 'data.type')) || '';

    return sortStringByKeyDesc(valA, valB);
  };

  sortByStateAsc = (a, b) => {
    const {invoiceAttributes} = this.props,
      stateOptions = getAttributeFieldOptions(invoiceAttributes, 'state'),
      valA = getLabelOfOption(stateOptions, get(a, 'data.state')) || '',
      valB = getLabelOfOption(stateOptions, get(b, 'data.state')) || '';

    return sortStringByKeyAsc(valA, valB);
  };

  sortByStateDesc = (a, b) => {
    const {invoiceAttributes} = this.props,
      stateOptions = getAttributeFieldOptions(invoiceAttributes, 'state'),
      valA = getLabelOfOption(stateOptions, get(a, 'data.state')) || '',
      valB = getLabelOfOption(stateOptions, get(b, 'data.state')) || '';

    return sortStringByKeyDesc(valA, valB);
  };

  sortByRecipientNameAsc = (a, b) => {
    const valA = getContactFullName(get(a, 'data.recipientFull')) ? getContactFullName(get(a, 'data.recipientFull')).toLowerCase() : '',
      valB = getContactFullName(get(a, 'data.recipientFull')) ? getContactFullName(get(b, 'data.recipientFull')).toLowerCase() : '';

    return sortStringByKeyAsc(valA, valB);
  };

  sortByRecipientNameDesc = (a, b) => {
    const valA = getContactFullName(get(a, 'data.recipientFull')) ? getContactFullName(get(a, 'data.recipientFull')).toLowerCase() : '',
      valB = getContactFullName(get(a, 'data.recipientFull')) ? getContactFullName(get(b, 'data.recipientFull')).toLowerCase() : '';

    return sortStringByKeyDesc(valA, valB);
  };

  getColumns = () => {
    const {invoiceAttributes} = this.props,
      {showAllColumns} = this.state;
    const receivableTypeOptions = getAttributeFieldOptions(invoiceAttributes, 'rows.child.children.receivable_type');
    const typeOptions = getAttributeFieldOptions(invoiceAttributes, 'type');
    const stateOptions = getAttributeFieldOptions(invoiceAttributes, 'state');

    if(showAllColumns) {
      return [
        {key: 'invoiceset', label: 'Laskuryhmä', primarySorting: 'desc', ascSortFunction: sortNumberByKeyAsc, descSortFunction: sortNumberByKeyDesc},
        {key: 'recipientFull', label: 'Vuokraaja', renderer: (val) => getContactFullName(val) || '-', ascSortFunction: this.sortByRecipientNameAsc, descSortFunction: this.sortByRecipientNameDesc},
        {key: 'due_date', label: 'Eräpäivä', primarySorting: 'desc', renderer: (val) => formatDate(val) || '-', defaultSorting: 'desc'},
        {key: 'id', label: 'Laskunro', primarySorting: 'desc', ascSortFunction: sortNumberByKeyAsc, descSortFunction: sortNumberByKeyDesc},
        {key: 'totalShare', label: 'Osuus', renderer: (val) => `${formatNumber(val * 100)} %`, ascSortFunction: sortNumberByKeyAsc, descSortFunction: sortNumberByKeyDesc},
        {key: 'billing_period_start_date', primarySorting: 'desc', label: 'Laskutuskausi', renderer: (val, invoice) => formatDateRange(invoice.data.billing_period_start_date, invoice.data.billing_period_end_date) || '-'},
        {key: 'receivableTypes', label: 'Saamislaji', renderer: (val) => <TruncatedText text={formatReceivableTypesString(receivableTypeOptions, val) || '-'} />, ascSortFunction: this.sortByReceivableTypesAsc, descSortFunction: this.sortByReceivableTypesDesc},
        {key: 'type', label: 'Tyyppi', renderer: (val) => getLabelOfOption(typeOptions, val) || '-', ascSortFunction: this.sortByTypeAsc, descSortFunction: this.sortByTypeDesc},
        {key: 'state', label: 'Laskun tila', renderer: (val) => getLabelOfOption(stateOptions, val) || '-', ascSortFunction: this.sortByStateAsc, descSortFunction: this.sortByStateDesc},
        {key: 'billed_amount', label: 'Laskutettu', renderer: (val) => val ? `${formatNumber(val)} €` : '-', ascSortFunction: sortNumberByKeyAsc, descSortFunction: sortNumberByKeyDesc},
        {key: 'outstanding_amount', label: 'Maksamatta', renderer: (val) => val ? `${formatNumber(val)} €` : '-', ascSortFunction: sortNumberByKeyAsc, descSortFunction: sortNumberByKeyDesc},
      ];
    } else {
      return [
        {key: 'invoiceset', label: 'Laskuryhmä', primarySorting: 'desc', ascSortFunction: sortNumberByKeyAsc, descSortFunction: sortNumberByKeyDesc},
        {key: 'recipientFull', label: 'Vuokraaja', renderer: (val) => getContactFullName(val) || '-', ascSortFunction: this.sortByRecipientNameAsc, descSortFunction: this.sortByRecipientNameDesc},
        {key: 'due_date', label: 'Eräpäivä', primarySorting: 'desc', renderer: (val) => formatDate(val) || '-', defaultSorting: 'desc'},
        {key: 'id', label: 'Laskunro', primarySorting: 'desc', ascSortFunction: sortNumberByKeyAsc, descSortFunction: sortNumberByKeyDesc},
        {key: 'totalShare', label: 'Osuus', renderer: (val) => `${formatNumber(val * 100)} %`, ascSortFunction: sortNumberByKeyAsc, descSortFunction: sortNumberByKeyDesc},
      ];
    }
  }

  render () {
    const {
      invoiceToCredit,
      isFetching,
      onInvoiceToCreditChange,
    } = this.props;
    const {
      columns,
      invoiceItems,
      selectedInvoice,
      showModal,
      tableHeight,
      tableWidth,
    } = this.state;

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
            invoiceToCredit={invoiceToCredit}
            isLoading={isFetching}
            maxHeight={tableHeight ? tableHeight - 31 : null}
            onDataUpdate={this.handleDataUpdate}
            onInvoiceToCreditChange={onInvoiceToCreditChange}
            onRowClick={this.handleRowClick}
            onSelectNext={this.handleSelectNext}
            onSelectPrevious={this.handleSelectPrevious}
            selectedRow={selectedInvoice}
          />
        </div>
        <InvoiceModalEdit
          ref={(ref) => this.modal = ref}
          invoice={selectedInvoice}
          minHeight={tableHeight}
          onClose={this.handleInvoiceModalClose}
          onCreditedInvoiceClick={this.handleCreditedInvoiceClick}
          onKeyCodeDown={this.handleKeyCodeDown}
          onKeyCodeUp={this.handleKeyCodeUp}
          onResize={this.handleModalHeightChange}
          onSave={this.editInvoice}
          show={showModal}
        />
      </div>
    );
  }
}

export default flowRight(
  connect(
    (state) => {
      const currentLease = getCurrentLease(state);
      return {
        currentLease: currentLease,
        invoiceAttributes: getInvoiceAttributes(state),
        invoices: getInvoicesByLease(state, currentLease.id),
        isFetching: getIsFetching(state),
        patchedInvoice: getPatchedInvoice(state),
      };
    },
    {
      clearPatchedInvoice,
      destroy,
      initialize,
      patchInvoice,
    }
  ),
)(InvoicesTableEdit);
