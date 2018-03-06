// @flow
import React, {Component} from 'react';
import {Row, Column} from 'react-foundation';
import {connect} from 'react-redux';
import {change, Field, formValueSelector, initialize, startAsyncValidation} from 'redux-form';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import classNames from 'classnames';

import {displayUIMessage,
  formatDate,
  formatDateRange,
  formatDecimalNumber,
  formatNumberWithThousandSeparator} from '$util/helpers';
import {formatBillingBillDb} from '$src/leases/helpers';
import EditAbnormalDebt from './EditAbnormalDebt';

type Props = {
  abnormalDebts: Array<Object>,
  billing: Object,
  dispatch: Function,
  fields: any,
  headers: Array<string>,
  onDeleteClick: Function,
}

type State = {
  selectedDebt: ?Object,
  selectedDebtIndex: ?number,
  showModal: boolean,
  tableHeight: ?number,
}

class AbnormalDebtsTableEdit extends Component {
  props: Props

  tableElement: any

  state: State = {
    selectedDebt: null,
    selectedDebtIndex: null,
    showModal: false,
    tableHeight: null,
  }

  componentDidMount() {
    this.calculateHeight();
  }

  componentDidUpdate() {
    this.calculateHeight();
  }

  shouldComponentUpdate(nextProps: Object, nextState: Object) {
    return (
      this.state.tableHeight !== nextState.tableHeight ||
      this.state.selectedDebt !== nextState.selectedDebt ||
      this.state.showModal !== nextState.showModal ||
      this.props !== nextProps
    );
  }

  calculateHeight = () => {
    let {clientHeight} = this.tableElement;

    if(clientHeight > 450) {clientHeight = 450;}

    this.setState({tableHeight: clientHeight});
  }

  initilizeAbnormalDebtForm = (debt: Object) => {
    const {billing, dispatch} = this.props;
    billing.abnormal_debt = debt;

    dispatch(initialize('billing-edit-form', {billing: billing}));
    dispatch(startAsyncValidation('billing-edit-form'));
  }

  showDebtModal = (index: number) => {
    const {abnormalDebts} = this.props;

    if(abnormalDebts && abnormalDebts.length) {
      this.setState({
        selectedDebt: abnormalDebts[index],
        selectedDebtIndex: index,
        showModal: true,
      });
      this.initilizeAbnormalDebtForm(abnormalDebts[index]);
    }
  }

  saveBill = (debt: Object, index: ?number) => {
    const {abnormalDebts, dispatch} = this.props;

    if(index !== undefined && index !== null && abnormalDebts && abnormalDebts.length > index) {
      abnormalDebts[index] = formatBillingBillDb(debt);
      dispatch(change('billing-edit-form', `billing.abnormal_debts`, abnormalDebts));
      displayUIMessage({title: 'Poikkeava perintä tallennettu', body: 'Poikkeava perintä on tallennettu onnistuneesti'});
      this.setState({selectedDebt: null, selectedDebtIndex: null, showModal: false});
    }
  }

  render () {
    const {abnormalDebts, headers, onDeleteClick} = this.props;
    const {selectedDebt, selectedDebtIndex, showModal, tableHeight} = this.state;

    return (
      <div>
        <Row>
          <Column>
            <h2>Poikkeavat perinnät</h2>
          </Column>
        </Row>
        <div className={classNames('table-fixed-header', 'billing__bill-table', {'is-open': showModal})}>
          <div className="table-fixed-header__container" style={{maxHeight: tableHeight}}>
            <div className="table-fixed-header__header-border" />
            <table ref={(ref) => this.tableElement = ref}>
              <thead>
                {headers && headers.length > 0 &&
                  <tr>
                    {headers.map((header, index) => <th key={index}>{header}<div>{header}</div></th>)}
                  </tr>
                }
              </thead>
              <tbody>
                {abnormalDebts && abnormalDebts.length
                  ? (abnormalDebts.map((debt, index) => {
                    return (
                      <tr
                        className={classNames({'selected': selectedDebtIndex === index})}
                        key={index}>
                        <td>{`${get(debt, 'tenant.lastname')} ${get(debt, 'tenant.firstname')}`}</td>
                        <td>{get(debt, 'tenant.bill_share') ? `${get(debt, 'tenant.bill_share')} %` : '-'}</td>
                        <td>{debt.due_date ? formatDate(debt.due_date) : '-'}</td>
                        <td>{debt.capital_amount ? `${formatNumberWithThousandSeparator(formatDecimalNumber(debt.capital_amount))} €` : '-'}</td>
                        <td>{formatDateRange(debt.billing_period_start_date, debt.billing_period_end_date)}</td>
                        <td className="action-buttons">
                          <button
                            className='action-button button-edit'
                            onClick={() => this.showDebtModal(index)}
                            type='button'
                          />
                          <button
                            className='action-button button-delete'
                            onClick={() => {
                              onDeleteClick(index);
                            }}
                            type='button'
                          />
                        </td>
                      </tr>
                    );
                  }))
                  : (<tr className="no-data"><td colSpan={6}>Ei poikkeavia perintöjä</td></tr>)
                }
              </tbody>
            </table>
          </div>
        </div>
        <Field
          abnormalDebt={selectedDebt}
          component={EditAbnormalDebt}
          name='abnormal_debt'
          onCancel={() => this.setState({selectedDebt: null, selectedDebtIndex: null, showModal: false})}
          onSave={(bill) => this.saveBill(bill, selectedDebtIndex)}
          show={showModal}
        />
      </div>
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
    };
  }),
)(AbnormalDebtsTableEdit);
