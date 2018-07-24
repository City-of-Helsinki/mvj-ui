// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {FieldArray, getFormValues, reduxForm} from 'redux-form';
import flowRight from 'lodash/flowRight';

import FormSection from '$components/form/FormSection';
import DecisionItemsEdit from './DecisionItemsEdit';
import {receiveFormValidFlags} from '$src/leases/actions';
import {FormNames} from '$src/leases/enums';
import {getContentDecisions} from '$src/leases/helpers';
import {getCurrentLease, getErrorsByFormName, getIsSaveClicked} from '$src/leases/selectors';

import type {Lease} from '$src/leases/types';

type Props = {
  currentLease: Lease,
  errors: ?Object,
  formValues: Object,
  handleSubmit: Function,
  isSaveClicked: boolean,
  receiveFormValidFlags: Function,
  valid: boolean,
}

type State = {
  currentLease: ?Lease,
  decisionsData: Array<Object>,
}

class DecisionsEdit extends Component<Props, State> {
  state = {
    currentLease: null,
    decisionsData: [],
  }

  static getDerivedStateFromProps(props, state) {
    if(props.currentLease !== state.currentLease) {
      const decisions = getContentDecisions(props.currentLease);
      return {
        currentLease: props.currentLease,
        decisionsData: decisions,
      };
    }
    return null;
  }

  componentDidUpdate(prevProps) {
    const {receiveFormValidFlags} = this.props;

    if(prevProps.valid !== this.props.valid) {
      receiveFormValidFlags({
        [FormNames.DECISIONS]: this.props.valid,
      });
    }
  }

  render() {
    const {errors, formValues, handleSubmit, isSaveClicked} = this.props,
      {decisionsData} = this.state;

    return (
      <form onSubmit={handleSubmit}>
        <FormSection>
          <FieldArray
            component={DecisionItemsEdit}
            decisionsData={decisionsData}
            errors={errors}
            formValues={formValues}
            isSaveClicked={isSaveClicked}
            name="decisions"
          />
        </FormSection>
      </form>
    );
  }
}

const formName = FormNames.DECISIONS;

export default flowRight(
  connect(
    (state) => {
      return {
        currentLease: getCurrentLease(state),
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
)(DecisionsEdit);
