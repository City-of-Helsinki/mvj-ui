// @flow
import React, {Fragment} from 'react';
import {Row, Column} from 'react-foundation';

import AmountWithVat from '$components/vat/AmountWithVat';
import Collapse from '$components/collapse/Collapse';
import RentCalculatorExplanation from '$components/rent-calculator/RentCalculatorExplanation';
import FormTitleAndText from '$components/form/FormTitleAndText';
import InvoiceSimulatorInvoice from './InvoiceSimulatorInvoice';
import SubTitle from '$components/content/SubTitle';
import {formatDate, formatDateRange} from '$util/helpers';

type Props = {
  dueDate: string,
  endDate: string,
  explanations: Array<Object>,
  invoices: Array<Object>,
  invoiceReceivableTypeOptions: Array<Object>,
  invoiceTypeOptions: Array<Object>,
  startDate: string,
  totalAmount: number,
}

const InvoiceSimulatorBillingPeriod = ({
  dueDate,
  endDate,
  explanations,
  invoices,
  invoiceReceivableTypeOptions,
  invoiceTypeOptions,
  startDate,
  totalAmount,
}: Props) => {

  return(
    <Collapse
      className='collapse__secondary'
      defaultOpen={false}
      header={
        <div>
          <Column>
            <span className='collapse__header-subtitle'>
              {formatDate(dueDate) || '-'}
            </span>
          </Column>
          <Column>
            <span className='collapse__header-subtitle'>
              <AmountWithVat amount={totalAmount} date={dueDate} />
            </span>
          </Column>
        </div>
      }
      headerTitle={<h4 className='collapse__header-title'>{formatDateRange(startDate, endDate)}</h4>}
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
        <Column small={12} medium={4} large={8}>
          <FormTitleAndText
            title='Summa yhteensä'
            text={<AmountWithVat amount={totalAmount} date={dueDate} />}
          />
        </Column>
      </Row>

      <SubTitle>Laskelma</SubTitle>
      <Row>
        <Column small={12} large={8} className='invoice-simulator__explanations'>
          {explanations && explanations.length &&
            explanations.map((explanation, index) => {
              return <Fragment key={index}>
                {explanation.items.map((item, index) => {
                  return <RentCalculatorExplanation
                    date={dueDate}
                    key={index}
                    explanation={item}
                  />;
                })}
              </Fragment>;
            })
          }
        </Column>
      </Row>


      <SubTitle>Laskut</SubTitle>
      {invoices.map((invoice, index) => {
        return <InvoiceSimulatorInvoice
          key={index}
          billedAmount={invoice.billedAmount}
          dueDate={invoice.dueDate}
          endDate={invoice.endDate}
          explanations={invoice.explanations}
          receivableTypeOptions={invoiceReceivableTypeOptions}
          recipient={invoice.recipient}
          rows={invoice.rows}
          startDate={invoice.startDate}
          type={invoice.type}
          typeOptions={invoiceTypeOptions}
        />;
      })}
    </Collapse>
  );
};

export default InvoiceSimulatorBillingPeriod;
