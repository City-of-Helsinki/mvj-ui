// @flow
import React, {Component} from 'react';
import flowRight from 'lodash/flowRight';
import {connect} from 'react-redux';
import {FieldArray, reduxForm} from 'redux-form';

import FormSection from '$components/form/FormSection';
import InspectionItemsEdit from './InspectionItemsEdit';
import {receiveFormValidFlags} from '$src/leases/actions';
import {FormNames} from '$src/leases/enums';
import {getAttributes, getIsSaveClicked} from '$src/leases/selectors';

import type {Attributes} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  handleSubmit: Function,
  isSaveClicked: boolean,
  receiveFormValidFlags: Function,
  valid: boolean,
}

class InspectionsEdit extends Component<Props> {
  componentDidUpdate(prevProps) {
    const {receiveFormValidFlags} = this.props;

    if(prevProps.valid !== this.props.valid) {
      receiveFormValidFlags({
        [FormNames.INSPECTIONS]: this.props.valid,
      });
    }
  }

  render() {
    const {attributes, handleSubmit, isSaveClicked} = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <FormSection>
          <FieldArray
            attributes={attributes}
            component={InspectionItemsEdit}
            isSaveClicked={isSaveClicked}
            name="inspections"
          />
        </FormSection>
      </form>
    );
  }
}

const formName = FormNames.INSPECTIONS;

export default flowRight(
  connect(
    (state) => {
      return {
        attributes: getAttributes(state),
        isSaveClicked: getIsSaveClicked(state),
      };
    },
    {
      receiveFormValidFlags,
    }
  ),
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
  }),
)(InspectionsEdit);
