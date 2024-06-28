import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { Row, Column } from "react-foundation";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import { formValueSelector, change, reduxForm } from "redux-form";
import flowRight from "lodash/flowRight";
import isEmpty from "lodash/isEmpty";
import ActionButtonWrapper from "/src/components/form/ActionButtonWrapper";
import Authorization from "/src/components/authorization/Authorization";
import BoxContentWrapper from "/src/components/content/BoxContentWrapper";
import BoxItem from "/src/components/content/BoxItem";
import FormField from "/src/components/form/FormField";
import RemoveButton from "/src/components/form/RemoveButton";
import { FormNames } from "enums";
import { LeasePlanUnitsFieldPaths, LeasePlanUnitsFieldTitles } from "/src/leases/enums";
import { UsersPermissions } from "/src/usersPermissions/enums";
import { getUiDataLeaseKey } from "/src/uiData/helpers";
import { getFieldAttributes, getSearchQuery, getUrlParams, hasPermissions, isFieldAllowedToRead } from "/src/util/helpers";
import { getAttributes } from "/src/leases/selectors";
import { getUsersPermissions } from "/src/usersPermissions/selectors";
import type { Attributes } from "types";
import type { UsersPermissions as UsersPermissionsType } from "/src/usersPermissions/types";
type Props = {
  attributes: Attributes;
  field: string;
  geometry: Record<string, any> | null | undefined;
  id: number;
  isSaveClicked: boolean;
  location: Record<string, any>;
  onRemove: (...args: Array<any>) => any;
  usersPermissions: UsersPermissionsType;
  change: (...args: Array<any>) => any;
  identifier: any;
  area: any;
  section_area: any;
  detailed_plan_identifier: any;
  detailed_plan_latest_processing_date: any;
  detailed_plan_latest_processing_date_note: any;
  plot_division_identifier: any;
  plot_division_state: any;
  plot_division_effective_date: any;
  plan_unit_type: any;
  plan_unit_state: any;
  plan_unit_intended_use: any;
  is_master: boolean;
};
type State = {
  identifier: any;
  area: any;
  section_area: any;
  detailed_plan_identifier: any;
  detailed_plan_latest_processing_date: any;
  detailed_plan_latest_processing_date_note: any;
  plot_division_identifier: any;
  plot_division_state: any;
  plot_division_effective_date: any;
  plan_unit_type: any;
  plan_unit_state: any;
  plan_unit_intended_use: any;
  is_master: boolean;
};

class PlanUnitItemEdit extends PureComponent<Props, State> {
  state = {
    identifier: this.props.identifier,
    area: this.props.area,
    section_area: this.props.section_area,
    detailed_plan_identifier: this.props.detailed_plan_identifier,
    detailed_plan_latest_processing_date: this.props.detailed_plan_latest_processing_date,
    detailed_plan_latest_processing_date_note: this.props.detailed_plan_latest_processing_date_note,
    plot_division_identifier: this.props.plot_division_identifier,
    plot_division_state: this.props.plot_division_state,
    plot_division_effective_date: this.props.plot_division_effective_date,
    plan_unit_type: this.props.plan_unit_type,
    plan_unit_state: this.props.plan_unit_state,
    plan_unit_intended_use: this.props.plan_unit_intended_use,
    is_master: this.props.is_master
  };
  getMapLinkUrl = () => {
    const {
      id,
      location
    } = this.props;
    const {
      pathname,
      search
    } = location;
    const searchQuery = getUrlParams(search);
    delete searchQuery.lease_area;
    delete searchQuery.plot;
    searchQuery.plan_unit = id, searchQuery.tab = 7;
    return `${pathname}${getSearchQuery(searchQuery)}`;
  };
  mapLinkUrl = () => this.getMapLinkUrl();

  componentDidUpdate(prevProps: Props) {
    const {
      field,
      change
    } = this.props;
    if (this.state.is_master) return;

    if (this.state.identifier == this.props.identifier && this.state.area == this.props.area && this.state.section_area == this.props.section_area && this.state.detailed_plan_identifier == this.props.detailed_plan_identifier && this.state.detailed_plan_latest_processing_date == this.props.detailed_plan_latest_processing_date && this.state.detailed_plan_latest_processing_date_note == this.props.detailed_plan_latest_processing_date_note && this.state.plot_division_identifier == this.props.plot_division_identifier && this.state.plot_division_state == this.props.plot_division_state && this.state.plot_division_effective_date == this.props.plot_division_effective_date && this.state.plan_unit_type == this.props.plan_unit_type && this.state.plan_unit_state == this.props.plan_unit_state && this.state.plan_unit_intended_use == this.props.plan_unit_intended_use) {
      change(`${field}.is_master`, false);
      return;
    }

    if (this.props.is_master) return;

    if (prevProps.identifier != this.props.identifier || prevProps.area != this.props.area || prevProps.section_area != this.props.section_area || prevProps.detailed_plan_identifier != this.props.detailed_plan_identifier || prevProps.detailed_plan_latest_processing_date != this.props.detailed_plan_latest_processing_date || prevProps.detailed_plan_latest_processing_date_note != this.props.detailed_plan_latest_processing_date_note || prevProps.plot_division_identifier != this.props.plot_division_identifier || prevProps.plot_division_state != this.props.plot_division_state || prevProps.plot_division_effective_date != this.props.plot_division_effective_date || prevProps.plan_unit_type != this.props.plan_unit_type || prevProps.plan_unit_state != this.props.plan_unit_state || prevProps.plan_unit_intended_use != this.props.plan_unit_intended_use) {
      change(`${field}.is_master`, true);
      return;
    }
  }

  render() {
    const {
      attributes,
      field,
      geometry,
      isSaveClicked,
      onRemove,
      usersPermissions
    } = this.props;
    return <BoxItem>
        <BoxContentWrapper>
          <ActionButtonWrapper>
            <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.DELETE_PLANUNIT)}>
              <RemoveButton onClick={onRemove} title="Poista kaavayksikkö" />
            </Authorization>
          </ActionButtonWrapper>
          <Row>
            <Column small={12} medium={8} large={8}>
              <Authorization allow={isFieldAllowedToRead(attributes, LeasePlanUnitsFieldPaths.IDENTIFIER)}>
                <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeasePlanUnitsFieldPaths.IDENTIFIER)} name={`${field}.identifier`} overrideValues={{
                label: LeasePlanUnitsFieldTitles.IDENTIFIER
              }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeasePlanUnitsFieldPaths.IDENTIFIER)} />
              </Authorization>
            </Column>
            <Column small={12} medium={2} large={2}>
              <Authorization allow={isFieldAllowedToRead(attributes, LeasePlanUnitsFieldPaths.IS_MASTER)}>
                <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeasePlanUnitsFieldPaths.IS_MASTER)} name={`${field}.is_master`} overrideValues={{
                label: LeasePlanUnitsFieldTitles.IS_MASTER,
                disabled: true
              }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeasePlanUnitsFieldPaths.IS_MASTER)} />
              </Authorization>
            </Column>
            <Column small={12} medium={3} large={3}>
              <Authorization allow={isFieldAllowedToRead(attributes, LeasePlanUnitsFieldPaths.GEOMETRY)}>
                {!isEmpty(geometry) && <Link to={this.mapLinkUrl}>{LeasePlanUnitsFieldTitles.GEOMETRY}</Link>}
              </Authorization>
            </Column>
          </Row>
  
          <Row>
            <Column small={12} medium={6} large={3}>
              <Authorization allow={isFieldAllowedToRead(attributes, LeasePlanUnitsFieldPaths.AREA)}>
                <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeasePlanUnitsFieldPaths.AREA)} name={`${field}.area`} unit='m²' overrideValues={{
                label: LeasePlanUnitsFieldTitles.AREA
              }} enableUiDataEdit tooltipStyle={{
                right: 22
              }} uiDataKey={getUiDataLeaseKey(LeasePlanUnitsFieldPaths.AREA)} />
              </Authorization>
            </Column>
            <Column small={12} medium={6} large={3}>
              <Authorization allow={isFieldAllowedToRead(attributes, LeasePlanUnitsFieldPaths.SECTION_AREA)}>
                <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeasePlanUnitsFieldPaths.SECTION_AREA)} name={`${field}.section_area`} unit='m²' overrideValues={{
                label: LeasePlanUnitsFieldTitles.SECTION_AREA
              }} enableUiDataEdit tooltipStyle={{
                right: 22
              }} uiDataKey={getUiDataLeaseKey(LeasePlanUnitsFieldPaths.SECTION_AREA)} />
              </Authorization>
            </Column>
          </Row>
          <Row>
            <Column small={12} medium={6} large={3}>
              <Authorization allow={isFieldAllowedToRead(attributes, LeasePlanUnitsFieldPaths.DETAILED_PLAN_IDENTIFIER)}>
                <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeasePlanUnitsFieldPaths.DETAILED_PLAN_IDENTIFIER)} name={`${field}.detailed_plan_identifier`} overrideValues={{
                label: LeasePlanUnitsFieldTitles.DETAILED_PLAN_IDENTIFIER
              }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeasePlanUnitsFieldPaths.DETAILED_PLAN_IDENTIFIER)} />
              </Authorization>
            </Column>
            <Column small={12} medium={6} large={3}>
              <Authorization allow={isFieldAllowedToRead(attributes, LeasePlanUnitsFieldPaths.DETAILED_PLAN_LATEST_PROCESSING_DATE)}>
                <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeasePlanUnitsFieldPaths.DETAILED_PLAN_LATEST_PROCESSING_DATE)} name={`${field}.detailed_plan_latest_processing_date`} overrideValues={{
                label: LeasePlanUnitsFieldTitles.DETAILED_PLAN_LATEST_PROCESSING_DATE
              }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeasePlanUnitsFieldPaths.DETAILED_PLAN_LATEST_PROCESSING_DATE)} />
              </Authorization>
            </Column>
          </Row>
          <Row>
            <Column>
              <Authorization allow={isFieldAllowedToRead(attributes, LeasePlanUnitsFieldPaths.DETAILED_PLAN_LATEST_PROCESSING_DATE_NOTE)}>
                <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeasePlanUnitsFieldPaths.DETAILED_PLAN_LATEST_PROCESSING_DATE_NOTE)} name={`${field}.detailed_plan_latest_processing_date_note`} overrideValues={{
                label: LeasePlanUnitsFieldTitles.DETAILED_PLAN_LATEST_PROCESSING_DATE_NOTE
              }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeasePlanUnitsFieldPaths.DETAILED_PLAN_LATEST_PROCESSING_DATE_NOTE)} />
              </Authorization>
            </Column>
          </Row>
          <Row>
            <Column small={12} medium={6} large={3}>
              <Authorization allow={isFieldAllowedToRead(attributes, LeasePlanUnitsFieldPaths.PLOT_DIVISION_IDENTIFIER)}>
                <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeasePlanUnitsFieldPaths.PLOT_DIVISION_IDENTIFIER)} name={`${field}.plot_division_identifier`} overrideValues={{
                label: LeasePlanUnitsFieldTitles.PLOT_DIVISION_IDENTIFIER
              }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeasePlanUnitsFieldPaths.PLOT_DIVISION_IDENTIFIER)} />
              </Authorization>
            </Column>
            <Column small={12} medium={6} large={3}>
              <Authorization allow={isFieldAllowedToRead(attributes, LeasePlanUnitsFieldPaths.PLOT_DIVISION_STATE)}>
                <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeasePlanUnitsFieldPaths.PLOT_DIVISION_STATE)} name={`${field}.plot_division_state`} overrideValues={{
                label: LeasePlanUnitsFieldTitles.PLOT_DIVISION_STATE
              }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeasePlanUnitsFieldPaths.PLOT_DIVISION_STATE)} />
              </Authorization>
            </Column>
            <Column small={12} medium={6} large={3}>
              <Authorization allow={isFieldAllowedToRead(attributes, LeasePlanUnitsFieldPaths.PLOT_DIVISION_EFFECTIVE_DATE)}>
                <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeasePlanUnitsFieldPaths.PLOT_DIVISION_EFFECTIVE_DATE)} name={`${field}.plot_division_effective_date`} overrideValues={{
                label: LeasePlanUnitsFieldTitles.PLOT_DIVISION_EFFECTIVE_DATE
              }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeasePlanUnitsFieldPaths.PLOT_DIVISION_EFFECTIVE_DATE)} />
              </Authorization>
            </Column>
          </Row>
          <Row>
            <Column small={12} medium={6} large={3}>
              <Authorization allow={isFieldAllowedToRead(attributes, LeasePlanUnitsFieldPaths.PLAN_UNIT_TYPE)}>
                <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeasePlanUnitsFieldPaths.PLAN_UNIT_TYPE)} name={`${field}.plan_unit_type`} overrideValues={{
                label: LeasePlanUnitsFieldTitles.PLAN_UNIT_TYPE
              }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeasePlanUnitsFieldPaths.PLAN_UNIT_TYPE)} />
              </Authorization>
            </Column>
            <Column small={12} medium={6} large={3}>
              <Authorization allow={isFieldAllowedToRead(attributes, LeasePlanUnitsFieldPaths.PLAN_UNIT_STATE)}>
                <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeasePlanUnitsFieldPaths.PLAN_UNIT_STATE)} name={`${field}.plan_unit_state`} overrideValues={{
                label: LeasePlanUnitsFieldTitles.PLAN_UNIT_STATE
              }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeasePlanUnitsFieldPaths.PLAN_UNIT_STATE)} />
              </Authorization>
            </Column>
            <Column small={12} medium={6} large={3}>
              <Authorization allow={isFieldAllowedToRead(attributes, LeasePlanUnitsFieldPaths.PLAN_UNIT_INTENDED_USE)}>
                <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeasePlanUnitsFieldPaths.PLAN_UNIT_INTENDED_USE)} name={`${field}.plan_unit_intended_use`} overrideValues={{
                label: LeasePlanUnitsFieldTitles.PLAN_UNIT_INTENDED_USE
              }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeasePlanUnitsFieldPaths.PLAN_UNIT_INTENDED_USE)} />
              </Authorization>
            </Column>
          </Row>
        </BoxContentWrapper>
      </BoxItem>;
  }

}

const formName = FormNames.LEASE_AREAS;
const selector = formValueSelector(formName);
export default flowRight(
withRouter, connect((state, props) => {
  return {
    attributes: getAttributes(state),
    geometry: selector(state, `${props.field}.geometry`),
    id: selector(state, `${props.field}.id`),
    usersPermissions: getUsersPermissions(state),
    identifier: selector(state, `${props.field}.identifier`),
    area: selector(state, `${props.field}.area`),
    section_area: selector(state, `${props.field}.section_area`),
    detailed_plan_identifier: selector(state, `${props.field}.detailed_plan_identifier`),
    detailed_plan_latest_processing_date: selector(state, `${props.field}.detailed_plan_latest_processing_date`),
    detailed_plan_latest_processing_date_note: selector(state, `${props.field}.detailed_plan_latest_processing_date_note`),
    plot_division_identifier: selector(state, `${props.field}.plot_division_identifier`),
    plot_division_state: selector(state, `${props.field}.plot_division_state`),
    plot_division_effective_date: selector(state, `${props.field}.plot_division_effective_date`),
    plan_unit_type: selector(state, `${props.field}.plan_unit_type`),
    plan_unit_state: selector(state, `${props.field}.plan_unit_state`),
    plan_unit_intended_use: selector(state, `${props.field}.plan_unit_intended_use`),
    is_master: selector(state, `${props.field}.is_master`)
  };
}), reduxForm({
  form: formName,
  destroyOnUnmount: false,
  change
}))(PlanUnitItemEdit) as React.ComponentType<any>;