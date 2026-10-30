import React, { useState, useEffect } from "react";
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
  SubordinatePledgeFields,
  PropertyIdentifierField,
  InstitutionIdentifierField,
  IdentifierTypeField,
} from "@/leases/components/leaseSections/contract/CollateralEditFields";
import { useFieldValue } from "@/components/helpers";

// Collaterals had breaking changes done to their structure and required fields.
// Uses version numbers to un-mark fields as required, to preserve backwards compatibility.
export const FORM_VERSION_2 = 2;

type PropertyIdentifiersProps = {
  attributes: Attributes;
  fields: any;
  isSaveClicked: boolean;
  formVersion?: number;
};

const PropertyIdentifiers = ({
  attributes,
  fields,
  isSaveClicked,
  formVersion,
}: PropertyIdentifiersProps) => {
  const handleAdd = () => fields.push();

  return (
    <ModalConsumer>
      {({ modalDispatch }) => (
        <>
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
                  <Column small={12}>
                    <FieldAndRemoveButtonWrapper
                      field={
                        <PropertyIdentifierField
                          attributes={attributes}
                          field={field}
                          isSaveClicked={isSaveClicked}
                          formVersion={formVersion}
                        />
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
  formVersion?: number;
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

const CollateralFinancialGuarantee = (
  collateralFieldProps: CollateralEditFieldProps,
) => {
  const { attributes, field, isSaveClicked, formVersion } =
    collateralFieldProps;
  return (
    <>
      <Row>
        <Column small={6} medium={4} large={2}>
          <CollateralTypeField {...collateralFieldProps} />
        </Column>
        <Column small={6} medium={4} large={2}>
          <AccountNumberField {...collateralFieldProps} />
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
                required: formVersion >= FORM_VERSION_2,
              }}
              enableUiDataEdit
              uiDataKey={getUiDataLeaseKey(
                LeaseContractCollateralsFieldPaths.PAID_DATE,
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

const DEFAULT_PROPERTY_IDENTIFIERS = [undefined];

const CollateralMortgageDocument = (
  collateralFieldProps: CollateralEditFieldProps,
) => {
  const { attributes, field, isSaveClicked, formVersion } =
    collateralFieldProps;
  const useInstitutionIdentifier = useFieldValue(
    `${field}.use_institution_identifier`,
  );
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
                required: formVersion >= FORM_VERSION_2,
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
                required: formVersion >= FORM_VERSION_2,
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
        <SubordinatePledgeFields {...collateralFieldProps} />
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
          <IdentifierTypeField {...collateralFieldProps} />
          {useInstitutionIdentifier ? (
            <InstitutionIdentifierField {...collateralFieldProps} />
          ) : (
            <FieldArray
              name={`${field}.property_identifiers`}
              initialValue={DEFAULT_PROPERTY_IDENTIFIERS}
            >
              {(fieldArrayProps) => (
                <PropertyIdentifiers
                  {...fieldArrayProps}
                  attributes={attributes}
                  isSaveClicked={isSaveClicked}
                  formVersion={formVersion}
                />
              )}
            </FieldArray>
          )}
        </Column>
        <Column small={12} large={8}>
          <NoteField {...collateralFieldProps} />
        </Column>
      </Row>
    </>
  );
};

const CollateralSelfDebtorGuarantee = (
  collateralFieldProps: CollateralEditFieldProps,
) => {
  const { attributes, field, isSaveClicked, formVersion } =
    collateralFieldProps;
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
        <PledgorFields
          {...collateralFieldProps}
          required={formVersion >= FORM_VERSION_2}
        />
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
  const { formVersion } = collateralFieldProps;
  return (
    <>
      <Row>
        <Column small={6} medium={4} large={2}>
          <CollateralTypeField {...collateralFieldProps} />
        </Column>
        <Column small={6} medium={4} large={2}>
          <AccountNumberField
            {...collateralFieldProps}
            required={formVersion >= FORM_VERSION_2}
          />
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

type Props = {
  field: string;
  onRemove: (...args: Array<any>) => any;
};

const CollateralEdit: React.FC<Props> = ({ field, onRemove }) => {
  const collateralType = useFieldValue(`${field}.type`);
  const formVersion: number = useFieldValue(`${field}.form_version`);
  const attributes: Attributes = useAppSelector(getAttributes);
  const isSaveClicked: boolean = useAppSelector(getIsSaveClicked);
  const usersPermissions: UsersPermissionsType =
    useAppSelector(getUsersPermissions);
  const collateralFieldProps: CollateralEditFieldProps = {
    attributes,
    field,
    isSaveClicked,
    formVersion,
  };
  // Form validation doesn't run for some reason on edit mode in initial field mount.
  // Forcing a remount as a workaround.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <BoxItem key={String(mounted)}>
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
          <CollateralSelfDebtorGuarantee {...collateralFieldProps} />
        )}
        {collateralType === CollateralTypes.PLEDGE_OF_FUNDS && (
          <CollateralPledgeOfFunds {...collateralFieldProps} />
        )}
        {collateralType === CollateralTypes.OTHER && (
          <CollateralOther {...collateralFieldProps} />
        )}
      </BoxContentWrapper>
    </BoxItem>
  );
};

export default CollateralEdit;
