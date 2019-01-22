// @flow
import React, {Fragment} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';

import Authorization from '$components/authorization/Authorization';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import {
  LeaseRentDueDatesFieldPaths,
  LeaseRentDueDatesFieldTitles,
  LeaseRentsFieldPaths,
  LeaseRentsFieldTitles,
  RentCycles,
  RentTypes,
  RentDueDateTypes,
} from '$src/leases/enums';
import {formatDueDates, formatSeasonalDate} from '$src/leases/helpers';
import {
  formatDate,
  formatNumber,
  getFieldOptions,
  getLabelOfOption,
  isEmptyValue,
  isFieldAllowedToRead,
} from '$util/helpers';
import {getAttributes as getLeaseAttributes} from '$src/leases/selectors';

import type {Attributes} from '$src/types';

type SeasonalDatesProps = {
  leaseAttributes: Attributes,
  rent: Object,
}

const SeasonalDates = ({
  leaseAttributes,
  rent,
}: SeasonalDatesProps ) => {
  const startText = formatSeasonalDate(rent.seasonal_start_day, rent.seasonal_start_month);
  const endText = formatSeasonalDate(rent.seasonal_end_day, rent.seasonal_end_month);

  return(
    <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentsFieldPaths.SEASONAL_END_DAY) ||
      isFieldAllowedToRead(leaseAttributes, LeaseRentsFieldPaths.SEASONAL_END_DAY) ||
      isFieldAllowedToRead(leaseAttributes, LeaseRentsFieldPaths.SEASONAL_END_DAY) ||
      isFieldAllowedToRead(leaseAttributes, LeaseRentsFieldPaths.SEASONAL_END_DAY)}
    >
      <Row>
        <Column>
          <FormTextTitle>{LeaseRentsFieldTitles.SEASONAL_DATES}</FormTextTitle>
          <FormText>{`${startText || ''} - ${endText || ''}`}</FormText>
        </Column>
      </Row>
    </Authorization>
  );
};

type Props = {
  leaseAttributes: Attributes,
  rent: Object,
  rentType: ?string,
}

const BasicInfoIndex = ({leaseAttributes, rent}: Props) => {
  const areOldInfoVisible = () => {
    return !isEmptyValue(rent.elementary_index) ||
      !isEmptyValue(rent.index_rounding) ||
      !isEmptyValue(rent.x_value) ||
      !isEmptyValue(rent.y_value) ||
      !isEmptyValue(rent.y_value_start) ||
      !isEmptyValue(rent.equalization_start_date) ||
      !isEmptyValue(rent.equalization_end_date);
  };

  const typeOptions = getFieldOptions(leaseAttributes, LeaseRentsFieldPaths.TYPE);
  const cycleOptions = getFieldOptions(leaseAttributes, LeaseRentsFieldPaths.CYCLE);
  const indexTypeOptions = getFieldOptions(leaseAttributes, LeaseRentsFieldPaths.INDEX_TYPE);
  const dueDatesTypeOptions = getFieldOptions(leaseAttributes, LeaseRentsFieldPaths.DUE_DATES_TYPE);
  const oldValuesVisible = areOldInfoVisible();

  return (
    <Fragment>
      <Row>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentsFieldPaths.TYPE)}>
            <FormTextTitle>{LeaseRentsFieldTitles.TYPE}</FormTextTitle>
            <FormText>{getLabelOfOption(typeOptions, rent.type) || '-'}</FormText>
          </Authorization>
        </Column>
        <Column small={3} medium={2} large={1}>
          <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentsFieldPaths.START_DATE)}>
            <FormTextTitle>{LeaseRentsFieldTitles.START_DATE}</FormTextTitle>
            <FormText>{formatDate(rent.start_date) || '-'}</FormText>
          </Authorization>
        </Column>
        <Column small={3} medium={2} large={1}>
          <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentsFieldPaths.END_DATE)}>
            <FormTextTitle>{LeaseRentsFieldTitles.END_DATE}</FormTextTitle>
            <FormText>{formatDate(rent.end_date) || '-'}</FormText>
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={1}>
          <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentsFieldPaths.CYCLE)}>
            <FormTextTitle>{LeaseRentsFieldTitles.CYCLE}</FormTextTitle>
            <FormText>{getLabelOfOption(cycleOptions, rent.cycle) || '-'}</FormText>
          </Authorization>
        </Column>
        {rent.type === RentTypes.INDEX &&
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentsFieldPaths.INDEX_TYPE)}>
              <FormTextTitle>{LeaseRentsFieldTitles.INDEX_TYPE}</FormTextTitle>
              <FormText>{getLabelOfOption(indexTypeOptions, rent.index_type) || '-'}</FormText>
            </Authorization>
          </Column>
        }
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentsFieldPaths.DUE_DATES_TYPE)}>
            <FormTextTitle>{LeaseRentsFieldTitles.DUE_DATES_TYPE}</FormTextTitle>
            <FormText>{getLabelOfOption(dueDatesTypeOptions, rent.due_dates_type) || '-'}</FormText>
          </Authorization>
        </Column>
        {rent.due_dates_type === RentDueDateTypes.CUSTOM &&
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentDueDatesFieldPaths.DUE_DATES)}>
              <FormTextTitle>{LeaseRentDueDatesFieldTitles.DUE_DATES}</FormTextTitle>
              <FormText>{rent.due_dates && !!rent.due_dates.length
                ? formatDueDates(rent.due_dates)
                : 'Ei eräpäiviä'}</FormText>
            </Authorization>
          </Column>
        }
        {rent.due_dates_type === RentDueDateTypes.FIXED &&
          <Column small={6} medium={4} large={1}>
            <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentsFieldPaths.DUE_DATES_PER_YEAR)}>
              <FormTextTitle>{LeaseRentsFieldTitles.DUE_DATES_PER_YEAR}</FormTextTitle>
              <FormText>{rent.due_dates_per_year || '-'}</FormText>
            </Authorization>
          </Column>
        }
        {rent.due_dates_type === RentDueDateTypes.FIXED &&
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentDueDatesFieldPaths.DUE_DATES)}>
              <FormTextTitle>{LeaseRentsFieldTitles.YEARLY_DUE_DATES}</FormTextTitle>
              <FormText>{rent.yearly_due_dates && !!rent.yearly_due_dates.length
                ? formatDueDates(rent.yearly_due_dates)
                : 'Ei eräpäiviä'}</FormText>
            </Authorization>
          </Column>
        }
      </Row>

      {rent.type === RentTypes.MANUAL &&
        <Row>
          {(rent.cycle === RentCycles.JANUARY_TO_DECEMBER || rent.cycle === RentCycles.APRIL_TO_MARCH) &&
            <Column small={6} medium={4} large={2}>
              <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentsFieldPaths.MANUAL_RATIO)}>
                <FormTextTitle>{LeaseRentsFieldTitles.MANUAL_RATIO}</FormTextTitle>
                <FormText>{!isEmptyValue(rent.manual_ratio) ? formatNumber(rent.manual_ratio) : '-'}</FormText>
              </Authorization>
            </Column>
          }
          {rent.cycle === RentCycles.APRIL_TO_MARCH &&
            <Column small={6} medium={4} large={2}>
              <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentsFieldPaths.MANUAL_RATIO_PREVIOUS)}>
                <FormTextTitle>{LeaseRentsFieldTitles.MANUAL_RATIO_PREVIOUS}</FormTextTitle>
                <FormText>{!isEmptyValue(rent.manual_ratio_previous) ? formatNumber(rent.manual_ratio_previous) : '-'}</FormText>
              </Authorization>
            </Column>
          }
        </Row>
      }

      <Row>
        <Column small={12} medium={4} large={2}>
          {/* Authorization is implemented inside SeasonalDates component */}
          <SeasonalDates
            leaseAttributes={leaseAttributes}
            rent={rent}
          />
        </Column>
        <Column small={12} medium={8} large={10}>
          <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentsFieldPaths.NOTE)}>
            <FormTextTitle>{LeaseRentsFieldTitles.NOTE}</FormTextTitle>
            <FormText>{rent.note || '-'}</FormText>
          </Authorization>
        </Column>
      </Row>

      {oldValuesVisible &&
        <Row>
          <Column small={12} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentsFieldPaths.ELEMENTARY_INDEX) ||
              isFieldAllowedToRead(leaseAttributes, LeaseRentsFieldPaths.INDEX_ROUNDING)}
            >
              <FormTextTitle>Perusindeksi/pyöristys</FormTextTitle>
              <FormText>{rent.elementary_index || '-'} / {rent.index_rounding || '-'}</FormText>
            </Authorization>
          </Column>
          <Column small={4} medium={2} large={1}>
            <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentsFieldPaths.X_VALUE)}>
              <FormTextTitle>{LeaseRentsFieldTitles.X_VALUE}</FormTextTitle>
              <FormText>{rent.x_value || '-'}</FormText>
            </Authorization>
          </Column>
          <Column small={4} medium={2} large={1}>
            <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentsFieldPaths.Y_VALUE)}>
              <FormTextTitle>{LeaseRentsFieldTitles.Y_VALUE}</FormTextTitle>
              <FormText>{rent.y_value || '-'}</FormText>
            </Authorization>
          </Column>
          <Column small={4} medium={2} large={1}>
            <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentsFieldPaths.Y_VALUE_START)}>
              <FormTextTitle>{LeaseRentsFieldTitles.Y_VALUE_START}</FormTextTitle>
              <FormText>{rent.y_value_start || '-'}</FormText>
            </Authorization>
          </Column>
          <Column small={12} medium={4} large={2}>
            <Row>
              <Column small={6}>
                <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentsFieldPaths.EQUALIZATION_START_DATE)}>
                  <FormTextTitle>{LeaseRentsFieldTitles.EQUALIZATION_START_DATE}</FormTextTitle>
                  <FormText>{formatDate(rent.equalization_start_date) || '-'}</FormText>
                </Authorization>
              </Column>
              <Column small={6}>
                <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentsFieldPaths.EQUALIZATION_END_DATE)}>
                  <FormTextTitle>{LeaseRentsFieldTitles.EQUALIZATION_END_DATE}</FormTextTitle>
                  <FormText>{formatDate(rent.equalization_end_date) || '-'}</FormText>
                </Authorization>
              </Column>
            </Row>
          </Column>
        </Row>
      }
    </Fragment>
  );
};

const BasicInfoOneTime = ({leaseAttributes, rent}: Props) => {
  const dueDatesTypeOptions = getFieldOptions(leaseAttributes, LeaseRentsFieldPaths.DUE_DATES_TYPE);
  const typeOptions = getFieldOptions(leaseAttributes, LeaseRentsFieldPaths.TYPE);

  return (
    <Fragment>
      <Row>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentsFieldPaths.TYPE)}>
            <FormTextTitle>{LeaseRentsFieldTitles.TYPE}</FormTextTitle>
            <FormText>{getLabelOfOption(typeOptions, rent.type) || '-'}</FormText>
          </Authorization>
        </Column>
        <Column small={3} medium={2} large={1}>
          <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentsFieldPaths.START_DATE)}>
            <FormTextTitle>{LeaseRentsFieldTitles.START_DATE}</FormTextTitle>
            <FormText>{formatDate(rent.start_date) || '-'}</FormText>
          </Authorization>
        </Column>
        <Column small={3} medium={2} large={1}>
          <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentsFieldPaths.END_DATE)}>
            <FormTextTitle>{LeaseRentsFieldTitles.END_DATE}</FormTextTitle>
            <FormText>{formatDate(rent.end_date) || '-'}</FormText>
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentsFieldPaths.AMOUNT)}>
            <FormTextTitle>{LeaseRentsFieldTitles.AMOUNT}</FormTextTitle>
            <FormText>{!isEmptyValue(rent.amount) ? `${formatNumber(rent.amount)} €` : '-'}</FormText>
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentsFieldPaths.DUE_DATES_TYPE)}>
            <FormTextTitle>{LeaseRentsFieldTitles.DUE_DATES_TYPE}</FormTextTitle>
            <FormText>{getLabelOfOption(dueDatesTypeOptions, rent.due_dates_type) || '-'}</FormText>
          </Authorization>
        </Column>
        {rent.due_dates_type === RentDueDateTypes.CUSTOM &&
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentDueDatesFieldPaths.DUE_DATES)}>
              <FormTextTitle>{LeaseRentDueDatesFieldTitles.DUE_DATES}</FormTextTitle>
              <FormText>{rent.due_dates && !!rent.due_dates.length
                ? formatDueDates(rent.due_dates)
                : 'Ei eräpäiviä'}</FormText>
            </Authorization>
          </Column>
        }
        {rent.due_dates_type === RentDueDateTypes.FIXED &&
          <Column small={6} medium={4} large={1}>
            <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentsFieldPaths.DUE_DATES_PER_YEAR)}>
              <FormTextTitle>{LeaseRentsFieldTitles.DUE_DATES_PER_YEAR}</FormTextTitle>
              <FormText>{rent.due_dates_per_year || '-'}</FormText>
            </Authorization>
          </Column>
        }
        {rent.due_dates_type === RentDueDateTypes.FIXED &&
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentDueDatesFieldPaths.DUE_DATES)}>
              <FormTextTitle>{LeaseRentsFieldTitles.YEARLY_DUE_DATES}</FormTextTitle>
              <FormText>{rent.yearly_due_dates && !!rent.yearly_due_dates.length
                ? formatDueDates(rent.yearly_due_dates)
                : 'Ei eräpäiviä'}</FormText>
            </Authorization>
          </Column>
        }
      </Row>

      <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentsFieldPaths.NOTE)}>
        <Row>
          <Column>
            <FormTextTitle>{LeaseRentsFieldTitles.NOTE}</FormTextTitle>
            <FormText>{rent.note || '-'}</FormText>
          </Column>
        </Row>
      </Authorization>
    </Fragment>
  );
};

const BasicInfoFixed = ({leaseAttributes, rent}: Props) => {
  const dueDatesTypeOptions = getFieldOptions(leaseAttributes, LeaseRentsFieldPaths.DUE_DATES_TYPE);
  const typeOptions = getFieldOptions(leaseAttributes, LeaseRentsFieldPaths.TYPE);

  return (
    <Fragment>
      <Row>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentsFieldPaths.TYPE)}>
            <FormTextTitle>{LeaseRentsFieldTitles.TYPE}</FormTextTitle>
            <FormText>{getLabelOfOption(typeOptions, rent.type) || '-'}</FormText>
          </Authorization>
        </Column>
        <Column small={3} medium={2} large={1}>
          <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentsFieldPaths.START_DATE)}>
            <FormTextTitle>{LeaseRentsFieldTitles.START_DATE}</FormTextTitle>
            <FormText>{formatDate(rent.start_date) || '-'}</FormText>
          </Authorization>
        </Column>
        <Column small={3} medium={2} large={1}>
          <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentsFieldPaths.END_DATE)}>
            <FormTextTitle>{LeaseRentsFieldTitles.END_DATE}</FormTextTitle>
            <FormText>{formatDate(rent.end_date) || '-'}</FormText>
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentsFieldPaths.DUE_DATES_TYPE)}>
            <FormTextTitle>{LeaseRentsFieldTitles.DUE_DATES_TYPE}</FormTextTitle>
            <FormText>{getLabelOfOption(dueDatesTypeOptions, rent.due_dates_type) || '-'}</FormText>
          </Authorization>
        </Column>
        {rent.due_dates_type === RentDueDateTypes.CUSTOM &&
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentDueDatesFieldPaths.DUE_DATES)}>
              <FormTextTitle>{LeaseRentDueDatesFieldTitles.DUE_DATES}</FormTextTitle>
              <FormText>{rent.due_dates && !!rent.due_dates.length
                ? formatDueDates(rent.due_dates)
                : 'Ei eräpäiviä'}</FormText>
            </Authorization>
          </Column>
        }
        {rent.due_dates_type === RentDueDateTypes.FIXED &&
          <Column small={6} medium={4} large={1}>
            <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentsFieldPaths.DUE_DATES_PER_YEAR)}>
              <FormTextTitle>{LeaseRentsFieldTitles.DUE_DATES_PER_YEAR}</FormTextTitle>
              <FormText>{rent.due_dates_per_year || '-'}</FormText>
            </Authorization>
          </Column>
        }
        {rent.due_dates_type === RentDueDateTypes.FIXED &&
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentDueDatesFieldPaths.DUE_DATES)}>
              <FormTextTitle>{LeaseRentsFieldTitles.YEARLY_DUE_DATES}</FormTextTitle>
              <FormText>{rent.yearly_due_dates && !!rent.yearly_due_dates.length
                ? formatDueDates(rent.yearly_due_dates)
                : 'Ei eräpäiviä'}</FormText>
            </Authorization>
          </Column>
        }
      </Row>

      <Row>
        <Column small={12} medium={4} large={2}>
          {/* Authorization is implemented inside SeasonalDates component */}
          <SeasonalDates
            leaseAttributes={leaseAttributes}
            rent={rent}
          />
        </Column>
        <Column small={12} medium={8} large={10}>
          <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentsFieldPaths.NOTE)}>
            <FormTextTitle>{LeaseRentsFieldTitles.NOTE}</FormTextTitle>
            <FormText>{rent.note || '-'}</FormText>
          </Authorization>
        </Column>
      </Row>
    </Fragment>
  );
};

const BasicInfoFree = ({leaseAttributes, rent}: Props) => {
  const typeOptions = getFieldOptions(leaseAttributes, LeaseRentsFieldPaths.TYPE);

  return (
    <Fragment>
      <Row>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentsFieldPaths.TYPE)}>
            <FormTextTitle>{LeaseRentsFieldTitles.TYPE}</FormTextTitle>
            <FormText>{getLabelOfOption(typeOptions, rent.type) || '-'}</FormText>
          </Authorization>
        </Column>
        <Column small={3} medium={2} large={1}>
          <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentsFieldPaths.START_DATE)}>
            <FormTextTitle>{LeaseRentsFieldTitles.START_DATE}</FormTextTitle>
            <FormText>{formatDate(rent.start_date) || '-'}</FormText>
          </Authorization>
        </Column>
        <Column small={3} medium={2} large={1}>
          <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentsFieldPaths.END_DATE)}>
            <FormTextTitle>{LeaseRentsFieldTitles.END_DATE}</FormTextTitle>
            <FormText>{formatDate(rent.end_date) || '-'}</FormText>
          </Authorization>
        </Column>
      </Row>

      <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentsFieldPaths.NOTE)}>
        <Row>
          <Column>
            <FormTextTitle>{LeaseRentsFieldTitles.NOTE}</FormTextTitle>
            <FormText>{rent.note || '-'}</FormText>
          </Column>
        </Row>
      </Authorization>
    </Fragment>
  );
};

const BasicInfo = ({leaseAttributes, rent, rentType}: Props) => {
  return (
    <Fragment>
      {!rentType &&
        <FormText>Vuokralajia ei ole valittu</FormText>
      }
      {rentType === RentTypes.INDEX &&
        <BasicInfoIndex
          leaseAttributes={leaseAttributes}
          rent={rent}
          rentType={rentType}
        />
      }
      {rentType === RentTypes.ONE_TIME &&
        <BasicInfoOneTime
          leaseAttributes={leaseAttributes}
          rent={rent}
          rentType={rentType}
        />
      }
      {rentType === RentTypes.FIXED &&
        <BasicInfoFixed
          leaseAttributes={leaseAttributes}
          rent={rent}
          rentType={rentType}
        />
      }
      {rentType === RentTypes.FREE &&
        <BasicInfoFree
          leaseAttributes={leaseAttributes}
          rent={rent}
          rentType={rentType}
        />
      }
      {rentType === RentTypes.MANUAL &&
        <BasicInfoIndex
          leaseAttributes={leaseAttributes}
          rent={rent}
          rentType={rentType}
        />
      }
    </Fragment>
  );
};

export default connect(
  (state) => {
    return {
      leaseAttributes: getLeaseAttributes(state),
    };
  },
)(BasicInfo);
