// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';

import AbnormalDebtsTableEdit from './AbnormalDebtsTableEdit';
import AddBillComponent from './AddBillComponent';
import BillsTableEdit from './BillsTableEdit';
import ConfirmationModal from '$components/modal/ConfirmationModal';
import Divider from '$components/content/Divider';
import RightSubtitle from '$components/content/RightSubtitle';
import {formatBillingNewBill} from '$src/leases/helpers';
import {
  createAbnormalDebt,
  createBill,
  deleteAbnormalDebt,
  startInvoicing,
  stopInvoicing,
} from './actions';

type Props = {
  billing: Object,
  createAbnormalDebt: Function,
  createBill: Function,
  deleteAbnormalDebt: Function,
  startInvoicing: Function,
  stopInvoicing: Function,
}

type State = {
  isAddBillEditMode: boolean,
  isDeleteAbnormalDebtModalOpen: boolean,
  isStartInvoicingModalOpen: boolean,
  isStopInvoicingModalOpen: boolean,
  selectedDebtIndex: number,
  selectedDebtToDeleteIndex: number,
}

class BillingEdit extends Component {
  props: Props

  state: State = {
    isAddBillEditMode: false,
    isDeleteAbnormalDebtModalOpen: false,
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

  deleteAbnormalDebt = () => {
    const {deleteAbnormalDebt} = this.props;
    const {selectedDebtToDeleteIndex} = this.state;
    deleteAbnormalDebt(selectedDebtToDeleteIndex);
    this.setState({
      isDeleteAbnormalDebtModalOpen: false,
      selectedDebtToDeleteIndex: -1,
    });
    this.abnormalDebtTable.getWrappedInstance().onDeleteCallBack(selectedDebtToDeleteIndex);
  }

  startBilling = () => {
    const {startInvoicing} = this.props;
    this.hideModal('StartInvoicing');
    startInvoicing();
  }

  stopBilling = () => {
    const {stopInvoicing} = this.props;
    this.hideModal('StopInvoicing');
    stopInvoicing();
  }

  render() {
    const {
      billing,
    } = this.props;
    const {
      isAddBillEditMode,
      isStartInvoicingModalOpen,
      isStopInvoicingModalOpen,
      isDeleteAbnormalDebtModalOpen,
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
        <ConfirmationModal
          confirmButtonLabel='Poista'
          isOpen={isDeleteAbnormalDebtModalOpen}
          label='Haluatko varmasti poistaa poikkeavan perinnän?'
          onCancel={() => this.hideModal('DeleteAbnormalDebt')}
          onClose={() => this.hideModal('DeleteAbnormalDebt')}
          onSave={this.deleteAbnormalDebt}
          title='Poista poikkeava perintä'
        />

        <h2>Laskutus</h2>
        <RightSubtitle
          className='invoicing-status'
          text={billing.invoicing_started
            ? <p className="success">Laskutus käynnissä<i /></p>
            : <p className="alert">Laskutus ei käynnissä<i /></p>
          }
        />
        <Divider />

        <h3>Laskut</h3>
        <BillsTableEdit
          bills={get(billing, 'bills', [])}
        />

        <AddBillComponent
          editMode={isAddBillEditMode}
          onAdd={() => this.showAddBillEditMode()}
          onClose={() => this.hideAddBillEditMode()}
          onSave={(bill) => this.saveNewBill(bill)}
          onStartInvoicing={() => this.showModal('StartInvoicing')}
          onStopInvoicing={() => this.showModal('StopInvoicing')}
          showStartInvoicingButton={!get(billing, 'invoicing_started', false)}
        />

        <h3>Poikkeavat perinnät</h3>
        <AbnormalDebtsTableEdit
          ref={(input) => this.abnormalDebtTable = input}
          abnormalDebts={get(billing, 'abnormal_debts', [])}
          headers={[
            'Vuokraaja',
            'Hallintaosuus',
            'Eräpäivä',
            'Määrä',
            'Aikaväli',
          ]}
          onDeleteClick={(index) => this.setState({
            isDeleteAbnormalDebtModalOpen: true,
            selectedDebtToDeleteIndex: index,
          })}
        />
      </div>
    );
  }
}

export default flowRight(
  connect(
    null,
    {
      createAbnormalDebt,
      createBill,
      deleteAbnormalDebt,
      startInvoicing,
      stopInvoicing,
    }
  ),
)(BillingEdit);
