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
      <p className='lease-info__label'>Vuokratunnus</p>
      <p className='lease-info__type'>
        <span className='lease-info__number'>{leaseInfo.identifier || '-'}</span>
        {dateRange && <span className='lease-info__date'>Vuokraus ajalle {dateRange}</span>}
      </p>
    </div>
  );
};

export default LeaseInfo;
