// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Field, FormSection, formValueSelector, reduxForm} from 'redux-form';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import {Row, Column} from 'react-foundation';

import AbnormalDebtsEdit from './AbnormalDebtsEdit';
import BillsTableEdit from './BillsTableEdit';
import ConfirmationModal from '../../../../components/ConfirmationModal';
import FieldTypeSwitch from '../../../../components/form/FieldTypeSwitch';

type Props = {
  billing: Object,
  dispatch: Function,
  handleSubmit: Function,
  isDeleteAbnormalDebtModalOpen: boolean,
}

type State = {
  isDeleteAbnormalDebtModalOpen: boolean,
  selectedDebtIndex: ?number,
}

class BillingEdit extends Component {
  props: Props

  state: State = {
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
    console.log('Delete debt');
  }

  render() {
    const {billing, dispatch, handleSubmit} = this.props;
    const {isDeleteAbnormalDebtModalOpen, selectedDebtIndex} = this.state;

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
        <Row style={{marginTop: '2rem'}}>
          <Column>
            <button
              type="button"
              onClick={() => console.log({})}
              className='add-button'>Luo uusi lasku</button>
          </Column>
        </Row>
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
