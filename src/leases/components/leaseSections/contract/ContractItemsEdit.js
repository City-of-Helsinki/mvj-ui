// @flow
import React from 'react';
import {Field, FieldArray} from 'redux-form';
import {Row, Column} from 'react-foundation';

import {getAttributeFieldOptions} from '$util/helpers';
import AddButton from '$components/form/AddButton';
import AddButtonSecondary from '$components/form/AddButtonSecondary';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import ContentItem from '$components/content/ContentItem';
import FieldTypeCheckbox from '$components/form/FieldTypeCheckbox';
import FieldTypeDatePicker from '$components/form/FieldTypeDatePicker';
import FieldTypeSelect from '$components/form/FieldTypeSelect';
import FieldTypeText from '$components/form/FieldTypeText';
import GreenBoxEdit from '$components/content/GreenBoxEdit';
import GreenBoxItem from '$components/content/GreenBoxItem';
import RemoveButton from '$components/form/RemoveButton';
import WhiteBoxEdit from '$components/content/WhiteBoxEdit';

import type {Attributes} from '$src/leases/types';

type ContractChangesProps = {
  decisionOptions: Array<Object>,
  fields: any,
  title: string,
}

const renderContractChanges = ({decisionOptions, fields, title}: ContractChangesProps) => {
  return(
    <GreenBoxEdit>
      <h2>{title}</h2>

      {fields && fields.length > 0 && fields.map((change, index) => {
        return (
          <GreenBoxItem key={index}>
            <BoxContentWrapper>
              <RemoveButton
                className='position-topright-no-padding'
                onClick={() => fields.remove(index)}
                title="Poista sopimuksen muutos"
              />
              <Row>
                <Column small={6} medium={4} large={2}>
                  <Field
                    component={FieldTypeDatePicker}
                    label='Allekirjoituspäivä'
                    name={`${change}.signing_date`}
                  />
                </Column>
                <Column small={6} medium={4} large={2}>
                  <Field
                    component={FieldTypeDatePicker}
                    label='Allekirjoitettava mennessä'
                    name={`${change}.sign_by_date`}
                  />
                </Column>
                <Column small={6} medium={4} large={2}>
                  <Field
                    component={FieldTypeDatePicker}
                    label='1. kutsu lähetetty'
                    name={`${change}.first_call_sent`}
                  />
                </Column>
                <Column small={6} medium={4} large={2}>
                  <Field
                    component={FieldTypeDatePicker}
                    label='2. kutsu lähetetty'
                    name={`${change}.second_call_sent`}
                  />
                </Column>
                <Column small={6} medium={4} large={2}>
                  <Field
                    component={FieldTypeDatePicker}
                    label='3. kutsu lähetetty'
                    name={`${change}.third_call_sent`}
                  />
                </Column>
              </Row>
              <Row>
                <Column small={6} medium={4} large={2}>
                  <Field
                    className='no-margin'
                    component={FieldTypeSelect}
                    label='Päätös'
                    name={`${change}.decision`}
                    options={decisionOptions}
                  />
                </Column>
                <Column small={6} medium={8} large={10}>
                  <Field
                    className='no-margin'
                    component={FieldTypeText}
                    label='Selite'
                    name={`${change}.description`}
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

type MortgageDocumentsProps = {
  fields: any,
}

const renderMortgageDocuments = ({fields}: MortgageDocumentsProps) => {
  return(
    <div>
      <p className='sub-title'>Panttikirjat</p>
      {fields && fields.length > 0 &&
        <div>
          <Row>
            <Column small={4} medium={4} large={2}>
              <label className='mvj-form-field-label'>Panttikirjan numero</label>
            </Column>
            <Column small={4} medium={4} large={2}>
              <label className='mvj-form-field-label'>Panttikirjan pvm</label>
            </Column>
            <Column small={4} medium={4} large={2}>
              <label className='mvj-form-field-label'>Panttikirjan kommentti</label>
            </Column>
          </Row>
          {fields.map((pledge_book, index) =>
            <Row key={index} className='pledge-book'>
              <Column small={4} medium={4} large={2}>
                <Field
                  className='list-item'
                  component={FieldTypeText}
                  name={`${pledge_book}.number`}
                />
              </Column>
              <Column small={4} medium={4} large={2}>
                <Field
                  className='list-item'
                  component={FieldTypeDatePicker}
                  name={`${pledge_book}.date`}
                />
              </Column>
              <Column small={3} medium={3} large={2}>
                <Field
                  className='list-item'
                  component={FieldTypeText}
                  name={`${pledge_book}.note`}
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
  attributes: Attributes,
  fields: any,
  contracts: Array<Object>,
  decisionOptions: Array<Object>,
}

const ContractItemsEdit = ({
  attributes,
  fields,
  decisionOptions,
}: Props) => {
  const typeOptions = getAttributeFieldOptions(attributes, 'contracts.child.children.type');

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
                  <Column small={6} medium={4} large={2}>
                    <Field
                      component={FieldTypeSelect}
                      name={`${contract}.type`}
                      label='Sopimuksen tyyppi'
                      options={typeOptions}
                    />
                  </Column>
                  <Column small={6} medium={4} large={2}>
                    <Field
                      component={FieldTypeText}
                      label='Sopimusnumero'
                      name={`${contract}.contract_number`}
                    />
                  </Column>
                  <Column small={6} medium={4} large={2}>
                    <Field
                      component={FieldTypeDatePicker}
                      label='Allekirjoituspäivämäärä'
                      name={`${contract}.signing_date`}
                    />
                  </Column>
                  <Column small={6} medium={12} large={6}>
                    <Field
                      component={FieldTypeText}
                      label='Kommentti allekirjoitukselle'
                      name={`${contract}.signing_note`}
                    />
                  </Column>
                </Row>
                <Row>
                  <Column small={6} medium={4} large={2}>
                    <Field
                      className='checkbox-inline'
                      component={FieldTypeCheckbox}
                      label='Järjestelypäätös'
                      name={`${contract}.is_readjustment_decision`}
                      options={[
                        {value: true, label: 'Järjestelypäätös'},
                      ]}
                    />
                  </Column>
                  <Column small={6} medium={4} large={2}>
                    <Field
                      component={FieldTypeText}
                      label='Laitostunnus'
                      name={`${contract}.institution_identifier`}
                    />
                  </Column>
                  <Column small={6} medium={4} large={2}>
                    <Field
                      component={FieldTypeSelect}
                      label='Päätös'
                      name={`${contract}.decision`}
                      options={decisionOptions}
                    />
                  </Column>
                  <Column small={6} medium={12} large={6}>
                    <Field
                      // add KTJ integration
                      component={FieldTypeText}
                      label='KTJ vuokraoikeustodistuksen linkki'
                      name={`${contract}.ktj_link`}
                    />
                  </Column>
                </Row>
                <Row>
                  <Column small={6} medium={4} large={2}>
                    <Field
                      component={FieldTypeText}
                      label='Vuokravakuusnumero'
                      name={`${contract}.collateral_number`}
                    />
                  </Column>
                  <Column small={6} medium={4} large={2}>
                    <Field
                      component={FieldTypeDatePicker}
                      label='Vuokravakuus alkupvm'
                      name={`${contract}.collateral_start_date`}
                    />
                  </Column>
                  <Column small={6} medium={4} large={2}>
                    <Field
                      component={FieldTypeDatePicker}
                      label='Vuokravakuus loppupvm'
                      name={`${contract}.collateral_end_date`}
                    />
                  </Column>
                  <Column small={6} medium={12} large={6}>
                    <Field
                      component={FieldTypeText}
                      label='Vuokravakuus kommentti'
                      name={`${contract}.collateral_note`}
                    />
                  </Column>
                </Row>
                <Row>
                  <Column small={12}>
                    <FieldArray
                      component={renderMortgageDocuments}
                      name={`${contract}.mortgage_documents`}
                    />
                  </Column>

                </Row>
              </BoxContentWrapper>
            </WhiteBoxEdit>
            <FieldArray
              component={renderContractChanges}
              decisionOptions={decisionOptions}
              name={`${contract}.contract_changes`}
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
