// @flow
import React, {Component} from 'react';
import flowRight from 'lodash/flowRight';
import {connect} from 'react-redux';
import {FieldArray, reduxForm} from 'redux-form';

import FormSection from '$components/form/FormSection';
import InspectionItemsEdit from './InspectionItemsEdit';
import {receiveInspectionsFormValid} from '$src/leases/actions';
import {FormNames} from '$src/leases/enums';
import {getIsInspectionsFormValid} from '$src/leases/selectors';

type Props = {
  handleSubmit: Function,
  isInspectionsFormValid: boolean,
  receiveInspectionsFormValid: Function,
  valid: boolean,
}

class InspectionsEdit extends Component {
  props: Props

  componentDidUpdate() {
    const {isInspectionsFormValid, receiveInspectionsFormValid, valid} = this.props;
    if(isInspectionsFormValid !== valid) {
      receiveInspectionsFormValid(valid);
    }
  }

  render() {
    const {handleSubmit} = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <FormSection>
          <FieldArray
            component={InspectionItemsEdit}
            name="inspections"
          />
        </FormSection>
      </form>
    );
  }
}

const formName = FormNames.INSPECTION;

export default flowRight(
  connect(
    (state) => {
      return {
        isInspectionsFormValid: getIsInspectionsFormValid(state),
      };
    },
    {
      receiveInspectionsFormValid,
    }
  ),
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
  }),
)(InspectionsEdit);
