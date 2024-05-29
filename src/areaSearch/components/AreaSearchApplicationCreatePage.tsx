import React, { Component } from "react";
import { connect } from "react-redux";
import { flowRight } from "lodash/util";
import { destroy, getFormValues, initialize, isDirty } from "redux-form";
import { getRouteById, Routes } from "root/routes";
import FullWidthContainer from "components/content/FullWidthContainer";
import PageNavigationWrapper from "components/content/PageNavigationWrapper";
import ControlButtonBar from "components/controlButtons/ControlButtonBar";
import ControlButtons from "components/controlButtons/ControlButtons";
import Tabs from "components/tabs/Tabs";
import TabContent from "components/tabs/TabContent";
import TabPane from "components/tabs/TabPane";
import PageContainer from "components/content/PageContainer";
import ContentContainer from "components/content/ContentContainer";
import AreaSearchApplicationCreateSpecs from "areaSearch/components/AreaSearchApplicationCreateSpecs";
import { createAreaSearchApplication, createAreaSearchSpecs, deleteUploadedAttachment, fetchAttributes, hideEditMode, receiveIsSaveClicked, receiveSingleAreaSearch, showEditMode, uploadAttachment } from "areaSearch/actions";
import { getAttributes, getCurrentAreaSearch, getIsFetchingAttributes, getIsFormValidById, getIsSaveClicked, getIsPerformingFileOperation, getIsSubmittingAreaSearchSpecs, getIsSubmittingAreaSearchApplication } from "areaSearch/selectors";
import { setPageTitle } from "util/helpers";
import Loader from "components/loader/Loader";
import AreaSearchApplicationCreateForm from "areaSearch/components/AreaSearchApplicationCreateForm";
import { FormNames } from "enums";
import { getInitialAreaSearchCreateForm, prepareAreaSearchDataForSubmission } from "areaSearch/helpers";
import type { Attributes } from "types";
import { getFormAttributes, getIsFetchingFormAttributes } from "application/selectors";
import { fetchFormAttributes } from "application/actions";
import type { UploadedFileMeta } from "application/types";
type OwnProps = {};
type Props = OwnProps & {
  history: Record<string, any>;
  isFetchingAttributes: boolean;
  fetchAttributes: (...args: Array<any>) => any;
  receiveSingleAreaSearch: (...args: Array<any>) => any;
  currentAreaSearch: Record<string, any> | null;
  fetchFormAttributes: (...args: Array<any>) => any;
  formAttributes: Attributes;
  isFetchingFormAttributes: boolean;
  specsFormValues: Record<string, any>;
  hideEditMode: (...args: Array<any>) => any;
  showEditMode: (...args: Array<any>) => any;
  isSpecsFormDirty: boolean;
  isSpecsFormValid: boolean;
  isApplicationFormDirty: boolean;
  isApplicationFormValid: boolean;
  createAreaSearchSpecs: (...args: Array<any>) => any;
  createAreaSearchApplication: (...args: Array<any>) => any;
  receiveIsSaveClicked: (...args: Array<any>) => any;
  isPerformingFileOperation: boolean;
  isSaveClicked: boolean;
  uploadAttachment: (...args: Array<any>) => any;
  deleteUploadedAttachment: (...args: Array<any>) => any;
  isSubmitting: boolean;
  initialize: (...args: Array<any>) => any;
  destroy: (...args: Array<any>) => any;
};
type State = {
  activeTab: number;
  attachments: Array<UploadedFileMeta>;
  initialized: boolean;
};

class AreaSearchApplicationCreatePage extends Component<Props, State> {
  state: State = {
    activeTab: 0,
    attachments: [],
    initialized: false
  };

  componentDidMount() {
    const {
      fetchAttributes,
      fetchFormAttributes,
      receiveSingleAreaSearch,
      showEditMode
    } = this.props;
    setPageTitle('Uusi aluehakemus');
    receiveSingleAreaSearch(null);
    showEditMode();
    fetchAttributes();
    fetchFormAttributes();
    this.initializeForms();
  }

  componentWillUnmount() {
    this.props.hideEditMode();
    this.destroyAllForms();
  }

  initializeForms: () => void = () => {
    const {
      initialize
    } = this.props;
    initialize(FormNames.AREA_SEARCH_CREATE_SPECS, getInitialAreaSearchCreateForm());
    initialize(FormNames.AREA_SEARCH_CREATE_FORM, {
      form: null
    });
    this.setState(() => ({
      initialized: true
    }));
  };
  destroyAllForms: () => void = () => {
    const {
      destroy
    } = this.props;
    destroy(FormNames.AREA_SEARCH_CREATE_SPECS);
    destroy(FormNames.AREA_SEARCH_CREATE_FORM);
  };

  componentDidUpdate(prevProps: Props) {
    const {
      initialize,
      specsFormValues
    } = this.props;

    if (this.props.currentAreaSearch && !prevProps.currentAreaSearch) {
      initialize(FormNames.AREA_SEARCH_CREATE_SPECS, specsFormValues);
      this.setState(() => ({
        activeTab: 1
      }));
      receiveIsSaveClicked(false);
    }
  }

  handleBack: () => void = () => {
    const {
      history
    } = this.props;
    history.push(getRouteById(Routes.AREA_SEARCH));
  };
  saveChanges: () => void = () => {
    const {
      createAreaSearchApplication,
      receiveIsSaveClicked
    } = this.props;
    receiveIsSaveClicked(true);
    const areFormsValid = this.areFormsValid();

    if (areFormsValid) {
      const data = prepareAreaSearchDataForSubmission();

      if (!data) {
        // an error occurred
        receiveIsSaveClicked(false);
        return;
      }

      createAreaSearchApplication(data);
    }
  };
  submitSearchPart = () => {
    const {
      specsFormValues,
      createAreaSearchSpecs,
      receiveIsSaveClicked
    } = this.props;
    const {
      attachments
    } = this.state;
    receiveIsSaveClicked(true);
    const areFormsValid = this.areFormsValid();

    if (areFormsValid) {
      createAreaSearchSpecs({
        area_search_attachments: attachments.map(attachment => attachment.id),
        ...specsFormValues,
        end_date: specsFormValues.end_date || null
      });
    }
  };
  areFormsValid: () => boolean = () => {
    const {
      isSpecsFormValid,
      isApplicationFormValid,
      currentAreaSearch
    } = this.props;
    return isSpecsFormValid && (!currentAreaSearch || isApplicationFormValid);
  };
  handleFileAdded = (file: File) => {
    const {
      uploadAttachment,
      currentAreaSearch
    } = this.props;
    uploadAttachment({
      fileData: file,
      areaSearch: currentAreaSearch?.id,
      callback: result => this.setState(state => ({
        attachments: [...state.attachments, result]
      }))
    });
  };
  handleFileRemoved = (id: number) => {
    const {
      deleteUploadedAttachment,
      currentAreaSearch
    } = this.props;

    if (currentAreaSearch) {
      deleteUploadedAttachment({
        id,
        callback: () => this.setState(state => ({
          attachments: [...state.attachments.filter(file => file.id !== id)]
        }))
      });
    } else {
      this.setState(state => ({
        attachments: [...state.attachments.filter(file => file.id !== id)]
      }));
    }
  };

  render(): React.ReactNode {
    const {
      isFetchingAttributes,
      currentAreaSearch,
      isFetchingFormAttributes,
      isSaveClicked,
      isPerformingFileOperation,
      isSubmitting,
      isSpecsFormValid,
      isApplicationFormValid,
      isSpecsFormDirty,
      isApplicationFormDirty
    } = this.props;
    const {
      activeTab,
      attachments,
      initialized
    } = this.state;
    const areFormsValid = this.areFormsValid();

    if (isFetchingAttributes || isFetchingFormAttributes) {
      return <PageContainer>
        <Loader isLoading={true} />
      </PageContainer>;
    }

    return <FullWidthContainer>
        <PageNavigationWrapper>
          <ControlButtonBar buttonComponent={<ControlButtons allowDelete={false} allowEdit={true} isCopyDisabled={true} isEditDisabled={true} isEditMode={true} isSaveDisabled={isSubmitting || isPerformingFileOperation || isSaveClicked && !areFormsValid} onCancel={this.handleBack} onSave={!currentAreaSearch ? this.submitSearchPart : this.saveChanges} showCommentButton={false} showCopyButton={false} saveButtonText={!currentAreaSearch ? 'Jatka lomakkeen täyttöön' : 'Tallenna'} />} infoComponent={<h1>
              Uusi aluehakemus
            </h1>} onBack={this.handleBack} />
          <Tabs active={activeTab} isEditMode={true} tabs={[{
          label: 'Aluehaun määritys',
          allow: true,
          isDirty: isSpecsFormDirty,
          hasError: isSaveClicked && !isSpecsFormValid
        }, {
          label: 'Hakemus',
          allow: !!currentAreaSearch,
          isDirty: isApplicationFormDirty,
          hasError: !currentAreaSearch || isSaveClicked && !isApplicationFormValid
        }]} onTabClick={i => this.setState(() => ({
          activeTab: i
        }))} />
        </PageNavigationWrapper>
        <PageContainer className='with-control-bar-and-tabs' hasTabs>
          <TabContent active={activeTab}>
            <TabPane>
              <ContentContainer>
                {initialized && <AreaSearchApplicationCreateSpecs attachments={attachments} onFileAdded={this.handleFileAdded} onFileRemoved={this.handleFileRemoved} />}
              </ContentContainer>
            </TabPane>
            <TabPane>
              <ContentContainer>
                {currentAreaSearch && <AreaSearchApplicationCreateForm formData={currentAreaSearch.form} />}
              </ContentContainer>
            </TabPane>
          </TabContent>
        </PageContainer>
      </FullWidthContainer>;
  }

}

export default (flowRight(connect(state => {
  return {
    isFetchingAttributes: getIsFetchingAttributes(state),
    currentAreaSearch: getCurrentAreaSearch(state),
    attributes: getAttributes(state),
    formAttributes: getFormAttributes(state),
    isFetchingFormAttributes: getIsFetchingFormAttributes(state),
    specsFormValues: getFormValues(FormNames.AREA_SEARCH_CREATE_SPECS)(state),
    isSpecsFormDirty: isDirty(FormNames.AREA_SEARCH_CREATE_SPECS)(state),
    isSpecsFormValid: getIsFormValidById(state, FormNames.AREA_SEARCH_CREATE_SPECS),
    isApplicationFormDirty: isDirty(FormNames.AREA_SEARCH_CREATE_FORM)(state),
    isApplicationFormValid: getIsFormValidById(state, FormNames.AREA_SEARCH_CREATE_FORM),
    isSaveClicked: getIsSaveClicked(state),
    isPerformingFileOperation: getIsPerformingFileOperation(state),
    isSubmitting: getIsSubmittingAreaSearchSpecs(state) || getIsSubmittingAreaSearchApplication(state)
  };
}, {
  fetchAttributes,
  fetchFormAttributes,
  receiveSingleAreaSearch,
  showEditMode,
  hideEditMode,
  createAreaSearchSpecs,
  createAreaSearchApplication,
  receiveIsSaveClicked,
  uploadAttachment,
  deleteUploadedAttachment,
  initialize,
  destroy
}))(AreaSearchApplicationCreatePage) as React.ComponentType<OwnProps>);