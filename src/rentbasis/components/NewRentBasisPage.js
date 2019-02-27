// @flow
import React, {Component} from 'react';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import {getFormValues, isDirty} from 'redux-form';
import flowRight from 'lodash/flowRight';

import AuthorizationError from '$components/authorization/AuthorizationError';
import ContentContainer from '$components/content/ContentContainer';
import ControlButtonBar from '$components/controlButtons/ControlButtonBar';
import ControlButtons from '$components/controlButtons/ControlButtons';
import FullWidthContainer from '$components/content/FullWidthContainer';
import GreenBox from '$components/content/GreenBox';
import Loader from '$components/loader/Loader';
import LoaderWrapper from '$components/loader/LoaderWrapper';
import PageContainer from '$components/content/PageContainer';
import RentBasisForm from './forms/RentBasisForm';
import {
  createRentBasis,
  hideEditMode,
  receiveIsSaveClicked,
  showEditMode,
} from '$src/rentbasis/actions';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import {Methods, PermissionMissingTexts} from '$src/enums';
import {FormNames} from '$src/rentbasis/enums';
import {formatRentBasisForDb} from '$src/rentbasis/helpers';
import {isMethodAllowed} from '$util/helpers';
import {getRouteById, Routes} from '$src/root/routes';
import {getIsFormValid, getIsSaveClicked, getIsSaving} from '$src/rentbasis/selectors';
import {withCommonAttributes} from '$components/attributes/CommonAttributes';
import {withUiDataList} from '$components/uiData/UiDataListHOC';

import type {Methods as MethodsType} from '$src/types';
import type {RootState} from '$src/root/types';

type Props = {
  createRentBasis: Function,
  editedRentBasis: Object,
  hideEditMode: Function,
  history: Object,
  isFetchingCommonAttributes: boolean,
  isFormDirty: boolean,
  isFormValid: boolean,
  isSaveClicked: boolean,
  isSaving: boolean,
  location: Object,
  receiveIsSaveClicked: Function,
  receiveTopNavigationSettings: Function,
  rentBasisMethods: MethodsType,
  router: Object,
  showEditMode: Function,
}

class NewRentBasisPage extends Component<Props> {
  componentDidMount() {
    const {
      receiveIsSaveClicked,
      receiveTopNavigationSettings,
      showEditMode,
    } = this.props;

    receiveIsSaveClicked(false);

    receiveTopNavigationSettings({
      linkUrl: getRouteById(Routes.RENT_BASIS),
      pageTitle: 'Vuokrausperusteet',
      showSearch: false,
    });

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
    const {history, location: {search}} = this.props;

    return history.push({
      pathname: `${getRouteById(Routes.RENT_BASIS)}`,
      search: search,
    });
  }

  cancelChanges = () => {
    const {history} = this.props;

    return history.push({
      pathname: getRouteById(Routes.RENT_BASIS),
    });
  }

  saveChanges = () => {
    const {createRentBasis, editedRentBasis, isFormValid, receiveIsSaveClicked} = this.props;

    receiveIsSaveClicked(true);
    if(isFormValid) {
      createRentBasis(formatRentBasisForDb(editedRentBasis));
    }
  }

  render() {
    const {
      isFormValid,
      isFetchingCommonAttributes,
      isSaveClicked,
      isSaving,
      rentBasisMethods,
    } = this.props;

    if(isFetchingCommonAttributes) return <PageContainer><Loader isLoading={true} /></PageContainer>;

    if(!rentBasisMethods) return null;

    if(!isMethodAllowed(rentBasisMethods, Methods.POST)) return <PageContainer><AuthorizationError text={PermissionMissingTexts.GENERAL} /></PageContainer>;

    return (
      <FullWidthContainer>
        <ControlButtonBar
          buttonComponent={
            <ControlButtons
              allowEdit={isMethodAllowed(rentBasisMethods, Methods.POST)}
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
          {isSaving &&
            <LoaderWrapper className='overlay-wrapper'>
              <Loader isLoading={isSaving} />
            </LoaderWrapper>
          }

          <ContentContainer>
            <GreenBox className='no-margin'>
              <RentBasisForm isFocusedOnMount />
            </GreenBox>
          </ContentContainer>
        </PageContainer>
      </FullWidthContainer>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    editedRentBasis: getFormValues(FormNames.RENT_BASIS)(state),
    isFormDirty: isDirty(FormNames.RENT_BASIS)(state),
    isFormValid: getIsFormValid(state),
    isSaveClicked: getIsSaveClicked(state),
    isSaving: getIsSaving(state),
  };
};

export default flowRight(
  withCommonAttributes,
  withUiDataList,
  withRouter,
  connect(
    mapStateToProps,
    {
      createRentBasis,
      hideEditMode,
      receiveIsSaveClicked,
      receiveTopNavigationSettings,
      showEditMode,
    },
  ),
)(NewRentBasisPage);
