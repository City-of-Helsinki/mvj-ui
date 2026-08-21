import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Row, Column } from "@/components/grid/Grid";
import Authorization from "@/components/authorization/Authorization";
import BoxItemContainer from "@/components/content/BoxItemContainer";
import FormText from "@/components/form/FormText";
import FormTextTitle from "@/components/form/FormTextTitle";
import ShowMore from "@/components/showMore/ShowMore";
import Collapse from "@/components/collapse/Collapse";
import {
  CollectionNoteFieldPaths,
  CollectionNoteFieldTitles,
} from "@/collectionNote/enums";
import { UsersPermissions } from "@/usersPermissions/enums";
import { InvoiceFieldPaths } from "@/invoices/enums";
import { CollectionStageOptions } from "@/leases/enums";
import { getAttributes as getInvoiceAttributes } from "@/invoices/selectors";
import { getAttributes as getCollectionNoteAttributes } from "@/collectionNote/selectors";
import { getUsersPermissions } from "@/usersPermissions/selectors";
import { getInvoicesByLease } from "@/invoices/selectors";
import { getCurrentLease } from "@/leases/selectors";
import { getUserFullName } from "@/users/helpers";
import { getUiDataCollectionNoteKey } from "@/uiData/helpers";
import {
  formatDate,
  getFieldOptions,
  getLabelOfOption,
  hasPermissions,
  isFieldAllowedToRead,
} from "@/util/helpers";
import { getInvoiceLabel } from "../helpers";

import type { Attributes } from "types";
import type { CollectionNote } from "../types";

type Props = {
  note: CollectionNote;
  handleRemove: (...args: Array<any>) => any;
  isServiceUnitSameAsActiveServiceUnit: () => boolean;
};

const CollectionNoteItem: React.FC<Props> = ({
  note,
  handleRemove,
  isServiceUnitSameAsActiveServiceUnit,
}) => {
  const collectionNoteAttributes: Attributes = useSelector(
    getCollectionNoteAttributes,
  );
  const usersPermissions = useSelector(getUsersPermissions);
  const currentLease = useSelector(getCurrentLease);
  const leaseInvoices = useSelector((state) =>
    getInvoicesByLease(state, currentLease.id),
  );
  const invoiceAttributes = useSelector(getInvoiceAttributes);
  const stageOptions = getFieldOptions(
    collectionNoteAttributes,
    CollectionNoteFieldPaths.COLLECTION_STAGE,
  );
  const stateOptions = getFieldOptions(
    invoiceAttributes,
    InvoiceFieldPaths.STATE,
  );

  const [noteCollapseState, setNoteCollapseState] = useState<boolean>(true);
  const [invoicesCollapseState, setInvoicesCollapseState] =
    useState<boolean>(true);

  const invoices = useMemo(() => {
    return leaseInvoices.filter((invoice) =>
      note.invoices.includes(invoice.id),
    );
  }, [note.invoices, leaseInvoices]);

  const handleNoteCollapseToggle = (val: boolean) => {
    setNoteCollapseState(val);
  };

  const handleInvoicesCollapseToggle = (val: boolean) => {
    setInvoicesCollapseState(val);
  };

  return (
    <Collapse
      className="collapse__secondary"
      defaultOpen={noteCollapseState}
      headerTitle={
        <>
          <Authorization
            allow={isFieldAllowedToRead(
              collectionNoteAttributes,
              CollectionNoteFieldPaths.COLLECTION_STAGE,
            )}
          >
            <>{`${getLabelOfOption(stageOptions, note.collection_stage)} `}</>
          </Authorization>
          <Authorization
            allow={isFieldAllowedToRead(
              collectionNoteAttributes,
              CollectionNoteFieldPaths.SENT_DATE,
            )}
          >
            <>{formatDate(note.sent_date)}</>
          </Authorization>
          <Authorization
            allow={isFieldAllowedToRead(
              collectionNoteAttributes,
              CollectionNoteFieldPaths.INSPECTION_DATE,
            )}
          >
            <>{formatDate(note.inspection_date)}</>
          </Authorization>
          <Authorization
            allow={isFieldAllowedToRead(
              collectionNoteAttributes,
              CollectionNoteFieldPaths.POSTPONE_DATE,
            )}
          >
            <>{formatDate(note.postpone_date)}</>
          </Authorization>
        </>
      }
      onToggle={handleNoteCollapseToggle}
      uiDataKey={getUiDataCollectionNoteKey(
        CollectionNoteFieldPaths.COLLECTION_NOTES,
      )}
      onRemove={
        hasPermissions(
          usersPermissions,
          UsersPermissions.DELETE_COLLECTIONNOTE,
        ) && isServiceUnitSameAsActiveServiceUnit()
          ? handleRemove
          : null
      }
    >
      <Row>
        <Column small={6} medium={4} large={3}>
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

        {note.sent_date && (
          <Column small={6} medium={4} large={3}>
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

        {note.collection_stage === CollectionStageOptions.PAYMENT_DEFERRAL && (
          <Column small={6} medium={4} large={3}>
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

        {note.collection_stage === CollectionStageOptions.CONTRACT_CHANGE && (
          <>
            <Column small={6} medium={4} large={3}>
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
            <Column small={6} medium={4} large={3}>
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
                  <FormText>
                    {note.entire_lease != null
                      ? note.entire_lease
                        ? "Kyllä"
                        : "Ei"
                      : "-"}
                  </FormText>
                </>
              </Authorization>
            </Column>
          </>
        )}

        <Column small={6} medium={4} large={3}>
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

        <Column small={6} medium={4} large={3}>
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
      </Row>

      <Authorization
        allow={isFieldAllowedToRead(
          collectionNoteAttributes,
          CollectionNoteFieldPaths.INVOICES,
        )}
      >
        {invoices.length > 0 && (
          <>
            <FormTextTitle
              enableUiDataEdit
              uiDataKey={getUiDataCollectionNoteKey(
                CollectionNoteFieldPaths.INVOICES,
              )}
            >
              {CollectionNoteFieldTitles.INVOICES}
            </FormTextTitle>
            <Collapse
              className="collapse__third"
              defaultOpen={invoicesCollapseState}
              headerTitle={`${CollectionNoteFieldTitles.INVOICES}  (${invoices.length})`}
              onToggle={handleInvoicesCollapseToggle}
              uiDataKey={getUiDataCollectionNoteKey(
                CollectionNoteFieldPaths.INVOICES,
              )}
            >
              <BoxItemContainer>
                {invoices &&
                  invoices.filter(Boolean).map((invoice) => (
                    <Row key={invoice.id}>
                      <Column small={12}>
                        <FormText>
                          {getInvoiceLabel(invoice, stateOptions)}
                        </FormText>
                      </Column>
                    </Row>
                  ))}
              </BoxItemContainer>
            </Collapse>
          </>
        )}
      </Authorization>

      {note.note && (
        <Row>
          <Column small={12}>
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
                <ShowMore text={note.note} />
              </>
            </Authorization>
          </Column>
        </Row>
      )}
    </Collapse>
  );
};

export default CollectionNoteItem;
