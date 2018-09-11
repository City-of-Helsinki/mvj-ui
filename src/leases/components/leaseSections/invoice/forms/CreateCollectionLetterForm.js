// @flow
/* global API_URL */

import React from 'react';
import {connect} from 'react-redux';
import {FieldArray, formValueSelector, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';

import AddButtonThird from '$components/form/AddButtonThird';
import CollectionLetterTotalRow from './CollectionLetterTotalRow';
import Divider from '$components/content/Divider';
import DownloadDebtCollectionFileButton from '$components/file/DownloadDebtCollectionFileButton';
import FormField from '$components/form/FormField';
import FormFieldLabel from '$components/form/FormFieldLabel';
import CollectionLetterInvoiceRow from './CollectionLetterInvoiceRow';
import SubTitle from '$components/content/SubTitle';
import {InvoiceType} from '$src/invoices/enums';
import {FormNames} from '$src/leases/enums';
import {formatDate, formatDateRange, formatDecimalNumberForDb, sortStringByKeyDesc} from '$util/helpers';
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
      {!!fields && !!fields.length &&
        <Row>
          <Column small={4}>
            <FormFieldLabel required>Perittävä lasku</FormFieldLabel>
          </Column>
          <Column small={2}>
            <FormFieldLabel>Perittävä maksuerä</FormFieldLabel>
          </Column>
          <Column small={2}>
            <FormFieldLabel>Korko</FormFieldLabel>
          </Column>
          <Column small={2}>
            <FormFieldLabel>Perimispalkkio</FormFieldLabel>
          </Column>
          <Column small={2}>
            <FormFieldLabel>Yhteensä</FormFieldLabel>
          </Column>
        </Row>
      }
      {!!fields && !!fields.length && fields.map((invoice, index) => {
        const handleRemove = () => fields.remove(index);
        return (
          <CollectionLetterInvoiceRow
            key={index}
            field={invoice}
            fields={fields}
            invoiceOptions={invoiceOptions}
            onRemove={handleRemove}
            showDeleteButton={fields.length > 1}
          />
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
      <Row>
        <Column>
          <Divider className='invoice-divider' />
        </Column>
      </Row>
      <CollectionLetterTotalRow fields={fields} />
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

const CreateCollectionLetterForm = ({
  collectionCharge,
  invoices,
  invoiceIds,
  lease,
  tenantId,
  type,
  valid,
}: Props) => {
  const getInvoiceOptions = () => !isEmpty(invoices)
    ? invoices
      .filter((invoice) => invoice.type !== InvoiceType.CREDIT_NOTE && invoice.outstanding_amount > 0)
      .sort((a, b) => sortStringByKeyDesc(a, b, 'due_date'))
      .map((invoice) => {
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
        <Column small={12} medium={6}>
          <Row>
            <Column small={12} medium={4} large={4}>
              <FormField
                fieldAttributes={{
                  type: 'multiselect',
                  required: true,
                  label: 'Vuokralaiset',
                }}
                name='tenant_id'
                overrideValues={{
                  options: tenantOptions,
                }}
              />
            </Column>
            <Column small={12} medium={4} large={4}>
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
            <Column small={12} medium={4} large={4}>
              <FormField
                fieldAttributes={{
                  type: 'decimal',
                  required: false,
                  label: 'Perimispalkkio',
                }}
                name='collection_charge'
                unit='€'
              />
            </Column>
          </Row>
        </Column>
      </Row>
      <Row>
        <Column small={12}>
          <SubTitle>Perintälaskelma</SubTitle>
          <FieldArray
            component={renderInvoices}
            invoiceOptions={invoiceOptions}
            name='invoice_ids'
          />
        </Column>
        <Column small={12}>
          <div style={{paddingTop: 5, paddingBottom: 10, float: 'right'}}>
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
        </Column>
      </Row>
    </form>
  );
};

const formName = FormNames.CREATE_COLLECTION_LETTER;
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
)(CreateCollectionLetterForm);
