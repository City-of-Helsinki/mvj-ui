import React, { Fragment, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form } from "react-final-form";
import type { FormApi } from "final-form";
import { FieldArray } from "react-final-form-arrays";
import { Row, Column } from "react-foundation";
import { ActionTypes, AppConsumer } from "@/app/AppContext";
import Authorization from "@/components/authorization/Authorization";
import AddButton from "@/components/form/AddButton";
import ContactModal from "@/contacts/components/ContactModal";
import Divider from "@/components/content/Divider";
import FormText from "@/components/form/FormText";
import Loader from "@/components/loader/Loader";
import LoaderWrapper from "@/components/loader/LoaderWrapper";
import TenantItemEdit from "./TenantItemEdit";
import Title from "@/components/content/Title";
import WarningContainer from "@/components/content/WarningContainer";
import WarningField from "@/components/form/WarningField";
import {
  createContactOnModal as createContact,
  editContactOnModal as editContact,
  hideContactModal,
  receiveContactModalSettings,
  receiveIsSaveClicked,
} from "@/contacts/actions";
import { ContactTypes } from "@/contacts/enums";
import { ButtonColors } from "@/components/enums";
import { ConfirmationModalTexts, FormNames } from "@/enums";
import {
  LeaseTenantsFieldPaths,
  LeaseTenantsFieldTitles,
} from "@/leases/enums";
import { UsersPermissions } from "@/usersPermissions/enums";
import { Methods } from "@/enums";
import { warnTenantForm } from "@/leases/formValidators";
import {
  hasPermissions,
  isArchived,
  isEmptyValue,
  isFieldAllowedToEdit,
  isMethodAllowed,
} from "@/util/helpers";
import { getContentContact } from "@/contacts/helpers";
import { getContentTenants } from "@/leases/helpers";
import { getUiDataLeaseKey } from "@/uiData/helpers";
import { contactExists } from "@/contacts/requestsAsync";
import {
  getContactModalSettings,
  getIsContactModalOpen,
  getIsFetching as getIsFetchingContact,
} from "@/contacts/selectors";
import {
  getAttributes as getLeaseAttributes,
  getCurrentLease,
} from "@/leases/selectors";
import {
  getUserActiveServiceUnit,
  getUsersPermissions,
} from "@/usersPermissions/selectors";
import { useContactAttributes } from "@/components/attributes/ContactAttributes";
import type { Attributes } from "types";
import type { Contact } from "@/contacts/types";
import type {
  UsersPermissions as UsersPermissionsType,
  UserServiceUnit,
} from "@/usersPermissions/types";

type WarningsProps = {
  meta: Record<string, any>;
};

const TenantWarnings = ({ meta: { warning } }: WarningsProps) => {
  return (
    <Fragment>
      {warning && !!warning.length && (
        <WarningContainer>
          {warning.map((item, index) => (
            <WarningField
              key={index}
              meta={{
                warning: item,
              }}
              showWarning={true}
            />
          ))}
        </WarningContainer>
      )}
    </Fragment>
  );
};

type TenantsProps = {
  archived: boolean;
  fields: any;
  isFetchingContactAttributes: boolean;
  leaseAttributes: Attributes;
  serviceUnit: UserServiceUnit;
  tenants: Array<Record<string, any>>;
  usersPermissions: UsersPermissionsType;
  formValues: Record<string, any>;
};

const renderTenants = ({
  archived,
  fields,
  isFetchingContactAttributes,
  leaseAttributes,
  serviceUnit,
  tenants,
  usersPermissions,
  formValues,
}: TenantsProps) => {
  const handleAdd = () => {
    fields.push({});
  };

  if (isFetchingContactAttributes)
    return (
      <LoaderWrapper>
        <Loader isLoading={true} />
      </LoaderWrapper>
    );

  return (
    <AppConsumer>
      {({ dispatch: appDispatch }) => (
        <Fragment>
          {archived && fields && !!fields.length && (
            <h3
              style={{
                marginTop: 10,
                marginBottom: 5,
              }}
            >
              Arkisto
            </h3>
          )}
          {!isFieldAllowedToEdit(
            leaseAttributes,
            LeaseTenantsFieldPaths.TENANTS,
          ) &&
            !archived &&
            (!fields || !fields.length) && (
              <FormText className="no-margin">Ei vuokralaisia</FormText>
            )}
          {fields &&
            !!fields.length &&
            fields.map((tenant, index) => {
              const handleRemove = () => {
                appDispatch({
                  type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                  confirmationFunction: () => {
                    fields.remove(index);
                  },
                  confirmationModalButtonClassName: ButtonColors.ALERT,
                  confirmationModalButtonText:
                    ConfirmationModalTexts.DELETE_TENANT.BUTTON,
                  confirmationModalLabel:
                    ConfirmationModalTexts.DELETE_TENANT.LABEL,
                  confirmationModalTitle:
                    ConfirmationModalTexts.DELETE_TENANT.TITLE,
                });
              };
              const fieldName = archived ? "tenantsArchived" : "tenants";
              const tenantData = formValues?.[fieldName]?.[index] || {};

              return (
                <TenantItemEdit
                  key={index}
                  field={tenant}
                  onRemove={handleRemove}
                  tenants={tenants}
                  serviceUnit={serviceUnit}
                  tenantId={tenantData.id}
                  contact={tenantData.tenant?.contact}
                  shareNumerator={tenantData.share_numerator}
                  shareDenominator={tenantData.share_denominator}
                />
              );
            })}
          {!archived && (
            <Authorization
              allow={hasPermissions(
                usersPermissions,
                UsersPermissions.ADD_TENANT,
              )}
            >
              <Row>
                <Column>
                  <AddButton
                    className="no-margin"
                    label="Lisää vuokralainen"
                    onClick={handleAdd}
                  />
                </Column>
              </Row>
            </Authorization>
          )}
        </Fragment>
      )}
    </AppConsumer>
  );
};

type Props = {
  formApi: FormApi;
};

const TenantsEdit: React.FC<Props> = ({ formApi }) => {
  const { change } = formApi;
  const dispatch = useDispatch();

  const { contactMethods, isFetchingContactAttributes } =
    useContactAttributes();
  const contactModalSettings = useSelector(getContactModalSettings);
  const currentLease = useSelector(getCurrentLease);
  const isContactModalOpen = useSelector(getIsContactModalOpen);
  const isFetchingContact = useSelector(getIsFetchingContact);
  const leaseAttributes = useSelector(getLeaseAttributes);
  const usersPermissions = useSelector(getUsersPermissions);
  const userActiveServiceUnit = useSelector(getUserActiveServiceUnit);

  useEffect(() => {
    dispatch(hideContactModal());
  }, []);

  const { savedTenants, savedTenantsArchived } = useMemo(() => {
    if (!currentLease) {
      return {
        savedTenants: [],
        savedTenantsArchived: [],
      };
    }

    const tenants = getContentTenants(currentLease);
    return {
      savedTenants: tenants.filter((tenant) => !isArchived(tenant.tenant)),
      savedTenantsArchived: tenants.filter((tenant) =>
        isArchived(tenant.tenant),
      ),
    };
  }, [currentLease]);

  useEffect(() => {
    if (contactModalSettings?.contact) {
      // Update contact dropdown after creating/patching a contact
      change(
        contactModalSettings.field,
        getContentContact(contactModalSettings.contact),
      );
      dispatch(receiveContactModalSettings(null));
    }
  }, [contactModalSettings, change, dispatch]);

  const handleCancel = () => {
    dispatch(hideContactModal());
    dispatch(receiveContactModalSettings(null));
  };
  const handleClose = () => {
    dispatch(hideContactModal());
    dispatch(receiveContactModalSettings(null));
  };
  const createOrEditContact = (values: Contact) => {
    if (contactModalSettings && contactModalSettings.isNew) {
      dispatch(createContact(values));
    } else if (contactModalSettings && !contactModalSettings.isNew) {
      dispatch(editContact(values));
    }
  };

  const handleCreateOrEdit = async (values: Contact, isValid: boolean) => {
    const { business_id, national_identification_number, type } = values;
    dispatch(receiveIsSaveClicked(true));
    if (!isValid) return;

    if (!contactModalSettings || !contactModalSettings.isNew) {
      createOrEditContact(values);
      return;
    }

    const contactIdentifier = type
      ? type === ContactTypes.PERSON
        ? national_identification_number
        : business_id
      : null;

    if (contactIdentifier && !isEmptyValue(contactIdentifier)) {
      const exists = await contactExists({
        identifier: contactIdentifier,
        serviceUnitId: currentLease.service_unit?.id,
      });

      if (exists) {
        dispatch({
          type: ActionTypes.SHOW_CONFIRMATION_MODAL,
          confirmationFunction: () => {
            createOrEditContact(values);
          },
          confirmationModalButtonClassName: ButtonColors.SUCCESS,
          confirmationModalButtonText:
            ConfirmationModalTexts.CREATE_CONTACT.BUTTON,
          confirmationModalLabel: ConfirmationModalTexts.CREATE_CONTACT.LABEL,
          confirmationModalTitle: ConfirmationModalTexts.CREATE_CONTACT.TITLE,
        });
      } else {
        createOrEditContact(values);
      }
    } else {
      createOrEditContact(values);
    }
  };

  return (
    <Fragment>
      {isFetchingContact && (
        <LoaderWrapper className="overlay-wrapper">
          <Loader isLoading={isFetchingContact} />
        </LoaderWrapper>
      )}

      <Authorization
        allow={
          isMethodAllowed(contactMethods, Methods.POST) ||
          isMethodAllowed(contactMethods, Methods.PATCH)
        }
      >
        <ContactModal
          isOpen={isContactModalOpen}
          onCancel={handleCancel}
          onClose={handleClose}
          onSave={handleCreateOrEdit}
          onSaveAndAdd={handleCreateOrEdit}
          showSave={contactModalSettings && !contactModalSettings.isNew}
          showSaveAndAdd={contactModalSettings && contactModalSettings.isNew}
          title={
            contactModalSettings && contactModalSettings.isNew
              ? "Uusi asiakas"
              : "Muokkaa asiakasta"
          }
          serviceUnit={userActiveServiceUnit}
        />
      </Authorization>
      <Form form={formApi} onSubmit={formApi.submit}>
        {({ handleSubmit, values }) => (
          <form onSubmit={handleSubmit}>
            <Title
              enableUiDataEdit
              uiDataKey={getUiDataLeaseKey(LeaseTenantsFieldPaths.TENANTS)}
            >
              {LeaseTenantsFieldTitles.TENANTS}
            </Title>
            <TenantWarnings
              meta={{
                warning: warnTenantForm(values || {})?.tenantWarnings || [],
              }}
            />
            <Divider />
            <FieldArray name="tenants">
              {(fieldArrayProps) =>
                renderTenants({
                  ...fieldArrayProps,
                  archived: false,
                  isFetchingContactAttributes,
                  leaseAttributes,
                  serviceUnit: currentLease.service_unit,
                  tenants: savedTenants,
                  usersPermissions,
                  formValues: values,
                })
              }
            </FieldArray>
            <FieldArray name="tenantsArchived">
              {(fieldArrayProps) =>
                renderTenants({
                  ...fieldArrayProps,
                  archived: true,
                  isFetchingContactAttributes,
                  leaseAttributes,
                  serviceUnit: currentLease.service_unit,
                  tenants: savedTenantsArchived,
                  usersPermissions,
                  formValues: values,
                })
              }
            </FieldArray>
          </form>
        )}
      </Form>
    </Fragment>
  );
};

const formName = FormNames.LEASE_TENANTS; // The name of the form for redux-form, might be useful for some remaining logic for this form name
export default TenantsEdit;
