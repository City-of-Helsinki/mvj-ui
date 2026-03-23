import React, { ReactElement } from "react";
import { Row, Column } from "react-foundation";
import { useDispatch, useSelector } from "react-redux";
import { FieldArray } from "react-final-form-arrays";
import { Form } from "react-final-form";
import arrayMutators from "final-form-arrays";
import { ActionTypes, AppConsumer } from "@/app/AppContext";
import AddButton from "@/components/form/AddButton";
import Authorization from "@/components/authorization/Authorization";
import Button from "@/components/button/Button";
import ButtonWrapper from "@/components/content/ButtonWrapper";
import FieldAndRemoveButtonWrapper from "@/components/form/FieldAndRemoveButtonWrapper";
import FormField from "@/components/form/final-form/FormField";
import FormText from "@/components/form/FormText";
import FormTextTitle from "@/components/form/FormTextTitle";
import ListItem from "@/components/content/ListItem";
import ListItems from "@/components/content/ListItems";
import RemoveButton from "@/components/form/RemoveButton";
import { patchLeaseInvoiceNotes } from "@/leases/actions";
import {
  ConfirmationModalTexts,
  FieldTypes,
  FormNames,
  Methods,
} from "@/enums";
import { ButtonColors } from "@/components/enums";
import {
  InvoiceNoteFieldPaths,
  InvoiceNoteFieldTitles,
} from "@/invoiceNote/enums";
import {
  formatDate,
  getFieldAttributes,
  isFieldAllowedToRead,
  isMethodAllowed,
} from "@/util/helpers";
import {
  getAttributes as getInvoiceNoteAttributes,
  getMethods as getInvoiceNoteMethods,
} from "@/invoiceNote/selectors";
import { getCurrentLease } from "@/leases/selectors";
import type { Attributes } from "types";
import { getUserActiveServiceUnit } from "@/usersPermissions/selectors";
type ReadOnlyProps = {
  invoiceNotes: Array<Record<string, any>>;
};

const InvoiceNotesReadOnly = ({ invoiceNotes }: ReadOnlyProps) => {
  const invoiceNoteAttributes: Attributes = useSelector(
    getInvoiceNoteAttributes,
  );

  if (!invoiceNotes.length) {
    return <FormText>Ei laskujen tiedotteita</FormText>;
  }

  return (
    <>
      <Row>
        <Column small={3} large={2}>
          <Authorization
            allow={isFieldAllowedToRead(
              invoiceNoteAttributes,
              InvoiceNoteFieldPaths.BILLING_PERIOD_START_DATE,
            )}
          >
            <FormTextTitle>
              {InvoiceNoteFieldTitles.BILLING_PERIOD_START_DATE}
            </FormTextTitle>
          </Authorization>
        </Column>
        <Column small={3} large={2}>
          <Authorization
            allow={isFieldAllowedToRead(
              invoiceNoteAttributes,
              InvoiceNoteFieldPaths.BILLING_PERIOD_END_DATE,
            )}
          >
            <FormTextTitle>
              {InvoiceNoteFieldTitles.BILLING_PERIOD_END_DATE}
            </FormTextTitle>
          </Authorization>
        </Column>
        <Column small={6} large={8}>
          <Authorization
            allow={isFieldAllowedToRead(
              invoiceNoteAttributes,
              InvoiceNoteFieldPaths.NOTES,
            )}
          >
            <FormTextTitle>{InvoiceNoteFieldTitles.NOTES}</FormTextTitle>
          </Authorization>
        </Column>
      </Row>

      <ListItems>
        {invoiceNotes.map((note, index) => (
          <Row key={index}>
            <Column small={3} large={2}>
              <Authorization
                allow={isFieldAllowedToRead(
                  invoiceNoteAttributes,
                  InvoiceNoteFieldPaths.BILLING_PERIOD_START_DATE,
                )}
              >
                <ListItem>
                  {formatDate(note.billing_period_start_date) || "-"}
                </ListItem>
              </Authorization>
            </Column>
            <Column small={3} large={2}>
              <Authorization
                allow={isFieldAllowedToRead(
                  invoiceNoteAttributes,
                  InvoiceNoteFieldPaths.BILLING_PERIOD_END_DATE,
                )}
              >
                <ListItem>
                  {formatDate(note.billing_period_end_date) || "-"}
                </ListItem>
              </Authorization>
            </Column>
            <Column small={6} large={8}>
              <Authorization
                allow={isFieldAllowedToRead(
                  invoiceNoteAttributes,
                  InvoiceNoteFieldPaths.NOTES,
                )}
              >
                <ListItem>{note.notes || "-"}</ListItem>
              </Authorization>
            </Column>
          </Row>
        ))}
      </ListItems>
    </>
  );
};

type EditProps = {
  fields: any;
};

const InvoiceNotesEdit = ({ fields }: EditProps): ReactElement => {
  const invoiceNoteAttributes = useSelector(getInvoiceNoteAttributes);
  const invoiceNoteMethods = useSelector(getInvoiceNoteMethods);

  const handleAdd = () => {
    fields.push({});
  };

  return (
    <AppConsumer>
      {({ dispatch: appDispatch }) => {
        return (
          <>
            {fields && !!fields.length && (
              <Row>
                <Column small={3} large={2}>
                  <Authorization
                    allow={isFieldAllowedToRead(
                      invoiceNoteAttributes,
                      InvoiceNoteFieldPaths.BILLING_PERIOD_START_DATE,
                    )}
                  >
                    <FormTextTitle>
                      {InvoiceNoteFieldTitles.BILLING_PERIOD_START_DATE}
                    </FormTextTitle>
                  </Authorization>
                </Column>
                <Column small={3} large={2}>
                  <Authorization
                    allow={isFieldAllowedToRead(
                      invoiceNoteAttributes,
                      InvoiceNoteFieldPaths.BILLING_PERIOD_END_DATE,
                    )}
                  >
                    <FormTextTitle>
                      {InvoiceNoteFieldTitles.BILLING_PERIOD_END_DATE}
                    </FormTextTitle>
                  </Authorization>
                </Column>
                <Column small={6} large={8}>
                  <Authorization
                    allow={isFieldAllowedToRead(
                      invoiceNoteAttributes,
                      InvoiceNoteFieldPaths.NOTES,
                    )}
                  >
                    <FormTextTitle>
                      {InvoiceNoteFieldTitles.NOTES}
                    </FormTextTitle>
                  </Authorization>
                </Column>
              </Row>
            )}

            {fields.map((note, index) => {
              const handleRemove = () => {
                appDispatch({
                  type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                  confirmationFunction: () => {
                    fields.remove(index);
                  },
                  confirmationModalButtonClassName: ButtonColors.ALERT,
                  confirmationModalButtonText:
                    ConfirmationModalTexts.DELETE_INVOICE_NOTE.BUTTON,
                  confirmationModalLabel:
                    ConfirmationModalTexts.DELETE_INVOICE_NOTE.LABEL,
                  confirmationModalTitle:
                    ConfirmationModalTexts.DELETE_INVOICE_NOTE.TITLE,
                });
              };

              return (
                <Row key={index}>
                  <Column small={3} large={2}>
                    <Authorization
                      allow={isFieldAllowedToRead(
                        invoiceNoteAttributes,
                        InvoiceNoteFieldPaths.BILLING_PERIOD_START_DATE,
                      )}
                    >
                      <FormField
                        fieldAttributes={getFieldAttributes(
                          invoiceNoteAttributes,
                          InvoiceNoteFieldPaths.BILLING_PERIOD_START_DATE,
                        )}
                        name={`${note}.billing_period_start_date`}
                        invisibleLabel
                        overrideValues={{
                          label:
                            InvoiceNoteFieldTitles.BILLING_PERIOD_START_DATE,
                        }}
                      />
                    </Authorization>
                  </Column>
                  <Column small={3} large={2}>
                    <Authorization
                      allow={isFieldAllowedToRead(
                        invoiceNoteAttributes,
                        InvoiceNoteFieldPaths.BILLING_PERIOD_END_DATE,
                      )}
                    >
                      <FormField
                        disableTouched
                        fieldAttributes={getFieldAttributes(
                          invoiceNoteAttributes,
                          InvoiceNoteFieldPaths.BILLING_PERIOD_END_DATE,
                        )}
                        name={`${note}.billing_period_end_date`}
                        invisibleLabel
                        overrideValues={{
                          label: InvoiceNoteFieldTitles.BILLING_PERIOD_END_DATE,
                        }}
                      />
                    </Authorization>
                  </Column>
                  <Column small={6} large={8}>
                    <FieldAndRemoveButtonWrapper
                      field={
                        <Authorization
                          allow={isFieldAllowedToRead(
                            invoiceNoteAttributes,
                            InvoiceNoteFieldPaths.NOTES,
                          )}
                        >
                          <FormField
                            fieldAttributes={getFieldAttributes(
                              invoiceNoteAttributes,
                              InvoiceNoteFieldPaths.NOTES,
                            )}
                            name={`${note}.notes`}
                            invisibleLabel
                            overrideValues={{
                              label: InvoiceNoteFieldTitles.NOTES,
                              fieldType: FieldTypes.TEXTAREA,
                            }}
                          />
                        </Authorization>
                      }
                      removeButton={
                        <Authorization
                          allow={isMethodAllowed(
                            invoiceNoteMethods,
                            Methods.DELETE,
                          )}
                        >
                          <RemoveButton
                            className="third-level"
                            onClick={handleRemove}
                            title="Poista tiedote"
                          />
                        </Authorization>
                      }
                    />
                  </Column>
                </Row>
              );
            })}
            <Authorization
              allow={isMethodAllowed(invoiceNoteMethods, Methods.POST)}
            >
              <Row>
                <Column>
                  <AddButton label="Lisää tiedote" onClick={handleAdd} />
                </Column>
              </Row>
            </Authorization>
          </>
        );
      }}
    </AppConsumer>
  );
};

type Props = {
  invoiceNotes: Array<Record<string, any>>;
};

const InvoiceNotes: React.FC<Props> = ({ invoiceNotes }) => {
  const currentLease = useSelector(getCurrentLease);
  const invoiceNoteMethods = useSelector(getInvoiceNoteMethods);
  const activeServiceUnit = useSelector(getUserActiveServiceUnit);

  const isServiceUnitSameAsActiveServiceUnit = () => {
    return activeServiceUnit?.id === currentLease?.service_unit?.id;
  };

  const dispatch = useDispatch();

  const handleSave = (values: any) => {
    const editedInvoiceNotes = values.invoice_notes || [];
    const invoiceNotes = editedInvoiceNotes.map((note) => ({
      ...note,
      lease: currentLease.id,
    }));
    dispatch(
      patchLeaseInvoiceNotes({
        id: currentLease.id,
        invoice_notes: invoiceNotes,
      }),
    );
  };

  return (
    <Form
      onSubmit={handleSave}
      initialValues={{ invoice_notes: invoiceNotes }}
      mutators={{ ...arrayMutators }}
      subscription={{ valid: true, dirty: true }}
    >
      {({ handleSubmit, valid, dirty, form }) => (
        <form onSubmit={handleSubmit}>
          <Authorization
            allow={
              (isMethodAllowed(invoiceNoteMethods, Methods.GET) &&
                !isMethodAllowed(invoiceNoteMethods, Methods.PATCH)) ||
              !isServiceUnitSameAsActiveServiceUnit()
            }
          >
            <InvoiceNotesReadOnly invoiceNotes={invoiceNotes} />
          </Authorization>
          <Authorization
            allow={
              isMethodAllowed(invoiceNoteMethods, Methods.PATCH) &&
              isServiceUnitSameAsActiveServiceUnit()
            }
          >
            <AppConsumer>
              {({ dispatch: appDispatch }) => {
                const handleCancel = () => {
                  if (dirty) {
                    appDispatch({
                      type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                      confirmationFunction: () => {
                        form.reset();
                      },
                      confirmationModalButtonClassName: ButtonColors.ALERT,
                      confirmationModalButtonText:
                        ConfirmationModalTexts.CANCEL_CHANGES.BUTTON,
                      confirmationModalLabel:
                        ConfirmationModalTexts.CANCEL_CHANGES.LABEL,
                      confirmationModalTitle:
                        ConfirmationModalTexts.CANCEL_CHANGES.TITLE,
                    });
                  } else {
                    form.reset();
                  }
                };

                return (
                  <>
                    <FieldArray name="invoice_notes">
                      {(fieldArrayProps) =>
                        InvoiceNotesEdit({
                          ...fieldArrayProps,
                        })
                      }
                    </FieldArray>

                    <Row>
                      <Column>
                        <ButtonWrapper>
                          <Button
                            className={ButtonColors.SECONDARY}
                            onClick={handleCancel}
                            text="Peruuta"
                          />
                          <Button
                            className={ButtonColors.SUCCESS}
                            disabled={!valid}
                            type="submit"
                            text="Tallenna"
                          />
                        </ButtonWrapper>
                      </Column>
                    </Row>
                  </>
                );
              }}
            </AppConsumer>
          </Authorization>
        </form>
      )}
    </Form>
  );
};

export default InvoiceNotes;
