// @flow
import React, {Fragment, PureComponent} from 'react';
import {connect} from 'react-redux';
import {FieldArray, formValueSelector, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';
import type {Element} from 'react';

import createUrl from '$src/api/createUrl';
import AddButtonThird from '$components/form/AddButtonThird';
import Authorization from '$components/authorization/Authorization';
import CollectionLetterInvoiceRow from './CollectionLetterInvoiceRow';
import CollectionLetterTotalRow from './CollectionLetterTotalRow';
import Divider from '$components/content/Divider';
import FileDownloadButton from '$components/file/FileDownloadButton';
import FormField from '$components/form/FormField';
import FormTextTitle from '$components/form/FormTextTitle';
import SubTitle from '$components/content/SubTitle';
import {FieldTypes} from '$components/enums';
import {
  CreateCollectionLetterFieldPaths,
  CreateCollectionLetterFieldTitles,
} from '$src/createCollectionLetter/enums';
import {InvoiceType} from '$src/invoices/enums';
import {FormNames} from '$src/leases/enums';
import {
  convertStrToDecimalNumber,
  formatDate,
  formatDateRange,
  getFieldAttributes,
  isFieldAllowedToEdit,
  sortStringByKeyDesc,
} from '$util/helpers';
import {getInvoiceTenantOptions} from '$src/leases/helpers';
import {
  getAttributes as getCreateCollectionLetterAttributes,
} from '$src/createCollectionLetter/selectors';
import {getInvoicesByLease} from '$src/invoices/selectors';
import {getCurrentLease} from '$src/leases/selectors';

import type {Attributes} from '$src/types';
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
}: InvoicesProps): Element<*> => {
  const handleAdd = () => {
    fields.push({});
  };

  return(
    <Fragment>
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
    </Fragment>
  );
};

type Props = {
  collectionCharge: number,
  createCollectionLetterAttributes: Attributes,
  invoices: Array<Object>,
  invoiceIds: Array<number>,
  lease: Lease,
  template: string,
  tenants: Array<number>,
  valid: boolean,
}

type State = {
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
        label: `${formatDateRange(invoice.billing_period_start_date, invoice.billing_period_end_date)}\t${formatDate(invoice.due_date) || ''} (${invoice.number || '-'})`.trim(),
      };
    })
  : [];

class CreateCollectionLetterForm extends PureComponent<Props, State> {
  state = {
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

    return newState;
  }

  render() {
    const {
      collectionCharge,
      createCollectionLetterAttributes,
      invoiceIds,
      lease,
      template,
      tenants,
      valid,
    } = this.props;
    const {
      invoiceOptions,
      tenantOptions,
    } = this.state;
    return(
      <form>
        <Row>
          <Column small={12} large={6}>
            <Row>
              <Column small={12} medium={4}>
                <Authorization allow={isFieldAllowedToEdit(createCollectionLetterAttributes, CreateCollectionLetterFieldPaths.TENANTS)}>
                  <FormField
                    disableDirty
                    fieldAttributes={getFieldAttributes(createCollectionLetterAttributes, CreateCollectionLetterFieldPaths.TENANTS)}
                    name='tenants'
                    overrideValues={{
                      fieldType: FieldTypes.MULTISELECT,
                      label: CreateCollectionLetterFieldTitles.TENANTS,
                      options: tenantOptions}}
                  />
                </Authorization>
              </Column>
              <Column small={12} medium={4}>
                <Authorization allow={isFieldAllowedToEdit(createCollectionLetterAttributes, CreateCollectionLetterFieldPaths.TEMPLATE)}>
                  <FormField
                    disableDirty
                    fieldAttributes={getFieldAttributes(createCollectionLetterAttributes, CreateCollectionLetterFieldPaths.TEMPLATE)}
                    name='template'
                    overrideValues={{
                      label: CreateCollectionLetterFieldTitles.TEMPLATE,
                    }}
                  />
                </Authorization>
              </Column>
              <Column small={12} medium={4}>
                <Authorization allow={isFieldAllowedToEdit(createCollectionLetterAttributes, CreateCollectionLetterFieldPaths.COLLECTION_CHARGE)}>
                  <FormField
                    disableDirty
                    fieldAttributes={getFieldAttributes(createCollectionLetterAttributes, CreateCollectionLetterFieldPaths.COLLECTION_CHARGE)}
                    name='collection_charge'
                    unit='€'
                    overrideValues={{label: CreateCollectionLetterFieldTitles.COLLECTION_CHARGE}}
                  />
                </Authorization>
              </Column>
            </Row>
          </Column>
        </Row>

        <Row>
          <Column small={12}>
            <Authorization allow={isFieldAllowedToEdit(createCollectionLetterAttributes, CreateCollectionLetterFieldPaths.INVOICES)}>
              <SubTitle>{CreateCollectionLetterFieldTitles.INVOICES}</SubTitle>
              <FieldArray
                disableDirty
                collectionCharge={collectionCharge}
                component={renderInvoices}
                invoiceOptions={invoiceOptions}
                name='invoice_ids'
              />
            </Authorization>
          </Column>
          <Column small={12} style={{margin: '10px 0'}}>
            <FileDownloadButton
              disabled={!valid}
              label='Luo perintäkirje'
              payload={{
                lease: lease.id,
                template: template,
                collection_charge: convertStrToDecimalNumber(collectionCharge),
                tenants: tenants,
                invoices: invoiceIds,
              }}
              url={createUrl(`lease_create_collection_letter/`)}
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
        createCollectionLetterAttributes: getCreateCollectionLetterAttributes(state),
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
