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
import Loader from '../loader/Loader';
import LoaderWrapper from '../loader/LoaderWrapper';
import Rent from './Rent';
import RentCalculatorForm from './RentCalculatorForm';
import TotalRow from './TotalRow';
import {fetchBillingPeriodsByLease} from '$src/billingPeriods/actions';
import {fetchRentForPeriodByLease} from '$src/rentForPeriod/actions';
import {FormNames} from '$components/enums';
import {getCurrentLease} from '$src/leases/selectors';
import {getIsFetching, getRentForPeriodByLease} from '$src/rentForPeriod/selectors';

import type {Lease} from '$src/leases/types';

type Props = {
  currentLease: Lease,
  endDate: string,
  fetchBillingPeriodsByLease: Function,
  fetchRentForPeriodByLease: Function,
  isFetching: boolean,
  isValid: boolean,
  params: Object,
  rentForPeriod: Object,
  startDate: string,
}

class RentCalculator extends Component<Props> {
  componentWillMount() {
    this.updateBillingPeriods();
  }

  componentDidUpdate(prevProps) {
    if(prevProps.currentLease !== this.props.currentLease) {
      this.updateBillingPeriods();
    }
  }

  updateBillingPeriods = () => {
    const {
      fetchBillingPeriodsByLease,
      params: {leaseId},
    } = this.props;
    const currentDate = new Date();

    fetchBillingPeriodsByLease({
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
    const {isFetching, isValid, rentForPeriod} = this.props;
    const rents = this.getRentsForPeriod();

    return (
      <div className='rent-calculator'>
        <Row>
          <Column small={12} large={6}>
            <RentCalculatorForm />
          </Column>
          <Column small={12} large={6}>
            <div className='rent-calculator__button-wrapper'>
              <Button
                className='button-green no-margin'
                disabled={!isValid}
                label='Laske'
                onClick={this.handleCalculate}
                title='Laske'
              />
            </div>
          </Column>
        </Row>
        {(!isEmpty(rentForPeriod) || isFetching) &&
          <Row>
            <Column small={12} large={6}>
              <div className='rent-calculator__rents-container'>
                {isFetching &&
                  <LoaderWrapper className='relative-overlay-wrapper'>
                    <Loader isLoading={isFetching} />
                  </LoaderWrapper>
                }
                <div>
                  {!isFetching && (!rents || !rents.length) && <p className='no-margin'>Ei vuokria</p>}
                  {!!rents && !!rents.length &&
                    <div>
                      {rents.map((rent, index) => {
                        return (
                          <Rent
                            key={index}
                            rent={rent}
                          />
                        );
                      })}
                      <TotalRow rents={rents} />
                    </div>
                  }
                </div>
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
    (state, props) => {
      const {params: {leaseId}} = props;

      return {
        currentLease: getCurrentLease(state),
        endDate: selector(state, 'end_date'),
        isFetching: getIsFetching(state),
        isValid: isValid(formName)(state),
        rentForPeriod: getRentForPeriodByLease(state, leaseId),
        startDate: selector(state, 'start_date'),
      };
    },
    {
      fetchBillingPeriodsByLease,
      fetchRentForPeriodByLease,
    }
  )
)(RentCalculator);
