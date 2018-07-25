// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {getFormValues, isDirty} from 'redux-form';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';

import ConfirmationModal from '$components/modal/ConfirmationModal';
import ContentContainer from '$components/content/ContentContainer';
import ControlButtonBar from '$components/controlButtons/ControlButtonBar';
import ControlButtons from '$components/controlButtons/ControlButtons';
import GreenBoxEdit from '$components/content/GreenBoxEdit';
import PageContainer from '$components/content/PageContainer';
import RentBasisForm from './forms/RentBasisForm';
import {createRentBasis, fetchAttributes, receiveIsSaveClicked} from '$src/rentbasis/actions';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import {FormNames} from '$src/rentbasis/enums';
import {getRouteById} from '$src/root/routes';
import {getAttributes, getIsFormValid, getIsSaveClicked} from '$src/rentbasis/selectors';

import type {RootState} from '$src/root/types';
import type {Attributes} from '$src/rentbasis/types';

type Props = {
  attributes: Attributes,
  createRentBasis: Function,
  editedRentBasis: ?Object,
  fetchAttributes: Function,
  isFormDirty: boolean,
  isFormValid: boolean,
  isSaveClicked: boolean,
  receiveIsSaveClicked: Function,
  receiveTopNavigationSettings: Function,
  router: Object,
}

type State = {
  isCancelModalOpen: boolean,
}

class NewRentBasisPage extends Component<Props, State> {
  state = {
    isCancelModalOpen: false,
  }

  static contextTypes = {
    router: PropTypes.object,
  };

  componentWillMount() {
    const {attributes, fetchAttributes, receiveIsSaveClicked, receiveTopNavigationSettings} = this.props;

    receiveIsSaveClicked(false);
    receiveTopNavigationSettings({
      linkUrl: getRouteById('rentBasis'),
      pageTitle: 'Vuokrausperusteet',
      showSearch: false,
    });
    if(isEmpty(attributes)) {
      fetchAttributes();
    }
  }

  componentDidMount() {
    window.addEventListener('beforeunload', this.handleLeavePage);
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.handleLeavePage);
  }

  handleLeavePage = (e) => {
    const {isFormDirty} = this.props;
    if(isFormDirty) {
      const confirmationMessage = '';
      e.returnValue = confirmationMessage;     // Gecko, Trident, Chrome 34+
      return confirmationMessage;              // Gecko, WebKit, Chrome <34
    }
  }

  handleBack = () => {
    const {router} = this.context;
    const {router: {location: {query}}} = this.props;

    return router.push({
      pathname: `${getRouteById('rentBasis')}`,
      query,
    });
  }

  handleCancelModalCancelClick = () => {
    this.setState({isCancelModalOpen: false});
  }

  handleCancelModalCloseClick = () => {
    this.setState({isCancelModalOpen: false});
  }

  handleCancelClick = () => {
    const {isFormDirty} = this.props;

    if(isFormDirty) {
      this.setState({isCancelModalOpen: true});
    } else {
      this.handleCancel();
    }
  }

  handleCancel = () => {
    const {router} = this.context;

    return router.push({
      pathname: getRouteById('rentBasis'),
    });
  }

  handleSave = () => {
    const {createRentBasis, editedRentBasis, isFormValid, receiveIsSaveClicked} = this.props;

    receiveIsSaveClicked(true);
    if(isFormValid) {
      createRentBasis(editedRentBasis);
    }
  }

  render() {
    const {isFormValid, isSaveClicked} = this.props;
    const {isCancelModalOpen} = this.state;

    return (
      <PageContainer>
        <ConfirmationModal
          confirmButtonLabel='Hylkää muutokset'
          isOpen={isCancelModalOpen}
          label='Haluatko varmasti hylätä muutokset?'
          onCancel={this.handleCancelModalCancelClick}
          onClose={this.handleCancelModalCloseClick}
          onSave={this.handleCancel}
          title='Hylkää muutokset'
        />

        <ControlButtonBar
          buttonComponent={
            <ControlButtons
              isCopyDisabled={true}
              isEditMode={true}
              isSaveDisabled={isSaveClicked && !isFormValid}
              onCancelClick={this.handleCancelClick}
              onSaveClick={this.handleSave}
              showCommentButton={false}
              showCopyButton={true}
            />
          }
          infoComponent={<h1>Uusi vuokrausperuste</h1>}
          onBack={this.handleBack}
        />
        <ContentContainer>
          <GreenBoxEdit className='no-margin'>
            <RentBasisForm />
          </GreenBoxEdit>
        </ContentContainer>
      </PageContainer>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    attributes: getAttributes(state),
    editedRentBasis: getFormValues(FormNames.RENT_BASIS)(state),
    isFormDirty: isDirty(FormNames.RENT_BASIS)(state),
    isFormValid: getIsFormValid(state),
    isSaveClicked: getIsSaveClicked(state),
  };
};

export default flowRight(
  connect(
    mapStateToProps,
    {
      createRentBasis,
      fetchAttributes,
      receiveIsSaveClicked,
      receiveTopNavigationSettings,
    },
  ),
)(NewRentBasisPage);
