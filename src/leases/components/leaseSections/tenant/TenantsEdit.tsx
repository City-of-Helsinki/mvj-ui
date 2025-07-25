import React, { Fragment, PureComponent, ReactElement } from "react";
import { connect } from "react-redux";
import flowRight from "lodash/flowRight";
import { Field, FieldArray, getFormValues, reduxForm } from "redux-form";
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
import { receiveFormValidFlags } from "@/leases/actions";
import { ContactTypes } from "@/contacts/enums";
import { ButtonColors } from "@/components/enums";
import { ConfirmationModalTexts, FormNames } from "@/enums";
import {
  LeaseTenantsFieldPaths,
  LeaseTenantsFieldTitles,
} from "@/leases/enums";
import { UsersPermissions } from "@/usersPermissions/enums";
import { Methods } from "@/enums";
import { validateTenantForm, warnTenantForm } from "@/leases/formValidators";
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
  getMethods as getContactMethods,
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
import { withContactAttributes } from "@/components/attributes/ContactAttributes";
import type { Attributes, Methods as MethodsType } from "types";
import type { Contact, ContactModalSettings } from "@/contacts/types";
import type { Lease } from "@/leases/types";
import type {
  UsersPermissions as UsersPermissionsType,
  UserServiceUnit,
} from "@/usersPermissions/types";

type WarningsProps = {
  meta: Record<string, any>;
};

const TenantWarnings = ({ meta: { warning } }: WarningsProps): ReactElement => {
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
};

const renderTenants = ({
  archived,
  fields,
  isFetchingContactAttributes,
  leaseAttributes,
  serviceUnit,
  tenants,
  usersPermissions,
}: TenantsProps): ReactElement => {
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
      {({ dispatch }) => {
        return (
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
                  dispatch({
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

                return (
                  <TenantItemEdit
                    key={index}
                    field={tenant}
                    index={index}
                    onRemove={handleRemove}
                    tenants={tenants}
                    serviceUnit={serviceUnit}
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
        );
      }}
    </AppConsumer>
  );
};

type Props = {
  change: (...args: Array<any>) => any;
  contactFormValues: Contact;
  contactMethods: MethodsType;
  contactModalSettings: ContactModalSettings;
  createContact: (...args: Array<any>) => any;
  currentLease: Lease;
  editContact: (...args: Array<any>) => any;
  handleSubmit: (...args: Array<any>) => any;
  hideContactModal: (...args: Array<any>) => any;
  isContactModalOpen: boolean;
  isFetchingContact: boolean;
  leaseAttributes: Attributes;
  receiveContactModalSettings: (...args: Array<any>) => any;
  receiveFormValidFlags: (...args: Array<any>) => any;
  receiveIsSaveClicked: (...args: Array<any>) => any;
  usersPermissions: UsersPermissionsType;
  valid: boolean;
  userActiveServiceUnit: UserServiceUnit;
};
type State = {
  currentLease: Lease;
  savedTenants: Array<Record<string, any>>;
  savedTenantsArchived: Array<Record<string, any>>;
};

class TenantsEdit extends PureComponent<Props, State> {
  state: State = {
    currentLease: null,
    savedTenants: [],
    savedTenantsArchived: [],
  };

  componentDidMount() {
    const { hideContactModal } = this.props;
    hideContactModal();
  }

  static getDerivedStateFromProps(props, state) {
    if (props.currentLease !== state.lease) {
      const tenants = getContentTenants(props.currentLease);
      return {
        currentLease: props.currentLease,
        savedTenants: tenants.filter((tenant) => !isArchived(tenant.tenant)),
        savedTenantsArchived: tenants.filter((tenant) =>
          isArchived(tenant.tenant),
        ),
      };
    }

    return null;
  }

  componentDidUpdate(prevProps) {
    const {
      change,
      contactModalSettings,
      receiveContactModalSettings,
      receiveFormValidFlags,
    } = this.props;

    if (prevProps.valid !== this.props.valid) {
      receiveFormValidFlags({
        [formName]: this.props.valid,
      });
    }

    if (contactModalSettings && contactModalSettings.contact) {
      // Update contact dropdown after creating/patching a contact
      change(
        contactModalSettings.field,
        getContentContact(contactModalSettings.contact),
      );
      receiveContactModalSettings(null);
    }
  }

  handleCancel = () => {
    const { hideContactModal, receiveContactModalSettings } = this.props;
    hideContactModal();
    receiveContactModalSettings(null);
  };
  handleClose = () => {
    const { hideContactModal, receiveContactModalSettings } = this.props;
    hideContactModal();
    receiveContactModalSettings(null);
  };
  createOrEditContact = (values: Partial<Contact>) => {
    const { contactModalSettings, createContact, editContact } = this.props;

    if (contactModalSettings && contactModalSettings.isNew) {
      createContact(values);
    } else if (contactModalSettings && !contactModalSettings.isNew) {
      editContact(values);
    }
  };

  render() {
    const {
      contactMethods,
      contactModalSettings,
      handleSubmit,
      isContactModalOpen,
      isFetchingContact,
      leaseAttributes,
      usersPermissions,
      userActiveServiceUnit,
    } = this.props;
    const { savedTenants, savedTenantsArchived, currentLease } = this.state;
    return (
      <AppConsumer>
        {({ dispatch }) => {
          const handleCreateOrEdit = async (
            values: Partial<Contact>,
            isValid: boolean,
          ) => {
            const { contactModalSettings, receiveIsSaveClicked } = this.props;
            const { business_id, national_identification_number, type } =
              values;
            receiveIsSaveClicked(true);
            if (!isValid) return;

            if (!contactModalSettings || !contactModalSettings.isNew) {
              this.createOrEditContact(values);
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
                    this.createOrEditContact(values);
                  },
                  confirmationModalButtonClassName: ButtonColors.SUCCESS,
                  confirmationModalButtonText:
                    ConfirmationModalTexts.CREATE_CONTACT.BUTTON,
                  confirmationModalLabel:
                    ConfirmationModalTexts.CREATE_CONTACT.LABEL,
                  confirmationModalTitle:
                    ConfirmationModalTexts.CREATE_CONTACT.TITLE,
                });
              } else {
                this.createOrEditContact(values);
              }
            } else {
              this.createOrEditContact(values);
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
                  onCancel={this.handleCancel}
                  onClose={this.handleClose}
                  onSave={handleCreateOrEdit}
                  onSaveAndAdd={handleCreateOrEdit}
                  showSave={contactModalSettings && !contactModalSettings.isNew}
                  showSaveAndAdd={
                    contactModalSettings && contactModalSettings.isNew
                  }
                  title={
                    contactModalSettings && contactModalSettings.isNew
                      ? "Uusi asiakas"
                      : "Muokkaa asiakasta"
                  }
                  serviceUnit={userActiveServiceUnit}
                />
              </Authorization>

              <form onSubmit={handleSubmit}>
                <Title
                  enableUiDataEdit
                  uiDataKey={getUiDataLeaseKey(LeaseTenantsFieldPaths.TENANTS)}
                >
                  {LeaseTenantsFieldTitles.TENANTS}
                </Title>
                <Field
                  name="tenantWarnings"
                  component={TenantWarnings}
                  showWarning={true}
                />
                <Divider />
                {/**
                @ts-ignore: Property 'service_unit' does not exist on type '{}' */}
                <FieldArray
                  component={renderTenants}
                  leaseAttributes={leaseAttributes}
                  name="tenants"
                  serviceUnit={currentLease.service_unit}
                  tenants={savedTenants}
                  usersPermissions={usersPermissions}
                />
                {/**
                @ts-ignore: Property 'service_unit' does not exist on type '{}' */}
                <FieldArray
                  component={renderTenants}
                  leaseAttributes={leaseAttributes}
                  name="tenantsArchived"
                  archived
                  serviceUnit={currentLease.service_unit}
                  tenants={savedTenantsArchived}
                  usersPermissions={usersPermissions}
                />
              </form>
            </Fragment>
          );
        }}
      </AppConsumer>
    );
  }
}

const formName = FormNames.LEASE_TENANTS;
export default flowRight(
  withContactAttributes,
  connect(
    (state) => {
      return {
        contactMethods: getContactMethods(state),
        contactModalSettings: getContactModalSettings(state),
        contactFormValues: getFormValues(FormNames.CONTACT)(state),
        currentLease: getCurrentLease(state),
        isContactModalOpen: getIsContactModalOpen(state),
        isFetchingContact: getIsFetchingContact(state),
        leaseAttributes: getLeaseAttributes(state),
        usersPermissions: getUsersPermissions(state),
        userActiveServiceUnit: getUserActiveServiceUnit(state),
      };
    },
    {
      createContact,
      editContact,
      hideContactModal,
      receiveContactModalSettings,
      receiveFormValidFlags,
      receiveIsSaveClicked,
    },
  ),
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
    validate: validateTenantForm,
    warn: warnTenantForm,
  }),
)(TenantsEdit) as React.ComponentType<any>;
