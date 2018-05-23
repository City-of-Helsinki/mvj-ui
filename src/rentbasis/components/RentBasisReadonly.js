// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';

import ContentContainer from '$components/content/ContentContainer';
import GreenBox from '$components/content/GreenBox';
import ListItems from '$components/content/ListItems';
import {formatDate, formatNumber, getAttributeFieldOptions, getLabelOfOption, getReferenceNumberLink} from '$util/helpers';
import {getAttributes} from '$src/rentbasis/selectors';

import type {Attributes, RentBasis} from '../types';

type Props = {
  attributes: Attributes,
  rentBasis: RentBasis,
}

const RentBasisReadonly = ({attributes, rentBasis}: Props) => {
  const plotTypeOptions = getAttributeFieldOptions(attributes, 'plot_type');
  const managementOptions = getAttributeFieldOptions(attributes, 'management');
  const financingOptions = getAttributeFieldOptions(attributes, 'financing');
  const priceIntendedUseOptions = getAttributeFieldOptions(attributes, 'rent_rates.child.children.intended_use');
  const pricePeriodOptions = getAttributeFieldOptions(attributes, 'rent_rates.child.children.period');

  return (
    <ContentContainer>
      <GreenBox>
        <Row>
          <Column small={6} medium={4} large={3}>
            <label>Tonttityyppi</label>
            <p>{getLabelOfOption(plotTypeOptions, rentBasis.plot_type) || '-'}</p>
          </Column>
          <Column small={6} medium={8} large={4}>
            <Row>
              <Column small={6}>
                <label>Alkupvm</label>
                <p>{formatDate(rentBasis.start_date) || '-'}</p>
              </Column>
              <Column small={6}>
                <label>Loppupvm</label>
                <p>{formatDate(rentBasis.end_date) || '-'}</p>
              </Column>
            </Row>

          </Column>
        </Row>
        <Row>
          <Column small={6} medium={4} large={3}>
            <label>Kiinteistötunnukset</label>
            {rentBasis.property_identifiers && !!rentBasis.property_identifiers.length
              ? (
                <ListItems>
                  {rentBasis.property_identifiers.map((item, index) => {
                    return(<p key={index} className='no-margin'>{item.identifier}</p>);
                  })}
                </ListItems>
              ) : <p>-</p>
            }
          </Column>
          <Column small={6} medium={4} large={2}>
            <label>Asemakaava</label>
            <p>{rentBasis.detailed_plan_identifier || '-'}</p>
          </Column>
          <Column small={6} medium={4} large={2}>
            <label>Hallintamuoto</label>
            <p>{getLabelOfOption(managementOptions, rentBasis.management) || '-'}</p>
          </Column>
          <Column small={6} medium={4} large={2}>
            <label>Hallintamuoto</label>
            <p>{getLabelOfOption(financingOptions, rentBasis.financing) || '-'}</p>
          </Column>
        </Row>
        <Row>
          <Column small={6} medium={4} large={3}>
            <label>Päätökset</label>
            {rentBasis.decisions && !!rentBasis.decisions.length
              ? (
                <ListItems>
                  {rentBasis.decisions.map((decision, index) => {
                    if(decision) {
                      return <p className='no-margin'><a className='no-margin' key={index} href={getReferenceNumberLink(decision.identifier)} target='_blank'>{decision.identifier}</a></p>;
                    } else {
                      return <p className='no-margin' key={index}>-</p>;
                    }
                  })}
                </ListItems>
              ) : <p>-</p>
            }
          </Column>
          <Column small={6} medium={4} large={2}>
            <label>Vuokraoikeus päättyy</label>
            <p>{formatDate(rentBasis.lease_rights_end_date) || '-'}</p>
          </Column>
          <Column small={6} medium={4} large={2}>
            <label>Indeksi</label>
            <p>{rentBasis.index || '-'}</p>
          </Column>
        </Row>
        <Row>
          <Column>
            <p className='sub-title'>Hinnat</p>
            {rentBasis.rent_rates && !!rentBasis.rent_rates.length
              ? (
                <ListItems>
                  <Row>
                    <Column small={6} medium={4} large={2}><label>Pääkäyttötarkoitus</label></Column>
                    <Column small={3} medium={4} large={1}><label>Euroa</label></Column>
                    <Column small={3} medium={4} large={1}><label>Yksikkö</label></Column>
                  </Row>
                  {rentBasis.rent_rates.map((price, index) => {
                    return(
                      <Row key={index}>
                        <Column small={6} medium={4} large={2}>
                          <p className='no-margin'>{getLabelOfOption(priceIntendedUseOptions, price.intended_use) || '-'}</p>
                        </Column>
                        <Column small={3} medium={4} large={1}>
                          <p className='no-margin'>{formatNumber(price.amount) || '-'}</p>
                        </Column>
                        <Column small={3} medium={4} large={1}>
                          <p className='no-margin'>{getLabelOfOption(pricePeriodOptions, price.period) || '-'}</p>
                        </Column>
                      </Row>
                    );
                  })}
                </ListItems>
              ) : <p>-</p>
            }
          </Column>
        </Row>
        <Row>
          <Column>
            <label>Huomautus</label>
            <p>{rentBasis.note || '-'}</p>
          </Column>
        </Row>
      </GreenBox>
    </ContentContainer>
  );
};

export default connect(
  (state) => {
    return {
      attributes: getAttributes(state),
    };
  }
)(RentBasisReadonly);
