import React, { useMemo } from "react";
import { useAppSelector } from "@/root/hooks";
import { useWindowResize } from "@/components/resize/WindowResizeHandler";
import { Row, Column } from "@/components/grid/Grid";
import Authorization from "@/components/authorization/Authorization";
import FormText from "@/components/form/FormText";
import FormTextTitle from "@/components/form/FormTextTitle";
import ShowMore from "@/components/showMore/ShowMore";
import EditButton from "@/components/button/EditButton";

import {
  CollectionNoteFieldPaths,
  CollectionNoteFieldTitles,
  CollectionStageOptions,
} from "@/collectionNote/enums";
import { UsersPermissions } from "@/usersPermissions/enums";
import { InvoiceFieldPaths, InvoiceFieldTitles } from "@/invoices/enums";
import {
  getAttributes as getInvoiceAttributes,
  getInvoicesByLease,
} from "@/invoices/selectors";
import { getAttributes as getCollectionNoteAttributes } from "@/collectionNote/selectors";
import { getUsersPermissions } from "@/usersPermissions/selectors";
import { getCurrentLease } from "@/leases/selectors";
import { getUserFullName } from "@/users/helpers";
import { getUiDataCollectionNoteKey } from "@/uiData/helpers";
import {
  formatDate,
  formatDateRange,
  getFieldOptions,
  getLabelOfOption,
  hasPermissions,
  isFieldAllowedToRead,
} from "@/util/helpers";

import type { Attributes } from "types";
import type { CollectionNote } from "../types";

type Props = {
  note: CollectionNote;
  handleEdit: () => void;
  enableEdit: boolean;
  isServiceUnitSameAsActiveServiceUnit: () => boolean;
};

const CollectionNoteItem: React.FC<Props> = ({
  note,
  handleEdit,
  enableEdit,
  isServiceUnitSameAsActiveServiceUnit,
}) => {
  const largeScreen = useWindowResize();
  const collectionNoteAttributes: Attributes = useAppSelector(
    getCollectionNoteAttributes,
  );
  const usersPermissions = useAppSelector(getUsersPermissions);
  const currentLease = useAppSelector(getCurrentLease);
  const leaseInvoices = useAppSelector((state) =>
    getInvoicesByLease(state, currentLease.id),
  );
  const invoiceAttributes = useAppSelector(getInvoiceAttributes);
  const stageOptions = getFieldOptions(
    collectionNoteAttributes,
    CollectionNoteFieldPaths.COLLECTION_STAGE,
  );
  const stateOptions = getFieldOptions(
    invoiceAttributes,
    InvoiceFieldPaths.STATE,
  );

  const invoices = useMemo(() => {
    return (
      leaseInvoices?.filter((invoice) => note.invoices?.includes(invoice.id)) ||
      []
    );
  }, [note.invoices, leaseInvoices]);

  const showPostponeDate =
    note.collection_stage === CollectionStageOptions.PAYMENT_DEFERRAL;
  const showSentDate = !!note.sent_date;
  const showContractChangeFields =
    note.collection_stage === CollectionStageOptions.CONTRACT_CHANGE;

  return (
    <>
      <Row>
        <Column small={6} medium={3} large={3}>
          <Authorization
            allow={isFieldAllowedToRead(
              collectionNoteAttributes,
              CollectionNoteFieldPaths.COLLECTION_STAGE,
            )}
          >
            <>
              <FormTextTitle
                enableUiDataEdit
                uiDataKey={getUiDataCollectionNoteKey(
                  CollectionNoteFieldPaths.COLLECTION_STAGE,
                )}
              >
                {CollectionNoteFieldTitles.COLLECTION_STAGE}
              </FormTextTitle>
              <FormText>
                {getLabelOfOption(stageOptions, note.collection_stage) || "-"}
              </FormText>
            </>
          </Authorization>
        </Column>

        {showSentDate && (
          <Column small={6} medium={3} large={2}>
            <Authorization
              allow={isFieldAllowedToRead(
                collectionNoteAttributes,
                CollectionNoteFieldPaths.SENT_DATE,
              )}
            >
              <>
                <FormTextTitle
                  enableUiDataEdit
                  uiDataKey={getUiDataCollectionNoteKey(
                    CollectionNoteFieldPaths.SENT_DATE,
                  )}
                >
                  {CollectionNoteFieldTitles.SENT_DATE}
                </FormTextTitle>
                <FormText>{formatDate(note.sent_date) || "-"}</FormText>
              </>
            </Authorization>
          </Column>
        )}

        {showPostponeDate && (
          <Column small={6} medium={3} large={2}>
            <Authorization
              allow={isFieldAllowedToRead(
                collectionNoteAttributes,
                CollectionNoteFieldPaths.POSTPONE_DATE,
              )}
            >
              <>
                <FormTextTitle
                  enableUiDataEdit
                  uiDataKey={getUiDataCollectionNoteKey(
                    CollectionNoteFieldPaths.POSTPONE_DATE,
                  )}
                >
                  {CollectionNoteFieldTitles.POSTPONE_DATE}
                </FormTextTitle>
                <FormText>{formatDate(note.postpone_date) || "-"}</FormText>
              </>
            </Authorization>
          </Column>
        )}

        {showContractChangeFields && (
          <>
            <Column small={6} medium={3} large={2}>
              <Authorization
                allow={isFieldAllowedToRead(
                  collectionNoteAttributes,
                  CollectionNoteFieldPaths.INSPECTION_DATE,
                )}
              >
                <>
                  <FormTextTitle
                    enableUiDataEdit
                    uiDataKey={getUiDataCollectionNoteKey(
                      CollectionNoteFieldPaths.INSPECTION_DATE,
                    )}
                  >
                    {CollectionNoteFieldTitles.INSPECTION_DATE}
                  </FormTextTitle>
                  <FormText>{formatDate(note.inspection_date) || "-"}</FormText>
                </>
              </Authorization>
            </Column>
            <Column small={6} medium={2} large={1}>
              <Authorization
                allow={isFieldAllowedToRead(
                  collectionNoteAttributes,
                  CollectionNoteFieldPaths.ENTIRE_LEASE,
                )}
              >
                <>
                  <FormTextTitle
                    enableUiDataEdit
                    uiDataKey={getUiDataCollectionNoteKey(
                      CollectionNoteFieldPaths.ENTIRE_LEASE,
                    )}
                  >
                    {CollectionNoteFieldTitles.ENTIRE_LEASE}
                  </FormTextTitle>
                  <FormText>{note.entire_lease ? "Kyllä" : "Ei"}</FormText>
                </>
              </Authorization>
            </Column>
          </>
        )}

        {
          // Spacers to consistently position fields in cases of some dynamic fields missing.
          largeScreen &&
            !showContractChangeFields &&
            !showPostponeDate &&
            !showSentDate && <Column large={2} />
        }
        {largeScreen && !showContractChangeFields && <Column large={1} />}

        <Column small={6} medium={2} large={1}>
          <Authorization
            allow={isFieldAllowedToRead(
              collectionNoteAttributes,
              CollectionNoteFieldPaths.CREATED_AT,
            )}
          >
            <>
              <FormTextTitle
                enableUiDataEdit
                uiDataKey={getUiDataCollectionNoteKey(
                  CollectionNoteFieldPaths.CREATED_AT,
                )}
              >
                {CollectionNoteFieldTitles.CREATED_AT}
              </FormTextTitle>
              <FormText>{formatDate(note.created_at) || "-"}</FormText>
            </>
          </Authorization>
        </Column>

        <Column small={6} medium={2}>
          <FormTextTitle
            enableUiDataEdit
            uiDataKey={getUiDataCollectionNoteKey(
              CollectionNoteFieldPaths.USER,
            )}
          >
            {CollectionNoteFieldTitles.USER}
          </FormTextTitle>
          <FormText>{getUserFullName(note.user) || "-"}</FormText>
        </Column>
        {formatDate(note.modified_at) !== formatDate(note.created_at) && (
          <Column small={6} medium={2} large={1}>
            <Authorization
              allow={isFieldAllowedToRead(
                collectionNoteAttributes,
                CollectionNoteFieldPaths.MODIFIED_AT,
              )}
            >
              <>
                <FormTextTitle
                  enableUiDataEdit
                  uiDataKey={getUiDataCollectionNoteKey(
                    CollectionNoteFieldPaths.MODIFIED_AT,
                  )}
                >
                  {CollectionNoteFieldTitles.MODIFIED_AT}
                </FormTextTitle>
                <FormText>{formatDate(note.modified_at) || "-"}</FormText>
              </>
            </Authorization>
          </Column>
        )}
        <Authorization
          allow={
            hasPermissions(
              usersPermissions,
              UsersPermissions.ADD_COLLECTIONNOTE,
            ) && isServiceUnitSameAsActiveServiceUnit()
          }
        >
          <EditButton
            className="position-topright"
            disabled={!enableEdit}
            onClick={handleEdit}
            title="Muokkaa"
          />
        </Authorization>
      </Row>

      <Row>
        <Column small={4} large={6}>
          <Authorization
            allow={isFieldAllowedToRead(
              collectionNoteAttributes,
              CollectionNoteFieldPaths.NOTE,
            )}
          >
            <>
              <FormTextTitle
                enableUiDataEdit
                uiDataKey={getUiDataCollectionNoteKey(
                  CollectionNoteFieldPaths.NOTE,
                )}
              >
                {CollectionNoteFieldTitles.NOTE}
              </FormTextTitle>
              <ShowMore text={note.note || "-"} />
            </>
          </Authorization>
        </Column>
        <Authorization
          allow={isFieldAllowedToRead(
            collectionNoteAttributes,
            CollectionNoteFieldPaths.INVOICES,
          )}
        >
          {invoices.length > 0 && (
            <Column small={8} large={6}>
              <Row>
                <Column small={3} large={2}>
                  <FormTextTitle
                    enableUiDataEdit
                    uiDataKey={getUiDataCollectionNoteKey(
                      InvoiceFieldPaths.STATE,
                    )}
                  >
                    {InvoiceFieldTitles.STATE}
                  </FormTextTitle>
                </Column>
                <Column small={5} large={4}>
                  <FormTextTitle
                    enableUiDataEdit
                    uiDataKey={getUiDataCollectionNoteKey(
                      InvoiceFieldPaths.BILLING_PERIOD,
                    )}
                  >
                    {InvoiceFieldTitles.BILLING_PERIOD}
                  </FormTextTitle>
                </Column>
                <Column small={4} large={3}>
                  <FormTextTitle
                    enableUiDataEdit
                    uiDataKey={getUiDataCollectionNoteKey(
                      InvoiceFieldPaths.TOTAL_AMOUNT,
                    )}
                  >
                    {InvoiceFieldTitles.TOTAL_AMOUNT}
                  </FormTextTitle>
                </Column>
              </Row>
              {invoices?.filter(Boolean).map((invoice) => (
                <Row key={invoice.id}>
                  <Column small={3} large={2}>
                    <FormText>
                      {getLabelOfOption(stateOptions, invoice.state) || "-"}
                    </FormText>
                  </Column>
                  <Column small={5} large={4}>
                    <FormText>
                      {formatDateRange(
                        invoice.billing_period_start_date,
                        invoice.billing_period_end_date,
                      )}
                    </FormText>
                  </Column>
                  <Column small={4} large={3}>
                    <FormText>
                      {invoice.total_amount != null
                        ? `${invoice.total_amount} €`
                        : "-"}
                    </FormText>
                  </Column>
                </Row>
              ))}
            </Column>
          )}
        </Authorization>
      </Row>
    </>
  );
};

export default CollectionNoteItem;
