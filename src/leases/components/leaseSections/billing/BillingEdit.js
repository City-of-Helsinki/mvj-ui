// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {change, FormSection, formValueSelector, initialize, reduxForm} from 'redux-form';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';

import AbnormalDebtsTableEdit from './AbnormalDebtsTableEdit';
import AddBillEdit from './AddBillEdit';
import BillsTableEdit from './BillsTableEdit';
import ConfirmationModal from '$components/modal/ConfirmationModal';
import FormSectionContainer from '../../../../components/form/FormSection';
import {displayUIMessage} from '$util/helpers';
import {formatBillingNewBill} from '$src/leases/helpers';

type Props = {
  abnormalDebts: Array<Object>,
  billing: Object,
  bills: Array<Object>,
  dispatch: Function,
  handleSubmit: Function,
  newBill: Object,
}

type State = {
  isAddBillEditMode: boolean,
  isDeleteAbnormalDebtModalOpen: boolean,
  selectedDebtIndex: ?number,
}

class BillingEdit extends Component {
  props: Props

  state: State = {
    isAddBillEditMode: false,
    isDeleteAbnormalDebtModalOpen: false,
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

  deleteAbnormalDebt = () => {
    const {billing, dispatch} = this.props;
    const selectedDebtIndex = get(this.state, 'selectedDebtIndex', -1);
    const abnormalDebts = get(billing, 'abnormal_debts');

    if (abnormalDebts &&
      abnormalDebts.length > selectedDebtIndex &&
      selectedDebtIndex > -1) {
      abnormalDebts.splice(selectedDebtIndex, 1);
    }

    dispatch(change('billing-edit-form', `billing.abnormal_debts`, abnormalDebts));
    this.hideModal('DeleteAbnormalDebt');
    displayUIMessage({title: 'Poikkeva perintä poistettu', body: 'Poikkeava perintä on poistettu onnistuneesti'});
  }

  addAbnormalDebt = (bill: Object) => {
    const {abnormalDebts, dispatch} = this.props;
    if(abnormalDebts && abnormalDebts.length) {
      abnormalDebts.push(bill);

      dispatch(change('billing-edit-form', `billing.abnormal_debts`, abnormalDebts));
    } else {
      dispatch(change('billing-edit-form', `billing.abnormal_debts`, [bill]));
    }
  }

  addBill = (bill: Object) => {
    const {bills, dispatch} = this.props;
    if(bills && bills.length) {
      bills.push(bill);
      dispatch(change('billing-edit-form', `billing.bills`, bills));
    } else {
      dispatch(change('billing-edit-form', `billing.bills`, [bill]));
    }
  }

  saveNewBill = () => {
    const {newBill} = this.props;

    const tenant = get(newBill, 'tenant', {});
    tenant.bill_share = 50;
    tenant.firstname = 'Mikko';
    tenant.lastname = 'Koskinen';
    newBill.tenant = tenant;

    newBill.status = '0';

    const isAbnormalDebt = get(newBill, 'is_abnormal_debt', false);
    if(isAbnormalDebt) {
      this.addAbnormalDebt(formatBillingNewBill(newBill));
    } else {
      this.addBill(formatBillingNewBill(newBill));
    }
    displayUIMessage({title: 'Lasku tallennettu', body: 'Uusi lasku on tallennettu onnistuneesti'});
    this.setState({isAddBillEditMode: false});
  }

  hideAddBillEditMode = () => {
    this.setState({isAddBillEditMode: false});
  }

  showAddBillEditMode = () => {
    const {billing, dispatch} = this.props;
    billing.new_bill = {};
    // dispatch(destroy('billing-edit-form'));
    dispatch(initialize('billing-edit-form', {billing: billing}));
    this.setState({isAddBillEditMode: true});
  }

  render() {
    const {dispatch, handleSubmit} = this.props;
    const {isAddBillEditMode, isDeleteAbnormalDebtModalOpen} = this.state;

    return (
      <form onSubmit={handleSubmit}>
        <FormSectionContainer>
          <ConfirmationModal
            confirmButtonLabel='Poista'
            isOpen={isDeleteAbnormalDebtModalOpen}
            label='Haluatko varmasti poistaa poikkeavan perinnän?'
            onCancel={() => this.hideModal('DeleteAbnormalDebt')}
            onClose={() => this.hideModal('DeleteAbnormalDebt')}
            onSave={this.deleteAbnormalDebt}
            title='Poista poikkeava perintä'
          />
          <h2>Laskut</h2>
          <FormSection
            component={BillsTableEdit}
            dispatch={dispatch}
            name="billing"
          />

          <FormSection
            component={AddBillEdit}
            editMode={isAddBillEditMode}
            name='billing.new_bill'
            onAdd={() => this.showAddBillEditMode()}
            onClose={() => this.hideAddBillEditMode()}
            onSave={() => this.saveNewBill()}
          />

          <h2>Poikkeavat perinnät</h2>
          <FormSection
            name="billing"
            component={AbnormalDebtsTableEdit}
            dispatch={dispatch}
            headers={[
              'Vuokraaja',
              'Hallintaosuus',
              'Eräpäivä',
              'Määrä',
              'Aikaväli',
            ]}
            onDeleteClick={(index) => {
              this.setState({
                isDeleteAbnormalDebtModalOpen: true,
                selectedDebtIndex: index,
              });
            }}
          />
        </FormSectionContainer>
      </form>
    );
  }
}

const formName = 'billing-edit-form';
const selector = formValueSelector(formName);

export default flowRight(
  connect((state) => {
    return {
      abnormalDebts: selector(state, 'billing.abnormal_debts'),
      billing: selector(state, 'billing'),
      bills: selector(state, 'billing.bills'),
      newBill: selector(state, 'billing.new_bill'),
    };
  }),
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
    enableReinitialize: true,
    keepDirtyOnReinitialize: true,
  }),
)(BillingEdit);
