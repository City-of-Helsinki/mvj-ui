// @flow
import React from 'react';
import {connect} from 'react-redux';
import {change, Field, FieldArray, formValueSelector} from 'redux-form';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import type {Element} from 'react';

import AddButtonThird from '$components/form/AddButtonThird';
import ErrorField from '$components/form/ErrorField';
import FieldAndRemoveButtonWrapper from '$components/form/FieldAndRemoveButtonWrapper';
import FormField from '$components/form/FormField';
import FormTextTitle from '$components/form/FormTextTitle';
import FormTitleAndText from '$components/form/FormTitleAndText';
import RemoveButton from '$components/form/RemoveButton';
import {rentCustomDateOptions, oneTimeRentDueDateTypeOptions} from '$src/leases/constants';
import {FixedDueDates, FormNames, RentCycles, RentTypes, RentDueDateTypes} from '$src/leases/enums';
import {formatDueDates} from '$src/leases/helpers';
import {getAttributes, getCurrentLease} from '$src/leases/selectors';
import {getLeaseTypeList} from '$src/leaseType/selectors';

import type {Attributes} from '$src/types';
import type {Lease} from '$src/leases/types';
import type {LeaseTypeList} from '$src/leaseType/types';

type SeasonalDatesProps = {
  attributes: Attributes,
  isSaveClicked: boolean,
}

const SeasonalDates = ({
  attributes,
  isSaveClicked,
}: SeasonalDatesProps ) => {
  return(
    <div>
      <Row>
        <Column small={12}><FormTextTitle title='Kausivuokra ajalla (pv.kk)' /></Column>
      </Row>
      <Row>
        <Column small={3}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'rents.child.children.seasonal_start_day')}
            name='seasonal_start_day'
            overrideValues={{
              label: '',
            }}
          />
        </Column>
        <Column small={3}>
          <FormField
            className='with-dot'
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'rents.child.children.seasonal_start_month')}
            name='seasonal_start_month'
            overrideValues={{
              label: '',
            }}
          />
        </Column>
        <Column small={3}>
          <FormField
            className='with-dash'
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'rents.child.children.seasonal_end_day')}
            name='seasonal_end_day'
            overrideValues={{
              label: '',
            }}
          />
        </Column>
        <Column small={3}>
          <FormField
            className='with-dot'
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'rents.child.children.seasonal_end_month')}
            name='seasonal_end_month'
            overrideValues={{
              label: '',
            }}
          />
        </Column>
      </Row>
      <Row>
        <Column>
          <Field
            name="seasonalDates"
            component={ErrorField}
            showError={isSaveClicked}
          />
        </Column>
      </Row>
    </div>
  );
};

type DueDatesProps = {
  attributes: Attributes,
  fields: any,
  isSaveClicked: boolean,
}

const renderDueDates = ({attributes, fields, isSaveClicked}: DueDatesProps): Element<*> => {
  const handleAdd = () => {
    fields.push({});
  };

  return (
    <div>
      <Row>
        <Column>
          <FormTextTitle title='Eräpäivät (pv.kk)' />
        </Column>
      </Row>
      {fields && !!fields.length && fields.map((due_date, index) => {
        const handleRemove = () => {
          fields.remove(index);
        };

        return (
          <Row key={index}>
            <Column small={12}>
              <Row>
                <Column small={6}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'rents.child.children.due_dates.child.children.day')}
                    invisibleLabel
                    name={`${due_date}.day`}
                  />
                </Column>
                <Column small={6}>
                  <FieldAndRemoveButtonWrapper
                    className='absolute-remove-button-position'
                    field={
                      <FormField
                        className='with-dot'
                        disableTouched={isSaveClicked}
                        fieldAttributes={get(attributes, 'rents.child.children.due_dates.child.children.month')}
                        invisibleLabel
                        name={`${due_date}.month`}
                      />
                    }
                    removeButton={
                      <RemoveButton
                        className='third-level'
                        onClick={handleRemove}
                        title="Poista eräpäivä"
                      />
                    }
                  />
                </Column>
              </Row>
            </Column>
          </Row>
        );
      })}
      <Row>
        <Column>
          <AddButtonThird
            label='Lisää eräpäivä'
            onClick={handleAdd}
          />
        </Column>
      </Row>
    </div>
  );
};

const renderDueDatesOneTime = ({attributes, fields, isSaveClicked}: DueDatesProps): Element<*> => {
  const handleAdd = () => {
    fields.push({});
  };

  return (
    <div>
      <Row>
        <Column>
          <FormTextTitle title='Eräpäivät (pv.kk)' />
        </Column>
      </Row>
      {fields && !!fields.length && fields.map((due_date, index) => {
        if(index) return null;

        return (
          <Row key={index}>
            <Column small={12}>
              <Row>
                <Column small={6}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'rents.child.children.due_dates.child.children.day')}
                    invisibleLabel
                    name={`${due_date}.day`}
                  />
                </Column>
                <Column small={6}>
                  <FormField
                    className='with-dot'
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'rents.child.children.due_dates.child.children.month')}
                    invisibleLabel
                    name={`${due_date}.month`}
                  />
                </Column>
              </Row>
            </Column>
          </Row>
        );
      })}
      {(!fields || !fields.length) &&
        <Row>
          <Column>
            <AddButtonThird
              label='Lisää eräpäivä'
              onClick={handleAdd}
            />
          </Column>
        </Row>
      }
    </div>
  );
};

type BasicInfoEmptyProps = {
  attributes: Attributes,
  isSaveClicked: boolean,
}

const BasicInfoEmpty = ({attributes, isSaveClicked}: BasicInfoEmptyProps) => {
  return (
    <div>
      <Row>
        <Column small={6} medium={4} large={2}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'rents.child.children.type')}
            name='type'
            overrideValues={{
              label: 'Vuokralaji',
            }}
          />
        </Column>
      </Row>
    </div>
  );
};

type BasicInfoIndexProps = {
  attributes: Attributes,
  cycle: ?string,
  dueDatesType: ?string,
  isIndex: boolean,
  isSaveClicked: boolean,
  yearlyDueDates: Array<Object>,
}

const BasicInfoIndex = ({
  attributes,
  cycle,
  dueDatesType,
  isIndex,
  isSaveClicked,
  yearlyDueDates,
}: BasicInfoIndexProps) => {
  return (
    <div>
      <Row>
        <Column small={6} medium={4} large={2}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'rents.child.children.type')}
            name='type'
            overrideValues={{
              label: 'Vuokralaji',
            }}
          />
        </Column>
        <Column small={3} medium={2} large={1}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'rents.child.children.start_date')}
            name='start_date'
            overrideValues={{
              label: 'Alkupvm',
            }}
          />
        </Column>
        <Column small={3} medium={2} large={1}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'rents.child.children.end_date')}
            name='end_date'
            overrideValues={{
              label: 'Loppupvm',
            }}
          />
        </Column>
        <Column small={6} medium={4} large={1}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'rents.child.children.cycle')}
            name='cycle'
            overrideValues={{
              label: 'Vuokrakausi',
            }}
          />
        </Column>

        {isIndex &&
          <Column small={6} medium={4} large={2}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'rents.child.children.index_type')}
              name='index_type'
              overrideValues={{
                label: 'Indeksin tunnusnumero',
              }}
            />
          </Column>
        }

        <Column small={6} medium={4} large={2}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'rents.child.children.due_dates_type')}
            name='due_dates_type'
            overrideValues={{
              label: 'Laskutusjako',
            }}
          />
        </Column>
        {dueDatesType === RentDueDateTypes.CUSTOM &&
          <Column small={6} medium={4} large={1}>
            <FieldArray
              attributes={attributes}
              component={renderDueDates}
              isSaveClicked={isSaveClicked}
              name="due_dates"
            />
          </Column>
        }
        {dueDatesType === RentDueDateTypes.FIXED &&
          <Column small={6} medium={4} large={1}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'rents.child.children.due_dates_per_year')}
              name='due_dates_per_year'
              overrideValues={{
                fieldType: 'choice',
                label: 'Laskut kpl/v',
                options: rentCustomDateOptions,
              }}
            />
          </Column>
        }
        {dueDatesType === RentDueDateTypes.FIXED &&
          <Column small={6} medium={4} large={2}>
            <FormTitleAndText
              title='Eräpäivät (pv.kk)'
              text={yearlyDueDates && !!yearlyDueDates
                ? formatDueDates(yearlyDueDates)
                : '-'
              }
            />
          </Column>
        }
      </Row>

      {!isIndex &&
        <Row>
          {(cycle === RentCycles.JANUARY_TO_DECEMBER || cycle === RentCycles.APRIL_TO_MARCH) &&
            <Column small={6} medium={4} large={2}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(attributes, 'rents.child.children.manual_ratio')}
                name='manual_ratio'
                overrideValues={{
                  label: 'Käsinlaskentakerroin',
                }}
              />
            </Column>
          }
          {cycle === RentCycles.APRIL_TO_MARCH &&
            <Column small={6} medium={4} large={2}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(attributes, 'rents.child.children.manual_ratio_previous')}
                name='manual_ratio_previous'
                overrideValues={{
                  label: 'Käsinlaskentakerroin (edellinen)',
                }}
              />
            </Column>
          }
        </Row>
      }

      <Row>
        <Column small={12} medium={4} large={2}>
          <SeasonalDates
            attributes={attributes}
            isSaveClicked={isSaveClicked}
          />
        </Column>
        <Column small={12} medium={8} large={10}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'rents.child.children.note')}
            name='note'
            overrideValues={{
              label: 'Huomautus',
            }}
          />
        </Column>
      </Row>
    </div>
  );
};

type BasicInfoOneTimeProps = {
  attributes: Attributes,
  dueDatesType: ?string,
  isSaveClicked: boolean,
}

const BasicInfoOneTime = ({attributes, dueDatesType, isSaveClicked}: BasicInfoOneTimeProps) => {
  return (
    <div>
      <Row>
        <Column small={6} medium={4} large={2}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'rents.child.children.type')}
            name='type'
            overrideValues={{
              label: 'Vuokralaji',
            }}
          />
        </Column>
        <Column small={3} medium={2} large={1}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'rents.child.children.start_date')}
            name='start_date'
            overrideValues={{
              label: 'Alkupvm',
            }}
          />
        </Column>
        <Column small={3} medium={2} large={1}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'rents.child.children.end_date')}
            name='end_date'
            overrideValues={{
              label: 'Loppupvm',
            }}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'rents.child.children.amount')}
            name='amount'
            unit='€'
            overrideValues={{
              label: 'Kertakaikkinen vuokra',
            }}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'rents.child.children.due_dates_type')}
            name='due_dates_type'
            overrideValues={{
              label: 'Laskutusjako',
              options: oneTimeRentDueDateTypeOptions,
            }}
          />
        </Column>
        {dueDatesType === RentDueDateTypes.CUSTOM &&
          <Column small={6} medium={4} large={1}>
            <FieldArray
              attributes={attributes}
              component={renderDueDatesOneTime}
              isSaveClicked={isSaveClicked}
              name="due_dates"
            />
          </Column>
        }
      </Row>

      <Row>
        <Column>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'rents.child.children.note')}
            name='note'
            overrideValues={{
              label: 'Huomautus',
            }}
          />
        </Column>
      </Row>
    </div>
  );
};

type BasicInfoFixedProps = {
  attributes: Attributes,
  dueDatesType: ?string,
  isSaveClicked: boolean,
  yearlyDueDates: Array<Object>,
}

const BasicInfoFixed = ({
  attributes,
  dueDatesType,
  isSaveClicked,
  yearlyDueDates,
}: BasicInfoFixedProps) => {
  return (
    <div>
      <Row>
        <Column small={6} medium={4} large={2}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'rents.child.children.type')}
            name='type'
            overrideValues={{
              label: 'Vuokralaji',
            }}
          />
        </Column>
        <Column small={3} medium={2} large={1}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'rents.child.children.start_date')}
            name='start_date'
            overrideValues={{
              label: 'Alkupvm',
            }}
          />
        </Column>
        <Column small={3} medium={2} large={1}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'rents.child.children.end_date')}
            name='end_date'
            overrideValues={{
              label: 'Loppupvm',
            }}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'rents.child.children.due_dates_type')}
            name='due_dates_type'
            overrideValues={{
              label: 'Laskutusjako',
            }}
          />
        </Column>
        {dueDatesType === RentDueDateTypes.CUSTOM &&
          <Column small={6} medium={4} large={2}>
            <FieldArray
              attributes={attributes}
              component={renderDueDates}
              isSaveClicked={isSaveClicked}
              name="due_dates"
            />
          </Column>
        }
        {dueDatesType === RentDueDateTypes.FIXED &&
          <Column small={6} medium={4} large={1}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'rents.child.children.due_dates_per_year')}
              name='due_dates_per_year'
              overrideValues={{
                label: 'Laskut kpl/v',
              }}
            />
          </Column>
        }
        {dueDatesType === RentDueDateTypes.FIXED &&
          <Column small={6} medium={4} large={2}>
            <FormTitleAndText
              title='Eräpäivät (pv.kk)'
              text={yearlyDueDates && !!yearlyDueDates
                ? formatDueDates(yearlyDueDates)
                : '-'
              }
            />
          </Column>
        }
      </Row>

      <Row>
        <Column small={12} medium={4} large={2}>
          <SeasonalDates
            attributes={attributes}
            isSaveClicked={isSaveClicked}
          />
        </Column>
        <Column small={12} medium={8} large={10}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'rents.child.children.note')}
            name='note'
            overrideValues={{
              label: 'Huomautus',
            }}
          />
        </Column>
      </Row>
    </div>
  );
};

type BasicInfoFreeProps = {
  attributes: Attributes,
  isSaveClicked: boolean,
}

const BasicInfoFree = ({attributes, isSaveClicked}: BasicInfoFreeProps) => {
  return (
    <div>
      <Row>
        <Column small={6} medium={4} large={2}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'rents.child.children.type')}
            name='type'
            overrideValues={{
              label: 'Vuokralaji',
            }}
          />
        </Column>
        <Column small={3} medium={2} large={1}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'rents.child.children.start_date')}
            name='start_date'
            overrideValues={{
              label: 'Alkupvm',
            }}
          />
        </Column>
        <Column small={3} medium={2} large={1}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'rents.child.children.end_date')}
            name='end_date'
            overrideValues={{
              label: 'Loppupvm',
            }}
          />
        </Column>
      </Row>
      <Row>
        <Column>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'rents.child.children.note')}
            name='note'
            overrideValues={{
              label: 'Huomautus',
            }}
          />
        </Column>
      </Row>
    </div>
  );
};

type Props = {
  attributes: Attributes,
  change: Function,
  currentLease: Lease,
  cycle: string,
  dueDates: Array<Object>,
  dueDatesPerYear: ?number,
  dueDatesType: ?string,
  field: any,
  isSaveClicked: boolean,
  leaseTypes: LeaseTypeList,
  rentType: ?string,
}

const BasicInfoEdit = ({
  attributes,
  currentLease,
  cycle,
  dueDatesPerYear,
  dueDatesType,
  isSaveClicked,
  leaseTypes,
  rentType,
}: Props) => {
  const getYearlyDueDates = () => {
    const leaseTypeId = get(currentLease, 'type.id');
    const leaseType = leaseTypes.find((item) => item.id === leaseTypeId);
    if(!dueDatesPerYear ||isEmpty(leaseType) || dueDatesType !== RentDueDateTypes.FIXED) return [];

    return FixedDueDates[get(leaseType, 'due_dates_position')][dueDatesPerYear];
  };

  const yearlyDueDates = getYearlyDueDates();

  return (
    <div>
      {!rentType &&
        <BasicInfoEmpty
          attributes={attributes}
          isSaveClicked={isSaveClicked}
        />
      }
      {rentType === RentTypes.INDEX &&
        <BasicInfoIndex
          attributes={attributes}
          cycle={cycle}
          dueDatesType={dueDatesType}
          isIndex={true}
          isSaveClicked={isSaveClicked}
          yearlyDueDates={yearlyDueDates}
        />
      }
      {rentType === RentTypes.ONE_TIME &&
        <BasicInfoOneTime
          attributes={attributes}
          dueDatesType={dueDatesType}
          isSaveClicked={isSaveClicked}
        />
      }
      {rentType === RentTypes.FIXED &&
        <BasicInfoFixed
          attributes={attributes}
          dueDatesType={dueDatesType}
          isSaveClicked={isSaveClicked}
          yearlyDueDates={yearlyDueDates}
        />
      }
      {rentType === RentTypes.FREE &&
        <BasicInfoFree
          attributes={attributes}
          isSaveClicked={isSaveClicked}
        />
      }
      {rentType === RentTypes.MANUAL &&
        <BasicInfoIndex
          attributes={attributes}
          cycle={cycle}
          dueDatesType={dueDatesType}
          isIndex={false}
          isSaveClicked={isSaveClicked}
          yearlyDueDates={yearlyDueDates}
        />
      }
    </div>
  );
};

const formName = FormNames.RENTS;
const selector = formValueSelector(formName);

export default connect(
  (state, props) => {
    return {
      attributes: getAttributes(state),
      currentLease: getCurrentLease(state),
      cycle: selector(state, `${props.field}.cycle`),
      dueDatesPerYear: selector(state, `${props.field}.due_dates_per_year`),
      dueDatesType: selector(state, `${props.field}.due_dates_type`),
      dueDates: selector(state, `${props.field}.due_dates`),
      leaseTypes: getLeaseTypeList(state),
    };
  },
  {
    change,
  }
)(BasicInfoEdit);
