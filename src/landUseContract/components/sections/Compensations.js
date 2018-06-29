// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import Divider from '$components/content/Divider';
import FormFieldLabel from '$components/form/FormFieldLabel';
import GreenBox from '$components/content/GreenBox';
import ListItems from '$components/content/ListItems';
import SubTitle from '$components/content/SubTitle';
import WhiteBox from '$components/content/WhiteBox';
import {getContentLandUseContractCompensations} from '$src/landUseContract/helpers';
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

  const compensations = getContentLandUseContractCompensations(currentLandUseContract);
  const invoices = get(compensations, 'invoices', []);
  const total = getTotal(compensations);

  return (
    <GreenBox>
      <Row>
        <Column small={12} large={6}>
          <WhiteBox>
            <Row>
              <Column small={6} medium={3} large={4}>
                <FormFieldLabel>Maankäyttökorvaus</FormFieldLabel>
              </Column>
              <Column small={6} medium={3} large={4}>
                <FormFieldLabel>Korvauksen määrä</FormFieldLabel>
              </Column>
            </Row>
            <Row>
              <Column small={6} medium={3} large={4}>
                <p>Rahakorvaus</p>
              </Column>
              <Column small={6} medium={3} large={4}>
                <p>{compensations.cash_compensation ? `${formatNumber(compensations.cash_compensation)} €` : '-'}</p>
              </Column>
            </Row>
            <Row>
              <Column small={6} medium={3} large={4}>
                <p>Maakorvaus</p>
              </Column>
              <Column small={6} medium={3} large={4}>
                <p>{compensations.land_compensation ? `${formatNumber(compensations.land_compensation)} €` : '-'}</p>
              </Column>
            </Row>
            <Row>
              <Column small={6} medium={3} large={4}>
                <p>Muu</p>
              </Column>
              <Column small={6} medium={3} large={4}>
                <p>{compensations.other_compensation ? `${formatNumber(compensations.other_compensation)} €` : '-'}</p>
              </Column>
            </Row>
            <Row>
              <Column small={6} medium={3} large={4}>
                <p className='no-margin'>1. maksuerän korotus</p>
              </Column>
              <Column small={6} medium={3} large={4}>
                <p className='no-margin'>{compensations.first_installment_increase ? `${formatNumber(compensations.first_installment_increase)} €` : '-'}</p>
              </Column>
            </Row>
            <Divider />
            <Row>
              <Column small={6} medium={3} large={4}>
                <p>Yhteensä</p>
              </Column>
              <Column small={6} medium={3} large={4}>
                <p>{`${formatNumber(total)} €`}</p>
              </Column>
            </Row>
          </WhiteBox>
        </Column>
      </Row>
      <Row>
        <Column small={6} medium={3} large={2}>
          <FormFieldLabel>Ilmaisluovutusala</FormFieldLabel>
          <p>{compensations.free_delivery_area ? `${formatNumber(compensations.free_delivery_area)} m²` : '-'}</p>
        </Column>
        <Column small={6} medium={3} large={2}>
          <FormFieldLabel>Ilmaisluovutusarvo</FormFieldLabel>
          <p>{compensations.free_delivery_amount ? `${formatNumber(compensations.free_delivery_amount)} €` : '-'}</p>
        </Column>
        <Column small={6} medium={3} large={2}>
          <FormFieldLabel>Lisäkerrosala asunto</FormFieldLabel>
          <p>{compensations.additional_floor_area_apartment ? `${formatNumber(compensations.additional_floor_area_apartment)} €` : '-'}</p>
        </Column>
        <Column small={6} medium={3} large={2}>
          <FormFieldLabel>Lisäkerrosala yritys</FormFieldLabel>
          <p>{compensations.additional_floor_area_company ? `${formatNumber(compensations.additional_floor_area_company)} €` : '-'}</p>
        </Column>
      </Row>

      <SubTitle>Korvauksen maksaminen</SubTitle>
      {!invoices.length && <p>Ei laskuja</p>}
      {!!invoices.length &&
        <div>
          <Row>
            <Column small={3} large={2}><FormFieldLabel>Määrä</FormFieldLabel></Column>
            <Column small={3} large={2}><FormFieldLabel>Eräpäivä</FormFieldLabel></Column>
          </Row>
          <ListItems>
            {invoices.map((invoice, index) => {
              return (
                <Row key={index}>
                  <Column small={3} large={2}>
                    <p className='no-margin'>{invoice.amount ? `${formatNumber(invoice.amount)} €` : '-'}</p>
                  </Column>
                  <Column small={3} large={2}>
                    <p className='no-margin'>{formatDate(invoice.due_date) || '-'}</p>
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
