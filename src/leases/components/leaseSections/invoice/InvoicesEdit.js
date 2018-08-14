// @flow
import React, {Component} from 'react';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';

import CreateAndCreditInvoiceComponent from './CreateAndCreditInvoiceComponent';
import Button from '$components/button/Button';
import Collapse from '$components/collapse/Collapse';
import ConfirmationModal from '$components/modal/ConfirmationModal';
import Divider from '$components/content/Divider';
import InvoicesTableEdit from './InvoicesTableEdit';
import RentCalculator from '$components/rent-calculator/RentCalculator';
import RightSubtitle from '$components/content/RightSubtitle';
import {receiveCollapseStates, startInvoicing, stopInvoicing} from '$src/leases/actions';
import {receiveInvoiceToCredit, receiveIsCreateInvoicePanelOpen, receiveIsCreditInvoicePanelOpen} from '$src/invoices/actions';
import {ViewModes} from '$src/enums';
import {getInvoiceToCredit} from '$src/invoices/selectors';
import {getCollapseStateByKey, getCurrentLease} from '$src/leases/selectors';

import type {Lease} from '$src/leases/types';

type Props = {
  currentLease: Lease,
  invoicesCollapseState: boolean,
  invoiceToCredit: ?string,
  isInvoicingEnabled: boolean,
  params: Object,
  receiveCollapseStates: Function,
  receiveInvoiceToCredit: Function,
  receiveIsCreateInvoicePanelOpen: Function,
  receiveIsCreditInvoicePanelOpen: Function,
  rentCalculatorCollapseState: boolean,
  startInvoicing: Function,
  stopInvoicing: Function,
}

type State = {
  isStartInvoicingModalOpen: boolean,
  isStopInvoicingModalOpen: boolean,
}

class InvoicesEdit extends Component<Props, State> {
  state = {
    isStartInvoicingModalOpen: false,
    isStopInvoicingModalOpen: false,
  }

  abnormalDebtTable: any

  componentWillMount = () => {
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

  handleInvoiceToCreditChange = (val: string) => {
    const {receiveInvoiceToCredit} = this.props;
    receiveInvoiceToCredit(val);
  }

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

  render() {
    const {
      currentLease,
      invoicesCollapseState,
      invoiceToCredit,
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

        <RightSubtitle
          buttonComponent={
            currentLease.is_invoicing_enabled
              ? <Button
                className='button-red'
                label='Keskeytä laskutus'
                onClick={this.handleStopInvoicingButtonClick}
                title='Keskeytä laskutus'
              />
              : <Button
                className='button-green'
                label='Käynnistä laskutus'
                onClick={this.handleStartInvoicingButtonClick}
                title='Käynnistä laskutus'
              />
          }
          className='invoicing-status'
          text={currentLease.is_invoicing_enabled
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
          <InvoicesTableEdit
            invoiceToCredit={invoiceToCredit}
            onInvoiceToCreditChange={this.handleInvoiceToCreditChange}
          />
          <CreateAndCreditInvoiceComponent
            enableCreateInvoice={true}
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
        invoiceToCredit: getInvoiceToCredit(state),
        rentCalculatorCollapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.invoices.rent_calculator`),
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
  ),
)(InvoicesEdit);
