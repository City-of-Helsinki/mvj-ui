// @flow
import React from 'react';

import * as utilHelpers from '$util/helpers';

type Props = {
  leaseInfo: Object,
}

const LeaseInfo = ({leaseInfo}: Props) => {
  if(!LeaseInfo) {
    return null;
  }
  const dateRange = utilHelpers.formatDateRange(leaseInfo.start_date, leaseInfo.end_date);
  return (
    <div className='lease-info'>
      <div className='lease-info__identifier-wrapper'>
        <p className='lease-info__label'>Vuokratunnus</p>
        <p className='lease-info__type'>
          <h1 className='lease-info__number'>{leaseInfo.identifier || '-'}</h1>
        </p>
      </div>
      {dateRange &&
        <div className='lease-info__date-wrapper'>
          <p className='lease-info__date'>Vuokraus ajalle {dateRange}</p>
        </div>
      }
    </div>
  );
};

export default LeaseInfo;
