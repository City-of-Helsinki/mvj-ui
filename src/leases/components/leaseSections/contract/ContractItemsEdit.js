// @flow
import React from 'react';
import {Field, FieldArray} from 'redux-form';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import {getAttributeFieldOptions} from '$util/helpers';
import {genericValidator} from '$components/form/validations';
import AddButton from '$components/form/AddButton';
import AddButtonSecondary from '$components/form/AddButtonSecondary';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import BoxItem from '$components/content/BoxItem';
import BoxItemContainer from '$components/content/BoxItemContainer';
import Collapse from '$components/collapse/Collapse';
import FieldTypeCheckbox from '$components/form/FieldTypeCheckbox';
import FieldTypeDatePicker from '$components/form/FieldTypeDatePicker';
import FieldTypeSelect from '$components/form/FieldTypeSelect';
import FieldTypeText from '$components/form/FieldTypeText';
import RemoveButton from '$components/form/RemoveButton';

import type {Attributes} from '$src/leases/types';

type ContractChangesProps = {
  attributes: Attributes,
  decisionOptions: Array<Object>,
  fields: any,
  title: string,
}

const renderContractChanges = ({
  attributes,
  decisionOptions,
  fields,
  title,
}: ContractChangesProps) => {
  return(
    <Collapse
      className='collapse__secondary'
      defaultOpen={true}
      headerTitle={
        <h4 className='collapse__header-title'>{title}</h4>
      }
    >
      <BoxItemContainer>
        {fields && fields.length && fields.map((change, index) => {
          return (
            <BoxItem
              key={change.id ? change.id : `index_${index}`}
              className='no-border-on-first-child'>
              <BoxContentWrapper>
                <RemoveButton
                  className='position-topright'
                  onClick={() => fields.remove(index)}
                  title="Poista sopimuksen muutos"
                />
                <Row>
                  <Column small={6} medium={4} large={2}>
                    <Field
                      component={FieldTypeDatePicker}
                      label='Allekirjoituspäivä'
                      name={`${change}.signing_date`}
                      validate={[
                        (value) => genericValidator(value,
                          get(attributes, 'contracts.child.children.contract_changes.child.children.signing_date')),
                      ]}
                    />
                  </Column>
                  <Column small={6} medium={4} large={2}>
                    <Field
                      component={FieldTypeDatePicker}
                      label='Allekirjoitettava mennessä'
                      name={`${change}.sign_by_date`}
                      validate={[
                        (value) => genericValidator(value,
                          get(attributes, 'contracts.child.children.contract_changes.child.children.sign_by_date')),
                      ]}
                    />
                  </Column>
                  <Column small={6} medium={4} large={2}>
                    <Field
                      component={FieldTypeDatePicker}
                      label='1. kutsu lähetetty'
                      name={`${change}.first_call_sent`}
                      validate={[
                        (value) => genericValidator(value,
                          get(attributes, 'contracts.child.children.contract_changes.child.children.first_call_sent')),
                      ]}
                    />
                  </Column>
                  <Column small={6} medium={4} large={2}>
                    <Field
                      component={FieldTypeDatePicker}
                      label='2. kutsu lähetetty'
                      name={`${change}.second_call_sent`}
                      validate={[
                        (value) => genericValidator(value,
                          get(attributes, 'contracts.child.children.contract_changes.child.children.second_call_sent')),
                      ]}
                    />
                  </Column>
                  <Column small={6} medium={4} large={2}>
                    <Field
                      component={FieldTypeDatePicker}
                      label='3. kutsu lähetetty'
                      name={`${change}.third_call_sent`}
                      validate={[
                        (value) => genericValidator(value,
                          get(attributes, 'contracts.child.children.contract_changes.child.children.third_call_sent')),
                      ]}
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
                      validate={[
                        (value) => genericValidator(value,
                          get(attributes, 'contracts.child.children.contract_changes.child.children.decision')),
                      ]}
                    />
                  </Column>
                  <Column small={6} medium={8} large={10}>
                    <Field
                      component={FieldTypeText}
                      label='Selite'
                      name={`${change}.description`}
                      validate={[
                        (value) => genericValidator(value,
                          get(attributes, 'contracts.child.children.contract_changes.child.children.description')),
                      ]}
                    />
                  </Column>
                </Row>
              </BoxContentWrapper>
            </BoxItem>
          );
        })}
      </BoxItemContainer>
      <Row>
        <Column>
          <AddButtonSecondary
            label='Lisää sopimuksen muutos'
            onClick={() => fields.push({})}
            title='Lisää sopimuksen muutos'
          />
        </Column>
      </Row>
    </Collapse>
  );
};

type MortgageDocumentsProps = {
  attributes: Attributes,
  fields: any,
}

const renderMortgageDocuments = ({attributes, fields}: MortgageDocumentsProps) => {
  return(
    <div>
      <p className='sub-title'>Panttikirjat</p>
      {fields && fields.length &&
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
          {fields.map((doc, index) =>
            <Row key={doc.id ? doc.id : `index_${index}`} className='pledge-book'>
              <Column small={4} medium={4} large={2}>
                <Field
                  className='list-item'
                  component={FieldTypeText}
                  name={`${doc}.number`}
                  validate={[
                    (value) => genericValidator(value,
                      get(attributes, 'contracts.child.children.mortgage_documents.child.children.number')),
                  ]}
                />
              </Column>
              <Column small={4} medium={4} large={2}>
                <Field
                  className='list-item'
                  component={FieldTypeDatePicker}
                  name={`${doc}.date`}
                  validate={[
                    (value) => genericValidator(value,
                      get(attributes, 'contracts.child.children.mortgage_documents.child.children.date')),
                  ]}
                />
              </Column>
              <Column small={3} medium={3} large={2}>
                <Field
                  className='list-item'
                  component={FieldTypeText}
                  name={`${doc}.note`}
                  validate={[
                    (value) => genericValidator(value,
                      get(attributes, 'contracts.child.children.mortgage_documents.child.children.note')),
                  ]}
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
      {fields && !!fields.length && fields.map((contract, index) => {
        return(
          <Collapse
            key={contract.id ? contract.id : `index_${index}`}
            defaultOpen={true}
            headerTitle={
              <h3 className='collapse__header-title'>Sopimus {index + 1}</h3>
            }
          >
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
                    validate={[
                      (value) => genericValidator(value,
                        get(attributes, 'contracts.child.children.type')),
                    ]}
                  />
                </Column>
                <Column small={6} medium={4} large={2}>
                  <Field
                    component={FieldTypeText}
                    label='Sopimusnumero'
                    name={`${contract}.contract_number`}
                    validate={[
                      (value) => genericValidator(value,
                        get(attributes, 'contracts.child.children.contract_number')),
                    ]}
                  />
                </Column>
                <Column small={6} medium={4} large={2}>
                  <Field
                    component={FieldTypeDatePicker}
                    label='Allekirjoituspäivämäärä'
                    name={`${contract}.signing_date`}
                    validate={[
                      (value) => genericValidator(value,
                        get(attributes, 'contracts.child.children.signing_date')),
                    ]}
                  />
                </Column>
                <Column small={6} medium={12} large={6}>
                  <Field
                    component={FieldTypeText}
                    label='Kommentti allekirjoitukselle'
                    name={`${contract}.signing_note`}
                    validate={[
                      (value) => genericValidator(value,
                        get(attributes, 'contracts.child.children.signing_note')),
                    ]}
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
                    validate={[
                      (value) => genericValidator(value,
                        get(attributes, 'contracts.child.children.is_readjustment_decision')),
                    ]}
                  />
                </Column>
                <Column small={6} medium={4} large={2}>
                  <Field
                    component={FieldTypeText}
                    label='Laitostunnus'
                    name={`${contract}.institution_identifier`}
                    validate={[
                      (value) => genericValidator(value,
                        get(attributes, 'contracts.child.children.institution_identifier')),
                    ]}
                  />
                </Column>
                <Column small={6} medium={4} large={2}>
                  <Field
                    component={FieldTypeSelect}
                    label='Päätös'
                    name={`${contract}.decision`}
                    options={decisionOptions}
                    validate={[
                      (value) => genericValidator(value,
                        get(attributes, 'contracts.child.children.decision')),
                    ]}
                  />
                </Column>
                <Column small={6} medium={12} large={6}>
                  <Field
                    // add KTJ integration
                    component={FieldTypeText}
                    label='KTJ vuokraoikeustodistuksen linkki'
                    name={`${contract}.ktj_link`}
                    validate={[
                      (value) => genericValidator(value,
                        get(attributes, 'contracts.child.children.ktj_link')),
                    ]}
                  />
                </Column>
              </Row>
              <Row>
                <Column small={6} medium={4} large={2}>
                  <Field
                    component={FieldTypeText}
                    label='Vuokravakuusnumero'
                    name={`${contract}.collateral_number`}
                    validate={[
                      (value) => genericValidator(value,
                        get(attributes, 'contracts.child.children.collateral_number')),
                    ]}
                  />
                </Column>
                <Column small={6} medium={4} large={2}>
                  <Field
                    component={FieldTypeDatePicker}
                    label='Vuokravakuus alkupvm'
                    name={`${contract}.collateral_start_date`}
                    validate={[
                      (value) => genericValidator(value,
                        get(attributes, 'contracts.child.children.collateral_start_date')),
                    ]}
                  />
                </Column>
                <Column small={6} medium={4} large={2}>
                  <Field
                    component={FieldTypeDatePicker}
                    label='Vuokravakuus loppupvm'
                    name={`${contract}.collateral_end_date`}
                    validate={[
                      (value) => genericValidator(value,
                        get(attributes, 'contracts.child.children.collateral_end_date')),
                    ]}
                  />
                </Column>
                <Column small={6} medium={12} large={6}>
                  <Field
                    component={FieldTypeText}
                    label='Vuokravakuus kommentti'
                    name={`${contract}.collateral_note`}
                    validate={[
                      (value) => genericValidator(value,
                        get(attributes, 'contracts.child.children.collateral_note')),
                    ]}
                  />
                </Column>
              </Row>
              <Row>
                <Column small={12}>
                  <FieldArray
                    attributes={attributes}
                    component={renderMortgageDocuments}
                    name={`${contract}.mortgage_documents`}
                  />
                </Column>

              </Row>
            </BoxContentWrapper>
            <FieldArray
              attributes={attributes}
              component={renderContractChanges}
              decisionOptions={decisionOptions}
              name={`${contract}.contract_changes`}
              title='Sopimuksen muutokset'
            />
          </Collapse>
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
