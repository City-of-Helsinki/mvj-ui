import React from "react";
import { connect } from "react-redux";
import { reduxForm } from "redux-form";
import flowRight from "lodash/flowRight";
import { Row, Column } from "react-foundation";
import Authorization from "@/components/authorization/Authorization";
import FormFieldLegacy from "@/components/form/FormFieldLegacy";
import { FormNames } from "@/enums";
import {
  LeaseRentAdjustmentsFieldPaths,
  LeaseRentAdjustmentsFieldTitles,
} from "@/leases/enums";
import { validateSteppedDiscountForm } from "@/leases/formValidators";
import { getUiDataLeaseKey } from "@/uiData/helpers";
import { getFieldAttributes, isFieldAllowedToEdit } from "@/util/helpers";
import { getAttributes as getLeaseAttributes } from "@/leases/selectors";
import type { Attributes } from "types";
type Props = {
  decisionOptions: Array<Record<string, any>>;
  leaseAttributes: Attributes;
};

const SteppedDiscountForm = ({ decisionOptions, leaseAttributes }: Props) => {
  return (
    <div>
      <Row>
        <Column small={6} medium={4} large={4}>
          <Authorization
            allow={isFieldAllowedToEdit(
              leaseAttributes,
              LeaseRentAdjustmentsFieldPaths.INTENDED_USE,
            )}
          >
            <FormFieldLegacy
              fieldAttributes={getFieldAttributes(
                leaseAttributes,
                LeaseRentAdjustmentsFieldPaths.INTENDED_USE,
              )}
              name="intended_use"
              overrideValues={{
                label: LeaseRentAdjustmentsFieldTitles.INTENDED_USE,
              }}
              enableUiDataEdit
              uiDataKey={getUiDataLeaseKey(
                LeaseRentAdjustmentsFieldPaths.INTENDED_USE,
              )}
            />
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={isFieldAllowedToEdit(
              leaseAttributes,
              LeaseRentAdjustmentsFieldPaths.START_DATE,
            )}
          >
            <FormFieldLegacy
              fieldAttributes={{
                ...getFieldAttributes(
                  leaseAttributes,
                  LeaseRentAdjustmentsFieldPaths.START_DATE,
                ),
                required: true,
              }}
              name="start_date"
              overrideValues={{
                label: LeaseRentAdjustmentsFieldTitles.START_DATE,
              }}
              enableUiDataEdit
              uiDataKey={getUiDataLeaseKey(
                LeaseRentAdjustmentsFieldPaths.START_DATE,
              )}
            />
          </Authorization>
        </Column>
      </Row>
      <Row>
        <Authorization
          allow={isFieldAllowedToEdit(
            leaseAttributes,
            LeaseRentAdjustmentsFieldPaths.FULL_AMOUNT,
          )}
        >
          <>
            <Column small={6} medium={4} large={4}>
              <FormFieldLegacy
                fieldAttributes={{
                  max_digits: 10,
                  read_only: false,
                  required: true,
                  type: "decimal",
                }}
                name="percantage_beginning"
                overrideValues={{
                  label: LeaseRentAdjustmentsFieldTitles.PERCANTAGE_BEGINNING,
                }}
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormFieldLegacy
                fieldAttributes={{
                  max_digits: 3,
                  read_only: false,
                  required: true,
                  type: "number",
                }}
                name="number_of_years"
                overrideValues={{
                  label: LeaseRentAdjustmentsFieldTitles.NUMBER_OF_YEARS,
                }}
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormFieldLegacy
                fieldAttributes={{
                  max_digits: 10,
                  read_only: false,
                  required: true,
                  type: "decimal",
                }}
                name="percantage_final"
                overrideValues={{
                  label: LeaseRentAdjustmentsFieldTitles.PERCANTAGE_FINAL,
                }}
              />
            </Column>
          </>
        </Authorization>
      </Row>
      <Row>
        <Column small={6} medium={4} large={4}>
          <Authorization
            allow={isFieldAllowedToEdit(
              leaseAttributes,
              LeaseRentAdjustmentsFieldPaths.DECISION,
            )}
          >
            <FormFieldLegacy
              fieldAttributes={getFieldAttributes(
                leaseAttributes,
                LeaseRentAdjustmentsFieldPaths.DECISION,
              )}
              name="decision"
              overrideValues={{
                label: LeaseRentAdjustmentsFieldTitles.DECISION,
                options: decisionOptions,
              }}
              enableUiDataEdit
              uiDataKey={getUiDataLeaseKey(
                LeaseRentAdjustmentsFieldPaths.DECISION,
              )}
            />
          </Authorization>
        </Column>
      </Row>
      <Row>
        <Column small={12}>
          <Authorization
            allow={isFieldAllowedToEdit(
              leaseAttributes,
              LeaseRentAdjustmentsFieldPaths.NOTE,
            )}
          >
            <FormFieldLegacy
              fieldAttributes={getFieldAttributes(
                leaseAttributes,
                LeaseRentAdjustmentsFieldPaths.NOTE,
              )}
              name="note"
              overrideValues={{
                label: LeaseRentAdjustmentsFieldTitles.NOTE,
              }}
              enableUiDataEdit
              uiDataKey={getUiDataLeaseKey(
                LeaseRentAdjustmentsFieldPaths.DECISION,
              )}
            />
          </Authorization>
        </Column>
      </Row>
    </div>
  );
};

export default flowRight(
  connect((state) => {
    return {
      leaseAttributes: getLeaseAttributes(state),
    };
  }),
  reduxForm({
    form: FormNames.LEASE_STEPPED_DISCOUNT,
    validate: validateSteppedDiscountForm,
  }),
)(SteppedDiscountForm) as React.ComponentType<any>;
