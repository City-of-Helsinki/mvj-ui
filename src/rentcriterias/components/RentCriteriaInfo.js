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
        <h1 className='rent-criteria-page__info__number'>{identifier}</h1>
      </p>
    </div>
  );
};

export default RentCriteriaInfo;
