// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import Button from '$components/button/Button';
import Collapse from '$components/collapse/Collapse';
import DebtCollection from './DebtCollection';
import Divider from '$components/content/Divider';
import InvoiceSimulator from '$components/invoice-simulator/InvoiceSimulator';
import CreateAndCreditInvoice from './CreateAndCreditInvoice';
import CreateCollectionLetter from './CreateCollectionLetter';
import RentCalculator from '$components/rent-calculator/RentCalculator';
import RightSubtitle from '$components/content/RightSubtitle';
import InvoiceTableAndPanel from './InvoiceTableAndPanel';
import {receiveInvoiceToCredit, receiveIsCreateInvoicePanelOpen, receiveIsCreditInvoicePanelOpen} from '$src/invoices/actions';
import {receiveCollapseStates, startInvoicing, stopInvoicing} from '$src/leases/actions';
import {ViewModes} from '$src/enums';
import {getInvoiceToCredit} from '$src/invoices/selectors';
import {getCollapseStateByKey, getCurrentLease, getIsEditMode} from '$src/leases/selectors';

import type {Lease} from '$src/leases/types';

type Props = {
  currentLease: Lease,
  invoicesCollapseState: boolean,
  invoiceToCredit: ?string,
  isEditMode: boolean,
  isInvoicingEnabled: boolean,
  previewInvoicesCollapseState: boolean,
  receiveCollapseStates: Function,
  receiveIsCreateInvoicePanelOpen: Function,
  receiveIsCreditInvoicePanelOpen: Function,
  receiveInvoiceToCredit: Function,
  rentCalculatorCollapseState: boolean,
  startInvoicing: Function,
  stopInvoicing: Function,
}

class Invoices extends Component<Props> {
  creditPanel: any

  componentDidMount = () => {
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

  handlePreviewInvoicesCollapseToggle = (val: boolean) => {
    const {receiveCollapseStates} = this.props;

    receiveCollapseStates({
      [ViewModes.READONLY]: {
        invoices: {
          preview_invoices: val,
        },
      },
    });
  };

  handleInvoiceToCreditChange = (val: string) => {
    const {receiveInvoiceToCredit} = this.props;
    receiveInvoiceToCredit(val);
  };

  startInvoicing = () => {
    const {currentLease, startInvoicing} = this.props;

    startInvoicing(currentLease.id);
  }

  stopInvoicing = () => {
    const {currentLease, stopInvoicing} = this.props;

    stopInvoicing(currentLease.id);
  }

  render() {
    const {
      invoicesCollapseState,
      invoiceToCredit,
      isEditMode,
      isInvoicingEnabled,
      previewInvoicesCollapseState,
      rentCalculatorCollapseState,
    } = this.props;

    return (
      <AppConsumer>
        {({
          dispatch,
        }) => {
          const handleStartInvoicing = () => {
            dispatch({
              type: ActionTypes.SHOW_CONFIRMATION_MODAL,
              confirmationFunction: () => {
                this.startInvoicing();
              },
              confirmationModalButtonText: 'Käynnistä laskutus',
              confirmationModalLabel: 'Haluatko varmasti käynnistää laskutuksen?',
              confirmationModalTitle: 'Käynnistä laskutus',
            });
          };

          const handleStopInvoicing = () => {
            dispatch({
              type: ActionTypes.SHOW_CONFIRMATION_MODAL,
              confirmationFunction: () => {
                this.stopInvoicing();
              },
              confirmationModalButtonText: 'Keskeytä laskutus',
              confirmationModalLabel: 'Haluatko varmasti keskeyttää laskutuksen?',
              confirmationModalTitle: 'Keskeytä laskutus',
            });
          };

          return(
            <div>
              <h2>Laskutus</h2>
              {isEditMode
                ? <RightSubtitle
                  buttonComponent={isInvoicingEnabled
                    ? <Button
                      className='button-red'
                      onClick={handleStopInvoicing}
                      text='Keskeytä laskutus'
                    />
                    : <Button
                      className='button-green'
                      onClick={handleStartInvoicing}
                      text='Käynnistä laskutus'
                    />
                  }
                  text={isInvoicingEnabled
                    ? <span className="success">Laskutus käynnissä<i/></span>
                    : <span className="alert">Laskutus keskeytetty<i/></span>
                  }
                />
                : <RightSubtitle
                  text={isInvoicingEnabled
                    ? <span className="success">Laskutus käynnissä <i/></span>
                    : <span className="alert">Laskutus keskeytetty<i/></span>
                  }
                />
              }

              <Divider />
              <Collapse
                defaultOpen={invoicesCollapseState !== undefined ? invoicesCollapseState : true}
                headerTitle={<h3 className='collapse__header-title'>Laskut</h3>}
                onToggle={this.handleInvoicesCollapseToggle}
              >
                <InvoiceTableAndPanel
                  invoiceToCredit={invoiceToCredit}
                  onInvoiceToCreditChange={this.handleInvoiceToCreditChange}
                />
                <CreateAndCreditInvoice
                  enableCreateInvoice={isEditMode}
                  enableCreditInvoice={true}
                  invoiceToCredit={invoiceToCredit}
                />
              </Collapse>
              <Collapse
                defaultOpen={rentCalculatorCollapseState !== undefined ? rentCalculatorCollapseState : false}
                headerTitle={<h3 className='collapse__header-title'>Vuokralaskelma</h3>}
                onToggle={this.handleRentCalculatorCollapseToggle}
              >
                <RentCalculator />
              </Collapse>
              <Collapse
                defaultOpen={previewInvoicesCollapseState !== undefined ? previewInvoicesCollapseState : true}
                headerTitle={<h3 className='collapse__header-title'>Laskujen esikatselu</h3>}
                onToggle={this.handlePreviewInvoicesCollapseToggle}
              >
                <InvoiceSimulator />
              </Collapse>

              <h2>Perintä</h2>
              <Divider />
              <DebtCollection />
              <CreateCollectionLetter />
            </div>
          );
        }}
      </AppConsumer>
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
      isEditMode: getIsEditMode(state),
      isInvoicingEnabled: currentLease ? currentLease.is_invoicing_enabled : null,
      previewInvoicesCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.invoices.preview_invoices`),
      rentCalculatorCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.invoices.rent_calculator`),
    };
  },
  {
    receiveCollapseStates,
    receiveInvoiceToCredit,
    receiveIsCreateInvoicePanelOpen,
    receiveIsCreditInvoicePanelOpen,
    startInvoicing,
    stopInvoicing,
  }
)(Invoices);
