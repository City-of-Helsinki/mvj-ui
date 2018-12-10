// @flow
import React from 'react';
import {connect} from 'react-redux';
import {formValueSelector} from 'redux-form';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import ActionButtonWrapper from '$components/form/ActionButtonWrapper';
import ArchiveButton from '$components/form/ArchiveButton';
import BasisOfRent from './BasisOfRent';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import BoxItem from '$components/content/BoxItem';
import CopyToClipboardButton from '$components/form/CopyToClipboardButton';
import FormField from '$components/form/FormField';
import FormTextTitle from '$components/form/FormTextTitle';
import FormTitleAndText from '$components/form/FormTitleAndText';
import RemoveButton from '$components/form/RemoveButton';
import {FormNames} from '$src/leases/enums';
import {getSavedBasisOfRent} from '$src/leases/helpers';
import {getUserFullName} from '$src/users/helpers';
import {
  copyElementContentsToClipboard,
  displayUIMessage,
  formatDate,
  formatDecimalNumberForDb,
  formatNumber,
  getLabelOfOption,
  isDecimalNumber,
  isEmptyValue,
} from '$util/helpers';
import {getCurrentLease} from '$src/leases/selectors';

import type {Attributes, Lease} from '$src/leases/types';

type Props = {
  amountPerArea: ?number,
  archived: boolean,
  area: ?number,
  areaUnit: ?string,
  areaUnitOptions: Array<Object>,
  attributes: Attributes,
  currentLease: Lease,
  discountPercentage: ?string,
  field: string,
  id: ?number,
  index: number,
  indexOptions: Array<Object>,
  intendedUse: number,
  intendedUseOptions: Array<Object>,
  isSaveClicked: boolean,
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
  attributes,
  currentLease,
  discountPercentage,
  field,
  id,
  index,
  indexOptions,
  intendedUse,
  intendedUseOptions,
  isSaveClicked,
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

    if(!isDecimalNumber(indexValue) || !isDecimalNumber(amountPerArea)) return null;
    return Number(formatDecimalNumberForDb(indexValue))/100 * Number(formatDecimalNumberForDb(amountPerArea));
  };

  const getBasicAnnualRent = () => {
    if(!isDecimalNumber(amountPerArea) || !isDecimalNumber(area)) return null;
    return Number(formatDecimalNumberForDb(amountPerArea))
      * Number(formatDecimalNumberForDb(area));
  };

  const getInitialYearRent = () => {
    const currentAmountPerArea = getCurrentAmountPerArea();

    if(!isDecimalNumber(currentAmountPerArea) || !isDecimalNumber(area)) return null;
    return Number(formatDecimalNumberForDb(currentAmountPerArea))
      * Number(formatDecimalNumberForDb(area))
      * Number(isDecimalNumber(profitMarginPercentage) ? Number(formatDecimalNumberForDb(profitMarginPercentage))/100 + 1 : 1);
  };

  const getDiscountedInitialYearRent = () => {
    const initialYearRent = getInitialYearRent();

    if(!isDecimalNumber(initialYearRent)) return null;
    return Number(formatDecimalNumberForDb(initialYearRent))
      * Number(isDecimalNumber(discountPercentage) ? (100 - Number(formatDecimalNumberForDb(discountPercentage)))/100 : 1);
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
          <th>Käyttötarkoitus</th>
          <th>Pinta-ala</th>
          <th>Piirustukset tarkastettu</th>
          <th>Laskelma lukittu</th>
          <th>Yksikköhinta (ind 100)</th>
          <th>Indeksi</th>
          <th>Yksikköhinta (ind)</th>
          <th>Tuottoprosentti</th>
          <th>Perusvuosivuokra (ind 100)</th>
          <th>Alkuvuosivuokra (ind)</th>
          <th>Alennusprosentti</th>
          <th>Alennettu alkuvuosivuokra (ind)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>${getLabelOfOption(intendedUseOptions, intendedUse) || '-'}</td>
          <td>${areaText}</td>
          <td>${plansInspectedAtText}</td>
          <td>${lockedAtText}</td>
          <td>${amountPerAreaText}</td>
          <td>${getLabelOfOption(indexOptions, index) || '-'}</td>
          <td>${currentAmountPerAreaText}</td>
          <td>${!isEmptyValue(profitMarginPercentage) ? `${formatNumber(profitMarginPercentage)} %` : '-'}</td>
          <td>${!isEmptyValue(basicAnnualRent) ? `${formatNumber(basicAnnualRent)} €/v` : '-'}</td>
          <td>${!isEmptyValue(initialYearRent) ? `${formatNumber(initialYearRent)} €/v` : '-'}</td>
          <td>${!isEmptyValue(discountPercentage) ? `${formatNumber(discountPercentage)} %` : '-'}</td>
          <td>${!isEmptyValue(discountedInitialYearRent) ? `${formatNumber(discountedInitialYearRent)} €/v` : '-'}</td>
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
          {onArchive && savedBasisOfRent && !savedBasisOfRent.locked_at &&
            <ArchiveButton onClick={handleArchive}/>
          }
          <RemoveButton
            onClick={onRemove}
            title="Poista vuokranperuste"
          />
        </ActionButtonWrapper>

        <Row>
          <Column small={6} medium={4} large={2}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={
                savedBasisOfRent && savedBasisOfRent.locked_at
                  ? {...get(attributes, 'basis_of_rents.child.children.intended_use'), required: false}
                  : get(attributes, 'basis_of_rents.child.children.intended_use')
              }
              disabled={!!get(savedBasisOfRent, 'locked_at')}
              name={`${field}.intended_use`}
              overrideValues={{label: 'Käyttötarkoitus'}}
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormTextTitle
              title='Pinta-ala'
              required={get(attributes, 'basis_of_rents.child.children.area.required')}
            />
            <Row>
              <Column small={6}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={
                    savedBasisOfRent && savedBasisOfRent.locked_at
                      ? {...get(attributes, 'basis_of_rents.child.children.area'), required: false}
                      : get(attributes, 'basis_of_rents.child.children.area')
                  }
                  disabled={!!get(savedBasisOfRent, 'locked_at')}
                  name={`${field}.area`}
                  invisibleLabel
                  overrideValues={{label: 'Pinta-ala'}}
                />
              </Column>
              <Column small={6}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={
                    savedBasisOfRent && savedBasisOfRent.locked_at
                      ? {...get(attributes, 'basis_of_rents.child.children.area_unit'), required: false}
                      : get(attributes, 'basis_of_rents.child.children.area_unit')
                  }
                  disabled={!!get(savedBasisOfRent, 'locked_at')}
                  name={`${field}.area_unit`}
                  invisibleLabel
                  overrideValues={{label: 'Pinta-alan yksikkö', options: areaUnitOptions}}
                />
              </Column>
            </Row>
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormField
              className='with-top-padding'
              disableTouched={isSaveClicked}
              fieldAttributes={
                savedBasisOfRent && savedBasisOfRent.locked_at
                  ? {...get(attributes, 'basis_of_rents.child.children.plans_inspected_at'), required: false, type: 'checkbox-date-time'}
                  : {...get(attributes, 'basis_of_rents.child.children.plans_inspected_at'), type: 'checkbox-date-time'}
              }
              disabled={!!get(savedBasisOfRent, 'locked_at')}
              invisibleLabel
              name={`${field}.plans_inspected_at`}
              overrideValues={{label: 'Piirustukset tarkastettu'}}
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormField
              className='with-top-padding'
              disableTouched={isSaveClicked}
              fieldAttributes={{...get(attributes, 'basis_of_rents.child.children.locked_at'), type: 'checkbox-date-time'}}
              invisibleLabel
              name={`${field}.locked_at`}
              overrideValues={{label: 'Laskelma lukittu'}}
            />
          </Column>
        </Row>
        <Row>
          <Column small={6} medium={4} large={2}>
            <FormTextTitle
              title='Yksikköhinta (ind 100)'
              required={get(attributes, 'basis_of_rents.child.children.amount_per_area')}
            />
            <Row>
              <Column small={6}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={
                    savedBasisOfRent && savedBasisOfRent.locked_at
                      ? {...get(attributes, 'basis_of_rents.child.children.amount_per_area'), required: false}
                      : get(attributes, 'basis_of_rents.child.children.amount_per_area')
                  }
                  disabled={!!get(savedBasisOfRent, 'locked_at')}
                  name={`${field}.amount_per_area`}
                  unit='€'
                  invisibleLabel
                  overrideValues={{label: 'Yksikköhinta (ind 100)'}}
                />
              </Column>
              <Column small={6}>
                <FormField
                  className='with-slash'
                  disableTouched={isSaveClicked}
                  fieldAttributes={
                    savedBasisOfRent && savedBasisOfRent.locked_at
                      ? {...get(attributes, 'basis_of_rents.child.children.area_unit'), required: false}
                      : get(attributes, 'basis_of_rents.child.children.area_unit')
                  }
                  name={`${field}.area_unit`}
                  disabled
                  invisibleLabel
                  overrideValues={{label: 'Pinta-alan yksikkö', options: areaUnitOptions}}
                />
              </Column>
            </Row>
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={
                savedBasisOfRent && savedBasisOfRent.locked_at
                  ? {...get(attributes, 'basis_of_rents.child.children.index'), required: false}
                  : get(attributes, 'basis_of_rents.child.children.index')
              }
              disabled={!!get(savedBasisOfRent, 'locked_at')}
              name={`${field}.index`}
              overrideValues={{
                label: 'Indeksi',
                options: indexOptions,
              }}
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormTitleAndText
              title='Yksikköhinta (ind)'
              text={currentAmountPerAreaText}
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={
                savedBasisOfRent && savedBasisOfRent.locked_at
                  ? {...get(attributes, 'basis_of_rents.child.children.profit_margin_percentage'), required: false}
                  : get(attributes, 'basis_of_rents.child.children.profit_margin_percentage')
              }
              disabled={!!get(savedBasisOfRent, 'locked_at')}
              name={`${field}.profit_margin_percentage`}
              unit='%'
              overrideValues={{
                label: 'Tuottoprosentti',
              }}
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
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={
                savedBasisOfRent && savedBasisOfRent.locked_at
                  ? {...get(attributes, 'basis_of_rents.child.children.discount_percentage'), required: false}
                  : get(attributes, 'basis_of_rents.child.children.discount_percentage')
              }
              disabled={!!get(savedBasisOfRent, 'locked_at')}
              name={`${field}.discount_percentage`}
              unit='%'
              overrideValues={{
                label: 'Alennusprosentti',
              }}
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
      lockedAt: selector(state, `${props.field}.locked_at`),
      plansInspectedAt: selector(state, `${props.field}.plans_inspected_at`),
      profitMarginPercentage: selector(state, `${props.field}.profit_margin_percentage`),
    };
  },
)(BasisOfRentEdit);
