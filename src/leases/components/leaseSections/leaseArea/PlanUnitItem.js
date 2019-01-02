// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Link, withRouter} from 'react-router';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';

import Authorization from '$components/authorization/Authorization';
import BoxItem from '$components/content/BoxItem';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import {LeasePlanUnitsFieldPaths, LeasePlanUnitsFieldTitles} from '$src/leases/enums';
import {getAttributes} from '$src/leases/selectors';
import {
  formatDate,
  formatNumber,
  getFieldAttributes,
  getFieldOptions,
  getLabelOfOption,
  getSearchQuery,
  isEmptyValue,
  isFieldAllowedToEdit,
} from '$util/helpers';

import type {Attributes} from '$src/types';

type Props = {
  attributes: Attributes,
  isAreaActive: boolean,
  planUnit: Object,
  router: Object,
}

const PlanUnitItem = ({
  attributes,
  isAreaActive,
  planUnit,
  router,
}: Props) => {
  const getMapLinkUrl = () => {
    const {location: {pathname, query}} = router;

    const tempQuery = {...query};
    delete tempQuery.lease_area;
    delete tempQuery.plot;
    tempQuery.plan_unit = planUnit.id,
    tempQuery.tab = 7;

    return `${pathname}${getSearchQuery(tempQuery)}`;
  };

  const mapLinkUrl = getMapLinkUrl();

  const plotDivisionStateOptions = getFieldOptions(getFieldAttributes(attributes, LeasePlanUnitsFieldPaths.PLOT_DIVISION_STATE));
  const planUnitTypeOptions = getFieldOptions(getFieldAttributes(attributes, LeasePlanUnitsFieldPaths.PLAN_UNIT_TYPE));
  const planUnitStateOptions = getFieldOptions(getFieldAttributes(attributes, LeasePlanUnitsFieldPaths.PLAN_UNIT_STATE));
  const planUnitIntendedUseOptions = getFieldOptions(getFieldAttributes(attributes, LeasePlanUnitsFieldPaths.PLAN_UNIT_INTENDED_USE));

  return (
    <BoxItem className='no-border-on-first-child no-border-on-last-child'>
      <Row>
        <Column small={12} medium={9} large={9}>
          <Authorization allow={isFieldAllowedToEdit(attributes, LeasePlanUnitsFieldPaths.IDENTIFIER)}>
            <FormTextTitle>{LeasePlanUnitsFieldTitles.IDENTIFIER}</FormTextTitle>
            <FormText>{planUnit.identifier || '-'}</FormText>
          </Authorization>
        </Column>
        <Column small={12} medium={3} large={3}>
          <Authorization allow={isFieldAllowedToEdit(attributes, LeasePlanUnitsFieldPaths.GEOMETRY)}>
            {(isAreaActive && !isEmpty(planUnit.geometry)) &&
              <Link to={mapLinkUrl}>{LeasePlanUnitsFieldTitles.GEOMETRY}</Link>
            }
          </Authorization>
        </Column>
      </Row>

      <Row>
        <Column small={12} medium={6} large={3}>
          <Authorization allow={isFieldAllowedToEdit(attributes, LeasePlanUnitsFieldPaths.AREA)}>
            <FormTextTitle>{LeasePlanUnitsFieldTitles.AREA}</FormTextTitle>
            <FormText>{!isEmptyValue(planUnit.area) ? `${formatNumber(planUnit.area)} m²` : '-'}</FormText>
          </Authorization>
        </Column>
        <Column small={12} medium={6} large={3}>
          <Authorization allow={isFieldAllowedToEdit(attributes, LeasePlanUnitsFieldPaths.SECTION_AREA)}>
            <FormTextTitle>{LeasePlanUnitsFieldTitles.SECTION_AREA}</FormTextTitle>
            <FormText>{!isEmptyValue(planUnit.section_area) ? `${formatNumber(planUnit.section_area)} m²` : '-'}</FormText>
          </Authorization>
        </Column>
      </Row>
      <Row>
        <Column small={12} medium={6} large={3}>
          <Authorization allow={isFieldAllowedToEdit(attributes, LeasePlanUnitsFieldPaths.DETAILED_PLAN_IDENTIFIER)}>
            <FormTextTitle>{LeasePlanUnitsFieldTitles.DETAILED_PLAN_IDENTIFIER}</FormTextTitle>
            <FormText>{planUnit.detailed_plan_identifier || '-'}</FormText>
          </Authorization>
        </Column>
        <Column small={12} medium={6} large={3}>
          <Authorization allow={isFieldAllowedToEdit(attributes, LeasePlanUnitsFieldPaths.DETAILED_PLAN_LATEST_PROCESSING_DATE)}>
            <FormTextTitle>{LeasePlanUnitsFieldTitles.DETAILED_PLAN_LATEST_PROCESSING_DATE}</FormTextTitle>
            <FormText>{formatDate(planUnit.detailed_plan_latest_processing_date) || '-'}</FormText>
          </Authorization>
        </Column>
      </Row>
      <Row>
        <Column>
          <Authorization allow={isFieldAllowedToEdit(attributes, LeasePlanUnitsFieldPaths.DETAILED_PLAN_LATEST_PROCESSING_DATE_NOTE)}>
            <FormTextTitle>{LeasePlanUnitsFieldTitles.DETAILED_PLAN_LATEST_PROCESSING_DATE_NOTE}</FormTextTitle>
            <FormText>{planUnit.detailed_plan_latest_processing_date_note || '-'}</FormText>
          </Authorization>
        </Column>
      </Row>
      <Row>
        <Column small={12} medium={6} large={3}>
          <Authorization allow={isFieldAllowedToEdit(attributes, LeasePlanUnitsFieldPaths.PLOT_DIVISION_IDENTIFIER)}>
            <FormTextTitle>{LeasePlanUnitsFieldTitles.PLOT_DIVISION_IDENTIFIER}</FormTextTitle>
            <FormText>{planUnit.plot_division_identifier || '-'}</FormText>
          </Authorization>
        </Column>
        <Column small={12} medium={6} large={3}>
          <Authorization allow={isFieldAllowedToEdit(attributes, LeasePlanUnitsFieldPaths.PLOT_DIVISION_STATE)}>
            <FormTextTitle>{LeasePlanUnitsFieldTitles.PLOT_DIVISION_STATE}</FormTextTitle>
            <FormText>{getLabelOfOption(plotDivisionStateOptions, planUnit.plot_division_state) || '-'}</FormText>
          </Authorization>
        </Column>
        <Column small={12} medium={12} large={6}>
          <Authorization allow={isFieldAllowedToEdit(attributes, LeasePlanUnitsFieldPaths.PLOT_DIVISION_DATE_OF_APPROVAL)}>
            <FormTextTitle>{LeasePlanUnitsFieldTitles.PLOT_DIVISION_DATE_OF_APPROVAL}</FormTextTitle>
            <FormText>{formatDate(planUnit.plot_division_date_of_approval) || '-'}</FormText>
          </Authorization>
        </Column>
      </Row>
      <Row>
        <Column small={12} medium={6} large={3}>
          <Authorization allow={isFieldAllowedToEdit(attributes, LeasePlanUnitsFieldPaths.PLAN_UNIT_TYPE)}>
            <FormTextTitle>{LeasePlanUnitsFieldTitles.PLAN_UNIT_TYPE}</FormTextTitle>
            <FormText>{getLabelOfOption(planUnitTypeOptions, planUnit.plan_unit_type) || '-'}</FormText>
          </Authorization>
        </Column>
        <Column small={12} medium={6} large={3}>
          <Authorization allow={isFieldAllowedToEdit(attributes, LeasePlanUnitsFieldPaths.PLAN_UNIT_STATE)}>
            <FormTextTitle>{LeasePlanUnitsFieldTitles.PLAN_UNIT_STATE}</FormTextTitle>
            <FormText>{getLabelOfOption(planUnitStateOptions, planUnit.plan_unit_state) || '-'}</FormText>
          </Authorization>
        </Column>
        <Column small={12} medium={12} large={6}>
          <Authorization allow={isFieldAllowedToEdit(attributes, LeasePlanUnitsFieldPaths.PLAN_UNIT_INTENDED_USE)}>
            <FormTextTitle>{LeasePlanUnitsFieldTitles.PLAN_UNIT_INTENDED_USE}</FormTextTitle>
            <FormText>{getLabelOfOption(planUnitIntendedUseOptions, planUnit.plan_unit_intended_use) || '-'}</FormText>
          </Authorization>
        </Column>
      </Row>
    </BoxItem>
  );
};

export default flowRight(
  withRouter,
  connect(
    (state) => {
      return {
        attributes: getAttributes(state),
      };
    }
  ),
)(PlanUnitItem);
