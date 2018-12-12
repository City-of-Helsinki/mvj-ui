// @flow
import React, {Fragment} from 'react';
import {Row, Column} from 'react-foundation';

import AmountWithVat from '$components/vat/AmountWithVat';
import Collapse from '$components/collapse/Collapse';
import FormText from '$components/form/FormText';
import FormTitleAndText from '$components/form/FormTitleAndText';
import InvoiceSimulatorInvoiceRows from './InvoiceSimulatorInvoiceRows';
import SubTitle from '$components/content/SubTitle';
import {getContactFullName} from '$src/contacts/helpers';
import {formatDate, formatDateRange, getLabelOfOption} from '$util/helpers';

type Props = {
  billedAmount: number,
  dueDate: string,
  endDate: string,
  receivableTypeOptions: Array<Object>,
  recipient: Object,
  rows: Array<Object>,
  startDate: string,
  type: string,
  typeOptions: Array<Object>,
}

const InvoiceSimulatorInvoice = ({
  billedAmount,
  dueDate,
  endDate,
  receivableTypeOptions,
  recipient,
  rows,
  startDate,
  type,
  typeOptions,
}: Props) => {
  return (
    <Collapse
      className='collapse__third'
      defaultOpen={false}
      headerSubtitles={
        <Fragment>
          <Column>
            <span className='collapse__header-subtitle'>
              {formatDate(dueDate) || '-'}
            </span>
          </Column>
          <Column>
            <span className='collapse__header-subtitle'>
              <AmountWithVat amount={billedAmount} date={dueDate} />
            </span>
          </Column>
        </Fragment>
      }
      headerTitle={<h4 className='collapse__header-title'>{getContactFullName(recipient)}</h4>}
    >
      <Row>
        <Column small={6} medium={4} large={2}>
          <FormTitleAndText
            title='Laskutuskausi'
            text={formatDateRange(startDate, endDate)}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormTitleAndText
            title='Eräpäivä'
            text={formatDate(dueDate)}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormTitleAndText
            title='Summa'
            text={<AmountWithVat amount={billedAmount} date={dueDate} />}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormTitleAndText
            title='Tyyppi'
            text={getLabelOfOption(typeOptions, type)}
          />
        </Column>
      </Row>

      <SubTitle>Erittely</SubTitle>
      {!rows.length && <FormText>Ei rivejä</FormText>}
      {!!rows.length && <InvoiceSimulatorInvoiceRows
        dueDate={dueDate}
        receivableTypeOptions={receivableTypeOptions}
        rows={rows} />
      }
    </Collapse>
  );
};

export default InvoiceSimulatorInvoice;
