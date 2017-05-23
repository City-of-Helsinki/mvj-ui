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

import EditModal from '../../../components/editModal/editModal';
import TenantsEdit from './TenantsEdit';

type Props = Object;
type State = {
  isEditing: boolean,
  activeTenant: number | null,
  tenants: Object | null,
}

class Tenants extends Component {

  props: Props;
  state: State;

  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      activeTenant: null,
      tenants: null,
    };
  }

  componentWillMount() {
    const {tenants} = this.props;
    this.setState({tenants});
  }

  componentWillReceiveProps(nextProps) {
    const {tenants} = nextProps;
    if (this.props.tenants && this.props.tenants.length !== tenants.length) {
      this.setState({tenants});
    }
  }

  displayEditModal = (id = null) => {
    this.setState({
      isEditing: true,
      activeTenant: id,
    });
  };

  handleEditSave = ({tenants}) => {
    this.setState({isEditing: false, activeTenant: null, tenants}, () => this.props.closeReveal('editModal'));
  };

  handleCreateNew = ({tenants: {NEW}}) => {
    const {array} = this.props;
    array.push('tenants', NEW);
    this.setState({isEditing: false, activeTenant: null}, () => this.props.closeReveal('editModal'));
  };

  handleDelete = () => {
    const {array} = this.props;
    const {activeTenant} = this.state;
    array.remove('tenants', activeTenant);
    this.setState({isEditing: false, activeTenant: null}, () => this.props.closeReveal('editModal'));
  };

  handleDismissEditModal = () => {
    const {initialValues: {tenants}} = this.props;
    this.setState({isEditing: false, activeTenant: null, tenants}, () => this.props.closeReveal('editModal'));
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
                  <p className="tenant__section--primary">{get(tenant, 'billing_contact', '-') || ' - '}</p>
                  <p>{get(tenant, 'billing_address') || ' - '}</p>
                  <p>{get(tenant, 'contact.electronic_billing_details') || ' - '}</p>
                </div>

                <div className="tenant__section">
                  <h4>{t('tenants.contactPerson')}</h4>
                  <p className="tenant__section--primary">{get(tenant, 'contact.name')}</p>
                  <p>{get(tenant, 'contact.email')}</p>
                  <p>{get(tenant, 'contact.phone')}</p>
                </div>

                <a onClick={() => this.displayEditModal(i)} className="tenant__edit">
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
