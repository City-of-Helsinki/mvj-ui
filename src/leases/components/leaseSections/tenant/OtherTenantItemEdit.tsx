import React, { Fragment } from "react";
import { Row, Column } from "react-foundation";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import AddButtonThird from "@/components/form/AddButtonThird";
import Authorization from "@/components/authorization/Authorization";
import BoxContentWrapper from "@/components/content/BoxContentWrapper";
import Collapse from "@/components/collapse/Collapse";
import CollapseHeaderSubtitle from "@/components/collapse/CollapseHeaderSubtitle";
import ContactTemplate from "@/contacts/components/templates/ContactTemplate";
import EditButton from "@/components/form/EditButton";
import FormField from "@/components/form/final-form/FormField";
import FormWrapper from "@/components/form/FormWrapper";
import FormWrapperLeft from "@/components/form/FormWrapperLeft";
import FormWrapperRight from "@/components/form/FormWrapperRight";
import SubTitle from "@/components/content/SubTitle";
import {
  initializeContactForm,
  receiveContactModalSettings,
  receiveIsSaveClicked,
  showContactModal,
} from "@/contacts/actions";
import { receiveCollapseStates } from "@/leases/actions";
import { FieldTypes, FormNames, Methods, ViewModes } from "@/enums";
import {
  LeaseTenantContactSetFieldPaths,
  LeaseTenantContactSetFieldTitles,
  TenantContactType,
} from "@/leases/enums";
import { UsersPermissions } from "@/usersPermissions/enums";
import { getUiDataLeaseKey } from "@/uiData/helpers";
import {
  formatDateRange,
  hasPermissions,
  isActive,
  isArchived,
  isFieldAllowedToRead,
  isMethodAllowed,
} from "@/util/helpers";
import { getMethods as getContactMethods } from "@/contacts/selectors";
import {
  getAttributes,
  getCollapseStateByKey,
  getErrorsByFormName,
  getIsSaveClicked,
} from "@/leases/selectors";
import { getUsersPermissions } from "@/usersPermissions/selectors";
import type { UserServiceUnit } from "@/usersPermissions/types";
import type { Contact } from "@/contacts/types";

type Props = {
  contact: Contact;
  contactType: (typeof TenantContactType)["BILLING" | "CONTACT"];
  field: string;
  onRemove: (...args: Array<any>) => any;
  serviceUnit: UserServiceUnit;
  tenant: Record<string, any>;
};

const OtherTenantItemEdit = ({
  contact,
  contactType,
  field,
  onRemove,
  serviceUnit,
  tenant,
}: Props) => {
  const dispatch = useDispatch();
  const attributes = useSelector(getAttributes);
  const collapseState = useSelector((state) =>
    getCollapseStateByKey(
      state,
      `${ViewModes.EDIT}.${formName}.others.${tenant.id}`,
    ),
  );
  const contactMethods = useSelector(getContactMethods);
  const errors = useSelector((state) => getErrorsByFormName(state, formName));
  const isSaveClicked = useSelector(getIsSaveClicked);
  const usersPermissions = useSelector(getUsersPermissions);
  const tenantId = tenant?.id;

  const getOtherTenantById = (id: number) => {
    const tenantContactSet =
      contactType === TenantContactType.BILLING
        ? get(tenant, "billing_persons", [])
        : get(tenant, "contact_persons", []);
    return id ? tenantContactSet.find((tenant) => tenant.id === id) : null;
  };

  const handleAddClick = () => {
    dispatch(initializeContactForm({}));
    dispatch(
      receiveContactModalSettings({
        field: `${field}.contact`,
        contactId: null,
        isNew: true,
      }),
    );
    dispatch(receiveIsSaveClicked(false));
    dispatch(showContactModal());
  };

  const handleEditClick = () => {
    dispatch(initializeContactForm({ ...contact }));
    dispatch(
      receiveContactModalSettings({
        field: `${field}.contact`,
        contactId: null,
        isNew: false,
      }),
    );
    dispatch(receiveIsSaveClicked(false));
    dispatch(showContactModal());
  };

  const handleCollapseToggle = (val: boolean) => {
    if (!tenantId) return;
    dispatch(
      receiveCollapseStates({
        [ViewModes.EDIT]: {
          [formName]: {
            others: {
              [tenantId]: val,
            },
          },
        },
      }),
    );
  };

  const savedTenant = getOtherTenantById(tenantId),
    active = isActive(savedTenant),
    archived = isArchived(savedTenant),
    tenantErrors = get(errors, field);
  return (
    <Collapse
      archived={archived}
      className={classNames("collapse__secondary")}
      defaultOpen={collapseState !== undefined ? collapseState : active}
      hasErrors={isSaveClicked && !isEmpty(tenantErrors)}
      headerSubtitles={
        <Fragment>
          <Column></Column>
          <Column>
            {savedTenant && (
              <Authorization
                allow={
                  isFieldAllowedToRead(
                    attributes,
                    LeaseTenantContactSetFieldPaths.END_DATE,
                  ) &&
                  isFieldAllowedToRead(
                    attributes,
                    LeaseTenantContactSetFieldPaths.START_DATE,
                  )
                }
              >
                <CollapseHeaderSubtitle>
                  <span>Välillä:</span>
                  {formatDateRange(
                    savedTenant.start_date,
                    savedTenant.end_date,
                  ) || "-"}
                </CollapseHeaderSubtitle>
              </Authorization>
            )}
          </Column>
        </Fragment>
      }
      headerTitle={
        <Authorization
          allow={isFieldAllowedToRead(
            attributes,
            LeaseTenantContactSetFieldPaths.TYPE,
          )}
        >
          <span>
            {contactType === TenantContactType.BILLING
              ? "Laskunsaaja"
              : "Yhteyshenkilö"}
          </span>
        </Authorization>
      }
      onRemove={
        hasPermissions(usersPermissions, UsersPermissions.DELETE_TENANTCONTACT)
          ? onRemove
          : null
      }
      onToggle={handleCollapseToggle}
    >
      <BoxContentWrapper>
        <FormWrapper>
          <FormWrapperLeft>
            <Row>
              <Column small={12}>
                <Row>
                  <Column small={9} medium={8}>
                    <Authorization
                      allow={isFieldAllowedToRead(
                        attributes,
                        LeaseTenantContactSetFieldPaths.CONTACT,
                      )}
                    >
                      <FormField
                        disableTouched={isSaveClicked}
                        fieldAttributes={get(
                          attributes,
                          LeaseTenantContactSetFieldPaths.CONTACT,
                        )}
                        name={`${field}.contact`}
                        overrideValues={{
                          fieldType: FieldTypes.CONTACT,
                          label: LeaseTenantContactSetFieldTitles.CONTACT,
                        }}
                        serviceUnit={serviceUnit}
                        enableUiDataEdit
                        uiDataKey={getUiDataLeaseKey(
                          LeaseTenantContactSetFieldPaths.CONTACT,
                        )}
                      />
                    </Authorization>
                  </Column>
                  <Column small={3} medium={4}>
                    <Authorization
                      allow={isMethodAllowed(contactMethods, Methods.POST)}
                    >
                      <div className="contact-buttons-wrapper">
                        <AddButtonThird
                          label="Luo asiakas"
                          onClick={handleAddClick}
                        />
                      </div>
                    </Authorization>
                  </Column>
                </Row>
              </Column>
            </Row>
          </FormWrapperLeft>

          <FormWrapperRight>
            <Row>
              <Column small={6} medium={3} large={2}>
                <Authorization
                  allow={isFieldAllowedToRead(
                    attributes,
                    LeaseTenantContactSetFieldPaths.START_DATE,
                  )}
                >
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(
                      attributes,
                      LeaseTenantContactSetFieldPaths.START_DATE,
                    )}
                    name={`${field}.start_date`}
                    overrideValues={{
                      label: LeaseTenantContactSetFieldTitles.START_DATE,
                    }}
                    enableUiDataEdit
                    uiDataKey={getUiDataLeaseKey(
                      LeaseTenantContactSetFieldPaths.START_DATE,
                    )}
                  />
                </Authorization>
              </Column>
              <Column small={6} medium={3} large={2}>
                <Authorization
                  allow={isFieldAllowedToRead(
                    attributes,
                    LeaseTenantContactSetFieldPaths.END_DATE,
                  )}
                >
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(
                      attributes,
                      LeaseTenantContactSetFieldPaths.END_DATE,
                    )}
                    name={`${field}.end_date`}
                    overrideValues={{
                      label: LeaseTenantContactSetFieldTitles.END_DATE,
                    }}
                    enableUiDataEdit
                    uiDataKey={getUiDataLeaseKey(
                      LeaseTenantContactSetFieldPaths.END_DATE,
                    )}
                  />
                </Authorization>
              </Column>
            </Row>
          </FormWrapperRight>
        </FormWrapper>

        <Authorization
          allow={isFieldAllowedToRead(
            attributes,
            LeaseTenantContactSetFieldPaths.CONTACT,
          )}
        >
          <>
            {!!contact && (
              <SubTitle>
                Asiakkaan tiedot
                <Authorization
                  allow={isMethodAllowed(contactMethods, Methods.PATCH)}
                >
                  <EditButton
                    className="inline-button"
                    onClick={handleEditClick}
                    title="Muokkaa asiakasta"
                  />
                </Authorization>
              </SubTitle>
            )}
            <ContactTemplate contact={contact} />
          </>
        </Authorization>
      </BoxContentWrapper>
    </Collapse>
  );
};

const formName = FormNames.LEASE_TENANTS;
export default OtherTenantItemEdit;
