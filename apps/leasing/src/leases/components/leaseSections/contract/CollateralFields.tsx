import React from "react";
import Authorization from "@/components/authorization/Authorization";
import FormText from "@/components/form/FormText";
import FormTextTitle from "@/components/form/FormTextTitle";
import {
  LeaseContractCollateralsFieldPaths,
  LeaseContractCollateralsFieldTitles,
} from "@/leases/enums";
import { getUiDataLeaseKey } from "@/uiData/helpers";
import { getUserFullName } from "@/users/helpers";
import {
  formatDate,
  formatNumber,
  getFieldOptions,
  getLabelOfOption,
  isEmptyValue,
  isFieldAllowedToRead,
} from "@/util/helpers";
import { CollateralFieldProps } from "@/leases/components/leaseSections/contract/Collateral";

export const CollateralTypeField = ({
  attributes,
  collateral,
}: CollateralFieldProps) => {
  const typeOptions = getFieldOptions(
    attributes,
    LeaseContractCollateralsFieldPaths.TYPE,
  );
  return (
    <Authorization
      allow={isFieldAllowedToRead(
        attributes,
        LeaseContractCollateralsFieldPaths.TYPE,
      )}
    >
      <>
        <FormTextTitle
          uiDataKey={getUiDataLeaseKey(LeaseContractCollateralsFieldPaths.TYPE)}
        >
          {LeaseContractCollateralsFieldTitles.TYPE}
        </FormTextTitle>
        <FormText>
          {getLabelOfOption(typeOptions, collateral.type) || "-"}
        </FormText>
      </>
    </Authorization>
  );
};

export const TotalAmountField = ({
  attributes,
  collateral,
}: CollateralFieldProps) => (
  <Authorization
    allow={isFieldAllowedToRead(
      attributes,
      LeaseContractCollateralsFieldPaths.TOTAL_AMOUNT,
    )}
  >
    <>
      <FormTextTitle
        uiDataKey={getUiDataLeaseKey(
          LeaseContractCollateralsFieldPaths.TOTAL_AMOUNT,
        )}
      >
        {LeaseContractCollateralsFieldTitles.TOTAL_AMOUNT}
      </FormTextTitle>
      <FormText>
        {!isEmptyValue(collateral.total_amount)
          ? `${formatNumber(collateral.total_amount)} €`
          : "-"}
      </FormText>
    </>
  </Authorization>
);

export const StartDateField = ({
  attributes,
  collateral,
}: CollateralFieldProps) => (
  <Authorization
    allow={isFieldAllowedToRead(
      attributes,
      LeaseContractCollateralsFieldPaths.START_DATE,
    )}
  >
    <>
      <FormTextTitle
        uiDataKey={getUiDataLeaseKey(
          LeaseContractCollateralsFieldPaths.START_DATE,
        )}
      >
        {LeaseContractCollateralsFieldTitles.START_DATE}
      </FormTextTitle>
      <FormText>{formatDate(collateral.start_date) || "-"}</FormText>
    </>
  </Authorization>
);

export const EndDateField = ({
  attributes,
  collateral,
}: CollateralFieldProps) => (
  <Authorization
    allow={isFieldAllowedToRead(
      attributes,
      LeaseContractCollateralsFieldPaths.END_DATE,
    )}
  >
    <>
      <FormTextTitle
        uiDataKey={getUiDataLeaseKey(
          LeaseContractCollateralsFieldPaths.END_DATE,
        )}
      >
        {LeaseContractCollateralsFieldTitles.END_DATE}
      </FormTextTitle>
      <FormText>{formatDate(collateral.end_date) || "-"}</FormText>
    </>
  </Authorization>
);

export const ReturnedDateField = ({
  attributes,
  collateral,
}: CollateralFieldProps) => (
  <Authorization
    allow={isFieldAllowedToRead(
      attributes,
      LeaseContractCollateralsFieldPaths.RETURNED_DATE,
    )}
  >
    <>
      <FormTextTitle
        uiDataKey={getUiDataLeaseKey(
          LeaseContractCollateralsFieldPaths.RETURNED_DATE,
        )}
      >
        {LeaseContractCollateralsFieldTitles.RETURNED_DATE}
      </FormTextTitle>
      <FormText>{formatDate(collateral.returned_date) || "-"}</FormText>
      {collateral.returned_date && (
        <ReturnedByField attributes={attributes} collateral={collateral} />
      )}
    </>
  </Authorization>
);

export const ReturnedByField = ({
  attributes,
  collateral,
}: CollateralFieldProps) => (
  <Authorization
    allow={isFieldAllowedToRead(
      attributes,
      LeaseContractCollateralsFieldPaths.RETURNED_BY,
    )}
  >
    <>
      <FormTextTitle
        uiDataKey={getUiDataLeaseKey(
          LeaseContractCollateralsFieldPaths.RETURNED_BY,
        )}
      >
        {LeaseContractCollateralsFieldTitles.RETURNED_BY}
      </FormTextTitle>
      <FormText>{getUserFullName(collateral.returned_by) || "-"}</FormText>
    </>
  </Authorization>
);

export const NoteField = ({ attributes, collateral }: CollateralFieldProps) => (
  <Authorization
    allow={isFieldAllowedToRead(
      attributes,
      LeaseContractCollateralsFieldPaths.NOTE,
    )}
  >
    <>
      <FormTextTitle
        uiDataKey={getUiDataLeaseKey(LeaseContractCollateralsFieldPaths.NOTE)}
      >
        {LeaseContractCollateralsFieldTitles.NOTE}
      </FormTextTitle>
      <FormText>{collateral.note || "-"}</FormText>
    </>
  </Authorization>
);

export const ThirdPartyPledgeField = ({
  attributes,
  collateral,
}: CollateralFieldProps) => (
  <Authorization
    allow={isFieldAllowedToRead(
      attributes,
      LeaseContractCollateralsFieldPaths.THIRD_PARTY_PLEDGE,
    )}
  >
    <>
      <FormTextTitle
        uiDataKey={getUiDataLeaseKey(
          LeaseContractCollateralsFieldPaths.THIRD_PARTY_PLEDGE,
        )}
      >
        {LeaseContractCollateralsFieldTitles.THIRD_PARTY_PLEDGE}
      </FormTextTitle>
      <FormText>{collateral.third_party_pledge || "-"}</FormText>
      {collateral.third_party_pledge && (
        <>
          <PledgorNameField attributes={attributes} collateral={collateral} />
          <PledgorIdentifierField
            attributes={attributes}
            collateral={collateral}
          />
        </>
      )}
    </>
  </Authorization>
);

export const PledgorNameField = ({
  attributes,
  collateral,
}: CollateralFieldProps) => (
  <Authorization
    allow={isFieldAllowedToRead(
      attributes,
      LeaseContractCollateralsFieldPaths.PLEDGOR_NAME,
    )}
  >
    <>
      <FormTextTitle
        uiDataKey={getUiDataLeaseKey(
          LeaseContractCollateralsFieldPaths.PLEDGOR_NAME,
        )}
      >
        {LeaseContractCollateralsFieldTitles.PLEDGOR_NAME}
      </FormTextTitle>
      <FormText>{collateral.pledgor_name || "-"}</FormText>
    </>
  </Authorization>
);

export const PledgorIdentifierField = ({
  attributes,
  collateral,
}: CollateralFieldProps) => {
  return (
    <>
      <Authorization
        allow={isFieldAllowedToRead(
          attributes,
          LeaseContractCollateralsFieldPaths.PLEDGOR_NATIONAL_IDENTIFICATION_NUMBER,
        )}
      >
        <>
          <FormTextTitle
            uiDataKey={getUiDataLeaseKey(
              LeaseContractCollateralsFieldPaths.PLEDGOR_NATIONAL_IDENTIFICATION_NUMBER,
            )}
          >
            {
              LeaseContractCollateralsFieldTitles.PLEDGOR_NATIONAL_IDENTIFICATION_NUMBER
            }
          </FormTextTitle>
          <FormText>
            {collateral.pledgor_national_identification_number || "-"}
          </FormText>
        </>
      </Authorization>
      <Authorization
        allow={isFieldAllowedToRead(
          attributes,
          LeaseContractCollateralsFieldPaths.PLEDGOR_BUSINESS_ID,
        )}
      >
        <>
          <FormTextTitle
            uiDataKey={getUiDataLeaseKey(
              LeaseContractCollateralsFieldPaths.PLEDGOR_BUSINESS_ID,
            )}
          >
            {LeaseContractCollateralsFieldTitles.PLEDGOR_BUSINESS_ID}
          </FormTextTitle>
          <FormText>{collateral.pledgor_business_id || "-"}</FormText>
        </>
      </Authorization>
    </>
  );
};

export const ContractPartyField = ({
  attributes,
  collateral,
}: CollateralFieldProps) => (
  <Authorization
    allow={isFieldAllowedToRead(
      attributes,
      LeaseContractCollateralsFieldPaths.CONTRACT_PARTY,
    )}
  >
    <>
      <FormTextTitle
        uiDataKey={getUiDataLeaseKey(
          LeaseContractCollateralsFieldPaths.CONTRACT_PARTY,
        )}
      >
        {LeaseContractCollateralsFieldTitles.CONTRACT_PARTY}
      </FormTextTitle>
      <FormText>{collateral.contract_party || "-"}</FormText>
    </>
  </Authorization>
);

export const ContractPartyIdentifierField = ({
  attributes,
  collateral,
}: CollateralFieldProps) => {
  return (
    <>
      <Authorization
        allow={isFieldAllowedToRead(
          attributes,
          LeaseContractCollateralsFieldPaths.CONTRACT_PARTY_NATIONAL_IDENTIFICATION_NUMBER,
        )}
      >
        <>
          <FormTextTitle
            uiDataKey={getUiDataLeaseKey(
              LeaseContractCollateralsFieldPaths.CONTRACT_PARTY_NATIONAL_IDENTIFICATION_NUMBER,
            )}
          >
            {
              LeaseContractCollateralsFieldTitles.CONTRACT_PARTY_NATIONAL_IDENTIFICATION_NUMBER
            }
          </FormTextTitle>
          <FormText>
            {collateral.contract_party_national_identification_number || "-"}
          </FormText>
        </>
      </Authorization>
      <Authorization
        allow={isFieldAllowedToRead(
          attributes,
          LeaseContractCollateralsFieldPaths.CONTRACT_PARTY_BUSINESS_ID,
        )}
      >
        <>
          <FormTextTitle
            uiDataKey={getUiDataLeaseKey(
              LeaseContractCollateralsFieldPaths.CONTRACT_PARTY_BUSINESS_ID,
            )}
          >
            {LeaseContractCollateralsFieldTitles.CONTRACT_PARTY_BUSINESS_ID}
          </FormTextTitle>
          <FormText>{collateral.contract_party_business_id || "-"}</FormText>
        </>
      </Authorization>
    </>
  );
};

export const AccountNumberField = ({
  attributes,
  collateral,
}: CollateralFieldProps) => (
  <Authorization
    allow={isFieldAllowedToRead(
      attributes,
      LeaseContractCollateralsFieldPaths.ACCOUNT_NUMBER,
    )}
  >
    <>
      <FormTextTitle
        uiDataKey={getUiDataLeaseKey(
          LeaseContractCollateralsFieldPaths.ACCOUNT_NUMBER,
        )}
      >
        {LeaseContractCollateralsFieldTitles.ACCOUNT_NUMBER}
      </FormTextTitle>
      <FormText>{collateral.account_number || "-"}</FormText>
    </>
  </Authorization>
);

export const DocumentTypeField = ({
  attributes,
  collateral,
}: CollateralFieldProps) => {
  const documentTypeOptions = getFieldOptions(
    attributes,
    LeaseContractCollateralsFieldPaths.DOCUMENT_TYPE,
  );
  return (
    <Authorization
      allow={isFieldAllowedToRead(
        attributes,
        LeaseContractCollateralsFieldPaths.DOCUMENT_TYPE,
      )}
    >
      <>
        <FormTextTitle
          uiDataKey={getUiDataLeaseKey(
            LeaseContractCollateralsFieldPaths.DOCUMENT_TYPE,
          )}
        >
          {LeaseContractCollateralsFieldTitles.DOCUMENT_TYPE}
        </FormTextTitle>
        <FormText>
          {getLabelOfOption(documentTypeOptions, collateral.document_type) ||
            "-"}
        </FormText>
      </>
    </Authorization>
  );
};
