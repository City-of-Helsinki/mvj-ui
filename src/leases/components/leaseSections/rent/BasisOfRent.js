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
  CalculatorTypes,
  calculatorTypeOptions,
} from '$src/leases/enums';
import {
  calculateBasisOfRentAmountPerArea,
  calculateBasisOfRentBasicAnnualRent,
  calculateBasisOfRentDiscountedInitialYearRent,
  calculateBasisOfRentInitialYearRent,
  calculateBasisOfRentSubventionAmount,
  calculateBasisOfRentSubventionAmountCumulative,
  calculateBasisOfRentSubventionPercantage,
  calculateReLeaseDiscountPercent, 
  calculateBasisOfRentSubventionPercent,
  calculateSubventionDiscountTotal,
  calculateSubventionDiscountTotalFromReLease,
  calculateTemporarySubventionDiscountPercentage,
  getBasisOfRentIndexValue,
  calculateExtraRent,
  calculateFieldsRent,
  calculateTemporaryRent,
  calculateBasicAnnualRentIndexed,
  mastCalculatorRent,
  calculateRackAndHeightPrice,
  getZonePriceFromValue,
} from '$src/leases/helpers';
import {getUiDataLeaseKey} from '$src/uiData/helpers';
import {getUserFullName} from '$src/users/helpers';
import {
  formatDate,
  formatNumber,
  getLabelOfOption,
  isEmptyValue,
  isFieldAllowedToEdit,
  isFieldAllowedToRead,
  getFieldOptions,
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
  showTotal: boolean,
  subventionTypeOptions: Array<Object>,
  totalDiscountedInitialYearRent: number,
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
  showTotal,
  subventionTypeOptions,
  totalDiscountedInitialYearRent,
}: Props) => {
  const getAreaText = (amount: ?number) => {
    if(isEmptyValue(amount)) return '-';
    if(isEmptyValue(basisOfRent.area_unit)) return `${formatNumber(amount)} €`;
    return `${formatNumber(amount)} ${basisOfRent.type === CalculatorTypes.FIELD ? 'ha' : getLabelOfOption(areaUnitOptions, basisOfRent.area_unit) || ''}`;
  };

  const getAmountPerAreaText = (amount: ?number) => {
    if(isEmptyValue(amount)) return '-';
    if(isEmptyValue(basisOfRent.area_unit)) return `${formatNumber(amount)} €`;
    return `${formatNumber(amount)} € / ${getLabelOfOption(areaUnitOptions, basisOfRent.area_unit) || ''}`;
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

  const getReLeaseDiscountPercent = () => {
    return calculateReLeaseDiscountPercent(
      basisOfRent.subvention_base_percent,
      basisOfRent.subvention_graduated_percent);
  };

  const getTotalSubventionPercent = () => {
    const indexValue = getBasisOfRentIndexValue(basisOfRent, indexOptions);
    const currentAmountPerArea = calculateBasisOfRentAmountPerArea(basisOfRent, indexValue);
    return calculateBasisOfRentSubventionPercent(
      currentAmountPerArea,
      basisOfRent.subvention_type,
      basisOfRent.subvention_base_percent,
      basisOfRent.subvention_graduated_percent,
      basisOfRent.management_subventions,
      basisOfRent.temporary_subventions
    );
  };
  const getDiscountPercentage = () => {
    if(basisOfRent.subvention_type === SubventionTypes.FORM_OF_MANAGEMENT){
      if(basisOfRent.management_subventions && basisOfRent.management_subventions[0].subvention_amount)
        return calculateBasisOfRentSubventionPercantage(basisOfRent.management_subventions[0].subvention_amount, currentAmountPerArea);
      return 0;
    }
    if(basisOfRent.subvention_type === SubventionTypes.RE_LEASE)
      return getReLeaseDiscountPercent();
  };

  const getSubventionDiscountedInitial = () => {
    const indexValue = getBasisOfRentIndexValue(basisOfRent, indexOptions);
    const initialYearRent = calculateBasisOfRentInitialYearRent(basisOfRent, indexValue);
    const currentAmountPerArea = calculateBasisOfRentAmountPerArea(basisOfRent, indexValue);
    const managementSubventions = basisOfRent.management_subventions;
    if(basisOfRent.subvention_type === SubventionTypes.FORM_OF_MANAGEMENT)
      return calculateSubventionDiscountTotal(
        initialYearRent,
        managementSubventions,
        currentAmountPerArea
      );
    if(basisOfRent.subvention_type === SubventionTypes.RE_LEASE)
      return calculateSubventionDiscountTotalFromReLease(
        initialYearRent,
        getReLeaseDiscountPercent(),
      );
  };
  const calculatorType = basisOfRent.type;
  const indexValue = getBasisOfRentIndexValue(basisOfRent, indexOptions);
  const areaText = getAreaText(basisOfRent.area);
  const amountPerAreaText = getAmountPerAreaText(basisOfRent.amount_per_area);
  const plansInspectedText = getPlansInspectedText();
  const lockedText = getLockedText();
  const currentAmountPerArea = calculateBasisOfRentAmountPerArea(basisOfRent, indexValue);
  const currentAmountPerAreaText = getAmountPerAreaText(currentAmountPerArea);
  const basicAnnualRent = calculateBasisOfRentBasicAnnualRent(basisOfRent);
  const initialYearRent = calculateBasisOfRentInitialYearRent(basisOfRent, indexValue);
  const discountedInitialYearRent = calculateBasisOfRentDiscountedInitialYearRent(basisOfRent, indexValue);
  const managementSubventions = basisOfRent.management_subventions;
  const temporarySubventions = basisOfRent.temporary_subventions;
  const rentPerMonth = discountedInitialYearRent != null ? discountedInitialYearRent/12 : null;
  const rentPer2Months = discountedInitialYearRent != null ? discountedInitialYearRent/6 : null;
  const rentPerMonthTotal = totalDiscountedInitialYearRent/12;
  const rentPer2MonthsTotal = totalDiscountedInitialYearRent/6;
  const reLeaseDiscountPercent = getReLeaseDiscountPercent();
  const reLeaseDiscountAmount = calculateBasisOfRentSubventionAmount(initialYearRent, reLeaseDiscountPercent);
  const totalSubventionPercent = getTotalSubventionPercent();
  const totalSubventionAmount = calculateBasisOfRentSubventionAmount(initialYearRent, totalSubventionPercent);
  const discountPercentage = getDiscountPercentage();
  const temporarySubventionDiscountPercentage = calculateTemporarySubventionDiscountPercentage(temporarySubventions);
  const subventionDiscountedInitial = getSubventionDiscountedInitial();
  const zonePrice = getZonePriceFromValue(basisOfRent.zone);
  const rent = calculateTemporaryRent(zonePrice, basisOfRent.area);
  const basicAnnualRentIndexed = calculateBasicAnnualRentIndexed(rent, indexValue);
  const rentExtra = calculateExtraRent(basisOfRent.amount_per_area, basisOfRent.area);
  const rentExtraIndexed = calculateBasicAnnualRentIndexed(rentExtra, indexValue);
  const fieldsRent = calculateFieldsRent(basisOfRent.amount_per_area, basisOfRent.area);
  const basicAnnualFieldRentIndexed = calculateBasicAnnualRentIndexed(fieldsRent, indexValue);
  const mastAreaRent = 1.5 * calculateFieldsRent(basisOfRent.amount_per_area, basisOfRent.area);
  const rackAndHeightPrice = calculateRackAndHeightPrice(basisOfRent.children);
  const mastTotal = (mastAreaRent + rackAndHeightPrice) * 0.05;
  const mastTotalIndexed = calculateBasicAnnualRentIndexed(mastTotal, indexValue);
  const zoneOptions = getFieldOptions(leaseAttributes, LeaseBasisOfRentsFieldPaths.ZONE);

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
            <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.TYPE)}>
              <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.TYPE)}>
                Laskurin tyyppi
              </FormTextTitle>
              <FormText>{getLabelOfOption(calculatorTypeOptions, calculatorType) || '-'}</FormText>
            </Authorization>
          </Column>

          {calculatorType === CalculatorTypes.MAST && <Column large={5} medium={9} small={12}>
            <Row>
              <Column small={6} medium={4} large={2}>
                <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) && isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA)}>
                  <FormTextTitle>{'Laskuri'}</FormTextTitle>
                  <FormText>{`Alue`}</FormText>
                </Authorization>
              </Column>
              <Column small={6} medium={4} large={2}>
                <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA)}>
                  <FormTextTitle>{'Hinta'}</FormTextTitle>
                  <FormText>{!isEmptyValue(basisOfRent.amount_per_area) ? `${formatNumber(basisOfRent.amount_per_area)} €` : '-'}</FormText>
                </Authorization>
              </Column>
              <Column small={6} medium={4} large={2}>
                <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) && isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA)}>
                  <FormTextTitle>{'Kerroin'}</FormTextTitle>
                  <FormText>{`*1,5`}</FormText>
                </Authorization>
              </Column>
              <Column small={6} medium={4} large={2}>
                <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA)}>
                  <FormTextTitle>{'Ala/korkeus'}</FormTextTitle>
                  <FormText>{!isEmptyValue(basisOfRent.area) ? `${formatNumber(basisOfRent.area)} €` : '-'}</FormText>
                </Authorization>
              </Column>
              <Column small={6} medium={4} large={2}>
                <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) && isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA)}>
                  <FormTextTitle>{'Yksikkö'}</FormTextTitle>
                  <FormText>{`m${String.fromCharCode(178)}`}</FormText>
                </Authorization>
              </Column>
              <Column small={6} medium={4} large={2}>
                <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) && isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA)}>
                  <FormTextTitle>{'Vuokra'}</FormTextTitle>
                  <FormText>{!isEmptyValue(mastAreaRent) ? `${formatNumber(mastAreaRent)} €` : '-'}</FormText>
                </Authorization>
              </Column>
            </Row>
            {basisOfRent.children.map((child, index) => {
              const rent = mastCalculatorRent(index, child.area);

              return <Row key={index}>
                <Column small={6} medium={4} large={2}>
                  <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) && isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA)}>            
                    {(index === 0) && <FormText>{`Laitekaappi`}</FormText>}
                    {(index === 1) && <FormText>{`Masto`}</FormText>}
                  </Authorization>
                </Column>
                <Column small={6} medium={4} large={2}>
                  <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA)}>
                    {(index === 0) && <FormText>{`1000,00 €`}</FormText>}
                    {(index === 1) && <FormText>{`600,00 €`}</FormText>}
                  </Authorization>
                </Column>
                <Column small={6} medium={4} large={2}>
                  <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) && isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA)}>
                  </Authorization>
                </Column>
                <Column small={6} medium={4} large={2}>
                  <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA)}>
                    <FormText>{!isEmptyValue(child.area) ? `${formatNumber(child.area)} €` : '-'}</FormText>
                  </Authorization>
                </Column>
                <Column small={6} medium={4} large={2}>
                  <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) && isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA)}>
                    {(index === 0) && <FormText>{`k-m${String.fromCharCode(178)}`}</FormText>}
                    {(index === 1) && <FormText>{`m`}</FormText>}
                  </Authorization>
                </Column>
                <Column small={6} medium={4} large={2}>
                  <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) && isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA)}>
                    <FormText>{!isEmptyValue(rent) ? `${formatNumber(rent)} €` : '-'}</FormText>
                  </Authorization>
                </Column>
              </Row>;
            })}
          </Column>}
          {calculatorType === CalculatorTypes.LEASE && <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.INTENDED_USE)}>
              <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.INTENDED_USE)}>
                {LeaseBasisOfRentsFieldTitles.INTENDED_USE}
              </FormTextTitle>
              <FormText>{getLabelOfOption(intendedUseOptions, basisOfRent.intended_use) || '-'}</FormText>
            </Authorization>
          </Column>}
          {calculatorType === CalculatorTypes.TEMPORARY && <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.ZONE)}>
              <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.ZONE)}>
                {LeaseBasisOfRentsFieldTitles.ZONE}
              </FormTextTitle>
              <FormText>{getLabelOfOption(zoneOptions, basisOfRent.zone) || '-'}</FormText>
            </Authorization>
          </Column>}
          {calculatorType === CalculatorTypes.TEMPORARY && <Column small={3} medium={2} large={1}>
            <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.ZONE)}>
              <FormTextTitle>
                {LeaseBasisOfRentsFieldTitles.PRICE}
              </FormTextTitle>
              <FormText>{!isEmptyValue(zonePrice) ? `${formatNumber(zonePrice)} €` : '-'}</FormText>
            </Authorization>
          </Column>}
          {(calculatorType === CalculatorTypes.ADDITIONAL_YARD ||
            calculatorType === CalculatorTypes.FIELD) && <Column small={3} medium={2} large={1}>
            <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA)}>
              <FormTextTitle>
                {'Hinta'}
              </FormTextTitle>
              <FormText>{!isEmptyValue(basisOfRent.amount_per_area) ? `${formatNumber(basisOfRent.amount_per_area)} €` : '-'}</FormText>
            </Authorization>
          </Column>}
          {calculatorType === CalculatorTypes.ADDITIONAL_YARD && <Column small={3} medium={2} large={1}>
            <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA)}>
              <FormTextTitle>
                {'Kerroin'}
              </FormTextTitle>
              <FormText>{'* 1,5'}</FormText>
            </Authorization>
          </Column>}
          {calculatorType === CalculatorTypes.LEASE && <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA)}>
              <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.AREA)}>
                {LeaseBasisOfRentsFieldTitles.AREA}
              </FormTextTitle>
              <FormText>{areaText}</FormText>
            </Authorization>
          </Column>}
          {(calculatorType !== CalculatorTypes.MAST && calculatorType !== CalculatorTypes.LEASE) && <Column small={3} medium={2} large={1}>
            <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA)}>
              <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.AREA)}>
                {LeaseBasisOfRentsFieldTitles.AREA}
              </FormTextTitle>
              <FormText>{areaText}</FormText>
            </Authorization>
          </Column>}
          {calculatorType === CalculatorTypes.LEASE && <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.PLANS_INSPECTED_AT)}>
              <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.PLANS_INSPECTED_AT)}>
                {LeaseBasisOfRentsFieldTitles.PLANS_INSPECTED_AT}
              </FormTextTitle>
              <FormText>{plansInspectedText}</FormText>
            </Authorization>
          </Column>}
          {calculatorType === CalculatorTypes.LEASE && <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.LOCKED_AT)}>
              <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.LOCKED_AT)}>
                {LeaseBasisOfRentsFieldTitles.LOCKED_AT}
              </FormTextTitle>
              <FormText>{lockedText}</FormText>
            </Authorization>
          </Column>}
          {calculatorType === CalculatorTypes.ADDITIONAL_YARD && <Column small={3} medium={2} large={1} style={{marginTop: 15}}>
            <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA)}>
              <FormText>{'*5%'}</FormText>
            </Authorization>
          </Column>}
          {(calculatorType !== CalculatorTypes.MAST && calculatorType !== CalculatorTypes.LEASE) && <Column small={6} medium={4} large={2}>
            <Authorization allow={
              isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) &&
              isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA)
            }>
              <FormTextTitle enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.BASE_YEAR_RENT)}>
                {LeaseBasisOfRentsFieldTitles.RENT}
              </FormTextTitle>
              {calculatorType === CalculatorTypes.TEMPORARY && <FormText>{!isEmptyValue(rent) ? `${formatNumber(rent)} €` : '-'}</FormText>}
              {calculatorType === CalculatorTypes.ADDITIONAL_YARD && <FormText>{!isEmptyValue(rentExtra) ? `${formatNumber(rentExtra)} €` : '-'}</FormText>}
              {calculatorType === CalculatorTypes.FIELD && <FormText>{!isEmptyValue(fieldsRent) ? `${formatNumber(fieldsRent)} €` : '-'}</FormText>}
            </Authorization>
          </Column>}
          {(calculatorType !== CalculatorTypes.LEASE && calculatorType !== CalculatorTypes.MAST) && <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX)}>
              <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.INDEX)}>
                {LeaseBasisOfRentsFieldTitles.INDEX}
              </FormTextTitle>
              <FormText>{getLabelOfOption(indexOptions, basisOfRent.index) || '-'}</FormText>
            </Authorization>
          </Column>}
          {calculatorType !== CalculatorTypes.MAST && <Column small={6} medium={4} large={2}>
            <Authorization allow={
              isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) &&
              isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA)
            }>
              <FormTextTitle enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.BASE_YEAR_RENT)}>
                {LeaseBasisOfRentsFieldTitles.BASE_YEAR_RENT}
              </FormTextTitle>
              {calculatorType === CalculatorTypes.LEASE && <FormText>{!isEmptyValue(basicAnnualRent) ? `${formatNumber(basicAnnualRent)} €/v` : '-'}</FormText>}
              {calculatorType === CalculatorTypes.TEMPORARY && <FormText>{!isEmptyValue(basicAnnualRentIndexed) ? `${formatNumber(basicAnnualRentIndexed)} €/v` : '-'}</FormText>}
              {calculatorType === CalculatorTypes.ADDITIONAL_YARD && <FormText>{!isEmptyValue(rentExtraIndexed) ? `${formatNumber(rentExtraIndexed)} €/v` : '-'}</FormText>}
              {calculatorType === CalculatorTypes.FIELD && <FormText>{!isEmptyValue(basicAnnualFieldRentIndexed) ? `${formatNumber(basicAnnualFieldRentIndexed)} €/v` : '-'}</FormText>}
            </Authorization>
          </Column>}
        </Row>
        {calculatorType === CalculatorTypes.MAST && <Row>
          <Column large={2} medium={4} small={6}>
          </Column>
          <Column>
            <Row>
              <Column large={6} medium={9} small={12}>
                <Divider />
              </Column>
            </Row>
          </Column>
        </Row>}
        {calculatorType === CalculatorTypes.MAST && <Row>
          <Authorization allow={
            isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) &&
            isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA)
          }>
            <Column large={2} medium={4} small={6}>
            </Column>
            <Column>
              <Row>
                <Column large={6} medium={9} small={12}>
                  <Row>
                    <Column small={6} medium={4} large={2}>
                      <FormText className='semibold'>{'Yhteensä'}</FormText>
                    </Column>
                    <Column small={6}>
                    </Column>
                    <Column small={6} medium={4} large={2}>
                      <FormText>{'*5%'}</FormText>
                    </Column>
                    <Column small={6} medium={4} large={2}>
                      <FormText className='semibold'>{`${formatNumber(mastTotal)} €`}</FormText>
                    </Column>
                  </Row>
                </Column>
                <Column small={6} medium={4} large={2} style={{marginTop: -15}}>
                  <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX)}>
                    <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.INDEX)}>
                      {LeaseBasisOfRentsFieldTitles.INDEX}
                    </FormTextTitle>
                    <FormText>{getLabelOfOption(indexOptions, basisOfRent.index) || '-'}</FormText>
                  </Authorization>
                </Column>
                <Column small={6} medium={4} large={2} style={{marginTop: -15}}>
                  <Authorization allow={
                    isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) &&
                    isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA)
                  }>
                    <FormTextTitle enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.BASE_YEAR_RENT)}>
                      {LeaseBasisOfRentsFieldTitles.BASE_YEAR_RENT}
                    </FormTextTitle>
                    <FormText>{!isEmptyValue(mastTotalIndexed) ? `${formatNumber(mastTotalIndexed)} €/v` : '-'}</FormText>
                  </Authorization>
                </Column>
              </Row>
            </Column>
          </Authorization>
        </Row>}
        <Row>
          {calculatorType === CalculatorTypes.LEASE && <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA)}>
              <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA)}>
                {LeaseBasisOfRentsFieldTitles.AMOUNT_PER_AREA}
              </FormTextTitle>
              <FormText>{amountPerAreaText}</FormText>
            </Authorization>
          </Column>}
          {calculatorType === CalculatorTypes.LEASE && <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX)}>
              <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.INDEX)}>
                {LeaseBasisOfRentsFieldTitles.INDEX}
              </FormTextTitle>
              <FormText>{getLabelOfOption(indexOptions, basisOfRent.index) || '-'}</FormText>
            </Authorization>
          </Column>}
          {calculatorType === CalculatorTypes.LEASE && <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA) && isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX)}>
              <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.UNIT_PRICE)}>
                {LeaseBasisOfRentsFieldTitles.UNIT_PRICE}
              </FormTextTitle>
              <FormText>{currentAmountPerAreaText}</FormText>
            </Authorization>
          </Column>}
          {calculatorType === CalculatorTypes.LEASE && <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.PROFIT_MARGIN_PERCENTAGE)}>
              <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.PROFIT_MARGIN_PERCENTAGE)}>
                {LeaseBasisOfRentsFieldTitles.PROFIT_MARGIN_PERCENTAGE}
              </FormTextTitle>
              <FormText>{!isEmptyValue(basisOfRent.profit_margin_percentage) ? `${formatNumber(basisOfRent.profit_margin_percentage)} %` : '-'}</FormText>
            </Authorization>
          </Column>}
          {calculatorType === CalculatorTypes.LEASE && <Column small={6} medium={4} large={2}>
            <Authorization allow={
              isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) &&
              isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA)
            }>
              <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.BASE_YEAR_RENT)}>
                {LeaseBasisOfRentsFieldTitles.BASE_YEAR_RENT}
              </FormTextTitle>
              <FormText>{!isEmptyValue(basicAnnualRent) ? `${formatNumber(basicAnnualRent)} €/v` : '-'}</FormText>
            </Authorization>
          </Column>}
          {calculatorType === CalculatorTypes.LEASE && <Column small={6} medium={4} large={2}>
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
          </Column>}
          {((basisOfRent.subvention_type === SubventionTypes.FORM_OF_MANAGEMENT ||
            basisOfRent.subvention_type === SubventionTypes.RE_LEASE) && calculatorType === CalculatorTypes.LEASE) && <Fragment>
            <Column small={6} medium={4} large={2}>
              <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.DISCOUNT_PERCENTAGE)}>
                <FormTextTitle>
                  {LeaseBasisOfRentsFieldTitles.SUBVENTION_DISCOUNT_PERCENTAGE}
                </FormTextTitle>
                <FormText>{!isEmptyValue(discountPercentage) ? `${formatNumber(discountPercentage)} %` : '-'}</FormText>
              </Authorization>
            </Column>
            <Column small={6} medium={4} large={2}>
              <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.DISCOUNT_PERCENTAGE)}>
                <FormTextTitle>
                  {LeaseBasisOfRentsFieldTitles.DISCOUNTED_INITIAL}
                </FormTextTitle>
                <FormText>{!isEmptyValue(subventionDiscountedInitial) ? `${formatNumber(subventionDiscountedInitial)} €/v` : '-'}</FormText>
              </Authorization>
            </Column>
            <Column small={0} medium={4} large={8}></Column>
            <Column small={12} medium={12} large={12}>
              <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.DISCOUNT_PERCENTAGE)}>
                <FormTextTitle>
                  {LeaseBasisOfRentsFieldTitles.TEMPORARY_DISCOUNT_PERCENTAGE}
                </FormTextTitle>
                <FormText>{!isEmptyValue(temporarySubventionDiscountPercentage) ? `${formatNumber(temporarySubventionDiscountPercentage)} %` : '-'}</FormText>
              </Authorization>
            </Column>
          </Fragment>}
            
          {calculatorType === CalculatorTypes.LEASE && <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.DISCOUNT_PERCENTAGE)}>
              <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.DISCOUNT_PERCENTAGE)}>
                {LeaseBasisOfRentsFieldTitles.DISCOUNT_PERCENTAGE}
              </FormTextTitle>
              <FormText>{!isEmptyValue(basisOfRent.discount_percentage) ? `${formatNumber(basisOfRent.discount_percentage)} %` : '-'}</FormText>
            </Authorization>
          </Column>}
          {calculatorType === CalculatorTypes.LEASE && <Column small={6} medium={4} large={3}>
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
          </Column>}
          {calculatorType === CalculatorTypes.LEASE && <Column small={6} medium={4} large={1}>
            <Authorization allow={
              isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) &&
              isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA) &&
              isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX) &&
              isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.PROFIT_MARGIN_PERCENTAGE) &&
              isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.DISCOUNT_PERCENTAGE)
            }>
              <FormTextTitle enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.DISCOUNTED_INITIAL_YEAR_RENT_PER_MONTH)}>
                {LeaseBasisOfRentsFieldTitles.DISCOUNTED_INITIAL_YEAR_RENT_PER_MONTH}
              </FormTextTitle>
              <FormText>{!isEmptyValue(rentPerMonth) ? `${formatNumber(rentPerMonth)} €` : '-'}</FormText>
            </Authorization>
          </Column>}
          {calculatorType === CalculatorTypes.LEASE && <Column small={6} medium={4} large={1}>
            <Authorization allow={
              isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) &&
              isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA) &&
              isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX) &&
              isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.PROFIT_MARGIN_PERCENTAGE) &&
              isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.DISCOUNT_PERCENTAGE)
            }>
              <FormTextTitle enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.DISCOUNTED_INITIAL_YEAR_RENT_PER_2_MONTHS)}>
                {LeaseBasisOfRentsFieldTitles.DISCOUNTED_INITIAL_YEAR_RENT_PER_2_MONTHS}
              </FormTextTitle>
              <FormText>{!isEmptyValue(rentPer2Months) ? `${formatNumber(rentPer2Months)} €` : '-'}</FormText>
            </Authorization>
          </Column>}
          {(showTotal && calculatorType === CalculatorTypes.LEASE) &&
            <Fragment>
              <Column small={6} medium={4} large={2}>
                <Authorization allow={
                  isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) &&
                  isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA) &&
                  isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX) &&
                  isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.PROFIT_MARGIN_PERCENTAGE) &&
                  isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.DISCOUNT_PERCENTAGE)
                }>
                  <FormTextTitle enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.DISCOUNTED_INITIAL_YEAR_RENT_PER_MONTH_TOTAL)}>
                    {LeaseBasisOfRentsFieldTitles.DISCOUNTED_INITIAL_YEAR_RENT_PER_MONTH_TOTAL}
                  </FormTextTitle>
                  <FormText>{!isEmptyValue(rentPerMonthTotal) ? `${formatNumber(rentPerMonthTotal)} €` : '-'}</FormText>
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
                  <FormTextTitle enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.DISCOUNTED_INITIAL_YEAR_RENT_PER_2_MONTHS_TOTAL)}>
                    {LeaseBasisOfRentsFieldTitles.DISCOUNTED_INITIAL_YEAR_RENT_PER_2_MONTHS_TOTAL}
                  </FormTextTitle>
                  <FormText>{!isEmptyValue(rentPer2MonthsTotal) ? `${formatNumber(rentPer2MonthsTotal)} €` : '-'}</FormText>
                </Authorization>
              </Column>
            </Fragment>
          }
        </Row>

        {(basisOfRent.subvention_type && calculatorType === CalculatorTypes.LEASE) &&
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
            {basisOfRent.subvention_type === SubventionTypes.FORM_OF_MANAGEMENT &&
              <Authorization allow={isFieldAllowedToRead(leaseAttributes, BasisOfRentManagementSubventionsFieldPaths.MANAGEMENT_SUBVENTIONS)}>
                <SubTitle enableUiDataEdit uiDataKey={getUiDataLeaseKey(BasisOfRentManagementSubventionsFieldPaths.MANAGEMENT_SUBVENTIONS)}>{BasisOfRentManagementSubventionsFieldTitles.MANAGEMENT_SUBVENTIONS}</SubTitle>
                {!managementSubventions || !managementSubventions.length &&
                  <FormText>Ei hallintamuotoja</FormText>
                }
                {managementSubventions && managementSubventions.length &&
                  <Fragment>
                    <Row>
                      <Column small={4} large={2}>
                        <Authorization allow={isFieldAllowedToRead(leaseAttributes, BasisOfRentManagementSubventionsFieldPaths.MANAGEMENT)}>
                          <FormTextTitle uiDataKey={getUiDataLeaseKey(BasisOfRentManagementSubventionsFieldPaths.MANAGEMENT)}>
                            {BasisOfRentManagementSubventionsFieldTitles.MANAGEMENT}
                          </FormTextTitle>
                        </Authorization>
                      </Column>
                      <Column small={4} large={2}>
                        <Authorization allow={isFieldAllowedToRead(leaseAttributes, BasisOfRentManagementSubventionsFieldPaths.SUBVENTION_AMOUNT)}>
                          <FormTextTitle uiDataKey={getUiDataLeaseKey(BasisOfRentManagementSubventionsFieldPaths.SUBVENTION_AMOUNT)}>
                            {BasisOfRentManagementSubventionsFieldTitles.SUBVENTION_AMOUNT}
                          </FormTextTitle>
                        </Authorization>
                      </Column>
                      <Column small={4} large={2}>
                        <Authorization allow={isFieldAllowedToRead(leaseAttributes, BasisOfRentManagementSubventionsFieldPaths.SUBVENTION_AMOUNT)}>
                          <FormTextTitle uiDataKey={getUiDataLeaseKey(BasisOfRentManagementSubventionsFieldPaths.SUBVENTION_AMOUNT)}>
                            {BasisOfRentManagementSubventionsFieldTitles.SUBVENTION_PERCENT}
                          </FormTextTitle>
                        </Authorization>
                      </Column>
                      <Column small={4} large={2}>
                        <Authorization allow={isFieldAllowedToRead(leaseAttributes, BasisOfRentManagementSubventionsFieldPaths.SUBVENTION_AMOUNT)}>
                          <FormTextTitle uiDataKey={getUiDataLeaseKey(BasisOfRentManagementSubventionsFieldPaths.SUBVENTION_AMOUNT)}>
                            {BasisOfRentManagementSubventionsFieldTitles.SUBVENTION_AMOUNT_YEAR}
                          </FormTextTitle>
                        </Authorization>
                      </Column>
                    </Row>

                    {managementSubventions.map((subvention) => {
                      /* Use current amount per area to calculate percantage */
                      const subventionPercent = calculateBasisOfRentSubventionPercantage(subvention.subvention_amount, currentAmountPerArea);
                      /* Use initial year rent to calculate subvention total */
                      const subventionTotal = calculateBasisOfRentSubventionAmount(initialYearRent, subventionPercent);
                      
                      return(
                        <Row key={subvention.id}>
                          <Column small={4} large={2}>
                            <Authorization allow={isFieldAllowedToRead(leaseAttributes, BasisOfRentManagementSubventionsFieldPaths.MANAGEMENT)}>
                              <FormText>{getLabelOfOption(managementTypeOptions, subvention.management) || '-'}</FormText>
                            </Authorization>
                          </Column>
                          <Column small={4} large={2}>
                            <Authorization allow={isFieldAllowedToRead(leaseAttributes, BasisOfRentManagementSubventionsFieldPaths.SUBVENTION_AMOUNT)}>
                              <FormText>{!isEmptyValue(subvention.subvention_amount) ? `${formatNumber(subvention.subvention_amount)} €` : '-'}</FormText>
                            </Authorization>
                          </Column>
                          <Column small={4} large={2}>
                            <Authorization allow={isFieldAllowedToRead(leaseAttributes, BasisOfRentManagementSubventionsFieldPaths.SUBVENTION_AMOUNT)}>
                              <FormText>{!isEmptyValue(subventionPercent) ? `${formatNumber(subventionPercent)} %` : '-'}</FormText>
                            </Authorization>
                          </Column>
                          <Column small={4} large={2}>
                            <Authorization allow={isFieldAllowedToRead(leaseAttributes, BasisOfRentManagementSubventionsFieldPaths.SUBVENTION_AMOUNT)}>
                              <FormText>{!isEmptyValue(subventionTotal) ? `${formatNumber(subventionTotal)} €` : '-'}</FormText>
                            </Authorization>
                          </Column>
                        </Row>
                      );
                    })}
                  </Fragment>
                }
              </Authorization>
            }
            {basisOfRent.subvention_type === SubventionTypes.RE_LEASE &&
              <Row>
                <Column small={4} large={2}>
                  <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.SUBVENTION_BASE_PERCENT)}>
                    <FormTextTitle  enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.SUBVENTION_BASE_PERCENT)}>
                      {LeaseBasisOfRentsFieldTitles.SUBVENTION_BASE_PERCENT}
                    </FormTextTitle>
                    <FormText>{!isEmptyValue(basisOfRent.subvention_base_percent) ? `${formatNumber(basisOfRent.subvention_base_percent)} %` : '-'}</FormText>
                  </Authorization>
                </Column>
                <Column small={4} large={2}>
                  <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.SUBVENTION_GRADUATED_PERCENT)}>
                    <FormTextTitle  enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.SUBVENTION_GRADUATED_PERCENT)}>
                      {LeaseBasisOfRentsFieldTitles.SUBVENTION_GRADUATED_PERCENT}
                    </FormTextTitle>
                    <FormText>{!isEmptyValue(basisOfRent.subvention_graduated_percent) ? `${formatNumber(basisOfRent.subvention_graduated_percent)} %` : '-'}</FormText>
                  </Authorization>
                </Column>
                <Column small={4} large={2}>
                  <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.SUBVENTION_BASE_PERCENT) ||
                    isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.SUBVENTION_BASE_PERCENT)}>
                    <FormTextTitle  enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.SUBVENTION_RE_LEASE_DISCOUNT_PRECENT)}>
                      {LeaseBasisOfRentsFieldTitles.SUBVENTION_RE_LEASE_DISCOUNT_PRECENT}
                    </FormTextTitle>
                    <FormText>{formatNumber(reLeaseDiscountPercent)} %</FormText>
                  </Authorization>
                </Column>
                <Column small={4} large={2}>
                  <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.SUBVENTION_BASE_PERCENT) ||
                    isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.SUBVENTION_BASE_PERCENT)}>
                    <FormTextTitle  enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.SUBVENTION_RE_LEASE_DISCOUNT_AMOUNT)}>
                      {LeaseBasisOfRentsFieldTitles.SUBVENTION_RE_LEASE_DISCOUNT_AMOUNT}
                    </FormTextTitle>
                    <FormText>{formatNumber(reLeaseDiscountAmount)} €</FormText>
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
              {!!temporarySubventions && !!temporarySubventions.length &&
                <Fragment>
                  <Row>
                    <Column small={4} large={2}>
                      <Authorization allow={isFieldAllowedToRead(leaseAttributes, BasisOfRentTemporarySubventionsFieldPaths.DESCRIPTION)}>
                        <FormTextTitle uiDataKey={getUiDataLeaseKey(BasisOfRentTemporarySubventionsFieldPaths.DESCRIPTION)}>
                          {BasisOfRentTemporarySubventionsFieldTitles.DESCRIPTION}
                        </FormTextTitle>
                      </Authorization>
                    </Column>
                    <Column small={4} large={4}>
                      <Authorization allow={isFieldAllowedToRead(leaseAttributes, BasisOfRentTemporarySubventionsFieldPaths.SUBVENTION_PERCENT)}>
                        <FormTextTitle uiDataKey={getUiDataLeaseKey(BasisOfRentTemporarySubventionsFieldPaths.SUBVENTION_PERCENT)}>
                          {BasisOfRentTemporarySubventionsFieldTitles.SUBVENTION_PERCENT}
                        </FormTextTitle>
                      </Authorization>
                    </Column>
                    <Column small={4} large={2}>
                      <Authorization allow={isFieldAllowedToRead(leaseAttributes, BasisOfRentTemporarySubventionsFieldPaths.SUBVENTION_PERCENT)}>
                        <FormTextTitle uiDataKey={getUiDataLeaseKey(BasisOfRentTemporarySubventionsFieldPaths.SUBVENTION_AMOUNT)}>
                          {BasisOfRentTemporarySubventionsFieldTitles.SUBVENTION_AMOUNT}
                        </FormTextTitle>
                      </Authorization>
                    </Column>
                  </Row>

                  {temporarySubventions.map((subvention, index) => {
                    const subventionAmount = calculateBasisOfRentSubventionAmountCumulative(initialYearRent, subvention.subvention_percent, managementSubventions, temporarySubventions, index, 'VIEW');
                    return(
                      <Row key={subvention.id}>
                        <Column small={4} large={2}>
                          <Authorization allow={isFieldAllowedToRead(leaseAttributes, BasisOfRentTemporarySubventionsFieldPaths.DESCRIPTION)}>
                            <FormText>{subvention.description}</FormText>
                          </Authorization>
                        </Column>
                        <Column small={4} large={4}>
                          <Authorization allow={isFieldAllowedToRead(leaseAttributes, BasisOfRentTemporarySubventionsFieldPaths.DESCRIPTION)}>
                            <FormText>{!isEmptyValue(subvention.subvention_percent) ? `${formatNumber(subvention.subvention_percent)} %` : '-'}</FormText>
                          </Authorization>
                        </Column>
                        <Column small={4} large={2}>
                          <Authorization allow={isFieldAllowedToRead(leaseAttributes, BasisOfRentTemporarySubventionsFieldPaths.DESCRIPTION)}>
                            <FormText>{formatNumber(subventionAmount)} €</FormText>
                          </Authorization>
                        </Column>
                      </Row>
                    );
                  })}
                </Fragment>
              }
            </Authorization>
            <Authorization allow={
              isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) &&
              isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA) &&
              isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX)
            }>
              <Row>
                <Column small={12} large={8}>
                  <Divider />
                </Column>
              </Row>
              <Row>
                <Column small={4} large={6}>
                  <FormText className='semibold'>Yhteensä</FormText>
                </Column>
                <Column small={4} large={2}>
                  <FormText className='semibold'>{formatNumber(totalSubventionAmount)} €</FormText>
                </Column>
              </Row>
            </Authorization>
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
