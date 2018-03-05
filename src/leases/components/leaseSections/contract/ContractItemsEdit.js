// @flow
import React from 'react';
import {Field, FieldArray} from 'redux-form';
import {Row, Column} from 'react-foundation';

import {formatDate} from '../../../../util/helpers';
import {contractTypeOptions} from '../../../../constants';
import AddButton from '../../../../components/form/AddButton';
import AddButtonSecondary from '../../../../components/form/AddButtonSecondary';
import BoxContentWrapper from '../../../../components/content/BoxContentWrapper';
import ContentItem from '../../../../components/content/ContentItem';
import FieldTypeDatePicker from '../../../../components/form/FieldTypeDatePicker';
import FieldTypeSelect from '../../../../components/form/FieldTypeSelect';
import FieldTypeText from '../../../../components/form/FieldTypeText';
import GreenBoxEdit from '../../../../components/content/GreenBoxEdit';
import GreenBoxItem from '../../../../components/content/GreenBoxItem';
import RemoveButton from '../../../../components/form/RemoveButton';
import WhiteBoxEdit from '../../../../components/content/WhiteBoxEdit';

type ContractModificationsProps = {
  title: string,
  fields: any,
}

const renderContractModifications = ({title, fields}: ContractModificationsProps) => {
  return(
    <GreenBoxEdit>
      <h2>{title}</h2>

      {fields && fields.length > 0 && fields.map((modification, index) => {
        return (
          <GreenBoxItem key={index}>
            <BoxContentWrapper>
              <RemoveButton
                className='position-topright-no-padding'
                onClick={() => fields.remove(index)}
                title="Poista sopimuksen muutos"
              />
              <Row>
                <Column medium={3}>
                  <Field
                    component={FieldTypeDatePicker}
                    label='Allekirjoituspäivä'
                    name={`${modification}.modification_signing_date`}
                  />
                </Column>
                <Column medium={3}>
                  <Field
                    component={FieldTypeDatePicker}
                    label='Allekirjoitettava mennessä'
                    name={`${modification}.to_be_signed_by`}
                  />
                </Column>
                <Column medium={2}>
                  <Field
                    component={FieldTypeDatePicker}
                    label='1. kutsu lähetetty'
                    name={`${modification}.first_call_sent`}
                  />
                </Column>
                <Column medium={2}>
                  <Field
                    component={FieldTypeDatePicker}
                    label='2. kutsu lähetetty'
                    name={`${modification}.second_call_sent`}
                  />
                </Column>
                <Column medium={2}>
                  <Field
                    component={FieldTypeDatePicker}
                    label='3. kutsu lähetetty'
                    name={`${modification}.third_call_sent`}
                  />
                </Column>
              </Row>
              <Row>
                <Column medium={8}>
                  <Field
                    className='no-margin'
                    component={FieldTypeText}
                    label='Selite'
                    name={`${modification}.modification_description`}
                  />
                </Column>
                <Column medium={4}>
                  <Field
                    className='no-margin'
                    component={FieldTypeText}
                    label='Päätös'
                    name={`${modification}.linked_rule`}
                  />
                </Column>
              </Row>
            </BoxContentWrapper>
          </GreenBoxItem>
        );
      })}
      <Row>
        <Column>
          <AddButtonSecondary
            className='no-margin'
            label='Lisää sopimuksen muutos'
            onClick={() => fields.push({})}
            title='Lisää sopimuksen muutos'
          />
        </Column>
      </Row>
    </GreenBoxEdit>
  );
};

type PledgeBookProps = {
  fields: any,
}

const renderPledgeBooks = ({fields}: PledgeBookProps) => {
  return(
    <div>
      <p className='sub-title'>Panttikirjat</p>
      {fields && fields.length > 0 &&
        <div>
          <Row>
            <Column small={2}>
              <label className='mvj-form-field-label'>Panttikirjan numero</label>
            </Column>
            <Column small={2}>
              <label className='mvj-form-field-label'>Panttikirjan pvm</label>
            </Column>
            <Column small={6}>
              <label className='mvj-form-field-label'>Panttikirjan kommentti</label>
            </Column>
          </Row>
          {fields.map((pledge_book, index) =>
            <Row key={index} className='pledge-book'>
              <Column small={2}>
                <Field
                  className='list-item'
                  component={FieldTypeText}
                  name={`${pledge_book}.pledge_book_number`}
                />
              </Column>
              <Column small={2}>
                <Field
                  className='list-item'
                  component={FieldTypeDatePicker}
                  name={`${pledge_book}.pledge_book_date`}
                />
              </Column>
              <Column small={6}>
                <Field
                  className='list-item'
                  component={FieldTypeText}
                  name={`${pledge_book}.pledge_book_comment`}
                />
              </Column>
              <Column>
                <RemoveButton
                  onClick={() => fields.remove(index)}
                  title="Poista panttikirja"
                />
              </Column>
            </Row>
          )}
        </div>
      }
      <Row>
        <Column medium={12}>
          <AddButtonSecondary
            className='no-margin'
            label='Lisää panttikirja'
            onClick={() => fields.push({})}
            title='Lisää panttikirja'
          />
        </Column>
      </Row>
    </div>
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
          <ContentItem key={index}>
            <WhiteBoxEdit>
              <BoxContentWrapper>
                <RemoveButton
                  className='position-topright-no-padding'
                  onClick={() => fields.remove(index)}
                  title="Poista sopimus"
                />
                <Row>
                  <Column medium={2}>
                    <Field
                      component={FieldTypeSelect}
                      name={`${contract}.contract_type`}
                      label='Sopimuksen tyyppi'
                      options={contractTypeOptions}
                    />
                  </Column>
                  <Column medium={2}>
                    <Field
                      component={FieldTypeText}
                      label='Sopimusnumero'
                      name={`${contract}.contract_type`}
                    />
                  </Column>
                  <Column medium={2}>
                    <Field
                      component={FieldTypeDatePicker}
                      label='Allekirjoituspäivämäärä'
                      name={`${contract}.signing_date`}
                    />
                  </Column>
                  <Column medium={6}>
                    <Field
                      component={FieldTypeText}
                      label='Kommentti allekirjoitukselle'
                      name={`${contract}.signing_date_comment`}
                    />
                  </Column>
                </Row>
                <Row>
                  <Column medium={4}>
                    <Field
                      component={FieldTypeSelect}
                      label='Järjestelypäätös'
                      name={`${contract}.setup_decision`}
                      options={[
                        {value: '', label: 'to be filled'},
                      ]}
                    />
                  </Column>
                  <Column medium={4}>
                    <Field
                      component={FieldTypeSelect}
                      label='Päätös'
                      name={`${contract}.linked_rule`}
                      options={contractOptions}
                    />
                  </Column>
                  <Column medium={4}>
                    <Field
                      // add KTJ integration
                      component={FieldTypeText}
                      label='KTJ vuokraoikeustodistuksen linkki'
                      name={`${contract}.ktj_document`}
                    />
                  </Column>
                </Row>
                <Row>
                  <Column medium={2}>
                    <Field
                      component={FieldTypeText}
                      label='Vuokravakuusnumero'
                      name={`${contract}.lease_deposit_number`}
                    />
                  </Column>
                  <Column medium={2}>
                    <Field
                      component={FieldTypeDatePicker}
                      label='Vuokravakuus alkupvm'
                      name={`${contract}.lease_deposit_starting_date`}
                    />
                  </Column>
                  <Column medium={2}>
                    <Field
                      component={FieldTypeDatePicker}
                      label='Vuokravakuus loppupvm'
                      name={`${contract}.lease_deposit_ending_date`}
                    />
                  </Column>
                  <Column medium={6}>
                    <Field
                      component={FieldTypeText}
                      label='Vuokravakuus kommentti'
                      name={`${contract}.lease_deposit_comment`}
                    />
                  </Column>
                </Row>
                <Row>
                  <Column medium={9}>
                    <FieldArray
                      component={renderPledgeBooks}
                      name={`${contract}.pledge_books`}
                    />
                  </Column>
                  <Column medium={2} offsetOnMedium={1}>
                    <Field
                      component={FieldTypeText}
                      label='Laitostunnus'
                      name={`${contract}.administration_number`}
                    />
                  </Column>
                </Row>
              </BoxContentWrapper>
            </WhiteBoxEdit>
            <FieldArray
              component={renderContractModifications}
              name={`${contract}.modifications`}
              title='Sopimuksen muutokset'
            />
          </ContentItem>
        );
      })}
      <Row>
        <Column>
          <AddButton
            label='Lisää uusi sopimus'
            onClick={() => fields.push({})}
            title='Lisää uusi sopimus'
          />
        </Column>
      </Row>
    </div>
  );
};

export default ContractItemsEdit;
