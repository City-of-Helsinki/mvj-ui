// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {change, formValueSelector, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import moment from 'moment';
import flowRight from 'lodash/flowRight';

import FormField from '$components/form/FormField';
import {FormNames} from '$components/enums';
import {formatDateRange} from '../../util/helpers';
import {getCurrentLease} from '$src/leases/selectors';
import {getBillingPeriodsByLease} from '$src/billingPeriods/selectors';

import type {BillingPeriodList} from '$src/billingPeriods/types';

type Props = {
  billingPeriods: BillingPeriodList,
  billingPeriod: ?number,
  change: Function,
  onSubmit: Function,
  valid: boolean,
}

type State = {
  billingPeriodOptions: Array<Object>,
  billingPeriods: BillingPeriodList,
}

const validate = values => {
  const errors = {};
  if (!values.billing_start_date) {
    errors.billing_start_date = 'Alkupäivämäärä on pakollinen';
  }

  if (!values.billing_end_date) {
    errors.billing_end_date = 'Loppupäivämäärä on pakollinen';
  } else if(new Date(values.billing_start_date).getFullYear() !== new Date(values.billing_end_date).getFullYear()) {
    errors.billing_end_date = 'Alku- ja loppupäivämäärän tulee olla samana vuonna';
  } else if(!moment(values.billing_end_date).isAfter(moment(values.billing_start_date), 'day')) {
    errors.billing_end_date = 'Loppupäivämäärän tulee olla alkupäivämäärän jälkeen';
  }
  return errors;
};

const getBillingPeriodsOptions = (billingPeriods: BillingPeriodList) => {
  if(!billingPeriods || !billingPeriods.length) {
    return [];
  }

  return billingPeriods.map((item, index) => {
    return {
      value: index,
      label: formatDateRange(item[0], item[1]),
      startDate: item[0],
      endDate: item[1],
    };
  });
};

class RentCalculatorForm extends Component<Props, State> {
  state = {
    billingPeriodOptions: [],
    billingPeriods: [],
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState = {};

    if(props.billingPeriods !== state.billingPeriods) {
      newState.billingPeriods = props.billingPeriods;
      newState.billingPeriodOptions = getBillingPeriodsOptions(props.billingPeriods);
    }

    return newState;
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if(prevProps.billingPeriod !== this.props.billingPeriod) {
      this.updateDates();
    }

    if(prevState.billingPeriodOptions !== this.state.billingPeriodOptions) {
      this.autoselectBillingPeriods(this.state.billingPeriodOptions);
    }
  }

  updateBillingPeriodOptions = () => {
    const {billingPeriodOptions} = this.state;

    this.autoselectBillingPeriods(billingPeriodOptions);
  }

  autoselectBillingPeriods = (billingPeriodOptions: Array<Object>) => {
    const {change} = this.props,
      now = new Date(),
      selected =  billingPeriodOptions.find((item) => {
        return new Date(item.startDate) <= now && new Date(item.endDate) >= now;
      });

    if(selected) {
      change('billing_period', selected.value);
      change('billing_start_date', selected.startDate);
      change('billing_end_date', selected.endDate);
    }
  }

  updateDates = () => {
    const {billingPeriodOptions} = this.state,
      {billingPeriod, change} = this.props,
      selected = billingPeriodOptions.find((item) => item.value === billingPeriod);

    if(selected) {
      change('billing_start_date', selected.startDate);
      change('billing_end_date', selected.endDate);
    }
  }

  handleSubmit = (e: any) => {
    const {onSubmit} = this.props;

    onSubmit();
    e.preventDefault();
  }

  render() {
    const {billingPeriodOptions} = this.state;

    return (
      <form onSubmit={this.handleSubmit}>
        <Row>
          <Column small={6}>
            <FormField
              fieldAttributes={{
                type: 'choice',
                required: false,
              }}
              name='billing_period'
              disableDirty
              overrideValues={{
                label: 'Laskutuskausi',
                options: billingPeriodOptions,
              }}
            />
          </Column>
          <Column small={3}>
            <FormField
              fieldAttributes={{
                type: 'date',
              }}
              name='billing_start_date'
              disableDirty
              overrideValues={{
                label: 'Alkupvm',
              }}
            />
          </Column>
          <Column small={3}>
            <FormField
              fieldAttributes={{
                type: 'date',
              }}
              name='billing_end_date'
              disableDirty
              overrideValues={{
                label: 'Loppupvm',
              }}
            />
          </Column>
        </Row>
      </form>
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
        billingPeriods: getBillingPeriodsByLease(state, currentLease.id),
        billingPeriod: selector(state, 'billing_period'),
      };
    },
    {
      change,
    }
  ),
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
    validate,
  }),
)(RentCalculatorForm);
