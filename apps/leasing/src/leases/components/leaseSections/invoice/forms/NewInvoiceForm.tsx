import React, { ReactElement, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Column } from "@/components/grid/Grid";
import { FieldArray } from "react-final-form-arrays";
import { Form } from "react-final-form";
import arrayMutators from "final-form-arrays";
import { ActionTypes, AppConsumer } from "@/app/AppContext";
import AddButtonThird from "@/components/form/AddButtonThird";
import Authorization from "@/components/authorization/Authorization";
import BoxContentWrapper from "@/components/content/BoxContentWrapper";
import Button from "@/components/button/Button";
import CloseButton from "@/components/button/CloseButton";
import FormField from "@/components/form/final-form/FormField";
import FormTextTitle from "@/components/form/FormTextTitle";
import RemoveButton from "@/components/form/RemoveButton";
import SubTitle from "@/components/content/SubTitle";
import WhiteBox from "@/components/content/WhiteBox";
import { receiveIsCreateClicked } from "@/invoices/actions";
import { ConfirmationModalTexts } from "@/enums";
import { ButtonColors } from "@/components/enums";
import {
  InvoiceFieldPaths,
  InvoiceFieldTitles,
  InvoiceRowsFieldPaths,
  InvoiceRowsFieldTitles,
} from "@/invoices/enums";
import {
  LeaseCreateChargeFieldPaths,
  LeaseCreateChargeRowsFieldPaths,
} from "@/leaseCreateCharge/enums";
import { RecipientOptions } from "@/leases/enums";
import { receivableTypesFromAttributes } from "@/leaseCreateCharge/helpers";
import { UsersPermissions } from "@/usersPermissions/enums";
import { isInvoiceBillingPeriodRequired } from "@/invoices/helpers";
import { getInvoiceRecipientOptions } from "@/leases/helpers";
import { getUiDataCreateChargeKey } from "@/uiData/helpers";
import {
  getFieldAttributes,
  hasPermissions,
  isFieldAllowedToEdit,
  isFieldRequired,
} from "@/util/helpers";
import {
  getAttributes as getInvoiceAttributes,
  getIsCreateClicked,
} from "@/invoices/selectors";
import { getCurrentLease } from "@/leases/selectors";
import {
  getAttributes as getLeaseCreateChargeAttributes,
  getReceivableTypes,
} from "@/leaseCreateCharge/selectors";
import { getUsersPermissions } from "@/usersPermissions/selectors";
import type { Attributes } from "types";
import type { Lease } from "@/leases/types";
import Loader from "@/components/loader/Loader";
type InvoiceRowsProps = {
  fields: any;
  useLeaseCreateChargeEndpoint: boolean;
};

const InvoiceRows = ({
  fields,
  useLeaseCreateChargeEndpoint,
}: InvoiceRowsProps): ReactElement => {
  const invoiceAttributes = useSelector(getInvoiceAttributes);
  const isCreateClicked = useSelector(getIsCreateClicked);
  const leaseCreateChargeAttributes = useSelector(
    getLeaseCreateChargeAttributes,
  );
  const receivableTypes = useSelector(getReceivableTypes);

  const handleAdd = () => {
    fields.push({});
  };

  return (
    <AppConsumer>
      {({ dispatch: appDispatch }) => {
        return (
          <>
            <SubTitle
              enableUiDataEdit
              uiDataKey={getUiDataCreateChargeKey(
                LeaseCreateChargeRowsFieldPaths.ROWS,
              )}
            >
              Erittely
            </SubTitle>
            {!!fields && !!fields.length && (
              <>
                <Row>
                  <Column small={3} large={2}>
                    <Authorization
                      allow={
                        useLeaseCreateChargeEndpoint
                          ? isFieldAllowedToEdit(
                              leaseCreateChargeAttributes,
                              LeaseCreateChargeRowsFieldPaths.RECEIVABLE_TYPE,
                            )
                          : isFieldAllowedToEdit(
                              invoiceAttributes,
                              InvoiceRowsFieldPaths.RECEIVABLE_TYPE,
                            )
                      }
                    >
                      <FormTextTitle
                        required={
                          useLeaseCreateChargeEndpoint
                            ? isFieldRequired(
                                leaseCreateChargeAttributes,
                                LeaseCreateChargeRowsFieldPaths.RECEIVABLE_TYPE,
                              )
                            : isFieldRequired(
                                invoiceAttributes,
                                InvoiceRowsFieldPaths.RECEIVABLE_TYPE,
                              )
                        }
                        enableUiDataEdit
                        uiDataKey={getUiDataCreateChargeKey(
                          LeaseCreateChargeRowsFieldPaths.RECEIVABLE_TYPE,
                        )}
                      >
                        {InvoiceRowsFieldTitles.RECEIVABLE_TYPE}
                      </FormTextTitle>
                    </Authorization>
                  </Column>
                  <Column small={3} large={2}>
                    <Authorization
                      allow={
                        useLeaseCreateChargeEndpoint
                          ? isFieldAllowedToEdit(
                              leaseCreateChargeAttributes,
                              LeaseCreateChargeRowsFieldPaths.AMOUNT,
                            )
                          : isFieldAllowedToEdit(
                              invoiceAttributes,
                              InvoiceRowsFieldPaths.AMOUNT,
                            )
                      }
                    >
                      <FormTextTitle
                        required={
                          useLeaseCreateChargeEndpoint
                            ? isFieldRequired(
                                leaseCreateChargeAttributes,
                                LeaseCreateChargeRowsFieldPaths.AMOUNT,
                              )
                            : isFieldRequired(
                                invoiceAttributes,
                                InvoiceRowsFieldPaths.AMOUNT,
                              )
                        }
                        enableUiDataEdit
                        tooltipStyle={{
                          right: 12,
                        }}
                        uiDataKey={getUiDataCreateChargeKey(
                          LeaseCreateChargeRowsFieldPaths.AMOUNT,
                        )}
                      >
                        {InvoiceRowsFieldTitles.AMOUNT}
                      </FormTextTitle>
                    </Authorization>
                  </Column>
                </Row>

                {fields.map((row, index) => {
                  const handleRemove = () => {
                    appDispatch({
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
                    <Row key={index}>
                      <Column small={3} large={2}>
                        <Authorization
                          allow={
                            useLeaseCreateChargeEndpoint
                              ? isFieldAllowedToEdit(
                                  leaseCreateChargeAttributes,
                                  LeaseCreateChargeRowsFieldPaths.RECEIVABLE_TYPE,
                                )
                              : isFieldAllowedToEdit(
                                  invoiceAttributes,
                                  InvoiceRowsFieldPaths.RECEIVABLE_TYPE,
                                )
                          }
                        >
                          {receivableTypes ? (
                            <FormField
                              disableTouched={isCreateClicked}
                              fieldAttributes={
                                useLeaseCreateChargeEndpoint
                                  ? receivableTypesFromAttributes(
                                      getFieldAttributes(
                                        leaseCreateChargeAttributes,
                                        LeaseCreateChargeRowsFieldPaths.RECEIVABLE_TYPE,
                                      ),
                                      receivableTypes,
                                    )
                                  : receivableTypesFromAttributes(
                                      getFieldAttributes(
                                        invoiceAttributes,
                                        InvoiceRowsFieldPaths.RECEIVABLE_TYPE,
                                      ),
                                      receivableTypes,
                                    )
                              }
                              invisibleLabel
                              name={`${row}.receivable_type`}
                              overrideValues={{
                                label: InvoiceRowsFieldTitles.RECEIVABLE_TYPE,
                              }}
                            />
                          ) : (
                            <Loader isLoading={true} />
                          )}
                        </Authorization>
                      </Column>
                      <Column small={2} large={2}>
                        <Authorization
                          allow={
                            useLeaseCreateChargeEndpoint
                              ? isFieldAllowedToEdit(
                                  leaseCreateChargeAttributes,
                                  LeaseCreateChargeRowsFieldPaths.AMOUNT,
                                )
                              : isFieldAllowedToEdit(
                                  invoiceAttributes,
                                  InvoiceRowsFieldPaths.AMOUNT,
                                )
                          }
                        >
                          <FormField
                            disableTouched={isCreateClicked}
                            fieldAttributes={
                              useLeaseCreateChargeEndpoint
                                ? getFieldAttributes(
                                    leaseCreateChargeAttributes,
                                    LeaseCreateChargeRowsFieldPaths.AMOUNT,
                                  )
                                : getFieldAttributes(
                                    invoiceAttributes,
                                    InvoiceRowsFieldPaths.AMOUNT,
                                  )
                            }
                            invisibleLabel
                            name={`${row}.amount`}
                            unit="€"
                            overrideValues={{
                              label: InvoiceRowsFieldTitles.AMOUNT,
                            }}
                          />
                        </Authorization>
                      </Column>

                      <Authorization
                        allow={
                          useLeaseCreateChargeEndpoint
                            ? isFieldAllowedToEdit(
                                leaseCreateChargeAttributes,
                                LeaseCreateChargeRowsFieldPaths.ROWS,
                              )
                            : isFieldAllowedToEdit(
                                invoiceAttributes,
                                InvoiceRowsFieldPaths.ROWS,
                              )
                        }
                      >
                        <Column small={1} large={2}>
                          {fields.length > 1 && (
                            <RemoveButton
                              className="third-level"
                              onClick={handleRemove}
                              title="Poista rivi"
                            />
                          )}
                        </Column>
                      </Authorization>
                    </Row>
                  );
                })}
              </>
            )}

            <Authorization
              allow={
                useLeaseCreateChargeEndpoint
                  ? isFieldAllowedToEdit(
                      leaseCreateChargeAttributes,
                      LeaseCreateChargeRowsFieldPaths.ROWS,
                    )
                  : isFieldAllowedToEdit(
                      invoiceAttributes,
                      InvoiceRowsFieldPaths.ROWS,
                    )
              }
            >
              <Row>
                <Column>
                  <AddButtonThird label="Lisää rivi" onClick={handleAdd} />
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
  onClose: (...args: Array<any>) => any;
  onSave: (...args: Array<any>) => any;
  setRefForFirstField?: (...args: Array<any>) => any;
};

const NewInvoiceForm = ({ onClose, onSave, setRefForFirstField }: Props) => {
  const invoiceAttributes: Attributes = useSelector(getInvoiceAttributes);
  const isCreateClicked = useSelector(getIsCreateClicked);
  const lease: Lease = useSelector(getCurrentLease);
  const leaseCreateChargeAttributes: Attributes = useSelector(
    getLeaseCreateChargeAttributes,
  );
  const usersPermissions = useSelector(getUsersPermissions);
  const dispatch = useDispatch();

  const initialValues = useMemo(
    () => ({
      recipient: hasPermissions(usersPermissions, UsersPermissions.ADD_INVOICE)
        ? RecipientOptions.ALL
        : undefined,
      rows: [{}],
    }),
    [usersPermissions],
  );

  const handleSave = (values: any) => {
    dispatch(receiveIsCreateClicked(true));
    onSave(values);
  };

  const recipientOptions = getInvoiceRecipientOptions(
    lease,
    hasPermissions(usersPermissions, UsersPermissions.ADD_INVOICE),
    hasPermissions(usersPermissions, UsersPermissions.ADD_INVOICE),
  );

  return (
    <Form
      onSubmit={handleSave}
      mutators={{ ...arrayMutators }}
      initialValues={initialValues}
      subscription={{ valid: true, values: true }}
    >
      {({ handleSubmit, valid, values }) => {
        const tenant = values.tenant;
        const rows = values.rows;
        const useLeaseCreateChargeEndpoint = tenant === RecipientOptions.ALL;
        const billingPeriodRequired = isInvoiceBillingPeriodRequired(rows);

        return (
          <form onSubmit={handleSubmit} className="invoice__new-invoice_form">
            <WhiteBox>
              <BoxContentWrapper>
                <h3>Luo lasku</h3>
                <CloseButton className="position-topright" onClick={onClose} />

                <Row>
                  <Column small={6} medium={4} large={2}>
                    <Authorization
                      allow={isFieldAllowedToEdit(
                        invoiceAttributes,
                        InvoiceFieldPaths.RECIPIENT,
                      )}
                    >
                      <FormField
                        disableTouched={isCreateClicked}
                        fieldAttributes={getFieldAttributes(
                          invoiceAttributes,
                          InvoiceFieldPaths.RECIPIENT,
                        )}
                        name="tenant"
                        setRefForField={setRefForFirstField}
                        overrideValues={{
                          label: "Vuokralainen",
                          options: recipientOptions,
                        }}
                        enableUiDataEdit
                        uiDataKey={getUiDataCreateChargeKey(
                          InvoiceFieldPaths.RECIPIENT,
                        )}
                      />
                    </Authorization>
                  </Column>
                  <Column small={6} medium={4} large={2}>
                    <Authorization
                      allow={
                        useLeaseCreateChargeEndpoint
                          ? isFieldAllowedToEdit(
                              leaseCreateChargeAttributes,
                              LeaseCreateChargeFieldPaths.DUE_DATE,
                            )
                          : isFieldAllowedToEdit(
                              invoiceAttributes,
                              InvoiceFieldPaths.DUE_DATE,
                            )
                      }
                    >
                      <FormField
                        disableTouched={isCreateClicked}
                        fieldAttributes={
                          useLeaseCreateChargeEndpoint
                            ? getFieldAttributes(
                                leaseCreateChargeAttributes,
                                LeaseCreateChargeFieldPaths.DUE_DATE,
                              )
                            : getFieldAttributes(
                                invoiceAttributes,
                                InvoiceFieldPaths.DUE_DATE,
                              )
                        }
                        name="due_date"
                        overrideValues={{
                          label: InvoiceFieldTitles.DUE_DATE,
                        }}
                        enableUiDataEdit
                        uiDataKey={getUiDataCreateChargeKey(
                          LeaseCreateChargeFieldPaths.DUE_DATE,
                        )}
                      />
                    </Authorization>
                  </Column>
                  <Column small={6} medium={4} large={2}>
                    <Authorization
                      allow={
                        useLeaseCreateChargeEndpoint
                          ? isFieldAllowedToEdit(
                              leaseCreateChargeAttributes,
                              LeaseCreateChargeFieldPaths.BILLING_PERIOD_START_DATE,
                            )
                          : isFieldAllowedToEdit(
                              invoiceAttributes,
                              InvoiceFieldPaths.BILLING_PERIOD_START_DATE,
                            )
                      }
                    >
                      <>
                        <FormTextTitle
                          required={billingPeriodRequired}
                          enableUiDataEdit
                          uiDataKey={getUiDataCreateChargeKey(
                            LeaseCreateChargeFieldPaths.BILLING_PERIOD_START_DATE,
                          )}
                        >
                          {InvoiceFieldTitles.BILLING_PERIOD_START_DATE}
                        </FormTextTitle>
                        <FormField
                          disableTouched={isCreateClicked}
                          fieldAttributes={
                            useLeaseCreateChargeEndpoint
                              ? getFieldAttributes(
                                  leaseCreateChargeAttributes,
                                  LeaseCreateChargeFieldPaths.BILLING_PERIOD_START_DATE,
                                )
                              : getFieldAttributes(
                                  invoiceAttributes,
                                  InvoiceFieldPaths.BILLING_PERIOD_START_DATE,
                                )
                          }
                          name="billing_period_start_date"
                          invisibleLabel
                          overrideValues={{
                            label: InvoiceFieldTitles.BILLING_PERIOD_START_DATE,
                          }}
                        />
                      </>
                    </Authorization>
                  </Column>
                  <Column small={6} medium={4} large={2}>
                    <Authorization
                      allow={
                        useLeaseCreateChargeEndpoint
                          ? isFieldAllowedToEdit(
                              leaseCreateChargeAttributes,
                              LeaseCreateChargeFieldPaths.BILLING_PERIOD_END_DATE,
                            )
                          : isFieldAllowedToEdit(
                              invoiceAttributes,
                              InvoiceFieldPaths.BILLING_PERIOD_END_DATE,
                            )
                      }
                    >
                      <>
                        <FormTextTitle
                          required={billingPeriodRequired}
                          enableUiDataEdit
                          uiDataKey={getUiDataCreateChargeKey(
                            LeaseCreateChargeFieldPaths.BILLING_PERIOD_END_DATE,
                          )}
                        >
                          {InvoiceFieldTitles.BILLING_PERIOD_END_DATE}
                        </FormTextTitle>
                        <FormField
                          disableTouched={isCreateClicked}
                          fieldAttributes={
                            useLeaseCreateChargeEndpoint
                              ? getFieldAttributes(
                                  leaseCreateChargeAttributes,
                                  LeaseCreateChargeFieldPaths.BILLING_PERIOD_END_DATE,
                                )
                              : getFieldAttributes(
                                  invoiceAttributes,
                                  InvoiceFieldPaths.BILLING_PERIOD_END_DATE,
                                )
                          }
                          name="billing_period_end_date"
                          invisibleLabel
                          overrideValues={{
                            label: InvoiceFieldTitles.BILLING_PERIOD_END_DATE,
                          }}
                        />
                      </>
                    </Authorization>
                  </Column>
                </Row>
                <Row>
                  <Column>
                    <Authorization
                      allow={
                        useLeaseCreateChargeEndpoint
                          ? isFieldAllowedToEdit(
                              leaseCreateChargeAttributes,
                              LeaseCreateChargeFieldPaths.NOTES,
                            )
                          : isFieldAllowedToEdit(
                              invoiceAttributes,
                              InvoiceFieldPaths.NOTES,
                            )
                      }
                    >
                      <FormField
                        disableTouched={isCreateClicked}
                        fieldAttributes={
                          tenant === RecipientOptions.ALL
                            ? getFieldAttributes(
                                leaseCreateChargeAttributes,
                                LeaseCreateChargeFieldPaths.NOTES,
                              )
                            : getFieldAttributes(
                                invoiceAttributes,
                                InvoiceFieldPaths.NOTES,
                              )
                        }
                        name="notes"
                        overrideValues={{
                          label: InvoiceFieldTitles.NOTES,
                        }}
                        enableUiDataEdit
                        uiDataKey={getUiDataCreateChargeKey(
                          LeaseCreateChargeFieldPaths.NOTES,
                        )}
                      />
                    </Authorization>
                  </Column>
                </Row>

                <Authorization
                  allow={
                    useLeaseCreateChargeEndpoint
                      ? isFieldAllowedToEdit(
                          leaseCreateChargeAttributes,
                          LeaseCreateChargeRowsFieldPaths.ROWS,
                        )
                      : isFieldAllowedToEdit(
                          invoiceAttributes,
                          InvoiceRowsFieldPaths.ROWS,
                        )
                  }
                >
                  <FieldArray name="rows">
                    {(fieldArrayProps) =>
                      InvoiceRows({
                        ...fieldArrayProps,
                        useLeaseCreateChargeEndpoint,
                      })
                    }
                  </FieldArray>
                </Authorization>

                <Row>
                  <Column>
                    <div className="button-wrapper">
                      <Button
                        className={ButtonColors.SECONDARY}
                        onClick={onClose}
                        text="Peruuta"
                      />
                      <Button
                        className={ButtonColors.SUCCESS}
                        disabled={isCreateClicked || !valid}
                        type="submit"
                        text="Tallenna"
                      />
                    </div>
                  </Column>
                </Row>
              </BoxContentWrapper>
            </WhiteBox>
          </form>
        );
      }}
    </Form>
  );
};

export default NewInvoiceForm;
