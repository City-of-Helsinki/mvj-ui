// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';

import {formatDateRange, formatDecimalNumbers, formatNumberWithThousandSeparator} from '../../../../util/helpers';

import {getBasicInfoIndexTypeLabel,
  getBasicInfoRentalPeriodLabel,
  getBasicInfoTypeLabel} from '../helpers';

type Props = {
  basicInfo: Object,
}

const BasicInfoIndex = ({basicInfo}: Props) => {
  const {adjustment_end_date,
    adjustment_start_date,
    basic_index,
    basic_index_rounding,
    bill_amount,
    billing_type,
    comment,
    due_dates,
    fidex_initial_year_rents,
    index_type,
    rental_period,
    type,
    x_value,
    y_value,
    y_value_start} = basicInfo;

  return (
    <div className="section-item">
      <Row>
        <Column medium={10}>
          <Row>
            <Column medium={3}>
              <label>Vuokralaji</label>
              <p>{type ? getBasicInfoTypeLabel(type) : '-'}</p>
            </Column>
            <Column medium={3}>
              <label>Vuokrakausi</label>
              <p>{rental_period ? getBasicInfoRentalPeriodLabel(rental_period) : '-'}</p>
            </Column>
            <Column medium={6}>
              <label>Indeksin tunnusnumero (laskentalaji)</label>
              <p>{index_type ? getBasicInfoIndexTypeLabel(index_type) : '-'}</p>
            </Column>
          </Row>
          <Row>
            <Column medium={3}>
              <label>Perusindeksi/pyöristys</label>
              <p>{basic_index ? basic_index : '-'} / {basic_index_rounding ? basic_index_rounding : '-'}</p>
            </Column>
            <Column medium={3}>
              <Row>
                <Column medium={6}>
                  <label>X-luku</label>
                  <p>{x_value ? x_value : '-'}</p>
                </Column>
                <Column medium={6}>
                  <label>Y-luku</label>
                  <p>{y_value ? y_value : '-'}</p>
                </Column>
              </Row>
            </Column>
            <Column medium={3}>
              <label>Y-alkaen</label>
              <p>{y_value_start ? y_value_start : '-'}</p>
            </Column>
            <Column medium={3}>
              <label>Tasaus pvm</label>
              {formatDateRange(adjustment_start_date, adjustment_end_date)}
            </Column>
          </Row>
          {fidex_initial_year_rents && fidex_initial_year_rents.length > 0 &&
            <div style={{marginBottom: '0.625rem'}}>
              <Row>
                <Column medium={3}>
                  <label>Kiinteä alkuvuosivuokra</label>
                </Column>
                <Column medium={3}>
                  <label>Alkuvuosivuokra-aika</label>
                </Column>
              </Row>
              {fidex_initial_year_rents.map((rent, index) => {
                return (
                  <Row key={index}>
                    <Column medium={3}>
                      <p style={{marginBottom: '0'}}>{rent.rent ? formatNumberWithThousandSeparator(formatDecimalNumbers(rent.rent), '.') : '-'}</p>
                    </Column>
                    <Column medium={3}>
                      <p style={{marginBottom: '0'}}>{formatDateRange(rent.start_date, rent.end_date)}</p>
                    </Column>
                    <Column medium={6}>
                    </Column>
                  </Row>
                );
              })}
            </div>
          }
          <Row>
            <Column>
              <label>Kommentti</label>
              <p style={{marginBottom: '0'}}>{comment ? comment : '-'}</p>
            </Column>
          </Row>
        </Column>
        {billing_type === '0' &&
          <Column medium={2}>
            <label>Eräpäivät</label>
            {due_dates && due_dates.length > 0
              ? (due_dates.map((due_date, index) => {
                return (<p style={{marginBottom: '0'}} key={index}>{due_date}</p>);
              }))
              : <p>Ei eräpäiviä</p>
            }
          </Column>
        }
        {billing_type === '1' &&
          <Column medium={2}>
            <label>Laskut kpl / vuodessa</label>
            <p>{bill_amount ? bill_amount : '-'}</p>
          </Column>
        }
      </Row>
    </div>
  );
};

const BasicInfoUtter = ({basicInfo}: Props) => {
  const {comment,
    rent_amount,
    type} = basicInfo;

  return (
    <div className="section-item">
      <Row>
        <Column medium={3}>
          <label>Vuokralaji</label>
          <p>{type ? getBasicInfoTypeLabel(type) : '-'}</p>
        </Column>
        <Column medium={3}>
          <label>Kertakaikkinen vuokra</label>
          <p>{rent_amount ? `${formatNumberWithThousandSeparator(formatDecimalNumbers(rent_amount))} €` : '-'}</p>
        </Column>
      </Row>
      <Row>
        <Column>
          <label>Kommentti</label>
          <p>{comment ? comment : '-'}</p>
        </Column>
      </Row>
    </div>
  );
};

const BasicInfoFixed = ({basicInfo}: Props) => {
  const {bill_amount,
    billing_type,
    comment,
    due_dates,
    rent_amount,
    type} = basicInfo;

  return (
    <div className="section-item">
      <Row>
        <Column medium={3}>
          <label>Vuokralaji</label>
          <p>{type ? getBasicInfoTypeLabel(type) : '-'}</p>
        </Column>
        <Column medium={3}>
          <label>Kertakaikkinen vuokra</label>
          <p>{rent_amount ? `${formatNumberWithThousandSeparator(formatDecimalNumbers(rent_amount))} €` : '-'}</p>
        </Column>
        {billing_type === '0' &&
          <Column medium={3} offsetOnMedium={3}>
            <label>Eräpäivät</label>
            {due_dates && due_dates.length > 0
              ? (due_dates.map((due_date, index) => {
                return (<p style={{marginBottom: '0'}} key={index}>{due_date}</p>);
              }))
              : <p>Ei eräpäiviä</p>
            }
          </Column>
        }
        {billing_type === '1' &&
          <Column medium={3} offsetOnMedium={3}>
            <label>Laskut kpl / vuodessa</label>
            <p>{bill_amount ? bill_amount : '-'}</p>
          </Column>
        }
      </Row>
      <Row>
        <Column>
          <label>Kommentti</label>
          <p>{comment ? comment : '-'}</p>
        </Column>
      </Row>
    </div>
  );
};

const BasicInfoFree = ({basicInfo}: Props) => {
  const {comment,
    type} = basicInfo;

  return (
    <div className="section-item">
      <Row>
        <Column medium={3}>
          <label>Vuokralaji</label>
          <p>{type ? getBasicInfoTypeLabel(type) : '-'}</p>
        </Column>
      </Row>
      <Row>
        <Column>
          <label>Kommentti</label>
          <p>{comment ? comment : '-'}</p>
        </Column>
      </Row>
    </div>
  );
};

const BasicInfoCalculated = ({basicInfo}: Props) => {
  const {bill_amount,
    billing_type,
    comment,
    due_dates,
    type} = basicInfo;

  return (
    <div className="section-item">
      <Row>
        <Column medium={3}>
          <label>Vuokralaji</label>
          <p>{type ? getBasicInfoTypeLabel(type) : '-'}</p>
        </Column>
        {billing_type === '0' &&
          <Column medium={3} offsetOnMedium={6}>
            <label>Eräpäivät</label>
            {due_dates && due_dates.length > 0
              ? (due_dates.map((due_date, index) => {
                return (<p style={{marginBottom: '0'}} key={index}>{due_date}</p>);
              }))
              : <p>Ei eräpäiviä</p>
            }
          </Column>
        }
        {billing_type === '1' &&
          <Column medium={3} offsetOnMedium={6}>
            <label>Laskut kpl / vuodessa</label>
            <p>{bill_amount ? bill_amount : '-'}</p>
          </Column>
        }
      </Row>
      <Row>
        <Column>
          <label>Kommentti</label>
          <p>{comment ? comment : '-'}</p>
        </Column>
      </Row>
    </div>
  );
};

const RentBasicInfo = ({basicInfo}: Props) => {
  const {type} = basicInfo;

  return (
    <div className={'green-box no-margin'}>
      {type === '0' &&
        <BasicInfoIndex
          basicInfo={basicInfo}
        />
      }
      {type === '1' &&
        <BasicInfoUtter
          basicInfo={basicInfo}
        />
      }
      {type === '2' &&
        <BasicInfoFixed
          basicInfo={basicInfo}
        />
      }
      {type === '3' &&
        <BasicInfoFree
          basicInfo={basicInfo}
        />
      }
      {type === '4' &&
        <BasicInfoCalculated
          basicInfo={basicInfo}
        />
      }
    </div>
  );
};

export default RentBasicInfo;
