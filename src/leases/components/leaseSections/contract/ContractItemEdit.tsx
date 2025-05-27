import React, { Component, Fragment, ReactElement } from "react";
import { connect } from "react-redux";
import { FieldArray, formValueSelector } from "redux-form";
import { Row, Column } from "react-foundation";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { ActionTypes, AppConsumer } from "@/app/AppContext";
import ActionButtonWrapper from "@/components/form/ActionButtonWrapper";
import AddButtonSecondary from "@/components/form/AddButtonSecondary";
import Authorization from "@/components/authorization/Authorization";
import BoxContentWrapper from "@/components/content/BoxContentWrapper";
import BoxItem from "@/components/content/BoxItem";
import BoxItemContainer from "@/components/content/BoxItemContainer";
import Collapse from "@/components/collapse/Collapse";
import CollapseHeaderSubtitle from "@/components/collapse/CollapseHeaderSubtitle";
import CollateralEdit from "./CollateralEdit";
import DecisionLink from "@/components/links/DecisionLink";
import FormFieldLegacy from "@/components/form/FormFieldLegacy";
import FormText from "@/components/form/FormText";
import FormTextTitle from "@/components/form/FormTextTitle";
import KtjLink from "@/components/ktj/KtjLink";
import RemoveButton from "@/components/form/RemoveButton";
import {
  receiveCollapseStates,
  fetchLeasesForContractNumber,
} from "@/leases/actions";
import { ConfirmationModalTexts, FieldTypes, FormNames, ViewModes } from "@/enums";
import { ButtonColors } from "@/components/enums";
import {
  LeaseContractChangesFieldPaths,
  LeaseContractChangesFieldTitles,
  LeaseContractCollateralsFieldPaths,
  LeaseContractCollateralsFieldTitles,
  LeaseContractsFieldPaths,
  LeaseContractsFieldTitles,
} from "@/leases/enums";
import { UsersPermissions } from "@/usersPermissions/enums";
import { getDecisionById, getLeasesWithContractNumber } from "@/leases/helpers";
import { getUiDataLeaseKey } from "@/uiData/helpers";
import {
  formatDate,
  getFieldAttributes,
  getFieldOptions,
  getLabelOfOption,
  hasPermissions,
  isFieldAllowedToRead,
} from "@/util/helpers";
import {
  getAttributes,
  getCollapseStateByKey,
  getCurrentLease,
  getErrorsByFormName,
  getIsSaveClicked,
  getIsFetchingLeasesForContractNumbers,
  getLeasesForContractNumbers,
} from "@/leases/selectors";
import { getUsersPermissions } from "@/usersPermissions/selectors";
import WarningContainer from "@/components/content/WarningContainer";
import WarningField from "@/components/form/WarningField";
import type { Attributes } from "types";
import type { Lease, LeaseList } from "@/leases/types";
import type { UsersPermissions as UsersPermissionsType } from "@/usersPermissions/types";
type ContractChangesProps = {
  attributes: Attributes;
  collapseState: boolean;
  currentLease: Lease;
  decisionOptions: Array<Record<string, any>>;
  errors: Record<string, any> | null | undefined;
  fields: any;
  isSaveClicked: boolean;
  onCollapseToggle: (...args: Array<any>) => any;
  title: string;
  usersPermissions: UsersPermissionsType;
};

const renderContractChanges = ({
  attributes,
  collapseState,
  currentLease,
  decisionOptions,
  errors,
  fields,
  fields: { name },
  isSaveClicked,
  onCollapseToggle,
  title,
  usersPermissions,
}: ContractChangesProps): ReactElement => {
  const handleCollapseToggle = (val) => {
    onCollapseToggle(val);
  };

  const handleAdd = () => {
    fields.push({});
  };

  const decisionReadOnlyRenderer = (value) => {
    return (
      <DecisionLink
        decision={getDecisionById(currentLease, value)}
        decisionOptions={decisionOptions}
      />
    );
  };

  const contractChangeErrors = get(errors, name);
  return (
    <AppConsumer>
      {({ dispatch }) => {
        return (
          <Collapse
            className="collapse__secondary"
            defaultOpen={collapseState !== undefined ? collapseState : true}
            hasErrors={isSaveClicked && !isEmpty(contractChangeErrors)}
            headerTitle={title}
            onToggle={handleCollapseToggle}
            enableUiDataEdit
            uiDataKey={getUiDataLeaseKey(
              LeaseContractChangesFieldPaths.CONTRACT_CHANGES,
            )}
          >
            {!hasPermissions(
              usersPermissions,
              UsersPermissions.ADD_CONTRACTCHANGE,
            ) &&
              (!fields || !fields.length) && (
                <FormText>Ei sopimuksen muutoksia</FormText>
              )}
            {!!fields && !!fields.length && (
              <BoxItemContainer>
                {fields &&
                  !!fields.length &&
                  fields.map((change, index) => {
                    const handleRemove = () => {
                      dispatch({
                        type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                        confirmationFunction: () => {
                          fields.remove(index);
                        },
                        confirmationModalButtonClassName: ButtonColors.ALERT,
                        confirmationModalButtonText:
                          ConfirmationModalTexts.DELETE_CONTRACT_CHANGE.BUTTON,
                        confirmationModalLabel:
                          ConfirmationModalTexts.DELETE_CONTRACT_CHANGE.LABEL,
                        confirmationModalTitle:
                          ConfirmationModalTexts.DELETE_CONTRACT_CHANGE.TITLE,
                      });
                    };

                    return (
                      <BoxItem key={index}>
                        <BoxContentWrapper>
                          <ActionButtonWrapper>
                            <Authorization
                              allow={hasPermissions(
                                usersPermissions,
                                UsersPermissions.DELETE_CONTRACTCHANGE,
                              )}
                            >
                              <RemoveButton
                                onClick={handleRemove}
                                title="Poista sopimuksen muutos"
                              />
                            </Authorization>
                          </ActionButtonWrapper>

                          <Row>
                            <Column small={6} medium={4} large={2}>
                              <Authorization
                                allow={isFieldAllowedToRead(
                                  attributes,
                                  LeaseContractChangesFieldPaths.SIGNING_DATE,
                                )}
                              >
                                <FormFieldLegacy
                                  disableTouched={isSaveClicked}
                                  fieldAttributes={getFieldAttributes(
                                    attributes,
                                    LeaseContractChangesFieldPaths.SIGNING_DATE,
                                  )}
                                  name={`${change}.signing_date`}
                                  overrideValues={{
                                    label:
                                      LeaseContractChangesFieldTitles.SIGNING_DATE,
                                  }}
                                  enableUiDataEdit
                                  uiDataKey={getUiDataLeaseKey(
                                    LeaseContractChangesFieldPaths.SIGNING_DATE,
                                  )}
                                />
                              </Authorization>
                            </Column>
                            <Column small={6} medium={4} large={2}>
                              <Authorization
                                allow={isFieldAllowedToRead(
                                  attributes,
                                  LeaseContractChangesFieldPaths.SIGN_BY_DATE,
                                )}
                              >
                                <FormFieldLegacy
                                  disableTouched={isSaveClicked}
                                  fieldAttributes={getFieldAttributes(
                                    attributes,
                                    LeaseContractChangesFieldPaths.SIGN_BY_DATE,
                                  )}
                                  name={`${change}.sign_by_date`}
                                  overrideValues={{
                                    label:
                                      LeaseContractChangesFieldTitles.SIGN_BY_DATE,
                                  }}
                                  enableUiDataEdit
                                  uiDataKey={getUiDataLeaseKey(
                                    LeaseContractChangesFieldPaths.SIGN_BY_DATE,
                                  )}
                                />
                              </Authorization>
                            </Column>
                            <Column small={6} medium={4} large={2}>
                              <Authorization
                                allow={isFieldAllowedToRead(
                                  attributes,
                                  LeaseContractChangesFieldPaths.FIRST_CALL_SENT,
                                )}
                              >
                                <FormFieldLegacy
                                  disableTouched={isSaveClicked}
                                  fieldAttributes={getFieldAttributes(
                                    attributes,
                                    LeaseContractChangesFieldPaths.FIRST_CALL_SENT,
                                  )}
                                  name={`${change}.first_call_sent`}
                                  overrideValues={{
                                    label:
                                      LeaseContractChangesFieldTitles.FIRST_CALL_SENT,
                                  }}
                                  enableUiDataEdit
                                  uiDataKey={getUiDataLeaseKey(
                                    LeaseContractChangesFieldPaths.FIRST_CALL_SENT,
                                  )}
                                />
                              </Authorization>
                            </Column>
                            <Column small={6} medium={4} large={2}>
                              <Authorization
                                allow={isFieldAllowedToRead(
                                  attributes,
                                  LeaseContractChangesFieldPaths.SECOND_CALL_SENT,
                                )}
                              >
                                <FormFieldLegacy
                                  disableTouched={isSaveClicked}
                                  fieldAttributes={getFieldAttributes(
                                    attributes,
                                    LeaseContractChangesFieldPaths.SECOND_CALL_SENT,
                                  )}
                                  name={`${change}.second_call_sent`}
                                  overrideValues={{
                                    label:
                                      LeaseContractChangesFieldTitles.SECOND_CALL_SENT,
                                  }}
                                  enableUiDataEdit
                                  uiDataKey={getUiDataLeaseKey(
                                    LeaseContractChangesFieldPaths.SECOND_CALL_SENT,
                                  )}
                                />
                              </Authorization>
                            </Column>
                            <Column small={6} medium={4} large={2}>
                              <Authorization
                                allow={isFieldAllowedToRead(
                                  attributes,
                                  LeaseContractChangesFieldPaths.THIRD_CALL_SENT,
                                )}
                              >
                                <FormFieldLegacy
                                  disableTouched={isSaveClicked}
                                  fieldAttributes={getFieldAttributes(
                                    attributes,
                                    LeaseContractChangesFieldPaths.THIRD_CALL_SENT,
                                  )}
                                  name={`${change}.third_call_sent`}
                                  overrideValues={{
                                    label:
                                      LeaseContractChangesFieldTitles.THIRD_CALL_SENT,
                                  }}
                                  enableUiDataEdit
                                  uiDataKey={getUiDataLeaseKey(
                                    LeaseContractChangesFieldPaths.THIRD_CALL_SENT,
                                  )}
                                />
                              </Authorization>
                            </Column>
                            <Column small={6} medium={4} large={2}>
                              <Authorization
                                allow={isFieldAllowedToRead(
                                  attributes,
                                  LeaseContractChangesFieldPaths.THIRD_CALL_SENT,
                                )}
                              >
                                <FormFieldLegacy
                                  disableTouched={isSaveClicked}
                                  fieldAttributes={getFieldAttributes(
                                    attributes,
                                    LeaseContractChangesFieldPaths.EXECUTOR,
                                  )}
                                  name={`${change}.executor`}
                                  overrideValues={{
                                    fieldType: FieldTypes.USER,
                                    label:
                                      LeaseContractChangesFieldTitles.EXECUTOR,
                                  }}
                                  enableUiDataEdit
                                  uiDataKey={getUiDataLeaseKey(
                                    LeaseContractChangesFieldPaths.EXECUTOR,
                                  )}
                                />
                              </Authorization>
                            </Column>
                          </Row>
                          <Row>
                            <Column small={6} medium={4} large={2}>
                              <Authorization
                                allow={isFieldAllowedToRead(
                                  attributes,
                                  LeaseContractChangesFieldPaths.DECISION,
                                )}
                              >
                                <FormFieldLegacy
                                  disableTouched={isSaveClicked}
                                  fieldAttributes={getFieldAttributes(
                                    attributes,
                                    LeaseContractChangesFieldPaths.DECISION,
                                  )}
                                  name={`${change}.decision`}
                                  readOnlyValueRenderer={
                                    decisionReadOnlyRenderer
                                  }
                                  overrideValues={{
                                    label:
                                      LeaseContractChangesFieldTitles.DECISION,
                                    options: decisionOptions,
                                  }}
                                  enableUiDataEdit
                                  uiDataKey={getUiDataLeaseKey(
                                    LeaseContractChangesFieldPaths.DECISION,
                                  )}
                                />
                              </Authorization>
                            </Column>
                            <Column small={6} medium={8} large={10}>
                              <Authorization
                                allow={isFieldAllowedToRead(
                                  attributes,
                                  LeaseContractChangesFieldPaths.DESCRIPTION,
                                )}
                              >
                                <FormFieldLegacy
                                  disableTouched={isSaveClicked}
                                  fieldAttributes={getFieldAttributes(
                                    attributes,
                                    LeaseContractChangesFieldPaths.DESCRIPTION,
                                  )}
                                  name={`${change}.description`}
                                  overrideValues={{
                                    label:
                                      LeaseContractChangesFieldTitles.DESCRIPTION,
                                  }}
                                  enableUiDataEdit
                                  uiDataKey={getUiDataLeaseKey(
                                    LeaseContractChangesFieldPaths.DESCRIPTION,
                                  )}
                                />
                              </Authorization>
                            </Column>
                          </Row>
                        </BoxContentWrapper>
                      </BoxItem>
                    );
                  })}
              </BoxItemContainer>
            )}

            <Authorization
              allow={hasPermissions(
                usersPermissions,
                UsersPermissions.ADD_CONTRACTCHANGE,
              )}
            >
              <Row>
                <Column>
                  <AddButtonSecondary
                    label="Lisää sopimuksen muutos"
                    onClick={handleAdd}
                    style={{
                      marginTop: !fields.length ? 0 : undefined,
                    }}
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
  collapseState: boolean;
  errors: Record<string, any> | null | undefined;
  fields: any;
  isSaveClicked: boolean;
  onCollapseToggle: (...args: Array<any>) => any;
  title: string;
  usersPermissions: UsersPermissionsType;
};

const renderCollaterals = ({
  collapseState,
  errors,
  fields,
  fields: { name },
  isSaveClicked,
  onCollapseToggle,
  title,
  usersPermissions,
}: CollateralsProps): ReactElement => {
  const handleCollapseToggle = (val) => {
    onCollapseToggle(val);
  };

  const handleAdd = () => {
    fields.push({});
  };

  const collateralsErrors = get(errors, name);
  return (
    <AppConsumer>
      {({ dispatch }) => {
        return (
          <Collapse
            className="collapse__secondary"
            defaultOpen={collapseState !== undefined ? collapseState : true}
            hasErrors={isSaveClicked && !isEmpty(collateralsErrors)}
            headerTitle={title}
            onToggle={handleCollapseToggle}
            enableUiDataEdit
            uiDataKey={getUiDataLeaseKey(
              LeaseContractCollateralsFieldPaths.COLLATRALS,
            )}
          >
            {!hasPermissions(
              usersPermissions,
              UsersPermissions.ADD_COLLATERAL,
            ) &&
              (!fields || !fields.length) && <FormText>Ei vakuuksia</FormText>}

            {!!fields.length && (
              <BoxItemContainer>
                {fields &&
                  !!fields.length &&
                  fields.map((field, index) => {
                    const handleRemove = () => {
                      dispatch({
                        type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                        confirmationFunction: () => {
                          fields.remove(index);
                        },
                        confirmationModalButtonClassName: ButtonColors.ALERT,
                        confirmationModalButtonText:
                          ConfirmationModalTexts.DELETE_COLLATERAL.BUTTON,
                        confirmationModalLabel:
                          ConfirmationModalTexts.DELETE_COLLATERAL.LABEL,
                        confirmationModalTitle:
                          ConfirmationModalTexts.DELETE_COLLATERAL.TITLE,
                      });
                    };

                    return (
                      <CollateralEdit
                        key={index}
                        field={field}
                        onRemove={handleRemove}
                      />
                    );
                  })}
              </BoxItemContainer>
            )}

            <Authorization
              allow={hasPermissions(
                usersPermissions,
                UsersPermissions.ADD_COLLATERAL,
              )}
            >
              <Row>
                <Column>
                  <AddButtonSecondary
                    label="Lisää vakuus"
                    onClick={handleAdd}
                    style={{
                      marginTop: !fields.length ? 0 : undefined,
                    }}
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
  attributes: Attributes;
  collateralsCollapseState: boolean;
  contractCollapseState: boolean;
  contractChangesCollapseState: boolean;
  contractId: number;
  currentLease: Lease;
  decisionOptions: Array<Record<string, any>>;
  errors: Record<string, any>;
  field: string;
  isSaveClicked: boolean;
  onRemove: (...args: Array<any>) => any;
  onShowContractFileModal: (...args: Array<any>) => any;
  receiveCollapseStates: (...args: Array<any>) => any;
  savedContracts: Array<Record<string, any>>;
  usersPermissions: UsersPermissionsType;
  contract: Record<string, any>;
  contractNumber: string;
  fetchLeasesForContractNumber: (...args: Array<any>) => any;
  isFetchingLeasesForContractNumbers: boolean;
  leasesForContractNumbers: LeaseList;
};

class ContractItemEdit extends Component<Props> {
  componentDidUpdate(prevProps: Props) {
    const { contractNumber, fetchLeasesForContractNumber, contract } =
      this.props;

    if (
      contractNumber &&
      prevProps.contractNumber !== contractNumber &&
      contract &&
      contractNumber !== contract.contract_number
    ) {
      fetchLeasesForContractNumber({
        contract_number: contractNumber,
      });
    }

    if (
      !contract &&
      contractNumber &&
      prevProps.contractNumber !== contractNumber
    ) {
      fetchLeasesForContractNumber({
        contract_number: contractNumber,
      });
    }
  }

  render() {
    const {
      attributes,
      collateralsCollapseState,
      contractCollapseState,
      contractChangesCollapseState,
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
      contract,
      leasesForContractNumbers,
      contractNumber,
    } = this.props;

    const getContractById = (id: number) =>
      id ? savedContracts.find((decision) => decision.id === id) : {};

    const getContractTitle = (
      contract: Record<string, any> | null | undefined,
    ) =>
      contract
        ? `${getLabelOfOption(typeOptions, contract.type) || "-"} ${contract.contract_number || ""}`
        : null;

    const handleCollapseToggle = (val: boolean, field: string) => {
      if (!contractId) return;
      receiveCollapseStates({
        [ViewModes.EDIT]: {
          [FormNames.LEASE_CONTRACTS]: {
            [contractId]: {
              [field]: val,
            },
          },
        },
      });
    };

    const handleCollateralsCollapseToggle = (val: boolean) => {
      handleCollapseToggle(val, "collaterals");
    };

    const handleContractCollapseToggle = (val: boolean) => {
      handleCollapseToggle(val, "contract");
    };

    const handleContractChangesCollapseToggle = (val: boolean) => {
      handleCollapseToggle(val, "contract_changes");
    };

    const decisionReadOnlyRenderer = (value) => {
      return (
        <DecisionLink
          decision={getDecisionById(currentLease, value)}
          decisionOptions={decisionOptions}
        />
      );
    };

    const contractNumberReadOnlyRenderer = (value) => {
      const handleShowContractFileModal = () => {
        onShowContractFileModal(value);
      };

      return (
        <FormText>
          {value ? <a onClick={handleShowContractFileModal}>{value}</a> : "-"}
        </FormText>
      );
    };

    const typeOptions = getFieldOptions(
        attributes,
        LeaseContractsFieldPaths.TYPE,
      ),
      contractErrors = get(errors, field),
      savedContract = getContractById(contractId);
    const leasesWithContractNumber = getLeasesWithContractNumber(
      leasesForContractNumbers,
    );
    return (
      <Collapse
        defaultOpen={
          contractCollapseState !== undefined ? contractCollapseState : true
        }
        hasErrors={isSaveClicked && !isEmpty(contractErrors)}
        headerSubtitles={
          savedContract && (
            <Fragment>
              <Column>
                <Authorization
                  allow={isFieldAllowedToRead(
                    attributes,
                    LeaseContractsFieldPaths.SIGNING_DATE,
                  )}
                >
                  <CollapseHeaderSubtitle>
                    {formatDate(savedContract.signing_date) || "-"}
                  </CollapseHeaderSubtitle>
                </Authorization>
              </Column>
            </Fragment>
          )
        }
        headerTitle={
          <Authorization
            allow={isFieldAllowedToRead(
              attributes,
              LeaseContractsFieldPaths.TYPE,
            )}
          >
            {getContractTitle(savedContract) || "-"}
          </Authorization>
        }
        onRemove={
          hasPermissions(usersPermissions, UsersPermissions.DELETE_CONTRACT)
            ? onRemove
            : null
        }
        onToggle={handleContractCollapseToggle}
      >
        <BoxContentWrapper>
          <Row>
            <Column small={6} medium={4} large={2}>
              <Authorization
                allow={isFieldAllowedToRead(
                  attributes,
                  LeaseContractsFieldPaths.TYPE,
                )}
              >
                <FormFieldLegacy
                  disableTouched={isSaveClicked}
                  fieldAttributes={getFieldAttributes(
                    attributes,
                    LeaseContractsFieldPaths.TYPE,
                  )}
                  name={`${field}.type`}
                  overrideValues={{
                    label: LeaseContractsFieldTitles.TYPE,
                  }}
                  enableUiDataEdit
                  uiDataKey={getUiDataLeaseKey(LeaseContractsFieldPaths.TYPE)}
                />
              </Authorization>
            </Column>
            <Column small={6} medium={4} large={4}>
              <Authorization
                allow={isFieldAllowedToRead(
                  attributes,
                  LeaseContractsFieldPaths.CONTRACT_NUMBER,
                )}
              >
                <>
                  {contractNumber &&
                    leasesWithContractNumber &&
                    contract &&
                    contractNumber !== contract.contract_number && (
                      <WarningContainer>
                        <WarningField
                          meta={{
                            warning: "Sopimusnumero käytössä!",
                          }}
                          showWarning={true}
                        />
                      </WarningContainer>
                    )}
                  {!contract && contractNumber && leasesWithContractNumber && (
                    <WarningContainer>
                      <WarningField
                        meta={{
                          warning: "Sopimusnumero käytössä!",
                        }}
                        showWarning={true}
                      />
                    </WarningContainer>
                  )}
                  <FormFieldLegacy
                    disableTouched={isSaveClicked}
                    fieldAttributes={getFieldAttributes(
                      attributes,
                      LeaseContractsFieldPaths.CONTRACT_NUMBER,
                    )}
                    name={`${field}.contract_number`}
                    readOnlyValueRenderer={contractNumberReadOnlyRenderer}
                    overrideValues={{
                      label: LeaseContractsFieldTitles.CONTRACT_NUMBER,
                    }}
                    enableUiDataEdit
                    uiDataKey={getUiDataLeaseKey(
                      LeaseContractsFieldPaths.CONTRACT_NUMBER,
                    )}
                  />
                </>
              </Authorization>
            </Column>
            <Column small={6} medium={4} large={2}>
              <Authorization
                allow={isFieldAllowedToRead(
                  attributes,
                  LeaseContractsFieldPaths.SIGNING_DATE,
                )}
              >
                <FormFieldLegacy
                  disableTouched={isSaveClicked}
                  fieldAttributes={getFieldAttributes(
                    attributes,
                    LeaseContractsFieldPaths.SIGNING_DATE,
                  )}
                  name={`${field}.signing_date`}
                  overrideValues={{
                    label: LeaseContractsFieldTitles.SIGNING_DATE,
                  }}
                  enableUiDataEdit
                  uiDataKey={getUiDataLeaseKey(
                    LeaseContractsFieldPaths.SIGNING_DATE,
                  )}
                />
              </Authorization>
            </Column>
          </Row>
          <Row>
            <Column small={6} medium={4} large={2}>
              <Authorization
                allow={isFieldAllowedToRead(
                  attributes,
                  LeaseContractsFieldPaths.SIGN_BY_DATE,
                )}
              >
                <FormFieldLegacy
                  disableTouched={isSaveClicked}
                  fieldAttributes={getFieldAttributes(
                    attributes,
                    LeaseContractsFieldPaths.SIGN_BY_DATE,
                  )}
                  name={`${field}.sign_by_date`}
                  overrideValues={{
                    label: LeaseContractsFieldTitles.SIGN_BY_DATE,
                  }}
                  enableUiDataEdit
                  uiDataKey={getUiDataLeaseKey(
                    LeaseContractsFieldPaths.SIGN_BY_DATE,
                  )}
                />
              </Authorization>
            </Column>
            <Column small={6} medium={4} large={2}>
              <Authorization
                allow={isFieldAllowedToRead(
                  attributes,
                  LeaseContractsFieldPaths.FIRST_CALL_SENT,
                )}
              >
                <FormFieldLegacy
                  disableTouched={isSaveClicked}
                  fieldAttributes={getFieldAttributes(
                    attributes,
                    LeaseContractsFieldPaths.FIRST_CALL_SENT,
                  )}
                  name={`${field}.first_call_sent`}
                  overrideValues={{
                    label: LeaseContractsFieldTitles.FIRST_CALL_SENT,
                  }}
                  enableUiDataEdit
                  uiDataKey={getUiDataLeaseKey(
                    LeaseContractsFieldPaths.FIRST_CALL_SENT,
                  )}
                />
              </Authorization>
            </Column>
            <Column small={6} medium={4} large={2}>
              <Authorization
                allow={isFieldAllowedToRead(
                  attributes,
                  LeaseContractsFieldPaths.SECOND_CALL_SENT,
                )}
              >
                <FormFieldLegacy
                  disableTouched={isSaveClicked}
                  fieldAttributes={getFieldAttributes(
                    attributes,
                    LeaseContractsFieldPaths.SECOND_CALL_SENT,
                  )}
                  name={`${field}.second_call_sent`}
                  overrideValues={{
                    label: LeaseContractsFieldTitles.SECOND_CALL_SENT,
                  }}
                  enableUiDataEdit
                  uiDataKey={getUiDataLeaseKey(
                    LeaseContractsFieldPaths.SECOND_CALL_SENT,
                  )}
                />
              </Authorization>
            </Column>
            <Column small={6} medium={4} large={2}>
              <Authorization
                allow={isFieldAllowedToRead(
                  attributes,
                  LeaseContractsFieldPaths.THIRD_CALL_SENT,
                )}
              >
                <FormFieldLegacy
                  disableTouched={isSaveClicked}
                  fieldAttributes={getFieldAttributes(
                    attributes,
                    LeaseContractsFieldPaths.THIRD_CALL_SENT,
                  )}
                  name={`${field}.third_call_sent`}
                  overrideValues={{
                    label: LeaseContractsFieldTitles.THIRD_CALL_SENT,
                  }}
                  enableUiDataEdit
                  uiDataKey={getUiDataLeaseKey(
                    LeaseContractsFieldPaths.THIRD_CALL_SENT,
                  )}
                />
              </Authorization>
            </Column>
          </Row>
          <Row>
            {contract
              ? contract.is_readjustment_decision && (
                  <Column small={6} medium={4} large={2}>
                    <Authorization
                      allow={isFieldAllowedToRead(
                        attributes,
                        LeaseContractsFieldPaths.IS_READJUSTMENT_DECISION,
                      )}
                    >
                      <FormFieldLegacy
                        disableTouched={isSaveClicked}
                        fieldAttributes={getFieldAttributes(
                          attributes,
                          LeaseContractsFieldPaths.IS_READJUSTMENT_DECISION,
                        )}
                        name={`${field}.is_readjustment_decision`}
                        overrideValues={{
                          label:
                            LeaseContractsFieldTitles.IS_READJUSTMENT_DECISION,
                        }}
                        enableUiDataEdit
                        uiDataKey={getUiDataLeaseKey(
                          LeaseContractsFieldPaths.IS_READJUSTMENT_DECISION,
                        )}
                      />
                    </Authorization>
                  </Column>
                )
              : null}
            <Column small={6} medium={4} large={2}>
              <Authorization
                allow={isFieldAllowedToRead(
                  attributes,
                  LeaseContractsFieldPaths.INSTITUTION_IDENTIFIER,
                )}
              >
                <FormFieldLegacy
                  disableTouched={isSaveClicked}
                  fieldAttributes={getFieldAttributes(
                    attributes,
                    LeaseContractsFieldPaths.INSTITUTION_IDENTIFIER,
                  )}
                  name={`${field}.institution_identifier`}
                  overrideValues={{
                    label: LeaseContractsFieldTitles.INSTITUTION_IDENTIFIER,
                  }}
                  enableUiDataEdit
                  uiDataKey={getUiDataLeaseKey(
                    LeaseContractsFieldPaths.INSTITUTION_IDENTIFIER,
                  )}
                />
              </Authorization>
            </Column>
            <Column small={6} medium={4} large={2}>
              <Authorization
                allow={isFieldAllowedToRead(
                  attributes,
                  LeaseContractsFieldPaths.DECISION,
                )}
              >
                <FormFieldLegacy
                  disableTouched={isSaveClicked}
                  fieldAttributes={getFieldAttributes(
                    attributes,
                    LeaseContractsFieldPaths.DECISION,
                  )}
                  name={`${field}.decision`}
                  readOnlyValueRenderer={decisionReadOnlyRenderer}
                  overrideValues={{
                    label: LeaseContractsFieldTitles.DECISION,
                    options: decisionOptions,
                  }}
                  enableUiDataEdit
                  uiDataKey={getUiDataLeaseKey(
                    LeaseContractsFieldPaths.DECISION,
                  )}
                />
              </Authorization>
            </Column>
            <Column small={6} medium={4} large={2}>
              <Authorization
                allow={isFieldAllowedToRead(
                  attributes,
                  LeaseContractsFieldPaths.INSTITUTION_IDENTIFIER,
                )}
              >
                <>
                  <FormTextTitle
                    enableUiDataEdit
                    uiDataKey={getUiDataLeaseKey(
                      LeaseContractsFieldPaths.KTJ_LINK,
                    )}
                  >
                    {LeaseContractsFieldTitles.KTJ_LINK}
                  </FormTextTitle>
                  {savedContract && savedContract.institution_identifier ? (
                    <KtjLink
                      fileKey="vuokraoikeustodistus"
                      fileName="vuokraoikeustodistus"
                      identifier={savedContract.institution_identifier}
                      idKey="kohdetunnus"
                      label="Vuokraoikeustodistus"
                    />
                  ) : (
                    <FormText>-</FormText>
                  )}
                </>
              </Authorization>
            </Column>
            <Column small={6} medium={4} large={2}>
              <Authorization
                allow={isFieldAllowedToRead(
                  attributes,
                  LeaseContractsFieldPaths.KTJ_LINK,
                )}
              >
                <>
                  <FormTextTitle>
                    {LeaseContractsFieldTitles.ENCUMBRANCE}
                  </FormTextTitle>
                  {savedContract && savedContract.institution_identifier ? (
                    <KtjLink
                      fileKey="rasitustodistus"
                      fileName="rasitustodistus"
                      identifier={savedContract.institution_identifier}
                      idKey="kohdetunnus"
                      label="Rasitustodistus"
                    />
                  ) : (
                    <FormText>-</FormText>
                  )}
                </>
              </Authorization>
            </Column>
            <Column small={6} medium={4} large={2}>
              <Authorization
                allow={isFieldAllowedToRead(
                  attributes,
                  LeaseContractsFieldPaths.EXECUTOR,
                )}
              >
                <FormFieldLegacy
                  disableTouched={isSaveClicked}
                  fieldAttributes={getFieldAttributes(
                    attributes,
                    LeaseContractsFieldPaths.EXECUTOR,
                  )}
                  name={`${field}.executor`}
                  overrideValues={{
                    fieldType: FieldTypes.USER,
                    label: LeaseContractsFieldTitles.EXECUTOR,
                  }}
                  enableUiDataEdit
                  uiDataKey={getUiDataLeaseKey(LeaseContractsFieldPaths.EXECUTOR,)}
                />
              </Authorization>
            </Column>
          </Row>
          <Row>
            <Column small={12}>
              <Authorization
                allow={isFieldAllowedToRead(
                  attributes,
                  LeaseContractsFieldPaths.SIGNING_NOTE,
                )}
              >
                <FormFieldLegacy
                  disableTouched={isSaveClicked}
                  fieldAttributes={getFieldAttributes(
                    attributes,
                    LeaseContractsFieldPaths.SIGNING_NOTE,
                  )}
                  name={`${field}.signing_note`}
                  overrideValues={{
                    label: LeaseContractsFieldTitles.SIGNING_NOTE,
                  }}
                  enableUiDataEdit
                  uiDataKey={getUiDataLeaseKey(
                    LeaseContractsFieldPaths.SIGNING_NOTE,
                  )}
                />
              </Authorization>
            </Column>
          </Row>
        </BoxContentWrapper>

        <Authorization
          allow={isFieldAllowedToRead(
            attributes,
            LeaseContractChangesFieldPaths.CONTRACT_CHANGES,
          )}
        >
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

        <Authorization
          allow={isFieldAllowedToRead(
            attributes,
            LeaseContractCollateralsFieldPaths.COLLATRALS,
          )}
        >
          <FieldArray
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
  }
}

const formName = FormNames.LEASE_CONTRACTS;
const selector = formValueSelector(formName);
export default connect(
  (state, props: Props) => {
    const id = selector(state, `${props.field}.id`);
    const newState: any = {
      attributes: getAttributes(state),
      contractId: id,
      currentLease: getCurrentLease(state),
      errors: getErrorsByFormName(state, formName),
      isSaveClicked: getIsSaveClicked(state),
      usersPermissions: getUsersPermissions(state),
      contractNumber: selector(state, `${props.field}.contract_number`),
      isFetchingLeasesForContractNumbers:
        getIsFetchingLeasesForContractNumbers(state),
      leasesForContractNumbers: getLeasesForContractNumbers(state),
    };

    if (id) {
      newState.collateralsCollapseState = getCollapseStateByKey(
        state,
        `${ViewModes.EDIT}.${formName}.${id}.collaterals`,
      );
      newState.contractCollapseState = getCollapseStateByKey(
        state,
        `${ViewModes.EDIT}.${formName}.${id}.contract`,
      );
      newState.contractChangesCollapseState = getCollapseStateByKey(
        state,
        `${ViewModes.EDIT}.${formName}.${id}.contract_changes`,
      );
    }

    return newState;
  },
  {
    receiveCollapseStates,
    fetchLeasesForContractNumber,
  },
)(ContractItemEdit);
