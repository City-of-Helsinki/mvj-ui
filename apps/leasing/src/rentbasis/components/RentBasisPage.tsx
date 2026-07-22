import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { createForm } from "final-form";
import arrayMutators from "final-form-arrays";
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
  receiveIsFormDirty,
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
  getIsFormDirty,
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
import { validateRentBasisForm } from "../formValidators";

const RentBasisPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const isEditMode = useSelector(getIsEditMode);
  const isFetching = useSelector(getIsFetching);
  const isFetchingUsersPermissions = useSelector(getIsFetchingUsersPermissions);
  const isSaveClicked = useSelector(getIsSaveClicked);
  const isSaving = useSelector(getIsSaving);
  const isFormDirty = useSelector(getIsFormDirty);
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
  const [editedRentBasis, setEditedRentBasis] = useState<RentBasis>();

  const rentBasisFormRef = useRef(
    createForm({
      onSubmit: () => {},
      mutators: { ...arrayMutators },
      validate: validateRentBasisForm,
    }),
  );

  useEffect(() => {
    const unsubscribe = rentBasisFormRef.current.subscribe(
      ({ values, dirty }) => {
        setEditedRentBasis(values as RentBasis);
        dispatch(receiveIsFormDirty(dirty));
      },
      { values: true, dirty: true },
    );
    return () => unsubscribe();
  }, [dispatch]);

  useEffect(() => {
    if (rentBasisData && !isEmpty(rentBasisData)) {
      const rentBasis = getContentRentBasis(rentBasisData);
      rentBasisFormRef.current.initialize(rentBasis);
    }
  }, [rentBasisData]);

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
    setTimeout(() => {
      const storedFormValues = getSessionStorageItem(FormNames.RENT_BASIS);

      if (storedFormValues) {
        bulkChange(storedFormValues);
      }
    }, 20);
    setIsRestoreModalOpen(false);
  };

  const bulkChange = (obj: Record<string, any>) => {
    const fields = Object.keys(obj);
    rentBasisFormRef.current.batch(() => {
      fields.forEach((field) => {
        rentBasisFormRef.current.change(field, obj[field]);
      });
    });
  };

  const copyRentBasis = () => {
    const rentBasis = getCopyOfRentBasis(rentBasisData);
    setSessionStorageItem("rentBasisCopyData", rentBasis);
    return navigate({
      pathname: getRouteById(Routes.RENT_BASIS_NEW),
      search: location.search,
    });
  };

  const saveChanges = () => {
    dispatch(receiveIsSaveClicked(true));

    if (rentBasisFormRef.current.getState().valid) {
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
    rentBasisFormRef.current.reset();
    clearUnsavedChanges();
  };

  const handleShowEditMode = () => {
    dispatch(receiveIsSaveClicked(false));
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
              isSaveDisabled={
                isSaveClicked && !rentBasisFormRef.current.getState().valid
              }
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
              hasError:
                isSaveClicked && !rentBasisFormRef.current.getState().valid,
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
                  <RentBasisEdit formApi={rentBasisFormRef.current} />
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
