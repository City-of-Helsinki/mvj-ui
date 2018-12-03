// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';

import ActionButtonWrapper from '$components/form/ActionButtonWrapper';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import BoxItem from '$components/content/BoxItem';
import FormTitleAndText from '$components/form/FormTitleAndText';
import RemoveButton from '$components/form/RemoveButton';
import UnarchiveButton from '$components/form/UnarchiveButton';
import {getUserFullName} from '$src/users/helpers';
import {
  formatDate,
  formatDecimalNumberForDb,
  formatNumber,
  getLabelOfOption,
  isDecimalNumber,
  isEmptyValue,
} from '$util/helpers';

type Props = {
  areaUnitOptions: Array<Object>,
  basisOfRent: Object,
  indexOptions: Array<Object>,
  intendedUseOptions: Array<Object>,
  onRemove?: Function,
  onUnarchive?: Function,
}

const BasisOfRent = ({
  areaUnitOptions,
  basisOfRent,
  indexOptions,
  intendedUseOptions,
  onRemove,
  onUnarchive,
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

    if(!isDecimalNumber(indexValue) || !isDecimalNumber(basisOfRent.amount_per_area)) return null;

    return Number(formatDecimalNumberForDb(indexValue))/100
      * Number(formatDecimalNumberForDb(basisOfRent.amount_per_area));
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
    if(!basisOfRent.plans_inspected_by) return formatDate(basisOfRent.plans_inspected_at);
    return `${formatDate(basisOfRent.plans_inspected_at)} ${getUserFullName(basisOfRent.plans_inspected_by)}`;
  };

  const getLockedText = () => {
    if(!basisOfRent.locked_at) return '-';
    if(!basisOfRent.locked_by) return formatDate(basisOfRent.locked_at);
    return `${formatDate(basisOfRent.locked_at)} ${getUserFullName(basisOfRent.locked_by)}`;
  };

  const getBasicAnnualRent = () => {
    if(!isDecimalNumber(basisOfRent.amount_per_area) || !isDecimalNumber(basisOfRent.area)) return null;
    return Number(formatDecimalNumberForDb(basisOfRent.amount_per_area))
      * Number(formatDecimalNumberForDb(basisOfRent.area));
  };

  const getInitialYearRent = () => {
    const currentAmountPerArea = getCurrentAmountPerArea();

    if(!isDecimalNumber(currentAmountPerArea) || !isDecimalNumber(basisOfRent.area)) return null;
    return Number(formatDecimalNumberForDb(currentAmountPerArea))
      * Number(formatDecimalNumberForDb(basisOfRent.area))
      * Number(isDecimalNumber(basisOfRent.profit_margin_percentage) ? Number(formatDecimalNumberForDb(basisOfRent.profit_margin_percentage))/100 + 1 : 1);
  };

  const getDiscountedInitialYearRent = () => {
    const initialYearRent = getInitialYearRent();

    if(!isDecimalNumber(initialYearRent)) return null;
    return Number(formatDecimalNumberForDb(initialYearRent))
      * Number(isDecimalNumber(basisOfRent.discount_percentage) ? (100 - Number(formatDecimalNumberForDb(basisOfRent.discount_percentage)))/100 : 1);
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

  return(
    <BoxItem className='no-border-on-last-child'>
      <ActionButtonWrapper>
        {onUnarchive &&
          <UnarchiveButton onClick={onUnarchive}/>
        }
        {onRemove &&
          <RemoveButton
            onClick={onRemove}
            title="Poista vuokranperuste"
          />
        }
      </ActionButtonWrapper>
      <BoxContentWrapper>
        <Row>
          <Column small={6} medium={4} large={2}>
            <FormTitleAndText
              title='Käyttötarkoitus'
              text={getLabelOfOption(intendedUseOptions, basisOfRent.intended_use) || '-'}
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormTitleAndText
              title='Pinta-ala'
              text={areaText}
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormTitleAndText
              title='Piirustukset tarkastettu'
              text={plansInspectedText}
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormTitleAndText
              title='Laskelma lukittu'
              text={lockedText}
            />
          </Column>
        </Row>
        <Row>
          <Column small={6} medium={4} large={2}>
            <FormTitleAndText
              title='Yksikköhinta (ind 100)'
              text={amountPerAreaText}
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormTitleAndText
              title='Indeksi'
              text={getLabelOfOption(indexOptions, basisOfRent.index) || '-'}
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormTitleAndText
              title='Yksikköhinta (ind)'
              text={currentAmountPerAreaText}
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormTitleAndText
              title='Tuottoprosentti'
              text={!isEmptyValue(basisOfRent.profit_margin_percentage) ? `${formatNumber(basisOfRent.profit_margin_percentage)} %` : '-'}
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormTitleAndText
              title='Perusvuosivuokra (ind 100)'
              text={!isEmptyValue(basicAnnualRent) ? `${formatNumber(basicAnnualRent)} €/v` : '-'}
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormTitleAndText
              title='Alkuvuosivuokra (ind)'
              text={!isEmptyValue(initialYearRent) ? `${formatNumber(initialYearRent)} €/v` : '-'}
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormTitleAndText
              title='Alennusprosentti'
              text={!isEmptyValue(basisOfRent.discount_percentage) ? `${formatNumber(basisOfRent.discount_percentage)} %` : '-'}
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormTitleAndText
              title='Alennettu alkuvuosivuokra (ind)'
              text={!isEmptyValue(discountedInitialYearRent) ? `${formatNumber(discountedInitialYearRent)} €/v` : '-'}
            />
          </Column>
        </Row>
      </BoxContentWrapper>
    </BoxItem>
  );
};

export default BasisOfRent;
