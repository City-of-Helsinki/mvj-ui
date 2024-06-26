import React from "react";
import { connect } from "react-redux";
import { Row, Column } from "react-foundation";
import FormTextTitle from "/src/components/form/FormTextTitle";
import GreenBox from "/src/components/content/GreenBox";
import ListItem from "/src/components/content/ListItem";
import ListItems from "/src/components/content/ListItems";
import { getContentInvoices } from "landUseContract/helpers";
import { formatDate, formatNumber } from "util/helpers";
import { getCurrentLandUseContract } from "landUseContract/selectors";
import type { LandUseContract } from "landUseContract/types";
type Props = {
  currentLandUseContract: LandUseContract;
};

const Invoices = ({
  currentLandUseContract
}: Props) => {
  const invoices = getContentInvoices(currentLandUseContract);
  return <GreenBox>
      {!invoices.length && <p>Ei laskuja</p>}
      {!!invoices.length && <div>
          <Row>
            <Column small={3} large={2}><FormTextTitle title='Määrä' /></Column>
            <Column small={3} large={2}><FormTextTitle title='Eräpäivä' /></Column>
            <Column small={3} large={2}><FormTextTitle title='Lähetetty pvm' /></Column>
            <Column small={3} large={2}><FormTextTitle title='Maksettu pvm' /></Column>
          </Row>
          <ListItems>
            {invoices.map((invoice, index) => {
          return <Row key={index}>
                  <Column small={3} large={2}>
                    <ListItem>{invoice.amount ? `${formatNumber(invoice.amount)} €` : '-'}</ListItem>
                  </Column>
                  <Column small={3} large={2}>
                    <ListItem>{formatDate(invoice.due_date) || '-'}</ListItem>
                  </Column>
                  <Column small={3} large={2}>
                    <ListItem>{formatDate(invoice.sent_date) || '-'}</ListItem>
                  </Column>
                  <Column small={3} large={2}>
                    <ListItem>{formatDate(invoice.paid_date) || '-'}</ListItem>
                  </Column>
                </Row>;
        })}
          </ListItems>
        </div>}
    </GreenBox>;
};

export default connect(state => {
  return {
    currentLandUseContract: getCurrentLandUseContract(state)
  };
})(Invoices);