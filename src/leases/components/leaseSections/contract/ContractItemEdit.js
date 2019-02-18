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
import Authorization from '$components/authorization/Authorization';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import BoxItem from '$components/content/BoxItem';
import BoxItemContainer from '$components/content/BoxItemContainer';
import Collapse from '$components/collapse/Collapse';
import CollapseHeaderSubtitle from '$components/collapse/CollapseHeaderSubtitle';
import DecisionLink from '$components/links/DecisionLink';
import FormField from '$components/form/FormField';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import KtjLink from '$components/ktj/KtjLink';
import RemoveButton from '$components/form/RemoveButton';
import {receiveCollapseStates} from '$src/leases/actions';
import {ViewModes} from '$src/enums';
import {ButtonColors} from '$components/enums';
import {
  DeleteModalLabels,
  DeleteModalTitles,
  FormNames,
  LeaseContractChangesFieldPaths,
  LeaseContractChangesFieldTitles,
  LeaseContractCollateralsFieldPaths,
  LeaseContractCollateralsFieldTitles,
  LeaseContractsFieldPaths,
  LeaseContractsFieldTitles,
} from '$src/leases/enums';
import {UsersPermissions} from '$src/usersPermissions/enums';
import {getDecisionById} from '$src/leases/helpers';
import {
  formatDate,
  getFieldAttributes,
  getFieldOptions,
  getLabelOfOption,
  hasPermissions,
  isFieldAllowedToRead,
} from '$util/helpers';
import {getMethods as getContractFileMethods} from '$src/contractFile/selectors';
import {
  getAttributes,
  getCollapseStateByKey,
  getCurrentLease,
  getErrorsByFormName,
  getIsSaveClicked,
} from '$src/leases/selectors';
import {getUsersPermissions} from '$src/usersPermissions/selectors';

import type {Attributes, Methods} from '$src/types';
import type {Lease} from '$src/leases/types';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';

type ContractChangesProps = {
  attributes: Attributes,
  collapseState: boolean,
  currentLease: Lease,
  decisionOptions: Array<Object>,
  errors: ?Object,
  fields: any,
  isSaveClicked: boolean,
  onCollapseToggle: Function,
  title: string,
  usersPermissions: UsersPermissionsType,
}

const renderContractChanges = ({
  attributes,
  collapseState,
  currentLease,
  decisionOptions,
  errors,
  fields,
  fields: {name},
  isSaveClicked,
  onCollapseToggle,
  title,
  usersPermissions,
}: ContractChangesProps): Element<*> => {
  const handleCollapseToggle = (val) => {
    onCollapseToggle(val);
  };

  const handleAdd = () => {
    fields.push({});
  };

  const decisionReadOnlyRenderer = (value) => {
    return <DecisionLink
      decision={getDecisionById(currentLease, value)}
      decisionOptions={decisionOptions}
    />;
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
              {!hasPermissions(usersPermissions, UsersPermissions.ADD_CONTRACTCHANGE) &&
                (!fields || !fields.length) &&
                <FormText>Ei sopimuksen muutoksia</FormText>
              }

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
                        <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.DELETE_CONTRACTCHANGE)}>
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
                              readOnlyValueRenderer={decisionReadOnlyRenderer}
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

            <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.ADD_CONTRACTCHANGE)}>
              <Row>
                <Column>
                  <AddButtonSecondary
                    label='Lisää sopimuksen muutos'
                    onClick={handleAdd}
                    style={{marginTop: !fields.length ? 0 : undefined}}
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

type CollateralsProps = {
  attributes: Attributes,
  collapseState: boolean,
  errors: ?Object,
  fields: any,
  isSaveClicked: boolean,
  onCollapseToggle: Function,
  title: string,
  usersPermissions: UsersPermissionsType,
}

const renderCollaterals = ({
  attributes,
  collapseState,
  errors,
  fields,
  fields: {name},
  isSaveClicked,
  onCollapseToggle,
  title,
  usersPermissions,
}: CollateralsProps): Element<*> => {
  const handleCollapseToggle = (val) => {
    onCollapseToggle(val);
  };

  const handleAdd = () => {
    fields.push({});
  };

  const collateralsErrors = get(errors, name);

  return(
    <AppConsumer>
      {({dispatch}) => {
        return(
          <Collapse
            className='collapse__secondary'
            defaultOpen={collapseState !== undefined ? collapseState : true}
            hasErrors={isSaveClicked &&!isEmpty(collateralsErrors)}
            headerTitle={title}
            onToggle={handleCollapseToggle}
          >
            {!hasPermissions(usersPermissions, UsersPermissions.ADD_COLLATERAL) &&
              (!fields || !fields.length) &&
              <FormText>Ei vakuuksia</FormText>
            }

            {!!fields.length &&
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
                      confirmationModalLabel: DeleteModalLabels.COLLATERAL,
                      confirmationModalTitle: DeleteModalTitles.COLLATERAL,
                    });
                  };

                  return (
                    <BoxItem key={index}>
                      <BoxContentWrapper>
                        <ActionButtonWrapper>
                          <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.DELETE_COLLATERAL)}>
                            <RemoveButton
                              onClick={handleRemove}
                              title="Poista vakuus"
                            />
                          </Authorization>
                        </ActionButtonWrapper>

                        <Row>
                          <Column small={6} medium={4} large={2}>
                            <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractCollateralsFieldPaths.TYPE)}>
                              <FormField
                                disableTouched={isSaveClicked}
                                fieldAttributes={getFieldAttributes(attributes, LeaseContractCollateralsFieldPaths.TYPE)}
                                name={`${change}.type`}
                                overrideValues={{label: LeaseContractCollateralsFieldTitles.TYPE}}
                              />
                            </Authorization>
                          </Column>
                          <Column small={6} medium={4} large={2}>
                            <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractCollateralsFieldPaths.NUMBER)}>
                              <FormField
                                disableTouched={isSaveClicked}
                                fieldAttributes={getFieldAttributes(attributes, LeaseContractCollateralsFieldPaths.NUMBER)}
                                name={`${change}.number`}
                                overrideValues={{label: LeaseContractCollateralsFieldTitles.NUMBER}}
                              />
                            </Authorization>
                          </Column>
                          <Column small={6} medium={4} large={2}>
                            <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractCollateralsFieldPaths.START_DATE)}>
                              <FormField
                                disableTouched={isSaveClicked}
                                fieldAttributes={getFieldAttributes(attributes, LeaseContractCollateralsFieldPaths.START_DATE)}
                                name={`${change}.start_date`}
                                overrideValues={{label: LeaseContractCollateralsFieldTitles.START_DATE}}
                              />
                            </Authorization>
                          </Column>
                          <Column small={6} medium={4} large={2}>
                            <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractCollateralsFieldPaths.END_DATE)}>
                              <FormField
                                disableTouched={isSaveClicked}
                                fieldAttributes={getFieldAttributes(attributes, LeaseContractCollateralsFieldPaths.END_DATE)}
                                name={`${change}.end_date`}
                                overrideValues={{label: LeaseContractCollateralsFieldTitles.END_DATE}}
                              />
                            </Authorization>
                          </Column>
                          <Column small={6} medium={4} large={2}>
                            <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractCollateralsFieldPaths.TOTAL_AMOUNT)}>
                              <FormField
                                disableTouched={isSaveClicked}
                                fieldAttributes={getFieldAttributes(attributes, LeaseContractCollateralsFieldPaths.TOTAL_AMOUNT)}
                                name={`${change}.total_amount`}
                                unit='€'
                                overrideValues={{label: LeaseContractCollateralsFieldTitles.TOTAL_AMOUNT}}
                              />
                            </Authorization>
                          </Column>
                          <Column small={6} medium={4} large={2}>
                            <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractCollateralsFieldPaths.PAID_DATE)}>
                              <FormField
                                disableTouched={isSaveClicked}
                                fieldAttributes={getFieldAttributes(attributes, LeaseContractCollateralsFieldPaths.PAID_DATE)}
                                name={`${change}.paid_date`}
                                overrideValues={{label: LeaseContractCollateralsFieldTitles.PAID_DATE}}
                              />
                            </Authorization>
                          </Column>
                        </Row>
                        <Row>
                          <Column small={6} medium={4} large={2}>
                            <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractCollateralsFieldPaths.RETURNED_DATE)}>
                              <FormField
                                disableTouched={isSaveClicked}
                                fieldAttributes={getFieldAttributes(attributes, LeaseContractCollateralsFieldPaths.RETURNED_DATE)}
                                name={`${change}.returned_date`}
                                overrideValues={{label: LeaseContractCollateralsFieldTitles.RETURNED_DATE}}
                              />
                            </Authorization>
                          </Column>
                          <Column small={6} medium={8} large={10}>
                            <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractCollateralsFieldPaths.NOTE)}>
                              <FormField
                                disableTouched={isSaveClicked}
                                fieldAttributes={getFieldAttributes(attributes, LeaseContractCollateralsFieldPaths.NOTE)}
                                name={`${change}.note`}
                                overrideValues={{label: LeaseContractCollateralsFieldTitles.NOTE}}
                              />
                            </Authorization>
                          </Column>
                        </Row>
                      </BoxContentWrapper>
                    </BoxItem>
                  );
                })}
              </BoxItemContainer>
            }

            <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.ADD_COLLATERAL)}>
              <Row>
                <Column>
                  <AddButtonSecondary
                    label='Lisää vakuus'
                    onClick={handleAdd}
                    style={{marginTop: !fields.length ? 0 : undefined}}
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

type Props = {
  attributes: Attributes,
  collateralsCollapseState: boolean,
  contractCollapseState: boolean,
  contractChangesCollapseState: boolean,
  contractFileMethods: Methods,
  contractId: number,
  currentLease: Lease,
  decisionOptions: Array<Object>,
  errors: Object,
  field: string,
  isSaveClicked: boolean,
  onRemove: Function,
  onShowContractFileModal: Function,
  receiveCollapseStates: Function,
  savedContracts: Array<Object>,
  usersPermissions: UsersPermissionsType,
}

const ContractItemEdit = ({
  attributes,
  collateralsCollapseState,
  contractCollapseState,
  contractChangesCollapseState,
  contractFileMethods,
  contractId,
  currentLease,
  decisionOptions,
  errors,
  field,
  isSaveClicked,
  onRemove,
  onShowContractFileModal,
  receiveCollapseStates,
  savedContracts,
  usersPermissions,
}: Props) => {
  const getContractById = (id: number) => id ? savedContracts.find((decision) => decision.id === id) : {};

  const getContractTitle = (contract: ?Object) =>
    contract ? `${getLabelOfOption(typeOptions, contract.type) || '-'} ${contract.contract_number || ''}` : null;

  const handleCollapseToggle = (val: boolean, field: string) => {
    if(!contractId) return;

    receiveCollapseStates({
      [ViewModes.EDIT]: {
        [FormNames.CONTRACTS]: {
          [contractId]: {
            [field]: val,
          },
        },
      },
    });
  };

  const handleCollateralsCollapseToggle = (val: boolean) => {
    handleCollapseToggle(val, 'collaterals');
  };

  const handleContractCollapseToggle = (val: boolean) => {
    handleCollapseToggle(val, 'contract');
  };

  const handleContractChangesCollapseToggle = (val: boolean) => {
    handleCollapseToggle(val, 'contract_changes');
  };

  const decisionReadOnlyRenderer = (value) => {
    return <DecisionLink
      decision={getDecisionById(currentLease, value)}
      decisionOptions={decisionOptions}
    />;
  };

  const contractNumberReadOnlyRenderer = (value) => {
    const handleShowContractFileModal = () => {
      onShowContractFileModal(value);
    };

    return <FormText>{value
      ? <Authorization
        allow={contractFileMethods.GET}
        errorComponent={value}
      >
        <a onClick={handleShowContractFileModal}>{value}</a>
      </Authorization>
      : '-'}</FormText>;
  };

  const typeOptions = getFieldOptions(attributes, LeaseContractsFieldPaths.TYPE),
    contractErrors = get(errors, field),
    savedContract = getContractById(contractId);

  return (
    <Collapse
      defaultOpen={contractCollapseState !== undefined ? contractCollapseState : true}
      hasErrors={isSaveClicked && !isEmpty(contractErrors)}
      headerSubtitles={savedContract &&
        <Fragment>
          <Column>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractsFieldPaths.SIGNING_DATE)}>
              <CollapseHeaderSubtitle>{formatDate(savedContract.signing_date) || '-'}</CollapseHeaderSubtitle>
            </Authorization>
          </Column>
        </Fragment>
      }
      headerTitle={
        <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractsFieldPaths.TYPE)}>
          {getContractTitle(savedContract) || '-'}
        </Authorization>
      }
      onRemove={hasPermissions(usersPermissions, UsersPermissions.DELETE_CONTRACT) ? onRemove : null}
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
                readOnlyValueRenderer={contractNumberReadOnlyRenderer}
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
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractsFieldPaths.SIGN_BY_DATE)}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(attributes, LeaseContractsFieldPaths.SIGN_BY_DATE)}
                name={`${field}.sign_by_date`}
                overrideValues={{label: LeaseContractsFieldTitles.SIGN_BY_DATE}}
              />
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractsFieldPaths.FIRST_CALL_SENT)}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(attributes, LeaseContractsFieldPaths.FIRST_CALL_SENT)}
                name={`${field}.first_call_sent`}
                overrideValues={{label: LeaseContractsFieldTitles.FIRST_CALL_SENT}}
              />
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractsFieldPaths.SECOND_CALL_SENT)}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(attributes, LeaseContractsFieldPaths.SECOND_CALL_SENT)}
                name={`${field}.second_call_sent`}
                overrideValues={{label: LeaseContractsFieldTitles.SECOND_CALL_SENT}}
              />
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractsFieldPaths.THIRD_CALL_SENT)}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(attributes, LeaseContractsFieldPaths.THIRD_CALL_SENT)}
                name={`${field}.third_call_sent`}
                overrideValues={{label: LeaseContractsFieldTitles.THIRD_CALL_SENT}}
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
                readOnlyValueRenderer={decisionReadOnlyRenderer}
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
      </BoxContentWrapper>

      <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractChangesFieldPaths.CONTRACT_CHANGES)}>
        <FieldArray
          attributes={attributes}
          collapseState={contractChangesCollapseState}
          component={renderContractChanges}
          currentLease={currentLease}
          decisionOptions={decisionOptions}
          errors={errors}
          name={`${field}.contract_changes`}
          isSaveClicked={isSaveClicked}
          onCollapseToggle={handleContractChangesCollapseToggle}
          title={LeaseContractChangesFieldTitles.CONTRACT_CHANGES}
          usersPermissions={usersPermissions}
        />
      </Authorization>

      <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractCollateralsFieldPaths.COLLATRALS)}>
        <FieldArray
          attributes={attributes}
          collapseState={collateralsCollapseState}
          component={renderCollaterals}
          errors={errors}
          name={`${field}.collaterals`}
          isSaveClicked={isSaveClicked}
          onCollapseToggle={handleCollateralsCollapseToggle}
          title={LeaseContractCollateralsFieldTitles.COLLATRALS}
          usersPermissions={usersPermissions}
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
    const newState: any = {
      attributes: getAttributes(state),
      contractFileMethods: getContractFileMethods(state),
      contractId: id,
      currentLease: getCurrentLease(state),
      errors: getErrorsByFormName(state, formName),
      isSaveClicked: getIsSaveClicked(state),
      usersPermissions: getUsersPermissions(state),
    };

    if(id) {
      newState.collateralsCollapseState = getCollapseStateByKey(state, `${ViewModes.EDIT}.${formName}.${id}.collaterals`);
      newState.contractCollapseState = getCollapseStateByKey(state, `${ViewModes.EDIT}.${formName}.${id}.contract`);
      newState.contractChangesCollapseState = getCollapseStateByKey(state, `${ViewModes.EDIT}.${formName}.${id}.contract_changes`);
    }

    return newState;
  },
  {
    receiveCollapseStates,
  }
)(ContractItemEdit);
