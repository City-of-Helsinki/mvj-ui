// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {FieldArray, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';

import FormField from '$components/form/FormField';
import GreenBox from '$components/content/GreenBox';
import LeaseItemsEdit from './LeaseItemsEdit';
import {receiveFormValidFlags} from '$src/infillDevelopment/actions';
import {FormNames} from '$src/infillDevelopment/enums';
import {getAttributes, getFormInitialValues} from '$src/infillDevelopment/selectors';

import type {Attributes} from '$src/infillDevelopment/types';

type Props = {
  attributes: Attributes,
  isSaveClicked: boolean,
  receiveFormValidFlags: Function,
  valid: boolean,
};

class InfillDevelopmentForm extends Component<Props> {
  componentDidUpdate(prevProps) {
    const {receiveFormValidFlags} = this.props;

    if(prevProps.valid !== this.props.valid) {
      receiveFormValidFlags({
        [FormNames.INFILL_DEVELOPMENT]: this.props.valid,
      });
    }
  }

  render() {
    const {attributes, isSaveClicked} = this.props;

    return (
      <form>
        <GreenBox>
          <Row>
            <Column small={6} medium={4} large={2}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(attributes, 'project_name')}
                name='project_name'
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(attributes, 'plan_number')}
                name='plan_number'
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(attributes, 'plan_reference_number')}
                name='plan_reference_number'
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(attributes, 'state')}
                name='state'
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(attributes, 'decision_type')}
                name='decision_type'
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(attributes, 'state_date')}
                name='state_date'
              />
            </Column>
          </Row>
          <Row>
            <Column small={6} medium={4} large={2}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(attributes, 'responsible_person')}
                name='responsible_person'
                overrideValues={{
                  fieldType: 'user',
                }}
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(attributes, 'nagotiation_state')}
                name='nagotiation_state'
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(attributes, 'change_of_lease_date')}
                name='change_of_lease_date'
              />
            </Column>
            <Column small={12} medium={12} large={6}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(attributes, 'note')}
                name='note'
              />
            </Column>
          </Row>
          <FieldArray
            attributes={attributes}
            isSaveClicked={isSaveClicked}
            name={`leases`}
            component={LeaseItemsEdit}
          />
        </GreenBox>
      </form>
    );
  }
}

const formName = FormNames.INFILL_DEVELOPMENT;

export default flowRight(
  connect(
    (state) => {
      return {
        attributes: getAttributes(state),
        initialValues: getFormInitialValues(state),
      };
    },
    {
      receiveFormValidFlags,
    }
  ),
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
    enableReinitialize: true,
  }),
)(InfillDevelopmentForm);
