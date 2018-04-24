// @flow
import React from 'react';
import {connect} from 'react-redux';

import BoxItem from '$components/content/BoxItem';
import BoxItemContainer from '$components/content/BoxItemContainer';
import GreenBox from '$components/content/GreenBox';
import InspectionItem from './InspectionItem';
import {getContentInspections} from '$src/leases/helpers';
import {getCurrentLease} from '$src/leases/selectors';

import type {Lease} from '$src/leases/types';

type Props = {
  currentLease: Lease,
}

const Inspections = ({currentLease}: Props) => {
  const inspections = getContentInspections(currentLease);

  return (
    <div>
      <GreenBox>
        {inspections && !!inspections.length
          ? (
            <BoxItemContainer>
              {inspections.map((inspection) =>
                <BoxItem
                  className='no-border-on-first-child'
                  key={inspection.id}>
                  <InspectionItem
                    inspection={inspection}
                  />
                </BoxItem>
              )}
            </BoxItemContainer>
          ) : <p>Ei tarkastuksia tai huomautuksia</p>
        }
      </GreenBox>
    </div>
  );
};

export default connect(
  (state) => {
    return {
      currentLease: getCurrentLease(state),
    };
  },
)(Inspections);
