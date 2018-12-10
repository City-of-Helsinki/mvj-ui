// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import {reduxForm, formValueSelector} from 'redux-form';
import {translate} from 'react-i18next';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import {getActiveLanguage} from '$util/helpers';
import {editLease, fetchSingleLease} from '../actions';
import {getCurrentLease, getIsFetching} from '../selectors';

import {fetchAttributes as fetchLeaseAttributes} from '../actions';
import {fetchAttributes as fetchApplicationAttributes} from '../../attributes/actions';
import {getAttributes as getApplicationAttributes} from '../../attributes/selectors';

import {Sizes} from '../../foundation/enums';
import EditModal from '../../components-alpha/editModal/editModal';
import ApplicationEditForm from '../../applications-alpha/components/ApplicationEditForm';
import {revealContext} from '../../foundation/reveal';

import Tabs from '../../components-alpha/tabs/Tabs';
import TabPane from '../../components-alpha/tabs/TabPane';
import TabContent from '../../components-alpha/tabs/TabContent';
import Hero from '../../components-alpha/hero/Hero';
import Sidebar from '../../components-alpha/sidebar/Sidebar';

import Billing from './formSections/Billing';
import PropertyUnits from './formSections/PropertyUnits';
import Leases from './formSections/Leases';
import Summary from './formSections/Summary';
import Tenants from './formSections/Tenants';
import Conditions from './formSections/Conditions';
import Notes from './formSections/Notes';
import Map from './formSections/Map';
import validate from './formSections/NewApplicationValidator';

import {getAttributes as getLeaseAttributes} from '../selectors';
import Loader from '../../components-alpha/loader/Loader';
import {Column, Row} from 'react-foundation';

type Props = {
  applicationAttributes: Object,
  attributes: Object,
  attributes: Object,
  billing: Object,
  closeReveal: Function,
  conditions: Array<any>,
  editLease: Function,
  fetchApplicationAttributes: Function,
  fetchLeaseAttributes: Function,
  fetchSingleLease: Function,
  handleSubmit: Function,
  identifier: string,
  initialValues: Object,
  invalid: Boolean,
  isFetching: boolean,
  isOpenApplication: String,
  leaseAttributes: Object,
  leaseId: String,
  location: Object,
  notes: Array<any>,
  onCancel: Function,
  onSave: Function,
  params: Object,
  pristine: Boolean,
  real_property_units: Array<any>,
  rents: Object,
  submitting: Boolean,
  t: Function,
  tenants: Array<any>,
};

type State = {
  activeTab: number,
  displayApplication: boolean,
  displaySidebar: boolean,
};

type TabsType = Array<any>;

class PreparerForm extends Component<Props, State> {
  tabs: TabsType;

  static contextTypes = {
    router: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      activeTab: 0,
      displayApplication: false,
      displaySidebar: false,
    };
  }

  componentWillMount() {
    const {fetchSingleLease, fetchApplicationAttributes, location, fetchLeaseAttributes, params: {leaseId}} = this.props;

    if (location.query.tab) {
      this.setState({activeTab: location.query.tab});
    }

    fetchApplicationAttributes();
    fetchLeaseAttributes();
    fetchSingleLease(leaseId);
  }

  componentWillReceiveProps(nextProps) {
    const {fetchSingleLease} = this.props;
    const {params: {leaseId}, location} = nextProps;

    if (leaseId !== this.props.params.leaseId) {
      fetchSingleLease(leaseId);
    }

    if (location.query.tab) {
      this.setState({activeTab: location.query.tab});
    }
  }

  toggleSidebar = () => {
    const {displaySidebar} = this.state;

    return this.setState({
      displaySidebar: !displaySidebar,
    });
  };

  handleDisplayApplication = () => {
    this.setState({displayApplication: true});
  };

  handleEditSave = () => {
    return null;
  };

  handleDismissEditModal = () => {
    this.setState({displayApplication: false}, () => {
      const {closeReveal} = this.props;
      closeReveal('editModal');
    });
  };

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
    // $FlowFixMe
    const lang = getActiveLanguage().id;

    return router.push({
      pathname: `/alpha/${lang}/leases`,
    });
  };

  save = (values) => {
    const {editLease} = this.props;
    editLease(values);
  };

  render() {
    const {activeTab} = this.state;

    const {
      billing,
      conditions,
      handleSubmit,
      initialValues,
      isFetching,
      identifier,
      leaseAttributes,
      notes,
      params: {leaseId},
      real_property_units,
      rents,
      t,
      tenants,
    } = this.props;
    const {application} = initialValues;

    if (isFetching || isEmpty(leaseAttributes)) {
      return <Loader isLoading={isFetching}/>;
    }

    return (
      <div className="full__width flex tabs preparer-form">
        <Hero className="preparer-form__hero">
          <div>
            <div className="controls">
              <h2>
                <span onClick={this.goBack} style={{cursor: 'pointer'}}>
                  <i className="mi mi-keyboard-backspace"/>
                </span> {identifier ? identifier : `${t('leases:single')} ${leaseId}`}
              </h2>

              {application &&
              <button className="display-application" onClick={this.handleDisplayApplication}>
                Alkuperäinen hakemus
              </button>
              }
              <button className="display-notes" onClick={this.toggleSidebar}/>
            </div>

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
          </div>
        </Hero>

        <TabContent active={activeTab}>
          <TabPane className="summary">
            <Summary
              {...initialValues}
              {...leaseAttributes.identifiers}
            />
          </TabPane>

          <TabPane className="tenants tab__content">
            <Tenants tenants={tenants}/>
          </TabPane>

          <TabPane className="property-unit tab__content">
            <PropertyUnits real_property_units={real_property_units}/>
          </TabPane>

          <TabPane className="lease tab__content">
            <Leases attributes={leaseAttributes}
              rents={rents}/>
          </TabPane>

          <TabPane className="billing tab__content">
            <Billing tenants={tenants}
              rents={rents}
              {...billing}/>
          </TabPane>

          <TabPane className="conditions tab__content">
            <Conditions attributes={leaseAttributes}
              conditions={conditions}/>
          </TabPane>

          <TabPane className="map">
            <Map areas={get(initialValues, 'areas')}/>
          </TabPane>
        </TabContent>

        <Sidebar
          className="notes__sidebar"
          isOpen={this.state.displaySidebar}
          component={Notes}
          notes={notes}
          position="right"
          handleClose={this.toggleSidebar}
        />

        <Row>
          <Column medium={12}>
            <button className="button" onClick={handleSubmit(this.save)}>{t('save')}</button>
          </Column>
        </Row>

        {this.state.displayApplication && !isFetching &&
        <EditModal size={Sizes.LARGE}
          isOpen={this.state.displayApplication}
          component={ApplicationEditForm}
          handleSave={this.handleEditSave}
          applicationId={initialValues.application.id}
          handleDismiss={this.handleDismissEditModal}
        />
        }

      </div>
    );
  }
}

export default flowRight(
  withRouter,
  connect(
    (state) => {
      const selector = formValueSelector('preparer-form');
      const identifier = selector(state, 'identifier');
      const tenants = selector(state, 'tenants');
      const real_property_units = selector(state, 'real_property_units');
      const rents = selector(state, 'rents');
      const conditions = selector(state, 'conditions');
      const notes = selector(state, 'notes');
      const billing = selector(state, 'is_billing_enabled', 'bills_per_year');

      return {
        applicationAttributes: getApplicationAttributes(state),
        initialValues: getCurrentLease(state),
        isFetching: getIsFetching(state),
        leaseAttributes: getLeaseAttributes(state),
        billing,
        conditions,
        identifier,
        notes,
        real_property_units,
        rents,
        tenants,
      };
    },
    {
      fetchApplicationAttributes,
      fetchSingleLease,
      fetchLeaseAttributes,
      editLease,
    }
  ),
  reduxForm({
    form: 'preparer-form',
    destroyOnUnmount: false,
    enableReinitialize: true,
    validate,
  }),
  translate(['common', 'leases']),
  revealContext(),
)(PreparerForm);
