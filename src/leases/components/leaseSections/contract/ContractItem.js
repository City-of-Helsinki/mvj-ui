// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';
import {
  formatDate,
  formatDateRange,
} from '../../../../util/helpers';

import Collapse from '../../../../components/collapse/Collapse';
import GreenBoxItem from '../../../../components/content/GreenBoxItem';

type Props = {
  contract: Object,
}

const ContractItem = ({contract}: Props) => {
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
        <div>
          <Row>
            <Column medium={4}>
              <label>Sopimusnumero</label>
              <p>{contract.contract_number ? contract.contract_number : '-'}</p>
            </Column>
            <Column medium={4}>
              <label>Allekirjoituspäivämäärä</label>
              <p>{formatDate(contract.signing_date) || '–'}</p>
            </Column>
            <Column medium={4}>
              <label>Kommentti allekirjoitukselle</label>
              <p>{contract.signing_date_comment || '–'}</p>
            </Column>
          </Row>
          <Row>
            <Column medium={4}>
              <label>Järjestelypäätös</label>
              <p>{contract.setup_decision || '–'}</p>
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
              <p>{contract.lease_deposit_number  || '–'}</p>
            </Column>
            <Column medium={4}>
              <label>Vuokravakuus alku- ja loppupäivämäärä</label>
              <p>{formatDateRange(contract.lease_deposit_starting_date, contract.lease_deposit_ending_date)}</p>
            </Column>
            <Column medium={4}>
              <label>Kommentti</label>
              <p>{contract.lease_deposit_comment  || '–'}</p>
            </Column>
          </Row>
          <Row>
            <Column medium={4}>
              <label>Laitostunnus</label>
              <p>{contract.administration_number  || '–'}</p>
            </Column>
          </Row>
          {contract.pledge_books && contract.pledge_books.length > 0 &&
            <div>
              <Row>
                <Column>
                  <p className='sub-title'>Panttikirjat</p>
                </Column>
              </Row>
              <Row>
                <Column medium={4}>
                  <label>Panttikirjan numero</label>
                </Column>
                <Column medium={4}>
                  <label>Panttikirjan pvm</label>
                </Column>
                <Column medium={4}>
                  <label>Panttikirjan kommentti</label>
                </Column>
              </Row>
              {contract.pledge_books.map((pledge_book, index) =>
                <Row key={index}>
                  <Column medium={4}>
                    <p className='no-margin'>{pledge_book.pledge_book_number || '–'}</p>
                  </Column>
                  <Column medium={4}>
                    <p className='no-margin'>{formatDate(pledge_book.pledge_book_date) || '–'}</p>
                  </Column>
                  <Column medium={4}>
                    <p className='no-margin'>{pledge_book.pledge_book_comment || '–'}</p>
                  </Column>
                </Row>
              )}
            </div>
          }
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
          <GreenBoxItem key={index}>
            <Row>
              <Column medium={4}>
                <label>Allekirjoituspäivämäärä</label>
                <p>{formatDate(modification.modification_signing_date) || '–'}</p>

                <label>1. kutsu lähetetty</label>
                <p>{formatDate(modification.first_call_sent) || '–'}</p>
              </Column>
              <Column medium={4}>
                <label>Allekirjoitettava mennessä</label>
                <p>{formatDate(modification.to_be_signed_by)  || '–'}</p>

                <label>2. kutsu lähetetty</label>
                <p>{formatDate(modification.second_call_sent) || '–'}</p>
              </Column>
              <Column medium={4}>
                <label>Päätös</label>
                <p>–</p>

                <label>3. kutsu lähetetty</label>
                <p>{formatDate(modification.third_call_sent) || '–'}</p>
              </Column>
            </Row>
            <Row>
              <Column medium={12}>
                <label>Selite</label>
                <p className='no-margin'>{modification.modification_description  || '–'}</p>
              </Column>
            </Row>
          </GreenBoxItem>
        )}
      </Collapse>}
    </div>
  );
};

export default ContractItem;
