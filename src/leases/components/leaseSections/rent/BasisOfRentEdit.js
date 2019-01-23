// @flow
import React from 'react';
import {connect} from 'react-redux';
import {formValueSelector} from 'redux-form';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import ActionButtonWrapper from '$components/form/ActionButtonWrapper';
import ArchiveButton from '$components/form/ArchiveButton';
import Authorization from '$components/authorization/Authorization';
import BasisOfRent from './BasisOfRent';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import BoxItem from '$components/content/BoxItem';
import CopyToClipboardButton from '$components/form/CopyToClipboardButton';
import FormField from '$components/form/FormField';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import RemoveButton from '$components/form/RemoveButton';
import {
  FormNames,
  LeaseBasisOfRentsFieldPaths,
  LeaseBasisOfRentsFieldTitles,
} from '$src/leases/enums';
import {getSavedBasisOfRent} from '$src/leases/helpers';
import {getUserFullName} from '$src/users/helpers';
import {
  convertStrToDecimalNumber,
  copyElementContentsToClipboard,
  displayUIMessage,
  formatDate,
  formatNumber,
  getFieldAttributes,
  getLabelOfOption,
  isDecimalNumberStr,
  isEmptyValue,
  isFieldAllowedToEdit,
  isFieldAllowedToRead,
  isFieldRequired,
} from '$util/helpers';
import {getAttributes as getLeaseAttributes, getCurrentLease} from '$src/leases/selectors';

import type {Attributes} from '$src/types';
import type {Lease} from '$src/leases/types';

type Props = {
  amountPerArea: ?number,
  archived: boolean,
  area: ?number,
  areaUnit: ?string,
  areaUnitOptions: Array<Object>,
  currentLease: Lease,
  discountPercentage: ?string,
  field: string,
  id: ?number,
  index: number,
  indexOptions: Array<Object>,
  intendedUse: number,
  intendedUseOptions: Array<Object>,
  isSaveClicked: boolean,
  leaseAttributes: Attributes,
  lockedAt: ?string,
  onArchive?: Function,
  onRemove: Function,
  onUnarchive?: Function,
  plansInspectedAt: ?string,
  profitMarginPercentage: ?string,
}

const BasisOfRentEdit = ({
  amountPerArea,
  archived,
  area,
  areaUnit,
  areaUnitOptions,
  currentLease,
  discountPercentage,
  field,
  id,
  index,
  indexOptions,
  intendedUse,
  intendedUseOptions,
  isSaveClicked,
  leaseAttributes,
  lockedAt,
  onArchive,
  onRemove,
  onUnarchive,
  plansInspectedAt,
  profitMarginPercentage,
}: Props) => {
  const getIndexValue = () => {
    if(!index || !indexOptions.length) return null;
    const indexObj = indexOptions.find((item) => item.value === index);

    if(indexObj) {
      const indexValue = indexObj.label.match(/=(.*)/)[1];
      return indexValue;
    }
    return null;
  };

  const getAreaText = (amount: ?number) => {
    if(isEmptyValue(amount)) return '-';
    if(isEmptyValue(areaUnit)) return `${formatNumber(amount)} €`;
    return `${formatNumber(amount)} ${getLabelOfOption(areaUnitOptions, areaUnit)}`;
  };

  const getAmountPerAreaText = (amount: ?number) => {
    if(isEmptyValue(amount)) return '-';
    if(isEmptyValue(areaUnit)) return `${formatNumber(amount)} €`;
    return `${formatNumber(amount)} € / ${getLabelOfOption(areaUnitOptions, areaUnit)}`;
  };

  const getPlansInspectedText = () => {
    if(!plansInspectedAt || !savedBasisOfRent || !savedBasisOfRent.plans_inspected_at) return '-';
    if(!savedBasisOfRent.plans_inspected_by) return formatDate(savedBasisOfRent.plans_inspected_at);
    return `${formatDate(savedBasisOfRent.plans_inspected_at)} ${getUserFullName(savedBasisOfRent.plans_inspected_by)}`;
  };

  const getLockedText = () => {
    if(!lockedAt || !savedBasisOfRent || !savedBasisOfRent.locked_at) return '-';
    if(!savedBasisOfRent.locked_by) return formatDate(savedBasisOfRent.locked_at);
    return `${formatDate(savedBasisOfRent.locked_at)} ${getUserFullName(savedBasisOfRent.locked_by)}`;
  };

  const getCurrentAmountPerArea = () => {
    const indexValue = getIndexValue();

    if(!isDecimalNumberStr(indexValue) || !isDecimalNumberStr(amountPerArea)) return null;
    return Number(convertStrToDecimalNumber(indexValue))/100 * Number(convertStrToDecimalNumber(amountPerArea));
  };

  const getBasicAnnualRent = () => {
    if(!isDecimalNumberStr(amountPerArea) || !isDecimalNumberStr(area)) return null;
    return Number(convertStrToDecimalNumber(amountPerArea))
      * Number(convertStrToDecimalNumber(area));
  };

  const getInitialYearRent = () => {
    const currentAmountPerArea = getCurrentAmountPerArea();

    if(!isDecimalNumberStr(currentAmountPerArea) || !isDecimalNumberStr(area)) return null;
    return Number(convertStrToDecimalNumber(currentAmountPerArea))
      * Number(convertStrToDecimalNumber(area))
      * Number(isDecimalNumberStr(profitMarginPercentage) ? Number(convertStrToDecimalNumber(profitMarginPercentage))/100 + 1 : 1);
  };

  const getDiscountedInitialYearRent = () => {
    const initialYearRent = getInitialYearRent();

    if(!isDecimalNumberStr(initialYearRent)) return null;
    return Number(convertStrToDecimalNumber(initialYearRent))
      * Number(isDecimalNumberStr(discountPercentage) ? (100 - Number(convertStrToDecimalNumber(discountPercentage)))/100 : 1);
  };

  const handleArchive = () => {
    if(onArchive) {
      onArchive(savedBasisOfRent);
    }
  };

  const handleCopyToClipboard = () => {
    const tableContent = getTableContentForClipBoard(),
      el = document.createElement('table');

    el.innerHTML = tableContent;
    if(copyElementContentsToClipboard(el)) {
      displayUIMessage({title: '', body: 'Vuokralaskuri on kopioitu leikepöydälle.'});
    }
  };

  const handleUnarchive = () => {
    if(onUnarchive) {
      onUnarchive(savedBasisOfRent);
    }
  };

  const savedBasisOfRent = getSavedBasisOfRent(currentLease, id);
  const currentAmountPerArea = getCurrentAmountPerArea();
  const currentAmountPerAreaText = getAmountPerAreaText(currentAmountPerArea);
  const areaText = getAreaText(area);
  const amountPerAreaText = getAmountPerAreaText(amountPerArea);
  const lockedAtText = getLockedText();
  const plansInspectedAtText = getPlansInspectedText();
  const basicAnnualRent = getBasicAnnualRent();
  const initialYearRent = getInitialYearRent();
  const discountedInitialYearRent = getDiscountedInitialYearRent();

  const getTableContentForClipBoard = () => {
    return(
      `<thead>
        <tr>
          ${isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.INTENDED_USE)
        ? `<th>${LeaseBasisOfRentsFieldTitles.INTENDED_USE}</th>`
        : ''
      }
          ${isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA)
        ? `<th>${LeaseBasisOfRentsFieldTitles.AREA}</th>`
        : ''
      }
          ${isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.PLANS_INSPECTED_AT)
        ? `<th>${LeaseBasisOfRentsFieldTitles.PLANS_INSPECTED_AT}</th>`
        : ''
      }
          ${isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.LOCKED_AT)
        ? `<th>${LeaseBasisOfRentsFieldTitles.LOCKED_AT}</th>`
        : ''
      }
          ${isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA)
        ? `<th>${LeaseBasisOfRentsFieldTitles.AMOUNT_PER_AREA}</th>`
        : ''
      }
          ${isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX)
        ? `<th>${LeaseBasisOfRentsFieldTitles.INDEX}</th>`
        : ''
      }
          ${(isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA) &&
            isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX))
        ? '<th>Yksikköhinta (ind)</th>'
        : ''
      }
          ${isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.PROFIT_MARGIN_PERCENTAGE)
        ? `<th>${LeaseBasisOfRentsFieldTitles.PROFIT_MARGIN_PERCENTAGE}</th>`
        : ''
      }
          ${(isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) &&
            isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA))
        ? '<th>Perusvuosivuokra (ind 100)</th>'
        : ''
      }
          ${(isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) &&
            isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA) &&
            isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX) &&
            isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.PROFIT_MARGIN_PERCENTAGE))
        ? '<th>Alkuvuosivuokra (ind)</th>'
        : ''
      }
          ${isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.DISCOUNT_PERCENTAGE)
        ? `<th>${LeaseBasisOfRentsFieldTitles.DISCOUNT_PERCENTAGE}</th>`
        : ''
      }
          ${(isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) &&
            isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA) &&
            isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX) &&
            isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.PROFIT_MARGIN_PERCENTAGE) &&
            isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.DISCOUNT_PERCENTAGE))
        ? '<th>Alennettu alkuvuosivuokra (ind)</th>'
        : ''
      }
        </tr>
      </thead>
      <tbody>
        <tr>
          ${isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.INTENDED_USE)
        ? `<td>${getLabelOfOption(intendedUseOptions, intendedUse) || '-'}</td>`
        : ''
      }
          ${isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA)
        ? `<td>${areaText}</td>`
        : ''
      }
          ${isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.PLANS_INSPECTED_AT)
        ? `<td>${plansInspectedAtText}</td>`
        : ''
      }
          ${isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.LOCKED_AT)
        ? `<td>${lockedAtText}</td>`
        : ''
      }
          ${isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA)
        ? `<td>${amountPerAreaText}</td>`
        : ''
      }
          ${isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX)
        ? `<td>${getLabelOfOption(indexOptions, index) || '-'}</td>`
        : ''
      }
          ${(isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA) &&
            isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX))
        ? `<td>${currentAmountPerAreaText}</td>`
        : ''
      }
          ${isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.PROFIT_MARGIN_PERCENTAGE)
        ? `<td>${!isEmptyValue(profitMarginPercentage) ? `${formatNumber(profitMarginPercentage)} %` : '-'}</td>`
        : ''
      }
          ${(isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) &&
            isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA))
        ? `<td>${!isEmptyValue(basicAnnualRent) ? `${formatNumber(basicAnnualRent)} €/v` : '-'}</td>`
        : ''
      }
          ${(isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) &&
            isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA) &&
            isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX) &&
            isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.PROFIT_MARGIN_PERCENTAGE))
        ? `<td>${!isEmptyValue(initialYearRent) ? `${formatNumber(initialYearRent)} €/v` : '-'}</td>`
        : ''
      }
          ${isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.DISCOUNT_PERCENTAGE)
        ? `<td>${!isEmptyValue(discountPercentage) ? `${formatNumber(discountPercentage)} %` : '-'}</td>`
        : ''
      }
          ${(isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) &&
            isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA) &&
            isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX) &&
            isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.PROFIT_MARGIN_PERCENTAGE) &&
            isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.DISCOUNT_PERCENTAGE))
        ? `<td>${!isEmptyValue(discountedInitialYearRent) ? `${formatNumber(discountedInitialYearRent)} €/v` : '-'}</td>`
        : ''
      }
        </tr>
      </tbody>`
    );
  };

  if(archived && savedBasisOfRent) {
    return <BasisOfRent
      areaUnitOptions={areaUnitOptions}
      basisOfRent={savedBasisOfRent}
      indexOptions={indexOptions}
      intendedUseOptions={[]}
      onRemove={onRemove}
      onUnarchive={handleUnarchive}
    />;
  }

  return(
    <BoxItem className='no-border-on-first-child'>
      <BoxContentWrapper>
        <ActionButtonWrapper>
          <CopyToClipboardButton
            onClick={handleCopyToClipboard}
          />
          <Authorization allow={isFieldAllowedToEdit(leaseAttributes, LeaseBasisOfRentsFieldPaths.ARCHIVED_AT)}>
            {onArchive && savedBasisOfRent && !savedBasisOfRent.locked_at &&
              <ArchiveButton onClick={handleArchive}/>
            }
          </Authorization>
          <Authorization allow={isFieldAllowedToEdit(leaseAttributes, LeaseBasisOfRentsFieldPaths.BASIS_OF_RENTS)}>
            <RemoveButton
              onClick={onRemove}
              title="Poista vuokranperuste"
            />
          </Authorization>
        </ActionButtonWrapper>

        <Row>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.INTENDED_USE)}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={savedBasisOfRent && savedBasisOfRent.locked_at
                  ? {...getFieldAttributes(leaseAttributes, LeaseBasisOfRentsFieldPaths.INTENDED_USE), required: false}
                  : getFieldAttributes(leaseAttributes, LeaseBasisOfRentsFieldPaths.INTENDED_USE)
                }
                disabled={!!get(savedBasisOfRent, 'locked_at')}
                name={`${field}.intended_use`}
                overrideValues={{label: LeaseBasisOfRentsFieldTitles.INTENDED_USE}}
              />
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization
              allow={isFieldAllowedToEdit(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) || isFieldAllowedToEdit(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA_UNIT)}
              errorComponent={
                <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA)}>
                  <FormTextTitle>{LeaseBasisOfRentsFieldTitles.AREA}</FormTextTitle>
                  <FormText>{areaText}</FormText>
                </Authorization>
              }
            >
              <FormTextTitle required={isFieldRequired(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA)}>
                {LeaseBasisOfRentsFieldTitles.AREA}
              </FormTextTitle>
              <Row>
                <Column small={6}>
                  <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA)}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={savedBasisOfRent && savedBasisOfRent.locked_at
                        ? {...getFieldAttributes(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA), required: false}
                        : getFieldAttributes(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA)
                      }
                      disabled={!!get(savedBasisOfRent, 'locked_at')}
                      name={`${field}.area`}
                      invisibleLabel
                      overrideValues={{label: LeaseBasisOfRentsFieldTitles.AREA}}
                    />
                  </Authorization>
                </Column>
                <Column small={6}>
                  <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA_UNIT)}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={savedBasisOfRent && savedBasisOfRent.locked_at
                        ? {...getFieldAttributes(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA_UNIT), required: false}
                        : getFieldAttributes(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA_UNIT)
                      }
                      disabled={!!get(savedBasisOfRent, 'locked_at')}
                      name={`${field}.area_unit`}
                      invisibleLabel
                      overrideValues={{
                        label: LeaseBasisOfRentsFieldTitles.AREA_UNIT,
                        options: areaUnitOptions,
                      }}
                    />
                  </Authorization>
                </Column>
              </Row>
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization
              allow={isFieldAllowedToEdit(leaseAttributes, LeaseBasisOfRentsFieldPaths.PLANS_INSPECTED_AT)}
              errorComponent={
                <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.PLANS_INSPECTED_AT)}>
                  <FormTextTitle>{LeaseBasisOfRentsFieldTitles.PLANS_INSPECTED_AT}</FormTextTitle>
                  <FormText>{plansInspectedAtText}</FormText>
                </Authorization>
              }
            >
              <FormField
                className='with-top-padding'
                disableTouched={isSaveClicked}
                fieldAttributes={savedBasisOfRent && savedBasisOfRent.locked_at
                  ? {...getFieldAttributes(leaseAttributes, LeaseBasisOfRentsFieldPaths.PLANS_INSPECTED_AT), required: false, type: 'checkbox-date-time'}
                  : {...getFieldAttributes(leaseAttributes, LeaseBasisOfRentsFieldPaths.PLANS_INSPECTED_AT), type: 'checkbox-date-time'}
                }
                disabled={!!get(savedBasisOfRent, 'locked_at')}
                invisibleLabel
                name={`${field}.plans_inspected_at`}
                overrideValues={{label: LeaseBasisOfRentsFieldTitles.PLANS_INSPECTED_AT}}
              />
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization
              allow={isFieldAllowedToEdit(leaseAttributes, LeaseBasisOfRentsFieldPaths.LOCKED_AT)}
              errorComponent={
                <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.LOCKED_AT)}>
                  <FormTextTitle>{LeaseBasisOfRentsFieldTitles.LOCKED_AT}</FormTextTitle>
                  <FormText>{lockedAtText}</FormText>
                </Authorization>
              }
            >
              <FormField
                className='with-top-padding'
                disableTouched={isSaveClicked}
                fieldAttributes={{
                  ...getFieldAttributes(leaseAttributes, LeaseBasisOfRentsFieldPaths.LOCKED_AT),
                  type: 'checkbox-date-time',
                }}
                invisibleLabel
                name={`${field}.locked_at`}
                overrideValues={{label: 'Laskelma lukittu'}}
              />
            </Authorization>
          </Column>
        </Row>
        <Row>
          <Column small={6} medium={4} large={2}>
            <Authorization
              allow={isFieldAllowedToEdit(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA)}
              errorComponent={
                <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA)}>
                  <FormTextTitle>{LeaseBasisOfRentsFieldTitles.AMOUNT_PER_AREA}</FormTextTitle>
                  <FormText>{amountPerAreaText}</FormText>
                </Authorization>
              }
            >
              <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA)}>
                <FormTextTitle required={isFieldRequired(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA)}>
                  {LeaseBasisOfRentsFieldTitles.AMOUNT_PER_AREA}
                </FormTextTitle>
              </Authorization>
              <Row>
                <Column small={6}>
                  <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA)}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={savedBasisOfRent && savedBasisOfRent.locked_at
                        ? {...getFieldAttributes(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA), required: false}
                        : getFieldAttributes(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA)
                      }
                      disabled={!!get(savedBasisOfRent, 'locked_at')}
                      name={`${field}.amount_per_area`}
                      unit='€'
                      invisibleLabel
                      overrideValues={{label: LeaseBasisOfRentsFieldTitles.AMOUNT_PER_AREA}}
                    />
                  </Authorization>
                </Column>
                <Column small={6}>
                  <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA_UNIT)}>
                    <FormField
                      className='with-slash'
                      disableTouched={isSaveClicked}
                      fieldAttributes={savedBasisOfRent && savedBasisOfRent.locked_at
                        ? {...getFieldAttributes(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA_UNIT), required: false}
                        : getFieldAttributes(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA_UNIT)
                      }
                      name={`${field}.area_unit`}
                      disabled
                      invisibleLabel
                      overrideValues={{
                        label: LeaseBasisOfRentsFieldTitles.AREA_UNIT,
                        options: areaUnitOptions,
                      }}
                    />
                  </Authorization>
                </Column>
              </Row>
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX)}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={savedBasisOfRent && savedBasisOfRent.locked_at
                  ? {...getFieldAttributes(leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX), required: false}
                  : getFieldAttributes(leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX)
                }
                disabled={!!get(savedBasisOfRent, 'locked_at')}
                name={`${field}.index`}
                overrideValues={{
                  label: LeaseBasisOfRentsFieldTitles.INDEX,
                  options: indexOptions,
                }}
              />
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA) && isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX)}>
              <FormTextTitle>Yksikköhinta (ind)</FormTextTitle>
              <FormText>{currentAmountPerAreaText}</FormText>
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.PROFIT_MARGIN_PERCENTAGE)}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={savedBasisOfRent && savedBasisOfRent.locked_at
                  ? {...getFieldAttributes(leaseAttributes, LeaseBasisOfRentsFieldPaths.PROFIT_MARGIN_PERCENTAGE), required: false}
                  :getFieldAttributes(leaseAttributes, LeaseBasisOfRentsFieldPaths.PROFIT_MARGIN_PERCENTAGE)
                }
                disabled={!!get(savedBasisOfRent, 'locked_at')}
                name={`${field}.profit_margin_percentage`}
                unit='%'
                overrideValues={{label: LeaseBasisOfRentsFieldTitles.PROFIT_MARGIN_PERCENTAGE}}
              />
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={
              isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) &&
              isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA)
            }>
              <FormTextTitle>Perusvuosivuokra (ind 100)</FormTextTitle>
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
              <FormTextTitle>Alkuvuosivuokra (ind)</FormTextTitle>
              <FormText>{!isEmptyValue(initialYearRent) ? `${formatNumber(initialYearRent)} €/v` : '-'}</FormText>
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.DISCOUNT_PERCENTAGE)}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={savedBasisOfRent && savedBasisOfRent.locked_at
                  ? {...getFieldAttributes(leaseAttributes, LeaseBasisOfRentsFieldPaths.DISCOUNT_PERCENTAGE), required: false}
                  : getFieldAttributes(leaseAttributes, LeaseBasisOfRentsFieldPaths.DISCOUNT_PERCENTAGE)
                }
                disabled={!!get(savedBasisOfRent, 'locked_at')}
                name={`${field}.discount_percentage`}
                unit='%'
                overrideValues={{label: LeaseBasisOfRentsFieldTitles.DISCOUNT_PERCENTAGE}}
              />
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
              <FormTextTitle>Alennettu alkuvuosivuokra (ind)</FormTextTitle>
              <FormText>{!isEmptyValue(discountedInitialYearRent) ? `${formatNumber(discountedInitialYearRent)} €/v` : '-'}</FormText>
            </Authorization>
          </Column>
        </Row>
      </BoxContentWrapper>
    </BoxItem>
  );
};

const selector = formValueSelector(FormNames.RENTS);

export default connect(
  (state, props) => {
    return {
      amountPerArea: selector(state, `${props.field}.amount_per_area`),
      area: selector(state, `${props.field}.area`),
      areaUnit: selector(state, `${props.field}.area_unit`),
      currentLease: getCurrentLease(state),
      discountPercentage: selector(state, `${props.field}.discount_percentage`),
      id: selector(state, `${props.field}.id`),
      index: selector(state, `${props.field}.index`),
      intendedUse: selector(state, `${props.field}.intended_use`),
      leaseAttributes: getLeaseAttributes(state),
      lockedAt: selector(state, `${props.field}.locked_at`),
      plansInspectedAt: selector(state, `${props.field}.plans_inspected_at`),
      profitMarginPercentage: selector(state, `${props.field}.profit_margin_percentage`),
    };
  },
)(BasisOfRentEdit);
