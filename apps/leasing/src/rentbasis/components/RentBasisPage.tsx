import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { change, getFormValues, isDirty } from "redux-form";
import { isEmpty } from "lodash-es";
import Authorization from "@/components/authorization/Authorization";
import AuthorizationError from "@/components/authorization/AuthorizationError";
import ConfirmationModal from "@/components/modal/ConfirmationModal";
import ContentContainer from "@/components/content/ContentContainer";
import ControlButtonBar from "@/components/controlButtons/ControlButtonBar";
import ControlButtons from "@/components/controlButtons/ControlButtons";
import Divider from "@/components/content/Divider";
import FullWidthContainer from "@/components/content/FullWidthContainer";
import Loader from "@/components/loader/Loader";
import LoaderWrapper from "@/components/loader/LoaderWrapper";
import PageContainer from "@/components/content/PageContainer";
import PageNavigationWrapper from "@/components/content/PageNavigationWrapper";
import RentBasisEdit from "./sections/basicInfo/RentBasisEdit";
import RentBasisInfo from "./RentBasisInfo";
import RentBasisReadonly from "./sections/basicInfo/RentBasisReadonly";
import SingleRentBasisMap from "./sections/map/SingleRentBasisMap";
import Tabs from "@/components/tabs/Tabs";
import TabContent from "@/components/tabs/TabContent";
import TabPane from "@/components/tabs/TabPane";
import Title from "@/components/content/Title";
import {
  editRentBasis,
  fetchSingleRentBasis,
  hideEditMode,
  initializeRentBasis,
  receiveIsSaveClicked,
  showEditMode,
} from "@/rentbasis/actions";
import { receiveTopNavigationSettings } from "@/components/topNavigation/actions";
import { fetchAttributes as fetchRentBasisAttributes } from "@/rentbasis/actions";
import {
  fetchAttributes as fetchUiDataAttributes,
  fetchUiDataList,
} from "@/uiData/actions";
import {
  ConfirmationModalTexts,
  Methods,
  PermissionMissingTexts,
} from "@/enums";
import {
  getSearchQuery,
  getUrlParams,
  isFieldAllowedToRead,
  isMethodAllowed,
  scrollToTopPage,
  setPageTitle,
} from "@/util/helpers";
import { FormNames } from "@/enums";
import { RentBasisFieldPaths, RentBasisFieldTitles } from "@/rentbasis/enums";
import {
  clearUnsavedChanges,
  getPayloadRentBasis,
  getCopyOfRentBasis,
  getContentRentBasis,
} from "@/rentbasis/helpers";
import { getUiDataRentBasisKey } from "@/uiData/helpers";
import { getRouteById, Routes } from "@/root/routes";
import {
  getIsEditMode,
  getIsFetching,
  getIsFormValid,
  getIsSaveClicked,
  getIsSaving,
  getRentBasis,
} from "@/rentbasis/selectors";
import {
  getIsFetching as getIsFetchingUsersPermissions,
  getUsersPermissions,
} from "@/usersPermissions/selectors";
import {
  getAttributes as getUiDataAttributes,
  getIsFetching as getIsFetchingUiData,
  getIsFetchingAttributes as getIsFetchingUiDataAttributes,
  getMethods as getUiDataMethods,
  getUiDataList,
} from "@/uiData/selectors";
import {
  getAttributes as getRentBasisAttributes,
  getIsFetchingAttributes as getIsFetchingRentBasisAttributes,
  getMethods as getRentBasisMethods,
} from "@/rentbasis/selectors";
import {
  getSessionStorageItem,
  removeSessionStorageItem,
  setSessionStorageItem,
} from "@/util/storage";
import type { Attributes } from "types";
import type { RentBasis } from "@/rentbasis/types";

const RentBasisPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const editedRentBasis: RentBasis = useSelector(
    getFormValues(FormNames.RENT_BASIS),
  );
  const isEditMode = useSelector(getIsEditMode);
  const isFetching = useSelector(getIsFetching);
  const isFetchingUsersPermissions = useSelector(getIsFetchingUsersPermissions);
  const isFormDirty = useSelector(isDirty(FormNames.RENT_BASIS));
  const isFormValid = useSelector(getIsFormValid);
  const isSaveClicked = useSelector(getIsSaveClicked);
  const isSaving = useSelector(getIsSaving);
  const rentBasisData: RentBasis = useSelector(getRentBasis);
  const usersPermissions = useSelector(getUsersPermissions);
  const isFetchingRentBasisAttributes = useSelector(
    getIsFetchingRentBasisAttributes,
  );
  const rentBasisAttributes: Attributes = useSelector(getRentBasisAttributes);
  const rentBasisMethods = useSelector(getRentBasisMethods);
  const isFetchingUiDataAttributes = useSelector(getIsFetchingUiDataAttributes);
  const uiDataAttributes: Attributes = useSelector(getUiDataAttributes);
  const uiDataMethods = useSelector(getUiDataMethods);
  const isFetchingUiDataList = useSelector(getIsFetchingUiData);
  const uiDataList = useSelector(getUiDataList);

  const [activeTab, setActiveTab] = useState(0);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);

  const currentValuesRef = useRef({
    isFormDirty,
    editedRentBasis,
  });
  currentValuesRef.current = {
    isFormDirty,
    editedRentBasis,
  };

  const timerAutoSave = useRef<any>();

  useEffect(() => {
    const query = getUrlParams(location.search);
    setPageTitle(`${params.rentBasisId} | Vuokrausperiaate`);
    dispatch(receiveIsSaveClicked(false));
    dispatch(
      receiveTopNavigationSettings({
        linkUrl: getRouteById(Routes.RENT_BASIS),
        pageTitle: "Vuokrausperiaatteet",
        showSearch: false,
      }),
    );

    if (query.tab) {
      setActiveTab(Number(query.tab));
    }

    if (
      !isFetchingRentBasisAttributes &&
      !rentBasisAttributes &&
      !rentBasisMethods
    ) {
      dispatch(fetchRentBasisAttributes());
    }

    if (!isFetchingUiDataAttributes && !uiDataAttributes && !uiDataMethods) {
      dispatch(fetchUiDataAttributes());
    }

    if (!isFetchingUiDataList && isEmpty(uiDataList)) {
      dispatch(
        fetchUiDataList({
          limit: 100000,
        }),
      );
    }

    dispatch(fetchSingleRentBasis(Number(params.rentBasisId)));
    dispatch(hideEditMode());

    return () => {
      dispatch(hideEditMode());
      if (
        location.pathname !==
        `${getRouteById(Routes.RENT_BASIS)}/${params.rentBasisId}`
      ) {
        clearUnsavedChanges();
      }
      stopAutoSaveTimer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isEmpty(rentBasisData)) {
      const storedContactId = getSessionStorageItem("rentBasisId");

      if (Number(params.rentBasisId) === storedContactId) {
        setIsRestoreModalOpen(true);
      }
    }
  }, [params.rentBasisId, rentBasisData]);

  useEffect(() => {
    scrollToTopPage();
  }, [activeTab]);

  const startAutoSaveTimer = () => {
    if (timerAutoSave.current) {
      clearInterval(timerAutoSave.current);
    }
    timerAutoSave.current = setInterval(() => saveUnsavedChanges(), 5000);
  };

  const stopAutoSaveTimer = () => {
    if (timerAutoSave.current) {
      clearInterval(timerAutoSave.current);
      timerAutoSave.current = undefined;
    }
  };

  const saveUnsavedChanges = () => {
    const { isFormDirty, editedRentBasis } = currentValuesRef.current;

    if (isFormDirty) {
      setSessionStorageItem(FormNames.RENT_BASIS, editedRentBasis);
      setSessionStorageItem("rentBasisId", params.rentBasisId);
    } else {
      removeSessionStorageItem(FormNames.RENT_BASIS);
      removeSessionStorageItem("rentBasisId");
    }
  };

  const cancelRestoreUnsavedChanges = () => {
    clearUnsavedChanges();
    setIsRestoreModalOpen(false);
  };

  const restoreUnsavedChanges = () => {
    handleShowEditMode();

    dispatch(initializeRentBasis(rentBasisData));
    setTimeout(() => {
      const storedFormValues = getSessionStorageItem(FormNames.RENT_BASIS);

      if (storedFormValues) {
        bulkChange(FormNames.RENT_BASIS, storedFormValues);
      }
    }, 20);
    setIsRestoreModalOpen(false);
  };

  const bulkChange = (formName: string, obj: Record<string, any>) => {
    const fields = Object.keys(obj);
    fields.forEach((field) => {
      dispatch(change(formName, field, obj[field]));
    });
  };

  const copyRentBasis = () => {
    const rentBasis = getCopyOfRentBasis(rentBasisData);
    dispatch(initializeRentBasis(rentBasis));
    return navigate({
      pathname: getRouteById(Routes.RENT_BASIS_NEW),
      search: location.search,
    });
  };

  const saveChanges = () => {
    dispatch(receiveIsSaveClicked(true));

    if (isFormValid) {
      dispatch(editRentBasis(getPayloadRentBasis(editedRentBasis)));
    }
  };

  const handleBack = () => {
    const query = getUrlParams(location.search);
    // Remove page specific url parameters when moving to lease list page
    delete query.tab;
    return navigate({
      pathname: `${getRouteById(Routes.RENT_BASIS)}`,
      search: getSearchQuery(query),
    });
  };

  const cancelChanges = () => {
    dispatch(hideEditMode());
    stopAutoSaveTimer();
  };

  const handleShowEditMode = () => {
    const rentBasis = getContentRentBasis(rentBasisData);
    dispatch(receiveIsSaveClicked(false));
    dispatch(initializeRentBasis(rentBasis));
    dispatch(showEditMode());
    startAutoSaveTimer();
  };

  const handleTabClick = (tabId) => {
    const query = getUrlParams(location.search);
    setActiveTab(tabId);
    query.tab = tabId;
    return navigate({ ...location, search: getSearchQuery(query) });
  };

  const rentBasis = getContentRentBasis(rentBasisData);
  if (isFetching || isFetchingRentBasisAttributes || isFetchingUsersPermissions)
    return (
      <PageContainer>
        <Loader isLoading={true} />
      </PageContainer>
    );
  if (!rentBasisMethods || isEmpty(usersPermissions)) return null;
  if (!isMethodAllowed(rentBasisMethods, Methods.GET))
    return (
      <PageContainer>
        <AuthorizationError text={PermissionMissingTexts.RENT_BASIS} />
      </PageContainer>
    );
  return (
    <FullWidthContainer>
      <PageNavigationWrapper>
        <ControlButtonBar
          buttonComponent={
            <ControlButtons
              allowCopy={isMethodAllowed(rentBasisMethods, Methods.POST)}
              allowEdit={isMethodAllowed(rentBasisMethods, Methods.PATCH)}
              isCopyDisabled={false}
              isEditMode={isEditMode}
              isSaveDisabled={isSaveClicked && !isFormValid}
              onCancel={cancelChanges}
              onCopy={copyRentBasis}
              onEdit={handleShowEditMode}
              onSave={saveChanges}
              showCommentButton={false}
              showCopyButton={true}
            />
          }
          infoComponent={<RentBasisInfo identifier={rentBasis.id} />}
          onBack={handleBack}
        />
        <Tabs
          active={activeTab}
          isEditMode={isEditMode}
          tabs={[
            {
              label: RentBasisFieldTitles.BASIC_INFO,
              allow: true,
              isDirty: isFormDirty,
              hasError: isSaveClicked && !isFormValid,
            },
            {
              label: RentBasisFieldTitles.MAP,
              allow: isFieldAllowedToRead(
                rentBasisAttributes,
                RentBasisFieldPaths.GEOMETRY,
              ),
            },
          ]}
          onTabClick={handleTabClick}
        />
      </PageNavigationWrapper>

      <PageContainer className="with-control-bar-and-tabs" hasTabs>
        {isSaving && (
          <LoaderWrapper className="overlay-wrapper">
            <Loader isLoading={isSaving} />
          </LoaderWrapper>
        )}

        <Authorization allow={isMethodAllowed(rentBasisMethods, Methods.PATCH)}>
          <ConfirmationModal
            confirmButtonLabel={ConfirmationModalTexts.RESTORE_CHANGES.BUTTON}
            isOpen={isRestoreModalOpen}
            label={ConfirmationModalTexts.RESTORE_CHANGES.LABEL}
            onCancel={cancelRestoreUnsavedChanges}
            onClose={restoreUnsavedChanges}
            onSave={restoreUnsavedChanges}
            title={ConfirmationModalTexts.RESTORE_CHANGES.TITLE}
          />
        </Authorization>

        <TabContent active={activeTab}>
          <TabPane>
            <ContentContainer>
              <Title
                enableUiDataEdit={isEditMode}
                uiDataKey={getUiDataRentBasisKey(
                  RentBasisFieldPaths.BASIC_INFO,
                )}
              >
                {RentBasisFieldTitles.BASIC_INFO}
              </Title>
              <Divider />

              {isEditMode ? (
                <Authorization
                  allow={rentBasisMethods.PATCH}
                  errorComponent={
                    <AuthorizationError text={PermissionMissingTexts.GENERAL} />
                  }
                >
                  <RentBasisEdit />
                </Authorization>
              ) : (
                <RentBasisReadonly rentBasis={rentBasis} />
              )}
            </ContentContainer>
          </TabPane>

          <TabPane>
            <ContentContainer>
              <Authorization
                allow={isFieldAllowedToRead(
                  rentBasisAttributes,
                  RentBasisFieldPaths.GEOMETRY,
                )}
                errorComponent={
                  <AuthorizationError text={PermissionMissingTexts.GENERAL} />
                }
              >
                <>
                  <Title
                    enableUiDataEdit={isEditMode}
                    uiDataKey={getUiDataRentBasisKey(RentBasisFieldPaths.MAP)}
                  >
                    {RentBasisFieldTitles.MAP}
                  </Title>
                  <Divider />

                  <SingleRentBasisMap />
                </>
              </Authorization>
            </ContentContainer>
          </TabPane>
        </TabContent>
      </PageContainer>
    </FullWidthContainer>
  );
};

export default RentBasisPage;
