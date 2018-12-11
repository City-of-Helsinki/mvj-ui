// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';

import BoxContentWrapper from '$components/content/BoxContentWrapper';
import BoxItem from '$components/content/BoxItem';
import FormText from '$components/form/FormText';
import FormTitleAndText from '$components/form/FormTitleAndText';
import {
  formatDate,
  formatNumber,
  getLabelOfOption,
  isEmptyValue,
} from '$util/helpers';
import {RentTypes} from '$src/leases/enums';

type Props = {
  amountPeriodOptions: Array<Object>,
  baseAmountPeriodOptions: Array<Object>,
  contractRent: Object,
  intendedUseOptions: Array<Object>,
  largeScreen: boolean,
  rentType: string,
}

const ContractRent = ({amountPeriodOptions, baseAmountPeriodOptions, contractRent, intendedUseOptions, largeScreen, rentType}: Props) => {
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
      <Row>
        <Column small={6} medium={4} large={2}>
          <FormText>{amountText}</FormText>
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormText>{getLabelOfOption(intendedUseOptions, contractRent.intended_use)}</FormText>
        </Column>
        {(rentType === RentTypes.INDEX ||
          rentType === RentTypes.MANUAL) &&
          <Column small={6} medium={4} large={2}>
            <FormText>{baseAmountText}</FormText>
          </Column>
        }
        {(rentType === RentTypes.INDEX ||
          rentType === RentTypes.MANUAL) &&
          <Column small={6} medium={4} large={2} offsetOnLarge={1}>
            <FormText>{!isEmptyValue(contractRent.base_year_rent) ? `${formatNumber(contractRent.base_year_rent)} €` : '-'}</FormText>
          </Column>
        }
        <Column small={6} medium={4} large={1}>
          <FormText>{contractRent.start_date ? formatDate(contractRent.start_date) : '-'}</FormText>
        </Column>
        <Column small={6} medium={4} large={1}>
          <FormText>{contractRent.end_date ? formatDate(contractRent.end_date) : '-'}</FormText>
        </Column>
      </Row>
    );
  } else {
    // For small and medium screens
    return(
      <BoxItem
        className='no-border-on-first-child no-border-on-last-child'>
        <BoxContentWrapper>
          <Row>
            <Column small={6} medium={4} large={2}>
              <FormTitleAndText
                title='Perusvuosivuokra'
                text={amountText || '-'}
              />
              <FormText>{}</FormText>
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormTitleAndText
                title='Käyttötarkoitus'
                text={getLabelOfOption(intendedUseOptions, contractRent.intended_use)}
              />
            </Column>
            {(rentType === RentTypes.INDEX ||
              rentType === RentTypes.MANUAL) &&
              <Column small={6} medium={4} large={2}>
                <FormTitleAndText
                  title='Vuokranlaskennan perusteena oleva vuokra'
                  text={baseAmountText || '-'}
                />
              </Column>
            }
            {(rentType === RentTypes.INDEX ||
              rentType === RentTypes.MANUAL) &&
              <Column small={6} medium={4} large={2} offsetOnLarge={1}>
                <FormTitleAndText
                  title='Uusi perusvuosivuokra'
                  text={!isEmptyValue(contractRent.base_year_rent) ? `${formatNumber(contractRent.base_year_rent)} €` : '-'}
                />
              </Column>
            }
            <Column small={6} medium={4} large={1}>
              <FormTitleAndText
                title='Alkupvm'
                text={contractRent.start_date ? formatDate(contractRent.start_date) : '-'}
              />
            </Column>
            <Column small={6} medium={4} large={1}>
              <FormTitleAndText
                title='Loppupvm'
                text={contractRent.end_date ? formatDate(contractRent.end_date) : '-'}
              />
            </Column>
          </Row>
        </BoxContentWrapper>
      </BoxItem>
    );
  }
};

export default ContractRent;
