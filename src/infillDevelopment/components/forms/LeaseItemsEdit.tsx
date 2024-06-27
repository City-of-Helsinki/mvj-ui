import React, { Fragment, ReactElement } from "react";
import { connect } from "react-redux";
import { Row, Column } from "react-foundation";
import { ActionTypes, AppConsumer } from "/src/app/AppContext";
import AddButtonSecondary from "/src/components/form/AddButtonSecondary";
import Authorization from "/src/components/authorization/Authorization";
import FormText from "/src/components/form/FormText";
import LeaseItemEdit from "./LeaseItemEdit";
import { ConfirmationModalTexts } from "enums";
import { ButtonColors } from "/src/components/enums";
import { UsersPermissions } from "usersPermissions/enums";
import { hasPermissions } from "util/helpers";
import { getUsersPermissions } from "usersPermissions/selectors";
import type { UsersPermissions as UsersPermissionsType } from "usersPermissions/types";
import type { InfillDevelopment } from "/src/infillDevelopment/types";
type Props = {
  fields: any;
  infillDevelopment: InfillDevelopment;
  isSaveClicked: boolean;
  usersPermissions: UsersPermissionsType;
};

const LeaseItemsEdit = ({
  fields,
  infillDevelopment,
  isSaveClicked,
  usersPermissions
}: Props): ReactElement => {
  const handleAdd = () => {
    fields.push({});
  };

  return <AppConsumer>
      {({
      dispatch
    }) => {
      return <Fragment>
            {!hasPermissions(usersPermissions, UsersPermissions.ADD_INFILLDEVELOPMENTCOMPENSATIONLEASE) && (!fields || !fields.length) && <FormText>Ei vuokrauksia</FormText>}
            {!!fields && !!fields.length && fields.map((lease, index) => {
          const handleRemove = () => {
            dispatch({
              type: ActionTypes.SHOW_CONFIRMATION_MODAL,
              confirmationFunction: () => {
                fields.remove(index);
              },
              confirmationModalButtonClassName: ButtonColors.ALERT,
              confirmationModalButtonText: ConfirmationModalTexts.DELETE_INFILL_DEVELOPMENT_COMPENSATION_LEASE.BUTTON,
              confirmationModalLabel: ConfirmationModalTexts.DELETE_INFILL_DEVELOPMENT_COMPENSATION_LEASE.LABEL,
              confirmationModalTitle: ConfirmationModalTexts.DELETE_INFILL_DEVELOPMENT_COMPENSATION_LEASE.TITLE
            });
          };

          return <LeaseItemEdit key={index} field={lease} fields={fields} infillDevelopment={infillDevelopment} index={index} isSaveClicked={isSaveClicked} onRemove={handleRemove} />;
        })}

            <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.ADD_INFILLDEVELOPMENTCOMPENSATIONLEASE)}>
              <Row>
                <Column>
                  <AddButtonSecondary label='Lisää vuokraus' onClick={handleAdd} />
                </Column>
              </Row>
            </Authorization>
          </Fragment>;
    }}
    </AppConsumer>;
};

export default connect(state => {
  return {
    usersPermissions: getUsersPermissions(state)
  };
})(LeaseItemsEdit);