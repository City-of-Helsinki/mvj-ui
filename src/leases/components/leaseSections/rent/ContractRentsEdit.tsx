import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Row, Column } from "react-foundation";
import { ActionTypes, AppConsumer } from "/src/app/AppContext";
import AddButtonSecondary from "/src/components/form/AddButtonSecondary";
import Authorization from "/src/components/authorization/Authorization";
import BoxItemContainer from "/src/components/content/BoxItemContainer";
import ContractRentEdit from "./ContractRentEdit";
import FormText from "/src/components/form/FormText";
import FormTextTitle from "/src/components/form/FormTextTitle";
import { ConfirmationModalTexts } from "enums";
import { ButtonColors } from "/src/components/enums";
import { LeaseRentContractRentsFieldPaths, LeaseRentContractRentsFieldTitles, RentTypes } from "leases/enums";
import { Breakpoints } from "/src/foundation/enums";
import { UsersPermissions } from "usersPermissions/enums";
import { getUiDataLeaseKey } from "uiData/helpers";
import { hasPermissions, isFieldAllowedToRead, isFieldRequired } from "util/helpers";
import { getAttributes as getLeaseAttributes } from "leases/selectors";
import { getUsersPermissions } from "usersPermissions/selectors";
import type { Attributes } from "types";
import type { UsersPermissions as UsersPermissionsType } from "usersPermissions/types";
type Props = {
  fields: any;
  leaseAttributes: Attributes;
  rentField: string;
  rentType: string;
  usersPermissions: UsersPermissionsType;
};

const ContractRentsEdit = ({
  fields,
  leaseAttributes,
  rentField,
  rentType,
  usersPermissions
}: Props) => {
  const handleAdd = () => {
    fields.push({
      period: 'per_year'
    });
  };

  if (!hasPermissions(usersPermissions, UsersPermissions.ADD_CONTRACTRENT) && (!fields || !fields.length)) {
    return <FormText>Ei sopimusvuokria</FormText>;
  }

  return <AppConsumer>
      {({
      dispatch
    }) => {
      return <Fragment>
            {fields && !!fields.length && <BoxItemContainer>
                {fields.map((rent, index) => {
            const handleRemove = () => {
              dispatch({
                type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                confirmationFunction: () => {
                  fields.remove(index);
                },
                confirmationModalButtonClassName: ButtonColors.ALERT,
                confirmationModalButtonText: ConfirmationModalTexts.DELETE_CONTRACT_RENT.BUTTON,
                confirmationModalLabel: ConfirmationModalTexts.DELETE_CONTRACT_RENT.LABEL,
                confirmationModalTitle: ConfirmationModalTexts.DELETE_CONTRACT_RENT.TITLE
              });
            };

            return <ContractRentEdit key={index} field={rent} onRemove={handleRemove} rentField={rentField} rentType={rentType} showRemove={!!fields && fields.length > 1} />;
          })}
              </BoxItemContainer>}

            <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.ADD_CONTRACTRENT)}>
              <Row>
                <Column>
                  <AddButtonSecondary className={!fields || !fields.length ? 'no-top-margin' : ''} label='Lisää sopimusvuokra' onClick={handleAdd} />
                </Column>
              </Row>
            </Authorization>
          </Fragment>;
    }}
    </AppConsumer>;
};

export default connect(state => {
  return {
    leaseAttributes: getLeaseAttributes(state),
    usersPermissions: getUsersPermissions(state)
  };
})(ContractRentsEdit);