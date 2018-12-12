// @flow
import React from 'react';
import {connect} from 'react-redux';
import {FieldArray, formValueSelector} from 'redux-form';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import type {Element} from 'react';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import ActionButtonWrapper from '$components/form/ActionButtonWrapper';
import AddButtonSecondary from '$components/form/AddButtonSecondary';
import AddButtonThird from '$components/form/AddButtonThird';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import BoxItem from '$components/content/BoxItem';
import BoxItemContainer from '$components/content/BoxItemContainer';
import Collapse from '$components/collapse/Collapse';
import CollapseHeaderTitle from '$components/collapse/CollapseHeaderTitle';
import FormField from '$components/form/FormField';
import FormTextTitle from '$components/form/FormTextTitle';
import KtjLink from '$components/ktj/KtjLink';
import RemoveButton from '$components/form/RemoveButton';
import {receiveCollapseStates} from '$src/leases/actions';
import {ViewModes} from '$src/enums';
import {ButtonColors} from '$components/enums';
import {DeleteModalLabels, DeleteModalTitles, FormNames} from '$src/leases/enums';
import {getAttributeFieldOptions, getLabelOfOption} from '$util/helpers';
import {getCollapseStateByKey, getErrorsByFormName, getIsSaveClicked} from '$src/leases/selectors';

import type {Attributes} from '$src/leases/types';

type ContractChangesProps = {
  attributes: Attributes,
  collapseState: boolean,
  decisionOptions: Array<Object>,
  errors: ?Object,
  fields: any,
  isSaveClicked: boolean,
  onCollapseToggle: Function,
  title: string,
}

const renderContractChanges = ({
  attributes,
  collapseState,
  decisionOptions,
  errors,
  fields,
  fields: {name},
  isSaveClicked,
  onCollapseToggle,
  title,
}: ContractChangesProps): Element<*> => {
  const handleCollapseToggle = (val) => {
    onCollapseToggle(val);
  };

  const handleAdd = () => {
    fields.push({});
  };

  const contractChangeErrors = get(errors, name);

  return(
    <AppConsumer>
      {({dispatch}) => {
        return(
          <Collapse
            className='collapse__secondary'
            defaultOpen={collapseState !== undefined ? collapseState : true}
            hasErrors={isSaveClicked &&!isEmpty(contractChangeErrors)}
            headerTitle={<CollapseHeaderTitle>{title}</CollapseHeaderTitle>}
            onToggle={handleCollapseToggle}
          >
            <BoxItemContainer>
              {fields && !!fields.length && fields.map((change, index) => {
                const handleRemove = () => {
                  dispatch({
                    type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                    confirmationFunction: () => {
                      fields.remove(index);
                    },
                    confirmationModalButtonClassName: ButtonColors.ALERT,
                    confirmationModalButtonText: 'Poista',
                    confirmationModalLabel: DeleteModalLabels.CONTRACT_CHANGE,
                    confirmationModalTitle: DeleteModalTitles.CONTRACT_CHANGE,
                  });
                };

                return (
                  <BoxItem key={index}>
                    <BoxContentWrapper>
                      <ActionButtonWrapper>
                        <RemoveButton
                          onClick={handleRemove}
                          title="Poista sopimuksen muutos"
                        />
                      </ActionButtonWrapper>
                      <Row>
                        <Column small={6} medium={4} large={2}>
                          <FormField
                            disableTouched={isSaveClicked}
                            fieldAttributes={get(attributes, 'contracts.child.children.contract_changes.child.children.signing_date')}
                            name={`${change}.signing_date`}
                            overrideValues={{
                              label: 'Allekirjoituspvm',
                            }}
                          />
                        </Column>
                        <Column small={6} medium={4} large={2}>
                          <FormField
                            disableTouched={isSaveClicked}
                            fieldAttributes={get(attributes, 'contracts.child.children.contract_changes.child.children.sign_by_date')}
                            name={`${change}.sign_by_date`}
                            overrideValues={{
                              label: 'Allekirjoitettava mennessä',
                            }}
                          />
                        </Column>
                        <Column small={6} medium={4} large={2}>
                          <FormField
                            disableTouched={isSaveClicked}
                            fieldAttributes={get(attributes, 'contracts.child.children.contract_changes.child.children.first_call_sent')}
                            name={`${change}.first_call_sent`}
                            overrideValues={{
                              label: '1. kutsu lähetetty',
                            }}
                          />
                        </Column>
                        <Column small={6} medium={4} large={2}>
                          <FormField
                            disableTouched={isSaveClicked}
                            fieldAttributes={get(attributes, 'contracts.child.children.contract_changes.child.children.second_call_sent')}
                            name={`${change}.second_call_sent`}
                            overrideValues={{
                              label: '2. kutsu lähetetty',
                            }}
                          />
                        </Column>
                        <Column small={6} medium={4} large={2}>
                          <FormField
                            disableTouched={isSaveClicked}
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
                            disableTouched={isSaveClicked}
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
                            disableTouched={isSaveClicked}
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
                  onClick={handleAdd}
                />
              </Column>
            </Row>
          </Collapse>
        );
      }}
    </AppConsumer>
  );
};

type MortgageDocumentsProps = {
  attributes: Attributes,
  fields: any,
  isSaveClicked: boolean,
}

const renderMortgageDocuments = ({attributes, fields, isSaveClicked}: MortgageDocumentsProps): Element<*> => {
  const handleAdd = () => fields.push({});

  return(
    <AppConsumer>
      {({dispatch}) => {
        return(
          <div>
            <p className='sub-title'>Panttikirjat</p>
            {fields && !!fields.length &&
              <div>
                <Row>
                  <Column small={4} medium={4} large={2}>
                    <FormTextTitle title='Panttikirjan numero' />
                  </Column>
                  <Column small={4} medium={4} large={2}>
                    <FormTextTitle title='Panttikirjan pvm' />
                  </Column>
                  <Column small={4} medium={4} large={2}>
                    <FormTextTitle title='Huomautus' />
                  </Column>
                </Row>
                {fields.map((doc, index) => {
                  const handleRemove = () => {
                    dispatch({
                      type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                      confirmationFunction: () => {
                        fields.remove(index);
                      },
                      confirmationModalButtonText: 'Poista',
                      confirmationModalLabel: DeleteModalLabels.MORTGAGE_DOCUMENT,
                      confirmationModalTitle: DeleteModalTitles.MORTGAGE_DOCUMENT,
                    });
                  };

                  return (
                    <Row key={index} className='pledge-book'>
                      <Column small={4} medium={4} large={2}>
                        <FormField
                          disableTouched={isSaveClicked}
                          fieldAttributes={get(attributes, 'contracts.child.children.mortgage_documents.child.children.number')}
                          invisibleLabel
                          name={`${doc}.number`}
                        />
                      </Column>
                      <Column small={4} medium={4} large={2}>
                        <FormField
                          disableTouched={isSaveClicked}
                          fieldAttributes={get(attributes, 'contracts.child.children.mortgage_documents.child.children.date')}
                          invisibleLabel
                          name={`${doc}.date`}
                        />
                      </Column>
                      <Column small={3} medium={3} large={2}>
                        <FormField
                          disableTouched={isSaveClicked}
                          fieldAttributes={get(attributes, 'contracts.child.children.mortgage_documents.child.children.note')}
                          invisibleLabel
                          name={`${doc}.note`}
                        />
                      </Column>
                      <Column>
                        <RemoveButton
                          className='third-level'
                          onClick={handleRemove}
                          title="Poista panttikirja"
                        />
                      </Column>
                    </Row>
                  );
                })}
              </div>
            }
            <Row>
              <Column medium={12}>
                <AddButtonThird
                  label='Lisää panttikirja'
                  onClick={handleAdd}
                />
              </Column>
            </Row>
          </div>
        );
      }}
    </AppConsumer>
  );
};

type Props = {
  attributes: Attributes,
  contractCollapseState: boolean,
  contractChangesCollapseState: boolean,
  contractId: number,
  contractsData: Array<Object>,
  decisionOptions: Array<Object>,
  errors: Object,
  field: string,
  isSaveClicked: boolean,
  onRemove: Function,
  receiveCollapseStates: Function,
}

const ContractItemEdit = ({
  attributes,
  contractCollapseState,
  contractChangesCollapseState,
  contractId,
  contractsData,
  decisionOptions,
  errors,
  field,
  isSaveClicked,
  onRemove,
  receiveCollapseStates,
}: Props) => {
  const getContractById = (id: number) =>
    id ? contractsData.find((decision) => decision.id === id) : {};

  const getContractTitle = (contract: ?Object) =>
    contract ? `${getLabelOfOption(typeOptions, contract.type) || '-'} ${contract.contract_number || ''}` : null;

  const handleContractCollapseToggle = (val: boolean) => {
    if(!contractId) {return;}

    receiveCollapseStates({
      [ViewModes.EDIT]: {
        [FormNames.CONTRACTS]: {
          [contractId]: {
            contract: val,
          },
        },
      },
    });
  };

  const handleContractChangesCollapseToggle = (val: boolean) => {
    if(!contractId) {return;}

    receiveCollapseStates({
      [ViewModes.EDIT]: {
        [FormNames.CONTRACTS]: {
          [contractId]: {
            contract_changes: val,
          },
        },
      },
    });
  };

  const typeOptions = getAttributeFieldOptions(attributes, 'contracts.child.children.type'),
    contractErrors = get(errors, field),
    savedContract = getContractById(contractId);

  return (
    <Collapse
      defaultOpen={contractCollapseState !== undefined ? contractCollapseState : true}
      hasErrors={isSaveClicked && !isEmpty(contractErrors)}
      headerTitle={<CollapseHeaderTitle>{getContractTitle(savedContract) || '-'}</CollapseHeaderTitle>}
      onRemove={onRemove}
      onToggle={handleContractCollapseToggle}
    >
      <BoxContentWrapper>
        <Row>
          <Column small={6} medium={4} large={2}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'contracts.child.children.type')}
              name={`${field}.type`}
              overrideValues={{
                label: 'Sopimuksen tyyppi',
              }}
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'contracts.child.children.contract_number')}
              name={`${field}.contract_number`}
              overrideValues={{
                label: 'Sopimusnumero',
              }}
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'contracts.child.children.signing_date')}
              name={`${field}.signing_date`}
              overrideValues={{
                label: 'Allekirjoituspvm',
              }}
            />
          </Column>
          <Column small={6} medium={12} large={6}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'contracts.child.children.signing_note')}
              name={`${field}.signing_note`}
              overrideValues={{
                label: 'Allekirjoituksen huomautus',
              }}
            />
          </Column>
        </Row>
        <Row>
          <Column small={6} medium={4} large={2}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'contracts.child.children.is_readjustment_decision')}
              name={`${field}.is_readjustment_decision`}
              overrideValues={{
                label: 'Järjestelypäätös',
              }}
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'contracts.child.children.institution_identifier')}
              name={`${field}.institution_identifier`}
              overrideValues={{
                label: 'Laitostunnus',
              }}
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'contracts.child.children.decision')}
              name={`${field}.decision`}
              overrideValues={{
                label: 'Päätös',
                options: decisionOptions,
              }}
            />
          </Column>
          <Column small={6} medium={12} large={6}>
            <FormTextTitle title='KTJ dokumentti' />
            {get(savedContract, 'institution_identifier')
              ? <KtjLink
                fileKey='vuokraoikeustodistus'
                fileName='vuokraoikeustodistus'
                identifier={get(savedContract, 'institution_identifier')}
                idKey='kohdetunnus'
                label='Vuokraoikeustodistus'
              />
              : <p>-</p>
            }
          </Column>
        </Row>
        <Row>
          <Column small={6} medium={4} large={2}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'contracts.child.children.collateral_number')}
              name={`${field}.collateral_number`}
              overrideValues={{
                label: 'Vuokravakuusnumero',
              }}
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'contracts.child.children.collateral_start_date')}
              name={`${field}.collateral_start_date`}
              overrideValues={{
                label: 'Vuokravakuus alkupvm',
              }}
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'contracts.child.children.collateral_end_date')}
              name={`${field}.collateral_end_date`}
              overrideValues={{
                label: 'Vuokravakuus loppupvm',
              }}
            />
          </Column>
          <Column small={6} medium={12} large={6}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'contracts.child.children.collateral_note')}
              name={`${field}.collateral_note`}
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
              isSaveClicked={isSaveClicked}
              name={`${field}.mortgage_documents`}
            />
          </Column>

        </Row>
      </BoxContentWrapper>
      <FieldArray
        attributes={attributes}
        collapseState={contractChangesCollapseState}
        component={renderContractChanges}
        decisionOptions={decisionOptions}
        errors={errors}
        name={`${field}.contract_changes`}
        isSaveClicked={isSaveClicked}
        onCollapseToggle={handleContractChangesCollapseToggle}
        title='Sopimuksen muutokset'
      />
    </Collapse>
  );
};

const formName = FormNames.CONTRACTS;
const selector = formValueSelector(formName);

export default connect(
  (state, props) => {
    const id = selector(state, `${props.field}.id`);
    if(id) {
      return {
        contractCollapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${formName}.${id}.contract`),
        contractChangesCollapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${formName}.${id}.contract_changes`),
        contractId: id,
        errors: getErrorsByFormName(state, formName),
        isSaveClicked: getIsSaveClicked(state),
      };
    }
    return {
      contractId: id,
      errors: getErrorsByFormName(state, formName),
      isSaveClicked: getIsSaveClicked(state),
    };
  },
  {
    receiveCollapseStates,
  }
)(ContractItemEdit);
