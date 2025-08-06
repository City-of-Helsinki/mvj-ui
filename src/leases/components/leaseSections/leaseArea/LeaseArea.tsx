import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Row, Column } from "react-foundation";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import flowRight from "lodash/flowRight";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import Authorization from "@/components/authorization/Authorization";
import BoxItemContainer from "@/components/content/BoxItemContainer";
import Collapse from "@/components/collapse/Collapse";
import FormText from "@/components/form/FormText";
import FormTextTitle from "@/components/form/FormTextTitle";
import ListItem from "@/components/content/ListItem";
import ListItems from "@/components/content/ListItems";
import PlanUnitItem from "./PlanUnitItem";
import PlotItem from "./PlotItem";
import SubTitle from "@/components/content/SubTitle";
import { receiveCollapseStates } from "@/leases/actions";
import { FormNames, ViewModes } from "@/enums";
import {
  LeaseAreaAddressesFieldPaths,
  LeaseAreaAddressesFieldTitles,
  LeaseAreasFieldPaths,
  LeaseAreasFieldTitles,
  LeaseAreaCustomDetailedPlanFieldPaths,
  LeasePlanUnitsFieldPaths,
  LeasePlotsFieldPaths,
  LeaseAreaDraftFieldPaths,
  LeaseAreaDraftFieldTitles,
} from "@/leases/enums";
import { getUiDataLeaseKey } from "@/uiData/helpers";
import {
  formatNumber,
  getFieldOptions,
  getLabelOfOption,
  getSearchQuery,
  getUrlParams,
  isEmptyValue,
  isFieldAllowedToRead,
} from "@/util/helpers";
import {
  getAttributes,
  getCollapseStateByKey,
  getIsEditMode,
} from "@/leases/selectors";
import type { Attributes } from "types";
import CustomDetailedPlan from "./CustomDetailedPlan";

type Props = {
  area: Record<string, any>;
  attributes: Attributes;
  isEditMode: boolean;
  location: Record<string, any>;
  planUnitsContractCollapseState: boolean;
  planUnitsCurrentCollapseState: boolean;
  plotsContractCollapseState: boolean;
  plotsCurrentCollapseState: boolean;
  customDetailedPlanCollapseState: boolean;
  receiveCollapseStates: (...args: Array<any>) => any;
  isLeaseAreaDraft?: boolean;
};

const LeaseArea = ({
  area,
  attributes,
  isEditMode,
  location,
  planUnitsContractCollapseState,
  planUnitsCurrentCollapseState,
  plotsContractCollapseState,
  plotsCurrentCollapseState,
  customDetailedPlanCollapseState,
  receiveCollapseStates,
  isLeaseAreaDraft = false,
}: Props) => {
  const handleCollapseToggle = (key: string, val: boolean) => {
    const mode: string = isEditMode ? ViewModes.EDIT : ViewModes.READONLY;
    receiveCollapseStates({
      [mode]: {
        [formName]: {
          [area.id]: {
            [key]: val,
          },
        },
      },
    });
  };

  const handlePlanUnitContractCollapseToggle = (val: boolean) => {
    handleCollapseToggle("plan_units_contract", val);
  };

  const handlePlanUnitCurrentCollapseToggle = (val: boolean) => {
    handleCollapseToggle("plan_units_current", val);
  };

  const handlePlotsContractCollapseToggle = (val: boolean) => {
    handleCollapseToggle("plots_contract", val);
  };

  const handlePlotsCurrentCollapseToggle = (val: boolean) => {
    handleCollapseToggle("plots_current", val);
  };

  const handleCustomDetailedPlanCollapseToggle = (val: boolean) => {
    handleCollapseToggle("custom_detailed_plan", val);
  };

  const getMapLinkUrl = () => {
    const { pathname, search } = location;
    const searchQuery = getUrlParams(search);
    delete searchQuery.plan_unit;
    delete searchQuery.plot;
    searchQuery.tab = 7;
    if (isLeaseAreaDraft) {
      return `${pathname}${getSearchQuery(searchQuery)}`;
    }
    searchQuery.lease_area = area ? area.id : undefined;
    return `${pathname}${getSearchQuery(searchQuery)}`;
  };

  const locationOptions = getFieldOptions(
    attributes,
    LeaseAreasFieldPaths.LOCATION,
  );
  const typeOptions = getFieldOptions(attributes, LeaseAreasFieldPaths.TYPE);
  const addresses = get(area, "addresses", []);
  const mapLinkUrl = getMapLinkUrl();
  const archived = Boolean(area.archived_at);

  // lease_area_draft address data
  const address = get(area, "address", null);
  const postal_code = get(area, "postal_code", null);
  const city = get(area, "city", null);
  return (
    <Fragment>
      <Row>
        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={isFieldAllowedToRead(
              attributes,
              LeaseAreasFieldPaths.IDENTIFIER,
            )}
          >
            <>
              <FormTextTitle
                uiDataKey={getUiDataLeaseKey(LeaseAreasFieldPaths.IDENTIFIER)}
              >
                {LeaseAreasFieldTitles.IDENTIFIER}
              </FormTextTitle>
              <FormText>{area.identifier || "-"}</FormText>
            </>
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.TYPE)}
          >
            <>
              <FormTextTitle
                uiDataKey={getUiDataLeaseKey(LeaseAreasFieldPaths.TYPE)}
              >
                {LeaseAreasFieldTitles.TYPE}
              </FormTextTitle>
              <FormText>
                {getLabelOfOption(typeOptions, area.type) || "-"}
              </FormText>
            </>
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.AREA)}
          >
            <>
              <FormTextTitle
                uiDataKey={getUiDataLeaseKey(LeaseAreasFieldPaths.AREA)}
              >
                {LeaseAreasFieldTitles.AREA}
              </FormTextTitle>
              <FormText>
                {!isEmptyValue(area.area)
                  ? `${formatNumber(area.area)} m²`
                  : "-"}
              </FormText>
            </>
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={isFieldAllowedToRead(
              attributes,
              LeaseAreasFieldPaths.LOCATION,
            )}
          >
            <>
              <FormTextTitle
                uiDataKey={getUiDataLeaseKey(LeaseAreasFieldPaths.LOCATION)}
              >
                {LeaseAreasFieldTitles.LOCATION}
              </FormTextTitle>
              <FormText>
                {getLabelOfOption(locationOptions, area.location) || "-"}
              </FormText>
            </>
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={isFieldAllowedToRead(
              attributes,
              LeaseAreasFieldPaths.GEOMETRY,
            )}
          >
            {!archived && !isEmpty(area.geometry) && (
              <Link to={mapLinkUrl}>
                {isLeaseAreaDraft
                  ? LeaseAreasFieldTitles.GEOMETRY_DRAFT
                  : LeaseAreasFieldTitles.GEOMETRY}
              </Link>
            )}
          </Authorization>
        </Column>
      </Row>
      {isLeaseAreaDraft ? (
        <>
          <Row>
            <Column small={6} medium={4} large={2}>
              <Authorization
                allow={isFieldAllowedToRead(
                  attributes,
                  LeaseAreaDraftFieldPaths.ADDRESS,
                )}
              >
                <>
                  <FormTextTitle
                    uiDataKey={getUiDataLeaseKey(
                      LeaseAreaDraftFieldPaths.ADDRESS,
                    )}
                  >
                    {LeaseAreaDraftFieldTitles.ADDRESS}
                  </FormTextTitle>
                  <FormText>{address || "-"}</FormText>
                </>
              </Authorization>
            </Column>
            <Column small={6} medium={4} large={2}>
              <Authorization
                allow={isFieldAllowedToRead(
                  attributes,
                  LeaseAreaDraftFieldPaths.POSTAL_CODE,
                )}
              >
                <>
                  <FormTextTitle
                    uiDataKey={getUiDataLeaseKey(
                      LeaseAreaDraftFieldPaths.POSTAL_CODE,
                    )}
                  >
                    {LeaseAreaDraftFieldTitles.POSTAL_CODE}
                  </FormTextTitle>
                  <FormText>{postal_code || "-"}</FormText>
                </>
              </Authorization>
            </Column>
            <Column small={6} medium={4} large={2}>
              <Authorization
                allow={isFieldAllowedToRead(
                  attributes,
                  LeaseAreaDraftFieldPaths.CITY,
                )}
              >
                <>
                  <FormTextTitle
                    uiDataKey={getUiDataLeaseKey(LeaseAreaDraftFieldPaths.CITY)}
                  >
                    {LeaseAreaDraftFieldTitles.CITY}
                  </FormTextTitle>
                  <FormText>{city || "-"}</FormText>
                </>
              </Authorization>
            </Column>
          </Row>
        </>
      ) : (
        <Authorization
          allow={isFieldAllowedToRead(
            attributes,
            LeaseAreaAddressesFieldPaths.ADDRESSES,
          )}
        >
          <>
            <SubTitle
              uiDataKey={getUiDataLeaseKey(
                LeaseAreaAddressesFieldPaths.ADDRESSES,
              )}
            >
              {LeaseAreaAddressesFieldTitles.ADDRESSES}
            </SubTitle>
            {!addresses ||
              (!addresses.length && <FormText>Ei osoitteita</FormText>)}
            {!!addresses.length && (
              <Fragment>
                <Row>
                  <Column small={3} large={4}>
                    <Authorization
                      allow={isFieldAllowedToRead(
                        attributes,
                        LeaseAreaAddressesFieldPaths.ADDRESS,
                      )}
                    >
                      <FormTextTitle
                        uiDataKey={getUiDataLeaseKey(
                          LeaseAreaAddressesFieldPaths.ADDRESS,
                        )}
                      >
                        {LeaseAreaAddressesFieldTitles.ADDRESS}
                      </FormTextTitle>
                    </Authorization>
                  </Column>
                  <Column small={3} large={2}>
                    <Authorization
                      allow={isFieldAllowedToRead(
                        attributes,
                        LeaseAreaAddressesFieldPaths.POSTAL_CODE,
                      )}
                    >
                      <FormTextTitle
                        uiDataKey={getUiDataLeaseKey(
                          LeaseAreaAddressesFieldPaths.POSTAL_CODE,
                        )}
                      >
                        {LeaseAreaAddressesFieldTitles.POSTAL_CODE}
                      </FormTextTitle>
                    </Authorization>
                  </Column>
                  <Column small={3} large={2}>
                    <Authorization
                      allow={isFieldAllowedToRead(
                        attributes,
                        LeaseAreaAddressesFieldPaths.CITY,
                      )}
                    >
                      <FormTextTitle
                        uiDataKey={getUiDataLeaseKey(
                          LeaseAreaAddressesFieldPaths.CITY,
                        )}
                      >
                        {LeaseAreaAddressesFieldTitles.CITY}
                      </FormTextTitle>
                    </Authorization>
                  </Column>
                  <Column small={3} large={2}>
                    <Authorization
                      allow={isFieldAllowedToRead(
                        attributes,
                        LeaseAreaAddressesFieldPaths.IS_PRIMARY,
                      )}
                    >
                      <FormTextTitle
                        uiDataKey={getUiDataLeaseKey(
                          LeaseAreaAddressesFieldPaths.IS_PRIMARY,
                        )}
                      >
                        {LeaseAreaAddressesFieldTitles.IS_PRIMARY}
                      </FormTextTitle>
                    </Authorization>
                  </Column>
                </Row>
                <ListItems>
                  {addresses.map((address) => {
                    return (
                      <Row key={address.id}>
                        <Column small={3} large={4}>
                          <Authorization
                            allow={isFieldAllowedToRead(
                              attributes,
                              LeaseAreaAddressesFieldPaths.ADDRESS,
                            )}
                          >
                            <ListItem>{address.address || "-"}</ListItem>
                          </Authorization>
                        </Column>
                        <Column small={3} large={2}>
                          <Authorization
                            allow={isFieldAllowedToRead(
                              attributes,
                              LeaseAreaAddressesFieldPaths.POSTAL_CODE,
                            )}
                          >
                            <ListItem>{address.postal_code || "-"}</ListItem>
                          </Authorization>
                        </Column>
                        <Column small={3} large={2}>
                          <Authorization
                            allow={isFieldAllowedToRead(
                              attributes,
                              LeaseAreaAddressesFieldPaths.CITY,
                            )}
                          >
                            <ListItem>{address.city || "-"}</ListItem>
                          </Authorization>
                        </Column>
                        <Column small={3} large={2}>
                          <Authorization
                            allow={isFieldAllowedToRead(
                              attributes,
                              LeaseAreaAddressesFieldPaths.IS_PRIMARY,
                            )}
                          >
                            <ListItem>
                              {address.is_primary ? "Kyllä" : "Ei"}
                            </ListItem>
                          </Authorization>
                        </Column>
                      </Row>
                    );
                  })}
                </ListItems>
              </Fragment>
            )}
          </>
        </Authorization>
      )}

      {!isLeaseAreaDraft && (
        <>
          <Authorization
            allow={isFieldAllowedToRead(attributes, LeasePlotsFieldPaths.PLOTS)}
          >
            <Row>
              <Column small={12} large={6}>
                <Collapse
                  className="collapse__secondary"
                  defaultOpen={
                    plotsContractCollapseState !== undefined
                      ? plotsContractCollapseState
                      : !archived
                  }
                  headerTitle="Kiinteistöt / määräalat sopimuksessa"
                  onToggle={handlePlotsContractCollapseToggle}
                  uiDataKey={getUiDataLeaseKey(
                    LeasePlotsFieldPaths.PLOTS_CONTRACT,
                  )}
                >
                  <BoxItemContainer>
                    {!area.plots_contract ||
                      (!area.plots_contract.length && (
                        <FormText>
                          Ei kiinteistöjä/määräaloja sopimuksessa
                        </FormText>
                      ))}
                    {area.plots_contract &&
                      !!area.plots_contract.length &&
                      area.plots_contract.map((item, index) => (
                        <PlotItem
                          key={index}
                          areaArchived={archived}
                          plot={item}
                        />
                      ))}
                  </BoxItemContainer>
                </Collapse>
              </Column>
              <Column small={12} large={6}>
                <Collapse
                  className="collapse__secondary"
                  defaultOpen={
                    plotsCurrentCollapseState !== undefined
                      ? plotsCurrentCollapseState
                      : !archived
                  }
                  headerTitle="Kiinteistöt / määräalat nykyhetkellä"
                  onToggle={handlePlotsCurrentCollapseToggle}
                  uiDataKey={getUiDataLeaseKey(LeasePlotsFieldPaths.PLOTS)}
                >
                  <BoxItemContainer>
                    {!area.plots_current ||
                      (!area.plots_current.length && (
                        <FormText>
                          Ei kiinteistöjä/määräaloja nykyhetkellä
                        </FormText>
                      ))}

                    {area.plots_current &&
                      !!area.plots_current.length &&
                      area.plots_current.map((item, index) => (
                        <PlotItem
                          key={index}
                          areaArchived={archived}
                          plot={item}
                        />
                      ))}
                  </BoxItemContainer>
                </Collapse>
              </Column>
            </Row>
          </Authorization>
          <Authorization
            allow={isFieldAllowedToRead(
              attributes,
              LeasePlanUnitsFieldPaths.PLAN_UNITS,
            )}
          >
            <Row>
              <Column small={12} large={6}>
                <Collapse
                  className="collapse__secondary"
                  defaultOpen={
                    planUnitsContractCollapseState !== undefined
                      ? planUnitsContractCollapseState
                      : !archived
                  }
                  headerTitle="Kaavayksiköt sopimuksessa"
                  onToggle={handlePlanUnitContractCollapseToggle}
                  uiDataKey={getUiDataLeaseKey(
                    LeasePlanUnitsFieldPaths.PLAN_UNITS_CONTRACT,
                  )}
                >
                  <BoxItemContainer>
                    {!area.plan_units_contract ||
                      (!area.plan_units_contract.length && (
                        <FormText>Ei kaavayksiköitä sopimuksessa</FormText>
                      ))}
                    {area.plan_units_contract &&
                      !!area.plan_units_contract.length &&
                      area.plan_units_contract.map((item, index) => (
                        <PlanUnitItem
                          key={index}
                          areaArchived={archived}
                          planUnit={item}
                        />
                      ))}
                  </BoxItemContainer>
                </Collapse>
              </Column>
              <Column small={12} large={6}>
                <Collapse
                  className="collapse__secondary"
                  defaultOpen={
                    planUnitsCurrentCollapseState !== undefined
                      ? planUnitsCurrentCollapseState
                      : !archived
                  }
                  headerTitle="Kaavayksiköt nykyhetkellä"
                  onToggle={handlePlanUnitCurrentCollapseToggle}
                  uiDataKey={getUiDataLeaseKey(
                    LeasePlanUnitsFieldPaths.PLAN_UNITS,
                  )}
                >
                  <BoxItemContainer>
                    {!area.plan_units_current ||
                      (!area.plan_units_current.length && (
                        <FormText>Ei kaavayksiköitä nykyhetkellä</FormText>
                      ))}
                    {area.plan_units_current &&
                      !!area.plan_units_current.length &&
                      area.plan_units_current.map((item, index) => (
                        <PlanUnitItem
                          key={index}
                          areaArchived={archived}
                          planUnit={item}
                        />
                      ))}
                  </BoxItemContainer>
                </Collapse>
              </Column>
              <Column small={0} large={6} /> {/* Force next column to right */}
              <Column small={12} large={6}>
                <Collapse
                  className="collapse__secondary"
                  defaultOpen={
                    planUnitsCurrentCollapseState !== undefined
                      ? planUnitsCurrentCollapseState
                      : !archived
                  }
                  headerTitle="Vireillä olevat kaavayksiköt"
                  onToggle={handlePlanUnitCurrentCollapseToggle}
                  uiDataKey={getUiDataLeaseKey(
                    LeasePlanUnitsFieldPaths.PLAN_UNITS,
                  )}
                >
                  <BoxItemContainer>
                    {!area.plan_units_pending ||
                      (!area.plan_units_pending.length && (
                        <FormText>Ei vireillä olevia kaavayksiköitä</FormText>
                      ))}
                    {area.plan_units_pending &&
                      !!area.plan_units_pending.length &&
                      area.plan_units_pending.map((item, index) => (
                        <PlanUnitItem
                          key={index}
                          areaArchived={archived}
                          planUnit={item}
                        />
                      ))}
                  </BoxItemContainer>
                </Collapse>
              </Column>
            </Row>
          </Authorization>
          {/* Custom detailed plan (Oma muu alue) */}
          <Authorization
            allow={isFieldAllowedToRead(
              attributes,
              LeaseAreaCustomDetailedPlanFieldPaths.CUSTOM_DETAILED_PLAN,
            )}
          >
            <Row>
              <Column small={12} large={6} /> {/* Force next column to right */}
              <Column small={12} large={6}>
                <Collapse
                  className="collapse__secondary"
                  defaultOpen={
                    customDetailedPlanCollapseState !== undefined
                      ? customDetailedPlanCollapseState
                      : !archived
                  }
                  headerTitle="Oma muu alue"
                  onToggle={handleCustomDetailedPlanCollapseToggle}
                  uiDataKey={getUiDataLeaseKey(
                    LeaseAreaCustomDetailedPlanFieldPaths.CUSTOM_DETAILED_PLAN,
                  )}
                >
                  <BoxItemContainer>
                    {!area.custom_detailed_plan ? (
                      <FormText>Ei omaa muuta aluetta</FormText>
                    ) : (
                      <CustomDetailedPlan
                        customDetailedPlan={area.custom_detailed_plan}
                      />
                    )}
                  </BoxItemContainer>
                </Collapse>
              </Column>
            </Row>
          </Authorization>
        </>
      )}
    </Fragment>
  );
};

const formName = FormNames.LEASE_AREAS;
export default flowRight(
  withRouter,
  connect(
    (state, props) => {
      const id = get(props, "area.id");
      const isEditMode = getIsEditMode(state);
      return {
        attributes: getAttributes(state),
        isEditMode: isEditMode,
        planUnitsContractCollapseState: getCollapseStateByKey(
          state,
          `${isEditMode ? ViewModes.EDIT : ViewModes.READONLY}.${formName}.${id}.plan_units_contract`,
        ),
        planUnitsCurrentCollapseState: getCollapseStateByKey(
          state,
          `${isEditMode ? ViewModes.EDIT : ViewModes.READONLY}.${formName}.${id}.plan_units_current`,
        ),
        plotsContractCollapseState: getCollapseStateByKey(
          state,
          `${isEditMode ? ViewModes.EDIT : ViewModes.READONLY}.${formName}.${id}.plots_contract`,
        ),
        plotsCurrentCollapseState: getCollapseStateByKey(
          state,
          `${isEditMode ? ViewModes.EDIT : ViewModes.READONLY}.${formName}.${id}.plots_current`,
        ),
        customDetailedPlanCollapseState: getCollapseStateByKey(
          state,
          `${isEditMode ? ViewModes.EDIT : ViewModes.READONLY}.${formName}.${id}.custom_detailed_plan`,
        ),
      };
    },
    {
      receiveCollapseStates,
    },
  ),
)(LeaseArea) as React.ComponentType<any>;
