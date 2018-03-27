// @flow
import React, {Component} from 'react';
import flowRight from 'lodash/flowRight';
import {connect} from 'react-redux';
import {reduxForm, FieldArray} from 'redux-form';

import {getIsDecisionsFormValid} from '../../../selectors';
import {receiveDecisionsFormValid} from '../../../actions';
import FormSection from '$components/form/FormSection';
import DecisionItemsEdit from './DecisionItemsEdit';

import type {Attributes} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  handleSubmit: Function,
  isDecisionsFormValid: boolean,
  receiveDecisionsFormValid: Function,
  valid: boolean,
}

class DecisionsEdit extends Component {
  props: Props

  componentDidUpdate() {
    const {isDecisionsFormValid, receiveDecisionsFormValid, valid} = this.props;
    if(isDecisionsFormValid !== valid) {
      receiveDecisionsFormValid(valid);
    }
  }

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

export default flowRight(
  connect(
    (state) => {
      return {
        isDecisionsFormValid: getIsDecisionsFormValid(state),
      };
    },
    {
      receiveDecisionsFormValid,
    },
  ),
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
  }),
)(DecisionsEdit);
