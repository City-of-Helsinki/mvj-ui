import React from "react";
import { Row, Column } from "@/components/grid/Grid";
import { useAppSelector } from "@/root/hooks";
import Authorization from "@/components/authorization/Authorization";
import BoxItem from "@/components/content/BoxItem";
import FormText from "@/components/form/FormText";
import FormTextTitle from "@/components/form/FormTextTitle";
import {
  CollateralTypes,
  LeaseContractCollateralsFieldPaths,
  LeaseContractCollateralsFieldTitles,
} from "@/leases/enums";
import { getUiDataLeaseKey } from "@/uiData/helpers";
import { formatDate, isFieldAllowedToRead } from "@/util/helpers";
import { getAttributes } from "@/leases/selectors";
import type { Attributes } from "types";
import {
  CollateralTypeField,
  TotalAmountField,
  StartDateField,
  EndDateField,
  ReturnedDateFields,
  NoteField,
  ThirdPartyPledgeFields,
  ContractPartyFields,
  AccountNumberField,
  DocumentTypeField,
  PledgorFields,
  SubordinatePledgeFields,
} from "@/leases/components/leaseSections/contract/CollateralFields";
import type { Collateral } from "@/leases/types";
export type CollateralFieldProps = {
  attributes: Attributes;
  collateral: Collateral;
};

const CollateralEmpty = ({ attributes, collateral }: CollateralFieldProps) => {
  return (
    <>
      <Row>
        <Column small={6} medium={4} large={2}>
          <CollateralTypeField
            attributes={attributes}
            collateral={collateral}
          />
        </Column>
      </Row>
    </>
  );
};
// Rahavakuus
const CollateralFinancialGuarantee = ({
  attributes,
  collateral,
}: CollateralFieldProps) => {
  return (
    <>
      <Row>
        <Column small={6} medium={4} large={2}>
          <CollateralTypeField
            attributes={attributes}
            collateral={collateral}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <TotalAmountField attributes={attributes} collateral={collateral} />
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={isFieldAllowedToRead(
              attributes,
              LeaseContractCollateralsFieldPaths.PAID_DATE,
            )}
          >
            <>
              <FormTextTitle
                uiDataKey={getUiDataLeaseKey(
                  LeaseContractCollateralsFieldPaths.PAID_DATE,
                )}
              >
                {LeaseContractCollateralsFieldTitles.PAID_DATE}
              </FormTextTitle>
              <FormText>{formatDate(collateral.paid_date) || "-"}</FormText>
            </>
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <AccountNumberField attributes={attributes} collateral={collateral} />
        </Column>
        <ReturnedDateFields attributes={attributes} collateral={collateral} />
      </Row>
      <Row>
        <PledgorFields attributes={attributes} collateral={collateral} />
        <ThirdPartyPledgeFields
          attributes={attributes}
          collateral={collateral}
        />
      </Row>
      <Row>
        <Column small={12} medium={8} large={4}>
          <ContractPartyFields
            attributes={attributes}
            collateral={collateral}
          />
        </Column>
        <Column small={12} large={8}>
          <NoteField attributes={attributes} collateral={collateral} />
        </Column>
      </Row>
    </>
  );
};

//Panttikirja
const CollateralMortgageDocument = ({
  attributes,
  collateral,
}: CollateralFieldProps) => {
  return (
    <>
      <Row>
        <Column small={6} medium={4} large={2}>
          <CollateralTypeField
            attributes={attributes}
            collateral={collateral}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={isFieldAllowedToRead(
              attributes,
              LeaseContractCollateralsFieldPaths.NUMBER_MORTGAGE_DOCUMENT,
            )}
          >
            <>
              <FormTextTitle
                uiDataKey={getUiDataLeaseKey(
                  LeaseContractCollateralsFieldPaths.NUMBER_MORTGAGE_DOCUMENT,
                )}
              >
                {LeaseContractCollateralsFieldTitles.NUMBER_MORTGAGE_DOCUMENT}
              </FormTextTitle>
              <FormText>{collateral.number_mortgage_document || "-"}</FormText>
            </>
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={isFieldAllowedToRead(
              attributes,
              LeaseContractCollateralsFieldPaths.DEED_DATE,
            )}
          >
            <>
              <FormTextTitle
                uiDataKey={getUiDataLeaseKey(
                  LeaseContractCollateralsFieldPaths.DEED_DATE,
                )}
              >
                {LeaseContractCollateralsFieldTitles.DEED_DATE}
              </FormTextTitle>
              <FormText>{formatDate(collateral.deed_date) || "-"}</FormText>
            </>
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <StartDateField attributes={attributes} collateral={collateral} />
        </Column>
        <Column small={6} medium={4} large={2}>
          <EndDateField attributes={attributes} collateral={collateral} />
        </Column>
        <Column small={6} medium={4} large={2}>
          <TotalAmountField attributes={attributes} collateral={collateral} />
        </Column>
      </Row>
      <Row>
        <Column small={6} medium={4} large={2}>
          <DocumentTypeField attributes={attributes} collateral={collateral} />
        </Column>
        <SubordinatePledgeFields
          attributes={attributes}
          collateral={collateral}
        />
        <ReturnedDateFields attributes={attributes} collateral={collateral} />
      </Row>
      <Row>
        <Column small={12} medium={8} large={4}>
          <ContractPartyFields
            attributes={attributes}
            collateral={collateral}
          />
        </Column>
        <ThirdPartyPledgeFields
          attributes={attributes}
          collateral={collateral}
        />
      </Row>
      <Row>
        <Column small={12} large={4}>
          {(collateral.property_identifiers?.length ?? 0) > 0 && (
            <Row>
              <Column small={6}>
                <Authorization
                  allow={isFieldAllowedToRead(
                    attributes,
                    LeaseContractCollateralsFieldPaths.PROPERTY_IDENTIFIER,
                  )}
                >
                  <FormTextTitle
                    uiDataKey={getUiDataLeaseKey(
                      LeaseContractCollateralsFieldPaths.PROPERTY_IDENTIFIER,
                    )}
                  >
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
                  <FormTextTitle
                    uiDataKey={getUiDataLeaseKey(
                      LeaseContractCollateralsFieldPaths.INSTITUTION_IDENTIFIER,
                    )}
                  >
                    {LeaseContractCollateralsFieldTitles.INSTITUTION_IDENTIFIER}
                  </FormTextTitle>
                </Authorization>
              </Column>
            </Row>
          )}
          {collateral.property_identifiers?.map((item, index) => (
            <Row key={index}>
              <Column small={6}>
                <Authorization
                  allow={isFieldAllowedToRead(
                    attributes,
                    LeaseContractCollateralsFieldPaths.PROPERTY_IDENTIFIER,
                  )}
                >
                  <FormText>{item.property_identifier || "-"}</FormText>
                </Authorization>
              </Column>
              <Column small={6}>
                <Authorization
                  allow={isFieldAllowedToRead(
                    attributes,
                    LeaseContractCollateralsFieldPaths.INSTITUTION_IDENTIFIER,
                  )}
                >
                  <FormText>{item.institution_identifier || "-"}</FormText>
                </Authorization>
              </Column>
            </Row>
          ))}
        </Column>
        <Column small={12} large={8}>
          <NoteField attributes={attributes} collateral={collateral} />
        </Column>
      </Row>
    </>
  );
};

//Omavelkainen takaus
const CollateralSelfDebtorGuarantee = ({
  attributes,
  collateral,
}: CollateralFieldProps) => {
  return (
    <>
      <Row>
        <Column small={6} medium={4} large={2}>
          <CollateralTypeField
            attributes={attributes}
            collateral={collateral}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={isFieldAllowedToRead(
              attributes,
              LeaseContractCollateralsFieldPaths.GUARANTEE_NUMBER,
            )}
          >
            <>
              <FormTextTitle
                uiDataKey={getUiDataLeaseKey(
                  LeaseContractCollateralsFieldPaths.GUARANTEE_NUMBER,
                )}
              >
                {LeaseContractCollateralsFieldTitles.GUARANTEE_NUMBER}
              </FormTextTitle>
              <FormText>{collateral.guarantee_number || "-"}</FormText>
            </>
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <StartDateField attributes={attributes} collateral={collateral} />
        </Column>
        <Column small={6} medium={4} large={2}>
          <EndDateField attributes={attributes} collateral={collateral} />
        </Column>
        <Column small={6} medium={4} large={2}>
          <TotalAmountField attributes={attributes} collateral={collateral} />
        </Column>
      </Row>
      <Row>
        <Column small={6} medium={4} large={2}>
          <DocumentTypeField attributes={attributes} collateral={collateral} />
        </Column>
        <PledgorFields attributes={attributes} collateral={collateral} />
        <ReturnedDateFields attributes={attributes} collateral={collateral} />
      </Row>
      <Row>
        <Column small={12} medium={8} large={4}>
          <ContractPartyFields
            attributes={attributes}
            collateral={collateral}
          />
        </Column>
        <ThirdPartyPledgeFields
          attributes={attributes}
          collateral={collateral}
        />
      </Row>
      <Row>
        <Column small={12}>
          <NoteField attributes={attributes} collateral={collateral} />
        </Column>
      </Row>
    </>
  );
};

const CollateralPledgeOfFunds = ({
  attributes,
  collateral,
}: CollateralFieldProps) => {
  return (
    <>
      <Row>
        <Column small={6} medium={4} large={2}>
          <CollateralTypeField
            attributes={attributes}
            collateral={collateral}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <AccountNumberField attributes={attributes} collateral={collateral} />
        </Column>
        <Column small={6} medium={4} large={2}>
          <StartDateField attributes={attributes} collateral={collateral} />
        </Column>
        <Column small={6} medium={4} large={2}>
          <EndDateField attributes={attributes} collateral={collateral} />
        </Column>
        <Column small={6} medium={4} large={2}>
          <TotalAmountField attributes={attributes} collateral={collateral} />
        </Column>
      </Row>
      <Row>
        <Column small={6} medium={4} large={2}>
          <DocumentTypeField attributes={attributes} collateral={collateral} />
        </Column>
        <PledgorFields attributes={attributes} collateral={collateral} />
        <ReturnedDateFields attributes={attributes} collateral={collateral} />
      </Row>
      <Row>
        <Column small={12} medium={8} large={4}>
          <ContractPartyFields
            attributes={attributes}
            collateral={collateral}
          />
        </Column>
        <ThirdPartyPledgeFields
          attributes={attributes}
          collateral={collateral}
        />
      </Row>
      <Row>
        <Column small={12}>
          <NoteField attributes={attributes} collateral={collateral} />
        </Column>
      </Row>
    </>
  );
};

const CollateralOther = ({ attributes, collateral }: CollateralFieldProps) => {
  return (
    <>
      <Row>
        <Column small={6} medium={4} large={2}>
          <CollateralTypeField
            attributes={attributes}
            collateral={collateral}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={isFieldAllowedToRead(
              attributes,
              LeaseContractCollateralsFieldPaths.NUMBER,
            )}
          >
            <>
              <FormTextTitle
                uiDataKey={getUiDataLeaseKey(
                  LeaseContractCollateralsFieldPaths.NUMBER,
                )}
              >
                {LeaseContractCollateralsFieldTitles.NUMBER}
              </FormTextTitle>
              <FormText>{collateral.number || "-"}</FormText>
            </>
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <StartDateField attributes={attributes} collateral={collateral} />
        </Column>
        <Column small={6} medium={4} large={2}>
          <EndDateField attributes={attributes} collateral={collateral} />
        </Column>
        <Column small={6} medium={4} large={2}>
          <TotalAmountField attributes={attributes} collateral={collateral} />
        </Column>
      </Row>
      <Row>
        <Column small={6} medium={4} large={2}>
          <DocumentTypeField attributes={attributes} collateral={collateral} />
        </Column>
        <PledgorFields attributes={attributes} collateral={collateral} />
        <ReturnedDateFields attributes={attributes} collateral={collateral} />
      </Row>
      <Row>
        <Column small={12} medium={8} large={4}>
          <ContractPartyFields
            attributes={attributes}
            collateral={collateral}
          />
        </Column>
        <ThirdPartyPledgeFields
          attributes={attributes}
          collateral={collateral}
        />
      </Row>
      <Row>
        <Column small={12}>
          <NoteField attributes={attributes} collateral={collateral} />
        </Column>
      </Row>
    </>
  );
};

type Props = {
  collateral: Collateral;
};

const Collateral = ({ collateral }: Props) => {
  const collateralType = collateral.type;
  const attributes: Attributes = useAppSelector(getAttributes);
  return (
    <BoxItem className="no-border-on-first-child no-border-on-last-child">
      {!collateralType && (
        <CollateralEmpty attributes={attributes} collateral={collateral} />
      )}
      {collateralType === CollateralTypes.FINANCIAL_GUARANTEE && (
        <CollateralFinancialGuarantee
          attributes={attributes}
          collateral={collateral}
        />
      )}
      {collateralType === CollateralTypes.MORTGAGE_DOCUMENT && (
        <CollateralMortgageDocument
          attributes={attributes}
          collateral={collateral}
        />
      )}
      {collateralType === CollateralTypes.SELF_DEBTOR_GUARANTEE && (
        <CollateralSelfDebtorGuarantee
          attributes={attributes}
          collateral={collateral}
        />
      )}
      {collateralType === CollateralTypes.PLEDGE_OF_FUNDS && (
        <CollateralPledgeOfFunds
          attributes={attributes}
          collateral={collateral}
        />
      )}
      {collateralType &&
        (collateralType === CollateralTypes.OTHER || collateralType > 5) && (
          <CollateralOther attributes={attributes} collateral={collateral} />
        )}
    </BoxItem>
  );
};

export default Collateral;
