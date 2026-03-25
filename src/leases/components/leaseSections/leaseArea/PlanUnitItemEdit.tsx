import React from "react";
import { useSelector } from "react-redux";
import { Row, Column } from "react-foundation";
import { Link, useLocation } from "react-router-dom";
import { useField } from "react-final-form";
import isEmpty from "lodash/isEmpty";
import ActionButtonWrapper from "@/components/form/ActionButtonWrapper";
import Authorization from "@/components/authorization/Authorization";
import BoxContentWrapper from "@/components/content/BoxContentWrapper";
import BoxItem from "@/components/content/BoxItem";
import FormField from "@/components/form/final-form/FormField";
import RemoveButton from "@/components/form/RemoveButton";
import {
  LeasePlanUnitsFieldPaths,
  LeasePlanUnitsFieldTitles,
} from "@/leases/enums";
import { UsersPermissions } from "@/usersPermissions/enums";
import { getUiDataLeaseKey } from "@/uiData/helpers";
import {
  getFieldAttributes,
  getSearchQuery,
  getUrlParams,
  hasPermissions,
  isFieldAllowedToRead,
} from "@/util/helpers";
import { getAttributes, getIsSaveClicked } from "@/leases/selectors";
import { getUsersPermissions } from "@/usersPermissions/selectors";
import type { Attributes } from "types";
import type { UsersPermissions as UsersPermissionsType } from "@/usersPermissions/types";

type Props = {
  field: string;
  onRemove: (...args: Array<any>) => any;
};

const PlanUnitItemEdit: React.FC<Props> = ({ field, onRemove }) => {
  const attributes: Attributes = useSelector(getAttributes);
  const isSaveClicked: boolean = useSelector(getIsSaveClicked);
  const usersPermissions: UsersPermissionsType =
    useSelector(getUsersPermissions);
  const form = useForm();
  const location = useLocation();

  const {
    input: { value: id },
  } = useField(`${field}.id`, { subscription: { value: true } });
  const {
    input: { value: geometry },
  } = useField(`${field}.geometry`, { subscription: { value: true } });

  // Snapshot of values
  const initialValuesRef = useRef({
    identifier,
    area,
    section_area,
    detailed_plan_identifier,
    detailed_plan_latest_processing_date,
    detailed_plan_latest_processing_date_note,
    plot_division_identifier,
    plot_division_state,
    plot_division_effective_date,
    plan_unit_type,
    plan_unit_state,
    plan_unit_intended_use,
    is_master,
  });

  const prevValuesRef = useRef({
    identifier,
    area,
    section_area,
    detailed_plan_identifier,
    detailed_plan_latest_processing_date,
    detailed_plan_latest_processing_date_note,
    plot_division_identifier,
    plot_division_state,
    plot_division_effective_date,
    plan_unit_type,
    plan_unit_state,
    plan_unit_intended_use,
  });

  /* The logic was inside 'componentDidUpgrade' -lifecycle method, so after refactoring to 
    'useEffect'-hook it now requires a machanism to skip the component mounting event. Therefore
    we use the 'isFirstRender'-ref. Otherwise entering edit mode will cause the form to dirty
    because of form.change -call.
  */
  const isFirstRenderRef = useRef(true);

  /* The state-logic contained here is just a faithful conversion of the original class-based 
    implementation */
  useEffect(() => {
    const initial = initialValuesRef.current;
    const prev = prevValuesRef.current;
    const currentValues = {
      identifier,
      area,
      section_area,
      detailed_plan_identifier,
      detailed_plan_latest_processing_date,
      detailed_plan_latest_processing_date_note,
      plot_division_identifier,
      plot_division_state,
      plot_division_effective_date,
      plan_unit_type,
      plan_unit_state,
      plan_unit_intended_use,
    };

    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return;
    }

    if (initial.is_master) {
      prevValuesRef.current = currentValues;
      return;
    }

    if (
      initial.identifier == identifier &&
      initial.area == area &&
      initial.section_area == section_area &&
      initial.detailed_plan_identifier == detailed_plan_identifier &&
      initial.detailed_plan_latest_processing_date ==
        detailed_plan_latest_processing_date &&
      initial.detailed_plan_latest_processing_date_note ==
        detailed_plan_latest_processing_date_note &&
      initial.plot_division_identifier == plot_division_identifier &&
      initial.plot_division_state == plot_division_state &&
      initial.plot_division_effective_date == plot_division_effective_date &&
      initial.plan_unit_type == plan_unit_type &&
      initial.plan_unit_state == plan_unit_state &&
      initial.plan_unit_intended_use == plan_unit_intended_use
    ) {
      form.change(`${field}.is_master`, false);
      prevValuesRef.current = currentValues;
      return;
    }

    if (is_master) {
      prevValuesRef.current = currentValues;
      return;
    }

    if (
      prev.identifier != identifier ||
      prev.area != area ||
      prev.section_area != section_area ||
      prev.detailed_plan_identifier != detailed_plan_identifier ||
      prev.detailed_plan_latest_processing_date !=
        detailed_plan_latest_processing_date ||
      prev.detailed_plan_latest_processing_date_note !=
        detailed_plan_latest_processing_date_note ||
      prev.plot_division_identifier != plot_division_identifier ||
      prev.plot_division_state != plot_division_state ||
      prev.plot_division_effective_date != plot_division_effective_date ||
      prev.plan_unit_type != plan_unit_type ||
      prev.plan_unit_state != plan_unit_state ||
      prev.plan_unit_intended_use != plan_unit_intended_use
    ) {
      form.change(`${field}.is_master`, true);
    }
    prevValuesRef.current = currentValues;
  });

  const getMapLinkUrl = () => {
    const { pathname, search } = location;
    const searchQuery = getUrlParams(search);
    delete searchQuery.lease_area;
    delete searchQuery.plot;
    searchQuery.plan_unit = id;
    searchQuery.tab = 7;
    return `${pathname}${getSearchQuery(searchQuery)}`;
  };

  return (
    <BoxItem>
      <BoxContentWrapper>
        <ActionButtonWrapper>
          <Authorization
            allow={hasPermissions(
              usersPermissions,
              UsersPermissions.DELETE_PLANUNIT,
            )}
          >
            <RemoveButton onClick={onRemove} title="Poista kaavayksikkö" />
          </Authorization>
        </ActionButtonWrapper>
        <Row>
          <Column small={12} medium={8} large={8}>
            <Authorization
              allow={isFieldAllowedToRead(
                attributes,
                LeasePlanUnitsFieldPaths.IDENTIFIER,
              )}
            >
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(
                  attributes,
                  LeasePlanUnitsFieldPaths.IDENTIFIER,
                )}
                name={`${field}.identifier`}
                overrideValues={{
                  label: LeasePlanUnitsFieldTitles.IDENTIFIER,
                }}
                enableUiDataEdit
                uiDataKey={getUiDataLeaseKey(
                  LeasePlanUnitsFieldPaths.IDENTIFIER,
                )}
              />
            </Authorization>
          </Column>
          <Column small={12} medium={2} large={2}>
            <Authorization
              allow={isFieldAllowedToRead(
                attributes,
                LeasePlanUnitsFieldPaths.IS_MASTER,
              )}
            >
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(
                  attributes,
                  LeasePlanUnitsFieldPaths.IS_MASTER,
                )}
                name={`${field}.is_master`}
                overrideValues={{
                  label: LeasePlanUnitsFieldTitles.IS_MASTER,
                  disabled: true,
                }}
                enableUiDataEdit
                uiDataKey={getUiDataLeaseKey(
                  LeasePlanUnitsFieldPaths.IS_MASTER,
                )}
              />
            </Authorization>
          </Column>
          <Column small={12} medium={3} large={3}>
            <Authorization
              allow={isFieldAllowedToRead(
                attributes,
                LeasePlanUnitsFieldPaths.GEOMETRY,
              )}
            >
              {!isEmpty(geometry) && (
                <Link to={getMapLinkUrl()}>
                  {LeasePlanUnitsFieldTitles.GEOMETRY}
                </Link>
              )}
            </Authorization>
          </Column>
        </Row>

        <Row>
          <Column small={12} medium={6} large={3}>
            <Authorization
              allow={isFieldAllowedToRead(
                attributes,
                LeasePlanUnitsFieldPaths.AREA,
              )}
            >
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(
                  attributes,
                  LeasePlanUnitsFieldPaths.AREA,
                )}
                name={`${field}.area`}
                unit="m²"
                overrideValues={{
                  label: LeasePlanUnitsFieldTitles.AREA,
                }}
                enableUiDataEdit
                tooltipStyle={{
                  right: 22,
                }}
                uiDataKey={getUiDataLeaseKey(LeasePlanUnitsFieldPaths.AREA)}
              />
            </Authorization>
          </Column>
          <Column small={12} medium={6} large={3}>
            <Authorization
              allow={isFieldAllowedToRead(
                attributes,
                LeasePlanUnitsFieldPaths.SECTION_AREA,
              )}
            >
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(
                  attributes,
                  LeasePlanUnitsFieldPaths.SECTION_AREA,
                )}
                name={`${field}.section_area`}
                unit="m²"
                overrideValues={{
                  label: LeasePlanUnitsFieldTitles.SECTION_AREA,
                }}
                enableUiDataEdit
                tooltipStyle={{
                  right: 22,
                }}
                uiDataKey={getUiDataLeaseKey(
                  LeasePlanUnitsFieldPaths.SECTION_AREA,
                )}
              />
            </Authorization>
          </Column>
        </Row>
        <Row>
          <Column small={12} medium={6} large={3}>
            <Authorization
              allow={isFieldAllowedToRead(
                attributes,
                LeasePlanUnitsFieldPaths.DETAILED_PLAN_IDENTIFIER,
              )}
            >
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(
                  attributes,
                  LeasePlanUnitsFieldPaths.DETAILED_PLAN_IDENTIFIER,
                )}
                name={`${field}.detailed_plan_identifier`}
                overrideValues={{
                  label: LeasePlanUnitsFieldTitles.DETAILED_PLAN_IDENTIFIER,
                }}
                enableUiDataEdit
                uiDataKey={getUiDataLeaseKey(
                  LeasePlanUnitsFieldPaths.DETAILED_PLAN_IDENTIFIER,
                )}
              />
            </Authorization>
          </Column>
          <Column small={12} medium={6} large={3}>
            <Authorization
              allow={isFieldAllowedToRead(
                attributes,
                LeasePlanUnitsFieldPaths.DETAILED_PLAN_LATEST_PROCESSING_DATE,
              )}
            >
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(
                  attributes,
                  LeasePlanUnitsFieldPaths.DETAILED_PLAN_LATEST_PROCESSING_DATE,
                )}
                name={`${field}.detailed_plan_latest_processing_date`}
                overrideValues={{
                  label:
                    LeasePlanUnitsFieldTitles.DETAILED_PLAN_LATEST_PROCESSING_DATE,
                }}
                enableUiDataEdit
                uiDataKey={getUiDataLeaseKey(
                  LeasePlanUnitsFieldPaths.DETAILED_PLAN_LATEST_PROCESSING_DATE,
                )}
              />
            </Authorization>
          </Column>
        </Row>
        <Row>
          <Column>
            <Authorization
              allow={isFieldAllowedToRead(
                attributes,
                LeasePlanUnitsFieldPaths.DETAILED_PLAN_LATEST_PROCESSING_DATE_NOTE,
              )}
            >
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(
                  attributes,
                  LeasePlanUnitsFieldPaths.DETAILED_PLAN_LATEST_PROCESSING_DATE_NOTE,
                )}
                name={`${field}.detailed_plan_latest_processing_date_note`}
                overrideValues={{
                  label:
                    LeasePlanUnitsFieldTitles.DETAILED_PLAN_LATEST_PROCESSING_DATE_NOTE,
                }}
                enableUiDataEdit
                uiDataKey={getUiDataLeaseKey(
                  LeasePlanUnitsFieldPaths.DETAILED_PLAN_LATEST_PROCESSING_DATE_NOTE,
                )}
              />
            </Authorization>
          </Column>
        </Row>
        <Row>
          <Column small={12} medium={6} large={3}>
            <Authorization
              allow={isFieldAllowedToRead(
                attributes,
                LeasePlanUnitsFieldPaths.PLOT_DIVISION_IDENTIFIER,
              )}
            >
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(
                  attributes,
                  LeasePlanUnitsFieldPaths.PLOT_DIVISION_IDENTIFIER,
                )}
                name={`${field}.plot_division_identifier`}
                overrideValues={{
                  label: LeasePlanUnitsFieldTitles.PLOT_DIVISION_IDENTIFIER,
                }}
                enableUiDataEdit
                uiDataKey={getUiDataLeaseKey(
                  LeasePlanUnitsFieldPaths.PLOT_DIVISION_IDENTIFIER,
                )}
              />
            </Authorization>
          </Column>
          <Column small={12} medium={6} large={3}>
            <Authorization
              allow={isFieldAllowedToRead(
                attributes,
                LeasePlanUnitsFieldPaths.PLOT_DIVISION_STATE,
              )}
            >
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(
                  attributes,
                  LeasePlanUnitsFieldPaths.PLOT_DIVISION_STATE,
                )}
                name={`${field}.plot_division_state`}
                overrideValues={{
                  label: LeasePlanUnitsFieldTitles.PLOT_DIVISION_STATE,
                }}
                enableUiDataEdit
                uiDataKey={getUiDataLeaseKey(
                  LeasePlanUnitsFieldPaths.PLOT_DIVISION_STATE,
                )}
              />
            </Authorization>
          </Column>
          <Column small={12} medium={6} large={3}>
            <Authorization
              allow={isFieldAllowedToRead(
                attributes,
                LeasePlanUnitsFieldPaths.PLOT_DIVISION_EFFECTIVE_DATE,
              )}
            >
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(
                  attributes,
                  LeasePlanUnitsFieldPaths.PLOT_DIVISION_EFFECTIVE_DATE,
                )}
                name={`${field}.plot_division_effective_date`}
                overrideValues={{
                  label: LeasePlanUnitsFieldTitles.PLOT_DIVISION_EFFECTIVE_DATE,
                }}
                enableUiDataEdit
                uiDataKey={getUiDataLeaseKey(
                  LeasePlanUnitsFieldPaths.PLOT_DIVISION_EFFECTIVE_DATE,
                )}
              />
            </Authorization>
          </Column>
        </Row>
        <Row>
          <Column small={12} medium={6} large={3}>
            <Authorization
              allow={isFieldAllowedToRead(
                attributes,
                LeasePlanUnitsFieldPaths.PLAN_UNIT_TYPE,
              )}
            >
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(
                  attributes,
                  LeasePlanUnitsFieldPaths.PLAN_UNIT_TYPE,
                )}
                name={`${field}.plan_unit_type`}
                overrideValues={{
                  label: LeasePlanUnitsFieldTitles.PLAN_UNIT_TYPE,
                }}
                enableUiDataEdit
                uiDataKey={getUiDataLeaseKey(
                  LeasePlanUnitsFieldPaths.PLAN_UNIT_TYPE,
                )}
              />
            </Authorization>
          </Column>
          <Column small={12} medium={6} large={3}>
            <Authorization
              allow={isFieldAllowedToRead(
                attributes,
                LeasePlanUnitsFieldPaths.PLAN_UNIT_STATE,
              )}
            >
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(
                  attributes,
                  LeasePlanUnitsFieldPaths.PLAN_UNIT_STATE,
                )}
                name={`${field}.plan_unit_state`}
                overrideValues={{
                  label: LeasePlanUnitsFieldTitles.PLAN_UNIT_STATE,
                }}
                enableUiDataEdit
                uiDataKey={getUiDataLeaseKey(
                  LeasePlanUnitsFieldPaths.PLAN_UNIT_STATE,
                )}
              />
            </Authorization>
          </Column>
          <Column small={12} medium={6} large={3}>
            <Authorization
              allow={isFieldAllowedToRead(
                attributes,
                LeasePlanUnitsFieldPaths.PLAN_UNIT_INTENDED_USE,
              )}
            >
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(
                  attributes,
                  LeasePlanUnitsFieldPaths.PLAN_UNIT_INTENDED_USE,
                )}
                name={`${field}.plan_unit_intended_use`}
                overrideValues={{
                  label: LeasePlanUnitsFieldTitles.PLAN_UNIT_INTENDED_USE,
                }}
                enableUiDataEdit
                uiDataKey={getUiDataLeaseKey(
                  LeasePlanUnitsFieldPaths.PLAN_UNIT_INTENDED_USE,
                )}
              />
            </Authorization>
          </Column>
        </Row>
      </BoxContentWrapper>
    </BoxItem>
  );
};

export default PlanUnitItemEdit;
