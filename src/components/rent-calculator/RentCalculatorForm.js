// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {change, formValueSelector, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';

import FormField from '$components/form/FormField';
import {FormNames} from '$components/enums';
import {formatDateRange} from '../../util/helpers';
import {getBillingPeriods} from '$src/leases/selectors';

import type {BillingPeriodList} from '$src/leases/types';

type Props = {
  billingPeriods: BillingPeriodList,
  billingPeriod: ?number,
  change: Function,
  startDate: string,
  valid: boolean,
}

type State = {
  billingPeriodOptions: Array<Object>,
}

class RentCalculatorForm extends Component<Props, State> {
  state = {
    billingPeriodOptions: [],
  }

  componentWillMount() {
    if(!isEmpty(this.props.billingPeriods)) {
      this.setState({
        billingPeriodOptions: this.getBillingPeriodsOptions(this.props.billingPeriods),
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.billingPeriods !== this.props.billingPeriods) {
      this.setState({
        billingPeriodOptions: this.getBillingPeriodsOptions(this.props.billingPeriods),
      });
    }

    if(prevState.billingPeriodOptions !== this.state.billingPeriodOptions) {
      const {billingPeriodOptions} = this.state;
      const {change} = this.props;
      const now = new Date();
      const selected =  billingPeriodOptions.find((item) => new Date(item.startDate) <= now && new Date(item.endDate) >= now);
      if(selected) {
        change('billing_period', selected.value);
      }
    }

    if(prevProps.billingPeriod !== this.props.billingPeriod) {
      const {billingPeriodOptions} = this.state;
      const {billingPeriod, change} = this.props;
      const selected =  billingPeriodOptions.find((item) => item.value === billingPeriod);
      if(selected) {
        change('start_date', selected.startDate);
        change('end_date', selected.endDate);
      }
    }
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

  render() {
    const {billingPeriodOptions} = this.state;
    const {startDate} = this.props;

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
                required: true,
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
                required: true,
              }}
              name='end_date'
              disableDirty
              validate={(value) => {
                if(!startDate) {
                  return undefined;
                } else {
                  if(new Date(value).getFullYear() !== new Date(startDate).getFullYear()) {
                    return 'Alku- ja loppupäivät tulee olla samana vuonna';
                  }else if(new Date(value) < new Date(startDate)) {
                    return 'Loppupäivä ei voi olla ennen alkupäivää';
                  }
                }
              }}
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
      return {
        billingPeriods: getBillingPeriods(state),
        billingPeriod: selector(state, 'billing_period'),
        startDate: selector(state, 'start_date'),
      };
    },
    {
      change,
    }
  ),
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
  }),
)(RentCalculatorForm);
