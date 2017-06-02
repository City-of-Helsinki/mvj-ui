// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import {translate} from 'react-i18next';
import {Column, Row} from 'react-foundation';
import {revealContext} from '../../../foundation/reveal';
import {getFormInitialValues, reduxForm} from 'redux-form';
import numeral from 'numeral';
import Fraction from 'fraction.js';

import {Sizes} from 'react-foundation';
import EditModal from '../../../components/editModal/editModal';
import Tabs from '../../../components/tabs/Tabs';
import TabPane from '../../../components/tabs/TabPane';
import TabContent from '../../../components/tabs/TabContent';
import GroupTitle from '../../../components/form/GroupTitle';

import BillingEdit from './BillingEdit';

const getFullRent = (rents) => rents.reduce((total, {amount}) => parseFloat(amount) + total, 0);
const getFractionFromFloat = (float) => new Fraction(float).toFraction(true);

// TODO: Only if the rent-type is fixed (monthly)
const getTenantsYearlyShare = ({share}, rents) => (getFullRent(rents) * 12) * parseFloat(share);

type Props = {
  array: Object,
  bills_per_year: number,
  className: string,
  initialValues: Object,
  is_biling_enabled: boolean,
  rents: Array<any>,
  tenants: Array<any>,
  t: Function,
  closeReveal: Function,
};

type State = {
  activeIndex: number | null,
  activeTab: number,
  activeTenant: Object | null,
  isEditing: boolean,
  tenants: Array<any> | null,
};

class Billing extends Component {
  props: Props;
  state: State;

  constructor(props) {
    super(props);

    this.state = {
      activeIndex: null,
      activeTab: 0,
      activeTenant: null,
      isEditing: false,
      tenants: null,
    };
  }

  componentWillMount() {
    const {tenants} = this.props;
    this.setState({tenants});
  }

  componentWillReceiveProps(nextProps) {
    const {tenants} = nextProps;
    this.setState({tenants});
  }

  displayEditModal = (activeTenant = null, activeIndex = null) => {
    this.setState({
      isEditing: true,
      activeTenant,
      activeIndex,
    });
  };

  handleEditSave = (values) => {
    const {array} = this.props;
    const {activeIndex} = this.state;

    array.splice('tenants', activeIndex, 1, values);
    this.setState({isEditing: false, activeTenant: null, activeIndex: null}, () => this.props.closeReveal('editModal'));
  };

  handleCreateNew = (values) => {
    const {array} = this.props;
    array.push('tenants', values);
    this.setState({isEditing: false, activeTenant: null, activeIndex: null}, () => this.props.closeReveal('editModal'));
  };

  handleDelete = () => {
    const {array} = this.props;
    const {activeIndex} = this.state;
    array.remove('tenants', activeIndex);
    this.setState({isEditing: false, activeTenant: null, activeIndex: null}, () => this.props.closeReveal('editModal'));
  };

  handleDismissEditModal = () => {
    const {initialValues: {tenants}} = this.props;
    this.setState({
      isEditing: false,
      activeTenant: null,
      activeIndex: null,
      tenants,
    }, () => this.props.closeReveal('editModal'));
  };

  handleTabClick = (tabId) => {
    return this.setState({activeTab: tabId});
  };

  render() {
    const {
      className,
      is_biling_enabled,
      rents,
      t,
      tenants,
    } = this.props;

    const {activeTab} = this.state;

    if (!rents || !tenants) {
      return null;
    }

    return (
      <Row className={className}>
        <Column medium={12}>
          <h1 className="tab__content--title">Vuokrauksen laskutus</h1>
        </Column>

        <Tabs
          active={activeTab}
          className="billing__navigation"
          tabs={[
            'Laskutustiedot',
            'Laskut',
          ]}
          onTabClick={(id) => this.handleTabClick(id)}
        />

        <TabContent active={activeTab}>
          <TabPane className="billing__info">
            <div className="billing__info__content">

              <Column medium={12}>
                <section className="data-box borderless">
                  <div className="data-box__header">
                    <div className="data-box__header--item">
                      <span className="identifier">Laskutuksen tila</span>
                      {is_biling_enabled ? 'Käynnissä' : 'Ei käynnissä'}

                    </div>
                    <div className="data-box__header--item">
                      <span className="identifier">Laskutettavia</span>
                      {tenants ? tenants.length : ' - '}kpl
                    </div>
                    <div className="data-box__header--item main">
                      <span className="identifier">Laskutus yhteensä</span>
                      {numeral(getFullRent(rents)).format('0.00')}€
                    </div>
                  </div>
                </section>
              </Column>

              <GroupTitle text="Laskutuksen jako"/>

              {tenants && tenants.map((tenant, i) =>
                <div key={i} className="tenant">
                  <div className="tenant__header">
                    <div className="tenant__section">
                      <h4>{get(tenant, 'contact.organization_name')}</h4>
                      <p>{get(tenant, 'contact.organization_id')}</p>
                      <p>{get(tenant, 'contact.organization_address')}</p>
                    </div>

                    <div className="tenant__section">
                      <h4>{t('leases:tenants.billingInformation')}</h4>
                      <p className="tenant__section--primary">{get(tenant, 'contact.name')}</p>
                      <p>{get(tenant, 'contact.billing_address')}</p>
                      <p>{get(tenant, 'contact.electronic_billing_details')}</p>
                    </div>

                  </div>

                  <h4 className="subtitle">Laskutus</h4>

                  <div className="tenant__billing">
                    <div className="tenant__section">
                      <p>Osuus laskutuksesta</p>
                      <p className="tenant__section--primary">{getFractionFromFloat(get(tenant, 'share'))}</p>
                    </div>

                    <div className="tenant__section">
                      <p>Summa</p>
                      <p className="tenant__section--primary">{getTenantsYearlyShare(tenant, rents)}€/v</p>
                    </div>
                  </div>

                  <div className="tenant__billing">
                    <div className="tenant__section">
                      <p>Laskutusaika</p>
                      <p className="tenant__section--primary">1.1.2015 - 1.1.2045</p>
                    </div>

                    <div className="tenant__section">
                      <p>Laskutusrytmi</p>
                      <p className="tenant__section--primary">2 kk</p>
                    </div>

                    <div className="tenant__section">
                      <p>Eräpäivä</p>
                      <p className="tenant__section--primary">5.</p>
                    </div>
                  </div>

                  <a onClick={() => this.displayEditModal(tenant, i)} className="tenant__edit">
                    {t('common:edit')}
                  </a>
                </div>
              )}

              <Row className="section__controls">
                <Column medium={12}>
                  <button className="add-new-button" onClick={() => this.displayEditModal()}>Lisää jako</button>
                </Column>
              </Row>

            </div>
          </TabPane>

          <TabPane className="billing__list">
            <p>Billing list</p>
          </TabPane>
        </TabContent>

        {this.state.isEditing &&
        <EditModal size={Sizes.LARGE}
                   isOpen={this.state.isEditing}
                   component={BillingEdit}
                   handleEdit={this.handleEditSave}
                   handleCreate={this.handleCreateNew}
                   handleDelete={this.handleDelete}
                   handleDismiss={this.handleDismissEditModal}
                   activeTenant={this.state.activeTenant}
        />
        }

      </Row>
    );
  }
}

export default flowRight(
  connect(
    (state) => {
      return {
        initialValues: getFormInitialValues('preparer-form')(state),
      };
    },
  ),
  reduxForm({
    form: 'preparer-form',
    destroyOnUnmount: false,
  }),
  translate(['common, leases']),
  revealContext(),
)(Billing);
