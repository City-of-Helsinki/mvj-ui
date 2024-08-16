import React, { Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { Row, Column } from "react-foundation";
import flowRight from "lodash/flowRight";
import Authorization from "@/components/authorization/Authorization";
import BoxItem from "@/components/content/BoxItem";
import FormText from "@/components/form/FormText";
import FormTextTitle from "@/components/form/FormTextTitle";
import ExternalLink from "@/components/links/ExternalLink";
import { LeaseAreaCustomDetailedPlanFieldPaths, LeaseAreaCustomDetailedPlanFieldTitles, LeaseAreaUsageDistributionFieldTitles, LeaseAreaUsageDistributionFieldPaths, LeaseAreaCustomDetailedPlanInfoLinksFieldPaths, LeaseAreaCustomDetailedPlanInfoLinksFieldTitles } from "@/leases/enums";
import { getUiDataLeaseKey } from "@/uiData/helpers";
import { formatDate, formatNumber, getFieldOptions, getLabelOfOption, isEmptyValue, isFieldAllowedToRead } from "@/util/helpers";
import { getAttributes } from "@/leases/selectors";
import type { Attributes } from "types";
import SubTitle from "@/components/content/SubTitle";
type OwnProps = {
  customDetailedPlan: Record<string, any>;
};
type Props = OwnProps & {
  attributes: Attributes;
};

const CustomDetailedPlan = ({
  attributes,
  customDetailedPlan
}: Props) => {
  const stateOptions = getFieldOptions(attributes, LeaseAreaCustomDetailedPlanFieldPaths.STATE);
  const typeOptions = getFieldOptions(attributes, LeaseAreaCustomDetailedPlanFieldPaths.TYPE);
  const intendedUseOptions = getFieldOptions(attributes, LeaseAreaCustomDetailedPlanFieldPaths.INTENDED_USE);
  const infoLinkOptions = getFieldOptions(attributes, LeaseAreaCustomDetailedPlanInfoLinksFieldPaths.LANGUAGE);
  return <BoxItem className='no-border-on-first-child no-border-on-last-child'>
      <Row>
        <Column small={12} medium={4} large={4}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreaCustomDetailedPlanFieldPaths.IDENTIFIER)}>
            <>
            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseAreaCustomDetailedPlanFieldPaths.IDENTIFIER)}>
              {LeaseAreaCustomDetailedPlanFieldTitles.IDENTIFIER}
            </FormTextTitle>
            <FormText>{customDetailedPlan.identifier || '-'}</FormText>
            </>
          </Authorization>
        </Column>
        <Column small={12} medium={4} large={4}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreaCustomDetailedPlanFieldPaths.INTENDED_USE)}>
            <>
            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseAreaCustomDetailedPlanFieldPaths.INTENDED_USE)}>
              {LeaseAreaCustomDetailedPlanFieldTitles.INTENDED_USE}
            </FormTextTitle>
            <FormText>{getLabelOfOption(intendedUseOptions, customDetailedPlan.intended_use) || '-'}</FormText>
            </>
          </Authorization>
        </Column>
        <Column small={12} medium={4} large={4}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreaCustomDetailedPlanFieldPaths.ADDRESS)}>
            <>
            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseAreaCustomDetailedPlanFieldPaths.ADDRESS)}>
              {LeaseAreaCustomDetailedPlanFieldTitles.ADDRESS}
            </FormTextTitle>
            <FormText>{customDetailedPlan.address || '-'}</FormText>
            </>
          </Authorization>
        </Column>
      </Row>
      <Row>
        <Column small={12} medium={4} large={4}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreaCustomDetailedPlanFieldPaths.AREA)}>
            <>
            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseAreaCustomDetailedPlanFieldPaths.AREA)}>
              {LeaseAreaCustomDetailedPlanFieldTitles.AREA}
            </FormTextTitle>
            <FormText>{!isEmptyValue(customDetailedPlan.area) ? `${formatNumber(customDetailedPlan.area)} m²` : '-'}</FormText>
            </>
          </Authorization>
        </Column>
        <Column small={12} medium={4} large={4}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreaCustomDetailedPlanFieldPaths.STATE)}>
            <>
            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseAreaCustomDetailedPlanFieldPaths.STATE)}>
              {LeaseAreaCustomDetailedPlanFieldTitles.STATE}
            </FormTextTitle>
            <FormText>{getLabelOfOption(stateOptions, customDetailedPlan.state) || '-'}</FormText>
            </>
          </Authorization>
        </Column>
        <Column small={12} medium={4} large={4}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreaCustomDetailedPlanFieldPaths.TYPE)}>
            <>
            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseAreaCustomDetailedPlanFieldPaths.TYPE)}>
              {LeaseAreaCustomDetailedPlanFieldTitles.TYPE}
            </FormTextTitle>
            <FormText>{getLabelOfOption(typeOptions, customDetailedPlan.type) || '-'}</FormText>
            </>
          </Authorization>
        </Column>
      </Row>
      <Row>
        <Column small={12} medium={4} large={4}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreaCustomDetailedPlanFieldPaths.DETAILED_PLAN)}>
            <>
            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseAreaCustomDetailedPlanFieldPaths.DETAILED_PLAN)}>
              {LeaseAreaCustomDetailedPlanFieldTitles.DETAILED_PLAN}
            </FormTextTitle>
            <FormText>{customDetailedPlan.detailed_plan || '-'}</FormText>
            </>
          </Authorization>
        </Column>
        <Column small={12} medium={4} large={4}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreaCustomDetailedPlanFieldPaths.DETAILED_PLAN_LATEST_PROCESSING_DATE)}>
            <>
            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseAreaCustomDetailedPlanFieldPaths.DETAILED_PLAN_LATEST_PROCESSING_DATE)}>
              {LeaseAreaCustomDetailedPlanFieldTitles.DETAILED_PLAN_LATEST_PROCESSING_DATE}
            </FormTextTitle>
            <FormText>{formatDate(customDetailedPlan.detailed_plan_latest_processing_date) || '-'}</FormText>
            </>
          </Authorization>
        </Column>
        <Column small={12} medium={4} large={4}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreaCustomDetailedPlanFieldPaths.DETAILED_PLAN_LATEST_PROCESSING_DATE_NOTE)}>
            <>
            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseAreaCustomDetailedPlanFieldPaths.DETAILED_PLAN_LATEST_PROCESSING_DATE_NOTE)}>
              {LeaseAreaCustomDetailedPlanFieldTitles.DETAILED_PLAN_LATEST_PROCESSING_DATE_NOTE}
            </FormTextTitle>
            <FormText>{customDetailedPlan.detailed_plan_latest_processing_date_note || '-'}</FormText>
            </>
          </Authorization>
        </Column>
      </Row>
      <Row>
        <Column small={12} medium={4} large={4}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreaCustomDetailedPlanFieldPaths.RENT_BUILD_PERMISSION)}>
            <>
            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseAreaCustomDetailedPlanFieldPaths.RENT_BUILD_PERMISSION)}>
              {LeaseAreaCustomDetailedPlanFieldTitles.RENT_BUILD_PERMISSION}
            </FormTextTitle>
            <FormText>
              {!isEmptyValue(customDetailedPlan.rent_build_permission) ? `${formatNumber(customDetailedPlan.rent_build_permission)} k-m²` : '-'}
            </FormText>
            </>
          </Authorization>
        </Column>
        <Column small={12} medium={4} large={4}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreaCustomDetailedPlanFieldPaths.PRECONSTRUCTION_ESTIMATED_CONSTRUCTION_READINESS_MOMENT)}>
            <>
            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseAreaCustomDetailedPlanFieldPaths.PRECONSTRUCTION_ESTIMATED_CONSTRUCTION_READINESS_MOMENT)}>
              {LeaseAreaCustomDetailedPlanFieldTitles.PRECONSTRUCTION_ESTIMATED_CONSTRUCTION_READINESS_MOMENT}
            </FormTextTitle>
            <FormText>{customDetailedPlan.preconstruction_estimated_construction_readiness_moment || '-'}</FormText>
            </>
          </Authorization>
        </Column>
      </Row>
      {
      /* Usage distributions (Käyttöjakaumat) */
    }
      {customDetailedPlan.usage_distributions.length > 0 && <Fragment>
        <SubTitle>
          {LeaseAreaCustomDetailedPlanFieldTitles.USAGE_DISTRIBUTIONS}
        </SubTitle>
        <Row>
          <Column small={4} medium={4} large={4}>
            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseAreaUsageDistributionFieldPaths.DISTRIBUTION)}>
              {LeaseAreaUsageDistributionFieldTitles.DISTRIBUTION}
            </FormTextTitle>
          </Column>
          <Column small={4} medium={4} large={4}>
            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseAreaUsageDistributionFieldPaths.BUILD_PERMISSION)}>
              {LeaseAreaUsageDistributionFieldTitles.BUILD_PERMISSION}
            </FormTextTitle>
          </Column>
          <Column small={4} medium={4} large={4}>
            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseAreaUsageDistributionFieldPaths.NOTE)}>
              {LeaseAreaUsageDistributionFieldTitles.NOTE}
            </FormTextTitle>
          </Column>
        </Row>
        {customDetailedPlan.usage_distributions.map(usage_distribution => <Row key={usage_distribution.distribution}>
            <Column small={4} medium={4} large={4}>
              <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreaUsageDistributionFieldPaths.DISTRIBUTION)}>
                <FormText>{usage_distribution.distribution || '-'}</FormText>
              </Authorization>
            </Column>
            <Column small={4} medium={4} large={4}>
              <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreaUsageDistributionFieldPaths.BUILD_PERMISSION)}>
                <FormText>{!isEmptyValue(usage_distribution.build_permission) ? `${formatNumber(usage_distribution.build_permission)} k-m²` : '-'}</FormText>
              </Authorization>
            </Column>
            <Column small={4} medium={4} large={4}>
              <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreaUsageDistributionFieldPaths.NOTE)}>
                <FormText>{usage_distribution.distribution || '-'}</FormText>
              </Authorization>
            </Column>
          </Row>)}
      </Fragment>}
      {
      /* Info Links (Lisätietolinkit) */
    }
      {customDetailedPlan.info_links.length > 0 && <Fragment>
        <SubTitle>
          {LeaseAreaCustomDetailedPlanFieldTitles.INFO_LINKS}
        </SubTitle>
        <Row>
          <Column small={4} medium={4} large={4}>
            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseAreaCustomDetailedPlanInfoLinksFieldPaths.DESCRIPTION)}>
              {LeaseAreaCustomDetailedPlanInfoLinksFieldTitles.DESCRIPTION}
            </FormTextTitle>
          </Column>
          <Column small={4} medium={4} large={4}>
            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseAreaCustomDetailedPlanInfoLinksFieldPaths.URL)}>
              {LeaseAreaCustomDetailedPlanInfoLinksFieldTitles.URL}
            </FormTextTitle>
          </Column>
          <Column small={4} medium={4} large={4}>
            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseAreaCustomDetailedPlanInfoLinksFieldPaths.LANGUAGE)}>
              {LeaseAreaCustomDetailedPlanInfoLinksFieldTitles.LANGUAGE}
            </FormTextTitle>
          </Column>
        </Row>
        {customDetailedPlan.info_links.map(info_link => <Row key={info_link.url}>
            <Column small={4} medium={4} large={4}>
              <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreaCustomDetailedPlanInfoLinksFieldPaths.DESCRIPTION)}>
                <FormText>{info_link.description || '-'}</FormText>
              </Authorization>
            </Column>
            <Column small={4} medium={4} large={4}>
              <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreaCustomDetailedPlanInfoLinksFieldPaths.URL)}>
                <FormText>{<ExternalLink href={info_link.url} text={info_link.url} />}</FormText>
              </Authorization>
            </Column>
            <Column small={4} medium={4} large={4}>
              <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreaCustomDetailedPlanInfoLinksFieldPaths.LANGUAGE)}>
                <FormText>{getLabelOfOption(infoLinkOptions, info_link.language) || '-'}</FormText>
              </Authorization>
            </Column>
          </Row>)}
      </Fragment>}
    </BoxItem>;
};

export default (flowRight(withRouter, connect(state => {
  return {
    attributes: getAttributes(state)
  };
}))(CustomDetailedPlan) as React.ComponentType<OwnProps>);