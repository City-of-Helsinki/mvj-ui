import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { Form } from "react-final-form";
import { Row, Column } from "@/components/grid/Grid";
import Authorization from "@/components/authorization/Authorization";
import Button from "@/components/button/Button";
import FormField from "@/components/form/final-form/FormField";
import ButtonWrapper from "@/components/content/ButtonWrapper";
import { ButtonColors } from "@/components/enums";
import {
  CollectionNoteFieldPaths,
  CollectionNoteFieldTitles,
  CollectionStageOptions,
} from "@/collectionNote/enums";
import { FieldTypes } from "@/enums";
import { InvoiceFieldPaths } from "@/invoices/enums";
import {
  getFieldAttributes,
  getFieldOptions,
  isFieldAllowedToRead,
} from "@/util/helpers";
import {
  getInvoiceLabel,
  sortInvoices,
  getPayloadCollectionNote,
} from "@/collectionNote/helpers";
import { getAttributes as getCollectionNoteAttributes } from "@/collectionNote/selectors";
import {
  getInvoicesByLease,
  getAttributes as getInvoiceAttributes,
} from "@/invoices/selectors";
import { getCurrentLease } from "@/leases/selectors";
import { stagesWithSentDate } from "../constants";

import type { Attributes } from "types";
import type { CollectionNote, CollectionNotePayload } from "../types";

type Props = {
  note: CollectionNote;
  onSave: (payload: CollectionNotePayload) => void;
  onDelete: () => void;
  onCancel: () => void;
};

const CollectionNoteEdit: React.FC<Props> = ({
  note,
  onSave,
  onCancel,
  onDelete,
}) => {
  const collectionNoteAttributes: Attributes = useSelector(
    getCollectionNoteAttributes,
  );
  const currentLease = useSelector(getCurrentLease);
  const availableInvoices = useSelector((state) =>
    getInvoicesByLease(state, currentLease?.id),
  );
  const invoiceAttributes: Attributes = useSelector(getInvoiceAttributes);
  const stateOptions = getFieldOptions(
    invoiceAttributes,
    InvoiceFieldPaths.STATE,
  );

  const sortedInvoices = useMemo(() => {
    return sortInvoices(availableInvoices);
  }, [availableInvoices]);

  const handleSubmit = (values: CollectionNote) => {
    onSave(getPayloadCollectionNote({ ...values, id: note.id }, note.lease));
  };

  return (
    <Form onSubmit={handleSubmit} initialValues={{ ...note }}>
      {({ handleSubmit, valid, values, form }) => {
        const handleCollectionStageChange = () => {
          // Resets fields which might not exist on another type of note
          // A guardrail for legacy notes without a collection stage
          form.batch(() => {
            form.change("invoices", undefined);
            form.change("sent_date", undefined);
            form.change("inspection_date", undefined);
            form.change("postpone_date", undefined);
            form.change("entire_lease", undefined);
          });
        };

        return (
          <form onSubmit={handleSubmit}>
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
                    }}
                    disabled={!!note.collection_stage}
                    onChange={handleCollectionStageChange}
                  />
                </Authorization>
              </Column>
            </Row>

            {values.collection_stage && (
              <Row>
                <Column small={3}>
                  <Authorization
                    allow={isFieldAllowedToRead(
                      collectionNoteAttributes,
                      CollectionNoteFieldPaths.INVOICES,
                    )}
                  >
                    <FormField
                      key={values.collection_stage}
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
                          values.collection_stage !==
                          CollectionStageOptions.NOTICE,
                        fieldType:
                          values.collection_stage ===
                          CollectionStageOptions.PAYMENT_DEFERRAL
                            ? FieldTypes.CHOICE
                            : FieldTypes.MULTISELECT,
                      }}
                    />
                  </Authorization>
                </Column>

                {stagesWithSentDate.includes(values.collection_stage) && (
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

                {values.collection_stage ===
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

                {values.collection_stage ===
                  CollectionStageOptions.CONTRACT_CHANGE && (
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
              </Row>
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

            <ButtonWrapper>
              <Button
                className={ButtonColors.SECONDARY}
                onClick={onCancel}
                text="Peruuta"
              />
              <Button
                className={ButtonColors.ALERT}
                onClick={onDelete}
                text="Poista"
              />
              <Button
                className={ButtonColors.SUCCESS}
                disabled={!valid}
                onClick={handleSubmit}
                type="submit"
                text="Tallenna"
              />
            </ButtonWrapper>
          </form>
        );
      }}
    </Form>
  );
};

export default CollectionNoteEdit;
