import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Column } from "react-foundation";
import { Link, useLocation } from "react-router-dom";
import { formValueSelector, change, reduxForm } from "redux-form";
import isEmpty from "lodash/isEmpty";
import ActionButtonWrapper from "@/components/form/ActionButtonWrapper";
import Authorization from "@/components/authorization/Authorization";
import BoxContentWrapper from "@/components/content/BoxContentWrapper";
import BoxItem from "@/components/content/BoxItem";
import FormFieldLegacy from "@/components/form/FormFieldLegacy";
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

type Props = {
  field: string;
  geometry: Record<string, any> | null | undefined;
  id: number;
  onRemove: (...args: Array<any>) => any;
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

const PlanUnitItemEdit: React.FC<Props> = ({
  field,
  onRemove,
  change,
}: Props) => {
  const dispatch = useDispatch();

  const attributes: Attributes = useSelector(getAttributes);
  const isSaveClicked = useSelector(getIsSaveClicked);
  const usersPermissions: UsersPermissionsType =
    useSelector(getUsersPermissions);
  const location = useLocation();

  const geometry = useSelector((state) => selector(state, `${field}.geometry`));
  const id = useSelector((state) => selector(state, `${field}.id`));
  const identifier = useSelector((state) =>
    selector(state, `${field}.identifier`),
  );
  const area = useSelector((state) => selector(state, `${field}.area`));
  const section_area = useSelector((state) =>
    selector(state, `${field}.section_area`),
  );
  const detailed_plan_identifier = useSelector((state) =>
    selector(state, `${field}.detailed_plan_identifier`),
  );
  const detailed_plan_latest_processing_date = useSelector((state) =>
    selector(state, `${field}.detailed_plan_latest_processing_date`),
  );
  const detailed_plan_latest_processing_date_note = useSelector((state) =>
    selector(state, `${field}.detailed_plan_latest_processing_date_note`),
  );
  const plot_division_identifier = useSelector((state) =>
    selector(state, `${field}.plot_division_identifier`),
  );
  const plot_division_state = useSelector((state) =>
    selector(state, `${field}.plot_division_state`),
  );
  const plot_division_effective_date = useSelector((state) =>
    selector(state, `${field}.plot_division_effective_date`),
  );
  const plan_unit_type = useSelector((state) =>
    selector(state, `${field}.plan_unit_type`),
  );
  const plan_unit_state = useSelector((state) =>
    selector(state, `${field}.plan_unit_state`),
  );
  const plan_unit_intended_use = useSelector((state) =>
    selector(state, `${field}.plan_unit_intended_use`),
  );
  const is_master = useSelector((state) =>
    selector(state, `${field}.is_master`),
  );

  const state = {
    identifier: identifier,
    area: area,
    section_area: section_area,
    detailed_plan_identifier: detailed_plan_identifier,
    detailed_plan_latest_processing_date: detailed_plan_latest_processing_date,
    detailed_plan_latest_processing_date_note:
      detailed_plan_latest_processing_date_note,
    plot_division_identifier: plot_division_identifier,
    plot_division_state: plot_division_state,
    plot_division_effective_date: plot_division_effective_date,
    plan_unit_type: plan_unit_type,
    plan_unit_state: plan_unit_state,
    plan_unit_intended_use: plan_unit_intended_use,
    is_master: is_master,
  };

  useEffect(() => {
    if (state.is_master) return;

    if (
      state.identifier == identifier &&
      state.area == area &&
      state.section_area == section_area &&
      state.detailed_plan_identifier == detailed_plan_identifier &&
      state.detailed_plan_latest_processing_date ==
        detailed_plan_latest_processing_date &&
      state.detailed_plan_latest_processing_date_note ==
        detailed_plan_latest_processing_date_note &&
      state.plot_division_identifier == plot_division_identifier &&
      state.plot_division_state == plot_division_state &&
      state.plot_division_effective_date == plot_division_effective_date &&
      state.plan_unit_type == plan_unit_type &&
      state.plan_unit_state == plan_unit_state &&
      state.plan_unit_intended_use == plan_unit_intended_use
    ) {
      dispatch(change(`${field}.is_master`, false));
      return;
    }

    if (is_master) return;

    if (
      state.identifier != identifier ||
      state.area != area ||
      state.section_area != section_area ||
      state.detailed_plan_identifier != detailed_plan_identifier ||
      state.detailed_plan_latest_processing_date !=
        detailed_plan_latest_processing_date ||
      state.detailed_plan_latest_processing_date_note !=
        detailed_plan_latest_processing_date_note ||
      state.plot_division_identifier != plot_division_identifier ||
      state.plot_division_state != plot_division_state ||
      state.plot_division_effective_date != plot_division_effective_date ||
      state.plan_unit_type != plan_unit_type ||
      state.plan_unit_state != plan_unit_state ||
      state.plan_unit_intended_use != plan_unit_intended_use
    ) {
      dispatch(change(`${field}.is_master`, true));
      return;
    }
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
    change,
    field,
    state.is_master,
    state.identifier,
    state.area,
    state.section_area,
    state.detailed_plan_identifier,
    state.detailed_plan_latest_processing_date,
    state.detailed_plan_latest_processing_date_note,
    state.plot_division_identifier,
    state.plot_division_state,
    state.plot_division_effective_date,
    state.plan_unit_type,
    state.plan_unit_state,
    state.plan_unit_intended_use,
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
              <FormFieldLegacy
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
              <FormFieldLegacy
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
              <FormFieldLegacy
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
              <FormFieldLegacy
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
              <FormFieldLegacy
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
              <FormFieldLegacy
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
              <FormFieldLegacy
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
              <FormFieldLegacy
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
              <FormFieldLegacy
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
              <FormFieldLegacy
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
              <FormFieldLegacy
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
              <FormFieldLegacy
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
              <FormFieldLegacy
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
const selector = formValueSelector(formName);

export default reduxForm({
  form: formName,
  destroyOnUnmount: false,
  change,
})(PlanUnitItemEdit);
