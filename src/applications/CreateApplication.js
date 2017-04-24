// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {reduxForm, formValueSelector} from 'redux-form';
import {translate} from 'react-i18next';
import flowRight from 'lodash/flowRight';

import Collapse from '../components/collapse/Collapse';
import Hero from '../components/hero/Hero';

import BasicInfo from './form/BasicInfo';
import ApplicantInfo from './form/ApplicantInfo';
import FormActions from './form/FormActions';
import validate from './form/ApplicationValidator';

type Props = {
  handleSubmit: Function,
  invalid: Boolean,
  isOpenApplication: String,
  onCancel: Function,
  onSave: Function,
  pristine: Boolean,
  t: Function,
  submitting: Boolean,
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
      isOpenApplication,
      pristine,
      submitting,
      t,
    } = this.props;

    const formActionProps = {
      invalid,
      pristine,
      submitting,
      icon: <i className="mi mi-send"/>,
      label: 'Lähetä hakemus',
    };

    return (
      <div className="full__width">

        <Hero>
          <h1>{t('applications:createNew')}</h1>
        </Hero>

        <form className="test-form mvj-form" onSubmit={handleSubmit(this.save)}>

          <Collapse
            header="Kohteen tiedot">
            <BasicInfo isOpenApplication={!!isOpenApplication}/>
          </Collapse>

          <Collapse
            header="Hakijan tiedot">
            <ApplicantInfo/>
          </Collapse>

          <FormActions {...formActionProps}/>

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
  connect(
    state => {
      const selector = formValueSelector('application-form');
      const isOpenApplication = selector(state, 'open_application');

      return {
        isOpenApplication,
      };
    }
  ),
  translate(['common', 'applications'])
)(CreateApplication);
