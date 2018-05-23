// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';

import ListItems from '$components/content/ListItems';
import {RentTypes, RentDueDateTypes} from '$src/leases/enums';
import {
  formatDate,
  formatDateRange,
  formatNumber,
  getAttributeFieldOptions,
  getLabelOfOption,
} from '$util/helpers';
import {getAttributes} from '$src/leases/selectors';

import type {Attributes} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  rent: Object,
  rentType: ?string,
}

const BasicInfoIndex = ({attributes, rent}: Props) => {
  const typeOptions = getAttributeFieldOptions(attributes, 'rents.child.children.type');
  const cycleOptions = getAttributeFieldOptions(attributes, 'rents.child.children.cycle');
  const indexTypeOptions = getAttributeFieldOptions(attributes, 'rents.child.children.index_type');
  const intendedUseOptions = getAttributeFieldOptions(attributes, 'rents.child.children.fixed_initial_year_rents.child.children.intended_use');

  return (
    <div>
      <Row>
        <Column small={6} medium={4} large={2}>
          <label>Vuokralaji</label>
          <p>{getLabelOfOption(typeOptions, rent.type) || '-'}</p>
        </Column>
        <Column small={3} medium={2} large={1}>
          <label>Alkupvm</label>
          <p>{formatDate(rent.start_date) || '-'}</p>
        </Column>
        <Column small={3} medium={2} large={1}>
          <label>Loppupvm</label>
          <p>{formatDate(rent.end_date) || '-'}</p>
        </Column>
        <Column small={6} medium={4} large={2}>
          <label>Vuokrakausi</label>
          <p>{getLabelOfOption(cycleOptions, rent.cycle) || '-'}</p>
        </Column>
        <Column small={6} medium={4} large={2}>
          <label>Indeksin tunnusnumero</label>
          <p>{getLabelOfOption(indexTypeOptions, rent.index_type) || '-'}</p>
        </Column>
        {rent.due_dates_type === RentDueDateTypes.CUSTOM &&
          <Column small={6} medium={4} large={2}>
            <label>Eräpäivät</label>
            <ListItems>
              {rent.due_dates && !!rent.due_dates.length
                ? (rent.due_dates.map((date, index) => {
                  return (<p className='no-margin' key={index}>{`${date.day}.${date.month}`}</p>);
                }))
                : <p className='no-margin'>Ei eräpäiviä</p>
              }
            </ListItems>
          </Column>
        }
        {rent.due_dates_type === RentDueDateTypes.FIXED &&
          <Column small={6} medium={4} large={2}>
            <label>Laskut kpl / vuodessa</label>
            <p>{rent.due_dates_per_year || '-'}</p>
          </Column>
        }
      </Row>
      <Row>
        {(!!rent.elementary_index || !!rent.index_rounding) &&
          <Column small={12} medium={4} large={2}>
            <label>Perusindeksi/pyöristys</label>
            <p>{rent.elementary_index || '-'} / {rent.index_rounding || '-'}</p>
          </Column>
        }
        {!!rent.x_value &&
          <Column small={4} medium={2} large={1}>
            <label>X-luku</label>
            <p>{rent.x_value || '-'}</p>
          </Column>
        }
        {!!rent.y_value &&
          <Column small={4} medium={2} large={1}>
            <label>Y-luku</label>
            <p>{rent.y_value || '-'}</p>
          </Column>
        }
        {!!rent.y_value_start &&
          <Column small={4} medium={2} large={1}>
            <label>Y-alkaen</label>
            <p>{rent.y_value_start || '-'}</p>
          </Column>
        }
        {(rent.equalization_start_date || rent.equalization_end_date) &&
          <Column small={12} medium={4} large={2}>
            <label>Tasaus pvm</label>
            <p>{formatDateRange(rent.equalization_start_date, rent.equalization_end_date) || '-'}</p>
          </Column>
        }
      </Row>
      {!!rent.fixed_initial_year_rents && !!rent.fixed_initial_year_rents.length &&
        <ListItems>
          <p className='sub-title'>Kiinteät alkuvuosivuokrat</p>
          <Row>
            <Column small={3} medium={3} large={2}>
              <label>Käyttötarkoitus</label>
            </Column>
            <Column small={3} medium={3} large={2}>
              <label>Kiinteä alkuvuosivuokra</label>
            </Column>
            <Column small={3} medium={3} large={2}>
              <label>Alkupvm</label>
            </Column>
            <Column small={3} medium={3} large={2}>
              <label>Loppupvm</label>
            </Column>
          </Row>
          {rent.fixed_initial_year_rents.map((item, index) => {
            return (
              <Row key={index}>
                <Column small={3} medium={3} large={2}>
                  <p className='no-margin'>{getLabelOfOption(intendedUseOptions, item.intended_use) || '-'}</p>
                </Column>
                <Column small={3} medium={3} large={2}>
                  <p className='no-margin'>{item.amount ? `${formatNumber(item.amount)} €` : '-'}</p>
                </Column>
                <Column small={3} medium={3} large={2}>
                  <p className='no-margin'>{formatDate(item.start_date) || '-'}</p>
                </Column>
                <Column small={3} medium={3} large={2}>
                  <p className='no-margin'>{formatDate(item.end_date) || '-'}</p>
                </Column>
              </Row>
            );
          })}
        </ListItems>
      }
      <Row>
        <Column>
          <label>Huomautus</label>
          <p>{rent.note || '-'}</p>
        </Column>
      </Row>
    </div>
  );
};

const BasicInfoOneTime = ({attributes, rent}: Props) => {
  const typeOptions = getAttributeFieldOptions(attributes, 'rents.child.children.type');

  return (
    <div>
      <Row>
        <Column small={6} medium={4} large={2}>
          <label>Vuokralaji</label>
          <p>{getLabelOfOption(typeOptions, rent.type) || '-'}</p>
        </Column>
        <Column small={3} medium={2} large={1}>
          <label>Alkupvm</label>
          <p>{formatDate(rent.start_date) || '-'}</p>
        </Column>
        <Column small={3} medium={2} large={1}>
          <label>Loppupvm</label>
          <p>{formatDate(rent.end_date) || '-'}</p>
        </Column>
        <Column small={6} medium={4} large={2}>
          <label>Kertakaikkinen vuokra</label>
          <p>{formatNumber(rent.amount) || '-'}</p>
        </Column>
      </Row>
      <Row>
        <Column>
          <label>Huomautus</label>
          <p>{rent.note || '-'}</p>
        </Column>
      </Row>
    </div>
  );
};

const BasicInfoFixed = ({attributes, rent}: Props) => {
  const typeOptions = getAttributeFieldOptions(attributes, 'rents.child.children.type');

  return (
    <div>
      <Row>
        <Column small={6} medium={4} large={2}>
          <label>Vuokralaji</label>
          <p>{getLabelOfOption(typeOptions, rent.type) || '-'}</p>
        </Column>
        <Column small={3} medium={2} large={1}>
          <label>Alkupvm</label>
          <p>{formatDate(rent.start_date) || '-'}</p>
        </Column>
        <Column small={3} medium={2} large={1}>
          <label>Loppupvm</label>
          <p>{formatDate(rent.end_date) || '-'}</p>
        </Column>
        {rent.due_dates_type === RentDueDateTypes.CUSTOM &&
          <Column small={6} medium={4} large={2}>
            <label>Eräpäivät</label>
            <ListItems>
              {rent.due_dates && !!rent.due_dates.length
                ? (rent.due_dates.map((date, index) => {
                  return (<p className='no-margin' key={index}>{`${date.day}.${date.month}`}</p>);
                }))
                : <p className='no-margin'>Ei eräpäiviä</p>
              }
            </ListItems>
          </Column>
        }
        {rent.due_dates_type === RentDueDateTypes.FIXED &&
          <Column small={6} medium={4} large={2}>
            <label>Laskut kpl / vuodessa</label>
            <p>{rent.due_dates_per_year || '-'}</p>
          </Column>
        }
      </Row>
      <Row>
        <Column>
          <label>Huomautus</label>
          <p>{rent.note || '-'}</p>
        </Column>
      </Row>
    </div>
  );
};

const BasicInfoFree = ({attributes, rent}: Props) => {
  const typeOptions = getAttributeFieldOptions(attributes, 'rents.child.children.type');

  return (
    <div>
      <Row>
        <Column small={6} medium={4} large={2}>
          <label>Vuokralaji</label>
          <p>{getLabelOfOption(typeOptions, rent.type) || '-'}</p>
        </Column>
      </Row>
      <Column small={3} medium={2} large={1}>
        <label>Alkupvm</label>
        <p>{formatDate(rent.start_date) || '-'}</p>
      </Column>
      <Column small={3} medium={2} large={1}>
        <label>Loppupvm</label>
        <p>{formatDate(rent.end_date) || '-'}</p>
      </Column>
      <Row>
        <Column>
          <label>Huomautus</label>
          <p>{rent.note || '-'}</p>
        </Column>
      </Row>
    </div>
  );
};

const BasicInfo = ({attributes, rent, rentType}: Props) => {
  return (
    <div>
      {!rentType &&
        <p>Vuokralajia ei ole valittu</p>
      }
      {rentType === RentTypes.INDEX &&
        <BasicInfoIndex
          attributes={attributes}
          rent={rent}
          rentType={rentType}
        />
      }
      {rentType === RentTypes.ONE_TIME &&
        <BasicInfoOneTime
          attributes={attributes}
          rent={rent}
          rentType={rentType}
        />
      }
      {rentType === RentTypes.FIXED &&
        <BasicInfoFixed
          attributes={attributes}
          rent={rent}
          rentType={rentType}
        />
      }
      {rentType === RentTypes.FREE &&
        <BasicInfoFree
          attributes={attributes}
          rent={rent}
          rentType={rentType}
        />
      }
      {rentType === RentTypes.MANUAL &&
        <BasicInfoIndex
          attributes={attributes}
          rent={rent}
          rentType={rentType}
        />
      }
    </div>
  );
};

export default connect(
  (state) => {
    return {
      attributes: getAttributes(state),
    };
  },
)(BasicInfo);
