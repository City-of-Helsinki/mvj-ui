import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Column } from "react-foundation";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import FieldAndRemoveButtonWrapper from "@/components/form/FieldAndRemoveButtonWrapper";
import FormField from "@/components/form/final-form/FormField";
import FormText from "@/components/form/FormText";
import Loader from "@/components/loader/Loader";
import LoaderWrapper from "@/components/loader/LoaderWrapper";
import RemoveButton from "@/components/form/RemoveButton";
import { fetchPenaltyInterestByInvoice } from "@/penaltyInterest/actions";
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
import type { InvoiceList } from "@/invoices/types";
import { useFormState } from "react-final-form";
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
  const formState = useFormState();
  const dispatch = useDispatch();

  const currentInvoiceId = get(formState.values, `${field}.invoice`);

  const selectedInvoices: InvoiceList = fields
    .map((field) => get(formState.values, `${field}.invoice`))
    .filter((item) => item && item !== currentInvoiceId);

  const collectionCharge: string = get(
    formState.values,
    `${field}.collection_charge`,
    "0",
  );
  const isFetching: boolean = useSelector((state) =>
    getIsFetchingByInvoice(state, currentInvoiceId),
  );
  const penaltyInterest = useSelector((state) =>
    getPenaltyInterestByInvoice(state, currentInvoiceId),
  );
  const usersPermissions = useSelector(getUsersPermissions);

  useEffect(() => {
    if (
      currentInvoiceId &&
      isEmpty(penaltyInterest) &&
      hasPermissions(usersPermissions, UsersPermissions.ADD_COLLECTIONLETTER)
    ) {
      dispatch(fetchPenaltyInterestByInvoice(currentInvoiceId));
    }
  }, [dispatch, currentInvoiceId, penaltyInterest, usersPermissions]);

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
        <FormField
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
        <FormField
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

export default CollectionLetterInvoiceRow;
