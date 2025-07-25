import React, { Fragment } from "react";
import { connect } from "react-redux";
import { formValueSelector } from "redux-form";
import { Row, Column } from "react-foundation";
import Authorization from "@/components/authorization/Authorization";
import FormFieldLegacy from "@/components/form/FormFieldLegacy";
import FormText from "@/components/form/FormText";
import {
  isFieldAllowedToRead,
  getFieldAttributes,
  formatNumber,
  isEmptyValue,
} from "@/util/helpers";
import {
  getAttributes as getLeaseAttributes,
  getIsSaveClicked,
} from "@/leases/selectors";
import { LeaseBasisOfRentsFieldPaths } from "@/leases/enums";
import type { Attributes } from "types";
import { mastCalculatorRent } from "@/leases/helpers";
type Props = {
  formName: string;
  parentField: string;
  isSaveClicked: boolean;
  leaseAttributes: Attributes;
  index: number;
  area: number;
  fieldsDisabled: boolean;
};

const MastChildrenEdit = ({
  isSaveClicked,
  parentField,
  leaseAttributes,
  index,
  area,
  fieldsDisabled,
}: Props) => {
  const rent = mastCalculatorRent(index, area);
  return (
    <Fragment key={index}>
      <Row>
        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={
              isFieldAllowedToRead(
                leaseAttributes,
                LeaseBasisOfRentsFieldPaths.AREA,
              ) &&
              isFieldAllowedToRead(
                leaseAttributes,
                LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA,
              )
            }
          >
            <>
              {index === 0 && <FormText>{`Laitekaappi`}</FormText>}
              {index === 1 && <FormText>{`Masto`}</FormText>}
            </>
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={isFieldAllowedToRead(
              leaseAttributes,
              LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA,
            )}
          >
            <>
              {index === 0 && <FormText>{`1000,00 €`}</FormText>}
              {index === 1 && <FormText>{`600,00 €`}</FormText>}
            </>
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={
              isFieldAllowedToRead(
                leaseAttributes,
                LeaseBasisOfRentsFieldPaths.AREA,
              ) &&
              isFieldAllowedToRead(
                leaseAttributes,
                LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA,
              )
            }
          ></Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={isFieldAllowedToRead(
              leaseAttributes,
              LeaseBasisOfRentsFieldPaths.AREA,
            )}
          >
            <FormFieldLegacy
              disableTouched={isSaveClicked}
              fieldAttributes={getFieldAttributes(
                leaseAttributes,
                LeaseBasisOfRentsFieldPaths.AREA,
              )}
              name={`${parentField}.children[${index}].area`}
              invisibleLabel={true}
              overrideValues={{
                label: "Ala/korkeus",
              }}
              disabled={fieldsDisabled}
            />
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={
              isFieldAllowedToRead(
                leaseAttributes,
                LeaseBasisOfRentsFieldPaths.AREA,
              ) &&
              isFieldAllowedToRead(
                leaseAttributes,
                LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA,
              )
            }
          >
            <>
              {index === 0 && (
                <FormText>{`k-m${String.fromCharCode(178)}`}</FormText>
              )}
              {index === 1 && <FormText>{`m`}</FormText>}
            </>
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={
              isFieldAllowedToRead(
                leaseAttributes,
                LeaseBasisOfRentsFieldPaths.AREA,
              ) &&
              isFieldAllowedToRead(
                leaseAttributes,
                LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA,
              )
            }
          >
            <FormText>
              {!isEmptyValue(rent) ? `${formatNumber(rent)} €` : "-"}
            </FormText>
          </Authorization>
        </Column>
      </Row>
    </Fragment>
  );
};

export default connect((state, props: Props) => {
  const formName = props.formName;
  const selector = formValueSelector(formName);
  return {
    isSaveClicked: getIsSaveClicked(state),
    leaseAttributes: getLeaseAttributes(state),
    area: selector(state, `${props.parentField}.children[${props.index}].area`),
  };
})(MastChildrenEdit);
