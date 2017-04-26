// @flow
import React, {Component, PropTypes} from 'react';
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
import {getActiveLanguage} from '../util/helpers';
import GroupTitle from '../components/form/GroupTitle';

// Dummy-values for handlerForm
const initialValues = {
  type: 1,
  arguments: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Maiores, temporibus...',
  location: 'Uotila',
  address: 'Uotilantie 56',
  map_link: 'http://maps.google.com',
  usage: 'Yritystoiminta',
  area: '100',
  start: '24.12.2010',
  stop: '24.12.2020',
  organisation: 'Oy Yritys Ab',
  company_code: 'ABC-123',
  organisation_street: 'Yrityskatu 47',
  zip: '00100',
  value: '100 000 000',
  billing_info: 'Laskutustieto',
  name: 'Jarkko Jäppinen',
  phone: '050-123 1234',
  email: 'jarkko.jappinen@yritys.com',
};

type Props = {
  applicationId: String,
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
          <h2>
            <span onClick={this.goBack} style={{cursor: 'pointer'}}>
              <i className="mi mi-keyboard-backspace"/>
            </span> {t('applications:single')} {applicationId}</h2>
          <p className="subtitle">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cum deleniti error, in
            incidunt ut voluptatum? Ab assumenda corporis doloremque eum exercitationem, incidunt itaque maiores maxime
            nihil praesentium quisquam sed totam?</p>
        </Hero>

        <form className="mvj-form" onSubmit={handleSubmit(this.save)}>

          <Collapse
            header="Hakijan tiedot">
            <ApplicantInfo/>
          </Collapse>

          <Collapse
            header="Kohteen tiedot">
            <BasicInfo isOpenApplication={!!isOpenApplication}/>
          </Collapse>

          <GroupTitle text="Lähetä varausehdotus tms. aputeksti"/>
          <FormActions {...formActionProps}/>

        </form>
      </div>
    );
  }
}

export default flowRight(
  connect(
    state => {
      const selector = formValueSelector('handler-form');
      const isOpenApplication = selector(state, 'open_application');

      return {
        isOpenApplication,
        initialValues,
      };
    }
  ),
  reduxForm({
    form: 'handler-form',
    validate,
  }),
  translate(['common', 'applications'])
)(HandlerForm);
