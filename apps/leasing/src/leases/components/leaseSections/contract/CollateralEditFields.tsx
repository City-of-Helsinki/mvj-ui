import React from "react";
import Authorization from "@/components/authorization/Authorization";
import FormField from "@/components/form/final-form/FormField";
import {
  LeaseContractCollateralsFieldPaths,
  LeaseContractCollateralsFieldTitles,
} from "@/leases/enums";
import { getUiDataLeaseKey } from "@/uiData/helpers";
import { getFieldAttributes, isFieldAllowedToRead } from "@/util/helpers";
import { useFieldValue } from "@/components/helpers";
import {
  companyIdentifierValidator,
  personalIdentifierValidator,
} from "@/application/formValidation";
import type { CollateralEditFieldProps } from "@/leases/components/leaseSections/contract/CollateralEdit";
import { FieldTypes } from "@/enums";

export const CollateralTypeField = ({
  attributes,
  field,
  isSaveClicked,
}: CollateralEditFieldProps) => {
  const type = useFieldValue(`${field}.type`);
  return (
    <Authorization
      allow={isFieldAllowedToRead(
        attributes,
        LeaseContractCollateralsFieldPaths.TYPE,
      )}
    >
      <FormField
        disableTouched={isSaveClicked}
        fieldAttributes={getFieldAttributes(
          attributes,
          LeaseContractCollateralsFieldPaths.TYPE,
        )}
        name={`${field}.type`}
        overrideValues={{ label: LeaseContractCollateralsFieldTitles.TYPE }}
        //TODO: Uncomment
        // disabled={!!type}
        enableUiDataEdit
        uiDataKey={getUiDataLeaseKey(LeaseContractCollateralsFieldPaths.TYPE)}
      />
    </Authorization>
  );
};

export const TotalAmountField = ({
  attributes,
  field,
  isSaveClicked,
}: CollateralEditFieldProps) => (
  <Authorization
    allow={isFieldAllowedToRead(
      attributes,
      LeaseContractCollateralsFieldPaths.TOTAL_AMOUNT,
    )}
  >
    <FormField
      disableTouched={isSaveClicked}
      fieldAttributes={getFieldAttributes(
        attributes,
        LeaseContractCollateralsFieldPaths.TOTAL_AMOUNT,
      )}
      name={`${field}.total_amount`}
      unit="€"
      overrideValues={{
        label: LeaseContractCollateralsFieldTitles.TOTAL_AMOUNT,
        required: true,
      }}
      enableUiDataEdit
      tooltipStyle={{
        right: 12,
      }}
      uiDataKey={getUiDataLeaseKey(
        LeaseContractCollateralsFieldPaths.TOTAL_AMOUNT,
      )}
    />
  </Authorization>
);

export const StartDateField = ({
  attributes,
  field,
  isSaveClicked,
}: CollateralEditFieldProps) => (
  <Authorization
    allow={isFieldAllowedToRead(
      attributes,
      LeaseContractCollateralsFieldPaths.START_DATE,
    )}
  >
    <FormField
      disableTouched={isSaveClicked}
      fieldAttributes={getFieldAttributes(
        attributes,
        LeaseContractCollateralsFieldPaths.START_DATE,
      )}
      name={`${field}.start_date`}
      overrideValues={{
        label: LeaseContractCollateralsFieldTitles.START_DATE,
        required: true,
      }}
      enableUiDataEdit
      uiDataKey={getUiDataLeaseKey(
        LeaseContractCollateralsFieldPaths.START_DATE,
      )}
    />
  </Authorization>
);

export const EndDateField = ({
  attributes,
  field,
  isSaveClicked,
}: CollateralEditFieldProps) => (
  <Authorization
    allow={isFieldAllowedToRead(
      attributes,
      LeaseContractCollateralsFieldPaths.END_DATE,
    )}
  >
    <FormField
      disableTouched={isSaveClicked}
      fieldAttributes={getFieldAttributes(
        attributes,
        LeaseContractCollateralsFieldPaths.END_DATE,
      )}
      name={`${field}.end_date`}
      overrideValues={{
        label: LeaseContractCollateralsFieldTitles.END_DATE,
      }}
      enableUiDataEdit
      uiDataKey={getUiDataLeaseKey(LeaseContractCollateralsFieldPaths.END_DATE)}
    />
  </Authorization>
);

export const ReturnedDateField = ({
  attributes,
  field,
  isSaveClicked,
}: CollateralEditFieldProps) => {
  const returned_date = useFieldValue(`${field}.returned_date`);

  return (
    <>
      <Authorization
        allow={isFieldAllowedToRead(
          attributes,
          LeaseContractCollateralsFieldPaths.RETURNED_DATE,
        )}
      >
        <FormField
          disableTouched={isSaveClicked}
          fieldAttributes={getFieldAttributes(
            attributes,
            LeaseContractCollateralsFieldPaths.RETURNED_DATE,
          )}
          name={`${field}.returned_date`}
          overrideValues={{
            label: LeaseContractCollateralsFieldTitles.RETURNED_DATE,
          }}
          enableUiDataEdit
          uiDataKey={getUiDataLeaseKey(
            LeaseContractCollateralsFieldPaths.RETURNED_DATE,
          )}
        />
      </Authorization>
      {returned_date && (
        <ReturnedByField
          attributes={attributes}
          field={field}
          isSaveClicked={isSaveClicked}
        />
      )}
    </>
  );
};

export const ReturnedByField = ({
  attributes,
  field,
  isSaveClicked,
}: CollateralEditFieldProps) => (
  <Authorization
    allow={isFieldAllowedToRead(
      attributes,
      LeaseContractCollateralsFieldPaths.RETURNED_BY,
    )}
  >
    <FormField
      disableTouched={isSaveClicked}
      fieldAttributes={getFieldAttributes(
        attributes,
        LeaseContractCollateralsFieldPaths.RETURNED_BY,
      )}
      name={`${field}.returned_by`}
      overrideValues={{
        label: LeaseContractCollateralsFieldTitles.RETURNED_BY,
        fieldType: FieldTypes.USER,
      }}
      enableUiDataEdit
      uiDataKey={getUiDataLeaseKey(
        LeaseContractCollateralsFieldPaths.RETURNED_BY,
      )}
    />
  </Authorization>
);

export const NoteField = ({
  attributes,
  field,
  isSaveClicked,
}: CollateralEditFieldProps) => (
  <Authorization
    allow={isFieldAllowedToRead(
      attributes,
      LeaseContractCollateralsFieldPaths.NOTE,
    )}
  >
    <FormField
      disableTouched={isSaveClicked}
      fieldAttributes={getFieldAttributes(
        attributes,
        LeaseContractCollateralsFieldPaths.NOTE,
      )}
      name={`${field}.note`}
      overrideValues={{
        label: LeaseContractCollateralsFieldTitles.NOTE,
      }}
      enableUiDataEdit
      uiDataKey={getUiDataLeaseKey(LeaseContractCollateralsFieldPaths.NOTE)}
    />
  </Authorization>
);

export const ThirdPartyPledgeField = ({
  attributes,
  field,
  isSaveClicked,
}: CollateralEditFieldProps) => {
  const checked = useFieldValue(`${field}.third_party_pledge`);
  return (
    <>
      <Authorization
        allow={isFieldAllowedToRead(
          attributes,
          LeaseContractCollateralsFieldPaths.THIRD_PARTY_PLEDGE,
        )}
      >
        <FormField
          disableTouched={isSaveClicked}
          fieldAttributes={getFieldAttributes(
            attributes,
            LeaseContractCollateralsFieldPaths.THIRD_PARTY_PLEDGE,
          )}
          name={`${field}.third_party_pledge`}
          overrideValues={{
            label: LeaseContractCollateralsFieldTitles.THIRD_PARTY_PLEDGE,
            required: true,
            defaultValue: false,
          }}
          enableUiDataEdit
          uiDataKey={getUiDataLeaseKey(
            LeaseContractCollateralsFieldPaths.THIRD_PARTY_PLEDGE,
          )}
        />
      </Authorization>
      {checked && (
        <>
          <ThirdPartyPledgorNameField
            attributes={attributes}
            field={field}
            isSaveClicked={isSaveClicked}
          />
          <ThirdPartyPledgorBusinessIdField
            attributes={attributes}
            field={field}
            isSaveClicked={isSaveClicked}
          />
        </>
      )}
    </>
  );
};

const ThirdPartyPledgorNameField = ({
  attributes,
  field,
  isSaveClicked,
}: CollateralEditFieldProps) => (
  <Authorization
    allow={isFieldAllowedToRead(
      attributes,
      LeaseContractCollateralsFieldPaths.THIRD_PARTY_PLEDGOR_NAME,
    )}
  >
    <FormField
      disableTouched={isSaveClicked}
      fieldAttributes={getFieldAttributes(
        attributes,
        LeaseContractCollateralsFieldPaths.THIRD_PARTY_PLEDGOR_NAME,
      )}
      name={`${field}.third_party_pledgor_name`}
      overrideValues={{
        label: LeaseContractCollateralsFieldTitles.THIRD_PARTY_PLEDGOR_NAME,
      }}
      enableUiDataEdit
      uiDataKey={getUiDataLeaseKey(
        LeaseContractCollateralsFieldPaths.THIRD_PARTY_PLEDGOR_NAME,
      )}
    />
  </Authorization>
);

const ThirdPartyPledgorBusinessIdField = ({
  attributes,
  field,
  isSaveClicked,
}: CollateralEditFieldProps) => (
  <Authorization
    allow={isFieldAllowedToRead(
      attributes,
      LeaseContractCollateralsFieldPaths.THIRD_PARTY_PLEDGOR_BUSINESS_ID,
    )}
  >
    <FormField
      disableTouched={isSaveClicked}
      fieldAttributes={getFieldAttributes(
        attributes,
        LeaseContractCollateralsFieldPaths.THIRD_PARTY_PLEDGOR_BUSINESS_ID,
      )}
      validate={companyIdentifierValidator}
      name={`${field}.third_party_pledgor_business_id`}
      overrideValues={{
        label:
          LeaseContractCollateralsFieldTitles.THIRD_PARTY_PLEDGOR_BUSINESS_ID,
      }}
      enableUiDataEdit
      uiDataKey={getUiDataLeaseKey(
        LeaseContractCollateralsFieldPaths.THIRD_PARTY_PLEDGOR_BUSINESS_ID,
      )}
    />
  </Authorization>
);

export const PledgorFields = ({
  attributes,
  field,
  isSaveClicked,
}: CollateralEditFieldProps) => (
  <>
    <PledgorNameField
      attributes={attributes}
      field={field}
      isSaveClicked={isSaveClicked}
    />
    <PledgorIdentificationNumberField
      attributes={attributes}
      field={field}
      isSaveClicked={isSaveClicked}
    />
    <PledgorBusinessIdField
      attributes={attributes}
      field={field}
      isSaveClicked={isSaveClicked}
    />
  </>
);

const PledgorNameField = ({
  attributes,
  field,
  isSaveClicked,
}: CollateralEditFieldProps) => (
  <Authorization
    allow={isFieldAllowedToRead(
      attributes,
      LeaseContractCollateralsFieldPaths.PLEDGOR_NAME,
    )}
  >
    <FormField
      disableTouched={isSaveClicked}
      fieldAttributes={getFieldAttributes(
        attributes,
        LeaseContractCollateralsFieldPaths.PLEDGOR_NAME,
      )}
      name={`${field}.pledgor_name`}
      overrideValues={{
        label: LeaseContractCollateralsFieldTitles.PLEDGOR_NAME,
      }}
      enableUiDataEdit
      uiDataKey={getUiDataLeaseKey(
        LeaseContractCollateralsFieldPaths.PLEDGOR_NAME,
      )}
    />
  </Authorization>
);

const PledgorIdentificationNumberField = ({
  attributes,
  field,
  isSaveClicked,
}: CollateralEditFieldProps) => (
  <Authorization
    allow={isFieldAllowedToRead(
      attributes,
      LeaseContractCollateralsFieldPaths.PLEDGOR_NATIONAL_IDENTIFICATION_NUMBER,
    )}
  >
    <FormField
      disableTouched={isSaveClicked}
      fieldAttributes={getFieldAttributes(
        attributes,
        LeaseContractCollateralsFieldPaths.PLEDGOR_NATIONAL_IDENTIFICATION_NUMBER,
      )}
      validate={personalIdentifierValidator}
      name={`${field}.pledgor_national_identification_number`}
      overrideValues={{
        label:
          LeaseContractCollateralsFieldTitles.PLEDGOR_NATIONAL_IDENTIFICATION_NUMBER,
      }}
      enableUiDataEdit
      uiDataKey={getUiDataLeaseKey(
        LeaseContractCollateralsFieldPaths.PLEDGOR_NATIONAL_IDENTIFICATION_NUMBER,
      )}
    />
  </Authorization>
);

const PledgorBusinessIdField = ({
  attributes,
  field,
  isSaveClicked,
}: CollateralEditFieldProps) => (
  <Authorization
    allow={isFieldAllowedToRead(
      attributes,
      LeaseContractCollateralsFieldPaths.PLEDGOR_BUSINESS_ID,
    )}
  >
    <FormField
      disableTouched={isSaveClicked}
      fieldAttributes={getFieldAttributes(
        attributes,
        LeaseContractCollateralsFieldPaths.PLEDGOR_BUSINESS_ID,
      )}
      validate={companyIdentifierValidator}
      name={`${field}.pledgor_business_id`}
      overrideValues={{
        label: LeaseContractCollateralsFieldTitles.PLEDGOR_BUSINESS_ID,
      }}
      enableUiDataEdit
      uiDataKey={getUiDataLeaseKey(
        LeaseContractCollateralsFieldPaths.PLEDGOR_BUSINESS_ID,
      )}
    />
  </Authorization>
);

export const ContractPartyField = ({
  attributes,
  field,
  isSaveClicked,
}: CollateralEditFieldProps) => (
  <Authorization
    allow={isFieldAllowedToRead(
      attributes,
      LeaseContractCollateralsFieldPaths.CONTRACT_PARTY,
    )}
  >
    <FormField
      disableTouched={isSaveClicked}
      fieldAttributes={getFieldAttributes(
        attributes,
        LeaseContractCollateralsFieldPaths.CONTRACT_PARTY,
      )}
      name={`${field}.contract_party`}
      overrideValues={{
        label: LeaseContractCollateralsFieldTitles.CONTRACT_PARTY,
      }}
      enableUiDataEdit
      uiDataKey={getUiDataLeaseKey(
        LeaseContractCollateralsFieldPaths.CONTRACT_PARTY,
      )}
    />
  </Authorization>
);

export const ContractPartyIdentifierField = ({
  attributes,
  field,
  isSaveClicked,
}: CollateralEditFieldProps) => {
  return (
    <>
      <Authorization
        allow={isFieldAllowedToRead(
          attributes,
          LeaseContractCollateralsFieldPaths.CONTRACT_PARTY_NATIONAL_IDENTIFICATION_NUMBER,
        )}
      >
        <FormField
          disableTouched={isSaveClicked}
          fieldAttributes={getFieldAttributes(
            attributes,
            LeaseContractCollateralsFieldPaths.CONTRACT_PARTY_NATIONAL_IDENTIFICATION_NUMBER,
          )}
          //TODO: Validators don't work correctly!
          validate={personalIdentifierValidator}
          name={`${field}.contract_party_national_identification_number`}
          overrideValues={{
            label:
              LeaseContractCollateralsFieldTitles.CONTRACT_PARTY_NATIONAL_IDENTIFICATION_NUMBER,
          }}
          enableUiDataEdit
          uiDataKey={getUiDataLeaseKey(
            LeaseContractCollateralsFieldPaths.CONTRACT_PARTY_NATIONAL_IDENTIFICATION_NUMBER,
          )}
        />
      </Authorization>
      <Authorization
        allow={isFieldAllowedToRead(
          attributes,
          LeaseContractCollateralsFieldPaths.CONTRACT_PARTY_BUSINESS_ID,
        )}
      >
        <FormField
          disableTouched={isSaveClicked}
          fieldAttributes={getFieldAttributes(
            attributes,
            LeaseContractCollateralsFieldPaths.CONTRACT_PARTY_BUSINESS_ID,
          )}
          validate={companyIdentifierValidator}
          name={`${field}.contract_party_business_id`}
          overrideValues={{
            label:
              LeaseContractCollateralsFieldTitles.CONTRACT_PARTY_BUSINESS_ID,
          }}
          enableUiDataEdit
          uiDataKey={getUiDataLeaseKey(
            LeaseContractCollateralsFieldPaths.CONTRACT_PARTY_BUSINESS_ID,
          )}
        />
      </Authorization>
    </>
  );
};

export const AccountNumberField = ({
  attributes,
  field,
  isSaveClicked,
}: CollateralEditFieldProps) => (
  <Authorization
    allow={isFieldAllowedToRead(
      attributes,
      LeaseContractCollateralsFieldPaths.ACCOUNT_NUMBER,
    )}
  >
    <FormField
      disableTouched={isSaveClicked}
      fieldAttributes={getFieldAttributes(
        attributes,
        LeaseContractCollateralsFieldPaths.ACCOUNT_NUMBER,
      )}
      name={`${field}.account_number`}
      overrideValues={{
        label: LeaseContractCollateralsFieldTitles.ACCOUNT_NUMBER,
      }}
      enableUiDataEdit
      uiDataKey={getUiDataLeaseKey(
        LeaseContractCollateralsFieldPaths.ACCOUNT_NUMBER,
      )}
    />
  </Authorization>
);

export const DocumentTypeField = ({
  attributes,
  field,
  isSaveClicked,
}: CollateralEditFieldProps) => (
  <Authorization
    allow={isFieldAllowedToRead(
      attributes,
      LeaseContractCollateralsFieldPaths.DOCUMENT_TYPE,
    )}
  >
    <FormField
      disableTouched={isSaveClicked}
      fieldAttributes={getFieldAttributes(
        attributes,
        LeaseContractCollateralsFieldPaths.DOCUMENT_TYPE,
      )}
      name={`${field}.document_type`}
      overrideValues={{
        label: LeaseContractCollateralsFieldTitles.DOCUMENT_TYPE,
      }}
      enableUiDataEdit
      uiDataKey={getUiDataLeaseKey(
        LeaseContractCollateralsFieldPaths.DOCUMENT_TYPE,
      )}
    />
  </Authorization>
);
