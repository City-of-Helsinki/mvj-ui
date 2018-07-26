// @flow
import React from 'react';
import {connect} from 'react-redux';

import Divider from '$components/content/Divider';
import LeaseArea from './LeaseArea';
import RightSubtitle from '$components/content/RightSubtitle';
import {getAreasSum, getContentLeaseAreas} from '$src/leases/helpers';
import {formatNumber}  from '$util/helpers';
import {getCurrentLease} from '$src/leases/selectors';

import type {Lease} from '$src/leases/types';

type Props = {
  currentLease: Lease,
}

const LeaseAreas = ({currentLease}: Props) => {
  const areas = getContentLeaseAreas(currentLease);
  const areasSum = getAreasSum(areas);

  return (
    <div>
      <h2>Vuokra-alue</h2>
      <RightSubtitle
        text={<span>{formatNumber(areasSum) || '-'} m<sup>2</sup></span>}
      />
      <Divider />

      {!areas || !areas.length && <p className='no-margin'>Ei vuokra-alueita</p>}
      {areas && !!areas.length && areas.map((area, index) =>
        <LeaseArea
          key={index}
          area={area}
        />
      )}
    </div>
  );
};

export default connect(
  (state) => {
    return {
      currentLease: getCurrentLease(state),
    };
  }
)(LeaseAreas);
