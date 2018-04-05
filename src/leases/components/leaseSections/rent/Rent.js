// @flow
import React, {Component} from 'react';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import Collapse from '$components/collapse/Collapse';
import ContractRents from './ContractRents';
import Discounts from './Discounts';
import Divider from '$components/content/Divider';
import Criterias from './Criterias';
import ChargedRents from './ChargedRents';
import IndexAdjustedRents from './IndexAdjustedRents';
import BasicInfo from './BasicInfo';
import RightSubtitle from '$components/content/RightSubtitle';

type Props = {
  onCriteriaAgree: Function,
  rents: Object,
}

class Rent extends Component {
  props: Props

  render() {
    const {onCriteriaAgree, rents} = this.props;
    const rentType = get(rents, 'basic_info.type');

    return (
      <div className="rent-section">
        <Row>
          <Column>
            <h2>Vuokra</h2>
            <RightSubtitle
              text={rents.rent_info_ok
                ? <span className="success">Vuokratiedot kunnossa<i /></span>
                : <span className="alert">Vaatii toimenpiteitä<i /></span>
              }
            />
            </Column>
        </Row>
        <Divider />

        <Collapse
          className='no-content-top-padding'
          defaultOpen={true}
          header={
            <Row>
              <Column><h3 className='collapse__header-title'>Vuokran perustiedot</h3></Column>
            </Row>
          }>
          <BasicInfo basicInfo={get(rents, 'basic_info', {})}/>
        </Collapse>

        {(rentType === '0' ||
          rentType === '2' ||
          rentType === '4') &&
          <Collapse
            className='no-content-top-padding'
            defaultOpen={true}
            header={
              <Row>
                <Column><h3 className='collapse__header-title'>Sopimusvuokra</h3></Column>
              </Row>
            }>
            <ContractRents
              contractRents={get(rents, 'contract_rents', [])}
              rentType={rentType}
            />
          </Collapse>
        }

        {(rentType === '0' ||
          rentType === '4') &&
          <Collapse
            className='no-content-top-padding'
            defaultOpen={true}
            header={
              <Row>
                <Column><h3 className='collapse__header-title'>Indeksitarkistettu vuokra</h3></Column>
              </Row>
            }>
            <IndexAdjustedRents indexAdjustedRents={get(rents, 'index_adjusted_rents', [])}/>
          </Collapse>
        }

        {(rentType === '0' ||
          rentType === '2' ||
          rentType === '4') &&
          <Collapse
            className='no-content-top-padding'
            defaultOpen={true}
            header={
              <Row>
                <Column><h3 className='collapse__header-title'>Alennukset ja korotukset</h3></Column>
              </Row>
            }>
            <Discounts discounts={get(rents, 'discounts', [])}/>
          </Collapse>
        }

        {(rentType === '0' ||
          rentType === '2' ||
          rentType === '4') &&
          <Collapse
            className='no-content-top-padding'
            defaultOpen={true}
            header={
              <Row>
                <Column><h3 className='collapse__header-title'>Perittävä vuokra</h3></Column>
              </Row>
            }>
            <ChargedRents chargedRents={get(rents, 'charged_rents', [])}/>
          </Collapse>
        }

        {(rentType === '0' ||
          rentType === '1' ||
          rentType === '2' ||
          rentType === '4') &&
          <Collapse
            className='no-content-top-padding'
            defaultOpen={true}
            header={
              <Row>
                <Column><h3 className='collapse__header-title'>Vuokranperusteet</h3></Column>
              </Row>
            }>
            <Criterias
              criterias={get(rents, 'criterias', {})}
              onCriteriaAgree={(criteria) => onCriteriaAgree(criteria)}
            />
          </Collapse>
        }
      </div>
    );
  }
}

export default Rent;
