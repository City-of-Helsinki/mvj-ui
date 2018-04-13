// @flow
import React from 'react';

import BoxItem from '$components/content/BoxItem';
import BoxItemContainer from '$components/content/BoxItemContainer';
import GreenBox from '$components/content/GreenBox';
import InspectionItem from './InspectionItem';

type Props = {
  inspections: Array<Object>,
}

const Inspections = ({inspections}: Props) => {
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

export default Inspections;
