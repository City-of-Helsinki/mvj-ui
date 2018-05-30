// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import FormFieldLabel from '$components/form/FormFieldLabel';
import ListItems from '$components/content/ListItems';
import SubTitle from '$components/content/Subtitle';
import {getRouteById} from '$src/root/routes';
import {getContactFullName} from '$src/contacts/helpers';
import {formatDate, getLabelOfOption, getReferenceNumberLink} from '$util/helpers';

import type {LeaseId} from '$src/leases/types';

type Props = {
  decisionMakerOptions: Array<Object>,
  decisions: Array<Object>,
  id: LeaseId,
  identifier: ?string,
  planUnits: Array<Object>,
  plots: Array<Object>,
  tenants: Array<Object>,
}

const LeaseInfo = ({
  id,
  decisionMakerOptions,
  decisions,
  identifier,
  planUnits,
  plots,
  tenants,
}: Props) =>
  <div>
    <Row>
      <Column small={6} medium={4} large={2}>
        <FormFieldLabel>Vuokratunnus</FormFieldLabel>
        <a href={`${getRouteById('leases')}/${id}`} target='_blank'>{identifier || '-'}</a>
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
        <a onClick={() => {alert('TODO. OPEN MAP LINK');}}>Karttalinkki</a>
      </Column>
    </Row>
    <SubTitle>Korvauksen päätös</SubTitle>
    {!decisions.length && <p>Ei päätöksiä</p>}
    {!!decisions.length &&
      <div>
        <Row>
          <Column small={3} large={2}><FormFieldLabel>Päättäjä</FormFieldLabel></Column>
          <Column small={3} large={2}><FormFieldLabel>Pvm</FormFieldLabel></Column>
          <Column small={3} large={2}><FormFieldLabel>Pykälä</FormFieldLabel></Column>
          <Column small={3} large={2}><FormFieldLabel>Diaarinumero</FormFieldLabel></Column>
        </Row>
        {decisions.map((decision) =>
          <Row key={decision.id}>
            <Column small={3} large={2}>
              <p>{getLabelOfOption(decisionMakerOptions, decision.decision_maker) || '-'}</p>
            </Column>
            <Column small={3} large={2}>
              <p>{formatDate(decision.decision_date) || '-'}</p>
            </Column>
            <Column small={3} large={2}>
              <p>{decision.section ? `${decision.section} §` : '-'}</p>
            </Column>
            <Column small={3} large={2}>
              <p>
                <a
                  className='no-margin'
                  target='_blank'
                  href={getReferenceNumberLink(decision.reference_number)}>
                  {decision.reference_number}
                </a>
              </p>
            </Column>
          </Row>
        )}
      </div>
    }
  </div>;

export default LeaseInfo;
