// @flow
import React, {Fragment} from 'react';
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
import Authorization from '$components/authorization/Authorization';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import BoxItem from '$components/content/BoxItem';
import BoxItemContainer from '$components/content/BoxItemContainer';
import Collapse from '$components/collapse/Collapse';
import FormField from '$components/form/FormField';
import FormTextTitle from '$components/form/FormTextTitle';
import KtjLink from '$components/ktj/KtjLink';
import RemoveButton from '$components/form/RemoveButton';
import SubTitle from '$components/content/SubTitle';
import {receiveCollapseStates} from '$src/leases/actions';
import {ViewModes} from '$src/enums';
import {ButtonColors} from '$components/enums';
import {
  DeleteModalLabels,
  DeleteModalTitles,
  FormNames,
  LeaseContractChangesFieldPaths,
  LeaseContractChangesFieldTitles,
  LeaseContractsFieldPaths,
  LeaseContractsFieldTitles,
  LeaseContractMortgageDocumentsFieldPaths,
  LeaseContractMortgageDocumentsFieldTitles,
} from '$src/leases/enums';
import {
  getFieldAttributes,
  getFieldOptions,
  getLabelOfOption,
  isFieldAllowedToEdit,
  isFieldAllowedToRead,
} from '$util/helpers';
import {getCollapseStateByKey, getErrorsByFormName, getIsSaveClicked} from '$src/leases/selectors';

import type {Attributes} from '$src/types';

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
            headerTitle={title}
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
                        <Authorization allow={isFieldAllowedToEdit(attributes, LeaseContractChangesFieldPaths.CONTRACT_CHANGES)}>
                          <RemoveButton
                            onClick={handleRemove}
                            title="Poista sopimuksen muutos"
                          />
                        </Authorization>
                      </ActionButtonWrapper>

                      <Row>
                        <Column small={6} medium={4} large={2}>
                          <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractChangesFieldPaths.SIGNING_DATE)}>
                            <FormField
                              disableTouched={isSaveClicked}
                              fieldAttributes={getFieldAttributes(attributes, LeaseContractChangesFieldPaths.SIGNING_DATE)}
                              name={`${change}.signing_date`}
                              overrideValues={{label: LeaseContractChangesFieldTitles.SIGNING_DATE}}
                            />
                          </Authorization>
                        </Column>
                        <Column small={6} medium={4} large={2}>
                          <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractChangesFieldPaths.SIGN_BY_DATE)}>
                            <FormField
                              disableTouched={isSaveClicked}
                              fieldAttributes={getFieldAttributes(attributes, LeaseContractChangesFieldPaths.SIGN_BY_DATE)}
                              name={`${change}.sign_by_date`}
                              overrideValues={{label: LeaseContractChangesFieldTitles.SIGN_BY_DATE}}
                            />
                          </Authorization>
                        </Column>
                        <Column small={6} medium={4} large={2}>
                          <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractChangesFieldPaths.FIRST_CALL_SENT)}>
                            <FormField
                              disableTouched={isSaveClicked}
                              fieldAttributes={getFieldAttributes(attributes, LeaseContractChangesFieldPaths.FIRST_CALL_SENT)}
                              name={`${change}.first_call_sent`}
                              overrideValues={{label: LeaseContractChangesFieldTitles.FIRST_CALL_SENT}}
                            />
                          </Authorization>
                        </Column>
                        <Column small={6} medium={4} large={2}>
                          <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractChangesFieldPaths.SECOND_CALL_SENT)}>
                            <FormField
                              disableTouched={isSaveClicked}
                              fieldAttributes={getFieldAttributes(attributes, LeaseContractChangesFieldPaths.SECOND_CALL_SENT)}
                              name={`${change}.second_call_sent`}
                              overrideValues={{label: LeaseContractChangesFieldTitles.SECOND_CALL_SENT}}
                            />
                          </Authorization>
                        </Column>
                        <Column small={6} medium={4} large={2}>
                          <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractChangesFieldPaths.THIRD_CALL_SENT)}>
                            <FormField
                              disableTouched={isSaveClicked}
                              fieldAttributes={getFieldAttributes(attributes, LeaseContractChangesFieldPaths.THIRD_CALL_SENT)}
                              name={`${change}.third_call_sent`}
                              overrideValues={{label: LeaseContractChangesFieldTitles.THIRD_CALL_SENT}}
                            />
                          </Authorization>
                        </Column>
                      </Row>
                      <Row>
                        <Column small={6} medium={4} large={2}>
                          <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractChangesFieldPaths.DECISION)}>
                            <FormField
                              disableTouched={isSaveClicked}
                              fieldAttributes={getFieldAttributes(attributes, LeaseContractChangesFieldPaths.DECISION)}
                              name={`${change}.decision`}
                              overrideValues={{
                                label: LeaseContractChangesFieldTitles.DECISION,
                                options: decisionOptions,
                              }}
                            />
                          </Authorization>
                        </Column>
                        <Column small={6} medium={8} large={10}>
                          <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractChangesFieldPaths.DESCRIPTION)}>
                            <FormField
                              disableTouched={isSaveClicked}
                              fieldAttributes={getFieldAttributes(attributes, LeaseContractChangesFieldPaths.DESCRIPTION)}
                              name={`${change}.description`}
                              overrideValues={{label: LeaseContractChangesFieldTitles.DESCRIPTION}}
                            />
                          </Authorization>
                        </Column>
                      </Row>
                    </BoxContentWrapper>
                  </BoxItem>
                );
              })}
            </BoxItemContainer>

            <Authorization allow={isFieldAllowedToEdit(attributes, LeaseContractChangesFieldPaths.CONTRACT_CHANGES)}>
              <Row>
                <Column>
                  <AddButtonSecondary
                    label='Lisää sopimuksen muutos'
                    onClick={handleAdd}
                  />
                </Column>
              </Row>
            </Authorization>
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
  const handleAdd = () => {
    fields.push({});
  };

  return(
    <AppConsumer>
      {({dispatch}) => {
        return(
          <Fragment>
            <SubTitle>{LeaseContractMortgageDocumentsFieldTitles.MORTGAGE_DOCUMENTS}</SubTitle>
            {fields && !!fields.length &&
              <Fragment>
                <Row>
                  <Column small={4} medium={4} large={2}>
                    <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractMortgageDocumentsFieldPaths.NUMBER)}>
                      <FormTextTitle>{LeaseContractMortgageDocumentsFieldTitles.NUMBER}</FormTextTitle>
                    </Authorization>
                  </Column>
                  <Column small={4} medium={4} large={2}>
                    <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractMortgageDocumentsFieldPaths.DATE)}>
                      <FormTextTitle>{LeaseContractMortgageDocumentsFieldTitles.DATE}</FormTextTitle>
                    </Authorization>
                  </Column>
                  <Column small={4} medium={4} large={2}>
                    <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractMortgageDocumentsFieldPaths.NOTE)}>
                      <FormTextTitle>{LeaseContractMortgageDocumentsFieldTitles.NOTE}</FormTextTitle>
                    </Authorization>
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
                    <Row key={index}>
                      <Column small={4} medium={4} large={2}>
                        <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractMortgageDocumentsFieldPaths.NUMBER)}>
                          <FormField
                            disableTouched={isSaveClicked}
                            fieldAttributes={getFieldAttributes(attributes, LeaseContractMortgageDocumentsFieldPaths.NUMBER)}
                            invisibleLabel
                            name={`${doc}.number`}
                            overrideValues={{label: LeaseContractMortgageDocumentsFieldTitles.NUMBER}}
                          />
                        </Authorization>
                      </Column>
                      <Column small={4} medium={4} large={2}>
                        <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractMortgageDocumentsFieldPaths.DATE)}>
                          <FormField
                            disableTouched={isSaveClicked}
                            fieldAttributes={getFieldAttributes(attributes, LeaseContractMortgageDocumentsFieldPaths.DATE)}
                            invisibleLabel
                            name={`${doc}.date`}
                            overrideValues={{label: LeaseContractMortgageDocumentsFieldTitles.DATE}}
                          />
                        </Authorization>
                      </Column>
                      <Column small={3} medium={3} large={2}>
                        <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractMortgageDocumentsFieldPaths.NOTE)}>
                          <FormField
                            disableTouched={isSaveClicked}
                            fieldAttributes={getFieldAttributes(attributes, LeaseContractMortgageDocumentsFieldPaths.NOTE)}
                            invisibleLabel
                            name={`${doc}.note`}
                            overrideValues={{label: LeaseContractMortgageDocumentsFieldTitles.NOTE}}
                          />
                        </Authorization>
                      </Column>
                      <Column>
                        <Authorization allow={isFieldAllowedToEdit(attributes, LeaseContractMortgageDocumentsFieldPaths.MORTGAGE_DOCUMENTS)}>
                          <RemoveButton
                            className='third-level'
                            onClick={handleRemove}
                            title="Poista panttikirja"
                          />
                        </Authorization>
                      </Column>
                    </Row>
                  );
                })}
              </Fragment>
            }

            <Authorization allow={isFieldAllowedToEdit(attributes, LeaseContractMortgageDocumentsFieldPaths.MORTGAGE_DOCUMENTS)}>
              <Row>
                <Column>
                  <AddButtonThird
                    label='Lisää panttikirja'
                    onClick={handleAdd}
                  />
                </Column>
              </Row>
            </Authorization>
          </Fragment>
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
  decisionOptions: Array<Object>,
  errors: Object,
  field: string,
  isSaveClicked: boolean,
  onRemove: Function,
  receiveCollapseStates: Function,
  savedContracts: Array<Object>,
}

const ContractItemEdit = ({
  attributes,
  contractCollapseState,
  contractChangesCollapseState,
  contractId,
  decisionOptions,
  errors,
  field,
  isSaveClicked,
  onRemove,
  receiveCollapseStates,
  savedContracts,
}: Props) => {
  const getContractById = (id: number) => id ? savedContracts.find((decision) => decision.id === id) : {};

  const getContractTitle = (contract: ?Object) =>
    contract ? `${getLabelOfOption(typeOptions, contract.type) || '-'} ${contract.contract_number || ''}` : null;

  const handleContractCollapseToggle = (val: boolean) => {
    if(!contractId) return;

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
    if(!contractId) return;

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

  const typeOptions = getFieldOptions(getFieldAttributes(attributes, LeaseContractsFieldPaths.TYPE)),
    contractErrors = get(errors, field),
    savedContract = getContractById(contractId);

  return (
    <Collapse
      defaultOpen={contractCollapseState !== undefined ? contractCollapseState : true}
      hasErrors={isSaveClicked && !isEmpty(contractErrors)}
      headerTitle={
        <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractsFieldPaths.TYPE)}>
          {getContractTitle(savedContract) || '-'}
        </Authorization>
      }
      onRemove={onRemove}
      onToggle={handleContractCollapseToggle}
    >
      <BoxContentWrapper>
        <Row>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractsFieldPaths.TYPE)}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(attributes, LeaseContractsFieldPaths.TYPE)}
                name={`${field}.type`}
                overrideValues={{label: LeaseContractsFieldTitles.TYPE}}
              />
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractsFieldPaths.CONTRACT_NUMBER)}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(attributes, LeaseContractsFieldPaths.CONTRACT_NUMBER)}
                name={`${field}.contract_number`}
                overrideValues={{label: LeaseContractsFieldTitles.CONTRACT_NUMBER}}
              />
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractsFieldPaths.SIGNING_DATE)}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(attributes, LeaseContractsFieldPaths.SIGNING_DATE)}
                name={`${field}.signing_date`}
                overrideValues={{label: LeaseContractsFieldTitles.SIGNING_DATE}}
              />
            </Authorization>
          </Column>
          <Column small={6} medium={12} large={6}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractsFieldPaths.SIGNING_NOTE)}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(attributes, LeaseContractsFieldPaths.SIGNING_NOTE)}
                name={`${field}.signing_note`}
                overrideValues={{label: LeaseContractsFieldTitles.SIGNING_NOTE}}
              />
            </Authorization>
          </Column>
        </Row>
        <Row>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractsFieldPaths.IS_READJUSTMENT_DECISION)}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(attributes, LeaseContractsFieldPaths.IS_READJUSTMENT_DECISION)}
                name={`${field}.is_readjustment_decision`}
                overrideValues={{label: LeaseContractsFieldTitles.IS_READJUSTMENT_DECISION}}
              />
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractsFieldPaths.INSTITUTION_IDENTIFIER)}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(attributes, LeaseContractsFieldPaths.INSTITUTION_IDENTIFIER)}
                name={`${field}.institution_identifier`}
                overrideValues={{label: LeaseContractsFieldTitles.INSTITUTION_IDENTIFIER}}
              />
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractsFieldPaths.DECISION)}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(attributes, LeaseContractsFieldPaths.DECISION)}
                name={`${field}.decision`}
                overrideValues={{
                  label: LeaseContractsFieldTitles.DECISION,
                  options: decisionOptions,
                }}
              />
            </Authorization>
          </Column>
          <Column small={6} medium={12} large={6}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractsFieldPaths.INSTITUTION_IDENTIFIER)}>
              <FormTextTitle>{LeaseContractsFieldTitles.KTJ_LINK}</FormTextTitle>
              {savedContract && savedContract.institution_identifier
                ? <KtjLink
                  fileKey='vuokraoikeustodistus'
                  fileName='vuokraoikeustodistus'
                  identifier={savedContract.institution_identifier}
                  idKey='kohdetunnus'
                  label='Vuokraoikeustodistus'
                />
                : <p>-</p>
              }
            </Authorization>
          </Column>
        </Row>
        <Row>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractsFieldPaths.COLLATERAL_NUMBER)}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(attributes, LeaseContractsFieldPaths.COLLATERAL_NUMBER)}
                name={`${field}.collateral_number`}
                overrideValues={{label: LeaseContractsFieldTitles.COLLATERAL_NUMBER}}
              />
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractsFieldPaths.COLLATERAL_START_DATE)}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(attributes, LeaseContractsFieldPaths.COLLATERAL_START_DATE)}
                name={`${field}.collateral_start_date`}
                overrideValues={{label: LeaseContractsFieldTitles.COLLATERAL_START_DATE}}
              />
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractsFieldPaths.COLLATERAL_END_DATE)}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(attributes, LeaseContractsFieldPaths.COLLATERAL_END_DATE)}
                name={`${field}.collateral_end_date`}
                overrideValues={{label: LeaseContractsFieldTitles.COLLATERAL_END_DATE}}
              />
            </Authorization>
          </Column>
          <Column small={6} medium={12} large={6}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractsFieldPaths.COLLATERAL_NOTE)}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(attributes, LeaseContractsFieldPaths.COLLATERAL_NOTE)}
                name={`${field}.collateral_note`}
                overrideValues={{label: LeaseContractsFieldTitles.COLLATERAL_NOTE}}
              />
            </Authorization>
          </Column>
        </Row>

        <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractMortgageDocumentsFieldPaths.MORTGAGE_DOCUMENTS)}>
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
        </Authorization>
      </BoxContentWrapper>

      <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractChangesFieldPaths.CONTRACT_CHANGES)}>
        <FieldArray
          attributes={attributes}
          collapseState={contractChangesCollapseState}
          component={renderContractChanges}
          decisionOptions={decisionOptions}
          errors={errors}
          name={`${field}.contract_changes`}
          isSaveClicked={isSaveClicked}
          onCollapseToggle={handleContractChangesCollapseToggle}
          title={LeaseContractChangesFieldTitles.CONTRACT_CHANGES}
        />
      </Authorization>
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
