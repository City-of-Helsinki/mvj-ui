// @flow
import React, {Component} from 'react';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';

import AddBillComponent from './AddBillComponent';
import Collapse from '$components/collapse/Collapse';
import ConfirmationModal from '$components/modal/ConfirmationModal';
import Divider from '$components/content/Divider';
import InvoicesTableEdit from './InvoicesTableEdit';
import RightSubtitle from '$components/content/RightSubtitle';
import {formatBillingNewBill} from '$src/leases/helpers';
import {
  createBill,
} from './actions';
import {
  startInvoicing,
  stopInvoicing,
} from '$src/leases/actions';

import type {Attributes as InvoiceAttributes, InvoiceList} from '$src/invoices/types';

type Props = {
  createAbnormalDebt: Function,
  createBill: Function,
  deleteAbnormalDebt: Function,
  invoiceAttributes: InvoiceAttributes,
  invoices: InvoiceList,
  isInvoicingEnabled: boolean,
  params: Object,
  startInvoicing: Function,
  stopInvoicing: Function,
}

type State = {
  isAddBillEditMode: boolean,
  isStartInvoicingModalOpen: boolean,
  isStopInvoicingModalOpen: boolean,
  selectedDebtIndex: number,
  selectedDebtToDeleteIndex: number,
}

class BillingEdit extends Component {
  props: Props

  state: State = {
    isAddBillEditMode: false,
    isStartInvoicingModalOpen: false,
    isStopInvoicingModalOpen: false,
    selectedDebtIndex: -1,
    selectedDebtToDeleteIndex: -1,
  }

  abnormalDebtTable: any

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

  saveNewBill = (bill: Object) => {
    const {createAbnormalDebt, createBill} = this.props;
    const tenant = {};
    tenant.bill_share = 50;
    tenant.firstname = 'Mikko';
    tenant.lastname = 'Koskinen';
    bill.tenant = tenant;
    bill.status = '0';
    if(bill.is_abnormal_debt) {
      createAbnormalDebt(formatBillingNewBill(bill));
    } else {
      createBill(formatBillingNewBill(bill));
    }
    this.setState({isAddBillEditMode: false});
  }

  hideAddBillEditMode = () => {
    this.setState({isAddBillEditMode: false});
  }

  showAddBillEditMode = () => {
    this.setState({isAddBillEditMode: true});
  }

  startBilling = () => {
    const {
      params: {leaseId},
      startInvoicing,
    } = this.props;

    this.hideModal('StartInvoicing');
    startInvoicing(leaseId);
  }

  stopBilling = () => {
    const {
      params: {leaseId},
      stopInvoicing,
    } = this.props;

    this.hideModal('StopInvoicing');
    stopInvoicing(leaseId);
  }

  render() {
    const {
      invoiceAttributes,
      invoices,
      isInvoicingEnabled,
    } = this.props;
    const {
      isAddBillEditMode,
      isStartInvoicingModalOpen,
      isStopInvoicingModalOpen,
    } = this.state;

    return (
      <div>
        <ConfirmationModal
          confirmButtonLabel='Käynnistä laskutus'
          isOpen={isStartInvoicingModalOpen}
          label='Haluatko varmasti käynnistää laskutuksen?'
          onCancel={() => this.hideModal('StartInvoicing')}
          onClose={() => this.hideModal('StartInvoicing')}
          onSave={this.startBilling}
          title='Käynnistä laskutus'
        />
        <ConfirmationModal
          confirmButtonLabel='Keskeytä laskutus'
          isOpen={isStopInvoicingModalOpen}
          label='Haluatko varmasti keskeyttää laskutuksen?'
          onCancel={() => this.hideModal('StopInvoicing')}
          onClose={() => this.hideModal('StopInvoicing')}
          onSave={this.stopBilling}
          title='Keskeytä laskutus'
        />

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
          defaultOpen={true}
          headerTitle={
            <h3 className='collapse__header-title'>Laskut</h3>
          }>
          <InvoicesTableEdit
            invoiceAttributes={invoiceAttributes}
            invoices={invoices}
          />

          <AddBillComponent
            editMode={isAddBillEditMode}
            onAdd={() => this.showAddBillEditMode()}
            onClose={() => this.hideAddBillEditMode()}
            onSave={(bill) => this.saveNewBill(bill)}
            onStartInvoicing={() => this.showModal('StartInvoicing')}
            onStopInvoicing={() => this.showModal('StopInvoicing')}
            showStartInvoicingButton={!isInvoicingEnabled}
          />
        </Collapse>
      </div>
    );
  }
}

export default flowRight(
  withRouter,
  connect(
    null,
    {
      createBill,
      startInvoicing,
      stopInvoicing,
    }
  ),
)(BillingEdit);
