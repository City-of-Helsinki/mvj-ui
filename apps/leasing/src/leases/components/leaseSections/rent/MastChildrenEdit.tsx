import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { Row, Column } from "react-foundation";
import Authorization from "@/components/authorization/Authorization";
import FormField from "@/components/form/final-form/FormField";
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
import { useFieldValue } from "@/components/helpers";
type Props = {
  parentField: string;
  index: number;
  fieldsDisabled: boolean;
};

const MastChildrenEdit: React.FC<Props> = ({
  parentField,
  index,
  fieldsDisabled,
}) => {
  const isSaveClicked = useSelector(getIsSaveClicked);
  const leaseAttributes: Attributes = useSelector(getLeaseAttributes);
  const area = useFieldValue(`${parentField}.children[${index}].area`);

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
            <FormField
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

export default MastChildrenEdit;
