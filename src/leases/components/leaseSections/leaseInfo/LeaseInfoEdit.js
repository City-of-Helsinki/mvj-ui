// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Field, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';

import FieldTypeSelect from '$components/form/FieldTypeSelect';
import FieldTypeDatePicker from '$components/form/FieldTypeDatePicker';
import {receiveLeaseInfoFormValid} from '$src/leases/actions';
import {getContentLeaseInfo} from '$src/leases/helpers';
import {getAttributeFieldOptions} from '$src/util/helpers';
import {getAttributes, getCurrentLease, getIsLeaseInfoFormValid} from '$src/leases/selectors';
import {genericValidator} from '$components/form/validations';

import type {Attributes, Lease} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  currentLease: Lease,
  isLeaseInfoFormValid: boolean,
  receiveLeaseInfoFormValid: Function,
  valid: boolean,
}

class LeaseInfoEdit extends Component {
  props: Props

  componentDidUpdate() {
    const {isLeaseInfoFormValid, receiveLeaseInfoFormValid, valid} = this.props;
    if(isLeaseInfoFormValid !== valid) {
      receiveLeaseInfoFormValid(valid);
    }
  }

  render () {
    const {
      attributes,
      currentLease,
    } = this.props;
    const leaseInfo = getContentLeaseInfo(currentLease);
    const stateOptions = getAttributeFieldOptions(attributes, 'state');

    return (
      <form className='lease-info-edit'>
        <Row>
          <Column>
            <label className='mvj-form-field-label'>Vuokratunnus</label>
            <h1 className='lease-info-edit__number'>{leaseInfo.identifier || '-'}</h1>
          </Column>
          <Column>
            <label className='mvj-form-field-label'>Tyyppi</label>
            <Field
              className='no-margin'
              component={FieldTypeSelect}
              name='state'
              options={stateOptions}
              validate={[
                (value) => genericValidator(value, get(attributes, 'state')),
              ]}
            />
          </Column>
          <Column>
            <label className='mvj-form-field-label'>Alkupäivämäärä</label>
            <Field
              className="no-margin"
              component={FieldTypeDatePicker}
              name='start_date'
              validate={[
                (value) => genericValidator(value, get(attributes, 'start_date')),
              ]}
            />
          </Column>
          <Column>
            <label className='mvj-form-field-label'>Loppupäivämäärä</label>
            <Field
              className="no-margin"
              component={FieldTypeDatePicker}
              name='end_date'
              disableTouched
              validate={[
                (value) => genericValidator(value, get(attributes, 'end_date')),
              ]}
            />
          </Column>
        </Row>
      </form>
    );
  }
}

const formName = 'lease-info-form';

export default flowRight(
  connect(
    (state) => {
      return {
        attributes: getAttributes(state),
        currentLease: getCurrentLease(state),
        isLeaseInfoFormValid: getIsLeaseInfoFormValid(state),
      };
    },
    {
      receiveLeaseInfoFormValid,
    }
  ),
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
  }),
)(LeaseInfoEdit);
