import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createForm, type FormApi } from "final-form";
import arrayMutators from "final-form-arrays";
import { useAppDispatch, useAppSelector } from "@/root/hooks";
import { useLocation, useNavigate, useParams } from "react-router";
import { isEmpty } from "lodash-es";
import Authorization from "@/components/authorization/Authorization";
import AuthorizationError from "@/components/authorization/AuthorizationError";
import ConfirmationModal from "@/components/modal/ConfirmationModal";
import ContentContainer from "@/components/content/ContentContainer";
import ControlButtonBar from "@/components/controlButtons/ControlButtonBar";
import ControlButtons from "@/components/controlButtons/ControlButtons";
import Divider from "@/components/content/Divider";
import FullWidthContainer from "@/components/content/FullWidthContainer";
import InfillDevelopmentForm from "./forms/InfillDevelopmentForm";
import InfillDevelopmentTemplate from "./sections/basicInfo/InfillDevelopmentTemplate";
import Loader from "@/components/loader/Loader";
import LoaderWrapper from "@/components/loader/LoaderWrapper";
import PageContainer from "@/components/content/PageContainer";
import PageNavigationWrapper from "@/components/content/PageNavigationWrapper";
import SingleInfillDevelopmentMap from "./sections/map/SingleInfillDevelopmentMap";
import Tabs from "@/components/tabs/Tabs";
import TabContent from "@/components/tabs/TabContent";
import TabPane from "@/components/tabs/TabPane";
import Title from "@/components/content/Title";
import {
  fetchAttributes as fetchInfillDevelopmentAttributes,
  clearFormValidFlags,
  editInfillDevelopment,
  fetchSingleInfillDevelopment,
  hideEditMode,
  receiveFormValidFlags,
  receiveIsFormDirty,
  receiveFormInitialValues,
  receiveSingleInfillDevelopment,
  receiveIsSaveClicked,
  showEditMode,
} from "@/infillDevelopment/actions";
import { receiveTopNavigationSettings } from "@/components/topNavigation/actions";
import {
  ConfirmationModalTexts,
  FormNames,
  Methods,
  PermissionMissingTexts,
} from "@/enums";
import {
  InfillDevelopmentCompensationFieldPaths,
  InfillDevelopmentCompensationFieldTitles,
  InfillDevelopmentCompensationLeasesFieldPaths,
} from "@/infillDevelopment/enums";
import {
  clearUnsavedChanges,
  getContentInfillDevelopment,
  getCopyOfInfillDevelopment,
  getPayloadInfillDevelopment,
} from "@/infillDevelopment/helpers";
import { getUiDataInfillDevelopmentKey } from "@/uiData/helpers";
import {
  getSearchQuery,
  getUrlParams,
  isFieldAllowedToRead,
  isMethodAllowed,
  scrollToTopPage,
  setPageTitle,
} from "@/util/helpers";
import { getRouteById, Routes } from "@/root/routes";
import {
  getCurrentInfillDevelopment,
  getAttributes as getInfillDevelopmentAttributes,
  getIsEditMode,
  getIsFetching,
  getIsFetchingAttributes as getIsFetchingInfillDevelopmentAttributes,
  getIsFormDirty,
  getIsFormValidById,
  getIsSaveClicked,
  getIsSaving,
  getMethods as getInfillDevelopmentMethods,
} from "@/infillDevelopment/selectors";
import { fetchAttributes as fetchInfillDevelopmentAttachmentAttributes } from "@/infillDevelopmentAttachment/actions";
import {
  getAttributes as getInfillDevelopmentAttachmentAttributes,
  getIsFetchingAttributes as getIsFetchingInfillDevelopmentAttachmentAttributes,
  getMethods as getInfillDevelopmentAttachmentMethods,
} from "@/infillDevelopmentAttachment/selectors";
import { fetchAttributes as fetchLeaseAttributes } from "@/leases/actions";
import {
  getAttributes as getLeaseAttributes,
  getIsFetchingAttributes as getIsFetchingLeaseAttributes,
  getMethods as getLeaseMethods,
} from "@/leases/selectors";
import {
  getIsFetching as getIsFetchingUsersPermissions,
  getUsersPermissions,
} from "@/usersPermissions/selectors";
import {
  getSessionStorageItem,
  removeSessionStorageItem,
  setSessionStorageItem,
} from "@/util/storage";
import { useUiDataList } from "@/components/uiData/UiDataListHook";
import type { InfillDevelopment } from "@/infillDevelopment/types";
import type { UsersPermissions } from "@/usersPermissions/types";
import type { RootState } from "@/root/types";

const InfillDevelopmentPage = () => {
  useUiDataList();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { infillDevelopmentId } = useParams();

  const currentInfillDevelopment = useAppSelector(getCurrentInfillDevelopment);
  const infillDevelopmentAttributes = useAppSelector(
    getInfillDevelopmentAttributes,
  );
  const infillDevelopmentMethods = useAppSelector(getInfillDevelopmentMethods);
  const isEditMode = useAppSelector(getIsEditMode);
  const isFetching = useAppSelector(getIsFetching);
  const isFetchingInfillDevelopmentAttributes = useAppSelector(
    getIsFetchingInfillDevelopmentAttributes,
  );
  const infillDevelopmentAttachmentAttributes = useAppSelector(
    getInfillDevelopmentAttachmentAttributes,
  );
  const infillDevelopmentAttachmentMethods = useAppSelector(
    getInfillDevelopmentAttachmentMethods,
  );
  const isFetchingInfillDevelopmentAttachmentAttributes = useAppSelector(
    getIsFetchingInfillDevelopmentAttachmentAttributes,
  );
  const leaseAttributes = useAppSelector(getLeaseAttributes);
  const leaseMethods = useAppSelector(getLeaseMethods);
  const isFetchingLeaseAttributes = useAppSelector(
    getIsFetchingLeaseAttributes,
  );
  const isFetchingUsersPermissions = useAppSelector(
    getIsFetchingUsersPermissions,
  );
  const isFormValid = useAppSelector((state: RootState) =>
    getIsFormValidById(state, FormNames.INFILL_DEVELOPMENT),
  );
  const isInfillDevelopmentFormDirty = useAppSelector(getIsFormDirty);
  const isSaveClicked = useAppSelector(getIsSaveClicked);
  const isSaving = useAppSelector(getIsSaving);
  const usersPermissions: UsersPermissions =
    useAppSelector(getUsersPermissions);

  const isFetchingInfillDevelopmentPageAttributes =
    isFetchingInfillDevelopmentAttributes ||
    isFetchingInfillDevelopmentAttachmentAttributes ||
    isFetchingLeaseAttributes;

  const formatedInfillDevelopment = useMemo(
    () => getContentInfillDevelopment(currentInfillDevelopment),
    [currentInfillDevelopment],
  );

  const [activeTab, setActiveTab] = useState(0);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);

  const formApiRef = useRef<FormApi<any>>(
    createForm({
      onSubmit: () => {},
      mutators: { ...arrayMutators },
    }),
  );
  const formValuesRef = useRef<Record<string, any>>({});
  const autosaveTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevCurrentInfillDevelopmentRef = useRef<InfillDevelopment>({});
  const prevIsEditModeRef = useRef<boolean>(isEditMode);
  const isFirstTabRenderRef = useRef(true);

  const updatePageTitle = useCallback(() => {
    const name =
      (currentInfillDevelopment && currentInfillDevelopment.name) || "";
    setPageTitle(`${name ? `${name} | ` : ""}Täydennysrakentamiskorvaus`);
  }, [currentInfillDevelopment]);

  const stopAutoSaveTimer = useCallback(() => {
    if (autosaveTimerRef.current) {
      clearInterval(autosaveTimerRef.current);
      autosaveTimerRef.current = null;
    }
  }, []);

  const storeUnsavedChanges = useCallback(() => {
    if (isInfillDevelopmentFormDirty) {
      setSessionStorageItem(
        FormNames.INFILL_DEVELOPMENT,
        formValuesRef.current || {},
      );
      setSessionStorageItem("infillDevelopmentId", infillDevelopmentId);
    } else {
      removeSessionStorageItem(FormNames.INFILL_DEVELOPMENT);
      removeSessionStorageItem("infillDevelopmentId");
    }
  }, [infillDevelopmentId, isInfillDevelopmentFormDirty]);

  const startAutoSaveTimer = useCallback(() => {
    stopAutoSaveTimer();
    autosaveTimerRef.current = setInterval(storeUnsavedChanges, 5000);
  }, [stopAutoSaveTimer, storeUnsavedChanges]);

  const bulkChange = useCallback((obj: Record<string, any>) => {
    const fields = Object.keys(obj || {});

    formApiRef.current.batch(() => {
      fields.forEach((field) => {
        formApiRef.current.change(field, obj[field]);
      });
    });
  }, []);

  const handleLeavePage = useCallback(
    (e: BeforeUnloadEvent) => {
      if (isInfillDevelopmentFormDirty && isEditMode) {
        const confirmationMessage = "";
        e.returnValue = confirmationMessage;

        return confirmationMessage;
      }
    },
    [isEditMode, isInfillDevelopmentFormDirty],
  );

  const handlePopState = useCallback(() => {
    const query = getUrlParams(location.search);
    const tab = query.tab ? Number(query.tab) : 0;
    setActiveTab(tab);
  }, [location.search]);

  useEffect(() => {
    if (
      !isFetchingInfillDevelopmentAttributes &&
      !infillDevelopmentAttributes &&
      !infillDevelopmentMethods
    ) {
      dispatch(fetchInfillDevelopmentAttributes());
    }
  }, [
    dispatch,
    infillDevelopmentAttributes,
    infillDevelopmentMethods,
    isFetchingInfillDevelopmentAttributes,
  ]);

  useEffect(() => {
    if (
      !isFetchingInfillDevelopmentAttachmentAttributes &&
      !infillDevelopmentAttachmentAttributes &&
      !infillDevelopmentAttachmentMethods
    ) {
      dispatch(fetchInfillDevelopmentAttachmentAttributes());
    }
  }, [
    dispatch,
    infillDevelopmentAttachmentAttributes,
    infillDevelopmentAttachmentMethods,
    isFetchingInfillDevelopmentAttachmentAttributes,
  ]);

  useEffect(() => {
    if (!isFetchingLeaseAttributes && !leaseAttributes && !leaseMethods) {
      dispatch(fetchLeaseAttributes());
    }
  }, [dispatch, isFetchingLeaseAttributes, leaseAttributes, leaseMethods]);

  useEffect(() => {
    dispatch(
      receiveTopNavigationSettings({
        linkUrl: getRouteById(Routes.INFILL_DEVELOPMENTS),
        pageTitle: "Täydennysrakentamiskorvaukset",
        showSearch: false,
      }),
    );

    dispatch(receiveIsSaveClicked(false));
    dispatch(receiveIsFormDirty(false));

    const unsubscribeFormState = formApiRef.current.subscribe(
      ({ values, dirty, valid }) => {
        formValuesRef.current = values || {};
        dispatch(receiveIsFormDirty(!!dirty));
        dispatch(
          receiveFormValidFlags({
            [FormNames.INFILL_DEVELOPMENT]: !!valid,
          }),
        );
      },
      {
        values: true,
        dirty: true,
        valid: true,
      },
    );

    dispatch(fetchSingleInfillDevelopment(Number(infillDevelopmentId)));
    dispatch(hideEditMode());

    return () => {
      clearUnsavedChanges();
      stopAutoSaveTimer();
      unsubscribeFormState();
      dispatch(receiveIsFormDirty(false));
      dispatch(receiveSingleInfillDevelopment({}));
      dispatch(hideEditMode());
    };
  }, [dispatch, infillDevelopmentId, stopAutoSaveTimer]);

  useEffect(() => {
    const query = getUrlParams(location.search);
    const tab = query.tab ? Number(query.tab) : 0;
    setActiveTab(tab);
  }, [location.search]);

  useEffect(() => {
    window.addEventListener("beforeunload", handleLeavePage);

    return () => {
      window.removeEventListener("beforeunload", handleLeavePage);
    };
  }, [handleLeavePage]);

  useEffect(() => {
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [handlePopState]);

  useEffect(() => {
    if (
      isEmpty(prevCurrentInfillDevelopmentRef.current) &&
      !isEmpty(currentInfillDevelopment)
    ) {
      const storedInfillDevelopmentId = getSessionStorageItem(
        "infillDevelopmentId",
      );

      if (Number(infillDevelopmentId) === storedInfillDevelopmentId) {
        setIsRestoreModalOpen(true);
      }
    }

    prevCurrentInfillDevelopmentRef.current = currentInfillDevelopment;
    updatePageTitle();
  }, [currentInfillDevelopment, infillDevelopmentId, updatePageTitle]);

  useEffect(() => {
    if (prevIsEditModeRef.current && !isEditMode) {
      stopAutoSaveTimer();
      clearUnsavedChanges();
    }

    prevIsEditModeRef.current = isEditMode;
  }, [isEditMode, stopAutoSaveTimer]);

  useEffect(() => {
    if (isFirstTabRenderRef.current) {
      isFirstTabRenderRef.current = false;
      return;
    }

    scrollToTopPage();
  }, [activeTab]);

  const cancelRestoreUnsavedChanges = () => {
    clearUnsavedChanges();
    setIsRestoreModalOpen(false);
  };

  const restoreUnsavedChanges = () => {
    const initialValues = getContentInfillDevelopment(currentInfillDevelopment);
    dispatch(showEditMode());
    dispatch(receiveFormInitialValues(initialValues));
    formApiRef.current.initialize(initialValues);

    setTimeout(() => {
      const storedInfillDevelopmentFormValues = getSessionStorageItem(
        FormNames.INFILL_DEVELOPMENT,
      );

      if (storedInfillDevelopmentFormValues) {
        bulkChange(storedInfillDevelopmentFormValues);
      }
    }, 20);

    startAutoSaveTimer();
    setIsRestoreModalOpen(false);
  };

  const copyInfillDevelopment = () => {
    const infillDevelopment = { ...currentInfillDevelopment };
    infillDevelopment.id = undefined;
    dispatch(
      receiveFormInitialValues(getCopyOfInfillDevelopment(infillDevelopment)),
    );
    dispatch(hideEditMode());
    clearUnsavedChanges();

    return navigate({
      pathname: getRouteById(Routes.INFILL_DEVELOPMENT_NEW),
      search: location.search,
    });
  };

  const handleBack = () => {
    const query = getUrlParams(location.search);
    delete query.lease;
    delete query.tab;

    return navigate({
      pathname: `${getRouteById(Routes.INFILL_DEVELOPMENTS)}`,
      search: getSearchQuery(query),
    });
  };

  const handleShowEditMode = () => {
    dispatch(receiveIsSaveClicked(false));
    dispatch(showEditMode());
    dispatch(clearFormValidFlags());
    formApiRef.current.reset();

    const initialValues = getContentInfillDevelopment(currentInfillDevelopment);
    dispatch(receiveFormInitialValues(initialValues));
    formApiRef.current.initialize(initialValues);

    startAutoSaveTimer();
  };

  const cancelChanges = () => {
    dispatch(hideEditMode());
  };

  const saveChanges = () => {
    dispatch(receiveIsSaveClicked(true));

    if (isFormValid) {
      const editedInfillDevelopment = getPayloadInfillDevelopment(
        formValuesRef.current,
      );
      editedInfillDevelopment.id = currentInfillDevelopment.id;
      dispatch(editInfillDevelopment(editedInfillDevelopment));
    }
  };

  const handleTabClick = (tabId: number) => {
    const query = getUrlParams(location.search);

    setActiveTab(tabId);
    query.tab = tabId;

    return navigate({
      pathname: location.pathname,
      search: getSearchQuery(query),
    });
  };

  if (
    isFetching ||
    isFetchingInfillDevelopmentPageAttributes ||
    isFetchingUsersPermissions
  ) {
    return (
      <PageContainer>
        <Loader isLoading={true} />
      </PageContainer>
    );
  }

  if (!infillDevelopmentMethods || isEmpty(usersPermissions)) return null;

  if (!isMethodAllowed(infillDevelopmentMethods, Methods.GET)) {
    return (
      <PageContainer>
        <AuthorizationError text={PermissionMissingTexts.INFILL_DEVELOPMENT} />
      </PageContainer>
    );
  }

  return (
    <FullWidthContainer>
      <PageNavigationWrapper>
        <ControlButtonBar
          buttonComponent={
            <ControlButtons
              allowCopy={isMethodAllowed(
                infillDevelopmentMethods,
                Methods.POST,
              )}
              allowEdit={isMethodAllowed(
                infillDevelopmentMethods,
                Methods.PATCH,
              )}
              isCancelDisabled={false}
              isCopyDisabled={false}
              isEditDisabled={false}
              isEditMode={isEditMode}
              isSaveDisabled={isSaveClicked && !isFormValid}
              onCancel={cancelChanges}
              onCopy={copyInfillDevelopment}
              onEdit={handleShowEditMode}
              onSave={saveChanges}
              showCommentButton={false}
              showCopyButton={true}
            />
          }
          infoComponent={<h1>{formatedInfillDevelopment.name}</h1>}
          onBack={handleBack}
        />

        <Tabs
          active={activeTab}
          isEditMode={isEditMode}
          tabs={[
            {
              label: InfillDevelopmentCompensationFieldTitles.BASIC_INFO,
              allow: true,
              isDirty: isInfillDevelopmentFormDirty,
              hasError: isSaveClicked && !isFormValid,
            },
            {
              label: InfillDevelopmentCompensationFieldTitles.MAP,
              allow: isFieldAllowedToRead(
                infillDevelopmentAttributes,
                InfillDevelopmentCompensationLeasesFieldPaths.LEASE,
              ),
            },
          ]}
          onTabClick={handleTabClick}
        />
      </PageNavigationWrapper>

      <PageContainer className="with-small-control-bar-and-tabs" hasTabs>
        {isSaving && (
          <LoaderWrapper className="overlay-wrapper">
            <Loader isLoading={isSaving} />
          </LoaderWrapper>
        )}

        <Authorization
          allow={isMethodAllowed(infillDevelopmentMethods, Methods.PATCH)}
        >
          <ConfirmationModal
            confirmButtonLabel={ConfirmationModalTexts.RESTORE_CHANGES.BUTTON}
            isOpen={isRestoreModalOpen}
            label={ConfirmationModalTexts.RESTORE_CHANGES.LABEL}
            onCancel={cancelRestoreUnsavedChanges}
            onClose={cancelRestoreUnsavedChanges}
            onSave={restoreUnsavedChanges}
            title={ConfirmationModalTexts.RESTORE_CHANGES.TITLE}
          />
        </Authorization>

        <TabContent active={activeTab}>
          <TabPane>
            <ContentContainer>
              <Title
                enableUiDataEdit={isEditMode}
                uiDataKey={getUiDataInfillDevelopmentKey(
                  InfillDevelopmentCompensationFieldPaths.BASIC_INFO,
                )}
              >
                {InfillDevelopmentCompensationFieldTitles.BASIC_INFO}
              </Title>
              <Divider />

              {isEditMode ? (
                <Authorization
                  allow={isMethodAllowed(
                    infillDevelopmentMethods,
                    Methods.PATCH,
                  )}
                  errorComponent={
                    <AuthorizationError text={PermissionMissingTexts.GENERAL} />
                  }
                >
                  <InfillDevelopmentForm
                    formApi={formApiRef.current}
                    infillDevelopment={formatedInfillDevelopment}
                  />
                </Authorization>
              ) : (
                <InfillDevelopmentTemplate
                  infillDevelopment={formatedInfillDevelopment}
                />
              )}
            </ContentContainer>
          </TabPane>
          <TabPane>
            <ContentContainer>
              <Authorization
                allow={isFieldAllowedToRead(
                  infillDevelopmentAttributes,
                  InfillDevelopmentCompensationLeasesFieldPaths.LEASE,
                )}
                errorComponent={
                  <AuthorizationError text={PermissionMissingTexts.GENERAL} />
                }
              >
                <>
                  <Title
                    enableUiDataEdit={isEditMode}
                    uiDataKey={getUiDataInfillDevelopmentKey(
                      InfillDevelopmentCompensationFieldPaths.MAP,
                    )}
                  >
                    {InfillDevelopmentCompensationFieldTitles.MAP}
                  </Title>
                  <Divider />

                  <SingleInfillDevelopmentMap />
                </>
              </Authorization>
            </ContentContainer>
          </TabPane>
        </TabContent>
      </PageContainer>
    </FullWidthContainer>
  );
};

export default InfillDevelopmentPage;
