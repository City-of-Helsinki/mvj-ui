// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {FieldArray, reduxForm} from 'redux-form';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';

import ContractItemsEdit from './ContractItemsEdit';
import FormSection from '$components/form/FormSection';
import {receiveFormValidFlags} from '$src/leases/actions';
import {FormNames} from '$src/leases/enums';
import {getDecisionsOptions} from '$util/helpers';
import {getDecisionsByLease} from '$src/decision/selectors';
import {getAttributes, getCurrentLease, getErrorsByFormName, getIsSaveClicked} from '$src/leases/selectors';

import type {Attributes} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  decisions: Array<Object>,
  errors: ?Object,
  handleSubmit: Function,
  isSaveClicked: boolean,
  receiveFormValidFlags: Function,
  valid: boolean,
}

type State = {
  decisionOptions: Array<Object>,
}

class ContractsEdit extends Component<Props, State> {
  state = {
    decisionOptions: [],
  }

  static getDerivedStateFromProps(props, state) {
    const retObj = {};

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
    const {attributes, errors, handleSubmit, isSaveClicked} = this.props;
    const {decisionOptions} = this.state;

    return (
      <form onSubmit={handleSubmit}>
        <FormSection>
          <FieldArray
            attributes={attributes}
            component={ContractItemsEdit}
            decisionOptions={decisionOptions}
            errors={errors}
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
        decisions: getDecisionsByLease(state, currentLease.id),
        errors: getErrorsByFormName(state, formName),
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
