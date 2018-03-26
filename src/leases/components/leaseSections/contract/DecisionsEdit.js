// @flow
import React, {Component} from 'react';
import flowRight from 'lodash/flowRight';
import {connect} from 'react-redux';
import {formValueSelector, reduxForm, FieldArray} from 'redux-form';

import FormSection from '$components/form/FormSection';
import DecisionItemsEdit from './DecisionItemsEdit';

import type {Attributes} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  handleSubmit: Function,
}

class DecisionsEdit extends Component {
  props: Props

  render() {
    const {attributes, handleSubmit} = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <FormSection>
          <FieldArray
            attributes={attributes}
            component={DecisionItemsEdit}
            name="decisions"
          />
        </FormSection>
      </form>
    );
  }
}

const formName = 'decisions-form';
const selector = formValueSelector(formName);

export default flowRight(
  connect(
    (state) => {
      return {
        decisions: selector(state, 'decisions'),
      };
    }
  ),
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
  }),
)(DecisionsEdit);
