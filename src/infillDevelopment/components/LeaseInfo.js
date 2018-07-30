// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import FormFieldLabel from '$components/form/FormFieldLabel';
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
        <FormFieldLabel>Vuokratunnus</FormFieldLabel>
        <a href={`${getRouteById('leases')}/${leaseId}`} target='_blank'>{identifier || '-'}</a>
      </Column>
      <Column small={6} medium={4} large={2}>
        <FormFieldLabel>Vuokralainen</FormFieldLabel>
        {!tenants.length && <p>-</p>}
        {!!tenants.length &&
          <ListItems>
            {tenants.map((tenant) =>
              <p key={tenant.id} className='no-margin'>
                <a className='no-margin' href={`${getRouteById('contacts')}/${get(tenant, 'tenant.contact.id')}`} target='_blank'>
                  {getContactFullName(get(tenant, 'tenant.contact'))}
                </a>
              </p>
            )}
          </ListItems>
        }
      </Column>
      <Column small={6} medium={4} large={2}>
        <FormFieldLabel>Kiinteistö</FormFieldLabel>
        {!plots.length && <p>-</p>}
        {!!plots.length &&
          <ListItems>
            {plots.map((plot, index) =>
              <p key={index} className='no-margin'>{plot.identifier || '-'}</p>
            )}
          </ListItems>
        }
      </Column>
      <Column small={6} medium={4} large={2}>
        <FormFieldLabel>Kaavayksikkö</FormFieldLabel>
        {!planUnits.length && <p>-</p>}
        {!!planUnits.length &&
          <ListItems>
            {planUnits.map((planUnit, index) =>
              <p key={index} className='no-margin'>{planUnit.identifier || '-'}</p>
            )}
          </ListItems>
        }
      </Column>
      <Column small={6} medium={4} large={2}>
        <a href={`${getRouteById('leases')}/${leaseId}?tab=7`} target='_blank'>Karttalinkki</a>
      </Column>
    </Row>
  </div>;

export default LeaseInfo;
