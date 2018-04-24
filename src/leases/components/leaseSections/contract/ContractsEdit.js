// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';
import {FieldArray, getFormInitialValues, reduxForm} from 'redux-form';

import ContractItemsEdit from './ContractItemsEdit';
import FormSection from '$components/form/FormSection';
import {receiveContractsFormValid} from '$src/leases/actions';
import {FormNames} from '$src/leases/enums';
import {getIsContractsFormValid} from '$src/leases/selectors';

type Props = {
  handleSubmit: Function,
  isContractsFormValid: boolean,
  receiveContractsFormValid: Function,
  valid: boolean,
}

class ContractsEdit extends Component {
  props: Props

  componentDidUpdate() {
    const {isContractsFormValid, receiveContractsFormValid, valid} = this.props;
    if(isContractsFormValid !== valid) {
      receiveContractsFormValid(valid);
    }
  }

  render() {
    const {handleSubmit} = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <FormSection>
          <FieldArray
            component={ContractItemsEdit}
            name="contracts"
          />
        </FormSection>
      </form>
    );
  }
}

const formName = FormNames.CONTRACTS;

export default flowRight(
  connect(
    (state) => {
      return {
        initialValues: getFormInitialValues(formName)(state),
        isContractsFormValid: getIsContractsFormValid(state),
      };
    },
    {
      receiveContractsFormValid,
    },
  ),
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
  }),
)(ContractsEdit);
