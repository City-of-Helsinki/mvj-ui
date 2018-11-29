// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import FormText from '$components/form/FormText';
import RemoveButton from '$components/form/RemoveButton';
import RentCalculatorRent from './RentCalculatorRent';
import RentCalculatorTotalRow from './RentCalculatorTotalRow';
import {RentCalculatorTypeOptions} from '$components/constants';
import {DeleteRentForPeriodTexts, RentCalculatorTypes} from '$components/enums';
import {formatDateRange, getLabelOfOption} from '$util/helpers';

type Props = {
  onRemove: Function,
  rentForPeriod: Object,
};

const RentForPeriod = ({onRemove, rentForPeriod}: Props) => {

  const getTitle = () => {
    switch (rentForPeriod.rentCalculatorType) {
      case RentCalculatorTypes.YEAR:
        return `${getLabelOfOption(RentCalculatorTypeOptions, rentForPeriod.rentCalculatorType)} ${new Date(rentForPeriod.start_date).getFullYear()}`;
      case RentCalculatorTypes.RANGE:
      case RentCalculatorTypes.BILLING_PERIOD:
        return `${getLabelOfOption(RentCalculatorTypeOptions, rentForPeriod.rentCalculatorType)} ${formatDateRange(rentForPeriod.start_date, rentForPeriod.end_date)}`;
    }
  };

  const rents = get(rentForPeriod, 'rents', []);
  const title = getTitle();

  return(
    <AppConsumer>
      {({dispatch}) => {
        const handleRemove = () => {
          dispatch({
            type: ActionTypes.SHOW_CONFIRMATION_MODAL,
            confirmationFunction: () => {
              onRemove(rentForPeriod.id);
            },
            confirmationModalButtonText: DeleteRentForPeriodTexts.BUTTON,
            confirmationModalLabel: DeleteRentForPeriodTexts.LABEL,
            confirmationModalTitle: DeleteRentForPeriodTexts.TITLE,
          });
        };

        return(
          <div className='rent-calculator__rent-wrapper'>
            <div className='rent-calculator__rent-inner-wrapper'>
              <span className='rent-calculator__rent-title'>{title}</span>
              {rentForPeriod.allowDelete &&
                <RemoveButton
                  className='position-topright'
                  onClick={handleRemove}
                  title='Poista'
                />
              }
              {(!rents || !rents.length) && <FormText className='no-margin'>Ei vuokria</FormText>}
              {!!rents && !!rents.length &&
                <Row>
                  <Column small={12} large={8}>
                    {rents.map((rent, index) => {
                      return (
                        <RentCalculatorRent
                          key={index}
                          rent={rent}
                        />
                      );
                    })}
                    <RentCalculatorTotalRow rents={rents} />
                  </Column>
                </Row>
              }
            </div>
          </div>
        );
      }}
    </AppConsumer>
  );
};

export default RentForPeriod;
