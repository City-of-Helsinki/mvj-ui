// @flow
import React from 'react';
import get from 'lodash/get';

import RentCalculatorExplanation from './RentCalculatorExplanation';

type Props = {
  rent: Object,
}

const Rent = ({rent}: Props) => {
  const explanations = get(rent, 'explanation.items');

  return (
    <div>
      {explanations && explanations.length &&
        explanations.map((explanation, index) => {
          return <RentCalculatorExplanation
            key={index}
            explanation={explanation}
          />;
        })
      }
    </div>
  );
};

export default Rent;
