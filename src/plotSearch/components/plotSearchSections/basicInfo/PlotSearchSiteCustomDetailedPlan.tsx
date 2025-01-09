import React, { PureComponent, Fragment } from "react";
import { connect } from "react-redux";
import { Row, Column } from "react-foundation";
import get from "lodash/get";
import { receiveCollapseStates } from "@/plotSearch/actions";
import { FormNames, ViewModes } from "@/enums";
import { Routes, getRouteById } from "@/root/routes";
import Loader from "@/components/loader/Loader";
import LoaderWrapper from "@/components/loader/LoaderWrapper";
import Collapse from "@/components/collapse/Collapse";
import FormText from "@/components/form/FormText";
import FormTextTitle from "@/components/form/FormTextTitle";
import ExternalLink from "@/components/links/ExternalLink";
import { createPTPPlanReportUrl } from "@/util/helpers";
import { formatDate, getFieldOptions, getLabelOfOption } from "@/util/helpers";
import {
  getAttributes,
  getCollapseStateByKey,
  getIsFetchingCustomDetailedPlanAttributes,
  getRelatedApplications,
} from "@/plotSearch/selectors";
import type { Attributes } from "types";
import { PlotSearchFieldTitles } from "@/plotSearch/enums";
import { getInfoLinkLanguageDisplayText } from "@/plotSearch/helpers";
import PlotSearchReservationRecipients from "@/plotSearch/components/plotSearchSections/basicInfo/PlotSearchReservationRecipients";
type OwnProps = {
  plotSearchSite: Record<string, any>;
  index: number;
  customDetailedPlanAttributes: Attributes;
};
type Props = OwnProps & {
  attributes: Attributes;
  plotSearchSite: Record<string, any>;
  receiveCollapseStates: (...args: Array<any>) => any;
  fetchCustomDetailedPlanAttributes: (...args: Array<any>) => any;
  collapseState: boolean;
  isFetchingCustomDetailedPlanAttributes: boolean;
  isFetchingCustomDetailedPlan: boolean;
  customDetailedPlan: Record<string, any>;
  relatedApplications: Array<Record<string, any>>;
};
type State = {
  update: number;
};

class PlotSearchSiteCustomDetailedPlan extends PureComponent<Props, State> {
  state = {
    update: 0,
  };
  handleCollapseToggle = (val: boolean) => {
    const { receiveCollapseStates, plotSearchSite } = this.props;
    receiveCollapseStates({
      [ViewModes.READONLY]: {
        [FormNames.PLOT_SEARCH_BASIC_INFORMATION]: {
          plotSearch_site: {
            [plotSearchSite.id]: val,
          },
        },
      },
    });
  };

  render() {
    const {
      attributes,
      collapseState,
      plotSearchSite,
      isFetchingCustomDetailedPlanAttributes,
      customDetailedPlanAttributes,
      relatedApplications,
    } = this.props;
    const currentCustomDetailedPlan = get(
      plotSearchSite,
      "custom_detailed_plan",
    );
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
    const leaseIdentifier = get(plotSearchSite, "lease_identifier");
    const infoLinks = get(currentCustomDetailedPlan, "info_links");
    const usageDistributions = get(
      currentCustomDetailedPlan,
      "usage_distributions",
    );
    const reservationIdentifier = get(
      plotSearchSite,
      "reservation_readable_identifier",
    );
    const applicationCount = relatedApplications.filter((application) =>
      application.targets.some(
        (target) => target.identifier === currentCustomDetailedPlan.identifier,
      ),
    ).length;
    return (
      <Column large={12}>
        <Collapse
          className="collapse__secondary greenCollapse"
          defaultOpen={collapseState !== undefined ? collapseState : true}
          headerTitle={
            get(currentCustomDetailedPlan, "identifier")
              ? `${get(currentCustomDetailedPlan, "identifier")} ${get(currentCustomDetailedPlan, "state.name")} - OMA MUU ALUE`
              : "-"
          }
          onToggle={this.handleCollapseToggle}
        >
          <Row
            style={{
              marginBottom: 10,
            }}
          >
            {isFetchingCustomDetailedPlanAttributes && (
              <LoaderWrapper className="relative-overlay-wrapper">
                <Loader isLoading={true} />
              </LoaderWrapper>
            )}
            {currentCustomDetailedPlan && (
              <Fragment>
                <Column small={12} medium={12} large={2}>
                  <Row>
                    <Column small={4} medium={4} large={12}>
                      <FormTextTitle>
                        {PlotSearchFieldTitles.TARGET_IDENTIFIER}
                      </FormTextTitle>
                      <FormText>
                        {currentCustomDetailedPlan.identifier}
                      </FormText>
                    </Column>
                    <Column small={8} medium={8} large={12}>
                      <FormTextTitle>
                        {PlotSearchFieldTitles.LEASE_IDENTIFIER}
                      </FormTextTitle>
                      <FormText>
                        {leaseIdentifier ? (
                          <ExternalLink
                            className="no-margin"
                            href={`${getRouteById(Routes.LEASES)}?search=${leaseIdentifier}`}
                            text={leaseIdentifier || "-"}
                          />
                        ) : (
                          <FormText>-</FormText>
                        )}
                      </FormText>
                    </Column>
                  </Row>
                </Column>
                <Column small={12} medium={12} large={7}>
                  <Row>
                    <Column small={6} medium={4} large={6}>
                      <FormTextTitle>
                        {
                          PlotSearchFieldTitles.CUSTOM_DETAILED_PLAN_INTENDED_USE
                        }
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
                      <FormTextTitle>
                        {PlotSearchFieldTitles.ADDRESS}
                      </FormTextTitle>
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
                      <FormTextTitle>
                        {PlotSearchFieldTitles.STATE}
                      </FormTextTitle>
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
                      <FormTextTitle>
                        {PlotSearchFieldTitles.AREA}
                      </FormTextTitle>
                      <FormText>
                        {get(currentCustomDetailedPlan, "area")
                          ? `${get(currentCustomDetailedPlan, "area")} m²`
                          : "-"}
                      </FormText>
                    </Column>
                    <Column small={6} medium={4} large={6}>
                      <FormTextTitle>
                        {
                          PlotSearchFieldTitles.DETAILED_PLAN_LATEST_PROCESSING_DATE
                        }
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
                        {get(currentCustomDetailedPlan, "rent_build_permission")
                          ? `${get(currentCustomDetailedPlan, "rent_build_permission")} k-m²`
                          : "-"}
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
                              <FormText>
                                {usageDistribution.distribution}
                              </FormText>
                            </Column>
                            <Column small={8} medium={6} large={6}>
                              <FormText>
                                {`${usageDistribution.build_permission} k-m²`}
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
                <Column small={12} medium={12} large={3}>
                  <Row>
                    <Column small={4} medium={4} large={12}>
                      <FormText>
                        {/* TODO: add a link here if a by-target filter is implemented for the application list view */}
                        Hakemukset ({applicationCount})
                      </FormText>
                    </Column>
                    <Column small={4} medium={4} large={12}>
                      <FormTextTitle>
                        {PlotSearchFieldTitles.RESERVATION_IDENTIFIER}
                      </FormTextTitle>
                      <FormText>
                        {reservationIdentifier ? (
                          <ExternalLink
                            className="no-margin"
                            href={`${getRouteById(Routes.LEASES)}?search=${reservationIdentifier}`}
                            text={reservationIdentifier}
                          />
                        ) : (
                          "-"
                        )}
                      </FormText>
                    </Column>
                    <Column small={8} medium={8} large={12}>
                      <PlotSearchReservationRecipients
                        reservationRecipients={get(
                          plotSearchSite,
                          "reservation_recipients",
                        )}
                      />
                    </Column>
                  </Row>
                </Column>
              </Fragment>
            )}
          </Row>
        </Collapse>
      </Column>
    );
  }
}

export default connect(
  (state, props) => {
    const id = props.plotSearchSite.id;
    return {
      attributes: getAttributes(state),
      collapseState: getCollapseStateByKey(
        state,
        `${ViewModes.READONLY}.${FormNames.PLOT_SEARCH_BASIC_INFORMATION}.plotSearch_site.${id}`,
      ),
      isFetchingCustomDetailedPlanAttributes:
        getIsFetchingCustomDetailedPlanAttributes(state),
      relatedApplications: getRelatedApplications(state),
    };
  },
  {
    receiveCollapseStates,
  },
)(PlotSearchSiteCustomDetailedPlan) as React.ComponentType<OwnProps>;
