// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';

import {formatDateRange, formatDecimalNumbers, formatNumberWithThousandSeparator} from '../../../../util/helpers';

type Props = {
  basicInfo: Object,
}

const RentBasicInfo = ({basicInfo}: Props) => {
  const {due_dates} = basicInfo;
  return (
    <div className={'green-box no-margin'}>
      <div className="section-item">
        <Row>
          <Column medium={10}>
            <Row>
              <Column medium={3}>
                <label>Vuokralaji</label>
                <p>{basicInfo.type ? basicInfo.type : '-'}</p>
              </Column>
              <Column medium={3}>
                <label>Vuokrakausi</label>
                <p>{basicInfo.rental_period ? basicInfo.rental_period : '-'}</p>
              </Column>
              <Column medium={6}>
                <label>Indeksin tunnusnumero (laskentalaji)</label>
                <p>{basicInfo.index_type ? basicInfo.index_type : '-'} ({basicInfo.index_calculation_type ? basicInfo.index_calculation_type : '-'})</p>
              </Column>
            </Row>
            <Row>
              <Column medium={3}>
                <label>Perusindeksi/pyöristys</label>
                <p>{basicInfo.basic_index ? basicInfo.basic_index : '-'} / {basicInfo.basic_index_rounding ? basicInfo.basic_index_rounding : '-'}</p>
              </Column>
              <Column medium={3}>
                <Row>
                  <Column medium={6}>
                    <label>X-luku</label>
                    <p>{basicInfo.x_value ? basicInfo.x_value : '-'}</p>
                  </Column>
                  <Column medium={6}>
                    <label>Y-luku</label>
                    <p>{basicInfo.y_value ? basicInfo.y_value : '-'}</p>
                  </Column>
                </Row>
              </Column>
              <Column medium={3}>
                <label>Y-alkaen</label>
                <p>{basicInfo.y_value_start ? basicInfo.y_value_start : '-'}</p>
              </Column>
              <Column medium={3}>
                <label>Tasaus pvm</label>
                {formatDateRange(basicInfo.adjustment_start_date, basicInfo.adjustment_end_date)}
              </Column>
            </Row>
            {basicInfo.fidex_initial_year_rents && basicInfo.fidex_initial_year_rents.length > 0 &&
              <div style={{marginBottom: '0.625rem'}}>
                <Row>
                  <Column medium={3}>
                    <label>Kiinteä alkuvuosivuokra</label>
                  </Column>
                  <Column medium={3}>
                    <label>Alkuvuosivuokra-aika</label>
                  </Column>
                  <Column medium={6}>
                    <label>Kommentti</label>
                  </Column>
                </Row>
                {basicInfo.fidex_initial_year_rents.map((rent) => {
                  return (
                    <Row>
                      <Column medium={3}>
                        <p style={{marginBottom: '0'}}>{rent.rent ? formatNumberWithThousandSeparator(formatDecimalNumbers(rent.rent), '.') : '-'}</p>
                      </Column>
                      <Column medium={3}>
                        <p style={{marginBottom: '0'}}>{formatDateRange(rent.start_date, rent.end_date)}</p>
                      </Column>
                      <Column medium={6}>
                        <p style={{marginBottom: '0'}}>{rent.comment ? rent.comment : '-'}</p>
                      </Column>
                    </Row>
                  );
                })
              }
            </div>
            }

          </Column>
          <Column medium={2}>
            <label>Eräpäivät</label>
            {due_dates && due_dates.length > 0
              ? (due_dates.map((due_date, index) => {
                return <p style={{marginBottom: '0'}} key={index}>{due_date}</p>;
              })

              )
              : <p>Ei eräpäiviä</p>
            }
          </Column>
        </Row>
      </div>
    </div>
  );
};

export default RentBasicInfo;
