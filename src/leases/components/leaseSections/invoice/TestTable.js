// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import scrollToComponent from 'react-scroll-to-component';

import InvoicePanel from './InvoicePanel';
import SortableTable from '$components/table/SortableTable';
import TruncatedText from '$components/content/TruncatedText';
import {KeyCodes} from '$src/enums';
import {InvoiceType} from '$src/invoices/enums';
import {TableSortOrder} from '$components/enums';
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
  sortStringByKeyAsc,
  sortStringByKeyDesc,
} from '$util/helpers';
import {getCurrentLease, getIsEditMode} from '$src/leases/selectors';
import {
  getAttributes as getInvoiceAttributes,
  getInvoicesByLease,
} from '$src/invoices/selectors';
import {getInvoiceSetsByLease} from '$src/invoiceSets/selectors';

import type {
  Attributes as InvoiceAttributes,
  InvoiceList,
} from '$src/invoices/types';

const MODAL_WIDTH = 607.5;

type Props = {
  invoices: InvoiceList,
  invoiceAttributes: InvoiceAttributes,
  invoiceSets: Array<Object>,
  isEditMode: boolean,
}

type State = {
  columns: Array<Object>,
  formatedInvoices: Array<Object>,
  invoices: InvoiceList | null,
  invoiceAttributes: InvoiceAttributes,
  invoiceSets: Array<Object>,
  invoiceSetOptions: Array<Object>,
  openedInvoice: ?Object,
  receivableTypeOptions: Array<Object>,
  selectedRow: ?Object,
  stateOptions: Array<Object>,
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

class TestTable extends Component<Props, State> {
  container: any
  modal: any
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
    selectedRow: null,
    stateOptions: [],
    tableWidth: null,
    typeOptions: [],
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
    this.calculateTableWidth();
    this.setState({
      columns: this.getColumns(),
    });
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if(prevState.invoiceSetOptions !== this.state.invoiceSetOptions ||
      prevState.receivableTypeOptions !== this.state.receivableTypeOptions) {
      this.setState({
        columns: this.getColumns(),
      });
    }
    if(prevState.openedInvoice !== this.state.openedInvoice) {
      this.scrollToOpenedRow();
      this.calculateTableWidth();
    }
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

  scrollToOpenedRow = () => {
    if(this.table){
      const selectedRows = this.table.scrollBodyWrapper.getElementsByClassName('selected');
      if(selectedRows.length) {
        selectedRows[0].scrollIntoViewIfNeeded();
      }
    }
  }

  calculateTableWidth = () => {
    let {clientWidth} = this.container;
    const {openedInvoice} = this.state;

    if(openedInvoice) {
      if(clientWidth - MODAL_WIDTH <= 0) {
        clientWidth = 0;
      }
      else {
        clientWidth = clientWidth - MODAL_WIDTH;
      }
    }
    this.setState({
      tableWidth: clientWidth,
    });
  }

  handleDataUpdate = () => {
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
  }

  openPreviousInvoice = (invoice: Object) => {
    this.setState({
      openedInvoice: invoice,
    });
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
        key: 'id',
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
        renderer: (val) => `${formatNumber(val * 100)} %`,
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
        renderer: (val) => <TruncatedText text={formatReceivableTypesString(receivableTypeOptions, val) || '-'} />,
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
        renderer: (val) => val ? `${formatNumber(val || 0)} €` : '-',
        text: 'Laskutettu',
      },
      {
        key: 'outstanding_amount',
        ascSortFunction: sortNumberByKeyAsc,
        descSortFunction: sortNumberByKeyDesc,
        renderer: (val) => `${formatNumber(val || 0)} €`,
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
    this.scrolToModal();
  }

  handleSelectRow = (row: Object) => {
    this.setState({
      selectedRow: row,
    });
  }

  handleInvoiceModalClose = () => {
    this.setState({
      openedInvoice: null,
    });
  }

  handleOnCreditedInvoiceClick = (invoiceId: number) => {
    const {formatedInvoices} = this.state,
      selectedInvoice = formatedInvoices.find((invoice) => invoice.id === invoiceId);

    if(selectedInvoice) {
      this.setState({
        openedInvoice: selectedInvoice,
      });
    }
    console.log('invoice to credit', invoiceId);
  }

  render() {
    const {isEditMode} = this.props;
    const {columns, formatedInvoices, openedInvoice, selectedRow, tableWidth} = this.state;

    return(
      <div className='invoice__invoice-table'
        ref={(ref) => this.container = ref}
      >
        <div
          className='invoice__invoice-table_wrapper'
          style={{maxWidth: tableWidth || null}}
        >
          <SortableTable
            ref={(ref) => this.table = ref}
            clickedRow={openedInvoice}
            columns={columns}
            data={formatedInvoices}
            defaultSortKey='due_date'
            defaultSortOrder={TableSortOrder.DESCENDING}
            fixedHeader={true}
            maxHeight={500}
            onDataUpdate={this.handleDataUpdate}
            onRowClick={this.handleRowClick}
            onSelectNext={this.openNextInvoice}
            onSelectPrevious={this.openPreviousInvoice}
            onSelectRow={this.handleSelectRow}
            radioButtonDisabledFunction={this.isTableRadioButtonDisabled}
            selectedRow={selectedRow}
            showRadioButton={true}
            sortable={true}
          />
        </div>

        <InvoicePanel
          ref={(ref) => this.modal = ref}
          invoice={openedInvoice}
          isOpen={!!openedInvoice}
          minHeight={500 + 33}
          isEditMode={isEditMode}
          onClose={this.handleInvoiceModalClose}
          onCreditedInvoiceClick={this.handleOnCreditedInvoiceClick}
          onKeyDown={this.handleKeyDown}
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
    };
  }
)(TestTable);
