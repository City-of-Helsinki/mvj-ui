// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Field, FormSection, formValueSelector, reduxForm} from 'redux-form';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import {Row, Column} from 'react-foundation';

import BillsTableEdit from './BillsTableEdit';
import ConfirmationModal from '../../../../components/ConfirmationModal';
import FieldTypeSwitch from '../../../../components/form/FieldTypeSwitch';
import {formatDate,
  formatDateRange,
  formatDecimalNumbers,
  formatNumberWithThousandSeparator} from '../../../../util/helpers';

type Props = {
  billing: Object,
  dispatch: Function,
  handleSubmit: Function,
  isDeleteAbnormalDebtModalOpen: boolean,
}

type State = {
  isDeleteAbnormalDebtModalOpen: boolean,
}

class BillingEdit extends Component {
  props: Props

  state: State = {
    isDeleteAbnormalDebtModalOpen: false,
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

  deleteAbnormalDebt = () => {
    console.log('Delete debt');
  }

  render() {
    const {billing, dispatch, handleSubmit} = this.props;
    const {isDeleteAbnormalDebtModalOpen} = this.state;

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
            <table className="abnormal-debts-table">
              <thead>
                <tr>
                  <th>Vuokraaja</th>
                  <th>Hallintaosuus</th>
                  <th>Eräpäivä</th>
                  <th>Määrä</th>
                  <th>Aikaväli</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {get(billing, 'abnormal_debts') && billing.abnormal_debts
                  ? (billing.abnormal_debts.map((debt, index) => {
                    return (
                      <tr key={index}>
                        <td>{`${get(debt, 'tenant.lastname')} ${get(debt, 'tenant.firstname')}`}</td>
                        <td>{get(debt, 'tenant.bill_share') ? `${get(debt, 'tenant.bill_share')} %` : '-'}</td>
                        <td>{debt.due_date ? formatDate(debt.due_date) : '-'}</td>
                        <td>{debt.amount ? `${formatNumberWithThousandSeparator(formatDecimalNumbers(debt.amount))} €` : '-'}</td>
                        <td>{formatDateRange(debt.start_date, debt.end_date)}</td>
                        <td className="action-buttons">
                          <button className='action-button button-edit' />
                          <button
                            className='action-button button-delete'
                            onClick={() => {
                              this.setState({isDeleteAbnormalDebtModalOpen: true});
                            }}
                          />
                        </td>
                      </tr>
                    );
                  }))
                  : (<tr className="no-data"><td colSpan={5}>Ei poikkeavia perintöjä</td></tr>)
                }
              </tbody>
            </table>
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
