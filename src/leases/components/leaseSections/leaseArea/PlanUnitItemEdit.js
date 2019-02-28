// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import {withRouter} from 'react-router';
import {Link} from 'react-router-dom';
import {formValueSelector} from 'redux-form';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';

import ActionButtonWrapper from '$components/form/ActionButtonWrapper';
import Authorization from '$components/authorization/Authorization';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import BoxItem from '$components/content/BoxItem';
import FormField from '$components/form/FormField';
import RemoveButton from '$components/form/RemoveButton';
import {FormNames, LeasePlanUnitsFieldPaths, LeasePlanUnitsFieldTitles} from '$src/leases/enums';
import {UsersPermissions} from '$src/usersPermissions/enums';
import {getUiDataLeaseKey} from '$src/uiData/helpers';
import {
  getFieldAttributes,
  getSearchQuery,
  getUrlParams,
  hasPermissions,
  isFieldAllowedToRead,
} from '$util/helpers';
import {getAttributes} from '$src/leases/selectors';
import {getUsersPermissions} from '$src/usersPermissions/selectors';

import type {Attributes} from '$src/types';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';

type Props = {
  attributes: Attributes,
  field: string,
  geometry: ?Object,
  id: number,
  isSaveClicked: boolean,
  location: Object,
  onRemove: Function,
  usersPermissions: UsersPermissionsType,
}

const PlanUnitItemEdit = ({
  attributes,
  field,
  geometry,
  id,
  isSaveClicked,
  location,
  onRemove,
  usersPermissions,
}: Props) => {
  const getMapLinkUrl = () => {
    const {pathname, search} = location;
    const searchQuery = getUrlParams(search);

    delete searchQuery.lease_area;
    delete searchQuery.plot;
    searchQuery.plan_unit = id,
    searchQuery.tab = 7;

    return `${pathname}${getSearchQuery(searchQuery)}`;
  };

  const mapLinkUrl = getMapLinkUrl();

  return (
    <BoxItem>
      <BoxContentWrapper>
        <ActionButtonWrapper>
          <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.DELETE_PLANUNIT)}>
            <RemoveButton
              onClick={onRemove}
              title="Poista kaavayksikkö"
            />
          </Authorization>
        </ActionButtonWrapper>
        <Row>
          <Column small={12} medium={6} large={6}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeasePlanUnitsFieldPaths.IDENTIFIER)}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(attributes,  LeasePlanUnitsFieldPaths.IDENTIFIER)}
                name={`${field}.identifier`}
                overrideValues={{label: LeasePlanUnitsFieldTitles.IDENTIFIER}}
                enableUiDataEdit
                uiDataKey={getUiDataLeaseKey(LeasePlanUnitsFieldPaths.IDENTIFIER)}
              />
            </Authorization>
          </Column>
          <Column small={12} medium={3} large={3}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeasePlanUnitsFieldPaths.GEOMETRY)}>
              {!isEmpty(geometry) &&
                <Link to={mapLinkUrl}>{LeasePlanUnitsFieldTitles.GEOMETRY}</Link>
              }
            </Authorization>
          </Column>
        </Row>

        <Row>
          <Column small={12} medium={6} large={3}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeasePlanUnitsFieldPaths.AREA)}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(attributes, LeasePlanUnitsFieldPaths.AREA)}
                name={`${field}.area`}
                unit='m²'
                overrideValues={{label: LeasePlanUnitsFieldTitles.AREA}}
                enableUiDataEdit
                tooltipStyle={{right: 22}}
                uiDataKey={getUiDataLeaseKey(LeasePlanUnitsFieldPaths.AREA)}
              />
            </Authorization>
          </Column>
          <Column small={12} medium={6} large={3}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeasePlanUnitsFieldPaths.SECTION_AREA)}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(attributes, LeasePlanUnitsFieldPaths.SECTION_AREA)}
                name={`${field}.section_area`}
                unit='m²'
                overrideValues={{label: LeasePlanUnitsFieldTitles.SECTION_AREA}}
                enableUiDataEdit
                tooltipStyle={{right: 22}}
                uiDataKey={getUiDataLeaseKey(LeasePlanUnitsFieldPaths.SECTION_AREA)}
              />
            </Authorization>
          </Column>
        </Row>
        <Row>
          <Column small={12} medium={6} large={3}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeasePlanUnitsFieldPaths.DETAILED_PLAN_IDENTIFIER)}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(attributes, LeasePlanUnitsFieldPaths.DETAILED_PLAN_IDENTIFIER)}
                name={`${field}.detailed_plan_identifier`}
                overrideValues={{label: LeasePlanUnitsFieldTitles.DETAILED_PLAN_IDENTIFIER}}
                enableUiDataEdit
                uiDataKey={getUiDataLeaseKey(LeasePlanUnitsFieldPaths.DETAILED_PLAN_IDENTIFIER)}
              />
            </Authorization>
          </Column>
          <Column small={12} medium={6} large={3}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeasePlanUnitsFieldPaths.DETAILED_PLAN_LATEST_PROCESSING_DATE)}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(attributes, LeasePlanUnitsFieldPaths.DETAILED_PLAN_LATEST_PROCESSING_DATE)}
                name={`${field}.detailed_plan_latest_processing_date`}
                overrideValues={{label: LeasePlanUnitsFieldTitles.DETAILED_PLAN_LATEST_PROCESSING_DATE}}
                enableUiDataEdit
                uiDataKey={getUiDataLeaseKey(LeasePlanUnitsFieldPaths.DETAILED_PLAN_LATEST_PROCESSING_DATE)}
              />
            </Authorization>
          </Column>
        </Row>
        <Row>
          <Column>
            <Authorization allow={isFieldAllowedToRead(attributes, LeasePlanUnitsFieldPaths.DETAILED_PLAN_LATEST_PROCESSING_DATE_NOTE)}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(attributes, LeasePlanUnitsFieldPaths.DETAILED_PLAN_LATEST_PROCESSING_DATE_NOTE)}
                name={`${field}.detailed_plan_latest_processing_date_note`}
                overrideValues={{label: LeasePlanUnitsFieldTitles.DETAILED_PLAN_LATEST_PROCESSING_DATE_NOTE}}
                enableUiDataEdit
                uiDataKey={getUiDataLeaseKey(LeasePlanUnitsFieldPaths.DETAILED_PLAN_LATEST_PROCESSING_DATE_NOTE)}
              />
            </Authorization>
          </Column>
        </Row>
        <Row>
          <Column small={12} medium={6} large={3}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeasePlanUnitsFieldPaths.PLOT_DIVISION_IDENTIFIER)}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(attributes, LeasePlanUnitsFieldPaths.PLOT_DIVISION_IDENTIFIER)}
                name={`${field}.plot_division_identifier`}
                overrideValues={{label: LeasePlanUnitsFieldTitles.PLOT_DIVISION_IDENTIFIER}}
                enableUiDataEdit
                uiDataKey={getUiDataLeaseKey(LeasePlanUnitsFieldPaths.PLOT_DIVISION_IDENTIFIER)}
              />
            </Authorization>
          </Column>
          <Column small={12} medium={6} large={3}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeasePlanUnitsFieldPaths.PLOT_DIVISION_STATE)}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(attributes, LeasePlanUnitsFieldPaths.PLOT_DIVISION_STATE)}
                name={`${field}.plot_division_state`}
                overrideValues={{label: LeasePlanUnitsFieldTitles.PLOT_DIVISION_STATE}}
                enableUiDataEdit
                uiDataKey={getUiDataLeaseKey(LeasePlanUnitsFieldPaths.PLOT_DIVISION_STATE)}
              />
            </Authorization>
          </Column>
          <Column small={12} medium={6} large={3}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeasePlanUnitsFieldPaths.PLOT_DIVISION_EFFECTIVE_DATE)}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(attributes, LeasePlanUnitsFieldPaths.PLOT_DIVISION_EFFECTIVE_DATE)}
                name={`${field}.plot_division_effective_date`}
                overrideValues={{label: LeasePlanUnitsFieldTitles.PLOT_DIVISION_EFFECTIVE_DATE}}
                enableUiDataEdit
                uiDataKey={getUiDataLeaseKey(LeasePlanUnitsFieldPaths.PLOT_DIVISION_EFFECTIVE_DATE)}
              />
            </Authorization>
          </Column>
        </Row>
        <Row>
          <Column small={12} medium={6} large={3}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeasePlanUnitsFieldPaths.PLAN_UNIT_TYPE)}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(attributes, LeasePlanUnitsFieldPaths.PLAN_UNIT_TYPE)}
                name={`${field}.plan_unit_type`}
                overrideValues={{label: LeasePlanUnitsFieldTitles.PLAN_UNIT_TYPE}}
                enableUiDataEdit
                uiDataKey={getUiDataLeaseKey(LeasePlanUnitsFieldPaths.PLAN_UNIT_TYPE)}
              />
            </Authorization>
          </Column>
          <Column small={12} medium={6} large={3}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeasePlanUnitsFieldPaths.PLAN_UNIT_STATE)}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(attributes, LeasePlanUnitsFieldPaths.PLAN_UNIT_STATE)}
                name={`${field}.plan_unit_state`}
                overrideValues={{label: LeasePlanUnitsFieldTitles.PLAN_UNIT_STATE}}
                enableUiDataEdit
                uiDataKey={getUiDataLeaseKey(LeasePlanUnitsFieldPaths.PLAN_UNIT_STATE)}
              />
            </Authorization>
          </Column>
          <Column small={12} medium={6} large={3}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeasePlanUnitsFieldPaths.PLAN_UNIT_INTENDED_USE)}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(attributes, LeasePlanUnitsFieldPaths.PLAN_UNIT_INTENDED_USE)}
                name={`${field}.plan_unit_intended_use`}
                overrideValues={{label: LeasePlanUnitsFieldTitles.PLAN_UNIT_INTENDED_USE}}
                enableUiDataEdit
                uiDataKey={getUiDataLeaseKey(LeasePlanUnitsFieldPaths.PLAN_UNIT_INTENDED_USE)}
              />
            </Authorization>
          </Column>
        </Row>
      </BoxContentWrapper>
    </BoxItem>
  );
};

const formName = FormNames.LEASE_AREAS;
const selector = formValueSelector(formName);

export default flowRight(
  // $FlowFixMe
  withRouter,
  connect(
    (state, props) => {
      return {
        attributes: getAttributes(state),
        geometry: selector(state, `${props.field}.geometry`),
        id: selector(state, `${props.field}.id`),
        usersPermissions: getUsersPermissions(state),
      };
    }
  ),
)(PlanUnitItemEdit);
