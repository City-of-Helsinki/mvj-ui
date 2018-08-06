// @flow
import React, {Component} from 'react';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';

import AddInvoiceComponent from './AddInvoiceComponent';
import Collapse from '$components/collapse/Collapse';
import ConfirmationModal from '$components/modal/ConfirmationModal';
import Divider from '$components/content/Divider';
import InvoicesTableEdit from './InvoicesTableEdit';
import RentCalculator from '$components/rent-calculator/RentCalculator';
import RightSubtitle from '$components/content/RightSubtitle';
import {receiveCollapseStates, startInvoicing, stopInvoicing} from '$src/leases/actions';
import {creditInvoice, createInvoice, receiveIsCreateOpen} from '$src/invoices/actions';
import {creditInvoiceSet} from '$src/invoiceSets/actions';
import {ViewModes} from '$src/enums';
import {getNewInvoiceForDb} from '$src/invoices/helpers';
import {getIsCreateOpen} from '$src/invoices/selectors';
import {getCollapseStateByKey, getCurrentLease} from '$src/leases/selectors';

import type {Lease} from '$src/leases/types';

type Props = {
  createInvoice: Function,
  creditInvoice: Function,
  creditInvoiceSet: Function,
  currentLease: Lease,
  invoicesCollapseState: boolean,
  isCreateOpen: boolean,
  isInvoicingEnabled: boolean,
  params: Object,
  receiveCollapseStates: Function,
  receiveIsCreateOpen: Function,
  rentCalculatorCollapseState: boolean,
  startInvoicing: Function,
  stopInvoicing: Function,
}

type State = {
  isStartInvoicingModalOpen: boolean,
  isStopInvoicingModalOpen: boolean,
  selectedCreditItem: ?string,
  selectedDebtIndex: number,
  selectedDebtToDeleteIndex: number,
  showCreditPanel: boolean,
}

class InvoicesEdit extends Component<Props, State> {
  state = {
    isStartInvoicingModalOpen: false,
    isStopInvoicingModalOpen: false,
    selectedCreditItem: null,
    selectedDebtIndex: -1,
    selectedDebtToDeleteIndex: -1,
    showCreditPanel: false,
  }

  abnormalDebtTable: any

  componentWillMount = () => {
    const {receiveIsCreateOpen} = this.props;
    receiveIsCreateOpen(false);
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
      selectedDebtIndex: -1,
    });
  }

  createInvoice = (invoice: Object) => {
    const {
      createInvoice,
      params: {leaseId},
    } = this.props;

    invoice.lease = leaseId;
    invoice.billed_amount = invoice.total_amount;
    // invoice.state = InvoiceState.OPEN;

    createInvoice(getNewInvoiceForDb(invoice));
  }

  handleCreditItemChange = (val: string) => {
    this.setState({selectedCreditItem: val});
  }

  startInvoicing = () => {
    const {
      params: {leaseId},
      startInvoicing,
    } = this.props;

    this.hideModal('StartInvoicing');
    startInvoicing(leaseId);
  }

  stopInvoicing = () => {
    const {
      params: {leaseId},
      stopInvoicing,
    } = this.props;

    this.hideModal('StopInvoicing');
    stopInvoicing(leaseId);
  }

  handleInvoicesCollapseToggle = (val: boolean) => {
    const {receiveCollapseStates} = this.props;

    receiveCollapseStates({
      [ViewModes.EDIT]: {
        invoices: {
          invoices: val,
        },
      },
    });
  };

  handleRentCalculatorCollapseToggle = (val: boolean) => {
    const {receiveCollapseStates} = this.props;

    receiveCollapseStates({
      [ViewModes.EDIT]: {
        invoices: {
          rent_calculator: val,
        },
      },
    });
  };

  handleCreditButtonClick = () => {
    this.setState({showCreditPanel: true});
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
      currentLease,
      invoicesCollapseState,
      isCreateOpen,
      receiveIsCreateOpen,
      rentCalculatorCollapseState,
    } = this.props;
    const {
      isStartInvoicingModalOpen,
      isStopInvoicingModalOpen,
      showCreditPanel,
      selectedCreditItem,
    } = this.state;

    return (
      <div>
        <ConfirmationModal
          confirmButtonLabel='Käynnistä laskutus'
          isOpen={isStartInvoicingModalOpen}
          label='Haluatko varmasti käynnistää laskutuksen?'
          onCancel={() => this.hideModal('StartInvoicing')}
          onClose={() => this.hideModal('StartInvoicing')}
          onSave={this.startInvoicing}
          title='Käynnistä laskutus'
        />
        <ConfirmationModal
          confirmButtonLabel='Keskeytä laskutus'
          isOpen={isStopInvoicingModalOpen}
          label='Haluatko varmasti keskeyttää laskutuksen?'
          onCancel={() => this.hideModal('StopInvoicing')}
          onClose={() => this.hideModal('StopInvoicing')}
          onSave={this.stopInvoicing}
          title='Keskeytä laskutus'
        />

        <h2>Laskutus</h2>
        <RightSubtitle
          className='invoicing-status'
          text={currentLease.is_invoicing_enabled
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
          <InvoicesTableEdit
            onCreditItemChange={this.handleCreditItemChange}
            selectedCreditItem={selectedCreditItem}
          />

          <AddInvoiceComponent
            disableShowCreditButton={!selectedCreditItem}
            editMode={isCreateOpen}
            onAdd={() => receiveIsCreateOpen(true)}
            onClose={() => receiveIsCreateOpen(false)}
            onCloseCreditPanel={this.handleCloseCreditPanel}
            onCredit={this.handleCredit}
            onSave={this.createInvoice}
            onShowCreditPanel={this.handleCreditButtonClick}
            onStartInvoicing={() => this.showModal('StartInvoicing')}
            onStopInvoicing={() => this.showModal('StopInvoicing')}
            showCreditPanel={showCreditPanel}
            showStartInvoicingButton={!currentLease.is_invoicing_enabled}
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

export default flowRight(
  withRouter,
  connect(
    (state) => {
      return {
        currentLease: getCurrentLease(state),
        invoicesCollapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.invoices.invoices`),
        isCreateOpen: getIsCreateOpen(state),
        rentCalculatorCollapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.invoices.rent_calculator`),
      };
    },
    {
      createInvoice,
      creditInvoice,
      creditInvoiceSet,
      receiveCollapseStates,
      receiveIsCreateOpen,
      startInvoicing,
      stopInvoicing,
    }
  ),
)(InvoicesEdit);
