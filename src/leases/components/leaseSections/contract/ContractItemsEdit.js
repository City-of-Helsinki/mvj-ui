// @flow
import React from 'react';
import {FieldArray} from 'redux-form';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';
import type {Element} from 'react';

import AddButton from '$components/form/AddButton';
import AddButtonSecondary from '$components/form/AddButtonSecondary';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import BoxItem from '$components/content/BoxItem';
import BoxItemContainer from '$components/content/BoxItemContainer';
import Collapse from '$components/collapse/Collapse';
import FormField from '$components/form/FormField';
import FormFieldLabel from '$components/form/FormFieldLabel';
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
}: ContractChangesProps): Element<*> => {
  return(
    <Collapse
      className='collapse__secondary'
      defaultOpen={true}
      headerTitle={
        <h4 className='collapse__header-title'>{title}</h4>
      }
    >
      <BoxItemContainer>
        {fields && !!fields.length && fields.map((change, index) => {
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
                    <FormField
                      fieldAttributes={get(attributes, 'contracts.child.children.contract_changes.child.children.signing_date')}
                      name={`${change}.signing_date`}
                      overrideValues={{
                        label: 'Allekirjoituspvm',
                      }}
                    />
                  </Column>
                  <Column small={6} medium={4} large={2}>
                    <FormField
                      fieldAttributes={get(attributes, 'contracts.child.children.contract_changes.child.children.sign_by_date')}
                      name={`${change}.sign_by_date`}
                      overrideValues={{
                        label: 'Allekirjoitettava mennessä',
                      }}
                    />
                  </Column>
                  <Column small={6} medium={4} large={2}>
                    <FormField
                      fieldAttributes={get(attributes, 'contracts.child.children.contract_changes.child.children.first_call_sent')}
                      name={`${change}.first_call_sent`}
                      overrideValues={{
                        label: '1. kutsu lähetetty',
                      }}
                    />
                  </Column>
                  <Column small={6} medium={4} large={2}>
                    <FormField
                      fieldAttributes={get(attributes, 'contracts.child.children.contract_changes.child.children.second_call_sent')}
                      name={`${change}.second_call_sent`}
                      overrideValues={{
                        label: '2. kutsu lähetetty',
                      }}
                    />
                  </Column>
                  <Column small={6} medium={4} large={2}>
                    <FormField
                      fieldAttributes={get(attributes, 'contracts.child.children.contract_changes.child.children.third_call_sent')}
                      name={`${change}.third_call_sent`}
                      overrideValues={{
                        label: '3. kutsu lähetetty',
                      }}
                    />
                  </Column>
                </Row>
                <Row>
                  <Column small={6} medium={4} large={2}>
                    <FormField
                      fieldAttributes={get(attributes, 'contracts.child.children.contract_changes.child.children.decision')}
                      name={`${change}.decision`}
                      overrideValues={{
                        label: 'Päätös',
                        options: decisionOptions,
                      }}
                    />
                  </Column>
                  <Column small={6} medium={8} large={10}>
                    <FormField
                      fieldAttributes={get(attributes, 'contracts.child.children.contract_changes.child.children.description')}
                      name={`${change}.description`}
                      overrideValues={{
                        label: 'Huomautus',
                      }}
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

const renderMortgageDocuments = ({attributes, fields}: MortgageDocumentsProps): Element<*> => {
  return(
    <div>
      <p className='sub-title'>Panttikirjat</p>
      {fields && !!fields.length &&
        <div>
          <Row>
            <Column small={4} medium={4} large={2}>
              <FormFieldLabel>Panttikirjan numero</FormFieldLabel>
            </Column>
            <Column small={4} medium={4} large={2}>
              <FormFieldLabel>Panttikirjan pvm</FormFieldLabel>
            </Column>
            <Column small={4} medium={4} large={2}>
              <FormFieldLabel>Huomautus</FormFieldLabel>
            </Column>
          </Row>
          {fields.map((doc, index) =>
            <Row key={doc.id ? doc.id : `index_${index}`} className='pledge-book'>
              <Column small={4} medium={4} large={2}>
                <FormField
                  fieldAttributes={get(attributes, 'contracts.child.children.mortgage_documents.child.children.number')}
                  name={`${doc}.number`}
                  overrideValues={{
                    label: '',
                  }}
                />
              </Column>
              <Column small={4} medium={4} large={2}>
                <FormField
                  fieldAttributes={get(attributes, 'contracts.child.children.mortgage_documents.child.children.date')}
                  name={`${doc}.date`}
                  overrideValues={{
                    label: '',
                  }}
                />
              </Column>
              <Column small={3} medium={3} large={2}>
                <FormField
                  fieldAttributes={get(attributes, 'contracts.child.children.mortgage_documents.child.children.note')}
                  name={`${doc}.note`}
                  overrideValues={{
                    label: '',
                  }}
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
  decisionOptions: Array<Object>,
  fields: any,
}

const ContractItemsEdit = ({
  attributes,
  decisionOptions,
  fields,
}: Props) =>
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
                <FormField
                  fieldAttributes={get(attributes, 'contracts.child.children.type')}
                  name={`${contract}.type`}
                  overrideValues={{
                    label: 'Sopimuksen tyyppi',
                  }}
                />
              </Column>
              <Column small={6} medium={4} large={2}>
                <FormField
                  fieldAttributes={get(attributes, 'contracts.child.children.contract_number')}
                  name={`${contract}.contract_number`}
                  overrideValues={{
                    label: 'Sopimusnumero',
                  }}
                />
              </Column>
              <Column small={6} medium={4} large={2}>
                <FormField
                  fieldAttributes={get(attributes, 'contracts.child.children.signing_date')}
                  name={`${contract}.signing_date`}
                  overrideValues={{
                    label: 'Allekirjoituspvm',
                  }}
                />
              </Column>
              <Column small={6} medium={12} large={6}>
                <FormField
                  fieldAttributes={get(attributes, 'contracts.child.children.signing_note')}
                  name={`${contract}.signing_note`}
                  overrideValues={{
                    label: 'Allekirjoituksen huomautus',
                  }}
                />
              </Column>
            </Row>
            <Row>
              <Column small={6} medium={4} large={2}>
                <FormField
                  fieldAttributes={get(attributes, 'contracts.child.children.is_readjustment_decision')}
                  name={`${contract}.is_readjustment_decision`}
                  overrideValues={{
                    label: 'Järjestelypäätös',
                  }}
                />
              </Column>
              <Column small={6} medium={4} large={2}>
                <FormField
                  fieldAttributes={get(attributes, 'contracts.child.children.institution_identifier')}
                  name={`${contract}.institution_identifier`}
                  overrideValues={{
                    label: 'Laitostunnus',
                  }}
                />
              </Column>
              <Column small={6} medium={4} large={2}>
                <FormField
                  fieldAttributes={get(attributes, 'contracts.child.children.decision')}
                  name={`${contract}.decision`}
                  overrideValues={{
                    label: 'Päätös',
                    options: decisionOptions,
                  }}
                />
              </Column>
              <Column small={6} medium={12} large={6}>
                <FormField
                  // add KTJ integration
                  fieldAttributes={get(attributes, 'contracts.child.children.ktj_link')}
                  name={`${contract}.ktj_link`}
                  overrideValues={{
                    label: 'KTJ vuokraoikeustodistuksen linkki',
                  }}
                />
              </Column>
            </Row>
            <Row>
              <Column small={6} medium={4} large={2}>
                <FormField
                  fieldAttributes={get(attributes, 'contracts.child.children.collateral_number')}
                  name={`${contract}.collateral_number`}
                  overrideValues={{
                    label: 'Vuokravakuusnumero',
                  }}
                />
              </Column>
              <Column small={6} medium={4} large={2}>
                <FormField
                  fieldAttributes={get(attributes, 'contracts.child.children.collateral_start_date')}
                  name={`${contract}.collateral_start_date`}
                  overrideValues={{
                    label: 'Vuokravakuus alkupvm',
                  }}
                />
              </Column>
              <Column small={6} medium={4} large={2}>
                <FormField
                  fieldAttributes={get(attributes, 'contracts.child.children.collateral_end_date')}
                  name={`${contract}.collateral_end_date`}
                  overrideValues={{
                    label: 'Vuokravakuus loppupvm',
                  }}
                />
              </Column>
              <Column small={6} medium={12} large={6}>
                <FormField
                  fieldAttributes={get(attributes, 'contracts.child.children.collateral_note')}
                  name={`${contract}.collateral_note`}
                  overrideValues={{
                    label: 'Vuokravakuuden huomautus',
                  }}
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
          label='Lisää sopimus'
          onClick={() => fields.push({})}
          title='Lisää sopimus'
        />
      </Column>
    </Row>
  </div>;

export default ContractItemsEdit;
