// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import classNames from 'classnames';
import get from 'lodash/get';

import ExternalLink from '$components/links/ExternalLink';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import ListItem from '$components/content/ListItem';
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
      {'summary__status-indicator neutral': !researchState || researchState === ConstructabilityStatus.UNVERIFIED},
      {'summary__status-indicator alert': researchState === ConstructabilityStatus.REQUIRES_MEASURES},
      {'summary__status-indicator success': researchState === ConstructabilityStatus.COMPLETE}
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
      {!tenants.length && <FormText>Ei vuokralaisia</FormText>}
      {!!tenants.length &&
        <div>
          <Row>
            <Column small={6} large={4}>
              <FormTextTitle title='Vuokralainen' />
            </Column>
            <Column small={6} large={4}>
              <FormTextTitle title='Osuus' />
            </Column>
          </Row>
          <ListItems>
            {tenants.map((contact, index) => {
              return (
                <Row key={index}>
                  <Column small={6} large={4}>
                    <ListItem>
                      <ExternalLink
                        className='no-margin'
                        href={`${getRouteById('contacts')}/${get(contact, 'tenant.contact.id')}`}
                        text={getContactFullName(get(contact, 'tenant.contact')) || '-'}
                      />
                    </ListItem>
                  </Column>
                  <Column small={6} large={4}><ListItem>{contact.share_numerator} / {contact.share_denominator}</ListItem></Column>
                </Row>
              );
            })}
          </ListItems>
        </div>
      }
      <SubTitle>Vuokrakohteet</SubTitle>
      {!leaseAreas.length && <FormText>Ei vuokrakohteita</FormText>}
      {!!leaseAreas.length &&
        <div>
          <Row>
            <Column small={6} large={4}>
              <FormTextTitle title='Kohteen tunnus' />
            </Column>
            <Column small={6} large={4}>
              <FormTextTitle title='Kohteen osoite' />
            </Column>
          </Row>
          {leaseAreas.map((area, index) => {
            return (
              <ListItems key={index}>
                <Row>
                  <Column small={6} large={4}>
                    <ListItem>{area.identifier || '-'}</ListItem>
                  </Column>
                  <Column small={6} large={4}>
                    {!area.addresses || !area.addresses.length && <ListItem>-</ListItem>}

                    {!!area.addresses && !!area.addresses.length &&
                      area.addresses.map((address, index) => {
                        return <ListItem key={index}>{getFullAddress(address)}</ListItem>;
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
      {!constructabilityAreas.length && <FormText>Ei vuokrakohteita</FormText>}
      {!!constructabilityAreas.length &&
        constructabilityAreas.map((area, index) => {
          return (
            <ListItems key={index}>
              <Row>
                <Column><ListItem><strong>{area.identifier || '-'}</strong></ListItem></Column>
              </Row>
              <Row>
                <Column small={6} large={4}>
                  <ListItem>Esirakentaminen, johtosiirrot, kunnallistekniikka</ListItem>
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
                  <ListItem>Purku</ListItem>
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
                  <ListItem>Pima ja jäte</ListItem>
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
                  <ListItem>Rakennettavuusselvitys</ListItem>
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
                  <ListItem>Muut</ListItem>
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
