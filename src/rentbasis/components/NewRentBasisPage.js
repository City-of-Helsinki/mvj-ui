// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {getFormValues, isDirty} from 'redux-form';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';

import ContentContainer from '$components/content/ContentContainer';
import ControlButtonBar from '$components/controlButtons/ControlButtonBar';
import ControlButtons from '$components/controlButtons/ControlButtons';
import GreenBoxEdit from '$components/content/GreenBoxEdit';
import PageContainer from '$components/content/PageContainer';
import RentBasisForm from './forms/RentBasisForm';
import {
  createRentBasis,
  fetchAttributes,
  hideEditMode,
  receiveIsSaveClicked,
  showEditMode,
} from '$src/rentbasis/actions';
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
  hideEditMode: Function,
  isFormDirty: boolean,
  isFormValid: boolean,
  isSaveClicked: boolean,
  receiveIsSaveClicked: Function,
  receiveTopNavigationSettings: Function,
  router: Object,
  showEditMode: Function,
}

class NewRentBasisPage extends Component<Props> {
  static contextTypes = {
    router: PropTypes.object,
  };

  componentDidMount() {
    const {
      attributes,
      fetchAttributes,
      receiveIsSaveClicked,
      receiveTopNavigationSettings,
      showEditMode,
    } = this.props;

    receiveIsSaveClicked(false);
    receiveTopNavigationSettings({
      linkUrl: getRouteById('rentBasis'),
      pageTitle: 'Vuokrausperusteet',
      showSearch: false,
    });
    if(isEmpty(attributes)) {
      fetchAttributes();
    }

    showEditMode();
    window.addEventListener('beforeunload', this.handleLeavePage);
  }

  componentWillUnmount() {
    const {hideEditMode} = this.props;

    hideEditMode();
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

  cancelChanges = () => {
    const {router} = this.context;

    return router.push({
      pathname: getRouteById('rentBasis'),
    });
  }

  saveChanges = () => {
    const {createRentBasis, editedRentBasis, isFormValid, receiveIsSaveClicked} = this.props;

    receiveIsSaveClicked(true);
    if(isFormValid) {
      createRentBasis(editedRentBasis);
    }
  }

  render() {
    const {isFormValid, isSaveClicked} = this.props;

    return (
      <div style={{width: '100%'}}>
        <ControlButtonBar
          buttonComponent={
            <ControlButtons
              isCopyDisabled={true}
              isEditMode={true}
              isSaveDisabled={isSaveClicked && !isFormValid}
              onCancel={this.cancelChanges}
              onSave={this.saveChanges}
              showCommentButton={false}
              showCopyButton={true}
            />
          }
          infoComponent={<h1>Uusi vuokrausperuste</h1>}
          onBack={this.handleBack}
        />

        <PageContainer className='with-small-control-bar'>
          <ContentContainer>
            <GreenBoxEdit className='no-margin'>
              <RentBasisForm isFocusedOnMount />
            </GreenBoxEdit>
          </ContentContainer>
        </PageContainer>
      </div>
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
      hideEditMode,
      receiveIsSaveClicked,
      receiveTopNavigationSettings,
      showEditMode,
    },
  ),
)(NewRentBasisPage);
