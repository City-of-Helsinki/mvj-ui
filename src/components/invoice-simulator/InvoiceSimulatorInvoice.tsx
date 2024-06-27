import React, { Fragment } from "react";
import { Row, Column } from "react-foundation";
import AmountWithVat from "/src/components/vat/AmountWithVat";
import Collapse from "/src/components/collapse/Collapse";
import CollapseHeaderSubtitle from "/src/components/collapse/CollapseHeaderSubtitle";
import FormText from "/src/components/form/FormText";
import FormTitleAndText from "/src/components/form/FormTitleAndText";
import InvoiceSimulatorInvoiceRows from "./InvoiceSimulatorInvoiceRows";
import SubTitle from "/src/components/content/SubTitle";
import { getContactFullName } from "/src/contacts/helpers";
import { formatDate, formatDateRange, getLabelOfOption } from "util/helpers";
type Props = {
  billedAmount: number;
  dueDate: string;
  endDate: string;
  receivableTypeOptions: Array<Record<string, any>>;
  recipient: Record<string, any>;
  rows: Array<Record<string, any>>;
  startDate: string;
  type: string;
  typeOptions: Array<Record<string, any>>;
  explanations?: any;
};

const InvoiceSimulatorInvoice = ({
  billedAmount,
  dueDate,
  endDate,
  receivableTypeOptions,
  recipient,
  rows,
  startDate,
  type,
  typeOptions
}: Props) => {
  return <Collapse className='collapse__third' defaultOpen={false} headerSubtitles={<Fragment>
          <Column>
            <CollapseHeaderSubtitle>{formatDate(dueDate) || '-'}</CollapseHeaderSubtitle>
          </Column>
          <Column>
            <CollapseHeaderSubtitle><AmountWithVat amount={billedAmount} date={dueDate} /></CollapseHeaderSubtitle>
          </Column>
        </Fragment>} headerTitle={getContactFullName(recipient)}>
      <Row>
        <Column small={6} medium={4} large={2}>
          <FormTitleAndText title='Laskutuskausi' text={formatDateRange(startDate, endDate)} />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormTitleAndText title='Eräpäivä' text={formatDate(dueDate)} />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormTitleAndText title='Summa' text={<AmountWithVat amount={billedAmount} date={dueDate} />} />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormTitleAndText title='Tyyppi' text={getLabelOfOption(typeOptions, type)} />
        </Column>
      </Row>

      <SubTitle>Erittely</SubTitle>
      {!rows.length && <FormText>Ei rivejä</FormText>}
      {!!rows.length && <InvoiceSimulatorInvoiceRows dueDate={dueDate} receivableTypeOptions={receivableTypeOptions} rows={rows} />}
    </Collapse>;
};

export default InvoiceSimulatorInvoice;