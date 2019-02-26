// @flow
import React, {Fragment} from 'react';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import AmountWithVat from '$components/vat/AmountWithVat';
import Authorization from '$components/authorization/Authorization';
import Divider from '$components/content/Divider';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import SubTitle from '$components/content/SubTitle';
import {InvoiceRowsFieldPaths, InvoiceRowsFieldTitles} from '$src/invoices/enums';
import {getContactFullName} from '$src/contacts/helpers';
import {getContentTenantItem} from '$src/leases/helpers';
import {getUiDataInvoiceKey} from '$src/uiData/helpers';
import {getLabelOfOption, isFieldAllowedToRead} from '$util/helpers';

import type {Attributes} from '$src/types';

type Props = {
  invoiceAttributes: Attributes,
  invoiceDate: ?string,
  invoiceDueDate: ?string,
  receivableTypeOptions: Array<Object>,
  rows: Array<Object>,
}

const InvoiceRows = ({
  invoiceAttributes,
  invoiceDate,
  invoiceDueDate,
  receivableTypeOptions,
  rows,
}: Props) => {
  const getRowsSum = (items: Array<Object>) => items.reduce((sum, item) => sum + Number(item.amount), 0);

  const sum = getRowsSum(rows);

  return(
    <Row>
      <Column small={12}>
        <SubTitle enableUiDataEdit uiDataKey={getUiDataInvoiceKey(InvoiceRowsFieldPaths.ROWS)}>
          {InvoiceRowsFieldTitles.ROWS}
        </SubTitle>
        {!rows.length && <FormText>-</FormText>}
        {!!rows.length &&
          <Fragment>
            <Row>
              <Column small={4}>
                <FormTextTitle enableUiDataEdit uiDataKey={getUiDataInvoiceKey(InvoiceRowsFieldPaths.TENANT)}>
                  {InvoiceRowsFieldTitles.TENANT}
                </FormTextTitle>
              </Column>
              <Column small={4}>
                <FormTextTitle enableUiDataEdit uiDataKey={getUiDataInvoiceKey(InvoiceRowsFieldPaths.RECEIVABLE_TYPE)}>
                  {InvoiceRowsFieldTitles.RECEIVABLE_TYPE}
                </FormTextTitle>
              </Column>
              <Column small={4}>
                <FormTextTitle style={{textAlign: 'right'}} enableUiDataEdit uiDataKey={getUiDataInvoiceKey(InvoiceRowsFieldPaths.AMOUNT)}>
                  {InvoiceRowsFieldTitles.AMOUNT}
                </FormTextTitle>
              </Column>
            </Row>

            {rows.map((row) => {
              const contact = get(getContentTenantItem(row.tenantFull), 'contact');

              return (
                <Row key={row.id}>
                  <Column small={4}>
                    <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceRowsFieldPaths.TENANT)}>
                      <FormText>{getContactFullName(contact) || '-'}</FormText>
                    </Authorization>
                  </Column>
                  <Column small={4}>
                    <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceRowsFieldPaths.RECEIVABLE_TYPE)}>
                      <FormText>{getLabelOfOption(receivableTypeOptions, row.receivable_type) || '-'}</FormText>
                    </Authorization>
                  </Column>
                  <Column small={4}>
                    <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceRowsFieldPaths.AMOUNT)}>
                      <FormText className='align-right'>{row.amount
                        ? <AmountWithVat amount={row.amount} date={invoiceDate} />
                        : '-'}
                      </FormText>
                    </Authorization>
                  </Column>
                </Row>
              );
            })}
            <Divider className='invoice-divider' />
            <Row>
              <Column small={8}><FormText><strong>Yhteensä</strong></FormText></Column>
              <Column small={4}>
                <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceRowsFieldPaths.AMOUNT)}>
                  <FormText className='align-right'>
                    <strong><AmountWithVat amount={sum} date={invoiceDueDate} /></strong>
                  </FormText>
                </Authorization>
              </Column>
            </Row>
          </Fragment>
        }
      </Column>
    </Row>
  );
};

export default InvoiceRows;
