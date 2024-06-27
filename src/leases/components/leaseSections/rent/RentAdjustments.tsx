import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Row, Column } from "react-foundation";
import Authorization from "/src/components/authorization/Authorization";
import BoxItem from "/src/components/content/BoxItem";
import BoxItemContainer from "/src/components/content/BoxItemContainer";
import DecisionLink from "/src/components/links/DecisionLink";
import Divider from "/src/components/content/Divider";
import GreenBox from "/src/components/content/GreenBox";
import FormText from "/src/components/form/FormText";
import FormTextTitle from "/src/components/form/FormTextTitle";
import SubTitle from "/src/components/content/SubTitle";
import { LeaseRentAdjustmentsFieldPaths, LeaseRentAdjustmentsFieldTitles, RentAdjustmentManagementSubventionsFieldPaths, RentAdjustmentManagementSubventionsFieldTitles, RentAdjustmentAmountTypes, RentAdjustmentTypes, SubventionTypes, RentAdjustmentTemporarySubventionsFieldPaths, RentAdjustmentTemporarySubventionsFieldTitles } from "/src/leases/enums";
import { calculateReLeaseDiscountPercent, getDecisionById, getDecisionOptions } from "/src/leases/helpers";
import { getUiDataLeaseKey } from "/src/uiData/helpers";
import { formatDate, formatNumber, getFieldOptions, getLabelOfOption, isEmptyValue, isFieldAllowedToRead } from "util/helpers";
import { getAttributes as getLeaseAttributes, getCurrentLease } from "/src/leases/selectors";
import type { Attributes } from "types";
import type { Lease } from "/src/leases/types";
type Props = {
  currentLease: Lease;
  leaseAttributes: Attributes;
  rentAdjustments: Array<Record<string, any>>;
};

const RentAdjustments = ({
  currentLease,
  leaseAttributes,
  rentAdjustments
}: Props) => {
  const decisionOptions = getDecisionOptions(currentLease),
        typeOptions = getFieldOptions(leaseAttributes, LeaseRentAdjustmentsFieldPaths.TYPE),
        intendedUseOptions = getFieldOptions(leaseAttributes, LeaseRentAdjustmentsFieldPaths.INTENDED_USE),
        amountTypeOptions = getFieldOptions(leaseAttributes, LeaseRentAdjustmentsFieldPaths.AMOUNT_TYPE),
        subventionTypeOptions = getFieldOptions(leaseAttributes, LeaseRentAdjustmentsFieldPaths.SUBVENTION_TYPE),
        managementTypeOptions = getFieldOptions(leaseAttributes, RentAdjustmentManagementSubventionsFieldPaths.MANAGEMENT);

  const getFullAmountText = (adjustment: Record<string, any>) => {
    if (!adjustment.full_amount) return null;
    return `${formatNumber(adjustment.full_amount)} ${getLabelOfOption(amountTypeOptions, adjustment.amount_type) || ''}`;
  };

  return <BoxItemContainer>
      {(!rentAdjustments || !rentAdjustments.length) && <FormText>Ei alennuksia tai korotuksia</FormText>}

      {rentAdjustments && !!rentAdjustments.length && rentAdjustments.map((adjustment, index) => {
      const getReLeaseDiscountPercent = () => {
        return calculateReLeaseDiscountPercent(adjustment.subvention_base_percent, adjustment.subvention_graduated_percent);
      };

      const decision = getDecisionById(currentLease, adjustment.decision);
      const managementSubventions = adjustment.management_subventions;
      const temporarySubventions = adjustment.temporary_subventions;
      return <BoxItem className='no-border-on-first-child no-border-on-last-child' key={index}>
              <Row>
                <Column small={6} medium={4} large={2}>
                  <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentAdjustmentsFieldPaths.TYPE)}>
                    <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseRentAdjustmentsFieldPaths.TYPE)}>
                      {LeaseRentAdjustmentsFieldTitles.TYPE}
                    </FormTextTitle>
                    <FormText>{getLabelOfOption(typeOptions, adjustment.type) || '-'}</FormText>
                  </Authorization>
                </Column>
                <Column small={6} medium={4} large={2}>
                  <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentAdjustmentsFieldPaths.INTENDED_USE)}>
                    <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseRentAdjustmentsFieldPaths.INTENDED_USE)}>
                      {LeaseRentAdjustmentsFieldTitles.INTENDED_USE}
                    </FormTextTitle>
                    <FormText>{getLabelOfOption(intendedUseOptions, adjustment.intended_use) || '-'}</FormText>
                  </Authorization>
                </Column>
                <Column small={6} medium={4} large={2}>
                  <Row>
                    <Column small={6}>
                      <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentAdjustmentsFieldPaths.START_DATE)}>
                        <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseRentAdjustmentsFieldPaths.START_DATE)}>
                          {LeaseRentAdjustmentsFieldTitles.START_DATE}
                        </FormTextTitle>
                        <FormText>{formatDate(adjustment.start_date) || '-'}</FormText>
                      </Authorization>
                    </Column>
                    <Column small={6}>
                      <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentAdjustmentsFieldPaths.END_DATE)}>
                        {adjustment.amount_type !== RentAdjustmentAmountTypes.AMOUNT_TOTAL && <Fragment>
                            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseRentAdjustmentsFieldPaths.END_DATE)}>
                              {LeaseRentAdjustmentsFieldTitles.END_DATE}
                            </FormTextTitle>
                            <FormText>{formatDate(adjustment.end_date) || '-'}</FormText>
                          </Fragment>}
                      </Authorization>
                    </Column>
                  </Row>
                </Column>
                <Column small={6} medium={4} large={2}>
                  <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentAdjustmentsFieldPaths.FULL_AMOUNT)}>
                    <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseRentAdjustmentsFieldPaths.FULL_AMOUNT)}>
                      {LeaseRentAdjustmentsFieldTitles.FULL_AMOUNT}
                    </FormTextTitle>
                    <FormText>{getFullAmountText(adjustment) || '-'}</FormText>
                  </Authorization>
                </Column>
                <Column small={6} medium={4} large={2}>
                  <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentAdjustmentsFieldPaths.AMOUNT_LEFT)}>
                    {adjustment.amount_type === RentAdjustmentAmountTypes.AMOUNT_TOTAL && <Fragment>
                        <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseRentAdjustmentsFieldPaths.AMOUNT_LEFT)}>
                          {LeaseRentAdjustmentsFieldTitles.AMOUNT_LEFT}
                        </FormTextTitle>
                        <FormText>{adjustment.amount_left ? `${formatNumber(adjustment.amount_left)} €` : '-'}</FormText>
                      </Fragment>}
                  </Authorization>
                </Column>
                <Column small={6} medium={4} large={2}>
                  <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentAdjustmentsFieldPaths.DECISION)}>
                    <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseRentAdjustmentsFieldPaths.DECISION)}>
                      {LeaseRentAdjustmentsFieldTitles.DECISION}
                    </FormTextTitle>
                    <DecisionLink decision={decision} decisionOptions={decisionOptions} />
                  </Authorization>
                </Column>
              </Row>

              <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentAdjustmentsFieldPaths.NOTE)}>
                <Row>
                  <Column>
                    <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseRentAdjustmentsFieldPaths.NOTE)}>
                      {LeaseRentAdjustmentsFieldTitles.NOTE}
                    </FormTextTitle>
                    <FormText>{adjustment.note || '-'}</FormText>
                  </Column>
                </Row>
              </Authorization>

              {adjustment.type === RentAdjustmentTypes.DISCOUNT && adjustment.subvention_type && <GreenBox className='with-bottom-margin'>
                  <Row>
                    <Column small={6} medium={4} large={2}>
                      <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentAdjustmentsFieldPaths.SUBVENTION_TYPE)}>
                        <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseRentAdjustmentsFieldPaths.SUBVENTION_TYPE)}>
                          {LeaseRentAdjustmentsFieldTitles.SUBVENTION_TYPE}
                        </FormTextTitle>
                        <FormText>{getLabelOfOption(subventionTypeOptions, adjustment.subvention_type) || '-'}</FormText>
                      </Authorization>
                    </Column>
                  </Row>
                  {adjustment.subvention_type === SubventionTypes.FORM_OF_MANAGEMENT && <Authorization allow={isFieldAllowedToRead(leaseAttributes, RentAdjustmentManagementSubventionsFieldPaths.MANAGEMENT_SUBVENTIONS)}>
                      <SubTitle enableUiDataEdit uiDataKey={getUiDataLeaseKey(RentAdjustmentManagementSubventionsFieldPaths.MANAGEMENT_SUBVENTIONS)}>{RentAdjustmentManagementSubventionsFieldTitles.MANAGEMENT_SUBVENTIONS}</SubTitle>
                      {!managementSubventions || !managementSubventions.length && <FormText>Ei hallintamuotoja</FormText>}
                      {managementSubventions && managementSubventions.length && <Fragment>
                          <Row>
                            <Column small={6} medium={4} large={2}>
                              <Authorization allow={isFieldAllowedToRead(leaseAttributes, RentAdjustmentManagementSubventionsFieldPaths.MANAGEMENT)}>
                                <FormTextTitle uiDataKey={getUiDataLeaseKey(RentAdjustmentManagementSubventionsFieldPaths.MANAGEMENT)}>
                                  {RentAdjustmentManagementSubventionsFieldTitles.MANAGEMENT}
                                </FormTextTitle>
                              </Authorization>
                            </Column>
                            <Column small={6} medium={4} large={2}>
                              <Authorization allow={isFieldAllowedToRead(leaseAttributes, RentAdjustmentManagementSubventionsFieldPaths.SUBVENTION_AMOUNT)}>
                                <FormTextTitle uiDataKey={getUiDataLeaseKey(RentAdjustmentManagementSubventionsFieldPaths.SUBVENTION_AMOUNT)}>
                                  {RentAdjustmentManagementSubventionsFieldTitles.SUBVENTION_PERCENT}
                                </FormTextTitle>
                              </Authorization>
                            </Column>
                          </Row>

                          {managementSubventions.map(subvention => <Row key={subvention.id}>
                              <Column small={6} medium={4} large={2}>
                                <Authorization allow={isFieldAllowedToRead(leaseAttributes, RentAdjustmentManagementSubventionsFieldPaths.MANAGEMENT)}>
                                  <FormText>{getLabelOfOption(managementTypeOptions, subvention.management) || '-'}</FormText>
                                </Authorization>
                              </Column>
                              <Column small={6} medium={4} large={2}>
                                <Authorization allow={isFieldAllowedToRead(leaseAttributes, RentAdjustmentManagementSubventionsFieldPaths.SUBVENTION_AMOUNT)}>
                                  <FormText>{!isEmptyValue(subvention.subvention_amount) ? `${formatNumber(subvention.subvention_amount)} %` : '-'}</FormText>
                                </Authorization>
                              </Column>
                            </Row>)}
                        </Fragment>}

                    </Authorization>}
                  {adjustment.subvention_type === SubventionTypes.RE_LEASE && <Row>
                      <Column small={6} medium={4} large={2}>
                        <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentAdjustmentsFieldPaths.SUBVENTION_BASE_PERCENT)}>
                          <FormTextTitle enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseRentAdjustmentsFieldPaths.SUBVENTION_BASE_PERCENT)}>
                            {LeaseRentAdjustmentsFieldTitles.SUBVENTION_BASE_PERCENT}
                          </FormTextTitle>
                          <FormText>{!isEmptyValue(adjustment.subvention_base_percent) ? `${formatNumber(adjustment.subvention_base_percent)} %` : '-'}</FormText>
                        </Authorization>
                      </Column>
                      <Column small={6} medium={4} large={2}>
                        <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentAdjustmentsFieldPaths.SUBVENTION_GRADUATED_PERCENT)}>
                          <FormTextTitle enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseRentAdjustmentsFieldPaths.SUBVENTION_GRADUATED_PERCENT)}>
                            {LeaseRentAdjustmentsFieldTitles.SUBVENTION_GRADUATED_PERCENT}
                          </FormTextTitle>
                          <FormText>{!isEmptyValue(adjustment.subvention_graduated_percent) ? `${formatNumber(adjustment.subvention_graduated_percent)} %` : '-'}</FormText>
                        </Authorization>
                      </Column>
                      <Column small={6} medium={4} large={2}>
                        <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentAdjustmentsFieldPaths.SUBVENTION_BASE_PERCENT) || isFieldAllowedToRead(leaseAttributes, LeaseRentAdjustmentsFieldPaths.SUBVENTION_BASE_PERCENT)}>
                          <FormTextTitle enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseRentAdjustmentsFieldPaths.SUBVENTION_RE_LEASE_DISCOUNT_PRECENT)}>
                            {LeaseRentAdjustmentsFieldTitles.SUBVENTION_RE_LEASE_DISCOUNT_PRECENT}
                          </FormTextTitle>
                          <FormText>{formatNumber(getReLeaseDiscountPercent())} %</FormText>
                        </Authorization>
                      </Column>
                    </Row>}

                  <Authorization allow={isFieldAllowedToRead(leaseAttributes, RentAdjustmentTemporarySubventionsFieldPaths.TEMPORARY_SUBVENTIONS)}>
                    <SubTitle enableUiDataEdit uiDataKey={getUiDataLeaseKey(RentAdjustmentTemporarySubventionsFieldPaths.TEMPORARY_SUBVENTIONS)}>
                      {RentAdjustmentTemporarySubventionsFieldTitles.TEMPORARY_SUBVENTIONS}
                    </SubTitle>
                    {!temporarySubventions || !temporarySubventions.length && <FormText>Ei tilapäisalennuksia</FormText>}
                    {temporarySubventions && temporarySubventions.length && <Fragment>
                        <Row>
                          <Column small={6} medium={4} large={2}>
                            <Authorization allow={isFieldAllowedToRead(leaseAttributes, RentAdjustmentTemporarySubventionsFieldPaths.DESCRIPTION)}>
                              <FormTextTitle uiDataKey={getUiDataLeaseKey(RentAdjustmentTemporarySubventionsFieldPaths.DESCRIPTION)}>
                                {RentAdjustmentTemporarySubventionsFieldTitles.DESCRIPTION}
                              </FormTextTitle>
                            </Authorization>
                          </Column>
                          <Column small={6} medium={4} large={2}>
                            <Authorization allow={isFieldAllowedToRead(leaseAttributes, RentAdjustmentTemporarySubventionsFieldPaths.SUBVENTION_PERCENT)}>
                              <FormTextTitle uiDataKey={getUiDataLeaseKey(RentAdjustmentTemporarySubventionsFieldPaths.SUBVENTION_PERCENT)}>
                                {RentAdjustmentTemporarySubventionsFieldTitles.SUBVENTION_PERCENT}
                              </FormTextTitle>
                            </Authorization>
                          </Column>
                        </Row>

                        {temporarySubventions.map(subvention => <Row key={subvention.id}>
                            <Column small={6} medium={4} large={2}>
                              <Authorization allow={isFieldAllowedToRead(leaseAttributes, RentAdjustmentTemporarySubventionsFieldPaths.DESCRIPTION)}>
                                <FormText>{subvention.description}</FormText>
                              </Authorization>
                            </Column>
                            <Column small={6} medium={4} large={2}>
                              <Authorization allow={isFieldAllowedToRead(leaseAttributes, RentAdjustmentTemporarySubventionsFieldPaths.DESCRIPTION)}>
                                <FormText>{!isEmptyValue(subvention.subvention_percent) ? `${formatNumber(subvention.subvention_percent)} %` : '-'}</FormText>
                              </Authorization>
                            </Column>
                          </Row>)}
                      </Fragment>}
                  </Authorization>

                  <Row>
                    <Column small={12} large={6}>
                      <Divider />
                    </Column>
                  </Row>
                  <Row>
                    <Column small={6} medium={4} large={2}>
                      <FormText className='semibold'>Yhteensä</FormText>
                    </Column>
                    <Column small={6} medium={4} large={2}>
                      <FormText className='semibold'>{formatNumber(adjustment.full_amount)} %</FormText>
                    </Column>
                  </Row>
                </GreenBox>}
            </BoxItem>;
    })}
    </BoxItemContainer>;
};

export default connect(state => {
  const currentLease = getCurrentLease(state);
  return {
    currentLease: currentLease,
    leaseAttributes: getLeaseAttributes(state)
  };
})(RentAdjustments);