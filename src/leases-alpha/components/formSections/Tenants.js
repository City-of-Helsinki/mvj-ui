// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {translate} from 'react-i18next';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import {reduxForm, getFormInitialValues} from 'redux-form';
import {Row, Column} from 'react-foundation';

import {revealContext} from '../../../foundation/reveal';
import {Sizes} from '../../../foundation/enums';

import EditModal from '../../../components-alpha/editModal/editModal';
import TenantsEdit from './TenantsEdit';

type Props = Object;
type State = {
  isEditing: boolean,
  activeTenant: Object | null,
  activeIndex: number | null,
  tenants: Object | null,
}

class Tenants extends Component<Props, State> {
  state = {
    isEditing: false,
    activeTenant: null,
    activeIndex: null,
    tenants: null,
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

  render() {
    const {className, t} = this.props;
    const {tenants} = this.state;

    return (
      <Row className={className}>
        <Column medium={12}>
          <h1 className="tab__content--title">{t('tenants.title')}</h1>
        </Column>

        <Column medium={12}>
          <section className="tenants">
            {tenants && tenants.map((tenant, i) => (
              <div key={i} className="tenant">
                <h3 className="tenant__title">{get(tenant, 'contact.organization_name')}</h3>

                <div className="tenant__section">
                  <h4>{t('tenants.applicant')}</h4>
                  <p className="tenant__section--primary">{get(tenant, 'contact.organization_name') || ' - '}</p>
                  <p>{get(tenant, 'contact.organization_id') || ' - '}</p>
                  <p>{get(tenant, 'contact.organization_address') || ' - '}</p>
                  <p>{get(tenant, 'contact.organization_revenue') || ' - '}</p>
                </div>

                <div className="tenant__section">
                  <h4>{t('tenants.billingInformation')}</h4>
                  <p className="tenant__section--primary">{get(tenant, 'billing_contact.name', '-') || ' - '}</p>
                  <p>{get(tenant, 'billing_contact.address') || ' - '}</p>
                  <p>{get(tenant, 'billing_contact.electronic_billing_details') || ' - '}</p>
                </div>

                <div className="tenant__section">
                  <h4>{t('tenants.contactPerson')}</h4>
                  <p className="tenant__section--primary">{get(tenant, 'contact.name')}</p>
                  <p>{get(tenant, 'contact.email')}</p>
                  <p>{get(tenant, 'contact.phone')}</p>
                </div>

                <a onClick={() => this.displayEditModal(tenant, i)} className="tenant__edit">
                  {t('tenants.editTenant')}
                </a>

              </div>
            ))}
          </section>
        </Column>

        <Column medium={12} className="section__controls">
          <button className="add-new-button" onClick={() => this.displayEditModal()}>{t('tenants.addTenant')}</button>
        </Column>

        {this.state.isEditing &&
        <EditModal size={Sizes.LARGE}
          isOpen={this.state.isEditing}
          component={TenantsEdit}
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
  translate(['leases']),
  revealContext(),
)(Tenants);
