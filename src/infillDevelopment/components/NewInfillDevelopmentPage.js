// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {getFormValues, isDirty} from 'redux-form';
import flowRight from 'lodash/flowRight';

import AuthorizationError from '$components/authorization/AuthorizationError';
import ContentContainer from '$components/content/ContentContainer';
import ControlButtonBar from '$components/controlButtons/ControlButtonBar';
import ControlButtons from '$components/controlButtons/ControlButtons';
import FullWidthContainer from '$components/content/FullWidthContainer';
import InfillDevelopmentForm from './forms/InfillDevelopmentForm';
import Loader from '$components/loader/Loader';
import LoaderWrapper from '$components/loader/LoaderWrapper';
import PageContainer from '$components/content/PageContainer';
import {
  clearFormValidFlags,
  createInfillDevelopment,
  hideEditMode,
  receiveIsSaveClicked,
  showEditMode,
} from '$src/infillDevelopment/actions';
import {receiveTopNavigationSettings} from '$components/topNavigation/actions';
import {Methods, PermissionMissingTexts} from '$src/enums';
import {FormNames} from '$src/infillDevelopment/enums';
import {getContentInfillDevelopmentForDb} from '$src/infillDevelopment/helpers';
import {isMethodAllowed} from '$util/helpers';
import {getRouteById, Routes} from '$src/root/routes';
import {getIsFormValidById, getIsSaveClicked, getIsSaving} from '$src/infillDevelopment/selectors';
import {withCommonAttributes} from '$components/attributes/CommonAttributes';
import {withUiDataList} from '$components/uiData/UiDataListHOC';

import type {Methods as MethodsType} from '$src/types';
import type {RootState} from '$src/root/types';

type Props = {
  clearFormValidFlags: Function,
  createInfillDevelopment: Function,
  formValues: Object,
  hideEditMode: Function,
  history: Object,
  infillDevelopmentMethods: MethodsType, // get via withCommonAttributes HOC
  isFetchingCommonAttributes: boolean, // get via withCommonAttributes HOC
  isFormDirty: boolean,
  isFormValid: boolean,
  isSaveClicked: boolean,
  isSaving: boolean,
  location: Object,
  receiveIsSaveClicked: Function,
  receiveTopNavigationSettings: Function,
  showEditMode: Function,
}

class NewInfillDevelopmentPage extends Component<Props> {
  componentDidMount() {
    const {
      clearFormValidFlags,
      receiveIsSaveClicked,
      receiveTopNavigationSettings,
      showEditMode,
    } = this.props;

    receiveTopNavigationSettings({
      linkUrl: getRouteById(Routes.INFILL_DEVELOPMENTS),
      pageTitle: 'Täydennysrakantamiskorvaus',
      showSearch: false,
    });

    receiveIsSaveClicked(false);
    clearFormValidFlags();

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
      pathname: `${getRouteById(Routes.INFILL_DEVELOPMENTS)}`,
      search: search,
    });
  }

  cancelChanges = () => {
    const {history} = this.props;

    return history.push({
      pathname: getRouteById(Routes.INFILL_DEVELOPMENTS),
    });
  }

  saveChanges = () => {
    const {formValues, createInfillDevelopment, isFormValid, receiveIsSaveClicked} = this.props;

    receiveIsSaveClicked(true);
    if(isFormValid) {
      createInfillDevelopment(getContentInfillDevelopmentForDb(formValues));
    }
  }

  render() {
    const {
      infillDevelopmentMethods,
      isFetchingCommonAttributes,
      isFormValid,
      isSaveClicked,
      isSaving,
    } = this.props;

    if(isFetchingCommonAttributes) return <PageContainer><Loader isLoading={true} /></PageContainer>;

    if(!infillDevelopmentMethods) return null;

    if(!isMethodAllowed(infillDevelopmentMethods, Methods.POST)) return <PageContainer><AuthorizationError text={PermissionMissingTexts.GENERAL} /></PageContainer>;

    return (
      <FullWidthContainer>
        <ControlButtonBar
          buttonComponent={
            <ControlButtons
              allowEdit={isMethodAllowed(infillDevelopmentMethods, Methods.POST)}
              isCopyDisabled={true}
              isEditMode={true}
              isSaveDisabled={isSaveClicked && !isFormValid}
              onCancel={this.cancelChanges}
              onSave={this.saveChanges}
              showCommentButton={false}
              showCopyButton={true}
            />
          }
          infoComponent={<h1>Uusi täydennysrakentamiskorvaus</h1>}
          onBack={this.handleBack}
        />

        <PageContainer className='with-small-control-bar'>
          {isSaving &&
            <LoaderWrapper className='overlay-wrapper'>
              <Loader isLoading={isSaving} />
            </LoaderWrapper>
          }

          <ContentContainer>
            <InfillDevelopmentForm isFocusedOnMount/>
          </ContentContainer>
        </PageContainer>
      </FullWidthContainer>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    formValues: getFormValues(FormNames.INFILL_DEVELOPMENT)(state),
    isFormValid: getIsFormValidById(state, FormNames.INFILL_DEVELOPMENT),
    isFormDirty: isDirty(FormNames.INFILL_DEVELOPMENT)(state),
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
      clearFormValidFlags,
      createInfillDevelopment,
      hideEditMode,
      receiveIsSaveClicked,
      receiveTopNavigationSettings,
      showEditMode,
    },
  ),
)(NewInfillDevelopmentPage);
