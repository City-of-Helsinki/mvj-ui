// @flow
import React, {PureComponent} from 'react';
import {Row, Column} from 'react-foundation';
import throttle from 'lodash/throttle';

import BoxContentWrapper from '$components/content/BoxContentWrapper';
import BoxItem from '$components/content/BoxItem';
import FormText from '$components/form/FormText';
import FormTitleAndText from '$components/form/FormTitleAndText';
import {
  formatDate,
  formatNumber,
  getLabelOfOption,
  isEmptyValue,
  isLargeScreen,
} from '$util/helpers';
import {RentTypes} from '$src/leases/enums';

type Props = {
  amountPeriodOptions: Array<Object>,
  baseAmountPeriodOptions: Array<Object>,
  contractRent: Object,
  intendedUseOptions: Array<Object>,
  rentType: string,
}
type State = {
  largeScreen: boolean,
}

class ContractRent extends PureComponent<Props, State> {
  state = {
    largeScreen: isLargeScreen(),
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  getAmount = () => {
    const {amountPeriodOptions, contractRent} = this.props;

    if(isEmptyValue(contractRent.amount)) return null;

    return `${formatNumber(contractRent.amount)} € ${getLabelOfOption(amountPeriodOptions, contractRent.period)}`;
  };

  getBaseAmount = () => {
    const {baseAmountPeriodOptions, contractRent} = this.props;

    if(isEmptyValue(contractRent.base_amount)) return null;

    return `${formatNumber(contractRent.base_amount)} € ${getLabelOfOption(baseAmountPeriodOptions, contractRent.base_amount_period)}`;
  };

  handleResize = throttle(() => {
    this.setState({largeScreen: isLargeScreen()});
  }, 100);

  render() {
    const {contractRent, intendedUseOptions, rentType} = this.props;
    const {largeScreen} = this.state;
    const amountText = this.getAmount();
    const baseAmountText = this.getBaseAmount();

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
          className='no-border-on-last-child'>
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
  }
}

export default ContractRent;
