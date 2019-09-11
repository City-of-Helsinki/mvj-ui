// @flow
import React, {Fragment} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import Authorization from '$components/authorization/Authorization';
import BoxItem from '$components/content/BoxItem';
import BoxItemContainer from '$components/content/BoxItemContainer';
import Collapse from '$components/collapse/Collapse';
import CollapseHeaderSubtitle from '$components/collapse/CollapseHeaderSubtitle';
import Collateral from './Collateral';
import DecisionLink from '$components/links/DecisionLink';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import KtjLink from '$components/ktj/KtjLink';
import {receiveCollapseStates} from '$src/leases/actions';
import {FormNames, ViewModes} from '$src/enums';
import {
  LeaseContractChangesFieldPaths,
  LeaseContractChangesFieldTitles,
  LeaseContractsFieldPaths,
  LeaseContractsFieldTitles,
  LeaseContractCollateralsFieldPaths,
  LeaseContractCollateralsFieldTitles,
} from '$src/leases/enums';
import {getDecisionById, getDecisionOptions} from '$src/leases/helpers';
import {getUiDataLeaseKey} from '$src/uiData/helpers';
import {
  formatDate,
  getFieldOptions,
  getLabelOfOption,
  isFieldAllowedToRead,
} from '$util/helpers';
import {getAttributes, getCollapseStateByKey, getCurrentLease} from '$src/leases/selectors';

import type {Attributes} from '$src/types';
import type {Lease} from '$src/leases/types';

const formName = FormNames.LEASE_CONTRACTS;

type Props = {
  attributes: Attributes,
  collateralsCollapseState: boolean,
  contract: Object,
  contractCollapseState: boolean,
  contractChangesCollapseState: boolean,
  currentLease: Lease,
  onShowContractFileModal: Function,
  receiveCollapseStates: Function,
  typeOptions: Array<Object>,
}

const ContractItem = ({
  attributes,
  collateralsCollapseState,
  contract,
  contractCollapseState,
  contractChangesCollapseState,
  currentLease,
  onShowContractFileModal,
  receiveCollapseStates,
  typeOptions,
}: Props) => {
  const handleCollapseToggle = (val: boolean, field: string) => {
    receiveCollapseStates({
      [ViewModes.READONLY]: {
        [formName]: {
          [contract.id]: {
            [field]: val,
          },
        },
      },
    });
  };
  const handleContractCollapseToggle = (val: boolean) => {
    handleCollapseToggle(val, 'contract');
  };

  const handleContractChangesCollapseToggle = (val: boolean) => {
    handleCollapseToggle(val, 'contract_changes');
  };

  const handleCollateralsCollapseToggle = (val: boolean) => {
    handleCollapseToggle(val, 'collaterals');
  };

  const handleShowContractFileModal = () => {
    onShowContractFileModal(contract.contract_number);
  };

  const decisionOptions = getDecisionOptions(currentLease);
  const decision = getDecisionById(currentLease, contract.decision);
  const collateralTypeOptions = getFieldOptions(attributes, LeaseContractCollateralsFieldPaths.TYPE);

  return (
    <Collapse
      defaultOpen={contractCollapseState !== undefined ? contractCollapseState : false}
      headerSubtitles={
        <Fragment>
          <Column>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractsFieldPaths.SIGNING_DATE)}>
              <CollapseHeaderSubtitle>{formatDate(contract.signing_date) || '-'}</CollapseHeaderSubtitle>
            </Authorization>
          </Column>
        </Fragment>
      }
      headerTitle={
        <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractsFieldPaths.TYPE)}>
          {getLabelOfOption(typeOptions, contract.type)} {get(contract, 'contract_number')}
        </Authorization>
      }
      onToggle={handleContractCollapseToggle}
    >
      <Row>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractsFieldPaths.TYPE)}>
            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseContractsFieldPaths.TYPE)}>
              {LeaseContractsFieldTitles.TYPE}
            </FormTextTitle>
            <FormText>{getLabelOfOption(typeOptions, contract.type) || '-'}</FormText>
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractsFieldPaths.CONTRACT_NUMBER)}>
            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseContractsFieldPaths.CONTRACT_NUMBER)}>
              {LeaseContractsFieldTitles.CONTRACT_NUMBER}
            </FormTextTitle>
            <FormText>{contract.contract_number
              ? <a onClick={handleShowContractFileModal}>{contract.contract_number}</a>
              : '-'}</FormText>
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractsFieldPaths.SIGNING_DATE)}>
            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseContractsFieldPaths.SIGNING_DATE)}>
              {LeaseContractsFieldTitles.SIGNING_DATE}
            </FormTextTitle>
            <FormText>{formatDate(contract.signing_date) || '–'}</FormText>
          </Authorization>
        </Column>
        <Column small={6} medium={12} large={6}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractsFieldPaths.SIGNING_NOTE)}>
            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseContractsFieldPaths.SIGNING_NOTE)}>
              {LeaseContractsFieldTitles.SIGNING_NOTE}
            </FormTextTitle>
            <FormText>{contract.signing_note || '–'}</FormText>
          </Authorization>
        </Column>
      </Row>
      <Row>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractsFieldPaths.SIGN_BY_DATE)}>
            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseContractsFieldPaths.SIGN_BY_DATE)}>
              {LeaseContractsFieldTitles.SIGN_BY_DATE}
            </FormTextTitle>
            <FormText>{formatDate(contract.sign_by_date) || '–'}</FormText>
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractsFieldPaths.FIRST_CALL_SENT)}>
            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseContractsFieldPaths.FIRST_CALL_SENT)}>
              {LeaseContractsFieldTitles.FIRST_CALL_SENT}
            </FormTextTitle>
            <FormText>{formatDate(contract.first_call_sent) || '–'}</FormText>
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractsFieldPaths.SECOND_CALL_SENT)}>
            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseContractsFieldPaths.SECOND_CALL_SENT)}>
              {LeaseContractsFieldTitles.SECOND_CALL_SENT}
            </FormTextTitle>
            <FormText>{formatDate(contract.second_call_sent) || '–'}</FormText>
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractsFieldPaths.THIRD_CALL_SENT)}>
            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseContractsFieldPaths.THIRD_CALL_SENT)}>
              {LeaseContractsFieldTitles.THIRD_CALL_SENT}
            </FormTextTitle>
            <FormText>{formatDate(contract.third_call_sent) || '–'}</FormText>
          </Authorization>
        </Column>
      </Row>
      <Row>
        {contract.is_readjustment_decision && 
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractsFieldPaths.IS_READJUSTMENT_DECISION)}>
              <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseContractsFieldPaths.IS_READJUSTMENT_DECISION)}>
                {LeaseContractsFieldTitles.IS_READJUSTMENT_DECISION}
              </FormTextTitle>
              <FormText>{'Kyllä'}</FormText>
            </Authorization>
          </Column>}
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractsFieldPaths.INSTITUTION_IDENTIFIER)}>
            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseContractsFieldPaths.INSTITUTION_IDENTIFIER)}>
              {LeaseContractsFieldTitles.INSTITUTION_IDENTIFIER}
            </FormTextTitle>
            <FormText>{contract.institution_identifier  || '–'}</FormText>
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractsFieldPaths.DECISION)}>
            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseContractsFieldPaths.DECISION)}>
              {LeaseContractsFieldTitles.DECISION}
            </FormTextTitle>
            <DecisionLink
              decision={decision}
              decisionOptions={decisionOptions}
            />
          </Authorization>
        </Column>
        <Column small={6} medium={12} large={6}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractsFieldPaths.KTJ_LINK)}>
            <FormTextTitle>{LeaseContractsFieldTitles.KTJ_LINK}</FormTextTitle>
            {contract.institution_identifier
              ? <KtjLink
                fileKey='vuokraoikeustodistus'
                fileName='vuokraoikeustodistus'
                identifier={contract.institution_identifier}
                idKey='kohdetunnus'
                label='Vuokraoikeustodistus'
              />
              : <FormText>-</FormText>
            }
          </Authorization>
        </Column>
      </Row>

      <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractChangesFieldPaths.CONTRACT_CHANGES)}>
        <Collapse
          className='collapse__secondary'
          defaultOpen={contractChangesCollapseState !== undefined ? contractChangesCollapseState : true}
          headerTitle={LeaseContractChangesFieldTitles.CONTRACT_CHANGES}
          onToggle={handleContractChangesCollapseToggle}
          uiDataKey={LeaseContractChangesFieldPaths.CONTRACT_CHANGES}
        >
          {!contract.contract_changes || !contract.contract_changes.length && <FormText>Ei sopimuksen muutoksia</FormText>}
          {contract.contract_changes && !!contract.contract_changes.length &&
            <BoxItemContainer>
              {contract.contract_changes.map((change) => {
                const decision = getDecisionById(currentLease, change.decision);

                return (
                  <BoxItem
                    key={change.id}
                    className='no-border-on-first-child no-border-on-last-child'>
                    <Row>
                      <Column small={6} medium={4} large={2}>
                        <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractChangesFieldPaths.SIGNING_DATE)}>
                          <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseContractChangesFieldPaths.SIGNING_DATE)}>
                            {LeaseContractChangesFieldTitles.SIGNING_DATE}
                          </FormTextTitle>
                          <FormText>{formatDate(change.signing_date) || '–'}</FormText>
                        </Authorization>
                      </Column>
                      <Column small={6} medium={4} large={2}>
                        <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractChangesFieldPaths.SIGN_BY_DATE)}>
                          <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseContractChangesFieldPaths.SIGN_BY_DATE)}>
                            {LeaseContractChangesFieldTitles.SIGN_BY_DATE}
                          </FormTextTitle>
                          <FormText>{formatDate(change.sign_by_date) || '–'}</FormText>
                        </Authorization>
                      </Column>
                      <Column small={6} medium={4} large={2}>
                        <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractChangesFieldPaths.FIRST_CALL_SENT)}>
                          <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseContractChangesFieldPaths.FIRST_CALL_SENT)}>
                            {LeaseContractChangesFieldTitles.FIRST_CALL_SENT}
                          </FormTextTitle>
                          <FormText>{formatDate(change.first_call_sent) || '–'}</FormText>
                        </Authorization>
                      </Column>
                      <Column small={6} medium={4} large={2}>
                        <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractChangesFieldPaths.SECOND_CALL_SENT)}>
                          <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseContractChangesFieldPaths.SECOND_CALL_SENT)}>
                            {LeaseContractChangesFieldTitles.SECOND_CALL_SENT}
                          </FormTextTitle>
                          <FormText>{formatDate(change.second_call_sent) || '–'}</FormText>
                        </Authorization>
                      </Column>
                      <Column small={6} medium={4} large={2}>
                        <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractChangesFieldPaths.THIRD_CALL_SENT)}>
                          <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseContractChangesFieldPaths.THIRD_CALL_SENT)}>
                            {LeaseContractChangesFieldTitles.THIRD_CALL_SENT}
                          </FormTextTitle>
                          <FormText>{formatDate(change.third_call_sent) || '–'}</FormText>
                        </Authorization>
                      </Column>
                    </Row>
                    <Row>
                      <Column small={6} medium={4} large={2}>
                        <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractChangesFieldPaths.DECISION)}>
                          <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseContractChangesFieldPaths.DECISION)}>
                            {LeaseContractChangesFieldTitles.DECISION}
                          </FormTextTitle>
                          <DecisionLink
                            decision={decision}
                            decisionOptions={decisionOptions}
                          />
                        </Authorization>
                      </Column>
                      <Column small={6} medium={8} large={10}>
                        <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractChangesFieldPaths.DESCRIPTION)}>
                          <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseContractChangesFieldPaths.DESCRIPTION)}>
                            {LeaseContractChangesFieldTitles.DESCRIPTION}
                          </FormTextTitle>
                          <FormText>{change.description  || '–'}</FormText>
                        </Authorization>
                      </Column>
                    </Row>
                  </BoxItem>
                );
              })}
            </BoxItemContainer>
          }
        </Collapse>
      </Authorization>

      <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractCollateralsFieldPaths.COLLATRALS)}>
        <Collapse
          className='collapse__secondary'
          defaultOpen={collateralsCollapseState !== undefined ? collateralsCollapseState : true}
          headerTitle={LeaseContractCollateralsFieldTitles.COLLATRALS}
          onToggle={handleCollateralsCollapseToggle}
          uiDataKey={getUiDataLeaseKey(LeaseContractCollateralsFieldPaths.COLLATRALS)}
        >
          {!contract.collaterals || !contract.collaterals.length && <FormText>Ei vakuuksia</FormText>}
          {contract.collaterals && !!contract.collaterals.length &&
            <BoxItemContainer>
              {contract.collaterals.map((collateral) => {
                return (
                  <Collateral
                    key={collateral.id}
                    collateral={collateral}
                    typeOptions={collateralTypeOptions}
                  />
                );
              })}
            </BoxItemContainer>
          }
        </Collapse>
      </Authorization>
    </Collapse>
  );
};

export default connect(
  (state, props) => {
    const id = props.contract.id;

    return {
      attributes: getAttributes(state),
      collateralsCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${formName}.${id}.collaterals`),
      contractCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${formName}.${id}.contract`),
      contractChangesCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${formName}.${id}.contract_changes`),
      currentLease: getCurrentLease(state),
    };
  },
  {
    receiveCollapseStates,
  }
)(ContractItem);
