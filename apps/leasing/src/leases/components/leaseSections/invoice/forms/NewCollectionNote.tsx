import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useForm, useFormState } from "react-final-form";
import { getUsersPermissions } from "@/usersPermissions/selectors";
import { getCurrentLease } from "@/leases/selectors";
import { Row, Column } from "@/components/grid/Grid";
import Authorization from "@/components/authorization/Authorization";
import Button from "@/components/button/Button";
import FormField from "@/components/form/final-form/FormField";
import { ButtonColors } from "@/components/enums";
import {
  CollectionNoteFieldPaths,
  CollectionNoteFieldTitles,
} from "@/collectionNote/enums";
import {
  getFieldAttributes,
  getFieldOptions,
  hasPermissions,
  isFieldAllowedToRead,
} from "@/util/helpers";
import { getAttributes as getCollectionNoteAttributes } from "@/collectionNote/selectors";
import { UsersPermissions } from "@/usersPermissions/enums";
import { getInvoicesByLease } from "@/invoices/selectors";
import { FieldTypes } from "@/enums";
import { useFieldValue } from "@/components/helpers";
import { CollectionStageOptions } from "@/leases/enums";
import AddButtonThird from "@/components/form/AddButtonThird";
import { InvoiceFieldPaths, InvoiceState } from "@/invoices/enums";
import { getAttributes as getInvoiceAttributes } from "@/invoices/selectors";
import { getInvoiceLabel } from "@/collectionNote/helpers";

import type { Attributes } from "types";

const stagesWithSentDateField = [
  CollectionStageOptions.RISK_OF_DEMOLITION,
  CollectionStageOptions.RISK_OF_DEMOLITION_AND_LITIGATION,
  CollectionStageOptions.RISK_OF_LITIGATION,
  CollectionStageOptions.RISK_OF_TERMINATION_AND_LITIGATION,
  CollectionStageOptions.SIMPLE_PAYMENT_REMINDER,
  CollectionStageOptions.PAYMENT_DEMAND,
  CollectionStageOptions.BANKRUPTCY_OR_REORGANIZATION,
];

type Props = {
  onSave: (...args: Array<any>) => any;
};

const NewCollectionNote: React.FC<Props> = ({ onSave }) => {
  const { values, valid } = useFormState();
  const form = useForm();
  const collectionNoteAttributes: Attributes = useSelector(
    getCollectionNoteAttributes,
  );
  const usersPermissions = useSelector(getUsersPermissions);
  const currentLease = useSelector(getCurrentLease);
  const availableInvoices = useSelector((state) =>
    getInvoicesByLease(state, currentLease.id),
  );
  const invoiceAttributes: Attributes = useSelector(getInvoiceAttributes);
  const stateOptions = getFieldOptions(
    invoiceAttributes,
    InvoiceFieldPaths.STATE,
  );
  const collectionStage = useFieldValue("collection_stage");

  const handleCollectionStageChange = () => {
    // Resets fields which might not exist on another type of note
    form.batch(() => {
      form.change("invoices", undefined);
      form.change("sent_date", undefined);
      form.change("inspection_date", undefined);
      form.change("postpone_date", undefined);
      form.change("entire_lease", undefined);
    });
  };

  const sortedInvoices = useMemo(() => {
    if (!availableInvoices) return [];
    //Sort by due date descending and prioritize open invoices first
    const sorted = [...availableInvoices].sort((a, b) => {
      if (a.state === InvoiceState.OPEN && b.state !== InvoiceState.OPEN) {
        return -1;
      }
      if (a.state !== InvoiceState.OPEN && b.state === InvoiceState.OPEN) {
        return 1;
      }
      return new Date(b.due_date).getTime() - new Date(a.due_date).getTime();
    });
    return sorted;
  }, [availableInvoices]);

  const [isAddingNote, setIsAddingNote] = useState(false);

  const handleAdd = () => {
    setIsAddingNote(true);
    form.reset();
  };

  const handleCancel = () => {
    setIsAddingNote(false);
  };

  const handleSave = () => {
    onSave(values);
    setIsAddingNote(false);
  };

  return (
    <>
      {isAddingNote && (
        <>
          <Row style={{ marginTop: "1rem" }}>
            <Column small={3}>
              <Authorization
                allow={isFieldAllowedToRead(
                  collectionNoteAttributes,
                  CollectionNoteFieldPaths.COLLECTION_STAGE,
                )}
              >
                <FormField
                  fieldAttributes={getFieldAttributes(
                    collectionNoteAttributes,
                    CollectionNoteFieldPaths.COLLECTION_STAGE,
                  )}
                  name="collection_stage"
                  overrideValues={{
                    label: CollectionNoteFieldTitles.COLLECTION_STAGE,
                    required: true,
                  }}
                  onChange={handleCollectionStageChange}
                />
              </Authorization>
            </Column>
          </Row>
          {collectionStage && (
            <>
              <Row>
                <Column small={3}>
                  <Authorization
                    allow={isFieldAllowedToRead(
                      collectionNoteAttributes,
                      CollectionNoteFieldPaths.INVOICES,
                    )}
                  >
                    <FormField
                      // Key forces re-validation on collection stage change
                      key={collectionStage}
                      fieldAttributes={getFieldAttributes(
                        collectionNoteAttributes,
                        CollectionNoteFieldPaths.INVOICES,
                      )}
                      name="invoices"
                      overrideValues={{
                        label: CollectionNoteFieldTitles.INVOICES,
                        options: sortedInvoices.map((invoice) => ({
                          label: getInvoiceLabel(invoice, stateOptions),
                          value: invoice.id,
                        })),
                        required:
                          collectionStage !== CollectionStageOptions.NOTICE,
                        fieldType:
                          collectionStage ===
                          CollectionStageOptions.PAYMENT_DEFERRAL
                            ? FieldTypes.CHOICE
                            : FieldTypes.MULTISELECT,
                      }}
                    />
                  </Authorization>
                </Column>
                {stagesWithSentDateField.includes(collectionStage) && (
                  <Column small={3}>
                    <Authorization
                      allow={isFieldAllowedToRead(
                        collectionNoteAttributes,
                        CollectionNoteFieldPaths.SENT_DATE,
                      )}
                    >
                      <FormField
                        fieldAttributes={getFieldAttributes(
                          collectionNoteAttributes,
                          CollectionNoteFieldPaths.SENT_DATE,
                        )}
                        name="sent_date"
                        overrideValues={{
                          label: CollectionNoteFieldTitles.SENT_DATE,
                        }}
                      />
                    </Authorization>
                  </Column>
                )}
                {collectionStage ===
                  CollectionStageOptions.PAYMENT_DEFERRAL && (
                  <Column small={3}>
                    <Authorization
                      allow={isFieldAllowedToRead(
                        collectionNoteAttributes,
                        CollectionNoteFieldPaths.POSTPONE_DATE,
                      )}
                    >
                      <FormField
                        fieldAttributes={getFieldAttributes(
                          collectionNoteAttributes,
                          CollectionNoteFieldPaths.POSTPONE_DATE,
                        )}
                        name="postpone_date"
                        overrideValues={{
                          label: CollectionNoteFieldTitles.POSTPONE_DATE,
                        }}
                      />
                    </Authorization>
                  </Column>
                )}
                {collectionStage === CollectionStageOptions.CONTRACT_CHANGE && (
                  <>
                    <Column small={3}>
                      <Authorization
                        allow={isFieldAllowedToRead(
                          collectionNoteAttributes,
                          CollectionNoteFieldPaths.INSPECTION_DATE,
                        )}
                      >
                        <FormField
                          fieldAttributes={getFieldAttributes(
                            collectionNoteAttributes,
                            CollectionNoteFieldPaths.INSPECTION_DATE,
                          )}
                          name="inspection_date"
                          overrideValues={{
                            label: CollectionNoteFieldTitles.INSPECTION_DATE,
                          }}
                        />
                      </Authorization>
                    </Column>
                    <Column small={3}>
                      <Authorization
                        allow={isFieldAllowedToRead(
                          collectionNoteAttributes,
                          CollectionNoteFieldPaths.ENTIRE_LEASE,
                        )}
                      >
                        <FormField
                          fieldAttributes={getFieldAttributes(
                            collectionNoteAttributes,
                            CollectionNoteFieldPaths.ENTIRE_LEASE,
                          )}
                          name="entire_lease"
                          overrideValues={{
                            label: CollectionNoteFieldTitles.ENTIRE_LEASE,
                          }}
                        />
                      </Authorization>
                    </Column>
                  </>
                )}
                <Column small={12}>
                  <Authorization
                    allow={isFieldAllowedToRead(
                      collectionNoteAttributes,
                      CollectionNoteFieldPaths.NOTE,
                    )}
                  >
                    <FormField
                      fieldAttributes={{
                        ...getFieldAttributes(
                          collectionNoteAttributes,
                          CollectionNoteFieldPaths.NOTE,
                        ),
                        type: "textarea",
                      }}
                      name="note"
                      overrideValues={{
                        label: CollectionNoteFieldTitles.NOTE,
                      }}
                    />
                  </Authorization>
                </Column>
              </Row>
            </>
          )}
          <div className="invoice__new-collection-note_button-wrapper">
            <Button
              className={ButtonColors.SECONDARY}
              onClick={handleCancel}
              text="Peruuta"
            />
            <Button
              className={ButtonColors.SUCCESS}
              disabled={!valid}
              onClick={handleSave}
              text="Tallenna"
            />
          </div>
        </>
      )}
      <Authorization
        allow={hasPermissions(
          usersPermissions,
          UsersPermissions.ADD_COLLECTIONNOTE,
        )}
      >
        {!isAddingNote && (
          <AddButtonThird
            label="Lisää huomautus"
            onClick={handleAdd}
            style={{ marginTop: "1rem" }}
          />
        )}
      </Authorization>
    </>
  );
};

export default NewCollectionNote;
