//@flow
import React from 'react';
import {connect} from 'react-redux';
import {FieldArray, formValueSelector} from 'redux-form';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import {ButtonColors} from '$components/enums';
import type {Element} from 'react';

import FormText from '$components/form/FormText';
import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import ActionButtonWrapper from '$components/form/ActionButtonWrapper';
import AddButtonSecondary from '$components/form/AddButtonSecondary';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import BoxItem from '$components/content/BoxItem';
import BoxItemContainer from '$components/content/BoxItemContainer';
import Collapse from '$components/collapse/Collapse';
import FormField from '$components/form/FormField';
import {receiveCollapseStates} from '$src/landUseContract/actions';
import RemoveButton from '$components/form/RemoveButton';
import {FormNames, ViewModes, ConfirmationModalTexts} from '$src/enums';
import {getLabelOfOption} from '$util/helpers';
import {getCollapseStateByKey} from '$src/landUseContract/selectors';
import {getFieldAttributes} from '$util/helpers';
import DecisionLink from '$components/links/DecisionLink';

import type {LandUseContract} from '$src/landUseContract/types';
import type {Attributes} from '$src/types';

import {getDecisionById} from '$src/landUseContract/helpers';

type ContractChangesProps = {
  attributes: Attributes,
  collapseState: boolean,
  errors: ?Object,
  fields: any,
  isSaveClicked: boolean,
  onCollapseToggle: Function,
  title: string,
  decisionOptions: Array<Object>,
  currentLandUseContract: LandUseContract,
}

const renderContractChanges = ({
  attributes,
  collapseState,
  errors,
  fields,
  fields: {name},
  isSaveClicked,
  onCollapseToggle,
  title,
  decisionOptions,
  currentLandUseContract,
}: ContractChangesProps): Element<*> => {
  const handleCollapseToggle = (val) => {
    onCollapseToggle(val);
  };

  const handleAdd = () => {
    fields.push({});
  };

  const contractChangeErrors = get(errors, name);

  const decisionReadOnlyRenderer = (value) => {
    return <DecisionLink
      decision={getDecisionById(currentLandUseContract, value)}
      decisionOptions={decisionOptions}
    />;
  };

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
            {
              (!fields || !fields.length) &&
              <FormText>Ei sopimuksen muutoksia</FormText>
            }
            {!!fields && !! fields.length &&
              <BoxItemContainer>
                {fields && !!fields.length && fields.map((change, index) => {
                  const handleRemove = () => {
                    dispatch({
                      type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                      confirmationFunction: () => {
                        fields.remove(index);
                      },
                      confirmationModalButtonClassName: ButtonColors.ALERT,
                      confirmationModalButtonText: ConfirmationModalTexts.DELETE_CONTRACT_CHANGE.BUTTON,
                      confirmationModalLabel: ConfirmationModalTexts.DELETE_CONTRACT_CHANGE.LABEL,
                      confirmationModalTitle: ConfirmationModalTexts.DELETE_CONTRACT_CHANGE.TITLE,
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
                              fieldAttributes={getFieldAttributes(attributes, 'contracts.child.children.contract_changes.child.children.signing_date')}
                              name={`${change}.signing_date`}
                            />
                          </Column>
                          <Column small={6} medium={4} large={2}>
                            <FormField
                              disableTouched={isSaveClicked}
                              fieldAttributes={getFieldAttributes(attributes, 'contracts.child.children.contract_changes.child.children.sign_by_date')}
                              name={`${change}.sign_by_date`}
                            />
                          </Column>
                          <Column small={6} medium={4} large={2}>
                            <FormField
                              disableTouched={isSaveClicked}
                              fieldAttributes={getFieldAttributes(attributes, 'contracts.child.children.contract_changes.child.children.first_call_sent')}
                              name={`${change}.first_call_sent`}
                            />
                          </Column>
                          <Column small={6} medium={4} large={2}>
                            <FormField
                              disableTouched={isSaveClicked}
                              fieldAttributes={getFieldAttributes(attributes, 'contracts.child.children.contract_changes.child.children.second_call_sent')}
                              name={`${change}.second_call_sent`}
                            />
                          </Column>
                          <Column small={6} medium={4} large={2}>
                            <FormField
                              disableTouched={isSaveClicked}
                              fieldAttributes={getFieldAttributes(attributes, 'contracts.child.children.contract_changes.child.children.third_call_sent')}
                              name={`${change}.third_call_sent`}
                            />
                          </Column>
                        </Row>
                        <Row>
                          <Column small={6} medium={4} large={2}>
                            <FormField
                              disableTouched={isSaveClicked}
                              fieldAttributes={getFieldAttributes(attributes, 'contracts.child.children.contract_changes.child.children.decision')}
                              name={`${change}.decision`}
                              readOnlyValueRenderer={decisionReadOnlyRenderer}
                              overrideValues={{
                                label: 'Päätös',
                                options: decisionOptions,
                              }}
                            />
                          </Column>
                          <Column small={6} medium={8} large={10}>
                            <FormField
                              disableTouched={isSaveClicked}
                              fieldAttributes={getFieldAttributes(attributes, 'contracts.child.children.contract_changes.child.children.description')}
                              name={`${change}.description`}
                            />
                          </Column>
                        </Row>
                      </BoxContentWrapper>
                    </BoxItem>
                  );
                })}
              </BoxItemContainer>
            }

            <Row>
              <Column>
                <AddButtonSecondary
                  label='Lisää sopimuksen muutos'
                  onClick={handleAdd}
                  style={{marginTop: !fields.length ? 0 : undefined}}
                />
              </Column>
            </Row>
          </Collapse>
        );
      }}
    </AppConsumer>
  );
};

type WarrantsProps = {
  attributes: Attributes,
  collapseState: boolean,
  errors: ?Object,
  fields: any,
  isSaveClicked: boolean,
  onCollapseToggle: Function,
}

const renderWarrants = ({
  attributes,
  collapseState,
  errors,
  fields,
  fields: {name},
  isSaveClicked,
  onCollapseToggle,
}: WarrantsProps): Element<*> => {
  const handleAdd = () => {
    fields.push({});
  };

  const warrantsErrors = get(errors, name);

  return(
    <AppConsumer>
      {({dispatch}) => {
        return(
          <Collapse
            className='collapse__secondary'
            defaultOpen={collapseState !== undefined ? collapseState : true}
            hasErrors={isSaveClicked && !isEmpty(warrantsErrors)}
            headerTitle='Vakuudet'
            onToggle={onCollapseToggle}
          >
            {
              (!fields || !fields.length) &&
              <FormText>Ei vakuuksia</FormText>
            }
            {!!fields && !! fields.length &&
            <BoxItemContainer>
              {fields && !!fields.length && fields.map((warrants, index) => {
                const handleRemove = () => {
                  dispatch({
                    type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                    confirmationFunction: () => {
                      fields.remove(index);
                    },
                    confirmationModalButtonClassName: ButtonColors.ALERT,
                    confirmationModalButtonText: 'Poista',
                    confirmationModalLabel: 'Haluatko poistaa vakuuden',
                    confirmationModalTitle: 'Poista ehto',
                  });
                };
                return(
                  <BoxItem key={index}>
                    <ActionButtonWrapper>
                      <RemoveButton
                        onClick={handleRemove}
                        title="Poista vakuus"
                      />
                    </ActionButtonWrapper>
                    <Row>
                      <Column small={6} medium={4} large={2}>
                        <FormField
                          disableTouched={isSaveClicked}
                          fieldAttributes={getFieldAttributes(attributes, 'contracts.child.children.collaterals.child.children.type')}
                          name={`${warrants}.type`}
                          overrideValues={{
                            label: 'Vakuuden tyyppi',
                          }}
                        />
                      </Column>
                      <Column small={6} medium={4} large={2}>
                        <FormField
                          disableTouched={isSaveClicked}
                          fieldAttributes={getFieldAttributes(attributes, 'contracts.child.children.collaterals.child.children.other_type')}
                          name={`${warrants}.other_type`}
                          overrideValues={{
                            label: 'Vakuuden laji',
                          }}
                        />
                      </Column>
                      <Column small={12} medium={4} large={2}>
                        <FormField
                          disableTouched={isSaveClicked}
                          fieldAttributes={getFieldAttributes(attributes, 'contracts.child.children.collaterals.child.children.number')}
                          name={`${warrants}.number`}
                          overrideValues={{
                            label: 'Vuokravakuusnro',
                          }}
                        />
                      </Column>
                      <Column small={12} medium={4} large={2}>
                        <FormField
                          disableTouched={isSaveClicked}
                          fieldAttributes={getFieldAttributes(attributes, 'contracts.child.children.collaterals.child.children.start_date')}
                          name={`${warrants}.start_date`}
                          overrideValues={{
                            label: 'Vakuuden alkupvm',
                          }}
                        />
                      </Column>
                      <Column small={12} medium={4} large={2}>
                        <FormField
                          disableTouched={isSaveClicked}
                          fieldAttributes={getFieldAttributes(attributes, 'contracts.child.children.collaterals.child.children.end_date')}
                          name={`${warrants}.end_date`}
                          overrideValues={{
                            label: 'Vakuuden loppupvm',
                          }}
                        />
                      </Column>
                      <Column small={12} medium={4} large={2}>
                        <FormField
                          disableTouched={isSaveClicked}
                          fieldAttributes={getFieldAttributes(attributes, 'contracts.child.children.collaterals.child.children.total_amount')}
                          name={`${warrants}.total_amount`}
                          unit='€'
                          overrideValues={{
                            label: 'Vakuuden määrä',
                          }}
                        />
                      </Column>
                      <Column small={12} medium={4} large={2}>
                        <FormField
                          disableTouched={isSaveClicked}
                          fieldAttributes={getFieldAttributes(attributes, 'contracts.child.children.collaterals.child.children.returned_date')}
                          name={`${warrants}.returned_date`}
                          overrideValues={{
                            label: 'Palautus pvm',
                          }}
                        />
                      </Column>
                      <Column small={12} medium={8} large={10}>
                        <FormField
                          disableTouched={isSaveClicked}
                          fieldAttributes={getFieldAttributes(attributes, 'contracts.child.children.collaterals.child.children.note')}
                          name={`${warrants}.note`}
                          overrideValues={{
                            label: 'Huomautus',
                          }}
                        />
                      </Column>
                    </Row>
                  </BoxItem>
                );
              }
              )}
            </BoxItemContainer>}
            <Row>
              <Column>
                <AddButtonSecondary
                  className={!fields.length ? 'no-top-margin' : '-'}
                  label='Lisää vakuus'
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

type Props = {
  attributes: Attributes,
  collapseState: boolean,
  warrantsCollapseState: boolean,
  contractChangesCollapseState: boolean,
  contract: Object,
  contractsData: Array<Object>,
  contractId: number,
  errors: ?Object,
  field: string,
  isSaveClicked: boolean,
  onRemove: Function,
  receiveCollapseStates: Function,
  contractTypeOptions: Array<Object>,
  currentLandUseContract: LandUseContract,
  decisionOptions: Array<Object>,
}

const ContractItemEdit = ({
  attributes,
  collapseState,
  warrantsCollapseState,
  contractChangesCollapseState,
  contractsData,
  contractId,
  errors,
  field,
  isSaveClicked,
  onRemove,
  receiveCollapseStates,
  contractTypeOptions,
  currentLandUseContract,
  decisionOptions,
}: Props) => {
  const handleCollapseChange = (val: boolean) => {
    if(!contractId) {return;}

    receiveCollapseStates({
      [ViewModes.EDIT]: {
        [formName]: {
          [contractId]: val,
        },
      },
    });
  };

  const handleWarrantsCollapseToggle = (val: boolean) => {
    if(!contractId){return;}

    receiveCollapseStates({
      [ViewModes.EDIT]: {
        [formName]: {
          [contractId]: {
            warrants: val,
          },
        },
      },
    });
  };

  const handleContractChangesCollapseState = (val: boolean) => {
    if(!contractId){return;}

    receiveCollapseStates({
      [ViewModes.EDIT]: {
        [formName]: {
          [contractId]: {
            contract_changes: val,
          },
        },
      },
    });
  };

  const getContractById = (id: number) => {
    if(!id) {return {};}
    return contractsData.find((decision) => decision.id === id);
  };

  const getCollapseTitle = (contract: ?Object) => {
    if(!contract) {return '-';}
    return `${getLabelOfOption(contractTypeOptions, contract.type) || '-'} ${contract.contract_number || '-'}`;
  };

  const contractErrors = get(errors, field),
    savedContract = getContractById(contractId);

  return(
    <Collapse
      defaultOpen={collapseState !== undefined ? collapseState : true}
      hasErrors={isSaveClicked && !isEmpty(contractErrors)}
      headerTitle={getCollapseTitle(savedContract)}
      onRemove={onRemove}
      onToggle={handleCollapseChange}
    >
      <BoxContentWrapper>
        <Row>
          {console.log(attributes)}
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
              fieldAttributes={get(attributes, 'contracts.child.children.state')}
              name={`${field}.state`}
              overrideValues={{
                label: 'Sopimuksen vaihe',
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
          <Column small={6} medium={4} large={2}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'contracts.child.children.contract_number')}
              name={`${field}.contract_number`}
              overrideValues={{
                label: 'ED sopimusnumero',
              }}
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'contracts.child.children.area_arrengements')}
              name={`${field}.area_arrengements`}
              overrideValues={{
                label: 'Aluejärjestelyt',
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
              }}
            />
          </Column>
        </Row>
        <FieldArray
          attributes={attributes}
          collapseState={contractChangesCollapseState}
          component={renderContractChanges}
          errors={errors}
          name={`${field}.contract_changes`}
          isSaveClicked={isSaveClicked}
          onCollapseToggle={handleContractChangesCollapseState}
          title={'Sopimuksen muutos'}
          currentLandUseContract={currentLandUseContract}
          decisionOptions={decisionOptions}
        />

        <FieldArray
          attributes={attributes}
          collapseState={warrantsCollapseState}
          component={renderWarrants}
          errors={errors}
          isSaveClicked={isSaveClicked}
          name={`${field}.collaterals`}
          onCollapseToggle={handleWarrantsCollapseToggle}
        />
      </BoxContentWrapper>
    </Collapse>
  );
};

const formName = FormNames.LAND_USE_CONTRACT_CONTRACTS;
const selector = formValueSelector(formName);

export default connect(
  (state, props) => {
    const id = selector(state, `${props.field}.id`);

    return {
      warrantsCollapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${formName}.${id}.warrants`),
      contractChangesCollapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${formName}.${id}.contract_changes`),
      collapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${formName}.${id}`),
      contractId: id,
    };
  },
  {
    receiveCollapseStates,
  }
)(ContractItemEdit);
