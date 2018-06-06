// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {FieldArray, reduxForm} from 'redux-form';
import flowRight from 'lodash/flowRight';

import {receiveFormValidFlags} from '$src/leases/actions';
import {FormNames} from '$src/leases/enums';
import FormSection from '$components/form/FormSection';
import DecisionItemsEdit from './DecisionItemsEdit';

type Props = {
  handleSubmit: Function,
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
    const {handleSubmit} = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <FormSection>
          <FieldArray
            component={DecisionItemsEdit}
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
    null,
    {
      receiveFormValidFlags,
    },
  ),
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
  }),
)(DecisionsEdit);
