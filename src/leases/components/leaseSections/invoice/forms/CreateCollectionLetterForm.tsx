import React, { ReactElement, useMemo } from "react";
import { useSelector } from "react-redux";
import { FieldArray, formValueSelector, reduxForm } from "redux-form";
import { Row, Column } from "react-foundation";
import isEmpty from "lodash/isEmpty";
import createUrl from "@/api/createUrl";
import AddButtonThird from "@/components/form/AddButtonThird";
import Authorization from "@/components/authorization/Authorization";
import CollectionLetterInvoiceRow from "./CollectionLetterInvoiceRow";
import CollectionLetterTotalRow from "./CollectionLetterTotalRow";
import Divider from "@/components/content/Divider";
import FileDownloadButton from "@/components/file/FileDownloadButton";
import FormFieldLegacy from "@/components/form/FormFieldLegacy";
import FormTextTitle from "@/components/form/FormTextTitle";
import SubTitle from "@/components/content/SubTitle";
import { FieldTypes, FormNames } from "@/enums";
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

type Props = {
  valid: boolean;
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

const CreateCollectionLetterForm: React.FC<Props> = ({ valid }) => {
  const createCollectionLetterAttributes = useSelector((state) =>
    getCreateCollectionLetterAttributes(state),
  );
  const invoices = useSelector((state) =>
    getInvoicesByLease(state, getCurrentLease(state).id),
  );
  const selectedInvoices = useSelector((state) => selector(state, "invoice"));
  const lease = useSelector(getCurrentLease);
  const template = useSelector((state) => selector(state, "template"));
  const tenants = useSelector((state) => selector(state, "tenants"));

  const invoiceOptions = useMemo(() => getInvoiceOptions(invoices), [invoices]);
  const tenantOptions = useMemo(() => getInvoiceTenantOptions(lease), [lease]);

  return (
    <form>
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
                <FormFieldLegacy
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
                <FormFieldLegacy
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
              <FieldArray
                selectedInvoices={selectedInvoices}
                disableDirty
                component={Invoices}
                invoiceOptions={invoiceOptions}
                name="invoice"
              />
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
              template: template,
              tenants: tenants,
              invoices: selectedInvoices?.map((invoice) => ({
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
  );
};

const formName = FormNames.LEASE_CREATE_COLLECTION_LETTER;
const selector = formValueSelector(formName);
export default reduxForm({
  form: formName,
  initialValues: {
    selectedInvoices: [{}],
  },
})(CreateCollectionLetterForm);
