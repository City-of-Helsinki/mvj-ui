// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {formValueSelector, isValid} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';

import Button from '$components/button/Button';
import Loader from '$components/loader/Loader';
import LoaderWrapper from '$components/loader/LoaderWrapper';
import RentCalculatorForm from './RentCalculatorForm';
import RentForPeriod from './RentForPeriod';
import {fetchBillingPeriodsByLease} from '$src/billingPeriods/actions';
import {deleteRentForPeriodByLease, fetchRentForPeriodByLease, receiveIsSaveClicked} from '$src/rentForPeriod/actions';
import {ButtonColors, FormNames, RentCalculatorTypes} from '$components/enums';
import {
  getBillingPeriodsByLease,
  getMethods as getBillingPeriodMethods,
} from '$src/billingPeriods/selectors';
import {getCurrentLease} from '$src/leases/selectors';
import {
  getIsFetching,
  getIsSaveClicked,
  getMethods as getRentForPeriodMethods,
  getRentForPeriodArrayByLease,
} from '$src/rentForPeriod/selectors';

import type {Methods} from '$src/types';
import type {Lease} from '$src/leases/types';
import type {RentForPeriodId} from '$src/rentForPeriod/types';

let rentForPeriodId = 1;

type Props = {
  billingPeriod: number,
  billingPeriods: Array<Object>,
  billingPeriodMethods: Methods,
  currentLease: Lease,
  deleteRentForPeriodByLease: Function,
  endDate: string,
  fetchBillingPeriodsByLease: Function,
  fetchRentForPeriodByLease: Function,
  fetching: boolean,
  receiveIsSaveClicked: Function,
  rentForPeriodArray: Array<Object>,
  rentForPeriodMethods: Methods,
  saveClicked: boolean,
  startDate: string,
  type: string,
  valid: boolean,
  year: string,
}

class RentCalculator extends Component<Props> {
  componentDidMount() {
    const {billingPeriodMethods, rentForPeriodArray, rentForPeriodMethods} = this.props;

    if(billingPeriodMethods.GET) {
      this.fetchBillingPeriods();
    }

    if(rentForPeriodMethods.GET && (!rentForPeriodArray || !rentForPeriodArray.length)) {
      this.fetchDefaultRentForPeriod();
    }
  }

  fetchBillingPeriods = () => {
    const {currentLease, fetchBillingPeriodsByLease} = this.props;
    const year = new Date().getFullYear();

    fetchBillingPeriodsByLease({
      leaseId: currentLease.id,
      year: year,
    });
  }

  fetchDefaultRentForPeriod = () => {
    const {currentLease, fetchRentForPeriodByLease} = this.props,
      year = new Date().getFullYear(),
      startDate = `${year}-01-01`,
      endDate = `${year}-12-31`;

    fetchRentForPeriodByLease({
      id: rentForPeriodId++,
      allowDelete: false,
      rentCalculatorType: RentCalculatorTypes.YEAR,
      endDate: endDate,
      leaseId: currentLease.id,
      startDate: startDate,
    });
  }

  handleCreateRentsForPeriod = () => {
    const {
      billingPeriod,
      billingPeriods,
      currentLease,
      endDate,
      fetchRentForPeriodByLease,
      receiveIsSaveClicked,
      startDate,
      type,
      valid,
      year,
    } = this.props;
    let requestStartDate, requestEndDate;

    switch (type) {
      case RentCalculatorTypes.YEAR:
        requestStartDate = `${year}-01-01`;
        requestEndDate = `${year}-12-31`;
        break;
      case RentCalculatorTypes.RANGE:
        requestStartDate = startDate;
        requestEndDate = endDate;
        break;
      case RentCalculatorTypes.BILLING_PERIOD:
        if(billingPeriods.length > billingPeriod) {
          requestStartDate = billingPeriods[billingPeriod][0];
          requestEndDate = billingPeriods[billingPeriod][1];
        }
        break;
    }

    receiveIsSaveClicked(true);

    if(valid) {
      fetchRentForPeriodByLease({
        id: rentForPeriodId++,
        allowDelete: true,
        rentCalculatorType: type,
        endDate: requestEndDate,
        leaseId: currentLease.id,
        startDate: requestStartDate,
      });
    }
  }

  handleRentForPeriodDelete = (id: RentForPeriodId) => {
    const {currentLease, deleteRentForPeriodByLease} = this.props;

    deleteRentForPeriodByLease({
      id: id,
      leaseId: currentLease.id,
    });
  }

  render() {
    const {fetching, rentForPeriodArray, rentForPeriodMethods, saveClicked, valid} = this.props;

    if(!rentForPeriodMethods.GET) return null;

    return (
      <div className='rent-calculator'>
        <span className='rent-calculator__title'>Vuokra ajalle</span>
        <Row>
          <Column small={12} medium={6} large={4}>
            <RentCalculatorForm
              onSubmit={this.handleCreateRentsForPeriod}
              showErrors={saveClicked}
            />
          </Column>
          <Column small={12} medium={6} large={8}>
            <div className='rent-calculator__button-wrapper'>
              <Button
                className={`${ButtonColors.SUCCESS} no-margin`}
                disabled={fetching || (saveClicked && !valid)}
                onClick={this.handleCreateRentsForPeriod}
                text='Laske'
              />
            </div>
          </Column>
        </Row>
        <Row>
          <Column>
            {rentForPeriodArray && !!rentForPeriodArray.length && rentForPeriodArray.map((rentForPeriod, index) => {
              return <RentForPeriod
                key={index}
                onRemove={this.handleRentForPeriodDelete}
                rentForPeriod={rentForPeriod}
              />;
            })}
          </Column>
        </Row>
        {fetching &&
          <LoaderWrapper>
            <Loader isLoading={fetching} />
          </LoaderWrapper>
        }
      </div>
    );
  }
}

const formName = FormNames.RENT_CALCULATOR;
const selector = formValueSelector(formName);

export default flowRight(
  connect(
    (state) => {
      const currentLease = getCurrentLease(state);

      return {
        billingPeriod: selector(state, 'billing_period'),
        billingPeriods: getBillingPeriodsByLease(state, currentLease.id),
        billingPeriodMethods: getBillingPeriodMethods(state),
        currentLease: currentLease,
        endDate: selector(state, 'billing_end_date'),
        fetching: getIsFetching(state),
        rentForPeriodArray: getRentForPeriodArrayByLease(state, currentLease.id),
        rentForPeriodMethods: getRentForPeriodMethods(state),
        saveClicked: getIsSaveClicked(state),
        startDate: selector(state, 'billing_start_date'),
        type: selector(state, 'type'),
        valid: isValid(formName)(state),
        year: selector(state, 'year'),
      };
    },
    {
      deleteRentForPeriodByLease,
      fetchBillingPeriodsByLease,
      fetchRentForPeriodByLease,
      receiveIsSaveClicked,
    }
  )
)(RentCalculator);
