import React, { Fragment, PureComponent, ReactElement } from "react";
import { connect } from "react-redux";
import { FieldArray, formValueSelector, reduxForm } from "redux-form";
import { Row, Column } from "react-foundation";
import flowRight from "lodash/flowRight";
import isEmpty from "lodash/isEmpty";
import createUrl from "@/api/createUrl";
import AddButtonThird from "@/components/form/AddButtonThird";
import Authorization from "@/components/authorization/Authorization";
import CollectionLetterInvoiceRow from "./CollectionLetterInvoiceRow";
import CollectionLetterTotalRow from "./CollectionLetterTotalRow";
import Divider from "@/components/content/Divider";
import FileDownloadButton from "@/components/file/FileDownloadButton";
import FormField from "@/components/form/FormField";
import FormTextTitle from "@/components/form/FormTextTitle";
import SubTitle from "@/components/content/SubTitle";
import { FieldTypes, FormNames } from "@/enums";
import { CreateCollectionLetterFieldPaths, CreateCollectionLetterFieldTitles } from "@/createCollectionLetter/enums";
import { InvoiceType } from "@/invoices/enums";
import { PenaltyInterestFieldPaths, PenaltyInterestFieldTitles } from "@/penaltyInterest/enums";
import { getInvoiceTenantOptions } from "@/leases/helpers";
import { getUiDataCreateCollectionLetterKey, getUiDataPenaltyInterestKey } from "@/uiData/helpers";
import { convertStrToDecimalNumber, formatDate, formatDateRange, getFieldAttributes, isFieldAllowedToEdit, sortStringByKeyDesc } from "@/util/helpers";
import { getAttributes as getCreateCollectionLetterAttributes } from "@/createCollectionLetter/selectors";
import { getInvoicesByLease } from "@/invoices/selectors";
import { getCurrentLease } from "@/leases/selectors";
import type { Attributes } from "types";
import type { Lease } from "@/leases/types";
type InvoicesProps = {
  disableDirty?: boolean;
  fields: any;
  selectedInvoices: Array<Record<string, any>>;
  invoiceOptions: Array<Record<string, any>>;
};

const renderInvoices = ({
  disableDirty = false,
  fields,
  selectedInvoices,
  invoiceOptions
}: InvoicesProps): ReactElement => {
  const handleAdd = () => {
    fields.push({});
  };

  return <Fragment>
      {!!fields && !!fields.length && <Row>
          <Column small={4}>
            <FormTextTitle required enableUiDataEdit uiDataKey={getUiDataPenaltyInterestKey(PenaltyInterestFieldPaths.INVOICE)}>
              {PenaltyInterestFieldTitles.INVOICE}
            </FormTextTitle>
          </Column>
          <Column small={2}>
            <FormTextTitle enableUiDataEdit uiDataKey={getUiDataPenaltyInterestKey(PenaltyInterestFieldPaths.OUTSTANDING_AMOUNT)}>
              {PenaltyInterestFieldTitles.OUTSTANDING_AMOUNT}
            </FormTextTitle>
          </Column>
          <Column small={2}>
            <FormTextTitle enableUiDataEdit uiDataKey={getUiDataPenaltyInterestKey(PenaltyInterestFieldPaths.TOTAL_INTEREST_AMOUNT)}>
              {PenaltyInterestFieldTitles.TOTAL_INTEREST_AMOUNT}
            </FormTextTitle>
          </Column>
          <Column small={2}>
            <FormTextTitle enableUiDataEdit uiDataKey={getUiDataPenaltyInterestKey(PenaltyInterestFieldPaths.COLLECTION_CHARGE)}>
              {PenaltyInterestFieldTitles.COLLECTION_CHARGE}
            </FormTextTitle>
          </Column>
          <Column small={2}>
            <FormTextTitle enableUiDataEdit tooltipStyle={{
          right: fields.length > 1 ? 20 : 0
        }} uiDataKey={getUiDataPenaltyInterestKey(PenaltyInterestFieldPaths.TOTAL)}>
              {PenaltyInterestFieldTitles.TOTAL}
            </FormTextTitle>
          </Column>
        </Row>}
      {!!fields && !!fields.length && fields.map((invoice, index) => {
      const handleRemove = () => fields.remove(index);

      return <CollectionLetterInvoiceRow disableDirty={disableDirty} key={index} field={invoice} fields={fields} invoiceOptions={invoiceOptions} onRemove={handleRemove} showDeleteButton={fields.length > 1} />;
    })}
      <Row>
        <Column>
          <AddButtonThird label='Lisää lasku' onClick={handleAdd} />
        </Column>
      </Row>
      <Row>
        <Column>
          <Divider className='invoice-divider' />
        </Column>
      </Row>
      <CollectionLetterTotalRow fields={fields} selectedInvoices={selectedInvoices} />
    </Fragment>;
};

type OwnProps = {};
type Props = OwnProps & {
  createCollectionLetterAttributes: Attributes;
  invoices: Array<Record<string, any>>;
  selectedInvoices: Array<Record<string, any>>;
  lease: Lease;
  template: string;
  tenants: Array<number>;
  valid: boolean;
};
type State = {
  invoices: Array<Record<string, any>>;
  invoiceOptions: Array<Record<string, any>>;
  lease: Lease;
  tenantOptions: Array<Record<string, any>>;
};

const getInvoiceOptions = (invoices: Array<Record<string, any>>) => !isEmpty(invoices) ? invoices.filter(invoice => invoice.type !== InvoiceType.CREDIT_NOTE && invoice.outstanding_amount > 0).sort((a, b) => sortStringByKeyDesc(a, b, 'due_date')).map(invoice => {
  return {
    value: invoice.id,
    label: `${formatDateRange(invoice.billing_period_start_date, invoice.billing_period_end_date)}\t${formatDate(invoice.due_date) || ''} (${invoice.number || '-'})`.trim()
  };
}) : [];

class CreateCollectionLetterForm extends PureComponent<Props, State> {
  state = {
    invoices: [],
    invoiceOptions: [],
    lease: {},
    tenantOptions: []
  };

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState: any = {};

    if (props.invoices && props.invoices !== state.invoices) {
      newState.invoices = props.invoices;
      newState.invoiceOptions = getInvoiceOptions(props.invoices);
    }

    if (props.lease && props.lease !== state.lease) {
      newState.lease = props.lease;
      newState.tenantOptions = getInvoiceTenantOptions(props.lease);
    }

    return newState;
  }

  render() {
    const {
      createCollectionLetterAttributes,
      selectedInvoices,
      lease,
      template,
      tenants,
      valid
    } = this.props;
    const {
      invoiceOptions,
      tenantOptions
    } = this.state;
    return <form>
        <Row>
          <Column small={12} large={6}>
            <Row>
              <Column small={12} medium={4}>
                <Authorization allow={isFieldAllowedToEdit(createCollectionLetterAttributes, CreateCollectionLetterFieldPaths.TENANTS)}>
                  <FormField disableDirty fieldAttributes={getFieldAttributes(createCollectionLetterAttributes, CreateCollectionLetterFieldPaths.TENANTS)} name='tenants' overrideValues={{
                  fieldType: FieldTypes.MULTISELECT,
                  label: CreateCollectionLetterFieldTitles.TENANTS,
                  options: tenantOptions
                }} enableUiDataEdit uiDataKey={getUiDataCreateCollectionLetterKey(CreateCollectionLetterFieldPaths.TENANTS)} />
                </Authorization>
              </Column>
              <Column small={12} medium={4}>
                <Authorization allow={isFieldAllowedToEdit(createCollectionLetterAttributes, CreateCollectionLetterFieldPaths.TEMPLATE)}>
                  <FormField disableDirty fieldAttributes={getFieldAttributes(createCollectionLetterAttributes, CreateCollectionLetterFieldPaths.TEMPLATE)} name='template' overrideValues={{
                  label: CreateCollectionLetterFieldTitles.TEMPLATE
                }} enableUiDataEdit uiDataKey={getUiDataCreateCollectionLetterKey(CreateCollectionLetterFieldPaths.TEMPLATE)} />
                </Authorization>
              </Column>
            </Row>
          </Column>
        </Row>

        <Row>
          <Column small={12}>
            <Authorization allow={isFieldAllowedToEdit(createCollectionLetterAttributes, CreateCollectionLetterFieldPaths.INVOICES)}>
              <SubTitle enableUiDataEdit uiDataKey={getUiDataCreateCollectionLetterKey(CreateCollectionLetterFieldPaths.INVOICES)}>
                {CreateCollectionLetterFieldTitles.INVOICES}
              </SubTitle>
              <FieldArray selectedInvoices={selectedInvoices} disableDirty component={renderInvoices} invoiceOptions={invoiceOptions} name='invoice' />
            </Authorization>
          </Column>
          <Column small={12} style={{
          margin: '10px 0'
        }}>
            <FileDownloadButton disabled={!valid} label='Luo perintäkirje' payload={{
            lease: lease.id,
            template: template,
            tenants: tenants,
            invoices: selectedInvoices?.map(invoice => ({ ...invoice,
              collection_charge: convertStrToDecimalNumber(invoice.collection_charge)
            }))
          }} url={createUrl(`lease_create_collection_letter/`)} />
          </Column>
        </Row>
      </form>;
  }

}

const formName = FormNames.LEASE_CREATE_COLLECTION_LETTER;
const selector = formValueSelector(formName);
export default (flowRight(connect(state => {
  const currentLease = getCurrentLease(state);
  return {
    createCollectionLetterAttributes: getCreateCollectionLetterAttributes(state),
    invoices: getInvoicesByLease(state, currentLease.id),
    selectedInvoices: selector(state, 'invoice'),
    lease: getCurrentLease(state),
    template: selector(state, 'template'),
    tenants: selector(state, 'tenants')
  };
}), reduxForm({
  form: formName,
  initialValues: {
    selectedInvoices: [{}]
  }
}))(CreateCollectionLetterForm) as React.ComponentType<OwnProps>);