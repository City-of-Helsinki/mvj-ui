// @flow
import React from 'react';
import get from 'lodash/get';
import {Row, Column} from 'react-foundation';

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
            <Column small={6}><span className='collapse__header-title'>Sopimus</span></Column>
          </Row>
        }
      >
        <div className='section-item'>
          <Row>
            <Column medium={4}>
              <label>Sopimusnumero</label>
              <p>{get(contract, 'contract_number', '–')}</p>

              <label>Järjestelypäätös</label>
              <p>{get(contract, 'setup_decision', '–')}</p>

              <label>Panttikirjat (numero ja päivämäärä)</label>
              {contract.pledge_books.map((pledge_book) =>
                <p key={get(pledge_book, 'pledge_book_number', '')}>{get(pledge_book, 'pledge_book_number', '')}, {get(pledge_book, 'pledge_book_date', '')}</p>
              )}
            </Column>
            <Column medium={4}>
              <label>Allekirjoituspäivämäärä</label>
              <p>{get(contract, 'signing_date', '–')}</p>

              <label>Vuokravakuusnumero</label>
              <p>{get(contract, 'lease_deposit_number', '–')}</p>

              <label>KTJ dokumentti</label>
              {/* link to KTJ */}
              <p>Vuokraoikeustodistus</p>
            </Column>
            <Column medium={4}>
              <label>Laitostunnus</label>
              <p>{get(contract, 'administration_number', '–')}</p>

              <label>Vuokravakuus alku- ja loppupäivämäärä</label>
              <p>{get(contract, 'lease_deposit_starting_date', '–')} – {get(contract, 'lease_deposit_ending_date', '–')}</p>

              <label>Päätös</label>
              {/* link to chosen rule */}
              <p>–</p>
            </Column>
          </Row>
        </div>
      </Collapse>
    </div>
  );
};

export default Contract;
