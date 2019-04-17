// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {initialize} from 'redux-form';
import ReactResizeDetector from 'react-resize-detector';
import scrollToComponent from 'react-scroll-to-component';
import flowRight from 'lodash/flowRight';

import AmountWithVat from '$components/vat/AmountWithVat';
import InvoicePanel from './InvoicePanel';
import SortableTable from '$components/table/SortableTable';
import {clearPatchedInvoice, patchInvoice} from '$src/invoices/actions';
import {FormNames, KeyCodes} from '$src/enums';
import {
  InvoiceFieldPaths,
  InvoiceFieldTitles,
  InvoiceRowsFieldPaths,
  InvoiceRowsFieldTitles,
  InvoiceType,
} from '$src/invoices/enums';
import {TableSortOrder} from '$components/enums';
import {UsersPermissions} from '$src/usersPermissions/enums';
import {getContactFullName} from '$src/contacts/helpers';
import {
  formatReceivableTypesString,
  getContentInvoices,
  getContentIncoive,
  getPayloadEditInvoice,
} from '$src/invoices/helpers';
import {
  formatDate,
  formatDateRange,
  formatNumber,
  getFieldOptions,
  getLabelOfOption,
  getUrlParams,
  hasPermissions,
  isFieldAllowedToRead,
  sortNumberByKeyAsc,
  sortNumberByKeyDesc,
  sortStringAsc,
  sortStringDesc,
} from '$util/helpers';
import {getCurrentLease} from '$src/leases/selectors';
import {
  getAttributes as getInvoiceAttributes,
  getInvoicesByLease,
  getIsCreditInvoicePanelOpen,
  getPatchedInvoice,
} from '$src/invoices/selectors';
import {getInvoiceSetsByLease} from '$src/invoiceSets/selectors';
import {getUsersPermissions} from '$src/usersPermissions/selectors';

import type {Attributes} from '$src/types';
import type {Invoice, InvoiceList} from '$src/invoices/types';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';

const TABLE_MIN_HEIGHT = 521;
const PANEL_WIDTH = 607.5;

type Props = {
  clearPatchedInvoice: Function,
  destroy: Function,
  initialize: Function,
  invoices: InvoiceList,
  invoiceAttributes: Attributes,
  invoiceToCredit: ?Object,
  invoiceSets: Array<Object>,
  location: Object,
  onInvoiceToCreditChange: Function,
  patchInvoice: Function,
  patchedInvoice: ?Invoice,
  usersPermissions: UsersPermissionsType,
}

type State = {
  columns: Array<Object>,
  defaultInvoiceDisplayed: boolean,
  formatedInvoices: Array<Object>,
  invoices: InvoiceList | null,
  invoiceAttributes: Attributes,
  invoiceSets: Array<Object>,
  invoiceSetOptions: Array<Object>,
  openedInvoice: ?Invoice,
  receivableTypeOptions: Array<Object>,
  stateOptions: Array<Object>,
  tableHeight: ?number,
  tableWidth: ?number,
  typeOptions: Array<Object>,
}

const getInvoiceSetOptions = (invoiceSets) =>
  invoiceSets ? invoiceSets.map((set) => {
    return {
      ...set,
      invoiceset: set.id,
    };
  }) : [];

class InvoiceTableAndPanel extends Component<Props, State> {
  container: any
  panel: any
  table: any

  state = {
    columns: [],
    defaultInvoiceDisplayed: false,
    formatedInvoices: [],
    invoices: null,
    invoiceAttributes: null,
    invoiceSets: [],
    invoiceSetOptions: [],
    openedInvoice: null,
    receivableTypeOptions: [],
    stateOptions: [],
    tableHeight: null,
    tableWidth: null,
    typeOptions: [],
  }

  setContainerRef = (el: any) => {
    this.container = el;
  }

  setPanelRef = (el: any) => {
    this.panel = el;
  }

  setTableRef = (el: any) => {
    this.table = el;
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState = {};

    if(props.invoices !== state.invoices) {
      const formatedInvoices = getContentInvoices(props.invoices);
      newState.invoices = props.invoices;
      newState.formatedInvoices = formatedInvoices;

      if(!state.defaultInvoiceDisplayed) {
        const {location: {search}} = props;
        const query = getUrlParams(search);

        if(query.opened_invoice) {
          const invoice = formatedInvoices
            ? formatedInvoices.find((invoice) => invoice.id == query.opened_invoice)
            : null;

          if(invoice) {
            newState.openedInvoice = invoice;
            newState.defaultInvoiceDisplayed = true;
          }
        } else {
          newState.defaultInvoiceDisplayed = true;
        }
      }
    }
    if(props.invoiceSets !== state.invoiceSets) {
      newState.invoiceSets = props.invoiceSets;
      newState.invoiceSetOptions = getInvoiceSetOptions(props.invoiceSets);
    }
    if(props.invoiceAttributes !== state.invoiceAttributes) {
      newState.invoiceAttributes = props.invoiceAttributes;
      newState.receivableTypeOptions = getFieldOptions(props.invoiceAttributes, InvoiceRowsFieldPaths.RECEIVABLE_TYPE);
      newState.typeOptions = getFieldOptions(props.invoiceAttributes, InvoiceFieldPaths.TYPE);
      newState.stateOptions = getFieldOptions(props.invoiceAttributes, InvoiceFieldPaths.STATE);
    }

    return newState;
  }

  componentDidMount() {
    const {clearPatchedInvoice} = this.props;

    clearPatchedInvoice();
    this.calculateTableHeight();
    this.calculateTableWidth();

    this.setState({
      columns: this.getColumns(),
    });
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if(prevState.invoiceAttributes !== this.state.invoiceAttributes
      || prevState.invoiceSetOptions !== this.state.invoiceSetOptions
    ) {
      this.setState({
        columns: this.getColumns(),
      });
    }
    if(prevState.openedInvoice !== this.state.openedInvoice) {
      this.scrollToOpenedRow();
      this.calculateTableHeight();
      this.calculateTableWidth();
      this.scrolToPanel();
      this.initilizeEditInvoiceForm(this.state.openedInvoice);
    }

    if(this.props.patchedInvoice) {
      const {clearPatchedInvoice, patchedInvoice} = this.props;
      this.initilizeEditInvoiceForm(getContentIncoive(patchedInvoice));
      clearPatchedInvoice();
    }
  }

  handleResize = () => {
    this.calculateTableHeight();
    this.calculateTableWidth();
  }

  scrolToPanel = () => {
    setTimeout(() => {
      scrollToComponent(this.panel, {
        offset: -130,
        align: 'top',
        duration: 450,
      });
    }, 50);
  }

  scrollToOpenedRow = () => {
    if(this.table){
      const selectedRows = this.table.scrollBodyWrapper.getElementsByClassName('selected');
      if(selectedRows.length) {
        if(selectedRows[0].scrollIntoViewIfNeeded) {
          selectedRows[0].scrollIntoViewIfNeeded();
        } else {
          this.scrollIntoViewIfNeeded(selectedRows[0]);
        }
      }
    }
  }

  scrollIntoViewIfNeeded = (element: any) => {
    const parent = element.parentNode.parentNode.parentNode,
      parentComputedStyle = window.getComputedStyle(parent, null),
      parentBorderTopWidth = parseInt(parentComputedStyle.getPropertyValue('border-top-width')),
      overTop = element.offsetTop - parent.offsetTop < parent.scrollTop,
      overBottom = (element.offsetTop - parent.offsetTop + element.clientHeight - parentBorderTopWidth) > (parent.scrollTop + parent.clientHeight);

    if ((overTop || overBottom)) {
      parent.scrollTop = element.offsetTop - parent.offsetTop - parent.clientHeight / 2 - parentBorderTopWidth + element.clientHeight / 2;
    }
  }

  calculateTableHeight = () => {
    if(!this.table || !this.panel) return;

    const {openedInvoice} = this.state,
      {scrollHeight: panelHeight} = this.panel.container,
      tableMinHeight = TABLE_MIN_HEIGHT,
      borderHeight = 2;
    let {scrollHeight: tableHeight} = this.table.scrollBodyTable;

    if(openedInvoice) {
      tableHeight = panelHeight > tableMinHeight ? panelHeight : tableMinHeight;
    } else {
      tableHeight = tableMinHeight - borderHeight;
    }

    this.setState({
      tableHeight: tableHeight,
    });
  }

  calculateTableWidth = () => {
    if(!this.container) return;

    let {clientWidth} = this.container;
    const {openedInvoice} = this.state;

    if(openedInvoice) {
      if(clientWidth - PANEL_WIDTH <= 0) {
        clientWidth = 0;
      }
      else {
        clientWidth = clientWidth - PANEL_WIDTH;
      }
    }
    this.setState({
      tableWidth: clientWidth,
    });
  }

  handleDataUpdate = () => {
    this.calculateTableHeight();
    this.scrollToOpenedRow();
  }

  handleKeyDown = (code: number) => {
    switch(code) {
      case KeyCodes.ARROW_LEFT:
        this.handleKeyCodeLeft();
        break;
      case KeyCodes.ARROW_RIGHT:
        this.handleKeyCodeRight();
        break;
    }
  }

  handleKeyCodeLeft = () => {
    const {openedInvoice} = this.state;

    if(openedInvoice) {
      this.table.selectPrevious();
    }
  }

  handleKeyCodeRight = () => {
    const {openedInvoice} = this.state;

    if(openedInvoice) {
      this.table.selectNext();
    }
  }

  openNextInvoice = (invoice: Object) => {
    this.setState({
      openedInvoice: invoice,
    });
    this.initilizeEditInvoiceForm(invoice);
  }

  openPreviousInvoice = (invoice: Object) => {
    this.setState({
      openedInvoice: invoice,
    });

    this.initilizeEditInvoiceForm(invoice);
  }

  initilizeEditInvoiceForm = (invoice: Object) => {
    const {initialize} = this.props;
    const formName = FormNames.LEASE_INVOICE_EDIT;

    initialize(formName, invoice);
  }

  sortByRecipientNameAsc = (a, b) => {
    const valA = getContactFullName(a.recipientFull) ? getContactFullName(a.recipientFull).toLowerCase() : '',
      valB = getContactFullName(a.recipientFull) ? getContactFullName(b.recipientFull).toLowerCase() : '';

    return sortStringAsc(valA, valB);
  };

  sortByRecipientNameDesc = (a, b) => {
    const valA = getContactFullName(a.recipientFull) ? getContactFullName(a.recipientFull).toLowerCase() : '',
      valB = getContactFullName(a.recipientFull) ? getContactFullName(b.recipientFull).toLowerCase() : '';

    return sortStringDesc(valA, valB);
  };

  sortByReceivableTypesAsc = (a, b) => {
    const {receivableTypeOptions} = this.state,
      valA = formatReceivableTypesString(receivableTypeOptions, a.receivableTypes) || '',
      valB = formatReceivableTypesString(receivableTypeOptions, b.receivableTypes) || '';

    return sortStringAsc(valA, valB);
  };

  sortByReceivableTypesDesc = (a, b) => {
    const {receivableTypeOptions} = this.state,
      valA = formatReceivableTypesString(receivableTypeOptions, a.receivableTypes) || '',
      valB = formatReceivableTypesString(receivableTypeOptions, b.receivableTypes) || '';

    return sortStringDesc(valA, valB);
  };

  sortByTypeAsc = (a, b) => {
    const {typeOptions} = this.state,
      valA = getLabelOfOption(typeOptions, a.type) || '',
      valB = getLabelOfOption(typeOptions, b.type) || '';

    return sortStringAsc(valA, valB);
  };

  sortByTypeDesc = (a, b) => {
    const {typeOptions} = this.state,
      valA = getLabelOfOption(typeOptions, a.type) || '',
      valB = getLabelOfOption(typeOptions, b.type) || '';

    return sortStringDesc(valA, valB);
  };

  sortByStateAsc = (a, b) => {
    const {stateOptions} = this.state,
      valA = getLabelOfOption(stateOptions, a.state) || '',
      valB = getLabelOfOption(stateOptions, b.state) || '';

    return sortStringAsc(valA, valB);
  };

  sortByStateDesc = (a, b) => {
    const {stateOptions} = this.state,
      valA = getLabelOfOption(stateOptions, a.state) || '',
      valB = getLabelOfOption(stateOptions, b.state) || '';

    return sortStringDesc(valA, valB);
  };

  getColumns = () => {
    const {invoiceAttributes, invoiceSetOptions, receivableTypeOptions, stateOptions, typeOptions} = this.state;
    const columns = [];

    if(isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.INVOICESET)) {
      columns.push({
        key: 'invoiceset',
        ascSortFunction: sortNumberByKeyAsc,
        descSortFunction: sortNumberByKeyDesc,
        grouping: {
          key: 'invoiceset',
          options: invoiceSetOptions,
          columnKeys: [
            'billing_period_start_date',
            'invoiceset',
          ],
          columnsToHide: [
            'invoiceset',
          ],
        },
        text: InvoiceFieldTitles.INVOICESET,
      });
    }

    if(isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.RECIPIENT)) {
      columns.push({
        key: 'recipientFull',
        ascSortFunction: this.sortByRecipientNameAsc,
        descSortFunction: this.sortByRecipientNameDesc,
        renderer: (val) => getContactFullName(val) || '-',
        text: InvoiceFieldTitles.RECIPIENT,
      });
    }

    if(isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.DUE_DATE)) {
      columns.push({
        key: 'due_date',
        dataClassName: 'no-wrap',
        renderer: (val) => formatDate(val),
        text: InvoiceFieldTitles.DUE_DATE,
      });
    }

    if(isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.NUMBER)) {
      columns.push({
        key: 'number',
        ascSortFunction: sortNumberByKeyAsc,
        descSortFunction: sortNumberByKeyDesc,
        dataClassName: 'no-wrap',
        text: 'Laskunro',
      });
    }

    columns.push({
      key: 'totalShare',
      ascSortFunction: sortNumberByKeyAsc,
      descSortFunction: sortNumberByKeyDesc,
      dataClassName: 'no-wrap',
      renderer: (val) => val !== null ? `${formatNumber(val * 100)} %` : '-',
      text: InvoiceFieldTitles.SHARE,
    });

    if(isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.BILLING_PERIOD_START_DATE)) {
      columns.push({
        key: 'billing_period_start_date',
        dataClassName: 'no-wrap',
        grouping: {
          key: 'invoiceset',
          options: invoiceSetOptions,
          columnKeys: [
            'billing_period_start_date',
            'invoiceset',
          ],
          columnsToHide: [
            'invoiceset',
          ],
        },
        renderer: (val, invoice) => formatDateRange(invoice.billing_period_start_date, invoice.billing_period_end_date) || '-',
        text: InvoiceFieldTitles.BILLING_PERIOD,
      });
    }

    if(isFieldAllowedToRead(invoiceAttributes, InvoiceRowsFieldPaths.RECEIVABLE_TYPE)) {
      columns.push({
        key: 'receivableTypes',
        ascSortFunction: this.sortByReceivableTypesAsc,
        descSortFunction: this.sortByReceivableTypesDesc,
        arrayRenderer: (val) => formatReceivableTypesString(receivableTypeOptions, val) || '-',
        text: InvoiceRowsFieldTitles.RECEIVABLE_TYPE,
      });
    }

    if(isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.TYPE)) {
      columns.push({
        key: 'type',
        ascSortFunction: this.sortByTypeAsc,
        descSortFunction: this.sortByTypeDesc,
        renderer: (val) => getLabelOfOption(typeOptions, val) || '-',
        text: 'Tyyppi',
      });
    }

    if(isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.STATE)) {
      columns.push({
        key: 'state',
        ascSortFunction: this.sortByStateAsc,
        descSortFunction: this.sortByStateDesc,
        renderer: (val) => getLabelOfOption(stateOptions, val) || '-',
        text: InvoiceFieldTitles.STATE,
      });
    }

    if(isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.BILLED_AMOUNT)) {
      columns.push({
        key: 'billed_amount',
        ascSortFunction: sortNumberByKeyAsc,
        descSortFunction: sortNumberByKeyDesc,
        dataClassName: 'no-wrap',
        renderer: (val, row) => <AmountWithVat amount={row.billed_amount || 0} date={row.due_date} />,
        text: 'Laskutettu',
      });
    }

    if(isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.OUTSTANDING_AMOUNT)) {
      columns.push({
        key: 'outstanding_amount',
        ascSortFunction: sortNumberByKeyAsc,
        descSortFunction: sortNumberByKeyDesc,
        dataClassName: 'no-wrap',
        renderer: (val, row) => <AmountWithVat amount={row.outstanding_amount || 0} date={row.due_date} />,
        text: 'Maksamatta',
      });
    }

    return columns;
  }

  isTableRadioButtonDisabled = (row: Object) => {
    if(row.tableGroupName === 'invoiceset') {
      let disabled = true;

      row.tableRows.forEach((invoice) => {
        if(invoice.type !== InvoiceType.CREDIT_NOTE) {
          disabled = false;
          return false;
        }
      });
      return disabled;
    }

    return row.type === InvoiceType.CREDIT_NOTE;
  }

  handleRowClick = (id: number, row: Object) => {
    this.setState({
      openedInvoice: row,
    });
  }

  handleSelectRow = (row: Object) => {
    const {onInvoiceToCreditChange} = this.props;
    onInvoiceToCreditChange(row);
  }

  handleInvoicePanelClose = () => {
    this.setState({
      openedInvoice: null,
    });
  }

  handlePanelResize = () => {
    this.calculateTableHeight();
  }

  handleInvoiceLinkClick = (invoiceId: number) => {
    const {formatedInvoices} = this.state,
      selectedInvoice = formatedInvoices.find((invoice) => invoice.id === invoiceId);

    if(selectedInvoice) {
      this.setState({
        openedInvoice: selectedInvoice,
      });
    }
  }

  editInvoice = (invoice: Object) => {
    const {patchInvoice} = this.props;

    patchInvoice(getPayloadEditInvoice(invoice));
  }

  render() {
    const {
      invoiceToCredit,
      usersPermissions,
    } = this.props;
    const {columns, formatedInvoices, openedInvoice, tableHeight, tableWidth} = this.state;

    return(
      <div className='invoice__invoice-table' ref={this.setContainerRef}>
        <ReactResizeDetector
          handleWidth
          onResize={this.handleResize}
          refreshMode='debounce'
          refreshRate={400}
        />
        <div
          className='invoice__invoice-table_wrapper'
          style={{minHeight: formatedInvoices.length ? tableHeight || null : null, maxWidth: tableWidth || null}}
        >
          <SortableTable
            ref={this.setTableRef}
            clickedRow={openedInvoice}
            columns={columns}
            data={formatedInvoices}
            defaultSortKey='due_date'
            defaultSortOrder={TableSortOrder.DESCENDING}
            fixedHeader={true}
            maxHeight={tableHeight}
            noDataText='Ei laskuja'
            onDataUpdate={this.handleDataUpdate}
            onRowClick={this.handleRowClick}
            onSelectNext={this.openNextInvoice}
            onSelectPrevious={this.openPreviousInvoice}
            onSelectRow={this.handleSelectRow}
            radioButtonDisabledFunction={this.isTableRadioButtonDisabled}
            selectedRow={invoiceToCredit}
            showGroupRadioButton={hasPermissions(usersPermissions, UsersPermissions.ADD_INVOICE)}
            showRadioButton={hasPermissions(usersPermissions, UsersPermissions.ADD_INVOICE)}
            sortable={true}
          />
        </div>

        <InvoicePanel
          ref={this.setPanelRef}
          invoice={openedInvoice}
          isOpen={!!openedInvoice}
          minHeight={tableHeight}
          onClose={this.handleInvoicePanelClose}
          onInvoiceLinkClick={this.handleInvoiceLinkClick}
          onKeyDown={this.handleKeyDown}
          onResize={this.handlePanelResize}
          onSave={this.editInvoice}
        />
      </div>
    );
  }
}


export default flowRight(
  withRouter,
  connect(
    (state) => {
      const currentLease = getCurrentLease(state);

      return {
        invoices: getInvoicesByLease(state, currentLease.id),
        invoiceAttributes: getInvoiceAttributes(state),
        invoiceSets: getInvoiceSetsByLease(state, currentLease.id),
        isCreditInvoicePanelOpen: getIsCreditInvoicePanelOpen(state),
        patchedInvoice: getPatchedInvoice(state),
        usersPermissions: getUsersPermissions(state),
      };
    },
    {
      clearPatchedInvoice,
      initialize,
      patchInvoice,
    },
  )
)(InvoiceTableAndPanel);
