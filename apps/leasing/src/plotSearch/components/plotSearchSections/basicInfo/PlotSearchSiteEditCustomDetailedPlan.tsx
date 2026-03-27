import React, { Component } from "react";
import { Row, Column } from "react-foundation";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import Collapse from "@/components/collapse/Collapse";
import FormFieldLegacy from "@/components/form/FormFieldLegacy";
import FormText from "@/components/form/FormText";
import FormTextTitle from "@/components/form/FormTextTitle";
import LoaderWrapper from "@/components/loader/LoaderWrapper";
import ExternalLink from "@/components/links/ExternalLink";
import Loader from "@/components/loader/Loader";
import PlanUnitSelectInput from "@/components/inputs/PlanUnitSelectInput";
import { createPTPPlanReportUrl } from "@/util/helpers";
import { PlotSearchFieldTitles } from "@/plotSearch/enums";
import { formatDate, getFieldOptions, getLabelOfOption } from "@/util/helpers";
import { getInfoLinkLanguageDisplayText } from "@/plotSearch/helpers";
import type { Attributes } from "types";
type Props = {
  handleNew: (...args: Array<any>) => any;
  onRemove: (...args: Array<any>) => any;
  handleCollapseToggle: (...args: Array<any>) => any;
  attributes: Attributes;
  disabled: boolean;
  currentTarget: Record<string, any>;
  customDetailedPlanNew: Record<string, any>;
  field: string;
  isSaveClicked: boolean;
  areTargetsAllowedToHaveType: boolean;
  collapseState: boolean;
  plotSearchSiteErrors: Array<Record<string, any>>;
  isFetchingCustomDetailedPlan: boolean;
  isFetchingCustomDetailedPlanAttributes: boolean;
  customDetailedPlanAttributes: Attributes;
};
type State = {};

class PlotSearchSiteEditCustomDetailedPlan extends Component<Props, State> {
  render() {
    const {
      handleNew,
      onRemove,
      handleCollapseToggle,
      disabled,
      currentTarget,
      customDetailedPlanNew,
      field,
      isSaveClicked,
      areTargetsAllowedToHaveType,
      attributes,
      collapseState,
      plotSearchSiteErrors,
      isFetchingCustomDetailedPlan,
      isFetchingCustomDetailedPlanAttributes,
      customDetailedPlanAttributes,
    } = this.props;
    const currentCustomDetailedPlan = currentTarget;
    const title = get(currentCustomDetailedPlan, "identifier")
      ? `${get(currentCustomDetailedPlan, "identifier")} ${get(currentCustomDetailedPlan, "state.name")} - OMA MUU ALUE`
      : "-";
    const customDetailedPlanIntendedUseOptions = getFieldOptions(
      customDetailedPlanAttributes,
      "intended_use",
    );
    const customDetailedPlanStateOptions = getFieldOptions(
      customDetailedPlanAttributes,
      "state",
    );
    const customDetailedPlanTypeOptions = getFieldOptions(
      customDetailedPlanAttributes,
      "type",
    );
    const infoLinks = get(currentCustomDetailedPlan, "info_links");
    const usageDistributions = get(
      currentCustomDetailedPlan,
      "usage_distributions",
    );
    return (
      <Collapse
        className="collapse__secondary greenCollapse"
        defaultOpen={collapseState !== undefined ? collapseState : true}
        headerTitle={title}
        onRemove={!disabled ? onRemove : null}
        hasErrors={isSaveClicked && !isEmpty(plotSearchSiteErrors)}
        onToggle={handleCollapseToggle}
      >
        <Row>
          <Column small={12} medium={12} large={2}>
            <Row>
              <Column small={6} medium={6} large={12}>
                <FormTextTitle>
                  {PlotSearchFieldTitles.TARGET_IDENTIFIER}
                </FormTextTitle>
                <PlanUnitSelectInput
                  value={customDetailedPlanNew}
                  onChange={handleNew}
                  disabled={disabled}
                  name={`plan-unit`}
                />
                <div
                  style={{
                    display: "none",
                  }}
                >
                  <FormFieldLegacy
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(
                      attributes,
                      "plot_search_targets.child.children.plan_unit_id",
                    )}
                    name={`${field}.plan_unit_id`}
                  />
                  <FormFieldLegacy
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(
                      attributes,
                      "plot_search_targets.child.children.custom_detailed_plan_id",
                    )}
                    name={`${field}.custom_detailed_plan_id`}
                  />
                </div>
                {areTargetsAllowedToHaveType && (
                  <>
                    <FormTextTitle>
                      {PlotSearchFieldTitles.TARGET_TYPE}
                    </FormTextTitle>
                    <FormFieldLegacy
                      disableTouched={isSaveClicked}
                      invisibleLabel={true}
                      fieldAttributes={get(
                        attributes,
                        "plot_search_targets.child.children.target_type",
                      )}
                      name={`${field}.target_type`}
                      disabled={disabled}
                    />
                  </>
                )}
                {(isFetchingCustomDetailedPlanAttributes ||
                  isFetchingCustomDetailedPlan) && (
                  <LoaderWrapper className="relative-overlay-wrapper">
                    <Loader isLoading={true} />
                  </LoaderWrapper>
                )}
              </Column>
            </Row>
          </Column>
          <Column small={12} medium={12} large={10}>
            <Row>
              <Column small={6} medium={4} large={6}>
                <FormTextTitle>
                  {PlotSearchFieldTitles.CUSTOM_DETAILED_PLAN_INTENDED_USE}
                </FormTextTitle>
                <FormText>
                  {(currentCustomDetailedPlan &&
                    getLabelOfOption(
                      customDetailedPlanIntendedUseOptions,
                      currentCustomDetailedPlan.intended_use.id,
                    )) ||
                    "-"}
                </FormText>
              </Column>
              <Column small={6} medium={4} large={6}>
                <FormTextTitle>{PlotSearchFieldTitles.ADDRESS}</FormTextTitle>
                <FormText>
                  {get(currentCustomDetailedPlan, "address") || "-"}
                </FormText>
              </Column>
              <Column small={6} medium={4} large={3}>
                <FormTextTitle>
                  {PlotSearchFieldTitles.DETAILED_PLAN}
                </FormTextTitle>
                {get(currentCustomDetailedPlan, "detailed_plan") ? (
                  <ExternalLink
                    href={createPTPPlanReportUrl(
                      get(currentCustomDetailedPlan, "detailed_plan"),
                    )}
                    text={get(currentCustomDetailedPlan, "detailed_plan")}
                  />
                ) : (
                  <FormText>-</FormText>
                )}
              </Column>
              <Column small={6} medium={4} large={3}>
                <FormTextTitle>{PlotSearchFieldTitles.STATE}</FormTextTitle>
                <FormText>
                  {(currentCustomDetailedPlan &&
                    getLabelOfOption(
                      customDetailedPlanStateOptions,
                      currentCustomDetailedPlan.state.id,
                    )) ||
                    "-"}
                </FormText>
              </Column>
              <Column small={6} medium={4} large={6}>
                <FormTextTitle>{PlotSearchFieldTitles.AREA}</FormTextTitle>
                <FormText>
                  {get(currentCustomDetailedPlan, "area")
                    ? `${get(currentCustomDetailedPlan, "area")} m²`
                    : "-"}
                </FormText>
              </Column>
              <Column small={6} medium={4} large={6}>
                <FormTextTitle>
                  {PlotSearchFieldTitles.DETAILED_PLAN_LATEST_PROCESSING_DATE}
                </FormTextTitle>
                <FormText>
                  {formatDate(
                    get(
                      currentCustomDetailedPlan,
                      "detailed_plan_latest_processing_date",
                    ),
                  ) || "-"}
                </FormText>
              </Column>
              <Column small={6} medium={4} large={6}>
                <FormTextTitle>
                  {
                    PlotSearchFieldTitles.DETAILED_PLAN_LATEST_PROCESSING_DATE_NOTE
                  }
                </FormTextTitle>
                <FormText>
                  {get(
                    currentCustomDetailedPlan,
                    "detailed_plan_latest_processing_date_note",
                  ) || "-"}
                </FormText>
              </Column>
              <Column small={6} medium={4} large={4}>
                <FormTextTitle>
                  {PlotSearchFieldTitles.CUSTOM_DETAILED_PLAN_TYPE}
                </FormTextTitle>
                <FormText>
                  {(currentCustomDetailedPlan &&
                    getLabelOfOption(
                      customDetailedPlanTypeOptions,
                      currentCustomDetailedPlan.type.id,
                    )) ||
                    "-"}
                </FormText>
              </Column>
              <Column small={6} medium={4} large={4}>
                <FormTextTitle>
                  {PlotSearchFieldTitles.RENT_BUILD_PERMISSION}
                </FormTextTitle>
                <FormText>
                  {(get(currentCustomDetailedPlan, "rent_build_permission") &&
                    `${get(currentCustomDetailedPlan, "rent_build_permission")} k-m²`) ||
                    "-"}
                </FormText>
              </Column>
              <Column small={6} medium={4} large={4}>
                <FormTextTitle>
                  {
                    PlotSearchFieldTitles.PRECONSTRUCTION_ESTIMATED_CONSTRUCTION_READINESS_MOMENT
                  }
                </FormTextTitle>
                <FormText>
                  {get(
                    currentCustomDetailedPlan,
                    "preconstruction_estimated_construction_readiness_moment",
                  ) || "-"}
                </FormText>
              </Column>
              {infoLinks.length > 0 && (
                <Column
                  small={12}
                  medium={12}
                  large={12}
                  className="plot_search_target__info-links"
                >
                  <Row>
                    <Column small={12} medium={4} large={4}>
                      <FormTextTitle>
                        {PlotSearchFieldTitles.INFO_LINK_DESCRIPTION}
                      </FormTextTitle>
                    </Column>
                    <Column small={8} medium={6} large={6}>
                      <FormTextTitle>
                        {PlotSearchFieldTitles.INFO_LINK_URL}
                      </FormTextTitle>
                    </Column>
                    <Column small={4} medium={2} large={2}>
                      <FormTextTitle>
                        {PlotSearchFieldTitles.INFO_LINK_LANGUAGE}
                      </FormTextTitle>
                    </Column>
                  </Row>
                  {infoLinks.map((infoLink) => (
                    <Row key={infoLink.id}>
                      <Column small={12} medium={4} large={4}>
                        <FormText>{infoLink.description}</FormText>
                      </Column>
                      <Column small={8} medium={6} large={6}>
                        <FormText>
                          <ExternalLink
                            href={infoLink.url}
                            text={infoLink.url}
                          />
                        </FormText>
                      </Column>
                      <Column small={4} medium={2} large={2}>
                        <FormText>
                          {getInfoLinkLanguageDisplayText(
                            infoLink.language,
                            attributes,
                          )}
                        </FormText>
                      </Column>
                    </Row>
                  ))}
                </Column>
              )}
              {usageDistributions.length > 0 && (
                <Column
                  small={12}
                  medium={12}
                  large={12}
                  className="plot_search_target__info-links"
                >
                  <Row>
                    <Column small={12} medium={4} large={4}>
                      <FormTextTitle>
                        {PlotSearchFieldTitles.USAGE_DISTRIBUTION}
                      </FormTextTitle>
                    </Column>
                    <Column small={8} medium={6} large={6}>
                      <FormTextTitle>
                        {
                          PlotSearchFieldTitles.USAGE_DISTRIBUTION_BUILD_PERMISSION
                        }
                      </FormTextTitle>
                    </Column>
                    <Column small={4} medium={2} large={2}>
                      <FormTextTitle>
                        {PlotSearchFieldTitles.USAGE_DISTRIBUTION_NOTE}
                      </FormTextTitle>
                    </Column>
                  </Row>
                  {usageDistributions.map((usageDistribution) => (
                    <Row key={usageDistribution.distribution}>
                      <Column small={12} medium={4} large={4}>
                        <FormText>{usageDistribution.distribution}</FormText>
                      </Column>
                      <Column small={8} medium={6} large={6}>
                        <FormText>
                          {usageDistribution.build_permission
                            ? `${usageDistribution.build_permission} k-m²`
                            : "-"}
                        </FormText>
                      </Column>
                      <Column small={4} medium={2} large={2}>
                        <FormText>{usageDistribution.note}</FormText>
                      </Column>
                    </Row>
                  ))}
                </Column>
              )}
            </Row>
          </Column>
        </Row>
      </Collapse>
    );
  }
}

export default PlotSearchSiteEditCustomDetailedPlan as React.ComponentType<Props>;
