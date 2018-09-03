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
import SubTitle from '$components/content/SubTitle';
import {receiveFormValidFlags} from '$src/infillDevelopment/actions';
import {FormNames} from '$src/infillDevelopment/enums';
import {
  getAttributes,
  getFormInitialValues,
  getIsSaveClicked,
} from '$src/infillDevelopment/selectors';
import {referenceNumber} from '$components/form/validations';

import type {Attributes, InfillDevelopment} from '$src/infillDevelopment/types';

type Props = {
  attributes: Attributes,
  infillDevelopment: InfillDevelopment,
  isFocusedOnMount?: boolean,
  isSaveClicked: boolean,
  onOpenDeleteModal: Function,
  receiveFormValidFlags: Function,
  valid: boolean,
};

class InfillDevelopmentForm extends Component<Props> {
  firstField: any

  componentDidMount() {
    const {isFocusedOnMount} = this.props;

    if(isFocusedOnMount) {
      this.setFocusOnFirstField();
    }
  }

  componentDidUpdate(prevProps) {
    const {receiveFormValidFlags} = this.props;

    if(prevProps.valid !== this.props.valid) {
      receiveFormValidFlags({
        [FormNames.INFILL_DEVELOPMENT]: this.props.valid,
      });
    }
  }

  setRefForFirstField = (element: any) => {
    this.firstField = element;
  }

  setFocusOnFirstField = () => {
    this.firstField.focus();
  }

  render() {
    const {attributes, infillDevelopment, isSaveClicked, onOpenDeleteModal} = this.props;

    return (
      <form>
        <GreenBox>
          <Row>
            <Column small={6} medium={4} large={2}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(attributes, 'name')}
                name='name'
                setRefForField={this.setRefForFirstField}
                overrideValues={{
                  label: 'Hankkeen nimi',
                }}
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(attributes, 'detailed_plan_identifier')}
                name='detailed_plan_identifier'
                overrideValues={{
                  label: 'Asemakaavan nro.',
                }}
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(attributes, 'reference_number')}
                name='reference_number'
                validate={referenceNumber}
                overrideValues={{
                  label: 'Diaarinumero',
                }}
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(attributes, 'state')}
                name='state'
                overrideValues={{
                  label: 'Neuvotteluvaihe',
                }}
              />
            </Column>
          </Row>
          <Row>
            <Column small={6} medium={4} large={2}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(attributes, 'user')}
                name='user'
                overrideValues={{
                  fieldType: 'user',
                  label: 'Vastuuhenkilö',
                }}
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(attributes, 'lease_contract_change_date')}
                name='lease_contract_change_date'
                overrideValues={{
                  label: 'Vuokrasopimuksen muutospvm',
                }}
              />
            </Column>
            <Column small={12} medium={4} large={8}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(attributes, 'note')}
                name='note'
                overrideValues={{
                  label: 'Huomautus',
                }}
              />
            </Column>
          </Row>
          <SubTitle>Vuokraukset</SubTitle>
          <FieldArray
            attributes={attributes}
            component={LeaseItemsEdit}
            infillDevelopment={infillDevelopment}
            isSaveClicked={isSaveClicked}
            name={`infill_development_compensation_leases`}
            onOpenDeleteModal={onOpenDeleteModal}
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
    enableReinitialize: true,
  }),
)(InfillDevelopmentForm);
