// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {initialize} from 'redux-form';
import ReactResizeDetector from 'react-resize-detector';
import scrollToComponent from 'react-scroll-to-component';

import AmountWithVat from '$components/vat/AmountWithVat';
import InvoicePanel from './InvoicePanel';
import SortableTable from '$components/table/SortableTable';
import {clearPatchedInvoice, patchInvoice} from '$src/invoices/actions';
import {KeyCodes} from '$src/enums';
import {InvoiceType} from '$src/invoices/enums';
import {FormNames} from '$src/leases/enums';
import {TableSortOrder} from '$components/enums';
import {getContactFullName} from '$src/contacts/helpers';
import {
  formatEditedInvoiceForDb,
  formatReceivableTypesString,
  getContentInvoices,
  getContentIncoiveItem,
} from '$src/invoices/helpers';
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
import {getCurrentLease, getIsEditMode} from '$src/leases/selectors';
import {
  getAttributes as getInvoiceAttributes,
  getInvoicesByLease,
  getPatchedInvoice,
} from '$src/invoices/selectors';
import {getInvoiceSetsByLease} from '$src/invoiceSets/selectors';

import type {
  Attributes as InvoiceAttributes,
  Invoice,
  InvoiceList,
} from '$src/invoices/types';

const TABLE_MIN_HEIGHT = 521;
const TABLE_MIN_HEIGHT_EDIT = 521;
const PANEL_WIDTH = 607.5;

type Props = {
  clearPatchedInvoice: Function,
  destroy: Function,
  initialize: Function,
  invoices: InvoiceList,
  invoiceAttributes: InvoiceAttributes,
  invoiceToCredit: ?Object,
  invoiceSets: Array<Object>,
  isEditMode: boolean,
  onInvoiceToCreditChange: Function,
  patchInvoice: Function,
  patchedInvoice: ?Invoice,
}

type State = {
  columns: Array<Object>,
  formatedInvoices: Array<Object>,
  invoices: InvoiceList | null,
  invoiceAttributes: InvoiceAttributes,
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
    formatedInvoices: [],
    invoices: null,
    invoiceAttributes: {},
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
      newState.invoices = props.invoices;
      newState.formatedInvoices = getContentInvoices(props.invoices);
    }
    if(props.invoiceSets !== state.invoiceSets) {
      newState.invoiceSets = props.invoiceSets;
      newState.invoiceSetOptions = getInvoiceSetOptions(props.invoiceSets);
    }
    if(props.invoiceAttributes !== state.invoiceAttributes) {
      newState.invoiceAttributes = props.invoiceAttributes;
      newState.receivableTypeOptions = getAttributeFieldOptions(props.invoiceAttributes, 'rows.child.children.receivable_type');
      newState.typeOptions = getAttributeFieldOptions(props.invoiceAttributes, 'type');
      newState.stateOptions = getAttributeFieldOptions(props.invoiceAttributes, 'state');
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
    }

    if(this.props.patchedInvoice) {
      const {clearPatchedInvoice, patchedInvoice} = this.props;
      this.initilizeEditInvoiceForm(getContentIncoiveItem(patchedInvoice));
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
    if(!this.table || !this.panel) {
      return;
    }

    const {isEditMode} = this.props,
      {openedInvoice} = this.state,
      {scrollHeight: panelHeight} = this.panel.wrappedInstance.container,
      tableMinHeight = isEditMode ? TABLE_MIN_HEIGHT_EDIT : TABLE_MIN_HEIGHT,
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
    const formName = FormNames.INVOICE_EDIT;

    initialize(formName, invoice);
  }

  sortByRecipientNameAsc = (a, b) => {
    const valA = getContactFullName(a.recipientFull) ? getContactFullName(a.recipientFull).toLowerCase() : '',
      valB = getContactFullName(a.recipientFull) ? getContactFullName(b.recipientFull).toLowerCase() : '';

    return sortStringByKeyAsc(valA, valB);
  };

  sortByRecipientNameDesc = (a, b) => {
    const valA = getContactFullName(a.recipientFull) ? getContactFullName(a.recipientFull).toLowerCase() : '',
      valB = getContactFullName(a.recipientFull) ? getContactFullName(b.recipientFull).toLowerCase() : '';

    return sortStringByKeyDesc(valA, valB);
  };

  sortByReceivableTypesAsc = (a, b) => {
    const {receivableTypeOptions} = this.state,
      valA = formatReceivableTypesString(receivableTypeOptions, a.receivableTypes) || '',
      valB = formatReceivableTypesString(receivableTypeOptions, b.receivableTypes) || '';

    return sortStringByKeyAsc(valA, valB);
  };

  sortByReceivableTypesDesc = (a, b) => {
    const {receivableTypeOptions} = this.state,
      valA = formatReceivableTypesString(receivableTypeOptions, a.receivableTypes) || '',
      valB = formatReceivableTypesString(receivableTypeOptions, b.receivableTypes) || '';

    return sortStringByKeyDesc(valA, valB);
  };

  sortByTypeAsc = (a, b) => {
    const {typeOptions} = this.state,
      valA = getLabelOfOption(typeOptions, a.type) || '',
      valB = getLabelOfOption(typeOptions, b.type) || '';

    return sortStringByKeyAsc(valA, valB);
  };

  sortByTypeDesc = (a, b) => {
    const {typeOptions} = this.state,
      valA = getLabelOfOption(typeOptions, a.type) || '',
      valB = getLabelOfOption(typeOptions, b.type) || '';

    return sortStringByKeyDesc(valA, valB);
  };

  sortByStateAsc = (a, b) => {
    const {stateOptions} = this.state,
      valA = getLabelOfOption(stateOptions, a.state) || '',
      valB = getLabelOfOption(stateOptions, b.state) || '';

    return sortStringByKeyAsc(valA, valB);
  };

  sortByStateDesc = (a, b) => {
    const {stateOptions} = this.state,
      valA = getLabelOfOption(stateOptions, a.state) || '',
      valB = getLabelOfOption(stateOptions, b.state) || '';

    return sortStringByKeyDesc(valA, valB);
  };

  getColumns = () => {
    const {invoiceSetOptions, receivableTypeOptions, stateOptions, typeOptions} = this.state;

    return [
      {
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
        text: 'Laskuryhmä',
      },
      {
        key: 'recipientFull',
        ascSortFunction: this.sortByRecipientNameAsc,
        descSortFunction: this.sortByRecipientNameDesc,
        renderer: (val) => getContactFullName(val) || '-',
        text: 'Laskunsaaja',
      },
      {
        key: 'due_date',
        dataClassName: 'no-wrap',
        renderer: (val) => formatDate(val),
        text: 'Eräpäivä',
      },
      {
        key: 'number',
        ascSortFunction: sortNumberByKeyAsc,
        descSortFunction: sortNumberByKeyDesc,
        dataClassName: 'no-wrap',
        text: 'Laskunro',
      },
      {
        key: 'totalShare',
        ascSortFunction: sortNumberByKeyAsc,
        descSortFunction: sortNumberByKeyDesc,
        dataClassName: 'no-wrap',
        renderer: (val) => val !== null ? `${formatNumber(val * 100)} %` : '-',
        text: 'Osuus',
      },
      {
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
        text: 'Laskutuskausi',
      },
      {
        key: 'receivableTypes',
        ascSortFunction: this.sortByReceivableTypesAsc,
        descSortFunction: this.sortByReceivableTypesDesc,
        renderer: (val) => formatReceivableTypesString(receivableTypeOptions, val) || '-',
        text: 'Saamislaji',
      },
      {
        key: 'type',
        ascSortFunction: this.sortByTypeAsc,
        descSortFunction: this.sortByTypeDesc,
        renderer: (val) => getLabelOfOption(typeOptions, val) || '-',
        text: 'Tyyppi',
      },
      {
        key: 'state',
        ascSortFunction: this.sortByStateAsc,
        descSortFunction: this.sortByStateDesc,
        renderer: (val) => getLabelOfOption(stateOptions, val) || '-',
        text: 'Laskun tila',
      },
      {
        key: 'billed_amount',
        ascSortFunction: sortNumberByKeyAsc,
        descSortFunction: sortNumberByKeyDesc,
        dataClassName: 'no-wrap',
        renderer: (val, row) => <AmountWithVat amount={row.billed_amount || 0} date={row.due_date} />,
        text: 'Laskutettu',
      },
      {
        key: 'outstanding_amount',
        ascSortFunction: sortNumberByKeyAsc,
        descSortFunction: sortNumberByKeyDesc,
        dataClassName: 'no-wrap',
        renderer: (val, row) => <AmountWithVat amount={row.outstanding_amount || 0} date={row.due_date} />,
        text: 'Maksamatta',
      },
    ];
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

    this.scrolToPanel();
    this.initilizeEditInvoiceForm(row);
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

  handleOnCreditedInvoiceClick = (invoiceId: number) => {
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
    patchInvoice(formatEditedInvoiceForDb(invoice));
  }

  render() {
    const {invoiceToCredit, isEditMode} = this.props;
    const {columns, formatedInvoices, openedInvoice, tableHeight, tableWidth} = this.state;

    return(
      <div className='invoice__invoice-table'
        ref={this.setContainerRef}
      >
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
            showRadioButton={true}
            sortable={true}
          />
        </div>

        <InvoicePanel
          ref={this.setPanelRef}
          invoice={openedInvoice}
          isOpen={!!openedInvoice}
          minHeight={tableHeight}
          isEditMode={isEditMode}
          onClose={this.handleInvoicePanelClose}
          onCreditedInvoiceClick={this.handleOnCreditedInvoiceClick}
          onKeyDown={this.handleKeyDown}
          onResize={this.handlePanelResize}
          onSave={this.editInvoice}
        />
      </div>
    );
  }
}


export default connect(
  (state) => {
    const currentLease = getCurrentLease(state);

    return {
      invoices: getInvoicesByLease(state, currentLease.id),
      invoiceAttributes: getInvoiceAttributes(state),
      invoiceSets: getInvoiceSetsByLease(state, currentLease.id),
      isEditMode: getIsEditMode(state),
      patchedInvoice: getPatchedInvoice(state),
    };
  },
  {
    clearPatchedInvoice,
    initialize,
    patchInvoice,
  }
)(InvoiceTableAndPanel);
