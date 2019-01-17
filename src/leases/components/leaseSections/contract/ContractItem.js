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
import DecisionLink from '$components/links/DecisionLink';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import KtjLink from '$components/ktj/KtjLink';
import SubTitle from '$components/content/SubTitle';
import {receiveCollapseStates} from '$src/leases/actions';
import {ViewModes} from '$src/enums';
import {
  FormNames,
  LeaseContractChangesFieldPaths,
  LeaseContractChangesFieldTitles,
  LeaseContractsFieldPaths,
  LeaseContractsFieldTitles,
  LeaseContractMortgageDocumentsFieldPaths,
  LeaseContractMortgageDocumentsFieldTitles,
} from '$src/leases/enums';
import {getDecisionById, getDecisionOptions, isContractActive} from '$src/leases/helpers';
import {formatDate, getLabelOfOption, isFieldAllowedToRead} from '$util/helpers';
import {getAttributes, getCollapseStateByKey, getCurrentLease} from '$src/leases/selectors';

import type {Attributes} from '$src/types';
import type {Lease} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  contract: Object,
  contractCollapseState: boolean,
  contractChangesCollapseState: boolean,
  currentLease: Lease,
  receiveCollapseStates: Function,
  typeOptions: Array<Object>,
}

const ContractItem = ({
  attributes,
  contract,
  contractCollapseState,
  contractChangesCollapseState,
  currentLease,
  receiveCollapseStates,
  typeOptions,
}: Props) => {
  const handleContractCollapseToggle = (val: boolean) => {
    receiveCollapseStates({
      [ViewModes.READONLY]: {
        [FormNames.CONTRACTS]: {
          [contract.id]: {
            contract: val,
          },
        },
      },
    });
  };

  const handleContractChangesCollapseToggle = (val: boolean) => {
    receiveCollapseStates({
      [ViewModes.READONLY]: {
        [FormNames.CONTRACTS]: {
          [contract.id]: {
            contract_changes: val,
          },
        },
      },
    });
  };

  const decisionOptions = getDecisionOptions(currentLease);
  const decision = getDecisionById(currentLease, contract.decision);

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
          <Column>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractsFieldPaths.COLLATERAL_START_DATE) && isFieldAllowedToRead(attributes, LeaseContractsFieldPaths.COLLATERAL_END_DATE)}>
              <CollapseHeaderSubtitle>{isContractActive(contract) ? 'Voimassa' : 'Ei voimassa'}</CollapseHeaderSubtitle>
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
            <FormTextTitle>{LeaseContractsFieldTitles.TYPE}</FormTextTitle>
            <FormText>{getLabelOfOption(typeOptions, contract.type) || '-'}</FormText>
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractsFieldPaths.CONTRACT_NUMBER)}>
            <FormTextTitle>{LeaseContractsFieldTitles.CONTRACT_NUMBER}</FormTextTitle>
            <FormText>{contract.contract_number || '-'}</FormText>
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractsFieldPaths.SIGNING_DATE)}>
            <FormTextTitle>{LeaseContractsFieldTitles.SIGNING_DATE}</FormTextTitle>
            <FormText>{formatDate(contract.signing_date) || '–'}</FormText>
          </Authorization>
        </Column>
        <Column small={6} medium={12} large={6}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractsFieldPaths.SIGNING_NOTE)}>
            <FormTextTitle>{LeaseContractsFieldTitles.SIGNING_NOTE}</FormTextTitle>
            <FormText>{contract.signing_note || '–'}</FormText>
          </Authorization>
        </Column>
      </Row>
      <Row>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractsFieldPaths.IS_READJUSTMENT_DECISION)}>
            <FormTextTitle>{LeaseContractsFieldTitles.IS_READJUSTMENT_DECISION}</FormTextTitle>
            <FormText>{contract.is_readjustment_decision ? 'Kyllä' : 'Ei'}</FormText>
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractsFieldPaths.INSTITUTION_IDENTIFIER)}>
            <FormTextTitle>{LeaseContractsFieldTitles.INSTITUTION_IDENTIFIER}</FormTextTitle>
            <FormText>{contract.institution_identifier  || '–'}</FormText>
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractsFieldPaths.DECISION)}>
            <FormTextTitle>{LeaseContractsFieldTitles.DECISION}</FormTextTitle>
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
      <Row>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractsFieldPaths.COLLATERAL_NUMBER)}>
            <FormTextTitle>{LeaseContractsFieldTitles.COLLATERAL_NUMBER}</FormTextTitle>
            <FormText>{contract.collateral_number  || '–'}</FormText>
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractsFieldPaths.COLLATERAL_START_DATE)}>
            <FormTextTitle>{LeaseContractsFieldTitles.COLLATERAL_START_DATE}</FormTextTitle>
            <FormText>{formatDate(contract.collateral_start_date) || '-'}</FormText>
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractsFieldPaths.COLLATERAL_END_DATE)}>
            <FormTextTitle>{LeaseContractsFieldTitles.COLLATERAL_END_DATE}</FormTextTitle>
            <FormText>{formatDate(contract.collateral_end_date) || '-'}</FormText>
          </Authorization>
        </Column>
        <Column small={6} medium={12} large={6}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractsFieldPaths.COLLATERAL_NOTE)}>
            <FormTextTitle>{LeaseContractsFieldTitles.COLLATERAL_NOTE}</FormTextTitle>
            <FormText>{contract.collateral_note  || '–'}</FormText>
          </Authorization>
        </Column>
      </Row>

      <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractMortgageDocumentsFieldPaths.MORTGAGE_DOCUMENTS)}>
        <SubTitle>{LeaseContractMortgageDocumentsFieldTitles.MORTGAGE_DOCUMENTS}</SubTitle>
        {!contract.mortgage_documents || !contract.mortgage_documents.length && <FormText>Ei panttikirjoja</FormText>}
        {contract.mortgage_documents && !!contract.mortgage_documents.length &&
          <Fragment>
            <Row>
              <Column small={4} medium={4} large={2}>
                <FormTextTitle >{LeaseContractMortgageDocumentsFieldTitles.NUMBER}</FormTextTitle>
              </Column>
              <Column small={4} medium={4} large={2}>
                <FormTextTitle >{LeaseContractMortgageDocumentsFieldTitles.DATE}</FormTextTitle>
              </Column>
              <Column small={4} medium={4} large={2}>
                <FormTextTitle >{LeaseContractMortgageDocumentsFieldTitles.NOTE}</FormTextTitle>
              </Column>
            </Row>
            {contract.mortgage_documents.map((doc) =>
              <Row key={doc.id}>
                <Column small={4} medium={4} large={2}>
                  <FormText>{doc.number || '–'}</FormText>
                </Column>
                <Column small={4} medium={4} large={2}>
                  <FormText>{formatDate(doc.date) || '–'}</FormText>
                </Column>
                <Column small={4} medium={4} large={2}>
                  <FormText>{doc.note || '–'}</FormText>
                </Column>
              </Row>
            )}
          </Fragment>
        }
      </Authorization>

      <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractChangesFieldPaths.CONTRACT_CHANGES)}>
        <Collapse
          className='collapse__secondary'
          defaultOpen={contractChangesCollapseState !== undefined ? contractChangesCollapseState : true}
          headerTitle={LeaseContractChangesFieldTitles.CONTRACT_CHANGES}
          onToggle={handleContractChangesCollapseToggle}
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
                          <FormTextTitle>{LeaseContractChangesFieldTitles.SIGNING_DATE}</FormTextTitle>
                          <FormText>{formatDate(change.signing_date) || '–'}</FormText>
                        </Authorization>
                      </Column>
                      <Column small={6} medium={4} large={2}>
                        <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractChangesFieldPaths.SIGN_BY_DATE)}>
                          <FormTextTitle>{LeaseContractChangesFieldTitles.SIGN_BY_DATE}</FormTextTitle>
                          <FormText>{formatDate(change.sign_by_date) || '–'}</FormText>
                        </Authorization>
                      </Column>
                      <Column small={6} medium={4} large={2}>
                        <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractChangesFieldPaths.FIRST_CALL_SENT)}>
                          <FormTextTitle>{LeaseContractChangesFieldTitles.FIRST_CALL_SENT}</FormTextTitle>
                          <FormText>{formatDate(change.first_call_sent) || '–'}</FormText>
                        </Authorization>
                      </Column>
                      <Column small={6} medium={4} large={2}>
                        <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractChangesFieldPaths.SECOND_CALL_SENT)}>
                          <FormTextTitle>{LeaseContractChangesFieldTitles.SECOND_CALL_SENT}</FormTextTitle>
                          <FormText>{formatDate(change.second_call_sent) || '–'}</FormText>
                        </Authorization>
                      </Column>
                      <Column small={6} medium={4} large={2}>
                        <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractChangesFieldPaths.THIRD_CALL_SENT)}>
                          <FormTextTitle>{LeaseContractChangesFieldTitles.THIRD_CALL_SENT}</FormTextTitle>
                          <FormText>{formatDate(change.third_call_sent) || '–'}</FormText>
                        </Authorization>
                      </Column>
                    </Row>
                    <Row>
                      <Column small={6} medium={4} large={2}>
                        <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractChangesFieldPaths.DECISION)}>
                          <FormTextTitle>{LeaseContractChangesFieldTitles.DECISION}</FormTextTitle>
                          <DecisionLink
                            decision={decision}
                            decisionOptions={decisionOptions}
                          />
                        </Authorization>
                      </Column>
                      <Column small={6} medium={8} large={10}>
                        <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractChangesFieldPaths.DESCRIPTION)}>
                          <FormTextTitle>{LeaseContractChangesFieldTitles.DESCRIPTION}</FormTextTitle>
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
    </Collapse>
  );
};

export default connect(
  (state, props) => {
    const id = props.contract.id;

    return {
      attributes: getAttributes(state),
      contractCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.CONTRACTS}.${id}.contract`),
      contractChangesCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.CONTRACTS}.${id}.contract_changes`),
      currentLease: getCurrentLease(state),
    };
  },
  {
    receiveCollapseStates,
  }
)(ContractItem);
