// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import classNames from 'classnames';
import get from 'lodash/get';

import FormFieldLabel from '$components/form/FormFieldLabel';
import ListItems from '$components/content/ListItems';
import SubTitle from '$components/content/SubTitle';
import {ConstructabilityStatus} from '$src/leases/enums';
import {getContactFullName} from '$src/contacts/helpers';
import {getContentSummary, getFullAddress} from '$src/leases/helpers';
import {getAttributeFieldOptions, getLabelOfOption} from '$util/helpers';
import {getRouteById} from '$src/root/routes';
import {getAttributes, getCurrentLease} from '$src/leases/selectors';

import type {Attributes, Lease} from '$src/leases/types';

type StatusIndicatorProps = {
  researchState: string,
  stateOptions: Array<Object>,
}

const StatusIndicator = ({researchState, stateOptions}: StatusIndicatorProps) =>
  <p
    className={classNames(
      'no-margin',
      {'summary__status-indicator_neutral': !researchState || researchState === ConstructabilityStatus.UNVERIFIED},
      {'summary__status-indicator_alert': researchState === ConstructabilityStatus.REQUIRES_MEASURES},
      {'summary__status-indicator_success': researchState === ConstructabilityStatus.COMPLETE}
    )}
  >
    {getLabelOfOption(stateOptions, researchState || ConstructabilityStatus.UNVERIFIED)}
  </p>;

type Props = {
  attributes: Attributes,
  currentLease: Lease,
}

const SummaryLeaseInfo = ({attributes, currentLease}: Props) => {
  const constructabilityStateOptions = getAttributeFieldOptions(attributes, 'lease_areas.child.children.preconstruction_state'),
    summary = getContentSummary(currentLease),
    tenants = summary.tenants,
    leaseAreas = get(summary, 'lease_areas', []),
    constructabilityAreas = get(summary, 'constructability_areas', []);

  return (
    <div>
      <SubTitle>Vuokralaiset</SubTitle>
      {!tenants.length && <p>Ei vuokralaisia</p>}
      {!!tenants.length &&
        <div>
          <Row>
            <Column small={6} large={4}>
              <FormFieldLabel>Vuokralainen</FormFieldLabel>
            </Column>
            <Column small={6} large={4}>
              <FormFieldLabel>Osuus</FormFieldLabel>
            </Column>
          </Row>
          <ListItems>
            {tenants.map((contact, index) => {
              return (
                <Row key={index}>
                  <Column small={6} large={4}>
                    <p className='no-margin'>
                      <a href={`${getRouteById('contacts')}/${get(contact, 'tenant.contact.id')}`} className='no-margin' target='_blank'>
                        {getContactFullName(get(contact, 'tenant.contact')) || '-'}
                      </a>
                    </p>
                  </Column>
                  <Column small={6} large={4}><p className='no-margin'>{contact.share_numerator} / {contact.share_denominator}</p></Column>
                </Row>
              );
            })}
          </ListItems>
        </div>
      }
      <SubTitle>Vuokrakohteet</SubTitle>
      {!leaseAreas.length && <p>Ei vuokrakohteita</p>}
      {!!leaseAreas.length &&
        <div>
          <Row>
            <Column small={6} large={4}>
              <FormFieldLabel>Kohteen tunnus</FormFieldLabel>
            </Column>
            <Column small={6} large={4}>
              <FormFieldLabel>Kohteen osoite</FormFieldLabel>
            </Column>
          </Row>
          {leaseAreas.map((area, index) => {
            return (
              <ListItems key={index}>
                <Row>
                  <Column small={6} large={4}>
                    <p className='no-margin'>{area.identifier || '-'}</p>
                  </Column>
                  <Column small={6} large={4}>
                    {!area.addresses || !area.addresses.length && <p className='no-margin'>-</p>}

                    {!!area.addresses && !!area.addresses.length &&
                      area.addresses.map((address, index) => {
                        return <p key={index} className='no-margin'>{getFullAddress(address)}</p>;
                      })
                    }
                  </Column>
                </Row>
              </ListItems>
            );
          })}
        </div>
      }
      <SubTitle>Rakentamiskelpoisuus</SubTitle>
      {!constructabilityAreas.length && <p>Ei vuokrakohteita</p>}
      {!!constructabilityAreas.length &&
        constructabilityAreas.map((area, index) => {
          return (
            <ListItems key={index}>
              <Row>
                <Column><p className='no-margin'><strong>{area.identifier || '-'}</strong></p></Column>
              </Row>
              <Row>
                <Column small={6} large={4}>
                  <p className='no-margin'>Esirakentaminen, johtosiirrot, kunnallistekniikka</p>
                </Column>
                <Column small={6} large={4}>
                  <StatusIndicator
                    researchState={area.preconstruction_state}
                    stateOptions={constructabilityStateOptions}
                  />
                </Column>
              </Row>
              <Row>
                <Column small={6} large={4}>
                  <p className='no-margin'>Purku</p>
                </Column>
                <Column small={6} large={4}>
                  <StatusIndicator
                    researchState={area.demolition_state}
                    stateOptions={constructabilityStateOptions}
                  />
                </Column>
              </Row>
              <Row>
                <Column small={6} large={4}>
                  <p className='no-margin'>Pima ja jäte</p>
                </Column>
                <Column small={6} large={4}>
                  <StatusIndicator
                    researchState={area.polluted_land_state}
                    stateOptions={constructabilityStateOptions}
                  />
                </Column>
              </Row>
              <Row>
                <Column small={6} large={4}>
                  <p className='no-margin'>Rakennettavuusselvitys</p>
                </Column>
                <Column small={6} large={4}>
                  <StatusIndicator
                    researchState={area.constructability_report_state}
                    stateOptions={constructabilityStateOptions}
                  />
                </Column>
              </Row>
              <Row>
                <Column small={6} large={4}>
                  <p className='no-margin'>Muut</p>
                </Column>
                <Column small={6} large={4}>
                  <StatusIndicator
                    researchState={area.other_state}
                    stateOptions={constructabilityStateOptions}
                  />
                </Column>
              </Row>
            </ListItems>
          );
        })
      }
    </div>
  );
};

export default connect(
  (state) => {
    return {
      attributes: getAttributes(state),
      currentLease: getCurrentLease(state),
    };
  },
)(SummaryLeaseInfo);
