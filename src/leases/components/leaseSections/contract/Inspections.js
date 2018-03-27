// @flow
import React from 'react';

import GreenBox from '$components/content/GreenBox';
import GreenBoxItem from '$components/content/GreenBoxItem';
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
            <div>
              {inspections.map((inspection) =>
                <GreenBoxItem
                  className='no-border-on-first-child'
                  key={inspection.id}>
                  <InspectionItem
                    inspection={inspection}
                  />
                </GreenBoxItem>
              )}
            </div>
          ) : <p className='no-margin'>Ei tarkastuksia tai huomautuksia</p>
        }
      </GreenBox>
    </div>
  );
};

export default Inspections;
