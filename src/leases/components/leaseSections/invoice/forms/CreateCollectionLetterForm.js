// @flow
/* global API_URL */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {FieldArray, formValueSelector, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';

import AddButtonThird from '$components/form/AddButtonThird';
import CollectionLetterInvoiceRow from './CollectionLetterInvoiceRow';
import CollectionLetterTotalRow from './CollectionLetterTotalRow';
import Divider from '$components/content/Divider';
import FileDownloadButton from '$components/file/FileDownloadButton';
import FormField from '$components/form/FormField';
import FormTextTitle from '$components/form/FormTextTitle';
import SubTitle from '$components/content/SubTitle';
import {InvoiceType} from '$src/invoices/enums';
import {FormNames} from '$src/leases/enums';
import {getCollectionLetterTemplateOptions} from '$src/collectionLetterTemplate/helpers';
import {convertStrToDecimalNumber, formatDate, formatDateRange, sortStringByKeyDesc} from '$util/helpers';
import {getInvoiceTenantOptions} from '$src/leases/helpers';
import {getCollectionLetterTemplates} from '$src/collectionLetterTemplate/selectors';
import {getInvoicesByLease} from '$src/invoices/selectors';
import {getCurrentLease} from '$src/leases/selectors';

import type {CollectionLetterTemplates} from '$src/collectionLetterTemplate/types';
import type {Lease} from '$src/leases/types';

type InvoicesProps = {
  collectionCharge: number,
  disableDirty?: boolean,
  fields: any,
  invoiceOptions: Array<Object>,
}

const renderInvoices = ({
  collectionCharge,
  disableDirty = false,
  fields,
  invoiceOptions,
}: InvoicesProps) => {
  const handleAdd = () => fields.push({});

  return(
    <div>
      {!!fields && !!fields.length &&
        <Row>
          <Column small={4}>
            <FormTextTitle required title='Perittävä lasku' />
          </Column>
          <Column small={2}>
            <FormTextTitle title='Perittävä maksuerä' />
          </Column>
          <Column small={2}>
            <FormTextTitle title='Korko' />
          </Column>
          <Column small={2}>
            <FormTextTitle title='Perimispalkkio' />
          </Column>
          <Column small={2}>
            <FormTextTitle title='Yhteensä' />
          </Column>
        </Row>
      }
      {!!fields && !!fields.length && fields.map((invoice, index) => {
        const handleRemove = () => fields.remove(index);
        return (
          <CollectionLetterInvoiceRow
            collectionCharge={collectionCharge}
            disableDirty={disableDirty}
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
          />
        </Column>
      </Row>
      <Row>
        <Column>
          <Divider className='invoice-divider' />
        </Column>
      </Row>
      <CollectionLetterTotalRow collectionCharge={collectionCharge} fields={fields} />
    </div>
  );
};

type Props = {
  collectionCharge: number,
  collectionLetterTemplates: CollectionLetterTemplates,
  invoices: Array<Object>,
  invoiceIds: Array<number>,
  lease: Lease,
  template: string,
  tenants: Array<number>,
  valid: boolean,
}

type State = {
  collectionLetterTemplates: CollectionLetterTemplates,
  collectionLetterTemplateOptions: Array<Object>,
  invoices: Array<Object>,
  invoiceOptions: Array<Object>,
  lease: Lease,
  tenantOptions: Array<Object>,
}

const getInvoiceOptions = (invoices: Array<Object>) => !isEmpty(invoices)
  ? invoices
    .filter((invoice) => invoice.type !== InvoiceType.CREDIT_NOTE && invoice.outstanding_amount > 0)
    .sort((a, b) => sortStringByKeyDesc(a, b, 'due_date'))
    .map((invoice) => {
      return {
        value: invoice.id,
        label: `${formatDateRange(invoice.billing_period_start_date, invoice.billing_period_end_date)}\t${formatDate(invoice.due_date)} (${invoice.id})`.trim(),
      };
    })
  : [];

class CreateCollectionLetterForm extends Component<Props, State> {
  state = {
    collectionLetterTemplates: [],
    collectionLetterTemplateOptions: [],
    invoices: [],
    invoiceOptions: [],
    lease: {},
    tenantOptions: [],
  }

  static getDerivedStateFromProps(props: Props, state: State)  {
    const newState = {};

    if(props.invoices && props.invoices !== state.invoices) {
      newState.invoices = props.invoices;
      newState.invoiceOptions = getInvoiceOptions(props.invoices);
    }
    if(props.lease && props.lease !== state.lease) {
      newState.lease = props.lease;
      newState.tenantOptions = getInvoiceTenantOptions(props.lease);
    }
    if(props.collectionLetterTemplates && props.collectionLetterTemplates !== state.collectionLetterTemplates) {
      newState.collectionLetterTemplate = props.collectionLetterTemplates;
      newState.collectionLetterTemplateOptions = getCollectionLetterTemplateOptions(props.collectionLetterTemplates);
    }
    return newState;
  }

  render() {
    const {
      collectionCharge,
      invoiceIds,
      lease,
      template,
      tenants,
      valid,
    } = this.props;
    const {
      collectionLetterTemplateOptions,
      invoiceOptions,
      tenantOptions,
    } = this.state;
    return(
      <form>
        <Row>
          <Column small={12} large={6}>
            <Row>
              <Column small={12} medium={4}>
                <FormField
                  disableDirty
                  fieldAttributes={{
                    type: 'multiselect',
                    required: true,
                    label: 'Vuokralaiset',
                  }}
                  name='tenants'
                  overrideValues={{
                    options: tenantOptions,
                  }}
                />
              </Column>
              <Column small={12} medium={4}>
                <FormField
                  disableDirty
                  fieldAttributes={{
                    type: 'choice',
                    required: true,
                    label: 'Maksuvaatimustyyppi',
                  }}
                  name='template'
                  overrideValues={{
                    options: collectionLetterTemplateOptions,
                  }}
                />
              </Column>
              <Column small={12} medium={4}>
                <FormField
                  disableDirty
                  fieldAttributes={{
                    type: 'decimal',
                    required: true,
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
              disableDirty
              collectionCharge={collectionCharge}
              component={renderInvoices}
              invoiceOptions={invoiceOptions}
              name='invoice_ids'
            />
          </Column>
          <Column small={12} style={{margin: '10px 0'}}>
            <FileDownloadButton
              disabled={!valid}
              label='Luo perintäkirje'
              payload={{
                template: template,
                collection_charge: convertStrToDecimalNumber(collectionCharge),
                tenants: tenants,
                invoices: invoiceIds,
              }}
              // $FlowFixMe
              url={`${API_URL}/lease/${lease.id}/create_collection_letter/`}
            />
          </Column>
        </Row>
      </form>
    );
  }
}

const formName = FormNames.CREATE_COLLECTION_LETTER;
const selector = formValueSelector(formName);

export default flowRight(
  connect(
    (state) => {
      const currentLease = getCurrentLease(state);
      return {
        collectionCharge: selector(state, 'collection_charge'),
        collectionLetterTemplates: getCollectionLetterTemplates(state),
        invoices: getInvoicesByLease(state, currentLease.id),
        invoiceIds: selector(state, 'invoice_ids'),
        lease: getCurrentLease(state),
        template: selector(state, 'template'),
        tenants: selector(state, 'tenants'),
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
