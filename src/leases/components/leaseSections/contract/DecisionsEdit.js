// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {FieldArray, reduxForm} from 'redux-form';
import flowRight from 'lodash/flowRight';

import FormSection from '$components/form/FormSection';
import DecisionItemsEdit from './DecisionItemsEdit';
import {receiveFormValidFlags} from '$src/leases/actions';
import {FormNames} from '$src/leases/enums';
import {getErrorsByFormName, getIsSaveClicked} from '$src/leases/selectors';

type Props = {
  errors: ?Object,
  handleSubmit: Function,
  isSaveClicked: boolean,
  receiveFormValidFlags: Function,
  valid: boolean,
}

class DecisionsEdit extends Component<Props> {
  componentDidUpdate(prevProps) {
    const {receiveFormValidFlags} = this.props;

    if(prevProps.valid !== this.props.valid) {
      receiveFormValidFlags({
        [FormNames.DECISIONS]: this.props.valid,
      });
    }
  }

  render() {
    const {errors, handleSubmit, isSaveClicked} = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <FormSection>
          <FieldArray
            component={DecisionItemsEdit}
            errors={errors}
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
)(DecisionsEdit);
