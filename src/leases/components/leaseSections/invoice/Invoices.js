// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';

import DebtCollection from './DebtCollection';
import Collapse from '$components/collapse/Collapse';
import Divider from '$components/content/Divider';
import InvoicesTable from './InvoicesTable';
import CreateAndCreditInvoiceComponent from './CreateAndCreditInvoiceComponent';
import RentCalculator from '$components/rent-calculator/RentCalculator';
import RightSubtitle from '$components/content/RightSubtitle';
import {receiveInvoiceToCredit, receiveIsCreateInvoicePanelOpen, receiveIsCreditInvoicePanelOpen} from '$src/invoices/actions';
import {receiveCollapseStates} from '$src/leases/actions';
import {ViewModes} from '$src/enums';
import {getInvoiceToCredit} from '$src/invoices/selectors';
import {getCollapseStateByKey, getCurrentLease} from '$src/leases/selectors';

import type {Lease} from '$src/leases/types';

type Props = {
  currentLease: Lease,
  invoicesCollapseState: boolean,
  invoiceToCredit: ?string,
  isInvoicingEnabled: boolean,
  receiveCollapseStates: Function,
  receiveIsCreateInvoicePanelOpen: Function,
  receiveIsCreditInvoicePanelOpen: Function,
  receiveInvoiceToCredit: Function,
  rentCalculatorCollapseState: boolean,
}

class Invoices extends Component<Props> {
  creditPanel: any

  componentWillMount = () => {
    const {receiveInvoiceToCredit, receiveIsCreateInvoicePanelOpen, receiveIsCreditInvoicePanelOpen} = this.props;
    receiveIsCreateInvoicePanelOpen(false);
    receiveIsCreditInvoicePanelOpen(false);
    receiveInvoiceToCredit(null);
  }

  handleInvoicesCollapseToggle = (val: boolean) => {
    const {receiveCollapseStates} = this.props;

    receiveCollapseStates({
      [ViewModes.READONLY]: {
        invoices: {
          invoices: val,
        },
      },
    });
  };

  handleRentCalculatorCollapseToggle = (val: boolean) => {
    const {receiveCollapseStates} = this.props;

    receiveCollapseStates({
      [ViewModes.READONLY]: {
        invoices: {
          rent_calculator: val,
        },
      },
    });
  };

  handleInvoiceToCreditChange = (val: string) => {
    const {receiveInvoiceToCredit} = this.props;
    receiveInvoiceToCredit(val);
  };

  render() {
    const {
      invoicesCollapseState,
      invoiceToCredit,
      isInvoicingEnabled,
      rentCalculatorCollapseState,
    } = this.props;

    return (
      <div>
        <h2>Laskutus</h2>
        <RightSubtitle
          className='invoicing-status'
          text={isInvoicingEnabled
            ? <p className="success">Laskutus käynnissä</p>
            : <p className="alert">Laskutus ei käynnissä</p>
          }
        />
        <Divider />
        <Collapse
          defaultOpen={invoicesCollapseState !== undefined ? invoicesCollapseState : true}
          headerTitle={<h3 className='collapse__header-title'>Laskut</h3>}
          onToggle={this.handleInvoicesCollapseToggle}
        >
          <InvoicesTable
            invoiceToCredit={invoiceToCredit}
            onInvoiceToCreditChange={this.handleInvoiceToCreditChange}
          />

          <CreateAndCreditInvoiceComponent
            enableCreateInvoice={false}
            enableCreditInvoice={true}
            invoiceToCredit={invoiceToCredit}
          />
        </Collapse>
        <Collapse
          defaultOpen={rentCalculatorCollapseState !== undefined ? rentCalculatorCollapseState : true}
          headerTitle={<h3 className='collapse__header-title'>Vuokralaskuri</h3>}
          onToggle={this.handleRentCalculatorCollapseToggle}
        >
          <RentCalculator />
        </Collapse>

        <DebtCollection />
      </div>
    );
  }
}

export default connect(
  (state) => {
    const currentLease = getCurrentLease(state);
    return {
      currentLease: currentLease,
      invoicesCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.invoices.invoices`),
      invoiceToCredit: getInvoiceToCredit(state),
      isInvoicingEnabled: currentLease ? currentLease.is_invoicing_enabled : null,
      rentCalculatorCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.invoices.rent_calculator`),
    };
  },
  {
    receiveCollapseStates,
    receiveInvoiceToCredit,
    receiveIsCreateInvoicePanelOpen,
    receiveIsCreditInvoicePanelOpen,
  }
)(Invoices);
