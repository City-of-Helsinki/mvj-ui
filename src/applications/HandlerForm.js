// @flow
import React, {createElement, Component, PropTypes} from 'react';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import {reduxForm, formValueSelector} from 'redux-form';
import {translate} from 'react-i18next';
import flowRight from 'lodash/flowRight';
import find from 'lodash/find';

import Tabs from '../components/tabs/Tabs';
import Collapse from '../components/collapse/Collapse';
import Hero from '../components/hero/Hero';

import BasicInfo from './form/BasicInfo';
import ApplicantInfo from './form/ApplicantInfo';
import FormActions from './form/FormActions';
import validate from './form/NewApplicationValidator';
import {getActiveLanguage} from '../util/helpers';
import GroupTitle from '../components/form/GroupTitle';
import {fetchSingleApplication} from './actions';
import {getCurrentApplication, getIsFetching} from './selectors';

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

const tab1Content = () => <p>Tab 1 content</p>;
const tab2Content = () => <p>Tab 2 content</p>;
const tab3Content = () => <p>Tab 3 content</p>;
const tab4Content = () => <p>Tab 4 content</p>;

const tabs = [
  {id: 'first', label: 'Tab 1', component: tab1Content},
  {id: 'second', label: 'Tab 2', component: tab2Content},
  {id: 'third', label: 'Tab 3', component: tab3Content},
  {id: 'fourth', label: 'Tab 4', component: tab4Content},
];

const getActiveTab = (id: string): Object => find(tabs, {id});

type Props = {
  applicationId: String,
  fetchSingleApplication: Function,
  handleSubmit: Function,
  invalid: Boolean,
  isFetching: boolean,
  isOpenApplication: String,
  location: Object,
  onCancel: Function,
  onSave: Function,
  pristine: Boolean,
  submitting: Boolean,
  t: Function,
};

type State = {
  activeTab: string,
};

class HandlerForm extends Component {
  props: Props;
  state: State;

  static contextTypes = {
    router: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      activeTab: tabs[0].id,
    };
  }

  componentWillMount() {
    const {applicationId, fetchSingleApplication, location} = this.props;

    if (location.query.tab) {
      this.setState({activeTab: location.query.tab});
    }

    fetchSingleApplication(applicationId);
  }

  componentWillReceiveProps(nextProps) {
    const {applicationId, fetchSingleApplication} = nextProps;

    if (applicationId !== this.props.applicationId) {
      fetchSingleApplication(applicationId);
    }
  }

  handleTabClick = (tabId) => {
    const {router} = this.context;
    const {location} = this.props;

    this.setState({activeTab: tabId}, () => {
      return router.push({
        ...location,
        query: {tab: tabId},
      });
    });
  };

  renderTabContent = (): Object => {
    const {activeTab} = this.state;
    const tab = getActiveTab(activeTab);

    return createElement(tab.component, {});
  };

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
    const {activeTab} = this.state;

    const {
      applicationId,
      handleSubmit,
      invalid,
      isOpenApplication,
      isFetching,
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

    if (isFetching) {
      return <p>Loading...</p>;
    }

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

          <Tabs
            active={activeTab}
            className="hero__navigation"
            items={tabs}
            onTabClick={(id) => this.handleTabClick(id)}
          />
        </Hero>

        <div className="tab-content">
          {this.renderTabContent()}
        </div>

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
  withRouter,
  connect(
    (state) => {
      const selector = formValueSelector('handler-form');
      const isOpenApplication = selector(state, 'open_application');

      return {
        isOpenApplication,
        initialValues,
        application: getCurrentApplication(state),
        isFetching: getIsFetching(state),
      };
    },
    {fetchSingleApplication}
  ),
  reduxForm({
    form: 'handler-form',
    validate,
  }),
  translate(['common', 'applications'])
)(HandlerForm);
