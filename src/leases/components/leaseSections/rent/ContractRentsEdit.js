// @flow
import React, {Fragment} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import AddButtonSecondary from '$components/form/AddButtonSecondary';
import Authorization from '$components/authorization/Authorization';
import BoxItemContainer from '$components/content/BoxItemContainer';
import ContractRentEdit from './ContractRentEdit';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import {ConfirmationModalTexts} from '$src/enums';
import {ButtonColors} from '$components/enums';
import {
  LeaseRentContractRentsFieldPaths,
  LeaseRentContractRentsFieldTitles,
  RentTypes,
} from '$src/leases/enums';
import {Breakpoints} from '$src/foundation/enums';
import {UsersPermissions} from '$src/usersPermissions/enums';
import {getUiDataLeaseKey} from '$src/uiData/helpers';
import {
  hasPermissions,
  isFieldAllowedToRead,
  isFieldRequired,
} from '$util/helpers';
import {getAttributes as getLeaseAttributes} from '$src/leases/selectors';
import {getUsersPermissions} from '$src/usersPermissions/selectors';

import type {Attributes} from '$src/types';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';

type Props = {
  fields: any,
  leaseAttributes: Attributes,
  rentField: string,
  rentType: string,
  usersPermissions: UsersPermissionsType
}

const ContractRentsEdit = ({
  fields,
  leaseAttributes,
  rentField,
  rentType,
  usersPermissions,
}: Props) => {
  const handleAdd = () => {
    fields.push({period: 'per_year'});
  };

  if(!hasPermissions(usersPermissions, UsersPermissions.ADD_CONTRACTRENT) &&
    (!fields || !fields.length)) {
    return <FormText>Ei sopimusvuokria</FormText>;
  }

  return (
    <AppConsumer>
      {({dispatch}) => {
        return(
          <Fragment>
            {fields && !!fields.length &&
              <Row showFor={Breakpoints.LARGE}>
                <Column large={2}>
                  <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentContractRentsFieldPaths.AMOUNT)}>
                    <FormTextTitle
                      required={isFieldRequired(leaseAttributes, LeaseRentContractRentsFieldPaths.AMOUNT)}
                      enableUiDataEdit
                      uiDataKey={rentType !== RentTypes.FIXED
                        ? getUiDataLeaseKey(LeaseRentContractRentsFieldPaths.AMOUNT)
                        : getUiDataLeaseKey(LeaseRentContractRentsFieldPaths.AMOUNT_FIXED_RENT)}
                    >
                      {rentType !== RentTypes.FIXED
                        ? LeaseRentContractRentsFieldTitles.AMOUNT
                        : LeaseRentContractRentsFieldTitles.AMOUNT_FIXED_RENT}
                    </FormTextTitle>
                  </Authorization>
                </Column>
                <Column large={2}>
                  <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentContractRentsFieldPaths.INTENDED_USE)}>
                    <FormTextTitle
                      required={isFieldRequired(leaseAttributes, LeaseRentContractRentsFieldPaths.INTENDED_USE)}
                      enableUiDataEdit
                      uiDataKey={getUiDataLeaseKey(LeaseRentContractRentsFieldPaths.INTENDED_USE)}
                    >
                      {LeaseRentContractRentsFieldTitles.INTENDED_USE}
                    </FormTextTitle>
                  </Authorization>
                </Column>
                {(rentType === RentTypes.INDEX ||
                  rentType === RentTypes.MANUAL) &&
                  <Column large={3}>
                    <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentContractRentsFieldPaths.BASE_AMOUNT)}>
                      <FormTextTitle
                        required={isFieldRequired(leaseAttributes, LeaseRentContractRentsFieldPaths.BASE_AMOUNT)}
                        enableUiDataEdit
                        uiDataKey={getUiDataLeaseKey(LeaseRentContractRentsFieldPaths.BASE_AMOUNT)}
                      >
                        {LeaseRentContractRentsFieldTitles.BASE_AMOUNT}
                      </FormTextTitle>
                    </Authorization>
                  </Column>
                }
                {(rentType === RentTypes.INDEX ||
                  rentType === RentTypes.MANUAL) &&
                  <Column large={2}>
                    <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentContractRentsFieldPaths.BASE_YEAR_RENT)}>
                      <FormTextTitle
                        required={isFieldRequired(leaseAttributes, LeaseRentContractRentsFieldPaths.BASE_YEAR_RENT)}
                        enableUiDataEdit
                        tooltipStyle={{right: 12}}
                        uiDataKey={getUiDataLeaseKey(LeaseRentContractRentsFieldPaths.BASE_YEAR_RENT)}
                      >
                        {LeaseRentContractRentsFieldTitles.BASE_YEAR_RENT}
                      </FormTextTitle>
                    </Authorization>
                  </Column>
                }
                <Column large={1}>
                  <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentContractRentsFieldPaths.START_DATE)}>
                    <FormTextTitle
                      required={isFieldRequired(leaseAttributes, LeaseRentContractRentsFieldPaths.START_DATE)}
                      enableUiDataEdit
                      uiDataKey={getUiDataLeaseKey(LeaseRentContractRentsFieldPaths.START_DATE)}
                    >
                      {LeaseRentContractRentsFieldTitles.START_DATE}
                    </FormTextTitle>
                  </Authorization>
                </Column>
                <Column large={1}>
                  <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentContractRentsFieldPaths.START_DATE)}>
                    <FormTextTitle
                      required={isFieldRequired(leaseAttributes, LeaseRentContractRentsFieldPaths.END_DATE)}
                      enableUiDataEdit
                      uiDataKey={getUiDataLeaseKey(LeaseRentContractRentsFieldPaths.END_DATE)}
                    >
                      {LeaseRentContractRentsFieldTitles.END_DATE}
                    </FormTextTitle>
                  </Authorization>
                </Column>
              </Row>
            }

            {fields && !!fields.length &&
              <BoxItemContainer>
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
                      confirmationModalTitle: ConfirmationModalTexts.DELETE_CONTRACT_RENT.TITLE,
                    });
                  };

                  return(
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
            }

            <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.ADD_CONTRACTRENT)}>
              <Row>
                <Column>
                  <AddButtonSecondary
                    className={(!fields || !fields.length) ? 'no-top-margin' : ''}
                    label='Lisää sopimusvuokra'
                    onClick={handleAdd}
                  />
                </Column>
              </Row>
            </Authorization>
          </Fragment>
        );
      }}
    </AppConsumer>
  );
};

export default connect(
  (state) => {
    return {
      leaseAttributes: getLeaseAttributes(state),
      usersPermissions: getUsersPermissions(state),
    };
  },
)(ContractRentsEdit);
