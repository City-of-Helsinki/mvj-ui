// @flow
import React, {Fragment, PureComponent} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';

import Authorization from '$components/authorization/Authorization';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import BoxItem from '$components/content/BoxItem';
import BoxItemContainer from '$components/content/BoxItemContainer';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import {
  LeaseRentContractRentsFieldPaths,
  LeaseRentContractRentsFieldTitles,
  RentTypes,
} from '$src/leases/enums';
import {
  formatDate,
  formatNumber,
  getFieldOptions,
  getLabelOfOption,
  isEmptyValue,
  isFieldAllowedToRead,
} from '$util/helpers';
import {getAttributes as getLeaseAttributes} from '$src/leases/selectors';
import {withWindowResize} from '$components/resize/WindowResizeHandler';

import type {Attributes} from '$src/types';

type Props = {
  contractRents: Array<Object>,
  largeScreen: boolean,
  leaseAttributes: Attributes,
  rentType: string
}

type State = {
  amountPeriodOptions: Array<Object>,
  baseAmountPeriodOptions: Array<Object>,
  intendedUseOptions: Array<Object>,
  leaseAttributes: Attributes,
}

class ContractRents extends PureComponent<Props, State> {
  state = {
    amountPeriodOptions: [],
    baseAmountPeriodOptions: [],
    intendedUseOptions: [],
    leaseAttributes: {},
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState = {};

    if(props.leaseAttributes !== state.leaseAttributes) {
      newState.leaseAttributes = props.leaseAttributes;
      newState.amountPeriodOptions = getFieldOptions(props.leaseAttributes, LeaseRentContractRentsFieldPaths.PERIOD);
      newState.baseAmountPeriodOptions = getFieldOptions(props.leaseAttributes, LeaseRentContractRentsFieldPaths.BASE_AMOUNT_PERIOD);
      newState.intendedUseOptions = getFieldOptions(props.leaseAttributes, LeaseRentContractRentsFieldPaths.INTENDED_USE);
    }

    return newState;
  }

  render() {
    const {contractRents, largeScreen, leaseAttributes, rentType} = this.props;
    const {
      amountPeriodOptions,
      baseAmountPeriodOptions,
      intendedUseOptions,
    } = this.state;

    return (
      <Fragment>
        <BoxItemContainer>
          {(!contractRents || !contractRents.length) && <FormText>Ei sopimusvuokria</FormText>}
          {contractRents && !!contractRents.length && largeScreen &&
            <Row>
              <Column large={2}>
                <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentContractRentsFieldPaths.AMOUNT)}>
                  <FormTextTitle>{LeaseRentContractRentsFieldTitles.AMOUNT}</FormTextTitle>
                </Authorization>
              </Column>
              <Column large={2}>
                <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentContractRentsFieldPaths.INTENDED_USE)}>
                  <FormTextTitle>{LeaseRentContractRentsFieldTitles.INTENDED_USE}</FormTextTitle>
                </Authorization>
              </Column>
              {(rentType === RentTypes.INDEX ||
                rentType === RentTypes.MANUAL) &&
                <Column large={3}>
                  <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentContractRentsFieldPaths.BASE_AMOUNT)}>
                    <FormTextTitle>{LeaseRentContractRentsFieldTitles.BASE_AMOUNT}</FormTextTitle>
                  </Authorization>
                </Column>
              }
              {(rentType === RentTypes.INDEX ||
                rentType === RentTypes.MANUAL) &&
                <Column large={2}>
                  <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentContractRentsFieldPaths.BASE_YEAR_RENT)}>
                    <FormTextTitle>{LeaseRentContractRentsFieldTitles.BASE_YEAR_RENT}</FormTextTitle>
                  </Authorization>
                </Column>
              }
              <Column large={1}>
                <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentContractRentsFieldPaths.START_DATE)}>
                  <FormTextTitle>{LeaseRentContractRentsFieldTitles.START_DATE}</FormTextTitle>
                </Authorization>
              </Column>
              <Column large={1}>
                <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentContractRentsFieldPaths.END_DATE)}>
                  <FormTextTitle>{LeaseRentContractRentsFieldTitles.END_DATE}</FormTextTitle>
                </Authorization>
              </Column>
            </Row>
          }

          {contractRents && !!contractRents.length && contractRents.map((contractRent, index) => {
            const getAmount = () => {
              if(isEmptyValue(contractRent.amount)) return null;

              return `${formatNumber(contractRent.amount)} € ${getLabelOfOption(amountPeriodOptions, contractRent.period)}`;
            };

            const getBaseAmount = () => {
              if(isEmptyValue(contractRent.base_amount)) return null;

              return `${formatNumber(contractRent.base_amount)} € ${getLabelOfOption(baseAmountPeriodOptions, contractRent.base_amount_period)}`;
            };

            const amountText = getAmount();
            const baseAmountText = getBaseAmount();

            if(largeScreen) {
              return(
                <Row key={index}>
                  <Column small={6} medium={4} large={2}>
                    <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentContractRentsFieldPaths.AMOUNT)}>
                      <FormText>{amountText}</FormText>
                    </Authorization>
                  </Column>
                  <Column small={6} medium={4} large={2}>
                    <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentContractRentsFieldPaths.INTENDED_USE)}>
                      <FormText>{getLabelOfOption(intendedUseOptions, contractRent.intended_use)}</FormText>
                    </Authorization>
                  </Column>
                  {(rentType === RentTypes.INDEX ||
                    rentType === RentTypes.MANUAL) &&
                    <Column small={6} medium={4} large={2}>
                      <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentContractRentsFieldPaths.BASE_AMOUNT)}>
                        <FormText>{baseAmountText || '-'}</FormText>
                      </Authorization>
                    </Column>
                  }
                  {(rentType === RentTypes.INDEX ||
                    rentType === RentTypes.MANUAL) &&
                    <Column small={6} medium={4} large={2} offsetOnLarge={1}>
                      <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentContractRentsFieldPaths.BASE_YEAR_RENT)}>
                        <FormText>{!isEmptyValue(contractRent.base_year_rent) ? `${formatNumber(contractRent.base_year_rent)} €` : '-'}</FormText>
                      </Authorization>
                    </Column>
                  }
                  <Column small={6} medium={4} large={1}>
                    <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentContractRentsFieldPaths.START_DATE)}>
                      <FormText>{contractRent.start_date ? formatDate(contractRent.start_date) : '-'}</FormText>
                    </Authorization>
                  </Column>
                  <Column small={6} medium={4} large={1}>
                    <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentContractRentsFieldPaths.END_DATE)}>
                      <FormText>{contractRent.end_date ? formatDate(contractRent.end_date) : '-'}</FormText>
                    </Authorization>
                  </Column>
                </Row>
              );
            } else {
              // For small and medium screens
              return(
                <BoxItem key={index} className='no-border-on-first-child no-border-on-last-child'>
                  <BoxContentWrapper>
                    <Row>
                      <Column small={6} medium={4} large={2}>
                        <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentContractRentsFieldPaths.AMOUNT)}>
                          <FormTextTitle>{LeaseRentContractRentsFieldTitles.AMOUNT}</FormTextTitle>
                          <FormText>{amountText || '-'}</FormText>
                        </Authorization>
                      </Column>
                      <Column small={6} medium={4} large={2}>
                        <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentContractRentsFieldPaths.INTENDED_USE)}>
                          <FormTextTitle>{LeaseRentContractRentsFieldTitles.INTENDED_USE}</FormTextTitle>
                          <FormText>{getLabelOfOption(intendedUseOptions, contractRent.intended_use)}</FormText>
                        </Authorization>
                      </Column>
                      {(rentType === RentTypes.INDEX ||
                        rentType === RentTypes.MANUAL) &&
                        <Column small={6} medium={4} large={2}>
                          <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentContractRentsFieldPaths.BASE_AMOUNT)}>
                            <FormTextTitle>{LeaseRentContractRentsFieldTitles.BASE_AMOUNT}</FormTextTitle>
                            <FormText>{baseAmountText || '-'}</FormText>
                          </Authorization>
                        </Column>
                      }
                      {(rentType === RentTypes.INDEX ||
                        rentType === RentTypes.MANUAL) &&
                        <Column small={6} medium={4} large={2} offsetOnLarge={1}>
                          <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentContractRentsFieldPaths.BASE_YEAR_RENT)}>
                            <FormTextTitle>{LeaseRentContractRentsFieldTitles.BASE_YEAR_RENT}</FormTextTitle>
                            <FormText>{!isEmptyValue(contractRent.base_year_rent) ? `${formatNumber(contractRent.base_year_rent)} €` : '-'}</FormText>
                          </Authorization>
                        </Column>
                      }
                      <Column small={6} medium={4} large={1}>
                        <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentContractRentsFieldPaths.START_DATE)}>
                          <FormTextTitle>{LeaseRentContractRentsFieldTitles.START_DATE}</FormTextTitle>
                          <FormText>{contractRent.start_date ? formatDate(contractRent.start_date) : '-'}</FormText>
                        </Authorization>
                      </Column>
                      <Column small={6} medium={4} large={1}>
                        <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentContractRentsFieldPaths.END_DATE)}>
                          <FormTextTitle>{LeaseRentContractRentsFieldTitles.END_DATE}</FormTextTitle>
                          <FormText>{contractRent.end_date ? formatDate(contractRent.end_date) : '-'}</FormText>
                        </Authorization>
                      </Column>
                    </Row>
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
  connect(
    (state) => {
      return {
        leaseAttributes: getLeaseAttributes(state),
      };
    },
  ),
)(ContractRents);
