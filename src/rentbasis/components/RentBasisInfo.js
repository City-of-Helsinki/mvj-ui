// @flow
import React from 'react';

type Props = {
  identifier: ?string,
}

const RentBasisInfo = ({identifier}: Props) => {
  if(!identifier) {
    return null;
  }

  return (
    <div className='rent-basis-page_info'>
      <p className='rent-basis-page__info_label'>Vuokrausperustetunnus</p>
      <h1 className='rent-basis-page__info_identifier'>{identifier}</h1>
    </div>
  );
};

export default RentBasisInfo;
