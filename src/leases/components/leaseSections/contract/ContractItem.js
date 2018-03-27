// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';

import Collapse from '$components/collapse/Collapse';
import GreenBoxItem from '$components/content/GreenBoxItem';
import {formatDate, getAttributeFieldOptions, getLabelOfOption} from '$src/util/helpers';

import type {Attributes} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  contract: Object,
  decisionOptions: Array<Object>,
}

const ContractItem = ({attributes, contract, decisionOptions}: Props) => {
  const typeOptions = getAttributeFieldOptions(attributes, 'contracts.child.children.type');
  return (
    <div>
      <Collapse
        className='collapse__secondary'
        defaultOpen={true}
        header={
          <Row>
            <Column small={12}>
              <span className='collapse__header-title'>Sopimuksen tiedot</span>
            </Column>
          </Row>
        }
      >
        <div>
          <Row>
            <Column small={6} medium={2}>
              <label>Sopimustyyppi</label>
              <p>{getLabelOfOption(typeOptions, contract.type) || '-'}</p>
            </Column>
            <Column small={6} medium={2}>
              <label>Sopimusnumero</label>
              <p>{contract.contract_number || '-'}</p>
            </Column>
            <Column small={6} medium={2}>
              <label>Allekirjoituspäivämäärä</label>
              <p>{formatDate(contract.signing_date) || '–'}</p>
            </Column>
            <Column small={6} medium={6}>
              <label>Kommentti allekirjoitukselle</label>
              <p>{contract.signing_note || '–'}</p>
            </Column>
          </Row>
          <Row>
            <Column small={6} medium={2}>
              <label>Järjestelypäätös</label>
              <p>{contract.is_readjustment_decision ? 'Kyllä' : 'Ei'}</p>
            </Column>
            <Column small={6} medium={2}>
              <label>Laitostunnus</label>
              <p>{contract.institution_identifier  || '–'}</p>
            </Column>
            <Column small={6} medium={2}>
              <label>Päätös</label>
              <p>{getLabelOfOption(decisionOptions, contract.decision) || '-'}</p>
            </Column>
            <Column small={6} medium={2}>
              <label>KTJ dokumentti</label>
              <p>{contract.ktj_link || '-'}</p>
            </Column>
          </Row>
          <Row>
            <Column small={6} medium={2}>
              <label>Vuokravakuusnumero</label>
              <p>{contract.collateral_number  || '–'}</p>
            </Column>
            <Column small={6} medium={2}>
              <label>Vuokravakuus alkupvm</label>
              <p>{formatDate(contract.collateral_start_date) || '-'}</p>
            </Column>
            <Column small={6} medium={2}>
              <label>Vuokravakuus loppupvm</label>
              <p>{formatDate(contract.collateral_end_date) || '-'}</p>
            </Column>
            <Column small={6} medium={4}>
              <label>Vuokravakuus kommentti</label>
              <p>{contract.collateral_note  || '–'}</p>
            </Column>
          </Row>
          <Row>
            <Column>
              <p className='sub-title'>Panttikirjat</p>
            </Column>
          </Row>
          {(!contract.mortgage_documents || !contract.mortgage_documents.length )&&
            <p className='no-margin'>Ei panttikirjoja</p>
          }
          {contract.mortgage_documents && !!contract.mortgage_documents.length &&
            <div>
              <Row>
                <Column small={4} medium={2}>
                  <label>Panttikirjan numero</label>
                </Column>
                <Column small={4} medium={2}>
                  <label>Panttikirjan pvm</label>
                </Column>
                <Column small={4} medium={2}>
                  <label>Panttikirjan kommentti</label>
                </Column>
              </Row>
              {contract.mortgage_documents.map((doc) =>
                <Row key={doc.id}>
                  <Column small={4} medium={2}>
                    <p className='no-margin'>{doc.number || '–'}</p>
                  </Column>
                  <Column small={4} medium={2}>
                    <p className='no-margin'>{formatDate(doc.date) || '–'}</p>
                  </Column>
                  <Column small={4} medium={2}>
                    <p className='no-margin'>{doc.note || '–'}</p>
                  </Column>
                </Row>
              )}
            </div>
          }
        </div>
      </Collapse>

      <Collapse
        className='collapse__secondary'
        defaultOpen={true}
        header={
          <Row>
            <Column small={6}><span className='collapse__header-title'>Sopimuksen muutokset</span></Column>
          </Row>
        }
      >
        {(!contract.contract_changes || !contract.contract_changes.length) &&
          <p className='no-margin'>Ei sopimuksen muutoksia</p>
        }
        {contract.contract_changes && !!contract.contract_changes.length &&
          contract.contract_changes.map((change) =>
          <GreenBoxItem key={change.id}>
            <Row>
              <Column small={6} medium={2}>
                <label>Allekirjoituspäivämäärä</label>
                <p>{formatDate(change.signing_date) || '–'}</p>
              </Column>
              <Column small={6} medium={2}>
                <label>Allekirjoitettava mennessä</label>
                <p>{formatDate(change.sign_by_date) || '–'}</p>
              </Column>
              <Column small={6} medium={2}>
                <label>1. kutsu lähetetty</label>
                <p>{formatDate(change.first_call_sent) || '–'}</p>
              </Column>
              <Column small={6} medium={2}>
                <label>2. kutsu lähetetty</label>
                <p>{formatDate(change.second_call_sent) || '–'}</p>
              </Column>
              <Column small={6} medium={2}>
                <label>3. kutsu lähetetty</label>
                <p>{formatDate(change.third_call_sent) || '–'}</p>
              </Column>
            </Row>
            <Row>
              <Column small={6} medium={2}>
                <label>Päätös</label>
                <p className='no-margin'>{getLabelOfOption(decisionOptions, change.decision) || '-'}</p>
              </Column>
              <Column small={6} medium={10}>
                <label>Selite</label>
                <p className='no-margin'>{change.description  || '–'}</p>
              </Column>
            </Row>
            <Row>
              <Column medium={12}>

              </Column>
            </Row>
          </GreenBoxItem>
        )}
      </Collapse>
    </div>
  );
};

export default ContractItem;
