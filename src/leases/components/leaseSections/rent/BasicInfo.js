// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';

import ListItems from '$components/content/ListItems';
import {
  formatDate,
  formatDateRange,
  formatDecimalNumber,
  formatNumberWithThousandSeparator,
  getAttributeFieldOptions,
  getLabelOfOption,
} from '$util/helpers';
import {RentTypes, RentDueDateTypes} from '$src/leases/enums';

import type {Attributes} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  rents: Object,
  rentType: ?string,
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

const BasicInfoOneTime = ({attributes, rents}: Props) => {
  const typeOptions = getAttributeFieldOptions(attributes, 'rents.child.children.type');

  return (
    <div>
      <Row>
        <Column medium={3}>
          <label>Vuokralaji</label>
          <p>{getLabelOfOption(typeOptions, rents.type) || '-'}</p>
        </Column>
        <Column medium={3}>
          <label>Kertakaikkinen vuokra</label>
          <p>{formatNumberWithThousandSeparator(formatDecimalNumber(rents.amount)) || '-'}</p>
        </Column>
      </Row>
      <Row>
        <Column>
          <label>Kommentti</label>
          <p>{rents.note || '-'}</p>
        </Column>
      </Row>
    </div>
  );
};

const BasicInfoFixed = ({attributes, rents}: Props) => {
  const typeOptions = getAttributeFieldOptions(attributes, 'rents.child.children.type');

  return (
    <div>
      <Row>
        <Column medium={3}>
          <label>Vuokralaji</label>
          <p>{getLabelOfOption(typeOptions, rents.type) || '-'}</p>
        </Column>
        <Column medium={3}>
          <label>Kertakaikkinen vuokra</label>
          <p>{formatNumberWithThousandSeparator(formatDecimalNumber(rents.amount)) || '-'}</p>
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
        <Column>
          <label>Kommentti</label>
          <p>{rents.note || '-'}</p>
        </Column>
      </Row>
    </div>
  );
};

const BasicInfoFree = ({attributes, rents}: Props) => {
  const typeOptions = getAttributeFieldOptions(attributes, 'rents.child.children.type');

  return (
    <div>
      <Row>
        <Column medium={3}>
          <label>Vuokralaji</label>
          <p>{getLabelOfOption(typeOptions, rents.type) || '-'}</p>
        </Column>
      </Row>
      <Row>
        <Column>
          <label>Kommentti</label>
          <p>{rents.note || '-'}</p>
        </Column>
      </Row>
    </div>
  );
};

const BasicInfo = ({attributes, rents, rentType}: Props) => {
  return (
    <div>
      {!rentType &&
        <p>Vuokralajia ei ole valittu</p>
      }
      {rentType === RentTypes.INDEX &&
        <BasicInfoIndex
          attributes={attributes}
          rents={rents}
          rentType={rentType}
        />
      }
      {rentType === RentTypes.ONE_TIME &&
        <BasicInfoOneTime
          attributes={attributes}
          rents={rents}
          rentType={rentType}
        />
      }
      {rentType === RentTypes.FIXED &&
        <BasicInfoFixed
          attributes={attributes}
          rents={rents}
          rentType={rentType}
        />
      }
      {rentType === RentTypes.FREE &&
        <BasicInfoFree
          attributes={attributes}
          rents={rents}
          rentType={rentType}
        />
      }
      {rentType === RentTypes.MANUAL &&
        <BasicInfoIndex
          attributes={attributes}
          rents={rents}
          rentType={rentType}
        />
      }
    </div>
  );
};

export default BasicInfo;
