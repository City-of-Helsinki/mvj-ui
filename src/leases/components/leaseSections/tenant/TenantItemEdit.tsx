import React, { Fragment, ReactElement } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FieldArray } from "react-final-form-arrays";
import { Row, Column } from "react-foundation";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { ActionTypes, AppConsumer } from "@/app/AppContext";
import AddButtonSecondary from "@/components/form/AddButtonSecondary";
import AddButtonThird from "@/components/form/AddButtonThird";
import Authorization from "@/components/authorization/Authorization";
import BoxContentWrapper from "@/components/content/BoxContentWrapper";
import Collapse from "@/components/collapse/Collapse";
import CollapseHeaderSubtitle from "@/components/collapse/CollapseHeaderSubtitle";
import ContactTemplate from "@/contacts/components/templates/ContactTemplate";
import EditButton from "@/components/form/EditButton";
import FieldAndRemoveButtonWrapper from "@/components/form/FieldAndRemoveButtonWrapper";
import FormField from "@/components/form/final-form/FormField";
import FormText from "@/components/form/FormText";
import FormTextTitle from "@/components/form/FormTextTitle";
import FormWrapper from "@/components/form/FormWrapper";
import FormWrapperLeft from "@/components/form/FormWrapperLeft";
import FormWrapperRight from "@/components/form/FormWrapperRight";
import OtherTenantItemEdit from "./OtherTenantItemEdit";
import RemoveButton from "@/components/form/RemoveButton";
import SubTitle from "@/components/content/SubTitle";
import {
  initializeContactForm,
  receiveContactModalSettings,
  receiveIsSaveClicked,
  showContactModal,
} from "@/contacts/actions";
import { receiveCollapseStates } from "@/leases/actions";
import { ButtonColors } from "@/components/enums";
import {
  ConfirmationModalTexts,
  FieldTypes,
  FormNames,
  Methods,
  ViewModes,
} from "@/enums";
import {
  LeaseTenantContactSetFieldPaths,
  LeaseTenantContactSetFieldTitles,
  LeaseTenantRentSharesFieldPaths,
  LeaseTenantRentSharesFieldTitles,
  LeaseTenantsFieldPaths,
  LeaseTenantsFieldTitles,
  TenantContactType,
} from "@/leases/enums";
import { UsersPermissions } from "@/usersPermissions/enums";
import { getContactFullName } from "@/contacts/helpers";
import { getUiDataLeaseKey } from "@/uiData/helpers";
import {
  formatDateRange,
  getFieldAttributes,
  hasPermissions,
  isActive,
  isArchived,
  isFieldAllowedToEdit,
  isFieldAllowedToRead,
  isFieldRequired,
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
import type { Attributes, Methods as MethodsType } from "types";
import type {
  UsersPermissions as UsersPermissionsType,
  UserServiceUnit,
} from "@/usersPermissions/types";
import type { Contact } from "@/contacts/types";

type RentSharesProps = {
  archived: boolean;
  attributes: Attributes;
  fields: any;
  isSaveClicked: boolean;
  usersPermissions: UsersPermissionsType;
};

const renderRentShares = ({
  archived,
  attributes,
  fields,
  isSaveClicked,
  usersPermissions,
}: RentSharesProps): ReactElement => {
  const handleAdd = () => {
    fields.push({});
  };

  return (
    <AppConsumer>
      {({ dispatch }) => {
        return (
          <Fragment>
            <SubTitle>{LeaseTenantRentSharesFieldTitles.RENT_SHARES}</SubTitle>

            {fields && !!fields.length && (
              <Fragment>
                <Row>
                  <Column small={6} large={4}>
                    <Authorization
                      allow={isFieldAllowedToRead(
                        attributes,
                        LeaseTenantRentSharesFieldPaths.INTENDED_USE,
                      )}
                    >
                      <FormTextTitle
                        required={isFieldRequired(
                          attributes,
                          LeaseTenantRentSharesFieldPaths.INTENDED_USE,
                        )}
                      >
                        {LeaseTenantRentSharesFieldTitles.INTENDED_USE}
                      </FormTextTitle>
                    </Authorization>
                  </Column>
                  <Column small={6} large={4}>
                    <Authorization
                      allow={
                        isFieldAllowedToRead(
                          attributes,
                          LeaseTenantRentSharesFieldPaths.SHARE_DENOMINATOR,
                        ) ||
                        isFieldAllowedToRead(
                          attributes,
                          LeaseTenantRentSharesFieldPaths.SHARE_NUMERATOR,
                        )
                      }
                    >
                      <FormTextTitle
                        required={
                          isFieldRequired(
                            attributes,
                            LeaseTenantRentSharesFieldPaths.SHARE_DENOMINATOR,
                          ) ||
                          isFieldRequired(
                            attributes,
                            LeaseTenantRentSharesFieldPaths.SHARE_NUMERATOR,
                          )
                        }
                      >
                        {LeaseTenantRentSharesFieldTitles.SHARE_FRACTION}
                      </FormTextTitle>
                    </Authorization>
                  </Column>
                </Row>
                {fields.map((field, index) => {
                  const handleRemove = () => {
                    dispatch({
                      type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                      confirmationFunction: () => {
                        fields.remove(index);
                      },
                      confirmationModalButtonClassName: ButtonColors.ALERT,
                      confirmationModalButtonText:
                        ConfirmationModalTexts.DELETE_RENT_SHARE.BUTTON,
                      confirmationModalLabel:
                        ConfirmationModalTexts.DELETE_RENT_SHARE.LABEL,
                      confirmationModalTitle:
                        ConfirmationModalTexts.DELETE_RENT_SHARE.TITLE,
                    });
                  };

                  return (
                    <Row key={index}>
                      <Column small={6} medium={4}>
                        <Authorization
                          allow={isFieldAllowedToRead(
                            attributes,
                            LeaseTenantRentSharesFieldPaths.INTENDED_USE,
                          )}
                        >
                          <FormField
                            disableTouched={isSaveClicked}
                            fieldAttributes={getFieldAttributes(
                              attributes,
                              LeaseTenantRentSharesFieldPaths.INTENDED_USE,
                            )}
                            name={`${field}.intended_use`}
                            invisibleLabel
                            overrideValues={{
                              label:
                                LeaseTenantRentSharesFieldTitles.INTENDED_USE,
                            }}
                            enableUiDataEdit
                            uiDataKey={getUiDataLeaseKey(
                              LeaseTenantRentSharesFieldPaths.INTENDED_USE,
                            )}
                          />
                        </Authorization>
                      </Column>
                      <Column small={6} medium={4}>
                        <FieldAndRemoveButtonWrapper
                          field={
                            <Row>
                              <Column small={6}>
                                <Authorization
                                  allow={isFieldAllowedToRead(
                                    attributes,
                                    LeaseTenantRentSharesFieldPaths.SHARE_NUMERATOR,
                                  )}
                                >
                                  <FormField
                                    disableTouched={isSaveClicked}
                                    fieldAttributes={getFieldAttributes(
                                      attributes,
                                      LeaseTenantsFieldPaths.SHARE_NUMERATOR,
                                    )}
                                    name={`${field}.share_numerator`}
                                    invisibleLabel
                                    overrideValues={{
                                      label:
                                        LeaseTenantRentSharesFieldTitles.SHARE_NUMERATOR,
                                    }}
                                    enableUiDataEdit
                                    uiDataKey={getUiDataLeaseKey(
                                      LeaseTenantRentSharesFieldPaths.SHARE_NUMERATOR,
                                    )}
                                  />
                                </Authorization>
                              </Column>
                              <Column small={6}>
                                <Authorization
                                  allow={isFieldAllowedToRead(
                                    attributes,
                                    LeaseTenantRentSharesFieldPaths.SHARE_NUMERATOR,
                                  )}
                                >
                                  <FormField
                                    disableTouched={isSaveClicked}
                                    fieldAttributes={getFieldAttributes(
                                      attributes,
                                      LeaseTenantsFieldPaths.SHARE_DENOMINATOR,
                                    )}
                                    name={`${field}.share_denominator`}
                                    className="with-slash"
                                    invisibleLabel
                                    overrideValues={{
                                      label:
                                        LeaseTenantRentSharesFieldTitles.SHARE_DENOMINATOR,
                                    }}
                                    enableUiDataEdit
                                    uiDataKey={getUiDataLeaseKey(
                                      LeaseTenantRentSharesFieldPaths.SHARE_DENOMINATOR,
                                    )}
                                  />
                                </Authorization>
                              </Column>
                            </Row>
                          }
                          removeButton={
                            <Authorization
                              allow={hasPermissions(
                                usersPermissions,
                                UsersPermissions.DELETE_TENANTRENTSHARE,
                              )}
                            >
                              <RemoveButton
                                className="third-level"
                                onClick={handleRemove}
                                title="Poista laskutusosuus"
                              />
                            </Authorization>
                          }
                        />
                      </Column>
                    </Row>
                  );
                })}
              </Fragment>
            )}
            {!archived && (
              <Authorization
                allow={hasPermissions(
                  usersPermissions,
                  UsersPermissions.ADD_TENANTRENTSHARE,
                )}
              >
                <Row>
                  <Column>
                    <AddButtonThird
                      label="Lisää laskutusosuus"
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

type OtherTenantsProps = {
  contactType: (typeof TenantContactType)["BILLING" | "CONTACT"];
  fields: any;
  serviceUnit: UserServiceUnit;
  showAddButton: boolean;
  tenant: Record<string, any | { contact?: Contact }>;
  usersPermissions: UsersPermissionsType;
  fieldName: string;
};

const renderOtherTenants = ({
  contactType,
  fields,
  serviceUnit,
  showAddButton,
  tenant,
  usersPermissions,
  fieldName,
}: OtherTenantsProps): ReactElement => {
  const handleAdd = () => {
    fields.push({});
  };

  return (
    <AppConsumer>
      {({ dispatch }) => {
        return (
          <Fragment>
            {fields &&
              !!fields.length &&
              fields.map((field, index) => {
                const handleRemove = () => {
                  dispatch({
                    type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                    confirmationFunction: () => {
                      fields.remove(index);
                    },
                    confirmationModalButtonClassName: ButtonColors.ALERT,
                    confirmationModalButtonText:
                      ConfirmationModalTexts.DELETE_OTHER_TENANT.BUTTON,
                    confirmationModalLabel:
                      ConfirmationModalTexts.DELETE_OTHER_TENANT.LABEL,
                    confirmationModalTitle:
                      ConfirmationModalTexts.DELETE_OTHER_TENANT.TITLE,
                  });
                };

                const contact = tenant?.[fieldName]?.[index]?.contact;
                return (
                  <OtherTenantItemEdit
                    key={index}
                    contact={contact}
                    contactType={contactType}
                    field={field}
                    onRemove={handleRemove}
                    serviceUnit={serviceUnit}
                    tenant={tenant}
                  />
                );
              })}
            {showAddButton && (
              <Authorization
                allow={hasPermissions(
                  usersPermissions,
                  UsersPermissions.ADD_TENANTCONTACT,
                )}
              >
                <Row>
                  <Column>
                    <AddButtonSecondary
                      className="no-top-margin"
                      label={
                        contactType === TenantContactType.BILLING
                          ? "Lisää laskunsaaja"
                          : "Lisää yhteyshenkilö"
                      }
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
  field: string;
  onRemove: (...args: Array<any>) => any;
  serviceUnit: UserServiceUnit;
  tenants: Array<Record<string, any>>;
  tenantId?: number;
  contact?: Contact;
  shareNumerator?: string | number;
  shareDenominator?: string | number;
};

const TenantItemEdit: React.FC<Props> = ({
  field,
  onRemove,
  serviceUnit,
  tenants,
  tenantId,
  contact,
  shareNumerator,
  shareDenominator,
}) => {
  const dispatch = useDispatch();
  const attributes = useSelector(getAttributes);
  const collapseState = useSelector((state) =>
    getCollapseStateByKey(
      state,
      `${ViewModes.EDIT}.${formName}.tenants.${tenantId}`,
    ),
  );
  const contactMethods = useSelector(getContactMethods);
  const errors = useSelector((state) => getErrorsByFormName(state, formName));
  const isSaveClicked = useSelector(getIsSaveClicked);
  const usersPermissions = useSelector(getUsersPermissions);
  const getTenantById = (id: number) => {
    return id ? tenants.find((tenant) => tenant.id === id) : {};
  };

  const handleAddClick = () => {
    dispatch(initializeContactForm({}));
    dispatch(
      receiveContactModalSettings({
        field: `${field}.tenant.contact`,
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
        field: `${field}.tenant.contact`,
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
            tenants: {
              [tenantId]: val,
            },
          },
        },
      }),
    );
  };

  const savedTenant = getTenantById(tenantId);
  const active = isActive(savedTenant && savedTenant.tenant);
  const archived = isArchived(savedTenant && savedTenant.tenant);
  const tenantErrors = get(errors, field);
  return (
    <Collapse
      archived={archived}
      defaultOpen={collapseState !== undefined ? collapseState : active}
      hasErrors={isSaveClicked && !isEmpty(tenantErrors)}
      headerSubtitles={
        savedTenant && (
          <Fragment>
            <Column>
              <Authorization
                allow={
                  isFieldAllowedToRead(
                    attributes,
                    LeaseTenantsFieldPaths.SHARE_DENOMINATOR,
                  ) &&
                  isFieldAllowedToRead(
                    attributes,
                    LeaseTenantsFieldPaths.SHARE_NUMERATOR,
                  )
                }
              >
                <CollapseHeaderSubtitle>
                  <span>{LeaseTenantsFieldTitles.SHARE_FRACTION}:</span>
                  {savedTenant.share_numerator || ""} /{" "}
                  {savedTenant.share_denominator || ""}
                </CollapseHeaderSubtitle>
              </Authorization>
            </Column>
            <Column>
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
                    get(savedTenant, "tenant.start_date"),
                    get(savedTenant, "tenant.end_date"),
                  ) || "-"}
                </CollapseHeaderSubtitle>
              </Authorization>
            </Column>
          </Fragment>
        )
      }
      headerTitle={
        <Authorization
          allow={isFieldAllowedToRead(
            attributes,
            LeaseTenantContactSetFieldPaths.CONTACT,
          )}
        >
          <span>
            {getContactFullName(get(savedTenant, "tenant.contact")) || "-"}
          </span>
        </Authorization>
      }
      onRemove={
        hasPermissions(usersPermissions, UsersPermissions.DELETE_TENANT)
          ? onRemove
          : null
      }
      onToggle={handleCollapseToggle}
    >
      <BoxContentWrapper>
        <FormWrapper>
          <FormWrapperLeft>
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
                    fieldAttributes={getFieldAttributes(
                      attributes,
                      LeaseTenantContactSetFieldPaths.CONTACT,
                    )}
                    name={`${field}.tenant.contact`}
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

            <Row>
              <Column>
                <Authorization
                  allow={isFieldAllowedToRead(
                    attributes,
                    LeaseTenantsFieldPaths.REFERENCE,
                  )}
                >
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={getFieldAttributes(
                      attributes,
                      LeaseTenantsFieldPaths.REFERENCE,
                    )}
                    name={`${field}.reference`}
                    overrideValues={{
                      label: LeaseTenantsFieldTitles.REFERENCE,
                    }}
                    enableUiDataEdit
                    uiDataKey={getUiDataLeaseKey(
                      LeaseTenantsFieldPaths.REFERENCE,
                    )}
                  />
                </Authorization>
              </Column>
            </Row>
          </FormWrapperLeft>
          <FormWrapperRight>
            <Row>
              <Column small={12} medium={6} large={4}>
                <Authorization
                  allow={
                    isFieldAllowedToRead(
                      attributes,
                      LeaseTenantsFieldPaths.SHARE_DENOMINATOR,
                    ) &&
                    isFieldAllowedToRead(
                      attributes,
                      LeaseTenantsFieldPaths.SHARE_NUMERATOR,
                    )
                  }
                >
                  <>
                    <FormTextTitle
                      required={
                        isFieldRequired(
                          attributes,
                          LeaseTenantsFieldPaths.SHARE_NUMERATOR,
                        ) ||
                        isFieldRequired(
                          attributes,
                          LeaseTenantsFieldPaths.SHARE_DENOMINATOR,
                        )
                      }
                      enableUiDataEdit
                      uiDataKey={getUiDataLeaseKey(
                        LeaseTenantsFieldPaths.SHARE_FRACTION,
                      )}
                    >
                      {LeaseTenantsFieldTitles.SHARE_FRACTION}
                    </FormTextTitle>
                    <Authorization
                      allow={
                        isFieldAllowedToEdit(
                          attributes,
                          LeaseTenantsFieldPaths.SHARE_NUMERATOR,
                        ) ||
                        isFieldAllowedToEdit(
                          attributes,
                          LeaseTenantsFieldPaths.SHARE_DENOMINATOR,
                        )
                      }
                      errorComponent={
                        <FormText>
                          {shareNumerator || ""} / {shareDenominator || ""}
                        </FormText>
                      }
                    >
                      <Row>
                        <Column small={6}>
                          <Authorization
                            allow={isFieldAllowedToRead(
                              attributes,
                              LeaseTenantsFieldPaths.SHARE_NUMERATOR,
                            )}
                          >
                            <FormField
                              disableTouched={isSaveClicked}
                              fieldAttributes={getFieldAttributes(
                                attributes,
                                LeaseTenantsFieldPaths.SHARE_NUMERATOR,
                              )}
                              invisibleLabel
                              name={`${field}.share_numerator`}
                              overrideValues={{
                                label: LeaseTenantsFieldTitles.SHARE_NUMERATOR,
                              }}
                            />
                          </Authorization>
                        </Column>
                        <Column small={6}>
                          <Authorization
                            allow={isFieldAllowedToRead(
                              attributes,
                              LeaseTenantsFieldPaths.SHARE_DENOMINATOR,
                            )}
                          >
                            <FormField
                              disableTouched={isSaveClicked}
                              className="with-slash"
                              fieldAttributes={getFieldAttributes(
                                attributes,
                                LeaseTenantsFieldPaths.SHARE_DENOMINATOR,
                              )}
                              invisibleLabel
                              name={`${field}.share_denominator`}
                              overrideValues={{
                                label:
                                  LeaseTenantsFieldTitles.SHARE_DENOMINATOR,
                              }}
                            />
                          </Authorization>
                        </Column>
                      </Row>
                    </Authorization>
                  </>
                </Authorization>
              </Column>
              <Column small={6} medium={3} large={2}>
                <Authorization
                  allow={isFieldAllowedToRead(
                    attributes,
                    LeaseTenantContactSetFieldPaths.START_DATE,
                  )}
                >
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={getFieldAttributes(
                      attributes,
                      LeaseTenantContactSetFieldPaths.START_DATE,
                    )}
                    name={`${field}.tenant.start_date`}
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
                    fieldAttributes={getFieldAttributes(
                      attributes,
                      LeaseTenantContactSetFieldPaths.END_DATE,
                    )}
                    name={`${field}.tenant.end_date`}
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

            <Row>
              <Column small={12}>
                <Authorization
                  allow={isFieldAllowedToRead(
                    attributes,
                    LeaseTenantRentSharesFieldPaths.RENT_SHARES,
                  )}
                >
                  <FieldArray name={`${field}.rent_shares`}>
                    {(fieldArrayProps) =>
                      renderRentShares({
                        ...fieldArrayProps,
                        archived: archived,
                        attributes,
                        isSaveClicked: isSaveClicked,
                        usersPermissions: usersPermissions,
                      })
                    }
                  </FieldArray>
                </Authorization>
              </Column>
            </Row>
          </FormWrapperRight>
        </FormWrapper>
      </BoxContentWrapper>

      <Authorization
        allow={isFieldAllowedToRead(
          attributes,
          LeaseTenantContactSetFieldPaths.TENANTCONTACT_SET,
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
          <FieldArray name={`${field}.billing_persons`}>
            {(fieldArrayProps) =>
              renderOtherTenants({
                ...fieldArrayProps,
                contactType: TenantContactType.BILLING,
                serviceUnit: serviceUnit,
                showAddButton: !archived,
                tenant: savedTenant,
                usersPermissions: usersPermissions,
                fieldName: "billing_persons",
              })
            }
          </FieldArray>

          <FieldArray name={`${field}.contact_persons`}>
            {(fieldArrayProps) =>
              renderOtherTenants({
                ...fieldArrayProps,
                contactType: TenantContactType.CONTACT,
                serviceUnit: serviceUnit,
                showAddButton: !archived,
                tenant: savedTenant,
                usersPermissions: usersPermissions,
                fieldName: "contact_persons",
              })
            }
          </FieldArray>
        </>
      </Authorization>
    </Collapse>
  );
};

const formName = FormNames.LEASE_TENANTS;
export default TenantItemEdit;
