// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {FieldArray, getFormValues, reduxForm} from 'redux-form';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';

import ContractItemsEdit from './ContractItemsEdit';
import FormSection from '$components/form/FormSection';
import {receiveFormValidFlags} from '$src/leases/actions';
import {FormNames} from '$src/leases/enums';
import {getContentContracts} from '$src/leases/helpers';
import {getDecisionsOptions} from '$util/helpers';
import {getDecisionsByLease} from '$src/decision/selectors';
import {getAttributes, getCurrentLease, getErrorsByFormName, getIsSaveClicked} from '$src/leases/selectors';

import type {Attributes, Lease} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  currentLease: Lease,
  decisions: Array<Object>,
  errors: ?Object,
  formValues: Object,
  handleSubmit: Function,
  isSaveClicked: boolean,
  receiveFormValidFlags: Function,
  valid: boolean,
}

type State = {
  contractsData: Array<Object>,
  currentLease: ?Lease,
  decisionOptions: Array<Object>,
}

class ContractsEdit extends Component<Props, State> {
  state = {
    currentLease: null,
    contractsData: [],
    decisionOptions: [],
  }

  static getDerivedStateFromProps(props, state) {
    const retObj = {};

    if(props.currentLease !== state.currentLease) {
      retObj.currentLease = props.currentLease,
      retObj.contractsData = getContentContracts(props.currentLease);
    }

    if(props.decisions !== state.decisions) {
      retObj.decisionOptions = getDecisionsOptions(props.decisions);
      retObj.decisions = props.decisions;
    }

    if(!isEmpty(retObj)) {
      return retObj;
    }
    return null;
  }

  componentDidUpdate(prevProps) {
    const {receiveFormValidFlags} = this.props;

    if(prevProps.valid !== this.props.valid) {
      receiveFormValidFlags({
        [FormNames.CONTRACTS]: this.props.valid,
      });
    }
  }

  render() {
    const {attributes, errors, formValues, handleSubmit, isSaveClicked} = this.props;
    const {contractsData, decisionOptions} = this.state;

    return (
      <form onSubmit={handleSubmit}>
        <FormSection>
          <FieldArray
            attributes={attributes}
            component={ContractItemsEdit}
            contractsData={contractsData}
            decisionOptions={decisionOptions}
            errors={errors}
            formValues={formValues}
            isSaveClicked={isSaveClicked}
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
      const currentLease = getCurrentLease(state);
      return {
        attributes: getAttributes(state),
        currentLease: getCurrentLease(state),
        decisions: getDecisionsByLease(state, currentLease.id),
        errors: getErrorsByFormName(state, formName),
        formValues: getFormValues(formName)(state),
        isSaveClicked: getIsSaveClicked(state),
      };
    },
    {
      receiveFormValidFlags,
    },
  ),
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
  }),
)(ContractsEdit);
