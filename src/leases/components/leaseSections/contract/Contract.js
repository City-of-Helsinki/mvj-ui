// @flow
import React from 'react';
import get from 'lodash/get';
import {Row, Column} from 'react-foundation';
import * as helpers from '../../../helpers';

import Collapse from '../../../../components/Collapse';

type Props = {
  contract: Object,
}

const Contract = ({contract}: Props) => {
  return (
    <div>
      <Collapse
        className='collapse__secondary'
        defaultOpen={true}
        header={
          <Row>
            <Column small={6}><span className='collapse__header-title'>Sopimuksen tiedot</span></Column>
          </Row>
        }
      >
        <div className='section-item'>
          <Row>
            <Column medium={4}>
              <label>Sopimusnumero</label>
              <p>{contract.contract_number ? get(contract, 'contract_number', '–') : '–'}</p>

              <label>Järjestelypäätös</label>
              <p>{contract.setup_decision ? get(contract, 'setup_decision', '–') : '–'}</p>

              <div className='multiple-textrows'>
                <label>Panttikirjat (numero ja päivämäärä)</label>
                {contract.pledge_books.map((pledge_book) =>
                  <p className='text-no-margin' key={get(pledge_book, 'pledge_book_number', '')}>{get(pledge_book, 'pledge_book_number', '')}, {helpers.formatDate(get(pledge_book, 'pledge_book_date', ''))}</p>
                )}
              </div>
            </Column>
            <Column medium={4}>
              <label>Allekirjoituspäivämäärä</label>
              <p>{contract.signing_date ? helpers.formatDate(get(contract, 'signing_date', '–')) : '–'}</p>

              <label>Vuokravakuusnumero</label>
              <p>{contract.lease_deposit_number ? get(contract, 'lease_deposit_number', '–') : '–'}</p>

              <label>KTJ dokumentti</label>
              {/* link to KTJ */}
              <p>Vuokraoikeustodistus</p>
            </Column>
            <Column medium={4}>
              <label>Laitostunnus</label>
              <p>{contract.administration_number ? get(contract, 'administration_number', '–') : '–'}</p>

              <label>Vuokravakuus alku- ja loppupäivämäärä</label>
              <p>{helpers.formatDate(get(contract, 'lease_deposit_starting_date', '–'))} – {helpers.formatDate(get(contract, 'lease_deposit_ending_date', '–'))}</p>

              <label>Päätös</label>
              {/* link to chosen rule */}
              <p>–</p>
            </Column>
          </Row>
        </div>
      </Collapse>

      {contract.modifications &&
      <Collapse
        className='collapse__secondary'
        defaultOpen={true}
        header={
          <Row>
            <Column small={6}><span className='collapse__header-title'>Sopimuksen muutokset</span></Column>
          </Row>
        }
      >
        {contract.modifications && contract.modifications.map((modification, index) =>
        <div className='section-item' key={index}>
          <Row>
            <Column medium={4}>
              <label>Allekirjoituspäivämäärä</label>
              <p>{modification.modification_signing_date ? helpers.formatDate(get(modification, 'modification_signing_date', '–')) : '–'}</p>

              <label>1. kutsu lähetetty</label>
              <p>{modification.first_call_sent ? helpers.formatDate(get(modification, 'first_call_sent', '–')) : '–'}</p>
            </Column>
            <Column medium={4}>
              <label>Allekirjoitettava mennessä</label>
              <p>{modification.to_be_signed_by ? helpers.formatDate(get(modification, 'to_be_signed_by', '–')) : '–'}</p>

              <label>2. kutsu lähetetty</label>
              <p>{modification.second_call_sent ? helpers.formatDate(get(modification, 'second_call_sent', '–')) : '–'}</p>
            </Column>
            <Column medium={4}>
              <label>Päätös</label>
              <p>–</p>

              <label>3. kutsu lähetetty</label>
              <p>{modification.third_call_sent ? helpers.formatDate(get(modification, 'third_call_sent', '–')) : '–'}</p>
            </Column>
          </Row>
          <Row>
            <Column medium={12}>
              <label>Selite</label>
              <p>{modification.modification_description ? get(modification, 'modification_description', '–') : '–'}</p>
            </Column>
          </Row>
        </div>)}
      </Collapse>}
    </div>
  );
};

export default Contract;
