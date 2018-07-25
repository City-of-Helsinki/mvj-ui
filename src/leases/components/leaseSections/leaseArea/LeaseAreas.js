// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Column} from 'react-foundation';
import get from 'lodash/get';

import Collapse from '$components/collapse/Collapse';
import Divider from '$components/content/Divider';
import LeaseArea from './LeaseArea';
import RightSubtitle from '$components/content/RightSubtitle';
import {getAreasSum, getContentLeaseAreas, getFullAddress} from '$src/leases/helpers';
import {formatNumber, getAttributeFieldOptions, getLabelOfOption}  from '$util/helpers';
import {getAttributes, getCurrentLease} from '$src/leases/selectors';

import type {Attributes, Lease} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  currentLease: Lease,
}

const LeaseAreas = ({attributes, currentLease}: Props) => {
  const areas = getContentLeaseAreas(currentLease);
  const areasSum = getAreasSum(areas);
  const locationOptions = getAttributeFieldOptions(attributes, 'lease_areas.child.children.location');
  const typeOptions = getAttributeFieldOptions(attributes, 'lease_areas.child.children.type');

  return (
    <div>
      <h2>Vuokra-alue</h2>
      <RightSubtitle
        text={<span>{formatNumber(areasSum) || '-'} m<sup>2</sup></span>}
      />
      <Divider />

      {!areas || !areas.length && <p className='no-margin'>Ei vuokra-alueita</p>}
      {areas && !!areas.length &&
        areas.map((area, index) =>
          <Collapse
            key={index}
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
                    {getFullAddress(get(area, 'addresses[0]')) || '-'}
                  </span>
                </Column>
                <Column>
                  <span className='collapse__header-subtitle'>
                    {formatNumber(areasSum) || '-'} m<sup>2</sup>
                  </span>
                </Column>
                <Column>
                  <span className='collapse__header-subtitle'>
                    {getLabelOfOption(locationOptions, area.location) || '-'}
                  </span>
                </Column>
              </div>
            }
            headerTitle={<h3 className='collapse__header-title'>{area.identifier || '-'}</h3>}
          >
            <LeaseArea area={area} />
          </Collapse>
        )
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
  }
)(LeaseAreas);
