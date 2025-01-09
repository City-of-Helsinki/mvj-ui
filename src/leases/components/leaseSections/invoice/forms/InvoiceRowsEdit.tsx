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
import FormField from "@/components/form/FormField";
import RemoveButton from "@/components/form/RemoveButton";
import SubTitle from "@/components/content/SubTitle";
import { ConfirmationModalTexts, FormNames } from "@/enums";
import { ButtonColors } from "@/components/enums";
import {
  InvoiceRowsFieldPaths,
  InvoiceRowsFieldTitles,
} from "@/invoices/enums";
import { getUiDataInvoiceKey } from "@/uiData/helpers";
import {
  getFieldAttributes,
  isFieldAllowedToEdit,
  isFieldAllowedToRead,
} from "@/util/helpers";
import { getAttributes as getInvoiceAttributes } from "@/invoices/selectors";
import { getReceivableTypes } from "@/leaseCreateCharge/selectors";
import type { Attributes } from "types";
import {
  receivableTypesFromAttributes,
  receivableTypeFromRows,
} from "@/leaseCreateCharge/helpers";
import Loader from "@/components/loader/Loader";
type Props = {
  fields: any;
  invoiceAttributes: Attributes;
  isEditClicked: boolean;
  relativeTo: any;
  receivableTypes: Record<string, any>;
  rows: any;
  tenantOptions: Array<Record<string, any>>;
};

const InvoiceRowsEdit = ({
  fields,
  invoiceAttributes,
  isEditClicked,
  relativeTo,
  receivableTypes,
  tenantOptions,
  rows,
}: Props): ReactElement => {
  const handleAdd = () => {
    fields.push({});
  };

  const receivableType = receivableTypeFromRows(rows);
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
                                InvoiceRowsFieldPaths.TENANT,
                              )}
                            >
                              <FormField
                                disableTouched={isEditClicked}
                                fieldAttributes={getFieldAttributes(
                                  invoiceAttributes,
                                  InvoiceRowsFieldPaths.TENANT,
                                )}
                                name={`${row}.tenant`}
                                overrideValues={{
                                  label: InvoiceRowsFieldTitles.TENANT,
                                  options: tenantOptions,
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
                              {receivableTypes ? (
                                <FormField
                                  disableTouched={isEditClicked}
                                  fieldAttributes={
                                    receivableType === 2
                                      ? getFieldAttributes(
                                          invoiceAttributes,
                                          InvoiceRowsFieldPaths.RECEIVABLE_TYPE,
                                        )
                                      : receivableTypesFromAttributes(
                                          getFieldAttributes(
                                            invoiceAttributes,
                                            InvoiceRowsFieldPaths.RECEIVABLE_TYPE,
                                          ),
                                          receivableTypes,
                                        )
                                  }
                                  name={`${row}.receivable_type`}
                                  overrideValues={{
                                    label:
                                      InvoiceRowsFieldTitles.RECEIVABLE_TYPE,
                                  }}
                                />
                              ) : (
                                <Loader isLoading={true} />
                              )}
                            </Authorization>
                          </Column>
                          <Column small={4}>
                            <Authorization
                              allow={isFieldAllowedToRead(
                                invoiceAttributes,
                                InvoiceRowsFieldPaths.AMOUNT,
                              )}
                            >
                              <FormField
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
                                InvoiceRowsFieldPaths.BILLING_PERIOD_START_DATE,
                              )}
                            >
                              <FormField
                                disableTouched={isEditClicked}
                                fieldAttributes={getFieldAttributes(
                                  invoiceAttributes,
                                  InvoiceRowsFieldPaths.BILLING_PERIOD_START_DATE,
                                )}
                                name={`${row}.billing_period_start_date`}
                                overrideValues={{
                                  label:
                                    InvoiceRowsFieldTitles.BILLING_PERIOD_START_DATE,
                                }}
                              />
                            </Authorization>
                          </Column>
                          <Column small={4}>
                            <Authorization
                              allow={isFieldAllowedToRead(
                                invoiceAttributes,
                                InvoiceRowsFieldPaths.BILLING_PERIOD_END_DATE,
                              )}
                            >
                              <FormField
                                disableTouched={isEditClicked}
                                fieldAttributes={getFieldAttributes(
                                  invoiceAttributes,
                                  InvoiceRowsFieldPaths.BILLING_PERIOD_END_DATE,
                                )}
                                name={`${row}.billing_period_end_date`}
                                overrideValues={{
                                  label:
                                    InvoiceRowsFieldTitles.BILLING_PERIOD_END_DATE,
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
                              <FormField
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
    receivableTypes: getReceivableTypes(state),
    rows: selector(state, `rows`),
  };
})(InvoiceRowsEdit);
