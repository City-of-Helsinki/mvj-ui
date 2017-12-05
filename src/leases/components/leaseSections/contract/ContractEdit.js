// @flow
import React, {Component} from 'react';
import flowRight from 'lodash/flowRight';
import {connect} from 'react-redux';
import {formValueSelector, reduxForm, Field, FieldArray} from 'redux-form';
import {Row, Column} from 'react-foundation';

import trashIcon from '../../../../../assets/icons/trash.svg';
import FieldTypeText from '../../../../components/form/FieldTypeText';
import FieldTypeSelect from '../../../../components/form/FieldTypeSelect';

type ContractModificationsProps = {
  title: string,
  fields: any,
}

const renderContractModifications = ({title, fields}: ContractModificationsProps) => {
  return(
    <div className='green-box'>
      {fields.length > 0 &&
        <Row>
          <Column>
            <h2>{title}</h2>
          </Column>
        </Row>}
      {fields && fields.length > 0 && fields.map((modification, index) => {
        return (
          <div key={index} className='green-box-item'>
            <button
              className='remove-button'
              type="button"
              title="Poista sopimuksen muutos"
              onClick={() => fields.remove(index)}>
              <img src={trashIcon} alt='Poista' />
            </button>
            <Row>
              <Column medium={3}>
                <Field
                  name={`${modification}.modification_signing_date`}
                  component={FieldTypeText}
                  label='Allekirjoituspäivä'
                />
              </Column>
              <Column medium={3}>
                <Field
                  name={`${modification}.to_be_signed_by`}
                  component={FieldTypeText}
                  label='Allekirjoitettava mennessä'
                />
              </Column>
              <Column medium={2}>
                <Field
                  name={`${modification}.first_call_sent`}
                  component={FieldTypeText}
                  label='1. kutsu lähetetty'
                />
              </Column>
              <Column medium={2}>
                <Field
                  name={`${modification}.second_call_sent`}
                  component={FieldTypeText}
                  label='2. kutsu lähetetty'
                />
              </Column>
              <Column medium={2}>
                <Field
                  name={`${modification}.third_call_sent`}
                  component={FieldTypeText}
                  label='3. kutsu lähetetty'
                />
              </Column>
            </Row>
            <Row>
              <Column medium={8}>
                <Field
                  name={`${modification}.modification_description`}
                  component={FieldTypeText}
                  label='Selite'
                />
              </Column>
              <Column medium={4}>
                <Field
                  name={`${modification}.linked_rule`}
                  component={FieldTypeText}
                  label='Päätös'
                />
              </Column>
            </Row>
          </div>
        );
      })}
      <Row>
        <Column>
          <a onClick={() => fields.push({})} className='add-button-secondary'><i /><span>Lisää sopimuksen muutos</span></a>
        </Column>
      </Row>
    </div>
  );
};

type PledgeBookProps = {
  fields: any,
}

const renderPledgeBooks = ({fields}: PledgeBookProps) => {
  return(
    <Row>
      {fields && fields.length > 0 && fields.map((pledge_book, index) =>
        <Column key={index} medium={12} className='pledge-book'>
          <button
            className='remove-button'
            type="button"
            title="Poista panttikirja"
            onClick={() => fields.remove(index)}>
            <img src={trashIcon} alt='Poista' />
          </button>
          <Row>
            <Column medium={6}>
              <Field
                name={`${pledge_book}.pledge_book_number`}
                component={FieldTypeText}
                label='Panttikirjan numero'
              />
            </Column>
            <Column medium={6}>
              <Field
                name={`${pledge_book}.pledge_book_date`}
                component={FieldTypeText}
                label='Panttikirjan päivämäärä'
              />
            </Column>
          </Row>
        </Column>)
      }
      <Column medium={4} className='add-column'>
        <a onClick={() => fields.push({})} className='add-button-secondary'><i /><span>Lisää panttikirja</span></a>
      </Column>
    </Row>
  );
};

type ContractProps = {
  fields: any,
}

const renderContracts = ({fields}: ContractProps) => {
  return (
    <div>
      {fields && fields.length > 0 && fields.map((contract, index) => {
        return(
          <div key={index} className='item'>
            <button
              className='remove-button'
              type="button"
              title="Poista sopimus"
              onClick={() => fields.remove(index)}>
              <img src={trashIcon} alt='Poista' />
            </button>
            <Row>
              <Column medium={4}>
                <Field
                  name={`${contract}.contract_type`}
                  component={FieldTypeSelect}
                  label='Sopimuksen tyyppi'
                  options={[
                    {value: 'rent-contract', label: 'Vuokrasopimus'},
                    {value: 'esisopimus', label: 'Esisopimus'},
                    {value: 'rasitesopimus', label: 'Rasitesopimus'},
                  ]}
                />
              </Column>
              <Column medium={3}>
                <Field
                  name={`${contract}.contract_type`}
                  component={FieldTypeText}
                  label='Sopimusnumero'
                />
              </Column>
              <Column medium={2}>
                <Field
                  name={`${contract}.signing_date`}
                  component={FieldTypeText}
                  label='Allekirjoituspäivämäärä'
                />
              </Column>
              <Column medium={3}>
                <Field
                  name={`${contract}.administration_number`}
                  component={FieldTypeText}
                  label='Laitostunnus'
                />
              </Column>
            </Row>
            <Row>
              <Column medium={5}>
                <Field
                  name={`${contract}.setup_decision`}
                  component={FieldTypeSelect}
                  label='Järjestelypäätös'
                  options={[
                    {value: '', label: 'to be filled'},
                  ]}
                />
              </Column>
              <Column medium={3}>
                <Field
                  name={`${contract}.lease_deposit_numer`}
                  component={FieldTypeText}
                  label='Vuokravakuusnumero'
                />
              </Column>
              <Column medium={2}>
                <Field
                  name={`${contract}.lease_deposit_starting_date`}
                  component={FieldTypeText}
                  label='Vuokravakuus alkupvm'
                />
              </Column>
              <Column medium={2}>
                <Field
                  name={`${contract}.lease_deposit_ending_date`}
                  component={FieldTypeText}
                  label='Vuokravakuus loppupvm'
                />
              </Column>
            </Row>
            <Row>
              <Column medium={7}>
                <FieldArray name={`${contract}.pledge_books`} component={renderPledgeBooks} />
              </Column>
              <Column medium={4} offsetOnMedium={1}>
                <Field
                  name={`${contract}.linked_rule`}
                  component={FieldTypeSelect}
                  label='Päätös'
                  options={[]}
                />
              </Column>
            </Row>
            <FieldArray title='Sopimuksen muutokset' name={`${contract}.modifications`} component={renderContractModifications}/>
          </div>
        );
      })}
    </div>
  );
};

type Props = {
  handleSubmit: Function,
  dispatch: Function,
}

class ContractEdit extends Component {
  props: Props

  render() {
    const {dispatch, handleSubmit} = this.props;

    return (
      <form onSubmit={handleSubmit} className='lease-section-edit'>
        <Row>
          <Column>
            <FieldArray name="contracts" dispatch={dispatch} component={renderContracts}/>
          </Column>
        </Row>
      </form>
    );
  }
}

const formName = 'contract-edit-form';
const selector = formValueSelector(formName);

export default flowRight(
  connect(
    (state) => {
      return {
        contracts: selector(state, 'contracts'),
      };
    }
  ),
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
  }),
)(ContractEdit);
