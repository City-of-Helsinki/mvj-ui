import React, { Fragment, PureComponent } from "react";
import { connect } from "react-redux";
import { Row, Column } from "react-foundation";
import flowRight from "lodash/flowRight";
import Authorization from "/src/components/authorization/Authorization";
import BoxContentWrapper from "/src/components/content/BoxContentWrapper";
import BoxItem from "/src/components/content/BoxItem";
import BoxItemContainer from "/src/components/content/BoxItemContainer";
import FormText from "/src/components/form/FormText";
import FormTextTitle from "/src/components/form/FormTextTitle";
import { LeaseRentFixedInitialYearRentsFieldPaths, LeaseRentFixedInitialYearRentsFieldTitles } from "/src/leases/enums";
import { getUiDataLeaseKey } from "/src/uiData/helpers";
import { formatDate, formatNumber, getFieldOptions, getLabelOfOption, isEmptyValue, isFieldAllowedToRead } from "/src/util/helpers";
import { getAttributes as getLeaseAttributes } from "/src/leases/selectors";
import { withWindowResize } from "/src/components/resize/WindowResizeHandler";
import type { Attributes } from "types";
type Props = {
  fixedInitialYearRents: Array<Record<string, any>>;
  largeScreen: boolean;
  leaseAttributes: Attributes;
};
type State = {
  intendedUseOptions: Array<Record<string, any>>;
  leaseAttributes: Attributes;
};

class FixedInitialYearRentsEdit extends PureComponent<Props, State> {
  state = {
    intendedUseOptions: [],
    leaseAttributes: null
  };

  static getDerivedStateFromProps(props: Props, state: State) {
    if (props.leaseAttributes !== state.leaseAttributes) {
      return {
        leaseAttributes: props.leaseAttributes,
        intendedUseOptions: getFieldOptions(props.leaseAttributes, LeaseRentFixedInitialYearRentsFieldPaths.INTENDED_USE)
      };
    }

    return null;
  }

  render() {
    const {
      fixedInitialYearRents,
      largeScreen,
      leaseAttributes
    } = this.props;
    const {
      intendedUseOptions
    } = this.state;
    return <Fragment>
        <BoxItemContainer>
          {(!fixedInitialYearRents || !fixedInitialYearRents.length) && <FormText>Ei kiinteitä alkuvuosivuokria</FormText>}

          {fixedInitialYearRents && !!fixedInitialYearRents.length && largeScreen && <Row>
              <Column large={2}>
                <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentFixedInitialYearRentsFieldPaths.INTENDED_USE)}>
                  <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseRentFixedInitialYearRentsFieldPaths.INTENDED_USE)}>
                    {LeaseRentFixedInitialYearRentsFieldTitles.INTENDED_USE}
                  </FormTextTitle>
                </Authorization>
              </Column>
              <Column large={2}>
                <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentFixedInitialYearRentsFieldPaths.AMOUNT)}>
                  <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseRentFixedInitialYearRentsFieldPaths.AMOUNT)}>
                    {LeaseRentFixedInitialYearRentsFieldTitles.AMOUNT}
                  </FormTextTitle>
                </Authorization>
              </Column>
              <Column large={1}>
                <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentFixedInitialYearRentsFieldPaths.START_DATE)}>
                  <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseRentFixedInitialYearRentsFieldPaths.START_DATE)}>
                    {LeaseRentFixedInitialYearRentsFieldTitles.START_DATE}
                  </FormTextTitle>
                </Authorization>
              </Column>
              <Column large={1}>
                <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentFixedInitialYearRentsFieldPaths.END_DATE)}>
                  <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseRentFixedInitialYearRentsFieldPaths.END_DATE)}>
                    {LeaseRentFixedInitialYearRentsFieldTitles.END_DATE}
                  </FormTextTitle>
                </Authorization>
              </Column>
            </Row>}
          {fixedInitialYearRents && !!fixedInitialYearRents.length && fixedInitialYearRents.map((rent, index) => {
          if (largeScreen) {
            return <Row key={index}>
                  <Column small={3} medium={3} large={2}>
                    <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentFixedInitialYearRentsFieldPaths.INTENDED_USE)}>
                      <FormText>{getLabelOfOption(intendedUseOptions, rent.intended_use) || '-'}</FormText>
                    </Authorization>
                  </Column>
                  <Column small={3} medium={3} large={2}>
                    <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentFixedInitialYearRentsFieldPaths.AMOUNT)}>
                      <FormText>{!isEmptyValue(rent.amount) ? `${formatNumber(rent.amount)} €` : '-'}</FormText>
                    </Authorization>
                  </Column>
                  <Column small={3} medium={3} large={1}>
                    <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentFixedInitialYearRentsFieldPaths.START_DATE)}>
                      <FormText>{formatDate(rent.start_date) || '-'}</FormText>
                    </Authorization>
                  </Column>
                  <Column small={3} medium={3} large={1}>
                    <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentFixedInitialYearRentsFieldPaths.END_DATE)}>
                      <FormText>{formatDate(rent.end_date) || '-'}</FormText>
                    </Authorization>
                  </Column>
                </Row>;
          } else {
            return <BoxItem className='no-border-on-first-child no-border-on-last-child' key={index}>
                  <BoxContentWrapper>
                    <Row>
                      <Column small={6} medium={3} large={2}>
                        <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentFixedInitialYearRentsFieldPaths.INTENDED_USE)}>
                          <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseRentFixedInitialYearRentsFieldPaths.INTENDED_USE)}>
                            {LeaseRentFixedInitialYearRentsFieldTitles.INTENDED_USE}
                          </FormTextTitle>
                          <FormText>{getLabelOfOption(intendedUseOptions, rent.intended_use) || '-'}</FormText>
                        </Authorization>
                      </Column>
                      <Column small={6} medium={3} large={2}>
                        <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentFixedInitialYearRentsFieldPaths.AMOUNT)}>
                          <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseRentFixedInitialYearRentsFieldPaths.AMOUNT)}>
                            {LeaseRentFixedInitialYearRentsFieldTitles.AMOUNT}
                          </FormTextTitle>
                          <FormText>{!isEmptyValue(rent.amount) ? `${formatNumber(rent.amount)} €` : '-'}</FormText>
                        </Authorization>
                      </Column>
                      <Column small={6} medium={3} large={1}>
                        <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentFixedInitialYearRentsFieldPaths.START_DATE)}>
                          <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseRentFixedInitialYearRentsFieldPaths.START_DATE)}>
                            {LeaseRentFixedInitialYearRentsFieldTitles.START_DATE}
                          </FormTextTitle>
                          <FormText>{formatDate(rent.start_date) || '-'}</FormText>
                        </Authorization>
                      </Column>
                      <Column small={6} medium={3} large={1}>
                        <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentFixedInitialYearRentsFieldPaths.END_DATE)}>
                          <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseRentFixedInitialYearRentsFieldPaths.END_DATE)}>
                            {LeaseRentFixedInitialYearRentsFieldTitles.END_DATE}
                          </FormTextTitle>
                          <FormText>{formatDate(rent.end_date) || '-'}</FormText>
                        </Authorization>
                      </Column>
                    </Row>
                  </BoxContentWrapper>
                </BoxItem>;
          }
        })}
        </BoxItemContainer>
      </Fragment>;
  }

}

export default flowRight(withWindowResize, connect(state => {
  return {
    leaseAttributes: getLeaseAttributes(state)
  };
}))(FixedInitialYearRentsEdit);