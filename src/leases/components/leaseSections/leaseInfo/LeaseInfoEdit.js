// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Field, formValueSelector, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';

import FieldTypeSelect from '$components/form/FieldTypeSelect';
import FieldTypeDatePicker from '$components/form/FieldTypeDatePicker';
import {dateGreaterOrEqual, genericValidator} from '$components/form/validations';
import {getAttributeFieldOptions} from '$src/util/helpers';
import {receiveLeaseInfoFormValid} from '../../../actions';
import {getIsLeaseInfoFormValid} from '../../../selectors';

type Props = {
  attributes: Object,
  isLeaseInfoFormValid: boolean,
  leaseInfo: Object,
  receiveLeaseInfoFormValid: Function,
  start_date: string,
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
      leaseInfo,
      start_date,
    } = this.props;

    const stateOptions = getAttributeFieldOptions(attributes, 'state');

    return (
      <form className='lease-info-edit'>
        <Row>
          <Column>
            <p className='lease-info-edit__label'>Vuokratunnus</p>
            <h1 className='lease-info-edit__number'>{leaseInfo.identifier || '-'}</h1>
          </Column>
          <Column>
            <p className='lease-info-edit__label'>Tyyppi</p>
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
            <p className='lease-info-edit__label'>Alkupvm</p>
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
            <p className='lease-info-edit__label'>Loppupvm</p>
            <Field
              className="no-margin"
              component={FieldTypeDatePicker}
              name='end_date'
              disableTouched
              validate={[
                (value) => genericValidator(value, get(attributes, 'end_date')),
                (value) => dateGreaterOrEqual(value, start_date),
              ]}
            />
          </Column>
        </Row>
      </form>
    );
  }
}

const formName = 'lease-info-form';
const selector = formValueSelector(formName);

export default flowRight(
  connect(
    (state) => {
      return {
        isLeaseInfoFormValid: getIsLeaseInfoFormValid(state),
        start_date: selector(state, 'start_date'),
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
