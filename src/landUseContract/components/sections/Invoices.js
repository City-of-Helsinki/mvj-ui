// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';

import FormFieldLabel from '$components/form/FormFieldLabel';
import GreenBox from '$components/content/GreenBox';
import ListItems from '$components/content/ListItems';
import {getContentInvoices} from '$src/landUseContract/helpers';
import {formatDate, formatNumber} from '$util/helpers';
import {getCurrentLandUseContract} from '$src/landUseContract/selectors';

import type {LandUseContract} from '$src/landUseContract/types';

type Props = {
  currentLandUseContract: LandUseContract,
}

const Invoices = ({currentLandUseContract}: Props) => {
  const invoices = getContentInvoices(currentLandUseContract);
  return (
    <GreenBox>
      {!invoices.length && <p>Ei laskuja</p>}
      {!!invoices.length &&
        <div>
          <Row>
            <Column small={3} large={2}><FormFieldLabel>Määrä</FormFieldLabel></Column>
            <Column small={3} large={2}><FormFieldLabel>Eräpäivä</FormFieldLabel></Column>
            <Column small={3} large={2}><FormFieldLabel>Lähetetty pvm</FormFieldLabel></Column>
            <Column small={3} large={2}><FormFieldLabel>Maksettu pvm</FormFieldLabel></Column>
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
                  <Column small={3} large={2}>
                    <p className='no-margin'>{formatDate(invoice.sent_date) || '-'}</p>
                  </Column>
                  <Column small={3} large={2}>
                    <p className='no-margin'>{formatDate(invoice.paid_date) || '-'}</p>
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
)(Invoices);
