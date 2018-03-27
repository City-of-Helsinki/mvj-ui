// @flow
import React, {Component} from 'react';
import flowRight from 'lodash/flowRight';
import {connect} from 'react-redux';
import {reduxForm, FieldArray} from 'redux-form';

import FormSection from '$components/form/FormSection';
import InspectionItemsEdit from './InspectionItemsEdit';
import {getIsInspectionsFormValid} from '$src/leases/selectors';
import {receiveInspectionsFormValid} from '$src/leases/actions';

import type {Attributes} from '$src/leases/types';

type Props = {
  attributes: Attributes,
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
    const {attributes, handleSubmit} = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <FormSection>
          <FieldArray
            attributes={attributes}
            component={InspectionItemsEdit}
            name="inspections"
          />
        </FormSection>
      </form>
    );
  }
}

const formName = 'inspections-form';

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
