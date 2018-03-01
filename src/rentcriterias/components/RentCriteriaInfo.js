// @flow
import React from 'react';

type Props = {
  identifier: ?string,
}

const RentCriteriaInfo = ({identifier}: Props) => {
  if(!identifier) {
    return null;
  }

  return (
    <div className='rent-criteria-page__info'>
      <p className='rent-criteria-page__info__label'>Vuokrausperustetunnus</p>
      <p className='rent-criteria-page__info__type'>
        <span className='rent-criteria-page__info__number'>{identifier}</span>
      </p>
    </div>
  );
};

export default RentCriteriaInfo;
