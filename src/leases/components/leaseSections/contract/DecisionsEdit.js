// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {FieldArray, reduxForm} from 'redux-form';
import flowRight from 'lodash/flowRight';

import {receiveDecisionsFormValid} from '$src/leases/actions';
import {FormNames} from '$src/leases/enums';
import {getIsDecisionsFormValid} from '$src/leases/selectors';
import FormSection from '$components/form/FormSection';
import DecisionItemsEdit from './DecisionItemsEdit';

type Props = {
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
