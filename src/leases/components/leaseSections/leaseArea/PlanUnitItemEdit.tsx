import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Column } from "react-foundation";
import { Link, useLocation } from "react-router-dom";
import isEmpty from "lodash/isEmpty";
import ActionButtonWrapper from "@/components/form/ActionButtonWrapper";
import Authorization from "@/components/authorization/Authorization";
import BoxContentWrapper from "@/components/content/BoxContentWrapper";
import BoxItem from "@/components/content/BoxItem";
import FormField from "@/components/form/final-form/FormField";
import RemoveButton from "@/components/form/RemoveButton";
import { FormNames } from "@/enums";
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
import { FormApi } from "final-form";

type Props = {
  formApi: FormApi;
  field: string;
  onRemove: (...args: Array<any>) => any;
};

const PlanUnitItemEdit: React.FC<Props> = ({
  formApi,
  field,
  onRemove,
}: Props) => {
  const dispatch = useDispatch();

  const attributes: Attributes = useSelector(getAttributes);
  const isSaveClicked = useSelector(getIsSaveClicked);
  const usersPermissions: UsersPermissionsType =
    useSelector(getUsersPermissions);
  const location = useLocation();

  const geometry = formApi.getFieldState(`${field}.geometry`)?.value;
  const id = formApi.getFieldState(`${field}.id`)?.value;
  const identifier = formApi.getFieldState(`${field}.identifier`)?.value;
  const area = formApi.getFieldState(`${field}.area`)?.value;
  const section_area = formApi.getFieldState(`${field}.section_area`)?.value;
  const detailed_plan_identifier = formApi.getFieldState(
    `${field}.detailed_plan_identifier`,
  )?.value;
  const detailed_plan_latest_processing_date = formApi.getFieldState(
    `${field}.detailed_plan_latest_processing_date`,
  )?.value;
  const detailed_plan_latest_processing_date_note = formApi.getFieldState(
    `${field}.detailed_plan_latest_processing_date_note`,
  )?.value;
  const plot_division_identifier = formApi.getFieldState(
    `${field}.plot_division_identifier`,
  )?.value;
  const plot_division_state = formApi.getFieldState(
    `${field}.plot_division_state`,
  )?.value;
  const plot_division_effective_date = formApi.getFieldState(
    `${field}.plot_division_effective_date`,
  )?.value;
  const plan_unit_type = formApi.getFieldState(
    `${field}.plan_unit_type`,
  )?.value;
  const plan_unit_state = formApi.getFieldState(
    `${field}.plan_unit_state`,
  )?.value;
  const plan_unit_intended_use = formApi.getFieldState(
    `${field}.plan_unit_intended_use`,
  )?.value;
  const is_master = formApi.getFieldState(`${field}.is_master`)?.value;

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
  });

  useEffect(() => {
    if (is_master) return;

    const initialValues = initialValuesRef.current;

    const hasChanged =
      initialValues.identifier != identifier ||
      initialValues.area != area ||
      initialValues.section_area != section_area ||
      initialValues.detailed_plan_identifier != detailed_plan_identifier ||
      initialValues.detailed_plan_latest_processing_date !=
        detailed_plan_latest_processing_date ||
      initialValues.detailed_plan_latest_processing_date_note !=
        detailed_plan_latest_processing_date_note ||
      initialValues.plot_division_identifier != plot_division_identifier ||
      initialValues.plot_division_state != plot_division_state ||
      initialValues.plot_division_effective_date !=
        plot_division_effective_date ||
      initialValues.plan_unit_type != plan_unit_type ||
      initialValues.plan_unit_state != plan_unit_state ||
      initialValues.plan_unit_intended_use != plan_unit_intended_use;

    formApi.change(`${field}.is_master`, hasChanged);
  }, [
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
    formApi,
    field,
    dispatch,
  ]);

  const getMapLinkUrl = () => {
    const { pathname, search } = location;
    const searchQuery = getUrlParams(search);
    delete searchQuery.lease_area;
    delete searchQuery.plot;
    ((searchQuery.plan_unit = id), (searchQuery.tab = 7));
    return `${pathname}${getSearchQuery(searchQuery)}`;
  };
  const mapLinkUrl = getMapLinkUrl();

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
                <Link to={mapLinkUrl}>
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

const formName = FormNames.LEASE_AREAS;
export default PlanUnitItemEdit;
