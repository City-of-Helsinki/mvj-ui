import React, { useEffect, useRef } from "react";
import { useAppSelector } from "@/root/hooks";
import { Form } from "react-final-form";
import type { FormApi } from "final-form";
import { FieldArray } from "react-final-form-arrays";
import { Row, Column } from "@/components/grid/Grid";
import Authorization from "@/components/authorization/Authorization";
import FormField from "@/components/form/final-form/FormField";
import GreenBox from "@/components/content/GreenBox";
import LeaseItemsEdit from "./LeaseItemsEdit";
import SubTitle from "@/components/content/SubTitle";
import { FieldTypes } from "@/enums";
import {
  InfillDevelopmentCompensationFieldPaths,
  InfillDevelopmentCompensationFieldTitles,
  InfillDevelopmentCompensationLeasesFieldPaths,
  InfillDevelopmentCompensationLeasesFieldTitles,
} from "@/infillDevelopment/enums";
import { getUiDataInfillDevelopmentKey } from "@/uiData/helpers";
import { getFieldAttributes, isFieldAllowedToRead } from "@/util/helpers";
import {
  getAttributes as getInfillDevelopmentAttributes,
  getIsSaveClicked,
} from "@/infillDevelopment/selectors";
import { referenceNumber } from "@/components/form/validations";
import type { Attributes } from "types";
import type { InfillDevelopment } from "@/infillDevelopment/types";
type Props = {
  formApi: FormApi;
  infillDevelopment: InfillDevelopment;
  isFocusedOnMount?: boolean;
};

const InfillDevelopmentForm = ({
  formApi,
  infillDevelopment,
  isFocusedOnMount,
}: Props) => {
  const firstField = useRef<any>(null);
  const infillDevelopmentAttributes: Attributes = useAppSelector(
    getInfillDevelopmentAttributes,
  );
  const isSaveClicked = useAppSelector(getIsSaveClicked);

  useEffect(() => {
    if (isFocusedOnMount && firstField.current) {
      firstField.current.focus();
    }
  }, [isFocusedOnMount]);

  const setRefForFirstField = (element: any) => {
    firstField.current = element;
  };

  return (
    <Form form={formApi} onSubmit={formApi.submit}>
      {({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <GreenBox>
            <Row>
              <Column small={6} medium={4} large={2}>
                <Authorization
                  allow={isFieldAllowedToRead(
                    infillDevelopmentAttributes,
                    InfillDevelopmentCompensationFieldPaths.NAME,
                  )}
                >
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={getFieldAttributes(
                      infillDevelopmentAttributes,
                      InfillDevelopmentCompensationFieldPaths.NAME,
                    )}
                    name="name"
                    setRefForField={setRefForFirstField}
                    overrideValues={{
                      label: InfillDevelopmentCompensationFieldTitles.NAME,
                    }}
                    enableUiDataEdit
                    uiDataKey={getUiDataInfillDevelopmentKey(
                      InfillDevelopmentCompensationFieldPaths.NAME,
                    )}
                  />
                </Authorization>
              </Column>
              <Column small={6} medium={4} large={2}>
                <Authorization
                  allow={isFieldAllowedToRead(
                    infillDevelopmentAttributes,
                    InfillDevelopmentCompensationFieldPaths.DETAILED_PLAN_IDENTIFIER,
                  )}
                >
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={getFieldAttributes(
                      infillDevelopmentAttributes,
                      InfillDevelopmentCompensationFieldPaths.DETAILED_PLAN_IDENTIFIER,
                    )}
                    name="detailed_plan_identifier"
                    overrideValues={{
                      label:
                        InfillDevelopmentCompensationFieldTitles.DETAILED_PLAN_IDENTIFIER,
                    }}
                    enableUiDataEdit
                    uiDataKey={getUiDataInfillDevelopmentKey(
                      InfillDevelopmentCompensationFieldPaths.DETAILED_PLAN_IDENTIFIER,
                    )}
                  />
                </Authorization>
              </Column>
              <Column small={6} medium={4} large={2}>
                <Authorization
                  allow={isFieldAllowedToRead(
                    infillDevelopmentAttributes,
                    InfillDevelopmentCompensationFieldPaths.REFERENCE_NUMBER,
                  )}
                >
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={getFieldAttributes(
                      infillDevelopmentAttributes,
                      InfillDevelopmentCompensationFieldPaths.REFERENCE_NUMBER,
                    )}
                    name="reference_number"
                    validate={referenceNumber}
                    overrideValues={{
                      label:
                        InfillDevelopmentCompensationFieldTitles.REFERENCE_NUMBER,
                      fieldType: FieldTypes.REFERENCE_NUMBER,
                    }}
                    enableUiDataEdit
                    uiDataKey={getUiDataInfillDevelopmentKey(
                      InfillDevelopmentCompensationFieldPaths.REFERENCE_NUMBER,
                    )}
                  />
                </Authorization>
              </Column>
              <Column small={6} medium={4} large={2}>
                <Authorization
                  allow={isFieldAllowedToRead(
                    infillDevelopmentAttributes,
                    InfillDevelopmentCompensationFieldPaths.STATE,
                  )}
                >
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={getFieldAttributes(
                      infillDevelopmentAttributes,
                      InfillDevelopmentCompensationFieldPaths.STATE,
                    )}
                    name="state"
                    overrideValues={{
                      label: InfillDevelopmentCompensationFieldTitles.STATE,
                    }}
                    enableUiDataEdit
                    uiDataKey={getUiDataInfillDevelopmentKey(
                      InfillDevelopmentCompensationFieldPaths.STATE,
                    )}
                  />
                </Authorization>
              </Column>
            </Row>
            <Row>
              <Column small={6} medium={4} large={2}>
                <Authorization
                  allow={isFieldAllowedToRead(
                    infillDevelopmentAttributes,
                    InfillDevelopmentCompensationFieldPaths.USER,
                  )}
                >
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={getFieldAttributes(
                      infillDevelopmentAttributes,
                      InfillDevelopmentCompensationFieldPaths.USER,
                    )}
                    name="user"
                    overrideValues={{
                      fieldType: FieldTypes.USER,
                      label: InfillDevelopmentCompensationFieldTitles.USER,
                    }}
                    enableUiDataEdit
                    uiDataKey={getUiDataInfillDevelopmentKey(
                      InfillDevelopmentCompensationFieldPaths.USER,
                    )}
                  />
                </Authorization>
              </Column>
              <Column small={6} medium={4} large={2}>
                <Authorization
                  allow={isFieldAllowedToRead(
                    infillDevelopmentAttributes,
                    InfillDevelopmentCompensationFieldPaths.LEASE_CONTRACT_CHANGE_DATE,
                  )}
                >
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={getFieldAttributes(
                      infillDevelopmentAttributes,
                      InfillDevelopmentCompensationFieldPaths.LEASE_CONTRACT_CHANGE_DATE,
                    )}
                    name="lease_contract_change_date"
                    overrideValues={{
                      label:
                        InfillDevelopmentCompensationFieldTitles.LEASE_CONTRACT_CHANGE_DATE,
                    }}
                    enableUiDataEdit
                    uiDataKey={getUiDataInfillDevelopmentKey(
                      InfillDevelopmentCompensationFieldPaths.LEASE_CONTRACT_CHANGE_DATE,
                    )}
                  />
                </Authorization>
              </Column>
              <Column small={12} medium={4} large={8}>
                <Authorization
                  allow={isFieldAllowedToRead(
                    infillDevelopmentAttributes,
                    InfillDevelopmentCompensationFieldPaths.NOTE,
                  )}
                >
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={getFieldAttributes(
                      infillDevelopmentAttributes,
                      InfillDevelopmentCompensationFieldPaths.NOTE,
                    )}
                    name="note"
                    overrideValues={{
                      label: InfillDevelopmentCompensationFieldTitles.NOTE,
                    }}
                    enableUiDataEdit
                    uiDataKey={getUiDataInfillDevelopmentKey(
                      InfillDevelopmentCompensationFieldPaths.NOTE,
                    )}
                  />
                </Authorization>
              </Column>
            </Row>

            <Authorization
              allow={isFieldAllowedToRead(
                infillDevelopmentAttributes,
                InfillDevelopmentCompensationLeasesFieldPaths.INFILL_DEVELOPMENT_COMPENSATION_LEASES,
              )}
            >
              <>
                <SubTitle
                  enableUiDataEdit
                  uiDataKey={getUiDataInfillDevelopmentKey(
                    InfillDevelopmentCompensationLeasesFieldPaths.INFILL_DEVELOPMENT_COMPENSATION_LEASES,
                  )}
                >
                  {
                    InfillDevelopmentCompensationLeasesFieldTitles.INFILL_DEVELOPMENT_COMPENSATION_LEASES
                  }
                </SubTitle>
                <FieldArray name="infill_development_compensation_leases">
                  {({ fields }) => (
                    <LeaseItemsEdit
                      fields={fields}
                      infillDevelopment={infillDevelopment}
                      isSaveClicked={isSaveClicked}
                    />
                  )}
                </FieldArray>
              </>
            </Authorization>
          </GreenBox>
        </form>
      )}
    </Form>
  );
};

export default InfillDevelopmentForm;
