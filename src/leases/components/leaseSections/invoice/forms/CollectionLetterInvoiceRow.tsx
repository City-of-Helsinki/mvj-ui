import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formValueSelector } from "redux-form";
import { Row, Column } from "react-foundation";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import FieldAndRemoveButtonWrapper from "@/components/form/FieldAndRemoveButtonWrapper";
import FormFieldLegacy from "@/components/form/FormFieldLegacy";
import FormText from "@/components/form/FormText";
import Loader from "@/components/loader/Loader";
import LoaderWrapper from "@/components/loader/LoaderWrapper";
import RemoveButton from "@/components/form/RemoveButton";
import { fetchPenaltyInterestByInvoice } from "@/penaltyInterest/actions";
import { FormNames } from "@/enums";
import { UsersPermissions } from "@/usersPermissions/enums";
import {
  convertStrToDecimalNumber,
  formatNumber,
  hasPermissions,
} from "@/util/helpers";
import {
  getIsFetchingByInvoice,
  getPenaltyInterestByInvoice,
} from "@/penaltyInterest/selectors";
import { getUsersPermissions } from "@/usersPermissions/selectors";
import type { Invoice, InvoiceList } from "@/invoices/types";
type Props = {
  field: any;
  fields: any;
  disableDirty?: boolean;
  invoiceOptions: Array<Record<string, any>>;
  onRemove: (...args: Array<any>) => any;
  showDeleteButton: boolean;
};

const CollectionLetterInvoiceRow: React.FC<Props> = ({
  field,
  fields,
  disableDirty,
  invoiceOptions,
  onRemove,
  showDeleteButton,
}) => {
  const invoice: Invoice = useSelector((state) => selector(state, field));
  const selectedInvoices: InvoiceList = useSelector((state) => {
    const selected = [];
    fields.forEach((field) => {
      const item = selector(state, field);

      if (item && item !== invoice) {
        selected.push(item);
      }
    });
    return selected;
  });
  const collectionCharge: string = useSelector((state) =>
    selector(state, `${field}.collection_charge`),
  );
  const isFetching: boolean = useSelector((state) =>
    getIsFetchingByInvoice(state, invoice.invoice),
  );
  const penaltyInterest = useSelector((state) =>
    getPenaltyInterestByInvoice(state, invoice.invoice),
  );
  const usersPermissions = useSelector(getUsersPermissions);

  const dispatch = useDispatch();

  useEffect(() => {
    if (invoice && isEmpty(penaltyInterest)) {
      if (
        hasPermissions(usersPermissions, UsersPermissions.ADD_COLLECTIONLETTER)
      ) {
        dispatch(fetchPenaltyInterestByInvoice(invoice.invoice));
      }
    }
  }, [dispatch, invoice, penaltyInterest, usersPermissions]);

  const getTotalAmount = () => {
    if (!penaltyInterest || isEmpty(penaltyInterest)) {
      return 0;
    }

    const formatedCollectionCharge =
      convertStrToDecimalNumber(collectionCharge);
    return (
      penaltyInterest.outstanding_amount +
      penaltyInterest.total_interest_amount +
      (!isNaN(formatedCollectionCharge) ? formatedCollectionCharge : 0)
    );
  };

  const filteredInvoiceOptions = invoiceOptions.filter(
    (invoice) => selectedInvoices.indexOf(invoice.value) === -1,
  );
  return (
    <Row>
      <Column small={4}>
        <FormFieldLegacy
          disableDirty={disableDirty}
          fieldAttributes={{
            type: "choice",
            required: true,
            label: "Perittävä lasku",
            read_only: false,
          }}
          invisibleLabel
          name={`${field}.invoice`}
          overrideValues={{
            options: filteredInvoiceOptions,
          }}
        />
      </Column>
      <Column small={2}>
        <LoaderWrapper className="invoice-row-wrapper">
          <Loader isLoading={isFetching} className="small" />
        </LoaderWrapper>
        {!isFetching && (
          <FormText>
            {!isEmpty(penaltyInterest)
              ? `${formatNumber(get(penaltyInterest, "outstanding_amount"))} €`
              : "-"}
          </FormText>
        )}
      </Column>
      <Column small={2}>
        <FormText>
          {!isEmpty(penaltyInterest)
            ? `${formatNumber(get(penaltyInterest, "total_interest_amount"))} €`
            : "-"}
        </FormText>
      </Column>
      <Column small={2}>
        <FormFieldLegacy
          disableDirty={disableDirty}
          fieldAttributes={{
            type: "decimal",
            required: true,
            read_only: false,
            label: "Perimispalkkio",
            decimal_places: 2,
            max_digits: 12,
          }}
          invisibleLabel
          name={`${field}.collection_charge`}
          overrideValues={{
            options: filteredInvoiceOptions,
          }}
        />
      </Column>
      <Column small={2}>
        <FieldAndRemoveButtonWrapper
          field={
            <FormText className="full-width">
              {!isEmpty(penaltyInterest)
                ? `${formatNumber(getTotalAmount())} €`
                : "-"}
            </FormText>
          }
          removeButton={
            showDeleteButton && (
              <RemoveButton
                className="third-level"
                onClick={onRemove}
                style={{
                  height: "unset",
                }}
                title="Poista rivi"
              />
            )
          }
        />
      </Column>
    </Row>
  );
};

const formName = FormNames.LEASE_CREATE_COLLECTION_LETTER;
const selector = formValueSelector(formName);
export default CollectionLetterInvoiceRow;
