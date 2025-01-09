import React, { Fragment, PureComponent } from "react";
import { connect } from "react-redux";
import { Row, Column } from "react-foundation";
import flowRight from "lodash/flowRight";
import Authorization from "@/components/authorization/Authorization";
import BoxContentWrapper from "@/components/content/BoxContentWrapper";
import BoxItem from "@/components/content/BoxItem";
import BoxItemContainer from "@/components/content/BoxItemContainer";
import FormText from "@/components/form/FormText";
import FormTextTitle from "@/components/form/FormTextTitle";
import {
  LeaseRentContractRentsFieldPaths,
  LeaseRentContractRentsFieldTitles,
  RentTypes,
} from "@/leases/enums";
import { getUiDataLeaseKey } from "@/uiData/helpers";
import {
  formatDate,
  formatNumber,
  getFieldOptions,
  getLabelOfOption,
  isEmptyValue,
  isFieldAllowedToRead,
} from "@/util/helpers";
import { getAttributes as getLeaseAttributes } from "@/leases/selectors";
import { withWindowResize } from "@/components/resize/WindowResizeHandler";
import type { Attributes } from "types";
type Props = {
  contractRents: Array<Record<string, any>>;
  largeScreen: boolean;
  leaseAttributes: Attributes;
  rentType: string;
};
type State = {
  amountPeriodOptions: Array<Record<string, any>>;
  baseAmountPeriodOptions: Array<Record<string, any>>;
  intendedUseOptions: Array<Record<string, any>>;
  indexOptions: Array<Record<string, any>>;
  leaseAttributes: Attributes;
};

class ContractRents extends PureComponent<Props, State> {
  state = {
    amountPeriodOptions: [],
    baseAmountPeriodOptions: [],
    intendedUseOptions: [],
    indexOptions: [],
    leaseAttributes: null,
  };

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState: any = {};

    if (props.leaseAttributes !== state.leaseAttributes) {
      newState.leaseAttributes = props.leaseAttributes;
      newState.amountPeriodOptions = getFieldOptions(
        props.leaseAttributes,
        LeaseRentContractRentsFieldPaths.PERIOD,
      );
      newState.baseAmountPeriodOptions = getFieldOptions(
        props.leaseAttributes,
        LeaseRentContractRentsFieldPaths.BASE_AMOUNT_PERIOD,
      );
      newState.intendedUseOptions = getFieldOptions(
        props.leaseAttributes,
        LeaseRentContractRentsFieldPaths.INTENDED_USE,
      );
      newState.indexOptions = getFieldOptions(
        props.leaseAttributes,
        LeaseRentContractRentsFieldPaths.INDEX,
      );
    }

    return newState;
  }

  render() {
    const { contractRents, largeScreen, leaseAttributes, rentType } =
      this.props;
    const {
      amountPeriodOptions,
      baseAmountPeriodOptions,
      intendedUseOptions,
      indexOptions,
    } = this.state;

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

    return (
      <Fragment>
        <BoxItemContainer>
          {(!contractRents || !contractRents.length) && (
            <FormText>Ei sopimusvuokria</FormText>
          )}

          {contractRents &&
            !!contractRents.length &&
            contractRents.map((contractRent, index) => {
              const getAmountText = () => {
                if (isEmptyValue(contractRent.amount)) return null;
                return `${formatNumber(contractRent.amount)} € ${getLabelOfOption(amountPeriodOptions, contractRent.period) || ""}`;
              };

              const getBaseAmount = () => {
                if (isEmptyValue(contractRent.base_amount)) return null;
                return `${formatNumber(contractRent.base_amount)} € ${getLabelOfOption(baseAmountPeriodOptions, contractRent.base_amount_period) || ""}`;
              };

              const renderFields = () => (
                <>
                  <Column small={6} medium={4} large={2}>
                    <Authorization
                      allow={isFieldAllowedToRead(
                        leaseAttributes,
                        LeaseRentContractRentsFieldPaths.AMOUNT,
                      )}
                    >
                      <>
                        <FormTextTitle uiDataKey={getAmountUiDataKey()}>
                          {getAmountLabel()}
                        </FormTextTitle>
                        <FormText>{getAmountText()}</FormText>
                      </>
                    </Authorization>
                  </Column>
                  <Column small={6} medium={4} large={2}>
                    <Authorization
                      allow={isFieldAllowedToRead(
                        leaseAttributes,
                        LeaseRentContractRentsFieldPaths.INTENDED_USE,
                      )}
                    >
                      <>
                        <FormTextTitle
                          uiDataKey={getUiDataLeaseKey(
                            LeaseRentContractRentsFieldPaths.INTENDED_USE,
                          )}
                        >
                          {LeaseRentContractRentsFieldTitles.INTENDED_USE}
                        </FormTextTitle>
                        <FormText>
                          {getLabelOfOption(
                            intendedUseOptions,
                            contractRent.intended_use,
                          )}
                        </FormText>
                      </>
                    </Authorization>
                  </Column>
                  {rentType === RentTypes.INDEX2022 && (
                    <Column small={6} medium={4} large={2}>
                      <Authorization
                        allow={isFieldAllowedToRead(
                          leaseAttributes,
                          LeaseRentContractRentsFieldPaths.INDEX,
                        )}
                      >
                        <>
                          <FormTextTitle
                            uiDataKey={getUiDataLeaseKey(
                              LeaseRentContractRentsFieldPaths.INDEX,
                            )}
                          >
                            {LeaseRentContractRentsFieldTitles.INDEX}
                          </FormTextTitle>
                          <FormText>
                            {getLabelOfOption(indexOptions, contractRent.index)}
                          </FormText>
                        </>
                      </Authorization>
                    </Column>
                  )}
                  {(rentType === RentTypes.INDEX ||
                    rentType === RentTypes.MANUAL) && (
                    <>
                      <Column small={6} medium={4} large={3}>
                        <Authorization
                          allow={isFieldAllowedToRead(
                            leaseAttributes,
                            LeaseRentContractRentsFieldPaths.BASE_AMOUNT,
                          )}
                        >
                          <>
                            <FormTextTitle
                              uiDataKey={getUiDataLeaseKey(
                                LeaseRentContractRentsFieldPaths.BASE_AMOUNT,
                              )}
                            >
                              {LeaseRentContractRentsFieldTitles.BASE_AMOUNT}
                            </FormTextTitle>
                            <FormText>{getBaseAmount() || "-"}</FormText>
                          </>
                        </Authorization>
                      </Column>
                      <Column small={6} medium={4} large={2}>
                        <Authorization
                          allow={isFieldAllowedToRead(
                            leaseAttributes,
                            LeaseRentContractRentsFieldPaths.BASE_YEAR_RENT,
                          )}
                        >
                          <>
                            <FormTextTitle
                              uiDataKey={getUiDataLeaseKey(
                                LeaseRentContractRentsFieldPaths.BASE_YEAR_RENT,
                              )}
                            >
                              {LeaseRentContractRentsFieldTitles.BASE_YEAR_RENT}
                            </FormTextTitle>
                            <FormText>
                              {!isEmptyValue(contractRent.base_year_rent)
                                ? `${formatNumber(contractRent.base_year_rent)} €`
                                : "-"}
                            </FormText>
                          </>
                        </Authorization>
                      </Column>
                    </>
                  )}
                  <Column small={6} medium={4} large={1}>
                    <Authorization
                      allow={isFieldAllowedToRead(
                        leaseAttributes,
                        LeaseRentContractRentsFieldPaths.START_DATE,
                      )}
                    >
                      <>
                        <FormTextTitle
                          uiDataKey={getUiDataLeaseKey(
                            LeaseRentContractRentsFieldPaths.START_DATE,
                          )}
                        >
                          {LeaseRentContractRentsFieldTitles.START_DATE}
                        </FormTextTitle>
                        <FormText>
                          {contractRent.start_date
                            ? formatDate(contractRent.start_date)
                            : "-"}
                        </FormText>
                      </>
                    </Authorization>
                  </Column>
                  <Column small={6} medium={4} large={1}>
                    <Authorization
                      allow={isFieldAllowedToRead(
                        leaseAttributes,
                        LeaseRentContractRentsFieldPaths.END_DATE,
                      )}
                    >
                      <>
                        <FormTextTitle
                          uiDataKey={getUiDataLeaseKey(
                            LeaseRentContractRentsFieldPaths.END_DATE,
                          )}
                        >
                          {LeaseRentContractRentsFieldTitles.END_DATE}
                        </FormTextTitle>
                        <FormText>
                          {contractRent.end_date
                            ? formatDate(contractRent.end_date)
                            : "-"}
                        </FormText>
                      </>
                    </Authorization>
                  </Column>
                </>
              );

              if (largeScreen) {
                return <Row key={index}>{renderFields()}</Row>;
              } else {
                // For small and medium screens
                return (
                  <BoxItem
                    key={index}
                    className="no-border-on-first-child no-border-on-last-child"
                  >
                    <BoxContentWrapper>
                      <Row>{renderFields()}</Row>
                    </BoxContentWrapper>
                  </BoxItem>
                );
              }
            })}
        </BoxItemContainer>
      </Fragment>
    );
  }
}

export default flowRight(
  withWindowResize,
  connect((state) => {
    return {
      leaseAttributes: getLeaseAttributes(state),
    };
  }),
)(ContractRents);
