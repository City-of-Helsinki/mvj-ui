import React, { Fragment, ReactElement } from "react";
import { connect } from "react-redux";
import { Row, Column } from "react-foundation";
import { formValueSelector } from "redux-form";
import { ActionTypes, AppConsumer } from "@/app/AppContext";
import ActionButtonWrapper from "@/components/form/ActionButtonWrapper";
import AddButtonThird from "@/components/form/AddButtonThird";
import Authorization from "@/components/authorization/Authorization";
import BoxItem from "@/components/content/BoxItem";
import BoxItemContainer from "@/components/content/BoxItemContainer";
import FormFieldLegacy from "@/components/form/FormFieldLegacy";
import RemoveButton from "@/components/form/RemoveButton";
import SubTitle from "@/components/content/SubTitle";
import { ConfirmationModalTexts, FormNames } from "@/enums";
import { ButtonColors } from "@/components/enums";
import {
  InvoiceRowsFieldPaths,
  InvoiceRowsFieldTitles,
} from "@/landUseInvoices/enums";
import { getUiDataInvoiceKey } from "@/uiData/helpers";
import {
  getFieldAttributes,
  isFieldAllowedToEdit,
  isFieldAllowedToRead,
} from "@/util/helpers";
import { getAttributes as getInvoiceAttributes } from "@/landUseInvoices/selectors";
import type { Attributes } from "types";
type Props = {
  fields: any;
  invoiceAttributes: Attributes;
  isEditClicked: boolean;
  relativeTo: any;
  receivableTypes: Record<string, any>;
  rows: Record<string, any>;
  litigantOptions: Array<Record<string, any>>;
};

const InvoiceRowsEdit = ({
  fields,
  invoiceAttributes,
  isEditClicked,
  relativeTo,
  litigantOptions,
  /* , rows */
}: Props): ReactElement => {
  const handleAdd = () => {
    fields.push({});
  };

  return (
    <AppConsumer>
      {({ dispatch }) => {
        return (
          <Fragment>
            <SubTitle
              enableUiDataEdit
              relativeTo={relativeTo}
              uiDataKey={getUiDataInvoiceKey(InvoiceRowsFieldPaths.ROWS)}
            >
              {InvoiceRowsFieldTitles.ROWS}
            </SubTitle>
            {!!fields && !!fields.length && (
              <Fragment>
                <BoxItemContainer>
                  {fields.map((row, index) => {
                    const handleRemove = () => {
                      dispatch({
                        type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                        confirmationFunction: () => {
                          fields.remove(index);
                        },
                        confirmationModalButtonClassName: ButtonColors.ALERT,
                        confirmationModalButtonText:
                          ConfirmationModalTexts.DELETE_INVOICE_ROW.BUTTON,
                        confirmationModalLabel:
                          ConfirmationModalTexts.DELETE_INVOICE_ROW.LABEL,
                        confirmationModalTitle:
                          ConfirmationModalTexts.DELETE_INVOICE_ROW.TITLE,
                      });
                    };

                    return (
                      <BoxItem key={index}>
                        <ActionButtonWrapper>
                          <Authorization
                            allow={isFieldAllowedToEdit(
                              invoiceAttributes,
                              InvoiceRowsFieldPaths.ROWS,
                            )}
                          >
                            <RemoveButton
                              onClick={handleRemove}
                              title="Poista rivi"
                            />
                          </Authorization>
                        </ActionButtonWrapper>
                        <Row key={index}>
                          <Column small={4}>
                            <Authorization
                              allow={isFieldAllowedToRead(
                                invoiceAttributes,
                                InvoiceRowsFieldPaths.LITIGANT,
                              )}
                            >
                              <FormFieldLegacy
                                disableTouched={isEditClicked}
                                fieldAttributes={getFieldAttributes(
                                  invoiceAttributes,
                                  InvoiceRowsFieldPaths.LITIGANT,
                                )}
                                name={`${row}.litigant`}
                                overrideValues={{
                                  label: InvoiceRowsFieldTitles.LITIGANT,
                                  options: litigantOptions,
                                }}
                              />
                            </Authorization>
                          </Column>
                          <Column small={4}>
                            <Authorization
                              allow={isFieldAllowedToRead(
                                invoiceAttributes,
                                InvoiceRowsFieldPaths.RECEIVABLE_TYPE,
                              )}
                            >
                              <FormFieldLegacy
                                disableTouched={isEditClicked}
                                fieldAttributes={getFieldAttributes(
                                  invoiceAttributes,
                                  InvoiceRowsFieldPaths.RECEIVABLE_TYPE,
                                )}
                                name={`${row}.receivable_type`}
                                overrideValues={{
                                  label: InvoiceRowsFieldTitles.RECEIVABLE_TYPE,
                                }}
                              />
                            </Authorization>
                          </Column>
                          <Column small={4}>
                            <Authorization
                              allow={isFieldAllowedToRead(
                                invoiceAttributes,
                                InvoiceRowsFieldPaths.AMOUNT,
                              )}
                            >
                              <FormFieldLegacy
                                disableTouched={isEditClicked}
                                fieldAttributes={getFieldAttributes(
                                  invoiceAttributes,
                                  InvoiceRowsFieldPaths.AMOUNT,
                                )}
                                name={`${row}.amount`}
                                unit="€"
                                overrideValues={{
                                  label: InvoiceRowsFieldTitles.AMOUNT,
                                }}
                              />
                            </Authorization>
                          </Column>
                          <Column small={4}>
                            <Authorization
                              allow={isFieldAllowedToRead(
                                invoiceAttributes,
                                InvoiceRowsFieldPaths.COMPENSATION_AMOUNT,
                              )}
                            >
                              <FormFieldLegacy
                                disableTouched={isEditClicked}
                                fieldAttributes={getFieldAttributes(
                                  invoiceAttributes,
                                  InvoiceRowsFieldPaths.COMPENSATION_AMOUNT,
                                )}
                                name={`${row}.compensation_amount`}
                                overrideValues={{
                                  label:
                                    InvoiceRowsFieldTitles.COMPENSATION_AMOUNT,
                                }}
                              />
                            </Authorization>
                          </Column>
                          <Column small={4}>
                            <Authorization
                              allow={isFieldAllowedToRead(
                                invoiceAttributes,
                                InvoiceRowsFieldPaths.INCREASE_PERCENTAGE,
                              )}
                            >
                              <FormFieldLegacy
                                disableTouched={isEditClicked}
                                fieldAttributes={getFieldAttributes(
                                  invoiceAttributes,
                                  InvoiceRowsFieldPaths.INCREASE_PERCENTAGE,
                                )}
                                name={`${row}.increase_percentage`}
                                overrideValues={{
                                  label:
                                    InvoiceRowsFieldTitles.INCREASE_PERCENTAGE,
                                }}
                              />
                            </Authorization>
                          </Column>
                          <Column small={4}>
                            <Authorization
                              allow={isFieldAllowedToRead(
                                invoiceAttributes,
                                InvoiceRowsFieldPaths.SIGN_DATE,
                              )}
                            >
                              <FormFieldLegacy
                                disableTouched={isEditClicked}
                                fieldAttributes={getFieldAttributes(
                                  invoiceAttributes,
                                  InvoiceRowsFieldPaths.SIGN_DATE,
                                )}
                                name={`${row}.sign_date`}
                                overrideValues={{
                                  label: InvoiceRowsFieldTitles.SIGN_DATE,
                                }}
                              />
                            </Authorization>
                          </Column>
                          <Column small={4}>
                            <Authorization
                              allow={isFieldAllowedToRead(
                                invoiceAttributes,
                                InvoiceRowsFieldPaths.PLAN_LAWFULNESS_DATE,
                              )}
                            >
                              <FormFieldLegacy
                                disableTouched={isEditClicked}
                                fieldAttributes={getFieldAttributes(
                                  invoiceAttributes,
                                  InvoiceRowsFieldPaths.PLAN_LAWFULNESS_DATE,
                                )}
                                name={`${row}.plan_lawfulness_date`}
                                overrideValues={{
                                  label:
                                    InvoiceRowsFieldTitles.PLAN_LAWFULNESS_DATE,
                                }}
                              />
                            </Authorization>
                          </Column>
                          <Column small={4}>
                            <Authorization
                              allow={isFieldAllowedToRead(
                                invoiceAttributes,
                                InvoiceRowsFieldPaths.DESCRIPTION,
                              )}
                            >
                              <FormFieldLegacy
                                disableTouched={isEditClicked}
                                fieldAttributes={getFieldAttributes(
                                  invoiceAttributes,
                                  InvoiceRowsFieldPaths.DESCRIPTION,
                                )}
                                name={`${row}.description`}
                                overrideValues={{
                                  label: InvoiceRowsFieldTitles.DESCRIPTION,
                                }}
                              />
                            </Authorization>
                          </Column>
                        </Row>
                      </BoxItem>
                    );
                  })}
                </BoxItemContainer>
              </Fragment>
            )}

            <Authorization
              allow={isFieldAllowedToEdit(
                invoiceAttributes,
                InvoiceRowsFieldPaths.ROWS,
              )}
            >
              <Row>
                <Column>
                  <AddButtonThird label="Lisää rivi" onClick={handleAdd} />
                </Column>
              </Row>
            </Authorization>
          </Fragment>
        );
      }}
    </AppConsumer>
  );
};

const selector = formValueSelector(FormNames.LEASE_INVOICE_EDIT);
export default connect((state) => {
  return {
    invoiceAttributes: getInvoiceAttributes(state),
    rows: selector(state, `rows`),
  };
})(InvoiceRowsEdit);
