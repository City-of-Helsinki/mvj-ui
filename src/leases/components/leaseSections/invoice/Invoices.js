// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import scrollToComponent from 'react-scroll-to-component';
import {Row, Column} from 'react-foundation';

import Button from '$components/button/Button';
import Collapse from '$components/collapse/Collapse';
import Divider from '$components/content/Divider';
import InvoicesTable from './InvoicesTable';
import CreditInvoiceForm from './forms/CreditInvoiceForm';
import RentCalculator from '$components/rent-calculator/RentCalculator';
import RightSubtitle from '$components/content/RightSubtitle';
import {creditInvoice} from '$src/invoices/actions';
import {creditInvoiceSet} from '$src/invoiceSets/actions';
import {receiveCollapseStates} from '$src/leases/actions';
import {ViewModes} from '$src/enums';
import {getCollapseStateByKey, getCurrentLease} from '$src/leases/selectors';

import type {Lease} from '$src/leases/types';

type Props = {
  creditInvoice: Function,
  creditInvoiceSet: Function,
  currentLease: Lease,
  invoicesCollapseState: boolean,
  isInvoicingEnabled: boolean,
  receiveCollapseStates: Function,
  rentCalculatorCollapseState: boolean,
}

type State = {
  selectedCreditItem: ?string,
  showCreditPanel: boolean,
}

class Invoices extends Component<Props, State> {
  creditPanel: any

  state = {
    selectedCreditItem: null,
    showCreditPanel: false,
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

  handleCreditButtonClick = () => {
    this.setState({showCreditPanel: true});

    setTimeout(() => {
      scrollToComponent(this.creditPanel, {
        offset: -70,
        align: 'top',
        duration: 450,
      });
    }, 50);
  }

  handleCloseCreditPanel = () => {
    this.setState({showCreditPanel: false});
  }

  handleCredit = (invoice: Object) => {
    const {currentLease} = this.props,
      {selectedCreditItem} = this.state,
      parts = selectedCreditItem ? selectedCreditItem.split('_') : [];

    if(parts[0] === 'invoice') {
      const {creditInvoice} = this.props;

      creditInvoice({
        creditData: invoice,
        invoiceId: parts[1],
        lease: currentLease.id,
      });
    } else {
      const {creditInvoiceSet} = this.props;

      creditInvoiceSet({
        creditData: invoice,
        invoiceSetId: parts[1],
        lease: currentLease.id,
      });
    }
  }

  render() {
    const {
      invoicesCollapseState,
      isInvoicingEnabled,
      rentCalculatorCollapseState,
    } = this.props;

    const {selectedCreditItem, showCreditPanel} = this.state;

    return (
      <div>
        <h2>Laskutus</h2>
        <RightSubtitle
          className='invoicing-status'
          text={isInvoicingEnabled
            ? <p className="success">Laskutus käynnissä<i /></p>
            : <p className="alert">Laskutus ei käynnissä<i /></p>
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
          <Row>
            <Column>
              <Button
                className='button-green no-margin'
                disabled={!selectedCreditItem}
                label='Hyvitä'
                onClick={this.handleCreditButtonClick}
                title='Hyvitä'
              />
            </Column>
          </Row>
          <div ref={(ref) => this.creditPanel = ref}>
            {showCreditPanel &&
              <CreditInvoiceForm
                onClose={this.handleCloseCreditPanel}
                onSave={this.handleCredit}
              />
            }
          </div>

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
    creditInvoice,
    creditInvoiceSet,
    receiveCollapseStates,
  }
)(Invoices);
