// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';

import FormFieldLabel from '$components/form/FormFieldLabel';
import ListItems from '$components/content/ListItems';
import {RentTypes, RentDueDateTypes} from '$src/leases/enums';
import {
  formatDate,
  formatNumber,
  getAttributeFieldOptions,
  getLabelOfOption,
} from '$util/helpers';
import {getAttributes} from '$src/leases/selectors';

import type {Attributes} from '$src/leases/types';

const formatDueDate = (date: Object) => {
  return `${date.day}.${date.month}`;
};

type Props = {
  attributes: Attributes,
  rent: Object,
  rentType: ?string,
}

const BasicInfoIndex = ({attributes, rent}: Props) => {
  const typeOptions = getAttributeFieldOptions(attributes, 'rents.child.children.type');
  const cycleOptions = getAttributeFieldOptions(attributes, 'rents.child.children.cycle');
  const indexTypeOptions = getAttributeFieldOptions(attributes, 'rents.child.children.index_type');
  const dueDatesTypeOptions = getAttributeFieldOptions(attributes, 'rents.child.children.due_dates_type');
  const intendedUseOptions = getAttributeFieldOptions(attributes, 'rents.child.children.fixed_initial_year_rents.child.children.intended_use');

  return (
    <div>
      <Row>
        <Column small={6} medium={4} large={2}>
          <FormFieldLabel>Vuokralaji</FormFieldLabel>
          <p>{getLabelOfOption(typeOptions, rent.type) || '-'}</p>
        </Column>
        <Column small={3} medium={2} large={1}>
          <FormFieldLabel>Alkupvm</FormFieldLabel>
          <p>{formatDate(rent.start_date) || '-'}</p>
        </Column>
        <Column small={3} medium={2} large={1}>
          <FormFieldLabel>Loppupvm</FormFieldLabel>
          <p>{formatDate(rent.end_date) || '-'}</p>
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormFieldLabel>Vuokrakausi</FormFieldLabel>
          <p>{getLabelOfOption(cycleOptions, rent.cycle) || '-'}</p>
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormFieldLabel>Indeksin tunnusnumero</FormFieldLabel>
          <p>{getLabelOfOption(indexTypeOptions, rent.index_type) || '-'}</p>
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormFieldLabel>Laskutusjako</FormFieldLabel>
          <p>{getLabelOfOption(dueDatesTypeOptions, rent.due_dates_type) || '-'}</p>
        </Column>
        {rent.due_dates_type === RentDueDateTypes.CUSTOM &&
          <Column small={6} medium={4} large={2}>
            <FormFieldLabel>Eräpäivät</FormFieldLabel>
            <ListItems>
              {rent.due_dates && !!rent.due_dates.length
                ? (rent.due_dates.map((date, index) => {
                  return <p className='no-margin' key={index}>{formatDueDate(date)}</p>;
                }))
                : <p className='no-margin'>Ei eräpäiviä</p>
              }
            </ListItems>
          </Column>
        }
        {rent.due_dates_type === RentDueDateTypes.FIXED &&
          <Column small={6} medium={4} large={2}>
            <FormFieldLabel>Eräpäivät</FormFieldLabel>
            <ListItems>
              {rent.yearly_due_dates && !!rent.yearly_due_dates.length
                ? (rent.yearly_due_dates.map((date, index) => {
                  return <p className='no-margin' key={index}>{formatDueDate(date)}</p>;
                }))
                : <p className='no-margin'>Ei eräpäiviä</p>
              }
            </ListItems>
          </Column>
        }
      </Row>
      <Row>
        {(!!rent.elementary_index || !!rent.index_rounding) &&
          <Column small={12} medium={4} large={2}>
            <FormFieldLabel>Perusindeksi/pyöristys</FormFieldLabel>
            <p>{rent.elementary_index || '-'} / {rent.index_rounding || '-'}</p>
          </Column>
        }
        {!!rent.x_value &&
          <Column small={4} medium={2} large={1}>
            <FormFieldLabel>X-luku</FormFieldLabel>
            <p>{rent.x_value || '-'}</p>
          </Column>
        }
        {!!rent.y_value &&
          <Column small={4} medium={2} large={1}>
            <FormFieldLabel>Y-luku</FormFieldLabel>
            <p>{rent.y_value || '-'}</p>
          </Column>
        }
        {!!rent.y_value_start &&
          <Column small={4} medium={2} large={1}>
            <FormFieldLabel>Y-alkaen</FormFieldLabel>
            <p>{rent.y_value_start || '-'}</p>
          </Column>
        }
        {(rent.equalization_start_date || rent.equalization_end_date) &&
          <Column small={12} medium={4} large={2}>
            <Row>
              <Column small={6}>
                <FormFieldLabel>Tasaus alkupvm</FormFieldLabel>
                <p>{formatDate(rent.equalization_start_date) || '-'}</p>
              </Column>
              <Column small={6}>
                <FormFieldLabel>Tasaus loppupvm</FormFieldLabel>
                <p>{formatDate(rent.equalization_end_date) || '-'}</p>
              </Column>
            </Row>

          </Column>
        }
      </Row>
      {!!rent.fixed_initial_year_rents && !!rent.fixed_initial_year_rents.length &&
        <ListItems>
          <p className='sub-title'>Kiinteät alkuvuosivuokrat</p>
          <Row>
            <Column small={3} medium={3} large={2}>
              <FormFieldLabel>Käyttötarkoitus</FormFieldLabel>
            </Column>
            <Column small={3} medium={3} large={2}>
              <FormFieldLabel>Kiinteä alkuvuosivuokra</FormFieldLabel>
            </Column>
            <Column small={3} medium={3} large={1}>
              <FormFieldLabel>Alkupvm</FormFieldLabel>
            </Column>
            <Column small={3} medium={3} large={1}>
              <FormFieldLabel>Loppupvm</FormFieldLabel>
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
                <Column small={3} medium={3} large={1}>
                  <p className='no-margin'>{formatDate(item.start_date) || '-'}</p>
                </Column>
                <Column small={3} medium={3} large={1}>
                  <p className='no-margin'>{formatDate(item.end_date) || '-'}</p>
                </Column>
              </Row>
            );
          })}
        </ListItems>
      }
      <Row>
        <Column>
          <FormFieldLabel>Huomautus</FormFieldLabel>
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
          <FormFieldLabel>Vuokralaji</FormFieldLabel>
          <p>{getLabelOfOption(typeOptions, rent.type) || '-'}</p>
        </Column>
        <Column small={3} medium={2} large={1}>
          <FormFieldLabel>Alkupvm</FormFieldLabel>
          <p>{formatDate(rent.start_date) || '-'}</p>
        </Column>
        <Column small={3} medium={2} large={1}>
          <FormFieldLabel>Loppupvm</FormFieldLabel>
          <p>{formatDate(rent.end_date) || '-'}</p>
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormFieldLabel>Kertakaikkinen vuokra</FormFieldLabel>
          <p>{formatNumber(rent.amount) || '-'}</p>
        </Column>
      </Row>
      <Row>
        <Column>
          <FormFieldLabel>Huomautus</FormFieldLabel>
          <p>{rent.note || '-'}</p>
        </Column>
      </Row>
    </div>
  );
};

const BasicInfoFixed = ({attributes, rent}: Props) => {
  const typeOptions = getAttributeFieldOptions(attributes, 'rents.child.children.type');
  const dueDatesTypeOptions = getAttributeFieldOptions(attributes, 'rents.child.children.due_dates_type');

  return (
    <div>
      <Row>
        <Column small={6} medium={4} large={2}>
          <FormFieldLabel>Vuokralaji</FormFieldLabel>
          <p>{getLabelOfOption(typeOptions, rent.type) || '-'}</p>
        </Column>
        <Column small={3} medium={2} large={1}>
          <FormFieldLabel>Alkupvm</FormFieldLabel>
          <p>{formatDate(rent.start_date) || '-'}</p>
        </Column>
        <Column small={3} medium={2} large={1}>
          <FormFieldLabel>Loppupvm</FormFieldLabel>
          <p>{formatDate(rent.end_date) || '-'}</p>
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormFieldLabel>Laskutusjako</FormFieldLabel>
          <p>{getLabelOfOption(dueDatesTypeOptions, rent.due_dates_type) || '-'}</p>
        </Column>
        {rent.due_dates_type === RentDueDateTypes.CUSTOM &&
          <Column small={6} medium={4} large={2}>
            <FormFieldLabel>Eräpäivät</FormFieldLabel>
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
            <FormFieldLabel>Eräpäivät</FormFieldLabel>
            <ListItems>
              {rent.yearly_due_dates && !!rent.yearly_due_dates.length
                ? (rent.yearly_due_dates.map((date, index) => {
                  return <p className='no-margin' key={index}>{formatDueDate(date)}</p>;
                }))
                : <p className='no-margin'>Ei eräpäiviä</p>
              }
            </ListItems>
          </Column>
        }
      </Row>
      <Row>
        <Column>
          <FormFieldLabel>Huomautus</FormFieldLabel>
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
          <FormFieldLabel>Vuokralaji</FormFieldLabel>
          <p>{getLabelOfOption(typeOptions, rent.type) || '-'}</p>
        </Column>
        <Column small={3} medium={2} large={1}>
          <FormFieldLabel>Alkupvm</FormFieldLabel>
          <p>{formatDate(rent.start_date) || '-'}</p>
        </Column>
        <Column small={3} medium={2} large={1}>
          <FormFieldLabel>Loppupvm</FormFieldLabel>
          <p>{formatDate(rent.end_date) || '-'}</p>
        </Column>
      </Row>
      <Row>
        <Column>
          <FormFieldLabel>Huomautus</FormFieldLabel>
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
