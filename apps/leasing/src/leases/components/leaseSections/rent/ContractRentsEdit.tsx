import React from "react";
import { useSelector } from "react-redux";
import { Row, Column } from "@/components/grid/Grid";
import { ActionTypes, AppConsumer } from "@/app/AppContext";
import AddButtonSecondary from "@/components/form/AddButtonSecondary";
import Authorization from "@/components/authorization/Authorization";
import BoxItemContainer from "@/components/content/BoxItemContainer";
import ContractRentEdit from "./ContractRentEdit";
import FormText from "@/components/form/FormText";
import { ConfirmationModalTexts } from "@/enums";
import { ButtonColors } from "@/components/enums";
import { UsersPermissions } from "@/usersPermissions/enums";
import { hasPermissions } from "@/util/helpers";
import { getUsersPermissions } from "@/usersPermissions/selectors";
import type { UsersPermissions as UsersPermissionsType } from "@/usersPermissions/types";
type Props = {
  fields: any;
  rentField: string;
  rentType: string;
};

const ContractRentsEdit = ({ fields, rentField, rentType }: Props) => {
  const usersPermissions: UsersPermissionsType =
    useSelector(getUsersPermissions);

  const handleAdd = () => {
    fields.push({
      period: "per_year",
    });
  };

  if (
    !hasPermissions(usersPermissions, UsersPermissions.ADD_CONTRACTRENT) &&
    (!fields || !fields.length)
  ) {
    return <FormText>Ei sopimusvuokria</FormText>;
  }

  return (
    <AppConsumer>
      {({ dispatch }) => {
        return (
          <>
            {fields && !!fields.length && (
              <BoxItemContainer>
                {fields.map((rent, index) => {
                  const handleRemove = () => {
                    dispatch({
                      type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                      confirmationFunction: () => {
                        fields.remove(index);
                      },
                      confirmationModalButtonClassName: ButtonColors.ALERT,
                      confirmationModalButtonText:
                        ConfirmationModalTexts.DELETE_CONTRACT_RENT.BUTTON,
                      confirmationModalLabel:
                        ConfirmationModalTexts.DELETE_CONTRACT_RENT.LABEL,
                      confirmationModalTitle:
                        ConfirmationModalTexts.DELETE_CONTRACT_RENT.TITLE,
                    });
                  };

                  return (
                    <ContractRentEdit
                      key={index}
                      field={rent}
                      onRemove={handleRemove}
                      rentField={rentField}
                      rentType={rentType}
                      showRemove={!!fields && fields.length > 1}
                    />
                  );
                })}
              </BoxItemContainer>
            )}

            <Authorization
              allow={hasPermissions(
                usersPermissions,
                UsersPermissions.ADD_CONTRACTRENT,
              )}
            >
              <Row>
                <Column>
                  <AddButtonSecondary
                    className={!fields || !fields.length ? "no-top-margin" : ""}
                    label="Lisää sopimusvuokra"
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

export default ContractRentsEdit;
