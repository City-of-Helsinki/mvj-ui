import React, { Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import { Row, Column } from "react-foundation";
import flowRight from "lodash/flowRight";
import isEmpty from "lodash/isEmpty";
import Authorization from "@/components/authorization/Authorization";
import BoxItem from "@/components/content/BoxItem";
import FormText from "@/components/form/FormText";
import FormTextTitle from "@/components/form/FormTextTitle";
import KtjLink from "@/components/ktj/KtjLink";
import SubTitle from "@/components/content/SubTitle";
import { LeasePlotsFieldPaths, LeasePlotsFieldTitles, PlotType } from "@/leases/enums";
import { getUiDataLeaseKey } from "@/uiData/helpers";
import { formatDate, formatNumber, getFieldOptions, getLabelOfOption, getSearchQuery, getUrlParams, isEmptyValue, isFieldAllowedToRead } from "@/util/helpers";
import { getAttributes } from "@/leases/selectors";
import type { Attributes } from "types";
type Props = {
  areaArchived: boolean;
  attributes: Attributes;
  location: Record<string, any>;
  plot: Record<string, any>;
};

const PlotItem = ({
  areaArchived,
  attributes,
  location,
  plot
}: Props) => {
  const getMapLinkUrl = () => {
    const {
      pathname,
      search
    } = location;
    const searchQuery = getUrlParams(search);
    delete searchQuery.lease_area;
    delete searchQuery.plan_unit;
    searchQuery.plot = plot.id, searchQuery.tab = 7;
    return `${pathname}${getSearchQuery(searchQuery)}`;
  };

  const mapLinkUrl = getMapLinkUrl();
  const typeOptions = getFieldOptions(attributes, LeasePlotsFieldPaths.TYPE);
  return <BoxItem className='no-border-on-first-child no-border-on-last-child'>
      <Row>
        <Column small={12} medium={6} large={6}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeasePlotsFieldPaths.IDENTIFIER)}>
            <>
            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeasePlotsFieldPaths.IDENTIFIER)}>
              {LeasePlotsFieldTitles.IDENTIFIER}
            </FormTextTitle>
            <FormText><strong>{plot.identifier || '-'}</strong></FormText>
            </>
          </Authorization>
        </Column>
        <Column small={12} medium={3} large={3}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeasePlotsFieldPaths.TYPE)}>
            <>
            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeasePlotsFieldPaths.TYPE)}>
              {LeasePlotsFieldTitles.TYPE}
            </FormTextTitle>
            <FormText>{getLabelOfOption(typeOptions, plot.type) || '-'}</FormText>
            </>
          </Authorization>
        </Column>
        <Column small={12} medium={3} large={3}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeasePlotsFieldPaths.GEOMETRY)}>
            {!areaArchived && !isEmpty(plot.geometry) && <Link to={mapLinkUrl}>{LeasePlotsFieldTitles.GEOMETRY}</Link>}
          </Authorization>
        </Column>
      </Row>

      <Row>
        <Column small={12} medium={6} large={3}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeasePlotsFieldPaths.AREA)}>
            <>
            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeasePlotsFieldPaths.AREA)}>
              {LeasePlotsFieldTitles.AREA}
            </FormTextTitle>
            <FormText>{!isEmptyValue(plot.area) ? `${formatNumber(plot.area)} m²` : '-'}</FormText>
            </>
          </Authorization>
        </Column>
        <Column small={12} medium={6} large={3}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeasePlotsFieldPaths.SECTION_AREA)}>
            <>
            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeasePlotsFieldPaths.SECTION_AREA)}>
              {LeasePlotsFieldTitles.SECTION_AREA}
            </FormTextTitle>
            <FormText>{!isEmptyValue(plot.section_area) ? `${formatNumber(plot.section_area)} m²` : '-'}</FormText>
            </>
          </Authorization>
        </Column>
        <Column small={12} medium={6} large={3}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeasePlotsFieldPaths.REGISTRATION_DATE)}>
            <>
            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeasePlotsFieldPaths.REGISTRATION_DATE)}>
              {LeasePlotsFieldTitles.REGISTRATION_DATE}
            </FormTextTitle>
            <FormText>{formatDate(plot.registration_date) || '-'}</FormText>
            </>
          </Authorization>
        </Column>
        <Column small={12} medium={6} large={3}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeasePlotsFieldPaths.REPEAL_DATE)}>
            <>
            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeasePlotsFieldPaths.REPEAL_DATE)}>
              {LeasePlotsFieldTitles.REPEAL_DATE}
            </FormTextTitle>
            <FormText>{formatDate(plot.repeal_date) || '-'}</FormText>
            </>
          </Authorization>
        </Column>
      </Row>

      <Authorization allow={isFieldAllowedToRead(attributes, LeasePlotsFieldPaths.IDENTIFIER)}>
        {plot.identifier && <Fragment>
            <SubTitle uiDataKey={getUiDataLeaseKey(LeasePlotsFieldPaths.KTJ_LINK)}>
              {LeasePlotsFieldTitles.KTJ_LINK}
            </SubTitle>

            <Row>
              {plot.type === PlotType.REAL_PROPERTY && <Column small={12} medium={6}>
                  <KtjLink fileKey='kiinteistorekisteriote/rekisteriyksikko' fileName='kiinteistorekisteriote' identifier={plot.identifier} idKey='kiinteistotunnus' label='Kiinteistörekisteriote' prefix='ktjkii' />
                </Column>}
              {plot.type === PlotType.UNSEPARATED_PARCEL && <Column small={12} medium={6}>
                  <KtjLink fileKey='kiinteistorekisteriote/maaraala' fileName='kiinteistorekisteriote' identifier={plot.identifier} idKey='maaraalatunnus' label='Kiinteistörekisteriote' prefix='ktjkii' />
                </Column>}
              <Column small={12} medium={6}>
                <KtjLink fileKey='lainhuutotodistus' fileName='lainhuutotodistus' identifier={plot.identifier} idKey='kohdetunnus' label='Lainhuutotodistus' />
              </Column>
              <Column small={12} medium={6}>
                <KtjLink fileKey='rasitustodistus' fileName='rasitustodistus' identifier={plot.identifier} idKey='kohdetunnus' label='Rasitustodistus' />
              </Column>
            </Row>
          </Fragment>}
      </Authorization>
    </BoxItem>;
};

export default flowRight(
withRouter, connect(state => {
  return {
    attributes: getAttributes(state)
  };
}))(PlotItem) as React.ComponentType<any>;