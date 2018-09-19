// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {change, formValueSelector, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';

import FormField from '$components/form/FormField';
import {FormNames} from '$components/enums';
import {getCurrentLease} from '$src/leases/selectors';
import {getBillingPeriodsByLease} from '$src/billingPeriods/selectors';
import {integer} from '$components/form/validations';

type Props = {
  handleSubmit: Function,
  onSubmit: Function,
};

const validate = values => {
  const errors = {};
  if (!values.invoice_simulator_year) {
    return integer(values.invoice_simulator_year);
  }
  return errors;
};

class InvoiceSimulatorForm extends Component<Props> {
  render() {
    const {handleSubmit, onSubmit} = this.props;
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Column small={12}>
            <FormField
              fieldAttributes={{
                type: 'integer',
                required: false,
              }}
              name='invoice_simulator_year'
              disableDirty
              overrideValues={{
                label: 'Vuosi',
              }}
            />
          </Column>
        </Row>
      </form>
    );
  }
}

const formName = FormNames.INVOICE_SIMULATOR;
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
)(InvoiceSimulatorForm);
