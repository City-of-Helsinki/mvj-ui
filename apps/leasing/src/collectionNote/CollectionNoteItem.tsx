import React from "react";
import { useSelector } from "react-redux";
import { Row, Column } from "@/components/grid/Grid";
import { ActionTypes } from "@/app/AppContext";
import Authorization from "@/components/authorization/Authorization";
import BoxItem from "@/components/content/BoxItem";
import FieldAndRemoveButtonWrapper from "@/components/form/FieldAndRemoveButtonWrapper";
import FormText from "@/components/form/FormText";
import FormTextTitle from "@/components/form/FormTextTitle";
import RemoveButton from "@/components/form/RemoveButton";
import ShowMore from "@/components/showMore/ShowMore";
import { ConfirmationModalTexts } from "@/enums";
import {
  CollectionNoteFieldPaths,
  CollectionNoteFieldTitles,
} from "@/collectionNote/enums";
import { ButtonColors } from "@/components/enums";
import { UsersPermissions } from "@/usersPermissions/enums";
import { CollectionStageOptions } from "@/leases/enums";
import { getUserFullName } from "@/users/helpers";
import { getUiDataCollectionNoteKey } from "@/uiData/helpers";
import {
  formatDate,
  getFieldOptions,
  getLabelOfOption,
  hasPermissions,
  isFieldAllowedToRead,
} from "@/util/helpers";
import { getAttributes as getCollectionNoteAttributes } from "@/collectionNote/selectors";
import { getUsersPermissions } from "@/usersPermissions/selectors";
import type { Attributes } from "types";

const notesWithSentDateField = [
  CollectionStageOptions.RISK_OF_DEMOLITION,
  CollectionStageOptions.RISK_OF_DEMOLITION_AND_LITIGATION,
  CollectionStageOptions.RISK_OF_LITIGATION,
  CollectionStageOptions.RISK_OF_TERMINATION_AND_LITIGATION,
  CollectionStageOptions.SIMPLE_PAYMENT_REMINDER,
  CollectionStageOptions.PAYMENT_DEMAND,
  CollectionStageOptions.BANKRUPTCY_OR_REORGANIZATION,
  CollectionStageOptions.DISTRAINT,
  CollectionStageOptions.DISTRAINT_NOTICE,
  CollectionStageOptions.NOTICE,
  CollectionStageOptions.COMPLAINT_OR_OTHER_OBSTRUCTION,
];

type Props = {
  note: Record<string, any>;
  invoices: Array<Record<string, any>>;
  appDispatch: (...args: Array<any>) => any;
  handleDeleteCollectionNote: (...args: Array<any>) => any;
  isServiceUnitSameAsActiveServiceUnit: () => boolean;
};

const CollectionNoteItem: React.FC<Props> = ({
  note,
  invoices,
  appDispatch,
  handleDeleteCollectionNote,
  isServiceUnitSameAsActiveServiceUnit,
}) => {
  const collectionNoteAttributes: Attributes = useSelector(
    getCollectionNoteAttributes,
  );
  const usersPermissions = useSelector(getUsersPermissions);

  const stageOptions = getFieldOptions(
    collectionNoteAttributes,
    CollectionNoteFieldPaths.COLLECTION_STAGE,
  );

  const invoiceNumbers = note.invoices
    ? note.invoices.map((invoiceId) => {
        const match = invoices.find((inv) => inv.id === invoiceId);
        return match ? match.number : "-";
      })
    : [];

  const hasSentDate = notesWithSentDateField.includes(note.collection_stage);
  const isPaymentDeferral =
    note.collection_stage === CollectionStageOptions.PAYMENT_DEFERRAL;
  const isContractChange =
    note.collection_stage === CollectionStageOptions.CONTRACT_CHANGE;

  const handleRemove = () => {
    appDispatch({
      type: ActionTypes.SHOW_CONFIRMATION_MODAL,
      confirmationFunction: () => {
        handleDeleteCollectionNote(note.id);
      },
      confirmationModalButtonClassName: ButtonColors.ALERT,
      confirmationModalButtonText: ConfirmationModalTexts.DELETE_NOTE.BUTTON,
      confirmationModalLabel: ConfirmationModalTexts.DELETE_NOTE.LABEL,
      confirmationModalTitle: ConfirmationModalTexts.DELETE_NOTE.TITLE,
    });
  };

  return (
    <BoxItem>
      <Authorization
        allow={
          hasPermissions(
            usersPermissions,
            UsersPermissions.DELETE_COLLECTIONNOTE,
          ) && isServiceUnitSameAsActiveServiceUnit()
        }
      >
        <div className="position-topright">
          <RemoveButton
            className="third-level"
            onClick={handleRemove}
            style={{ height: "unset" }}
            title="Poista huomautus"
          />
        </div>
      </Authorization>

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

        <Column small={6} medium={4} large={3}>
          <Authorization
            allow={isFieldAllowedToRead(
              collectionNoteAttributes,
              CollectionNoteFieldPaths.INVOICES,
            )}
          >
            <>
              <FormTextTitle
                enableUiDataEdit
                uiDataKey={getUiDataCollectionNoteKey(
                  CollectionNoteFieldPaths.INVOICES,
                )}
              >
                {isPaymentDeferral
                  ? CollectionNoteFieldTitles.INVOICE
                  : CollectionNoteFieldTitles.INVOICES}
              </FormTextTitle>
              <FormText>{invoiceNumbers.join(", ") || "-"}</FormText>
            </>
          </Authorization>
        </Column>

        {hasSentDate && (
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

        {isPaymentDeferral && (
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

        {isContractChange && (
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
          {/* TODO: verify CollectionNoteFieldPaths.USER attribute when added to API */}
          <FormTextTitle
            enableUiDataEdit
            uiDataKey={getUiDataCollectionNoteKey(CollectionNoteFieldPaths.USER)}
          >
            {CollectionNoteFieldTitles.USER}
          </FormTextTitle>
          <FormText>{getUserFullName(note.user) || "-"}</FormText>
        </Column>
      </Row>

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
    </BoxItem>
  );
};

export default CollectionNoteItem;
