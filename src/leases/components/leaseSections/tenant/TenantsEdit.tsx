import React, { Fragment, PureComponent, ReactElement } from "react";
import { connect } from "react-redux";
import flowRight from "lodash/flowRight";
import { Field, FieldArray, getFormValues, reduxForm } from "redux-form";
import { Row, Column } from "react-foundation";
import { ActionTypes, AppConsumer } from "/src/app/AppContext";
import Authorization from "/src/components/authorization/Authorization";
import AddButton from "/src/components/form/AddButton";
import ContactModal from "/src/contacts/components/ContactModal";
import Divider from "/src/components/content/Divider";
import FormText from "/src/components/form/FormText";
import Loader from "/src/components/loader/Loader";
import LoaderWrapper from "/src/components/loader/LoaderWrapper";
import TenantItemEdit from "./TenantItemEdit";
import Title from "/src/components/content/Title";
import WarningContainer from "/src/components/content/WarningContainer";
import WarningField from "/src/components/form/WarningField";
import { createContactOnModal as createContact, editContactOnModal as editContact, hideContactModal, receiveContactModalSettings, receiveIsSaveClicked } from "/src/contacts/actions";
import { receiveFormValidFlags } from "/src/leases/actions";
import { ContactTypes } from "/src/contacts/enums";
import { ButtonColors } from "/src/components/enums";
import { ConfirmationModalTexts, FormNames } from "enums";
import { LeaseTenantsFieldPaths, LeaseTenantsFieldTitles } from "/src/leases/enums";
import { UsersPermissions } from "usersPermissions/enums";
import { Methods } from "enums";
import { validateTenantForm, warnTenantForm } from "/src/leases/formValidators";
import { hasPermissions, isArchived, isEmptyValue, isFieldAllowedToEdit, isMethodAllowed } from "util/helpers";
import { getContentContact } from "/src/contacts/helpers";
import { getContentTenants } from "/src/leases/helpers";
import { getUiDataLeaseKey } from "/src/uiData/helpers";
import { contactExists } from "/src/contacts/requestsAsync";
import { getMethods as getContactMethods, getContactModalSettings, getIsContactFormValid, getIsContactModalOpen, getIsFetching as getIsFetchingContact } from "/src/contacts/selectors";
import { getAttributes as getLeaseAttributes, getCurrentLease } from "/src/leases/selectors";
import { getUsersPermissions } from "usersPermissions/selectors";
import { withContactAttributes } from "/src/components/attributes/ContactAttributes";
import type { Attributes, Methods as MethodsType } from "types";
import type { ContactModalSettings } from "/src/contacts/types";
import type { Lease } from "/src/leases/types";
import type { UsersPermissions as UsersPermissionsType, UserServiceUnit } from "usersPermissions/types";
type WarningsProps = {
  meta: Record<string, any>;
};

const TenantWarnings = ({
  meta: {
    warning
  }
}: WarningsProps): ReactElement => {
  return <Fragment>
    {warning && !!warning.length && <WarningContainer>
        {warning.map((item, index) => <WarningField key={index} meta={{
        warning: item
      }} showWarning={true} />)}
      </WarningContainer>}
  </Fragment>;
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
  usersPermissions
}: TenantsProps): ReactElement => {
  const handleAdd = () => {
    fields.push({});
  };

  if (isFetchingContactAttributes) return <LoaderWrapper><Loader isLoading={true} /></LoaderWrapper>;
  return <AppConsumer>
      {({
      dispatch
    }) => {
      return <Fragment>
            {archived && fields && !!fields.length && <h3 style={{
          marginTop: 10,
          marginBottom: 5
        }}>Arkisto</h3>}
            {!isFieldAllowedToEdit(leaseAttributes, LeaseTenantsFieldPaths.TENANTS) && !archived && (!fields || !fields.length) && <FormText className='no-margin'>Ei vuokralaisia</FormText>}
            {fields && !!fields.length && fields.map((tenant, index) => {
          const handleRemove = () => {
            dispatch({
              type: ActionTypes.SHOW_CONFIRMATION_MODAL,
              confirmationFunction: () => {
                fields.remove(index);
              },
              confirmationModalButtonClassName: ButtonColors.ALERT,
              confirmationModalButtonText: ConfirmationModalTexts.DELETE_TENANT.BUTTON,
              confirmationModalLabel: ConfirmationModalTexts.DELETE_TENANT.LABEL,
              confirmationModalTitle: ConfirmationModalTexts.DELETE_TENANT.TITLE
            });
          };

          return <TenantItemEdit key={index} field={tenant} index={index} onRemove={handleRemove} tenants={tenants} serviceUnit={serviceUnit} />;
        })}
            {!archived && <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.ADD_TENANT)}>
                <Row>
                  <Column>
                    <AddButton className='no-margin' label='Lisää vuokralainen' onClick={handleAdd} />
                  </Column>
                </Row>
              </Authorization>}
          </Fragment>;
    }}
    </AppConsumer>;
};

type Props = {
  change: (...args: Array<any>) => any;
  contactFormValues: Record<string, any>;
  contactMethods: MethodsType;
  contactModalSettings: ContactModalSettings;
  createContact: (...args: Array<any>) => any;
  currentLease: Lease;
  editContact: (...args: Array<any>) => any;
  handleSubmit: (...args: Array<any>) => any;
  hideContactModal: (...args: Array<any>) => any;
  isContactFormValid: boolean;
  isContactModalOpen: boolean;
  isFetchingContact: boolean;
  leaseAttributes: Attributes;
  receiveContactModalSettings: (...args: Array<any>) => any;
  receiveFormValidFlags: (...args: Array<any>) => any;
  receiveIsSaveClicked: (...args: Array<any>) => any;
  usersPermissions: UsersPermissionsType;
  valid: boolean;
};
type State = {
  currentLease: Lease;
  savedTenants: Array<Record<string, any>>;
  savedTenantsArchived: Array<Record<string, any>>;
};

class TenantsEdit extends PureComponent<Props, State> {
  state = {
    currentLease: {},
    savedTenants: [],
    savedTenantsArchived: []
  };

  componentDidMount() {
    const {
      hideContactModal
    } = this.props;
    hideContactModal();
  }

  static getDerivedStateFromProps(props, state) {
    if (props.currentLease !== state.lease) {
      const tenants = getContentTenants(props.currentLease);
      return {
        currentLease: props.currentLease,
        savedTenants: tenants.filter(tenant => !isArchived(tenant.tenant)),
        savedTenantsArchived: tenants.filter(tenant => isArchived(tenant.tenant))
      };
    }

    return null;
  }

  componentDidUpdate(prevProps) {
    const {
      change,
      contactModalSettings,
      receiveContactModalSettings,
      receiveFormValidFlags
    } = this.props;

    if (prevProps.valid !== this.props.valid) {
      receiveFormValidFlags({
        [formName]: this.props.valid
      });
    }

    if (contactModalSettings && contactModalSettings.contact) {
      // Update contact dropdown after creating/patching a contact
      change(contactModalSettings.field, getContentContact(contactModalSettings.contact));
      receiveContactModalSettings(null);
    }
  }

  handleCancel = () => {
    const {
      hideContactModal,
      receiveContactModalSettings
    } = this.props;
    hideContactModal();
    receiveContactModalSettings(null);
  };
  handleClose = () => {
    const {
      hideContactModal,
      receiveContactModalSettings
    } = this.props;
    hideContactModal();
    receiveContactModalSettings(null);
  };
  createOrEditContact = () => {
    const {
      contactFormValues,
      contactModalSettings,
      createContact,
      editContact
    } = this.props;

    if (contactModalSettings && contactModalSettings.isNew) {
      createContact(contactFormValues);
    } else if (contactModalSettings && !contactModalSettings.isNew) {
      editContact(contactFormValues);
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
      usersPermissions
    } = this.props;
    const {
      savedTenants,
      savedTenantsArchived,
      currentLease
    } = this.state;
    return <AppConsumer>
        {({
        dispatch
      }) => {
        const handleCreateOrEdit = async () => {
          const {
            contactFormValues,
            contactModalSettings,
            isContactFormValid,
            receiveIsSaveClicked
          } = this.props;
          const {
            business_id,
            national_identification_number,
            type
          } = contactFormValues;
          receiveIsSaveClicked(true);
          if (!isContactFormValid) return;

          if (!contactModalSettings || !contactModalSettings.isNew) {
            this.createOrEditContact();
            return;
          }

          const contactIdentifier = type ? type === ContactTypes.PERSON ? national_identification_number : business_id : null;

          if (contactIdentifier && !isEmptyValue(contactIdentifier)) {
            const exists = await contactExists(contactIdentifier);

            if (exists) {
              dispatch({
                type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                confirmationFunction: () => {
                  this.createOrEditContact();
                },
                confirmationModalButtonClassName: ButtonColors.SUCCESS,
                confirmationModalButtonText: ConfirmationModalTexts.CREATE_CONTACT.BUTTON,
                confirmationModalLabel: ConfirmationModalTexts.CREATE_CONTACT.LABEL,
                confirmationModalTitle: ConfirmationModalTexts.CREATE_CONTACT.TITLE
              });
            } else {
              this.createOrEditContact();
            }
          } else {
            this.createOrEditContact();
          }
        };

        return <Fragment>
              {isFetchingContact && <LoaderWrapper className='overlay-wrapper'><Loader isLoading={isFetchingContact} /></LoaderWrapper>}

              <Authorization allow={isMethodAllowed(contactMethods, Methods.POST) || isMethodAllowed(contactMethods, Methods.PATCH)}>
                <ContactModal isOpen={isContactModalOpen} onCancel={this.handleCancel} onClose={this.handleClose} onSave={handleCreateOrEdit} onSaveAndAdd={handleCreateOrEdit} showSave={contactModalSettings && !contactModalSettings.isNew} showSaveAndAdd={contactModalSettings && contactModalSettings.isNew} title={contactModalSettings && contactModalSettings.isNew ? 'Uusi asiakas' : 'Muokkaa asiakasta'} />
              </Authorization>

              <form onSubmit={handleSubmit}>
                <Title enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseTenantsFieldPaths.TENANTS)}>
                  {LeaseTenantsFieldTitles.TENANTS}
                </Title>
                <Field name='tenantWarnings' component={TenantWarnings} showWarning={true} />
                <Divider />
                {/**
                @ts-ignore: Property 'service_unit' does not exist on type '{}' */}
                <FieldArray component={renderTenants} leaseAttributes={leaseAttributes} name='tenants' serviceUnit={currentLease.service_unit} tenants={savedTenants} usersPermissions={usersPermissions} />
                {/**
                @ts-ignore: Property 'service_unit' does not exist on type '{}' */}
                <FieldArray component={renderTenants} leaseAttributes={leaseAttributes} name='tenantsArchived' archived serviceUnit={currentLease.service_unit} tenants={savedTenantsArchived} usersPermissions={usersPermissions} />
              </form>
            </Fragment>;
      }}
      </AppConsumer>;
  }

}

const formName = FormNames.LEASE_TENANTS;
export default flowRight(withContactAttributes, connect(state => {
  return {
    contactMethods: getContactMethods(state),
    contactModalSettings: getContactModalSettings(state),
    contactFormValues: getFormValues(FormNames.CONTACT)(state),
    currentLease: getCurrentLease(state),
    isContactFormValid: getIsContactFormValid(state),
    isContactModalOpen: getIsContactModalOpen(state),
    isFetchingContact: getIsFetchingContact(state),
    leaseAttributes: getLeaseAttributes(state),
    usersPermissions: getUsersPermissions(state)
  };
}, {
  createContact,
  editContact,
  hideContactModal,
  receiveContactModalSettings,
  receiveFormValidFlags,
  receiveIsSaveClicked
}), reduxForm({
  form: formName,
  destroyOnUnmount: false,
  validate: validateTenantForm,
  warn: warnTenantForm
}))(TenantsEdit) as React.ComponentType<any>;