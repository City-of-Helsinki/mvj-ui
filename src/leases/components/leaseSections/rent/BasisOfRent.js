// @flow
import React, {Fragment} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';

import ActionButtonWrapper from '$components/form/ActionButtonWrapper';
import Authorization from '$components/authorization/Authorization';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import BoxItem from '$components/content/BoxItem';
import Divider from '$components/content/Divider';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import RemoveButton from '$components/form/RemoveButton';
import SubTitle from '$components/content/SubTitle';
import UnarchiveButton from '$components/form/UnarchiveButton';
import WhiteBox from '$components/content/WhiteBox';
import {
  BasisOfRentManagementSubventionsFieldPaths,
  BasisOfRentManagementSubventionsFieldTitles,
  BasisOfRentTemporarySubventionsFieldPaths,
  BasisOfRentTemporarySubventionsFieldTitles,
  LeaseBasisOfRentsFieldPaths,
  LeaseBasisOfRentsFieldTitles,
  SubventionTypes,
} from '$src/leases/enums';
import {calculateReLeaseDiscountPercent, calculateRentAdjustmentSubventionAmount} from '$src/leases/helpers';
import {getUiDataLeaseKey} from '$src/uiData/helpers';
import {getUserFullName} from '$src/users/helpers';
import {
  convertStrToDecimalNumber,
  formatDate,
  formatNumber,
  getLabelOfOption,
  isDecimalNumberStr,
  isEmptyValue,
  isFieldAllowedToEdit,
  isFieldAllowedToRead,
} from '$util/helpers';
import {getAttributes as getLeaseAttributes} from '$src/leases/selectors';

import type {Attributes} from '$src/types';

type Props = {
  areaUnitOptions: Array<Object>,
  basisOfRent: Object,
  indexOptions: Array<Object>,
  intendedUseOptions: Array<Object>,
  leaseAttributes: Attributes,
  managementTypeOptions: Array<Object>,
  onRemove?: Function,
  onUnarchive?: Function,
  subventionTypeOptions: Array<Object>,
}

const BasisOfRent = ({
  areaUnitOptions,
  basisOfRent,
  indexOptions,
  intendedUseOptions,
  leaseAttributes,
  managementTypeOptions,
  onRemove,
  onUnarchive,
  subventionTypeOptions,
}: Props) => {
  const getIndexValue = () => {
    if(!basisOfRent.index || !indexOptions.length) return null;
    const indexObj = indexOptions.find((item) => item.value === basisOfRent.index);

    if(indexObj) {
      const indexValue = indexObj.label.match(/=(.*)/)[1];
      return indexValue;
    }
    return null;
  };

  const getCurrentAmountPerArea = () => {
    const indexValue = getIndexValue();

    if(!isDecimalNumberStr(indexValue) || !isDecimalNumberStr(basisOfRent.amount_per_area)) return null;

    return Number(convertStrToDecimalNumber(indexValue))/100
      * Number(convertStrToDecimalNumber(basisOfRent.amount_per_area));
  };

  const getAreaText = (amount: ?number) => {
    if(isEmptyValue(amount)) return '-';
    if(isEmptyValue(basisOfRent.area_unit)) return `${formatNumber(amount)} €`;
    return `${formatNumber(amount)} ${getLabelOfOption(areaUnitOptions, basisOfRent.area_unit)}`;
  };

  const getAmountPerAreaText = (amount: ?number) => {
    if(isEmptyValue(amount)) return '-';
    if(isEmptyValue(basisOfRent.area_unit)) return `${formatNumber(amount)} €`;
    return `${formatNumber(amount)} € / ${getLabelOfOption(areaUnitOptions, basisOfRent.area_unit)}`;
  };

  const getPlansInspectedText = () => {
    if(!basisOfRent.plans_inspected_at) return '-';
    if(!basisOfRent.plans_inspected_by) return formatDate(basisOfRent.plans_inspected_at) || '-';
    return `${formatDate(basisOfRent.plans_inspected_at) || ''} ${getUserFullName(basisOfRent.plans_inspected_by)}`;
  };

  const getLockedText = () => {
    if(!basisOfRent.locked_at) return '-';
    if(!basisOfRent.locked_by) return formatDate(basisOfRent.locked_at) || '-';
    return `${formatDate(basisOfRent.locked_at) || ''} ${getUserFullName(basisOfRent.locked_by)}`;
  };

  const getBasicAnnualRent = () => {
    if(!isDecimalNumberStr(basisOfRent.amount_per_area) || !isDecimalNumberStr(basisOfRent.area)) return null;
    return Number(convertStrToDecimalNumber(basisOfRent.amount_per_area))
      * Number(convertStrToDecimalNumber(basisOfRent.area))
      * Number(isDecimalNumberStr(basisOfRent.profit_margin_percentage) ? Number(convertStrToDecimalNumber(basisOfRent.profit_margin_percentage))/100 : 0);
  };

  const getInitialYearRent = () => {
    const currentAmountPerArea = getCurrentAmountPerArea();

    if(!isDecimalNumberStr(currentAmountPerArea) || !isDecimalNumberStr(basisOfRent.area)) return null;
    return Number(convertStrToDecimalNumber(currentAmountPerArea))
      * Number(convertStrToDecimalNumber(basisOfRent.area))
      * Number(isDecimalNumberStr(basisOfRent.profit_margin_percentage) ? Number(convertStrToDecimalNumber(basisOfRent.profit_margin_percentage))/100 : 0);
  };

  const getDiscountedInitialYearRent = () => {
    const initialYearRent = getInitialYearRent();

    if(!isDecimalNumberStr(initialYearRent)) return null;
    return Number(convertStrToDecimalNumber(initialYearRent))
      * Number(isDecimalNumberStr(basisOfRent.discount_percentage) ? (100 - Number(convertStrToDecimalNumber(basisOfRent.discount_percentage)))/100 : 1);
  };

  const getReLeaseDiscountPercent = () => {
    return calculateReLeaseDiscountPercent(
      basisOfRent.subvention_base_percent,
      basisOfRent.subvention_graduated_percent);
  };

  const getSubventionAmount = () => {
    return calculateRentAdjustmentSubventionAmount(
      basisOfRent.subvention_type,
      basisOfRent.subvention_base_percent,
      basisOfRent.subvention_graduated_percent,
      basisOfRent.management_subventions,
      basisOfRent.temporary_subventions);
  };

  const areaText = getAreaText(basisOfRent.area);
  const amountPerAreaText = getAmountPerAreaText(basisOfRent.amount_per_area);
  const plansInspectedText = getPlansInspectedText();
  const lockedText = getLockedText();
  const currentAmountPerArea = getCurrentAmountPerArea();
  const currentAmountPerAreaText = getAmountPerAreaText(currentAmountPerArea);
  const basicAnnualRent = getBasicAnnualRent();
  const initialYearRent = getInitialYearRent();
  const discountedInitialYearRent = getDiscountedInitialYearRent();
  const managementSubventions = basisOfRent.management_subventions;
  const temporarySubventions = basisOfRent.temporary_subventions;

  return(
    <BoxItem className='no-border-on-first-child no-border-on-last-child'>
      {(onUnarchive || onRemove) &&
        <ActionButtonWrapper>
          {onUnarchive &&
            <Authorization allow={isFieldAllowedToEdit(leaseAttributes, LeaseBasisOfRentsFieldPaths.ARCHIVED_AT)}>
              <UnarchiveButton onClick={onUnarchive}/>
            </Authorization>
          }
          {onRemove && !basisOfRent.locked_at &&
            <Authorization allow={isFieldAllowedToEdit(leaseAttributes, LeaseBasisOfRentsFieldPaths.BASIS_OF_RENTS)}>
              <RemoveButton onClick={onRemove} title="Poista vuokralaskuri" />
            </Authorization>
          }
        </ActionButtonWrapper>
      }
      <BoxContentWrapper>
        <Row>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.INTENDED_USE)}>
              <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.INTENDED_USE)}>
                {LeaseBasisOfRentsFieldTitles.INTENDED_USE}
              </FormTextTitle>
              <FormText>{getLabelOfOption(intendedUseOptions, basisOfRent.intended_use) || '-'}</FormText>
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA)}>
              <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.AREA)}>
                {LeaseBasisOfRentsFieldTitles.AREA}
              </FormTextTitle>
              <FormText>{areaText}</FormText>
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.PLANS_INSPECTED_AT)}>
              <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.PLANS_INSPECTED_AT)}>
                {LeaseBasisOfRentsFieldTitles.PLANS_INSPECTED_AT}
              </FormTextTitle>
              <FormText>{plansInspectedText}</FormText>
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.LOCKED_AT)}>
              <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.LOCKED_AT)}>
                {LeaseBasisOfRentsFieldTitles.LOCKED_AT}
              </FormTextTitle>
              <FormText>{lockedText}</FormText>
            </Authorization>
          </Column>
        </Row>
        <Row>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA)}>
              <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA)}>
                {LeaseBasisOfRentsFieldTitles.AMOUNT_PER_AREA}
              </FormTextTitle>
              <FormText>{amountPerAreaText}</FormText>
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX)}>
              <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.INDEX)}>
                {LeaseBasisOfRentsFieldTitles.INDEX}
              </FormTextTitle>
              <FormText>{getLabelOfOption(indexOptions, basisOfRent.index) || '-'}</FormText>
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA) && isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX)}>
              <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.UNIT_PRICE)}>
                {LeaseBasisOfRentsFieldTitles.UNIT_PRICE}
              </FormTextTitle>
              <FormText>{currentAmountPerAreaText}</FormText>
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.PROFIT_MARGIN_PERCENTAGE)}>
              <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.PROFIT_MARGIN_PERCENTAGE)}>
                {LeaseBasisOfRentsFieldTitles.PROFIT_MARGIN_PERCENTAGE}
              </FormTextTitle>
              <FormText>{!isEmptyValue(basisOfRent.profit_margin_percentage) ? `${formatNumber(basisOfRent.profit_margin_percentage)} %` : '-'}</FormText>
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={
              isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) &&
              isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA)
            }>
              <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.BASE_YEAR_RENT)}>
                {LeaseBasisOfRentsFieldTitles.BASE_YEAR_RENT}
              </FormTextTitle>
              <FormText>{!isEmptyValue(basicAnnualRent) ? `${formatNumber(basicAnnualRent)} €/v` : '-'}</FormText>
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={
              isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) &&
              isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA) &&
              isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX) &&
              isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.PROFIT_MARGIN_PERCENTAGE)
            }>
              <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.INITIAL_YEAR_RENT)}>
                {LeaseBasisOfRentsFieldTitles.INITIAL_YEAR_RENT}
              </FormTextTitle>
              <FormText>{!isEmptyValue(initialYearRent) ? `${formatNumber(initialYearRent)} €/v` : '-'}</FormText>
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.DISCOUNT_PERCENTAGE)}>
              <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.DISCOUNT_PERCENTAGE)}>
                {LeaseBasisOfRentsFieldTitles.DISCOUNT_PERCENTAGE}
              </FormTextTitle>
              <FormText>{!isEmptyValue(basisOfRent.discount_percentage) ? `${formatNumber(basisOfRent.discount_percentage)} %` : '-'}</FormText>
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={
              isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) &&
              isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA) &&
              isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX) &&
              isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.PROFIT_MARGIN_PERCENTAGE) &&
              isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.DISCOUNT_PERCENTAGE)
            }>
              <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.DISCOUNTED_INITIAL_YEAR_RENT)}>
                {LeaseBasisOfRentsFieldTitles.DISCOUNTED_INITIAL_YEAR_RENT}
              </FormTextTitle>
              <FormText>{!isEmptyValue(discountedInitialYearRent) ? `${formatNumber(discountedInitialYearRent)} €/v` : '-'}</FormText>
            </Authorization>
          </Column>
        </Row>

        {basisOfRent.subvention_type &&
          <WhiteBox>
            <Row>
              <Column small={6} medium={4} large={2}>
                <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.SUBVENTION_TYPE)}>
                  <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.SUBVENTION_TYPE)}>
                    {LeaseBasisOfRentsFieldTitles.SUBVENTION_TYPE}
                  </FormTextTitle>
                  <FormText>{getLabelOfOption(subventionTypeOptions, basisOfRent.subvention_type) || '-'}</FormText>
                </Authorization>
              </Column>
            </Row>
            {basisOfRent.subvention_type === SubventionTypes.X_DISCOUNT &&
              <Authorization allow={isFieldAllowedToRead(leaseAttributes, BasisOfRentManagementSubventionsFieldPaths.MANAGEMENT_SUBVENTIONS)}>
                <SubTitle enableUiDataEdit uiDataKey={getUiDataLeaseKey(BasisOfRentManagementSubventionsFieldPaths.MANAGEMENT_SUBVENTIONS)}>{BasisOfRentManagementSubventionsFieldTitles.MANAGEMENT_SUBVENTIONS}</SubTitle>
                {!managementSubventions || !managementSubventions.length &&
                  <FormText>Ei hallintamuotoja</FormText>
                }
                {managementSubventions && managementSubventions.length &&
                  <Fragment>
                    <Row>
                      <Column small={6} medium={4} large={2}>
                        <Authorization allow={isFieldAllowedToRead(leaseAttributes, BasisOfRentManagementSubventionsFieldPaths.MANAGEMENT)}>
                          <FormTextTitle uiDataKey={getUiDataLeaseKey(BasisOfRentManagementSubventionsFieldPaths.MANAGEMENT)}>
                            {BasisOfRentManagementSubventionsFieldTitles.MANAGEMENT}
                          </FormTextTitle>
                        </Authorization>
                      </Column>
                      <Column small={6} medium={4} large={2}>
                        <Authorization allow={isFieldAllowedToRead(leaseAttributes, BasisOfRentManagementSubventionsFieldPaths.SUBVENTION_PERCENT)}>
                          <FormTextTitle uiDataKey={getUiDataLeaseKey(BasisOfRentManagementSubventionsFieldPaths.SUBVENTION_PERCENT)}>
                            {BasisOfRentManagementSubventionsFieldTitles.SUBVENTION_PERCENT}
                          </FormTextTitle>
                        </Authorization>
                      </Column>
                    </Row>

                    {managementSubventions.map((subvention) =>
                      <Row key={subvention.id}>
                        <Column small={6} medium={4} large={2}>
                          <Authorization allow={isFieldAllowedToRead(leaseAttributes, BasisOfRentManagementSubventionsFieldPaths.MANAGEMENT)}>
                            <FormText>{getLabelOfOption(managementTypeOptions, subvention.management) || '-'}</FormText>
                          </Authorization>
                        </Column>
                        <Column small={6} medium={4} large={2}>
                          <Authorization allow={isFieldAllowedToRead(leaseAttributes, BasisOfRentManagementSubventionsFieldPaths.SUBVENTION_PERCENT)}>
                            <FormText>{!isEmptyValue(subvention.subvention_percent) ? `${formatNumber(subvention.subvention_percent)} %` : '-'}</FormText>
                          </Authorization>
                        </Column>
                      </Row>
                    )}
                  </Fragment>
                }

              </Authorization>
            }
            {basisOfRent.subvention_type === SubventionTypes.RE_LEASE_DISCOUNT &&
              <Row>
                <Column small={6} medium={4} large={2}>
                  <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.SUBVENTION_BASE_PERCENT)}>
                    <FormTextTitle  enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.SUBVENTION_BASE_PERCENT)}>
                      {LeaseBasisOfRentsFieldTitles.SUBVENTION_BASE_PERCENT}
                    </FormTextTitle>
                    <FormText>{!isEmptyValue(basisOfRent.subvention_base_percent) ? `${formatNumber(basisOfRent.subvention_base_percent)} %` : '-'}</FormText>
                  </Authorization>
                </Column>
                <Column small={6} medium={4} large={2}>
                  <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.SUBVENTION_GRADUATED_PERCENT)}>
                    <FormTextTitle  enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.SUBVENTION_GRADUATED_PERCENT)}>
                      {LeaseBasisOfRentsFieldTitles.SUBVENTION_GRADUATED_PERCENT}
                    </FormTextTitle>
                    <FormText>{!isEmptyValue(basisOfRent.subvention_graduated_percent) ? `${formatNumber(basisOfRent.subvention_graduated_percent)} %` : '-'}</FormText>
                  </Authorization>
                </Column>
                <Column small={6} medium={4} large={2}>
                  <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.SUBVENTION_BASE_PERCENT) ||
                    isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.SUBVENTION_BASE_PERCENT)}>
                    <FormTextTitle  enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.SUBVENTION_RE_LEASE_DISCOUNT_PRECENT)}>
                      {LeaseBasisOfRentsFieldTitles.SUBVENTION_RE_LEASE_DISCOUNT_PRECENT}
                    </FormTextTitle>
                    <FormText>{formatNumber(getReLeaseDiscountPercent())} %</FormText>
                  </Authorization>
                </Column>
              </Row>
            }

            <Authorization allow={isFieldAllowedToRead(leaseAttributes, BasisOfRentTemporarySubventionsFieldPaths.TEMPORARY_SUBVENTIONS)}>
              <SubTitle enableUiDataEdit uiDataKey={getUiDataLeaseKey(BasisOfRentTemporarySubventionsFieldPaths.TEMPORARY_SUBVENTIONS)}>
                {BasisOfRentTemporarySubventionsFieldTitles.TEMPORARY_SUBVENTIONS}
              </SubTitle>
              {!temporarySubventions || !temporarySubventions.length &&
                <FormText>Ei tilapäisalennuksia</FormText>
              }
              {temporarySubventions && temporarySubventions.length &&
                <Fragment>
                  <Row>
                    <Column small={6} medium={4} large={2}>
                      <Authorization allow={isFieldAllowedToRead(leaseAttributes, BasisOfRentTemporarySubventionsFieldPaths.DESCRIPTION)}>
                        <FormTextTitle uiDataKey={getUiDataLeaseKey(BasisOfRentTemporarySubventionsFieldPaths.DESCRIPTION)}>
                          {BasisOfRentTemporarySubventionsFieldTitles.DESCRIPTION}
                        </FormTextTitle>
                      </Authorization>
                    </Column>
                    <Column small={6} medium={4} large={2}>
                      <Authorization allow={isFieldAllowedToRead(leaseAttributes, BasisOfRentTemporarySubventionsFieldPaths.SUBVENTION_PERCENT)}>
                        <FormTextTitle uiDataKey={getUiDataLeaseKey(BasisOfRentTemporarySubventionsFieldPaths.SUBVENTION_PERCENT)}>
                          {BasisOfRentTemporarySubventionsFieldTitles.SUBVENTION_PERCENT}
                        </FormTextTitle>
                      </Authorization>
                    </Column>
                  </Row>

                  {temporarySubventions.map((subvention) =>
                    <Row key={subvention.id}>
                      <Column small={6} medium={4} large={2}>
                        <Authorization allow={isFieldAllowedToRead(leaseAttributes, BasisOfRentTemporarySubventionsFieldPaths.DESCRIPTION)}>
                          <FormText>{subvention.description}</FormText>
                        </Authorization>
                      </Column>
                      <Column small={6} medium={4} large={2}>
                        <Authorization allow={isFieldAllowedToRead(leaseAttributes, BasisOfRentTemporarySubventionsFieldPaths.DESCRIPTION)}>
                          <FormText>{!isEmptyValue(subvention.subvention_percent) ? `${formatNumber(subvention.subvention_percent)} %` : '-'}</FormText>
                        </Authorization>
                      </Column>
                    </Row>
                  )}
                </Fragment>
              }
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
                <FormText className='semibold'>{formatNumber(getSubventionAmount())} %</FormText>
              </Column>
            </Row>
          </WhiteBox>
        }
      </BoxContentWrapper>
    </BoxItem>
  );
};

export default connect(
  (state) => {
    return {
      leaseAttributes: getLeaseAttributes(state),
    };
  }
)(BasisOfRent);
