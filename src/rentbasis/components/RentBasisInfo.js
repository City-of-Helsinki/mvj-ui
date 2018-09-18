// @flow
import React from 'react';

import FormTextTitle from '$components/form/FormTextTitle';

type Props = {
  identifier: ?string,
}

const RentBasisInfo = ({identifier}: Props) => {
  if(!identifier) {
    return null;
  }

  return (
    <div className='rent-basis-page_info'>
      <FormTextTitle title='Vuokrausperustetunnus' />
      <h1 className='rent-basis-page__info_identifier'>{identifier}</h1>
    </div>
  );
};

export default RentBasisInfo;
