// @flow
import React from 'react';
import get from 'lodash/get';

import Explanation from './Explanation';

type Props = {
  rent: Object,
}

const Rent = ({rent}: Props) => {
  const explanations = get(rent, 'explanation.items');

  return (
    <div className='rent-calculator__rent'>
      {explanations && explanations.length &&
        explanations.map((explanation, index) => {
          return <Explanation
            key={index}
            explanation={explanation}
          />;
        })
      }
    </div>
  );
};

export default Rent;
