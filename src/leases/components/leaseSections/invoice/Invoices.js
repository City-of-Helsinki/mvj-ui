// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';

import Collapse from '$components/collapse/Collapse';
import Divider from '$components/content/Divider';
import InvoicesTable from './InvoicesTable';
import CreateAndCreditInvoiceComponent from './CreateAndCreditInvoiceComponent';
import RentCalculator from '$components/rent-calculator/RentCalculator';
import RightSubtitle from '$components/content/RightSubtitle';
import {receiveIsCreateInvoicePanelOpen, receiveIsCreditInvoicePanelOpen} from '$src/invoices/actions';
import {receiveCollapseStates} from '$src/leases/actions';
import {ViewModes} from '$src/enums';
import {getCollapseStateByKey, getCurrentLease} from '$src/leases/selectors';

import type {Lease} from '$src/leases/types';

type Props = {
  currentLease: Lease,
  invoicesCollapseState: boolean,
  isInvoicingEnabled: boolean,
  receiveCollapseStates: Function,
  receiveIsCreateInvoicePanelOpen: Function,
  receiveIsCreditInvoicePanelOpen: Function,
  rentCalculatorCollapseState: boolean,
}

type State = {
  selectedCreditItem: ?string,
}

class Invoices extends Component<Props, State> {
  creditPanel: any

  state = {
    selectedCreditItem: null,
    showCreditPanel: false,
  }

  componentWillMount = () => {
    const {receiveIsCreateInvoicePanelOpen, receiveIsCreditInvoicePanelOpen} = this.props;
    receiveIsCreateInvoicePanelOpen(false);
    receiveIsCreditInvoicePanelOpen(false);
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

  handleCreditItemChange = (val: string) => {
    this.setState({selectedCreditItem: val});
  }

  render() {
    const {
      invoicesCollapseState,
      isInvoicingEnabled,
      rentCalculatorCollapseState,
    } = this.props;

    const {selectedCreditItem} = this.state;

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
            onCreditItemChange={this.handleCreditItemChange}
            selectedCreditItem={selectedCreditItem}
          />

          <CreateAndCreditInvoiceComponent
            enableCreateInvoice={false}
            enableCreditInvoice={true}
            selectedCreditInvoice={selectedCreditItem}
          />
        </Collapse>
        <Collapse
          defaultOpen={rentCalculatorCollapseState !== undefined ? rentCalculatorCollapseState : true}
          headerTitle={<h3 className='collapse__header-title'>Vuokralaskuri</h3>}
          onToggle={this.handleRentCalculatorCollapseToggle}
        >
          <RentCalculator />
        </Collapse>
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
      isInvoicingEnabled: currentLease ? currentLease.is_invoicing_enabled : null,
      rentCalculatorCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.invoices.rent_calculator`),
    };
  },
  {
    receiveCollapseStates,
    receiveIsCreateInvoicePanelOpen,
    receiveIsCreditInvoicePanelOpen,
  }
)(Invoices);
