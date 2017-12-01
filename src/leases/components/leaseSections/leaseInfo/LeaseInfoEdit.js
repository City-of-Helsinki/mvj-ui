// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Field, formValueSelector, reduxForm} from 'redux-form';
import flowRight from 'lodash/flowRight';

import FieldTypeDatePicker from '../../../../components/form/FieldTypeDatePicker';

type Props = {
  startDate: ?string,
  endDate: ?string,
  identifier: ?string,
}

class LeaseInfoEdit extends Component {
  props: Props

  render () {
    const {identifier} = this.props;

    return (
      <form className='lease-info-edit'>
        <p className='lease-info-edit__label'>Vuokratunnus</p>
        <div className='lease-info__type'>
          <span className='lease-info__number'>{identifier}</span>
          <Field
            name={'start_date'}
            type="text"
            component={FieldTypeDatePicker}/>
          <Field
            name={'end_date'}
            type="text"
            component={FieldTypeDatePicker}/>
        </div>
      </form>
    );
  }
}

const formName = 'lease-info-edit-form';
const selector = formValueSelector(formName);

export default flowRight(
  connect(
    (state) => {
      return {
        start_date: selector(state, 'start_date'),
        end_date: selector(state, 'end_date'),
      };
    }
  ),
  reduxForm({
    form: formName,
  }),
)(LeaseInfoEdit);
