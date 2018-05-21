// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Column} from 'react-foundation';

import Collapse from '$components/collapse/Collapse';
import ConstructabilityItem from './ConstructabilityItem';
import Divider from '$components/content/Divider';
import SendEmail from './SendEmail';
import {getAttributes, getCurrentLease} from '$src/leases/selectors';
import {getContentConstructability} from '$src/leases/helpers';
import {formatNumber, getAttributeFieldOptions, getLabelOfOption} from '$src/util/helpers';

import type {Attributes, Lease} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  currentLease: Lease,
}

const Constructability = ({attributes, currentLease}: Props) => {
  const getFullAddress = (item: Object) => {
    return `${item.address}, ${item.postal_code} ${item.city}`;
  };
  const areas = getContentConstructability(currentLease);
  const locationOptions = getAttributeFieldOptions(attributes, 'lease_areas.child.children.location');
  const typeOptions = getAttributeFieldOptions(attributes, 'lease_areas.child.children.type');

  return (
    <div>
      <h2>Rakentamiskelpoisuus</h2>
      <Divider />
      <SendEmail onSend={() => console.log('TODO')} />

      {!areas || !areas.length &&
        <p className='no-margin'>Ei vuokra-alueita</p>
      }
      {areas && !!areas.length && areas.map((area) =>
        <Collapse key={area.id}
          defaultOpen={true}
          header={
            <div>
              <Column>
                <span className='collapse__header-subtitle'>
                  {getLabelOfOption(typeOptions, area.type) || '-'}
                </span>
              </Column>
              <Column>
                <span className='collapse__header-subtitle'>
                  {getFullAddress(area)}
                </span>
              </Column>
              <Column>
                <span className='collapse__header-subtitle'>
                  {formatNumber(area.area)} m<sup>2</sup> / {getLabelOfOption(locationOptions, area.location)}
                </span>
              </Column>
            </div>
          }
          headerTitle={
            <h3 className='collapse__header-title'>{area.identifier || '-'}</h3>
          }
        >
          <ConstructabilityItem
            area={area}
          />
        </Collapse>
      )}
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
)(Constructability);
