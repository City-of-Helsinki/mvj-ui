// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import ExternalLink from '$components/links/ExternalLink';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import ListItem from '../../components/content/ListItem';
import ListItems from '$components/content/ListItems';
import {getRouteById} from '$src/root/routes';
import {getContactFullName} from '$src/contacts/helpers';

import type {LeaseId} from '$src/leases/types';

type Props = {
  identifier: ?string,
  leaseId: LeaseId,
  planUnits: Array<Object>,
  plots: Array<Object>,
  tenants: Array<Object>,
}

const LeaseInfo = ({
  identifier,
  leaseId,
  planUnits,
  plots,
  tenants,
}: Props) =>
  <div>
    <Row>
      <Column small={6} medium={4} large={2}>
        <FormTextTitle title='Vuokratunnus' />
        <ExternalLink
          href={`${getRouteById('leases')}/${leaseId}`}
          text={identifier || '-'}
        />
      </Column>
      <Column small={6} medium={4} large={2}>
        <FormTextTitle title='Vuokralainen' />
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
      </Column>
      <Column small={6} medium={4} large={2}>
        <FormTextTitle title='Kiinteistö' />
        {!plots.length && <FormText>-</FormText>}
        {!!plots.length &&
          <ListItems>
            {plots.map((plot, index) =>
              <ListItem key={index}>{plot.identifier || '-'}</ListItem>
            )}
          </ListItems>
        }
      </Column>
      <Column small={6} medium={4} large={2}>
        <FormTextTitle title='Kaavayksikkö' />
        {!planUnits.length && <FormText>-</FormText>}
        {!!planUnits.length &&
          <ListItems>
            {planUnits.map((planUnit, index) =>
              <ListItem key={index}>{planUnit.identifier || '-'}</ListItem>
            )}
          </ListItems>
        }
      </Column>
      <Column small={6} medium={4} large={2}>
        <ExternalLink
          href={`${getRouteById('leases')}/${leaseId}?tab=7`}
          text='Karttalinkki'
        />
      </Column>
    </Row>
  </div>;

export default LeaseInfo;
