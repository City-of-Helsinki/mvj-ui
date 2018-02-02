// @flow
import React from 'react';

import * as utilHelpers from '../../../../util/helpers';

type Props = {
  startDate: ?string,
  endDate: ?string,
  identifier: ?string,
}

const LeaseInfo = ({startDate, endDate, identifier}: Props) => {
  if(!identifier) {
    return null;
  }
  console.log(endDate);
  const dateRange = utilHelpers.formatDateRange(startDate, endDate);
  return (
    <div className='lease-info'>
      <p className='lease-info__label'>Vuokratunnus</p>
      <p className='lease-info__type'>
        <span className='lease-info__number'>{identifier}</span>
        {dateRange && <span className='lease-info__date'>Vuokraus ajalle {dateRange}</span>}
      </p>
    </div>
  );
};

export default LeaseInfo;
