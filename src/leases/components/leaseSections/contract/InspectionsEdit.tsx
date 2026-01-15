import React, { ReactElement } from "react";
import { useSelector } from "react-redux";
import { Row, Column } from "react-foundation";
import { FieldArray } from "react-final-form-arrays";
import { Form } from "react-final-form";
import { FormApi } from "final-form";
import { ActionTypes, AppConsumer } from "@/app/AppContext";
import AddButtonSecondary from "@/components/form/AddButtonSecondary";
import Authorization from "@/components/authorization/Authorization";
import { getLoggedInUser } from "@/auth/selectors";
import BoxItemContainer from "@/components/content/BoxItemContainer";
import FormText from "@/components/form/FormText";
import GreenBox from "@/components/content/GreenBox";
import InspectionItemEdit from "./InspectionItemEdit";
import { ConfirmationModalTexts, FormNames } from "@/enums";
import { ButtonColors } from "@/components/enums";
import { LeaseInspectionsFieldPaths } from "@/leases/enums";
import { UsersPermissions } from "@/usersPermissions/enums";
import { hasPermissions, isFieldAllowedToEdit } from "@/util/helpers";
import { getAttributes as getLeaseAttributes } from "@/leases/selectors";
import { getUsersPermissions } from "@/usersPermissions/selectors";
import get from "lodash/get";
import type { Attributes } from "types";
import type { UsersPermissions as UsersPermissionsType } from "@/usersPermissions/types";
type InspectionsProps = {
  fields: any;
  leaseAttributes: Attributes;
  usersPermissions: UsersPermissionsType;
  username: String;
};

const Inspections = ({
  fields,
  leaseAttributes,
  username,
  usersPermissions,
}: InspectionsProps): ReactElement => {
  const handleAdd = () => {
    fields.push({
      inspector: username,
    });
  };

  if (!fields || !fields.length) {
    return (
      <Authorization
        allow={isFieldAllowedToEdit(
          leaseAttributes,
          LeaseInspectionsFieldPaths.INSPECTIONS,
        )}
        errorComponent={
          <FormText className="no-margin">
            Ei tarkastuksia tai huomautuksia
          </FormText>
        }
      >
        <Row>
          <Column>
            <AddButtonSecondary
              style={{
                marginTop: 0,
              }}
              label="Lisää tarkastus"
              onClick={handleAdd}
            />
          </Column>
        </Row>
      </Authorization>
    );
  }

  return (
    <AppConsumer>
      {({ dispatch }) => {
        return (
          <GreenBox>
            {fields && !!fields.length && (
              <BoxItemContainer>
                {fields.map((field, index) => {
                  const handleRemove = () => {
                    dispatch({
                      type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                      confirmationFunction: () => {
                        fields.remove(index);
                      },
                      confirmationModalButtonClassName: ButtonColors.ALERT,
                      confirmationModalButtonText:
                        ConfirmationModalTexts.DELETE_INSPECTION.BUTTON,
                      confirmationModalLabel:
                        ConfirmationModalTexts.DELETE_INSPECTION.LABEL,
                      confirmationModalTitle:
                        ConfirmationModalTexts.DELETE_INSPECTION.TITLE,
                    });
                  };

                  return (
                    <InspectionItemEdit
                      key={index}
                      field={field}
                      onRemove={handleRemove}
                      inspectionId={fields.value?.[index]?.id}
                    />
                  );
                })}
              </BoxItemContainer>
            )}

            <Authorization
              allow={hasPermissions(
                usersPermissions,
                UsersPermissions.ADD_INSPECTION,
              )}
            >
              <Row>
                <Column>
                  <AddButtonSecondary
                    label="Lisää tarkastus"
                    onClick={handleAdd}
                  />
                </Column>
              </Row>
            </Authorization>
          </GreenBox>
        );
      }}
    </AppConsumer>
  );
};

type Props = {
  formApi: FormApi;
};

const InspectionsEdit: React.FC<Props> = ({ formApi }) => {
  const usersPermissions = useSelector(getUsersPermissions);
  const leaseAttributes = useSelector(getLeaseAttributes);
  const user = useSelector(getLoggedInUser);

  return (
    <Form form={formApi} onSubmit={formApi.submit}>
      {() => (
        <form>
          <GreenBox>
            <FieldArray name="inspections">
              {(fieldArrayProps) =>
                Inspections({
                  ...fieldArrayProps,
                  leaseAttributes: leaseAttributes,
                  usersPermissions: usersPermissions,
                  username: get(user, "profile.name"),
                })
              }
            </FieldArray>
          </GreenBox>
        </form>
      )}
    </Form>
  );
};

const formName = FormNames.LEASE_INSPECTIONS;
export default InspectionsEdit;
