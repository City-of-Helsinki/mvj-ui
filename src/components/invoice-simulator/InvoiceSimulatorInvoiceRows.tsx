import React from "react";
import { Row, Column } from "react-foundation";
import AmountWithVat from "@/components/vat/AmountWithVat";
import Divider from "@/components/content/Divider";
import FormText from "@/components/form/FormText";
import FormTextTitle from "@/components/form/FormTextTitle";
import { getContactFullName } from "@/contacts/helpers";
import { getLabelOfOption } from "@/util/helpers";
type Props = {
  dueDate: string;
  receivableTypeOptions: Array<Record<string, any>>;
  rows: Array<Record<string, any>>;
};

const InvoiceSimulatorInvoiceRows = ({
  dueDate,
  receivableTypeOptions,
  rows,
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
    <div>
      <Row>
        <Column small={6} medium={4}>
          <FormTextTitle title="Vuokralainen" />
        </Column>
        <Column small={2} medium={2}>
          <FormTextTitle title="Saamislaji" />
        </Column>
        <Column small={2} medium={2}>
          <FormTextTitle title="Osuus" />
        </Column>
        <Column small={2} medium={4}>
          <FormTextTitle title="Summa" />
        </Column>
      </Row>
      {rows.map((row, index) => {
        return (
          <Row key={index}>
            <Column small={6} medium={4}>
              <FormText>{getContactFullName(row.tenant.contact)}</FormText>
            </Column>
            <Column small={2} medium={2}>
              <FormText>
                {getLabelOfOption(receivableTypeOptions, row.receivableType)}
              </FormText>
            </Column>
            <Column small={2} medium={2}>
              <FormText>
                {row.tenant.shareNumerator} / {row.tenant.shareDenominator}
              </FormText>
            </Column>
            <Column small={2} medium={4}>
              <FormText>
                <AmountWithVat amount={row.amount} date={dueDate} />
              </FormText>
            </Column>
          </Row>
        );
      })}
      <Divider className="invoice-divider" />
      <Row>
        <Column small={10} medium={8}>
          <FormText>
            <strong>Yhteensä</strong>
          </FormText>
        </Column>
        <Column small={2} medium={2}>
          <FormText>
            <strong>
              <AmountWithVat amount={sum} date={dueDate} />
            </strong>
          </FormText>
        </Column>
      </Row>
    </div>
  );
};

export default InvoiceSimulatorInvoiceRows;
