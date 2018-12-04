// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';

import FormText from '$components/form/FormText';
import FormTitleAndText from '$components/form/FormTitleAndText';
import {RentCycles, RentTypes, RentDueDateTypes} from '$src/leases/enums';
import {formatDueDates, formatSeasonalEndDate, formatSeasonalStartDate} from '$src/leases/helpers';
import {
  formatDate,
  formatNumber,
  getAttributeFieldOptions,
  getLabelOfOption,
  isEmptyValue,
} from '$util/helpers';
import {getAttributes} from '$src/leases/selectors';

import type {Attributes} from '$src/leases/types';

type SeasonalDatesProps = {
  rent: Object,
}

const SeasonalDates = ({
  rent,
}: SeasonalDatesProps ) => {
  const startText = formatSeasonalStartDate(rent);
  const endText = formatSeasonalEndDate(rent);

  return(
    <Row>
      <Column>
        <FormTitleAndText
          title='Kausivuokra ajalla (pv.kk)'
          text={`${startText || ''} - ${endText || ''}`}
        />
      </Column>
    </Row>
  );
};

type Props = {
  attributes: Attributes,
  rent: Object,
  rentType: ?string,
}

const BasicInfoIndex = ({attributes, rent}: Props) => {
  const areOldInfoVisible = () => {
    return !isEmptyValue(rent.elementary_index) ||
      !isEmptyValue(rent.index_rounding) ||
      !isEmptyValue(rent.x_value) ||
      !isEmptyValue(rent.y_value) ||
      !isEmptyValue(rent.y_value_start) ||
      !isEmptyValue(rent.equalization_start_date) ||
      !isEmptyValue(rent.equalization_end_date);
  };

  const typeOptions = getAttributeFieldOptions(attributes, 'rents.child.children.type');
  const cycleOptions = getAttributeFieldOptions(attributes, 'rents.child.children.cycle');
  const indexTypeOptions = getAttributeFieldOptions(attributes, 'rents.child.children.index_type');
  const dueDatesTypeOptions = getAttributeFieldOptions(attributes, 'rents.child.children.due_dates_type');
  const oldValuesVisible = areOldInfoVisible();

  return (
    <div>
      <Row>
        <Column small={6} medium={4} large={2}>
          <FormTitleAndText
            title='Vuokralaji'
            text={getLabelOfOption(typeOptions, rent.type) || '-'}
          />
        </Column>
        <Column small={3} medium={2} large={1}>
          <FormTitleAndText
            title='Alkupvm'
            text={formatDate(rent.start_date) || '-'}
          />
        </Column>
        <Column small={3} medium={2} large={1}>
          <FormTitleAndText
            title='Loppupvm'
            text={formatDate(rent.end_date) || '-'}
          />
        </Column>
        <Column small={6} medium={4} large={1}>
          <FormTitleAndText
            title='Vuokrakausi'
            text={getLabelOfOption(cycleOptions, rent.cycle) || '-'}
          />
        </Column>
        {rent.type === RentTypes.INDEX &&
          <Column small={6} medium={4} large={2}>
            <FormTitleAndText
              title='Indeksin tunnusnumero'
              text={getLabelOfOption(indexTypeOptions, rent.index_type) || '-'}
            />
          </Column>
        }
        <Column small={6} medium={4} large={2}>
          <FormTitleAndText
            title='Laskutusjako'
            text={getLabelOfOption(dueDatesTypeOptions, rent.due_dates_type) || '-'}
          />
        </Column>
        {rent.due_dates_type === RentDueDateTypes.CUSTOM &&
          <Column small={6} medium={4} large={2}>
            <FormTitleAndText
              title='Eräpäivät (pv.kk)'
              text={rent.due_dates && !!rent.due_dates.length
                ? formatDueDates(rent.due_dates)
                : 'Ei eräpäiviä'
              }
            />
          </Column>
        }
        {rent.due_dates_type === RentDueDateTypes.FIXED &&
          <Column small={6} medium={4} large={1}>
            <FormTitleAndText
              title='Laskut kpl/v'
              text={rent.due_dates_per_year || '-'
              }
            />
          </Column>
        }
        {rent.due_dates_type === RentDueDateTypes.FIXED &&
          <Column small={6} medium={4} large={2}>
            <FormTitleAndText
              title='Eräpäivät (pv.kk)'
              text={rent.yearly_due_dates && !!rent.yearly_due_dates.length
                ? formatDueDates(rent.yearly_due_dates)
                : 'Ei eräpäiviä'
              }
            />
          </Column>
        }
      </Row>

      {rent.type === RentTypes.MANUAL &&
        <Row>
          {(rent.cycle === RentCycles.JANUARY_TO_DECEMBER || rent.cycle === RentCycles.APRIL_TO_MARCH) &&
            <Column small={6} medium={4} large={2}>
              <FormTitleAndText
                title='Käsinlaskentakerroin'
                text={!isEmptyValue(rent.manual_ratio) ? formatNumber(rent.manual_ratio) : '-'}
              />
            </Column>
          }
          {rent.cycle === RentCycles.APRIL_TO_MARCH &&
            <Column small={6} medium={4} large={2}>
              <FormTitleAndText
                title='Käsinlaskentakerroin (edellinen)'
                text={!isEmptyValue(rent.manual_ratio_previous) ? formatNumber(rent.manual_ratio_previous) : '-'}
              />
            </Column>
          }
        </Row>
      }

      <Row>
        <Column small={12} medium={4} large={2}>
          <SeasonalDates rent={rent} />
        </Column>
        <Column small={12} medium={8} large={10}>
          <FormTitleAndText
            title='Huomautus'
            text={rent.note || '-'}
          />
        </Column>
      </Row>

      {oldValuesVisible &&
        <Row>
          <Column small={12} medium={4} large={2}>
            <FormTitleAndText
              title='Perusindeksi/pyöristys'
              text={`${rent.elementary_index || '-'} / ${rent.index_rounding || '-'}`}
            />
          </Column>
          <Column small={4} medium={2} large={1}>
            <FormTitleAndText
              title='X-luku'
              text={rent.x_value || '-'}
            />
          </Column>
          <Column small={4} medium={2} large={1}>
            <FormTitleAndText
              title='Y-luku'
              text={rent.y_value || '-'}
            />
          </Column>
          <Column small={4} medium={2} large={1}>
            <FormTitleAndText
              title='Y-alkaen'
              text={rent.y_value_start || '-'}
            />
          </Column>
          <Column small={12} medium={4} large={2}>
            <Row>
              <Column small={6}>
                <FormTitleAndText
                  title='Tasaus alkupvm'
                  text={formatDate(rent.equalization_start_date) || '-'}
                />
              </Column>
              <Column small={6}>
                <FormTitleAndText
                  title='Tasaus loppupvm'
                  text={formatDate(rent.equalization_end_date) || '-'}
                />
              </Column>
            </Row>
          </Column>
        </Row>
      }
    </div>
  );
};

const BasicInfoOneTime = ({attributes, rent}: Props) => {
  const dueDatesTypeOptions = getAttributeFieldOptions(attributes, 'rents.child.children.due_dates_type');
  const typeOptions = getAttributeFieldOptions(attributes, 'rents.child.children.type');

  return (
    <div>
      <Row>
        <Column small={6} medium={4} large={2}>
          <FormTitleAndText
            title='Vuokralaji'
            text={getLabelOfOption(typeOptions, rent.type) || '-'}
          />
        </Column>
        <Column small={3} medium={2} large={1}>
          <FormTitleAndText
            title='Alkupvm'
            text={formatDate(rent.start_date) || '-'}
          />
        </Column>
        <Column small={3} medium={2} large={1}>
          <FormTitleAndText
            title='Loppupvm'
            text={formatDate(rent.end_date) || '-'}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormTitleAndText
            title='Kertakaikkinen vuokra'
            text={!isEmptyValue(rent.amount) ? `${formatNumber(rent.amount)} €` : '-'}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormTitleAndText
            title='Laskutusjako'
            text={getLabelOfOption(dueDatesTypeOptions, rent.due_dates_type) || '-'}
          />
        </Column>
        {rent.due_dates_type === RentDueDateTypes.CUSTOM &&
          <Column small={6} medium={4} large={2}>
            <FormTitleAndText
              title='Eräpäivät (pv.kk)'
              text={rent.due_dates && !!rent.due_dates.length
                ? formatDueDates(rent.due_dates)
                : 'Ei eräpäiviä'
              }
            />
          </Column>
        }
        {rent.due_dates_type === RentDueDateTypes.FIXED &&
          <Column small={6} medium={4} large={2}>
            <FormTitleAndText
              title='Eräpäivät (pv.kk)'
              text={rent.yearly_due_dates && !!rent.yearly_due_dates.length
                ? formatDueDates(rent.yearly_due_dates)
                : 'Ei eräpäiviä'
              }
            />
          </Column>
        }
      </Row>

      <Row>
        <Column>
          <FormTitleAndText
            title='Huomautus'
            text={rent.note || '-'}
          />
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
          <FormTitleAndText
            title='Vuokralaji'
            text={getLabelOfOption(typeOptions, rent.type) || '-'}
          />
        </Column>
        <Column small={3} medium={2} large={1}>
          <FormTitleAndText
            title='Alkupvm'
            text={formatDate(rent.start_date) || '-'}
          />
        </Column>
        <Column small={3} medium={2} large={1}>
          <FormTitleAndText
            title='Loppupvm'
            text={formatDate(rent.end_date) || '-'}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormTitleAndText
            title='Laskutusjako'
            text={getLabelOfOption(dueDatesTypeOptions, rent.due_dates_type) || '-'}
          />
        </Column>
        {rent.due_dates_type === RentDueDateTypes.CUSTOM &&
          <Column small={6} medium={4} large={2}>
            <FormTitleAndText
              title='Eräpäivät (pv.kk)'
              text={rent.due_dates && !!rent.due_dates.length
                ? formatDueDates(rent.due_dates)
                : 'Ei eräpäiviä'
              }
            />
          </Column>
        }
        {rent.due_dates_type === RentDueDateTypes.FIXED &&
          <Column small={6} medium={4} large={1}>
            <FormTitleAndText
              title='Laskut kpl/v'
              text={rent.due_dates_per_year || '-'
              }
            />
          </Column>
        }
        {rent.due_dates_type === RentDueDateTypes.FIXED &&
          <Column small={6} medium={4} large={2}>
            <FormTitleAndText
              title='Eräpäivät (pv.kk)'
              text={rent.yearly_due_dates && !!rent.yearly_due_dates.length
                ? formatDueDates(rent.yearly_due_dates)
                : 'Ei eräpäiviä'
              }
            />
          </Column>
        }
      </Row>

      <Row>
        <Column small={12} medium={4} large={2}>
          <SeasonalDates rent={rent} />
        </Column>
        <Column small={12} medium={8} large={10}>
          <FormTitleAndText
            title='Huomautus'
            text={rent.note || '-'}
          />
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
          <FormTitleAndText
            title='Vuokralaji'
            text={getLabelOfOption(typeOptions, rent.type) || '-'}
          />
        </Column>
        <Column small={3} medium={2} large={1}>
          <FormTitleAndText
            title='Alkupvm'
            text={formatDate(rent.start_date) || '-'}
          />
        </Column>
        <Column small={3} medium={2} large={1}>
          <FormTitleAndText
            title='Loppupvm'
            text={formatDate(rent.end_date) || '-'}
          />
        </Column>
      </Row>
      <Row>
        <Column>
          <FormTitleAndText
            title='Huomautus'
            text={rent.note || '-'}
          />
        </Column>
      </Row>
    </div>
  );
};

const BasicInfo = ({attributes, rent, rentType}: Props) => {
  return (
    <div>
      {!rentType &&
        <FormText>Vuokralajia ei ole valittu</FormText>
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
