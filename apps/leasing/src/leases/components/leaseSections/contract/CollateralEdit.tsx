import React from "react";
import { FieldArray } from "react-final-form-arrays";
import { Row, Column } from "@/components/grid/Grid";
import { useAppSelector } from "@/root/hooks";
import { ActionTypes, ModalConsumer } from "@/app/ModalContext";
import ActionButtonWrapper from "@/components/form/ActionButtonWrapper";
import AddButtonThird from "@/components/form/AddButtonThird";
import Authorization from "@/components/authorization/Authorization";
import BoxContentWrapper from "@/components/content/BoxContentWrapper";
import BoxItem from "@/components/content/BoxItem";
import { ButtonColors } from "@/components/enums";
import FieldAndRemoveButtonWrapper from "@/components/form/FieldAndRemoveButtonWrapper";
import FormField from "@/components/form/final-form/FormField";
import RemoveButton from "@/components/form/RemoveButton";
import {
  CollateralTypes,
  LeaseContractCollateralsFieldPaths,
  LeaseContractCollateralsFieldTitles,
} from "@/leases/enums";
import { ConfirmationModalTexts } from "@/enums";
import { UsersPermissions } from "@/usersPermissions/enums";
import { getUiDataLeaseKey } from "@/uiData/helpers";
import {
  getFieldAttributes,
  hasPermissions,
  isFieldAllowedToRead,
} from "@/util/helpers";
import { getAttributes, getIsSaveClicked } from "@/leases/selectors";
import { getUsersPermissions } from "@/usersPermissions/selectors";
import type { Attributes } from "types";
import type { UsersPermissions as UsersPermissionsType } from "@/usersPermissions/types";
import {
  CollateralTypeField,
  TotalAmountField,
  ReturnedDateFields,
  NoteField,
  ThirdPartyPledgeFields,
  ContractPartyField,
  AccountNumberField,
  StartDateField,
  EndDateField,
  DocumentTypeField,
  PledgorFields,
} from "@/leases/components/leaseSections/contract/CollateralEditFields";
import FormTextTitle from "@/components/form/FormTextTitle";

type PropertyIdentifiersProps = {
  attributes: Attributes;
  fields: any;
  isSaveClicked: boolean;
};

const PropertyIdentifiers = ({
  attributes,
  fields,
  isSaveClicked,
}: PropertyIdentifiersProps) => {
  const handleAdd = () => fields.push({});

  return (
    <ModalConsumer>
      {({ modalDispatch }) => (
        <>
          {fields && !!fields.length && (
            <Row>
              <Column small={6}>
                <Authorization
                  allow={isFieldAllowedToRead(
                    attributes,
                    LeaseContractCollateralsFieldPaths.PROPERTY_IDENTIFIER,
                  )}
                >
                  <FormTextTitle>
                    {LeaseContractCollateralsFieldTitles.PROPERTY_IDENTIFIER}
                  </FormTextTitle>
                </Authorization>
              </Column>
              <Column small={6}>
                <Authorization
                  allow={isFieldAllowedToRead(
                    attributes,
                    LeaseContractCollateralsFieldPaths.INSTITUTION_IDENTIFIER,
                  )}
                >
                  <FormTextTitle>
                    {LeaseContractCollateralsFieldTitles.INSTITUTION_IDENTIFIER}
                  </FormTextTitle>
                </Authorization>
              </Column>
            </Row>
          )}
          {fields &&
            !!fields.length &&
            fields.map((field, index) => {
              const handleRemove = () => {
                modalDispatch({
                  type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                  confirmationFunction: () => fields.remove(index),
                  confirmationModalButtonClassName: ButtonColors.ALERT,
                  confirmationModalButtonText:
                    ConfirmationModalTexts.DELETE_PROPERTY_IDENTIFIER.BUTTON,
                  confirmationModalLabel:
                    ConfirmationModalTexts.DELETE_PROPERTY_IDENTIFIER.LABEL,
                  confirmationModalTitle:
                    ConfirmationModalTexts.DELETE_PROPERTY_IDENTIFIER.TITLE,
                });
              };

              return (
                <Row key={index}>
                  <Column small={6}>
                    <Authorization
                      allow={isFieldAllowedToRead(
                        attributes,
                        LeaseContractCollateralsFieldPaths.PROPERTY_IDENTIFIER,
                      )}
                    >
                      <FormField
                        disableTouched={isSaveClicked}
                        fieldAttributes={getFieldAttributes(
                          attributes,
                          LeaseContractCollateralsFieldPaths.PROPERTY_IDENTIFIER,
                        )}
                        name={`${field}.property_identifier`}
                        invisibleLabel
                        overrideValues={{
                          label:
                            LeaseContractCollateralsFieldTitles.PROPERTY_IDENTIFIER,
                        }}
                        enableUiDataEdit
                        uiDataKey={getUiDataLeaseKey(
                          LeaseContractCollateralsFieldPaths.PROPERTY_IDENTIFIER,
                        )}
                      />
                    </Authorization>
                  </Column>
                  <Column small={6}>
                    <FieldAndRemoveButtonWrapper
                      field={
                        <Authorization
                          allow={isFieldAllowedToRead(
                            attributes,
                            LeaseContractCollateralsFieldPaths.INSTITUTION_IDENTIFIER,
                          )}
                        >
                          <FormField
                            disableTouched={isSaveClicked}
                            fieldAttributes={getFieldAttributes(
                              attributes,
                              LeaseContractCollateralsFieldPaths.INSTITUTION_IDENTIFIER,
                            )}
                            name={`${field}.institution_identifier`}
                            invisibleLabel
                            overrideValues={{
                              label:
                                LeaseContractCollateralsFieldTitles.INSTITUTION_IDENTIFIER,
                            }}
                            enableUiDataEdit
                            uiDataKey={getUiDataLeaseKey(
                              LeaseContractCollateralsFieldPaths.INSTITUTION_IDENTIFIER,
                            )}
                          />
                        </Authorization>
                      }
                      removeButton={
                        <RemoveButton
                          className="third-level"
                          onClick={handleRemove}
                          title="Poista kiinteistötunnus"
                        />
                      }
                    />
                  </Column>
                </Row>
              );
            })}
          <Row>
            <Column>
              <AddButtonThird
                label="Lisää kiinteistötunnus"
                onClick={handleAdd}
              />
            </Column>
          </Row>
        </>
      )}
    </ModalConsumer>
  );
};

export type CollateralEditFieldProps = {
  attributes: Attributes;
  field: string;
  isSaveClicked: boolean;
  required?: boolean;
};

const CollateralEmpty = (collateralFieldProps: CollateralEditFieldProps) => {
  return (
    <>
      <Row>
        <Column small={6} medium={4} large={2}>
          <CollateralTypeField {...collateralFieldProps} />
        </Column>
      </Row>
    </>
  );
};

// Rahavakuus
const CollateralFinancialGuarantee = (
  collateralFieldProps: CollateralEditFieldProps,
) => {
  const { attributes, field, isSaveClicked } = collateralFieldProps;
  return (
    <>
      <Row>
        <Column small={6} medium={4} large={2}>
          <CollateralTypeField {...collateralFieldProps} />
        </Column>
        <Column small={6} medium={4} large={2}>
          <TotalAmountField {...collateralFieldProps} />
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={isFieldAllowedToRead(
              attributes,
              LeaseContractCollateralsFieldPaths.PAID_DATE,
            )}
          >
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={getFieldAttributes(
                attributes,
                LeaseContractCollateralsFieldPaths.PAID_DATE,
              )}
              name={`${field}.paid_date`}
              overrideValues={{
                label: LeaseContractCollateralsFieldTitles.PAID_DATE,
                required: true,
              }}
              enableUiDataEdit
              uiDataKey={getUiDataLeaseKey(
                LeaseContractCollateralsFieldPaths.PAID_DATE,
              )}
            />
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <AccountNumberField {...collateralFieldProps} />
        </Column>
        <ReturnedDateFields {...collateralFieldProps} />
      </Row>
      <Row>
        <PledgorFields {...collateralFieldProps} />
        <ThirdPartyPledgeFields {...collateralFieldProps} />
      </Row>
      <Row>
        <Column small={12} large={4}>
          <ContractPartyField {...collateralFieldProps} />
        </Column>
        <Column small={12} large={8}>
          <NoteField {...collateralFieldProps} />
        </Column>
      </Row>
    </>
  );
};

//Panttikirja
const CollateralMortgageDocument = (
  collateralFieldProps: CollateralEditFieldProps,
) => {
  const { attributes, field, isSaveClicked } = collateralFieldProps;
  return (
    <>
      <Row>
        <Column small={6} medium={4} large={2}>
          <CollateralTypeField {...collateralFieldProps} />
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={isFieldAllowedToRead(
              attributes,
              LeaseContractCollateralsFieldPaths.NUMBER_MORTGAGE_DOCUMENT,
            )}
          >
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={getFieldAttributes(
                attributes,
                LeaseContractCollateralsFieldPaths.NUMBER_MORTGAGE_DOCUMENT,
              )}
              name={`${field}.number_mortgage_document`}
              overrideValues={{
                label:
                  LeaseContractCollateralsFieldTitles.NUMBER_MORTGAGE_DOCUMENT,
                required: true,
              }}
              enableUiDataEdit
              uiDataKey={getUiDataLeaseKey(
                LeaseContractCollateralsFieldPaths.NUMBER_MORTGAGE_DOCUMENT,
              )}
            />
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={isFieldAllowedToRead(
              attributes,
              LeaseContractCollateralsFieldPaths.DEED_DATE,
            )}
          >
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={getFieldAttributes(
                attributes,
                LeaseContractCollateralsFieldPaths.DEED_DATE,
              )}
              name={`${field}.deed_date`}
              overrideValues={{
                label: LeaseContractCollateralsFieldTitles.DEED_DATE,
                required: true,
              }}
              enableUiDataEdit
              uiDataKey={getUiDataLeaseKey(
                LeaseContractCollateralsFieldPaths.DEED_DATE,
              )}
            />
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <StartDateField {...collateralFieldProps} />
        </Column>
        <Column small={6} medium={4} large={2}>
          <EndDateField {...collateralFieldProps} />
        </Column>
        <Column small={6} medium={4} large={2}>
          <TotalAmountField {...collateralFieldProps} />
        </Column>
      </Row>
      <Row>
        <Column small={6} medium={4} large={2}>
          <DocumentTypeField {...collateralFieldProps} />
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={isFieldAllowedToRead(
              attributes,
              LeaseContractCollateralsFieldPaths.SUBORDINATE_PLEDGE,
            )}
          >
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={getFieldAttributes(
                attributes,
                LeaseContractCollateralsFieldPaths.SUBORDINATE_PLEDGE,
              )}
              name={`${field}.subordinate_pledge`}
              overrideValues={{
                label: LeaseContractCollateralsFieldTitles.SUBORDINATE_PLEDGE,
              }}
              enableUiDataEdit
              uiDataKey={getUiDataLeaseKey(
                LeaseContractCollateralsFieldPaths.SUBORDINATE_PLEDGE,
              )}
            />
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={isFieldAllowedToRead(
              attributes,
              LeaseContractCollateralsFieldPaths.SUBORDINATE_PLEDGEE_NAME,
            )}
          >
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={getFieldAttributes(
                attributes,
                LeaseContractCollateralsFieldPaths.SUBORDINATE_PLEDGEE_NAME,
              )}
              name={`${field}.subordinate_pledgee_name`}
              overrideValues={{
                label:
                  LeaseContractCollateralsFieldTitles.SUBORDINATE_PLEDGEE_NAME,
              }}
              enableUiDataEdit
              uiDataKey={getUiDataLeaseKey(
                LeaseContractCollateralsFieldPaths.SUBORDINATE_PLEDGEE_NAME,
              )}
            />
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={isFieldAllowedToRead(
              attributes,
              LeaseContractCollateralsFieldPaths.SUBORDINATE_PLEDGEE_BUSINESS_ID,
            )}
          >
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={getFieldAttributes(
                attributes,
                LeaseContractCollateralsFieldPaths.SUBORDINATE_PLEDGEE_BUSINESS_ID,
              )}
              name={`${field}.subordinate_pledgee_business_id`}
              overrideValues={{
                label:
                  LeaseContractCollateralsFieldTitles.SUBORDINATE_PLEDGEE_BUSINESS_ID,
              }}
              enableUiDataEdit
              uiDataKey={getUiDataLeaseKey(
                LeaseContractCollateralsFieldPaths.SUBORDINATE_PLEDGEE_BUSINESS_ID,
              )}
            />
          </Authorization>
        </Column>
        <ReturnedDateFields {...collateralFieldProps} />
      </Row>

      <Row>
        <Column small={12} large={4}>
          <ContractPartyField {...collateralFieldProps} />
        </Column>
        <ThirdPartyPledgeFields {...collateralFieldProps} />
      </Row>
      <Row>
        <Column small={12} large={4}>
          <FieldArray name={`${field}.property_identifiers`}>
            {(fieldArrayProps) =>
              PropertyIdentifiers({
                ...fieldArrayProps,
                attributes,
                isSaveClicked,
              })
            }
          </FieldArray>
        </Column>
        <Column small={12} large={8}>
          <NoteField {...collateralFieldProps} />
        </Column>
      </Row>
    </>
  );
};

const CollateralOther = (collateralFieldProps: CollateralEditFieldProps) => {
  const { attributes, field, isSaveClicked } = collateralFieldProps;
  return (
    <>
      <Row>
        <Column small={6} medium={4} large={2}>
          <CollateralTypeField {...collateralFieldProps} />
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={isFieldAllowedToRead(
              attributes,
              LeaseContractCollateralsFieldPaths.NUMBER,
            )}
          >
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={getFieldAttributes(
                attributes,
                LeaseContractCollateralsFieldPaths.NUMBER,
              )}
              name={`${field}.number`}
              overrideValues={{
                label: LeaseContractCollateralsFieldTitles.NUMBER,
              }}
              enableUiDataEdit
              uiDataKey={getUiDataLeaseKey(
                LeaseContractCollateralsFieldPaths.NUMBER,
              )}
            />
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <StartDateField {...collateralFieldProps} />
        </Column>
        <Column small={6} medium={4} large={2}>
          <EndDateField {...collateralFieldProps} />
        </Column>
        <Column small={6} medium={4} large={2}>
          <TotalAmountField {...collateralFieldProps} />
        </Column>
      </Row>
      <Row>
        <Column small={6} medium={4} large={2}>
          <DocumentTypeField {...collateralFieldProps} />
        </Column>
        <PledgorFields {...collateralFieldProps} />
        <ReturnedDateFields {...collateralFieldProps} />
      </Row>
      <Row>
        <Column small={12} large={4}>
          <ContractPartyField {...collateralFieldProps} />
        </Column>
        <ThirdPartyPledgeFields {...collateralFieldProps} />
      </Row>
      <Row>
        <Column small={12}>
          <NoteField {...collateralFieldProps} />
        </Column>
      </Row>
    </>
  );
};

//Omavelkainen takaus
const CollateralSelfDebtorGuarantee = (
  collateralFieldProps: CollateralEditFieldProps,
) => {
  const { attributes, field, isSaveClicked } = collateralFieldProps;
  return (
    <>
      <Row>
        <Column small={6} medium={4} large={2}>
          <CollateralTypeField {...collateralFieldProps} />
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={isFieldAllowedToRead(
              attributes,
              LeaseContractCollateralsFieldPaths.GUARANTEE_NUMBER,
            )}
          >
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={getFieldAttributes(
                attributes,
                LeaseContractCollateralsFieldPaths.GUARANTEE_NUMBER,
              )}
              name={`${field}.guarantee_number`}
              overrideValues={{
                label: LeaseContractCollateralsFieldTitles.GUARANTEE_NUMBER,
              }}
              enableUiDataEdit
              uiDataKey={getUiDataLeaseKey(
                LeaseContractCollateralsFieldPaths.GUARANTEE_NUMBER,
              )}
            />
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <StartDateField {...collateralFieldProps} />
        </Column>
        <Column small={6} medium={4} large={2}>
          <EndDateField {...collateralFieldProps} />
        </Column>
        <Column small={6} medium={4} large={2}>
          <TotalAmountField {...collateralFieldProps} />
        </Column>
      </Row>
      <Row>
        <Column small={6} medium={4} large={2}>
          <DocumentTypeField {...collateralFieldProps} />
        </Column>
        <PledgorFields {...collateralFieldProps} required={true} />
        <ReturnedDateFields {...collateralFieldProps} />
      </Row>
      <Row>
        <Column small={12} large={4}>
          <ContractPartyField {...collateralFieldProps} />
        </Column>
        <ThirdPartyPledgeFields {...collateralFieldProps} />
      </Row>
      <Row>
        <Column small={12}>
          <NoteField {...collateralFieldProps} />
        </Column>
      </Row>
    </>
  );
};

const CollateralPledgeOfFunds = (
  collateralFieldProps: CollateralEditFieldProps,
) => {
  return (
    <>
      <Row>
        <Column small={6} medium={4} large={2}>
          <CollateralTypeField {...collateralFieldProps} />
        </Column>
        <Column small={6} medium={4} large={2}>
          <AccountNumberField {...collateralFieldProps} required={true} />
        </Column>
        <Column small={6} medium={4} large={2}>
          <StartDateField {...collateralFieldProps} />
        </Column>
        <Column small={6} medium={4} large={2}>
          <EndDateField {...collateralFieldProps} />
        </Column>
        <Column small={6} medium={4} large={2}>
          <TotalAmountField {...collateralFieldProps} />
        </Column>
      </Row>
      <Row>
        <Column small={6} medium={4} large={2}>
          <DocumentTypeField {...collateralFieldProps} />
        </Column>
        <PledgorFields {...collateralFieldProps} />
        <ReturnedDateFields {...collateralFieldProps} />
      </Row>
      <Row>
        <Column small={12} large={4}>
          <ContractPartyField {...collateralFieldProps} />
        </Column>
        <ThirdPartyPledgeFields {...collateralFieldProps} />
      </Row>
      <Row>
        <Column small={6} medium={8} large={10}>
          <NoteField {...collateralFieldProps} />
        </Column>
      </Row>
    </>
  );
};

type Props = {
  field: string;
  onRemove: (...args: Array<any>) => any;
  collateralType: number | null | undefined;
};

const CollateralEdit: React.FC<Props> = ({
  field,
  onRemove,
  collateralType,
}) => {
  const attributes: Attributes = useAppSelector(getAttributes);
  const isSaveClicked: boolean = useAppSelector(getIsSaveClicked);
  const usersPermissions: UsersPermissionsType =
    useAppSelector(getUsersPermissions);
  const collateralFieldProps: CollateralEditFieldProps = {
    attributes,
    field,
    isSaveClicked,
  };
  return (
    <BoxItem>
      <BoxContentWrapper>
        <ActionButtonWrapper>
          <Authorization
            allow={hasPermissions(
              usersPermissions,
              UsersPermissions.DELETE_COLLATERAL,
            )}
          >
            <RemoveButton onClick={onRemove} title="Poista vakuus" />
          </Authorization>
        </ActionButtonWrapper>

        {!collateralType && <CollateralEmpty {...collateralFieldProps} />}
        {collateralType === CollateralTypes.FINANCIAL_GUARANTEE && (
          <CollateralFinancialGuarantee {...collateralFieldProps} />
        )}
        {collateralType === CollateralTypes.MORTGAGE_DOCUMENT && (
          <CollateralMortgageDocument {...collateralFieldProps} />
        )}
        {collateralType === CollateralTypes.SELF_DEBTOR_GUARANTEE && (
          <CollateralSelfDebtorGuarantee
            attributes={attributes}
            field={field}
            isSaveClicked={isSaveClicked}
          />
        )}
        {collateralType === CollateralTypes.PLEDGE_OF_FUNDS && (
          <CollateralPledgeOfFunds
            attributes={attributes}
            field={field}
            isSaveClicked={isSaveClicked}
          />
        )}
        {Boolean(collateralType) &&
          (collateralType === CollateralTypes.OTHER || collateralType > 5) && (
            <CollateralOther {...collateralFieldProps} />
          )}
      </BoxContentWrapper>
    </BoxItem>
  );
};

export default CollateralEdit;
