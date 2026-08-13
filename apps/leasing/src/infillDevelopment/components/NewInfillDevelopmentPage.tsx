import React, { useCallback, useEffect, useRef, useState } from "react";
import { createForm, type FormApi } from "final-form";
import arrayMutators from "final-form-arrays";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import AuthorizationError from "@/components/authorization/AuthorizationError";
import ContentContainer from "@/components/content/ContentContainer";
import ControlButtonBar from "@/components/controlButtons/ControlButtonBar";
import ControlButtons from "@/components/controlButtons/ControlButtons";
import FullWidthContainer from "@/components/content/FullWidthContainer";
import InfillDevelopmentForm from "./forms/InfillDevelopmentForm";
import Loader from "@/components/loader/Loader";
import LoaderWrapper from "@/components/loader/LoaderWrapper";
import PageContainer from "@/components/content/PageContainer";
import PageNavigationWrapper from "@/components/content/PageNavigationWrapper";
import {
  clearFormValidFlags,
  fetchAttributes as fetchInfillDevelopmentAttributes,
  createInfillDevelopment,
  hideEditMode,
  receiveFormValidFlags,
  receiveIsFormDirty,
  receiveIsSaveClicked,
  showEditMode,
} from "@/infillDevelopment/actions";
import { receiveTopNavigationSettings } from "@/components/topNavigation/actions";
import { FormNames, Methods, PermissionMissingTexts } from "@/enums";
import { getPayloadInfillDevelopment } from "@/infillDevelopment/helpers";
import { isMethodAllowed, setPageTitle } from "@/util/helpers";
import { getRouteById, Routes } from "@/root/routes";
import {
  getFormInitialValues,
  getAttributes as getInfillDevelopmentAttributes,
  getIsFetchingAttributes as getIsFetchingInfillDevelopmentAttributes,
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
import { useUiDataList } from "@/components/uiData/UiDataListHook";
import type { RootState } from "@/root/types";

const NewInfillDevelopmentPage = () => {
  useUiDataList();

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const formApiRef = useRef<FormApi<any>>(
    createForm({
      onSubmit: () => {},
      mutators: { ...arrayMutators },
    }),
  );
  const formValuesRef = useRef<Record<string, any>>({});
  const infillDevelopmentAttributes = useSelector(
    getInfillDevelopmentAttributes,
  );
  const infillDevelopmentMethods = useSelector(getInfillDevelopmentMethods);
  const isFetchingInfillDevelopmentAttributes = useSelector(
    getIsFetchingInfillDevelopmentAttributes,
  );
  const infillDevelopmentAttachmentAttributes = useSelector(
    getInfillDevelopmentAttachmentAttributes,
  );
  const infillDevelopmentAttachmentMethods = useSelector(
    getInfillDevelopmentAttachmentMethods,
  );
  const isFetchingInfillDevelopmentAttachmentAttributes = useSelector(
    getIsFetchingInfillDevelopmentAttachmentAttributes,
  );
  const leaseAttributes = useSelector(getLeaseAttributes);
  const leaseMethods = useSelector(getLeaseMethods);
  const isFetchingLeaseAttributes = useSelector(getIsFetchingLeaseAttributes);
  const initialValues = useSelector(getFormInitialValues);
  const isFormValid = useSelector((state: RootState) =>
    getIsFormValidById(state, FormNames.INFILL_DEVELOPMENT),
  );
  const isSaveClicked = useSelector(getIsSaveClicked);
  const isSaving = useSelector(getIsSaving);
  const [isFormDirty, setIsFormDirty] = useState(false);

  const isFetchingInfillDevelopmentPageAttributes =
    isFetchingInfillDevelopmentAttributes ||
    isFetchingInfillDevelopmentAttachmentAttributes ||
    isFetchingLeaseAttributes;

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

  const handleLeavePage = useCallback(
    (e: BeforeUnloadEvent) => {
      if (isFormDirty) {
        const confirmationMessage = "";
        e.returnValue = confirmationMessage;

        return confirmationMessage;
      }
    },
    [isFormDirty],
  );

  useEffect(() => {
    const formApi = formApiRef.current;
    const unsubscribe = formApi.subscribe(
      ({ values, dirty, valid }) => {
        formValuesRef.current = values || {};
        const isDirty = !!dirty;
        setIsFormDirty(isDirty);
        dispatch(receiveIsFormDirty(isDirty));
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

    return () => {
      unsubscribe();
      dispatch(receiveIsFormDirty(false));
    };
  }, [dispatch]);

  useEffect(() => {
    formApiRef.current.initialize(initialValues || {});
  }, [initialValues]);

  useEffect(() => {
    setPageTitle("Uusi täydennysrakentamiskorvaus");
    dispatch(
      receiveTopNavigationSettings({
        linkUrl: getRouteById(Routes.INFILL_DEVELOPMENTS),
        pageTitle: "Täydennysrakantamiskorvaus",
        showSearch: false,
      }),
    );
    dispatch(receiveIsSaveClicked(false));
    dispatch(clearFormValidFlags());
    dispatch(showEditMode());
    window.addEventListener("beforeunload", handleLeavePage);

    return () => {
      dispatch(hideEditMode());
      window.removeEventListener("beforeunload", handleLeavePage);
    };
  }, [dispatch, handleLeavePage]);

  const handleBack = () => {
    return navigate({
      pathname: `${getRouteById(Routes.INFILL_DEVELOPMENTS)}`,
      search: location.search,
    });
  };

  const cancelChanges = () => {
    return navigate({
      pathname: getRouteById(Routes.INFILL_DEVELOPMENTS),
    });
  };

  const saveChanges = () => {
    dispatch(receiveIsSaveClicked(true));

    if (isFormValid) {
      dispatch(
        createInfillDevelopment(
          getPayloadInfillDevelopment(formValuesRef.current),
        ),
      );
    }
  };

  if (isFetchingInfillDevelopmentPageAttributes)
    return (
      <PageContainer>
        <Loader isLoading={true} />
      </PageContainer>
    );
  if (!infillDevelopmentMethods) return null;
  if (!isMethodAllowed(infillDevelopmentMethods, Methods.POST))
    return (
      <PageContainer>
        <AuthorizationError text={PermissionMissingTexts.GENERAL} />
      </PageContainer>
    );

  return (
    <FullWidthContainer>
      <PageNavigationWrapper>
        <ControlButtonBar
          buttonComponent={
            <ControlButtons
              allowEdit={isMethodAllowed(
                infillDevelopmentMethods,
                Methods.POST,
              )}
              isCopyDisabled={true}
              isEditMode={true}
              isSaveDisabled={isSaveClicked && !isFormValid}
              onCancel={cancelChanges}
              onSave={saveChanges}
              showCommentButton={false}
              showCopyButton={true}
            />
          }
          infoComponent={<h1>Uusi täydennysrakentamiskorvaus</h1>}
          onBack={handleBack}
        />
      </PageNavigationWrapper>

      <PageContainer className="with-small-control-bar">
        {isSaving && (
          <LoaderWrapper className="overlay-wrapper">
            <Loader isLoading={isSaving} />
          </LoaderWrapper>
        )}

        <ContentContainer>
          <InfillDevelopmentForm
            formApi={formApiRef.current}
            infillDevelopment={{}}
            isFocusedOnMount
          />
        </ContentContainer>
      </PageContainer>
    </FullWidthContainer>
  );
};

export default NewInfillDevelopmentPage;
