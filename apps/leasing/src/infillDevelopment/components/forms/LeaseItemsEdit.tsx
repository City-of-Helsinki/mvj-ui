import React, { ReactElement } from "react";
import { useAppSelector } from "@/root/hooks";
import { useFormState } from "react-final-form";
import { get } from "lodash-es";
import { Row, Column } from "@/components/grid/Grid";
import { ActionTypes, AppConsumer } from "@/app/AppContext";
import AddButtonSecondary from "@/components/form/AddButtonSecondary";
import Authorization from "@/components/authorization/Authorization";
import FormText from "@/components/form/FormText";
import LeaseItemEdit from "./LeaseItemEdit";
import { ConfirmationModalTexts } from "@/enums";
import { ButtonColors } from "@/components/enums";
import { UsersPermissions } from "@/usersPermissions/enums";
import { hasPermissions } from "@/util/helpers";
import { getUsersPermissions } from "@/usersPermissions/selectors";
import type { UsersPermissions as UsersPermissionsType } from "@/usersPermissions/types";
import type { InfillDevelopment } from "@/infillDevelopment/types";
type Props = {
  fields: any;
  infillDevelopment: InfillDevelopment;
  isSaveClicked: boolean;
};

const LeaseItemsEdit = ({
  fields,
  infillDevelopment,
  isSaveClicked,
}: Props): ReactElement => {
  const usersPermissions: UsersPermissionsType =
    useAppSelector(getUsersPermissions);
  const { values } = useFormState({
    subscription: {
      values: true,
    },
  });

  const handleAdd = () => {
    fields.push({});
  };

  return (
    <AppConsumer>
      {({ dispatch }) => {
        return (
          <>
            {!hasPermissions(
              usersPermissions,
              UsersPermissions.ADD_INFILLDEVELOPMENTCOMPENSATIONLEASE,
            ) &&
              (!fields || !fields.length) && (
                <FormText>Ei vuokrauksia</FormText>
              )}
            {!!fields &&
              !!fields.length &&
              fields.map((lease, index) => {
                const handleRemove = () => {
                  dispatch({
                    type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                    confirmationFunction: () => {
                      fields.remove(index);
                    },
                    confirmationModalButtonClassName: ButtonColors.ALERT,
                    confirmationModalButtonText:
                      ConfirmationModalTexts
                        .DELETE_INFILL_DEVELOPMENT_COMPENSATION_LEASE.BUTTON,
                    confirmationModalLabel:
                      ConfirmationModalTexts
                        .DELETE_INFILL_DEVELOPMENT_COMPENSATION_LEASE.LABEL,
                    confirmationModalTitle:
                      ConfirmationModalTexts
                        .DELETE_INFILL_DEVELOPMENT_COMPENSATION_LEASE.TITLE,
                  });
                };

                return (
                  <LeaseItemEdit
                    key={index}
                    compensationInvestment={get(
                      values,
                      `${lease}.compensation_investment_amount`,
                    )}
                    field={lease}
                    fields={fields}
                    infillDevelopment={infillDevelopment}
                    infillDevelopmentCompensationLeaseId={get(
                      values,
                      `${lease}.id`,
                    )}
                    index={index}
                    isSaveClicked={isSaveClicked}
                    leaseFieldValue={get(values, `${lease}.lease`) || {}}
                    leaseId={get(values, `${lease}.lease.value`)}
                    monetaryCompensation={get(
                      values,
                      `${lease}.monetary_compensation_amount`,
                    )}
                    onRemove={handleRemove}
                  />
                );
              })}

            <Authorization
              allow={hasPermissions(
                usersPermissions,
                UsersPermissions.ADD_INFILLDEVELOPMENTCOMPENSATIONLEASE,
              )}
            >
              <Row>
                <Column>
                  <AddButtonSecondary
                    label="Lisää vuokraus"
                    onClick={handleAdd}
                  />
                </Column>
              </Row>
            </Authorization>
          </>
        );
      }}
    </AppConsumer>
  );
};

export default LeaseItemsEdit;
