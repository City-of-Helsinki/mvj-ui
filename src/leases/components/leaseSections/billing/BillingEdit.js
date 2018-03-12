// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
// import {change, FormSection, formValueSelector, initialize, reduxForm} from 'redux-form';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';

import AbnormalDebtsTableEdit from './AbnormalDebtsTableEdit';
import AddBillComponent from './AddBillComponent';
import BillsTableEdit from './BillsTableEdit';
import ConfirmationModal from '$components/modal/ConfirmationModal';
import Divider from '$components/content/Divider';
// import FormSectionContainer from '../../../../components/form/FormSection';
import RightSubtitle from '$components/content/RightSubtitle';
// import {displayUIMessage} from '$util/helpers';
import {formatBillingNewBill} from '$src/leases/helpers';
import {
  createAbnormalDebt,
  createBill,
  startInvoicing,
  stopInvoicing,
} from './actions';

type Props = {
  // abnormalDebts: Array<Object>,
  billing: Object,
  createAbnormalDebt: Function,
  createBill: Function,
  dispatch: Function,
  // bills: Array<Object>,
  // handleSubmit: Function,
  // newBill: Object,
  startInvoicing: Function,
  stopInvoicing: Function,
}

type State = {
  isAddBillEditMode: boolean,
  isDeleteAbnormalDebtModalOpen: boolean,
  isStartInvoicingModalOpen: boolean,
  isStopInvoicingModalOpen: boolean,
  selectedDebtIndex: ?number,
}

class BillingEdit extends Component {
  props: Props

  state: State = {
    isAddBillEditMode: false,
    isDeleteAbnormalDebtModalOpen: false,
    isStartInvoicingModalOpen: false,
    isStopInvoicingModalOpen: false,
    selectedDebtIndex: null,
  }

  addBillComponent: any

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
      selectedDebtIndex: null,
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

  // deleteAbnormalDebt = () => {
  //   const {billing, dispatch} = this.props;
  //   const selectedDebtIndex = get(this.state, 'selectedDebtIndex', -1);
  //   const abnormalDebts = get(billing, 'abnormal_debts');
  //
  //   if (abnormalDebts &&
  //     abnormalDebts.length > selectedDebtIndex &&
  //     selectedDebtIndex > -1) {
  //     abnormalDebts.splice(selectedDebtIndex, 1);
  //   }
  //
  //   dispatch(change('billing-edit-form', `billing.abnormal_debts`, abnormalDebts));
  //   this.hideModal('DeleteAbnormalDebt');
  //   displayUIMessage({title: 'Poikkeva perintä poistettu', body: 'Poikkeava perintä on poistettu onnistuneesti'});
  // }
  //
  //

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
      // isDeleteAbnormalDebtModalOpen,
    } = this.state;
    console.log(get(billing, 'abnormal_debts', []));
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
        <h1>Laskutus</h1>
        <RightSubtitle
          className='invoicing-status'
          text={billing.invoicing_started
            ? <p className="success">Laskutus käynnissä<i /></p>
            : <p className="alert">Laskutus ei käynnissä<i /></p>
          }
        />
        <Divider />

        <h2>Laskut</h2>
        <BillsTableEdit
          bills={get(billing, 'bills', [])}
        />

        <AddBillComponent
          editMode={isAddBillEditMode}
          name='billing.new_bill'
          onAdd={() => this.showAddBillEditMode()}
          onClose={() => this.hideAddBillEditMode()}
          onSave={(bill) => this.saveNewBill(bill)}
          onStartInvoicing={() => this.showModal('StartInvoicing')}
          onStopInvoicing={() => this.showModal('StopInvoicing')}
          showStartInvoicingButton={!get(billing, 'invoicing_started', false)}
        />

        <h2>Poikkeavat perinnät</h2>
        <AbnormalDebtsTableEdit
          abnormalDebts={get(billing, 'abnormal_debts', [])}
          headers={[
            'Vuokraaja',
            'Hallintaosuus',
            'Eräpäivä',
            'Määrä',
            'Aikaväli',
          ]}
          onDeleteClick={() => console.log('delete')}
        />
      </div>
        //       onDeleteClick={(index) => {
        //         this.setState({
        //           isDeleteAbnormalDebtModalOpen: true,
        //           selectedDebtIndex: index,
        //         });
        //       }}
        //     />
        //   </FormSectionContainer>
      // <form onSubmit={handleSubmit}>
      //   <FormSectionContainer>
      //     <ConfirmationModal
      //       confirmButtonLabel='Poista'
      //       isOpen={isDeleteAbnormalDebtModalOpen}
      //       label='Haluatko varmasti poistaa poikkeavan perinnän?'
      //       onCancel={() => this.hideModal('DeleteAbnormalDebt')}
      //       onClose={() => this.hideModal('DeleteAbnormalDebt')}
      //       onSave={this.deleteAbnormalDebt}
      //       title='Poista poikkeava perintä'
      //     />
      //
      //   </FormSectionContainer>
      // </form>
    );
  }
}

export default flowRight(
  connect(
    null,
    {
      createAbnormalDebt,
      createBill,
      startInvoicing,
      stopInvoicing,
    }
  ),
)(BillingEdit);

// const formName = 'billing-edit-form';
// const selector = formValueSelector(formName);
//
// export default flowRight(
//   connect(
//     (state) => {
//       return {
//         abnormalDebts: selector(state, 'billing.abnormal_debts'),
//         billing: selector(state, 'billing'),
//         bills: selector(state, 'billing.bills'),
//         newBill: selector(state, 'billing.new_bill'),
//       };
//     },
//     {
//       startInvoicing,
//       stopInvoicing,
//     }
//   ),
//   reduxForm({
//     form: formName,
//     destroyOnUnmount: false,
//     enableReinitialize: true,
//     keepDirtyOnReinitialize: true,
//   }),
// )(BillingEdit);
