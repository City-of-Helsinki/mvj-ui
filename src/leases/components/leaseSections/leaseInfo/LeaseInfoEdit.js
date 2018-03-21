// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Field, formValueSelector, reduxForm} from 'redux-form';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';

import FieldTypeSelect from '$components/form/FieldTypeSelect';
import FieldTypeDatePicker from '$components/form/FieldTypeDatePicker';
import {dateGreaterOrEqual, genericValidator} from '$components/form/validations';
import {getAttributeFieldOptions} from '$src/util/helpers';

type Props = {
  attributes: Object,
  leaseInfo: Object,
  start_date: string,
}

class LeaseInfoEdit extends Component {
  props: Props

  render () {
    const {
      attributes,
      leaseInfo,
      start_date,
    } = this.props;
    const stateOptions = getAttributeFieldOptions(attributes, 'state');

    return (
      <form className='lease-info-edit'>
        <div className='lease-info-edit__column'>
          <p className='lease-info-edit__label'>Vuokratunnus</p>
          <span className='lease-info-edit__number'>{leaseInfo.identifier || '-'}</span>
        </div>
        <div className='lease-info-edit__column'>
          <div className='lease-info-edit__column-wrapper'>
            <Field
              className="no-margin height-medium"
              component={FieldTypeSelect}
              label='Tyyppi'
              name='state'
              options={stateOptions}
              validate={[
                (value) => genericValidator(value, get(attributes, 'state')),
              ]}
            />
          </div>
        </div>
        <div className='lease-info-edit__column'>
          <div className='lease-info-edit__column-wrapper'>
            <Field
              className="no-margin height-medium"
              component={FieldTypeDatePicker}
              label='Alkupvm'
              name='start_date'
              validate={[
                (value) => genericValidator(value, get(attributes, 'start_date')),
              ]}
            />
          </div>
        </div>
        <div className='lease-info-edit__column'>
          <div className='lease-info-edit__column-wrapper'>
            <Field
              className="no-margin height-medium"
              component={FieldTypeDatePicker}
              label='Loppupvm'
              name='end_date'
              disableTouched
              validate={[
                (value) => genericValidator(value, get(attributes, 'end_date')),
                (value) => dateGreaterOrEqual(value, start_date),
              ]}
            />
          </div>
        </div>
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
        start_date: selector(state, 'start_date'),
      };
    }
  ),
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
  }),
)(LeaseInfoEdit);
