// @flow
/* global API_URL */

import React from 'react';
import {connect} from 'react-redux';
import {FieldArray, formValueSelector, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';

import AddButtonThird from '$components/form/AddButtonThird';
import DownloadDebtCollectionFileButton from '$components/file/DownloadDebtCollectionFileButton';
import FormField from '$components/form/FormField';
import RemoveButton from '$components/form/RemoveButton';
import SubTitle from '$components/content/SubTitle';
import {FormNames} from '$src/leases/enums';
import {formatDate, formatDateRange, formatDecimalNumberForDb} from '$util/helpers';
import {getInvoiceTenantOptions} from '$src/leases/helpers';
import {getInvoicesByLease} from '$src/invoices/selectors';
import {getCurrentLease} from '$src/leases/selectors';

import type {Lease} from '$src/leases/types';

type InvoicesProps = {
  fields: any,
  invoiceOptions: Array<Object>,
}

const renderInvoices = ({
  fields,
  invoiceOptions,
}: InvoicesProps) => {
  const handleAdd = () => fields.push({});
  return(
    <div>
      {!!fields && !!fields.length && fields.map((row, index) => {
        const handleRemove = () => fields.remove(index);

        return (
          <Row key={index}>
            <Column small={6} medium={8} large={4}>
              <FormField
                fieldAttributes={{
                  type: 'choice',
                  required: true,
                  label: '',
                }}
                name={row}
                overrideValues={{
                  options: invoiceOptions,
                }}
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              {fields.length > 1 &&
                <RemoveButton
                  className='third-level'
                  onClick={handleRemove}
                  title="Poista rivi"
                />
              }
            </Column>
          </Row>
        );
      })}
      <Row>
        <Column>
          <AddButtonThird
            label='Lisää lasku'
            onClick={handleAdd}
            title='Lisää lasku'
          />
        </Column>
      </Row>
    </div>
  );
};

type Props = {
  collectionCharge: number,
  invoices: Array<Object>,
  invoiceIds: Array<number>,
  lease: Lease,
  tenantId: number,
  type: string,
  valid: boolean,
}

const DebtCollectionForm = ({
  collectionCharge,
  invoices,
  invoiceIds,
  lease,
  tenantId,
  type,
  valid,
}: Props) => {
  const getInvoiceOptions = () => !isEmpty(invoices)
    ? invoices.map((invoice) => {
      return {
        value: invoice.id,
        label: `${formatDateRange(invoice.billing_period_start_date, invoice.billing_period_end_date)}\t${formatDate(invoice.due_date)}`.trim(),
      };
    })
    : [];

  const tenantOptions = getInvoiceTenantOptions(lease);
  const typeOptions = [
    {value: 'oikeudenkäyntiuhka', label: 'Oikeudenkäyntiuhka'},
    {value: 'irtisanomis- ja oikeudenkäyntiuhka', label: 'Irtisanomis- ja oikeudenkäyntiuhka'},
    {value: 'purku-uhka', label: 'Purku-uhka'},
  ];
  const invoiceOptions = getInvoiceOptions();

  return(
    <form>
      <Row>
        <Column small={12} medium={4} large={2}>
          <FormField
            fieldAttributes={{
              type: 'choice',
              required: true,
              label: 'Vuokralainen',
            }}
            name='tenant_id'
            overrideValues={{
              options: tenantOptions,
            }}
          />
        </Column>
        <Column small={12} medium={4} large={2}>
          <FormField
            fieldAttributes={{
              type: 'choice',
              required: true,
              label: 'Maksuvaatimustyyppi',
            }}
            name='type'
            overrideValues={{
              options: typeOptions,
            }}
          />
        </Column>
        <Column small={12} medium={4} large={2}>
          <FormField
            fieldAttributes={{
              type: 'decimal',
              required: false,
              label: 'Perintäkulut',
            }}
            name='collection_charge'
          />
        </Column>
      </Row>
      <SubTitle>Laskut</SubTitle>
      <FieldArray
        component={renderInvoices}
        invoiceOptions={invoiceOptions}
        name='invoice_ids'
      />
      <div style={{marginBottom: 10, marginTop: 10}}>
        <DownloadDebtCollectionFileButton
          disabled={!valid}
          label='Luo perintäkirje'
          payload={{
            type: type,
            collection_charge: formatDecimalNumberForDb(collectionCharge),
            tenant_id: tenantId,
            invoice_ids: invoiceIds,
          }}
          // $FlowFixMe
          url={`${API_URL}/lease/${lease.id}/create_collection_letter/`}
        />
      </div>
    </form>
  );
};

const formName = FormNames.DEBT_COLLECTION;
const selector = formValueSelector(formName);

export default flowRight(
  connect(
    (state) => {
      const currentLease = getCurrentLease(state);
      return {
        collectionCharge: selector(state, 'collection_charge'),
        invoices: getInvoicesByLease(state, currentLease.id),
        invoiceIds: selector(state, 'invoice_ids'),
        lease: getCurrentLease(state),
        tenantId: selector(state, 'tenant_id'),
        type: selector(state, 'type'),
      };
    }
  ),
  reduxForm({
    form: formName,
    initialValues: {
      invoice_ids: [{}],
    },
  }),
)(DebtCollectionForm);
