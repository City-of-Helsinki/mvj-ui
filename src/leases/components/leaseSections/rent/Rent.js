// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import ContractRents from './ContractRents';
import Discounts from './Discounts';
import Criterias from './Criterias';
import ChargedRents from './ChargedRents';
import IndexAdjustedRents from './IndexAdjustedRents';
import RentBasicInfo from './RentBasicInfo';

type Props = {
  onCriteriaAgree: Function,
  rents: Object,
}

const Rent = ({onCriteriaAgree, rents}: Props) => {
  const rentType = get(rents, 'basic_info.type');

  return (
    <div className="lease-section rent-section">
      <Row>
        <Column medium={9}><h1>Vuokra</h1></Column>
        <Column medium={3}>
          {rents.rent_info_ok
            ? (<p className="success">Vuokratiedot kunnossa<i /></p>)
            : (<p className="alert">Vaatii toimenpiteitä<i /></p>)
          }
        </Column>
      </Row>
      <Row><Column><div className="separator-line no-margin"></div></Column></Row>

      <Row>
        <Column>
          <h2>Vuokran perustiedot</h2>
          <RentBasicInfo
            basicInfo={get(rents, 'basic_info', {})}
          />
        </Column>
      </Row>

      {(rentType === '0' || rentType === '2' || rentType === '4') &&
        <Row>
          <Column>
            <h2>Sopimusvuokra</h2>
            <ContractRents
              contractRents={get(rents, 'contract_rents', [])}
              rentType={rentType}
            />
          </Column>
        </Row>
      }

      {(rentType === '0' || rentType === '4') &&
        <Row>
          <Column>
            <h2>Indeksitarkistettu vuokra</h2>
            <IndexAdjustedRents
              indexAdjustedRents={get(rents, 'index_adjusted_rents', [])}
            />
          </Column>
        </Row>
      }

      {(rentType === '0' || rentType === '2' || rentType === '4') &&
        <Row>
          <Column>
            <h2>Alennukset ja korotukset</h2>
            <Discounts
              discounts={get(rents, 'discounts', [])}
            />
          </Column>
        </Row>
      }

      {(rentType === '0' || rentType === '2' || rentType === '4') &&
        <Row>
          <Column>
            <h2>Perittävä vuokra</h2>
            <ChargedRents
              chargedRents={get(rents, 'charged_rents', [])}
            />
          </Column>
        </Row>
      }

      {(rentType === '0' || rentType === '1' || rentType === '2' || rentType === '4') &&
        <Row>
          <Column>
            <h2>Vuokranperusteet</h2>
            <Criterias
              criterias={get(rents, 'criterias', {})}
              onCriteriaAgree={(criteria) => onCriteriaAgree(criteria)}
            />
          </Column>
        </Row>
      }
    </div>
  );
};

export default Rent;
