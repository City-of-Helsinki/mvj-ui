import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Row, Column } from "react-foundation";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import flowRight from "lodash/flowRight";
import get from "lodash/get";
import Authorization from "@/components/authorization/Authorization";
import ExternalLink from "@/components/links/ExternalLink";
import FormText from "@/components/form/FormText";
import FormTextTitle from "@/components/form/FormTextTitle";
import ListItem from "@/components/content/ListItem";
import ListItems from "@/components/content/ListItems";
import { getRouteById, Routes } from "@/root/routes";
import { InfillDevelopmentCompensationLeasesFieldPaths, InfillDevelopmentCompensationLeasesFieldTitles } from "@/infillDevelopment/enums";
import { LeasePlanUnitsFieldPaths, LeasePlotsFieldPaths, LeaseTenantsFieldPaths } from "@/leases/enums";
import { getContactFullName } from "@/contacts/helpers";
import { getUiDataInfillDevelopmentKey } from "@/uiData/helpers";
import { getSearchQuery, getUrlParams, isFieldAllowedToRead } from "@/util/helpers";
import { getAttributes as getInfillDevelopmentAttributes } from "@/infillDevelopment/selectors";
import { getAttributes as getLeaseAttributes } from "@/leases/selectors";
import type { Attributes } from "types";
import type { LeaseId } from "@/leases/types";
type Props = {
  identifier: string | null | undefined;
  infillDevelopmentAttributes: Attributes;
  leaseAttributes: Attributes;
  leaseId: LeaseId;
  location: Record<string, any>;
  planUnits: Array<Record<string, any>>;
  plots: Array<Record<string, any>>;
  tenants: Array<Record<string, any>>;
};

const LeaseInfo = ({
  identifier,
  infillDevelopmentAttributes,
  leaseAttributes,
  leaseId,
  location,
  planUnits,
  plots,
  tenants
}: Props) => {
  const getMapLinkUrl = () => {
    const {
      pathname,
      search
    } = location;
    const searchQuery = getUrlParams(search);
    searchQuery.lease = leaseId, searchQuery.tab = 1;
    return `${pathname}${getSearchQuery(searchQuery)}`;
  };

  const mapLinkUrl = getMapLinkUrl();
  return <Fragment>
      <Row>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(infillDevelopmentAttributes, InfillDevelopmentCompensationLeasesFieldPaths.LEASE)}>
            <FormTextTitle uiDataKey={getUiDataInfillDevelopmentKey(InfillDevelopmentCompensationLeasesFieldPaths.LEASE)}>
              {InfillDevelopmentCompensationLeasesFieldTitles.LEASE}
            </FormTextTitle>
            <ExternalLink href={`${getRouteById(Routes.LEASES)}/${leaseId}`} text={identifier || '-'} />
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseTenantsFieldPaths.TENANTS)}>
            <FormTextTitle uiDataKey={getUiDataInfillDevelopmentKey(LeaseTenantsFieldPaths.TENANTS)}>
              Vuokralainen
            </FormTextTitle>

            {!tenants.length && <FormText>-</FormText>}
            {!!tenants.length && <ListItems>
                {tenants.map(tenant => <ListItem key={tenant.id}>
                    <ExternalLink className='no-margin' href={`${getRouteById(Routes.CONTACTS)}/${get(tenant, 'tenant.contact.id')}`} text={getContactFullName(get(tenant, 'tenant.contact'))} />
                  </ListItem>)}
              </ListItems>}
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeasePlotsFieldPaths.PLOTS)}>
            <FormTextTitle uiDataKey={getUiDataInfillDevelopmentKey(LeasePlotsFieldPaths.PLOTS)}>
              Kiinteistö
            </FormTextTitle>

            {!plots.length && <FormText>-</FormText>}
            {!!plots.length && <ListItems>
                {plots.map((plot, index) => <ListItem key={index}>{plot.identifier || '-'}</ListItem>)}
              </ListItems>}
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeasePlanUnitsFieldPaths.PLAN_UNITS)}>
            <FormTextTitle uiDataKey={getUiDataInfillDevelopmentKey(LeasePlanUnitsFieldPaths.PLAN_UNITS)}>
              Kaavayksikkö
            </FormTextTitle>

            {!planUnits.length && <FormText>-</FormText>}
            {!!planUnits.length && <ListItems>
                {planUnits.map((planUnit, index) => <ListItem key={index}>{planUnit.identifier || '-'}</ListItem>)}
              </ListItems>}
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(infillDevelopmentAttributes, InfillDevelopmentCompensationLeasesFieldPaths.LEASE)}>
            <Link to={mapLinkUrl}>Karttalinkki</Link>
          </Authorization>
        </Column>
      </Row>
    </Fragment>;
};

export default flowRight(
withRouter, connect(state => {
  return {
    infillDevelopmentAttributes: getInfillDevelopmentAttributes(state),
    leaseAttributes: getLeaseAttributes(state)
  };
}))(LeaseInfo) as React.ComponentType<any>;