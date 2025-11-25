import React, { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams, useLocation } from "react-router";
import { Form, FormSpy } from "react-final-form";
import isEmpty from "lodash/isEmpty";
import Authorization from "@/components/authorization/Authorization";
import AuthorizationError from "@/components/authorization/AuthorizationError";
import ConfirmationModal from "@/components/modal/ConfirmationModal";
import ContactAuditLog from "./ContactAuditLog";
import ContactEdit from "./ContactEdit";
import ContactReadonly from "./ContactReadonly";
import ContentContainer from "@/components/content/ContentContainer";
import ControlButtonBar from "@/components/controlButtons/ControlButtonBar";
import ControlButtons from "@/components/controlButtons/ControlButtons";
import CreditDecisionTemplate from "@/creditDecision/components/CreditDecisionTemplate";
import Divider from "@/components/content/Divider";
import FullWidthContainer from "@/components/content/FullWidthContainer";
import Loader from "@/components/loader/Loader";
import LoaderWrapper from "@/components/loader/LoaderWrapper";
import PageContainer from "@/components/content/PageContainer";
import PageNavigationWrapper from "@/components/content/PageNavigationWrapper";
import Tabs from "@/components/tabs/Tabs";
import TabPane from "@/components/tabs/TabPane";
import TabContent from "@/components/tabs/TabContent";
import Title from "@/components/content/Title";
import TradeRegisterTemplate from "@/tradeRegister/components/TradeRegisterTemplate";
import {
  editContact,
  fetchSingleContact,
  hideEditMode,
  initializeContactForm,
  receiveIsSaveClicked,
  receiveSingleContact,
  showEditMode,
} from "@/contacts/actions";
import { receiveTopNavigationSettings } from "@/components/topNavigation/actions";
import {
  ConfirmationModalTexts,
  FormNames,
  Methods,
  PermissionMissingTexts,
} from "@/enums";
import {
  ContactFieldPaths,
  ContactFieldTitles,
  ContactTypes,
} from "@/contacts/enums";
import { UsersPermissions } from "@/usersPermissions/enums";
import { clearUnsavedChanges, getContactFullName } from "@/contacts/helpers";
import { getUiDataContactKey } from "@/uiData/helpers";
import {
  hasPermissions,
  getSearchQuery,
  getUrlParams,
  isMethodAllowed,
  scrollToTopPage,
  setPageTitle,
} from "@/util/helpers";
import { getRouteById, Routes } from "@/root/routes";
import {
  getCurrentContact,
  getIsContactFormValid,
  getIsEditMode,
  getIsFetching,
  getIsSaveClicked,
  getIsSaving,
} from "@/contacts/selectors";
import {
  getSessionStorageItem,
  removeSessionStorageItem,
  setSessionStorageItem,
} from "@/util/storage";
import { useContactAttributes } from "@/components/attributes/ContactAttributes";
import { useUiDataList } from "@/components/uiData/UiDataListHook";
import { getUsersPermissions } from "@/usersPermissions/selectors";
import { getUserActiveServiceUnit } from "@/usersPermissions/selectors";

import type { FormApi } from "final-form";
import type { Contact, SetTabDirtyFunction } from "@/contacts/types";
import type { Methods as ContactMethods } from "types";
import type { UsersPermissions as UsersPermissionsType } from "@/usersPermissions/types";

const ContactPageView: React.FC<{
  form: FormApi<Contact>;
  handleSubmit: () => void;
  contact: Contact;
}> = ({ form, handleSubmit, contact }) => {
  const history = useHistory();
  const params = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const { contactMethods } = useContactAttributes();

  const [activeTab, setActiveTab] = useState(0);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [timerAutoSave, setTimerAutoSave] = useState<NodeJS.Timeout | null>(
    null,
  );
  const [dirtyTabs, setDirtyTabs] = useState<Set<number>>(new Set());

  const tabDirtyStateRef = useRef(new Map<number, boolean>());
  const prevContactRef = useRef<Contact | null>(null);
  const prevEditModeRef = useRef<boolean | null>(null);

  const isSaving = useSelector(getIsSaving);
  const isContactFormValid = form?.getState()?.valid;
  const isEditMode = useSelector(getIsEditMode);
  const isFetching = useSelector(getIsFetching);
  const isSaveClicked = useSelector(getIsSaveClicked);
  const usersPermissions = useSelector(getUsersPermissions);
  const userActiveServiceUnit = useSelector(getUserActiveServiceUnit);

  const contactId = params.contactId;

  const setTabDirty = useCallback<SetTabDirtyFunction>((tabId, isDirty) => {
    // Update the map with this tab's dirty state
    tabDirtyStateRef.current.set(tabId, isDirty);

    setDirtyTabs((prevDirtyTabs) => {
      const newDirtyTabs = new Set(prevDirtyTabs);
      if (isDirty) {
        newDirtyTabs.add(tabId);
      } else {
        newDirtyTabs.delete(tabId);
      }
      return newDirtyTabs;
    });
  }, []);

  const isTabDirty = useCallback((tabId: number) => {
    return tabDirtyStateRef.current.get(tabId) || false;
  }, []);

  const setContactPageTitle = useCallback(() => {
    const nameInfo = getContactFullName(contact);
    setPageTitle(`${nameInfo ? `${nameInfo} | ` : ""}Asiakas`);
  }, [contact]);

  const stopAutoSaveTimer = useCallback(() => {
    if (timerAutoSave) {
      clearInterval(timerAutoSave);
      setTimerAutoSave(null);
    }
  }, [timerAutoSave]);

  const saveUnsavedChanges = useCallback(() => {
    console.log("Auto-saving unsaved changes...");
    const isFormDirty = form?.getState()?.dirty;
    if (isFormDirty) {
      setSessionStorageItem(FormNames.CONTACT, form.getState().values);
      setSessionStorageItem("contactId", contactId);
    } else {
      removeSessionStorageItem(FormNames.CONTACT);
      removeSessionStorageItem("contactId");
    }
  }, [form, contactId]);

  const startAutoSaveTimer = useCallback(() => {
    const timer = setInterval(() => saveUnsavedChanges(), 5000);
    setTimerAutoSave(timer);
    return timer;
  }, [saveUnsavedChanges]);

  const handleLeavePage = useCallback(
    (e) => {
      if (form?.getState()?.dirty && isEditMode) {
        e.preventDefault();
        // Legacy support for older browsers
        e.returnValue = true;
      }
    },
    [form, isEditMode],
  );

  const handlePopState = useCallback(() => {
    const query = getUrlParams(location.search);
    const tab = query.tab ? Number(query.tab) : 0;
    // Set correct active tab on back/forward button press
    setActiveTab(tab);
  }, [location.search]);

  useEffect(() => {
    const query = getUrlParams(location.search);
    setContactPageTitle();
    dispatch(receiveIsSaveClicked(false));
    dispatch(
      receiveTopNavigationSettings({
        linkUrl: getRouteById(Routes.CONTACTS),
        pageTitle: "Asiakkaat",
        showSearch: false,
      }),
    );
    dispatch(fetchSingleContact(contactId));

    if (query.tab) {
      setActiveTab(Number(query.tab));
    }

    dispatch(hideEditMode());
    window.addEventListener("popstate", handlePopState);

    return () => {
      if (
        location.pathname !== `${getRouteById(Routes.CONTACTS)}/${contactId}`
      ) {
        clearUnsavedChanges();
      }

      stopAutoSaveTimer();
      dispatch(receiveSingleContact({}));
      dispatch(hideEditMode());
      window.removeEventListener("popstate", handlePopState);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (form?.getState()?.dirty && isEditMode) {
      window.addEventListener("beforeunload", handleLeavePage);

      return () => {
        window.removeEventListener("beforeunload", handleLeavePage);
      };
    }
  }, [form, isEditMode, handleLeavePage]);

  useEffect(() => {
    const prevContact = prevContactRef.current;
    setContactPageTitle();
    const storedContactId = getSessionStorageItem("contactId");
    const hasUnsavedChanges =
      storedContactId && Number(contactId) === Number(storedContactId);
    if (
      !isEmpty(contact) &&
      hasUnsavedChanges &&
      (prevContact === null || isEmpty(prevContact))
    ) {
      setIsRestoreModalOpen(true);
    }
    prevContactRef.current = contact;
  }, [contact, contactId, setContactPageTitle]);

  useEffect(() => {
    const wasEditMode = prevEditModeRef.current;

    // Update ref with current value for next render
    prevEditModeRef.current = isEditMode;
    if (wasEditMode === true && !isEditMode) {
      stopAutoSaveTimer();
      clearUnsavedChanges();
    }
  }, [isEditMode, stopAutoSaveTimer]);

  useEffect(() => {
    scrollToTopPage();
  }, [activeTab]);

  const cancelRestoreUnsavedChanges = useCallback(() => {
    clearUnsavedChanges();
    setIsRestoreModalOpen(false);
  }, []);

  const restoreUnsavedChanges = useCallback(() => {
    dispatch(showEditMode());
    if (form) {
      form.reset(contact);

      setTimeout(() => {
        const storedContactFormValues: Partial<Contact> = getSessionStorageItem(
          FormNames.CONTACT,
        );
        if (storedContactFormValues) {
          form.batch(() => {
            Object.entries(storedContactFormValues).forEach(
              ([field, value]) => {
                form.change(field as keyof Contact, value);
              },
            );
          });
        }
        startAutoSaveTimer();
      }, 20);
    }
    setIsRestoreModalOpen(false);
  }, [form, contact, dispatch, startAutoSaveTimer]);

  const copyContact = useCallback(() => {
    const contactCopy = { ...contact, id: undefined };
    // Move the copied contact to redux state to persist it
    // when navigating to the new contact page
    dispatch(initializeContactForm(contactCopy));
    dispatch(hideEditMode());
    clearUnsavedChanges();
    return history.push({
      pathname: getRouteById(Routes.CONTACT_NEW),
      search: location.search,
    });
  }, [contact, dispatch, history, location.search]);

  const handleBack = useCallback(() => {
    const query = getUrlParams(location.search);
    delete query.tab;
    return history.push({
      pathname: `${getRouteById(Routes.CONTACTS)}`,
      search: getSearchQuery(query),
    });
  }, [history, location.search]);

  const handleTabClick = useCallback(
    (tabId) => {
      const query = getUrlParams(location.search);
      setActiveTab(tabId);
      query.tab = tabId;
      return history.push({ ...location, search: getSearchQuery(query) });
    },
    [history, location],
  );

  const cancelChanges = useCallback(() => {
    dispatch(hideEditMode());
  }, [dispatch]);

  const saveChanges = useCallback(() => {
    dispatch(receiveIsSaveClicked(true));
    handleSubmit();
  }, [handleSubmit, dispatch]);

  const showEditModeHandler = useCallback(() => {
    dispatch(receiveIsSaveClicked(false));
    if (form) {
      form.reset(contact);
    }
    dispatch(showEditMode());
    startAutoSaveTimer();
  }, [form, contact, dispatch, startAutoSaveTimer]);

  const isServiceUnitSameAsActiveServiceUnit = useCallback(() => {
    return userActiveServiceUnit?.id === contact?.service_unit?.id;
  }, [userActiveServiceUnit, contact]);

  const nameInfo = getContactFullName(contact);

  if (isFetching) {
    return (
      <PageContainer>
        <Loader isLoading={true} />
      </PageContainer>
    );
  }

  if (!contactMethods) return null;
  if (!isMethodAllowed(contactMethods, Methods.GET))
    return (
      <PageContainer>
        <AuthorizationError text={PermissionMissingTexts.CONTACT} />
      </PageContainer>
    );

  return (
    <FullWidthContainer>
      <PageNavigationWrapper>
        <ControlButtonBar
          buttonComponent={
            <FormSpy subscription={{ valid: true }}>
              {/* Save button needs valid state */}
              {({ valid }) => {
                return (
                  <ControlButtons
                    allowCopy={
                      isMethodAllowed(contactMethods, Methods.POST) &&
                      isServiceUnitSameAsActiveServiceUnit()
                    }
                    allowEdit={
                      isMethodAllowed(contactMethods, Methods.PATCH) &&
                      isServiceUnitSameAsActiveServiceUnit()
                    }
                    isCopyDisabled={false}
                    isEditMode={isEditMode}
                    isSaveDisabled={isSaveClicked || !valid}
                    onCancel={cancelChanges}
                    onCopy={copyContact}
                    onEdit={showEditModeHandler}
                    onSave={saveChanges}
                    showCommentButton={false}
                    showCopyButton={true}
                  />
                );
              }}
            </FormSpy>
          }
          infoComponent={<h1>{nameInfo}</h1>}
          onBack={handleBack}
        />
        <Tabs
          active={activeTab}
          isEditMode={isEditMode}
          tabs={[
            {
              label: "Perustiedot",
              allow: true,
              isDirty: isTabDirty(0),
              hasError: isSaveClicked && !isContactFormValid,
            },
            {
              label: "Kaupparekisteri",
              allow:
                hasPermissions(
                  usersPermissions,
                  UsersPermissions.VIEW_INVOICE,
                ) &&
                !!contact.business_id &&
                contact.type !== ContactTypes.PERSON,
            },
            {
              label: "Asiakastieto",
              allow: hasPermissions(
                usersPermissions,
                UsersPermissions.VIEW_CREDITDECISION,
              ),
            },
            {
              label: "Muutoshistoria",
              allow: hasPermissions(
                usersPermissions,
                UsersPermissions.VIEW_CONTACT,
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
        <Authorization allow={isMethodAllowed(contactMethods, Methods.PATCH)}>
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

        <ContactPageContent
          form={form}
          activeTab={activeTab}
          setTabDirty={setTabDirty}
          isEditMode={isEditMode}
          contact={contact}
          contactId={contactId}
          contactMethods={contactMethods}
          usersPermissions={usersPermissions}
        ></ContactPageContent>
      </PageContainer>
    </FullWidthContainer>
  );
};

const ContactPageContent: React.FC<{
  form: FormApi<Contact>;
  setTabDirty: SetTabDirtyFunction;
  activeTab: number;
  isEditMode: boolean;
  contact: Contact;
  contactId: string;
  contactMethods: ContactMethods;
  usersPermissions: UsersPermissionsType;
}> = ({
  form,
  setTabDirty,
  activeTab,
  isEditMode,
  contact,
  contactId,
  contactMethods,
  usersPermissions,
}) => {
  return (
    <TabContent active={activeTab}>
      <TabPane>
        <ContentContainer>
          <Title
            enableUiDataEdit={isEditMode}
            uiDataKey={getUiDataContactKey(ContactFieldPaths.BASIC_INFO)}
          >
            {ContactFieldTitles.BASIC_INFO}
          </Title>
          <Divider />
          {isEditMode ? (
            <Authorization
              allow={isMethodAllowed(contactMethods, Methods.PATCH)}
              errorComponent={
                <AuthorizationError text={PermissionMissingTexts.GENERAL} />
              }
            >
              <ContactEdit
                form={form}
                tabId={activeTab}
                setTabDirty={setTabDirty}
              />
            </Authorization>
          ) : (
            <ContactReadonly contact={contact} />
          )}
        </ContentContainer>
      </TabPane>

      <TabPane>
        <ContentContainer>
          <Authorization
            allow={hasPermissions(
              usersPermissions,
              UsersPermissions.VIEW_INVOICE,
            )}
            errorComponent={
              <AuthorizationError text={PermissionMissingTexts.GENERAL} />
            }
          >
            {!!contact.business_id && contact.type !== ContactTypes.PERSON && (
              <>
                <Title
                  enableUiDataEdit={isEditMode}
                  uiDataKey={getUiDataContactKey(
                    ContactFieldPaths.TRADE_REGISTER,
                  )}
                >
                  {ContactFieldTitles.TRADE_REGISTER}
                </Title>
                <Divider />
                <TradeRegisterTemplate businessId={contact.business_id} />
              </>
            )}
          </Authorization>
        </ContentContainer>
      </TabPane>

      <TabPane>
        <ContentContainer>
          <Authorization
            allow={hasPermissions(
              usersPermissions,
              UsersPermissions.VIEW_CREDITDECISION,
            )}
            errorComponent={
              <AuthorizationError text={PermissionMissingTexts.GENERAL} />
            }
          >
            <>
              <Title
                enableUiDataEdit={isEditMode}
                uiDataKey={getUiDataContactKey(
                  ContactFieldPaths.CREDIT_DECISION,
                )}
              >
                {ContactFieldTitles.CREDIT_DECISION}
              </Title>
              <Divider />
              <CreditDecisionTemplate
                contactType={contact.type}
                contactId={contactId}
              />
            </>
          </Authorization>
        </ContentContainer>
      </TabPane>

      <TabPane>
        <ContentContainer>
          <Authorization
            allow={hasPermissions(
              usersPermissions,
              UsersPermissions.VIEW_CONTACT,
            )}
            errorComponent={
              <AuthorizationError text={PermissionMissingTexts.GENERAL} />
            }
          >
            <>
              <Title
                enableUiDataEdit={isEditMode}
                uiDataKey={getUiDataContactKey(ContactFieldPaths.AUDIT_LOG)}
              >
                {ContactFieldTitles.AUDIT_LOG}
              </Title>
              <Divider />
              <ContactAuditLog contactId={contactId} />
            </>
          </Authorization>
        </ContentContainer>
      </TabPane>
    </TabContent>
  );
};

const ContactPage: React.FC = () => {
  // Fetch ui data and attributes if needed
  useUiDataList();
  const dispatch = useDispatch();
  const contact = useSelector(getCurrentContact);

  const handleFormSubmit = useCallback(
    (values: Contact) => {
      dispatch(editContact(values));
    },
    [dispatch],
  );

  return (
    <Form
      onSubmit={handleFormSubmit}
      initialValues={contact}
      keepDirtyOnReinitialize={true}
    >
      {({ form, handleSubmit }) => (
        <ContactPageView
          contact={contact}
          form={form}
          handleSubmit={handleSubmit}
        />
      )}
    </Form>
  );
};

export default ContactPage;
