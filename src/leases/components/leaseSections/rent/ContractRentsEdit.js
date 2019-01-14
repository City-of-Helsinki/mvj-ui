// @flow
import React, {Fragment} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import AddButtonSecondary from '$components/form/AddButtonSecondary';
import Authorization from '$components/authorization/Authorization';
import BoxItemContainer from '$components/content/BoxItemContainer';
import ContractRentEdit from './ContractRentEdit';
import FormTextTitle from '$components/form/FormTextTitle';
import {ButtonColors} from '$components/enums';
import {
  DeleteModalLabels,
  DeleteModalTitles,
  LeaseRentContractRentsFieldPaths,
  LeaseRentContractRentsFieldTitles,
  RentTypes,
} from '$src/leases/enums';
import {Breakpoints} from '$src/foundation/enums';
import {
  isFieldAllowedToEdit,
  isFieldAllowedToRead,
  isFieldRequired,
} from '$util/helpers';
import {getAttributes as getLeaseAttributes} from '$src/leases/selectors';

import type {Attributes} from '$src/types';

type Props = {
  fields: any,
  leaseAttributes: Attributes,
  rentField: string,
  rentType: string,
}

const ContractRentsEdit = ({fields, leaseAttributes, rentField, rentType}: Props) => {
  const handleAdd = () => {
    fields.push({});
  };

  return (
    <AppConsumer>
      {({dispatch}) => {
        return(
          <Fragment>
            {(fields && !!fields.length) &&
              <Row showFor={Breakpoints.LARGE}>
                <Column large={2}>
                  <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentContractRentsFieldPaths.AMOUNT)}>
                    <FormTextTitle required={isFieldRequired(leaseAttributes, LeaseRentContractRentsFieldPaths.AMOUNT)}>
                      {LeaseRentContractRentsFieldTitles.AMOUNT}
                    </FormTextTitle>
                  </Authorization>
                </Column>
                <Column large={2}>
                  <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentContractRentsFieldPaths.INTENDED_USE)}>
                    <FormTextTitle required={isFieldRequired(leaseAttributes, LeaseRentContractRentsFieldPaths.INTENDED_USE)}>
                      {LeaseRentContractRentsFieldTitles.INTENDED_USE}
                    </FormTextTitle>
                  </Authorization>
                </Column>
                {(rentType === RentTypes.INDEX ||
                  rentType === RentTypes.MANUAL) &&
                  <Column large={3}>
                    <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentContractRentsFieldPaths.BASE_AMOUNT)}>
                      <FormTextTitle required={isFieldRequired(leaseAttributes, LeaseRentContractRentsFieldPaths.BASE_AMOUNT)}>
                        {LeaseRentContractRentsFieldTitles.BASE_AMOUNT}
                      </FormTextTitle>
                    </Authorization>
                  </Column>
                }
                {(rentType === RentTypes.INDEX ||
                  rentType === RentTypes.MANUAL) &&
                  <Column large={2}>
                    <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentContractRentsFieldPaths.BASE_YEAR_RENT)}>
                      <FormTextTitle required={isFieldRequired(leaseAttributes, LeaseRentContractRentsFieldPaths.BASE_YEAR_RENT)}>
                        {LeaseRentContractRentsFieldTitles.BASE_YEAR_RENT}
                      </FormTextTitle>
                    </Authorization>
                  </Column>
                }
                <Column large={1}>
                  <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentContractRentsFieldPaths.START_DATE)}>
                    <FormTextTitle required={isFieldRequired(leaseAttributes, LeaseRentContractRentsFieldPaths.START_DATE)}>
                      {LeaseRentContractRentsFieldTitles.START_DATE}
                    </FormTextTitle>
                  </Authorization>
                </Column>
                <Column large={1}>
                  <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentContractRentsFieldPaths.END_DATE)}>
                    <FormTextTitle required={isFieldRequired(leaseAttributes, LeaseRentContractRentsFieldPaths.END_DATE)}>
                      {LeaseRentContractRentsFieldTitles.END_DATE}
                    </FormTextTitle>
                  </Authorization>
                </Column>
              </Row>
            }
            <BoxItemContainer>
              {fields && !!fields.length && fields.map((rent, index) => {
                const handleRemove = () => {
                  dispatch({
                    type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                    confirmationFunction: () => {
                      fields.remove(index);
                    },
                    confirmationModalButtonClassName: ButtonColors.ALERT,
                    confirmationModalButtonText: 'Poista',
                    confirmationModalLabel: DeleteModalLabels.CONTRACT_RENT,
                    confirmationModalTitle: DeleteModalTitles.CONTRACT_RENT,
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

            <Authorization allow={isFieldAllowedToEdit(leaseAttributes, LeaseRentContractRentsFieldPaths.CONTRACT_RENTS)}>
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
    };
  },
)(ContractRentsEdit);
