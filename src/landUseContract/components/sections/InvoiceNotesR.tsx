import React, { Fragment, PureComponent, ReactElement } from "react";
import { Row, Column } from "react-foundation";
import { connect } from "react-redux";
import { FieldArray, formValueSelector, reduxForm } from "redux-form";
import flowRight from "lodash/flowRight";
import { ActionTypes, AppConsumer } from "@/app/AppContext";
import AddButton from "@/components/form/AddButton";
import Authorization from "@/components/authorization/Authorization";
import Button from "@/components/button/Button";
import ButtonWrapper from "@/components/content/ButtonWrapper";
import FieldAndRemoveButtonWrapper from "@/components/form/FieldAndRemoveButtonWrapper";
import FormFieldLegacy from "@/components/form/FormFieldLegacy";
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
import type { Attributes, Methods as MethodsType } from "types";
import type { Lease } from "@/leases/types";
type ReadOnlyProps = {
  invoiceNoteAttributes: Attributes;
  invoiceNotes: Array<Record<string, any>>;
};

const InvoiceNotesReadOnly = ({
  invoiceNoteAttributes,
  invoiceNotes,
}: ReadOnlyProps) => {
  if (!invoiceNotes.length) {
    return <FormText>Ei laskujen tiedotteita</FormText>;
  }

  return (
    <Fragment>
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
    </Fragment>
  );
};

type EditProps = {
  fields: any;
  invoiceNoteAttributes: Attributes;
  invoiceNoteMethods: MethodsType;
};

const InvoiceNotesEdit = ({
  fields,
  invoiceNoteAttributes,
  invoiceNoteMethods,
}: EditProps): ReactElement => {
  const handleAdd = () => {
    fields.push({});
  };

  return (
    <AppConsumer>
      {({ dispatch }) => {
        return (
          <Fragment>
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
                dispatch({
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
                      <FormFieldLegacy
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
                      <FormFieldLegacy
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
                          <FormFieldLegacy
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
          </Fragment>
        );
      }}
    </AppConsumer>
  );
};

type Props = {
  currentLease: Lease;
  dirty: boolean;
  editedInvoiceNotes: Array<Record<string, any>>;
  invoiceNoteAttributes: Attributes;
  invoiceNoteMethods: MethodsType;
  invoiceNotes: Array<Record<string, any>>;
  patchLeaseInvoiceNotes: (...args: Array<any>) => any;
  reset: (...args: Array<any>) => any;
  valid: boolean;
};

class InvoiceNotes extends PureComponent<Props> {
  handleCancel = () => {
    const { reset } = this.props;
    reset();
  };
  handleSave = () => {
    const { currentLease, editedInvoiceNotes, patchLeaseInvoiceNotes } =
      this.props;
    const invoiceNotes = editedInvoiceNotes.map((note) => ({
      ...note,
      lease: currentLease.id,
    }));
    patchLeaseInvoiceNotes({
      id: currentLease.id,
      invoice_notes: invoiceNotes,
    });
  };

  render() {
    const {
      dirty,
      invoiceNoteAttributes,
      invoiceNoteMethods,
      invoiceNotes,
      valid,
    } = this.props;
    return (
      <form>
        <Authorization
          allow={
            isMethodAllowed(invoiceNoteMethods, Methods.GET) &&
            !isMethodAllowed(invoiceNoteMethods, Methods.PATCH)
          }
        >
          <InvoiceNotesReadOnly
            invoiceNoteAttributes={invoiceNoteAttributes}
            invoiceNotes={invoiceNotes}
          />
        </Authorization>
        <Authorization
          allow={isMethodAllowed(invoiceNoteMethods, Methods.PATCH)}
        >
          <AppConsumer>
            {({ dispatch }) => {
              const handleCancel = () => {
                if (dirty) {
                  dispatch({
                    type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                    confirmationFunction: () => {
                      this.handleCancel();
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
                  this.handleCancel();
                }
              };

              return (
                <Fragment>
                  <FieldArray
                    invoiceNoteAttributes={invoiceNoteAttributes}
                    invoiceNoteMethods={invoiceNoteMethods}
                    component={InvoiceNotesEdit}
                    name="invoice_notes"
                  />

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
                          onClick={this.handleSave}
                          text="Tallenna"
                        />
                      </ButtonWrapper>
                    </Column>
                  </Row>
                </Fragment>
              );
            }}
          </AppConsumer>
        </Authorization>
      </form>
    );
  }
}

const formName = FormNames.LEASE_INVOICE_NOTES;
const selector = formValueSelector(formName);
export default flowRight(
  connect(
    (state) => {
      return {
        currentLease: getCurrentLease(state),
        editedInvoiceNotes: selector(state, "invoice_notes"),
        invoiceNoteAttributes: getInvoiceNoteAttributes(state),
        invoiceNoteMethods: getInvoiceNoteMethods(state),
      };
    },
    {
      patchLeaseInvoiceNotes,
    },
  ),
  reduxForm({
    form: formName,
    enableReinitialize: true,
  }),
)(InvoiceNotes);
