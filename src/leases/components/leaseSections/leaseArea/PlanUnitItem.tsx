import React from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { Row, Column } from "react-foundation";
import isEmpty from "lodash/isEmpty";
import Authorization from "@/components/authorization/Authorization";
import BoxItem from "@/components/content/BoxItem";
import ExternalLink from "@/components/links/ExternalLink";
import FormText from "@/components/form/FormText";
import FormTextTitle from "@/components/form/FormTextTitle";
import {
  LeasePlanUnitsFieldPaths,
  LeasePlanUnitsFieldTitles,
  LeaseAreaUsageDistributionFieldPaths,
  LeaseAreaUsageDistributionFieldTitles,
} from "@/leases/enums";
import { getUiDataLeaseKey } from "@/uiData/helpers";
import {
  formatDate,
  formatNumber,
  getFieldOptions,
  getLabelOfOption,
  getSearchQuery,
  getUrlParams,
  isEmptyValue,
  isFieldAllowedToRead,
} from "@/util/helpers";
import { getAttributes } from "@/leases/selectors";
import {
  createPTPPlanReportUrl,
  createPTPPlotDivisionUrl,
} from "@/util/helpers";
import type { Attributes } from "types";
import SubTitle from "@/components/content/SubTitle";
type OwnProps = {
  areaArchived: boolean;
  planUnit: Record<string, any>;
};

const PlanUnitItem: React.FC<OwnProps> = ({ areaArchived, planUnit }) => {
  const location = useLocation();
  const attributes: Attributes = useSelector(getAttributes);

  const getMapLinkUrl = () => {
    const { pathname, search } = location;
    const searchQuery = getUrlParams(search);
    delete searchQuery.lease_area;
    delete searchQuery.plot;
    ((searchQuery.plan_unit = planUnit.id), (searchQuery.tab = 7));
    return `${pathname}${getSearchQuery(searchQuery)}`;
  };

  const mapLinkUrl = getMapLinkUrl();
  const plotDivisionStateOptions = getFieldOptions(
    attributes,
    LeasePlanUnitsFieldPaths.PLOT_DIVISION_STATE,
  );
  const planUnitTypeOptions = getFieldOptions(
    attributes,
    LeasePlanUnitsFieldPaths.PLAN_UNIT_TYPE,
  );
  const planUnitStateOptions = getFieldOptions(
    attributes,
    LeasePlanUnitsFieldPaths.PLAN_UNIT_STATE,
  );
  const planUnitIntendedUseOptions = getFieldOptions(
    attributes,
    LeasePlanUnitsFieldPaths.PLAN_UNIT_INTENDED_USE,
  );
  return (
    <BoxItem className="no-border-on-first-child no-border-on-last-child">
      <Row>
        <Column small={12} medium={8} large={8}>
          <Authorization
            allow={isFieldAllowedToRead(
              attributes,
              LeasePlanUnitsFieldPaths.IDENTIFIER,
            )}
          >
            <>
              <FormTextTitle
                uiDataKey={getUiDataLeaseKey(
                  LeasePlanUnitsFieldPaths.IDENTIFIER,
                )}
              >
                <span>{LeasePlanUnitsFieldTitles.IDENTIFIER}</span>
              </FormTextTitle>
              <FormText>{planUnit.identifier || "-"}</FormText>
            </>
          </Authorization>
        </Column>
        <Column small={12} medium={2} large={2}>
          <Authorization
            allow={isFieldAllowedToRead(
              attributes,
              LeasePlanUnitsFieldPaths.IS_MASTER,
            )}
          >
            <>
              <FormTextTitle
                uiDataKey={getUiDataLeaseKey(
                  LeasePlanUnitsFieldPaths.IS_MASTER,
                )}
              >
                <span>{LeasePlanUnitsFieldTitles.IS_MASTER}</span>
              </FormTextTitle>
              <FormText>{planUnit.is_master ? "Kyllä" : "Ei"}</FormText>
            </>
          </Authorization>
        </Column>
        <Column small={12} medium={3} large={3}>
          <Authorization
            allow={isFieldAllowedToRead(
              attributes,
              LeasePlanUnitsFieldPaths.GEOMETRY,
            )}
          >
            <span>
              {!areaArchived && !isEmpty(planUnit.geometry) && (
                <Link to={mapLinkUrl}>
                  {LeasePlanUnitsFieldTitles.GEOMETRY}
                </Link>
              )}
            </span>
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
            <>
              <FormTextTitle
                uiDataKey={getUiDataLeaseKey(LeasePlanUnitsFieldPaths.AREA)}
              >
                {LeasePlanUnitsFieldTitles.AREA}
              </FormTextTitle>
              <FormText>
                {!isEmptyValue(planUnit.area)
                  ? `${formatNumber(planUnit.area)} m²`
                  : "-"}
              </FormText>
            </>
          </Authorization>
        </Column>
        <Column small={12} medium={6} large={3}>
          <Authorization
            allow={isFieldAllowedToRead(
              attributes,
              LeasePlanUnitsFieldPaths.SECTION_AREA,
            )}
          >
            <>
              <FormTextTitle
                uiDataKey={getUiDataLeaseKey(
                  LeasePlanUnitsFieldPaths.SECTION_AREA,
                )}
              >
                {LeasePlanUnitsFieldTitles.SECTION_AREA}
              </FormTextTitle>
              <FormText>
                {!isEmptyValue(planUnit.section_area)
                  ? `${formatNumber(planUnit.section_area)} m²`
                  : "-"}
              </FormText>
            </>
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
            <>
              <FormTextTitle
                uiDataKey={getUiDataLeaseKey(
                  LeasePlanUnitsFieldPaths.DETAILED_PLAN_IDENTIFIER,
                )}
              >
                {LeasePlanUnitsFieldTitles.DETAILED_PLAN_IDENTIFIER}
              </FormTextTitle>
              <span>
                {planUnit.detailed_plan_identifier ? (
                  <ExternalLink
                    href={createPTPPlanReportUrl(
                      planUnit.detailed_plan_identifier,
                    )}
                    text={planUnit.detailed_plan_identifier}
                  />
                ) : (
                  <FormText>-</FormText>
                )}
              </span>
            </>
          </Authorization>
        </Column>
        <Column small={12} medium={6} large={3}>
          <Authorization
            allow={isFieldAllowedToRead(
              attributes,
              LeasePlanUnitsFieldPaths.DETAILED_PLAN_LATEST_PROCESSING_DATE,
            )}
          >
            <>
              <FormTextTitle
                uiDataKey={getUiDataLeaseKey(
                  LeasePlanUnitsFieldPaths.DETAILED_PLAN_LATEST_PROCESSING_DATE,
                )}
              >
                {LeasePlanUnitsFieldTitles.DETAILED_PLAN_LATEST_PROCESSING_DATE}
              </FormTextTitle>
              <FormText>
                {formatDate(planUnit.detailed_plan_latest_processing_date) ||
                  "-"}
              </FormText>
            </>
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
            <>
              <FormTextTitle
                uiDataKey={getUiDataLeaseKey(
                  LeasePlanUnitsFieldPaths.DETAILED_PLAN_LATEST_PROCESSING_DATE_NOTE,
                )}
              >
                {
                  LeasePlanUnitsFieldTitles.DETAILED_PLAN_LATEST_PROCESSING_DATE_NOTE
                }
              </FormTextTitle>
              <FormText>
                {planUnit.detailed_plan_latest_processing_date_note || "-"}
              </FormText>
            </>
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
            <>
              <FormTextTitle
                uiDataKey={getUiDataLeaseKey(
                  LeasePlanUnitsFieldPaths.PLOT_DIVISION_IDENTIFIER,
                )}
              >
                {LeasePlanUnitsFieldTitles.PLOT_DIVISION_IDENTIFIER}
              </FormTextTitle>
              <span>
                {planUnit.plot_division_identifier ? (
                  <ExternalLink
                    href={createPTPPlotDivisionUrl(
                      planUnit.plot_division_identifier,
                    )}
                    text={planUnit.plot_division_identifier}
                  />
                ) : (
                  <FormText>-</FormText>
                )}
              </span>
            </>
          </Authorization>
        </Column>
        <Column small={12} medium={6} large={3}>
          <Authorization
            allow={isFieldAllowedToRead(
              attributes,
              LeasePlanUnitsFieldPaths.PLOT_DIVISION_STATE,
            )}
          >
            <>
              <FormTextTitle
                uiDataKey={getUiDataLeaseKey(
                  LeasePlanUnitsFieldPaths.PLOT_DIVISION_STATE,
                )}
              >
                {LeasePlanUnitsFieldTitles.PLOT_DIVISION_STATE}
              </FormTextTitle>
              <FormText>
                {getLabelOfOption(
                  plotDivisionStateOptions,
                  planUnit.plot_division_state,
                ) || "-"}
              </FormText>
            </>
          </Authorization>
        </Column>
        <Column small={12} medium={12} large={6}>
          <Authorization
            allow={isFieldAllowedToRead(
              attributes,
              LeasePlanUnitsFieldPaths.PLOT_DIVISION_EFFECTIVE_DATE,
            )}
          >
            <>
              <FormTextTitle
                uiDataKey={getUiDataLeaseKey(
                  LeasePlanUnitsFieldPaths.PLOT_DIVISION_EFFECTIVE_DATE,
                )}
              >
                {LeasePlanUnitsFieldTitles.PLOT_DIVISION_EFFECTIVE_DATE}
              </FormTextTitle>
              <FormText>
                {formatDate(planUnit.plot_division_effective_date) || "-"}
              </FormText>
            </>
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
            <>
              <FormTextTitle
                uiDataKey={getUiDataLeaseKey(
                  LeasePlanUnitsFieldPaths.PLAN_UNIT_TYPE,
                )}
              >
                {LeasePlanUnitsFieldTitles.PLAN_UNIT_TYPE}
              </FormTextTitle>
              <FormText>
                {getLabelOfOption(
                  planUnitTypeOptions,
                  planUnit.plan_unit_type,
                ) || "-"}
              </FormText>
            </>
          </Authorization>
        </Column>
        <Column small={12} medium={6} large={3}>
          <Authorization
            allow={isFieldAllowedToRead(
              attributes,
              LeasePlanUnitsFieldPaths.PLAN_UNIT_STATE,
            )}
          >
            <>
              <FormTextTitle
                uiDataKey={getUiDataLeaseKey(
                  LeasePlanUnitsFieldPaths.PLAN_UNIT_STATE,
                )}
              >
                {LeasePlanUnitsFieldTitles.PLAN_UNIT_STATE}
              </FormTextTitle>
              <FormText>
                {getLabelOfOption(
                  planUnitStateOptions,
                  planUnit.plan_unit_state,
                ) || "-"}
              </FormText>
            </>
          </Authorization>
        </Column>
        <Column small={12} medium={12} large={6}>
          <Authorization
            allow={isFieldAllowedToRead(
              attributes,
              LeasePlanUnitsFieldPaths.PLAN_UNIT_INTENDED_USE,
            )}
          >
            <>
              <FormTextTitle
                uiDataKey={getUiDataLeaseKey(
                  LeasePlanUnitsFieldPaths.PLAN_UNIT_INTENDED_USE,
                )}
              >
                {LeasePlanUnitsFieldTitles.PLAN_UNIT_INTENDED_USE}
              </FormTextTitle>
              <FormText>
                {getLabelOfOption(
                  planUnitIntendedUseOptions,
                  planUnit.plan_unit_intended_use,
                ) || "-"}
              </FormText>
            </>
          </Authorization>
        </Column>
      </Row>

      {/* Usage distributions (Käyttöjakaumat) */}
      <span>
        {planUnit.usage_distributions.length > 0 && (
          <>
            <SubTitle>{LeasePlanUnitsFieldTitles.USAGE_DISTRIBUTIONS}</SubTitle>
            <Row>
              <Column small={4} medium={4} large={4}>
                <FormTextTitle
                  uiDataKey={getUiDataLeaseKey(
                    LeaseAreaUsageDistributionFieldPaths.DISTRIBUTION,
                  )}
                >
                  {LeaseAreaUsageDistributionFieldTitles.DISTRIBUTION}
                </FormTextTitle>
              </Column>
              <Column small={4} medium={4} large={4}>
                <FormTextTitle
                  uiDataKey={getUiDataLeaseKey(
                    LeaseAreaUsageDistributionFieldPaths.BUILD_PERMISSION,
                  )}
                >
                  {LeaseAreaUsageDistributionFieldTitles.BUILD_PERMISSION}
                </FormTextTitle>
              </Column>
              <Column small={4} medium={4} large={4}>
                <FormTextTitle
                  uiDataKey={getUiDataLeaseKey(
                    LeaseAreaUsageDistributionFieldPaths.NOTE,
                  )}
                >
                  {LeaseAreaUsageDistributionFieldTitles.NOTE}
                </FormTextTitle>
              </Column>
            </Row>
            {planUnit.usage_distributions.map((usage_distribution) => (
              <Row key={usage_distribution.distribution}>
                <Column small={4} medium={4} large={4}>
                  <Authorization
                    allow={isFieldAllowedToRead(
                      attributes,
                      LeaseAreaUsageDistributionFieldPaths.DISTRIBUTION,
                    )}
                  >
                    <FormText>
                      {usage_distribution.distribution || "-"}
                    </FormText>
                  </Authorization>
                </Column>
                <Column small={4} medium={4} large={4}>
                  <Authorization
                    allow={isFieldAllowedToRead(
                      attributes,
                      LeaseAreaUsageDistributionFieldPaths.BUILD_PERMISSION,
                    )}
                  >
                    <FormText>
                      {!isEmptyValue(usage_distribution.build_permission)
                        ? `${formatNumber(usage_distribution.build_permission)} k-m²`
                        : "-"}
                    </FormText>
                  </Authorization>
                </Column>
                <Column small={4} medium={4} large={4}>
                  <Authorization
                    allow={isFieldAllowedToRead(
                      attributes,
                      LeaseAreaUsageDistributionFieldPaths.NOTE,
                    )}
                  >
                    <FormText>{usage_distribution.note || "-"}</FormText>
                  </Authorization>
                </Column>
              </Row>
            ))}
          </>
        )}
      </span>
    </BoxItem>
  );
};

export default PlanUnitItem;
