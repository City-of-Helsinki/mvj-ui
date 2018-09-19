// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';

import Collapse from '$components/collapse/Collapse';
import Divider from '$components/content/Divider';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import FormTitleAndText from '$components/form/FormTitleAndText';
import SubTitle from '$components/content/SubTitle';
import {getContactFullName} from '$src/contacts/helpers';
import {formatDate, formatDateRange, formatNumber, getLabelOfOption} from '$util/helpers';

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
  const getRowSum = () => {
    let sum = 0;
    rows.forEach((row) => {
      sum += Number(row.amount);
    });
    return sum;
  };


  const sum = getRowSum();
  return (
    <Collapse
      className='collapse__third'
      defaultOpen={false}
      header={
        <div>
          <Column>
            <span className='collapse__header-subtitle'>
              {`${formatNumber(billedAmount)} €`}
            </span>
          </Column>
        </div>
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
            text={`${formatNumber(billedAmount)} €`}
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
      <Row>
        <Column medium={4}><FormTextTitle title='Vuokralainen' /></Column>
        <Column medium={2}><FormTextTitle title='Saamislaji' /></Column>
        <Column medium={2}><FormTextTitle title='Osuus' /></Column>
        <Column medium={2}><FormTextTitle title='Summa' /></Column>
      </Row>
      {rows.map((row, index) => {
        return(
          <Row key={index}>
            <Column small={6} medium={4}><FormText>{getContactFullName(row.tenant.contact)}</FormText></Column>
            <Column small={2} medium={2}><FormText>{getLabelOfOption(receivableTypeOptions, row.receivableType)}</FormText></Column>
            <Column small={2} medium={2}><FormText>{row.tenant.shareNumerator} / {row.tenant.shareDenominator}</FormText></Column>
            <Column small={2} medium={2}><FormText>{formatNumber(row.amount)} €</FormText></Column>
          </Row>
        );
      })}
      <Divider className='invoice-divider' />
      <Row>
        <Column small={10} medium={8}><FormText><strong>Yhteensä</strong></FormText></Column>
        <Column small={2} medium={2}><FormText><strong>{`${formatNumber(sum)} €`}</strong></FormText></Column>
      </Row>
    </Collapse>
  );
};

export default InvoiceSimulatorInvoice;
