// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {change, Field, formValueSelector, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';

import ErrorField from '$components/form/ErrorField';
import FormField from '$components/form/FormField';
import {FormNames, RentCalculatorTypes} from '$components/enums';
import {validateRentCalculatorForm} from '$components/formValidations';
import {formatDateRange} from '$util/helpers';
import {getCurrentYear} from '$util/date';
import {getCurrentLease} from '$src/leases/selectors';
import {getBillingPeriodsByLease} from '$src/billingPeriods/selectors';

import type {BillingPeriodList} from '$src/billingPeriods/types';

type Props = {
  billingPeriod: ?number,
  billingPeriods: BillingPeriodList,
  change: Function,
  onSubmit: Function,
  showErrors: boolean,
  type: string,
  valid: boolean,
}

type State = {
  billingPeriodOptions: Array<Object>,
  billingPeriods: BillingPeriodList,
}

const getBillingPeriodsOptions = (billingPeriods: BillingPeriodList) => {
  if(!billingPeriods || !billingPeriods.length) return [];

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

  componentDidMount() {
    const {billingPeriodOptions} = this.state;

    if(billingPeriodOptions.length) {
      this.autoselectBillingPeriod(billingPeriodOptions);
    }

    this.setDefaultValues();
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if(prevState.billingPeriodOptions !== this.state.billingPeriodOptions) {
      this.autoselectBillingPeriod(this.state.billingPeriodOptions);
    }
  }

  setDefaultValues = () => {
    const {change} = this.props;

    const currentYear = getCurrentYear();

    change('type', RentCalculatorTypes.YEAR);
    change('year', currentYear);
    change('billing_start_date', `${currentYear}-01-01`);
    change('billing_end_date', `${currentYear}-12-31`);
  }

  autoselectBillingPeriod = (billingPeriodOptions: Array<Object>) => {
    const {change} = this.props,
      now = new Date(),
      selected =  billingPeriodOptions.find((item) => new Date(item.startDate) <= now && new Date(item.endDate) >= now);

    if(selected) {
      change('billing_period', selected.value);
    }
  }

  handleSubmit = (e: any) => {
    const {onSubmit} = this.props;

    onSubmit();
    e.preventDefault();
  }

  getRequestOptions = () => {
    const {showErrors, type} = this.props;
    const {billingPeriodOptions} = this.state;

    return [{
      value: RentCalculatorTypes.YEAR,
      label: 'Vuosi',
      labelStyles: {minWidth: '115px'},
      field: <FormField
        fieldAttributes={{
          label: 'Vuosi',
          type: 'string',
          read_only: false,
        }}
        name='year'
        disabled={type !== RentCalculatorTypes.YEAR}
        disableDirty
        invisibleLabel
      />,
      fieldStyles: {width: '180px'},
      errorField: <Field
        name='yearErrors'
        component={ErrorField}
        showError={showErrors}
        style={{marginTop: '-10px'}}
      />,
      errorFieldStyles: {width: '180px'},
    },
    {
      value: RentCalculatorTypes.RANGE,
      label: 'Aikaväli',
      labelStyles: {minWidth: '115px'},
      field: <Row>
        <Column small={6}>
          <FormField
            fieldAttributes={{
              label: 'Alkupvm',
              type: 'date',
              read_only: false,
            }}
            name='billing_start_date'
            disabled={type !== RentCalculatorTypes.RANGE}
            disableDirty
            invisibleLabel
          />
        </Column>
        <Column small={6}>
          <FormField
            className='with-dash'
            fieldAttributes={{
              label: 'Loppupvm',
              type: 'date',
              read_only: false,
            }}
            name='billing_end_date'
            disabled={type !== RentCalculatorTypes.RANGE}
            disableDirty
            invisibleLabel
          />
        </Column>
      </Row>,
      fieldStyles: {width: '180px'},
      errorField: <Field
        name='rangeErrors'
        component={ErrorField}
        showError={showErrors}
        style={{marginTop: '-10px'}}
      />,
      errorFieldStyles: {width: '180px'},
    },
    {
      value: RentCalculatorTypes.BILLING_PERIOD,
      label: 'Laskutuskausi',
      labelStyles: {minWidth: '115px'},
      field: <FormField
        fieldAttributes={{
          label: 'Laskutuskausi',
          type: 'choice',
          read_only: false,
        }}
        name='billing_period'
        disabled={type !== RentCalculatorTypes.BILLING_PERIOD}
        disableDirty
        disableTouched={showErrors}
        invisibleLabel
        overrideValues={{
          options: billingPeriodOptions,
        }}
      />,
      fieldStyles: {width: '180px'},
      errorField: <Field
        name='billingPeriodErrors'
        component={ErrorField}
        showError={true}
        style={{marginTop: '-10px'}}
      />,
      errorFieldStyles: {width: '180px'},
    }];
  }

  render() {
    const requestOptions = this.getRequestOptions();

    return (
      <div onSubmit={this.handleSubmit}>
        <Row>
          <Column>
            <FormField
              fieldAttributes={{
                label: 'Laskelman tyyppi',
                type: 'radio-with-field',
                required: true,
                read_only: false,
              }}
              name='type'
              invisibleLabel
              disableDirty
              overrideValues={{
                options: requestOptions,
              }}
            />
          </Column>
        </Row>
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
        type: selector(state, 'type'),
      };
    },
    {
      change,
    }
  ),
  reduxForm({
    form: formName,
    validate: validateRentCalculatorForm,
  }),
)(RentCalculatorForm);
