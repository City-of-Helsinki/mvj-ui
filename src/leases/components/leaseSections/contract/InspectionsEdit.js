// @flow
import React, {Component} from 'react';
import flowRight from 'lodash/flowRight';
import {connect} from 'react-redux';
import {FieldArray, reduxForm} from 'redux-form';

import InspectionItemsEdit from './InspectionItemsEdit';
import {receiveFormValidFlags} from '$src/leases/actions';
import {FormNames} from '$src/enums';

type Props = {
  handleSubmit: Function,
  receiveFormValidFlags: Function,
  valid: boolean,
}

class InspectionsEdit extends Component<Props> {
  componentDidUpdate(prevProps) {
    const {receiveFormValidFlags} = this.props;

    if(prevProps.valid !== this.props.valid) {
      receiveFormValidFlags({
        [formName]: this.props.valid,
      });
    }
  }

  render() {
    const {handleSubmit} = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <FieldArray
          component={InspectionItemsEdit}
          name="inspections"
        />
      </form>
    );
  }
}

const formName = FormNames.LEASE_INSPECTIONS;

export default flowRight(
  connect(
    null,
    {
      receiveFormValidFlags,
    }
  ),
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
  }),
)(InspectionsEdit);
