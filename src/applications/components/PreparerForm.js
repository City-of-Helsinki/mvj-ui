// @flow
import React, {Component, PropTypes} from 'react';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import {reduxForm, formValueSelector} from 'redux-form';
import {translate} from 'react-i18next';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';

import {getActiveLanguage} from '../../util/helpers';
import {fetchSingleApplication} from '../actions';
import {getCurrentApplication, getIsFetching} from '../selectors';

import {fetchIdentifiers} from '../../lease/actions';
import {fetchAttributes} from '../../attributes/actions';
import {getAttributes} from '../../attributes/selectors';

import Tabs from '../../components/tabs/Tabs';
import Hero from '../../components/hero/Hero';
import TabPane from '../../components/tabs/TabPane';
import TabContent from '../../components/tabs/TabContent';

import Billing from './formSections/Billing';
import PropertyUnit from './formSections/PropertyUnit';
import Lease from './formSections/Lease';
import Summary from './formSections/Summary';
import Tenants from './formSections/Tenants';
import Conditions from './formSections/Conditions';
import MapContainer from '../../components/map/Map';
import validate from './formSections/NewApplicationValidator';
import EditModal from './formSections/editModal';

import {revealContext} from '../../foundation/reveal';
import {Sizes} from '../../foundation/enums';

import {defaultCoordinates, defaultZoom} from '../../constants';
import {getIdentifiers} from '../../lease/selectors';

type Props = {
  application: Object,
  applicationId: String,
  attributes: Object,
  closeReveal: Function,
  fetchAttributes: Function,
  fetchIdentifiers: Function,
  fetchSingleApplication: Function,
  handleSubmit: Function,
  identifiers: Object,
  invalid: Boolean,
  isFetching: boolean,
  isOpenApplication: String,
  location: Object,
  onCancel: Function,
  onSave: Function,
  params: Object,
  pristine: Boolean,
  submitting: Boolean,
  t: Function,
};

type State = {
  activeTab: number,
  isEditingSection: boolean,
  editingComponent: Object | null,
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
      isEditingSection: false,
      editingComponent: null,
    };
  }

  componentWillMount() {
    const {fetchSingleApplication, fetchIdentifiers, location, fetchAttributes, params: {applicationId}} = this.props;

    if (location.query.tab) {
      this.setState({activeTab: location.query.tab});
    }

    fetchAttributes();
    fetchIdentifiers();
    fetchSingleApplication(applicationId);
  }

  componentWillReceiveProps(nextProps) {
    const {fetchSingleApplication} = this.props;
    const {params: {applicationId}, location} = nextProps;

    if (applicationId !== this.props.params.applicationId) {
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

  handleEditSection = (component) => {
    this.setState({
      isEditingSection: true,
      editingComponent: component,
    });
  };

  handleEditSave = (values) => {
    console.log(values);
    this.setState({isEditingSection: false}, () => this.props.closeReveal('editModal'));
  };

  handleDismissEditModal = () => {
    this.setState({isEditingSection: false}, () => this.props.closeReveal('editModal'));
  };

  render() {
    const {activeTab} = this.state;

    const {
      application,
      identifiers,
      params: {applicationId},
      attributes,
      isFetching,
      t,
    } = this.props;

    if (isFetching || isEmpty(attributes)) {
      return <p>Loading...</p>;
    }

    return (
      <div className="full__width flex">

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
              'Ehdot',
              'Kartta',
            ]}
            onTabClick={(id) => this.handleTabClick(id)}
          />
        </Hero>

        <TabContent active={activeTab}>
          <TabPane className="summary">
            <Summary
              {...application}
              {...identifiers}
            />
          </TabPane>

          <TabPane className="tenants tab__content">
            <Tenants
              onEdit={this.handleEditSection}
              {...application}
            />
          </TabPane>

          <TabPane className="property-unit tab__content">
            <PropertyUnit/>
          </TabPane>

          <TabPane className="lease tab__content">
            <Lease/>
          </TabPane>

          <TabPane className="billing tab__content">
            <Billing/>
          </TabPane>

          <TabPane className="conditions tab__content">
            <Conditions/>
          </TabPane>

          <TabPane className="map">
            <div className="map">
              <MapContainer center={defaultCoordinates}
                            zoom={defaultZoom}
              />
            </div>
          </TabPane>
        </TabContent>

        <EditModal size={Sizes.LARGE}
                   isOpen={this.state.isEditingSection}
                   component={this.state.editingComponent}
                   handleSave={this.handleEditSave}
                   handleDismiss={this.handleDismissEditModal}
        />
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
        identifiers: getIdentifiers(state),
        initialValues: getCurrentApplication(state),
        isFetching: getIsFetching(state),
        isOpenApplication,
      };
    },
    {
      fetchAttributes,
      fetchSingleApplication,
      fetchIdentifiers,
    }
  ),
  reduxForm({
    form: 'preparer-form',
    validate,
  }),
  translate(['common', 'applications']),
  revealContext(),
)(PreparerForm);
