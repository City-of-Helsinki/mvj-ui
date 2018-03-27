// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';
import {reduxForm, FieldArray} from 'redux-form';

import ContractItemsEdit from './ContractItemsEdit';
import FormSection from '$components/form/FormSection';
import {getIsContractsFormValid} from '$src/leases/selectors';
import {receiveContractsFormValid} from '$src/leases/actions';

import type {Attributes} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  decisionOptions: Array<Object>,
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
    const {
      attributes,
      decisionOptions,
      handleSubmit,
    } = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <FormSection>
          <FieldArray
            attributes={attributes}
            component={ContractItemsEdit}
            decisionOptions={decisionOptions}
            name="contracts"
          />
        </FormSection>
      </form>
    );
  }
}

const formName = 'contracts-form';

export default flowRight(
  connect(
    (state) => {
      return {
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
