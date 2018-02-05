// @flow
import React from 'react';

import InspectionItem from './InspectionItem';

type Props = {
  inspections: Array<Object>,
}

const Inspections = ({inspections}: Props) => {
  return (
    <div className='lease-section'>
      {inspections &&
      <div className='green-box'>
        {inspections && inspections.map((inspection, index) =>
          <div className='section-item' key={index}>
            <InspectionItem inspection={inspection} />
          </div>)
        }
      </div>}
    </div>
  );
};

export default Inspections;
