// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import ListItems from '$components/content/ListItems';
import {
  formatDate,
  formatDateRange,
  formatDecimalNumber,
  formatNumberWithThousandSeparator,
  getAttributeFieldOptions,
  getLabelOfOption,
} from '$util/helpers';
import {rentBasicInfoTypeOptions} from '../constants';
import {RentTypes, RentDueDateTypes} from '$src/leases/enums';

import type {Attributes} from '$src/leases/types';

type Props = {
  attributes?: Attributes,
  rents: Object,
}

const BasicInfoIndex = ({attributes, rents}: Props) => {
  const typeOptions = getAttributeFieldOptions(attributes, 'rents.child.children.type');
  const cycleOptions = getAttributeFieldOptions(attributes, 'rents.child.children.cycle');
  const indexTypeOptions = getAttributeFieldOptions(attributes, 'rents.child.children.index_type');

  return (
    <div>
      <Row>
        <Column small={6} medium={4} large={2}>
          <label>Vuokralaji</label>
          <p>{getLabelOfOption(typeOptions, rents.type) || '-'}</p>
        </Column>
        <Column small={6} medium={4} large={2}>
          <label>Vuokrakausi</label>
          <p>{getLabelOfOption(cycleOptions, rents.cycle) || '-'}</p>
        </Column>
        <Column small={6} medium={4} large={4}>
          <label>Indeksin tunnusnumero (laskentalaji)</label>
          <p>{getLabelOfOption(indexTypeOptions, rents.index_type) || '-'}</p>
        </Column>
        {rents.due_dates_type === RentDueDateTypes.CUSTOM &&
          <Column small={6} medium={4} large={2}>
            <label>Eräpäivät</label>
            <ListItems>
              {rents.due_dates && !!rents.due_dates.length
                ? (rents.due_dates.map((date, index) => {
                  return (<p className='no-margin' key={index}>{`${date.day}.${date.month}`}</p>);
                }))
                : <p className='no-margin'>Ei eräpäiviä</p>
              }
            </ListItems>
          </Column>
        }
        {rents.due_dates_type === RentDueDateTypes.FIXED &&
          <Column small={6} medium={4} large={2}>
            <label>Laskut kpl / vuodessa</label>
            <p>{rents.due_dates_per_year || '-'}</p>
          </Column>
        }
      </Row>
      <Row>
        <Column small={12} medium={4} large={2}>
          <label>Perusindeksi/pyöristys</label>
          <p>{rents.elementary_index || '-'} / {rents.index_rounding || '-'}</p>
        </Column>
        <Column small={4} medium={2} large={1}>
          <label>X-luku</label>
          <p>{rents.x_value || '-'}</p>
        </Column>
        <Column small={4} medium={2} large={1}>
          <label>Y-luku</label>
          <p>{rents.y_value || '-'}</p>
        </Column>
        <Column small={4} medium={2} large={1}>
          <label>Y-alkaen</label>
          <p>{rents.y_value_start || '-'}</p>
        </Column>
        <Column small={12} medium={4} large={2}>
          <label>Tasaus pvm</label>
          <p>{formatDateRange(rents.equalization_start_date, rents.equalization_end_date) || '-'}</p>
        </Column>
      </Row>
      {rents.fixed_initial_year_rents && !!rents.fixed_initial_year_rents.length &&
        <ListItems>
          <p className='sub-title'>Kiinteät alkuvuosivuokrat</p>
          <Row>
            <Column small={4} medium={4} large={2}>
              <label>Kiinteä alkuvuosivuokra</label>
            </Column>
            <Column small={4} medium={2} large={2}>
              <label>Alkupvm</label>
            </Column>
            <Column small={4} medium={2} large={2}>
              <label>Loppupvm</label>
            </Column>
          </Row>
          {rents.fixed_initial_year_rents.map((rent, index) => {
            return (
              <Row key={index}>
                <Column small={4} medium={4} large={2}>
                  <p className='no-margin'>{formatNumberWithThousandSeparator(formatDecimalNumber(rent.amount), '.') || '-'}</p>
                </Column>
                <Column small={4} medium={2} large={2}>
                  <p className='no-margin'>{formatDate(rent.start_date) || '-'}</p>
                </Column>
                <Column small={4} medium={2} large={2}>
                  <p className='no-margin'>{formatDate(rent.end_date) || '-'}</p>
                </Column>
              </Row>
            );
          })}
        </ListItems>
      }
      <Row>
        <Column>
          <label>Kommentti</label>
          <p>{rents.note || '-'}</p>
        </Column>
      </Row>
    </div>
  );
};

const BasicInfoOneTime = ({rents}: Props) => {
  const {comment,
    rent_amount,
    type} = rents;

  return (
    <div>
      <Row>
        <Column medium={3}>
          <label>Vuokralaji</label>
          <p>{type ? getLabelOfOption(rentBasicInfoTypeOptions, type) : '-'}</p>
        </Column>
        <Column medium={3}>
          <label>Kertakaikkinen vuokra</label>
          <p>{rent_amount ? `${formatNumberWithThousandSeparator(formatDecimalNumber(rent_amount))} €` : '-'}</p>
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

const BasicInfoFixed = ({rents}: Props) => {
  const {bill_amount,
    billing_type,
    comment,
    due_dates,
    rent_amount,
    type} = rents;

  return (
    <div>
      <Row>
        <Column medium={3}>
          <label>Vuokralaji</label>
          <p>{type ? getLabelOfOption(rentBasicInfoTypeOptions, type) : '-'}</p>
        </Column>
        <Column medium={3}>
          <label>Kertakaikkinen vuokra</label>
          <p>{rent_amount ? `${formatNumberWithThousandSeparator(formatDecimalNumber(rent_amount))} €` : '-'}</p>
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

const BasicInfoFree = ({rents}: Props) => {
  const {comment,
    type} = rents;

  return (
    <div>
      <Row>
        <Column medium={3}>
          <label>Vuokralaji</label>
          <p>{type ? getLabelOfOption(rentBasicInfoTypeOptions, type) : '-'}</p>
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

const BasicInfoManual = ({rents}: Props) => {
  const {bill_amount,
    billing_type,
    comment,
    due_dates,
    type} = rents;

  return (
    <div>
      <Row>
        <Column medium={3}>
          <label>Vuokralaji</label>
          <p>{type ? getLabelOfOption(rentBasicInfoTypeOptions, type) : '-'}</p>
        </Column>
        {billing_type === '0' &&
          <Column medium={3} offsetOnMedium={6}>
            <label>Eräpäivät</label>
            {due_dates && due_dates.length > 0
              ? (due_dates.map((due_date, index) =>
                <p style={{marginBottom: '0'}} key={index}>{due_date}</p>
              ))
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
          <p className='no-margin'>{comment ? comment : '-'}</p>
        </Column>
      </Row>
    </div>
  );
};

const BasicInfo = ({attributes, rents}: Props) => {
  const type = get(rents, 'type');

  return (
    <div>
      {type === RentTypes.INDEX &&
        <BasicInfoIndex
          attributes={attributes}
          rents={rents}
        />
      }
      {type === RentTypes.ONE_TIME &&
        <BasicInfoOneTime
          rents={rents}
        />
      }
      {type === RentTypes.FIXED &&
        <BasicInfoFixed
          rents={rents}
        />
      }
      {type === RentTypes.FREE &&
        <BasicInfoFree
          rents={rents}
        />
      }
      {type === RentTypes.MANUAL &&
        <BasicInfoManual
          rents={rents}
        />
      }
    </div>
  );
};

export default BasicInfo;
