// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {formValueSelector, isValid} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import Button from '$components/button/Button';
import Rent from './Rent';
import RentCalculatorForm from './RentCalculatorForm';
import {fetchBillingPeriods, fetchRentForPeriodByLease} from '$src/leases/actions';
import {FormNames} from '$components/enums';
import {getCurrentLease, getRentForPeriodByLease} from '$src/leases/selectors';

type Props = {
  endDate: string,
  fetchBillingPeriods: Function,
  fetchRentForPeriodByLease: Function,
  isValid: boolean,
  params: Object,
  rentForPeriod: Object,
  startDate: string,
}

class RentCalculator extends Component<Props> {
  componentWillMount() {
    const {
      fetchBillingPeriods,
      params: {leaseId},
    } = this.props;
    const currentDate = new Date();

    fetchBillingPeriods({
      leaseId: leaseId,
      year: currentDate.getFullYear(),
    });
  }

  handleCalculate = () => {
    const {
      endDate,
      fetchRentForPeriodByLease,
      params: {leaseId},
      startDate,
    } = this.props;
    fetchRentForPeriodByLease({
      endDate: endDate,
      leaseId: leaseId,
      startDate: startDate,
    });
  }

  getRentsForPeriod = () => {
    const {rentForPeriod} = this.props;
    const rents = get(rentForPeriod, 'rents', []);
    return rents;
  }

  render() {
    const {isValid, rentForPeriod} = this.props;
    const rents = this.getRentsForPeriod();


    return (
      <div className='rent-calculator'>
        <Row>
          <Column small={12} medium={6}>
            <RentCalculatorForm />
          </Column>
          <Column small={12} medium={6}>
            <div className='rent-calculator__button-wrapper'>
              <Button
                className='button-green'
                disabled={!isValid}
                label='Laske'
                onClick={this.handleCalculate}
                title='Laske'
              />
            </div>
          </Column>
        </Row>
        {!isEmpty(rentForPeriod) &&
          <Row>
            <Column small={12} medium={6}>
              <div className='rent-calculator__rents-container'>
                {!rents || !rents.length && <p>Ei vuokria</p>}
                {!!rents && !!rents.length &&
                  rents.map((rent, index) => {
                    return (
                      <Rent key={index} rent={rent} />
                    );
                  })
                }
              </div>
            </Column>
          </Row>
        }

      </div>
    );
  }
}

const formName = FormNames.RENT_CALCULATOR;
const selector = formValueSelector(formName);

export default flowRight(
  withRouter,
  connect(
    (state) => {
      const currentLease = getCurrentLease(state);
      return {
        endDate: selector(state, 'end_date'),
        isValid: isValid(formName)(state),
        rentForPeriod: getRentForPeriodByLease(state, currentLease.id),
        startDate: selector(state, 'start_date'),
      };
    },
    {
      fetchBillingPeriods,
      fetchRentForPeriodByLease,
    }
  )
)(RentCalculator);
