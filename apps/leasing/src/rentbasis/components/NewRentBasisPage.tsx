import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { getFormValues } from "redux-form";
import { isEmpty } from "lodash-es";
import AuthorizationError from "@/components/authorization/AuthorizationError";
import ContentContainer from "@/components/content/ContentContainer";
import ControlButtonBar from "@/components/controlButtons/ControlButtonBar";
import ControlButtons from "@/components/controlButtons/ControlButtons";
import FullWidthContainer from "@/components/content/FullWidthContainer";
import GreenBox from "@/components/content/GreenBox";
import Loader from "@/components/loader/Loader";
import LoaderWrapper from "@/components/loader/LoaderWrapper";
import PageContainer from "@/components/content/PageContainer";
import PageNavigationWrapper from "@/components/content/PageNavigationWrapper";
import RentBasisForm from "./forms/RentBasisForm";
import {
  createRentBasis,
  hideEditMode,
  receiveIsSaveClicked,
  showEditMode,
} from "@/rentbasis/actions";
import { receiveTopNavigationSettings } from "@/components/topNavigation/actions";
import { fetchAttributes as fetchRentBasisAttributes } from "@/rentbasis/actions";
import {
  fetchAttributes as fetchUiDataAttributes,
  fetchUiDataList,
} from "@/uiData/actions";
import { FormNames, Methods, PermissionMissingTexts } from "@/enums";
import { getPayloadRentBasis } from "@/rentbasis/helpers";
import { isMethodAllowed, setPageTitle } from "@/util/helpers";
import { getRouteById, Routes } from "@/root/routes";
import {
  getIsFormValid,
  getIsSaveClicked,
  getIsSaving,
  getAttributes as getRentBasisAttributes,
  getIsFetchingAttributes as getIsFetchingRentBasisAttributes,
  getMethods as getRentBasisMethods,
} from "@/rentbasis/selectors";
import {
  getAttributes as getUiDataAttributes,
  getIsFetching,
  getIsFetchingAttributes as getIsFetchingUiDataAttributes,
  getMethods as getUiDataMethods,
  getUiDataList,
} from "@/uiData/selectors";
import type { Methods as MethodsType } from "types";
import type { RentBasis } from "../types";

const NewRentBasisPage: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const editedRentBasis: RentBasis = useSelector(
    getFormValues(FormNames.RENT_BASIS),
  ) as RentBasis;
  const isFormValid = useSelector(getIsFormValid);
  const isSaveClicked = useSelector(getIsSaveClicked);
  const isSaving = useSelector(getIsSaving);
  const rentBasisAttributes = useSelector(getRentBasisAttributes);
  const isFetchingRentBasisAttributes = useSelector(
    getIsFetchingRentBasisAttributes,
  );
  const rentBasisMethods: MethodsType = useSelector(getRentBasisMethods);

  const isFetchingUiDataAttributes = useSelector(getIsFetchingUiDataAttributes);
  const isFetchingUiDataList = useSelector(getIsFetching);
  const uiDataAttributes = useSelector(getUiDataAttributes);
  const uiDataList = useSelector(getUiDataList);
  const uiDataMethods = useSelector(getUiDataMethods);

  useEffect(() => {
    setPageTitle("Uusi vuokrausperiaate");
    dispatch(receiveIsSaveClicked(false));
    dispatch(
      receiveTopNavigationSettings({
        linkUrl: getRouteById(Routes.RENT_BASIS),
        pageTitle: "Vuokrausperiaatteet",
        showSearch: false,
      }),
    );
    dispatch(showEditMode());

    return () => {
      dispatch(hideEditMode());
    };
  }, [dispatch]);

  useEffect(() => {
    if (
      !isFetchingRentBasisAttributes &&
      !rentBasisAttributes &&
      !rentBasisMethods
    ) {
      dispatch(fetchRentBasisAttributes());
    }
  }, [
    dispatch,
    isFetchingRentBasisAttributes,
    rentBasisAttributes,
    rentBasisMethods,
  ]);

  useEffect(() => {
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
  }, [
    dispatch,
    isFetchingUiDataAttributes,
    isFetchingUiDataList,
    uiDataAttributes,
    uiDataList,
    uiDataMethods,
  ]);

  const handleBack = () => {
    return navigate({
      pathname: `${getRouteById(Routes.RENT_BASIS)}`,
      search: location.search,
    });
  };

  const cancelChanges = () => {
    return navigate({
      pathname: getRouteById(Routes.RENT_BASIS),
    });
  };

  const saveChanges = () => {
    dispatch(receiveIsSaveClicked(true));

    if (isFormValid) {
      dispatch(createRentBasis(getPayloadRentBasis(editedRentBasis)));
    }
  };

  if (isFetchingRentBasisAttributes)
    return (
      <PageContainer>
        <Loader isLoading={true} />
      </PageContainer>
    );
  if (!rentBasisMethods) return null;
  if (!isMethodAllowed(rentBasisMethods, Methods.POST))
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
              allowEdit={isMethodAllowed(rentBasisMethods, Methods.POST)}
              isCopyDisabled={true}
              isEditMode={true}
              isSaveDisabled={isSaveClicked && !isFormValid}
              onCancel={cancelChanges}
              onSave={saveChanges}
              showCommentButton={false}
              showCopyButton={true}
            />
          }
          infoComponent={<h1>Uusi vuokrausperuste</h1>}
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
          <GreenBox className="no-margin">
            <RentBasisForm isFocusedOnMount />
          </GreenBox>
        </ContentContainer>
      </PageContainer>
    </FullWidthContainer>
  );
};

export default NewRentBasisPage;
