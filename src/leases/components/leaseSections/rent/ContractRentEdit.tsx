import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { formValueSelector, change, reduxForm } from "redux-form";
import { Row, Column } from "react-foundation";
import flowRight from "lodash/flowRight";
import ActionButtonWrapper from "@/components/form/ActionButtonWrapper";
import Authorization from "@/components/authorization/Authorization";
import BoxContentWrapper from "@/components/content/BoxContentWrapper";
import BoxItem from "@/components/content/BoxItem";
import FormFieldLegacy from "@/components/form/FormFieldLegacy";
import FormText from "@/components/form/FormText";
import FormTextTitle from "@/components/form/FormTextTitle";
import RemoveButton from "@/components/form/RemoveButton";
import { FormNames } from "@/enums";
import {
  ContractRentPeriods,
  LeaseRentContractRentsFieldPaths,
  LeaseRentContractRentsFieldTitles,
  RentTypes,
} from "@/leases/enums";
import { UsersPermissions } from "@/usersPermissions/enums";
import { getUiDataLeaseKey } from "@/uiData/helpers";
import {
  formatNumber,
  getFieldAttributes,
  getFieldOptions,
  getLabelOfOption,
  hasPermissions,
  isEmptyValue,
  isFieldAllowedToEdit,
  isFieldAllowedToRead,
  isFieldRequired,
} from "@/util/helpers";
import {
  getAttributes as getLeaseAttributes,
  getIsSaveClicked,
} from "@/leases/selectors";
import { getUsersPermissions } from "@/usersPermissions/selectors";
import { withWindowResize } from "@/components/resize/WindowResizeHandler";
import type { Attributes } from "types";
import type { UsersPermissions as UsersPermissionsType } from "@/usersPermissions/types";
type Props = {
  amount: string;
  period: string;
  contractRent: Record<string, any>;
  field: string;
  isSaveClicked: boolean;
  largeScreen: boolean;
  leaseAttributes: Attributes;
  onRemove: (...args: Array<any>) => any;
  rentField: string;
  rentType: string;
  showRemove: boolean;
  usersPermissions: UsersPermissionsType;
  change: (...args: Array<any>) => any;
};

class ContractRentEdit extends PureComponent<Props> {
  componentDidUpdate(prevProps: Props) {
    const { field, change, amount, period, rentType } = this.props;

    if (prevProps.amount !== amount) {
      change(`${field}.base_amount`, amount);
    }

    if (prevProps.period !== period) {
      change(`${field}.base_amount_period`, period);
    }

    if (
      rentType === RentTypes.INDEX2022 &&
      prevProps.period !== ContractRentPeriods.PER_YEAR
    ) {
      change(`${field}.period`, ContractRentPeriods.PER_YEAR);
    }
  }

  render() {
    const {
      contractRent,
      field,
      isSaveClicked,
      largeScreen,
      leaseAttributes,
      onRemove,
      rentType,
      showRemove,
      usersPermissions,
    } = this.props;

    const getAmountUiDataKey = () => {
      if (rentType === RentTypes.FIXED) {
        return getUiDataLeaseKey(
          LeaseRentContractRentsFieldPaths.AMOUNT_FIXED_RENT,
        );
      }

      return getUiDataLeaseKey(LeaseRentContractRentsFieldPaths.AMOUNT);
    };

    const getAmountLabel = () => {
      if (rentType === RentTypes.FIXED) {
        return LeaseRentContractRentsFieldTitles.AMOUNT_FIXED_RENT;
      }

      if (rentType === RentTypes.INDEX2022) {
        return LeaseRentContractRentsFieldTitles.AMOUNT_INITIAL_YEAR_RENT;
      }

      return LeaseRentContractRentsFieldTitles.AMOUNT;
    };

    const getAmountText = () => {
      if (!contractRent || isEmptyValue(contractRent.amount)) return null;
      const amountPeriodOptions = getFieldOptions(
        leaseAttributes,
        LeaseRentContractRentsFieldPaths.PERIOD,
      );
      return `${formatNumber(contractRent.amount)} € ${getLabelOfOption(amountPeriodOptions, contractRent.period) || ""}`;
    };

    const getBaseAmountText = () => {
      if (!contractRent || isEmptyValue(contractRent.base_amount)) return null;
      const baseAmountPeriodOptions = getFieldOptions(
        leaseAttributes,
        LeaseRentContractRentsFieldPaths.BASE_AMOUNT_PERIOD,
      );
      return `${formatNumber(contractRent.base_amount)} € ${getLabelOfOption(baseAmountPeriodOptions, contractRent.base_amount_period) || ""}`;
    };

    const getContractRentPeriodOptions = () => {
      const periodOptions = getFieldOptions(
        leaseAttributes,
        LeaseRentContractRentsFieldPaths.PERIOD,
      );
      return rentType === RentTypes.INDEX || rentType === RentTypes.INDEX2022
        ? periodOptions.filter(
            (option) =>
              option.value === ContractRentPeriods.PER_YEAR ||
              option.value === "",
          )
        : periodOptions;
    };

    const getContractRentBaseAmountPeriodOptions = () => {
      return rentType === RentTypes.INDEX
        ? getFieldOptions(
            leaseAttributes,
            LeaseRentContractRentsFieldPaths.BASE_AMOUNT_PERIOD,
          ).filter(
            (option) =>
              option.value === ContractRentPeriods.PER_YEAR ||
              option.value === "",
          )
        : getFieldOptions(
            leaseAttributes,
            LeaseRentContractRentsFieldPaths.BASE_AMOUNT_PERIOD,
          );
    };

    const amountField = (
      <>
        <Authorization
          allow={isFieldAllowedToRead(
            leaseAttributes,
            LeaseRentContractRentsFieldPaths.AMOUNT,
          )}
        >
          <FormTextTitle
            required={isFieldRequired(
              leaseAttributes,
              LeaseRentContractRentsFieldPaths.AMOUNT,
            )}
            enableUiDataEdit
            uiDataKey={getAmountUiDataKey()}
          >
            {getAmountLabel()}
          </FormTextTitle>
        </Authorization>

        <Row>
          <Authorization
            allow={
              isFieldAllowedToEdit(
                leaseAttributes,
                LeaseRentContractRentsFieldPaths.BASE_AMOUNT,
              ) ||
              isFieldAllowedToEdit(
                leaseAttributes,
                LeaseRentContractRentsFieldPaths.BASE_AMOUNT_PERIOD,
              )
            }
            errorComponent={
              <Column>
                <FormText>{getAmountText()}</FormText>
              </Column>
            }
          >
            <>
              <Column small={6}>
                <Authorization
                  allow={isFieldAllowedToRead(
                    leaseAttributes,
                    LeaseRentContractRentsFieldPaths.AMOUNT,
                  )}
                >
                  <FormFieldLegacy
                    disableTouched={isSaveClicked}
                    fieldAttributes={getFieldAttributes(
                      leaseAttributes,
                      LeaseRentContractRentsFieldPaths.AMOUNT,
                    )}
                    invisibleLabel
                    name={`${field}.amount`}
                    unit="€"
                    overrideValues={{
                      label:
                        rentType !== RentTypes.FIXED
                          ? LeaseRentContractRentsFieldTitles.AMOUNT
                          : LeaseRentContractRentsFieldTitles.AMOUNT_FIXED_RENT,
                    }}
                  />
                </Authorization>
              </Column>
              <Column small={6}>
                <Authorization
                  allow={isFieldAllowedToRead(
                    leaseAttributes,
                    LeaseRentContractRentsFieldPaths.PERIOD,
                  )}
                >
                  <FormFieldLegacy
                    disableTouched={isSaveClicked}
                    fieldAttributes={getFieldAttributes(
                      leaseAttributes,
                      LeaseRentContractRentsFieldPaths.PERIOD,
                    )}
                    invisibleLabel
                    name={`${field}.period`}
                    overrideValues={{
                      label: LeaseRentContractRentsFieldTitles.PERIOD,
                      options: getContractRentPeriodOptions(),
                      disabled: rentType === RentTypes.INDEX2022,
                    }}
                  />
                </Authorization>
              </Column>
            </>
          </Authorization>
        </Row>
      </>
    );
    const intendedUseField = (
      <Authorization
        allow={isFieldAllowedToRead(
          leaseAttributes,
          LeaseRentContractRentsFieldPaths.INTENDED_USE,
        )}
      >
        <FormFieldLegacy
          disableTouched={isSaveClicked}
          fieldAttributes={getFieldAttributes(
            leaseAttributes,
            LeaseRentContractRentsFieldPaths.INTENDED_USE,
          )}
          name={`${field}.intended_use`}
          overrideValues={{
            label: LeaseRentContractRentsFieldTitles.INTENDED_USE,
          }}
          enableUiDataEdit
          uiDataKey={getUiDataLeaseKey(
            LeaseRentContractRentsFieldTitles.INTENDED_USE,
          )}
        />
      </Authorization>
    );
    const baseAmountField = (
      <>
        <Authorization
          allow={isFieldAllowedToRead(
            leaseAttributes,
            LeaseRentContractRentsFieldPaths.BASE_AMOUNT,
          )}
        >
          <FormTextTitle
            required={isFieldRequired(
              leaseAttributes,
              LeaseRentContractRentsFieldPaths.BASE_AMOUNT,
            )}
            enableUiDataEdit
            uiDataKey={getUiDataLeaseKey(
              LeaseRentContractRentsFieldTitles.BASE_AMOUNT,
            )}
          >
            {LeaseRentContractRentsFieldTitles.BASE_AMOUNT}
          </FormTextTitle>
        </Authorization>

        <Row>
          <Authorization
            allow={
              isFieldAllowedToEdit(
                leaseAttributes,
                LeaseRentContractRentsFieldPaths.BASE_AMOUNT,
              ) ||
              isFieldAllowedToEdit(
                leaseAttributes,
                LeaseRentContractRentsFieldPaths.BASE_AMOUNT_PERIOD,
              )
            }
            errorComponent={
              <Column>
                <FormText>{getBaseAmountText()}</FormText>
              </Column>
            }
          >
            <>
              <Column small={6}>
                <Authorization
                  allow={isFieldAllowedToRead(
                    leaseAttributes,
                    LeaseRentContractRentsFieldPaths.BASE_AMOUNT,
                  )}
                >
                  <FormFieldLegacy
                    disableTouched={isSaveClicked}
                    fieldAttributes={getFieldAttributes(
                      leaseAttributes,
                      LeaseRentContractRentsFieldPaths.BASE_AMOUNT,
                    )}
                    invisibleLabel
                    name={`${field}.base_amount`}
                    unit="€"
                    overrideValues={{
                      label: LeaseRentContractRentsFieldTitles.BASE_AMOUNT,
                    }}
                  />
                </Authorization>
              </Column>
              <Column small={6}>
                <Authorization
                  allow={isFieldAllowedToRead(
                    leaseAttributes,
                    LeaseRentContractRentsFieldPaths.BASE_AMOUNT_PERIOD,
                  )}
                >
                  <FormFieldLegacy
                    disableTouched={isSaveClicked}
                    fieldAttributes={getFieldAttributes(
                      leaseAttributes,
                      LeaseRentContractRentsFieldPaths.BASE_AMOUNT_PERIOD,
                    )}
                    invisibleLabel
                    name={`${field}.base_amount_period`}
                    overrideValues={{
                      label:
                        LeaseRentContractRentsFieldTitles.BASE_AMOUNT_PERIOD,
                      options: getContractRentBaseAmountPeriodOptions(),
                    }}
                  />
                </Authorization>
              </Column>
            </>
          </Authorization>
        </Row>
      </>
    );
    const baseYearRentField = (
      <Authorization
        allow={isFieldAllowedToRead(
          leaseAttributes,
          LeaseRentContractRentsFieldPaths.BASE_YEAR_RENT,
        )}
      >
        <FormFieldLegacy
          disableTouched={isSaveClicked}
          fieldAttributes={getFieldAttributes(
            leaseAttributes,
            LeaseRentContractRentsFieldPaths.BASE_YEAR_RENT,
          )}
          name={`${field}.base_year_rent`}
          unit="€"
          overrideValues={{
            label: LeaseRentContractRentsFieldTitles.BASE_YEAR_RENT,
          }}
          enableUiDataEdit
          tooltipStyle={{
            right: 12,
          }}
          uiDataKey={getUiDataLeaseKey(
            LeaseRentContractRentsFieldPaths.BASE_YEAR_RENT,
          )}
        />
      </Authorization>
    );
    const startDateField = (
      <Authorization
        allow={isFieldAllowedToRead(
          leaseAttributes,
          LeaseRentContractRentsFieldPaths.START_DATE,
        )}
      >
        <FormFieldLegacy
          disableTouched={isSaveClicked}
          fieldAttributes={getFieldAttributes(
            leaseAttributes,
            LeaseRentContractRentsFieldPaths.START_DATE,
          )}
          name={`${field}.start_date`}
          overrideValues={{
            label: LeaseRentContractRentsFieldTitles.START_DATE,
          }}
          enableUiDataEdit
          uiDataKey={getUiDataLeaseKey(
            LeaseRentContractRentsFieldPaths.START_DATE,
          )}
        />
      </Authorization>
    );
    const endDateField = (
      <Authorization
        allow={isFieldAllowedToRead(
          leaseAttributes,
          LeaseRentContractRentsFieldPaths.END_DATE,
        )}
      >
        <FormFieldLegacy
          disableTouched={isSaveClicked}
          fieldAttributes={getFieldAttributes(
            leaseAttributes,
            LeaseRentContractRentsFieldPaths.END_DATE,
          )}
          name={`${field}.end_date`}
          overrideValues={{
            label: LeaseRentContractRentsFieldTitles.END_DATE,
          }}
          enableUiDataEdit
          uiDataKey={getUiDataLeaseKey(
            LeaseRentContractRentsFieldPaths.END_DATE,
          )}
        />
      </Authorization>
    );
    const indexField = (
      <Authorization
        allow={isFieldAllowedToRead(
          leaseAttributes,
          LeaseRentContractRentsFieldPaths.INDEX,
        )}
      >
        <FormFieldLegacy
          disableTouched={isSaveClicked}
          fieldAttributes={{
            ...getFieldAttributes(
              leaseAttributes,
              LeaseRentContractRentsFieldPaths.INDEX,
            ),
            required: true,
          }}
          name={`${field}.index`}
          overrideValues={{
            label: LeaseRentContractRentsFieldTitles.INDEX,
          }}
          enableUiDataEdit
          uiDataKey={getUiDataLeaseKey(LeaseRentContractRentsFieldPaths.INDEX)}
        />
      </Authorization>
    );

    const renderFields = () => (
      <>
        <Column small={6} medium={4} large={2}>
          {amountField}
        </Column>
        <Column small={6} medium={4} large={2}>
          {intendedUseField}
        </Column>
        {rentType === RentTypes.INDEX2022 && (
          <Column small={6} medium={4} large={2}>
            {indexField}
          </Column>
        )}
        {(rentType === RentTypes.INDEX || rentType === RentTypes.MANUAL) && (
          <>
            <Column small={6} medium={4} large={3}>
              {baseAmountField}
            </Column>
            <Column small={6} medium={4} large={2}>
              {baseYearRentField}
            </Column>
          </>
        )}
        <Column small={6} medium={4} large={2}>
          <Row>
            <Column small={6}>{startDateField}</Column>
            <Column small={6}>{endDateField}</Column>
          </Row>
        </Column>
      </>
    );

    if (largeScreen) {
      return (
        <Row>
          {renderFields()}
          {showRemove && (
            <Column>
              <Authorization
                allow={hasPermissions(
                  usersPermissions,
                  UsersPermissions.DELETE_CONTRACTRENT,
                )}
              >
                <RemoveButton
                  className="third-level"
                  onClick={onRemove}
                  title="Poista sopimusvuokra"
                />
              </Authorization>
            </Column>
          )}
        </Row>
      );
    }

    return (
      <BoxItem>
        <BoxContentWrapper>
          {showRemove && (
            <ActionButtonWrapper>
              <Authorization
                allow={hasPermissions(
                  usersPermissions,
                  UsersPermissions.DELETE_CONTRACTRENT,
                )}
              >
                <RemoveButton onClick={onRemove} title="Poista sopimusvuokra" />
              </Authorization>
            </ActionButtonWrapper>
          )}
          <Row>{renderFields()}</Row>
        </BoxContentWrapper>
      </BoxItem>
    );
  }
}

const formName = FormNames.LEASE_RENTS;
const selector = formValueSelector(formName);
export default flowRight(
  withWindowResize,
  connect((state, props: Props) => {
    return {
      contractRent: selector(state, props.field),
      isSaveClicked: getIsSaveClicked(state),
      leaseAttributes: getLeaseAttributes(state),
      usersPermissions: getUsersPermissions(state),
      amount: selector(state, `${props.field}.amount`),
      period: selector(state, `${props.field}.period`),
    };
  }),
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
    change,
  }),
)(ContractRentEdit);
