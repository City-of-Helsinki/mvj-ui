// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';

import Button from '$components/button/Button';
import Collapse from '$components/collapse/Collapse';
import ConfirmationModal from '$components/modal/ConfirmationModal';
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

type State = {
  isStartInvoicingModalOpen: boolean,
  isStopInvoicingModalOpen: boolean,
}

class Invoices extends Component<Props, State> {
  creditPanel: any

  state = {
    isStartInvoicingModalOpen: false,
    isStopInvoicingModalOpen: false,
  }

  componentDidMount = () => {
    const {receiveInvoiceToCredit, receiveIsCreateInvoicePanelOpen, receiveIsCreditInvoicePanelOpen} = this.props;
    receiveIsCreateInvoicePanelOpen(false);
    receiveIsCreditInvoicePanelOpen(false);
    receiveInvoiceToCredit(null);
  }

  showModal = (modalName: string) => {
    const modalVisibilityKey = `is${modalName}ModalOpen`;
    this.setState({
      [modalVisibilityKey]: true,
    });
  }

  hideModal = (modalName: string) => {
    const modalVisibilityKey = `is${modalName}ModalOpen`;
    this.setState({
      [modalVisibilityKey]: false,
    });
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

  handleStartInvoicingButtonClick = () => {
    this.showModal('StartInvoicing');
  }

  handleStartInvoicingCancelButtonClick = () => {
    this.hideModal('StartInvoicing');
  }

  handleStopInvoicingButtonClick = () => {
    this.showModal('StopInvoicing');
  }

  handleStopInvoicingCancelButtonClick = () => {
    this.hideModal('StopInvoicing');
  }

  startInvoicing = () => {
    const {currentLease, startInvoicing} = this.props;

    this.hideModal('StartInvoicing');
    startInvoicing(currentLease.id);
  }

  stopInvoicing = () => {
    const {currentLease, stopInvoicing} = this.props;

    this.hideModal('StopInvoicing');
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
    const {
      isStartInvoicingModalOpen,
      isStopInvoicingModalOpen,
    } = this.state;

    return (
      <div>
        <ConfirmationModal
          confirmButtonLabel='Käynnistä laskutus'
          isOpen={isStartInvoicingModalOpen}
          label='Haluatko varmasti käynnistää laskutuksen?'
          onCancel={this.handleStartInvoicingCancelButtonClick}
          onClose={this.handleStartInvoicingCancelButtonClick}
          onSave={this.startInvoicing}
          title='Käynnistä laskutus'
        />
        <ConfirmationModal
          confirmButtonLabel='Keskeytä laskutus'
          isOpen={isStopInvoicingModalOpen}
          label='Haluatko varmasti keskeyttää laskutuksen?'
          onCancel={this.handleStopInvoicingCancelButtonClick}
          onClose={this.handleStopInvoicingCancelButtonClick}
          onSave={this.stopInvoicing}
          title='Keskeytä laskutus'
        />

        <h2>Laskutus</h2>
        {isEditMode
          ? <RightSubtitle
            buttonComponent={isInvoicingEnabled
              ? <Button
                className='button-red'
                onClick={this.handleStopInvoicingButtonClick}
                text='Keskeytä laskutus'
              />
              : <Button
                className='button-green'
                onClick={this.handleStartInvoicingButtonClick}
                text='Käynnistä laskutus'
              />
            }
            className='invoicing-status'
            text={isInvoicingEnabled
              ? <p className="success">Laskutus käynnissä</p>
              : <p className="alert">Laskutus ei käynnissä</p>
            }
          />

          : <RightSubtitle
            className='invoicing-status'
            text={isInvoicingEnabled
              ? <p className="success">Laskutus käynnissä</p>
              : <p className="alert">Laskutus ei käynnissä</p>
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
          defaultOpen={rentCalculatorCollapseState !== undefined ? rentCalculatorCollapseState : true}
          headerTitle={<h3 className='collapse__header-title'>Vuokralaskuri</h3>}
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
