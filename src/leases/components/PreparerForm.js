// @flow
import React, {Component, PropTypes} from 'react';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import {reduxForm, formValueSelector} from 'redux-form';
import {translate} from 'react-i18next';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';

import {getActiveLanguage} from '../../util/helpers';
import {editLease, fetchSingleLease} from '../actions';
import {getCurrentLease, getIsFetching} from '../selectors';

import {fetchAttributes as fetchLeaseAttributes} from '../actions';
import {fetchAttributes as fetchApplicationAttributes} from '../../attributes/actions';
import {getAttributes as getApplicationAttributes} from '../../attributes/selectors';

import Tabs from '../../components/tabs/Tabs';
import Hero from '../../components/hero/Hero';
import TabPane from '../../components/tabs/TabPane';
import TabContent from '../../components/tabs/TabContent';

import Billing from './formSections/Billing';
import PropertyUnits from './formSections/PropertyUnits';
import Leases from './formSections/Leases';
import Summary from './formSections/Summary';
import Tenants from './formSections/Tenants';
import Conditions from './formSections/Conditions';
import MapContainer from '../../components/map/Map';
import validate from './formSections/NewApplicationValidator';

import {defaultCoordinates, defaultZoom} from '../../constants';
import {getAttributes as getLeaseAttributes} from '../selectors';
import Loader from '../../components/loader/Loader';

type Props = {
  applicationAttributes: Object,
  attributes: Object,
  attributes: Object,
  closeReveal: Function,
  editLease: Function,
  fetchApplicationAttributes: Function,
  fetchLeaseAttributes: Function,
  fetchSingleLease: Function,
  handleSubmit: Function,
  invalid: Boolean,
  isFetching: boolean,
  isOpenApplication: String,
  lease: Object,
  leaseAttributes: Object,
  leaseId: String,
  location: Object,
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
      pathname: `/${lang}/leases`,
    });
  };

  save = (values) => {
    const {editLease} = this.props;
    editLease(values);
    // console.log('saving', values);
  };

  render() {
    const {activeTab} = this.state;

    const {
      lease,
      leaseAttributes,
      params: {leaseId},
      isFetching,
      tenants,
      real_property_units,
      rents,
      handleSubmit,
      t,
    } = this.props;

    if (isFetching || isEmpty(leaseAttributes)) {
      return <Loader isLoading={isFetching}/>;
    }

    return (
      <div className="full__width flex tabs">
        <Hero>
          <h2>
            <span onClick={this.goBack} style={{cursor: 'pointer'}}>
              <i className="mi mi-keyboard-backspace"/>
            </span> {t('leases:single')} {leaseId}</h2>

          <button className="button" onClick={handleSubmit(this.save)}>Save</button>

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
              {...lease}
              {...leaseAttributes.identifiers}
            />
          </TabPane>

          <TabPane className="tenants tab__content">
            <Tenants
              tenants={tenants}
            />
          </TabPane>

          <TabPane className="property-unit tab__content">
            <PropertyUnits
              real_property_units={real_property_units}
            />
          </TabPane>

          <TabPane className="lease tab__content">
            <Leases attributes={leaseAttributes}
                    rents={rents}/>
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
      </div>
    );
  }
}

export default flowRight(
  withRouter,
  connect(
    (state) => {
      const selector = formValueSelector('preparer-form');
      const tenants = selector(state, 'tenants');
      const real_property_units = selector(state, 'real_property_units');
      const rents = selector(state, 'rents');

      return {
        applicationAttributes: getApplicationAttributes(state),
        leaseAttributes: getLeaseAttributes(state),
        initialValues: getCurrentLease(state),
        isFetching: getIsFetching(state),
        tenants,
        real_property_units,
        rents,
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
)(PreparerForm);
