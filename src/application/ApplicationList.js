// @flow
import React, {Component} from 'react';
import {reduxForm, Field} from 'redux-form';
import flowRight from 'lodash/flowRight';

import FieldTextInput from '../form/field-text-input';
import {BaseValidator} from '../form/validation';

type Props = {
  handleSubmit: Function,
  invalid: Boolean,
  onCancel: Function,
  onSave: Function,
  pristine: Boolean,
  submitting: Boolean,
};

const validate = ({test}) => {
  return BaseValidator({test}, {});
};

class ApplicationList extends Component {
  props: Props;

  save = (values) => {
    console.log('saving', values);
  };

  render() {
    const {
      handleSubmit,
      invalid,
      pristine,
      submitting,
    } = this.props;

    return (
      <div className="section__container">
        <form className="test-form" onSubmit={handleSubmit(this.save)}>

          <Field
            type="text"
            name="test"
            placeholder="Test placeholder"
            component={FieldTextInput}
            label='Test field'
            hint='Lorem ipsum color.'
            disabled={false}
            required={true}/>

          <button
            type="submit"
            className="button"
            disabled={invalid || submitting || pristine}>
            Submit-label
          </button>
        </form>
      </div>
    );
  }
}

export default flowRight(
  reduxForm({
    form: 'testForm',
    validate,
  })
)(ApplicationList);
