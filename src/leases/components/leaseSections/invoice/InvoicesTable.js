// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';
import isNumber from 'lodash/isNumber';
import classNames from 'classnames';
import scrollToComponent from 'react-scroll-to-component';

import InvoiceModal from './InvoiceModal';
import {getContactFullName} from '$src/contacts/helpers';
import {getInvoiceSharePercentage} from '$src/invoices/helpers';
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
  invoiceAttributes: InvoiceAttributes,
  invoices: InvoiceList,
}

type State = {
  selectedInvoice: Object,
  selectedInvoiceIndex: number,
  showAllColumns: boolean,
  showModal: boolean,
  tableHeight: ?number,
  tableWidth: ?number,
}

class InvoicesTable extends Component {
  props: Props

  container: any
  modal: any
  tableElement: any
  tableWrapper : any

  state: State = {
    selectedInvoice: {},
    selectedInvoiceIndex: -1,
    showAllColumns: true,
    showModal: false,
    tableHeight: null,
    tableWidth: null,
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
      if(clientWidth - MODAL_WIDTH <= 0) {
        clientWidth = 0;
      } else {
        clientWidth = clientWidth - MODAL_WIDTH;
      }
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
      this.props.invoices !== nextProps.invoices ||
      this.state.containerWidth !== nextState.containerWidth ||
      this.state.showAllColumns !== nextState.showAllColumns ||
      this.state.tableHeight !== nextState.tableHeight ||
      this.state.selectedInvoice !== nextState.selectedInvoice ||
      this.state.showModal !== nextState.showModal
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

  handleKeyCodeDown = () => {
    const {invoices} = this.props;
    const {selectedInvoiceIndex} = this.state;

    if(selectedInvoiceIndex < invoices.length - 1) {
      const newIndex = selectedInvoiceIndex + 1;
      this.setState({
        selectedInvoice: invoices[newIndex],
        selectedInvoiceIndex: newIndex,
        showModal: true,
      });
      this.scrolToModal();
    }
  }

  handleKeyCodeUp = () => {
    const {invoices} = this.props;
    const {selectedInvoiceIndex} = this.state;

    if(selectedInvoiceIndex > 0) {
      const newIndex = selectedInvoiceIndex - 1;
      this.setState({
        selectedInvoice: invoices[newIndex],
        selectedInvoiceIndex: newIndex,
        showModal: true,
      });
      this.scrolToModal();
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
    const {invoiceAttributes, invoices} = this.props;
    const {
      selectedInvoice,
      selectedInvoiceIndex,
      showAllColumns,
      showModal,
      tableHeight,
      tableWidth,
    } = this.state;
    const headers = this.getTableHeaders();
    const receivableTypeOptions = getAttributeFieldOptions(invoiceAttributes, 'receivable_type');
    const stateOptions = getAttributeFieldOptions(invoiceAttributes, 'state');


    return (
      <div
        className='invoice__invoice-table'
        ref={(ref) => this.container = ref}>
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
                          className={classNames({'selected': selectedInvoiceIndex === index})}
                          key={index}
                          onClick={() => {
                            this.setState({
                              showAllColumns: false,
                              selectedInvoice: invoice,
                              selectedInvoiceIndex: index,
                              showModal: true});
                            this.scrolToModal();
                          }}
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
        <InvoiceModal
          ref={(ref) => this.modal = ref}
          containerHeight={isNumber(tableHeight) ? tableHeight + 31 : null}
          invoice={selectedInvoice}
          onClose={() => this.setState({
            selectedInvoice: {},
            selectedInvoiceIndex: -1,
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
