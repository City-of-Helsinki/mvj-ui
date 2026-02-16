import React, { ReactElement, useMemo } from "react";
import arrayMutators from "final-form-arrays";
import { useSelector } from "react-redux";
import { FieldArray } from "react-final-form-arrays";
import { Form } from "react-final-form";
import { Row, Column } from "react-foundation";
import isEmpty from "lodash/isEmpty";
import createUrl from "@/api/createUrl";
import AddButtonThird from "@/components/form/AddButtonThird";
import Authorization from "@/components/authorization/Authorization";
import CollectionLetterInvoiceRow from "./CollectionLetterInvoiceRow";
import CollectionLetterTotalRow from "./CollectionLetterTotalRow";
import Divider from "@/components/content/Divider";
import FileDownloadButton from "@/components/file/FileDownloadButton";
import FormField from "@/components/form/final-form/FormField";
import FormTextTitle from "@/components/form/FormTextTitle";
import SubTitle from "@/components/content/SubTitle";
import { FieldTypes } from "@/enums";
import {
  CreateCollectionLetterFieldPaths,
  CreateCollectionLetterFieldTitles,
} from "@/createCollectionLetter/enums";
import { InvoiceType } from "@/invoices/enums";
import {
  PenaltyInterestFieldPaths,
  PenaltyInterestFieldTitles,
} from "@/penaltyInterest/enums";
import { getInvoiceTenantOptions } from "@/leases/helpers";
import {
  getUiDataCreateCollectionLetterKey,
  getUiDataPenaltyInterestKey,
} from "@/uiData/helpers";
import {
  convertStrToDecimalNumber,
  formatDate,
  formatDateRange,
  getFieldAttributes,
  isFieldAllowedToEdit,
  sortStringByKeyDesc,
} from "@/util/helpers";
import { getAttributes as getCreateCollectionLetterAttributes } from "@/createCollectionLetter/selectors";
import { getInvoicesByLease } from "@/invoices/selectors";
import { getCurrentLease } from "@/leases/selectors";
type InvoicesProps = {
  disableDirty?: boolean;
  fields: any;
  selectedInvoices: Array<Record<string, any>>;
  invoiceOptions: Array<Record<string, any>>;
};

const Invoices = ({
  disableDirty = false,
  fields,
  selectedInvoices,
  invoiceOptions,
}: InvoicesProps): ReactElement => {
  const handleAdd = () => {
    fields.push({});
  };

  return (
    <>
      {!!fields && !!fields.length && (
        <Row>
          <Column small={4}>
            <FormTextTitle
              required
              enableUiDataEdit
              uiDataKey={getUiDataPenaltyInterestKey(
                PenaltyInterestFieldPaths.INVOICE,
              )}
            >
              {PenaltyInterestFieldTitles.INVOICE}
            </FormTextTitle>
          </Column>
          <Column small={2}>
            <FormTextTitle
              enableUiDataEdit
              uiDataKey={getUiDataPenaltyInterestKey(
                PenaltyInterestFieldPaths.OUTSTANDING_AMOUNT,
              )}
            >
              {PenaltyInterestFieldTitles.OUTSTANDING_AMOUNT}
            </FormTextTitle>
          </Column>
          <Column small={2}>
            <FormTextTitle
              enableUiDataEdit
              uiDataKey={getUiDataPenaltyInterestKey(
                PenaltyInterestFieldPaths.TOTAL_INTEREST_AMOUNT,
              )}
            >
              {PenaltyInterestFieldTitles.TOTAL_INTEREST_AMOUNT}
            </FormTextTitle>
          </Column>
          <Column small={2}>
            <FormTextTitle
              enableUiDataEdit
              uiDataKey={getUiDataPenaltyInterestKey(
                PenaltyInterestFieldPaths.COLLECTION_CHARGE,
              )}
            >
              {PenaltyInterestFieldTitles.COLLECTION_CHARGE}
            </FormTextTitle>
          </Column>
          <Column small={2}>
            <FormTextTitle
              enableUiDataEdit
              tooltipStyle={{
                right: fields.length > 1 ? 20 : 0,
              }}
              uiDataKey={getUiDataPenaltyInterestKey(
                PenaltyInterestFieldPaths.TOTAL,
              )}
            >
              {PenaltyInterestFieldTitles.TOTAL}
            </FormTextTitle>
          </Column>
        </Row>
      )}
      {!!fields &&
        !!fields.length &&
        fields.map((invoice, index) => {
          const handleRemove = () => fields.remove(index);

          return (
            <CollectionLetterInvoiceRow
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
          <AddButtonThird label="Lisää lasku" onClick={handleAdd} />
        </Column>
      </Row>
      <Row>
        <Column>
          <Divider className="invoice-divider" />
        </Column>
      </Row>
      <CollectionLetterTotalRow
        fields={fields}
        selectedInvoices={selectedInvoices}
      />
    </>
  );
};

const getInvoiceOptions = (invoices: Array<Record<string, any>>) =>
  !isEmpty(invoices)
    ? invoices
        .filter(
          (invoice) =>
            invoice.type !== InvoiceType.CREDIT_NOTE &&
            invoice.outstanding_amount > 0,
        )
        .sort((a, b) => sortStringByKeyDesc(a, b, "due_date"))
        .map((invoice) => {
          return {
            value: invoice.id,
            label:
              `${formatDateRange(invoice.billing_period_start_date, invoice.billing_period_end_date)}\t${formatDate(invoice.due_date) || ""} (${invoice.number || "-"})`.trim(),
          };
        })
    : [];

const CreateCollectionLetterForm: React.FC = () => {
  const createCollectionLetterAttributes = useSelector(
    getCreateCollectionLetterAttributes,
  );
  const invoices = useSelector((state) =>
    getInvoicesByLease(state, getCurrentLease(state).id),
  );
  const lease = useSelector(getCurrentLease);

  const invoiceOptions = useMemo(() => getInvoiceOptions(invoices), [invoices]);
  const tenantOptions = useMemo(() => getInvoiceTenantOptions(lease), [lease]);

  return (
    <Form onSubmit={() => {}} mutators={{ ...arrayMutators }}>
      {({ handleSubmit, valid, values }) => (
        <form onSubmit={handleSubmit}>
          <Row>
            <Column small={12} large={6}>
              <Row>
                <Column small={12} medium={4}>
                  <Authorization
                    allow={isFieldAllowedToEdit(
                      createCollectionLetterAttributes,
                      CreateCollectionLetterFieldPaths.TENANTS,
                    )}
                  >
                    <FormField
                      disableDirty
                      fieldAttributes={getFieldAttributes(
                        createCollectionLetterAttributes,
                        CreateCollectionLetterFieldPaths.TENANTS,
                      )}
                      name="tenants"
                      overrideValues={{
                        fieldType: FieldTypes.MULTISELECT,
                        label: CreateCollectionLetterFieldTitles.TENANTS,
                        options: tenantOptions,
                      }}
                      enableUiDataEdit
                      uiDataKey={getUiDataCreateCollectionLetterKey(
                        CreateCollectionLetterFieldPaths.TENANTS,
                      )}
                    />
                  </Authorization>
                </Column>
                <Column small={12} medium={4}>
                  <Authorization
                    allow={isFieldAllowedToEdit(
                      createCollectionLetterAttributes,
                      CreateCollectionLetterFieldPaths.TEMPLATE,
                    )}
                  >
                    <FormField
                      disableDirty
                      fieldAttributes={getFieldAttributes(
                        createCollectionLetterAttributes,
                        CreateCollectionLetterFieldPaths.TEMPLATE,
                      )}
                      name="template"
                      overrideValues={{
                        label: CreateCollectionLetterFieldTitles.TEMPLATE,
                      }}
                      enableUiDataEdit
                      uiDataKey={getUiDataCreateCollectionLetterKey(
                        CreateCollectionLetterFieldPaths.TEMPLATE,
                      )}
                    />
                  </Authorization>
                </Column>
              </Row>
            </Column>
          </Row>

          <Row>
            <Column small={12}>
              <Authorization
                allow={isFieldAllowedToEdit(
                  createCollectionLetterAttributes,
                  CreateCollectionLetterFieldPaths.INVOICES,
                )}
              >
                <>
                  <SubTitle
                    enableUiDataEdit
                    uiDataKey={getUiDataCreateCollectionLetterKey(
                      CreateCollectionLetterFieldPaths.INVOICES,
                    )}
                  >
                    {CreateCollectionLetterFieldTitles.INVOICES}
                  </SubTitle>
                  <FieldArray name="invoice">
                    {(FieldArrayProps) =>
                      Invoices({
                        ...FieldArrayProps,
                        selectedInvoices: values.invoice,
                        invoiceOptions: invoiceOptions,
                        disableDirty: true,
                      })
                    }
                  </FieldArray>
                </>
              </Authorization>
            </Column>
            <Column
              small={12}
              style={{
                margin: "10px 0",
              }}
            >
              <FileDownloadButton
                disabled={!valid}
                label="Luo perintäkirje"
                payload={{
                  lease: lease.id,
                  template: values.template,
                  tenants: values.tenants,
                  invoices: values.invoice?.map((invoice) => ({
                    ...invoice,
                    collection_charge: convertStrToDecimalNumber(
                      invoice.collection_charge,
                    ),
                  })),
                }}
                url={createUrl(`lease_create_collection_letter/`)}
              />
            </Column>
          </Row>
        </form>
      )}
    </Form>
  );
};

export default CreateCollectionLetterForm;
