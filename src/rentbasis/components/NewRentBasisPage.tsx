import React, { Component } from "react";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { getFormValues, isDirty } from "redux-form";
import flowRight from "lodash/flowRight";
import AuthorizationError from "src/components/authorization/AuthorizationError";
import ContentContainer from "src/components/content/ContentContainer";
import ControlButtonBar from "src/components/controlButtons/ControlButtonBar";
import ControlButtons from "src/components/controlButtons/ControlButtons";
import FullWidthContainer from "src/components/content/FullWidthContainer";
import GreenBox from "src/components/content/GreenBox";
import Loader from "src/components/loader/Loader";
import LoaderWrapper from "src/components/loader/LoaderWrapper";
import PageContainer from "src/components/content/PageContainer";
import PageNavigationWrapper from "src/components/content/PageNavigationWrapper";
import RentBasisForm from "./forms/RentBasisForm";
import { createRentBasis, hideEditMode, receiveIsSaveClicked, showEditMode } from "src/rentbasis/actions";
import { receiveTopNavigationSettings } from "src/components/topNavigation/actions";
import { FormNames, Methods, PermissionMissingTexts } from "src/enums";
import { getPayloadRentBasis } from "src/rentbasis/helpers";
import { isMethodAllowed, setPageTitle } from "src/util/helpers";
import { getRouteById, Routes } from "src/root/routes";
import { getIsFormValid, getIsSaveClicked, getIsSaving } from "src/rentbasis/selectors";
import { withRentBasisAttributes } from "src/components/attributes/RentBasisAttributes";
import { withUiDataList } from "src/components/uiData/UiDataListHOC";
import type { Methods as MethodsType } from "src/types";
import type { RootState } from "src/root/types";
type Props = {
  createRentBasis: (...args: Array<any>) => any;
  editedRentBasis: Record<string, any>;
  hideEditMode: (...args: Array<any>) => any;
  history: Record<string, any>;
  isFetchingRentBasisAttributes: boolean;
  isFormDirty: boolean;
  isFormValid: boolean;
  isSaveClicked: boolean;
  isSaving: boolean;
  location: Record<string, any>;
  receiveIsSaveClicked: (...args: Array<any>) => any;
  receiveTopNavigationSettings: (...args: Array<any>) => any;
  rentBasisMethods: MethodsType;
  router: Record<string, any>;
  showEditMode: (...args: Array<any>) => any;
};

class NewRentBasisPage extends Component<Props> {
  componentDidMount() {
    const {
      receiveIsSaveClicked,
      receiveTopNavigationSettings,
      showEditMode
    } = this.props;
    setPageTitle('Uusi vuokrausperiaate');
    receiveIsSaveClicked(false);
    receiveTopNavigationSettings({
      linkUrl: getRouteById(Routes.RENT_BASIS),
      pageTitle: 'Vuokrausperiaatteet',
      showSearch: false
    });
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
      pathname: `${getRouteById(Routes.RENT_BASIS)}`,
      search: search
    });
  };
  cancelChanges = () => {
    const {
      history
    } = this.props;
    return history.push({
      pathname: getRouteById(Routes.RENT_BASIS)
    });
  };
  saveChanges = () => {
    const {
      createRentBasis,
      editedRentBasis,
      isFormValid,
      receiveIsSaveClicked
    } = this.props;
    receiveIsSaveClicked(true);

    if (isFormValid) {
      createRentBasis(getPayloadRentBasis(editedRentBasis));
    }
  };

  render() {
    const {
      isFormValid,
      isFetchingRentBasisAttributes,
      isSaveClicked,
      isSaving,
      rentBasisMethods
    } = this.props;
    if (isFetchingRentBasisAttributes) return <PageContainer><Loader isLoading={true} /></PageContainer>;
    if (!rentBasisMethods) return null;
    if (!isMethodAllowed(rentBasisMethods, Methods.POST)) return <PageContainer><AuthorizationError text={PermissionMissingTexts.GENERAL} /></PageContainer>;
    return <FullWidthContainer>
        <PageNavigationWrapper>
          <ControlButtonBar buttonComponent={<ControlButtons allowEdit={isMethodAllowed(rentBasisMethods, Methods.POST)} isCopyDisabled={true} isEditMode={true} isSaveDisabled={isSaveClicked && !isFormValid} onCancel={this.cancelChanges} onSave={this.saveChanges} showCommentButton={false} showCopyButton={true} />} infoComponent={<h1>Uusi vuokrausperuste</h1>} onBack={this.handleBack} />
        </PageNavigationWrapper>

        <PageContainer className='with-small-control-bar'>
          {isSaving && <LoaderWrapper className='overlay-wrapper'>
              <Loader isLoading={isSaving} />
            </LoaderWrapper>}

          <ContentContainer>
            <GreenBox className='no-margin'>
              <RentBasisForm isFocusedOnMount />
            </GreenBox>
          </ContentContainer>
        </PageContainer>
      </FullWidthContainer>;
  }

}

const mapStateToProps = (state: RootState) => {
  return {
    editedRentBasis: getFormValues(FormNames.RENT_BASIS)(state),
    isFormDirty: isDirty(FormNames.RENT_BASIS)(state),
    isFormValid: getIsFormValid(state),
    isSaveClicked: getIsSaveClicked(state),
    isSaving: getIsSaving(state)
  };
};

export default flowRight(withRentBasisAttributes, withUiDataList, withRouter, connect(mapStateToProps, {
  createRentBasis,
  hideEditMode,
  receiveIsSaveClicked,
  receiveTopNavigationSettings,
  showEditMode
}))(NewRentBasisPage);