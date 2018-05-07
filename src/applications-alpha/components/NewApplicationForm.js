// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {reduxForm, formValueSelector} from 'redux-form';
import {translate} from 'react-i18next';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';

import {Column} from 'react-foundation';

import Collapse from '../../components-alpha/collapse/Collapse';
import Hero from '../../components-alpha/hero/Hero';

import BasicInfo from '../../leases-alpha/components/formSections/BasicInfo';
import ApplicantInfo from '../../leases-alpha/components/formSections/ApplicantInfo';
import FormActions from '../../leases-alpha/components/formSections/FormActions';
import validate from '../../leases-alpha/components/formSections/NewApplicationValidator';
import {fetchAttributes} from '../../attributes/actions';
import {getAttributes} from '../../attributes/selectors';
import {createApplication} from '../actions';

type Props = {
  attributes: Object,
  fetchAttributes: Function,
  handleSubmit: Function,
  invalid: Boolean,
  isOpenApplication: String,
  onCancel: Function,
  onSave: Function,
  pristine: Boolean,
  t: Function,
  submitting: Boolean,
  submitSucceeded: Boolean,
  createApplication: Function,
};

class CreateApplicationForm extends Component<Props> {
  componentWillMount() {
    const {fetchAttributes} = this.props;
    fetchAttributes();
  }

  save = (values) => {
    const {createApplication} = this.props;

    const newValues = {
      building_footprints: [
        {
          area: Number(values.area),
          use: values.use,
        },
      ],
      ...values,
    };

    return createApplication(newValues);
  };

  render() {
    const {
      attributes,
      handleSubmit,
      invalid,
      isOpenApplication,
      pristine,
      submitting,
      submitSucceeded,
      t,
    } = this.props;

    const formActionProps = {
      invalid,
      pristine,
      submitting,
      icon: <i className="mi mi-send"/>,
      label: 'Lähetä hakemus',
    };

    // TODO: Refactor
    if (isEmpty(attributes)) {
      return null;
    }

    return (
      <div className="full__width">

        <Hero>
          <h1>{t('applications:createNew')}</h1>
        </Hero>

        {!submitSucceeded ?
          <form className="mvj-form" onSubmit={handleSubmit(this.save)}>

            <Collapse
              header="Kohteen tiedot">
              <BasicInfo
                attributes={attributes}
                isOpenApplication={!!isOpenApplication}/>
            </Collapse>

            <Collapse
              header="Hakijan tiedot">
              <ApplicantInfo/>
            </Collapse>

            <FormActions {...formActionProps}/>

          </form> :
          <Column medium={12}>
            <p className="lead">Kiitokset hakemuksestasi & Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Beatae dolorum id inventore ipsam maiores omnis pariatur quos sapiente tempora voluptatum.</p>
          </Column>
        }
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
      const isOpenApplication = selector(state, 'is_open');

      return {
        isOpenApplication,
        attributes: getAttributes(state),
      };
    },
    {fetchAttributes, createApplication}
  ),
  translate(['common', 'applications'])
)(CreateApplicationForm);
