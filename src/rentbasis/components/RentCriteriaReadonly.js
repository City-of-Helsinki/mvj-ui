// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';

import {formatDate, getLabelOfOption} from '$util/helpers';
import {financialMethodOptions,
  managementMethodOptions,
  plotTypeOptions,
  purposeOptions,
  priceTypeOptions,
} from '$src/constants';
import ContentContainer from '$components/content/ContentContainer';
import Divider from '$components/content/Divider';
import GreenBox from '$components/content/GreenBox';
import ListItems from '../../components/content/ListItems';
// import MapLinkButton from '$components/content/MapLinkButton';

type Props = {
  criteria: Object,
}

const RentCriteriaReadonly = ({criteria}: Props) => {
  return (
    <ContentContainer>
      <h2>Vuokrausperuste</h2>
      <Divider />
      <GreenBox>
        {/* <MapLinkButton
          label='Kartta'
          onClick={() => alert('TODO: Avaa kartta')}
        /> */}
        <Row>
          <Column small={6} medium={4} large={3}>
            <label>Tonttityyppi</label>
            <p>{getLabelOfOption(plotTypeOptions, criteria.plot_type) || '-'}</p>
          </Column>
          <Column small={6} medium={8} large={4}>
            <Row>
              <Column small={6}>
                <label>Alkupvm</label>
                <p>{formatDate(criteria.start_date) || '-'}</p>
              </Column>
              <Column small={6}>
                <label>Loppupvm</label>
                <p>{formatDate(criteria.end_date) || '-'}</p>
              </Column>
            </Row>

          </Column>
        </Row>
        <Row>
          <Column small={6} medium={4} large={3}>
            <label>Kiinteistötunnukset</label>
            {criteria.real_estate_ids && !!criteria.real_estate_ids.length
              ? (
                criteria.real_estate_ids.map((item, index) => {
                  return(<p key={index}>{item}</p>);
                })
              ) : <p>-</p>
            }
          </Column>
          <Column small={6} medium={4} large={2}>
            <label>Asemakaava</label>
            <p>{criteria.plan || '-'}</p>
          </Column>
          <Column small={6} medium={4} large={2}>
            <label>Hallintamuoto</label>
            <p>{getLabelOfOption(managementMethodOptions, criteria.management_method) || '-'}</p>
          </Column>
          <Column small={6} medium={4} large={2}>
            <label>Hallintamuoto</label>
            <p>{getLabelOfOption(financialMethodOptions, criteria.financial_method) || '-'}</p>
          </Column>
        </Row>
        <Row>
          <Column small={6} medium={4} large={3}>
            <label>Päätökset</label>
            {criteria.decisions && !!criteria.decisions.length
              ? (
                criteria.decisions.map((decision, index) => {
                  return(<p key={index}>{decision}</p>);
                })
              ) : <p>-</p>
            }
          </Column>
          <Column small={6} medium={4} large={2}>
            <label>Asemakaava</label>
            <p>{formatDate(criteria.rental_right_end_date) || '-'}</p>
          </Column>
          <Column small={6} medium={4} large={2}>
            <label>Indeksi</label>
            <p>{criteria.index || '-'}</p>
          </Column>
        </Row>
        <Row>
          <Column>
            <p className='sub-title'>Hinnat</p>
            {criteria.prices && !!criteria.prices.length
              ? (
                <ListItems>
                  <Row>
                    <Column small={6} medium={4} large={2}><label>Pääkäyttötarkoitus</label></Column>
                    <Column small={3} medium={4} large={1}><label>Euroa</label></Column>
                    <Column small={3} medium={4} large={1}><label>Yksikkö</label></Column>
                  </Row>
                  {criteria.prices.map((price, index) => {
                    return(
                      <Row key={index}>
                        <Column small={6} medium={4} large={2}>
                          <p className='no-margin'>{getLabelOfOption(purposeOptions, price.purpose) || '-'}</p>
                        </Column>
                        <Column small={3} medium={4} large={1}>
                          <p className='no-margin'>{price.amount || '-'}</p>
                        </Column>
                        <Column small={3} medium={4} large={1}>
                          <p className='no-margin'>{getLabelOfOption(priceTypeOptions, price.unit) || '-'}</p>
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
            <label>Kommentti</label>
            <p>{criteria.comment || '-'}</p>
          </Column>
        </Row>
      </GreenBox>
    </ContentContainer>
  );
};

export default RentCriteriaReadonly;
