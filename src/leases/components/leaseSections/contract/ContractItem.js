// @flow
import React, {Fragment} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import BoxItem from '$components/content/BoxItem';
import BoxItemContainer from '$components/content/BoxItemContainer';
import Collapse from '$components/collapse/Collapse';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import FormTitleAndText from '$components/form/FormTitleAndText';
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
      headerSubtitles={
        <Fragment>
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
        </Fragment>
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
          <FormTitleAndText
            title='Sopimuksen tyyppi'
            text={getLabelOfOption(typeOptions, contract.type) || '-'}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormTitleAndText
            title='Sopimusnumero'
            text={contract.contract_number || '-'}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormTitleAndText
            title='Allekirjoituspvm'
            text={formatDate(contract.signing_date) || '–'}
          />
        </Column>
        <Column small={6} medium={12} large={6}>
          <FormTitleAndText
            title='Allekirjoituksen huomautus'
            text={contract.signing_note || '–'}
          />
        </Column>
      </Row>
      <Row>
        <Column small={6} medium={4} large={2}>
          <FormTitleAndText
            title='Järjestelypäätös'
            text={contract.is_readjustment_decision ? 'Kyllä' : 'Ei'}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormTitleAndText
            title='Laitostunnus'
            text={contract.institution_identifier  || '–'}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormTextTitle title='Päätös' />
          {decision
            ? <FormText>{decision.reference_number
              ? <a href={getReferenceNumberLink(decision.reference_number)} target='_blank'>{getLabelOfOption(decisionOptions, contract.decision)}</a>
              : getLabelOfOption(decisionOptions, contract.decision)
            }</FormText>
            : <FormText>-</FormText>
          }
        </Column>
        <Column small={6} medium={12} large={6}>
          <FormTextTitle title='KTJ dokumentti' />
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
        </Column>
      </Row>
      <Row>
        <Column small={6} medium={4} large={2}>
          <FormTitleAndText
            title='Vuokravakuusnumero'
            text={contract.collateral_number  || '–'}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormTitleAndText
            title='Vuokravakuus alkupvm'
            text={formatDate(contract.collateral_start_date) || '-'}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormTitleAndText
            title='Vuokravakuus loppupvm'
            text={formatDate(contract.collateral_end_date) || '-'}
          />
        </Column>
        <Column small={6} medium={12} large={6}>
          <FormTitleAndText
            title='Vuokravakuuden huomautus'
            text={contract.collateral_note  || '–'}
          />
        </Column>
      </Row>
      <Row>
        <Column>
          <SubTitle>Panttikirjat</SubTitle>
        </Column>
      </Row>
      {(!contract.mortgage_documents || !contract.mortgage_documents.length )&&
        <FormText>Ei panttikirjoja</FormText>
      }
      {contract.mortgage_documents && !!contract.mortgage_documents.length &&
        <Fragment>
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

      <Collapse
        className='collapse__secondary'
        defaultOpen={contractChangesCollapseState !== undefined ? contractChangesCollapseState : true}
        headerTitle={<h4 className='collapse__header-title'>Sopimuksen muutokset</h4>}
        onToggle={handleContractChangesCollapseToggle}
      >
        {!contract.contract_changes || !contract.contract_changes.length &&
          <FormText>Ei sopimuksen muutoksia</FormText>
        }
        {contract.contract_changes && !!contract.contract_changes.length &&
          <BoxItemContainer>
            {contract.contract_changes.map((change) => {
              const decision = getDecisionById(decisions, change.decision);
              return (
                <BoxItem
                  key={change.id}
                  className='no-border-on-first-child no-border-on-last-child'>
                  <Row>
                    <Column small={6} medium={4} large={2}>
                      <FormTitleAndText
                        title='Allekirjoituspvm'
                        text={formatDate(change.signing_date) || '–'}
                      />
                    </Column>
                    <Column small={6} medium={4} large={2}>
                      <FormTitleAndText
                        title='Allekirjoitettava mennessä'
                        text={formatDate(change.sign_by_date) || '–'}
                      />
                    </Column>
                    <Column small={6} medium={4} large={2}>
                      <FormTitleAndText
                        title='1. kutsu lähetetty'
                        text={formatDate(change.first_call_sent) || '–'}
                      />
                    </Column>
                    <Column small={6} medium={4} large={2}>
                      <FormTitleAndText
                        title='2. kutsu lähetetty'
                        text={formatDate(change.second_call_sent) || '–'}
                      />
                    </Column>
                    <Column small={6} medium={4} large={2}>
                      <FormTitleAndText
                        title='3. kutsu lähetetty'
                        text={formatDate(change.third_call_sent) || '–'}
                      />
                    </Column>
                  </Row>
                  <Row>
                    <Column small={6} medium={4} large={2}>
                      <FormTextTitle title='Päätös' />
                      {decision
                        ? <FormText>{decision.reference_number
                          ? <a href={getReferenceNumberLink(decision.reference_number)} target='_blank'>{getLabelOfOption(decisionOptions, change.decision)}</a>
                          : getLabelOfOption(decisionOptions, change.decision)
                        }</FormText>
                        : <FormText>-</FormText>
                      }
                    </Column>
                    <Column small={6} medium={8} large={10}>
                      <FormTitleAndText
                        title='Huomautus'
                        text={change.description  || '–'}
                      />
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
