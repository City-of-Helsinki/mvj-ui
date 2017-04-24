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
import validate from './form/NewApplicationValidator';
import {getActiveLanguage} from '../helpers';

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

class HandlerForm extends Component {
  props: Props;

  static contextTypes = {
    router: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {};
  }

  componentWillMount() {
  }

  // Just for demo...
  goBack = () => {
    const {router} = this.context;
    const lang = getActiveLanguage().id;

    return router.push({
      pathname: `/${lang}/applications`,
    });
  };

  save = (values) => {
    console.log('saving', values);
  };

  render() {
    const {
      applicationId,
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
          <h2 onClick={this.goBack}>{t('applications:createNew')}</h2>
        </Hero>

        <form className="mvj-form" onSubmit={handleSubmit(this.save)}>

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
)(HandlerForm);
