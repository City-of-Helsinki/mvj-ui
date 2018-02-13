// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {change, Field, FormSection, formValueSelector, reduxForm} from 'redux-form';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import {Row, Column} from 'react-foundation';

import AbnormalDebtsEdit from './AbnormalDebtsEdit';
import AddBillEdit from './AddBillEdit';
import BillsTableEdit from './BillsTableEdit';
import ConfirmationModal from '../../../../components/ConfirmationModal';
import FieldTypeSwitch from '../../../../components/form/FieldTypeSwitch';
import {displayUIMessage} from '../../../../util/helpers';
import {formatBillingBillDb, formatBillingNewBill} from '../../../helpers';

type Props = {
  billing: Object,
  dispatch: Function,
  handleSubmit: Function,
}

type State = {
  addBillMode: boolean,
  isDeleteAbnormalDebtModalOpen: boolean,
  selectedDebtIndex: ?number,
}

class BillingEdit extends Component {
  props: Props

  state: State = {
    addBillMode: false,
    isDeleteAbnormalDebtModalOpen: false,
    selectedDebtIndex: null,
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
    const {billing, dispatch} = this.props;
    const abnormalDebts = get(billing, 'abnormal_debts', []);
    abnormalDebts.push(bill);

    dispatch(change('billing-edit-form', `billing.abnormal_debts`, abnormalDebts));
  }

  addBill = (bill: Object) => {
    const {billing, dispatch} = this.props;
    const bills = get(billing, 'bills', []);
    bills.push(bill);

    dispatch(change('billing-edit-form', `billing.bills`, bills));
  }

  saveBill = (bill: Object, index: number) => {
    const {billing, dispatch} = this.props;
    const bills = get(billing, 'bills', []);
    if(bills && bills.length > index) {
      bills[index] = formatBillingBillDb(bill);
    }
    dispatch(change('billing-edit-form', `billing.bills`, bills));
    displayUIMessage({title: 'Lasku tallennettu', body: 'Lasku on tallennettu onnistuneesti'});
  }

  saveNewBill = () => {
    const {billing} = this.props;
    const newBill = get(billing, 'new_bill', {});
    const isAbnormalDebt = get(newBill, 'is_abnormal_debt', false);

    const tenant = get(newBill, 'tenant', {});
    tenant.bill_share = 50;
    tenant.firstname = 'Mikko';
    tenant.lastname = 'Koskinen';
    newBill.tenant = tenant;

    if(isAbnormalDebt) {
      this.addAbnormalDebt(formatBillingNewBill(newBill));
    } else {
      this.addBill(formatBillingNewBill(newBill));
    }

    this.setState({addBillMode: false});
    displayUIMessage({title: 'Lasku tallennettu', body: 'Uusi lasku on tallennettu onnistuneesti'});
  }

  openAddBillMode = () => {
    const {dispatch} = this.props;

    dispatch(change('billing-edit-form', `billing.new_bill`, {}));
    this.setState({addBillMode: true});
  }

  render() {
    const {billing, dispatch, handleSubmit} = this.props;
    const {addBillMode, isDeleteAbnormalDebtModalOpen, selectedDebtIndex} = this.state;

    return (
      <form onSubmit={handleSubmit} className='lease-section-edit billing-section'>
        <ConfirmationModal
          confirmButtonLabel='Poista'
          isOpen={isDeleteAbnormalDebtModalOpen}
          label='Haluatko varmasti poistaa poikkeavan perinnän?'
          onCancel={() => this.hideModal('DeleteAbnormalDebt')}
          onClose={() => this.hideModal('DeleteAbnormalDebt')}
          onSave={this.deleteAbnormalDebt}
          title='Poista poikkeava perintä'
        />
        <Row>
          <Column medium={9}><h1>Laskutus</h1></Column>
          <Column medium={3}>
            <Field
              component={FieldTypeSwitch}
              name="billing.billing_started"
              optionLabel="Laskutus käynnissä"
            />
          </Column>
        </Row>
        <Row><Column><div className="separator-line"></div></Column></Row>
        <Row><Column><h2>Laskut</h2></Column></Row>
        <Row>
          <Column>
            <FormSection
              name="billing"
              bills={get(billing, 'bills')}
              component={BillsTableEdit}
              dispatch={dispatch}
              headers={[
                'Vuokraaja',
                'Osuus',
                'Eräpäivä',
                'Laskun numero',
                'Laskutuskausi',
                'Saamislaji',
                'Laskun tila',
                'Laskutettu',
                'Maksamatta',
                'Tiedote',
                'Läh. SAP:iin',
              ]}
              onSave={(bill, index) => this.saveBill(bill, index)}
            />
          </Column>
        </Row>
        <Row><Column><h2>Poikkeavat perinnät</h2></Column></Row>
        <Row>
          <Column>
            <AbnormalDebtsEdit
              abnormalDebts={get(billing, 'abnormal_debts', [])}
              onDeleteClick={(index) => {
                this.setState({
                  isDeleteAbnormalDebtModalOpen: true,
                  selectedDebtIndex: index,
                });
              }}
              selectedDebtIndex={selectedDebtIndex}
            />
          </Column>
        </Row>

        {!addBillMode &&
          <Row style={{marginTop: '1rem'}}>
            <Column>
              <button
                type="button"
                onClick={() => this.openAddBillMode()}
                className='add-button'>Luo uusi lasku</button>
            </Column>
          </Row>
        }
        {addBillMode &&
          <FormSection
            component={AddBillEdit}
            name='billing.new_bill'
            onSave={() => this.saveNewBill()}
          />
        }
      </form>
    );
  }
}

const formName = 'billing-edit-form';
const selector = formValueSelector(formName);

export default flowRight(
  connect((state) => {
    return {
      billing: selector(state, 'billing'),
    };
  }),
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
    enableReinitialize: true,
  }),
)(BillingEdit);
