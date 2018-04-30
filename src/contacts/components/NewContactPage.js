// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';

import {getRouteById} from '$src/root/routes';
import {createContact, fetchAttributes} from '../actions';
import {getAttributes, getContactFormTouched, getContactFormValues, getIsContactFormValid} from '../selectors';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import ConfirmationModal from '$components/modal/ConfirmationModal';
import ContactForm from './forms/ContactForm';
import ContentContainer from '$components/content/ContentContainer';
import ControlButtonBar from '$components/controlButtons/ControlButtonBar';
import ControlButtons from '$components/controlButtons/ControlButtons';
import GreenBoxEdit from '$components/content/GreenBoxEdit';
import Loader from '$components/loader/Loader';
import PageContainer from '$components/content/PageContainer';

import type {RootState} from '$src/root/types';
import type {Attributes, Contact} from '../types';

type Props = {
  attributes: Attributes,
  contactFormValues: Contact,
  createContact: Function,
  fetchAttributes: Function,
  isContactFormTouched: boolean,
  isContactFormValid: boolean,
  receiveTopNavigationSettings: Function,
  router: Object,
}

type State = {
  isCancelModalOpen: boolean,
}

class NewContactPage extends Component {
  props: Props

  state: State = {
    isCancelModalOpen: false,
  }

  static contextTypes = {
    router: PropTypes.object,
  };

  componentWillMount() {
    const {fetchAttributes, receiveTopNavigationSettings} = this.props;
    receiveTopNavigationSettings({
      linkUrl: getRouteById('contacts'),
      pageTitle: 'Asiakkaat',
      showSearch: false,
    });
    fetchAttributes();
  }

  handleBack = () => {
    const {router} = this.context;
    const {router: {location: {query}}} = this.props;

    return router.push({
      pathname: `${getRouteById('contacts')}`,
      query,
    });
  }

  handleCancel = () => {
    const {router} = this.context;
    return router.push({
      pathname: getRouteById('contacts'),
    });
  }

  handleSave = () => {
    const {contactFormValues, createContact} = this.props;
    createContact(contactFormValues);
  }

  render() {
    const {attributes, isContactFormTouched, isContactFormValid} = this.props;
    const {isCancelModalOpen} = this.state;

    return (
      <PageContainer>
        <ConfirmationModal
          confirmButtonLabel='Hylkää muutokset'
          isOpen={isCancelModalOpen}
          label='Haluatko varmasti hylätä muutokset?'
          onCancel={() => this.setState({isCancelModalOpen: false})}
          onClose={() => this.setState({isCancelModalOpen: false})}
          onSave={this.handleCancel}
          title='Hylkää muutokset'
        />

        <ControlButtonBar
          buttonComponent={
            <ControlButtons
              isCopyDisabled={true}
              isEditMode={true}
              isSaveDisabled={!isContactFormValid}
              onCancelClick={isContactFormTouched ? () => this.setState({isCancelModalOpen: true}) : this.handleCancel}
              onSaveClick={this.handleSave}
              showCommentButton={false}
              showCopyButton={true}
            />
          }
          infoComponent={<h1>Uusi asiakas</h1>}
          onBack={this.handleBack}
        />
        <ContentContainer>
          {isEmpty(attributes) &&
            <Row>
              <Column>
                <div className='loader__wrapper'><Loader isLoading={true} /></div>
              </Column>
            </Row>
          }
          {!isEmpty(attributes) &&
            <GreenBoxEdit className='no-margin'>
              <ContactForm
                attributes={attributes}
              />
            </GreenBoxEdit>
          }

        </ContentContainer>
      </PageContainer>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    attributes: getAttributes(state),
    contactFormValues: getContactFormValues(state),
    isContactFormTouched: getContactFormTouched(state),
    isContactFormValid: getIsContactFormValid(state),
  };
};

export default flowRight(
  connect(
    mapStateToProps,
    {
      createContact,
      fetchAttributes,
      receiveTopNavigationSettings,
    },
  ),
)(NewContactPage);
