// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import AmountWithVat from '$components/vat/AmountWithVat';
import Authorization from '$components/authorization/Authorization';
import BoxItem from '$components/content/BoxItem';
import BoxItemContainer from '$components/content/BoxItemContainer';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import SubTitle from '$components/content/SubTitle';
import {InvoiceRowsFieldPaths, InvoiceRowsFieldTitles} from '$src/invoices/enums';
import {getContactFullName} from '$src/contacts/helpers';
import {getContentTenant} from '$src/leases/helpers';
import {getUiDataInvoiceKey} from '$src/uiData/helpers';
import {formatDate, getLabelOfOption, isFieldAllowedToRead} from '$util/helpers';

import type {Attributes} from '$src/types';

type Props = {
  invoiceAttributes: Attributes,
  invoiceDate: ?string,
  receivableTypeOptions: Array<Object>,
  relativeTo?: any,
  rows: Array<Object>,
}

const InvoiceRows = ({
  invoiceAttributes,
  invoiceDate,
  receivableTypeOptions,
  relativeTo,
  rows,
}: Props) => {
  return(
    <Row>
      <Column small={12}>
        <SubTitle enableUiDataEdit relativeTo={relativeTo} uiDataKey={getUiDataInvoiceKey(InvoiceRowsFieldPaths.ROWS)}>
          {InvoiceRowsFieldTitles.ROWS}
        </SubTitle>
        {!rows.length && <FormText>-</FormText>}
        {!!rows.length &&
          <BoxItemContainer>
            {rows.map((row) => {
              const contact = get(getContentTenant(row.tenantFull), 'contact');

              return (
                <BoxItem key={row.id} className='no-border-on-first-child no-border-on-last-child'>
                  <Row>
                    <Column small={4}>
                      <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceRowsFieldPaths.TENANT)}>
                        <FormTextTitle enableUiDataEdit relativeTo={relativeTo} uiDataKey={getUiDataInvoiceKey(InvoiceRowsFieldPaths.TENANT)}>
                          {InvoiceRowsFieldTitles.TENANT}
                        </FormTextTitle>
                        <FormText>{getContactFullName(contact) || '-'}</FormText>
                      </Authorization>
                    </Column>
                    <Column small={4}>
                      <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceRowsFieldPaths.RECEIVABLE_TYPE)}>
                        <FormTextTitle enableUiDataEdit relativeTo={relativeTo} uiDataKey={getUiDataInvoiceKey(InvoiceRowsFieldPaths.RECEIVABLE_TYPE)}>
                          {InvoiceRowsFieldTitles.RECEIVABLE_TYPE}
                        </FormTextTitle>
                        <FormText>{getLabelOfOption(receivableTypeOptions, row.receivable_type) || '-'}</FormText>
                      </Authorization>
                    </Column>
                    <Column small={4}>
                      <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceRowsFieldPaths.AMOUNT)}>
                        <FormTextTitle enableUiDataEdit relativeTo={relativeTo} uiDataKey={getUiDataInvoiceKey(InvoiceRowsFieldPaths.AMOUNT)}>
                          {InvoiceRowsFieldTitles.AMOUNT}
                        </FormTextTitle>
                        <FormText>{row.amount
                          ? <AmountWithVat amount={row.amount} date={invoiceDate} />
                          : '-'}
                        </FormText>
                      </Authorization>
                    </Column>
                    <Column small={4}>
                      <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceRowsFieldPaths.BILLING_PERIOD_START_DATE)}>
                        <FormTextTitle enableUiDataEdit relativeTo={relativeTo} uiDataKey={getUiDataInvoiceKey(InvoiceRowsFieldPaths.BILLING_PERIOD_START_DATE)}>
                          {InvoiceRowsFieldTitles.BILLING_PERIOD_START_DATE}
                        </FormTextTitle>
                        <FormText>{formatDate(row.billing_period_start_date) || '-'}</FormText>
                      </Authorization>
                    </Column>
                    <Column small={4}>
                      <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceRowsFieldPaths.BILLING_PERIOD_END_DATE)}>
                        <FormTextTitle enableUiDataEdit relativeTo={relativeTo} uiDataKey={getUiDataInvoiceKey(InvoiceRowsFieldPaths.BILLING_PERIOD_END_DATE)}>
                          {InvoiceRowsFieldTitles.BILLING_PERIOD_END_DATE}
                        </FormTextTitle>
                        <FormText>{formatDate(row.billing_period_end_date) || '-'}</FormText>
                      </Authorization>
                    </Column>
                    <Column small={4}>
                      <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceRowsFieldPaths.DESCRIPTION)}>
                        <FormTextTitle enableUiDataEdit relativeTo={relativeTo} uiDataKey={getUiDataInvoiceKey(InvoiceRowsFieldPaths.DESCRIPTION)}>
                          {InvoiceRowsFieldTitles.DESCRIPTION}
                        </FormTextTitle>
                        <FormText>{row.description || '-'}</FormText>
                      </Authorization>
                    </Column>
                  </Row>
                </BoxItem>
              );
            })}
          </BoxItemContainer>
        }
      </Column>
    </Row>
  );
};

export default InvoiceRows;
