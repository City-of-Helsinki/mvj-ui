import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import flowRight from "lodash/flowRight";
import isEmpty from "lodash/isEmpty";
import { groupBy } from "lodash/collection";
import { initialize, isDirty, destroy, getFormValues, isValid, change } from "redux-form";
import type { ContextRouter } from "react-router";
import AuthorizationError from "components/authorization/AuthorizationError";
import FullWidthContainer from "components/content/FullWidthContainer";
import PageContainer from "components/content/PageContainer";
import { ButtonColors } from "components/enums";
import Loader from "components/loader/Loader";
import TabContent from "components/tabs/TabContent";
import TabPane from "components/tabs/TabPane";
import Tabs from "components/tabs/Tabs";
import ContentContainer from "components/content/ContentContainer";
import { getIsFetching as getIsFetchingUsersPermissions, getUsersPermissions } from "usersPermissions/selectors";
import PageNavigationWrapper from "components/content/PageNavigationWrapper";
import ControlButtonBar from "components/controlButtons/ControlButtonBar";
import ControlButtons from "components/controlButtons/ControlButtons";
import { receiveTopNavigationSettings } from "components/topNavigation/actions";
import { getRouteById, Routes } from "root/routes";
import { ConfirmationModalTexts, FormNames, Methods, PermissionMissingTexts } from "enums";
import { getIsEditMode, getIsSaveClicked, getIsFormValidFlags, getCurrentAreaSearch, getIsFetchingCurrentAreaSearch } from "areaSearch/selectors";
import { showEditMode, receiveIsSaveClicked, hideEditMode, clearFormValidFlags, receiveFormValidFlags, fetchSingleAreaSearch, batchEditAreaSearchInfoChecks } from "areaSearch/actions";
import { getUrlParams, setPageTitle, isMethodAllowed, getSearchQuery, scrollToTopPage } from "util/helpers";
import { clearUnsavedChanges } from "contacts/helpers";
import ConfirmationModal from "components/modal/ConfirmationModal";
import AreaSearchApplication from "areaSearch/components/AreaSearchApplication";
import { withAreaSearchAttributes } from "components/attributes/AreaSearchAttributes";
import AreaSearchApplicationEdit from "areaSearch/components/AreaSearchApplicationEdit";
import AreaSearchApplicationAuditLog from "areaSearch/components/AreaSearchApplicationAuditLog";
import { fetchApplicantInfoCheckAttributes, fetchFormAttributes } from "application/actions";
import { getFormAttributes, getIsFetchingApplicantInfoCheckAttributes, getIsFetchingFormAttributes } from "application/selectors";
import { getApplicationApplicantInfoCheckData } from "areaSearch/selectors";
import { getApplicantInfoCheckFormName, getApplicantInfoCheckItems, prepareApplicantInfoCheckForSubmission } from "application/helpers";
import { prepareAreaSearchForSubmission } from "areaSearch/helpers";
import type { Attributes, Methods as MethodsType } from "types";
import type { InfoCheckBatchEditData } from "areaSearch/types";
import type { UsersPermissions as UsersPermissionsType } from "usersPermissions/types";
import SingleAreaSearchMap from "areaSearch/components/map/SingleAreaSearchMap";
type OwnProps = {};
type Props = ContextRouter & OwnProps & {
  clearFormValidFlags: (...args: Array<any>) => any;
  currentAreaSearch: Record<string, any> | null | undefined;
  fetchSingleAreaSearch: (...args: Array<any>) => any;
  basicInformationFormValues: Record<string, any>;
  receiveTopNavigationSettings: (...args: Array<any>) => any;
  showEditMode: (...args: Array<any>) => any;
  hideEditMode: (...args: Array<any>) => any;
  areaSearchAttributes: Attributes;
  areaSearchMethods: MethodsType;
  isFetchingAttributes: boolean;
  usersPermissions: UsersPermissionsType;
  isFetchingUsersPermissions: boolean;
  isFetching: boolean;
  isEditMode: boolean;
  isSaveClicked: boolean;
  receiveIsSaveClicked: (...args: Array<any>) => any;
  initialize: typeof initialize;
  change: (...args: Array<any>) => any;
  destroy: (...args: Array<any>) => any;
  isFormValidFlags: boolean;
  receiveFormValidFlags: (...args: Array<any>) => any;
  isPerformingFileOperation: boolean;
  applicantInfoChecks: Array<Record<string, any>>;
  isFormDirty: (arg0: string, arg1: Array<string> | null | undefined) => boolean;
  isFormValid: (arg0: string) => boolean;
  getValuesForForm: (arg0: string) => Record<string, any>;
  isFetchingFormAttributes: boolean;
  formAttributes: Attributes;
  fetchFormAttributes: (...args: Array<any>) => any;
  isFetchingApplicantInfoCheckAttributes: boolean;
  fetchApplicantInfoCheckAttributes: (...args: Array<any>) => any;
  batchEditAreaSearchInfoChecks: (...args: Array<any>) => any;
};

const AreaSearchApplicationPage = ({
  clearFormValidFlags,
  currentAreaSearch,
  fetchSingleAreaSearch,
  basicInformationFormValues,
  receiveTopNavigationSettings,
  showEditMode,
  hideEditMode,
  areaSearchAttributes,
  areaSearchMethods,
  isFetchingAttributes,
  usersPermissions,
  isFetchingUsersPermissions,
  isFetching,
  isEditMode,
  isSaveClicked,
  receiveIsSaveClicked,
  initialize,
  change,
  destroy,
  isFormValidFlags,
  receiveFormValidFlags,
  isPerformingFileOperation,
  applicantInfoChecks,
  isFormDirty,
  isFormValid,
  getValuesForForm,
  isFetchingFormAttributes,
  formAttributes,
  fetchFormAttributes,
  isFetchingApplicantInfoCheckAttributes,
  fetchApplicantInfoCheckAttributes,
  batchEditAreaSearchInfoChecks,
  history,
  match: {
    params: {
      areaSearchId
    }
  },
  location: {
    search
  }
}: Props) => {
  const [activeTab, setActiveTab] = useState<number>(0)
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState<boolean>(false)
  const [applicantInfoCheckFormNames, setApplicantInfoCheckFormNames] = useState<Array<string>>([])
  const [timerAutoSave, setTimerAutoSave] = useState<number | null>(null)

  useEffect(() => {
    const query = getUrlParams(search);

    if (query.tab) {
      setActiveTab(query.tab);
    }

    clearFormValidFlags();
    receiveIsSaveClicked(false);
    receiveTopNavigationSettings({
      linkUrl: getRouteById(Routes.AREA_SEARCH),
      pageTitle: 'Aluehaun hakemukset',
      showSearch: true
    });

    if (query.tab) {
      setActiveTab(query.tab);
    }

    fetchSingleAreaSearch(areaSearchId);
    fetchFormAttributes();
    fetchApplicantInfoCheckAttributes();
    setPageTitle('Hakemus');
    return () => {
      hideEditMode();
      clearFormValidFlags();
    }
  }, [])

  const handleShowEditMode = () => {
    receiveIsSaveClicked(false);
    clearFormValidFlags();
    showEditMode();
    destroyAllForms();
    initializeInfoCheckForms();
    startAutoSaveTimer();
  };
  const startAutoSaveTimer = () => {
    const timer = setInterval(() => saveUnsavedChanges(), 5000)
    // @ts-ignore: Argument of type 'Timeout' is not assignable to parameter of type 'SetStateAction<number>'.ts(2345)
    setTimerAutoSave(timer);
  };
  const initializeInfoCheckForms = () => {
    let applicantInfoCheckFormNamesInit = [];
    const applicantInfoChecksByApplicantId = groupBy(applicantInfoChecks, 'entry');
    Object.keys(applicantInfoChecksByApplicantId).forEach(key => {
      const infoChecks = getApplicantInfoCheckItems(applicantInfoChecksByApplicantId[key]);
      infoChecks.forEach(infoCheck => {
        initialize(getApplicantInfoCheckFormName(infoCheck.data.id), infoCheck);
        applicantInfoCheckFormNamesInit.push(getApplicantInfoCheckFormName(infoCheck.data.id));
      });
    });
    setApplicantInfoCheckFormNames(applicantInfoCheckFormNamesInit)
  };

  const stopAutoSaveTimer = () => {
    clearInterval(timerAutoSave);
  };

  const saveUnsavedChanges = () => {};

  const cancelRestoreUnsavedChanges = () => {
    clearUnsavedChanges();
    setIsRestoreModalOpen(false)
  };

  const getAreFormsValid = () => {
    return true;
  };

  const cancelChanges = () => {
    // Reload all data in case we tried and managed to save some but not all info check data.
    // These could be patched to the current plot application directly upon receiving success too,
    // but that's a more complicated operation with minor gains over a refetch.
    fetchSingleAreaSearch(areaSearchId);
    hideEditMode();
    stopAutoSaveTimer();
    destroyAllForms();
  };

  const handleBack = () => {
    const query = getUrlParams(search);
    // Remove page specific url parameters when moving to application list page
    delete query.tab;
    return history.push({
      pathname: `${getRouteById(Routes.AREA_SEARCH)}`,
      search: getSearchQuery(query)
    });
  };
  
  const handleTabClick = tabId => {
    const query = getUrlParams(search);
    setActiveTab(tabId);
  };
  
  useEffect(() => {
    scrollToTopPage();
  }, [activeTab]);

  useEffect(() => {
    if (!isFetching) {
      setPageTitle(`Hakemus ${currentAreaSearch?.identifier || ''}`);
    }
  }, [isFetching]);

  useEffect(() => {
    if (!isEditMode) {
      stopAutoSaveTimer();
    }
  }, [isEditMode]);

  useEffect(() => {
    if (areaSearchId) {
      fetchSingleAreaSearch(areaSearchId);
    }
  }, [areaSearchId]);

  const saveChanges = () => {
    receiveIsSaveClicked(true);
    const areFormsValid = getAreFormsValid();

    if (areFormsValid) {
      const operations: InfoCheckBatchEditData = {
        areaSearch: {},
        applicant: []
      };
      applicantInfoCheckFormNames.forEach(target => {
        const infoCheck = getValuesForForm(target);

        if (isFormDirty(target)) {
          operations.applicant.push({
            id: infoCheck.data.id,
            kind: infoCheck.kind,
            data: prepareApplicantInfoCheckForSubmission(infoCheck.data)
          });
        }
      });
      operations.areaSearch = prepareAreaSearchForSubmission({ ...getValuesForForm(FormNames.AREA_SEARCH),
        id: areaSearchId
      });
      batchEditAreaSearchInfoChecks(operations);
    }
  };
  const restoreUnsavedChanges = () => {
    showEditMode();
    clearFormValidFlags();
    destroyAllForms();
    startAutoSaveTimer();
    setIsRestoreModalOpen(false)
  };

  const destroyAllForms = () => {};

    const areFormsValid = getAreFormsValid();

    if (isFetching || isFetchingUsersPermissions || isFetchingAttributes || isFetchingApplicantInfoCheckAttributes) {
      return <PageContainer><Loader isLoading={true} /></PageContainer>;
    }

    if (!areaSearchAttributes || !areaSearchMethods || isEmpty(usersPermissions)) {
      return null;
    }

    if (!isMethodAllowed(areaSearchMethods, Methods.GET)) {
      return <PageContainer><AuthorizationError text={PermissionMissingTexts.PLOT_APPLICATIONS} /></PageContainer>;
    }

    if (!isFetching && !currentAreaSearch) {
      return <PageContainer>
        <AuthorizationError text="Aluehakua ei löytynyt." />
      </PageContainer>;
    }

    return <FullWidthContainer>
        <PageNavigationWrapper>
          <ControlButtonBar buttonComponent={<ControlButtons allowDelete={false} allowEdit={isMethodAllowed(areaSearchMethods, Methods.PATCH)} isCopyDisabled={true} isEditDisabled={false} isEditMode={isEditMode} isSaveDisabled={isPerformingFileOperation || isSaveClicked && !areFormsValid} onCancel={cancelChanges} onEdit={handleShowEditMode} onSave={saveChanges} showCommentButton={false} showCopyButton={false} deleteModalTexts={{
          buttonClassName: ButtonColors.ALERT,
          buttonText: ConfirmationModalTexts.DELETE_PLOT_APPLICATION.BUTTON,
          label: ConfirmationModalTexts.DELETE_PLOT_APPLICATION.LABEL,
          title: ConfirmationModalTexts.DELETE_PLOT_APPLICATION.TITLE
        }} />} infoComponent={<h1>{currentAreaSearch?.identifier}</h1>} onBack={handleBack} />
          <Tabs active={activeTab} isEditMode={isEditMode} tabs={[{
          label: 'Hakemus',
          allow: true,
          isDirty: false,
          //isApplicationFormDirty,
          hasError: isSaveClicked && !areFormsValid
        }, {
          label: 'Muutoshistoria',
          allow: true
        }, {
          label: 'Kartta',
          allow: true
        }]} onTabClick={handleTabClick} />
        </PageNavigationWrapper>
        <PageContainer className='with-control-bar-and-tabs' hasTabs>
          <ConfirmationModal confirmButtonLabel={ConfirmationModalTexts.RESTORE_CHANGES.BUTTON} isOpen={isRestoreModalOpen} label={ConfirmationModalTexts.RESTORE_CHANGES.LABEL} onCancel={cancelRestoreUnsavedChanges} onClose={cancelRestoreUnsavedChanges} onSave={restoreUnsavedChanges} title={ConfirmationModalTexts.RESTORE_CHANGES.TITLE} />
          <TabContent active={activeTab}>
            <TabPane>
              <ContentContainer>
                {isEditMode ? <AreaSearchApplicationEdit /> : <AreaSearchApplication />}
              </ContentContainer>
            </TabPane>

            <TabPane>
              <ContentContainer>
                <AreaSearchApplicationAuditLog areaSearchId={currentAreaSearch.id} />
              </ContentContainer>
            </TabPane>

            <TabPane>
              <ContentContainer>
                {currentAreaSearch && <SingleAreaSearchMap geometry={currentAreaSearch.geometry} />}
              </ContentContainer>
            </TabPane>
          </TabContent>
        </PageContainer>
      </FullWidthContainer>;
}

export default (flowRight(withRouter, withAreaSearchAttributes, connect(state => {
  return {
    currentAreaSearch: getCurrentAreaSearch(state),
    isFetchingUsersPermissions: getIsFetchingUsersPermissions(state),
    usersPermissions: getUsersPermissions(state),
    isFetching: getIsFetchingCurrentAreaSearch(state),
    isEditMode: getIsEditMode(state),
    isSaveClicked: getIsSaveClicked(state),
    isFormValidFlags: getIsFormValidFlags(state),
    formAttributes: getFormAttributes(state),
    isFetchingFormAttributes: getIsFetchingFormAttributes(state),
    isFetchingApplicantInfoCheckAttributes: getIsFetchingApplicantInfoCheckAttributes(state),
    applicantInfoChecks: getApplicationApplicantInfoCheckData(state),
    isFormDirty: (formName, fields) => {
      // isDirty doesn't ignore the second parameter even if it's undefined, and always returns false in that case,
      // so branching is required to use this with both form-specific and field-specific queries.
      if (fields) {
        return isDirty(formName)(state, fields);
      } else {
        return isDirty(formName)(state);
      }
    },
    getValuesForForm: formName => getFormValues(formName)(state),
    isFormValid: formName => isValid(formName)(state)
  };
}, {
  destroy,
  fetchSingleAreaSearch,
  fetchFormAttributes,
  fetchApplicantInfoCheckAttributes,
  receiveTopNavigationSettings,
  showEditMode,
  hideEditMode,
  receiveIsSaveClicked,
  initialize,
  change,
  clearFormValidFlags,
  receiveFormValidFlags,
  batchEditAreaSearchInfoChecks
}))(AreaSearchApplicationPage) as React.ComponentType<OwnProps>);