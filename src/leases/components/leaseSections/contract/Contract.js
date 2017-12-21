// @flow
import React from 'react';
import get from 'lodash/get';
import {Row, Column} from 'react-foundation';
import * as helpers from '../../../../util/helpers';

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
            </Column>
            <Column medium={4}>
              <label>Allekirjoituspäivämäärä</label>
              <p>{contract.signing_date ? helpers.formatDate(get(contract, 'signing_date', '–')) : '–'}</p>
            </Column>
            <Column medium={4}>
              <label>Kommentti allekirjoitukselle</label>
              <p>{contract.signing_date_comment ? get(contract, 'signing_date_comment', '–') : '–'}</p>
            </Column>
          </Row>
          <Row>
            <Column medium={4}>
              <label>Järjestelypäätös</label>
              <p>{contract.setup_decision ? get(contract, 'setup_decision', '–') : '–'}</p>
            </Column>
            <Column medium={4}>
              <label>Päätös</label>
              {/* link to chosen rule */}
              <p>–</p>
            </Column>
            <Column medium={4}>
              <label>KTJ dokumentti</label>
              {/* link to KTJ */}
              <p>Vuokraoikeustodistus</p>
            </Column>
          </Row>
          <Row>
            <Column medium={4}>
              <label>Vuokravakuusnumero</label>
              <p>{contract.lease_deposit_number ? get(contract, 'lease_deposit_number', '–') : '–'}</p>
            </Column>
            <Column medium={4}>
              <label>Vuokravakuus alku- ja loppupäivämäärä</label>
              <p>{helpers.formatDate(get(contract, 'lease_deposit_starting_date', '–'))} – {helpers.formatDate(get(contract, 'lease_deposit_ending_date', '–'))}</p>
            </Column>
            <Column medium={4}>
              <label>Kommentti</label>
              <p>{contract.lease_deposit_comment ? get(contract, 'lease_deposit_comment', '–') : '–'}</p>
            </Column>
          </Row>
          <Row>
            <Column medium={4}>
              <label>Laitostunnus</label>
              <p>{contract.administration_number ? get(contract, 'administration_number', '–') : '–'}</p>
            </Column>
          </Row>
          {contract.pledge_books.length > 0 &&
          <Row>
            <Column>
              <p className='green-subtitle'>Panttikirjat</p>
            </Column>
          </Row>
          }
          {contract.pledge_books.length > 0 && contract.pledge_books.map((pledge_book, index) =>
            <Row key={index}>
              <Column medium={4}>
                <label>Panttikirjan numero</label>
                <p>{pledge_book.pledge_book_number ? get(pledge_book, 'pledge_book_number', '–') : '–'}</p>
              </Column>
              <Column medium={4}>
                <label>Panttikirjan päivämäärä</label>
                <p>{pledge_book.pledge_book_date ? helpers.formatDate(get(pledge_book, 'pledge_book_date', '–')) : '–'}</p>
              </Column>
              <Column medium={4}>
                <label>Panttikirjan kommentti</label>
                <p>{pledge_book.pledge_book_comment ? get(pledge_book, 'pledge_book_comment', '–') : '–'}</p>
              </Column>
            </Row>
          )}
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
          </div>)
        }
      </Collapse>}
    </div>
  );
};

export default Contract;
