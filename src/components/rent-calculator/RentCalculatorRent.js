// @flow
import React from 'react';
import moment from 'moment';
import get from 'lodash/get';

import RentCalculatorExplanation from './RentCalculatorExplanation';

type Props = {
  rent: Object,
}

const Rent = ({rent}: Props) => {
  const getEndDate = (explanations: Array<Object>) => {
    let endDate = null;
    explanations.forEach((explanation) => {
      get(explanation, 'date_ranges', []).forEach((dateRange) => {
        if(dateRange.end_date) {
          if(!endDate) {
            endDate = dateRange.end_date;
          } else if(moment(dateRange.end_date).isAfter(moment(endDate), 'day')) {
            endDate = dateRange.end_date;
          }
        }
      });
    });

    return endDate;
  };

  const explanations = get(rent, 'explanation.items');
  const date = getEndDate(explanations);

  return (
    <div>
      {explanations && explanations.length &&
        explanations.map((explanation, index) => {
          return <RentCalculatorExplanation
            key={index}
            date={date}
            explanation={explanation}
          />;
        })
      }
    </div>
  );
};

export default Rent;
