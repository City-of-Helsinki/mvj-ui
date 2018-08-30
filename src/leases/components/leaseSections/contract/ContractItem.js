// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import BoxItem from '$components/content/BoxItem';
import BoxItemContainer from '$components/content/BoxItemContainer';
import Collapse from '$components/collapse/Collapse';
import FormFieldLabel from '$components/form/FormFieldLabel';
import KtjLink from '$components/ktj/KtjLink';
import SubTitle from '$components/content/SubTitle';
import {receiveCollapseStates} from '$src/leases/actions';
import {ViewModes} from '$src/enums';
import {FormNames} from '$src/leases/enums';
import {getDecisionById} from '$src/decision/helpers';
import {isContractActive} from '$src/leases/helpers';
import {formatDate, getLabelOfOption, getReferenceNumberLink} from '$src/util/helpers';
import {getDecisionsByLease} from '$src/decision/selectors';
import {getCollapseStateByKey, getCurrentLease} from '$src/leases/selectors';

type Props = {
  contract: Object,
  contractCollapseState: boolean,
  contractChangesCollapseState: boolean,
  decisionOptions: Array<Object>,
  decisions: Array<Object>,
  receiveCollapseStates: Function,
  typeOptions: Array<Object>,
}

const ContractItem = ({
  contract,
  contractCollapseState,
  contractChangesCollapseState,
  decisionOptions,
  decisions,
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

  const decision = getDecisionById(decisions, contract.decision);

  return (
    <Collapse
      defaultOpen={contractCollapseState !== undefined ? contractCollapseState : false}
      header={
        <div>
          <Column>
            <span className='collapse__header-subtitle'>
              {formatDate(contract.signing_date) || '-'}
            </span>
          </Column>
          <Column>
            <span className='collapse__header-subtitle'>
              {isContractActive(contract) ? 'Voimassa' : 'Ei voimassa'}
            </span>
          </Column>
        </div>
      }
      headerTitle={
        <h3 className='collapse__header-title'>
          {getLabelOfOption(typeOptions, contract.type)} {get(contract, 'contract_number')}
        </h3>
      }
      onToggle={handleContractCollapseToggle}
    >
      <Row>
        <Column small={6} medium={4} large={2}>
          <FormFieldLabel>Sopimuksen tyyppi</FormFieldLabel>
          <p>{getLabelOfOption(typeOptions, contract.type) || '-'}</p>
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormFieldLabel>Sopimusnumero</FormFieldLabel>
          <p>{contract.contract_number || '-'}</p>
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormFieldLabel>Allekirjoituspvm</FormFieldLabel>
          <p>{formatDate(contract.signing_date) || '–'}</p>
        </Column>
        <Column small={6} medium={12} large={6}>
          <FormFieldLabel>Allekirjoituksen huomautus</FormFieldLabel>
          <p>{contract.signing_note || '–'}</p>
        </Column>
      </Row>
      <Row>
        <Column small={6} medium={4} large={2}>
          <FormFieldLabel>Järjestelypäätös</FormFieldLabel>
          <p>{contract.is_readjustment_decision ? 'Kyllä' : 'Ei'}</p>
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormFieldLabel>Laitostunnus</FormFieldLabel>
          <p>{contract.institution_identifier  || '–'}</p>
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormFieldLabel>Päätös</FormFieldLabel>
          {decision
            ? <div>{decision.reference_number
              ? <a href={getReferenceNumberLink(decision.reference_number)} target='_blank'>{getLabelOfOption(decisionOptions, contract.decision)}</a>
              : <p>{getLabelOfOption(decisionOptions, contract.decision)}</p>
            }</div>
            : <p>-</p>
          }
        </Column>
        <Column small={6} medium={12} large={6}>
          <FormFieldLabel>KTJ dokumentti</FormFieldLabel>
          {contract.institution_identifier
            ? <KtjLink
              fileKey='vuokraoikeustodistus'
              fileName='vuokraoikeustodistus'
              identifier={contract.institution_identifier}
              idKey='kohdetunnus'
              label='Vuokraoikeustodistus'
            />
            : <p>-</p>
          }
        </Column>
      </Row>
      <Row>
        <Column small={6} medium={4} large={2}>
          <FormFieldLabel>Vuokravakuusnumero</FormFieldLabel>
          <p>{contract.collateral_number  || '–'}</p>
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormFieldLabel>Vuokravakuus alkupvm</FormFieldLabel>
          <p>{formatDate(contract.collateral_start_date) || '-'}</p>
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormFieldLabel>Vuokravakuus loppupvm</FormFieldLabel>
          <p>{formatDate(contract.collateral_end_date) || '-'}</p>
        </Column>
        <Column small={6} medium={12} large={6}>
          <FormFieldLabel>Vuokravakuuden huomautus</FormFieldLabel>
          <p>{contract.collateral_note  || '–'}</p>
        </Column>
      </Row>
      <Row>
        <Column>
          <SubTitle>Panttikirjat</SubTitle>
        </Column>
      </Row>
      {(!contract.mortgage_documents || !contract.mortgage_documents.length )&&
        <p>Ei panttikirjoja</p>
      }
      {contract.mortgage_documents && !!contract.mortgage_documents.length &&
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
          {contract.mortgage_documents.map((doc) =>
            <Row key={doc.id}>
              <Column small={4} medium={4} large={2}>
                <p>{doc.number || '–'}</p>
              </Column>
              <Column small={4} medium={4} large={2}>
                <p>{formatDate(doc.date) || '–'}</p>
              </Column>
              <Column small={4} medium={4} large={2}>
                <p>{doc.note || '–'}</p>
              </Column>
            </Row>
          )}
        </div>
      }

      <Collapse
        className='collapse__secondary'
        defaultOpen={contractChangesCollapseState !== undefined ? contractChangesCollapseState : true}
        headerTitle={<h4 className='collapse__header-title'>Sopimuksen muutokset</h4>}
        onToggle={handleContractChangesCollapseToggle}
      >
        {!contract.contract_changes || !contract.contract_changes.length &&
          <p>Ei sopimuksen muutoksia</p>
        }
        {contract.contract_changes && !!contract.contract_changes.length &&
          <BoxItemContainer>
            {contract.contract_changes.map((change) => {
              const decision = getDecisionById(decisions, change.decision);
              return (
                <BoxItem
                  key={change.id}
                  className='no-border-on-last-child'>
                  <Row>
                    <Column small={6} medium={4} large={2}>
                      <FormFieldLabel>Allekirjoituspvm</FormFieldLabel>
                      <p>{formatDate(change.signing_date) || '–'}</p>
                    </Column>
                    <Column small={6} medium={4} large={2}>
                      <FormFieldLabel>Allekirjoitettava mennessä</FormFieldLabel>
                      <p>{formatDate(change.sign_by_date) || '–'}</p>
                    </Column>
                    <Column small={6} medium={4} large={2}>
                      <FormFieldLabel>1. kutsu lähetetty</FormFieldLabel>
                      <p>{formatDate(change.first_call_sent) || '–'}</p>
                    </Column>
                    <Column small={6} medium={4} large={2}>
                      <FormFieldLabel>2. kutsu lähetetty</FormFieldLabel>
                      <p>{formatDate(change.second_call_sent) || '–'}</p>
                    </Column>
                    <Column small={6} medium={4} large={2}>
                      <FormFieldLabel>3. kutsu lähetetty</FormFieldLabel>
                      <p>{formatDate(change.third_call_sent) || '–'}</p>
                    </Column>
                  </Row>
                  <Row>
                    <Column small={6} medium={4} large={2}>
                      <FormFieldLabel>Päätös</FormFieldLabel>
                      {decision
                        ? <div>{decision.reference_number
                          ? <a href={getReferenceNumberLink(decision.reference_number)} target='_blank'>{getLabelOfOption(decisionOptions, change.decision)}</a>
                          : <p>{getLabelOfOption(decisionOptions, change.decision)}</p>
                        }</div>
                        : <p>-</p>
                      }
                    </Column>
                    <Column small={6} medium={8} large={10}>
                      <FormFieldLabel>Huomautus</FormFieldLabel>
                      <p>{change.description  || '–'}</p>
                    </Column>
                  </Row>
                </BoxItem>
              );
            })}
          </BoxItemContainer>
        }
      </Collapse>
    </Collapse>
  );
};

export default connect(
  (state, props) => {
    const id = props.contract.id;
    const currentLease = getCurrentLease(state);

    return {
      contractCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.CONTRACTS}.${id}.contract`),
      contractChangesCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.CONTRACTS}.${id}.contract_changes`),
      decisions: getDecisionsByLease(state, currentLease.id),
    };
  },
  {
    receiveCollapseStates,
  }
)(ContractItem);
