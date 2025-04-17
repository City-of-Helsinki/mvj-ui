import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form } from "react-final-form";
import { useHistory, useLocation } from "react-router-dom";
import { useContactAttributes } from "@/components/attributes/ContactAttributes";
import { ActionTypes, AppConsumer } from "@/app/AppContext";
import AuthorizationError from "@/components/authorization/AuthorizationError";
import ContactForm from "./forms/ContactForm";
import ContentContainer from "@/components/content/ContentContainer";
import ControlButtonBar from "@/components/controlButtons/ControlButtonBar";
import ControlButtons from "@/components/controlButtons/ControlButtons";
import FullWidthContainer from "@/components/content/FullWidthContainer";
import GreenBox from "@/components/content/GreenBox";
import Loader from "@/components/loader/Loader";
import PageContainer from "@/components/content/PageContainer";
import PageNavigationWrapper from "@/components/content/PageNavigationWrapper";
import {
  createContact,
  hideEditMode,
  receiveIsSaveClicked,
  showEditMode,
} from "@/contacts/actions";
import { receiveTopNavigationSettings } from "@/components/topNavigation/actions";
import {
  ConfirmationModalTexts,
  Methods,
  PermissionMissingTexts,
} from "@/enums";
import { ButtonColors } from "@/components/enums";
import { ContactTypes } from "@/contacts/enums";
import { isEmptyValue, isMethodAllowed, setPageTitle } from "@/util/helpers";
import { contactExists } from "@/contacts/requestsAsync";
import { getRouteById, Routes } from "@/root/routes";
import {
  getInitialContactFormValues,
  getIsFetchingAttributes,
  getIsSaveClicked,
} from "@/contacts/selectors";
import { getUserActiveServiceUnit } from "@/usersPermissions/selectors";
import { useUiDataList } from "@/components/uiData/UiDataListHook";

import type { FormApi } from "final-form";
import type { Contact } from "@/contacts/types";

const NewContactPage: React.FC = () => {
  // Fetch ui data and attributes if needed
  useUiDataList();
  const { contactMethods } = useContactAttributes();
  const formApiRef = useRef<FormApi<Contact, Partial<Contact>> | null>(null);
  const dispatch = useDispatch();
  const initialContactFormValues = useSelector(getInitialContactFormValues);
  const isFetchingContactAttributes = useSelector(getIsFetchingAttributes);
  const isSaveClicked = useSelector(getIsSaveClicked);
  const userActiveServiceUnit = useSelector(getUserActiveServiceUnit);
  const history = useHistory();
  const location = useLocation();
  const [formState, setFormState] = useState<{
    valid: boolean;
    dirty: boolean;
  }>({
    valid: false,
    dirty: false,
  });

  useEffect(() => {
    setPageTitle("Uusi asiakas");
    dispatch(receiveIsSaveClicked(false));
    dispatch(
      receiveTopNavigationSettings({
        linkUrl: getRouteById(Routes.CONTACTS),
        pageTitle: "Asiakkaat",
        showSearch: false,
      }),
    );
    dispatch(showEditMode());
    window.addEventListener("beforeunload", handleLeavePage);

    return () => {
      dispatch(hideEditMode());
      window.removeEventListener("beforeunload", handleLeavePage);
    };
  }, [dispatch]);

  const handleFormStateChange = useCallback((state) => {
    setFormState({
      valid: state.valid,
      dirty: state.dirty,
    });
  }, []);

  /**
   * Handles the browser's native "leave page" modal when the user attempts to navigate away
   * from the page with unsaved changes in the form.
   */
  const handleLeavePage = useCallback((e: BeforeUnloadEvent) => {
    if (formApiRef.current && formApiRef.current.getState().dirty) {
      e.preventDefault();
      // Legacy support for older browsers
      e.returnValue = true;
    }
  }, []);

  const handleBack = () => {
    return history.push({
      pathname: `${getRouteById(Routes.CONTACTS)}`,
      search: location.search,
    });
  };

  const cancelChanges = () => {
    return history.push({
      pathname: getRouteById(Routes.CONTACTS),
    });
  };

  const handleSubmit = async (values: Contact) => {
    dispatch(createContact(values));
    // On successful contact creation, navigate to contacts list
    history.push({
      pathname: getRouteById(Routes.CONTACTS),
    });
  };

  const handleSave = async (contextDispatch) => {
    if (!formApiRef.current) {
      return;
    }
    const { valid, values } = formApiRef.current.getState();

    if (!valid) return;
    const { business_id, national_identification_number, type } = values;
    const contactIdentifier = type
      ? type === ContactTypes.PERSON
        ? national_identification_number
        : business_id
      : null;

    if (contactIdentifier && !isEmptyValue(contactIdentifier)) {
      const serviceUnitId = values?.service_unit as unknown as number;
      const exists = await contactExists({
        identifier: contactIdentifier,
        serviceUnitId: serviceUnitId,
      });

      if (exists) {
        contextDispatch({
          type: ActionTypes.SHOW_CONFIRMATION_MODAL,
          confirmationFunction: () => {
            dispatch(receiveIsSaveClicked(true));
            if (formApiRef.current) {
              formApiRef.current.submit();
            }
          },
          confirmationModalButtonClassName: ButtonColors.SUCCESS,
          confirmationModalButtonText:
            ConfirmationModalTexts.CREATE_CONTACT.BUTTON,
          confirmationModalLabel: ConfirmationModalTexts.CREATE_CONTACT.LABEL,
          confirmationModalTitle: ConfirmationModalTexts.CREATE_CONTACT.TITLE,
        });
      } else {
        // No duplicate, trigger form submission
        dispatch(receiveIsSaveClicked(true));
        formApiRef.current.submit();
      }
    } else {
      // No identifier to check, trigger form submission
      dispatch(receiveIsSaveClicked(true));
      formApiRef.current.submit();
    }
  };

  if (isFetchingContactAttributes)
    return (
      <PageContainer>
        <Loader isLoading={true} />
      </PageContainer>
    );

  if (!contactMethods) return null;

  if (!isMethodAllowed(contactMethods, Methods.POST))
    return (
      <PageContainer>
        <AuthorizationError text={PermissionMissingTexts.GENERAL} />
      </PageContainer>
    );

  return (
    <AppConsumer>
      {({ dispatch: contextDispatch }) => (
        <FullWidthContainer>
          <PageNavigationWrapper>
            <ControlButtonBar
              buttonComponent={
                <ControlButtons
                  allowEdit={isMethodAllowed(contactMethods, Methods.POST)}
                  isCopyDisabled={true}
                  isEditMode={true}
                  isSaveDisabled={isSaveClicked && !formState.valid}
                  onCancel={cancelChanges}
                  onSave={async () => await handleSave(contextDispatch)}
                  showCommentButton={false}
                  showCopyButton={true}
                />
              }
              infoComponent={<h1>Uusi asiakas</h1>}
              onBack={handleBack}
            />
          </PageNavigationWrapper>

          <PageContainer className="with-small-control-bar">
            <ContentContainer>
              <GreenBox className="no-margin">
                <Form
                  onSubmit={handleSubmit}
                  initialValues={{
                    ...initialContactFormValues,
                    service_unit:
                      initialContactFormValues?.service_unit ||
                      userActiveServiceUnit?.id,
                  }}
                >
                  {({ form }) => {
                    formApiRef.current = form;
                    return <ContactForm formApi={form} />;
                  }}
                </Form>
              </GreenBox>
            </ContentContainer>
          </PageContainer>
        </FullWidthContainer>
      )}
    </AppConsumer>
  );
};

export default NewContactPage;
