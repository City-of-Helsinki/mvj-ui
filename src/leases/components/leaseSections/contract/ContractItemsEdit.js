// @flow
import React from 'react';
import {Field, FieldArray} from 'redux-form';
import {Row, Column} from 'react-foundation';

import {formatDate} from '../../../../util/helpers';
import trashIcon from '../../../../../assets/icons/trash.svg';
import FieldTypeDatePicker from '../../../../components/form/FieldTypeDatePicker';
import FieldTypeSelect from '../../../../components/form/FieldTypeSelect';
import FieldTypeText from '../../../../components/form/FieldTypeText';

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
                  component={FieldTypeDatePicker}
                  label='Allekirjoituspäivä'
                />
              </Column>
              <Column medium={3}>
                <Field
                  name={`${modification}.to_be_signed_by`}
                  component={FieldTypeDatePicker}
                  label='Allekirjoitettava mennessä'
                />
              </Column>
              <Column medium={2}>
                <Field
                  name={`${modification}.first_call_sent`}
                  component={FieldTypeDatePicker}
                  label='1. kutsu lähetetty'
                />
              </Column>
              <Column medium={2}>
                <Field
                  name={`${modification}.second_call_sent`}
                  component={FieldTypeDatePicker}
                  label='2. kutsu lähetetty'
                />
              </Column>
              <Column medium={2}>
                <Field
                  name={`${modification}.third_call_sent`}
                  component={FieldTypeDatePicker}
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
            <Column medium={2}>
              <Field
                name={`${pledge_book}.pledge_book_number`}
                component={FieldTypeText}
                label='Panttikirjan numero'
              />
            </Column>
            <Column medium={2}>
              <Field
                name={`${pledge_book}.pledge_book_date`}
                component={FieldTypeDatePicker}
                label='Panttikirjan päivämäärä'
              />
            </Column>
            <Column medium={8}>
              <Field
                name={`${pledge_book}.pledge_book_comment`}
                component={FieldTypeText}
                label='Panttikirjan kommentti'
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

type Props = {
  fields: any,
  contracts: Array<Object>,
}

const ContractItemsEdit = ({fields, contracts}: Props) => {
  const contractOptions = [];
  if (contracts) {
    contracts.map(rule =>
      contractOptions.push({
        value: rule.rule_clause,
        label: `${rule.rule_maker}, ${formatDate(rule.rule_date)}, ${rule.rule_clause}`})
    );
  }

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
              <Column medium={2}>
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
              <Column medium={2}>
                <Field
                  name={`${contract}.contract_type`}
                  component={FieldTypeText}
                  label='Sopimusnumero'
                />
              </Column>
              <Column medium={2}>
                <Field
                  name={`${contract}.signing_date`}
                  component={FieldTypeDatePicker}
                  label='Allekirjoituspäivämäärä'
                />
              </Column>
              <Column medium={6}>
                <Field
                  name={`${contract}.signing_date_comment`}
                  component={FieldTypeText}
                  label='Kommentti allekirjoitukselle'
                />
              </Column>
            </Row>
            <Row>
              <Column medium={4}>
                <Field
                  name={`${contract}.setup_decision`}
                  component={FieldTypeSelect}
                  label='Järjestelypäätös'
                  options={[
                    {value: '', label: 'to be filled'},
                  ]}
                />
              </Column>
              <Column medium={4}>
                <Field
                  name={`${contract}.linked_rule`}
                  component={FieldTypeSelect}
                  label='Päätös'
                  options={contractOptions}
                />
              </Column>
              <Column medium={4}>
                <Field
                  // add KTJ integration
                  component={FieldTypeText}
                  label='KTJ vuokraoikeustodistuksen linkki'
                />
              </Column>
            </Row>
            <Row>
              <Column medium={2}>
                <Field
                  name={`${contract}.lease_deposit_number`}
                  component={FieldTypeText}
                  label='Vuokravakuusnumero'
                />
              </Column>
              <Column medium={2}>
                <Field
                  name={`${contract}.lease_deposit_starting_date`}
                  component={FieldTypeDatePicker}
                  label='Vuokravakuus alkupvm'
                />
              </Column>
              <Column medium={2}>
                <Field
                  name={`${contract}.lease_deposit_ending_date`}
                  component={FieldTypeDatePicker}
                  label='Vuokravakuus loppupvm'
                />
              </Column>
              <Column medium={6}>
                <Field
                  name={`${contract}.lease_deposit_comment`}
                  component={FieldTypeText}
                  label='Vuokravakuus kommentti'
                />
              </Column>
            </Row>
            <Row>
              <Column medium={9}>
                <FieldArray name={`${contract}.pledge_books`} component={renderPledgeBooks} />
              </Column>
              <Column medium={2} offsetOnMedium={1}>
                <Field
                  name={`${contract}.administration_number`}
                  component={FieldTypeText}
                  label='Laitostunnus'
                />
              </Column>
            </Row>
            <FieldArray title='Sopimuksen muutokset' name={`${contract}.modifications`} component={renderContractModifications}/>
          </div>
        );
      })}
      <Row>
        <Column>
          <button type="button" onClick={() => fields.push({})} className='add-button'>Lisää uusi sopimus</button>
        </Column>
      </Row>
    </div>
  );
};

export default ContractItemsEdit;
