// @flow
import React, {Component} from 'react';
import {Row, Column} from 'react-foundation';
import moment from 'moment';
import forEach from 'lodash/forEach';
import get from 'lodash/get';

import Collapse from '../../../../components/collapse/Collapse';
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

type State = {isDiscountsOpen: boolean}

class Rent extends Component {
  props: Props

  state: State

  componentWillMount() {
    const isDiscountsOpen = this.isDiscountsOpenByDefault();
    this.setState({isDiscountsOpen: isDiscountsOpen});
  }

  isDiscountsOpenByDefault = () => {
    const {rents: {discounts}} = this.props;

    if(!discounts || !discounts.length) {return false;}

    let isOpen = false;
    forEach(discounts, (discount) => {
      const {start_date, end_date} = discount;
      if(start_date && !end_date) {
        isOpen = true;
        return false;
      } else if (start_date && end_date) {
        if(moment() <= end_date || moment() <= start_date) {
          isOpen = true;
          return false;
        }
      }
    });
    return isOpen;
  }

  render() {
    const {onCriteriaAgree, rents} = this.props;
    const {isDiscountsOpen} = this.state;
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

        <Collapse
          className='collapse__secondary collapse__rents'
          defaultOpen={true}
          header={
            <Row>
              <Column small={6}><span className='collapse__header-title'>Vuokran perustiedot</span></Column>
            </Row>
          }>
          <RentBasicInfo basicInfo={get(rents, 'basic_info', {})}/>
        </Collapse>

        {(rentType === '0' || rentType === '2' || rentType === '4') &&
          <Collapse
            className='collapse__secondary collapse__rents'
            defaultOpen={true}
            header={
              <Row>
                <Column small={6}><span className='collapse__header-title'>Sopimusvuokra</span></Column>
              </Row>
            }>
            <ContractRents
              contractRents={get(rents, 'contract_rents', [])}
              rentType={rentType}
            />
          </Collapse>
        }

        {(rentType === '0' || rentType === '4') &&
          <Collapse
            className='collapse__secondary collapse__rents'
            defaultOpen={true}
            header={
              <Row>
                <Column small={6}><span className='collapse__header-title'>Indeksitarkistettu vuokra</span></Column>
              </Row>
            }>
            <IndexAdjustedRents indexAdjustedRents={get(rents, 'index_adjusted_rents', [])}/>
          </Collapse>
        }

        {(rentType === '0' || rentType === '2' || rentType === '4') &&
          <Collapse
            className='collapse__secondary collapse__rents'
            defaultOpen={isDiscountsOpen}
            header={
              <Row>
                <Column small={6}><span className='collapse__header-title'>Alennukset ja korotukset</span></Column>
              </Row>
            }>
            <Discounts discounts={get(rents, 'discounts', [])}/>
          </Collapse>
        }

        {(rentType === '0' || rentType === '2' || rentType === '4') &&
          <Collapse
            className='collapse__secondary collapse__rents'
            defaultOpen={true}
            header={
              <Row>
                <Column small={6}><span className='collapse__header-title'>Perittävä vuokra</span></Column>
              </Row>
            }>
            <ChargedRents chargedRents={get(rents, 'charged_rents', [])}/>
          </Collapse>
        }

        {(rentType === '0' || rentType === '1' || rentType === '2' || rentType === '4') &&
          <Collapse
            className='collapse__secondary collapse__rents'
            defaultOpen={true}
            header={
              <Row>
                <Column small={6}><span className='collapse__header-title'>Vuokranperusteet</span></Column>
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
