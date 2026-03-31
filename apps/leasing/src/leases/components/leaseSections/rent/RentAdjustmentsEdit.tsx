import React, { useState } from "react";
import { useSelector } from "react-redux";
import { initialize } from "redux-form";
import { Row, Column } from "react-foundation";
import addMonths from "date-fns/addMonths";
import format from "date-fns/format";
import isAfter from "date-fns/isAfter";
import subDays from "date-fns/subDays";
import { ActionTypes, AppConsumer } from "@/app/AppContext";
import AddButtonSecondary from "@/components/form/AddButtonSecondary";
import Authorization from "@/components/authorization/Authorization";
import BoxItemContainer from "@/components/content/BoxItemContainer";
import DecisionLink from "@/components/links/DecisionLink";
import FormText from "@/components/form/FormText";
import RentAdjustmentEdit from "./RentAdjustmentEdit";
import SteppedDiscountModal from "./SteppedDiscountModal";
import { ConfirmationModalTexts, FormNames } from "@/enums";
import { ButtonColors } from "@/components/enums";
import {
  LeaseRentAdjustmentsFieldPaths,
  RentAdjustmentAmountTypes,
  RentAdjustmentTypes,
} from "@/leases/enums";
import { UsersPermissions } from "@/usersPermissions/enums";
import { getDecisionById, getDecisionOptions } from "@/leases/helpers";
import {
  convertStrToDecimalNumber,
  formatNumber,
  getFieldOptions,
  hasPermissions,
} from "@/util/helpers";
import {
  getAttributes as getLeaseAttributes,
  getCurrentLease,
} from "@/leases/selectors";
import { getUsersPermissions } from "@/usersPermissions/selectors";
import type { Attributes } from "types";
import type { UsersPermissions as UsersPermissionsType } from "@/usersPermissions/types";
type Props = {
  fields: any;
};

const RentAdjustmentsEdit: React.FC<Props> = ({ fields }) => {
  const currentLease = useSelector(getCurrentLease);
  const leaseAttributes: Attributes = useSelector(getLeaseAttributes);
  const usersPermissions: UsersPermissionsType =
    useSelector(getUsersPermissions);

  const amountTypeOptions = getFieldOptions(
    leaseAttributes,
    LeaseRentAdjustmentsFieldPaths.AMOUNT_TYPE,
  );

  const decisionOptions = getDecisionOptions(currentLease);

  const [isSteppedDiscountModalOpen, setIsSteppedDiscountModalOpen] =
    useState(false);

  const decisionReadOnly = (value: number | null | undefined) => {
    return (
      <DecisionLink
        decision={getDecisionById(currentLease, value)}
        decisionOptions={decisionOptions}
      />
    );
  };

  const handleAdd = () => {
    fields.push({});
  };
  const handleCloseSteppedDiscountModal = () => {
    setIsSteppedDiscountModalOpen(false);
  };

  const handleOpenSteppedDiscountModal = () => {
    setIsSteppedDiscountModalOpen(true);
    initialize(FormNames.LEASE_STEPPED_DISCOUNT, {});
  };
  const getSteppedDiscounts = (
    formValues: Record<string, any>,
  ): Array<Record<string, any>> => {
    const ranges = [];
    const months = 12;
    let current = formValues.start_date;
    const totalMonths =
      (convertStrToDecimalNumber(formValues.number_of_years) || 0) * months;
    const final = addMonths(new Date(current), totalMonths);

    while (!isAfter(new Date(current), final)) {
      const next = format(addMonths(new Date(current), months), "yyyy-MM-dd");
      const endDate = format(subDays(new Date(next), 1), "yyyy-MM-dd");
      ranges.push({
        start_date: current,
        end_date: endDate,
      });
      current = next;
    }

    const step =
      ((convertStrToDecimalNumber(formValues.percantage_beginning) || 0) -
        (convertStrToDecimalNumber(formValues.percantage_final) || 0)) /
      (convertStrToDecimalNumber(formValues.number_of_years) || 1);
    return ranges.map((range, index) => {
      return {
        ...range,
        type: RentAdjustmentTypes.DISCOUNT,
        intended_use: formValues.intended_use,
        full_amount: formatNumber(
          (convertStrToDecimalNumber(formValues.percantage_beginning) || 0) -
            index * step,
        ),
        amount_type: RentAdjustmentAmountTypes.PERCENT_PER_YEAR,
        decision: formValues.decision,
        note: formValues.note,
      };
    });
  };

  const handleSaveSteppedDiscount = (formValues: Record<string, any>) => {
    const discounts = getSteppedDiscounts(formValues);
    discounts.forEach((discount) => {
      fields.push(discount);
    });
    handleCloseSteppedDiscountModal();
  };

  if (
    !hasPermissions(usersPermissions, UsersPermissions.ADD_RENTADJUSTMENT) &&
    (!fields || !fields.length)
  ) {
    return <FormText>Ei alennuksia tai korotuksia</FormText>;
  }

  return (
    <AppConsumer>
      {({ dispatch }) => {
        return (
          <>
            <SteppedDiscountModal
              isOpen={isSteppedDiscountModalOpen}
              onClose={handleCloseSteppedDiscountModal}
              onSave={handleSaveSteppedDiscount}
            />
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
                        ConfirmationModalTexts.DELETE_RENT_ADJUSTMENT.BUTTON,
                      confirmationModalLabel:
                        ConfirmationModalTexts.DELETE_RENT_ADJUSTMENT.LABEL,
                      confirmationModalTitle:
                        ConfirmationModalTexts.DELETE_RENT_ADJUSTMENT.TITLE,
                    });
                  };

                  return (
                    <RentAdjustmentEdit
                      key={index}
                      amountTypeOptions={amountTypeOptions}
                      decisionOptions={decisionOptions}
                      field={field}
                      onRemove={handleRemove}
                    />
                  );
                })}
              </BoxItemContainer>
            )}

            <Authorization
              allow={hasPermissions(
                usersPermissions,
                UsersPermissions.ADD_RENTADJUSTMENT,
              )}
            >
              <Row>
                <Column>
                  <AddButtonSecondary
                    className={!fields || !fields.length ? "no-top-margin" : ""}
                    label="Lisää alennus/korotus"
                    onClick={handleAdd}
                  />
                </Column>
              </Row>
            </Authorization>
            <Authorization
              allow={hasPermissions(
                usersPermissions,
                UsersPermissions.ADD_RENTADJUSTMENT,
              )}
            >
              <Row>
                <Column>
                  <AddButtonSecondary
                    label="Lisää porrastettu alennus"
                    onClick={handleOpenSteppedDiscountModal}
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

export default RentAdjustmentsEdit;
