// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import Divider from '$components/content/Divider';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import FormTitleAndText from '$components/form/FormTitleAndText';
import GreenBox from '$components/content/GreenBox';
import ListItem from '$components/content/ListItem';
import ListItems from '$components/content/ListItems';
import SubTitle from '$components/content/SubTitle';
import WhiteBox from '$components/content/WhiteBox';
import {getContentCompensations} from '$src/landUseContract/helpers';
import {formatDate, formatNumber} from '$util/helpers';
import {getCurrentLandUseContract} from '$src/landUseContract/selectors';

import type {LandUseContract} from '$src/landUseContract/types';

type Props = {
  currentLandUseContract: LandUseContract,
}

const Compensations = ({currentLandUseContract}: Props) => {
  const getTotal = (compensations: Object) => {
    const cash = Number(get(compensations, 'cash_compensation'));
    const land = Number(get(compensations, 'land_compensation'));
    const other = Number(get(compensations, 'other_compensation'));
    const increase = Number(get(compensations, 'first_installment_increase'));
    return cash + land + other + increase;
  };

  const compensations = getContentCompensations(currentLandUseContract);
  const invoices = get(compensations, 'invoices', []);
  const total = getTotal(compensations);

  return (
    <GreenBox>
      <Row>
        <Column small={12} large={6}>
          <WhiteBox>
            <Row>
              <Column small={6} medium={3} large={4}>
                <FormTextTitle title='Maankäyttökorvaus' />
              </Column>
              <Column small={6} medium={3} large={4}>
                <FormTextTitle title='Korvauksen määrä' />
              </Column>
            </Row>
            <Row>
              <Column small={6} medium={3} large={4}>
                <FormText>Rahakorvaus</FormText>
              </Column>
              <Column small={6} medium={3} large={4}>
                <FormText>{compensations.cash_compensation ? `${formatNumber(compensations.cash_compensation)} €` : '-'}</FormText>
              </Column>
            </Row>
            <Row>
              <Column small={6} medium={3} large={4}>
                <FormText>Maakorvaus</FormText>
              </Column>
              <Column small={6} medium={3} large={4}>
                <FormText>{compensations.land_compensation ? `${formatNumber(compensations.land_compensation)} €` : '-'}</FormText>
              </Column>
            </Row>
            <Row>
              <Column small={6} medium={3} large={4}>
                <FormText>Muu</FormText>
              </Column>
              <Column small={6} medium={3} large={4}>
                <FormText>{compensations.other_compensation ? `${formatNumber(compensations.other_compensation)} €` : '-'}</FormText>
              </Column>
            </Row>
            <Row>
              <Column small={6} medium={3} large={4}>
                <FormText className='no-margin'>1. maksuerän korotus</FormText>
              </Column>
              <Column small={6} medium={3} large={4}>
                <FormText className='no-margin'>{compensations.first_installment_increase ? `${formatNumber(compensations.first_installment_increase)} €` : '-'}</FormText>
              </Column>
            </Row>
            <Divider />
            <Row>
              <Column small={6} medium={3} large={4}>
                <FormText>Yhteensä</FormText>
              </Column>
              <Column small={6} medium={3} large={4}>
                <FormText>{`${formatNumber(total)} €`}</FormText>
              </Column>
            </Row>
          </WhiteBox>
        </Column>
      </Row>
      <Row>
        <Column small={6} medium={3} large={2}>
          <FormTitleAndText
            title='Ilmaisluovutusala'
            text={compensations.free_delivery_area ? `${formatNumber(compensations.free_delivery_area)} m²` : '-'}
          />
        </Column>
        <Column small={6} medium={3} large={2}>
          <FormTitleAndText
            title='Ilmaisluovutusarvo'
            text={compensations.free_delivery_amount ? `${formatNumber(compensations.free_delivery_amount)} €` : '-'}
          />
        </Column>
        <Column small={6} medium={3} large={2}>
          <FormTitleAndText
            title='Lisäkerrosala asunto'
            text={compensations.additional_floor_area_apartment ? `${formatNumber(compensations.additional_floor_area_apartment)} k-m²` : '-'}
          />
        </Column>
        <Column small={6} medium={3} large={2}>
          <FormTitleAndText
            title='Lisäkerrosala yritys'
            text={compensations.additional_floor_area_company ? `${formatNumber(compensations.additional_floor_area_company)} k-m²` : '-'}
          />
        </Column>
      </Row>

      <SubTitle>Korvauksen maksaminen</SubTitle>
      {!invoices.length && <FormText>Ei laskuja</FormText>}
      {!!invoices.length &&
        <div>
          <Row>
            <Column small={3} large={2}>
              <FormTextTitle title='Määrä' />
            </Column>
            <Column small={3} large={2}>
              <FormTextTitle title='Eräpäivä' />
            </Column>
          </Row>
          <ListItems>
            {invoices.map((invoice, index) => {
              return (
                <Row key={index}>
                  <Column small={3} large={2}>
                    <ListItem>{invoice.amount ? `${formatNumber(invoice.amount)} €` : '-'}</ListItem>
                  </Column>
                  <Column small={3} large={2}>
                    <ListItem>{formatDate(invoice.due_date) || '-'}</ListItem>
                  </Column>
                </Row>
              );
            })}
          </ListItems>
        </div>
      }
    </GreenBox>
  );
};

export default connect(
  (state) => {
    return {
      currentLandUseContract: getCurrentLandUseContract(state),
    };
  }
)(Compensations);
