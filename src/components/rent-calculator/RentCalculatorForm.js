// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {change, formValueSelector, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import moment from 'moment';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';

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
  valid: boolean,
}

type State = {
  billingPeriodOptions: Array<Object>,
}

const validate = values => {
  const errors = {};
  if (!values.start_date) {
    errors.start_date = 'Alkupäivämäärä on pakollinen';
  }
  if (!values.end_date) {
    errors.end_date = 'Loppupäivämäärä on pakollinen';
  } else if(new Date(values.start_date).getFullYear() !== new Date(values.end_date).getFullYear()) {
    errors.end_date = 'Alku- ja loppupäivämäärän tulee olla samana vuonna';
  } else if(!moment(values.end_date).isAfter(moment(values.start_date))) {
    errors.end_date = 'Loppupäivämäärän tulee olla alkupäivämäärän jälkeen';
  }
  return errors;
};

class RentCalculatorForm extends Component<Props, State> {
  state = {
    billingPeriodOptions: [],
  }

  componentWillMount() {
    if(!isEmpty(this.props.billingPeriods)) {
      this.updateBillingPeriodOptions();
    }
  }

  componentDidUpdate(prevProps) {
    if(prevProps.billingPeriods !== this.props.billingPeriods) {
      this.updateBillingPeriodOptions();
    }

    if(prevProps.billingPeriod !== this.props.billingPeriod) {
      this.updateDates();
    }
  }

  updateBillingPeriodOptions = () => {
    const {billingPeriods} = this.props;
    const billingPeriodOptions = this.getBillingPeriodsOptions(billingPeriods);
    this.setState({
      billingPeriodOptions: billingPeriodOptions,
    });

    this.autoselectBillingPeriods(billingPeriodOptions);
  }

  getBillingPeriodsOptions = (billingPeriods: BillingPeriodList) => {
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

  autoselectBillingPeriods = (billingPeriodOptions: Array<Object>) => {
    const {change} = this.props;
    const now = new Date();
    const selected =  billingPeriodOptions.find((item) => {
      return new Date(item.startDate) <= now && new Date(item.endDate) >= now;
    });
    if(selected) {
      change('billing_period', selected.value);
      change('start_date', selected.startDate);
      change('end_date', selected.endDate);
    }
  }

  updateDates = () => {
    const {billingPeriodOptions} = this.state;
    const {billingPeriod, change} = this.props;
    const selected = billingPeriodOptions.find((item) => item.value === billingPeriod);
    if(selected) {
      change('start_date', selected.startDate);
      change('end_date', selected.endDate);
    }
  }

  render() {
    const {billingPeriodOptions} = this.state;

    return (
      <form>
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
              name='start_date'
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
              name='end_date'
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
