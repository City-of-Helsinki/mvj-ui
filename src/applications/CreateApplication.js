// @flow
import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import flowRight from 'lodash/flowRight';

import {BaseValidator} from '../components/form/validation';
import Collapse from '../components/collapse/Collapse';
import Hero from '../components/hero/Hero';

import BasicInfo from './form-section/BasicInfo';
import ApplicantInfo from './form-section/ApplicantInfo';

type Props = {
  handleSubmit: Function,
  invalid: Boolean,
  onCancel: Function,
  onSave: Function,
  pristine: Boolean,
  submitting: Boolean,
};

const validate = ({basic, applicant}) => {
  return BaseValidator({basic, applicant}, {});
};

class CreateApplication extends Component {
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
      <div className="full__width">

        <Hero>
          <h1>Hakemus y</h1>
        </Hero>

        <form className="test-form" onSubmit={handleSubmit(this.save)}>

          <Collapse
            header="Kohteen tiedot"
            defaultOpen={true}>
            <BasicInfo/>
          </Collapse>

          <Collapse
            header="Hakijan tiedot"
            defaultOpen={false}>
            <ApplicantInfo/>
          </Collapse>

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
    form: 'application-form',
    validate,
  }),
)(CreateApplication);
