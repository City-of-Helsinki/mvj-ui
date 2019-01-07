// @flow
import React, {Fragment} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import {Link, withRouter} from 'react-router';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';

import Authorization from '$components/authorization/Authorization';
import ExternalLink from '$components/links/ExternalLink';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import ListItem from '$components/content/ListItem';
import ListItems from '$components/content/ListItems';
import {getRouteById} from '$src/root/routes';
import {
  InfillDevelopmentCompensationLeasesFieldPaths,
  InfillDevelopmentCompensationLeasesFieldTitles,
} from '$src/infillDevelopment/enums';
import {
  LeasePlanUnitsFieldPaths,
  LeasePlotsFieldPaths,
  LeaseTenantsFieldPaths,
} from '$src/leases/enums';
import {getContactFullName} from '$src/contacts/helpers';
import {getSearchQuery, isFieldAllowedToRead} from '$util/helpers';
import {getAttributes as getInfillDevelopmentAttributes} from '$src/infillDevelopment/selectors';
import {getAttributes as getLeaseAttributes} from '$src/leases/selectors';

import type {Attributes} from '$src/types';
import type {LeaseId} from '$src/leases/types';

type Props = {
  identifier: ?string,
  infillDevelopmentAttributes: Attributes,
  leaseAttributes: Attributes,
  leaseId: LeaseId,
  location: Object,
  planUnits: Array<Object>,
  plots: Array<Object>,
  tenants: Array<Object>,
}

const LeaseInfo = ({
  identifier,
  infillDevelopmentAttributes,
  leaseAttributes,
  leaseId,
  location,
  planUnits,
  plots,
  tenants,
}: Props) => {
  const getMapLinkUrl = () => {
    const {pathname, query} = location;

    const tempQuery = {...query};
    tempQuery.lease = leaseId,
    tempQuery.tab = 1;

    return `${pathname}${getSearchQuery(tempQuery)}`;
  };

  const mapLinkUrl = getMapLinkUrl();

  return(
    <Fragment>
      <Row>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(infillDevelopmentAttributes, InfillDevelopmentCompensationLeasesFieldPaths.LEASE)}>
            <FormTextTitle>{InfillDevelopmentCompensationLeasesFieldTitles.LEASE}</FormTextTitle>
            <ExternalLink
              href={`${getRouteById('leases')}/${leaseId}`}
              text={identifier || '-'}
            />
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseTenantsFieldPaths.TENANTS)}>
            <FormTextTitle>Vuokralainen</FormTextTitle>

            {!tenants.length && <FormText>-</FormText>}
            {!!tenants.length &&
              <ListItems>
                {tenants.map((tenant) =>
                  <ListItem key={tenant.id}>
                    <ExternalLink
                      className='no-margin'
                      href={`${getRouteById('contacts')}/${get(tenant, 'tenant.contact.id')}`}
                      text={getContactFullName(get(tenant, 'tenant.contact'))}
                    />
                  </ListItem>
                )}
              </ListItems>
            }
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeasePlotsFieldPaths.PLOTS)}>
            <FormTextTitle>Kiinteistö</FormTextTitle>

            {!plots.length && <FormText>-</FormText>}
            {!!plots.length &&
              <ListItems>
                {plots.map((plot, index) => <ListItem key={index}>{plot.identifier || '-'}</ListItem>)}
              </ListItems>
            }
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeasePlanUnitsFieldPaths.PLAN_UNITS)}>
            <FormTextTitle>Kaavayksikkö</FormTextTitle>

            {!planUnits.length && <FormText>-</FormText>}
            {!!planUnits.length &&
              <ListItems>
                {planUnits.map((planUnit, index) =>
                  <ListItem key={index}>{planUnit.identifier || '-'}</ListItem>
                )}
              </ListItems>
            }
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(infillDevelopmentAttributes, InfillDevelopmentCompensationLeasesFieldPaths.LEASE)}>
            <Link to={mapLinkUrl}>Karttalinkki</Link>
          </Authorization>
        </Column>
      </Row>
    </Fragment>
  );
};

export default flowRight(
  withRouter,
  connect(
    (state) => {
      return {
        infillDevelopmentAttributes: getInfillDevelopmentAttributes(state),
        leaseAttributes: getLeaseAttributes(state),
      };
    }
  )
)(LeaseInfo);
