import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { getFormValues, isDirty } from "redux-form";
import flowRight from "lodash/flowRight";
import AuthorizationError from "components/authorization/AuthorizationError";
import ContentContainer from "components/content/ContentContainer";
import ControlButtonBar from "components/controlButtons/ControlButtonBar";
import ControlButtons from "components/controlButtons/ControlButtons";
import FullWidthContainer from "components/content/FullWidthContainer";
import InfillDevelopmentForm from "./forms/InfillDevelopmentForm";
import Loader from "components/loader/Loader";
import LoaderWrapper from "components/loader/LoaderWrapper";
import PageContainer from "components/content/PageContainer";
import PageNavigationWrapper from "components/content/PageNavigationWrapper";
import { clearFormValidFlags, createInfillDevelopment, hideEditMode, receiveIsSaveClicked, showEditMode } from "infillDevelopment/actions";
import { receiveTopNavigationSettings } from "components/topNavigation/actions";
import { FormNames, Methods, PermissionMissingTexts } from "enums";
import { getPayloadInfillDevelopment } from "infillDevelopment/helpers";
import { isMethodAllowed, setPageTitle } from "util/helpers";
import { getRouteById, Routes } from "root/routes";
import { getIsFormValidById, getIsSaveClicked, getIsSaving } from "infillDevelopment/selectors";
import { withInfillDevelopmentPageAttributes } from "components/attributes/InfillDevelopmentPageAttributes";
import { withUiDataList } from "components/uiData/UiDataListHOC";
import type { Methods as MethodsType } from "types";
import type { RootState } from "root/types";
type Props = {
  clearFormValidFlags: (...args: Array<any>) => any;
  createInfillDevelopment: (...args: Array<any>) => any;
  formValues: Record<string, any>;
  hideEditMode: (...args: Array<any>) => any;
  history: Record<string, any>;
  infillDevelopmentMethods: MethodsType;
  // get via withInfillDevelopmentPageAttributes HOC
  isFetchingInfillDevelopmentPageAttributes: boolean;
  // get via withInfillDevelopmentPageAttributes HOC
  isFormDirty: boolean;
  isFormValid: boolean;
  isSaveClicked: boolean;
  isSaving: boolean;
  location: Record<string, any>;
  receiveIsSaveClicked: (...args: Array<any>) => any;
  receiveTopNavigationSettings: (...args: Array<any>) => any;
  showEditMode: (...args: Array<any>) => any;
};

class NewInfillDevelopmentPage extends Component<Props> {
  componentDidMount() {
    const {
      clearFormValidFlags,
      receiveIsSaveClicked,
      receiveTopNavigationSettings,
      showEditMode
    } = this.props;
    setPageTitle('Uusi täydennysrakentamiskorvaus');
    receiveTopNavigationSettings({
      linkUrl: getRouteById(Routes.INFILL_DEVELOPMENTS),
      pageTitle: 'Täydennysrakantamiskorvaus',
      showSearch: false
    });
    receiveIsSaveClicked(false);
    clearFormValidFlags();
    showEditMode();
    window.addEventListener('beforeunload', this.handleLeavePage);
  }

  componentWillUnmount() {
    const {
      hideEditMode
    } = this.props;
    hideEditMode();
    window.removeEventListener('beforeunload', this.handleLeavePage);
  }

  handleLeavePage = e => {
    const {
      isFormDirty
    } = this.props;

    if (isFormDirty) {
      const confirmationMessage = '';
      e.returnValue = confirmationMessage; // Gecko, Trident, Chrome 34+

      return confirmationMessage; // Gecko, WebKit, Chrome <34
    }
  };
  handleBack = () => {
    const {
      history,
      location: {
        search
      }
    } = this.props;
    return history.push({
      pathname: `${getRouteById(Routes.INFILL_DEVELOPMENTS)}`,
      search: search
    });
  };
  cancelChanges = () => {
    const {
      history
    } = this.props;
    return history.push({
      pathname: getRouteById(Routes.INFILL_DEVELOPMENTS)
    });
  };
  saveChanges = () => {
    const {
      formValues,
      createInfillDevelopment,
      isFormValid,
      receiveIsSaveClicked
    } = this.props;
    receiveIsSaveClicked(true);

    if (isFormValid) {
      createInfillDevelopment(getPayloadInfillDevelopment(formValues));
    }
  };

  render() {
    const {
      infillDevelopmentMethods,
      isFetchingInfillDevelopmentPageAttributes,
      isFormValid,
      isSaveClicked,
      isSaving
    } = this.props;
    if (isFetchingInfillDevelopmentPageAttributes) return <PageContainer><Loader isLoading={true} /></PageContainer>;
    if (!infillDevelopmentMethods) return null;
    if (!isMethodAllowed(infillDevelopmentMethods, Methods.POST)) return <PageContainer><AuthorizationError text={PermissionMissingTexts.GENERAL} /></PageContainer>;
    return <FullWidthContainer>
        <PageNavigationWrapper>
          <ControlButtonBar buttonComponent={<ControlButtons allowEdit={isMethodAllowed(infillDevelopmentMethods, Methods.POST)} isCopyDisabled={true} isEditMode={true} isSaveDisabled={isSaveClicked && !isFormValid} onCancel={this.cancelChanges} onSave={this.saveChanges} showCommentButton={false} showCopyButton={true} />} infoComponent={<h1>Uusi täydennysrakentamiskorvaus</h1>} onBack={this.handleBack} />
        </PageNavigationWrapper>

        <PageContainer className='with-small-control-bar'>
          {isSaving && <LoaderWrapper className='overlay-wrapper'>
              <Loader isLoading={isSaving} />
            </LoaderWrapper>}

          <ContentContainer>
            <InfillDevelopmentForm isFocusedOnMount />
          </ContentContainer>
        </PageContainer>
      </FullWidthContainer>;
  }

}

const mapStateToProps = (state: RootState) => {
  return {
    formValues: getFormValues(FormNames.INFILL_DEVELOPMENT)(state),
    isFormValid: getIsFormValidById(state, FormNames.INFILL_DEVELOPMENT),
    isFormDirty: isDirty(FormNames.INFILL_DEVELOPMENT)(state),
    isSaveClicked: getIsSaveClicked(state),
    isSaving: getIsSaving(state)
  };
};

export default flowRight(withInfillDevelopmentPageAttributes, withUiDataList, withRouter, connect(mapStateToProps, {
  clearFormValidFlags,
  createInfillDevelopment,
  hideEditMode,
  receiveIsSaveClicked,
  receiveTopNavigationSettings,
  showEditMode
}))(NewInfillDevelopmentPage);