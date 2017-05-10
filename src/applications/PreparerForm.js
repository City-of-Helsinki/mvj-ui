// @flow
import React, {Component, PropTypes} from 'react';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import {reduxForm, formValueSelector} from 'redux-form';
import {translate} from 'react-i18next';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';

import Tabs from '../components/tabs/Tabs';
import Hero from '../components/hero/Hero';

import Billing from './form/Billing';
import PropertyUnit from './form/PropertyUnit';
import Lease from './form/Lease';
import Summary from './form/Summary';
import Tenants from './form/Tenants';

import validate from './form/NewApplicationValidator';
import {getActiveLanguage} from '../util/helpers';
import {fetchSingleApplication} from './actions';
import {getCurrentApplication, getIsFetching} from './selectors';
import {fetchAttributes} from '../attributes/actions';
import {getAttributes} from '../attributes/selectors';
import TabPane from '../components/tabs/TabPane';
import TabContent from '../components/tabs/TabContent';

type Props = {
  application: Object,
  applicationId: String,
  attributes: Object,
  fetchAttributes: Function,
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
  activeTab: number,
};

type TabsType = Array<any>;

class PreparerForm extends Component {
  props: Props;
  state: State;
  tabs: TabsType;

  static contextTypes = {
    router: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      activeTab: 0,
    };
  }

  componentWillMount() {
    const {applicationId, fetchSingleApplication, location, fetchAttributes} = this.props;

    if (location.query.tab) {
      this.setState({activeTab: location.query.tab});
    }

    fetchAttributes();
    fetchSingleApplication(applicationId);
  }

  componentWillReceiveProps(nextProps) {
    const {fetchSingleApplication} = this.props;
    const {applicationId, location} = nextProps;

    if (applicationId !== this.props.applicationId) {
      fetchSingleApplication(applicationId);
    }

    if (location.query.tab) {
      this.setState({activeTab: location.query.tab});
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
      application,
      applicationId,
      attributes,
      isFetching,
      t,
    } = this.props;

    if (isFetching || isEmpty(attributes)) {
      return <p>Loading...</p>;
    }

    return (
      <div className="full__width">

        <Hero>
          <h2>
            <span onClick={this.goBack} style={{cursor: 'pointer'}}>
              <i className="mi mi-keyboard-backspace"/>
            </span> {t('applications:single')} {applicationId}</h2>

          <Tabs
            active={activeTab}
            className="hero__navigation"
            tabs={[
              'Yhteenveto',
              'Vuokralaiset',
              'Kohde',
              'Vuokra',
              'Laskutus',
            ]}
            onTabClick={(id) => this.handleTabClick(id)}
          />
        </Hero>

        <TabContent active={activeTab}>
          <TabPane className="summary">
            <Summary {...application}/>
          </TabPane>
          <TabPane className="tenants">
            <Tenants {...application}/>
          </TabPane>
          <TabPane className="property-unit">
            <PropertyUnit/>
          </TabPane>
          <TabPane className="lease">
            <Lease/>
          </TabPane>
          <TabPane className="billing">
            <Billing/>
          </TabPane>
        </TabContent>

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
        application: getCurrentApplication(state),
        attributes: getAttributes(state),
        initialValues: getCurrentApplication(state),
        isFetching: getIsFetching(state),
        isOpenApplication,
      };
    },
    {
      fetchAttributes,
      fetchSingleApplication,
    }
  ),
  reduxForm({
    form: 'preparer-form',
    validate,
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: false,
  }),
  translate(['common', 'applications'])
)(PreparerForm);
