// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';

import BoxItem from '$components/content/BoxItem';
import BoxItemContainer from '$components/content/BoxItemContainer';
import Collapse from '$components/collapse/Collapse';
import FormFieldLabel from '$components/form/FormFieldLabel';
import KtjLink from '$components/ktj/KtjLink';
import ListItems from '$components/content/ListItems';
import SubTitle from '$components/content/SubTitle';
import {formatDate, getDecisionById, getLabelOfOption, getReferenceNumberLink} from '$src/util/helpers';
import {getDecisionsByLease} from '$src/decision/selectors';
import {getCurrentLease} from '$src/leases/selectors';

type Props = {
  contract: Object,
  decisionOptions: Array<Object>,
  decisions: Array<Object>,
  typeOptions: Array<Object>,
}

const ContractItem = ({contract, decisionOptions, decisions, typeOptions}: Props) => {
  const decision = getDecisionById(decisions, contract.decision);
  return (
    <div>
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
        <ListItems>
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
                <p className='no-margin'>{doc.number || '–'}</p>
              </Column>
              <Column small={4} medium={4} large={2}>
                <p className='no-margin'>{formatDate(doc.date) || '–'}</p>
              </Column>
              <Column small={4} medium={4} large={2}>
                <p className='no-margin'>{doc.note || '–'}</p>
              </Column>
            </Row>
          )}
        </ListItems>
      }

      <Collapse
        className='collapse__secondary'
        defaultOpen={true}
        headerTitle={
          <h4 className='collapse__header-title'>Sopimuksen muutokset</h4>
        }
      >
        {(!contract.contract_changes || !contract.contract_changes.length) &&
          <p>Ei sopimuksen muutoksia</p>
        }
        {contract.contract_changes && !!contract.contract_changes.length &&
          <BoxItemContainer>
            {contract.contract_changes.map((change) => {
              const decision = getDecisionById(decisions, change.decision);
              return (
                <BoxItem
                  key={change.id}
                  className='no-border-on-first-child'>
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
    </div>
  );
};

export default connect(
  (state) => {
    const currentLease = getCurrentLease(state);

    return {
      decisions: getDecisionsByLease(state, currentLease.id),
    };
  }
)(ContractItem);
